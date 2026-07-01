# Design Coherence Report — Portal vs Website
**Date:** 2026-04-10  
**Auditors:** 3 parallel agents (visual language · typography/components · motion/interaction/voice)  
**Canon:** Website (main marketing site)  
**Audit target:** Client portal (`/components/portal/`, `/app/portal/`)

---

## Executive Summary

Three audit domains covered 28 total findings. The portal was built in a separate sprint and drifted in four material ways:

1. **Gold was used atmospherically** — the site's foundational rule (gold = crisp element only) was broken with glowing/pulsing animations and atmospheric fills.
2. **`font-playfair` used throughout** instead of `font-display` (Cormorant Garamond), creating a different typographic personality.
3. **Raw Tailwind type scale** (`text-xl`, `text-4xl`) instead of canonical scale classes (`text-display-sm`, `text-display-lg`).
4. **Animation pattern diverged** — `whileInView` shorthand instead of the `useInView` hook, bypassing the `-80px` margin timing and prefers-reduced-motion compliance.

Everything else (color palette, brand voice, border system, surface hierarchy) is largely coherent with small fixes needed.

---

## CRITICAL — Fix before shipping

### C-01: Gold atmospheric use in portal
**Files:** `Sidebar.tsx:58`, `DashboardHeader.tsx:51`, `ConfidenceSignals.tsx:24`, `UpcomingSection.tsx:39`  
**Issue:** Active nav indicator uses gold box-shadow `rgba(207,155,46,0.4)` with `animate-glow-pulse`. Status dot also pulses gold. UpcomingSection header uses `bg-[rgba(207,155,46,0.02)]`. ConfidenceSignals applies gold `text-shadow`.  
**Canon:** Gold = crisp design elements only (borders, ordinals, text). Never atmospheric/glowing. Atmospheric layer is `rgba(242,237,228,0.03–0.05)` warm-white only.  
**Fix:**
- Remove `animate-glow-pulse` from active nav indicator and status dot
- Replace gold box-shadow on nav with crisp gold left-border: `border-l-2 border-[#CF9B2E]`
- Replace gold text-shadows on signal cards with nothing (crisp color is sufficient)
- Replace `bg-[rgba(207,155,46,0.02)]` in UpcomingSection with `bg-[rgba(242,237,228,0.02)]`

---

### C-02: Non-canonical border color `#242220`
**Files:** `Sidebar.tsx:34`, `DashboardHeader.tsx:36`, `PipelineSection.tsx:66`, `CommitmentsSection.tsx:19`, `ActivityFeed.tsx:30`, `UpcomingSection.tsx:37`, `UpdateLogModal.tsx:70`, `MessageComposer.tsx:40`  
**Issue:** `border-[#242220]` used pervasively. Not in the canonical palette.  
**Canon:** `#2D2A27` (dark border), `#302D2A` (mid border). Modal gold border: `#CF9B2E/20` not `/25`.  
**Fix:** Global replace `#242220` → `#2D2A27`. Change modal `#CF9B2E/25` → `#CF9B2E/20`.

---

### C-03: `font-playfair` instead of `font-display`
**Files:** `Sidebar.tsx:36`, `DashboardHeader.tsx:38–41`, `PipelineSection.tsx:68`, `CommitmentsSection.tsx:21`, `ActivityFeed.tsx:32`, `UpcomingSection.tsx:40`, `ConfidenceSignals.tsx:20`  
**Issue:** All portal section headings and the dashboard greeting use `font-playfair`. Website uses `font-display` (Cormorant Garamond) exclusively for headings and large numerals.  
**Canon:** `font-display` = Cormorant Garamond. One typeface system across both surfaces.  
**Fix:** Replace all `font-playfair` with `font-display`. Verify `tailwind.config.ts` maps `font-display` to Cormorant Garamond and not Playfair (if it currently maps to Playfair, that's the root fix).

---

### C-04: Raw Tailwind type scale instead of canonical scale classes
**Files:** `Sidebar.tsx:36` (`text-2xl`), `DashboardHeader.tsx:38` (`text-4xl`), `DashboardHeader.tsx:41` (`text-xl`), `PipelineSection.tsx:68` (`text-xl`), `CommitmentsSection.tsx:21` (`text-xl`), `ActivityFeed.tsx:32` (`text-xl`), `UpcomingSection.tsx:40` (`text-xl`), `ConfidenceSignals.tsx:20` (`text-4xl`)  
**Canon:** `text-display-xl/lg/md/sm`, `text-body-lg/md` — all defined in `globals.css:39–46`.  
**Fix mapping:**
- `text-4xl` → `text-display-lg`
- `text-2xl` → `text-display-sm`
- `text-xl` → `text-display-sm` (section headers) or `text-body-lg` (body-adjacent)

---

### C-05: `whileInView` instead of `useInView` hook pattern
**Files:** `PipelineSection.tsx:82–87`, `CommitmentsSection.tsx:23–28`, `ActivityFeed.tsx:34–39`, `UpcomingSection.tsx:44`  
**Issue:** `whileInView="visible" viewport={{ once: true }}` used directly. Bypasses the `-80px` margin that controls animation trigger timing, and doesn't follow the established hook pattern.  
**Canon:**
```tsx
const ref = useRef(null)
const inView = useInView(ref, { once: true, margin: '-80px' })
<motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
```
**Fix:** Refactor all four sections to the hook pattern. Add `ref` and `inView` per existing website sections.

---

### C-06: Missing `prefers-reduced-motion` in `useCountUp`
**Files:** `hooks/useCountUp.ts` (used in `ConfidenceSignals.tsx:43–47`)  
**Issue:** `useCountUp` hook animates numbers without checking `prefers-reduced-motion`. WCAG 2.1 Level A violation.  
**Canon:** `SprintSection.tsx CountUp` (line 29–32) checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and jumps to final value immediately.  
**Fix:**
```typescript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setCount(target)
  return
}
```

---

### C-07: Section label pattern not followed
**Files:** `Sidebar.tsx:69`, `PipelineSection.tsx:44`, `ActivityFeed.tsx:31`, `ReferencePicker.tsx:44`  
**Issue:** Custom mono label styles (`text-[10px] tracking-widest`, `tracking-wider`) instead of canonical `.section-label` class. `tracking-widest` and `tracking-wider` deviate from the canonical `0.14em`.  
**Canon:** `.section-label` — `font-mono`, `font-size: 0.75rem`, `font-weight: 500`, `letter-spacing: 0.14em`, `uppercase`, `color: #A09890`.  
**Fix:** Use `className="section-label"` on portal section headers. For metadata labels that shouldn't carry the gold color, use: `font-mono text-[11px] tracking-[0.14em] uppercase text-[#A09890]`.

---

## MODERATE — High priority refinements

### M-01: `#C9922A` non-canonical gold
**Files:** `MessageComposer.tsx:65`, `MessageComposer.tsx:81`, `ReferenceCard.tsx:17–18`  
**Fix:** Replace `#C9922A` → `#CF9B2E` globally.

---

### M-02: Sidebar surface elevation `#0A0A09`
**File:** `Sidebar.tsx:34`  
**Issue:** `bg-[#0A0A09]` is not in the canonical palette.  
**Canon:** Palette defines `surface-soft: #0D0D0C`.  
**Fix:** Change to `bg-[#0D0D0C]` (or use the `bg-surface-soft` token if defined in Tailwind config).

---

### M-03: Custom button styles instead of shared `Button` component
**Files:** `MessageComposer.tsx:61–70` (Reference button), `MessageComposer.tsx:78–84` (Send button), `Sidebar.tsx:95–101` (Sign out)  
**Fix:** Replace with:
```tsx
<Button variant="ghost" size="sm">Reference</Button>
<Button variant="primary" size="sm" onClick={handleSend}>Send</Button>
<Button variant="ghost" size="sm">Sign out</Button>
```

---

### M-04: Focus ring inconsistency
**Files:** `Sidebar.tsx:54`, `UpdateLogModal.tsx:78`, `MessageComposer.tsx:66`  
**Issue:** Portal uses `ring-1 ring-[#CF9B2E]/50`. Canon uses `ring-2 ring-[#CF9B2E]` (full opacity).  
**Fix:** Standardize to `focus-visible:ring-2 focus-visible:ring-[#CF9B2E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`.

---

### M-05: Ease curve divergence in portal transitions
**Files:** `PipelineSection.tsx:42` (`ease-out duration-700`), `CommitmentsSection.tsx`, `ActivityFeed.tsx`, `UpcomingSection.tsx`  
**Issue:** Tailwind default `ease-out` ≈ `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Website uses `[0.16, 1, 0.3, 1]` (decelerate-in). Portal feels springier/snappier; website feels weighted.  
**Fix:** For Framer Motion-driven transitions, pass `ease: [0.16, 1, 0.3, 1]`. For CSS-only transitions where Framer isn't used, `ease-[cubic-bezier(0.16,1,0.3,1)]` via arbitrary Tailwind value.  
Also: change `duration-700` → `duration-600` to align with `fadeUp`'s 0.6s.

---

### M-06: Modal backdrop too fast
**File:** `UpdateLogModal.tsx:56`  
**Issue:** Backdrop at 200ms; modal body at 250ms. Feels disconnected.  
**Fix:** Align backdrop to `duration: 0.3` with `ease: [0.16, 1, 0.3, 1]`.

---

### M-07: Missing atmospheric depth on portal cards
**Files:** `PipelineSection.tsx`, `CommitmentsSection.tsx`, `ActivityFeed.tsx`, `ConfidenceSignals.tsx`  
**Issue:** All cards are flat `bg-[#111110]` with no atmospheric overlay. Website sections all carry a radial gradient atmospheric layer.  
**Fix (optional, evaluate visually):** Add to card/section containers:
```tsx
<div className="absolute inset-0 pointer-events-none rounded-inherit"
  style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(242,237,228,0.03) 0%, transparent 70%)' }}
  aria-hidden="true"
/>
```

---

## MINOR — Polish

| # | Issue | File | Fix |
|---|-------|------|-----|
| m-01 | `terminal-cursor` class — verify prefers-reduced-motion compliance | `ActivityFeed.tsx:46`, `ConfidenceSignals.tsx:100` | Add `prefers-reduced-motion: reduce` guard to the CSS animation |
| m-02 | Sidebar nav transition 200ms (too fast vs website's 350ms range) | `Sidebar.tsx:51` | Change `duration-200` → `duration-300` |
| m-03 | Commitment status indicators: text spans vs SVG icons | `CommitmentsSection.tsx:57–64` | Consider SVG circles for visual fidelity |
| m-04 | Font weights on headings: `font-bold`/`font-semibold` not mapped to explicit values | `Sidebar.tsx:36`, `DashboardHeader.tsx:38` | Use `font-medium` (500) or `font-semibold` (600) per the loaded Inter weights |
| m-05 | Gold-line decorator absent from portal section headers | Multiple | Evaluate adding `<span className="gold-line" />` above section labels in portal for visual thread continuity |

---

## Coherent — No action needed

- Primary/mid/secondary/tertiary text colors: `#F2EDE4`, `#C5C0BB`, `#A09890`, `#857F74` — ✓
- Signal colors: `#3D8B5E` (nominal), `#CF9B2E` (watch), `#B84233` (critical) — ✓
- Background foundations: `#080808` layout, `#111110` surfaces — ✓
- Brand voice: Operator tone, declarative copy, short statements — ✓
- Number-as-proof pattern: Display font numerals + mono label — ✓
- `font-sans` (Inter) for body — ✓
- `font-mono` (JetBrains Mono) for metadata — ✓
- Gold borders (`#CF9B2E/15–20`) used correctly on callout cards — ✓
- UpdateLogModal ease: correctly uses `[0.16, 1, 0.3, 1]` — ✓
- `stagger`/`fadeUp` variants imported from `lib/motion` — ✓

---

## Finalization Plan

### Phase 1 — Critical blockers (implement together, ~2 hours)
1. **C-02 first**: Global find-replace `#242220` → `#2D2A27` (mechanical, low risk)
2. **C-01**: Strip all gold atmospheric/glow effects; replace with crisp borders
3. **C-03 + C-04**: Font family and type scale (likely one sweep per portal component)
4. **C-05 + C-06**: Animation pattern refactor (useInView hook) + prefers-reduced-motion in useCountUp
5. **C-07**: Section label standardization

### Phase 2 — Moderate polish (~1 hour)
6. **M-01**: `#C9922A` → `#CF9B2E` global replace
7. **M-02**: Sidebar surface color fix
8. **M-03**: Button component adoption
9. **M-04**: Focus ring standardization
10. **M-05 + M-06**: Ease curve and duration alignment

### Phase 3 — Evaluate (no commitment)
- M-07: Atmospheric depth on cards (visual check first)
- m-05: Gold-line in portal headers (may feel too marketing-ish in a product UI)

---

## Portal Patterns Worth Considering for Website

- **Left-border urgency coding** (`PipelineSection.tsx:92–96`): Red/gold/transparent left border for time-sensitive rows. Clean, scannable. Website could use for any time-indexed content.
- **"Live · {n}s ago" indicator** (`ConfidenceSignals.tsx:99`): Real-time recency signal. Website could adopt for live system status.
