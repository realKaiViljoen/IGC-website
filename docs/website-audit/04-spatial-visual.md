# 04 -- Spatial Design, Layout Rhythm & Visual Craft Audit

**Auditor scope:** Every pixel-level spatial decision, padding rhythm, decorative element calibration, and layout consistency across the public-facing marketing site.

**Files audited:** HeroSection, ProblemSection, ComparisonSection, HowItWorksSection, SprintSection, TestimonialSection, FAQSection, TrustSection, ClosingCTA, Nav, Button, Footer, SectionWrapper, page.tsx, globals.css, diagnostic/page.tsx, tailwind.config.ts

---

## Findings

---

### SV-01 | HIGH | TestimonialSection missing from page

**File:** `app/page.tsx` (entire file)

**Problem:** `TestimonialSection` is imported nowhere in `page.tsx`. The component exists and is fully built, but it never renders on the homepage. The page flow goes Comparison -> FAQ -> ClosingCTA with no social proof between them. This is a significant content gap -- the testimonial with the "22 vs 6 consultations" stat is one of the strongest conversion assets on the site and it is invisible.

**Proposed fix:**
```tsx
// app/page.tsx -- add import and render between ComparisonSection and FAQSection
import { TestimonialSection } from '@/components/sections/TestimonialSection'

// In JSX, after <ComparisonSection />:
<TestimonialSection />
```

---

### SV-02 | HIGH | ClosingCTA bypasses SectionWrapper -- inconsistent container

**File:** `components/sections/ClosingCTA.tsx:13`

**Problem:** ClosingCTA uses a raw `<section>` with manual `px-6 md:px-10 lg:px-16` and `max-w-site mx-auto` inside a nested `motion.div`. Every other content section uses `<SectionWrapper>` which enforces consistent horizontal padding and the `max-w-site` inner container. The ClosingCTA duplicates that logic manually but differs: it has `py-20 md:py-32` instead of SectionWrapper's `py-28 md:py-32 lg:py-40`, meaning mobile vertical padding is 80px vs the standard 112px, and desktop is missing the lg:py-40 step entirely.

**Proposed fix:** Refactor ClosingCTA to use `<SectionWrapper className="bg-[#080808] min-h-screen flex items-center overflow-hidden">` and move decorative elements inside it. This standardises padding to `py-28 md:py-32 lg:py-40` matching all other sections.

---

### SV-03 | HIGH | HeroSection has no max-w-site outer container

**File:** `components/sections/HeroSection.tsx:29`

**Problem:** HeroSection manages its own padding (`px-6 md:px-10 lg:px-16 pt-32`) and uses `max-w-[900px]` for the content block (line 73). It does not use SectionWrapper. The 900px constraint is narrower than the site-wide 1200px and is applied to the content but not to the metric strip, which sits inside that same 900px container. On ultra-wide screens (>1440px), the hero content is visually narrower than subsequent sections, which is intentional for the headline, but the section itself has no outer bound. The horizontal padding also differs slightly: the hero uses `pt-32` (no pb), relying on `min-h-screen` for vertical sizing, but has no bottom padding at all -- the metric strip butts directly against the section bottom with only the `mt-20` margin.

**Proposed fix:** Add `pb-16 md:pb-20` to the section element to give the metric strip breathing room from the section bottom edge. The hero intentionally shouldn't use SectionWrapper (it's a full-bleed hero), but needs bottom padding.

---

### SV-04 | MEDIUM | HowItWorksSection CTA block sits inside the 3-column grid

**File:** `components/sections/HowItWorksSection.tsx:119`

**Problem:** The CTA block (`mt-16 pt-10 border-t`) is a child of the `grid grid-cols-1 md:grid-cols-3 gap-16` container (line 79). On desktop, this means the CTA occupies the first column of a new grid row, constrained to ~33% width. The border-top only spans that column, not the full width. Compare to ComparisonSection (line 165) and TrustSection (line 104) where the CTA block is also inside the grid but TrustSection uses `md:col-span-3` to span full width. HowItWorksSection's CTA is missing `md:col-span-3`.

**Proposed fix:**
```tsx
// HowItWorksSection.tsx:119
// Change:
<motion.div variants={fadeUp} className="mt-16 pt-10 border-t border-[#2D2A27]">
// To:
<motion.div variants={fadeUp} className="md:col-span-3 mt-16 pt-10 border-t border-[#2D2A27]">
```

---

### SV-05 | MEDIUM | Section heading bottom-margin inconsistency

**Files:** Multiple section files

**Problem:** The `mb-` value between the section headline (`<h2>`) and the content below varies without clear rationale:
- ProblemSection: `mb-12` (line 84)
- ComparisonSection: `mb-12` (line 85)
- HowItWorksSection: `mb-20` (line 69)
- SprintSection: `mb-6` (line 121)
- FAQSection: `mb-16` (line 64)
- TrustSection: `mb-16` (line 52) plus an additional `mt-12` on the grid (line 62), totalling ~7rem gap

The range spans from `mb-6` (1.5rem) to `mb-20` (5rem) -- a 3.3x difference. SprintSection's `mb-6` is particularly tight; the headline almost collides with the body paragraph.

**Proposed fix:** Standardise to two tiers:
- `mb-12` (3rem) when body text or a description paragraph follows the headline immediately (Problem, Comparison, Sprint)
- `mb-16` (4rem) when cards/grid/interactive content follows (HowItWorks, FAQ, Trust)

Specific changes:
- `HowItWorksSection.tsx:69` -- change `mb-20` to `mb-16`
- `SprintSection.tsx:121` -- change `mb-6` to `mb-12`
- `TrustSection.tsx:52` -- keep `mb-16`, remove `mt-12` from line 62 grid

---

### SV-06 | MEDIUM | gold-line spacing before section-label is inconsistent

**Files:** All sections using the gold-line + section-label pattern

**Problem:** The gold-line always has `mb-6` applied, but its placement relative to the section-label varies:
- ProblemSection (line 54): `gold-line mb-6 block` then label with `mb-4` -- total gap: 1.5rem + 1rem = ~2.5rem before headline
- ComparisonSection (line 71): gold-line wrapped inside a `<motion.p>` with a `<div>` sibling -- the mb-6 is on the span, then the label div has `mb-4`
- HowItWorksSection (line 53): gold-line then label div -- consistent
- SprintSection (line 109): gold-line inside `<motion.p>` with div sibling -- same as Comparison
- TestimonialSection (line 40): gold-line then `section-label mb-12 block` -- `mb-12` instead of `mb-4`, a 3x gap before content
- FAQSection (line 49): gold-line is a `<motion.span>` separate from the label `<motion.p>` -- different animation stagger
- TrustSection (line 38): gold-line then label div -- consistent
- ClosingCTA (line 43): gold-line `mb-8` instead of `mb-6`, then section-label `mb-6` -- both values differ

**Proposed fix:** Standardise the pattern across all sections:
```
<span className="gold-line mb-6 block" />
<div className="flex items-center gap-2 mb-4">
  [optional icon]
  <p className="section-label">Label</p>
</div>
```
- TestimonialSection: change `mb-12` to `mb-4` on the section-label, add the standard `flex items-center gap-2 mb-4` wrapper
- ClosingCTA: change gold-line `mb-8` to `mb-6`, section-label `mb-6` to `mb-4`

---

### SV-07 | MEDIUM | Comparison grid -- IGC column not elevated enough on mobile

**File:** `components/sections/ComparisonSection.tsx:98-107`

**Problem:** On mobile, the IGC column gets `order-first` (good) and `max-w-sm mx-auto` (constrains width), but the visual elevation is minimal. The gradient top-line (line 106) is `md:hidden` so it only shows on mobile, but it's a 2px gradient that's barely visible. The border treatment `border border-[#CF9B2E]/30 border-l-2 border-l-[#CF9B2E]/50` is subtle. The `bg-[#0D0D0C]` is nearly indistinguishable from the other cards' `bg-[#080808]` -- a delta of only ~3 in the lightness channel.

**Proposed fix:**
1. Increase IGC card background to `bg-[#111110]` for more visible elevation against the `#080808` section bg
2. Strengthen the border: `border-[#CF9B2E]/40` and `border-l-[#CF9B2E]/70`
3. Add a subtle gold glow shadow: `shadow-[0_0_30px_rgba(207,155,46,0.06)]`
4. On the mobile top-line, increase opacity: `via-[#CF9B2E]/80`

---

### SV-08 | MEDIUM | Background alternation pattern broken by section order

**File:** `app/page.tsx`

**Problem:** The intended rhythm is `#080808` / `#111110` alternating. Current section order and backgrounds:
1. HeroSection -- `#080808`
2. ProblemSection -- `#111110`
3. TrustSection -- `#080808`
4. HowItWorksSection -- `#111110`
5. SprintSection -- `#111110` (REPEAT)
6. ComparisonSection -- `#080808`
7. FAQSection -- `#111110`
8. ClosingCTA -- `#080808`

SprintSection and HowItWorksSection are both `#111110`, creating a double-dark band with no visual break. If TestimonialSection (SV-01) is added between Comparison and FAQ, its `#080808` background would create: Comparison (#080808) -> Testimonial (#080808) -- another repeat.

**Proposed fix:** Either:
- Swap SprintSection to `#080808` and keep HowItWorks at `#111110`, OR
- Insert a section-divide border between HowItWorks and Sprint via the `divide` prop on SectionWrapper
- When adding TestimonialSection, place it between SprintSection and ComparisonSection (both currently adjacent dark sections), or adjust its background to `#111110`

---

### SV-09 | MEDIUM | Metric strip on mobile has no horizontal dividers

**File:** `components/sections/HeroSection.tsx:157`

**Problem:** The metric strip uses `divide-y divide-[rgba(242,237,228,0.06)] sm:divide-y-0` for mobile vertical dividers, but the opacity 0.06 is extremely faint against `#080808`. On desktop, the 3-column grid has `sm:gap-6` but no vertical dividers between columns. The metrics lack visual separation on both breakpoints. Compare to typical Bloomberg/premium dashboard UIs where metric cards have clear demarcation.

**Proposed fix:**
- Mobile: Increase divider opacity to `divide-[rgba(242,237,228,0.12)]`
- Desktop: Add vertical dividers via `sm:divide-x sm:divide-[rgba(242,237,228,0.08)] sm:divide-y-0` and change `sm:gap-6` to `sm:gap-0` so the divide-x renders visually

---

### SV-10 | MEDIUM | Nav pill max-width doesn't match site content width

**File:** `components/ui/Nav.tsx:99`

**Problem:** The nav pill is capped at `max-w-[940px]` while the site content uses `max-w-site` (1200px from tailwind config). On screens between 940px and 1200px+padding, the nav pill is noticeably narrower than the page content below. At exactly 1200px viewport, the content extends ~130px wider on each side than the nav. This creates a visual mismatch where the nav feels "floating smaller" than the content it should be anchoring.

**Proposed fix:** Increase to `max-w-[1080px]` or match `max-w-site` (1200px). The rounded-full pill shape and padding will keep it visually distinct even at wider sizes.

---

### SV-11 | MEDIUM | Button `sm` size too tall for nav context

**File:** `components/ui/Button.tsx:61`

**Problem:** All three button sizes have `min-h-[44px]` for touch targets, which is correct for mobile. But in the nav (52px tall pill, line 105 of Nav.tsx), the `sm` button with `py-2.5` and `min-h-[44px]` consumes nearly the full nav height (44px button + nav's internal padding). The button feels cramped within the nav pill.

**Proposed fix:** Add a `xs` size variant for nav-context buttons: `text-[0.75rem] px-4 py-2 min-h-[36px]`. The 44px touch target is unnecessary in the nav since the entire pill area is clickable context. Alternatively, reduce nav button to `size="sm"` but override with `className="min-h-[36px] py-1.5"`.

---

### SV-12 | MEDIUM | ComparisonSection has `<p>` wrapping `<div>` -- invalid HTML

**File:** `components/sections/ComparisonSection.tsx:70-79`

**Problem:** Line 70 opens a `<motion.p>` that contains a `<div>` on line 72. This is invalid HTML (`<div>` cannot be a child of `<p>`). The browser will silently close the `<p>` before the `<div>`, breaking the DOM tree and potentially the Framer Motion animation. Same issue in SprintSection line 108-115.

**Proposed fix:** Change `<motion.p>` to `<motion.div>` at:
- `ComparisonSection.tsx:70`
- `SprintSection.tsx:108`
- `FAQSection.tsx:50` (same pattern)

---

### SV-13 | LOW | Ghost "01" numeral in hero -- opacity calibration

**File:** `components/sections/HeroSection.tsx:64`

**Problem:** The ghost "01" uses `text-[#F2EDE4]/[0.025]` (2.5% opacity). At 28vw font size, this is appropriate on most screens, but on mobile (<480px), 28vw resolves to ~134px which makes the "01" small enough that at 2.5% opacity it becomes completely invisible. It only becomes perceptible around 768px+ viewport. This isn't necessarily wrong (it's a texture element), but the effort of rendering it on mobile is wasted.

**Proposed fix:** Either hide on mobile (`hidden md:block`) or increase mobile opacity slightly (`text-[#F2EDE4]/[0.025] md:text-[#F2EDE4]/[0.025]` -- keeping it, acknowledging it's decorative texture). Recommend leaving as-is or adding `hidden sm:block` to save a render on small screens.

---

### SV-14 | LOW | HowItWorksSection background ghost numbers too subtle on idle, too bright on hover

**File:** `components/sections/HowItWorksSection.tsx:92-97`

**Problem:** The step background numbers start at `text-[#F2EDE4]/[0.025]` and on hover transition to `opacity-60` via `group-hover:opacity-60`. That jumps from 2.5% to 60% opacity -- a 24x increase. The jump is jarring and the hover state makes the number compete with the actual content for attention. The text-[12rem] size means at 60% opacity it dominates the card.

**Proposed fix:** Reduce hover target: `group-hover:text-[#F2EDE4]/[0.06]` (or use `group-hover:opacity-[0.04]` as the utility). This creates a noticeable but subtle reveal. Change:
```tsx
// Line 93
className="... text-[#F2EDE4]/[0.025] ... transition-opacity duration-500 group-hover:opacity-[0.06]"
```

---

### SV-15 | LOW | Radial bloom gradient opacity varies wildly across sections

**Files:** HeroSection:54-57, ProblemSection:48-51, SprintSection:99-103, TestimonialSection:30-31, ClosingCTA:26-33

**Problem:** Gold atmospheric gradients are used in 5 sections with inconsistent intensity:
- Hero: `rgba(207,155,46,0.30)` -- 30% opacity, very visible
- Problem: `rgba(201,146,42,0.05)` -- 5%
- Sprint: `rgba(201,146,42,0.10)` -- 10%
- Testimonial: `rgba(201,146,42,0.04)` -- 4%
- ClosingCTA: `rgba(201,146,42,0.28)` -- 28%

The hero and closing CTA are "loud" (28-30%), while mid-page sections are "whisper" (4-10%). This is actually a well-calibrated envelope -- loud at entry and exit, quiet in the middle. However, note the color value inconsistency: Hero uses `207,155,46` (the defined `#CF9B2E`) while Problem/Sprint/Testimonial/ClosingCTA use `201,146,42` (which is `#C9922A` -- the tailwind config color). This means two slightly different gold hues are used.

**Proposed fix:** Standardise all gradient gold to `207,155,46` (matching the CSS custom property `--color-gold: #CF9B2E`) or all to `201,146,42` (matching tailwind config `gold: '#C9922A'`). Recommend resolving the config conflict first (see SV-18) then using one value throughout.

---

### SV-16 | LOW | Footer vertical padding is lighter than section rhythm

**File:** `components/ui/Footer.tsx:29`

**Problem:** Footer uses `py-10` (2.5rem = 40px). All content sections use SectionWrapper's `py-28 md:py-32 lg:py-40` (112px / 128px / 160px). The footer is appropriately lighter than content sections, but at 40px it's compressed enough that the logo, links, and copyright feel cramped on mobile where they stack vertically via `flex-col`.

**Proposed fix:** Increase to `py-12 md:py-10` -- giving mobile 48px breathing room while keeping desktop compact. Alternatively, `py-14` (56px) for both.

---

### SV-17 | LOW | Diagnostic page header padding differs from SectionWrapper

**File:** `app/diagnostic/page.tsx:15`

**Problem:** The page header uses `pt-32 pb-12` while SectionWrapper uses `py-28 md:py-32 lg:py-40`. The `pt-32` is fine (accounts for the fixed nav), but `pb-12` (3rem) is much tighter than the standard section bottom padding. The booking section below then starts with its own layout at `pb-24`. The overall vertical rhythm of the diagnostic page feels tighter than the homepage.

**Proposed fix:** Change header to `pt-32 pb-16 md:pb-20` to give more breathing room between the headline and the booking layout. Change the booking section to `pb-28 md:pb-32` to match SectionWrapper's rhythm.

---

### SV-18 | LOW | Gold color mismatch between tailwind.config.ts and globals.css

**File:** `tailwind.config.ts:24` vs `app/globals.css:17`

**Problem:** Two different gold values are defined:
- `tailwind.config.ts`: `gold: '#C9922A'` (tailwind utility classes)
- `globals.css @theme`: `--color-gold: #CF9B2E` (CSS custom properties)

`#C9922A` is slightly darker/more saturated than `#CF9B2E`. Any component using Tailwind's `text-gold` or `bg-gold` gets a different hue than components using the hardcoded `#CF9B2E` (which is what almost every section uses inline). The tailwind config gold is effectively unused since all sections hardcode the hex value.

**Proposed fix:** Align both to `#CF9B2E` in `tailwind.config.ts:24`. Then gradually replace hardcoded `#CF9B2E` references with `text-gold` / `bg-gold` / `border-gold` utility classes.

---

### SV-19 | LOW | Button primary variant lacks gold accent integration

**File:** `components/ui/Button.tsx:27-33`

**Problem:** The primary button is white/cream (`bg-[#F2EDE4]`) with a white glow shadow. In the gold-accented dark luxury aesthetic, the primary CTA has zero gold. The hover state goes to pure white (`hover:bg-white`), which is the brightest element on any page. On the dark `#080808` background, this creates maximum contrast but feels clinical rather than premium. Compare to how the gold-line, gold ordinals, and gold gradients create warmth throughout -- the CTA is the one element that breaks the gold thread.

**Proposed fix:** This is a design decision, not a bug. Two options:
1. Keep cream/white primary for maximum contrast (current) -- it reads as "clean and confident"
2. Add a subtle gold border glow on hover: `hover:shadow-[0_0_44px_rgba(207,155,46,0.20),0_6px_22px_rgba(0,0,0,0.55)]` -- threads the gold through the most important interactive element

---

### SV-20 | LOW | Precision grid pattern in hero uses absolute stroke opacity

**File:** `components/sections/HeroSection.tsx:43`

**Problem:** The grid stroke uses `strokeOpacity="0.06"` on `#F2EDE4`. This is barely visible, which is the intent. However, the grid is a 40x40px pattern, which on high-density displays renders as very fine 0.5px lines. On standard displays, the 0.5px stroke may alias to either 0px or 1px depending on sub-pixel positioning, creating an inconsistent grid appearance.

**Proposed fix:** Change `strokeWidth="0.5"` to `strokeWidth="1"` and reduce `strokeOpacity` to `"0.03"`. This gives the renderer a full pixel to work with while maintaining the same visual weight.

---

### SV-21 | LOW | TrustSection background ghost ordinals use different opacity than HowItWorks

**File:** `components/sections/TrustSection.tsx:72` vs `components/sections/HowItWorksSection.tsx:93`

**Problem:** TrustSection's ghost ordinals use `text-[#CF9B2E]/[0.08]` (gold at 8%) while HowItWorksSection uses `text-[#F2EDE4]/[0.025]` (cream at 2.5%). The TrustSection ordinals are therefore more visible and gold-tinted, while HowItWorks ordinals are nearly invisible and neutral. Since both sections use the same 3-column grid + ordinal pattern, the inconsistency reads as unintentional.

**Proposed fix:** Standardise both to `text-[#F2EDE4]/[0.03]` for cream-neutral ghost numerals, or both to `text-[#CF9B2E]/[0.05]` for a warm gold tint. Apply the same base to SprintSection's "90" watermark (line 137).

---

### SV-22 | LOW | ClosingCTA "IGC" watermark may overlap content on mid-size screens

**File:** `components/sections/ClosingCTA.tsx:16-17`

**Problem:** The giant "IGC" text at `fontSize: clamp(5rem, 20vw, 22rem)` is positioned `bottom-0 left-0 right-0` with `text-center`. At 20vw on a 1024px screen, this is ~205px tall. With `lineHeight: 0.85`, it extends ~174px from the bottom. The content above has the CTA button and supporting text. On screens around 768px, the content and the watermark may visually overlap, with the watermark's 4% opacity being enough to create noise behind the button text.

**Proposed fix:** Add `bottom-[-0.15em]` (using em so it scales with font-size) to push the baseline of "IGC" slightly below the section edge, keeping just the top curves visible. Or reduce to `text-[#F2EDE4]/[0.025]` to match hero ghost opacity.

---

### SV-23 | LOW | Scroll cue animation dot might be missed

**File:** `components/sections/HeroSection.tsx:189-197`

**Problem:** The scroll cue is `hidden md:flex`, so it's desktop-only. The line is `w-px h-8 bg-[#F2EDE4]/20` and the bouncing dot is `w-1 h-1 bg-[#F2EDE4]/30`. These are extremely small and faint. The entire assembly is `absolute bottom-8` which on many viewports may overlap with or sit very close to the metric strip. The `scrollCueOpacity` fades it out quickly (0-0.08 scroll progress), so it's only visible for the first ~50px of scroll.

**Proposed fix:** This is acceptable minimalism for the aesthetic. No change needed unless analytics show users aren't scrolling -- in which case, increase dot to `w-1.5 h-1.5 bg-[#F2EDE4]/40`.

---

### SV-24 | LOW | FAQ answer left border misaligned with question text

**File:** `components/sections/FAQSection.tsx:107`

**Problem:** The FAQ answer wraps in `border-l-2 border-[#CF9B2E]/40 pl-4`. The question text above has no left padding or border. When the answer expands, the gold left border appears indented from nothing, creating a visual "jump" on the left edge. The border effectively indents the answer 4px + 16px from the question.

**Proposed fix:** This is a deliberate design choice (indent = subordination). If the visual jump feels too strong, reduce to `pl-3` (12px) or extend the border treatment to start from the question baseline with `ml-0`.

---

### SV-25 | MEDIUM | Vertical rhythm base unit is inconsistent

**Files:** All sections

**Problem:** Examining the spacing values used across sections, the paddings and margins do not follow a strict base unit. Values seen:
- Section padding: 112px / 128px / 160px (SectionWrapper)
- Headline margins: 24px / 48px / 64px / 80px
- Content gaps: 16px / 24px / 48px / 64px / 80px
- Card padding: 24px
- Gold-line margin: 24px (mb-6)
- Section-label margin: 16px (mb-4)

These loosely follow an 8px grid (all divisible by 8 except some edge cases), but the jumps are inconsistent. SectionWrapper uses 112px (14 x 8) / 128px (16 x 8) / 160px (20 x 8) which is fine. But `mb-12` (48px = 6 x 8), `mb-16` (64px = 8 x 8), `mb-20` (80px = 10 x 8) are used somewhat arbitrarily between headlines and content.

**Proposed fix:** Document and enforce a spacing scale: 8, 16, 24, 32, 48, 64, 80, 96, 112, 128, 160. The existing values already fit this scale -- the issue is choosing from it inconsistently. See SV-05 for specific standardization recommendations.

---

### SV-26 | MEDIUM | Diagnostic page profile card sticky top offset vs nav height

**File:** `app/diagnostic/page.tsx:31`

**Problem:** The profile card uses `lg:sticky lg:top-24` (96px from top). The nav pill sits at `top-5` (20px) with a height of 52px, totaling ~72px. With `top-24` (96px), there's a 24px gap between nav bottom and card top. This is fine, but if the user scrolls, the card content may extend below the viewport on shorter screens (the card is quite tall with photo, credentials, and call details). The card has no max-height or overflow handling.

**Proposed fix:** Add `lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto` to the aside element so the card scrolls internally on shorter viewports. Style the scrollbar to match the dark theme: add a custom scrollbar class or use `scrollbar-thin scrollbar-thumb-[#2D2A27]`.

---

### SV-27 | LOW | Mobile menu dropdown top offset is hardcoded

**File:** `components/ui/Nav.tsx:168`

**Problem:** The mobile dropdown uses `top-[68px]` which is calculated as nav top (20px) + nav height (52px) - some overlap. If the nav pill height or top position changes, this value must be manually updated. It's a magic number.

**Proposed fix:** This is acceptable for now since the nav dimensions are stable. Document the calculation: `/* top-5 (20px) + h-[52px] - 4px overlap = 68px */`. If the nav dimensions change, update this value.

---

### SV-28 | LOW | SprintSection "90" ghost watermark -- why 90?

**File:** `components/sections/SprintSection.tsx:137-141`

**Problem:** The ghost watermark reads "90" but the section is about a "30-Day Build" with stats showing R10,000, 30 days, and 5+ conversations. The number 90 doesn't appear anywhere in the section's content. It may have been intended as "30" (matching the build duration) or may be a leftover from a previous version. A meaningless decorative number subtly undermines the precision-operator aesthetic.

**Proposed fix:** Change the watermark text to "30" to align with the section's core message, or remove it if no number is appropriate.

---

---

## Summary Table

| ID | Severity | Component | Issue |
|----|----------|-----------|-------|
| SV-01 | HIGH | page.tsx | TestimonialSection not rendered on homepage |
| SV-02 | HIGH | ClosingCTA | Bypasses SectionWrapper, inconsistent padding |
| SV-03 | HIGH | HeroSection | No bottom padding below metric strip |
| SV-04 | MEDIUM | HowItWorksSection | CTA block missing `md:col-span-3` |
| SV-05 | MEDIUM | Multiple | Headline bottom-margin varies 6-20 (1.5rem-5rem) |
| SV-06 | MEDIUM | Multiple | gold-line + section-label spacing inconsistent |
| SV-07 | MEDIUM | ComparisonSection | IGC column not visually elevated enough |
| SV-08 | MEDIUM | page.tsx | Background alternation breaks (double #111110) |
| SV-09 | MEDIUM | HeroSection | Metric strip dividers nearly invisible |
| SV-10 | MEDIUM | Nav | Pill max-width (940px) vs content max-width (1200px) |
| SV-11 | MEDIUM | Button/Nav | sm button too tall for 52px nav pill |
| SV-12 | MEDIUM | Multiple | `<p>` wrapping `<div>` -- invalid HTML |
| SV-25 | MEDIUM | Multiple | Vertical rhythm base unit used inconsistently |
| SV-26 | MEDIUM | Diagnostic | Profile card no overflow handling when sticky |
| SV-13 | LOW | HeroSection | Ghost "01" invisible on mobile |
| SV-14 | LOW | HowItWorksSection | Ghost numbers: 2.5% -> 60% opacity jump on hover |
| SV-15 | LOW | Multiple | Gold gradient color inconsistency (#CF9B2E vs #C9922A) |
| SV-16 | LOW | Footer | Vertical padding too tight on mobile |
| SV-17 | LOW | Diagnostic | Header padding tighter than homepage rhythm |
| SV-18 | LOW | Config | Gold color mismatch between tailwind config and CSS |
| SV-19 | LOW | Button | Primary CTA has no gold accent integration |
| SV-20 | LOW | HeroSection | Grid pattern sub-pixel rendering inconsistency |
| SV-21 | LOW | Trust/HowItWorks | Ghost ordinal opacity/color inconsistency |
| SV-22 | LOW | ClosingCTA | "IGC" watermark may overlap content on mid screens |
| SV-23 | LOW | HeroSection | Scroll cue extremely subtle |
| SV-24 | LOW | FAQSection | Answer border creates visual indent jump |
| SV-27 | LOW | Nav | Mobile dropdown top offset is a magic number |
| SV-28 | LOW | SprintSection | "90" ghost watermark doesn't match section content |

**Totals:** 3 HIGH, 11 MEDIUM, 14 LOW
