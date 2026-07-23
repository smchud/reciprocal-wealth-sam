// Value -> label maps for the plain-language recap on the completion screen.
// Recap only ever echoes the client's own selections back to them verbatim -
// no scoring or interpretation.
export const PRIORITIES_LABELS: Record<string, string> = {
  retire_comfortably: "Retire comfortably and on my own timeline",
  retire_early: "Retire early or step back from full-time work",
  education: "Children's education funding",
  home: "Buying or upgrading a home",
  second_home: "Buying a second home or investment property",
  business: "Starting or investing in a business",
  charity: "Charitable giving",
  inheritance_to_kids: "Leaving a meaningful inheritance to my children",
  caregiving: "Caring for aging parents or other family",
  other: "Other",
};

export const TIME_HORIZON_LABELS: Record<string, string> = {
  lt_3: "Less than 3 years",
  "3_5": "3–5 years",
  "5_10": "5–10 years",
  "10_20": "10–20 years",
  gt_20: "20+ years",
};

export const SECTION_ORDER = ["consent", "welcome", "1", "2", "3", "4", "5", "6", "7", "complete"] as const;
export type StepId = (typeof SECTION_ORDER)[number];

export const SECTION_META: Record<string, { title: string; subtitle: string }> = {
  "1": {
    title: "Your Details",
    subtitle: "Basic information so we can stay in touch and tailor our planning to your life stage.",
  },
  "2": {
    title: "Career & Income",
    subtitle:
      "Your career shapes income stability, benefits, and often the kind of planning that will move the needle for you.",
  },
  "3": {
    title: "Your Financial Picture",
    subtitle:
      "Approximate figures are perfectly fine. We'll firm these up together — what matters here is the shape of things.",
  },
  "4": {
    title: "Your Goals & Time Horizon",
    subtitle:
      "What are you actually investing for? Specifics help us match dollars to goals rather than chasing returns in the abstract.",
  },
  "5": {
    title: "Your Investing Background",
    subtitle: "This helps us know how much to explain, what to skip, and where you'd like to learn more.",
  },
  "6": {
    title: "How You Think About Risk",
    subtitle:
      "There are no right or wrong answers — we're trying to find the portfolio you can live with through good markets and bad. Most people overestimate how much risk they want when markets are calm and underestimate it when markets fall. Honest answers here protect you from yourself.",
  },
  "7": {
    title: "How You'd Like to Work With Us",
    subtitle: "Final stretch — this helps us match the rhythm and style of our relationship to your preferences.",
  },
};
