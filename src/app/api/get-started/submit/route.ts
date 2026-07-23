import { NextResponse } from "next/server";
import { getDraftFromSession } from "@/lib/get-started/session";
import { REQUIRED_FIELD_NAMES } from "@/data/intakeFields";
import { computeFullScoring } from "@/lib/get-started/scoring";
import { finalizeSubmission, markPdfEmailed, markWealthboxSynced } from "@/lib/get-started/submission";
import { generateSummaryPdf } from "@/lib/get-started/pdf";
import { sendSubmissionSummary } from "@/lib/notify";
import { syncQuestionnaireContact } from "@/lib/wealthbox";

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

function logError(event: string, data: Record<string, unknown>) {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
}

function clientName(data: Record<string, unknown>): string {
  return [data.first_name, data.middle_name, data.last_name]
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .join(" ") || "Prospect";
}

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

  // The real failure boundary the visitor sees: their data is safely
  // autosaved in the draft either way, so a failure here just means "try
  // again in a moment," never data loss.
  const scoring = computeFullScoring(draft.data);
  let submission;
  try {
    submission = await finalizeSubmission(draft.id, draft.data, scoring);
    log("get_started_submitted", { draftId: draft.id, submissionId: submission?.id ?? null });
  } catch (err) {
    logError("get_started_submit_failed", { draftId: draft.id, message: String(err) });
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong submitting your questionnaire. Your progress is saved - please try again in a moment.",
      },
      { status: 500 }
    );
  }

  const name = clientName(draft.data);

  // Everything below is best-effort: the submission is already safely
  // stored, so none of these failing should change the response the
  // visitor sees. Each is isolated so one failing doesn't skip the others.
  if (submission) {
    try {
      const pdfBuffer = await generateSummaryPdf(draft.data, scoring, new Date());
      await sendSubmissionSummary(name, pdfBuffer);
      await markPdfEmailed(submission.id);
    } catch (err) {
      logError("get_started_pdf_email_failed", { draftId: draft.id, message: String(err) });
    }

    try {
      const email = typeof draft.data.email === "string" ? draft.data.email : "";
      if (email) {
        const note = [
          `[${new Date().toISOString()}] Website questionnaire completed.`,
          `Risk profile: ${scoring.riskProfile.label} (${scoring.finalRiskScore}/100, indicative equity ${scoring.riskProfile.equity})`,
          `Psychographic archetype: ${scoring.psychographic.archetype}`,
          draft.data.top_goal ? `Top goal: ${draft.data.top_goal}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        const wb = await syncQuestionnaireContact({
          firstName: typeof draft.data.first_name === "string" ? draft.data.first_name : "",
          lastName: typeof draft.data.last_name === "string" ? draft.data.last_name : "",
          email,
          phone: typeof draft.data.phone === "string" ? draft.data.phone : undefined,
          note,
        });
        await markWealthboxSynced(submission.id, String(wb.id));
      }
    } catch (err) {
      logError("get_started_wealthbox_failed", { draftId: draft.id, message: String(err) });
    }
  }

  return NextResponse.json({ ok: true, firstName: draft.data.first_name ?? null });
}
