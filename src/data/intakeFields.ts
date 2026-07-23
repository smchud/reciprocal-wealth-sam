/**
 * Canonical field-name inventory for the /get-started intake questionnaire,
 * derived from "LATEST - RW - Intake Form and RT Survey.html" (approved
 * source). Do not add, remove, or rename fields here without re-deriving
 * from that source — this list is also the server-side allowlist that
 * enforces the data-minimization HARD RULE (no SSNs, government IDs,
 * account numbers, or account credentials are ever in this set).
 */

export const STATIC_FIELD_NAMES = [
  // Section 1 — Your Details
  "first_name", "middle_name", "last_name", "dob", "email",
  "phone_type", "phone",
  "address_street", "address_city", "address_state", "address_zip", "address_country",
  "marital_status",
  "partner_first_name", "partner_middle_name", "partner_last_name",
  "partner_dob", "partner_email", "partner_phone", "partner_coclient",
  "has_children",
  "hobbies", "hobbies_other",
  "life_stage",

  // Section 2 — Career & Income
  "occupation", "employer", "industry", "education",
  "partner_occupation", "partner_employer", "partner_industry", "partner_education",
  "income_sources", "income_sources_other", "equity_pct",
  "income_range", "income_stability", "retire_horizon",

  // Section 3 — Financial Picture
  "investable_assets",
  "assets_cash_value", "assets_cash_where",
  "assets_taxable_value", "assets_taxable_where",
  "assets_401k_value", "assets_401k_where",
  "assets_ira_value", "assets_ira_where",
  "assets_bonds_value", "assets_bonds_where",
  "assets_529_value", "assets_529_where",
  "assets_equity_value", "assets_equity_where",
  "assets_private_value", "assets_private_where",
  "assets_crypto_value", "assets_crypto_where",
  "assets_alt_value", "assets_alt_where",
  "assets_other_value", "assets_other_where", "assets_other_specify",
  "tax_cash_pct", "tax_taxable_pct", "tax_deferred_pct", "tax_free_pct",
  "liab_mortgage", "liab_student", "liab_auto", "liab_cc",
  "emergency_fund", "cash_balance",
  "savings_rate",
  "inheritance", "inheritance_magnitude",

  // Section 4 — Goals & Time Horizon
  "priorities", "priorities_other",
  "top_goal", "retirement_vision",
  "time_horizon",
  "major_expenditures", "specific_targets", "nonprofit_involvement",
  "charitable_giving",

  // Section 5 — Investing Background
  "experience",
  "self_confidence", "advisor_expectations",
  "instruments",
  "checking_frequency",
  "involvement",
  "prior_advisor", "prior_advisor_name", "prior_advisor_other",
  "prior_dissatisfaction",

  // Section 6 — Risk (scored server-side only in Stage 2; never shown to client)
  "risk_q32", "risk_q33", "risk_q34", "risk_q36",
  "risk_q37_1", "risk_q37_2", "risk_q37_3", "risk_q37_4",
  "risk_q38",

  // Section 7 — Working With Us
  "psy_p1", "psy_p2", "psy_p3", "psy_p4",
  "psy_c1", "psy_c2", "psy_c3", "psy_c4",
  "contact_frequency", "contact_channel",
  "advisor_qualities",
  "investing_values", "values_notes",
  "prompt",
  "referral_source", "referral_name",
  "other_notes",
] as const;

export type StaticFieldName = (typeof STATIC_FIELD_NAMES)[number];

const STATIC_FIELD_NAME_SET = new Set<string>(STATIC_FIELD_NAMES);

// Repeating children block: child_{n}_name, child_{n}_dob, child_{n}_school
const DYNAMIC_FIELD_PATTERN = /^child_\d+_(name|dob|school)$/;

export function isKnownFieldName(name: string): boolean {
  return STATIC_FIELD_NAME_SET.has(name) || DYNAMIC_FIELD_PATTERN.test(name);
}

/** Only fields formally required in the approved source (Section 1 legal name). */
export const REQUIRED_FIELD_NAMES: readonly StaticFieldName[] = [
  "first_name",
  "middle_name",
  "last_name",
];

/** Fields whose values are string arrays (checkbox groups) rather than scalars. */
export const MULTI_VALUE_FIELD_NAMES: readonly StaticFieldName[] = [
  "hobbies",
  "income_sources",
  "priorities",
  "instruments",
  "prior_advisor",
  "prior_dissatisfaction",
  "contact_channel",
  "advisor_qualities",
  "investing_values",
];

export const SECTION_IDS = ["consent", "welcome", "1", "2", "3", "4", "5", "6", "7"] as const;
export type SectionId = (typeof SECTION_IDS)[number];
