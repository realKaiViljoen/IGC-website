# IGC Website — Project Handoff

**Last updated:** 2026-04-10  
**Status:** Marketing site live on Netlify. Client portal built and coherence-aligned. Ready for CometChat integration and production auth hardening.

---

## 1. Business Context

**IGC** (Insight Growth Consulting) is a BD infrastructure agency targeting **independent recruitment agency owners** in South Africa — specifically those running 2–15 person shops doing tech/engineering placements in Gauteng.

**Core offer:** A 30-day fixed-fee engagement to build a mandate acquisition system (LinkedIn sequences, landing pages, CRM setup, automation workflows). Client owns all assets. Optional retainer after build.

**Positioning:** Not a marketing agency. Not a LinkedIn coach. Infrastructure builder. The entire site is written from an operator's perspective — declarative, no fluff, proof-first.

**Guarantee:** 5 qualified client conversations in 30 days or they keep running the system at no charge.

**Target client pain:** Owner-led BD collapses under load. Billers can't do cold outreach. Agencies tried content agencies and got posts, not mandates.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 11 |
| Auth | NextAuth v5 (credentials provider) |
| Runtime | Node.js / Vercel-compatible |
| Hosting | Netlify (auto-deploys from `main`) |
| Path alias | `@/*` → project root |

**Key config files:**
- `tailwind.config.ts` — all custom tokens, font families, type scale, ease curves
- `app/globals.css` — CSS custom properties, keyframe animations, utility classes
- `lib/motion.ts` — canonical animation variants (`stagger`, `staggerFast`, `fadeUp`, `fadeIn`, `lineReveal`)
- `next.config.ts` — image domains, no special flags
- `middleware.ts` — NextAuth session guard on `/portal/**`

---

## 3. File Map

```
/
├── app/
│   ├── layout.tsx              # Root layout: fonts, NavBar, Footer
│   ├── page.tsx                # Marketing homepage (section composition)
│   ├── globals.css             # CSS tokens, keyframes, utility classes
│   ├── diagnostic/
│   │   └── page.tsx            # Booking/diagnostic form page
│   └── portal/
│       ├── layout.tsx          # Portal layout: Sidebar + content area
│       ├── page.tsx            # Dashboard (server component, loads client data)
│       └── messages/
│           └── page.tsx        # Messaging view
│
├── components/
│   ├── sections/               # Marketing section components
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── ComparisonSection.tsx
│   │   ├── SprintSection.tsx
│   │   ├── TestimonialSection.tsx
│   │   ├── TrustSection.tsx
│   │   ├── FAQSection.tsx
│   │   └── ClosingCTA.tsx
│   ├── portal/                 # Portal-specific components
│   │   ├── DashboardHeader.tsx
│   │   ├── ConfidenceSignals.tsx
│   │   ├── PipelineSection.tsx
│   │   ├── CommitmentsSection.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── UpcomingSection.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MessageComposer.tsx
│   │   ├── MessagesClient.tsx
│   │   ├── UpdateLogModal.tsx
│   │   ├── UpdateLogBadge.tsx
│   │   ├── ReferenceCard.tsx
│   │   └── ReferencePicker.tsx
│   └── ui/                     # Shared primitives
│       ├── Button.tsx          # 5 variants × 3 sizes, canonical focus rings
│       ├── Nav.tsx             # Top nav with mobile drawer + "Client Portal Soon" item
│       ├── Footer.tsx
│       ├── SectionWrapper.tsx  # Padding + max-w-site (1200px)
│       └── MotionProvider.tsx  # prefers-reduced-motion context
│
├── lib/
│   ├── motion.ts               # Animation variants (stagger, fadeUp, etc.)
│   ├── analytics.ts            # computeAnalytics(client) → AnalyticsResult
│   └── auth.ts                 # NextAuth config
│
├── hooks/
│   ├── useCountUp.ts           # Animated number counter (reduced-motion safe)
│   └── useMagnetic.ts          # Magnetic button hover effect (reduced-motion safe)
│
├── data/
│   └── clients/
│       └── igc-demo-001.ts     # Demo client: Vantage Technology / Thandi Nkosi
│
├── docs/
│   └── design/
│       └── coherence-report-2026-04-10.md  # Portal vs website audit findings
│
└── HANDOFF.md                  # This file
```

---

## 4. Design System

### The Two Non-Negotiable Rules

**THE GOLD RULE:**  
`#CF9B2E` is used ONLY for crisp, discrete UI elements: text, borders, ordinal numbers, the `gold-line` decorator, stat values in callout cards. **NEVER** as atmospheric fills, glowing shadows, pulsing animations, or background gradients. Violation = immediate fix.

**THE ATMOSPHERIC RULE:**  
All depth/mood gradients use warm-white only: `rgba(242,237,228,0.03–0.05)` via `radial-gradient`. Position varies by section (ceiling, side, corner). Gold never enters the atmospheric layer.

---

### Color Palette

```
Backgrounds
  #080808  — page background (deepest)
  #0D0D0C  — surface-soft (sidebar)
  #111110  — surface (cards, section alternates)

Text
  #F2EDE4  — primary (headings, key numbers)
  #C5C0BB  — mid (body copy, stat labels)
  #A09890  — secondary (captions, mono labels)
  #857F74  — tertiary (very dim metadata)

Borders
  #2D2A27  — dark border (primary)
  #302D2A  — mid border (stat dividers)

Gold
  #CF9B2E  — canonical gold (only crisp elements)

Signal (portal only)
  #3D8B5E  — nominal/green
  #CF9B2E  — watch/amber (same as gold)
  #B84233  — critical/red
```

---

### Typography

```
font-display   → Playfair Display (headings, large numerals)
font-sans      → Inter (body copy, UI labels)
font-mono      → DM Mono (metadata, section labels, stat sub-labels)
```

**Type scale classes (all clamp-based, defined in globals.css):**
```
text-display-xl  — hero headlines
text-display-lg  — section headlines, major stats
text-display-md  — sub-headlines
text-display-sm  — section headings, card titles
text-body-lg     — lead body copy
text-body-md     — secondary body copy
```

Never use raw Tailwind scale (`text-4xl`, `text-2xl`, `text-xl`) for structural content. Use canonical classes above.

---

### Section Label Pattern

```tsx
<span className="section-label">Label text</span>
```

CSS class in globals.css: `font-mono`, `font-size: 0.75rem`, `font-weight: 500`, `letter-spacing: 0.14em`, `uppercase`, `color: #A09890`.

---

### Gold-Line Decorator

```tsx
<span className="gold-line mb-6 block" aria-hidden="true" />
```

Defined in globals.css as a short horizontal gold line. Appears above `section-label` in most marketing sections. **Not used in portal** (product UI, not marketing surface).

---

### Ghost Numbers (Watermark Pattern)

Large decorative numbers visible behind content:
```tsx
<span
  className="absolute ... font-display text-[#F2EDE4]/[0.02] select-none pointer-events-none"
  style={{ fontSize: 'clamp(6rem, 18vw, 18rem)' }}
  aria-hidden="true"
>
  30
</span>
```

Used in SprintSection ("30") and ClosingCTA ("IGC").

---

### Motion

**All sections follow this pattern:**
```tsx
const ref = useRef(null)
const inView = useInView(ref, { once: true, margin: '-80px' })

<motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
  <motion.div variants={fadeUp}>...</motion.div>
</motion.div>
```

**Never use `whileInView` directly** — bypasses the `-80px` margin timing.

**Variants (from lib/motion.ts):**
- `stagger` — 120ms stagger delay parent container
- `staggerFast` — 60ms stagger (used in ActivityFeed)
- `fadeUp` — slide up 24px + fade in, 0.6s, ease `[0.16, 1, 0.3, 1]`
- `fadeIn` — fade only
- `lineReveal` — scaleX from 0 to 1 (for decorative lines)

**Ease curve everywhere:** `[0.16, 1, 0.3, 1]` (decelerate-in). Tailwind arbitrary: `ease-[cubic-bezier(0.16,1,0.3,1)]`.

**prefers-reduced-motion:** Checked in `CountUp` (SprintSection), `useCountUp` hook (portal), `useMagnetic` hook. Pattern: `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { /* jump to final state */ return }`.

---

### Layout

`SectionWrapper` provides:
- `max-w-site` (1200px) centered
- Responsive horizontal padding (px-6 md:px-10 lg:px-16)
- Vertical padding (py-24 md:py-32)
- `relative overflow-hidden` for atmospheric gradient containment

All sections use `<SectionWrapper>`. Never raw section/div with manual padding.

---

### Button Component

```tsx
<Button variant="primary" size="md" href="/diagnostic">CTA Text</Button>
```

**Variants:** `primary` (gold bg), `ghost` (transparent + gold border), `outline` (white border), `light` (warm-white), `tertiary` (text-only)  
**Sizes:** `sm`, `md`, `lg`  
**Features:** Renders as `<a>` when `href` provided, `<button>` otherwise. Canonical focus ring: `focus-visible:ring-2 focus-visible:ring-[#CF9B2E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`.

---

### CSS Keyframe Animations (globals.css)

- `gold-shimmer` — subtle text shimmer on hero heading
- `terminal-cursor` — blinking cursor in ActivityFeed/ConfidenceSignals
- `fade-in-up` — CSS fallback for non-Framer elements

---

## 5. Brand Voice & Copy Rules

**Tone:** Operator-to-operator. Direct. No enthusiasm inflation. No agency-speak.  
**Evidence first:** Every claim backed immediately (stats, specific numbers, outcomes).  
**Declarative over promotional:** "The system runs on your LinkedIn account." Not "We'll leverage your LinkedIn presence."  
**Short sentences.** Paragraph length: 2–3 sentences max.  
**Niche acknowledgment:** Writes as if the reader is a specific person (2–5 person recruitment agency owner in Gauteng, tech/engineering niche, tried content agencies and LinkedIn ads without converting mandates).

**Prohibited patterns:**
- "We help you…" (passive agency positioning)
- "World-class / cutting-edge / innovative"
- Enthusiasm inflation: "Exciting!", "Amazing results!"
- Vague timeframes: "quickly", "soon", "in no time"
- Hedge words: "might", "could potentially"

**Numbers always specific:** "22 confirmed consultations" not "more consultations". "R40,000+" not "significant revenue".

---

## 6. Marketing Website

**Homepage composition (app/page.tsx):**
```
HeroSection
ProblemSection
HowItWorksSection
ComparisonSection
SprintSection
TestimonialSection
TrustSection
FAQSection
ClosingCTA
```

### Section Summaries

**HeroSection** — Full-viewport. "The mandate pipeline your agency is missing." Large ghost watermark "IGC" behind. Dual CTA (primary: Book BD Audit → /diagnostic, secondary: See how it works → scrolls to HowItWorks). Pill badge above headline. Live countdown timer to next availability. Background: deep atmospheric gradient from top-right. Uses `useMagnetic` on primary button (desktop only).

**ProblemSection** — Dark surface. 4 numbered pain points (accordion: hover on desktop, tap on mobile, AnimatePresence). PainPoints: LinkedIn ads with no calls, content agencies with no mandates, billers who won't do cold BD, owner-led BD that collapses under load. Row hover: warm-white radial.

**HowItWorksSection** — 3 phases: Build (wk 1–2, systems), Launch (wk 3–4, live outreach), Operate (month 2+, retainer). Each phase has numbered steps. Gold ordinals.

**ComparisonSection** — Table: IGC vs content agency vs in-house BD hire. Rows: mandate focus, asset ownership, cost, timeline, lock-in. Uses checkmarks/X.

**SprintSection** — The main offer section. 3 CountUp stats (R10,000 retainer / 30 days / 5+ conversations). Ghost watermark "30". Revenue callout (R40,000+ / one placement covers 4 months). 3 risk-reversal ownership statements. Guarantee block (gold border). Primary CTA: Book a BD Audit.

**TestimonialSection** — Dr. A.M., Medical Aesthetics, Sandton. 22 consultations in month 3 vs 6 average. Large gold quotation mark watermark. Stat callout card (gold border + subtle gold background).

**TrustSection** — Signals of credibility. Client ownership guarantee, no rev-share, South Africa-specific context.

**FAQSection** — 6 questions, accordion pattern. Questions address main objections: cost, timeline, what if it doesn't work, what's the retainer.

**ClosingCTA** — Full viewport. "Your next build slot is open." Ghost watermark "IGC". Build capacity = 6 agencies per quarter. CTA: Claim Your Build Slot → /diagnostic.

**Nav (Nav.tsx):** Logo "IGC" left. Desktop right: LinkedIn icon | "Client Portal" (lock icon, "Soon" pill, dim text, links /portal) | vertical divider | "Book a BD Audit" button. Mobile: hamburger → full-screen drawer. Client Portal item also in mobile nav with inline "Soon" label.

**Diagnostic page (app/diagnostic/page.tsx):** Booking/audit form. Standard form fields (name, agency, email, phone, current pipeline situation). Sends to... (TBD, currently likely a static form).

---

## 7. Client Portal Architecture

### Auth

NextAuth v5 credentials provider. Config in `lib/auth.ts`. Session guard via `middleware.ts` (matches `/portal/**`).

**Demo account:** `sarah@aperture.com` / `password123` (bcryptjs hashed at build time — check lib/auth.ts for hash).

**Login page:** `app/portal/login/page.tsx` (custom styled, full-screen dark layout matching portal palette).

**PRODUCTION GAP:** Single hardcoded demo account. Real auth needs a database + user management before going live with real clients.

---

### Data Architecture

**Single file per client:** `data/clients/igc-demo-001.ts`  
**Type definition:** `lib/types.ts` (ClientRecord interface)  
**Analytics computation:** `lib/analytics.ts` → `computeAnalytics(client): AnalyticsResult`

**Current demo client (igc-demo-001.ts):**
- Client: Vantage Technology Pty Ltd
- Engagement lead: Thandi Nkosi (CPO)
- Active brief: Lead Data Engineer + 2x Senior DevOps Engineers (Midrand/remote)
- Pipeline: 7 candidates across Sourced/Qualified/Shortlisted/Interview/Offer stages
- Commitments: 6 items (5 met ✓, 1 in progress)
- Activity: 12 entries, 2026-02-24 to 2026-04-09
- Upcoming: 5 events, nextUpdate: 2026-04-17
- Confidence signals: fill rate 94%, avg placement speed 18 days, retention rate 91%

**PRODUCTION GAP:** No database. All data is static TypeScript. For production: move to Supabase/Postgres, query by authenticated user's clientId.

---

### Portal Components

**Layout (`app/portal/layout.tsx`):** `Sidebar` + main content area (flex row). Dark background `#080808`. Sidebar fixed width.

**Sidebar (`components/portal/Sidebar.tsx`):**
- IGC logo + nav items (Dashboard, Messages, Documents[future], Settings[future])
- Active item: crisp gold `border-l-2 border-[#CF9B2E]` (no glow)
- Static gold indicator dot on active item (no pulse)
- Bottom: consultant info + sign out (`Button variant="ghost"`)
- Surface: `bg-[#0D0D0C]`, border: `border-[#2D2A27]`

**DashboardHeader:** Greeting + client name, brief description, consultant info. Static status dot (no glow).

**ConfidenceSignals:** 3 KPI cards (fill rate, placement speed, retention). Display numerals via `useCountUp` hook (reduced-motion safe). Removed gold text-shadows.

**PipelineSection:** Kanban-style columns per stage. Left-border urgency coding (red/gold/transparent). Candidate cards with urgency signals. `useInView` hook pattern.

**CommitmentsSection:** List of IGC commitments with status indicators (text spans — future: SVG circles). `useInView` hook pattern.

**ActivityFeed:** Chronological activity entries with terminal-cursor blink effect. `staggerFast` (60ms) variant. `useInView` hook pattern.

**UpcomingSection:** Next events/checkpoints. Warm-white atmospheric background (not gold). `useInView` hook pattern.

**UpdateLogModal:** Full-screen overlay with recent update logs. Backdrop at 0.3s, ease `[0.16, 1, 0.3, 1]`. Gold border `#CF9B2E/20`. `#2D2A27` internal borders.

**UpdateLogBadge:** Badge showing unread update count. No glow animation. Canonical focus ring.

**MessageComposer:** Text area + Reference button (ghost) + Send button (primary). Uses `Button` component. `#CF9B2E` canonical gold.

**MessagesClient.tsx:** CometChat integration — **fully stubbed**. All CometChat calls are `console.log` only. UI renders but no real messages. This is the primary production gap for messaging.

**ReferenceCard / ReferencePicker:** File/document reference attachment in messages. `#CF9B2E` canonical gold.

---

### Portal Production Gaps (Priority Order)

1. **CometChat integration** — MessagesClient.tsx is fully stubbed. Needs real CometChat SDK calls. SDK is installed (`@cometchat/chat-sdk-javascript`). Requires CometChat app credentials in env vars.

2. **Real authentication** — Single demo account is hardcoded. Needs user table in database, login by email, session tied to clientId for data access.

3. **Dynamic data loading** — All data is static TypeScript files. Needs API routes or server actions reading from Supabase/Postgres by clientId.

4. **Documents section** — Nav item exists, page not implemented. Clients need to view SOWs, placement reports, invoice history.

5. **Settings page** — Nav item exists, page not implemented. Notification preferences, contact details.

6. **Diagnostic form** — Marketing site form (`/diagnostic`) needs a backend action (email or CRM write).

---

## 8. Current State

### What's Done
- Full marketing site: all sections, copywritten for recruitment agency niche, coherent design system
- Client portal: auth, dashboard, pipeline, commitments, activity feed, upcoming, messaging UI (stubbed)
- Design coherence audit completed (2026-04-10): all 7 CRITICAL findings fixed, all 7 MODERATE findings fixed, 5 MINOR items noted
- "Client Portal" nav item on main site with "Soon" pill
- Demo data: Vantage Technology, realistic tech recruitment scenario
- Netlify auto-deploy on push to `main`

### What's Not Done
- CometChat real implementation
- Database + real auth
- Dynamic data loading
- Documents page
- Settings page
- Diagnostic form backend

---

## 9. Backlog

| Priority | Item | Notes |
|----------|------|-------|
| P0 | CometChat integration | SDK installed, MessagesClient.tsx fully stubbed |
| P0 | Real auth + database | NextAuth + Supabase recommended |
| P1 | Dynamic client data | Server actions from DB |
| P1 | Diagnostic form backend | Resend or n8n webhook |
| P2 | Documents portal section | PDF viewer or link list |
| P2 | Settings page | Basic client preferences |
| P3 | M-07: Atmospheric depth on portal cards | Visual check first before implementing |
| P3 | m-05: Gold-line in portal headers | May feel too marketing-ish in product UI |

---

## 10. Key Decisions & Why

**font-display = Playfair Display (not Cormorant Garamond)**  
Both `font-display` and `font-playfair` Tailwind classes map to `var(--font-playfair)`. The coherence fix was a naming alignment (consolidating to `font-display`), not a typeface swap. Playfair Display is the chosen serif.

**Gold = crisp elements only**  
Deliberate constraint. Gold atmospheric effects (glows, pulses) create visual noise and make the UI feel cheaper. Warm-white gradients provide depth without competing with brand color. Enforced across every marketing and portal component.

**File-based client data (no database yet)**  
Intentional for v1. Allows rapid iteration on data shape without migration overhead. The type system enforces contract. Switch to DB when real clients need onboarding.

**useInView hook pattern over whileInView**  
The `-80px` margin on useInView ensures animations trigger slightly before elements enter viewport — smoother perceived entry. `whileInView` with no margin triggers at the viewport edge, which feels late. Also required for `prefers-reduced-motion` compliance (hook pattern allows conditional animation).

**SectionWrapper for all sections**  
Centralizes max-width and padding. When responsive padding needs to change, one file changes. Prevents drift where sections have different effective widths.

**Portal "Soon" label on main nav**  
Social proof signal — tells prospective clients that a portal exists (accountability, professionalism) before it's client-accessible. Low-cost trust signal.

---

## 11. Working Conventions

**Git**
- Branch: `main` (direct push for solo/small team work)
- Netlify auto-deploys on push to `main`
- Commit messages: conventional format (`feat:`, `fix:`, `chore:`)

**Tailwind**
- No raw size classes for structural content (`text-4xl` etc.) — use canonical scale
- No arbitrary colors not in palette
- Atmospheric gradients: warm-white only, radial, positioned contextually per section

**Component conventions**
- `'use client'` at top of any component using hooks/motion
- Server components for data-fetching pages (e.g., `app/portal/page.tsx`)
- Import order: React → framer-motion → local components → lib/hooks

**Animation conventions**
- Always `useInView` hook, never `whileInView` directly
- `once: true` on all marketing animations (don't replay)
- Portal animations can replay on navigation (once: true still fine for dashboard)
- `AnimatePresence` for conditional mount/unmount

**Environment variables needed for production**
```
NEXTAUTH_SECRET=
NEXTAUTH_URL=
COMETCHAT_APP_ID=
COMETCHAT_REGION=
COMETCHAT_AUTH_KEY=
DATABASE_URL=          # when DB added
```

---

*This document was compiled 2026-04-10 from a comprehensive project audit covering all source files, git history, design system, and business context. Update this document when making architectural decisions.*
