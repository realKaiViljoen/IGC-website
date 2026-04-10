# Typography, Visual Hierarchy & Information Design Audit

**Date:** 2026-04-10
**Scope:** Public marketing site (home page + diagnostic page)
**Auditor:** Claude (Opus 4.6)

---

## 1. Type Scale Consistency

### T-01 | LOW | Font mismatch: Inter loaded as `--font-dm-sans`
**File:** `app/layout.tsx`, lines 15-19
**Problem:** The variable name `--font-dm-sans` is assigned to **Inter**, not DM Sans. Every `font-sans` usage across the site resolves to Inter through a misleadingly named CSS variable. This is not a visual bug today, but any future developer adding actual DM Sans will create a conflict. It also means all Tailwind config references to "DM Sans" in comments are incorrect.
**Proposed fix:**
```tsx
// layout.tsx line 15
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',   // rename to match the actual font
  display: 'swap',
})
```
Then update `globals.css` line 34 and `tailwind.config.ts` line 36:
```css
--font-sans: var(--font-inter), system-ui, sans-serif;
```
```ts
sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
```

### T-02 | LOW | `body-lg` and `body-md` lack responsive scaling
**File:** `app/globals.css`, lines 44-45; `tailwind.config.ts`, lines 45-46
**Problem:** Display sizes use `clamp()` for fluid scaling, but `body-lg` (1.5rem / 24px) and `body-md` (1.25rem / 20px) are fixed. On mobile viewports (<375px), 24px body text is oversized relative to the display heading scale, which compresses down via clamp. The hierarchy inverts at small screens: body-lg can visually approach display-sm in size.
**Proposed fix:**
```ts
'body-lg': ['clamp(1.125rem, 1.5vw + 0.75rem, 1.5rem)', { lineHeight: '1.7' }],
'body-md': ['clamp(1rem, 1.2vw + 0.65rem, 1.25rem)',     { lineHeight: '1.65' }],
```

### T-03 | MEDIUM | Poppins font loaded but never used
**File:** `app/layout.tsx`, lines 29-33
**Problem:** Poppins is loaded via Google Fonts (adding ~15KB to first paint), its CSS variable `--font-poppins` is declared in `globals.css` line 36, but it is never referenced in any component or utility class across the entire codebase. Dead weight.
**Proposed fix:** Remove the Poppins import from `layout.tsx` lines 29-33, remove the variable from the `className` on line 66, and remove `--font-poppins` from `globals.css` line 36.

---

## 2. Heading Hierarchy

### T-04 | HIGH | `<h1>` missing on home page below the fold; diagnostic page has correct h1
**File:** `app/page.tsx` (full file); `components/sections/HeroSection.tsx`, line 100
**Problem:** The home page has exactly one `<h1>` (HeroSection line 100) -- correct. But the section order in `page.tsx` skips from `<h1>` directly to `<h2>` across sections with no `<h3>` at intermediate levels in ProblemSection, ComparisonSection, or SprintSection. Only HowItWorksSection (line 109) and TrustSection (line 83) use `<h3>`. This is structurally valid HTML but worth noting for completeness.

The diagnostic page (`app/diagnostic/page.tsx` line 19) uses `<h1>` correctly, and uses `<h2>` for the profile name (line 48). This is correct hierarchy.

**Severity reclassified:** This is actually fine. No action needed. Removing from count.

### T-05 | MEDIUM | ComparisonSection nests `<div>` inside `<motion.p>` (invalid HTML)
**File:** `components/sections/ComparisonSection.tsx`, lines 70-79
**Problem:** A `<motion.p>` wraps a `<div>` (the flex container with icon + section-label). `<div>` is not valid inside `<p>`. This can cause hydration mismatches and unpredictable rendering.
**Proposed fix:** Change `<motion.p variants={fadeUp}>` to `<motion.div variants={fadeUp}>` on line 70.

### T-06 | MEDIUM | SprintSection nests `<div>` inside `<motion.p>` (same issue)
**File:** `components/sections/SprintSection.tsx`, lines 108-116
**Problem:** Identical to T-05. `<motion.p>` wraps a `<div>`.
**Proposed fix:** Change `<motion.p variants={fadeUp}>` to `<motion.div variants={fadeUp}>` on line 108.

### T-07 | MEDIUM | FAQSection nests `<div>` inside `<motion.p>` (same issue)
**File:** `components/sections/FAQSection.tsx`, lines 50-59
**Problem:** Identical to T-05/T-06.
**Proposed fix:** Change `<motion.p variants={fadeUp}>` to `<motion.div variants={fadeUp}>` on line 50.

### T-08 | LOW | TestimonialSection nests `<span>` elements inside `<motion.p>`
**File:** `components/sections/TestimonialSection.tsx`, lines 39-42
**Problem:** The `<motion.p>` wraps two `<span>` elements (gold-line and section-label). This is technically valid HTML (inline elements inside `<p>`) but the `gold-line` span has `display: block` via CSS class, which makes it a block-level element inside `<p>` -- invalid.
**Proposed fix:** Change `<motion.p variants={fadeUp}>` to `<motion.div variants={fadeUp}>`.

### T-09 | LOW | ClosingCTA uses `<h2>` with `text-display-lg` while other sections use `text-display-md` for `<h2>`
**File:** `components/sections/ClosingCTA.tsx`, line 50
**Problem:** Every other section uses `text-display-md` for its `<h2>`. ClosingCTA uses `text-display-lg`, making it visually larger than all other section headings and approaching the hero `<h1>` size. This is intentional for a closing CTA (urgency escalation), but it creates a visual hierarchy where a `<h2>` competes with the `<h1>`.
**Proposed fix:** Consider whether this is intentional. If the goal is urgency, keep it but note the deviation is deliberate.

---

## 3. Line Length

### T-10 | MEDIUM | FAQ answer text allows up to 60ch -- slightly wide
**File:** `components/sections/FAQSection.tsx`, line 108
**Problem:** `max-w-[60ch]` on FAQ answers. The optimal reading measure is 55-75ch. 60ch is within range, but the answers are set in `body-md` (1.25rem / 20px) which is large enough that 60ch feels comfortable. Actually fine.

**Severity reclassified:** Within acceptable range. Removing from count.

### T-11 | MEDIUM | ComparisonSection body text in cards has no `max-w` constraint
**File:** `components/sections/ComparisonSection.tsx`, line 155
**Problem:** The comparison point text (`text-[0.9375rem]`) inside card columns has no `max-w` constraint. On wide viewports, when the 3-column grid gives each card ~360px, lines are short enough. But at tablet breakpoints (768-1023px, still 3-col), the columns may be narrow enough to cause excessive rag. More critically, on mobile (single column), the text runs full-width to the card padding edge. At 375px viewport with 24px padding each side, this is ~327px or roughly 45-50ch -- acceptable.

**Severity reclassified:** Acceptable due to card containment. Removing from count.

### T-12 | LOW | SprintSection body text uses `max-w-prose` (680px) -- good
**File:** `components/sections/SprintSection.tsx`, line 129
**Problem:** No problem. `max-w-prose` at `body-lg` (1.5rem) yields approximately 50-55ch. Slightly below the 55ch minimum but acceptable for a single introductory paragraph.

### T-13 | MEDIUM | HeroSection sub-headline `max-w-[52ch]` is correct; secondary paragraph `max-w-[44ch]` is intentionally narrower
Both are within good practice. No issue.

---

## 4. Leading (Line-Height)

### T-14 | MEDIUM | ProblemSection statement text uses `leading-snug` overriding the `body-lg` built-in line-height
**File:** `components/sections/ProblemSection.tsx`, line 111
**Problem:** `text-body-lg` ships with `lineHeight: 1.75` from the Tailwind config. But `leading-snug` (1.375) overrides it. For multi-sentence body text at 1.5rem, a line-height of 1.375 is tight. The pain point statements are single sentences so this is acceptable, but the `consequence` text at line 123 uses `leading-relaxed` (1.625) which is a better fit for its paragraph-length content. The inconsistency is minor but the override pattern is worth documenting.
**Proposed fix:** This is intentional (statements are punchy single-liners). No change needed, but document the override pattern.

### T-15 | LOW | Display heading line-heights are well-tuned
**File:** `tailwind.config.ts`, lines 40-44
The display scale line-heights (0.95, 1.0, 1.05, 1.12, 1.2) form a sensible progression from tightest for largest to most open for smallest. No issue.

### T-16 | MEDIUM | Diagnostic page profile card body text uses `leading-relaxed` on `text-base` (1rem)
**File:** `app/diagnostic/page.tsx`, lines 67, 88
**Problem:** `text-base leading-relaxed` gives 1rem at 1.625 line-height = 26px line-height for 16px text. This is generous but appropriate for a credentials list where each item may wrap to 2-3 lines in a narrow 300px sidebar. No issue.

---

## 5. Font Weight Usage

### T-17 | MEDIUM | `font-semibold` used only once in the entire marketing site
**File:** `components/sections/TestimonialSection.tsx`, line 55
**Problem:** The testimonial attribution name "Dr. A.M." is `font-semibold` (600 weight). But Inter is loaded with weights [300, 400, 500] only (see `layout.tsx` line 17). Weight 600 is not available. The browser will synthesize bold from weight 500, producing faux bold that looks subtly wrong (thicker strokes, no optical compensation).
**Proposed fix:** Either:
- Add `'600'` to the Inter weight array in `layout.tsx` line 17, or
- Change `font-semibold` to `font-medium` on TestimonialSection line 55

### T-18 | LOW | Button `font-semibold` on primary variant also requires weight 600
**File:** `components/ui/Button.tsx`, line 28
**Problem:** Same issue as T-17. The primary button variant uses `font-semibold` (600) but Inter only loads 300/400/500. All primary CTAs across the entire site render with faux bold.
**Proposed fix:** Add `'600'` to Inter's weight array, or change to `font-medium` + slightly wider tracking.

### T-19 | LOW | Inconsistent `font-normal` declarations on text that is already normal weight by default
**Files:** Multiple -- `SprintSection.tsx` lines 129, 189, 205, 206; `ComparisonSection.tsx` line 166; `HowItWorksSection.tsx` lines 113, 120; `TrustSection.tsx` line 87; `ClosingCTA.tsx` line 58
**Problem:** Many body text elements include explicit `font-normal` even though `font-sans` (Inter) defaults to 400. This is not harmful but adds noise. Some sibling elements omit it. The inconsistency makes it harder to audit weight usage.
**Proposed fix:** Remove redundant `font-normal` declarations where they are not overriding an inherited weight. Keep them only where a parent applies a different weight.

---

## 6. Label Conventions

### T-20 | MEDIUM | Section label inconsistency: some sections use icon + label pattern, others use label only
**File:** Multiple sections
**Problem:** The `section-label` class is used in all sections, but the presentation varies:
- **With icon:** ProblemSection, ComparisonSection, HowItWorksSection, SprintSection, FAQSection, TrustSection -- all have a small SVG icon + `section-label` text in a `flex items-center gap-2` container
- **Without icon:** TestimonialSection (line 41) -- uses bare `section-label` with no icon
- **Without icon:** ClosingCTA (line 45) -- uses bare `section-label` with no icon
- **Without icon:** Diagnostic page (line 18) -- uses bare `section-label` with no icon

The visual inconsistency is subtle but breaks the pattern. The icon adds a small operational/precision signal that reinforces the brand.
**Proposed fix:** Add a small icon to TestimonialSection, ClosingCTA, and the diagnostic page section labels for consistency, or decide explicitly that standalone pages and terminal sections skip the icon.

### T-21 | LOW | Section label element type varies: `<p>`, `<span>`, bare text
**Files:**
- ProblemSection line 78: `<p className="section-label">`
- ComparisonSection line 77: `<p className="section-label">`
- HowItWorksSection line 61: `<p className="section-label">`
- SprintSection line 114: `<span className="section-label">`
- FAQSection line 57: `<p className="section-label">`
- TrustSection line 45: `<p className="section-label">`
- TestimonialSection line 41: `<span className="section-label mb-12 block">`
- ClosingCTA line 45: `<motion.p ... className="section-label mb-6">`
- Diagnostic line 18: `<p className="section-label mb-3">`

**Problem:** The semantic element wrapping `section-label` varies between `<p>`, `<span>`, and `<motion.p>`. While visually identical (the `.section-label` class handles all styling), the inconsistency makes maintenance harder.
**Proposed fix:** Standardize on `<p className="section-label">` for all section labels. When inside a motion wrapper, use `<motion.p>` or wrap the `<p>` in a `<motion.div>`.

### T-22 | LOW | Section label tracking values vary across inline styles
**Files:**
- `.section-label` CSS class: `letter-spacing: 0.14em` (globals.css line 84)
- HeroSection badge pill (line 94): `tracking-[0.12em]`
- HeroSection CTA sub-text (line 147): `tracking-[0.12em]`
- Metric unit labels (line 166): `tracking-[0.08em]`
- Metric labels (line 170): `tracking-[0.12em]`
- ComparisonSection column labels (line 113): `tracking-[0.14em]`
- HowItWorksSection step labels (line 105): `tracking-[0.16em]`
- SprintSection stat labels (line 153): `tracking-[0.14em]`
- TrustSection ordinal labels (line 79): `tracking-[0.15em]`
- TestimonialSection role (line 56): `tracking-[0.12em]`
- Footer copyright (line 58): `tracking-wide` (0.025em)

**Problem:** Mono uppercase labels use tracking values of 0.08em, 0.10em, 0.12em, 0.14em, 0.15em, and 0.16em across the site. There is no consistent system. The visual difference between 0.12em and 0.14em is negligible, but the inconsistency makes the codebase feel unplanned.
**Proposed fix:** Standardize on two tracking tiers:
- `tracking-[0.12em]` for compact labels (badges, notes, attribution)
- `tracking-[0.14em]` for section-level labels (section-label class, stat labels, column headers)

Reduce HowItWorksSection step label from 0.16em and TrustSection ordinal from 0.15em to 0.14em to match.

---

## 7. Number Formatting

### T-23 | LOW | Metric strip in HeroSection: "R10k" value mixes currency symbol with abbreviation
**File:** `components/sections/HeroSection.tsx`, line 13
**Problem:** The third metric shows `R10k` as the value and `/month` as the unit. The "R" (Rand symbol) is baked into the value string, while in SprintSection (line 67), the same number is formatted as `R10,000` via `toLocaleString('en-ZA')`. Inconsistent number formatting for the same data point across two sections.
**Proposed fix:** Either use `R10,000` in the hero metric strip too (matching SprintSection), or use `R10k` consistently in both places. Given the hero strip is a glanceable data visualization, the abbreviated `R10k` is defensible, but the inconsistency should be deliberate.

### T-24 | LOW | SprintSection CountUp for retainer formats with `toLocaleString('en-ZA')` correctly
**File:** `components/sections/SprintSection.tsx`, line 68
**Problem:** No issue. `en-ZA` locale uses spaces as thousand separators (R10 000), but `toLocaleString` in most browsers renders this correctly. Good practice.

### T-25 | LOW | Metric strip "5" + "Guaranteed" reads awkwardly
**File:** `components/sections/HeroSection.tsx`, lines 11, 162-168
**Problem:** The first metric has value "5" and unit "Guaranteed". Visually, this renders as `5 Guaranteed` with the number in display font and "Guaranteed" in small mono caps. The word "Guaranteed" is not a unit -- it is a qualifier. The label below says "Client conversations in 30 days". The hierarchy reads: `5 Guaranteed / Client conversations in 30 days`. A cleaner structure would be `5 / Guaranteed client conversations` with the guarantee in the label.
**Proposed fix:**
```ts
{ value: '5', unit: '+', label: 'Guaranteed client conversations', note: 'In your first 30 days, or we work free' },
```

---

## 8. Color Hierarchy

### T-26 | MEDIUM | `#C5C0BB` used as body text color in most sections, but not defined in the theme
**Files:** `app/globals.css`, `tailwind.config.ts`
**Problem:** The color `#C5C0BB` is used extensively for body text across ProblemSection (line 159), SprintSection (lines 129, 153, 166, 189, 205), ComparisonSection (line 166), HowItWorksSection (lines 113, 120), TrustSection (lines 79, 87), ClosingCTA (lines 58, 67), FAQSection (line 108), and TestimonialSection (line 51). However, it is not defined anywhere in the theme. The official palette defines:
- `#F2EDE4` -- primary text
- `#A09890` -- secondary text
- `#6E6762` -- tertiary text (in tailwind config) / `#857F74` (used inline)

`#C5C0BB` sits between primary and secondary, functioning as a "mid-weight" body text color. Its absence from the theme means it exists only as scattered hex values.
**Proposed fix:** Add `#C5C0BB` to both the CSS theme and Tailwind config:
```css
/* globals.css */
--color-text-mid: #C5C0BB;
```
```ts
// tailwind.config.ts
'text-mid': '#C5C0BB',
```
Then replace all `text-[#C5C0BB]` usages with `text-text-mid`.

### T-27 | MEDIUM | `#857F74` used in components but not matching `--color-text-tertiary: #6E6762`
**Files:** Multiple components vs. `globals.css` line 14, `tailwind.config.ts` line 22
**Problem:** The theme defines `text-tertiary` as `#6E6762`, but components consistently use `#857F74` for tertiary text (HeroSection lines 127, 170; ComparisonSection line 13; TestimonialSection lines 57, 69; TrustSection line 106; diagnostic page line 113). These are different colors:
- `#6E6762` = RGB(110, 103, 98) -- darker
- `#857F74` = RGB(133, 127, 116) -- lighter, warmer

The components are using the warmer, lighter value. The theme token is dead.
**Proposed fix:** Update the theme to match actual usage:
```css
--color-text-tertiary: #857F74;
```
```ts
'text-tertiary': '#857F74',
```

### T-28 | LOW | Inconsistent secondary text: `#A09890` used inline instead of theme token
**Files:** All components
**Problem:** Every instance of `#A09890` is hardcoded as `text-[#A09890]` rather than using the theme token `text-text-secondary`. The theme defines it correctly but no component uses the token. Same applies to `#F2EDE4` (never `text-text-primary`).
**Proposed fix:** Migrate to semantic tokens across all components. This is a large refactor but prevents palette drift.

---

## 9. Gold (#CF9B2E) Usage

### T-29 | LOW | Gold used with appropriate restraint
**Problem:** Gold `#CF9B2E` is used for:
- Gold-line accents (CSS class, all sections)
- Section ordinal numbers (ProblemSection, SprintSection)
- Guarantee badge label (SprintSection line 199)
- "Recommended" badge (ComparisonSection line 118)
- Check-mark icons in IGC column (ComparisonSection line 130)
- Border-left accent on guarantee and revenue blocks (SprintSection lines 162, 197)
- FAQ chevron indicator (FAQSection line 91)
- Focus ring color (Button, FAQSection)
- Decorative quotation mark at 15% opacity (TestimonialSection line 50)
- Metric note text at 70% opacity (HeroSection line 174)
- Background ordinal watermarks at 8% opacity (TrustSection line 72)

Gold is NOT used for body text or headings (correct). It signals hierarchy markers and interaction affordances. This is well-disciplined. No issue.

### T-30 | LOW | Two slightly different golds: `#CF9B2E` (components) vs `#C9922A` (Tailwind config)
**File:** `tailwind.config.ts` line 24 vs `globals.css` line 18
**Problem:** The Tailwind config defines `gold: '#C9922A'` while `globals.css` defines `--color-gold: #CF9B2E`. All component code uses the `#CF9B2E` value directly via arbitrary values. The Tailwind token `text-gold` resolves to a different, slightly darker gold that nothing uses.
**Proposed fix:** Align the Tailwind config gold to match:
```ts
gold: '#CF9B2E',
```

---

## 10. Contrast (WCAG)

### T-31 | HIGH | `#857F74` on `#080808` -- contrast ratio 3.4:1 -- FAILS AA for normal text
**Files:** HeroSection line 127 (`text-[#857F74]` body text at `text-body-md` / 20px), HeroSection line 170 (metric labels at 11px), TestimonialSection line 57 (tag at 10px), TrustSection line 106 (social proof line at 11px), diagnostic page line 113 (email note at 11px)
**Problem:** `#857F74` on `#080808` has a contrast ratio of approximately **3.39:1**. This fails WCAG AA for normal text (<4.5:1). At 11px mono uppercase, this text is not "large text" (which requires 3:1). The metric labels and social proof notes are functionally decorative, but the HeroSection secondary paragraph (line 127, `text-body-md` at 20px) carries meaningful content and fails.
**Proposed fix:** For body text, bump `#857F74` to `#9A948A` (approximately 4.5:1) or use `#A09890` (5.2:1). For decorative labels at very small sizes, the low contrast is a deliberate design choice to create depth; accept the trade-off or bump to `#968F85`.

### T-32 | HIGH | `#A09890` on `#111110` -- contrast ratio ~4.3:1 -- borderline FAIL for normal text
**Files:** ProblemSection line 78 (section-label on `bg-[#111110]`), and anywhere `section-label` (color `#A09890`) appears on the `#111110` surface
**Problem:** `#A09890` on `#111110` yields approximately **4.32:1** contrast. This narrowly fails WCAG AA's 4.5:1 requirement for normal text. The section-label class renders at 12px mono uppercase, which is not "large text" (18px+ or 14px+ bold).
**Proposed fix:** Either:
- Lighten section labels to `#B5AFA8` (~5.5:1 on `#111110`), or
- Accept the borderline fail since these are structural labels, not content-critical text

### T-33 | MEDIUM | `#CF9B2E` at 70% opacity on `#080808` -- metric note in HeroSection
**File:** `components/sections/HeroSection.tsx`, line 174
**Problem:** `text-[#CF9B2E]/70` computes to approximately `rgba(207,155,46,0.7)` which, composited on `#080808`, yields an effective color around `#936E21`. Against `#080808`, this is approximately **3.5:1** -- fails AA for the 10px text it is applied to.
**Proposed fix:** Use `text-[#CF9B2E]/80` or full `text-[#CF9B2E]` (8.1:1 approximate). Since this is the guarantee note ("Or we work free until we do"), it carries real meaning and should be legible.

### T-34 | MEDIUM | `#3D3A37` X-mark icons on `#080808` background
**File:** `components/sections/ComparisonSection.tsx`, line 142
**Problem:** The non-IGC column X-mark icons use `text-[#3D3A37]` on `bg-[#080808]`. Contrast ratio is approximately **1.6:1**. This is functionally invisible. While the icons are decorative (the text carries the meaning), a completely invisible icon is worse than no icon.
**Proposed fix:** Bump to `text-[#5A5550]` (~3:1) for subtle-but-visible, or `text-[#6E6762]` for clearly visible.

---

## 11. Font Mixing

### T-35 | LOW | Three-font system is well-executed
**Problem:** The site uses three fonts with clear roles:
- **Playfair Display** (`font-display`): Headlines, large decorative numbers, quotation marks
- **Inter** (`font-sans`): Body text, nav links, list items, FAQ questions
- **DM Mono** (`font-mono`): Labels, metadata, tracking-heavy uppercase text, badges

This is a clean, intentional three-tier system. No accidental mixing detected.

### T-36 | LOW | Playfair Display loaded with `['400', '700']` but `700` may not be used
**File:** `app/layout.tsx`, line 9
**Problem:** Playfair is loaded with weights 400 and 700. Display headings use the default weight (400) via `font-display` with no explicit `font-bold`. The only Playfair bold usage would need to be verified, but a grep shows no `font-bold` paired with `font-display` anywhere. Weight 700 adds dead bytes.
**Proposed fix:** Remove `'700'` from the Playfair weight array unless bold italic Playfair is needed for future content.

---

## 12. Orphans and Widows

### T-37 | MEDIUM | HeroSection h1 manual `<br>` creates a good break but is fragile
**File:** `components/sections/HeroSection.tsx`, line 107
**Problem:** `We build the BD pipeline<br />your billers will not.` -- the `<br>` creates two balanced lines on desktop. On mobile, if the first line wraps naturally before "pipeline", the `<br>` creates three lines with a very short last line ("will not."). At 375px viewport, `text-display-xl` clamps to 4rem (64px) within a `max-w-[900px]` container that is narrower than viewport minus padding. The natural wrapping at mobile may produce orphans.
**Proposed fix:** Use `<br className="hidden md:inline" />` to only break on desktop, letting mobile text wrap naturally. Or use `text-balance` (CSS):
```tsx
className="font-display text-display-xl text-[#F2EDE4] mb-8 text-balance"
```

### T-38 | LOW | Multiple section headlines use `<br>` for line breaks
**Files:**
- ProblemSection line 86: `Your agency is good.<br />Your mandate pipeline is not.`
- HowItWorksSection line 70: `Three steps.<br />One outcome.`
- FAQSection line 66: `Questions worth asking<br />before you sign anything.`
- TrustSection line 53: `Built for recruitment.<br />Accountable for results.`
- ClosingCTA line 53: `Your Q2 2026 build slot<br />is open.`

**Problem:** These hardcoded breaks work on desktop but can create orphans on narrow viewports where the text wraps before the `<br>`. The ClosingCTA break is particularly problematic: "is open." as a standalone line is weak.
**Proposed fix:** Apply `text-balance` to all section `<h2>` headings and remove `<br>` tags, or use responsive `<br className="hidden md:inline" />`.

---

## 13. Section Label Pattern

### T-39 | LOW | `.section-label` CSS class is well-defined and consistent
**File:** `app/globals.css`, lines 79-86
**Problem:** The class produces: DM Mono, 12px, weight 500, tracking 0.14em, uppercase, color `#A09890`. This is consistently applied across all sections. The only variance is the margin-bottom (handled per-component) and the presence/absence of an icon (see T-20). No issue with the class itself.

### T-40 | LOW | Gold line (`gold-line` class) spacing before section labels varies
**Files:** Multiple sections
**Problem:** The gold-line class is always followed by `mb-6`, and the section label group always has `mb-4` before the headline. But the gold-line placement varies:
- Most sections: `<span className="gold-line mb-6 block" />` as a sibling before the label
- ClosingCTA line 43: `mb-8` instead of `mb-6`

The ClosingCTA uses 8 instead of 6 for the gold-line bottom margin. Minor inconsistency.
**Proposed fix:** Change ClosingCTA line 43 from `mb-8` to `mb-6` for consistency.

---

## 14. Metric Strip Typography

### T-41 | MEDIUM | Metric strip value/unit hierarchy is clear but the value font size is hardcoded
**File:** `components/sections/HeroSection.tsx`, line 163
**Problem:** The metric values use `text-[1.75rem]` (28px) in Playfair Display. This is an arbitrary value that does not correspond to any step in the type scale. The closest scale step is `display-sm` which is `clamp(1.375rem, 2.2vw, 1.875rem)` (22-30px). Using the scale step would maintain system coherence.
**Proposed fix:**
```tsx
<span className="font-display text-display-sm leading-tight text-[#F2EDE4]">
```

### T-42 | LOW | Metric strip labels and units have clear hierarchy
**File:** `components/sections/HeroSection.tsx`, lines 162-179
**Problem:** The three-tier hierarchy is:
1. Value: Playfair 28px, `#F2EDE4` (primary)
2. Unit: DM Mono 11px, tracking 0.08em, `#A09890` (secondary)
3. Label: DM Mono 11px, tracking 0.12em, uppercase, `#857F74` (tertiary)

The unit and label are both 11px mono but differentiated by tracking and color. This works visually but the color differentiation relies on `#857F74` which has contrast issues (see T-31).
**Proposed fix:** Address via T-31 fix. No additional change needed.

### T-43 | LOW | SprintSection stat blocks use `text-display-lg` for CountUp values -- much larger than hero metric strip
**File:** `components/sections/SprintSection.tsx`, line 150
**Problem:** SprintSection stat values render at `display-lg` (clamp 2.75rem to 5rem), while the hero metric strip uses 1.75rem. The same data (R10k retainer, 30 days, 5 conversations) appears in both places at dramatically different scales. This is intentional (hero strip is glanceable, SprintSection is monumental), but worth noting the 2-3x size difference.

---

## 15. Additional Findings

### T-44 | HIGH | Comparison point text uses arbitrary `text-[0.9375rem]` outside the type scale
**File:** `components/sections/ComparisonSection.tsx`, line 155
**Problem:** `text-[0.9375rem]` (15px) is not in the type scale. The nearest options are Tailwind's `text-sm` (14px) or `text-base` (16px). This creates a one-off size that breaks scale consistency. 15px is visually indistinguishable from 16px at reading distance but adds maintenance burden.
**Proposed fix:** Use `text-base` (16px) or, for tighter cards, `text-sm` (14px). If 15px is essential, add it to the type scale:
```ts
'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
```

### T-45 | MEDIUM | Nav link text sizes differ between desktop and mobile without clear reason
**File:** `components/ui/Nav.tsx`
- Desktop (line 57): `text-sm` (14px)
- Mobile (line 44): `text-[1.0625rem]` (17px)

**Problem:** The mobile nav links are 21% larger than desktop, which is correct for touch targets. But `1.0625rem` is another arbitrary size outside the type scale. The nearest Tailwind size is `text-lg` (18px).
**Proposed fix:** Use `text-base` (16px) for mobile nav links -- large enough for touch, and in the type scale.

### T-46 | LOW | FAQ question text uses `text-xl` (20px) which matches `body-md` but uses a different Tailwind class
**File:** `components/sections/FAQSection.tsx`, line 82
**Problem:** FAQ questions use `text-xl` (Tailwind default: 1.25rem / 20px) while body text elsewhere uses `text-body-md` (also 1.25rem / 20px with lineHeight 1.7). They resolve to the same font-size but the FAQ uses Tailwind's native `leading-snug` (1.375) instead of body-md's 1.7. Using two different class names for the same size adds confusion.
**Proposed fix:** Use `text-body-md leading-snug` for FAQ questions to reference the custom scale.

### T-47 | MEDIUM | Diagnostic page h2 uses arbitrary `text-[1.5rem]` instead of scale
**File:** `app/diagnostic/page.tsx`, line 48
**Problem:** The profile card name "K.C. Viljoen" uses `text-[1.5rem]` (24px). This matches `body-lg` in size but uses Playfair Display (`font-display`). Neither `body-lg` nor any display scale step is exactly 24px. The nearest display step is `display-sm` (clamp 1.375rem to 1.875rem), which at a typical viewport would be close but not identical.
**Proposed fix:** Use `text-display-sm` for consistency with the type scale.

### T-48 | LOW | Button text sizes use arbitrary values matching no scale step
**File:** `components/ui/Button.tsx`, lines 61-63
**Problem:** Button sizes use `text-[0.75rem]` (12px), `text-[0.8125rem]` (13px), `text-[0.875rem]` (14px). These are 12/13/14px. Only 14px matches a Tailwind default (`text-sm`). The 12px and 13px are off-scale. For uppercase tracked text at these sizes, the precise size matters less than the tracking and weight, so this is acceptable for a button component.

### T-49 | LOW | Footer copyright uses `tracking-wide` (0.025em) -- far less than other mono labels
**File:** `components/ui/Footer.tsx`, line 58
**Problem:** `tracking-wide` resolves to `0.025em`, while all other mono uppercase labels use 0.10em-0.16em. The copyright text at 10px with only 0.025em tracking feels tighter than every other label on the site.
**Proposed fix:** Change to `tracking-[0.10em]` for consistency with other small mono text.

---

## Summary Table

| ID | Severity | Component | Issue |
|----|----------|-----------|-------|
| T-01 | LOW | layout.tsx | Inter loaded as `--font-dm-sans` (misleading variable name) |
| T-02 | LOW | globals.css / tailwind.config.ts | body-lg/body-md lack fluid scaling |
| T-03 | MEDIUM | layout.tsx | Poppins font loaded but never used (~15KB dead weight) |
| T-05 | MEDIUM | ComparisonSection.tsx | `<div>` nested inside `<motion.p>` (invalid HTML) |
| T-06 | MEDIUM | SprintSection.tsx | `<div>` nested inside `<motion.p>` (invalid HTML) |
| T-07 | MEDIUM | FAQSection.tsx | `<div>` nested inside `<motion.p>` (invalid HTML) |
| T-08 | LOW | TestimonialSection.tsx | Block element inside `<motion.p>` |
| T-09 | LOW | ClosingCTA.tsx | `<h2>` at display-lg breaks heading size hierarchy |
| T-17 | MEDIUM | TestimonialSection.tsx | `font-semibold` (600) not loaded in Inter |
| T-18 | LOW | Button.tsx | `font-semibold` (600) not loaded in Inter (all primary CTAs) |
| T-19 | LOW | Multiple | Redundant `font-normal` declarations |
| T-20 | MEDIUM | Multiple | Section label icon pattern inconsistent |
| T-21 | LOW | Multiple | Section label element type varies (p/span/motion.p) |
| T-22 | LOW | Multiple | Mono label tracking values inconsistent (0.08-0.16em) |
| T-23 | LOW | HeroSection.tsx | "R10k" vs "R10,000" inconsistent number formatting |
| T-25 | LOW | HeroSection.tsx | "5 Guaranteed" metric reads awkwardly |
| T-26 | MEDIUM | globals.css / tailwind.config.ts | `#C5C0BB` used everywhere but absent from theme |
| T-27 | MEDIUM | globals.css / tailwind.config.ts | Theme tertiary `#6E6762` mismatches actual usage `#857F74` |
| T-28 | LOW | All components | Hardcoded hex values instead of theme tokens |
| T-30 | LOW | tailwind.config.ts vs globals.css | Two different gold values (`#C9922A` vs `#CF9B2E`) |
| T-31 | HIGH | Multiple | `#857F74` on `#080808` fails WCAG AA (3.4:1) |
| T-32 | HIGH | Multiple | `#A09890` on `#111110` borderline fails WCAG AA (4.3:1) |
| T-33 | MEDIUM | HeroSection.tsx | Gold at 70% opacity fails AA for meaningful text |
| T-34 | MEDIUM | ComparisonSection.tsx | X-mark icons at 1.6:1 contrast -- invisible |
| T-36 | LOW | layout.tsx | Playfair 700 weight loaded but unused |
| T-37 | MEDIUM | HeroSection.tsx | `<br>` in h1 creates mobile orphans |
| T-38 | LOW | Multiple | Hardcoded `<br>` in headlines fragile on mobile |
| T-40 | LOW | ClosingCTA.tsx | Gold line uses `mb-8` instead of `mb-6` |
| T-41 | MEDIUM | HeroSection.tsx | Metric value 1.75rem is off the type scale |
| T-44 | HIGH | ComparisonSection.tsx | `text-[0.9375rem]` (15px) outside type scale |
| T-45 | MEDIUM | Nav.tsx | Mobile nav `text-[1.0625rem]` off-scale |
| T-46 | LOW | FAQSection.tsx | `text-xl` used instead of semantic `text-body-md` |
| T-47 | MEDIUM | diagnostic/page.tsx | Profile h2 `text-[1.5rem]` off-scale |
| T-48 | LOW | Button.tsx | Button text sizes 12/13px off standard scale |
| T-49 | LOW | Footer.tsx | Copyright tracking-wide far looser than other mono labels |

### Severity counts

| Severity | Count |
|----------|-------|
| HIGH | 3 |
| MEDIUM | 16 |
| LOW | 18 |
| **Total** | **37** |

### Top-priority fixes (highest impact-to-effort ratio)

1. **T-17 + T-18:** Add `'600'` to Inter weight array -- one line fix, affects every CTA on the site
2. **T-05/06/07:** Change `<motion.p>` to `<motion.div>` -- three one-word changes, fixes hydration risk
3. **T-31:** Bump `#857F74` body text to `#9A948A` for WCAG AA compliance
4. **T-03:** Remove unused Poppins font -- delete 5 lines, save ~15KB
5. **T-30:** Align gold values -- one character change in tailwind.config.ts
6. **T-26/27:** Add `#C5C0BB` and correct `#857F74` in theme -- prevents palette drift
