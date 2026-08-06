import type { Metadata } from "next";

const description =
  "Reciprocal Wealth, LLC's Table of Fees for Services — a supplemental disclosure to our Form ADV Part 2A.";

export const metadata: Metadata = {
  title: "Fee Schedule",
  description,
  openGraph: { title: "Fee Schedule", description, images: ["/images/og-default.png"] },
};

const heading = "mt-10 text-lg font-medium text-near-black tracking-[-0.2px]";
const firstHeading = "text-lg font-medium text-near-black tracking-[-0.2px]";

// Verbatim content from "Table of Fees for Services" (FeeTable_ReciprocalWealth_20260609),
// the firm's supplemental disclosure to Form ADV Part 2A. The source document
// uses "Advisor" for the firm throughout; that spelling is preserved here.
const AUM_TIERS = [
  { assets: "$0.01 to $312,500", annual: "1.20%", monthly: "0.10%" },
  { assets: "$312,500.01 to $625,000", annual: "1.08%", monthly: "0.09%" },
  { assets: "$625,000.01 to $1,250,000", annual: "0.96%", monthly: "0.08%" },
  { assets: "$1,250,000.01 to $2,500,000", annual: "0.84%", monthly: "0.07%" },
  { assets: "$2,500,000.01 to $5,000,000", annual: "0.72%", monthly: "0.06%" },
  { assets: "$5,000,000.01 to $10,000,000", annual: "0.60%", monthly: "0.05%" },
  { assets: "$10,000,000.01 to $20,000,000", annual: "0.48%", monthly: "0.04%" },
  { assets: "$20,000,000.01 to $40,000,000", annual: "0.36%", monthly: "0.03%" },
  { assets: "$40,000,000.01 and Above", annual: "0.24%", monthly: "0.02%" },
];

const ZERO_ADVISOR_FEES = [
  "Hourly Fee",
  "Subscription Fee",
  "Fixed Fee",
  "Commissions to the Advisor",
  "Performance-based fees",
  "Other",
];

const ZERO_THIRD_PARTY_FEES = ["Third Party Money Management Fee", "Robo-Advisor Fee"];

const ADDITIONAL_COSTS = [
  { cost: "Brokerage Fees", applies: "Yes", paidTo: "Custodian" },
  { cost: "Commissions", applies: "No", paidTo: "N/A" },
  { cost: "Custodian Fees", applies: "Yes", paidTo: "Custodian" },
  { cost: "Mark-ups", applies: "No", paidTo: "N/A" },
  {
    cost: "Mutual Fund/ETF Fees and Expenses",
    applies: "Mutual Funds: Yes · ETFs: Yes",
    paidTo: "Mutual Fund Company · ETF Company",
  },
];

const thClass = "py-3 px-4 font-medium text-near-black text-left";
const tdClass = "py-3 px-4";

export default function FeeSchedule() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Legal
            </span>
            <h1 className="font-serif text-[32px] md:text-[36px] tracking-[-0.5px] text-white leading-tight">
              Fee Schedule
            </h1>
            <p className="mt-5 text-sm text-white/55">Effective: June 9, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[720px] px-6 text-sm text-stone leading-relaxed">
          <h2 className={firstHeading}>Table of Fees for Services</h2>
          <div className="mt-4 space-y-4">
            <p>
              Reciprocal Wealth, LLC (CRD# 342207) (the &ldquo;Advisor&rdquo;)
              provides this Table of Fees for Services as a supplemental
              disclosure to its Form ADV Part 2A (&ldquo;Disclosure
              Brochure&rdquo;). Please reference Items 4 and 5 of the
              Disclosure Brochure, which contains important details about the
              Advisor&rsquo;s services and fees. Fees are negotiable at the
              sole discretion of the Advisor. The fees below will only apply
              to you when you request the services listed.
            </p>
          </div>

          <h2 className={heading}>Fees Charged by Advisor</h2>
          <div className="mt-4 space-y-4">
            <p>
              <strong className="text-near-black font-medium">
                Assets Under Management Fee
              </strong>{" "}
              — charged monthly in arrears for Financial Planning Services and
              Portfolio Management for Individuals and/or Small Businesses.
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm border border-near-black/8">
              <thead>
                <tr className="bg-deep-forest text-white text-left">
                  <th className="py-3 px-4 font-medium">Assets Under Management ($)</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Annual Rate (%)</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Monthly Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {AUM_TIERS.map((tier, i) => (
                  <tr
                    key={tier.assets}
                    className={`border-b border-near-black/8 ${i % 2 === 1 ? "bg-warm-gray/60" : ""}`}
                  >
                    <td className={`${tdClass} text-near-black`}>{tier.assets}</td>
                    <td className={tdClass}>{tier.annual}</td>
                    <td className={tdClass}>{tier.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm border border-near-black/8">
              <thead>
                <tr className="bg-warm-gray text-left">
                  <th className={thClass}>Fees Charged by Advisor</th>
                  <th className={thClass}>Fee Amount</th>
                  <th className={thClass}>Frequency Fee is Charged</th>
                  <th className={thClass}>Services</th>
                </tr>
              </thead>
              <tbody>
                {ZERO_ADVISOR_FEES.map((fee) => (
                  <tr key={fee} className="border-b border-near-black/8">
                    <td className={`${tdClass} text-near-black`}>{fee}</td>
                    <td className={tdClass}>$0</td>
                    <td className={tdClass}>N/A</td>
                    <td className={tdClass}>N/A</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={heading}>Fees Charged by Third Parties</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm border border-near-black/8">
              <thead>
                <tr className="bg-warm-gray text-left">
                  <th className={thClass}>Fees Charged by Third Parties</th>
                  <th className={thClass}>Fee Amount</th>
                  <th className={thClass}>Frequency Fee is Charged</th>
                  <th className={thClass}>Services</th>
                </tr>
              </thead>
              <tbody>
                {ZERO_THIRD_PARTY_FEES.map((fee) => (
                  <tr key={fee} className="border-b border-near-black/8">
                    <td className={`${tdClass} text-near-black`}>{fee}</td>
                    <td className={tdClass}>$0</td>
                    <td className={tdClass}>N/A</td>
                    <td className={tdClass}>N/A</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className={heading}>
            Talk with your Advisor about fees and costs applicable to you
          </h2>
          <div className="mt-4 space-y-4">
            <p>Additional fees and costs to discuss with your Advisor:</p>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm border border-near-black/8">
              <thead>
                <tr className="bg-warm-gray text-left">
                  <th className={thClass}>Additional Fees/Costs</th>
                  <th className={thClass}>Yes/No</th>
                  <th className={thClass}>Paid To</th>
                </tr>
              </thead>
              <tbody>
                {ADDITIONAL_COSTS.map((row) => (
                  <tr key={row.cost} className="border-b border-near-black/8 align-top">
                    <td className={`${tdClass} text-near-black`}>{row.cost}</td>
                    <td className={tdClass}>{row.applies}</td>
                    <td className={tdClass}>{row.paidTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
