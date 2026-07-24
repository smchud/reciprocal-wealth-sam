export interface Differentiator {
  title: string;
  description: string;
}

/**
 * The three "more ways we're different" boxes (excludes Reciprocity For
 * All, which has its own dedicated treatment via reciprocityByContract
 * below).
 */
export const differentiators: Differentiator[] = [
  {
    title: "Invested Together",
    description:
      "Our founders are clients number one and two. Their assets are managed by the firm with the same duty, thought, and care as your own — and they pay fees just like everyone else.",
  },
  {
    title: "Modern technology",
    description:
      "Many established firms have your information scattered across legacy platforms. We've adopted a modern client platform — a one-stop shop for your financial information that reduces errors and saves your time.",
  },
  {
    title: "Fair & transparent fees",
    description:
      "Many of our competitors rely on opaque, convoluted fee structures. We keep things transparent and simple: you pay one fee to cover all services.",
  },
];

export interface ReciprocityPoint {
  title: string;
  description: string;
}

/** Shared content for the Reciprocity For All sections (home + Why Reciprocal). */
export const reciprocityByContract = {
  label: "Reciprocity For All",
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
        "A codified, contractual entitlement awarded to each client that sticks with Reciprocal until the sale.",
    },
    {
      title: "No Strings Attached",
      description:
        "No additional investment. No minimum AUM or account size. A benefit exclusively for clients.",
    },
  ] as ReciprocityPoint[],
};
