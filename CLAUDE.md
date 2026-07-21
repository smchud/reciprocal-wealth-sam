@AGENTS.md

# Reciprocal Wealth — Brand & Content Guardrails

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

## Typography

**Inter is the only webfont.** It's self-hosted as a single variable woff2
(latin subset, weights 300–700) at `src/fonts/Inter-Variable-latin.woff2`,
loaded via `next/font/local` in `src/app/layout.tsx`. Do not switch it back to
`next/font/google`, and do not introduce a second typeface.

**Georgia Bold is reserved exclusively for the R/W logo mark.** It exists only
as flattened artwork inside the logo PNGs in `public/images/`. Never load
Georgia as a webfont and never use it for live text anywhere on the site.

## Approved terminology

The firm's profit-sharing benefit for clients is **"The Client Pool"**.
- Always: "The Client Pool"
- Never: "assignment provision"

Shared copy for this concept lives in `src/data/differentiators.ts`
(`clientPool` export) — reuse it rather than re-writing the description
inline.

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
