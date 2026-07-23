"use client";

import { IntakeData, getStr, RadioGroup, LikertGrid, QuestionBlock } from "./fields";

const Q32_OPTIONS = [
  { value: "1", label: "$950,000 (a 5% drop)" },
  { value: "2", label: "$900,000 (a 10% drop)" },
  { value: "3", label: "$800,000 (a 20% drop)" },
  { value: "4", label: "$700,000 (a 30% drop)" },
  { value: "5", label: "I wouldn't sell based on short-term losses" },
];

const Q33_OPTIONS = [
  { value: "1", label: "A: Average return ~5%/yr — worst single-year loss historically around -8%" },
  { value: "2", label: "B: Average return ~6.5%/yr — worst single-year loss historically around -15%" },
  { value: "3", label: "C: Average return ~8%/yr — worst single-year loss historically around -25%" },
  { value: "4", label: "D: Average return ~9.5%/yr — worst single-year loss historically around -35%" },
];

const Q34_OPTIONS = [
  { value: "1", label: "Sell — get to safety, wait for things to settle" },
  { value: "2", label: "Sell some — reduce exposure but stay partly invested" },
  { value: "3", label: "Do nothing — stick to the plan" },
  { value: "4", label: "Buy more — this is a good time to add" },
];

const Q36_OPTIONS = [
  { value: "1", label: "Even modest losses of 5% or so would weigh on me" },
  { value: "2", label: "Up to about 10%" },
  { value: "3", label: "Up to about 20%" },
  { value: "4", label: "Up to about 30%" },
  { value: "5", label: "Larger drawdowns wouldn't change my behavior" },
];

const Q38_OPTIONS = [
  { value: "1", label: "Catastrophic — I'd be in real trouble if forced to sell at a loss" },
  { value: "2", label: "Painful but manageable" },
  { value: "3", label: "Inconvenient but not threatening to my plans" },
  { value: "4", label: "Not a meaningful issue — I have other resources" },
];

const Q37_STATEMENTS = [
  { name: "risk_q37_1", label: "I'd rather earn a modest, predictable return than chase a higher one with more volatility" },
  { name: "risk_q37_2", label: "If I had a sizable cash windfall today, I'd want it invested in the market within a few months" },
  { name: "risk_q37_3", label: "I see market downturns mostly as opportunities, not threats" },
  { name: "risk_q37_4", label: "I'd be uncomfortable seeing my account down 15% from its peak, even if I knew it would likely recover" },
];

interface SectionProps {
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export default function Section6({ data, setField }: SectionProps) {
  return (
    <div>
      <QuestionBlock>
        <RadioGroup
          name="risk_q32"
          label="Imagine you've invested $1,000,000 with us. Over the next 12 months it falls to the value below. At what point would you seriously consider selling to stop the losses?"
          value={getStr(data, "risk_q32")}
          onChange={setField}
          options={Q32_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="risk_q33"
          label="Which of these portfolios would you most want to own over a 10-year horizon?"
          help="Each shows a hypothetical range of outcomes. Higher potential reward generally comes with bigger short-term swings."
          value={getStr(data, "risk_q33")}
          onChange={setField}
          options={Q33_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="risk_q34"
          label="The market just dropped 20% in three months. The news is bleak. What do you do?"
          value={getStr(data, "risk_q34")}
          onChange={setField}
          options={Q34_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="risk_q36"
          label="How much short-term volatility could you tolerate before it would seriously affect your sleep, work, or relationships?"
          value={getStr(data, "risk_q36")}
          onChange={setField}
          options={Q36_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <LikertGrid
          label="Tell us how much you agree or disagree with each statement"
          statements={Q37_STATEMENTS}
          value={{
            risk_q37_1: getStr(data, "risk_q37_1"),
            risk_q37_2: getStr(data, "risk_q37_2"),
            risk_q37_3: getStr(data, "risk_q37_3"),
            risk_q37_4: getStr(data, "risk_q37_4"),
          }}
          onChange={setField}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="risk_q38"
          label="If you needed to take money out of your portfolio during a market downturn, how big a problem would that be?"
          value={getStr(data, "risk_q38")}
          onChange={setField}
          options={Q38_OPTIONS}
        />
      </QuestionBlock>
    </div>
  );
}
