import { NextResponse } from "next/server";
import { getDraftFromSession, markDraftSubmitted } from "@/lib/get-started/session";
import { REQUIRED_FIELD_NAMES } from "@/data/intakeFields";

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

function logError(event: string, data: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

/**
 * Stage 1: finalizes the draft only. Scoring, PDF generation, founder
 * notification, and Wealthbox sync are Stage 2 additions layered on top of
 * this same endpoint - nothing here needs to change to support them.
 */
export async function POST() {
  const draft = await getDraftFromSession();
  if (!draft) {
    return NextResponse.json(
      { ok: false, error: "Your session has expired. Please refresh and start again." },
      { status: 401 }
    );
  }

  if (draft.submitted_at) {
    return NextResponse.json({ ok: true, firstName: draft.data.first_name ?? null });
  }

  const missing = REQUIRED_FIELD_NAMES.filter((name) => {
    const value = draft.data[name];
    return typeof value !== "string" || value.trim() === "";
  });
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please complete your name before submitting." },
      { status: 400 }
    );
  }

  try {
    await markDraftSubmitted(draft.id);
    log("get_started_submitted", { draftId: draft.id });
    return NextResponse.json({ ok: true, firstName: draft.data.first_name ?? null });
  } catch (err) {
    logError("get_started_submit_failed", { draftId: draft.id, message: String(err) });
    return NextResponse.json(
      { ok: false, error: "Something went wrong submitting your questionnaire. Your progress is saved - please try again in a moment." },
      { status: 500 }
    );
  }
}
