@AGENTS.md

# Reciprocal Wealth — Brand & Content Guardrails

## ⚠️ SITE IS NOINDEXED — DO NOT REMOVE WITHOUT SIGN-OFF

The site is **intentionally blocked from search engine indexing** until
compliance review clears it for public launch: `robots: { index: false,
follow: false }` in `src/app/layout.tsx`, and `disallow: "/"` in
`src/app/robots.ts`.

**This MUST be reversed before public launch** (metadata `robots` block
removed, `robots.ts` reverted to `allow: "/"`) — and Google Search Console
registration (skipped for now) completed at that time. Do not touch either
of these as a "fix" or cleanup unless the launch has been explicitly
approved.

## Legal entity

The firm's legal name is **Reciprocal Wealth, LLC**. Use this exact form in
disclosures, copyright lines, and anywhere the entity is named on the site.

## Brand colors

| Token         | Hex       | Tailwind class (e.g.) | Usage                                  |
| ------------- | --------- | ---------------------- | --------------------------------------- |
| Deep Forest   | `#04342C` | `bg-deep-forest`        | Dark sections, header, footer, hero      |
| Forest Green  | `#0F6E56` | `bg-forest` / `text-forest` | Primary brand, CTAs, accents       |
| Warm Gray     | `#F0EFED` | `bg-warm-gray`          | Alternating section backgrounds          |
| Stone         | `#888780` | `text-stone`            | Secondary text, captions                 |
| Near Black    | `#1A1A18` | `text-near-black`       | Body text, headlines                     |

Tints of Forest Green (`forest-75`, `forest-50`, `forest-25`, `forest-10`) are
also defined in `src/app/globals.css` for use on dark backgrounds. All tokens
live in the `@theme inline` block there — add new brand colors only in that
one place.

## Typography (v4c)

**Two typefaces: Inter for body copy/UI/labels, a serif for headings and
subheadings.** The serif stack is `Georgia, var(--font-gelasio), serif`
(the `--font-serif` token in `globals.css`) — Georgia first since most
readers have it installed, with **Gelasio** as the self-hosted webfont
fallback for those who don't. Gelasio was chosen specifically because it's
metrically compatible with Georgia (Georgia itself can't be redistributed
as a webfont) and open-licensed. Apply it via the `font-serif` Tailwind
utility on headings/subheadings; never on body copy.

Gelasio is self-hosted as four static woff2 files (regular/italic/bold/bold
italic, latin subset) under `src/fonts/Gelasio-*.woff2`, loaded via
`next/font/local` in `src/app/layout.tsx` as `--font-gelasio`. Only 400 and
700 weights exist — don't use `font-light`/`font-thin` on serif headings,
there's no face for it. Match the deck's treatment of italicizing one
emphasized word/phrase per heading (e.g. "An independent, *fee-only*
adviser.").

Inter is self-hosted as a single variable woff2 (latin subset, weights
300–700) at `src/fonts/Inter-Variable-latin.woff2`. Do not switch either
typeface back to `next/font/google`, and do not introduce a third typeface.

**Large display numerals (e.g. the "20%" stat) need `lining-nums`.** Georgia
and Gelasio default to old-style figures, which have uneven heights/baselines
at display size — fine inline, wrong for a big standalone stat. Pair
`font-serif` with the `lining-nums` Tailwind utility on those specifically.

## Approved terminology

The firm's profit-sharing benefit for clients is **"Reciprocity by
Contract"** (formerly "The Client Pool" — that name is retired, don't
reintroduce it).
- Always: "Reciprocity by Contract"
- Never: "The Client Pool" / "assignment provision"

Shared copy for this concept lives in `src/data/differentiators.ts`
(`reciprocityByContract` export) — reuse it rather than re-writing the
description inline.

**"Adviser" vs "advisor."** Use **adviser** when referring to the firm/entity
(matches the Investment Advisers Act of 1940 and Form ADV's own spelling —
"Registered Investment Adviser," "the Adviser"). Use **advisor** when
referring to an individual person (a client's advisor, a prior advisor,
"advisor_qualities" in the intake questionnaire). Check new copy against
both meanings — it's easy to typo one for the other since they're
homophones.

## Compliance guardrails

This is a registered investment advisor's public website. When writing or
reviewing copy:

- **No testimonials.** Client endorsements, quotes, or reviews are not
  permitted on the site.
- **No performance claims.** Do not state or imply specific investment
  returns, performance figures, or guarantees of results.
- **Never collect SSNs or account numbers.** The contact form
  (`src/components/shared/ContactForm.tsx`) only collects name, email, phone,
  and client type — keep it that way. Sensitive account details are handled
  off-site, not through this form.
