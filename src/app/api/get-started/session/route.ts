import { NextRequest, NextResponse } from "next/server";
import {
  createDraft,
  getDraftFromSession,
  saveDraftStep,
  setSessionCookie,
} from "@/lib/get-started/session";
import { SECTION_IDS, type SectionId } from "@/data/intakeFields";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

function logError(event: string, data: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

export async function GET() {
  try {
    const draft = await getDraftFromSession();
    if (!draft) return NextResponse.json({ ok: true, draft: null });
    return NextResponse.json({
      ok: true,
      draft: {
        data: draft.data,
        currentStep: draft.current_step,
        submittedAt: draft.submitted_at,
      },
    });
  } catch (err) {
    logError("get_started_session_read_failed", { message: String(err) });
    return NextResponse.json(
      { ok: false, error: "Something went wrong loading your progress." },
      { status: 500 }
    );
  }
}

/** Creates a new draft. Requires explicit consent - no row exists before this call. */
export async function POST(req: NextRequest) {
  let body: { consent?: unknown };
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  if (body.consent !== true) {
    return badRequest("Consent is required before we can save your progress.");
  }

  try {
    const existing = await getDraftFromSession();
    if (existing) {
      return NextResponse.json({
        ok: true,
        draft: {
          data: existing.data,
          currentStep: existing.current_step,
          submittedAt: existing.submitted_at,
        },
      });
    }

    const { draftId, sessionToken } = await createDraft();
    await setSessionCookie(sessionToken);
    log("get_started_draft_created", { draftId });
    return NextResponse.json({ ok: true, draft: { data: {}, currentStep: "welcome", submittedAt: null } });
  } catch (err) {
    logError("get_started_draft_create_failed", { message: String(err) });
    return NextResponse.json(
      { ok: false, error: "Something went wrong starting your questionnaire. Please try again." },
      { status: 500 }
    );
  }
}

/** Autosaves the current step's answers against the existing draft. */
export async function PATCH(req: NextRequest) {
  let body: { step?: unknown; data?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const step = typeof body.step === "string" ? body.step : "";
  if (!SECTION_IDS.includes(step as SectionId)) {
    return badRequest("Unknown step.");
  }
  const data =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? (body.data as Record<string, unknown>)
      : {};
  const email =
    typeof body.email === "string" && EMAIL_RE.test(body.email.trim())
      ? body.email.trim()
      : undefined;

  try {
    const draft = await getDraftFromSession();
    if (!draft) {
      return NextResponse.json(
        { ok: false, error: "Your session has expired. Please refresh and start again." },
        { status: 401 }
      );
    }
    if (draft.submitted_at) {
      return NextResponse.json({ ok: true });
    }
    await saveDraftStep(draft.id, step as SectionId, data, email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    logError("get_started_autosave_failed", { message: String(err) });
    return NextResponse.json(
      { ok: false, error: "Your progress couldn't be saved just now." },
      { status: 500 }
    );
  }
}
