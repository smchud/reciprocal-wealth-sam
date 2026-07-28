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

const SERVICES_EFFORT_POINTS: Record<string, number> = {
  investment_management: 0,
  financial_planning: 10,
  tax_planning: 8,
  estate_planning: 9,
  retirement_planning: 6,
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

// ---------- AUM axis (Section 3: investable_assets) ----------

/** Lower bound in dollars for each investable_assets bucket - used as the axis's representative value. */
const AUM_BUCKET_VALUE: Record<string, number> = {
  lt_500k: 0,
  "500k_1M": 500_000,
  "1M_2.5M": 1_000_000,
  "2.5M_5M": 2_500_000,
  "5M_10M": 5_000_000,
  gt_10M: 10_000_000,
};

/** Threshold for the AUM axis: representative value >= this is High-AUM. */
export const AUM_THRESHOLD = 1_000_000;

export type AumTier = "Low-AUM" | "High-AUM";

export function classifyAumTier(aumValue: number): AumTier {
  return aumValue >= AUM_THRESHOLD ? "High-AUM" : "Low-AUM";
}

export interface AumAxisResult {
  aumBucket: string;
  aumValue: number;
  aumTier: AumTier;
}

export function computeAumAxis(data: IntakeData): AumAxisResult {
  const aumBucket = str(data, "investable_assets");
  const aumValue = AUM_BUCKET_VALUE[aumBucket] ?? 0;
  return { aumBucket, aumValue, aumTier: classifyAumTier(aumValue) };
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
