# Reciprocal Wealth Website

The public website for Reciprocal Wealth, LLC, a boutique fee-only wealth
management firm.

## Live Preview

**https://reciprocal-wealth.vercel.app**

| Page | URL |
|---|---|
| Home | [/](https://reciprocal-wealth.vercel.app) |
| Why Reciprocal | [/why-reciprocal](https://reciprocal-wealth.vercel.app/why-reciprocal) |
| Who We Are | [/who-we-are](https://reciprocal-wealth.vercel.app/who-we-are) |
| FAQs | [/faqs](https://reciprocal-wealth.vercel.app/faqs) |
| Talk to Us | [/talk-to-us](https://reciprocal-wealth.vercel.app/talk-to-us) |
| Disclosures | [/disclosures](https://reciprocal-wealth.vercel.app/disclosures) |

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm (comes with Node.js)

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Build for Production

```bash
npm run build
npm run start
```

This runs a standard Next.js production build (App Router, Node runtime) —
not a static export. Server-side features like the permanent redirects in
`next.config.ts` and on-demand image optimization depend on running on a
Node.js host (Vercel, in our case) rather than a static file server.

## Hosting

The site is deployed on **Vercel** (project: `reciprocal-wealth`).

### To redeploy after local changes:

```bash
npx vercel        # preview deployment
npx vercel --prod  # production deployment
```

### To connect a GitHub repo for auto-deploy:

1. Go to [vercel.com](https://vercel.com), open the `reciprocal-wealth`
   project, and connect it to this GitHub repository under Settings → Git
2. Every push to `main` will then auto-deploy (about 60 seconds); other
   branches get their own preview deployment URL

### Custom domain:

Once ready, point the domain's DNS to Vercel. They handle SSL automatically.

## How to Update Content

All website copy lives in simple TypeScript files under `src/data/`. You can
edit these directly in GitHub's web editor — no terminal required.

| What to change | File to edit |
|---|---|
| Contact info, address, phone, email | `src/data/siteConfig.ts` |
| Founder bios and headshots | `src/data/founders.ts` |
| Brand values and descriptions | `src/data/values.ts` |
| "Why Reciprocal" differentiators | `src/data/differentiators.ts` |
| FAQ questions and answers | `src/data/faqs.ts` |
| Disclosure text | `src/data/siteConfig.ts` (disclosure field) |

### To edit in GitHub:

1. Navigate to the file (e.g., `src/data/faqs.ts`)
2. Click the pencil icon (Edit)
3. Make your changes
4. Click "Commit changes"
5. Vercel auto-deploys in about 60 seconds

### To update headshot photos:

1. Replace the image file in `public/images/` (keep the same filename)
2. Commit the change

## Project Structure

```
src/
  app/
    page.tsx                    # Homepage
    layout.tsx                  # Root layout (font, header/footer, metadata)
    globals.css                 # Tailwind config, brand tokens, typography
    sitemap.ts                  # /sitemap.xml
    robots.ts                   # /robots.txt
    not-found.tsx                # Branded 404
    why-reciprocal/page.tsx
    who-we-are/page.tsx
    faqs/page.tsx
    talk-to-us/page.tsx
    disclosures/page.tsx
  components/
    Header.tsx                  # Site header/nav
    Footer.tsx                  # Site footer
    shared/                     # Reusable components
      Logo.tsx                  # Logo with variant/theme support (next/image)
      FadeIn.tsx                # Scroll-triggered fade animation
      SectionLabel.tsx          # Styled section headings
      FAQAccordion.tsx          # Expandable FAQ items
      ContactForm.tsx           # Contact form with validation
  data/                         # All website copy (edit these!)
    siteConfig.ts                # Name, contact info, nav links, disclosures
    founders.ts                  # Founder bios and headshots
    values.ts                    # Brand values
    differentiators.ts           # "Why Reciprocal" points, incl. The Client Pool
    faqs.ts                       # FAQ content
  fonts/
    Inter-Variable-latin.woff2   # Self-hosted variable Inter (latin subset)
  lib/
    site-url.ts                  # Resolves the canonical site URL for metadata
public/
  images/                       # Logos, founder headshots, OG image, favicons
    stock/                       # New England landscape & lifestyle photos
  video/
    hero-ambient.mp4             # Ambient background video (hero)
scripts/
  generate-images.mjs           # Regenerates favicon set + OG image from logo art
```

See [CLAUDE.md](CLAUDE.md) for brand colors, typography rules, approved
terminology, and compliance guardrails.

## Tech Stack

- **Next.js 16** (App Router, standard Node.js build)
- **Tailwind CSS v4** with custom brand design tokens
- **TypeScript**
- **Inter** typeface, self-hosted (see [CLAUDE.md](CLAUDE.md))

## Brand Colors

| Color | Hex | Usage |
|---|---|---|
| Forest Green | `#0F6E56` | Primary brand, CTAs, accents |
| Deep Forest | `#04342C` | Dark sections, footer, hero |
| Warm Gray | `#F0EFED` | Alternating section backgrounds |
| Stone | `#888780` | Secondary text, captions |
| Near Black | `#1A1A18` | Body text, headlines |
