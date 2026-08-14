import { NextResponse } from "next/server";
import { getDraftFromSession } from "@/lib/get-started/session";
import { REQUIRED_FIELD_NAMES } from "@/data/intakeFields";
import { computeFullScoring } from "@/lib/get-started/scoring";
import { computePriorityMatrix } from "@/lib/get-started/effortScore";
import { finalizeSubmission, markPdfEmailed, markWealthboxSynced } from "@/lib/get-started/submission";
import { generateSummaryPdf } from "@/lib/get-started/pdf";
import { buildCrmNote } from "@/lib/get-started/crmNote";
import { buildWealthboxCustomFieldValues } from "@/lib/get-started/wealthboxCustomFields";
import { sendSubmissionSummary } from "@/lib/notify";
import { syncQuestionnaireContact } from "@/lib/wealthbox";
import { reportError } from "@/lib/observability";

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));
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
  const priorityMatrix = computePriorityMatrix(draft.data);
  let submission;
  try {
    submission = await finalizeSubmission(draft.id, draft.data, scoring, priorityMatrix);
    log("get_started_submitted", { draftId: draft.id, submissionId: submission?.id ?? null });
  } catch (err) {
    reportError("get_started_submit_failed", { draftId: draft.id, message: String(err) }, err);
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
      const pdfBuffer = await generateSummaryPdf(draft.data, scoring, priorityMatrix, new Date());
      await sendSubmissionSummary(name, pdfBuffer);
      await markPdfEmailed(submission.id);
    } catch (err) {
      reportError("get_started_pdf_email_failed", { draftId: draft.id, message: String(err) }, err);
    }

    try {
      const email = typeof draft.data.email === "string" ? draft.data.email : "";
      if (email) {
        const note = buildCrmNote(draft.data, scoring, new Date());
        const customFieldValues = buildWealthboxCustomFieldValues(draft.data, scoring);

        const str = (v: unknown): string => (typeof v === "string" ? v : "");

        const wb = await syncQuestionnaireContact({
          firstName: str(draft.data.first_name),
          middleName: str(draft.data.middle_name) || undefined,
          lastName: str(draft.data.last_name),
          email,
          phone: str(draft.data.phone) || undefined,
          phoneType: str(draft.data.phone_type) || undefined,
          address: {
            street: str(draft.data.address_street),
            city: str(draft.data.address_city),
            state: str(draft.data.address_state),
            zip: str(draft.data.address_zip),
            country: str(draft.data.address_country),
          },
          note,
          customFieldValues,
        });
        await markWealthboxSynced(submission.id, String(wb.id));
      }
    } catch (err) {
      reportError("get_started_wealthbox_failed", { draftId: draft.id, message: String(err) }, err);
    }
  }

  return NextResponse.json({ ok: true, firstName: draft.data.first_name ?? null });
}
