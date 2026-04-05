# Reciprocal Wealth Website

Two homepage design concepts for Reciprocal Wealth, a boutique fee-only wealth management firm.

- **Concept A** — Classic Trust / Editorial Boutique: clean, conservative, premium. White backgrounds, restrained Forest Green, editorial typography.
- **Concept B** — Modern Relationship-Driven Advisory: warmer, more personal. Deep Forest hero sections, ambient video background, stronger contrast, more prominent founder presence.

## Live Preview

**https://reciprocal-wealth.vercel.app**

| Page | URL |
|---|---|
| Concept Chooser | [/](https://reciprocal-wealth.vercel.app) |
| Concept A Homepage | [/concept-a](https://reciprocal-wealth.vercel.app/concept-a) |
| Concept B Homepage | [/concept-b](https://reciprocal-wealth.vercel.app/concept-b) |

Both concepts include inner pages: Why Reciprocal, Who We Are, FAQs, Talk to Us, and Disclosures.

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm (comes with Node.js)

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the concept chooser. Click into Concept A or Concept B.

### Build for Production

```bash
npm run build
```

This generates a fully static site in the `out/` directory — plain HTML, CSS, and JS files that can be hosted anywhere.

## Hosting

The site is currently deployed on **Vercel** (free tier) via direct CLI deploy.

### To redeploy after local changes:

```bash
npx vercel --yes
```

### To connect a GitHub repo for auto-deploy:

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Next.js — no configuration needed
4. Every push to `main` auto-deploys (about 60 seconds)

### Custom domain:

Once a concept is chosen and finalized, point the domain's DNS to Vercel. They handle SSL automatically.

## How to Update Content

All website copy lives in simple TypeScript files under `src/data/`. You can edit these directly in GitHub's web editor — no terminal required.

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
    page.tsx                    # Concept chooser (root page)
    layout.tsx                  # Root layout (font, metadata)
    globals.css                 # Tailwind config, brand tokens, typography
    concept-a/                  # Concept A (Classic Trust)
      layout.tsx                # Header + Footer wrapper
      page.tsx                  # Homepage
      why-reciprocal/page.tsx
      who-we-are/page.tsx
      faqs/page.tsx
      talk-to-us/page.tsx
      disclosures/page.tsx
    concept-b/                  # Concept B (Modern Relationship)
      (same structure)
  components/
    shared/                     # Reusable across both concepts
      Logo.tsx                  # Logo with variant/theme support
      FadeIn.tsx                # Scroll-triggered fade animation
      SectionLabel.tsx          # Styled section headings
      FAQAccordion.tsx          # Expandable FAQ items
      ContactForm.tsx           # Contact form with validation
    concept-a/                  # Concept A specific (HeaderA, FooterA)
    concept-b/                  # Concept B specific (HeaderB, FooterB)
  data/                         # All website copy (edit these!)
    siteConfig.ts               # Name, contact info, nav links, disclosures
    founders.ts                 # Founder bios and headshots
    values.ts                   # Brand values
    differentiators.ts          # "Why Reciprocal" points
    faqs.ts                     # FAQ content
public/
  images/                       # Logos and founder headshots
    stock/                      # New England landscape & lifestyle photos
  video/
    hero-ambient.mp4            # Ambient background video (Concept B hero)
```

## Tech Stack

- **Next.js 16** (App Router, static export)
- **Tailwind CSS v4** with custom brand design tokens
- **TypeScript**
- **Inter** typeface (Google Fonts)

## Brand Colors

| Color | Hex | Usage |
|---|---|---|
| Forest Green | `#0F6E56` | Primary brand, CTAs, accents |
| Deep Forest | `#04342C` | Dark sections, footer, Concept B hero |
| Warm Gray | `#F0EFED` | Alternating section backgrounds |
| Stone | `#888780` | Secondary text, captions |
| Near Black | `#1A1A18` | Body text, headlines |

## Next Steps

Once the client picks a concept direction:

1. Remove the unchosen concept directory and components
2. Promote the chosen concept's routes to the root (`/` instead of `/concept-a` or `/concept-b`)
3. Remove the concept chooser page
4. Connect a GitHub repo for automatic deploys
5. Point the custom domain to Vercel
