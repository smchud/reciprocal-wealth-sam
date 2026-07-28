import { pool, query } from "@/lib/db";
import type { FullScoring } from "./scoring";
import type { PriorityMatrixResult } from "./effortScore";

type IntakeData = Record<string, unknown>;

export interface SubmissionRecord {
  id: string;
  draftId: string;
}

/**
 * Inserts the completed-submission record and marks the draft submitted in
 * one transaction, so a client retry after a network hiccup can never
 * produce two submissions or a submitted draft with no matching record.
 * Returns null if this draft already has a submission (idempotent retry).
 */
export async function finalizeSubmission(
  draftId: string,
  data: IntakeData,
  scoring: FullScoring,
  priorityMatrix: PriorityMatrixResult
): Promise<SubmissionRecord | null> {
  const client = await pool.connect();
  try {
    await client.query("begin");

    const existing = await client.query<{ id: string }>(
      "select id from intake_submissions where draft_id = $1",
      [draftId]
    );
    if (existing.rows.length > 0) {
      await client.query("rollback");
      return null;
    }

    const email = typeof data.email === "string" ? data.email : null;
    const firstName = typeof data.first_name === "string" ? data.first_name : null;
    const lastName = typeof data.last_name === "string" ? data.last_name : null;

    const inserted = await client.query<{ id: string }>(
      `insert into intake_submissions (
         draft_id, data, email, first_name, last_name,
         final_risk_score, risk_profile, indicative_equity_allocation,
         risk_tolerance_score, age_factor, situation_factor,
         tolerance_breakdown, situation_breakdown,
         psychographic_archetype, psychographic_performance_score,
         psychographic_contact_score, psychographic_breakdown,
         priority_quadrant, effort_score_services, effort_score_involvement,
         effort_score_contact_frequency, effort_score_account_checking,
         effort_score_total, aum_bucket, aum_range_label, aum_score
       ) values (
         $1, $2, $3, $4, $5,
         $6, $7, $8,
         $9, $10, $11,
         $12, $13,
         $14, $15,
         $16, $17,
         $18, $19, $20,
         $21, $22, $23, $24, $25, $26
       )
       returning id`,
      [
        draftId,
        JSON.stringify(data),
        email,
        firstName,
        lastName,
        scoring.finalRiskScore,
        scoring.riskProfile.label,
        scoring.riskProfile.equity,
        scoring.toleranceScore,
        scoring.ageFactor,
        scoring.situationFactor,
        JSON.stringify(scoring.toleranceBreakdown),
        JSON.stringify(scoring.situationBreakdown),
        scoring.psychographic.archetype,
        scoring.psychographic.performanceScore,
        scoring.psychographic.contactScore,
        JSON.stringify(scoring.psychographic.breakdown),
        priorityMatrix.quadrant,
        priorityMatrix.effort.servicesScore,
        priorityMatrix.effort.involvementScore,
        priorityMatrix.effort.contactFrequencyScore,
        priorityMatrix.effort.accountCheckingScore,
        priorityMatrix.effort.totalEffortScore,
        priorityMatrix.aum.aumBucket,
        priorityMatrix.aum.aumRangeLabel,
        priorityMatrix.aum.aumScore,
      ]
    );

    await client.query(
      "update intake_drafts set submitted_at = now(), updated_at = now() where id = $1",
      [draftId]
    );

    await client.query("commit");
    return { id: inserted.rows[0].id, draftId };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function markPdfEmailed(submissionId: string): Promise<void> {
  await query("update intake_submissions set pdf_emailed_at = now() where id = $1", [submissionId]);
}

export async function markWealthboxSynced(submissionId: string, wealthboxContactId: string): Promise<void> {
  await query(
    "update intake_submissions set wealthbox_synced_at = now(), wealthbox_contact_id = $2 where id = $1",
    [submissionId, wealthboxContactId]
  );
}
