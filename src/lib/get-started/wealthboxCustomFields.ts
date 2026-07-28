import { formatValue } from "./answerLabels";
import type { FullScoring } from "./scoring";

type IntakeData = Record<string, unknown>;

function str(data: IntakeData, name: string): string {
  const v = data[name];
  return typeof v === "string" ? v.trim() : "";
}

function fmt(data: IntakeData, name: string): string {
  const v = data[name];
  if (v === undefined || v === null) return "";
  return formatValue(name, v);
}

function joinNonEmpty(parts: (string | undefined)[], sep: string): string {
  return parts.filter((p): p is string => typeof p === "string" && p.trim() !== "").join(sep);
}

function partnerName(data: IntakeData): string {
  return joinNonEmpty(
    [str(data, "partner_first_name"), str(data, "partner_middle_name"), str(data, "partner_last_name")],
    " "
  );
}

function childrenNames(data: IntakeData): string {
  const ids = Object.keys(data)
    .map((key) => key.match(/^child_(\d+)_name$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => parseInt(m[1], 10))
    .sort((a, b) => a - b);
  return joinNonEmpty(
    ids.map((id) => str(data, `child_${id}_name`)),
    ", "
  );
}

/**
 * Wealthbox custom field names (created manually in Wealthbox Settings ->
 * Customizations -> Custom Fields, all as Text) mapped to how each value is
 * derived from the questionnaire. Names must match exactly - fields are
 * resolved by name against Wealthbox's own field list at sync time.
 *
 * Deliberately excludes "AUM & Effort Quadrant" - that field mirrors the
 * internal-only priority matrix, which is never sent to Wealthbox per the
 * same rule that keeps it out of the client-facing completion screen and
 * API responses. Do not add it here without an explicit, separate
 * confirmation that overrides that rule.
 */
export function buildWealthboxCustomFieldValues(
  data: IntakeData,
  scoring: FullScoring
): Record<string, string> {
  const values: Record<string, string> = {
    "Risk Profile": scoring.riskProfile.label,
    "Indicative Equity Allocation": scoring.riskProfile.equity,
    "Investable Assets": fmt(data, "investable_assets"),
    "Household Income": fmt(data, "income_range"),
    "Time Horizon": fmt(data, "time_horizon"),
    Priorities: fmt(data, "priorities"),
    "Top Goal": str(data, "top_goal"),
    "Retirement Vision": str(data, "retirement_vision"),
    "Major Expenditures": str(data, "major_expenditures"),
    "Charitable Giving": fmt(data, "charitable_giving"),
    "Marital Status": fmt(data, "marital_status"),
    "Life Stage": fmt(data, "life_stage"),
    "Has Children": fmt(data, "has_children"),
    "Investing Experience": fmt(data, "experience"),
    "Involvement Style": fmt(data, "involvement"),
    "Prior Advisor": fmt(data, "prior_advisor"),
    "Contact Frequency Preference": fmt(data, "contact_frequency"),
    "Preferred Contact Channel(s)": fmt(data, "contact_channel"),
    "Advisor Qualities Wanted": fmt(data, "advisor_qualities"),
    "Referral Source": fmt(data, "referral_source"),
    "Charitable Organization(s)": str(data, "nonprofit_involvement"),
    "Referral Name": str(data, "referral_name"),
    "Partner Name": partnerName(data),
    "Partner Occupation": str(data, "partner_occupation"),
    "Children Name(s)": childrenNames(data),
  };

  // Only send fields that actually have a value - an empty string would
  // overwrite anything already in that field on an existing contact.
  return Object.fromEntries(Object.entries(values).filter(([, v]) => v !== ""));
}
