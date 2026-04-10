# Portal Spatial Craft & Polish Audit

**Date:** 2026-04-10
**Scope:** Pixel-level review of portal dashboard components
**Method:** Static code audit across all portal components

---

## 1. Padding Consistency

### Section headers
All four main cards (Pipeline, Commitments, Activity, Upcoming) use **`px-6 py-5`** for their header `<div>`. Consistent.

### Card body rows
| Component | Row padding | Issue |
|---|---|---|
| PipelineSection | `px-6 py-5` | -- |
| CommitmentsSection | `px-6 py-5` | -- |
| ActivityFeed | `px-6 py-5` | -- |
| **UpcomingSection** | **`px-6 py-4`** | **Inconsistent** |

**Finding:** UpcomingSection rows use `py-4` (16px) while every other card uses `py-5` (20px). This creates a subtle but perceptible density difference in one card.

**Fix:** `UpcomingSection.tsx` line 51 -- change `py-4` to `py-5`
**Upside:** HIGH -- one-token fix that unifies the entire card system's vertical rhythm.

### Confidence signal cards
SignalCard uses `px-6 py-6` (24px all around). This is intentionally more generous than row-based cards. Correct -- these are standalone metric tiles, not list rows.

### DashboardHeader
Uses `px-8 py-8`. This is the outermost section so larger padding makes sense as a hierarchy signal.

### ConfidenceSignals grid
Uses `px-8 py-8`. Matches header. Consistent.

---

## 2. Divider System

There are **four distinct divider color values** across the portal:

| Value | Where used |
|---|---|
| `border-[#242220]` | Sidebar top border-b, sidebar sign-out border-t, DashboardHeader border-b, all card header border-b, Pipeline/Commitments/Activity `divide-y` |
| `border-[#1A1918]` | Sidebar health panel border-t, Pipeline stage coordinate bar border-b, UpcomingSection row `border-b`, UpdateLogModal history rows `border-b` |
| `border-[#1E1C1A]` | UpdateLogModal header border-b, UpdateLogModal footer border-t, UpcomingSection header border-b |
| `border-[#CF9B2E]/15` or `/25` or `/30` | Accent borders on UpcomingSection outer, UpdateLogModal outer, UpdateLogBadge |

**Analysis:**

The first three values (`#242220`, `#1A1918`, `#1E1C1A`) are all within 8 hex steps of each other. This creates a "looks almost the same but not quite" problem -- the kind of thing that reads as inconsistency rather than intentional hierarchy.

**Proposed simplification:** Two-tier system:
- **Primary divider** (between sections, card headers): `#242220` -- keep as-is
- **Secondary divider** (within-card rows, subtle separators): `#1A1918` -- merge `#1E1C1A` into this

**Specific fixes:**
- `UpcomingSection.tsx` line 39: `border-b border-[#1E1C1A]` -> `border-b border-[#1A1918]`
- `UpdateLogModal.tsx` line 66: `border-b border-[#1E1C1A]` -> `border-b border-[#1A1918]`
- `UpdateLogModal.tsx` line 113: `border-t border-[#1E1C1A]` -> `border-t border-[#1A1918]`

**Upside:** MEDIUM -- eliminates a phantom third tier that nobody can consciously see but subconsciously registers as noise.

---

## 3. Icon Quality

### Nav icons: `◈` (Dashboard) and `◎` (Messages)

These are Unicode geometric characters. Problems:

1. **Rendering varies by OS/font.** On macOS they render from Apple Color Emoji or system fallback -- they won't match the portal's monospace/serif aesthetic. On Windows or Linux, they may render as empty boxes or with entirely different proportions.
2. **Vertical alignment.** The icons sit inside `<span className="text-base w-5">` -- a 20px-wide box at 16px font size. Unicode geometric characters often have irregular baselines and don't vertically center the same way SVG would. The `items-center` on the parent flex helps but the optical center of `◈` and `◎` differs from their bounding box center.
3. **Active state.** The active link gets `text-[#CF9B2E]` which colors the entire text including the icon. This works but the icon doesn't get any weight/scale change, so the active state signal comes entirely from color + the left bar.

**Proposed fix:** Replace with inline SVGs (16x16) using `currentColor`. This gives:
- Pixel-perfect cross-platform rendering
- True optical vertical centering
- Ability to adjust stroke width for active state (e.g., `strokeWidth={1.5}` default, `strokeWidth={2}` active)

**Upside:** HIGH -- eliminates a cross-platform rendering lottery. The nav is seen on every page load.

### Sign-out arrow: `→`
Same issue but lower stakes since it's a secondary action. Still worth replacing with an SVG chevron-right or arrow-right-from-bracket icon.

**Upside:** LOW for sign-out specifically.

---

## 4. Progress Bar (PipelineSection)

### Bar height: `h-1.5` (6px)
This is appropriate. Thin enough to feel like a data visualization element rather than a UI control, thick enough to read the fill color clearly.

### Pulsing head dot: `w-2.5 h-2.5` (10px)
The dot is 10px on a 6px bar -- 1.67x ratio. This is correct. The dot needs to visually "break out" of the bar to draw attention to the current position.

### Connection between fill and dot
The dot is positioned at `left: calc(${progressPercent}% - 5px)`. The fill is `width: ${progressPercent}%`. Because the fill has `rounded-full` and the dot is offset by half its width (5px), there is a **sub-pixel gap** at certain percentages where the rounded end of the fill doesn't quite meet the edge of the dot.

**Fix:** Add a 1px negative margin or position the dot at `calc(${progressPercent}% - 6px)` to ensure overlap.

```tsx
// PipelineSection.tsx line 49
style={{ left: `calc(${progressPercent}% - 6px)` }}
```

**Upside:** MEDIUM -- at most percentages it looks fine, but at ~33% and ~50% a hairline gap can appear.

### The `animate-ping` on the dot
`animate-ping` uses `transform: scale(2)` with `opacity: 0`. On a 10px element this creates a 20px pulse ring. This might be slightly aggressive for a data row. Consider a custom animation with `scale(1.6)` instead.

**Upside:** LOW -- subtle preference.

---

## 5. Sidebar Width

### `w-56` (224px)

**Content audit:**
- Logo "IGC" + "Client Portal" + time + timezone: fits comfortably
- Nav items "Dashboard" and "Messages": ~80px text, plenty of room
- Health panel labels ("Pipeline", "Commits", "Activity"): 7 chars max, fits in `w-12`
- Health bar segments: 5 x 6px + 4 x 2px gaps = 38px -- fits easily

**Assessment:** 224px is slightly generous for the current content density. The nav items have ~100px of unused space to the right. However, this creates a comfortable, unhurried feel appropriate for a premium dashboard. Reducing to `w-48` (192px) would feel cramped. **Keep as-is.**

The `px-5` on the logo area and `px-2` on the nav create a subtle misalignment -- the logo area has 20px left padding while nav items have 8px (container) + 12px (item) = 20px. This actually works out to be aligned. Good.

**Upside:** N/A -- no change needed.

---

## 6. Card Border Radius Hierarchy

| Element | Radius | Tailwind | Actual px |
|---|---|---|---|
| Main section cards | `rounded-2xl` | 16px | Correct |
| Signal cards | `rounded-xl` | 12px | Correct |
| UpdateLogBadge button | `rounded-lg` | 8px | Correct |
| UpdateLogModal | `rounded-2xl` | 16px | Correct (modal = card-level) |
| Nav items | `rounded-lg` | 8px | Correct |
| Health bar segments | `rounded-sm` | 2px | Correct |

**Assessment:** This is a clean 3-tier system: 16px (containers), 12px (tiles), 8px (interactive elements). The hierarchy is intentional and consistent. The modal matching card radius is correct since it's a card-level surface.

**Upside:** N/A -- well-designed, no change needed.

---

## 7. DashboardHeader Layout

### Two-column layout: left (greeting/meta) + right (update badge)
Uses `flex items-start justify-between gap-6`.

**Potential issues:**
1. **Narrow viewports.** The left column contains a `text-4xl` italic greeting that can run long ("Good afternoon, Christopher."). The right column's UpdateLogBadge has `flex-shrink-0`. On viewports below ~700px (which would be the main content area width, since sidebar takes 224px), the greeting text will compress but the badge won't. This could cause the greeting to wrap awkwardly.
2. **`gap-6` (24px).** With the badge being `flex-shrink-0`, this gap is the minimum breathing room. 24px is adequate.
3. **`items-start`** is correct -- the badge should top-align, not center-align against the multi-line left column.

**Fix:** Add `min-w-0` to the left column `<div>` to allow text truncation if needed, and consider `flex-wrap` on the container for very narrow viewports.

```tsx
// DashboardHeader.tsx line 36
<div className="border-b border-[#242220] px-8 py-8 flex items-start justify-between gap-6 flex-wrap">
  <div className="min-w-0">
```

**Upside:** MEDIUM -- defensive fix for edge-case viewport widths.

---

## 8. Confidence Signals Grid

### `grid-cols-2 lg:grid-cols-4`

With the sidebar at 224px, the main content area on a 1440px screen is ~1216px. At `lg` breakpoint (1024px total viewport), the content area is ~800px. Four columns at 800px = ~188px per card (minus 12px gaps). The signal cards contain `text-4xl` mono values like "3 candidates" or "2 of 3 delivered" -- these can run 180px+ wide.

**Issue:** At exactly the `lg` breakpoint, 4-column signal cards may feel tight. The value text could wrap.

**Missing breakpoint:** There is no `md` rule. From 768px to 1023px (total viewport), the layout stays at 2 columns. Content area at 768px = ~544px, so 2 columns at ~260px each. This actually works well.

**The real gap:** Between 1024px and ~1200px total, the 4-column layout with sidebar feels compressed.

**Fix:** Change to `grid-cols-2 xl:grid-cols-4` (breakpoint at 1280px instead of 1024px).

```tsx
// ConfidenceSignals.tsx line 57
<div className="grid grid-cols-2 xl:grid-cols-4 gap-4 px-8 py-8">
```

**Upside:** MEDIUM -- prevents signal cards from looking cramped on common 13" laptop screens.

---

## 9. Dividers vs Spacing

### Section separation strategy

The dashboard page uses `space-y-4` to separate the four main cards (Pipeline, Commitments, Upcoming, Activity). These cards all use `mx-8` for horizontal margin. There are no border dividers between sections -- only spacing.

**Above** the cards:
- DashboardHeader has `border-b border-[#242220]` -- correct, this is a structural divider
- ConfidenceSignals has no bottom border -- it flows into the card section via spacing alone

**Assessment:** The absence of borders between cards is correct. Each card has its own `border border-[#242220]` outline, so adding dividers between them would create visual noise. The spacing-only approach is the right call.

**One inconsistency:** UpcomingSection uses `border-[#CF9B2E]/15` as its outer card border instead of `border-[#242220]`. This gives it a warm gold tint. If this is intentional (to signal "this section needs your attention"), it should be documented or made conditional. If it's always gold, it loses its signal value.

**Upside:** LOW -- the gold border on UpcomingSection is a design decision, not a bug.

---

## 10. Sidebar Health Panel Bar Segments

### Segment size: `w-1.5 h-3 rounded-sm` (6px x 12px, 2px radius)
### Gap: `gap-0.5` (2px)
### Total bar width: 5 * 6px + 4 * 2px = 38px

**Assessment:**
- The 2:1 height-to-width ratio creates a nice vertical pill shape
- 5 segments is a standard Likert-scale visualization
- At 38px total width, the bars are proportional to the sidebar's `w-56` (224px)
- The `rounded-sm` at 2px radius on a 6px-wide element creates a subtle rounding -- visible but not circular. Correct.

**One issue:** The gap between segments (`gap-0.5` = 2px) is the minimum Tailwind unit. At 2px, adjacent filled segments can visually merge on non-retina displays.

**Fix:** Change to `gap-1` (4px) for clearer segment separation.

```tsx
// Sidebar.tsx line 84
<div className="flex gap-1">
```

**Upside:** LOW -- only affects non-retina displays, and the current gap works on retina.

---

## 11. UpdateLogModal Width

### `max-w-md` (448px)

**Content audit:**
- Header: date string (~"Wednesday, 15 January 2026" = ~280px at text-2xl) -- fits
- Description: 1-2 sentences at text-sm -- wraps naturally
- History rows: date (w-22 = 88px) + dot + entry text. Entry text gets ~330px.
- Footer: single line of small text -- fits

**Assessment:** 448px is well-sized. Going wider (max-w-lg = 512px) would create uncomfortably long line lengths for the text-sm content. Going narrower (max-w-sm = 384px) would compress the history entries too much.

**Note:** `w-22` on the date column (line 100) is not a standard Tailwind class. Tailwind v4 does support arbitrary values but `w-22` resolves to 88px (5.5rem). This works but is an unusual choice. `w-20` (80px) or `w-24` (96px) would be standard. Since dates are formatted as "2026-01-15" (10 chars at ~7px each in mono 11px = ~70px), `w-20` would suffice.

**Fix:**
```tsx
// UpdateLogModal.tsx line 100
// w-22 -> w-20
<span className="text-[11px] font-mono text-[#6E6762] flex-shrink-0 w-20 pt-0.5 tabular-nums">
```

**Upside:** LOW -- cosmetic, reduces a non-standard value.

---

## 12. Overflow and Scrolling

### Main content area
The layout uses `<main className="flex-1 overflow-auto ...">`. This means the entire main area scrolls. Good.

### Pipeline candidates
PipelineSection renders all candidates without any max-height or virtual scrolling. With 10+ candidates, the card becomes very tall. There is no `max-h` or `overflow-y-auto` on the candidate list.

**Assessment:** For a typical client portal with 3-8 candidates, this is fine. If the dataset could grow to 15+, consider adding `max-h-[600px] overflow-y-auto` to the candidate list container.

**Fix (defensive):**
```tsx
// PipelineSection.tsx line 82-86
<motion.div
  variants={stagger}
  initial="hidden"
  animate="visible"
  className="divide-y divide-[#242220] max-h-[600px] overflow-y-auto"
>
```

**Upside:** LOW -- unlikely to be needed with current data volumes, but defensive.

### Activity feed
Same pattern -- no max-height. ActivityFeed shows all entries. Same recommendation applies if the log grows.

---

## 13. Active Pipeline Row Left Border

### `border-l-2 border-[#B84233]` (stale) or `border-[#CF9B2E]/50` (warning)

**Interaction with row padding:** The row has `px-6` (24px left padding). When `border-l-2` is added, Tailwind adds a 2px left border. This does NOT reduce the padding -- the border is added outside the padding box. So the total left inset goes from 24px to 26px, pushing the content 2px to the right compared to non-flagged rows.

**This is the issue.** Flagged rows have their content shifted 2px right relative to unflagged rows. The candidate name column and progress bar are misaligned between flagged and unflagged rows.

**Fix:** Apply `border-l-2 border-transparent` to all rows as a baseline, then override the color for flagged rows:

```tsx
// PipelineSection.tsx line 101
className={`px-6 py-5 flex items-center gap-4 hover:bg-[#15140F] transition-colors duration-200 border-l-2 ${
  daysSince >= 8
    ? "border-[#B84233]"
    : daysSince >= 4
    ? "border-[#CF9B2E]/50"
    : "border-transparent"
}`}
```

**Apply the same pattern to CommitmentsSection.tsx line 50.**

**Upside:** HIGH -- this is a visible alignment bug. When you have a mix of flagged and unflagged rows, the 2px content shift creates a jagged left edge that looks broken.

---

## 14. PortalCursor Ring

### Size: 36px, border `rgba(201, 146, 42, 0.2)`
### Easing: `0.08` lerp factor (smooth lag)

**Assessment:**
- 36px diameter is appropriate -- large enough to be visible as an aura, small enough not to obscure content
- The 0.08 lerp creates a ~180ms effective lag (reaches 90% in ~28 frames at 60fps). This is in the sweet spot -- laggy enough to feel floaty/premium, fast enough not to feel broken
- The 1px border at 0.2 opacity is very subtle. It reads as a gentle halo.

**Missing:** No scale-up on hover over interactive elements. The cursor ring stays 36px regardless of what it's over. Adding a scale-up (to 44px or 48px) when hovering over buttons, links, or clickable rows would add a polished interactive signal.

**Implementation sketch:**
```tsx
// PortalCursor.tsx -- add hover detection
function onMouseMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY
  const el = document.elementFromPoint(e.clientX, e.clientY)
  const isInteractive = el?.closest('a, button, [role="button"]')
  targetScale = isInteractive ? 1.33 : 1
}
```

Then animate `scale` alongside position using the same lerp.

**Upside:** MEDIUM -- adds a delightful micro-interaction but requires more code than a single-line fix.

---

## 15. Vertical Rhythm

### `space-y-4` (16px) between section cards

**Assessment:** 16px between cards that are each ~200-400px tall creates a tight, dense feel. The cards already have `border border-[#242220]` which creates clear boundaries, so less spacing is needed than borderless cards would require.

However, comparing to the header area which uses `py-8` (32px) and the signal grid which uses `py-8` (32px), the 16px inter-card spacing feels proportionally tight.

**Fix:** Change to `space-y-6` (24px).

```tsx
// app/portal/(app)/dashboard/page.tsx line 34
<div className="space-y-6">
```

**Upside:** MEDIUM -- 24px gives each card more breathing room and better matches the 32px vertical rhythm established by the header and signal grid.

---

## Summary: Prioritized Fix List

### HIGH upside (do first)

| # | Issue | File | Change |
|---|---|---|---|
| 1 | **Row left-border misalignment** | `PipelineSection.tsx`, `CommitmentsSection.tsx` | Add `border-l-2 border-transparent` baseline to all rows |
| 2 | **UpcomingSection row padding inconsistency** | `UpcomingSection.tsx` line 51 | `py-4` -> `py-5` |
| 3 | **Unicode nav icons** | `Sidebar.tsx` | Replace `◈` and `◎` with inline SVGs |

### MEDIUM upside (do next)

| # | Issue | File | Change |
|---|---|---|---|
| 4 | Divider color consolidation | UpcomingSection, UpdateLogModal | Merge `#1E1C1A` into `#1A1918` |
| 5 | Signal grid breakpoint | `ConfidenceSignals.tsx` | `lg:grid-cols-4` -> `xl:grid-cols-4` |
| 6 | Progress bar dot gap | `PipelineSection.tsx` line 49 | `- 5px` -> `- 6px` |
| 7 | Section vertical rhythm | `dashboard/page.tsx` line 34 | `space-y-4` -> `space-y-6` |
| 8 | DashboardHeader flex-wrap | `DashboardHeader.tsx` line 36 | Add `flex-wrap` and `min-w-0` |
| 9 | Cursor hover scale | `PortalCursor.tsx` | Add interactive element detection + scale animation |

### LOW upside (polish pass)

| # | Issue | File | Change |
|---|---|---|---|
| 10 | Health bar segment gap | `Sidebar.tsx` line 84 | `gap-0.5` -> `gap-1` |
| 11 | Modal date column width | `UpdateLogModal.tsx` line 100 | `w-22` -> `w-20` |
| 12 | Pipeline overflow guard | `PipelineSection.tsx` | Add `max-h-[600px] overflow-y-auto` |
| 13 | Ping animation scale | `PipelineSection.tsx` | Custom animation with `scale(1.6)` instead of `scale(2)` |
