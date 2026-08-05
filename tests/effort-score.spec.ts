import { test, expect } from "@playwright/test";
import {
  computeEffortScore,
  computeAumAxis,
  computePriorityMatrix,
  classifyEffortTier,
  classifyAumTier,
  EFFORT_THRESHOLD,
} from "../src/lib/get-started/effortScore";

test.describe("effort score math", () => {
  test("case 1: IM only + Hands-off + Once a year + Annually or less -> 5, Low-Effort", () => {
    const result = computeEffortScore({
      services_desired: ["investment_management"],
      involvement: "hands_off",
      contact_frequency: "annual",
      checking_frequency: "annually",
    });
    expect(result.servicesScore).toBe(0);
    expect(result.involvementScore).toBe(0);
    expect(result.contactFrequencyScore).toBe(5);
    expect(result.accountCheckingScore).toBe(0);
    expect(result.totalEffortScore).toBe(5);
    expect(result.effortTier).toBe("Low-Effort");
  });

  test("case 2: IM + Financial/retirement planning + Philanthropy + Collaborative + Quarterly + Weekly -> 53, High-Effort", () => {
    const result = computeEffortScore({
      services_desired: ["investment_management", "financial_retirement_planning", "philanthropy"],
      involvement: "collaborative",
      contact_frequency: "quarterly",
      checking_frequency: "weekly",
    });
    expect(result.servicesScore).toBe(10);
    expect(result.involvementScore).toBe(15);
    expect(result.contactFrequencyScore).toBe(13);
    expect(result.accountCheckingScore).toBe(15);
    expect(result.totalEffortScore).toBe(53);
    expect(result.effortTier).toBe("High-Effort");
  });

  test("case 3: all services + Hands-on + Frequent + Multiple/day -> 100, High-Effort", () => {
    const result = computeEffortScore({
      services_desired: [
        "investment_management",
        "financial_retirement_planning",
        "tax_estate_planning",
        "equity_comp",
        "exit_planning",
        "philanthropy",
        "other",
      ],
      involvement: "hands_on",
      contact_frequency: "frequent",
      checking_frequency: "multi_daily",
    });
    // Raw services sum is 30 (0 + 5 x 6 non-IM services), capped at 25.
    expect(result.servicesScore).toBe(25);
    expect(result.involvementScore).toBe(25);
    expect(result.contactFrequencyScore).toBe(25);
    expect(result.accountCheckingScore).toBe(25);
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

test.describe("AUM score and axis (range-based, not a dollar figure)", () => {
  test("all six ranges resolve to the expected score, label, and tier", () => {
    expect(computeAumAxis({ investable_assets: "lt_500k" })).toEqual({
      aumBucket: "lt_500k",
      aumRangeLabel: "Under $500,000",
      aumScore: 15,
      aumTier: "Low-AUM",
    });
    expect(computeAumAxis({ investable_assets: "500k_1M" })).toEqual({
      aumBucket: "500k_1M",
      aumRangeLabel: "$500,000 – $1,000,000",
      aumScore: 40,
      aumTier: "Low-AUM",
    });
    expect(computeAumAxis({ investable_assets: "1M_2.5M" })).toEqual({
      aumBucket: "1M_2.5M",
      aumRangeLabel: "$1,000,000 – $2,500,000",
      aumScore: 60,
      aumTier: "High-AUM",
    });
    expect(computeAumAxis({ investable_assets: "2.5M_5M" })).toEqual({
      aumBucket: "2.5M_5M",
      aumRangeLabel: "$2,500,000 – $5,000,000",
      aumScore: 75,
      aumTier: "High-AUM",
    });
    expect(computeAumAxis({ investable_assets: "5M_10M" })).toEqual({
      aumBucket: "5M_10M",
      aumRangeLabel: "$5,000,000 – $10,000,000",
      aumScore: 88,
      aumTier: "High-AUM",
    });
    expect(computeAumAxis({ investable_assets: "gt_10M" })).toEqual({
      aumBucket: "gt_10M",
      aumRangeLabel: "Over $10,000,000",
      aumScore: 100,
      aumTier: "High-AUM",
    });
  });

  test("quadrant boundary: $500K-$1M is Low-AUM, $1M-$2.5M is High-AUM", () => {
    expect(classifyAumTier("500k_1M")).toBe("Low-AUM");
    expect(classifyAumTier("1M_2.5M")).toBe("High-AUM");
  });

  test("missing or unrecognized range defaults to score 0 / Low-AUM, not a crash", () => {
    expect(computeAumAxis({})).toMatchObject({ aumScore: 0, aumTier: "Low-AUM", aumRangeLabel: "" });
    expect(computeAumAxis({ investable_assets: "not_a_real_range" })).toMatchObject({
      aumScore: 0,
      aumTier: "Low-AUM",
      aumRangeLabel: "",
    });
    expect(classifyAumTier("")).toBe("Low-AUM");
    expect(classifyAumTier("not_a_real_range")).toBe("Low-AUM");
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
      services_desired: ["financial_retirement_planning", "tax_estate_planning"],
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
      services_desired: ["financial_retirement_planning", "tax_estate_planning", "equity_comp"],
      involvement: "hands_on",
      contact_frequency: "frequent",
      checking_frequency: "multi_daily",
    });
    expect(highAumHighEffort.quadrant).toBe("High-AUM, High-Effort");
  });
});
