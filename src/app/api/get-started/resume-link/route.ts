import { NextRequest, NextResponse } from "next/server";
import {
  getDraftFromSession,
  issueResumeToken,
  resumeTokenRecentlyIssued,
} from "@/lib/get-started/session";
import { sendResumeLink } from "@/lib/notify";
import { getSiteUrl } from "@/lib/site-url";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_MS = 60_000;

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function logError(event: string, data: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

interface Body {
  email?: unknown;
  company?: unknown; // honeypot
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const honeypot = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  // Pretend success for bots without doing anything else.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return badRequest("Please enter a valid email address.");
  }

  const draft = await getDraftFromSession();
  if (!draft) {
    return badRequest("Start the questionnaire before requesting a resume link.");
  }
  if (draft.submitted_at) {
    return NextResponse.json({ ok: true });
  }

  try {
    if (await resumeTokenRecentlyIssued(draft.id, RESEND_COOLDOWN_MS)) {
      return NextResponse.json({ ok: true });
    }

    const rawToken = await issueResumeToken(draft.id);
    const resumeUrl = `${getSiteUrl()}/api/get-started/resume?token=${encodeURIComponent(rawToken)}`;
    await sendResumeLink(email, resumeUrl);
    return NextResponse.json({ ok: true });
  } catch (err) {
    logError("get_started_resume_link_failed", { message: String(err) });
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your link. Please try again." },
      { status: 500 }
    );
  }
}
