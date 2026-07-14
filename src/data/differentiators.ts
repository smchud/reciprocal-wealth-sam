export interface Differentiator {
  title: string;
  description: string;
}

export const differentiators: Differentiator[] = [
  {
    title: "Conflict-free advice",
    description:
      "As a fee-only investment advisor, we are bound by a fiduciary obligation to our clients — meaning your interests are always at the fore. Unlike broker dealers who are incented to sell you investment products that may not be in your best interest, our only incentive is to do what's right for you.",
  },
  {
    title: "Investing together",
    description:
      "We are clients number one and two. Our assets are managed by the firm with the same duty, thought, and care as your own — and we pay fees just like everyone else.",
  },
  {
    title: "Modern technology",
    description:
      "Established investment firms often have information scattered across multiple legacy platforms. By contrast, we've adopted the most modern client platform, creating a one-stop shop for all your financial information — reducing the risk of errors and ensuring your valuable time is spent efficiently.",
  },
  {
    title: "Fair & transparent fees",
    description:
      "Unlike other firms with opaque, convoluted fee structures, we make things transparent and simple: you pay one fee to cover all services.",
  },
  {
    title: "The Client Pool",
    description:
      "Our unique Client Pool acts like a \"trade kicker\" in sports. If we ever sell our interests in the firm to another party, you receive compensation in line with your share of our assets under management — a tangible way we put our money where our mouth is.",
  },
];

export interface ClientPoolPoint {
  title: string;
  description: string;
}

/** Shared content for The Client Pool sections (home + Why Reciprocal). */
export const clientPool = {
  label: "The Client Pool",
  heading: "Invested, literally.",
  tagline: "The first framework of its kind in wealth management.",
  stat: "20%",
  statDescription: "of the net cash proceeds from a sale of the firm",
  statLabel: "Reserved for clients",
  points: [
    {
      title: "True reciprocity",
      description:
        "If the firm is ever sold, a pool of proceeds will be distributed to clients. Everyone reaps a share of the benefits.",
    },
    {
      title: "Participation right",
      description:
        "A codified, contractual entitlement \u2014 specific to each client \u2014 to a share of proceeds if Reciprocal undergoes a sale transaction.",
    },
    {
      title: "No strings attached",
      description:
        "No additional investment. No minimum AUM or account size. No penalty for declining consent. A benefit exclusively for clients.",
    },
  ] as ClientPoolPoint[],
};
