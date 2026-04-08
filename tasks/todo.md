# IGC Website — Build Plan

## Project: Integrated Growth Consultants
**Stack:** Next.js 15 (App Router) + Tailwind CSS v4 + Framer Motion
**Deploy:** Netlify (free tier, client handles domain)
**Status:** BUILD COMPLETE — ready to push to GitHub + connect Netlify

---

## Positioning (locked)

NOT: "premium agency" / "design shop" / "marketing agency"
IS: growth infrastructure operators / system builders / deployment unit

Impression on landing: "These guys build the engine — not the front end."

Language IN: infrastructure, systems, acquisition engine, deployment, operators
Language OUT: "we help businesses grow", "tailored solutions", "results-driven"

---

## Design Tokens (locked)

```
--ink:        #0A0A0A   (near-black base)
--paper:      #F7F5F0   (off-white surface)
--paper-dark: #EEEAE0   (slightly deeper surface)
--gold:       #B8860B   (MICRO accent only — lines, details, never fills)
--signal:     #1A3C2E   (deep green for CTA / emphasis)
--muted:      #6B6456   (secondary text)
--border:     #D4D0C8   (subtle dividers)

Typography:
  Display/Headings: Playfair Display (400, 700, italic)
  Body/UI:          DM Sans (300, 400, 500)
  Mono accents:     DM Mono (400) — labels, tags, metadata

Motion:
  Duration: 0.6s–0.9s (slow, deliberate)
  Easing: cubic-bezier(0.16, 1, 0.3, 1) (smooth deceleration)
  Style: fade + subtle translateY(12px) — almost unnoticeable
  NO: staggered fireworks, scroll-triggered spectacles
```

---

## Pages (5)

1. **Home** — system statement above fold → How It Works → 90-Day Sprint CTA → trust strip
2. **Services** — 90-Day Sprint as hero offer → supporting services
3. **About** — authority statement + LinkedIn anchor + founding story
4. **Results** — stub (positioned, empty, ready to populate)
5. **Contact** — "Book a Call" (not "Contact Us") + form

---

## Tasks

### Phase 1 — Scaffold
- [x] Init Next.js 15 project in /Users/viljoen/IGC-website
- [x] Install deps: framer-motion, next/font
- [x] Configure Tailwind v4 with design tokens
- [x] Create netlify.toml (static export)
- [x] Root layout: fonts + metadata shell

### Phase 2 — Core Components
- [x] Logo/wordmark component (typographic, SVG)
- [x] Nav (wordmark + links + LinkedIn + CTA, mobile hamburger with Framer Motion)
- [x] Footer (logo + nav + LinkedIn + copyright)
- [x] Button (primary / ghost / outline)
- [x] SectionWrapper
- [x] motion.ts variants

### Phase 3 — Home Page
- [x] Hero (system statement, above fold, staggerSlow entrance)
- [x] How It Works (3-step, fadeUp on scroll)
- [x] 90-Day Sprint block + CTA (dark section)
- [x] Trust strip (Why IGC, 3 proof points)

### Phase 4 — Inner Pages
- [x] Services (full Sprint treatment + 5 components)
- [x] About (operator statement + founder + philosophy)
- [x] Results (positioned stub, no fabricated metrics)
- [x] Contact (Netlify Form, data-netlify="true")

### Phase 5 — Ship
- [x] SEO meta + OG tags + sitemap + robots.ts
- [x] sitemap.ts with export const dynamic = 'force-static'
- [x] robots.ts with export const dynamic = 'force-static'
- [x] netlify.toml build verified (npm run build → /out)
- [x] npm run build produces /out — confirmed
- [ ] Replace /public/og-image.svg with a real 1200×630 JPG (user action)
- [ ] Fill in LinkedIn URL in About page + Nav/Footer ([LINKEDIN_URL] placeholder)
- [ ] Run Lighthouse 90+ audit after deploy
- [ ] Mobile + desktop final review in browser

---

## User actions required before launch

1. **LinkedIn URL** — find/replace `[LINKEDIN_URL]` in:
   - `app/about/page.tsx` (line ~55)
   - Update `Nav.tsx` + `Footer.tsx` LinkedIn hrefs to personal profile if different from company page

2. **OG image** — replace `/public/og-image.svg` with `/public/og-image.jpg` (1200×630). Also update `app/layout.tsx` to reference `/og-image.jpg` (already set, just create the file).

3. **Deploy** — push to GitHub → connect to Netlify → Netlify Forms auto-activates on first deploy.

---

## Lessons
_Updated after corrections_

- sitemap.ts and robots.ts require `export const dynamic = 'force-static'` when using `output: 'export'` in Next.js 15
