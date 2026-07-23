export interface FAQ {
  question: string;
  answer: string;
  cta?: { label: string; href: string };
}

export const faqs: FAQ[] = [
  {
    question: "How do I become a client?",
    answer:
      "Start with our intake questionnaire — about 15 minutes covering your goals, finances, and how you think about risk. We'll review your answers and reach out within two business days to schedule a first meeting.",
    cta: { label: "Start the questionnaire", href: "/get-started" },
  },
  {
    question: "How does the participation right work?",
    answer:
      "Reciprocity by Contract is a codified, contractual entitlement awarded to each client that sticks with Reciprocal until a sale. If the firm is ever sold, 20% of net cash proceeds is reserved exclusively for clients — no additional investment, no minimum AUM or account size required.",
  },
  {
    question: "Where are you based?",
    answer: "We are based in the suburbs of Boston, MA.",
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer financial planning, investment management, retirement planning, and tax planning. That means assessing your current and future financial prospects, defining personalized goals, constructing a portfolio to match your risk tolerance, guiding you through retirement accounts, and using strategies like tax-loss harvesting to reduce your tax burden.",
  },
  {
    question: "What is your fee structure?",
    answer:
      "We have a transparent fee structure that bills monthly at a percentage of assets under management.",
  },
  {
    question: "How often do you meet with clients?",
    answer:
      "We meet with clients on an as-requested basis. If we don't hear from you often, we typically reach out about once per quarter to update you on performance and talk about whatever is on your mind.",
  },
  {
    question: "Is there a white paper I can read first?",
    // Placeholder pending the gated white-paper download - do not wire up a
    // gated form until Sam confirms the piece and the flow.
    answer:
      "We're finalizing a downloadable overview of our approach. In the meantime, reach out and we're happy to send it directly.",
  },
  {
    question: "How do I access my account?",
    answer:
      "Use our dedicated client portal to access all of your accounts. Click the Client Portal link at the top of the page to get started.",
  },
];
