"use client";

import {
  IntakeData,
  getStr,
  TextField,
  RadioGroup,
  Conditional,
  QuestionBlock,
  labelClass,
  helpClass,
  inputClass,
} from "./fields";

const INVESTABLE_ASSETS_OPTIONS = [
  { value: "lt_500k", label: "Under $500,000" },
  { value: "500k_1M", label: "$500,000 – $1,000,000" },
  { value: "1M_2.5M", label: "$1,000,000 – $2,500,000" },
  { value: "2.5M_5M", label: "$2,500,000 – $5,000,000" },
  { value: "5M_10M", label: "$5,000,000 – $10,000,000" },
  { value: "gt_10M", label: "Over $10,000,000" },
];

const ASSET_ROWS = [
  { key: "cash", label: "Cash & savings" },
  { key: "taxable", label: "Taxable brokerage" },
  { key: "401k", label: "401(k) / 403(b)" },
  { key: "ira", label: "IRA / Roth IRA" },
  { key: "bonds", label: "Treasuries / bonds" },
  { key: "529", label: "529 plans" },
  { key: "equity", label: "Employer equity (RSUs, options, ESPP)" },
  { key: "private", label: "Private investments" },
  { key: "crypto", label: "Cryptocurrency" },
  { key: "alt", label: "Other alternatives" },
  { key: "other", label: "Other" },
];

const EMERGENCY_FUND_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "partial", label: "Partially" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const SAVINGS_RATE_OPTIONS = [
  { value: "lt_5", label: "Less than 5%" },
  { value: "5_10", label: "5–10%" },
  { value: "10_20", label: "10–20%" },
  { value: "20_30", label: "20–30%" },
  { value: "gt_30", label: "More than 30%" },
  { value: "retired", label: "Retired — drawing rather than saving" },
];

const INHERITANCE_OPTIONS = [
  { value: "yes_10", label: "Yes — within the next 10 years" },
  { value: "yes_later", label: "Yes — likely 10+ years out" },
  { value: "possible", label: "Possibly, but uncertain in size or timing" },
  { value: "no", label: "No" },
  { value: "no_say", label: "Prefer not to say" },
];

const INHERITANCE_MAGNITUDE_OPTIONS = [
  { value: "lt_250k", label: "Under $250,000" },
  { value: "250k_1M", label: "$250,000 – $1,000,000" },
  { value: "1M_5M", label: "$1,000,000 – $5,000,000" },
  { value: "gt_5M", label: "Over $5,000,000" },
  { value: "unknown", label: "Don't know / prefer not to say" },
];

interface SectionProps {
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export default function Section3({ data, setField }: SectionProps) {
  const emergencyFund = getStr(data, "emergency_fund");
  const inheritance = getStr(data, "inheritance");
  const assetsOtherValue = getStr(data, "assets_other_value");

  return (
    <div>
      <QuestionBlock>
        <RadioGroup
          name="investable_assets"
          label="Approximate investable assets"
          help="Investments, retirement accounts, cash above an emergency fund — exclude home equity."
          value={getStr(data, "investable_assets")}
          onChange={setField}
          options={INVESTABLE_ASSETS_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <label className={labelClass}>Roughly, how are these assets distributed today?</label>
        <p className={helpClass}>Best estimates — totals don&rsquo;t need to be exact. Leave blank what doesn&rsquo;t apply.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-near-black/10">
                <th className="text-left pb-2 text-[11px] uppercase tracking-wide text-stone font-semibold">
                  Account type
                </th>
                <th className="text-left pb-2 text-[11px] uppercase tracking-wide text-stone font-semibold">
                  Approx. value
                </th>
                <th className="text-left pb-2 text-[11px] uppercase tracking-wide text-stone font-normal italic">
                  Held where (optional)
                </th>
              </tr>
            </thead>
            <tbody>
              {ASSET_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-near-black/10">
                  <td className="py-2 pr-3 font-medium text-near-black w-[32%]">{row.label}</td>
                  <td className="py-2 pr-3">
                    <input
                      className={inputClass}
                      placeholder="$"
                      value={getStr(data, `assets_${row.key}_value`)}
                      onChange={(e) => setField(`assets_${row.key}_value`, e.target.value)}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className={inputClass}
                      placeholder="e.g., Fidelity, Schwab"
                      value={getStr(data, `assets_${row.key}_where`)}
                      onChange={(e) => setField(`assets_${row.key}_where`, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Conditional show={assetsOtherValue.trim() !== ""}>
          <TextField
            name="assets_other_specify"
            label='You entered a value under "Other" — please specify what those assets are.'
            value={getStr(data, "assets_other_specify")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <label className={labelClass}>Tax location of your investable assets</label>
        <p className={helpClass}>Roughly what % is in each tax treatment? Totals don&rsquo;t need to add to 100 exactly.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-stone mb-1.5">Cash &amp; equivalents</label>
            <input
              className={inputClass}
              placeholder="%"
              value={getStr(data, "tax_cash_pct")}
              onChange={(e) => setField("tax_cash_pct", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-stone mb-1.5">Taxable (brokerage)</label>
            <input
              className={inputClass}
              placeholder="%"
              value={getStr(data, "tax_taxable_pct")}
              onChange={(e) => setField("tax_taxable_pct", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-stone mb-1.5">Tax-deferred (IRA, 401(k))</label>
            <input
              className={inputClass}
              placeholder="%"
              value={getStr(data, "tax_deferred_pct")}
              onChange={(e) => setField("tax_deferred_pct", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-stone mb-1.5">Tax-free (Roth, HSA)</label>
            <input
              className={inputClass}
              placeholder="%"
              value={getStr(data, "tax_free_pct")}
              onChange={(e) => setField("tax_free_pct", e.target.value)}
            />
          </div>
        </div>
      </QuestionBlock>

      <QuestionBlock>
        <label className={labelClass}>Major liabilities — approximate balances</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <div>
            <label className="block text-xs text-stone mb-1.5">Mortgage</label>
            <input
              className={inputClass}
              placeholder="$"
              value={getStr(data, "liab_mortgage")}
              onChange={(e) => setField("liab_mortgage", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-stone mb-1.5">Student loans</label>
            <input
              className={inputClass}
              placeholder="$"
              value={getStr(data, "liab_student")}
              onChange={(e) => setField("liab_student", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-stone mb-1.5">Auto / personal loans</label>
            <input
              className={inputClass}
              placeholder="$"
              value={getStr(data, "liab_auto")}
              onChange={(e) => setField("liab_auto", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-stone mb-1.5">Credit card debt</label>
            <input
              className={inputClass}
              placeholder="$"
              value={getStr(data, "liab_cc")}
              onChange={(e) => setField("liab_cc", e.target.value)}
            />
          </div>
        </div>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="emergency_fund"
          label="Do you have cash on hand to cover 3–6 months of expenses?"
          value={emergencyFund}
          onChange={setField}
          options={EMERGENCY_FUND_OPTIONS}
        />
        <Conditional show={emergencyFund === "no" || emergencyFund === "unsure"}>
          <TextField
            name="cash_balance"
            label="Approximately how much do you have in your current cash balance?"
            help="Savings, checking, money market — a rough figure is fine."
            placeholder="$"
            value={getStr(data, "cash_balance")}
            onChange={setField}
          />
        </Conditional>
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="savings_rate"
          label="Roughly what % of your gross household income do you save annually?"
          help="Include retirement contributions (401(k), IRA), taxable savings, and other investments."
          value={getStr(data, "savings_rate")}
          onChange={setField}
          options={SAVINGS_RATE_OPTIONS}
        />
      </QuestionBlock>

      <QuestionBlock>
        <RadioGroup
          name="inheritance"
          label="Do you anticipate receiving a meaningful inheritance, family gift, or tax-free transfer from family?"
          value={inheritance}
          onChange={setField}
          options={INHERITANCE_OPTIONS}
        />
        <Conditional show={["yes_10", "yes_later", "possible"].includes(inheritance)}>
          <RadioGroup
            name="inheritance_magnitude"
            label="Approximate magnitude"
            value={getStr(data, "inheritance_magnitude")}
            onChange={setField}
            options={INHERITANCE_MAGNITUDE_OPTIONS}
          />
        </Conditional>
      </QuestionBlock>
    </div>
  );
}
