# Agent 3: Visual Atmosphere & Dark Aesthetic Audit

**Auditor:** Visual Atmosphere Specialist (Collins / Wolff Olins / Private Equity Aesthetic)
**Date:** 2026-04-08
**Codebase reviewed:** Full source — globals.css, tailwind.config.ts, all section components, all pages, Nav.tsx, DESIGN.md

---

## Executive Summary

The IGC design system is architecturally correct. The token decisions are sound. The Gold Rule is well-conceived and largely followed. The typography pairing is right. The motion system is right.

What the site is missing is **atmospheric depth** — the difference between a dark site and a *warm* dark site. Right now, the hero radiates at 6% opacity into a tight ellipse at -5%, -15%. The grain is 2.5% fixed. The card surfaces are correct in theory but anonymous in execution. The grid is present but invisible in practice. The ghost "01" is inaudible.

The result is a site that reads as "competent dark" rather than "operator dark." It has the right grammar but not yet the right voice. The fixes are specific, not sweeping, and most are measured in opacity percentages and pixel values.

**Three critical gaps:**
1. The bloom is too faint and too cornered to create warmth. It needs to breathe.
2. The stat numbers — the site's most powerful proof elements — are rendered without premium treatment on the services page.
3. The HowItWorksSection violates the Gold Rule: step numbers `01`, `02`, `03` are styled `text-gold`. This is the single most impactful rule breach in the codebase.

---

## Global Dark Theme Assessment

### Colour Analysis

**#080808 as base — Verdict: Correct, but could be warmer**

#080808 sits between Linear's #08080C (very slightly blue-shifted), Vercel's #000000 (pure cold black), and Resend's #0F0F0F (lighter neutral). At pure RGB 8,8,8 it is warm-neutral — it has no blue channel dominance. This is the right call for the "private equity operator" register.

However: warmth in dark themes comes not just from the base black but from the *relationship* between the base and the surface. Currently:

```
background:  #080808  → R:8  G:8  B:8   (neutral, not yet warm)
surface:     #111110  → R:17 G:17 B:16  (one unit warm bias — correct)
surface-soft:#0D0D0C  → R:13 G:13 B:12 (one unit warm bias — correct)
```

The warm bias in surfaces is there (B channel -1 relative to RG). But at this scale the distinction is imperceptible in isolation — it reads as warm only in aggregate. This is fine and intentional. The warmth should come from the *grain* and *bloom*, not the base. Those layers are under-powered (see below).

**Comparison:**
- Linear #08080C has a slightly raised blue channel which paradoxically reads warmer under certain monitors due to screen calibration. IGC's #080808 is a valid warm alternative.
- Vercel's pure #000000 works because their system is high-contrast monochrome — they don't need warmth. IGC does.
- Resend's #0F0F0F is the "safer" choice — more legible in all environments. IGC's #080808 is the bolder, more premium choice. Keep it.

**Recommendation:** #080808 is correct. Do not change it. The warmth deficit is in the atmospheric layers, not the base colour.

---

**Section alternation: #080808 ↔ #111110 — Verdict: Insufficient contrast, correct in theory**

The delta between these two values is 9 RGB units on each channel. At dark values, contrast perception is compressed — human vision loses sensitivity in the sub-20 range. In practice this difference is visible as a seam, not as a distinct section — which is exactly right. Top sites (Resend, Linear) use this approach intentionally. The problem is not the contrast, it is the *absence of any other section-differentiation signal*.

Linear uses: section label colour, spacing cadence, and content density as section differentiators — not background colour alone. IGC's current implementation leans almost entirely on the background toggle.

**Recommendation:** Add the `section-divide` class (the 1px rgba(242,237,228,0.05) top border) consistently as the primary section signal. Background alternation becomes secondary confirmation. Currently `SectionWrapper` has a `divide` prop that defaults to `false` — it is not being used on any section in production.

---

**Grain at 2.5% opacity — Verdict: Too faint**

The grain is implemented correctly as a fixed full-page SVG fractalNoise at baseFrequency 0.65, numOctaves 3. This is a professional-grade implementation — Basement.studio uses a near-identical approach.

However: 2.5% opacity on a dark background is near-invisible. The psychophysics of grain on dark surfaces requires *higher* opacity than grain on light surfaces because the grain signal competes with the dark background uniformity, not with a bright noisy canvas.

**Benchmarks:**
- Basement.studio: estimated 4–6% on dark backgrounds
- Resend: approximately 3.5–5% on their #0F0F0F base
- Framer: layered grain, effectively 4–7% depending on section

The DESIGN.md spec notes "2.5% (reduced from 3.5% for dark backgrounds)" — this reasoning is backwards. Dark backgrounds need *more* grain, not less. 3.5% was closer to correct. 5% would be the professional threshold.

**Recommendation:** Raise grain opacity from 0.025 to 0.045. This is the single change that would most immediately shift the site from "clean dark" to "textured operator dark." The perceptual difference at this range on dark surfaces is significant.

---

**Border colour #242220 at 1px — Verdict: Correct**

#242220 is RGB 36,34,32. Against #080808 background, this represents a delta of 28 units — sufficient for 1px borders to be intentional without being aggressive. This is approximately what Linear uses for its cell borders in the product UI.

The warm bias (R:36 > G:34 > B:32) is correct and intentional — these borders will appear warm brown-grey rather than cold grey, which reinforces the "private equity desk" aesthetic.

No change needed. The border colour is well-calibrated.

---

### Surface Hierarchy Audit

The system defines four levels:

```
background:      #080808  (level 0 — void)
surface-soft:    #0D0D0C  (level 1 — containers)
surface:         #111110  (level 2 — sections)
surface-raised:  #1A1918  (level 3 — cards, popovers)
```

This is correct as a *definition*. The audit question is whether this hierarchy is *deployed* consistently.

**Finding: surface-raised (#1A1918) is never used in production.**

Scanning all components and pages: `#1A1918` appears only in the DESIGN.md and tailwind.config.ts. In HowItWorksSection, the step cards have `group-hover:bg-[#1A1918]` — but this is a hover state, not a resting surface. No card, modal, or popover renders with the raised surface treatment by default.

This means the elevation system has only two visible levels (background and section) rather than four. The site reads flat despite the token infrastructure.

**Where surface-raised should be applied at rest:**
- The metric cards in HeroSection currently use `bg-[#0D0D0C]` (surface-soft). These could legitimately use surface-raised to feel more elevated.
- The stat blocks on the services page have no surface treatment at all — they float on section background with only a border-t divider.

---

## Gold Colour Distribution Audit

### Rule Compliance Check

Auditing every `text-gold`, `bg-gold`, `border-gold`, or `#C9922A` instance across all files:

**globals.css:**
- `.gold-line` → `rgba(201, 146, 42, 0.7)` — correct (the single decorative line use)
- `::selection` → `background-color: #C9922A` — correct (interactive state)

**HeroSection.tsx:**
- Gold line: `gold-line` class → correct
- No other gold usage → correct

**TrustSection.tsx:**
- No gold usage anywhere → correct

**SprintSection.tsx:**
- Section label: `text-[#857F74]` — correct (uses secondary, not gold)
- Stat numbers: `text-[#F2EDE4]` — correct (primary white, not gold — this is the right call)
- The CTA uses `variant="light"` — need to verify Button component, but appears correct

**HowItWorksSection.tsx:**
- **VIOLATION FOUND:** `text-gold` on step numbers `{step.number}` (line 64)
- These are mono labels, not KPI highlights, not CTAs, not active states
- Three instances of gold on static decorative step numbering — this is exactly the "ambient decorative gold" the Gold Rule prohibits
- Additionally: the gold left-border reveal on hover (`bg-gold` on the reveal bar, line 61) is technically correct as an *active/interactive state* signal — that usage is within the rule

**About page:**
- No gold usage — correct
- The philosophy items use `border-t border-[#242220]` — correct

**Services page:**
- **VIOLATION FOUND:** `text-gold` on component numbers in the list (line 81)
- Five instances: `01` through `05` beside service descriptions
- These are navigational/organizational labels, not KPI highlights or CTA elements
- Additionally: the services page hero section label uses `text-gold mb-4` (line 44): `"The Entry Point"` — this is a section label, and per the Gold Rule, section labels use `text-tertiary`. This is a third instance of gold on a label.

**Contact page:**
- Submit button: `background: '#C9922A'` solid fill → correct (this is the "Committed" CTA state)
- No other gold → correct

**Nav:**
- CTA button: gold variant → correct
- Active underline: `bg-[#F2EDE4]` not gold → this is interesting (see below)

### Rule Violations Summary

| Location | Element | Usage | Verdict |
|---|---|---|---|
| HowItWorksSection.tsx:64 | Step numbers 01/02/03 | Static mono labels | **VIOLATION** |
| services/page.tsx:81 | Component numbers 01–05 | Static organizational labels | **VIOLATION** |
| services/page.tsx:44 | "The Entry Point" section label | Section label | **VIOLATION** |
| Nav.tsx active underline | `bg-[#F2EDE4]` | Active state indicator | Diverges from spec (should be gold) but aesthetically defensible |

### Is the Rule Right?

Yes. The Gold Rule is correctly calibrated for this brand.

**The case for the restriction:** IGC's gold reads closest to amber-brown — it is not a bright yellow-gold like Superhuman uses (#FFCD00 range) but a darker, more muted #C9922A. At this saturation level, distributing gold liberally reads as "ochre mud" rather than "warm premium." Superhuman can use their gold liberally because it is bright enough to remain energetic at volume. IGC's gold is too warm and muted to survive liberal use — it would make the site look dirty rather than luxurious.

**Opportunity:** The step/component numbering (the violated instances) would be stronger in `text-tertiary` (#4A4640) with perhaps a `text-primary` (#F2EDE4) state on hover. The numbers exist to aid scanability, not signal importance. Gold on static ordinal labels reads as decoration, which is precisely what the rule prohibits.

**Nav active state:** The active underline in white (`bg-[#F2EDE4]`) rather than gold is a divergence from the DESIGN.md spec but actually a better choice visually. Gold active states work best as left-bar accents (vertical, structural) — a horizontal underline in gold at small scale tends to read as a highlighter pen. The white underline reads as precision. This divergence from spec is an improvement.

### Is #C9922A the Right Gold?

At the boundaries. A forensic colour analysis:

- **Hue:** approximately 35° (deep amber-orange)
- **Saturation:** 64% (muted — not vivid)
- **Lightness:** 48% (medium — readable on dark, not reflective)

This gold sits closer to "burnished bronze" than "polished gold." It is warmer and darker than what most premium sites use (Superhuman ~52°/75%/63%, Linear's occasional amber ~38°/70%/55%).

**The amber-brown risk:** At 48% lightness, this gold is one step away from reading as a warm brown rather than a prestigious gold. On a very dark background (#080808), the contrast is sufficient for it to read as gold. On slightly lighter surfaces (#111110), the risk increases.

**What top-tier sites use:**
- Raycast: approximately #FF6363 (they use red-orange, not gold — different positioning)
- Superhuman: #FFCD00 range (bright, high-contrast yellow-gold)
- Linear: no gold — they use their purple accent (#5E5CE6)
- Resend: uses white accent only

The honest answer: most premium dark operator sites don't use gold at all. They use white. IGC's gold is a differentiating choice — it signals warmth and "private capital" positioning more than pure white would. But the specific hue risks reading too amber/bronze at volume.

**Recommendation:** Shift #C9922A approximately 5° warmer (toward #D4992A or #CC9C2E) and raise lightness ~3 points to approximately #D49B30. This keeps the warmth while giving it more luminosity — preventing the bronze-mud reading. A small change with a meaningful perceptual shift.

---

## Hero Atmosphere Dissection

### Bloom Analysis

**Current implementation:**
```css
radial-gradient(ellipse 60% 45% at -5% -15%, rgba(201, 146, 42, 0.06) 0%, transparent 55%)
```

This bloom is effectively invisible in most viewing conditions. The audit finding is specific:

1. **Opacity 6% is below the perceptual threshold for dark backgrounds.** The bloom is competing with a #080808 base. At 6% of a muted gold, the actual luminosity contribution to the background is negligible — approximately +0.5–1.5 RGB units at the bloom centre. This is within the margin of monitor calibration variance. Some users will see nothing.

2. **The bloom is cornered into a zone the user's eye never dwells in.** Positioned at -5%, -15% — the top-left corner, partially off-screen — the bloom's visible territory is primarily where the nav lives. The hero headline lives in the left-center zone, which receives almost zero bloom light.

3. **60% × 45% at 6% opacity with 55% fade.** By the time the gradient reaches the headline zone (approximately 25–30% from the top-left), it is at roughly 2% luminosity effect. Imperceptible.

**Benchmark:** Raycast positions their hero bloom centrally behind the headline, at approximately 15–20% opacity for a larger, softer ellipse. Framer uses multiple blobs at 15–25% each. Even Vercel's more restrained product pages use gradient tints at 8–12% when they use them at all.

**The design spec reads "warm tint only, NOT gold" and "deliberately reduced to 4%."** This is the design philosophy being too restrained. The bloom is not gold at 6% — it is a memory of warmth. A ghost of intention.

**What the bloom should do:** Create a warmth that the user perceives as "the page has atmosphere" without consciously registering a gradient. This requires approximately 10–14% opacity on a bloom that covers the headline zone, not the corner.

**Recommended revision:**
```css
radial-gradient(ellipse 80% 60% at 15% 30%, rgba(201, 146, 42, 0.10) 0%, transparent 65%)
```

This repositions the bloom centre to 15% from left, 30% from top — directly behind where the headline sits — and raises opacity to 10%. The result is a warmth the eye perceives as "depth" rather than a tinted corner.

---

### Grid Analysis

**Current implementation:**
- 40px squares, strokeOpacity="0.04", stroke="#F2EDE4"

**At strokeOpacity 0.04 on #080808:** The computed colour of the grid line is approximately rgba(242, 237, 228, 0.04) — which on a #080808 base produces a line of approximately #0E0E0D. Against the #080808 background, this is a 6-unit delta. For a 0.5px stroke, this is effectively invisible at normal viewing distances.

**The ghost "01" at opacity 0.025** is in the same territory — 2.5% of #F2EDE4 on #080808 is approximately #0C0C0B, a 4-unit delta. This is sub-visual. It exists in the DOM and will occasionally register in ideal lighting conditions (bright room, high-contrast display), but it is not a reliable visual element.

**The design intent is correct: these elements are "the stage, not the performance."** They should be barely there. However "barely there" and "not there at all" are different perceptual states, and the current implementation may sit in the "not there at all" zone.

**Benchmarks for ghost/atmospheric elements:**
- Basement.studio structural elements: approximately 6–8% opacity
- Linear's grid lines in product screenshots: approximately 6% on similar dark base
- Cosmos.so structural marks: 5–8% range

**Recommended revision:**
- Grid: raise strokeOpacity from 0.04 to 0.06
- Ghost "01": raise opacity from 0.025 to 0.04

These are fractional changes but the perceptual difference between "there" and "not there" is exactly in this range.

---

### Metric Card Design Review

**Current implementation:**
```jsx
bg-[#0D0D0C] border border-[#242220]
padding: 18px 22px
width: 210px
```

The cards use `surface-soft` (#0D0D0C) as their background. Against the hero's #080808 base, this is a 5-unit delta — similar to the section alternation problem. These cards need to feel elevated, not just contained.

**The deeper problem:** The cards have no border-radius (sharp corners — correct for this brand), no box-shadow, no inner light, and no hover state. They are static, flat rectangles. For a product UI simulation — which is what these are — this reads as wireframe fidelity, not product screenshot fidelity.

**What premium product simulation cards look like:**
- Vercel's product screenshots use #161616 surfaces with 1px #333 borders and a subtle 0 1px 2px rgba(0,0,0,0.8) drop shadow — the shadow is what creates the "floating card" reading even on dark backgrounds
- Linear's metric cards have an inner border treatment (1px top edge lighter, 1px bottom edge darker) that simulates ambient top-light

**Recommended revision for metric cards:**
```jsx
bg-[#0D0D0C] border border-[#242220]
// add:
shadow: '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(242,237,228,0.04) inset'
```

The inset top edge (rgba(242,237,228,0.04)) simulates ambient light hitting the top of the card. The drop shadow creates depth against the hero background. Together these shift the cards from "flat container" to "floating interface element."

---

## Section-by-Section Visual Report

### Hero Section

**Strengths:**
- The 3-line staircase headline ("We build / acquisition / engines.") is compositionally strong — the line breaks create rhythm and each line is typographically complete
- The gold-line + badge + headline + sub + CTA entrance sequence is well-timed
- The content parallax (y: 0 to -30 on scroll) is restrained and correct
- The scroll cue implementation is tasteful — the animated dot and line are precise

**Weaknesses:**
1. Bloom too faint and mispositioned (detailed above)
2. Grid near-invisible (detailed above)
3. Ghost "01" sub-visual (detailed above)
4. Metric cards lack depth (detailed above)
5. The badge eyebrow (`4 active deployments · Q2 2026 cohort`) and the sub-CTA below the CTA buttons (`Active deployments: 4 med-aesthetic clinics`) say essentially the same thing twice. One of these should be cut. The badge handles it.
6. The right-side visual is inert — three metric cards float without visual logic. They would benefit from connection lines or a grid-aligned placement that suggests a dashboard layout rather than random positioning

**Net assessment:** The hero is doing 70% of the work it should be. The atmospheric layer is there in intent but not in execution. Three targeted opacity adjustments would shift it significantly.

---

### TrustSection

**Current treatment:** `bg-[#080808]`, section label, three grid columns, each with `border-t border-[#242220] pt-6`.

**The problem:** This section follows HowItWorksSection which also uses a grid of items. The visual pattern — section label + grid of text items — appears twice in quick succession. There is no visual rhythm differentiation.

**The border-t divider as the only separator:** `border-t border-[#242220] pt-6` is the section's only card treatment. At 1px, rgba not specified so using the raw hex (#242220), this reads as a hairline rule. It is a correct minimalist treatment — it is what Cosmos.so and Primer.style do. However it only works when the surrounding space is generous. The 10–12 gap between columns is too tight for the hairline-only approach to breathe.

**The missing element:** This section has no visual anchor — no number, no icon, no structural mark — other than the card title. The most immediate improvement is a DM Mono ordinal (01, 02, 03) in text-tertiary above each title, which would both differentiate this section from the HowItWorksSection visually and add vertical rhythm to the column.

**Net assessment:** Correct but anonymous. The section is trustworthy text but not trustworthy *presentation*. The content earns trust; the layout does not reinforce it.

---

### SprintSection

**Current treatment:** `bg-[#111110]`, headline, body, three stat blocks with CountUp, primary CTA.

**Positive:** The CountUp implementation is the most engaging interaction element on the site. Counting up to `R15,000`, `90 days`, `15+` creates visceral product proof.

**The stat display problem:** The stats use `font-display text-display-md` for the number and `font-mono text-[11px] text-[#857F74]/50` for the label. The label is at 50% opacity of secondary text — approximately #43403A. This is very close to the tertiary colour floor. The label is barely readable.

**The real issue:** These three numbers are the most commercially important data points on the entire site (`15+`, `90 days`, `R15,000`). They are the headline proof. They need more visual weight, not less. The current treatment — display type in primary white, floating label — is correct but generic. Compare this to how Vercel treats their product stats: large number, coloured supporting annotation, optional horizontal rule separation.

**What these stats could be:**
```
"15+" — the number is strong, but it needs context at a glance
"90 days" — reading as duration is only obvious if the label is legible
"R15,000" — the R prefix adds authenticity but the CountUp on currency risks looking like a loading error to first-time viewers
```

**The section label bug:** `text-[#857F74]` is used for the "The Entry Point" label. This is the secondary text colour, not tertiary. The DESIGN.md specifies section labels use DM Mono with `text-tertiary` (#4A4640). This is a minor deviation from system consistency.

**Net assessment:** The section works. The CountUp is an asset. The stat label legibility is a legitimate problem. The section label colour is off-spec.

---

### HowItWorksSection

**Current treatment:** `bg-[#111110]`, three step cards with border-l and hover state gold reveal.

**The gold violation (restating for section context):** Step numbers `01`, `02`, `03` are `text-gold`. These are static ordinal labels. This is the most visible Gold Rule violation because these numbers are permanently gold — they appear to every visitor. Three pieces of permanent gold decoration at small scale in mono font creates the exact "ambient decorative gold" that dilutes the CTA gold.

**The hover interaction design:** The gold left-bar reveal (`scale-y-0 → scale-y-100`) on hover is a strong micro-interaction. However it is attached to a `group` class on a `div` that contains a `cursor-default` cursor — so the hover behaviour exists but gives no affordance that it is interactive. This is a ghost interaction: feels intentional but provides no signal to the user.

**The step card structure:** `border-l border-[#242220] pl-5` as the vertical rule, with a 2px gold bar that reveals on hover. This is the right architectural pattern. The issue is the resting state — the border-l is the only structural element, and at 1px in the border colour it reads thin and uncertain.

**The title treatment:** `— {step.title}` with an em-dash prefix. This is a typographic choice that suggests editorial prose more than product UI. It reads slightly affected. The em-dash is doing nothing except adding character count.

**Net assessment:** The conceptual framework (three phases, numbered progression) is strong. The execution needs the gold removed from step numbers, the cursor affordance addressed, and the em-dash reconsidered.

---

### About Page

**Hero section:** `bg-[#080808]` with gold-line and h1. The gold-line usage here matches the hero section pattern — this is correct. However the about page h1 ("We are operators, not vendors.") is rendered without the entrance animation that the homepage hero has. It just appears. Every page after the homepage feels static by comparison.

**Founder section:** Competent but anonymous. `h2` for the name, a mono title, two body paragraphs, LinkedIn link. This is the correct structure but it is indistinguishable from ten thousand corporate bio sections. Top agency about pages (Wolff Olins, Collins, Ueno) differentiate their founder sections with: a distinctive typographic treatment for the name (sometimes larger, sometimes at an angle), a date or founding-year marker in tertiary mono, or a visual interruption in the layout.

The principal's name (`K.C. Viljoen`) is in `text-display-md` which is the h2 section headline size. For a name, this feels appropriate but generic. There is no visual signal that this is a person rather than a product feature.

**Philosophy section:** Four items in a 2-column grid with border-t dividers — identical treatment to the TrustSection. This creates a visual pattern that will feel repetitive across the site as users navigate.

**Net assessment:** Correct architecture, no visual personality. About pages for premium operator brands need one element of visual distinction — a typographic gesture, an unexpected scale relationship, a horizontal rule that bleeds. Currently the about page reads as a correctly formatted document, not a designed page.

---

### Services Page

**The section label violation:** `text-gold` on "The Entry Point" label (line 44). Section labels should be `text-tertiary`.

**The stat display:** Three stats (15+, 90 days, R15,000) are rendered statically without the CountUp from SprintSection. The SprintSection does it better. The services page stats are plain `font-display text-display-md` in `#F2EDE4`. No animation, no drama, no progression. This is a missed opportunity — these exact three numbers appear in both places and the animated version is definitively superior.

**The component list:** Five items in a `divide-y divide-[#242220]` list. The component number (01–05) is `text-gold` — the violation noted above. Remove the gold; use tertiary mono. The rest of the treatment is correct: number left, title + body right, generous `py-8`.

**The border-t stat row:** `flex flex-wrap gap-8 border-t border-[#242220] pt-10` separating stats from the intro. This is a strong structural move — the horizontal rule creates a visual cadence break. The only issue is that the stat labels are `text-tertiary` (#4A4640) which is correct here, but the services page hero section label was `text-gold` — inconsistency within the same page.

**Net assessment:** Structurally sound. Two gold violations. Missed opportunity on the stat animation. Clean list treatment for the five components.

---

### Contact Page

**Form treatment:** The form fields (`bg-transparent border border-[#242220]`) are the correct base treatment. Sharp corners, warm border, transparent fill. This is the right primitive.

**What's missing:**
1. Focus states: `focus:border-[#F2EDE4]/30` — this raises the border opacity on focus, which is correct but subtle. A focused field raises from `#242220` (solid) to `rgba(242,237,228,0.30)`. The difference is modest. Top-tier contact forms use `focus:border-[#F2EDE4]/50` or a full `focus:border-[#F2EDE4]/60` to clearly signal "you are here."
2. Label spacing: The `section-label` class on form labels (`YOUR NAME`, `CLINIC NAME`, etc.) is the right typographic choice — mono, tracked, tertiary. No issue.
3. The submit button uses inline styles (`style={{ background: '#C9922A', color: '#080808', border: '1px solid #C9922A' }}`). This is the only hardcoded inline style in the codebase and it bypasses the Button component's `variant="primary"` which already handles this. Should use the Button component.

**The Calendly placeholder:** `SectionWrapper className="bg-[#111110]"` with placeholder text. This entire section adds visual weight without delivering value. Until Calendly is live, this section should not exist or should be replaced with more specific contact information (response time promise, operating hours).

**Net assessment:** The form is nearly right. Three small issues: focus state intensity, inline style refactor, Calendly placeholder section. The form structure and field treatment is the best-executed form in the codebase.

---

### Navigation

**Transparent → frosted transition:** The nav transition from transparent to `rgba(8,8,8,0.92) + backdrop-blur-sm` at 50px scroll is correct and well-implemented. The threshold at 50px is slightly early — 80px matches better with standard viewport scroll feel.

**Active state:** White underline instead of gold — as noted, this is a spec divergence that is aesthetically correct. The underline at `h-px` is precise and clean.

**The nav CTA:** "Book a Call" in primary gold variant is the nav's only gold element. This is correct.

**Brand width issue:** The nav uses `max-w-site` (1200px) with `lg:px-16` padding. The hero uses the same. Alignment is consistent.

**Net assessment:** Nav is the cleanest component in the codebase. No violations, strong implementation, one small threshold adjustment.

---

## Top 5 Implementation Picks (ranked by visual impact)

### 1. Fix the Gold Rule violations — HowItWorksSection step numbers + services page labels
**Impact: High | Effort: 5 minutes**

Change `text-gold` to `text-[#4A4640]` on:
- HowItWorksSection.tsx line 64: `{step.number}` mono label
- services/page.tsx line 81: component number labels
- services/page.tsx line 44: "The Entry Point" section label

This is the single change that most improves *system coherence*. The hero CTA and active states will immediately feel more significant when gold no longer appears on decorative ordinals. The existing hover reveal on the step cards already uses gold correctly — that stays.

---

### 2. Raise grain opacity from 2.5% to 4.5%
**Impact: High | Effort: 2 minutes**

In globals.css, change:
```css
opacity: 0.025;
```
to:
```css
opacity: 0.045;
```

This is the fastest atmospheric upgrade available. Grain at 4.5% on #080808 shifts the page from "clean dark" to "textured operator dark." It is the visual equivalent of moving from matte black plastic to brushed aluminium — same darkness, different materiality.

---

### 3. Reposition and intensify the hero bloom
**Impact: High | Effort: 5 minutes**

In HeroSection.tsx, change:
```css
radial-gradient(ellipse 60% 45% at -5% -15%, rgba(201, 146, 42, 0.06) 0%, transparent 55%)
```
to:
```css
radial-gradient(ellipse 80% 60% at 15% 30%, rgba(201, 146, 42, 0.10) 0%, transparent 65%)
```

This moves the bloom centre behind the headline zone and raises it from imperceptible (6%) to present (10%). The hero will immediately read as atmospheric rather than clinical.

---

### 4. Add shadow depth to hero metric cards
**Impact: Medium | Effort: 5 minutes**

In HeroSection.tsx, add to each metric card's style:
```
boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(242,237,228,0.05)'
```

The drop shadow creates the floating/elevated reading. The inset top edge simulates ambient light. These two values together shift the cards from wireframe rectangles to product UI elements.

---

### 5. Raise grid and ghost "01" opacity to legible threshold
**Impact: Medium | Effort: 3 minutes**

In HeroSection.tsx:
- Grid: `strokeOpacity="0.04"` → `strokeOpacity="0.07"`
- Ghost "01": `text-[#F2EDE4]/[0.025]` → `text-[#F2EDE4]/[0.04]`

At these values, both elements are still atmospheric background texture rather than foreground elements — but they cross the threshold from "invisible on most displays" to "present on all displays." The grid becomes the stage. The "01" becomes a structural signal.

---

## What I Would Do If Starting Fresh

*Unconstrained — the ideal visual language for this brand.*

### The Problem with the Current System

The current system is correctly conceived for a 2023–2024 premium dark aesthetic. Linear, Vercel, Resend, Raycast — this is the design vocabulary of developer tooling and SaaS infrastructure. IGC's actual audience is *clinic owners* — healthcare operators, often doctors, who are not developers. They are not navigating Linear's dashboard. They understand luxury and precision, but through the lens of medical-grade equipment, Montblanc pens, and Emirates Business Class. The developer-tool dark aesthetic is a correct *reference* but may not be the most effective signal for *this specific buyer*.

### New Colour Palette

**Base:** Move from neutral #080808 to a genuinely warm dark — something in the `#0A0806` range (R:10 G:8 B:6, strong warm bias). This is the base black of fine leather and aged tobacco. Nothing in current premium-dark sites occupies this territory because it is considered "too brown." That is exactly why it is premium for this brand. It is unmistakably warm without being orange.

**Surface alternation:** `#141210` → `#0F0D0B`. Same delta, but both surfaces carry the warm bias. The warmth is *structural*, not just decorative.

**New gold:** `#D4A030` — shift the existing #C9922A approximately 8° cooler (toward yellow-gold) and raise lightness 6 points. This exits "amber-bronze" territory and enters "22-carat gold" territory. The difference is whether the accent reads as precious or as patina. At the R15,000 price point, you want precious.

**Text adjustment:** `#F5F0E8` instead of #F2EDE4 — very slightly brighter warm white. At very dark backgrounds, the 3-unit difference is perceptible and gives the body copy slightly more authority.

### New Background Treatment

**Abandon the corner bloom. Use a floor bloom.**

Instead of a top-left gradient, use a radial glow that rises from below — a warmth source beneath the fold, bleeding upward. This is the treatment used by high-end watchmaker sites (IWC, Jaeger-LeCoultre) and by architecture firms' digital portfolios. It implies depth, as if the content is lit from underneath.

```css
/* Primary atmospheric layer */
radial-gradient(ellipse 90% 70% at 50% 100%, rgba(212,160,48,0.08) 0%, transparent 60%)
```

This bloom sits at the bottom of the viewport, centred, bleeding upward — the warmth of a desk lamp. The headline and CTAs are above the bloom source, in the "lit area." This is the opposite of the current implementation and creates a fundamentally different atmospheric reading.

**Add a second, complementary cool-dark bloom at top-right:**
```css
radial-gradient(ellipse 50% 40% at 100% 0%, rgba(30,25,20,0.6) 0%, transparent 60%)
```
A deep shadow in the opposing corner creates visual three-dimensionality. The page appears to have a light source.

### New Card Surface System

Abandon the flat rectangular card entirely in favour of a **bordered panel with inner-glow treatment**:

```
background:     rgba(20, 18, 16, 0.7)     — slightly transparent so grain shows through
border:         1px solid rgba(255,255,255,0.08) on top and left, rgba(0,0,0,0.5) on bottom and right
box-shadow:     0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)
```

The asymmetric border — lighter on top/left, invisible on bottom/right — simulates directional lighting. The semi-transparent background allows the grain layer to remain visible inside cards, maintaining textural continuity. This is the card treatment used by premium finance dashboards and is distinctly different from the uniform-border treatment of developer tools.

### New Section Differentiation

Instead of alternating two background values, use **three zone types:**

1. **Void zone** (#0A0806): Sections that make bold statements. Hero, key proof sections. Maximum atmospheric treatment.

2. **Structured zone** (`#141210` + horizontal 1px rules at section boundaries): Sections with organized information. Services list, how it works. The structure is visual, not just background.

3. **Material zone** (`#141210` with a 15% opacity version of the grain at reduced frequency, giving a slightly different texture): CTA sections, contact, closers. The slightly coarser texture signals "tangible" — action territory.

### The One Element That Would Fundamentally Change This Site

**A running vertical line.**

A 1px warm-white line at 5% opacity, running the full height of the page at approximately the 55% horizontal mark — the boundary between the text zone and the right-side visual zone. This is the architectural gesture that distinguishes a designed page from a laid-out page. It exists on every screen but is never the subject of attention. It creates the sense that the page has *structure* — not just content.

No top-tier agency site does this because it is extremely easy to get wrong (too dark and it vanishes, too light and it dominates). At exactly 5% warm white, it is present only to those looking for it — which is precisely the level of detail that makes a clinic owner think: *"These people care about precision."*

---

*End of Audit — Agent 3: Visual Atmosphere & Dark Aesthetic*
