import PDFDocument from "pdfkit";
import { fieldLabel, formatValue } from "./answerLabels";
import type { FullScoring } from "./scoring";

type IntakeData = Record<string, unknown>;

const SECTION_FIELDS: { title: string; fields: string[] }[] = [
  {
    title: "Section 1 — Your Details",
    fields: [
      "first_name",
      "middle_name",
      "last_name",
      "dob",
      "email",
      "phone_type",
      "phone",
      "address_street",
      "address_city",
      "address_state",
      "address_zip",
      "address_country",
      "marital_status",
      "partner_first_name",
      "partner_middle_name",
      "partner_last_name",
      "partner_dob",
      "partner_email",
      "partner_phone",
      "partner_coclient",
      "has_children",
      "hobbies",
      "hobbies_other",
      "life_stage",
    ],
  },
  {
    title: "Section 2 — Career & Income",
    fields: [
      "occupation",
      "employer",
      "industry",
      "education",
      "partner_occupation",
      "partner_employer",
      "partner_industry",
      "partner_education",
      "income_sources",
      "income_sources_other",
      "equity_pct",
      "income_range",
      "income_stability",
      "retire_horizon",
    ],
  },
  {
    title: "Section 3 — Financial Picture",
    fields: [
      "investable_assets",
      "assets_other_specify",
      "tax_cash_pct",
      "tax_taxable_pct",
      "tax_deferred_pct",
      "tax_free_pct",
      "liab_mortgage",
      "liab_student",
      "liab_auto",
      "liab_cc",
      "emergency_fund",
      "cash_balance",
      "savings_rate",
      "inheritance",
      "inheritance_magnitude",
    ],
  },
  {
    title: "Section 4 — Goals & Time Horizon",
    fields: [
      "priorities",
      "priorities_other",
      "top_goal",
      "retirement_vision",
      "time_horizon",
      "major_expenditures",
      "specific_targets",
      "nonprofit_involvement",
      "charitable_giving",
    ],
  },
  {
    title: "Section 5 — Investing Background",
    fields: [
      "experience",
      "self_confidence",
      "advisor_expectations",
      "instruments",
      "checking_frequency",
      "involvement",
      "prior_advisor",
      "prior_advisor_name",
      "prior_advisor_other",
      "prior_dissatisfaction",
    ],
  },
  {
    title: "Section 7 — Working With Us",
    fields: [
      "contact_frequency",
      "contact_channel",
      "advisor_qualities",
      "investing_values",
      "values_notes",
      "prompt",
      "referral_source",
      "referral_name",
      "other_notes",
    ],
  },
];

const ASSET_ROWS: { key: string; label: string }[] = [
  { key: "cash", label: "Cash & savings" },
  { key: "taxable", label: "Taxable brokerage" },
  { key: "401k", label: "401(k) / 403(b)" },
  { key: "ira", label: "IRA / Roth IRA" },
  { key: "bonds", label: "Treasuries / bonds" },
  { key: "529", label: "529 plans" },
  { key: "equity", label: "Employer equity" },
  { key: "private", label: "Private investments" },
  { key: "crypto", label: "Cryptocurrency" },
  { key: "alt", label: "Other alternatives" },
  { key: "other", label: "Other" },
];

function childRows(data: IntakeData): { name: string; dob: string; school: string }[] {
  const ids = new Set<number>();
  Object.keys(data).forEach((k) => {
    const m = k.match(/^child_(\d+)_name$/);
    if (m) ids.add(parseInt(m[1], 10));
  });
  return Array.from(ids)
    .sort((a, b) => a - b)
    .map((id) => ({
      name: String(data[`child_${id}_name`] ?? ""),
      dob: String(data[`child_${id}_dob`] ?? ""),
      school: String(data[`child_${id}_school`] ?? ""),
    }))
    .filter((c) => c.name || c.dob || c.school);
}

export function generateSummaryPdf(data: IntakeData, scoring: FullScoring, submittedAt: Date): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const name = [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(" ") || "(name not provided)";

  doc.fontSize(18).font("Helvetica-Bold").text("Reciprocal Wealth — Questionnaire Summary");
  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica").fillColor("#666666");
  doc.text(`Submitted: ${submittedAt.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}`);
  doc.fillColor("#000000");
  doc.moveDown(1);

  doc.fontSize(14).font("Helvetica-Bold").text(name);
  doc.fontSize(10).font("Helvetica");
  if (data.email) doc.text(`Email: ${data.email}`);
  if (data.phone) doc.text(`Phone: ${data.phone}`);
  doc.moveDown(1);

  // ---- Advisor-only: risk & fit ----
  const ruleWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  doc
    .moveTo(doc.x, doc.y)
    .lineTo(doc.x + ruleWidth, doc.y)
    .strokeColor("#cccccc")
    .stroke();
  doc.strokeColor("#000000");
  doc.moveDown(0.3);
  doc.fontSize(12).font("Helvetica-Bold").fillColor("#0F6E56").text("For advisor use only — risk profile & fit");
  doc.fillColor("#000000").fontSize(10).font("Helvetica");
  doc.moveDown(0.3);
  doc.font("Helvetica-Bold").text(
    `Final risk score: ${scoring.finalRiskScore} / 100 — ${scoring.riskProfile.label} (indicative equity ${scoring.riskProfile.equity})`
  );
  doc.font("Helvetica").text(scoring.riskProfile.description);
  doc.moveDown(0.2);
  doc.text(
    `Components — tolerance: ${scoring.toleranceScore}, age factor: ${scoring.ageFactor}, situation factor: ${scoring.situationFactor} (blend 60/20/20)`
  );
  doc.moveDown(0.3);
  doc.font("Helvetica-Bold").text(`Psychographic archetype: ${scoring.psychographic.archetype}`);
  doc
    .font("Helvetica")
    .text(scoring.psychographic.description)
    .text(
      `Performance axis: ${scoring.psychographic.performanceScore >= 0 ? "+" : ""}${scoring.psychographic.performanceScore} · Contact axis: ${scoring.psychographic.contactScore >= 0 ? "+" : ""}${scoring.psychographic.contactScore}`
    );
  doc.moveDown(1);

  function printField(fieldName: string) {
    const value = formatValue(fieldName, data[fieldName]);
    if (!value.trim()) return;
    doc.font("Helvetica-Bold").text(`${fieldLabel(fieldName)}: `, { continued: true }).font("Helvetica").text(value);
  }

  function sectionHeading(title: string) {
    doc.moveDown(0.6);
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#04342C").text(title);
    doc.fillColor("#000000").fontSize(10).font("Helvetica");
    doc.moveDown(0.2);
  }

  // Section 1
  sectionHeading(SECTION_FIELDS[0].title);
  SECTION_FIELDS[0].fields.forEach(printField);
  const children = childRows(data);
  if (children.length) {
    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").text("Children:");
    children.forEach((c) => {
      doc.font("Helvetica").text(`  ${c.name || "(name not given)"} — DOB ${c.dob || "—"} — School: ${c.school || "—"}`);
    });
  }

  // Section 2
  sectionHeading(SECTION_FIELDS[1].title);
  SECTION_FIELDS[1].fields.forEach(printField);

  // Section 3 (+ asset table)
  sectionHeading(SECTION_FIELDS[2].title);
  printField("investable_assets");
  doc.moveDown(0.2);
  doc.font("Helvetica-Bold").text("Asset distribution:");
  ASSET_ROWS.forEach((row) => {
    const value = data[`assets_${row.key}_value`];
    const where = data[`assets_${row.key}_where`];
    if (!value && !where) return;
    doc.font("Helvetica").text(`  ${row.label}: ${value || "—"}${where ? ` (held at ${where})` : ""}`);
  });
  doc.moveDown(0.2);
  SECTION_FIELDS[2].fields.slice(1).forEach(printField);

  // Section 4
  sectionHeading(SECTION_FIELDS[3].title);
  SECTION_FIELDS[3].fields.forEach(printField);

  // Section 5
  sectionHeading(SECTION_FIELDS[4].title);
  SECTION_FIELDS[4].fields.forEach(printField);

  // Section 6 note - full item-level answers stay in tolerance_breakdown
  // (advisor-only, stored in the DB record) rather than repeated here.
  sectionHeading("Section 6 — Risk");
  doc.font("Helvetica").text("See risk score and breakdown above.");

  // Section 7
  sectionHeading(SECTION_FIELDS[5].title);
  SECTION_FIELDS[5].fields.forEach(printField);

  doc.end();
  return done;
}
