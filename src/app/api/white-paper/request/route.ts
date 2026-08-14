import { NextRequest, NextResponse } from "next/server";
import { createWhitePaperRequest, whitePaperRecentlyRequested } from "@/lib/white-paper";
import { sendWhitePaperEmail } from "@/lib/notify";
import { getSiteUrl } from "@/lib/site-url";
import { reportError } from "@/lib/observability";

// Minimum time (ms) between the form rendering and a submission being
// accepted as human - same bot check as the contact form.
const MIN_SUBMIT_MS = 1500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_MS = 60_000;

interface Body {
  email?: unknown;
  company?: unknown; // honeypot - real visitors never fill this in
  renderedAt?: unknown; // timestamp (ms) from when the form mounted
}

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const honeypot = typeof body.company === "string" ? body.company.trim() : "";
  const renderedAt = typeof body.renderedAt === "number" ? body.renderedAt : null;

  // --- Spam checks: pretend success, do nothing else. Never tip bots off. ---
  if (honeypot) {
    log("white_paper_spam_rejected", { reason: "honeypot" });
    return NextResponse.json({ ok: true });
  }
  if (renderedAt === null || Date.now() - renderedAt < MIN_SUBMIT_MS) {
    log("white_paper_spam_rejected", { reason: "timing" });
    return NextResponse.json({ ok: true });
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return badRequest("Please enter a valid email address.");
  }

  try {
    // Swallow rapid duplicates so re-clicking Submit can't spam an inbox.
    if (await whitePaperRecentlyRequested(email, RESEND_COOLDOWN_MS)) {
      return NextResponse.json({ ok: true });
    }

    const rawToken = await createWhitePaperRequest(email);
    const downloadUrl = `${getSiteUrl()}/api/white-paper/download?token=${encodeURIComponent(rawToken)}`;

    // Test-only escape hatch so Playwright can exercise real token issuance
    // and redemption without depending on Resend delivery. Never set this
    // env var outside a local/CI test run.
    const e2eExposeToken = process.env.RW_E2E_EXPOSE_WP_TOKEN === "1";
    if (!e2eExposeToken) {
      await sendWhitePaperEmail(email, downloadUrl);
    }

    log("white_paper_requested", { email });
    return NextResponse.json({ ok: true, ...(e2eExposeToken ? { token: rawToken } : {}) });
  } catch (err) {
    reportError("white_paper_request_failed", { message: String(err), email }, err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your email. Please try again." },
      { status: 500 }
    );
  }
}
