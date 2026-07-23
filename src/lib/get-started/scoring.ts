/**
 * Server-side port of the risk-tolerance and psychographic scoring from the
 * approved source questionnaire ("LATEST - RW - Intake Form and RT Survey.html").
 * The math is reproduced exactly as specified there. This module's output
 * feeds the founders' PDF and the stored submission record only - it must
 * never be sent to the client or appear in a client-facing API response.
 */

type IntakeData = Record<string, unknown>;

function str(data: IntakeData, name: string): string {
  const v = data[name];
  return typeof v === "string" ? v : "";
}

// ---------- Risk tolerance (Section 6) ----------

const TOLERANCE_ITEMS = [
  "risk_q32",
  "risk_q33",
  "risk_q34",
  "risk_q36",
  "risk_q38",
  "risk_q37_1",
  "risk_q37_2",
  "risk_q37_3",
  "risk_q37_4",
] as const;
const SCORE_MINS = [1, 1, 1, 1, 1, 1, 1, 1, 1];
const SCORE_MAXES = [5, 4, 4, 5, 4, 5, 5, 5, 5];
// Items 1 and 4 of the Q37 Likert set are reverse-scored in the source.
const REVERSED_Q37 = new Set(["risk_q37_1", "risk_q37_4"]);

function scoreForItem(name: string, rawValue: string): number {
  const v = parseInt(rawValue, 10);
  if (Number.isNaN(v)) return NaN;
  if (REVERSED_Q37.has(name)) return 6 - v;
  return v;
}

export interface ToleranceResult {
  raw: number;
  normalized: number;
  breakdown: Record<string, number>;
}

export function computeRiskTolerance(data: IntakeData): ToleranceResult {
  let raw = 0;
  let possibleMin = 0;
  let possibleMax = 0;
  const breakdown: Record<string, number> = {};

  TOLERANCE_ITEMS.forEach((name, i) => {
    const rawValue = str(data, name);
    const score = rawValue ? scoreForItem(name, rawValue) : SCORE_MINS[i];
    const resolved = Number.isNaN(score) ? SCORE_MINS[i] : score;
    breakdown[name] = resolved;
    raw += resolved;
    possibleMin += SCORE_MINS[i];
    possibleMax += SCORE_MAXES[i];
  });

  const normalized = Math.round(((raw - possibleMin) / (possibleMax - possibleMin)) * 100);
  return { raw, normalized, breakdown };
}

// ---------- Age factor ----------
// 100 at age 21, linearly decreasing to 0 at age 90. Neutral (50) if DOB missing/invalid.
export function computeAgeFactor(dobStr: string): number {
  if (!dobStr) return 50;
  const dob = new Date(dobStr);
  if (Number.isNaN(dob.getTime())) return 50;
  const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (age >= 90) return 0;
  if (age <= 21) return 100;
  return Math.round(((90 - age) / (90 - 21)) * 100);
}

// ---------- Situation factor ----------

export interface SituationResult {
  score: number;
  breakdown: Record<string, number>;
}

export function computeSituationFactor(data: IntakeData): SituationResult {
  let s = 50;
  const breakdown: Record<string, number> = { base: 50 };

  const savingsMap: Record<string, number> = {
    lt_5: -10,
    "5_10": -5,
    "10_20": 0,
    "20_30": 10,
    gt_30: 15,
    retired: 0,
  };
  const savingsRate = str(data, "savings_rate");
  if (savingsRate && savingsMap[savingsRate] !== undefined) {
    s += savingsMap[savingsRate];
    breakdown.savings_rate = savingsMap[savingsRate];
  }

  const stabilityMap: Record<string, number> = {
    very_stable: 10,
    mostly_stable: 5,
    variable: -5,
    uncertain: -10,
  };
  const incomeStability = str(data, "income_stability");
  if (incomeStability && stabilityMap[incomeStability] !== undefined) {
    s += stabilityMap[incomeStability];
    breakdown.income_stability = stabilityMap[incomeStability];
  }

  const horizonMap: Record<string, number> = {
    lt_3: -15,
    "3_5": -10,
    "5_10": -3,
    "10_20": 8,
    gt_20: 15,
  };
  const timeHorizon = str(data, "time_horizon");
  if (timeHorizon && horizonMap[timeHorizon] !== undefined) {
    s += horizonMap[timeHorizon];
    breakdown.time_horizon = horizonMap[timeHorizon];
  }

  const emergencyMap: Record<string, number> = { yes: 5, partial: 0, no: -5, unsure: -2 };
  const emergencyFund = str(data, "emergency_fund");
  if (emergencyFund && emergencyMap[emergencyFund] !== undefined) {
    s += emergencyMap[emergencyFund];
    breakdown.emergency_fund = emergencyMap[emergencyFund];
  }

  const withdrawalMap: Record<string, number> = { "1": -15, "2": -5, "3": 5, "4": 10 };
  const riskQ38 = str(data, "risk_q38");
  if (riskQ38 && withdrawalMap[riskQ38] !== undefined) {
    s += withdrawalMap[riskQ38];
    breakdown.forced_withdrawal = withdrawalMap[riskQ38];
  }

  // "Won the game" - assets well above plausible need pulls risk DOWN.
  const investableAssets = str(data, "investable_assets");
  const incomeRange = str(data, "income_range");
  let wtg = 0;
  if (investableAssets === "gt_10M") wtg = -15;
  else if (
    investableAssets === "5M_10M" &&
    ["lt_200", "200_350", "350_500"].includes(incomeRange)
  )
    wtg = -8;
  if (wtg !== 0) {
    s += wtg;
    breakdown.won_the_game = wtg;
  }

  breakdown.final = Math.max(0, Math.min(100, s));
  return { score: breakdown.final, breakdown };
}

// 60/20/20 blend, hard 0-100 clamp.
export function computeBlendedScore(tolerance: number, ageFactor: number, situationFactor: number): number {
  const blended = 0.6 * tolerance + 0.2 * ageFactor + 0.2 * situationFactor;
  return Math.round(Math.max(0, Math.min(100, blended)));
}

export interface RiskProfile {
  label: string;
  equity: string;
  description: string;
}

export function profileFor(score: number): RiskProfile {
  if (score < 20)
    return {
      label: "Conservative",
      equity: "20–35%",
      description:
        "Capital preservation is paramount; you accept lower expected returns in exchange for materially smaller drawdowns.",
    };
  if (score < 40)
    return {
      label: "Moderately Conservative",
      equity: "35–55%",
      description:
        "Stability matters more than upside; you can tolerate modest losses but want them clearly bounded.",
    };
  if (score < 60)
    return {
      label: "Moderate",
      equity: "55–70%",
      description:
        "A balanced posture — meaningful growth potential paired with enough ballast to weather typical market cycles.",
    };
  if (score < 80)
    return {
      label: "Moderately Aggressive",
      equity: "70–85%",
      description:
        "Growth-oriented; you accept significant short-term volatility in exchange for higher long-term expected returns.",
    };
  return {
    label: "Aggressive",
    equity: "85–100%",
    description:
      "Maximum long-term growth focus; you understand and accept the prospect of substantial drawdowns along the way.",
  };
}

// ---------- Psychographic segment (Section 7) ----------

interface PsyItem {
  name: string;
  axis: "performance" | "contact";
  dir: "+" | "-";
}

const PSY_ITEMS: PsyItem[] = [
  { name: "psy_p1", axis: "performance", dir: "+" },
  { name: "psy_p2", axis: "performance", dir: "-" },
  { name: "psy_p3", axis: "performance", dir: "+" },
  { name: "psy_p4", axis: "performance", dir: "-" },
  { name: "psy_c1", axis: "contact", dir: "-" },
  { name: "psy_c2", axis: "contact", dir: "+" },
  { name: "psy_c3", axis: "contact", dir: "-" },
  { name: "psy_c4", axis: "contact", dir: "+" },
];

export interface PsychographicResult {
  performanceScore: number;
  contactScore: number;
  archetype: string;
  description: string;
  breakdown: Record<string, { value: number; dir: "+" | "-"; contribution: number }>;
}

export function computePsychographicSegment(data: IntakeData): PsychographicResult {
  let perf = 0;
  let contact = 0;
  const breakdown: PsychographicResult["breakdown"] = {};

  PSY_ITEMS.forEach((item) => {
    const raw = str(data, item.name);
    const v = parseInt(raw, 10);
    if (!v) return;
    const contribution = item.dir === "+" ? v - 3 : 3 - v;
    breakdown[item.name] = { value: v, dir: item.dir, contribution };
    if (item.axis === "performance") perf += contribution;
    else contact += contribution;
  });

  let archetype: string;
  let description: string;
  if (perf >= 0 && contact < 0) {
    archetype = "Delegated Performer";
    description =
      "Outsourced execution, judges on results. Lead with proactive performance conversations; light touch otherwise.";
  } else if (perf >= 0 && contact >= 0) {
    archetype = "Engaged Stakeholder";
    description =
      "Wants outperformance AND wants to be in the room. Treat meetings as the work; be ready for hard questions.";
  } else if (perf < 0 && contact < 0) {
    archetype = "Plan Holder";
    description = "Wants the plan in place and to trust it's working. Low service intensity; be deliberate when escalating.";
  } else {
    archetype = "Partnership Planner";
    description = "The relationship is part of the product. Regular touchpoints, visible thinking, demonstrate care.";
  }

  return { performanceScore: perf, contactScore: contact, archetype, description, breakdown };
}

// ---------- Full computation ----------

export interface FullScoring {
  finalRiskScore: number;
  riskProfile: RiskProfile;
  toleranceScore: number;
  ageFactor: number;
  situationFactor: number;
  toleranceBreakdown: Record<string, number>;
  situationBreakdown: Record<string, number>;
  psychographic: PsychographicResult;
}

export function computeFullScoring(data: IntakeData): FullScoring {
  const tolerance = computeRiskTolerance(data);
  const ageFactor = computeAgeFactor(str(data, "dob"));
  const situation = computeSituationFactor(data);
  const finalRiskScore = computeBlendedScore(tolerance.normalized, ageFactor, situation.score);
  const riskProfile = profileFor(finalRiskScore);
  const psychographic = computePsychographicSegment(data);

  return {
    finalRiskScore,
    riskProfile,
    toleranceScore: tolerance.normalized,
    ageFactor,
    situationFactor: situation.score,
    toleranceBreakdown: tolerance.breakdown,
    situationBreakdown: situation.breakdown,
    psychographic,
  };
}
