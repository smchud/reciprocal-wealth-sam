export interface FAQ {
  question: string;
  answer: string;
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
    question: "What do you mean by Reciprocity For All?",
    answer:
      "Reciprocity For All is a codified, contractual entitlement awarded to each client that sticks with Reciprocal until a sale. If the firm is ever sold, 20% of net cash proceeds is reserved exclusively for clients — no additional investment, no minimum AUM or account size required.",
    answerLink: {
      prefix: "For more information, download our white paper",
      label: "here",
      // Placeholder pending the finalized white-paper PDF — Sam is
      // finalizing this week; upload to public/documents/ and this path
      // will resolve once the file lands.
      href: "/documents/reciprocal-wealth-white-paper.pdf",
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
];
