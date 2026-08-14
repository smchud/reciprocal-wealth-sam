// Removes test data from a database. Dry-run by default.
//
//   node scripts/purge-test-data.mjs             # show what WOULD be deleted
//   node scripts/purge-test-data.mjs --execute   # actually delete
//   node scripts/purge-test-data.mjs --execute --test   # against the test db
//
// What counts as test data:
//   - any email at @example.com                    (Playwright fixtures)
//   - submissions with no email at all             (abandoned test walkthroughs)
//   - submissions matching NAMED_TEST_PEOPLE below (hand-entered fake names)
//
// Safety: everything runs in one transaction, and the commit is gated on the
// surviving row count matching --expect-remaining. If it doesn't match, the
// whole thing rolls back rather than leaving the table half-purged.
//
// Take a backup first:
//   npm run export:submissions -- --format=json --out=exports/pre-purge.json

import { readFileSync } from "node:fs";
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

/** Hand-entered fake names. Matched case-insensitively on first + last name. */
const NAMED_TEST_PEOPLE = [
  ["Heywood", "Buzzoff"],
  ["Brent", "McFlagerty"],
  ["James", "Malonkus"],
];

function loadDotEnvLocal() {
  try {
    const raw = readFileSync(path.join(repoRoot, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  } catch {
    /* rely on exported env vars */
  }
}

async function main() {
  loadDotEnvLocal();
  const varName = args.test ? "TEST_DATABASE_URL" : "DATABASE_URL";
  const connectionString = process.env[varName];
  if (!connectionString) {
    console.error(`${varName} is not set.`);
    process.exit(1);
  }

  const dbName = new URL(connectionString).pathname.replace(/^\//, "");
  const execute = Boolean(args.execute);
  console.log(`target:  ${varName} -> ${dbName}`);
  console.log(`mode:    ${execute ? "EXECUTE (deletes rows)" : "dry run"}\n`);

  const nameCond = NAMED_TEST_PEOPLE.map(
    (_, i) => `(first_name ilike $${i * 2 + 1} and last_name ilike $${i * 2 + 2})`
  ).join(" or ");
  const nameParams = NAMED_TEST_PEOPLE.flat();
  const submissionWhere = `email is null or email = '' or email like '%@example.com' or (${nameCond})`;

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const doomed = await client.query(
      `select created_at, first_name, last_name, email
         from intake_submissions where ${submissionWhere}
         order by created_at desc`,
      nameParams
    );
    const survivors = await client.query(
      `select created_at, first_name, last_name, email
         from intake_submissions where not (${submissionWhere})
         order by created_at desc`,
      nameParams
    );
    const wpDoomed = await client.query(
      "select count(*)::int n from white_paper_requests where email like '%@example.com'"
    );

    console.log(`intake_submissions to delete:    ${doomed.rowCount}`);
    console.log(`white_paper_requests to delete:  ${wpDoomed.rows[0].n}`);
    console.log(`\nsurviving submissions (${survivors.rowCount}):`);
    for (const r of survivors.rows) {
      const name = `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "(no name)";
      console.log(`  ${r.created_at.toISOString().slice(0, 10)}  ${name.padEnd(20)} ${r.email}`);
    }

    if (!execute) {
      console.log("\nDry run — nothing deleted. Re-run with --execute to apply.");
      return;
    }

    const expected =
      args["expect-remaining"] !== undefined
        ? Number(args["expect-remaining"])
        : survivors.rowCount;

    await client.query("begin");
    try {
      const s = await client.query(
        `delete from intake_submissions where ${submissionWhere}`,
        nameParams
      );
      const w = await client.query(
        "delete from white_paper_requests where email like '%@example.com'"
      );
      const left = await client.query("select count(*)::int n from intake_submissions");
      if (left.rows[0].n !== expected) {
        throw new Error(
          `expected ${expected} surviving submissions, found ${left.rows[0].n}`
        );
      }
      await client.query("commit");
      console.log(`\nCOMMITTED`);
      console.log(`  intake_submissions deleted:   ${s.rowCount}`);
      console.log(`  white_paper_requests deleted: ${w.rowCount}`);
      console.log(`  surviving submissions:        ${left.rows[0].n}`);
    } catch (err) {
      await client.query("rollback");
      console.error(`\nROLLED BACK — nothing was deleted: ${err.message}`);
      process.exitCode = 1;
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
