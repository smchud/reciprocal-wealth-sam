export interface Differentiator {
  title: string;
  description: string;
  /**
   * True when the card states the 20% figure and therefore needs the
   * eligibility-criteria footnote marker next to its title.
   */
  footnote?: boolean;
}

/**
 * The three "How We Differ" items that lead the home-page section and the
 * Why Reciprocal page. Reciprocity for All (reciprocityByContract below)
 * follows them, since the third item introduces it.
 */
export const differentiators: Differentiator[] = [
  {
    title: "You learn.",
    description:
      "Our clients are smart, accomplished people who want to understand what’s happening with their money even if they don’t have time to manage it. So we don’t make decisions for you and tell you later. We lay out the options with their trade-offs and explain the thinking. This not only builds your financial acumen but also your confidence in our actions.",
  },
  {
    title: "You won’t get handed off.",
    description:
      "You work with the principals from day one. When you call, we answer, always. We’ve deliberately built the firm so that as it grows, every client keeps the same dedicated time and attention.",
  },
  {
    title: "You share in our success.",
    description:
      "If we ever sell the firm — at retirement or otherwise — 20% of the net cash proceeds go to our clients. Each client’s share reflects both assets with the firm and years with the firm, so the people who helped us grow and stayed with us are recognized for it. This is written into every client agreement. It costs you nothing and asks nothing of you.",
    footnote: true,
  },
];

export interface ReciprocityPoint {
  title: string;
  description: string;
}

export interface SnapshotRow {
  label: string;
  description: string;
}

/**
 * The "Snapshot: Participation Right" table from page 3 of the Reciprocity
 * For All white paper (2026.08.04 version) - rendered in the "More about
 * Reciprocity for All" section of the Why Reciprocal page. Keep the wording
 * in sync with the white paper.
 */
export const participationRightSnapshot: SnapshotRow[] = [
  {
    label: "When It Applies",
    description:
      "Only upon the closing of a Qualifying Event, meaning: a sale of all or materially all of the assets or equity of Reciprocal Wealth, LLC.",
  },
  {
    label: "Each Client's Allocation",
    description:
      "Determined by a formula, which factors in both assets under management and duration of tenure with the firm.",
  },
  {
    label: "What It Costs",
    description: "Nothing. Advisory fees are identical with or without this provision.",
  },
  {
    label: "What Clients Must Do",
    description: "Nothing. No referral. No promotion. No additional commitment.",
  },
  {
    label: "If a Client Leaves the Firm",
    description:
      "The client's participation right ends when the advisory agreement ends. There is no penalty for leaving — and no lock-up or claw-back.",
  },
  {
    label: "Timeline & Guarantee",
    description:
      "None. A sale may or may not ever occur. The right has no market value. It cannot be sold or transferred. It is not an investment.",
  },
];

/** Shared content for the Reciprocity for All sections (home + Why Reciprocal). */
export const reciprocityByContract = {
  label: "Reciprocity for All",
  tagline: "The first framework of its kind in wealth management.",
  stat: "20%",
  statDescription: "of the net cash proceeds from a sale of the firm",
  statLabel: "Reserved for clients",
  points: [
    {
      title: "True Reciprocity",
      description:
        "If the firm is ever sold, 20% of net cash proceeds is reserved, exclusively for clients.",
    },
    {
      title: "Participation Right",
      description:
        "A codified, contractual entitlement awarded to each client.",
    },
    {
      title: "No Strings Attached",
      description:
        "No additional investment. Not contingent on referrals or promotion.",
    },
  ] as ReciprocityPoint[],
};

/**
 * Eligibility criteria disclosure (verbatim from the white paper's
 * "Eligibility Criteria" section) — rendered in small text wherever the
 * Reciprocity for All benefit is described.
 */
export const eligibilityDisclosure =
  "A client qualifies as an Eligible Participant if, through the closing of the Qualifying Event, the client: (i) has been with the firm for at least three (3) monthly billing periods; (ii) maintains more than $25,000 in assets under management with the firm; and (iii) has no outstanding and unpaid invoices.";
