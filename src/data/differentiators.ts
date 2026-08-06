export interface Differentiator {
  title: string;
  description: string;
}

/**
 * The three "more ways we're different" boxes (excludes Reciprocity for
 * All, which has its own dedicated treatment via reciprocityByContract
 * below).
 */
export const differentiators: Differentiator[] = [
  {
    title: "Invested Together",
    description:
      "Our founders are clients number one and two. Their assets are managed by the firm with the same duty, thought, and care as your own and they pay fees like everyone else.",
  },
  {
    title: "Modern Technology",
    description:
      "Many established firms have your information scattered across legacy platforms. We've adopted a modern client platform — a one-stop shop for your financial information that reduces errors and saves your time.",
  },
  {
    title: "Fair & Transparent Fees",
    description:
      "Many of our competitors rely on opaque, convoluted fee structures. We keep things transparent and simple: you pay one fee to cover all services.",
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
        "No additional investment. No minimum AUM or account size. A benefit exclusively for clients.",
    },
  ] as ReciprocityPoint[],
};
