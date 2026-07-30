/**
 * Internal-only AUM/Effort prioritization matrix. Same treatment as the
 * risk score and psychographic archetype: computed server-side, stored in
 * Postgres, rendered in the founders' PDF only - never sent to the client,
 * never sent to Wealthbox, never present in any client-facing API response
 * or page source.
 */

type IntakeData = Record<string, unknown>;

function str(data: IntakeData, name: string): string {
  const v = data[name];
  return typeof v === "string" ? v : "";
}

function arr(data: IntakeData, name: string): string[] {
  const v = data[name];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

// ---------- Effort score (Section 5 & 7: services / involvement / contact frequency / account checking) ----------

// Section7.tsx merged financial_planning+retirement_planning and
// tax_planning+estate_planning into single combined options, and added
// three new services (equity_comp, exit_planning, philanthropy) - points
// below carry forward the sum of the merged pair's old values, and assign
// the new services points in the same 6-10 range as the existing spread.
const SERVICES_EFFORT_POINTS: Record<string, number> = {
  investment_management: 0,
  financial_retirement_planning: 16,
  tax_estate_planning: 17,
  equity_comp: 9,
  exit_planning: 10,
  philanthropy: 6,
  other: 6,
};
const SERVICES_CAP = 30;

const INVOLVEMENT_EFFORT_POINTS: Record<string, number> = {
  hands_off: 6,
  informed: 12,
  collaborative: 16,
  hands_on: 30,
};

const CONTACT_FREQUENCY_EFFORT_POINTS: Record<string, number> = {
  as_needed: 0,
  annual: 4,
  semi: 8,
  quarterly: 10,
  frequent: 20,
};

const ACCOUNT_CHECKING_EFFORT_POINTS: Record<string, number> = {
  annually: 0,
  quarterly: 3,
  monthly: 9,
  weekly: 12,
  daily: 17,
  multi_daily: 20,
};

const EFFORT_MAX = 100;

/** Threshold for the effort axis: total effort score >= this is High-Effort. */
export const EFFORT_THRESHOLD = 50;

export type EffortTier = "Low-Effort" | "High-Effort";

export function classifyEffortTier(totalEffortScore: number): EffortTier {
  return totalEffortScore >= EFFORT_THRESHOLD ? "High-Effort" : "Low-Effort";
}

export interface EffortScoreResult {
  servicesScore: number;
  involvementScore: number;
  contactFrequencyScore: number;
  accountCheckingScore: number;
  totalEffortScore: number;
  effortTier: EffortTier;
}

export function computeEffortScore(data: IntakeData): EffortScoreResult {
  const servicesRaw = arr(data, "services_desired").reduce(
    (sum, code) => sum + (SERVICES_EFFORT_POINTS[code] ?? 0),
    0
  );
  const servicesScore = Math.min(servicesRaw, SERVICES_CAP);

  const involvementScore = INVOLVEMENT_EFFORT_POINTS[str(data, "involvement")] ?? 0;
  const contactFrequencyScore = CONTACT_FREQUENCY_EFFORT_POINTS[str(data, "contact_frequency")] ?? 0;
  const accountCheckingScore = ACCOUNT_CHECKING_EFFORT_POINTS[str(data, "checking_frequency")] ?? 0;

  const totalEffortScore = Math.min(
    servicesScore + involvementScore + contactFrequencyScore + accountCheckingScore,
    EFFORT_MAX
  );

  return {
    servicesScore,
    involvementScore,
    contactFrequencyScore,
    accountCheckingScore,
    totalEffortScore,
    effortTier: classifyEffortTier(totalEffortScore),
  };
}

// ---------- AUM score & axis (Section 3: investable_assets range) ----------
//
// The questionnaire only ever captures investable assets as one of six
// ranges - never an exact dollar figure - so both the graded score and the
// axis classification are driven directly by which range was selected,
// never by a numeric dollar threshold.

/** Verbatim option text from Section3.tsx, stored alongside the score for the PDF. */
const AUM_RANGE_LABEL: Record<string, string> = {
  lt_500k: "Under $500,000",
  "500k_1M": "$500,000 – $1,000,000",
  "1M_2.5M": "$1,000,000 – $2,500,000",
  "2.5M_5M": "$2,500,000 – $5,000,000",
  "5M_10M": "$5,000,000 – $10,000,000",
  gt_10M: "Over $10,000,000",
};

/** Graded 0-100 AUM score, one fixed value per range - for ranking within a quadrant. */
const AUM_SCORE_BY_BUCKET: Record<string, number> = {
  lt_500k: 15,
  "500k_1M": 40,
  "1M_2.5M": 60,
  "2.5M_5M": 75,
  "5M_10M": 88,
  gt_10M: 100,
};

/** Ranges at/above $1,000,000-$2,500,000 are High-AUM for the quadrant split. */
const HIGH_AUM_BUCKETS = new Set(["1M_2.5M", "2.5M_5M", "5M_10M", "gt_10M"]);

export type AumTier = "Low-AUM" | "High-AUM";

/** Missing/unrecognized ranges default to Low-AUM, same conservative default used elsewhere in this module. */
export function classifyAumTier(bucket: string): AumTier {
  return HIGH_AUM_BUCKETS.has(bucket) ? "High-AUM" : "Low-AUM";
}

export interface AumAxisResult {
  aumBucket: string;
  aumRangeLabel: string;
  aumScore: number;
  aumTier: AumTier;
}

export function computeAumAxis(data: IntakeData): AumAxisResult {
  const aumBucket = str(data, "investable_assets");
  return {
    aumBucket,
    aumRangeLabel: AUM_RANGE_LABEL[aumBucket] ?? "",
    aumScore: AUM_SCORE_BY_BUCKET[aumBucket] ?? 0,
    aumTier: classifyAumTier(aumBucket),
  };
}

// ---------- Combined 2x2 matrix ----------

export type PriorityQuadrant =
  | "Low-AUM, Low-Effort"
  | "Low-AUM, High-Effort"
  | "High-AUM, Low-Effort"
  | "High-AUM, High-Effort";

export interface PriorityMatrixResult {
  effort: EffortScoreResult;
  aum: AumAxisResult;
  quadrant: PriorityQuadrant;
}

export function computePriorityMatrix(data: IntakeData): PriorityMatrixResult {
  const effort = computeEffortScore(data);
  const aum = computeAumAxis(data);
  const quadrant = `${aum.aumTier}, ${effort.effortTier}` as PriorityQuadrant;
  return { effort, aum, quadrant };
}
