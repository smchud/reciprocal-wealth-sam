# Reciprocal Wealth site — operations runbook

Everyday tasks for reciprocalwealth.com. Read `CLAUDE.md` first for the
brand, terminology, and compliance rules that govern all copy.

**The site is live and indexed by search engines.** Anything merged to
`main` is public within about a minute. There is no noindex safety net.

**Standard loop for any change:**

```bash
npm run test:e2e && npx next build   # verify
git checkout -b my-change            # never commit straight to main
# ...edit, commit...
git push -u origin my-change
npx vercel --scope reciprocal-wealth  # preview URL for review
```

Then merge to `main` and run `npx vercel --prod --scope reciprocal-wealth`.

---

## 1. Change copy

Most text lives in `src/data/` and is shared across pages — edit it there
and every page updates together. Don't paste the same sentence into a page
component.

| What | File |
|---|---|
| Reciprocity for All (points, stat, snapshot table, eligibility note) | `src/data/differentiators.ts` |
| Our Values | `src/data/values.ts` |
| Founder bios, education, citations | `src/data/founders.ts` |
| FAQs | `src/data/faqs.ts` |
| Phone, email, address, nav and footer links | `src/data/siteConfig.ts` |

Page-specific copy (hero, section headings) lives in the page itself:
`src/app/page.tsx`, `src/app/why-reciprocal/page.tsx`, etc.

Compliance rules that bite most often: no testimonials, no performance
claims, "adviser" for the firm and "advisor" for a person, and
"Reciprocity for All" with a lowercase "for".

## 2. Add an FAQ

Append to the `faqs` array in `src/data/faqs.ts`. It renders on `/faqs` and
in the home page FAQ section automatically.

```ts
{
  question: "Your question?",
  answer: "One paragraph.",                    // or ["Para one.", "Para two."]
  cta: { label: "Start here", href: "/get-started" },        // optional
  answerLink: { prefix: "More detail", label: "here", href: "/x", suffix: "." }, // optional
}
```

`answer` accepts an array for multi-paragraph answers. Keep answers under
roughly 1,200 characters — the accordion's open height is capped.

## 3. Update a disclosure or document PDF

**Public documents** (ADV, disclosures) live in `public/documents/`.
Replace the file, keeping the same filename, and any existing link keeps
working. If you change the filename, grep for the old one first:

```bash
grep -rn "old-filename.pdf" src/
```

**The white paper is different.** It sits at `private/white-paper.pdf`,
deliberately outside `public/`, because downloads are gated behind email
verification. Replace that file and redeploy — nothing else changes.
`next.config.ts` (`outputFileTracingIncludes`) ships it with the download
route's bundle.

Bump the "Effective:" date in the page whenever the underlying document
changes: `src/app/fee-schedule/page.tsx`, `src/app/disclosures/page.tsx`,
`src/app/privacy-policy/page.tsx`.

## 4. Roll back a deploy

Fastest path — revert production to the previous deployment:

```bash
npx vercel ls --prod --scope reciprocal-wealth        # find the last good URL
npx vercel rollback <deployment-url> --scope reciprocal-wealth
npx vercel rollback status --scope reciprocal-wealth
```

This changes what production serves but **not** what's in git. Follow up
with a `git revert` of the bad commit on `main` so the next deploy doesn't
reintroduce it:

```bash
git revert <bad-commit-sha> && git push origin main
```

Database migrations do **not** roll back with a deployment. If the bad
deploy included one, write a new forward migration to correct it.

## 5. Export questionnaire records

```bash
vercel env pull .env.local                    # once, to get DATABASE_URL
npm run export:submissions                    # CSV summary -> exports/
npm run export:submissions -- --format=json   # full records incl. raw answers
npm run export:submissions -- --since=2026-01-01
```

Exports contain client PII plus internal-only scoring (risk score,
psychographic archetype, AUM/effort matrix) that is **never** shown to
clients. Store exports somewhere access-controlled and delete them when
you're done. `exports/` is gitignored — never commit one.

Founders also receive a per-submission PDF by email at the time of
submission; the database is the system of record.

## 6. Capture the site for records

```bash
npm run capture                                  # production -> captures/<timestamp>/
npm run capture -- --base=http://localhost:3000  # a local or preview build
```

Renders every public route to PDF plus a `manifest.json` recording the
base URL, git commit, and capture time. Useful for an archive of what the
site said on a given date.

## 7. Error alerts

API route failures report to Sentry (`src/lib/observability.ts`). Client
PII is redacted before anything leaves our infrastructure — see
`PII_KEYS` there and the tests in `tests/observability.spec.ts`. Full
detail (including email addresses) stays in Vercel's own logs:

```bash
npx vercel logs <deployment-url> --scope reciprocal-wealth
```

Sentry is inert unless `SENTRY_DSN` is set, so local dev and CI are
unaffected.

## 8. Environment variables

Set in the Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres (drafts, submissions, white paper requests) |
| `RESEND_API_KEY` | Transactional email |
| `WEALTHBOX_API_TOKEN` | CRM sync |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap, email links |
| `SENTRY_DSN` | Error tracking (optional) |

After changing one, redeploy — env vars are read at build/boot time.

## 9. Database migrations

```bash
vercel env pull .env.local
node scripts/migrate.mjs        # applies anything new in migrations/
```

Migrations are append-only and tracked in the `schema_migrations` table.
Never edit an applied migration; add a new numbered file instead.
