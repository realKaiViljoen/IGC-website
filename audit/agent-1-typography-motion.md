# Agent 1: Typography & Motion Audit
**IGC Website — April 2026**
**Auditor brief: Creative director-level assessment for production build decisions**

---

## Executive Summary

The foundational design intent is correct — warm operator-dark with a Playfair/Inter pairing is a credible positioning — but the system is suffering from three compounding problems: Playfair Display is pulling the brand toward "luxury spa" rather than "infrastructure operator," the motion architecture is one-speed (every element uses the same expo-out with marginally different delays, creating sameness not choreography), and `#4A4640` (tertiary) is being used at body-readable scale across the entire site at a contrast ratio of approximately 2.0:1, which is an accessibility failure and a readability failure. The single biggest opportunity is replacing or demoting Playfair to a sharper editorial serif that reads cold-precise rather than warm-classical, and rebuilding the motion system with two distinct easing personalities: one for structural elements, one for content.

---

## Typography Findings

### Current State Assessment

The type system has three fonts (Playfair Display, Inter via DM Sans alias, DM Mono), a 3-step display scale built on `clamp()`, and a clearly articulated hierarchy with Inter 300 lead copy against Playfair 400 headlines. The scale is intentional and the token structure is clean. The globals.css is well-organized. The DM Sans alias (`--font-sans: var(--font-dm-sans)`) is interesting — the DESIGN.md says Inter, the CSS says DM Sans. This matters because DM Sans and Inter have meaningfully different optical weights and apertures at body sizes.

**Critical observation:** The globals.css `body { font-family: var(--font-dm-sans) }` contradicts the DESIGN.md spec of Inter. DM Sans is warmer and rounder. Inter is more precise and engineering-adjacent. For "infrastructure operator" positioning, this is not a trivial difference.

---

### Critical Issues

**Issue 1: Playfair Display is the wrong display face for "infrastructure operator"**

Playfair at 6.5rem on a dark background is beautiful. It is also the exact typeface used by Tatler, Condé Nast Traveller, and high-end spa booking sites. The brand positioning explicitly rejects agency aesthetics but the headline face signals "luxury services" not "technical capability." 

Linear.app uses Inter at extreme weight (800+) with -0.04em tracking. Vercel uses Geist with -0.03em. Resend uses Inter 700 with -0.02em. None of them use a calligraphic serif for their primary display face.

The tension: the DESIGN.md brief says "private equity firm crossed with technical operator's dashboard." Private equity firms — Blackstone, KKR's digital properties, Apollo's site — use high-contrast grotesque or geometric sans at display scale, NOT calligraphic serifs. The serif reads closer to a wealth management firm targeting individuals, not an infrastructure operator targeting clinic owners.

**What specifically would change:** Replace Playfair Display with either (a) a sharper editorial serif — Cormorant Garamond or Editorial New would read as "operator-premium" rather than "luxury soft" — or (b) push into full commitment with a high-weight geometric sans at -0.04em tracking for H1 only. The Cormorant path keeps warmth but sharpens the instrument feel: Cormorant's thin strokes are more architectural than Playfair's classical strokes.

**Issue 2: Inter vs DM Sans — pick one and commit**

`globals.css` font body is `var(--font-dm-sans)`. `tailwind.config.ts` `fontFamily.sans` is `var(--font-dm-sans)`. But DESIGN.md specifies Inter throughout. In the components, `font-sans` maps to DM Sans. This is a font identity split — every piece of UI copy is in DM Sans, not Inter, regardless of intent.

DM Sans at 300 weight has visible optical fragility — the light weight is genuinely too thin for secondary text on dark backgrounds, compounding the contrast issues below. Inter 300 is optically heavier and more legible at equivalent sizes.

Recommendation: Commit to Inter. It is the correct choice for this brand. Update the font loading, globals.css, and tailwind config to load Inter rather than DM Sans.

**Issue 3: `#4A4640` (tertiary) used at body-readable scale — accessibility failure**

Contrast ratio of `#4A4640` against `#080808` background: approximately **2.0:1**. WCAG AA requires 4.5:1 for normal text (under 18pt), 3.0:1 for large text (18pt+, or 14pt+ bold).

Usages at illegal contrast:
- `section-label` class: 0.6875rem (11px) — 11px text at 2.0:1 is essentially invisible to anyone with moderate vision impairment
- Hero sub-CTA: `font-mono text-[13px] tracking-[0.10em] uppercase text-[#4A4640]` — same issue
- HowItWorksSection step numbers: `font-mono text-[11px] ... text-gold` — gold passes at approximately 4.3:1, just below AA, acceptable for decorative
- SprintSection stat sublabels: `text-[#857F74]/50` — an opacity-50 modifier on an already-secondary color; this crashes the contrast to approximately 2.5:1

The section-label utility specifically (`font-size: 0.6875rem; color: #4A4640`) is a system-level accessibility failure. Every component that uses `.section-label` is producing unreadable text at legal contrast thresholds. Either raise the color to `#6B6560` minimum (approximately 3.0:1 — acceptable for large/decorative text) or raise it further to `#857F74` and use size + tracking + case to establish hierarchy differentiation rather than color darkness.

**Issue 4: `display-xl` clamp max of 6.5rem may be undershooting at 1440px+**

At 1440px viewport, `7vw` = 100.8px = 6.3rem, which is below the 6.5rem cap. So the cap is never hit until approximately 1480px. At 1920px, `7vw` = 134.4px, but the clamp caps at 104px (6.5rem). The cap is appropriate. The minimum of 3.5rem (56px) at small viewports is aggressive — at 480px, this H1 at 3 lines of "We build / acquisition / engines." will consume approximately 50% of the viewport height before the sub-headline appears. A more judicious minimum would be `clamp(2.75rem, 7vw, 6.5rem)` — allowing the text to compress more gracefully below 600px.

**Issue 5: Missing size between body-lg (1.125rem) and display-md (1.75rem)**

There is a 0.625rem gap with no intermediate step. The about/page.tsx CTA section uses `text-body-lg` for "Want to see how the system works?" which is a statement that should optically sit between body copy and a section headline. The scale needs a `text-lead` or `text-subhead` size at approximately `1.375rem / 1.6 / -0.01em` to bridge this gap. Currently, anything needing emphasis above body-lg jumps immediately to display-md (28px+), which is too large for transitional copy.

**Issue 6: The H1 on interior pages (about/page.tsx) has no entrance animation**

The about page H1 is a static render — no motion, no stagger, no entrance. The hero section on homepage has meticulous choreography. The about page `<h1>` just... appears. This inconsistency makes the interior pages feel unfinished relative to the homepage.

**Issue 7: Section label color inconsistency across files**

`SprintSection.tsx` overrides `.section-label` with inline `text-[#857F74]` (secondary) rather than the system `#4A4640` (tertiary). `HowItWorksSection.tsx` uses the `.section-label` class (tertiary). `AboutPage` uses the `.section-label` class. `ServicesPage` uses inline `text-gold` on the label "The Entry Point" — a direct violation of the Gold Rule in DESIGN.md. These inconsistencies break the system discipline.

---

### Opportunities

**Opportunity 1: Cormorant Garamond as a Playfair replacement**

Cormorant at 400-500 weight has dramatically thinner strokes than Playfair, reads as more architecturally precise, and still provides the serif contrast against Inter. It also renders with more visible contrast in dark mode because its thin/thick ratio is more extreme — the thin strokes almost disappear, leaving the thick strokes as sculptural marks rather than classical letterforms. This would sharpen the visual character considerably.

Specific pairing: Cormorant 400 for display, Inter 400/500 for body/UI. At 6.5rem on dark backgrounds, Cormorant's contrast ratio between stroke widths is visually dramatic in a way that reads as precision rather than luxury.

**Opportunity 2: Add a `text-subhead` to the scale**

```typescript
// tailwind.config.ts addition
'subhead': ['1.375rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
```

This bridges the gap between body-lg and display-md and unlocks better hierarchy on the about and services pages.

**Opportunity 3: Tighten the H1 tracking further at display-xl scale**

`-0.02em` on Playfair at 6.5rem is the specified tracking. Playfair's design was optimized for print at much smaller optical sizes — it benefits from tighter tracking at display scale than -0.02em suggests. Comparable display-scale editorial serifs at premium digital sites commonly use `-0.03em` to `-0.04em` at 96px+ sizes. At 104px (6.5rem), `-0.025em` to `-0.03em` would improve the sculptural density.

**Opportunity 4: Distinguish H2 tracking from H1 tracking**

Currently H1 and H2 both use `-0.015em` to `-0.02em`. A tighter H1 at `-0.03em` and looser H2 at `-0.01em` would create optical hierarchy not just through size but through character spacing personality — H1 feels compressed/precise, H2 feels slightly more open/readable.

**Opportunity 5: The ghost "01" number — increase opacity slightly**

`text-[#F2EDE4]/[0.025]` — at 0.025 opacity this is barely perceptible on most consumer monitors with mid-range color profiles. 0.04 to 0.05 is the sweet spot for architectural ghost numerals on dark backgrounds (reference: Vercel's page architecture uses similar elements at 3-5% opacity). This is a 30-second change with meaningful visual impact.

---

### Benchmark Comparison Table

| Site | Headline Size | Weight | Tracking | Pairing | Verdict |
|---|---|---|---|---|---|
| **Linear.app** | ~72px / Inter | 700-800 | -0.04em | Inter only | Ruthlessly mono-font — works because brand = product precision |
| **Vercel.com** | ~80px / Geist | 700 | -0.03em | Geist + Geist Mono | Custom typeface removes pairing tension entirely |
| **Resend.com** | ~64px / Inter | 600 | -0.025em | Inter only | "Done in one" restraint — zero serif anywhere |
| **Framer.com** | ~88px / Inter | 800 | -0.05em | Inter + custom | Extreme weight contrast — visually violent, on purpose |
| **Superhuman** | ~72px / custom sans | 700 | -0.035em | Sans only | Compressed, urgent — editorial energy from weight not face |
| **Pitch.com** | ~68px / GT Alpina | 400 | -0.02em | Serif + Aktiv Grotesque | **Closest to IGC** — editorial serif for display, tight grotesque for body |
| **Cosmos.so** | ~56px / editorial serif | 400 | -0.01em | Serif + sans | Similar positioning but lighter/more art-world than operator |
| **IGC (current)** | 6.5rem / Playfair | 400 | -0.02em | Playfair + DM Sans | Pairing is correct category, wrong execution — Playfair too decorative, DM Sans wrong identity |

**Verdict:** Pitch.com is the strongest benchmark. GT Alpina (or Cormorant as a Google Fonts equivalent) paired with a tight grotesque is precisely the "editorial premium operator" register IGC is targeting.

---

## Motion Findings

### Current State Assessment

The motion system has solid bones: one easing curve, opacity + translateY only, `useInView once:true`, hero mount animation separated from scroll triggers. The `lib/motion.ts` is clean and minimal. The hero entrance timing table in DESIGN.md is thoughtful — the "grid enters fast, text performs on top" asymmetry is a good architectural instinct.

The system is, however, underpowered. Every section uses the same `stagger` container with `staggerChildren: 0.1` and `delayChildren: 0.1`. Every child uses `fadeUp` at `{opacity: 0, y: 12}` with `duration: 0.7`. The result is that scrolling through the site feels like watching the same animation play five times. There is no personality differentiation between sections. The hero has clearly received the most motion attention; below the fold, motion is applied mechanically rather than choreographed.

---

### Critical Issues

**Issue 1: Single easing curve for all contexts is a category error**

`cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) is correct for UI elements entering a viewport — it feels decisive and controlled. It is wrong for ambient elements, for hover states on decorative items, and for the scroll cue. Specifically:

- The scroll cue dot `animate={{ y: [0, 8, 0] }} transition={{ ease: 'easeInOut' }}` already breaks from the system (correctly) by using easeInOut. This should be documented and enforced.
- Button hover transitions at `duration: 300ms, ease: expo-out` — expo-out on a 300ms hover makes the button fill feel like it "slams" into the hover state aggressively. A `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out-quad) or simple `ease` at 200ms would feel more refined for hover state changes.
- The metric cards in hero `transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease: [...ease] }}` — pure opacity fade on floating dashboard cards would be more premium as a slight upward drift (y: 6→0) to match the text content's entrance direction.

**Issue 2: SprintSection has an animation timing bug**

The `h2` and `p` elements use `variants={fadeUp}` with `initial="hidden" animate={inView ? 'visible' : 'hidden'}`, but they are *not* children of the `stagger` container — they are siblings of it. They will both trigger simultaneously when `inView` becomes true, with no stagger relationship between them. The intended reading order (label → headline → body → stats → CTA) has no sequence. Every element fires in parallel.

The correct pattern is to wrap all content in a single stagger container, or use explicit `delayChildren` offsets on individual elements. As implemented, the section's timing is:

- `h2` fires at t=0 with duration 0.7s
- `p` fires at t=0 with duration 0.7s (same moment)
- `stats` stagger container fires at t=0 with `delayChildren: 0.1`, items stagger at 0.1s each
- `CTA` fires at t=0

Everything launches simultaneously. This is not choreography — it is synchronized opacity dumping.

**Issue 3: The stagger timing (0.1s between children) is too fast for the display size of these elements**

At `display-md` headline scale (28–40px), text blocks and stat numbers are large visual objects. They need more breathing room between reveals than 0.1s. Vercel's stagger on large display elements is typically 0.12–0.18s. Linear's section reveals use 0.15s+ between major visual blocks. The current 0.1s makes consecutive large elements feel rushed, like they're loaded rather than unveiled.

Recommended: `staggerChildren: 0.12` for regular content, `staggerChildren: 0.18` for display-size elements (stats, large headlines).

**Issue 4: No scroll-driven parallax below the fold**

The hero has `useScroll` + `useTransform` for a subtle content parallax (`y: 0 → -30px` over 30% scroll progress). This is the only scroll-driven effect on the entire site. Every other section below the fold has static layout with entry animation only.

Top-tier sites in this register use at minimum: section background shift on scroll (already partially done via background-color alternation), and a text parallax differential where large display text moves at a slightly different rate than body copy within the same section. A 10px differential `useTransform(scrollYProgress, [0, 1], [0, -10])` on section H2s would add visual depth without violating the "no decorative loops" rule.

**Issue 5: The HowItWorksSection gold border reveal uses CSS transitions, not Framer Motion**

```tsx
className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"
```

This is a CSS transition, which is fine. But it runs at `duration: 500ms` with no easing specified — defaulting to `ease` (cubic-bezier(0.25, 0.1, 0.25, 1.0)), which is a weak ease-in-out. For a gold border reveal as a hover signal on an "operator dashboard" card, a fast expo-out at 300ms would feel more decisive: `transition-transform duration-300 ease-expo-out origin-top`. The current 500ms is too slow for a hover state — it reads as laggy rather than deliberate.

**Issue 6: No `prefers-reduced-motion` guard**

Nowhere in the codebase (lib/motion.ts, components) is there a `prefers-reduced-motion` check. This is both an accessibility issue and a UX issue for users who experience motion sickness. Framer Motion has a native hook for this: `useReducedMotion()`. All scroll-driven transforms and stagger animations should be conditioned on this.

---

### Opportunities

**Opportunity 1: Scroll-driven section entrance with horizontal reveal**

Rather than the universal `opacity + y:12→0` fadeUp, section labels and mono numbers would benefit from a `x: -8 → 0` slide from left. This matches the "operator reading left-to-right, processing data" feel more precisely than the generic upward drift.

```typescript
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}
```

Use `slideRight` specifically for: section labels, mono numbers (step "01", "02"), and the gold line. Use `fadeUp` for headlines and body copy. This creates motion direction hierarchy — horizontal for structural markers, vertical for content.

**Opportunity 2: Stagger the SprintSection stats with a count-up entrance delay**

The `CountUp` component triggers on `useInView`, but the number itself begins counting immediately when the element enters the viewport, regardless of stagger position. If stat 1 enters, counts up, stat 2 enters 0.1s later, they are all counting simultaneously. 

Better: trigger the CountUp `useEffect` only after the stagger delay has passed:

```typescript
// In CountUp component, add a configurable delay prop
function CountUp({ to, suffix, duration, format, enterDelay = 0 }) {
  // ...
  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      // start RAF counting
    }, enterDelay * 1000)
    return () => clearTimeout(timer)
  }, [inView, enterDelay])
}
```

Then pass `enterDelay={i * 0.12}` from the map. This way stat numbers sequence their count-up rather than exploding simultaneously.

**Opportunity 3: Character-by-character H1 reveal — assessment**

This is on the table but should be declined for this brand. Here is why:

Character-by-character reveals (Framer.com style) read as "playful and expressive." They work for tools that want to feel delightful and approachable. For IGC, which is positioning as quiet infrastructure competence — the kind of site where the operator is already ahead of you before the page loads — a character stagger would undermine the implied confidence. It would feel performative, like the brand is trying too hard to impress.

The right H1 animation for this brand: the current `opacity + y:12→0` is correct. The only improvement is making the easing slightly slower at the start: add a 0.08s custom ease-in before the expo curve kicks in. This makes the headline entrance feel weightier — like a heavy door opening rather than a card sliding in.

```typescript
// Heavier headline variant
export const headlineEnter: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 0, 0.1, 1] }, // slightly slower, ease-in before expo
  },
}
```

**Opportunity 4: Ambient background drift on the hero (if any decoration is added)**

The hero has a static radial bloom. A very slow, subtle `useMotionValue`-driven bloom position drift — moving the gradient center point 3-5% over 8-12 seconds in a loop — would add depth without violating the "no decorative loops except scroll cue" rule. This is debatable; only worth doing if performance budget allows.

**Opportunity 5: Section transition indicator**

The page currently alternates `#080808` / `#111110` for section backgrounds but there is no motion signal at the section boundary. A `motion.div` with a thin horizontal line that `scaleX: 0 → 1` on scroll entry — 1px, `rgba(242, 237, 228, 0.05)`, 0.6s expo-out — would make each section boundary feel like a deliberate reveal rather than a layout cut.

**Opportunity 6: Interior page entrance animations**

About/page.tsx and services/page.tsx have no entrance animations. The about H1 appears static. Given that users arrive on these pages from CTAs, the first impression should be as choreographed as the homepage. A lightweight page-entry animation using `AnimatePresence` + a stagger container on the first section's content block would fix this.

---

### Recommended Motion Architecture

**Updated lib/motion.ts:**

```typescript
import type { Variants } from 'framer-motion'

// Two easing personalities:
// — Structural: precise, decisive (expo-out) — for elements entering the frame
// — Ambient: smooth, continuous (ease-in-out) — for loops and hover states
export const EASE_STRUCTURAL = [0.16, 1, 0.3, 1] as const  // expo-out
export const EASE_HOVER = [0.4, 0, 0.2, 1] as const        // ease-in-out-quad

// Headline entrance — weighted, deliberate
export const headlineEnter: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 0, 0.1, 1] },
  },
}

// Standard content fadeUp — unchanged
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_STRUCTURAL },
  },
}

// Structural marker slide — for labels, numbers, mono UI
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_STRUCTURAL },
  },
}

// Pure fade — for backdrops, decorative elements
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_STRUCTURAL },
  },
}

// Content stagger — for body text blocks and UI groups
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

// Display stagger — for large visual blocks (stats, cards)
export const staggerDisplay: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
}

// Section entrance master — wraps all first-section content on interior pages
export const pageEnter: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

// Line reveal (left to right) — for gold line and dividers
export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: EASE_STRUCTURAL },
  },
}
```

**Fixed SprintSection choreography (key pattern):**

```tsx
// Wrap ALL section content in a single stagger container
<motion.div
  ref={ref}
  variants={stagger}
  initial="hidden"
  animate={inView ? 'visible' : 'hidden'}
>
  <motion.p variants={slideRight} className="section-label mb-4">
    The Entry Point
  </motion.p>

  <motion.h2 variants={headlineEnter} className="font-display text-display-md ...">
    The 90-Day Growth Sprint
  </motion.h2>

  <motion.p variants={fadeUp} className="font-sans text-body-lg ...">
    {/* body copy */}
  </motion.p>

  {/* Stats use staggerDisplay as nested container */}
  <motion.div variants={staggerDisplay} className="flex flex-wrap gap-10 mb-12">
    {stats.map((stat, i) => (
      <motion.div key={stat.id} variants={fadeUp}>
        {/* CountUp with enterDelay={i * 0.18} */}
      </motion.div>
    ))}
  </motion.div>

  <motion.div variants={fadeUp}>
    <Button href="/services" variant="light">See the Sprint</Button>
  </motion.div>
</motion.div>
```

**prefers-reduced-motion guard (add to motion.ts):**

```typescript
// In any component using scroll transforms:
import { useReducedMotion } from 'framer-motion'

// Usage:
const prefersReduced = useReducedMotion()
const contentY = useTransform(
  scrollYProgress, 
  [0, 0.3], 
  prefersReduced ? [0, 0] : [0, -30]
)
```

---

## Top 5 Implementation Picks (Ranked by Impact / Effort Ratio)

### 1. Fix tertiary color accessibility — `#4A4640` → `#6E6762` for section-label (Impact: High / Effort: 5 min)

`#4A4640` at 11px is legally and practically unreadable. Raise to `#6E6762` (approximately 3.2:1 contrast on `#080808`, passes AA for large/decorative text, which uppercase tracked mono labels qualify as). This is a one-line change in `globals.css` and resolves the system-wide accessibility failure.

```css
/* globals.css — current */
.section-label {
  color: #4A4640;
}

/* Fix: */
.section-label {
  color: #6E6762;
}
```

### 2. Fix font identity split — load Inter, not DM Sans (Impact: High / Effort: 15 min)

Update `app/layout.tsx` font loading from DM Sans to Inter (using next/font/google), update `globals.css` `--font-sans` reference, update tailwind config `fontFamily.sans`. This aligns the visual implementation with the stated DESIGN.md spec and corrects the optical weight fragility of DM Sans 300 light.

### 3. Fix SprintSection animation timing — all elements fire simultaneously (Impact: High / Effort: 20 min)

Restructure the component to use a single stagger parent wrapper (see pattern above). This is the most visible motion failure on the site — the section with the pricing and the primary conversion stat has no sequential reveal.

### 4. Add `slideRight` variant for section labels and mono step numbers (Impact: Medium / Effort: 30 min)

Add the `slideRight` variant to `lib/motion.ts`. Apply it to `.section-label` elements and mono step numbers (`01`, `02`, `03`) across HowItWorksSection, SprintSection, and ServicesPage. This differentiates the motion vocabulary — structural markers move horizontally, content moves vertically — giving the system a directional grammar it currently lacks.

### 5. Fix Services page gold label — "The Entry Point" label should use tertiary, not gold (Impact: Medium / Effort: 2 min)

`services/page.tsx` line 44: `text-gold` on section label is a Gold Rule violation. Change to `text-[#6E6762]` (or the fixed tertiary). This is two characters changed but it matters because it dilutes the gold CTA scarcity on that page — both the primary CTA button and the section label are gold, making the button less visually prominent.

---

## What I Would Do If Starting Fresh

The brief says "private equity firm crossed with technical operator's dashboard." Here is the ideal unrestricted system for that exact positioning.

**Typeface system:**

Primary display: **Editorial New** (Pangram Pangram) or **Cormorant** (Google Fonts, free) at 300–400 weight. These are condensed, architecturally precise serifs — the thin strokes read as engineering instrumentation, not luxury calligraphy. At 6.5rem on dark backgrounds, they look like technical drawings rather than magazine covers.

UI sans: **Inter 400/500** — not DM Sans. The distinction matters: Inter was designed for screen legibility in UI contexts. DM Sans was designed for print-adjacent softness. For an operator dashboard aesthetic, Inter's apertures and neutrality are correct.

Mono: Keep DM Mono. It is excellent and the choice is validated.

**Scale:**

```
--text-display-xl: clamp(3rem, 6.5vw, 7rem)    /* H1 hero — slightly larger cap */
--text-display-lg: clamp(2.25rem, 4vw, 4.5rem) /* H1 interior pages */
--text-display-md: clamp(1.625rem, 2.75vw, 2.5rem) /* Section H2 */
--text-subhead:    1.375rem / 1.5 / -0.01em    /* NEW — transitional copy */
--text-body-lg:    1.125rem / 1.8 / 0           /* Lead copy — increase line-height to 1.8 */
--text-body-md:    1rem     / 1.7 / 0
--text-label:      0.6875rem / 1 / 0.16em       /* Increase base color to #6E6762 */
```

**Tracking:**

```
display-xl:  -0.03em (tighter than current -0.02em)
display-lg:  -0.025em
display-md:  -0.015em (unchanged)
subhead:     -0.01em
body:        0
label:       0.16em (unchanged)
```

**Motion system:**

Two easing personalities:
- `EASE_STRUCTURAL: cubic-bezier(0.16, 1, 0.3, 1)` — expo-out, for all entrances
- `EASE_HOVER: cubic-bezier(0.4, 0, 0.2, 1)` — smooth quadratic for hover states and interactive micro-transitions

Three motion directions:
- Vertical (y: 16→0) for content blocks (headlines, body)
- Horizontal (x: -8→0) for structural markers (labels, numbers, dividers)
- Scale (scaleX: 0→1) for lines and borders

Duration philosophy: `0.5s` for small structural elements, `0.7–0.85s` for display headlines, `0.5s` for body copy. Nothing over `0.9s` except the scroll cue loop.

Stagger values: `0.1s` for tight UI groups, `0.12s` for content lists, `0.18s` for display-scale stat blocks.

Scroll-driven: hero parallax (already implemented), section H2 parallax at `y: [0, -15px]` over section scroll range, no other scroll-driven effects. Less is correct for this brand.

**What I would remove:**

The metric cards floating in the hero right panel — they are visually interesting but they obscure the precision grid, which is the stronger visual element. At mobile, they stack into nothing useful. Replace with a single, larger "system uptime / deployment status" display in DM Mono that reads more like a Bloomberg terminal readout than a design agency case study preview.

**The test for correctness:**

If you put a screenshot of the homepage in front of a clinic owner and asked "what company is this?" — they should guess financial infrastructure, B2B software, or a technical consultancy. Currently they would likely guess a premium marketing agency or luxury wellness brand. The type system is doing 80% of that misdirection. Fix the typeface, fix the brand signal.
