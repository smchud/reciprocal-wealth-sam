import { test, expect } from "@playwright/test";
import {
  computeEffortScore,
  computeAumAxis,
  computePriorityMatrix,
  classifyEffortTier,
  classifyAumTier,
  EFFORT_THRESHOLD,
  AUM_THRESHOLD,
} from "../src/lib/get-started/effortScore";

test.describe("effort score math", () => {
  test("case 1: IM only + Hands-off + Once a year + Annually or less -> 10, Low-Effort", () => {
    const result = computeEffortScore({
      services_desired: ["investment_management"],
      involvement: "hands_off",
      contact_frequency: "annual",
      checking_frequency: "annually",
    });
    expect(result.servicesScore).toBe(0);
    expect(result.involvementScore).toBe(6);
    expect(result.contactFrequencyScore).toBe(4);
    expect(result.accountCheckingScore).toBe(0);
    expect(result.totalEffortScore).toBe(10);
    expect(result.effortTier).toBe("Low-Effort");
  });

  test("case 2: IM + Financial planning + Tax + Collaborative + Quarterly + Weekly -> 56, High-Effort", () => {
    const result = computeEffortScore({
      services_desired: ["investment_management", "financial_planning", "tax_planning"],
      involvement: "collaborative",
      contact_frequency: "quarterly",
      checking_frequency: "weekly",
    });
    expect(result.servicesScore).toBe(18);
    expect(result.involvementScore).toBe(16);
    expect(result.contactFrequencyScore).toBe(10);
    expect(result.accountCheckingScore).toBe(12);
    expect(result.totalEffortScore).toBe(56);
    expect(result.effortTier).toBe("High-Effort");
  });

  test("case 3: all services + Hands-on + Frequent + Multiple/day -> 100, High-Effort", () => {
    const result = computeEffortScore({
      services_desired: [
        "investment_management",
        "financial_planning",
        "tax_planning",
        "estate_planning",
        "retirement_planning",
        "other",
      ],
      involvement: "hands_on",
      contact_frequency: "frequent",
      checking_frequency: "multi_daily",
    });
    // Raw services sum is 39 (0+10+8+9+6+6), capped at 30.
    expect(result.servicesScore).toBe(30);
    expect(result.involvementScore).toBe(30);
    expect(result.contactFrequencyScore).toBe(20);
    expect(result.accountCheckingScore).toBe(20);
    expect(result.totalEffortScore).toBe(100);
    expect(result.effortTier).toBe("High-Effort");
  });

  test("missing answers default to zero, not a crash", () => {
    const result = computeEffortScore({});
    expect(result).toEqual({
      servicesScore: 0,
      involvementScore: 0,
      contactFrequencyScore: 0,
      accountCheckingScore: 0,
      totalEffortScore: 0,
      effortTier: "Low-Effort",
    });
  });

  test("unrecognized option codes contribute zero rather than throwing", () => {
    const result = computeEffortScore({
      services_desired: ["not_a_real_option"],
      involvement: "not_a_real_option",
      contact_frequency: "not_a_real_option",
      checking_frequency: "not_a_real_option",
    });
    expect(result.totalEffortScore).toBe(0);
  });
});

test.describe("effort tier boundary (threshold is 50)", () => {
  test("49 is Low-Effort, 50 is High-Effort, 51 is High-Effort", () => {
    expect(EFFORT_THRESHOLD).toBe(50);
    expect(classifyEffortTier(49)).toBe("Low-Effort");
    expect(classifyEffortTier(50)).toBe("High-Effort");
    expect(classifyEffortTier(51)).toBe("High-Effort");
  });

  test("0 and 100 are the extremes", () => {
    expect(classifyEffortTier(0)).toBe("Low-Effort");
    expect(classifyEffortTier(100)).toBe("High-Effort");
  });
});

test.describe("AUM axis", () => {
  test("bucket boundary: 500k_1M is Low-AUM, 1M_2.5M is High-AUM", () => {
    const under = computeAumAxis({ investable_assets: "500k_1M" });
    expect(under.aumValue).toBe(500_000);
    expect(under.aumTier).toBe("Low-AUM");

    const atThreshold = computeAumAxis({ investable_assets: "1M_2.5M" });
    expect(atThreshold.aumValue).toBe(1_000_000);
    expect(atThreshold.aumTier).toBe("High-AUM");
  });

  test("all six buckets resolve to the expected value and tier", () => {
    expect(computeAumAxis({ investable_assets: "lt_500k" })).toMatchObject({
      aumValue: 0,
      aumTier: "Low-AUM",
    });
    expect(computeAumAxis({ investable_assets: "2.5M_5M" })).toMatchObject({
      aumValue: 2_500_000,
      aumTier: "High-AUM",
    });
    expect(computeAumAxis({ investable_assets: "5M_10M" })).toMatchObject({
      aumValue: 5_000_000,
      aumTier: "High-AUM",
    });
    expect(computeAumAxis({ investable_assets: "gt_10M" })).toMatchObject({
      aumValue: 10_000_000,
      aumTier: "High-AUM",
    });
  });

  test("missing or unrecognized bucket defaults to $0 / Low-AUM, not a crash", () => {
    expect(computeAumAxis({})).toMatchObject({ aumValue: 0, aumTier: "Low-AUM" });
    expect(computeAumAxis({ investable_assets: "not_a_real_bucket" })).toMatchObject({
      aumValue: 0,
      aumTier: "Low-AUM",
    });
  });
});

test.describe("AUM tier boundary (threshold is $1,000,000)", () => {
  test("$999,999 is Low-AUM, $1,000,000 is High-AUM, $1,000,001 is High-AUM", () => {
    expect(AUM_THRESHOLD).toBe(1_000_000);
    expect(classifyAumTier(999_999)).toBe("Low-AUM");
    expect(classifyAumTier(1_000_000)).toBe("High-AUM");
    expect(classifyAumTier(1_000_001)).toBe("High-AUM");
  });
});

test.describe("combined quadrant", () => {
  test("all four quadrant combinations label correctly", () => {
    const lowAumLowEffort = computePriorityMatrix({
      investable_assets: "lt_500k",
      services_desired: ["investment_management"],
      involvement: "hands_off",
      contact_frequency: "annual",
      checking_frequency: "annually",
    });
    expect(lowAumLowEffort.quadrant).toBe("Low-AUM, Low-Effort");

    const lowAumHighEffort = computePriorityMatrix({
      investable_assets: "500k_1M",
      services_desired: ["financial_planning", "estate_planning"],
      involvement: "hands_on",
      contact_frequency: "frequent",
      checking_frequency: "weekly",
    });
    expect(lowAumHighEffort.quadrant).toBe("Low-AUM, High-Effort");

    const highAumLowEffort = computePriorityMatrix({
      investable_assets: "5M_10M",
      services_desired: ["investment_management"],
      involvement: "hands_off",
      contact_frequency: "annual",
      checking_frequency: "annually",
    });
    expect(highAumLowEffort.quadrant).toBe("High-AUM, Low-Effort");

    const highAumHighEffort = computePriorityMatrix({
      investable_assets: "gt_10M",
      services_desired: ["financial_planning", "estate_planning", "tax_planning"],
      involvement: "hands_on",
      contact_frequency: "frequent",
      checking_frequency: "multi_daily",
    });
    expect(highAumHighEffort.quadrant).toBe("High-AUM, High-Effort");
  });
});
