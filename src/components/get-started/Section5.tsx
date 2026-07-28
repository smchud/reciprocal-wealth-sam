"use client";

import {
  IntakeData,
  getStr,
  getArr,
  TextField,
  TextAreaField,
  RadioGroup,
  CheckboxGroup,
  ScaleField,
  Conditional,
  QuestionBlock,
} from "./fields";

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner — limited experience beyond a 401(k)" },
  { value: "some", label: "Some experience — I've made my own investment decisions" },
  { value: "experienced", label: "Experienced — actively managed a portfolio across asset classes for years" },
  { value: "sophisticated", label: "Sophisticated — I've worked with private investments, options, or alternatives" },
];

const INSTRUMENTS_OPTIONS = [
  { value: "index", label: "Index funds / ETFs" },
  { value: "stocks", label: "Individual stocks" },
  { value: "bonds", label: "Bonds or bond funds" },
  { value: "mutual", label: "Mutual funds (actively managed)" },
  { value: "real_estate", label: "Real estate / REITs" },
  { value: "options", label: "Options or other derivatives" },
  { value: "pe_vc_hf", label: "Private equity / venture capital / hedge funds" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "cef", label: "Closed-end funds (CEFs)" },
  { value: "none", label: "None of the above" },
];

const CHECKING_FREQUENCY_OPTIONS = [
  { value: "multi_daily", label: "Multiple times a day" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually or less" },
];

const INVOLVEMENT_OPTIONS = [
  { value: "hands_off", label: "Hands-off — I want a trusted advisor to handle it" },
  { value: "informed", label: "Informed but delegated — I want to understand decisions but not make them" },
  { value: "collaborative", label: "Collaborative — I want to be part of major decisions" },
  { value: "hands_on", label: "Hands-on — I want to drive decisions with advisor input" },
];

const PRIOR_ADVISOR_OPTIONS = [
  { value: "self", label: "Self-managed" },
  { value: "another_advisor", label: "Another advisor or advisory firm" },
  { value: "employer_plan", label: "Employer plan only (401(k), 403(b))" },
  { value: "robo", label: "Robo-advisor or automated platform" },
  { value: "family", label: "A family member or friend" },
  { value: "other", label: "Other" },
];

const PRIOR_DISSATISFACTION_OPTIONS = [
  { value: "responsiveness", label: "Lack of responsiveness" },
  { value: "contact", label: "Lack of contact / communication" },
  { value: "inaction", label: "Lack of action; left money on the table" },
  { value: "advice", label: "Poor investment advice" },
  { value: "returns", label: "Poor returns vs. market" },
  { value: "distrust", label: "Distrust" },
  { value: "na", label: "N/A — no previous advisor" },
  { value: "other", label: "Other" },
];

interface SectionProps {
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export default function Section5({ data, setField }: SectionProps) {
  const selfConfidence = getStr(data, "self_confidence");
  const priorAdvisor = getArr(data, "prior_advisor");

  return (
    <div>
      <QuestionBlock>
        <RadioGroup
          name="experience"
          label="How would you describe your investing experience?"
          value={getStr(data, "experience")}
          onChange={setField}
          options={EXPERIENCE_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <ScaleField
          name="self_confidence"
          label="Honestly, how confident are you in managing your investments yourself?"
          value={selfConfidence}
          onChange={setField}
          minLabel="Not confident"
          maxLabel="Very confident"
        />
        <Conditional show={selfConfidence === "4" || selfConfidence === "5"}>
          <TextAreaField
            name="advisor_expectations"
            label="What are you looking for from an investment advisor?"
            value={getStr(data, "advisor_expectations")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="instruments"
          label="Which of these have you owned or used?"
          help="Select all that apply."
          value={getArr(data, "instruments")}
          onChange={setField}
          options={INSTRUMENTS_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="checking_frequency"
          label="How often do you check the value of your investment accounts?"
          value={getStr(data, "checking_frequency")}
          onChange={setField}
          options={CHECKING_FREQUENCY_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="involvement"
          label="How involved do you want to be in day-to-day investment decisions?"
          value={getStr(data, "involvement")}
          onChange={setField}
          options={INVOLVEMENT_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="prior_advisor"
          label="Who was managing these assets before you decided to look at Reciprocal Wealth?"
          help="Select all that apply."
          value={priorAdvisor}
          onChange={setField}
          options={PRIOR_ADVISOR_OPTIONS}
        />
        <Conditional show={priorAdvisor.includes("another_advisor")}>
          <TextField
            name="prior_advisor_name"
            label="What is the name of the advisor's business?"
            value={getStr(data, "prior_advisor_name")}
            onChange={setField}
          />
        </Conditional>
        <Conditional show={priorAdvisor.includes("other")}>
          <TextField
            name="prior_advisor_other"
            label="Please specify"
            value={getStr(data, "prior_advisor_other")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <CheckboxGroup
          name="prior_dissatisfaction"
          label="Which of these, if any, contributed to dissatisfaction with your previous arrangement?"
          help="Select all that apply."
          value={getArr(data, "prior_dissatisfaction")}
          onChange={setField}
          options={PRIOR_DISSATISFACTION_OPTIONS}
        />
      </QuestionBlock>
    </div>
  );
}
