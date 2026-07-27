import { fieldLabel, formatValue } from "./answerLabels";
import type { FullScoring } from "./scoring";

type IntakeData = Record<string, unknown>;

interface NoteSection {
  title: string;
  fields: string[];
}

/**
 * Fields safe and useful to summarize in the CRM: goals, time horizon, and
 * household/preference context an advisor would want without opening the
 * PDF. Deliberately excludes the raw risk-tolerance and psychographic
 * Likert inputs (risk_q*, psy_*) - those feed the internal score/archetype
 * and stay founders-PDF-only, along with the score and archetype
 * themselves (never in Wealthbox, same rule as the client completion
 * screen). Also excludes account-level detail (asset/liability dollar
 * amounts, tax location, address, DOB) that isn't needed for a CRM
 * overview and duplicates what's already in the PDF.
 */
const NOTE_SECTIONS: NoteSection[] = [
  {
    title: "Goals & Time Horizon",
    fields: [
      "priorities",
      "priorities_other",
      "top_goal",
      "retirement_vision",
      "time_horizon",
      "major_expenditures",
      "specific_targets",
      "charitable_giving",
      "nonprofit_involvement",
    ],
  },
  {
    title: "Financial Snapshot",
    fields: ["investable_assets", "income_range", "retire_horizon"],
  },
  {
    title: "Household",
    fields: ["marital_status", "life_stage", "occupation", "employer", "has_children"],
  },
  {
    title: "Investing Background",
    fields: ["experience", "involvement", "prior_advisor", "prior_dissatisfaction"],
  },
  {
    title: "Working With Us",
    fields: [
      "contact_frequency",
      "contact_channel",
      "advisor_qualities",
      "investing_values",
      "referral_source",
      "prompt",
    ],
  },
];

function formatField(data: IntakeData, name: string): string | null {
  const raw = data[name];
  if (raw === undefined || raw === null || raw === "") return null;
  if (Array.isArray(raw) && raw.length === 0) return null;
  const formatted = formatValue(name, raw);
  if (!formatted) return null;
  return `${fieldLabel(name)}: ${formatted}`;
}

/**
 * Builds the structured, CRM-facing summary of a questionnaire submission.
 *
 * HARD RULE: never includes the final risk score, the psychographic
 * archetype, or any scoring breakdown - only the qualitative risk profile
 * label and indicative equity range, a safe advisor-facing summary that's
 * distinct from the internal numeric score/archetype (those stay in the
 * founders' PDF only).
 */
export function buildCrmNote(data: IntakeData, scoring: FullScoring, submittedAt: Date): string {
  const lines: string[] = [
    `[${submittedAt.toISOString()}] Website questionnaire completed.`,
    "",
    "Risk Profile Summary",
    `Risk profile: ${scoring.riskProfile.label}`,
    `Indicative equity allocation: ${scoring.riskProfile.equity}`,
  ];

  for (const section of NOTE_SECTIONS) {
    const fieldLines = section.fields
      .map((name) => formatField(data, name))
      .filter((line): line is string => line !== null);
    if (fieldLines.length === 0) continue;
    lines.push("", section.title, ...fieldLines);
  }

  return lines.join("\n");
}
