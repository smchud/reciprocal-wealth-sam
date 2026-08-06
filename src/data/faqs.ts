export interface FAQ {
  question: string;
  /** A single paragraph, or an array rendered as separate paragraphs. */
  answer: string | string[];
  cta?: { label: string; href: string };
  /** Inline link appended to the end of the answer paragraph (e.g. "...download our white paper here."). */
  answerLink?: { prefix: string; label: string; href: string; suffix?: string };
}

export const faqs: FAQ[] = [
  {
    question: "How do I become a client?",
    answer:
      "Start with our intake questionnaire — about 15 minutes covering your goals, finances, and how you think about risk. We'll review your answers and reach out within two business days to schedule a first meeting.",
    cta: { label: "Start the questionnaire", href: "/get-started" },
  },
  {
    question: "What do you mean by Reciprocity for All?",
    answer:
      "Reciprocity for All is a codified, contractual entitlement awarded to each client that sticks with Reciprocal until a sale. If the firm is ever sold, 20% of net cash proceeds is reserved exclusively for clients — no additional investment, no minimum AUM or account size required.",
    answerLink: {
      prefix: "For more information, download our white paper",
      label: "here",
      href: "/why-reciprocal#white-paper",
      suffix: ".",
    },
  },
  {
    question: "Where are you based?",
    answer: "We are based in the suburbs of Boston, MA.",
  },
  {
    question: "What is your fee structure?",
    answer:
      "We have a transparent fee structure that bills monthly at a percentage of assets under management. For more information, please contact us at",
    answerLink: {
      prefix: "",
      label: "info@reciprocalwealth.com",
      href: "mailto:info@reciprocalwealth.com",
      suffix: ".",
    },
  },
  {
    question: "How often do you meet with clients?",
    answer:
      "We meet with clients on an as-requested basis. If we don't hear from you often, we typically reach out about once per quarter to update you on performance and talk about whatever is on your mind.",
  },
  {
    question: "How do I access my account?",
    answer:
      "Use our dedicated client portal to access all of your accounts. Click the Client Login link at the top of the page to get started.",
  },
  {
    question: "What is Altruist and what do they do?",
    answer: [
      "Altruist is our custodian — the firm that actually holds your accounts. Founded in 2018, they now serve more than 6,000 advisors and rank among the largest custodians in the country by advisors served.",
      "Reciprocal Wealth is a registered investment adviser. We build and manage your portfolio, but we never take possession of your money. Your assets are held in accounts in your name at Altruist Financial LLC, a member of FINRA and SIPC. That separation is deliberate and it's the industry standard: we can place trades and deduct the agreed-upon fee, and that's the extent of it. We cannot withdraw your funds or move them anywhere you haven't authorized.",
      "Altruist is also where you log in. Your statements, tax documents, balances, and performance all live in the Altruist client portal, which you can reach from the Client Portal link at the top of this page.",
    ],
  },
  {
    question: "Can you manage my retirement accounts for me?",
    answer: [
      "Yes, in most cases we can. IRAs and rollover IRAs are straightforward. They're held at Altruist alongside your other accounts and managed the same way. Your 401(k), 403(b), or similar employer plan works differently, because it stays with your employer's plan provider. Nothing moves and nothing is rolled over. We use a platform called Pontera, which gives us a secure way to place trades inside the account on your behalf, so that plan is managed as part of your overall strategy rather than drifting on its own.",
      "You authorize the connection yourself. We never see or hold your login credentials. Pontera is not a custodian, a broker-dealer, or an investment adviser; it's the secure bridge between your plan and us. Every investment decision remains ours, under the same agreement that governs your other accounts.",
      "Not every plan provider supports this. We'll confirm whether yours does before including your workplace plan in our management.",
    ],
  },
];
