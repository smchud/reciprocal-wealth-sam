/**
 * Human-readable question text and option labels for the founders' PDF
 * summary. Mirrors the copy in src/components/get-started/Section*.tsx -
 * kept as a separate lookup here (rather than importing from the client
 * components) so this module stays server-only and lean for PDF rendering.
 */

export interface FieldMeta {
  label: string;
  options?: Record<string, string>;
}

const industryOptions: Record<string, string> = {
  medicine: "Medicine / Healthcare",
  law: "Law",
  technology: "Technology",
  biotech: "Biotech / Pharma",
  cpg: "Consumer Packaged Goods",
  finance: "Finance / Banking",
  consulting: "Consulting / Professional Services",
  real_estate: "Real Estate",
  education: "Education",
  government: "Government / Public Sector",
  na_retired: "N/A — Retired",
  na_homemaker: "N/A — Homemaker",
  other: "Other",
};

const educationOptions: Record<string, string> = {
  hs: "High school",
  associate: "Associate degree",
  bachelor: "Bachelor's degree",
  master: "Master's degree",
  professional: "Professional degree (JD, MD, etc.)",
  doctorate: "Doctorate",
};

const likert5: Record<string, string> = {
  "1": "Strongly disagree",
  "2": "Disagree",
  "3": "Neutral",
  "4": "Agree",
  "5": "Strongly agree",
};

export const FIELD_META: Record<string, FieldMeta> = {
  // Section 1
  first_name: { label: "First name" },
  middle_name: { label: "Middle name" },
  last_name: { label: "Last name" },
  dob: { label: "Date of birth" },
  email: { label: "Email" },
  phone_type: { label: "Phone type" },
  phone: { label: "Phone" },
  address_street: { label: "Street address" },
  address_city: { label: "City" },
  address_state: { label: "State" },
  address_zip: { label: "ZIP" },
  address_country: { label: "Country" },
  marital_status: {
    label: "Marital / partnership status",
    options: {
      single: "Single",
      married: "Married or domestic partnership",
      divorced: "Divorced or separated",
      widowed: "Widowed",
      no_say: "Prefer not to say",
    },
  },
  partner_first_name: { label: "Partner first name" },
  partner_middle_name: { label: "Partner middle name" },
  partner_last_name: { label: "Partner last name" },
  partner_dob: { label: "Partner date of birth" },
  partner_email: { label: "Partner email" },
  partner_phone: { label: "Partner phone" },
  partner_coclient: {
    label: "Will partner be a co-client?",
    options: { yes: "Yes — joint clients", no: "No — sole client" },
  },
  has_children: {
    label: "Children or other dependents",
    options: { none: "None", yes: "Yes", planning: "Planning to in the next few years" },
  },
  hobbies: {
    label: "Hobbies & passions",
    options: {
      golf: "Golf",
      travel: "Travel",
      dining: "Dining out",
      live_events_sports: "Live events — sports",
      live_events_music: "Live events — music",
      live_events_theater: "Live events — theater",
      exercise: "Exercise",
      outdoors: "Outdoors & fitness",
      arts: "Arts & culture",
      family: "Family time",
      other: "Other",
    },
  },
  hobbies_other: { label: "Hobbies — other, specified" },
  life_stage: {
    label: "Life stage",
    options: {
      building: "Building wealth",
      established: "Established",
      preretirement: "Pre-retirement",
      retired: "Already retired",
    },
  },

  // Section 2
  occupation: { label: "Occupation / job title" },
  employer: { label: "Current employer" },
  industry: { label: "Industry", options: industryOptions },
  education: { label: "Highest level of education", options: educationOptions },
  partner_occupation: { label: "Partner occupation / job title" },
  partner_employer: { label: "Partner current employer" },
  partner_industry: { label: "Partner industry", options: industryOptions },
  partner_education: { label: "Partner highest level of education", options: educationOptions },
  income_sources: {
    label: "Household income source(s)",
    options: {
      salary: "Salary (W-2)",
      salary_bonus: "Salary plus annual bonus",
      equity: "Significant equity comp (RSUs, options, ESPP)",
      self_employed: "Self-employed / 1099 / partnership income",
      business_owner: "Business owner — distributions / K-1",
      carry: "Carry / deferred comp",
      retired: "Retired — drawing from portfolio / pension / Social Security",
      other: "Other",
    },
  },
  income_sources_other: { label: "Income source — other, specified" },
  equity_pct: {
    label: "% of compensation as equity",
    options: { lt_10: "Less than 10%", "10_25": "10–25%", "25_50": "25–50%", gt_50: "More than 50%" },
  },
  income_range: {
    label: "Approximate household annual income (pre-tax)",
    options: {
      lt_200: "Under $200,000",
      "200_350": "$200,000 – $349,999",
      "350_500": "$350,000 – $499,999",
      "500_750": "$500,000 – $749,999",
      "750_1M": "$750,000 – $1,000,000",
      gt_1M: "Over $1,000,000",
    },
  },
  income_stability: {
    label: "Expected income stability over the next 5 years",
    options: {
      very_stable: "Very stable",
      mostly_stable: "Mostly stable",
      variable: "Variable",
      uncertain: "Uncertain",
    },
  },
  retire_horizon: {
    label: "Expected time until stopping full-time work",
    options: {
      already: "Already retired",
      lt_5: "Within 5 years",
      "5_15": "5–15 years",
      "15_25": "15–25 years",
      gt_25: "25+ years",
      never: "Doesn't plan to fully retire",
    },
  },

  // Section 3
  investable_assets: {
    label: "Approximate investable assets",
    options: {
      lt_500k: "Under $500,000",
      "500k_1M": "$500,000 – $1,000,000",
      "1M_2.5M": "$1,000,000 – $2,500,000",
      "2.5M_5M": "$2,500,000 – $5,000,000",
      "5M_10M": "$5,000,000 – $10,000,000",
      gt_10M: "Over $10,000,000",
    },
  },
  assets_other_specify: { label: "Assets — 'Other', specified" },
  tax_cash_pct: { label: "Tax location — cash & equivalents %" },
  tax_taxable_pct: { label: "Tax location — taxable %" },
  tax_deferred_pct: { label: "Tax location — tax-deferred %" },
  tax_free_pct: { label: "Tax location — tax-free %" },
  liab_mortgage: { label: "Liability — mortgage" },
  liab_student: { label: "Liability — student loans" },
  liab_auto: { label: "Liability — auto / personal loans" },
  liab_cc: { label: "Liability — credit card debt" },
  emergency_fund: {
    label: "3–6 months of expenses in cash?",
    options: { yes: "Yes", partial: "Partially", no: "No", unsure: "Not sure" },
  },
  cash_balance: { label: "Approximate current cash balance" },
  savings_rate: {
    label: "% of gross household income saved annually",
    options: {
      lt_5: "Less than 5%",
      "5_10": "5–10%",
      "10_20": "10–20%",
      "20_30": "20–30%",
      gt_30: "More than 30%",
      retired: "Retired — drawing rather than saving",
    },
  },
  inheritance: {
    label: "Anticipating a meaningful inheritance/gift?",
    options: {
      yes_10: "Yes — within 10 years",
      yes_later: "Yes — 10+ years out",
      possible: "Possibly, uncertain",
      no: "No",
      no_say: "Prefer not to say",
    },
  },
  inheritance_magnitude: {
    label: "Approximate inheritance magnitude",
    options: {
      lt_250k: "Under $250,000",
      "250k_1M": "$250,000 – $1,000,000",
      "1M_5M": "$1,000,000 – $5,000,000",
      gt_5M: "Over $5,000,000",
      unknown: "Don't know / prefer not to say",
    },
  },

  // Section 4
  priorities: {
    label: "Priorities",
    options: {
      retire_comfortably: "Retire comfortably",
      retire_early: "Retire early",
      education: "Children's education funding",
      home: "Buying or upgrading a home",
      second_home: "Second home / investment property",
      business: "Starting or investing in a business",
      charity: "Charitable giving",
      inheritance_to_kids: "Leaving inheritance to children",
      caregiving: "Caring for aging parents/family",
      other: "Other",
    },
  },
  priorities_other: { label: "Priorities — other, specified" },
  top_goal: { label: "Single most important goal" },
  retirement_vision: { label: "Ideal retired life" },
  time_horizon: {
    label: "Time horizon to draw on investments",
    options: { lt_3: "Less than 3 years", "3_5": "3–5 years", "5_10": "5–10 years", "10_20": "10–20 years", gt_20: "20+ years" },
  },
  major_expenditures: { label: "Anticipated major expenditures" },
  specific_targets: { label: "Specific dollar amounts / dates" },
  nonprofit_involvement: { label: "Non-profit involvement" },
  charitable_giving: {
    label: "Approximate annual charitable giving",
    options: {
      none: "None at the moment",
      lt_5k: "Under $5,000",
      "5k_25k": "$5,000 – $25,000",
      "25k_100k": "$25,000 – $100,000",
      gt_100k: "Over $100,000",
    },
  },

  // Section 5
  experience: {
    label: "Investing experience",
    options: {
      beginner: "Beginner",
      some: "Some experience",
      experienced: "Experienced",
      sophisticated: "Sophisticated",
    },
  },
  self_confidence: { label: "Confidence managing investments themselves (1–5)" },
  advisor_expectations: { label: "What they're looking for from an advisor" },
  instruments: {
    label: "Instruments owned/used",
    options: {
      index: "Index funds / ETFs",
      stocks: "Individual stocks",
      bonds: "Bonds or bond funds",
      mutual: "Mutual funds (actively managed)",
      real_estate: "Real estate / REITs",
      options: "Options or other derivatives",
      pe_vc_hf: "Private equity / VC / hedge funds",
      crypto: "Cryptocurrency",
      cef: "Closed-end funds (CEFs)",
      none: "None of the above",
    },
  },
  checking_frequency: {
    label: "How often they check account values",
    options: {
      multi_daily: "Multiple times a day",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      quarterly: "Quarterly",
      annually: "Annually or less",
    },
  },
  involvement: {
    label: "Desired involvement in decisions",
    options: {
      hands_off: "Hands-off",
      informed: "Informed but delegated",
      collaborative: "Collaborative",
      hands_on: "Hands-on",
    },
  },
  prior_advisor: {
    label: "Who was managing these assets before",
    options: {
      self: "Self-managed",
      another_advisor: "Another advisor/firm",
      employer_plan: "Employer plan only",
      robo: "Robo-advisor",
      family: "Family member or friend",
      other: "Other",
    },
  },
  prior_advisor_name: { label: "Prior advisor's business name" },
  prior_advisor_other: { label: "Prior advisor — other, specified" },
  prior_dissatisfaction: {
    label: "Sources of dissatisfaction with prior arrangement",
    options: {
      responsiveness: "Lack of responsiveness",
      contact: "Lack of contact/communication",
      inaction: "Lack of action",
      advice: "Poor investment advice",
      returns: "Poor returns vs. market",
      distrust: "Distrust",
      na: "N/A — no previous advisor",
      other: "Other",
    },
  },

  // Section 6 (raw 1-5 Likert values; label maps below)
  risk_q32: {
    label: "Drawdown-selling trigger",
    options: {
      "1": "$950,000 (a 5% drop)",
      "2": "$900,000 (a 10% drop)",
      "3": "$800,000 (a 20% drop)",
      "4": "$700,000 (a 30% drop)",
      "5": "Wouldn't sell based on short-term losses",
    },
  },
  risk_q33: {
    label: "Preferred hypothetical portfolio",
    options: { "1": "A (lowest risk/return)", "2": "B", "3": "C", "4": "D (highest risk/return)" },
  },
  risk_q34: {
    label: "Reaction to a 20% market drop",
    options: { "1": "Sell", "2": "Sell some", "3": "Do nothing", "4": "Buy more" },
  },
  risk_q36: {
    label: "Volatility tolerance before affecting sleep/work",
    options: { "1": "~5%", "2": "~10%", "3": "~20%", "4": "~30%", "5": "Larger drawdowns wouldn't change behavior" },
  },
  risk_q37_1: { label: "Prefers modest predictable return over volatile higher one", options: likert5 },
  risk_q37_2: { label: "Would invest a windfall within a few months", options: likert5 },
  risk_q37_3: { label: "Sees downturns as opportunities, not threats", options: likert5 },
  risk_q37_4: { label: "Uncomfortable seeing account down 15% from peak", options: likert5 },
  risk_q38: {
    label: "Impact of a forced withdrawal during a downturn",
    options: { "1": "Catastrophic", "2": "Painful but manageable", "3": "Inconvenient", "4": "Not meaningful" },
  },

  // Section 7
  psy_p1: { label: "Judges advisor by performance targets net of fees", options: likert5 },
  psy_p2: { label: "Plan in place > last quarter's return", options: likert5 },
  psy_p3: { label: "Underperforming a benchmark would concern them", options: likert5 },
  psy_p4: { label: "Modest returns + on-track plan = a win", options: likert5 },
  psy_c1: { label: "Prefers advisor only reach out when important", options: likert5 },
  psy_c2: { label: "Regular check-ins build confidence", options: likert5 },
  psy_c3: { label: "Annoyed by frequent contact without news", options: likert5 },
  psy_c4: { label: "Seeing advisor's thinking regularly is part of the value", options: likert5 },
  contact_frequency: {
    label: "Desired contact frequency",
    options: { quarterly: "Quarterly", semi: "Twice a year", annual: "Annual + as-needed", frequent: "Monthly or more" },
  },
  contact_channel: {
    label: "Preferred communication channel(s)",
    options: { email: "Email", phone: "Phone", video: "Video call", in_person: "In-person", text: "Text/messaging" },
  },
  advisor_qualities: {
    label: "What matters in an advisor relationship (up to 3)",
    options: {
      trust: "Trust and integrity",
      expertise: "Deep technical expertise",
      clarity: "Clear, jargon-free communication",
      proactive: "Proactive outreach",
      responsive: "Responsive",
      tech: "Modern technology",
      aligned: "Aligned values",
      education: "Education",
      holistic: "Holistic view",
    },
  },
  investing_values: {
    label: "Investing values",
    options: {
      tax: "Tax efficiency",
      esg: "ESG / values-aligned",
      exclusions: "Avoid specific industries/companies",
      income: "Steady income",
      none: "None — best risk-adjusted return",
    },
  },
  values_notes: { label: "Investing values — notes" },
  prompt: { label: "What prompted looking for an advisor now" },
  referral_source: {
    label: "How they heard about Reciprocal Wealth",
    options: {
      personal: "Referral — friend/family/colleague",
      professional: "Referral — other professional",
      search: "Online search",
      social: "Social media / article",
      other: "Other",
    },
  },
  referral_name: { label: "Referral name" },
  other_notes: { label: "Anything else they'd like known" },
};

export function formatValue(fieldName: string, value: unknown): string {
  if (value === undefined || value === null) return "";
  const meta = FIELD_META[fieldName];
  const resolve = (raw: string) => (meta?.options ? meta.options[raw] ?? raw : raw);
  if (Array.isArray(value)) {
    return value.map((v) => resolve(String(v))).join(", ");
  }
  return resolve(String(value));
}

export function fieldLabel(fieldName: string): string {
  return FIELD_META[fieldName]?.label ?? fieldName;
}
