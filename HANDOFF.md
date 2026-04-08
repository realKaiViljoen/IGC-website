# IGC Website — Claude Code Handoff

## What this is

You are continuing a build started in Claude.ai (Sonnet 4.6).
The scaffold is partially written. Your job is to complete it, verify it builds, and confirm Netlify deploy config is correct.

Read `/Users/viljoen/CLAUDE.md` first. That is the operating protocol for this machine.

---

## Project location

```
/Users/viljoen/IGC-website/
```

## What has already been written (do not overwrite without reading first)

```
package.json                     — Next.js 15, Framer Motion, Tailwind v4
next.config.ts                   — static export for Netlify
tailwind.config.ts               — design tokens (ink, paper, gold, signal, muted, border)
postcss.config.js
tsconfig.json
netlify.toml                     — build: npm run build, publish: out
app/globals.css                  — Tailwind v4 @theme block, base styles, gold-line + section-label utilities
app/layout.tsx                   — Root layout: Playfair Display + DM Sans + DM Mono via next/font, metadata, Nav + Footer shells
lib/motion.ts                    — Framer Motion variants: fadeUp, fadeIn, stagger, staggerSlow, lineReveal
components/ui/Logo.tsx           — Typographic wordmark: "IGC" in Playfair + "Integrated Growth Consultants" in DM Mono
components/ui/Button.tsx         — primary / ghost / outline variants, Link-based
components/ui/SectionWrapper.tsx — Consistent section padding + max-w-site centering
tasks/todo.md                    — Full build plan with phase breakdown
```

## What still needs to be built

### Phase 1 — finish scaffold (FIRST)
Run `npm install` in the project root, confirm it succeeds.

### Phase 2 — Core UI components

**`components/ui/Nav.tsx`**
- Desktop: Logo (left) + nav links (centre) + LinkedIn icon link + "Book a Call" CTA button (right)
- Mobile: Logo + hamburger → slide-down menu with links + CTA
- Sticky, `bg-paper/95 backdrop-blur-sm`, `border-b border-border`
- Links: Services, About, Results, Contact
- LinkedIn: external link, icon only on desktop (use an inline SVG, no icon library)
- CTA: Button component, variant="primary", href="/contact", label="Book a Call"
- Use Framer Motion for mobile menu open/close (subtle height animation)
- Mark as `'use client'`

**`components/ui/Footer.tsx`**
- Logo (left) + nav links (centre) + LinkedIn + copyright (right)
- `border-t border-border`, `bg-paper`, minimal
- Copyright: `© {year} Integrated Growth Consultants`

### Phase 3 — Home page (`app/page.tsx`)

Import and compose these sections (build each as a file in `components/sections/`):

**`HeroSection.tsx`**
- Above-fold, full viewport height on desktop
- Headline (Playfair, display-xl): `"We build acquisition engines."` — nothing generic
- Sub-headline (DM Sans, body-lg, muted): `"Patient acquisition infrastructure for med-aesthetic clinics. Not campaigns — systems. Not promises — deployment."`
- Two CTAs: `Button` primary → `/services` "See the Sprint" + `Button` ghost → `/contact` "Book a Call"
- Bottom-left: small mono label "Growth Infrastructure Operators"
- Gold accent: a single 1px horizontal line, 2rem wide, above the headline label — nothing else
- Framer: staggerSlow entrance on load (not scroll-triggered)
- Background: pure `bg-paper` — no gradients, no images

**`HowItWorksSection.tsx`**
- Section label: "How It Works"
- Headline (Playfair, display-md): `"Three phases. One outcome."`
- Three columns (stack on mobile):
  1. `01 — Diagnose` — "We audit your current acquisition funnel and identify exactly where patients are dropping out."
  2. `02 — Deploy` — "We build the full system: paid acquisition, lead capture, WhatsApp automation, reputation engine."
  3. `03 — Operate` — "We run it. You measure one number: new consultations booked per month."
- Each column: mono number label (gold, very small) + bold title + body copy
- Framer: fadeUp on scroll entry, staggered

**`SprintSection.tsx`**
- Dark section: `bg-ink text-paper`
- Section label (gold): "The Entry Point"
- Headline (Playfair, white): `"The 90-Day Growth Sprint"`
- Body: `"A fixed-scope, fixed-fee engagement. We build your full patient acquisition system in 90 days. At the end, you own the infrastructure. We operate it on retainer — or hand it over. No lock-in."`
- Three stat blocks (inline, horizontal): `15+ / New consultations per month`, `90 days / Full system live`, `R15,000 / Monthly retainer`
- CTA: Button, light variant (white border, white text, hover fills white), href="/services"
- Framer: fadeUp on scroll

**`TrustSection.tsx`**
- Section label: "Why IGC"
- Three short proof points (no fake logos, no fake reviews):
  1. `"Built in SA, for SA"` — "We understand the local market, the platforms, and the patient psychology. We are not an offshore template agency."
  2. `"LinkedIn-verified operator"` — "Our principal has an established LinkedIn presence and a documented track record in growth marketing across multiple ventures." + LinkedIn link
  3. `"Small team. Disproportionate capability."` — "AI-augmented delivery means we operate at the speed and output of a team five times our size."

### Phase 4 — Inner pages

**`app/services/page.tsx`**
- Hero: "The 90-Day Growth Sprint" — same as SprintSection but full page treatment, more detail
- Below: list of what is included (5 components from the playbook: Paid Acquisition, Lead Capture Funnel, WhatsApp Automation, Reputation Engine, Monthly Reporting)
- Each component: mono label + title + 2-sentence description
- Bottom CTA: "Book a Call" → /contact

**`app/about/page.tsx`**
- Hero statement (Playfair, large): `"We are operators, not vendors."`
- Body: positioning paragraph — "IGC was built on a simple premise: most agencies sell activity. We sell outcomes. We build the infrastructure that makes acquisition predictable — then we run it."
- Founder section: "K.C. Viljoen — Group Chair, Ingenuity Industries South Africa" + LinkedIn link (https://linkedin.com/in/[PLACEHOLDER — user to fill in]) + brief authority paragraph
- Do NOT invent credentials. Keep it honest and lean.

**`app/results/page.tsx`**
- Positioned stub. Headline: `"Results we can stand behind."`
- Sub: `"Case studies loading. We are currently in active deployment with our first cohort of clients. Results documented and published as they clear our verification standard."`
- CTA: "In the meantime, book a discovery call" → /contact
- Do NOT fabricate metrics or client names

**`app/contact/page.tsx`**
- Headline: `"Book a Call"`
- Sub: `"Not a sales call. A 20-minute diagnostic. We look at your current acquisition setup and tell you honestly whether we can move the needle."`
- Simple form: Name, Clinic Name, Email, Phone, "What's your biggest challenge right now?" (textarea)
- Below form: Calendly placeholder block — `"Prefer to book directly? [Calendly link coming — placeholder]"`
- Form action: static export compatible (use Netlify Forms — add `data-netlify="true"` to the form element and a hidden `input name="form-name"`)

### Phase 5 — SEO + deploy

**`app/sitemap.ts`** — generate sitemap for all 5 pages

**`app/robots.ts`** — allow all, sitemap reference

**OG image** — create `/public/og-image.jpg` placeholder (a simple 1200×630 dark card with "IGC — Integrated Growth Consultants" — can be a generated SVG converted, or just a placeholder note for the user to replace)

**Metadata** — each page needs its own `export const metadata` with title + description

---

## Design tokens (locked — do not deviate)

```
Palette:
  ink:        #0A0A0A
  paper:      #F7F5F0
  paper-dark: #EEEAE0
  gold:       #B8860B  ← MICRO use only (lines, labels, small details)
  signal:     #1A3C2E  ← CTA hover state, emphasis
  muted:      #6B6456
  border:     #D4D0C8

Typography:
  Display/Headings: Playfair Display (font-display class)
  Body/UI:          DM Sans (font-sans class)
  Labels/Mono:      DM Mono (font-mono class)

Motion:
  Duration: 0.6–0.9s
  Easing: cubic-bezier(0.16, 1, 0.3, 1)
  Style: fade + subtle translateY(12px)
  Rule: slow, deliberate, almost unnoticeable — NOT a design showcase
```

---

## Positioning rules (critical — enforced in copy)

NEVER use: "we help you grow", "tailored solutions", "results-driven", "passionate", "dedicated"

ALWAYS use: infrastructure, systems, acquisition engine, deployment, operators, build

Impression the site must create: "Small team. Disproportionate capability. They build the engine."

---

## Verification checklist before marking done

- [ ] `npm install` completes without errors
- [ ] `npm run dev` serves the site on localhost:3000
- [ ] All 5 pages render without console errors
- [ ] `npm run build` completes and produces `/out` directory
- [ ] Mobile nav opens and closes correctly
- [ ] No inline styles fighting Tailwind tokens
- [ ] Lighthouse performance > 90 on homepage (run via CLI or DevTools)
- [ ] `netlify.toml` confirmed: build command `npm run build`, publish `out`

---

## Deploy instructions (for user after build)

1. Push `/Users/viljoen/IGC-website` to a new GitHub repo
2. Connect repo to Netlify (netlify.com → Add new site → Import from Git)
3. Build settings are pre-configured in `netlify.toml` — no manual config needed
4. Add custom domain via Netlify DNS settings (user handles domain separately)
5. Netlify Forms will activate automatically on first deploy — no backend needed for the contact form

---

## Notes for Claude Code

- The project is in `/Users/viljoen/IGC-website` — `npm install` has NOT been run yet
- Read `tasks/todo.md` for the phase breakdown and mark items complete as you go
- After corrections, update `tasks/lessons.md`
- This is a static export site — do not use any Next.js features that require a Node server (no API routes, no server actions that aren't compatible with static export)
- Netlify Forms requires `data-netlify="true"` on the form — this is the only backend dependency
- The LinkedIn URL in About is a placeholder — leave it as `[LINKEDIN_URL]` for the user to fill in
