"use client";

import {
  IntakeData,
  getStr,
  getArr,
  TextField,
  SelectField,
  RadioGroup,
  CheckboxGroup,
  Conditional,
  QuestionBlock,
  labelClass,
  subLabelClass,
} from "./fields";

const INDUSTRY_OPTIONS = [
  { value: "", label: "Select…" },
  { value: "medicine", label: "Medicine / Healthcare" },
  { value: "law", label: "Law" },
  { value: "technology", label: "Technology" },
  { value: "biotech", label: "Biotech / Pharma" },
  { value: "cpg", label: "Consumer Packaged Goods" },
  { value: "finance", label: "Finance / Banking" },
  { value: "consulting", label: "Consulting / Professional Services" },
  { value: "real_estate", label: "Real Estate" },
  { value: "education", label: "Education" },
  { value: "government", label: "Government / Public Sector" },
  { value: "na_retired", label: "N/A — Retired" },
  { value: "na_homemaker", label: "N/A — Homemaker" },
  { value: "other", label: "Other" },
];

const EDUCATION_OPTIONS = [
  { value: "hs", label: "High school" },
  { value: "associate", label: "Associate degree" },
  { value: "bachelor", label: "Bachelor's degree" },
  { value: "master", label: "Master's degree" },
  { value: "professional", label: "Professional degree (JD, MD, etc.)" },
  { value: "doctorate", label: "Doctorate" },
];

const INCOME_SOURCES_OPTIONS = [
  { value: "salary", label: "Salary (W-2)" },
  { value: "salary_bonus", label: "Salary plus annual bonus" },
  { value: "equity", label: "Significant equity comp (RSUs, options, ESPP)" },
  { value: "self_employed", label: "Self-employed / 1099 / partnership income" },
  { value: "business_owner", label: "Business owner — distributions / K-1" },
  { value: "carry", label: "Carry / deferred comp" },
  { value: "retired", label: "Retired — drawing from portfolio / pension / Social Security" },
  { value: "other", label: "Other" },
];

const INCOME_RANGE_OPTIONS = [
  { value: "lt_200", label: "Under $200,000" },
  { value: "200_350", label: "$200,000 – $349,999" },
  { value: "350_500", label: "$350,000 – $499,999" },
  { value: "500_750", label: "$500,000 – $749,999" },
  { value: "750_1M", label: "$750,000 – $1,000,000" },
  { value: "gt_1M", label: "Over $1,000,000" },
];

const INCOME_STABILITY_OPTIONS = [
  { value: "very_stable", label: "Very stable — predictable salary, secure employment" },
  { value: "mostly_stable", label: "Mostly stable — base is reliable, bonus/equity varies" },
  { value: "variable", label: "Variable — significantly tied to market or business performance" },
  { value: "uncertain", label: "Uncertain — anticipating a major change" },
];

const RETIRE_HORIZON_OPTIONS = [
  { value: "already", label: "Already retired" },
  { value: "lt_5", label: "Within 5 years" },
  { value: "5_15", label: "5–15 years" },
  { value: "15_25", label: "15–25 years" },
  { value: "gt_25", label: "25+ years / not anytime soon" },
  { value: "never", label: "I don't plan to fully retire" },
];

const EQUITY_PCT_OPTIONS = [
  { value: "lt_10", label: "Less than 10%" },
  { value: "10_25", label: "10–25%" },
  { value: "25_50", label: "25–50%" },
  { value: "gt_50", label: "More than 50%" },
];

interface SectionProps {
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export default function Section2({ data, setField }: SectionProps) {
  const maritalStatus = getStr(data, "marital_status");
  const incomeSources = getArr(data, "income_sources");

  return (
    <div>
      <QuestionBlock>
        <TextField
          name="occupation"
          label="Occupation / job title"
          value={getStr(data, "occupation")}
          onChange={setField}
          placeholder="N/A if retired"
        />
      </QuestionBlock>

      <QuestionBlock>
        <TextField
          name="employer"
          label="Current employer"
          value={getStr(data, "employer")}
          onChange={setField}
          placeholder="N/A if retired"
        />
      </QuestionBlock>

      <QuestionBlock>
        <SelectField
          name="industry"
          label="Industry"
          value={getStr(data, "industry")}
          onChange={setField}
          options={INDUSTRY_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="education"
          label="Highest level of education"
          value={getStr(data, "education")}
          onChange={setField}
          options={EDUCATION_OPTIONS}
        />
      </QuestionBlock>

      <Conditional show={maritalStatus === "married"}>
        <QuestionBlock>
          <label className={labelClass}>Your spouse or partner</label>
          <p className="text-xs text-stone mb-3">Same four questions, for the person you plan with.</p>
          <div className="space-y-4">
            <div>
              <label className={subLabelClass}>Occupation / job title</label>
              <TextField
                name="partner_occupation"
                value={getStr(data, "partner_occupation")}
                onChange={setField}
                placeholder="N/A if retired"
              />
            </div>
            <div>
              <label className={subLabelClass}>Current employer</label>
              <TextField
                name="partner_employer"
                value={getStr(data, "partner_employer")}
                onChange={setField}
                placeholder="N/A if retired"
              />
            </div>
            <div>
              <label className={subLabelClass}>Industry</label>
              <SelectField
                name="partner_industry"
                value={getStr(data, "partner_industry")}
                onChange={setField}
                options={INDUSTRY_OPTIONS}
              />
            </div>
            <div>
              <label className={subLabelClass}>Highest level of education</label>
              <RadioGroup
                name="partner_education"
                value={getStr(data, "partner_education")}
                onChange={setField}
                options={EDUCATION_OPTIONS}
              />
            </div>
          </div>
        </QuestionBlock>
      </Conditional>

      <QuestionBlock>
        <CheckboxGroup
          name="income_sources"
          label="How would you describe your household income source(s)?"
          help="Select all that apply."
          value={incomeSources}
          onChange={setField}
          options={INCOME_SOURCES_OPTIONS}
        />
        <Conditional show={incomeSources.includes("other")}>
          <TextField
            name="income_sources_other"
            label="Please specify"
            value={getStr(data, "income_sources_other")}
            onChange={setField}
          />
        </Conditional>
        <Conditional show={incomeSources.includes("equity")}>
          <RadioGroup
            name="equity_pct"
            label="Approximately what % of your annual compensation comes as equity?"
            value={getStr(data, "equity_pct")}
            onChange={setField}
            options={EQUITY_PCT_OPTIONS}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="income_range"
          label="Approximate household annual income (pre-tax)"
          value={getStr(data, "income_range")}
          onChange={setField}
          options={INCOME_RANGE_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="income_stability"
          label="How stable do you expect your income to be over the next 5 years?"
          value={getStr(data, "income_stability")}
          onChange={setField}
          options={INCOME_STABILITY_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="retire_horizon"
          label="When do you expect to stop working full-time?"
          value={getStr(data, "retire_horizon")}
          onChange={setField}
          options={RETIRE_HORIZON_OPTIONS}
        />
      </QuestionBlock>
    </div>
  );
}
