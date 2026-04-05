export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "Where are you based?",
    answer:
      "We are based in the suburbs of Boston, MA.",
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer financial planning, investment management, retirement planning, and tax planning. That means assessing your current and future financial prospects, defining personalized goals, constructing a portfolio to match your risk tolerance, guiding you through retirement accounts, and using strategies like tax-loss harvesting to reduce your tax burden.",
  },
  {
    question: "What is your fee structure?",
    answer:
      "We have a transparent fee structure that bills monthly at a percentage of assets under management. We use a sliding scale so that there are no sudden changes resulting from shifts in tiers.",
  },
  {
    question: "What is the assignment provision?",
    answer:
      "If we sell our interests in the firm to another party, you will receive compensation in line with your share of our assets under management once you assign your assets to the new ownership. It acts like a \"trade kicker\" in sports — when a player is traded to another team, he receives a bump in salary in exchange for making the transition.",
  },
  {
    question: "How often do you meet with clients?",
    answer:
      "We meet with clients on an as-requested basis. If we don't hear from you often, we typically reach out about once per quarter to update you on performance and talk about whatever is on your mind.",
  },
  {
    question: "How do I transfer my assets to Reciprocal?",
    answer:
      "There are just a few forms to fill out, which won't take more than a few minutes of your time. We will walk you through the process step-by-step to ensure that everything is taken care of in one shot.",
  },
  {
    question: "How do I access my account?",
    answer:
      "Use our dedicated client portal to access all of your accounts. Click the Client Portal link at the top of the page to get started.",
  },
];
