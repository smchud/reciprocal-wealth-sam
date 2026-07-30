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
  Conditional,
  QuestionBlock,
} from "./fields";

const PRIORITIES_OPTIONS = [
  { value: "retire_comfortably", label: "Retire comfortably and on my own timeline" },
  { value: "retire_early", label: "Retire early or step back from full-time work" },
  { value: "education", label: "Children's education funding" },
  { value: "home", label: "Buying or upgrading a home" },
  { value: "second_home", label: "Buying a second home or investment property" },
  { value: "business", label: "Starting or investing in a business" },
  { value: "charity", label: "Charitable giving" },
  { value: "inheritance_to_kids", label: "Leaving a meaningful inheritance to my children" },
  { value: "caregiving", label: "Caring for aging parents or other family" },
  { value: "other", label: "Other" },
];

const TIME_HORIZON_OPTIONS = [
  { value: "lt_3", label: "Less than 3 years" },
  { value: "3_5", label: "3–5 years" },
  { value: "5_10", label: "5–10 years" },
  { value: "10_20", label: "10–20 years" },
  { value: "gt_20", label: "20+ years" },
];

const CHARITABLE_GIVING_OPTIONS = [
  { value: "none", label: "None at the moment" },
  { value: "lt_5k", label: "Under $5,000" },
  { value: "5k_25k", label: "$5,000 – $25,000" },
  { value: "25k_100k", label: "$25,000 – $100,000" },
  { value: "gt_100k", label: "Over $100,000" },
];

interface SectionProps {
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export default function Section4({ data, setField }: SectionProps) {
  const priorities = getArr(data, "priorities");
  const rankedPriorities: Option[] = priorities
    .map((v) => PRIORITIES_OPTIONS.find((o) => o.value === v))
    .filter((o): o is Option => Boolean(o));

  return (
    <div>
      <QuestionBlock>
        <CheckboxGroup
          name="priorities"
          label="Which of these are priorities for you?"
          help="Select all that apply."
          value={priorities}
          onChange={setField}
          options={PRIORITIES_OPTIONS}
        />
        <Conditional show={priorities.includes("other")}>
          <TextField
            name="priorities_other"
            label="Please specify"
            value={getStr(data, "priorities_other")}
            onChange={setField}
          />
        </Conditional>
        <Conditional show={rankedPriorities.length > 1}>
          <RankOrderField
            name="priorities"
            label="Rank these in order of importance to you"
            help="Your #1 priority helps us understand what matters most."
            items={rankedPriorities}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="time_horizon"
          label="When will you need to start drawing on the bulk of these investments?"
          value={getStr(data, "time_horizon")}
          onChange={setField}
          options={TIME_HORIZON_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <TextAreaField
          name="major_expenditures"
          label="Are you anticipating any major expenditures in the next 3–5 years? If so, what are they?"
          help="Home purchase or renovation, tuition, a wedding, a business investment, a sabbatical — anything sizeable enough to plan around."
          value={getStr(data, "major_expenditures")}
          onChange={setField}
        />
      </QuestionBlock>

      <QuestionBlock>
        <TextAreaField
          name="nonprofit_involvement"
          label="Are you or any of your immediate family members involved in any non-profit organizations?"
          help="Board roles, advisory roles, volunteering. Optional names if you'd like to share."
          value={getStr(data, "nonprofit_involvement")}
          onChange={setField}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="charitable_giving"
          label="Approximate annual charitable giving"
          value={getStr(data, "charitable_giving")}
          onChange={setField}
          options={CHARITABLE_GIVING_OPTIONS}
        />
      </QuestionBlock>
    </div>
  );
}
