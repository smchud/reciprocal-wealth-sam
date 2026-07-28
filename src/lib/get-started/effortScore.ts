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

// ---------- Effort score (Section 7: services / involvement / communication) ----------

const SERVICES_EFFORT_POINTS: Record<string, number> = {
  investment_management: 0,
  financial_planning: 12,
  retirement_planning: 8,
  tax_planning: 10,
  estate_planning: 12,
  other: 8,
};
const SERVICES_CAP = 40;

const INVOLVEMENT_EFFORT_POINTS: Record<string, number> = {
  hands_off: 6,
  informed: 14,
  collaborative: 24,
  hands_on: 30,
};

const COMMUNICATION_EFFORT_POINTS: Record<string, number> = {
  email: 3,
  phone: 7,
  video: 6,
  in_person: 10,
  text: 8,
};
const COMMUNICATION_CAP = 30;
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
  communicationScore: number;
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

  const communicationRaw = arr(data, "contact_channel").reduce(
    (sum, code) => sum + (COMMUNICATION_EFFORT_POINTS[code] ?? 0),
    0
  );
  const communicationScore = Math.min(communicationRaw, COMMUNICATION_CAP);

  const totalEffortScore = Math.min(
    servicesScore + involvementScore + communicationScore,
    EFFORT_MAX
  );

  return {
    servicesScore,
    involvementScore,
    communicationScore,
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
