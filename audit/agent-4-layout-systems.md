# Agent 4: Layout, Spacing & Systems Audit

**Date:** 2026-04-08
**Site:** IGC Website — `/Users/viljoen/IGC-website`
**Auditor:** Layout Systems Agent (Claude Sonnet 4.6)
**Reference benchmarks:** Linear, Vercel, Stripe, Resend, Liveblocks, Radix UI

---

## Executive Summary

The IGC website has a well-conceived design system documented in DESIGN.md with a clean token architecture. The implementation is largely faithful. The major systemic issues are:

1. **SectionWrapper padding is inconsistent with DESIGN.md spec** — the component uses `py-20 md:py-28`, not the specified `py-24 md:py-32 lg:py-40`. This affects every section that uses it.
2. **Gold Rule is violated on the Services page** — section label uses `text-gold` where `text-tertiary` is required by the spec.
3. **SprintSection uses an orphaned `light` button variant** — not described in DESIGN.md's 3-level CTA system. Should be `primary`.
4. **Contact page has an inline submit button** — not using the Button component, bypassing the magnetic wrapper and design system entirely.
5. **No `prefers-reduced-motion` handling** anywhere in the codebase — the motion system has no accessibility gate.
6. **HowItWorks step cards use scale animation on a `span`** — `group-hover:scale-105` on a text element is an off-grid motion violation.
7. **The `useMagnetic` hook fires on every `mousemove` window event** — no debounce or RAF batching, potential performance issue on complex pages.
8. **Tailwind config defines token aliases (legacy) that duplicate the design system** — `ink`, `paper`, `muted`, `paper-dark` create divergence risk.

The site's bones are correct. The issues are precision-level: padding consistency, gold discipline, and motion safety.

---

## Spacing & Grid System Audit

### Consistency Check

| Section | padding-y (actual) | padding-x (actual) | max-width | Issues |
|---|---|---|---|---|
| **HeroSection** | `py-20` (hardcoded) | `px-6 md:px-10 lg:px-16` | `max-w-site mx-auto` | Does not use SectionWrapper; py-20 vs spec py-24. Acceptable for hero (custom layout). |
| **TrustSection** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | SectionWrapper padding deviates from DESIGN.md spec (py-24 md:py-32 lg:py-40). |
| **SprintSection** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Same deviation as above. |
| **HowItWorksSection** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Same deviation as above. |
| **About Hero** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Same deviation as above. |
| **About Founder** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Uses `max-w-prose` inner constraint correctly. |
| **About Philosophy** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Inner max-w hardcoded as `max-w-[900px]` — not a design token. |
| **Services Hero** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Same deviation. |
| **Services Components** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Same deviation. |
| **Contact** | `py-20 md:py-28` (via SW) | `px-6 md:px-10 lg:px-16` (via SW) | `max-w-site mx-auto` (via SW) | Form constrained at `max-w-[640px]` — acceptable inline, but could be tokenised. |
| **Footer** | `py-10` (hardcoded) | `px-6 md:px-10 lg:px-16` | `max-w-site mx-auto` | Footer intentionally compact — py-10 is appropriate for footer context. |
| **Nav** | `h-16` (fixed height) | `px-6 md:px-10 lg:px-16` | `max-w-site mx-auto` | Consistent with system. |

**Root issue:** SectionWrapper (`/components/ui/SectionWrapper.tsx`, line 21) uses `py-20 md:py-28`. DESIGN.md specifies `py-24 md:py-32 lg:py-40`. The `lg:` breakpoint is entirely missing. This means all content sections are under-padded at large viewport widths — they will feel compressed on 1440px+ displays versus the premium breathing room the design spec intends.

**Horizontal padding:** Perfectly consistent across all components and pages. `px-6 md:px-10 lg:px-16` is used everywhere including Nav, Footer, and SectionWrapper. No violations.

**max-w-site:** Consistently applied everywhere via SectionWrapper or manually replicated. No violations found.

### 8px Grid Violations

The site uses an 8px base grid (confirmed in DESIGN.md). All spacing must be multiples of 4px.

| Location | Value | Issue |
|---|---|---|
| `HeroSection` metric cards | `padding: 18px 22px` (inline style, line 99) | **18px and 22px break the 8px grid.** Should be `16px 24px` (2×8, 3×8). |
| `HeroSection` metric cards | `top: ${22 + i * 22}%` (line 101) | 22% positioning — not grid-relevant but the 22% step creates uneven visual rhythm between cards. |
| `HeroSection` scroll cue | `bottom-8` = 32px | Fine (4×8). |
| `SectionWrapper` | `py-20 md:py-28` = 80px / 112px | 80px = 10×8 ✓, 112px = 14×8 ✓. Spec is 96px/128px/160px. All are on the 8px grid. The issue is scale, not grid conformance. |
| `HeroSection` badge | `px-3 py-1.5` = 12px / 6px | 6px is not on the 8px grid. Should be `py-2` (8px). Minor. |
| `HowItWorks` step cards | `p-6 pl-5` = 24px / 20px | Inconsistent inner padding. `pl-5` = 20px is on the 4px grid but breaks the square rhythm of `p-6`. |
| `SprintSection` stat gap | `gap-10 mb-12` | 40px / 48px — both on the 8px grid ✓. |
| `About Philosophy` grid | `max-w-[900px]` | 900px is not a design system token. Use `max-w-site` (1200px) or add `max-w-content: 900px` to token system. |

### Rhythm Assessment

**Vertical rhythm overall:** Moderate. The SectionWrapper creates a consistent section cadence but the under-padding versus spec means sections feel compressed. With correct spec padding (`py-24 md:py-32 lg:py-40`), section breathing room would match Vercel/Linear benchmarks. At current `py-20 md:py-28`, sections are acceptable but slightly denser than the premium aspiration.

**Section alternation:** `#080808` → `#111110` alternation is implemented correctly and consistently across all pages. The background pattern follows the spec. The difference between `#080808` and `#111110` is subtle but deliberate — this is the correct call.

**Section dividers:** The `section-divide` utility (1px `rgba(242,237,228,0.05)`) is available but used inconsistently. SectionWrapper has a `divide` prop that applies it, but no section currently passes `divide={true}`. The separation is handled purely by background color alternation, which works but loses the structural precision that a hairline divider adds between same-color sections.

---

## Component Architecture Audit

### Component Inventory

| Component | Location | Type | Used By | Notes |
|---|---|---|---|---|
| `SectionWrapper` | `components/ui/` | Server | All sections/pages | Clean abstraction. Missing `lg:` padding breakpoint vs spec. |
| `Button` | `components/ui/` | Client | Hero, About, Services, Contact, Nav | Good variant system. See issues below. |
| `Nav` | `components/ui/` | Client | Layout (assumed) | Has mobile menu. Correct implementation. |
| `Footer` | `components/ui/` | Server | Layout (assumed) | Clean. `LinkedInIcon` duplicated here and in Nav, About — extract to shared SVG. |
| `Logo` | `components/ui/` | Unknown | Nav, Footer | Not audited (file not provided). |
| `Cursor` | `components/ui/` | Client | Layout (assumed) | Not audited (file not provided). |
| `HeroSection` | `components/sections/` | Client | home page | Does not use SectionWrapper — intentional due to full-bleed layout. |
| `TrustSection` | `components/sections/` | Client | home page | Uses SectionWrapper correctly. |
| `SprintSection` | `components/sections/` | Client | home page | Uses SectionWrapper. Has CountUp sub-component inlined. |
| `HowItWorksSection` | `components/sections/` | Client | home page | Uses SectionWrapper. Steps rendered inline, not extracted. |

### Missing Components

**High priority — should be extracted:**

1. **`StatCard`** — The sprint stat pattern (large display number + mono label) appears in `SprintSection`, `ServicesPage` (inline), and the hero metric cards. Three separate implementations of the same visual pattern. Extract to a `StatCard` component with `value`, `label`, and optional `countUp` props.

2. **`Icon`** (SVG wrapper) — `LinkedInIcon` is copy-pasted verbatim in `Nav.tsx`, `Footer.tsx`, and `app/about/page.tsx`. This is a clear extraction candidate. A shared `<LinkedInIcon />` exported from `components/ui/icons.tsx` (or similar) would eliminate the triplicate.

3. **`ProofPoint` / `FeatureCard`** — The border-top card pattern (`border-t border-[#242220] pt-6` + title + body) appears in `TrustSection`, `About Philosophy`, and is structurally equivalent to the `HowItWorks` step cards. This is the site's primary content card pattern. Should be a component.

4. **`SectionHeader`** — The pattern of section-label + h2 + optional body copy appears in every section. Currently 5+ manual implementations. A `SectionHeader` component with `label`, `headline`, `body` props would reduce repetition and enforce consistency.

5. **`ProcessRow`** — The Services "What Is Included" list items (`number + title + body` in a flex row) are rendered inline with a `.map()`. This pattern is unique but reusable for future service additions.

**Low priority / acceptable inline:**
- The form in `ContactPage` is one-of-one — no extraction needed.
- The hero badge is hero-specific — keep inline.

### Architecture Issues

**Issue 1: Button `outline` variant is orphaned**
The Button component defines an `outline` variant (line 38) described as "dark equivalent (keep as-is)". This variant does not appear in DESIGN.md's CTA system (Primary / Ghost / Tertiary). It is not used on any audited page. Either document it as intentional or remove it to avoid confusion for future developers.

**Issue 2: Button `light` variant is used but not in the spec**
`SprintSection` uses `variant="light"` (line 143). DESIGN.md defines three CTA levels: primary (gold), ghost (dim white), tertiary (text only). The `light` variant (`border-[rgba(242,237,228,0.4)]`) is not in the spec. For a dark section CTA, the `primary` gold variant is the correct choice per the spec's intent: "Primary CTAs signal action commitment." Using `light` instead of `primary` on a dark section misses the gold hierarchy system.

**Issue 3: Contact page submit button is not the Button component**
`app/contact/page.tsx` line 93–99: The form submit button is a raw `<button>` with inline styles (`style={{ background: '#C9922A', color: '#080808', border: '1px solid #C9922A' }}`). This:
- Bypasses the Button component entirely
- Uses raw hex colors instead of design tokens
- Gets no magnetic effect (spec says primary CTAs use magnetic)
- Has inconsistent hover state (no hover defined)
- Uses `text-sm` and `tracking-[0.08em]` rather than the `text-xs tracking-[0.1em]` in the Button component

Fix: wrap in a `<form>` submit handled differently, or use a `<button>` wrapper around Button's internal styles. The cleanest solution is extending the Button component to support `type="submit"` as an alternative to `href`.

**Issue 4: SprintSection `motion.h2` and `motion.p` use redundant `variants` + `animate` without `stagger` parent**
Lines 99–115: The `h2` and `p` elements have `variants={fadeUp}` and `animate={inView ? 'visible' : 'hidden'}` but are not children of a `stagger` container. This means they animate independently with no stagger relationship. Either:
- Wrap them in a `motion.div variants={stagger}` parent, or
- Remove `variants` and use explicit `initial/animate/transition` props

Currently both `h2` and `p` fire simultaneously at `inView` — stagger would add sequential reveal.

**Issue 5: CountUp component is inlined in SprintSection**
The `CountUp` component (lines 10–56 of SprintSection) is a standalone, reusable animation primitive. It should live at `components/ui/CountUp.tsx` so it can be used in other stat contexts (e.g., if a Results page is added).

**Issue 6: About philosophy grid uses magic number for max-width**
`max-w-[900px]` at line 74 of `app/about/page.tsx`. The design token system has `max-w-site` (1200px) and `max-w-prose` (680px). 900px sits between them and serves as a 2-column prose constraint. This should either be added to the Tailwind config as `max-w-content: '900px'` or replaced with `max-w-site` and narrower columns.

**Issue 7: Tailwind config has legacy color aliases**
`tailwind.config.ts` lines 28–32 define `ink`, `paper`, `muted`, `paper-dark` as backward-compat aliases. These duplicate `background`, `text-primary`, `text-secondary`, `surface`. If any future developer uses `text-muted` instead of `text-text-secondary`, it bypasses the design token system. Either remove them with a migration, or add a comment marking them as deprecated with expiry.

---

## Section-by-Section Layout Report

### Hero Section (`HeroSection.tsx`)

**Layout structure:** Full-viewport `<section>` with absolute right-side grid and a left content block inside `max-w-site`. This is the correct approach for a full-bleed hero with constrained text.

**Left content column:** Uses `flex flex-col items-start pb-16`. The `pb-16` is an unconventional way to vertically offset — it shifts content upward relative to center. This is intentional per the spec ("vertically centered with pb-20 offset") but `pb-16` (64px) rather than the spec's `pb-20` (80px) is a minor drift.

**Right column visibility:** `hidden md:block` — hidden on mobile. There is no replacement content for mobile. The left column becomes full-width, which works, but the hero feels less dense on small screens. The metric cards (which are the most compelling social proof) are invisible on mobile.

**Mobile hero (375px):** The text stack (gold line → badge → H1 → sub → CTAs) is the full hero on mobile. The `min-h-[calc(100vh-4rem)]` holds height. The `px-6` (24px) horizontal padding is appropriate. The H1 at `clamp(3.5rem, 7vw, 6.5rem)` will render at ~26px on a 375px screen (7vw = ~26px) — significantly smaller than the 3.5rem minimum. Wait: `3.5rem = 56px` is the floor. At 375px, `7vw = 26.25px` which is below the 3.5rem floor, so `clamp` correctly serves `3.5rem`. At 375px, `3.5rem = 56px` heading is correct.

**Tablet (768px):** The right column becomes visible. The grid pattern and metric cards appear. The left content is constrained by `max-w-site mx-auto` with `md:px-10` (40px) side padding. At 768px the left text block takes roughly 50% of the content area, which feels appropriate.

**Identified issue — metric card positioning:** Cards use percentage-based `top` and `left` positioning inside the right column: `top: ${22 + i * 22}%`, `left: ${8 + i * 10}%`. At narrow tablet widths (768–900px), cards 2 and 3 push progressively rightward: `left: 28%` and `left: 38%`. With a card `width: 210px`, the third card could overflow the right column at ~800px. The overflow is clipped by `overflow-hidden` on the container, but the card may be partially cut off.

**Scroll cue:** `hidden md:flex` — correctly hidden on mobile. The infinite bounce animation on the dot (`animate={{ y: [0, 8, 0] }}`) is a decorative infinite loop — the spec says "Continuous/infinite animations: loading only (no decorative loops except scroll cue)." This is explicitly permitted by the spec.

**Parallax:** `useScroll` + `useTransform` on the left content block (`contentY: [0, -30]`). This is a `y` transform (safe, GPU-composited). The range is subtle (30px over 30% of section scroll progress) — appropriate.

---

### Trust Section (`TrustSection.tsx`)

**Layout structure:** 3-column grid (`md:grid-cols-3`) with border-top cards. Clean and correct.

**Spacing:** `gap-10 md:gap-12` (40px / 48px) — on the 8px grid, appropriate for a 3-column trust section.

**Mobile (375px):** Single-column stack. Works correctly. Border-top on each card provides visual separation.

**InView animation:** `useInView(ref, { once: true, margin: '-80px' })` — correct parameters per spec. The `ref` is placed on the inner `<div>`, not the SectionWrapper — this is intentional to get the correct trigger point. Correct.

**Stagger:** Uses `stagger` container with `fadeUp` children — the correct pattern from `lib/motion.ts`. Clean.

**Issue:** The LinkedIn link (lines 55–61) is an inline `<a>` tag with manually styled mono text. This is a tertiary CTA and could use `Button variant="tertiary"` — but it has `target="_blank"` which the Button component supports via `external` prop. Minor inconsistency.

---

### Sprint Section (`SprintSection.tsx`)

**Layout structure:** Linear stack (label → h2 → body → stats flex → CTA). No grid, which is correct for a centered pitch section.

**Stat row:** `flex flex-wrap gap-10` — wraps at narrow widths. At 375px, the stats will stack 1-per-row (each stat block is display-md sized). This creates very long vertical content at mobile. Consider `grid grid-cols-3` with responsive collapse to preserve horizontal rhythm even at mobile.

**CountUp component:** Uses `useInView` independently per counter. This means all three counters start simultaneously when the section enters view. The stagger container above does sequence the initial `fadeUp` animation, but CountUp starts on its own `inView` trigger. At mobile, only one counter may be in view at a time — this actually creates a natural stagger at mobile. On desktop, all three are visible simultaneously, so all three count up at the same time. Fine behavior but worth noting.

**Label inconsistency:** Line 94 uses `font-mono text-[11px] tracking-[0.15em] uppercase text-[#857F74]` rather than the `section-label` CSS utility class. This uses `text-secondary` (`#857F74`) instead of `text-tertiary` (`#4A4640`). Per the spec: "Section labels use text-tertiary (#4A4640) — NOT gold." `#857F74` is the correct color for secondary text, not tertiary labels. This is a mild Gold Rule adjacency: the section label is using a higher-emphasis color than specified.

**Button variant:** `variant="light"` — see Issue 2 in Component Architecture.

---

### HowItWorks Section (`HowItWorksSection.tsx`)

**Layout structure:** 3-column grid. The step cards have a left-border reveal pattern — correct and elegant.

**Step card hover:** The card has `group` class on an inner `div` (line 56) but the outer `motion.div` wrapping it does not have `group`. This means the hover state on `group-hover:bg-[#1A1918]` and `group-hover:scale-y-100` on the gold bar will only work if the `group` div itself receives the hover. Since `group` is on the `div` containing the hover-reactive elements, this should work — but verify: the outer wrapper is `motion.div` without `group`, and the inner `div` has `group`. Since hover propagates from the inner element outward, `group-hover:` classes inside the `group` div will activate correctly.

**Scale on text span:** Line 64: `group-hover:scale-105` applied to a `<span>` containing the step number text. Scaling text elements causes subpixel rendering artifacts and is an off-spec motion value. The spec says "opacity + translateY ONLY — no scale." Replace with a `translateX` nudge: `group-hover:translate-x-1`.

**Gold on step numbers:** Lines 63–64 use `text-gold` for the `01`, `02`, `03` mono labels. Cross-checking the Gold Rule: "Gold IS used for: Active/selected states: left accent bar, active underline." These step numbers are active/structural markers, arguably in the "KPI highlights" category. However, the spec says "KPI highlights: Sprint stat numbers only." Step numbers are not KPIs. This is a borderline Gold Rule violation. Safer to use `text-tertiary` and let the gold left-border-reveal be the sole gold accent on these cards.

**Mobile (375px):** Single-column. Each step card is full-width. The left border accent is preserved. Works correctly.

---

### About Page (`app/about/page.tsx`)

**Layout:** 4 SectionWrapper sections stacked: hero → founder → philosophy → CTA. Correct section alternation (`#080808` → `#111110` → `#080808` → `#111110`).

**About hero:** `gold-line` utility correctly used. `text-display-lg` heading with `max-w-[16ch]` — correct character constraint for a display headline.

**Founder section:** Inner content correctly constrained with `max-w-prose`. Section label spacing: `mb-8` (32px before the headline) — this is double the pattern used in sections (TrustSection uses `mb-4` before content). Inconsistency is minor but noticeable — `mb-8` is used for section label spacing in About sections while `mb-4` is standard elsewhere.

**Philosophy grid:** `grid-cols-1 md:grid-cols-2` — correct. The `max-w-[900px]` constraint means the 2-column layout has comfortable prose measure at desktop. At 768px tablet, both columns will be roughly 320px wide — adequate.

**CTA section:** Uses a minimal `flex flex-col items-start gap-4` pattern. Appropriate for a closing CTA. Correctly uses `primary` button variant.

**No animations:** The About page has no Framer Motion usage. It is a server component. This is correct — adding scroll animations to a static page adds bundle weight without meaningful UX benefit. The correct call.

---

### Services Page (`app/services/page.tsx`)

**Layout:** 3 SectionWrapper sections: hero (dark surface) → components (dark background) → CTA (dark surface). Background alternation: `#111110` → `#080808` → `#111110`. Correct.

**Services hero stats row:** `flex flex-wrap gap-8 border-t border-[#242220] pt-10`. At mobile, the 3 stats will wrap. `gap-8` (32px) is on the 8px grid. Correct.

**Gold Rule violation — critical:** Line 45: `text-gold` used on a section label (`"The Entry Point"`). DESIGN.md is explicit: "Section labels use text-tertiary (#4A4640) — NOT gold." This is a direct Gold Rule violation. The section label should use `text-tertiary` or the `section-label` CSS utility.

**Component list layout:** `flex flex-col divide-y divide-[#242220]` — a clean list with hairline dividers. At mobile, each item switches from `flex-row` to `flex-col` (`flex-col md:flex-row md:gap-12`). The mono number (`md:w-12 shrink-0`) collapses to a stacked label on mobile. Works correctly.

**Gold on component numbers:** Lines 81–82 use `text-gold` for `01`–`05` labels. Same borderline violation as HowItWorks — the spec reserves gold for KPI highlights (Sprint stats) and active states, not component/process numbering. These numbers are categorically the same as step numbers in HowItWorks. Should use `text-tertiary`.

**Stat values:** Line 64: `font-display text-display-md text-[#F2EDE4]` — these are the same stats as SprintSection but without CountUp. Acceptable for a static page (no JS CountUp needed here — this is a server component).

---

### Contact Page (`app/contact/page.tsx`)

**Layout:** 2 SectionWrapper sections: form → Calendly placeholder. Background: `#080808` → `#111110`.

**Form layout:** `max-w-[640px]` constraint. The form uses `flex flex-col gap-6` (24px between fields) — on the 8px grid, appropriate for form field rhythm.

**Input styling:** Inline classes on every input — correct since there's no Input component. However, the repeated `bg-transparent border border-[#242220] px-4 py-3 font-sans text-sm text-[#F2EDE4] placeholder:text-[#4A4640] focus:outline-none focus:border-[#F2EDE4]/30 transition-colors duration-200` class string appears 5 times. An `Input` component would reduce this significantly.

**Submit button:** See Issue 3 in Component Architecture. The inline `<button>` with `style={{ background: '#C9922A' }}` bypasses the Button system. The hover state is `transition-all duration-300` with no `hover:` classes, meaning no visual feedback on hover. The CTA in the most conversion-critical page has no hover effect defined.

**Focus states:** All inputs have `focus:border-[#F2EDE4]/30`. This is visible but low-contrast for accessibility. A more visible focus indicator (`focus:border-gold/50` or a box-shadow) would meet WCAG 2.1 AA focus-visible requirements better.

---

## Responsive Design Assessment

### Critical Mobile Issues (375px)

| Issue | Severity | Location |
|---|---|---|
| Hero metric cards hidden with no mobile replacement — primary social proof invisible on mobile | High | `HeroSection.tsx` line 43 |
| Sprint stat flex row wraps to 1-per-line on narrow screens — creates very long vertical content | Medium | `SprintSection.tsx` line 123 |
| Metric card inline padding `18px 22px` — off-grid on all sizes | Low | `HeroSection.tsx` line 99 |
| Hero badge `py-1.5` (6px) — off-grid on all sizes | Low | `HeroSection.tsx` line 141 |
| Contact submit button has no hover state defined | High | `app/contact/page.tsx` line 93 |

**Hero mobile replacement recommendation:** At mobile, surface at least one metric card as an inline stat row below the CTAs. The `Active deployments: 4 med-aesthetic clinics` sub-CTA copy (currently visible at mobile) is a weak substitute for the `23 New Consultations` metric card. Consider a mobile-only `<div className="flex gap-6 mt-6 md:hidden">` with 2 key stats as text pairs.

### Tablet Issues (768px)

| Issue | Severity | Location |
|---|---|---|
| Hero metric card 3 (`left: 38%`, width 210px) may clip at right column edge on 768–900px | Medium | `HeroSection.tsx` line 101 |
| About philosophy grid `max-w-[900px]` at 768px tablet creates ~320px columns — acceptable but tight | Low | `app/about/page.tsx` line 74 |

### Recommended Breakpoint Adjustments

1. **Add `lg:` breakpoint to SectionWrapper** — `py-20 md:py-28 lg:py-36` at minimum (or the spec's `lg:py-40`) to breathe at 1200px+ viewports.
2. **Hero metric cards:** At `md` (768px), apply `overflow-hidden` (already present) but also clamp card positions: cap the `left` offset at max `20%` on the first card and use consistent vertical spacing rather than percentage offsets.
3. **Sprint stats:** Replace `flex flex-wrap` with `grid grid-cols-3 sm:grid-cols-3` to maintain horizontal stat layout at all breakpoints above 375px.

---

## Framer Motion Quality Audit

### Animation Property Safety

| Component | Properties Animated | Safe? | Notes |
|---|---|---|---|
| `HeroSection` parallax | `y` (transform) | ✓ Safe | GPU-composited. |
| `HeroSection` scroll cue dot | `y` (transform, infinite) | ✓ Safe | Spec-permitted infinite animation. |
| `HeroSection` metric cards | `opacity` | ✓ Safe | Pure opacity. |
| `HeroSection` gold line | `scaleX` (transform) | ✓ Safe | GPU-composited. |
| `HeroSection` content blocks | `opacity + y` | ✓ Safe | Correct per spec. |
| `Nav` mobile menu | `height: 0 → 'auto'` | ⚠ Unsafe | Animating `height` triggers layout. Height auto animation is not GPU-composited. Should animate `y` + `opacity` with `overflow-hidden` clip instead. |
| `TrustSection` | `opacity + y` | ✓ Safe | Correct. |
| `SprintSection` | `opacity + y` | ✓ Safe | Correct. |
| `HowItWorksSection` | `opacity + y` | ✓ Safe | Correct. |
| `HowItWorksSection` step gold bar | CSS `scale-y-0 → scale-y-100` | ✓ Safe | CSS transition, not Framer Motion. GPU-composited. |
| `HowItWorksSection` step number | CSS `scale-105` | ⚠ Off-spec | Scale on text element per motion rules violation. Use `translate-x`. |

### Performance Issues

**1. Nav mobile menu height animation (Critical)**
`motion.div` with `initial={{ height: 0 }} animate={{ height: 'auto' }}` (Nav.tsx lines 156–158). Animating `height` forces browser layout recalculation on every frame. On a device with a slow CPU, this will cause jank. The correct approach for an expand/collapse is:
```
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
```
With `overflow-hidden` on the container, the clip effect creates the same "drawer opening" feel without layout thrashing.

**2. useMagnetic global mousemove listener (Medium)**
`hooks/useMagnetic.ts` line 56: `window.addEventListener('mousemove', onMouseMove)`. This fires on every mouse movement across the entire window for every magnetic button. With multiple primary CTAs on a page, multiple listeners accumulate. The handler does `getBoundingClientRect()` on every move — this triggers a layout read. Should be throttled with `requestAnimationFrame`:
```ts
let ticking = false
const onMouseMove = (e: MouseEvent) => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // handler logic
      ticking = false
    })
    ticking = true
  }
}
```

**3. CountUp rAF loop (Low)**
`SprintSection.tsx` CountUp uses `requestAnimationFrame` correctly with cleanup. No issue.

### Reduced Motion Compliance

**No `prefers-reduced-motion` handling anywhere in the codebase.** This is the most significant accessibility gap in the motion system.

Framer Motion supports this natively via the `useReducedMotion` hook or the `MotionConfig` component. The recommended fix is a single `MotionConfig` wrapper in the root layout:

```tsx
// app/layout.tsx
import { MotionConfig } from 'framer-motion'

// Inside layout:
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

This automatically disables all Framer Motion animations when the user has `prefers-reduced-motion: reduce` set. Zero per-component changes needed.

The `useMagnetic` hook also has no reduced motion check. Add:
```ts
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
```
at the top of the `useEffect` in `useMagnetic.ts`.

The `CountUp` component has no reduced motion check. When `prefers-reduced-motion` is active, it should jump directly to the final value.

---

## Performance Observations

### Server vs Client Component Distribution

| Component | Marked | Should Be | Issue? |
|---|---|---|---|
| `HeroSection` | `'use client'` | Client | Correct — uses `useScroll`, `useTransform` |
| `TrustSection` | `'use client'` | Client | Correct — uses `useInView`, Framer Motion |
| `SprintSection` | `'use client'` | Client | Correct — uses `useInView`, `useState`, `useEffect` |
| `HowItWorksSection` | `'use client'` | Client | Correct — uses `useInView` |
| `Nav` | `'use client'` | Client | Correct — uses scroll listener, state |
| `Button` | `'use client'` | Client | Correct — uses `useMagnetic` hook |
| `Footer` | None | Server | ✓ Correct server component |
| `SectionWrapper` | None | Server | ✓ Correct server component |
| `app/about/page.tsx` | None | Server | ✓ Correct — no interactivity needed |
| `app/services/page.tsx` | None | Server | ✓ Correct |
| `app/contact/page.tsx` | None | Server | ✓ Correct (form handled by Netlify) |

**Assessment:** Client/Server boundary is well-managed. Section components are correctly client-side due to animation requirements. Page files are correctly server-side. The Button component must be client-side due to `useMagnetic`, but this means any page importing Button is forced into the client bundle. However, since Button is used within server page components via the component tree, Next.js handles this correctly at the component level rather than page level.

**Recommendation:** The `Button` component's dependency on `useMagnetic` means all Button usages force a client-side render. For non-primary buttons (ghost, tertiary, outline, light), the magnetic effect is not applied — yet they still carry the `'use client'` overhead. Consider splitting into `Button` (client, primary with magnetic) and `LinkButton` (server-safe, for non-primary variants).

### Custom Cursor

The `Cursor.tsx` component was not audited in detail (file content not reviewed), but from DESIGN.md: dot (5px) + ring (28px) with spring lag. Cursor components typically listen on `window.addEventListener('mousemove')` globally. Combined with `useMagnetic`'s own global mousemove listener, there are at minimum 2 global mousemove listeners per page. Ensure both are passive (`{ passive: true }`) — `useMagnetic` does not currently pass `passive` to its mousemove listener.

### Bundle Considerations

- `framer-motion` is used in 4 section components and Nav. This is necessary and expected.
- The `CountUp` component uses only `requestAnimationFrame` — no additional library weight.
- No unnecessary dynamic imports detected.

---

## Top 5 Implementation Picks (Ranked by Impact)

### 1. Fix SectionWrapper padding to match DESIGN.md spec
**Impact: High — affects every section on every page**

Current: `py-20 md:py-28`
Spec: `py-24 md:py-32 lg:py-40`
Missing: `lg:` breakpoint entirely absent

This single change makes all sections breathe correctly at 1440px+ (the primary design viewport). Currently the site feels 15–20% more compressed than Linear/Vercel at large viewports.

```tsx
// SectionWrapper.tsx line 21 — change:
className={`w-full px-6 md:px-10 lg:px-16 py-24 md:py-32 lg:py-40${...}`}
```

### 2. Add `MotionConfig reducedMotion="user"` to root layout
**Impact: High — accessibility + legal compliance**

One line in `app/layout.tsx`. Disables all Framer Motion animations for users with `prefers-reduced-motion: reduce`. Required for WCAG 2.1 AA compliance. Also add the media query check to `useMagnetic` and a static value fallback to `CountUp`.

### 3. Fix Nav mobile menu to animate opacity+y instead of height
**Impact: Medium-High — mobile performance**

Replaces layout-thrashing height animation with GPU-composited opacity + translate. Eliminates frame drops on mid-range mobile devices on every menu open/close.

```tsx
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
```

### 4. Fix Gold Rule violations on Services page section label and step numbers
**Impact: Medium — brand/design system integrity**

Services page line 45: `text-gold` → `text-tertiary` (or `className="section-label"`)
Services component numbers and HowItWorks step numbers: `text-gold` → `text-tertiary`

Gold is reserved for: Primary CTAs, active/selected states, Sprint KPI numbers. Process step numbers are not KPIs. Every gold violation dilutes the hierarchy system that makes the primary CTA gold meaningful.

### 5. Fix Contact page submit button to use Button component (or button-compatible extension)
**Impact: Medium — conversion + consistency**

The primary CTA on the most conversion-critical page (the contact form) has no hover effect. Extend the Button component to support `type="submit"` (render a `<button>` instead of `<Link>` when no `href` is provided), or extract the primary styles into a shared `buttonClasses` utility that both use.

---

## What I Would Do If Starting Fresh

### Ideal Spacing System

The 8px grid and `max-w-site` / `max-w-prose` token pairing are correct calls. Starting fresh, I would:

1. **Define 5 spacing scales explicitly in tokens** rather than Tailwind defaults: `space-section` (160px desktop / 128px tablet / 96px mobile), `space-block` (64px), `space-component` (32px), `space-element` (16px), `space-tight` (8px). Map these to CSS custom properties in `globals.css`. Section padding becomes `padding-block: var(--space-section)`.

2. **Add a third `max-w` token**: `max-w-content` (860px) for 2-column prose containers like the About philosophy grid. Eliminates magic numbers.

3. **Add `gap-section`** = `gap-12 md:gap-16` as a Tailwind plugin shorthand. The DESIGN.md already defines `Inner gap (large): gap-12 md:gap-16` but it's not in the config.

### Ideal Component Architecture

1. **Extract `SectionHeader`** — every section has a label + headline + optional body. One component.
2. **Extract `StatCard`** — the large display number + mono label pattern appears in 3 places.
3. **Extract `ProofCard`** — the border-top card with title + body appears in 4+ places.
4. **Split `Button` into `Button` (client) and `LinkButton` (server)** — reduce unnecessary client bundle for passive links.
5. **Add an `Input` component** — the contact form has 5 identical class strings.
6. **Move `CountUp` to `components/ui/`** — reusable animation primitive.
7. **Add `components/ui/icons.tsx`** — single source of truth for `LinkedInIcon` and any future SVG icons.

### Ideal Responsive Strategy

1. **Mobile-first throughout** — the current codebase is largely mobile-first already. Reinforce by establishing 3 breakpoints: `375px` (base), `768px` (md), `1200px` (lg). No intermediate 1024px tweaks unless proven necessary.
2. **Hero mobile alternative content** — never hide the primary social proof (metric cards). At mobile: inline 2 stats as a horizontal pair below the CTAs. At `md`: show the full right-column grid.
3. **Replace `min-h-[calc(100vh-4rem)]` with `min-h-dvh`** — the `100vh` unit is problematic on iOS Safari (browser chrome changes viewport height). `dvh` (dynamic viewport height) is the correct modern unit for full-screen mobile layouts.
4. **Consistent section grid pattern** — for all 3-column grids, use `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3` rather than jumping directly from 1 to 3. At 600–767px, 2-column is more readable than a single stretched column.

### Ideal Motion Strategy

1. **Single `MotionConfig` at root** — handles `reducedMotion`, easing defaults, and duration scale in one place.
2. **Variants from `lib/motion.ts` only** — already the pattern but enforced: no `initial/animate/transition` inline unless it's a one-off that cannot be abstracted (e.g., hero timing chain).
3. **Remove all height/width animation** — replace with clip-path or opacity+scale for expand/collapse behaviors.
4. **RAF-throttle all pointer event handlers** — Cursor, useMagnetic, and any future pointer listeners should use the same RAF-batching utility.
5. **Add `will-change: transform` sparingly** — only on elements with active continuous animations (scroll cue dot, custom cursor). Remove after animation completes.
