"use client";

import {
  IntakeData,
  getStr,
  getArr,
  Option,
  TextField,
  TextAreaField,
  RadioGroup,
  CheckboxGroup,
  RankOrderField,
  LikertGrid,
  QuestionBlock,
  Conditional,
} from "./fields";

const SERVICES_DESIRED_OPTIONS = [
  { value: "investment_management", label: "Investment management" },
  { value: "financial_retirement_planning", label: "Financial and/or retirement planning" },
  { value: "tax_estate_planning", label: "Tax / estate planning" },
  { value: "equity_comp", label: "Equity compensation planning / management" },
  { value: "exit_planning", label: "Exit planning for my business" },
  { value: "philanthropy", label: "Philanthropy / charitable giving" },
  { value: "other", label: "Other" },
];

const PSY_STATEMENTS = [
  { name: "psy_p1", label: "I would judge my advisor primarily by whether my portfolio meets or exceeds reasonable performance targets net of fees." },
  { name: "psy_p2", label: "Knowing I have a thoughtful financial plan in place gives me more peace of mind than knowing what my portfolio returned last quarter." },
  { name: "psy_p3", label: "Underperforming a relevant benchmark for an extended period would seriously concern me, even if my plan was technically on track." },
  { name: "psy_p4", label: "If my advisor told me my returns were modest but my plan was firmly on track to meet my goals, I'd consider that a win." },
  { name: "psy_c1", label: "Once I've decided to work with an advisor, I'd prefer they only reach out when there's something genuinely important to discuss." },
  { name: "psy_c2", label: "Regular check-ins from my advisor — even when little has changed — help me feel confident in the relationship." },
  { name: "psy_c3", label: "I'd be annoyed if my advisor contacted me frequently without substantive new information to share." },
  { name: "psy_c4", label: "Seeing how my advisor is thinking on a regular basis is part of what I'm paying for, not just the end results." },
];

const CONTACT_FREQUENCY_OPTIONS = [
  { value: "as_needed", label: "Only when I need help or want to check in" },
  { value: "annual", label: "Once a year, plus when something important comes up" },
  { value: "semi", label: "Twice a year is right" },
  { value: "quarterly", label: "Quarterly check-ins are plenty" },
  { value: "frequent", label: "Frequent contact — monthly or more" },
];

const CONTACT_CHANNEL_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "video", label: "Video call" },
  { value: "in_person", label: "In-person meetings" },
];

const ADVISOR_QUALITIES_OPTIONS = [
  { value: "trust", label: "Trust and integrity above all" },
  { value: "expertise", label: "Deep technical expertise" },
  { value: "clarity", label: "Clear, jargon-free communication" },
  { value: "proactive", label: "Proactive — you reach out to me, not the other way around" },
  { value: "responsive", label: "Responsive — you get back to me quickly" },
  { value: "tech", label: "Modern technology and easy digital access" },
  { value: "aligned", label: "Aligned values — you invest your own money the same way" },
  { value: "education", label: "Education — helping me understand the 'why'" },
  { value: "holistic", label: "Holistic view — my whole financial picture, not just investments" },
];

const INVESTING_VALUES_OPTIONS = [
  { value: "tax", label: "Tax efficiency is a top priority" },
  { value: "esg", label: "ESG / values-aligned investing matters to me" },
  { value: "exclusions", label: "I want to avoid specific industries or companies" },
  { value: "income", label: "I value steady income from my investments" },
  { value: "none", label: "None — invest for the best risk-adjusted return" },
];

const PROMPT_OPTIONS = [
  { value: "unhappy_advisor", label: "Unhappy with current advisor" },
  { value: "time_to_hire_help", label: "Time to get serious and hire help" },
  { value: "no_time_or_interest", label: "No longer have time or interest in doing it myself" },
  { value: "enough_liquid", label: "Finally have enough liquid to start investing" },
  { value: "other", label: "Other" },
];

const REFERRAL_SOURCE_OPTIONS = [
  { value: "personal", label: "Referral from a friend, family member, or colleague" },
  { value: "professional", label: "Referral from another professional (CPA, attorney, etc.)" },
  { value: "search", label: "Online search" },
  { value: "social", label: "Social media or article" },
  { value: "other", label: "Other" },
];

interface SectionProps {
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export default function Section7({ data, setField }: SectionProps) {
  const servicesDesired = getArr(data, "services_desired");
  const advisorQualities = getArr(data, "advisor_qualities");
  const rankedAdvisorQualities: Option[] = advisorQualities
    .map((v) => ADVISOR_QUALITIES_OPTIONS.find((o) => o.value === v))
    .filter((o): o is Option => Boolean(o));
  const prompt = getArr(data, "prompt");
  const referralSource = getStr(data, "referral_source");

  return (
    <div>
      <QuestionBlock>
        <CheckboxGroup
          name="services_desired"
          label="Which services are you looking for your financial adviser to provide?"
          help="Select all that apply."
          value={servicesDesired}
          onChange={setField}
          options={SERVICES_DESIRED_OPTIONS}
        />
        <Conditional show={servicesDesired.includes("other")}>
          <TextField
            name="services_desired_other"
            label="Please specify"
            value={getStr(data, "services_desired_other")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <LikertGrid
          label="A few statements about working with an advisor"
          help="There's no right answer — we're calibrating to your preferences, not testing you."
          statements={PSY_STATEMENTS}
          value={Object.fromEntries(PSY_STATEMENTS.map((s) => [s.name, getStr(data, s.name)]))}
          onChange={setField}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="contact_frequency"
          label="How often would you like to hear from us in normal conditions?"
          value={getStr(data, "contact_frequency")}
          onChange={setField}
          options={CONTACT_FREQUENCY_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="contact_channel"
          label="Preferred way(s) to communicate"
          help="Select all that apply."
          value={getArr(data, "contact_channel")}
          onChange={setField}
          options={CONTACT_CHANNEL_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="advisor_qualities"
          label="What matters to you in an advisor relationship?"
          help="Select up to 3."
          value={advisorQualities}
          onChange={setField}
          options={ADVISOR_QUALITIES_OPTIONS}
          maxSelect={3}
        />
        <Conditional show={rankedAdvisorQualities.length === 3}>
          <RankOrderField
            name="advisor_qualities"
            label="Now rank your top 3"
            items={rankedAdvisorQualities}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="investing_values"
          label="Are any of these meaningful to you in how your money is invested?"
          value={getArr(data, "investing_values")}
          onChange={setField}
          options={INVESTING_VALUES_OPTIONS}
        />
        <div className="mt-3">
          <TextAreaField
            name="values_notes"
            value={getStr(data, "values_notes")}
            onChange={setField}
            placeholder="Notes (optional)"
          />
        </div>
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="prompt"
          label="What prompted you to look for an advisor right now?"
          help="Select all that apply."
          value={prompt}
          onChange={setField}
          options={PROMPT_OPTIONS}
        />
        <Conditional show={prompt.includes("other")}>
          <TextField
            name="prompt_other"
            label="Please specify"
            value={getStr(data, "prompt_other")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="referral_source"
          label="How did you hear about Reciprocal Wealth?"
          value={referralSource}
          onChange={setField}
          options={REFERRAL_SOURCE_OPTIONS}
        />
        <Conditional show={referralSource === "personal"}>
          <TextField
            name="referral_name"
            value={getStr(data, "referral_name")}
            onChange={setField}
            placeholder="Who referred you? (if comfortable)"
          />
        </Conditional>
        <Conditional show={referralSource === "professional"}>
          <TextField
            name="referral_name"
            value={getStr(data, "referral_name")}
            onChange={setField}
            placeholder="Which professional, or their firm? (if comfortable)"
          />
        </Conditional>
        <Conditional show={referralSource === "other"}>
          <TextField
            name="referral_other"
            label="Please specify"
            value={getStr(data, "referral_other")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <TextAreaField
          name="other_notes"
          label="Anything else you'd like us to know about you?"
          value={getStr(data, "other_notes")}
          onChange={setField}
        />
      </QuestionBlock>
    </div>
  );
}
