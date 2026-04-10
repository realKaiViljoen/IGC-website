# Portal Interaction & Animation Audit

Audited: 2026-04-10
Files reviewed: Sidebar, DashboardHeader, ConfidenceSignals, PipelineSection, CommitmentsSection, ActivityFeed, UpcomingSection, UpdateLogModal, UpdateLogBadge, PortalCursor, motion.ts, globals.css, portal layout, dashboard page.

---

## 1. Hover States

### 1a. Sign-out button missing hover background
**Component:** `Sidebar.tsx`, line 101
**Issue:** The sign-out button has `hover:text-[#F2EDE4]` but no `hover:bg-[...]` — every other nav item has a background hover. This makes sign-out feel dead compared to the nav links above it.
**Fix:** Add `hover:bg-[rgba(242,237,228,0.04)] rounded-lg` to match the nav item pattern.
**Upside:** HIGH

### 1b. Commitment rows have no hover state
**Component:** `CommitmentsSection.tsx`, line 50
**Issue:** The `motion.div` for each commitment row has `transition-colors duration-200` but zero hover class. Pipeline rows and upcoming rows both have `hover:bg-[#15140F]`, so commitments feel inert by comparison.
**Fix:** Add `hover:bg-[#15140F]` to the row className.
**Upside:** HIGH

### 1c. Activity feed rows have no hover state
**Component:** `ActivityFeed.tsx`, line 30
**Issue:** Each `motion.div` row has no hover class at all. Every other list section (pipeline, upcoming) has `hover:bg-[#15140F]`. Inconsistency.
**Fix:** Add `hover:bg-[#15140F] transition-colors duration-200` to the row.
**Upside:** HIGH

### 1d. Confidence signal cards hover is subtle but present
**Component:** `ConfidenceSignals.tsx`, line 17
**Status:** Cards have `hover:bg-[#151413] hover:border-[#2E2B27]`. Good. No issue.

### 1e. Modal close button missing active/press feedback
**Component:** `UpdateLogModal.tsx`, line 71-79
**Issue:** The close `button` has hover color transition but no scale or active state. On a premium modal, the close button should feel tactile.
**Fix:** Add `active:scale-95` to the close button.
**Upside:** MEDIUM

---

## 2. Focus States

### 2a. No focus-visible rings anywhere in portal
**Component:** All portal components
**Issue:** None of the interactive elements (nav links, sign-out button, UpdateLogBadge button, modal close button) have `focus-visible:` styles. Keyboard navigation is invisible. This is both an accessibility gap and a polish gap.
**Fix:** Add a consistent focus ring utility across all interactive elements:
```
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CF9B2E]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0A09]
```
Apply to: sidebar nav links (Sidebar.tsx:52), sign-out button (Sidebar.tsx:99), UpdateLogBadge button (UpdateLogBadge.tsx:28), modal close button (UpdateLogModal.tsx:71).
**Upside:** HIGH (accessibility requirement, but also makes keyboard nav feel intentional and premium)

---

## 3. Active/Press States

### 3a. UpdateLogBadge button has no press state
**Component:** `UpdateLogBadge.tsx`, line 28
**Issue:** This is the most prominent interactive element in the header. It has a rich hover state with glow, but clicking it produces zero tactile feedback before the modal opens.
**Fix:** Add `active:scale-[0.98]` to the button className.
**Upside:** HIGH

### 3b. Sidebar nav links have no press state
**Component:** `Sidebar.tsx`, line 52
**Issue:** Clicking nav links has no press-down effect.
**Fix:** Add `active:scale-[0.98]` to the Link className.
**Upside:** MEDIUM

### 3c. Sign-out button has no press state
**Component:** `Sidebar.tsx`, line 99
**Fix:** Add `active:scale-[0.98]`.
**Upside:** LOW

---

## 4. Transition Timing

### 4a. Sidebar nav duplicates transition class
**Component:** `Sidebar.tsx`, line 55-58
**Issue:** The inactive branch adds `transition-all duration-200` while the parent string already contains `transition-all duration-200`. Both branches get the transition, but the inactive branch declares it twice. Harmless but sloppy.
**Fix:** Remove the duplicate `transition-all duration-200` from the inactive branch (line 58).
**Upside:** LOW (code cleanliness only)

### 4b. Engagement health bars could stagger on mount
**Component:** `Sidebar.tsx`, lines 77-95
**Issue:** The five indicator bars per row appear instantly. A stagger fill animation on first render (each bar filling left-to-right with ~80ms delay) would reinforce the "live data" feel of the portal.
**Fix:** Add a CSS animation or framer-motion stagger to the bar fill.
**Upside:** MEDIUM

### 4c. Stage progress bar transition is long at 700ms
**Component:** `PipelineSection.tsx`, line 42
**Issue:** `transition-all duration-700` on the stage bar fill. This fires on mount (initial render) which is fine, but if data ever updates dynamically, 700ms is sluggish. For a static render this is acceptable. Consider reducing to 500ms for snappier feel.
**Upside:** LOW

---

## 5. Animation Entry Sequence

### 5a. No orchestrated entry sequence -- everything races
**Component:** `app/portal/(app)/dashboard/page.tsx`
**Issue:** The dashboard page renders `DashboardHeader`, `ConfidenceSignals`, `PipelineSection`, `CommitmentsSection`, `UpcomingSection`, and `ActivityFeed` simultaneously. The stagger animations in Pipeline, Commitments, Activity, and Upcoming all use `initial="hidden" animate="visible"` (or `whileInView`), so they all start their stagger at the same time.

The greeting, signal cards, and all list sections animate simultaneously. There is no top-down cascade. On a premium dashboard, the expected sequence would be:
1. Header/greeting: instant or near-instant (0ms)
2. Confidence signal cards: stagger in (100ms delay)
3. Pipeline: stagger in (250ms delay)
4. Commitments: stagger in (350ms delay)
5. Upcoming / Activity: stagger in (450ms+)

**Fix:** Wrap each section in a `motion.div` with increasing `delay` values on the parent, or use `whileInView` with `viewport={{ once: true }}` to create a natural scroll-driven cascade. The simplest approach: add a `delayChildren` offset to each section's stagger variant by passing a custom variant per section.
**Upside:** HIGH (this is the single highest-impact animation change -- it transforms "everything pops in at once" into a deliberate reveal)

### 5b. DashboardHeader has no entry animation at all
**Component:** `DashboardHeader.tsx`
**Issue:** The greeting, company name, and engagement details appear instantly with no animation. This is the first thing the user sees. A simple fade-in (even 300ms) would make it feel intentional rather than abrupt.
**Fix:** Make DashboardHeader a client component wrapping content in `motion.div` with `fadeIn` variant.
**Upside:** MEDIUM

### 5c. ConfidenceSignals grid has no entry animation
**Component:** `ConfidenceSignals.tsx`
**Issue:** The four signal cards appear instantly. The count-up numbers animate, but the cards themselves pop in without any fade or stagger. Adding a stagger to the grid would complement the count-up nicely.
**Fix:** Wrap the grid in `motion.div` with `stagger` and each card in `motion.div` with `fadeUp`.
**Upside:** HIGH

---

## 6. PortalCursor

### 6a. Cursor visible at (0,0) before first mouse move
**Component:** `PortalCursor.tsx`, lines 9-10
**Issue:** `targetX`, `targetY`, `currentX`, `currentY` all initialize to `0`. The ring element starts at `translate(0px, 0px)` which is the top-left corner. The animation loop runs immediately, so on page load the cursor ring sits visibly in the top-left corner until the user moves the mouse.
**Fix:** Start with the cursor hidden (`opacity: 0`) and set opacity to 1 on the first `mousemove` event. Or initialize position off-screen.
```tsx
const [visible, setVisible] = useState(false)
// In onMouseMove: if (!visible) setVisible(true)
// On the div: style={{ opacity: visible ? 1 : 0 }}
```
Or more simply, track a `hasMoved` ref and set `opacity` via the ref in the animation loop.
**Upside:** HIGH (the ghost ring in the top-left corner on load is a visible defect)

### 6b. Lerp factor 0.08 is very slow
**Component:** `PortalCursor.tsx`, line 21
**Issue:** `0.08` means the ring takes ~40 frames to reach the cursor position. This creates a heavy, laggy trailing effect. For a subtle "soft follow" on a dashboard, `0.12-0.15` would feel more responsive while still being smooth. The current value makes it feel like the ring is stuck in molasses.
**Fix:** Increase lerp factor to `0.12` or `0.14`.
**Upside:** MEDIUM

### 6c. Cursor ring shows on touch devices
**Component:** `PortalCursor.tsx`
**Issue:** No media query or touch detection. On tablets, the ring will sit at (0,0) permanently since there are no `mousemove` events.
**Fix:** Either use a `@media (pointer: fine)` check or detect touch capability and don't render.
**Upside:** MEDIUM

---

## 7. Empty States

### 7a. PipelineSection returns null when empty
**Component:** `PipelineSection.tsx`, line 63
**Issue:** `if (pipeline.length === 0) return null` -- the entire section disappears. There is no empty state message like "No candidates in the pipeline yet." This creates an unexplained gap in the layout.
**Fix:** Return a styled empty state card with a message like "Pipeline clear -- candidates will appear here as sourcing begins."
**Upside:** MEDIUM

### 7b. CommitmentsSection returns null when empty
**Component:** `CommitmentsSection.tsx`, line 12
**Same issue as 7a.** Should show "No active commitments."
**Upside:** MEDIUM

### 7c. ActivityFeed returns null when empty
**Component:** `ActivityFeed.tsx`, line 12
**Same issue as 7a.** Should show "No activity recorded yet."
**Upside:** MEDIUM

### 7d. UpcomingSection returns null when empty
**Component:** `UpcomingSection.tsx`, line 29
**Same issue as 7a.**
**Upside:** LOW (upcoming is optional, null is more acceptable here)

---

## 8. Loading States / Count-Up Timing

### 8a. Count-up animations start immediately on mount
**Component:** `ConfidenceSignals.tsx`, lines 32-36
**Issue:** `useCountUp` fires on mount with durations of 500-900ms. Since there is no entry animation on the signal cards (finding 5c), the numbers start counting before the user has oriented to the page. If finding 5a is implemented (staggered entry), the count-ups should start *after* the cards become visible, not on mount.
**Fix:** Add a delay parameter to `useCountUp` that matches the card's entry delay, or trigger count-up when the card enters viewport using an IntersectionObserver.
**Upside:** MEDIUM (dependent on fixing 5a/5c first; standalone it is minor)

### 8b. "Live . 0s ago" starts at 0 immediately
**Component:** `ConfidenceSignals.tsx`, line 38
**Issue:** `secondsAgo` starts at 0 and the interval begins immediately. The display shows "Live . 0s ago" which is technically correct but feels odd -- "0 seconds ago" implies the data was *just* fetched, which may not be true. Consider starting at a small offset (e.g. 1 or 2) or showing "Live . just now" for the first few seconds.
**Fix:** Change initial state to show "Live . just now" when `secondsAgo < 3`.
**Upside:** LOW

---

## 9. UpdateLogModal

### 9a. No scroll behavior for long content
**Component:** `UpdateLogModal.tsx`, lines 90-109
**Issue:** The operations history section has no `overflow-y-auto` or `max-h-` constraint. If a client has many activity entries (the modal shows up to 6, hardcoded on line 32), the modal could exceed viewport height on small screens. The slice to 6 mitigates this, but on very small viewports (mobile) even 6 entries could overflow.
**Fix:** Add `max-h-[60vh] overflow-y-auto` to the operations history container, or to the modal body.
**Upside:** MEDIUM

### 9b. No tab trap inside modal
**Component:** `UpdateLogModal.tsx`
**Issue:** The modal handles Escape key (line 26) and backdrop click (line 53), but there is no focus trap. When the modal is open, Tab key can navigate to elements behind the modal (sidebar links, etc.). This is an accessibility violation.
**Fix:** Use a focus-trap library (e.g., `focus-trap-react`) or manually trap focus between the first and last focusable elements (close button and... there is only one focusable element, the close button). At minimum, auto-focus the close button on open.
**Upside:** MEDIUM

### 9c. Body scroll not locked when modal is open
**Component:** `UpdateLogModal.tsx`
**Issue:** The backdrop covers the screen, but `document.body` is not set to `overflow: hidden` when the modal opens. On pages with enough content to scroll, the background can scroll behind the modal.
**Fix:** Add `useEffect` to toggle `document.body.style.overflow` between "hidden" and "" based on `open` state.
**Upside:** MEDIUM

### 9d. Close button has no aria-focus management
**Component:** `UpdateLogModal.tsx`, line 71
**Issue:** When the modal opens, focus stays on the trigger (UpdateLogBadge button behind the backdrop). The close button should receive focus automatically.
**Fix:** Add a ref to the close button and call `.focus()` in a `useEffect` when `open` becomes true.
**Upside:** MEDIUM

---

## 10. Live Clock in Sidebar

### 10a. Clock flashes empty on first render (SSR hydration)
**Component:** `Sidebar.tsx`, lines 16-31, 40-45
**Issue:** `time` starts as `""`, so on server render and first client paint, the clock area is empty. The conditional render `{time && (...)}` means the clock + timezone label pop in after hydration. This creates a layout shift -- the sidebar header grows taller when the clock appears.
**Fix:** Reserve the space with a fixed-height placeholder, or render a "skeleton" (e.g., `--:--`) on the server side that gets replaced. Simplest: initialize with a static placeholder like `"--:--"` instead of `""` and always render the clock area.
**Upside:** HIGH (layout shift on page load is visible and jarring)

---

## 11. Stagger Animation Details

### 11a. Single stagger timing for all list lengths
**Component:** `lib/motion.ts`, line 32
**Issue:** `staggerChildren: 0.12` is used by PipelineSection (typically 2-4 items), CommitmentsSection (typically 3 items), UpcomingSection (2-4 items), and ActivityFeed (5-6 items). For 3 items, total stagger is 0.36s (fine). For 6 activity entries, total stagger is 0.72s which starts to feel slow -- the last item appears nearly a second after the first.
**Fix:** Create a `staggerFast` variant with `staggerChildren: 0.08` for longer lists (ActivityFeed), and keep `0.12` for shorter ones (Pipeline, Commitments, Upcoming).
**Upside:** MEDIUM

### 11b. UpcomingSection uses whileInView, others use animate
**Component:** `UpcomingSection.tsx`, line 44 vs `PipelineSection.tsx`, line 84
**Issue:** UpcomingSection uses `whileInView="visible"` while PipelineSection, CommitmentsSection, and ActivityFeed all use `animate="visible"`. This means UpcomingSection only animates when scrolled into view (correct), but the others animate immediately on mount even if they are below the fold. This is inconsistent and means sections below the fold animate invisibly.
**Fix:** Change PipelineSection, CommitmentsSection, and ActivityFeed to use `whileInView="visible" viewport={{ once: true }}` for consistency. This also helps with finding 5a -- sections animate as they scroll into view, creating a natural cascade.
**Upside:** HIGH (items currently animate before user can see them, wasting the animation)

---

## 12. Things That Move But Shouldn't / Should Move But Don't

### 12a. Pipeline pulsing heads ping indefinitely
**Component:** `PipelineSection.tsx`, lines 47-52
**Issue:** Every non-placed candidate has an `animate-ping` div on the progress bar head. If there are 3 candidates, that is 3 perpetually pulsing dots. This is distracting and implies urgency/live-ness that may not exist. The ping animation is loud.
**Fix:** Replace `animate-ping` with the subtler `animate-glow-pulse` already defined in globals.css, or use a single slow pulse (`animate-pulse`) instead. Alternatively, only pulse the most-advanced candidate.
**Upside:** MEDIUM

### 12b. Terminal cursor blinks on the largest number in ConfidenceSignals
**Component:** `ConfidenceSignals.tsx`, line 21
**Issue:** The `terminal-cursor` class is applied to all four signal card values via the `SignalCard` component. This means four blinking cursors on screen simultaneously. Multiple blinking elements compete for attention and dilute the "live terminal" effect.
**Fix:** Only apply `terminal-cursor` to the "Last movement" card (the live ticker), not to all four. Or apply it only to the first card to draw the eye there.
**Upside:** HIGH (removing 3 of 4 blinking cursors massively reduces visual noise)

### 12c. Activity feed first entry has terminal-cursor, but feels unmotivated
**Component:** `ActivityFeed.tsx`, line 34
**Issue:** `${i === 0 ? " terminal-cursor" : ""}` adds a blinking cursor to the most recent activity entry. Combined with the 4 blinking cursors in ConfidenceSignals, that is 5 blinking elements total. Even after fixing 12b, this is one more blinking thing.
**Fix:** Keep this one (it makes sense -- "latest entry, still typing") but only if 12b is fixed first. If all 5 remain, it is too much.
**Upside:** LOW (conditional on 12b)

### 12d. Sidebar active indicator has no entry animation
**Component:** `Sidebar.tsx`, line 61-62
**Issue:** The gold left-border indicator (`w-[2px] bg-[#CF9B2E]`) on the active nav item appears/disappears instantly when navigating. A `layoutId` animation (framer-motion) on this indicator would create a smooth sliding effect between nav items.
**Fix:** Use framer-motion `motion.span` with `layoutId="sidebar-indicator"` on the active bar.
**Upside:** MEDIUM

---

## Priority Summary

### Must-fix (HIGH upside):
| # | Finding | Component |
|---|---------|-----------|
| 6a | Cursor visible at (0,0) on load | PortalCursor.tsx |
| 10a | Clock layout shift on hydration | Sidebar.tsx |
| 5a | No orchestrated entry sequence | Dashboard page |
| 5c | Signal cards have no entry animation | ConfidenceSignals.tsx |
| 11b | Stagger animations fire off-screen | Pipeline/Commits/Activity |
| 12b | 4 simultaneous blinking cursors | ConfidenceSignals.tsx |
| 2a | Zero focus-visible rings | All interactive elements |
| 1b | Commitment rows missing hover | CommitmentsSection.tsx |
| 1c | Activity rows missing hover | ActivityFeed.tsx |
| 1a | Sign-out missing hover bg | Sidebar.tsx |
| 3a | UpdateLogBadge no press state | UpdateLogBadge.tsx |

### Should-fix (MEDIUM upside):
| # | Finding | Component |
|---|---------|-----------|
| 6b | Cursor lerp too slow | PortalCursor.tsx |
| 6c | Cursor shows on touch devices | PortalCursor.tsx |
| 7a-c | Empty states return null | Pipeline/Commits/Activity |
| 9a-d | Modal accessibility gaps | UpdateLogModal.tsx |
| 11a | Single stagger for all list lengths | motion.ts |
| 12a | Pipeline ping too loud | PipelineSection.tsx |
| 12d | Nav indicator not animated | Sidebar.tsx |
| 5b | Header has no entry animation | DashboardHeader.tsx |
| 4b | Health bars don't stagger | Sidebar.tsx |

### Nice-to-have (LOW upside):
| # | Finding | Component |
|---|---------|-----------|
| 4a | Duplicate transition class | Sidebar.tsx |
| 4c | Stage bar 700ms duration | PipelineSection.tsx |
| 8b | "0s ago" on mount | ConfidenceSignals.tsx |
| 3c | Sign-out press state | Sidebar.tsx |
