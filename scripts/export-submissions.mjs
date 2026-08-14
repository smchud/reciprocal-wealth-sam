// Exports completed questionnaire submissions to CSV or JSON.
//
//   node scripts/export-submissions.mjs                    # CSV, summary columns
//   node scripts/export-submissions.mjs --format=json      # full records incl. raw answers
//   node scripts/export-submissions.mjs --since=2026-01-01
//   node scripts/export-submissions.mjs --out=exports/q3.csv
//
// Reads DATABASE_URL from .env.local (run `vercel env pull .env.local` first)
// or the environment.
//
// The output contains client PII and internal-only scoring that is never
// shown to clients. Treat any exported file as confidential: store it
// somewhere access-controlled and delete it when you're done with it.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, "").split("=");
    return [k, rest.join("=") || true];
  })
);

function loadDotEnvLocal() {
  try {
    const raw = readFileSync(path.join(repoRoot, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  } catch {
    // Not present; rely on already-exported env vars.
  }
}

const SUMMARY_COLUMNS = [
  "id",
  "created_at",
  "first_name",
  "last_name",
  "email",
  "final_risk_score",
  "risk_profile",
  "indicative_equity_allocation",
  "psychographic_archetype",
  "priority_quadrant",
  "aum_range_label",
  "aum_score",
  "effort_score_total",
  "wealthbox_contact_id",
  "pdf_emailed_at",
];

function toCsv(rows, columns) {
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = v instanceof Date ? v.toISOString() : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    columns.join(","),
    ...rows.map((r) => columns.map((c) => escape(r[c])).join(",")),
  ].join("\n");
}

async function main() {
  loadDotEnvLocal();
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");
    process.exit(1);
  }

  const format = args.format === "json" ? "json" : "csv";
  const since = typeof args.since === "string" ? args.since : null;

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    // Only columns that exist are selected, so this keeps working if a
    // future migration adds or renames scoring fields.
    const { rows: cols } = await client.query(
      `select column_name from information_schema.columns
       where table_name = 'intake_submissions'`
    );
    const available = new Set(cols.map((c) => c.column_name));
    const columns =
      format === "json"
        ? [...available]
        : SUMMARY_COLUMNS.filter((c) => available.has(c));

    const where = since ? "where created_at >= $1" : "";
    const params = since ? [since] : [];
    const { rows } = await client.query(
      `select ${columns.map((c) => `"${c}"`).join(", ")}
       from intake_submissions ${where} order by created_at desc`,
      params
    );

    const stamp = new Date().toISOString().slice(0, 10);
    const outPath = path.resolve(
      repoRoot,
      typeof args.out === "string" ? args.out : `exports/submissions-${stamp}.${format}`
    );
    mkdirSync(path.dirname(outPath), { recursive: true });

    writeFileSync(
      outPath,
      format === "json" ? JSON.stringify(rows, null, 2) : toCsv(rows, columns)
    );

    console.log(`Exported ${rows.length} submission(s) -> ${outPath}`);
    console.log("This file contains client PII. Store it securely and delete it when done.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
