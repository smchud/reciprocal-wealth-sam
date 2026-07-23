import { NextRequest, NextResponse } from "next/server";
import { syncContact } from "@/lib/wealthbox";
import { notifyFounders } from "@/lib/notify";

// Minimum time (ms) between the form rendering and a submission being
// accepted as human. Bots that fill and submit instantly get caught here.
const MIN_SUBMIT_MS = 1500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN = 200;
const MAX_MESSAGE_LEN = 5000;
const MAX_PHONE_LEN = 40;

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  company?: unknown; // honeypot - real visitors never fill this in
  renderedAt?: unknown; // timestamp (ms) from when the form mounted
}

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

function logError(event: string, data: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  let body: ContactRequestBody;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const honeypot = typeof body.company === "string" ? body.company.trim() : "";
  const renderedAt = typeof body.renderedAt === "number" ? body.renderedAt : null;

  // --- Spam checks: pretend success, do nothing else. Never tip bots off. ---
  if (honeypot) {
    log("contact_spam_rejected", { reason: "honeypot" });
    return NextResponse.json({ ok: true });
  }
  if (renderedAt === null || Date.now() - renderedAt < MIN_SUBMIT_MS) {
    log("contact_spam_rejected", { reason: "timing" });
    return NextResponse.json({ ok: true });
  }

  // --- Validation ---
  if (!name || name.length > MAX_NAME_LEN) {
    return badRequest("Please enter your name.");
  }
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return badRequest("Please enter a valid email address.");
  }
  if (phone.length > MAX_PHONE_LEN) {
    return badRequest("Please enter a valid phone number.");
  }
  if (!message || message.length > MAX_MESSAGE_LEN) {
    return badRequest("Please enter a message.");
  }

  const submission = { name, email, phone: phone || undefined, message };

  // Wealthbox sync is best-effort: log and continue. The visitor's message
  // still gets through via email even if CRM sync fails.
  const wealthbox = await syncContact(submission).catch((err) => {
    logError("contact_wealthbox_failed", { message: String(err), email });
    return null;
  });

  try {
    await notifyFounders(submission);
  } catch (err) {
    logError("contact_email_failed", { message: String(err), email });
    // Both the CRM sync and the email failed - the message may not have
    // reached anyone. Be honest with the visitor rather than claim success.
    if (!wealthbox) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Something went wrong sending your message. Please email us directly at sam@reciprocalwealth.com or jake@reciprocalwealth.com.",
        },
        { status: 502 }
      );
    }
    // Email failed but the CRM record exists - the team will still see the
    // inquiry when they next check Wealthbox, so this is still a success
    // from the visitor's perspective.
  }

  log("contact_submitted", { email, wealthboxCreated: wealthbox?.created ?? null });
  return NextResponse.json({ ok: true });
}
