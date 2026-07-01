# Design Brief · Guarantee Tracker

**Output of `$impeccable shape guarantee-tracker` · confirmed 2026-04-24.**
**Input to `$impeccable craft guarantee-tracker`.**

This brief is the single source of truth for the Guarantee Tracker build. Any implementation decision must trace back to something here. If a decision isn't here, surface it for clarification — do not guess.

Always read alongside:
- `/Users/viljoen/IGC-website/PRODUCT.md` — register (product), users, brand, anti-references
- `/Users/viljoen/IGC-website/DESIGN.md` — design system v2 canonical (tokens, type, motion, CTA system, Gold Rule)
- `/Users/viljoen/IGC-website/HANDOFF.md` — implementation notes (flagged drift from DESIGN.md — DESIGN.md wins)

---

## 1. Feature Summary

The Guarantee Tracker is the hero component of `/portal/system/overview`. It surfaces, at a glance, how many of the five contractually-promised qualified conversations have been booked, what day of the 30-day engagement the client is on, and whether the engagement is on pace. For the 35–55 owner-operator who just wired £3,500, it is the single most trust-critical element in the entire product.

## 2. Primary User Action

**Glance.** Resolve the unspoken question *"am I getting what I paid for?"* in under two seconds, without scrolling, without clicking.

Secondary actions (order of frequency):
1. Click any filled square → right-drawer opens with that conversation's context.
2. Read K.C.'s inline hypothesis when state = `behind`.
3. Click day counter → soft-scroll anchor to `DaysRuler` lower on the page.

The primary action is cognitive, not transactional. Trust artifact, not tool.

## 3. Design Direction

- **Color strategy:** Restrained. One accent (gold `#C9922A`) used exactly once per engagement lifecycle — the 5th-square fill on met-moment.
- **Scene sentence:** *"A 55-year-old MSP owner on a Monday at 7am in a dim home office, laptop tilted back, first coffee, glancing at the tracker to confirm the £3,500 he paid last Tuesday is actually moving."* Forces warm-dark, quiet, precision-typographic.
- **Anchor references:** Bloomberg Terminal (institutional ledger), Linear (warm-dark editorial restraint), Mercury (statement-grid square row).
- **Per-surface override from DESIGN.md:** the 2px gold-left-bar active state is **dropped** (Impeccable absolute ban on side-stripe borders >1px). Active-state vocabulary: gold underline for interactive text, 1px full-border with gold tint for active cards, leading ordinal for list items.

## 4. Scope

| Dimension | Value |
|---|---|
| Fidelity | Production-ready |
| Breadth | One component, two variants: `<GuaranteeTracker variant="compact">` on `/portal/system/overview`, `<GuaranteeTracker variant="expanded">` on `/portal/system/guarantee` |
| Interactivity | Shipped-quality. HubSpot webhook → Postgres → RSC render. SWR poll 30s + revalidate on focus. Framer Motion 11 for signature moment. |
| Time intent | Polish-until-ships. Anchor component the rest of the portal calibrates against. |

## 5. Layout Strategy

**No card wrapping.** This lives as structured typography on the page surface. Negative space IS the card. Per Impeccable shared laws ("Cards are the lazy answer") and product.md ("consistency IS an affordance").

### Compact variant (Overview page)

Top-aligned in Overview's primary column. Max-width `680px` desktop, full-width mobile. Vertical rhythm on 4pt grid (per spatial-design.md):

```
┌─ Row 1 · Eyebrow + day counter ─────────────────────┐
│ § 01 · GUARANTEE                        Day 17 of 30 │
│ (DM Mono 11px, 0.16em tracking, text-tertiary)       │
├─ Row 2 · Primary number + qualifier ──(24px)────────┤
│ 3 of 5                                               │
│ (Playfair 400, clamp(3rem, 5vw, 4.5rem), ink)       │
│ qualified managed-contract conversations             │
│ (Inter 300, 1.125rem, text-secondary)                │
├─ Row 3 · Five squares ──────────(32px)─────────────┤
│ [■] [■] [■] [ ] [ ]                                  │
│ (52px × 52px, 16px gaps, 1px border, click→drawer)   │
├─ Row 4 · State-dependent subtext ───(24px)─────────┤
│ (varies — see §6)                                    │
└──────────────────────────────────────────────────────┘
```

Total vertical footprint: 240–280px. Sits above-the-fold on any laptop ≥720p.

### Expanded variant (`/portal/system/guarantee`)

Full-page surface. Inherits Rows 1–4 of compact. Adds:

- **Row 5:** Five conversations listed below squares. Each row: `{company} · {decision-maker name}, {role} · {date held} · {K.C.'s qualification reasoning in Playfair italic} · {HubSpot link}`.
- **Row 6:** K.C.'s full hypothesis thread — append-only weekly annotations, Playfair italic, signed `—K.C. · {date}`.
- **Row 7:** Engagement timeline — horizontal ruler of Days 1–30 with dots where each conversation booked. No fill, no animation.

Non-card, information-dense. Bloomberg ledger register.

## 6. Key States (7 + 2 overlays)

| State | Squares | Number | Day counter | Subtext | Notes |
|---|---|---|---|---|---|
| **pre-outreach** (Day 1–13) | 5 hollow | `0 of 5` text-secondary | `Day N of 30` | `Outreach begins Day 14 · Tue 7 May` DM Mono 11px | Number deliberately muted; guarantee hasn't started |
| **on-pace** (Day 14+, N ≥ expected) | N filled ink, 5−N hollow | `N of 5` Playfair ink | `Day N of 30` | — | Silence is sufficient |
| **ahead** (pace > expected +1) | same as on-pace | `N of 5` | `Day N of 30 · ahead` | — | Tag in day counter only |
| **behind** (pace < expected) | same as on-pace | `N of 5` | `Day N of 30 · behind pace` | **K.C. hypothesis always-visible inline**, Playfair italic 400, 1.125rem, max 2 lines, ≤140 chars | Concede-before-claim confronting |
| **met** (N = 5, ≤ Day 30) | 4 ink + 5th **gold** + **1px gold hairline under row** | `5 of 5` Playfair ink | `met · Day N of 30` | `met · DD Mon YYYY` DM Mono 13px text-secondary | THE SIGNATURE MOMENT |
| **unpaid-extension** (Day 30 passed, N < 5) | N filled, 5−N hollow | `N of 5` | `Day 30 of 30 · +N days extended` | Clarifier: `Guarantee not met by Day 30. Retainer continuing unpaid until N=5.` Inter 400 text-secondary. + K.C. hypothesis inline. | Commitment held |
| **archive** (post-met, Day 30+) | 5 ink + 5th gold permanent + hairline permanent | `5 of 5` | `met · DD Mon YYYY` | `engagement complete · handover complete` DM Mono 11px text-secondary | Trophy receipt forever |
| **loading** overlay | all rows `opacity: 0.35` | — | — | `Loading · HubSpot · HH:MM:SS UTC` DM Mono 11px text-tertiary | No skeleton, no spinner |
| **error** overlay | last-known-good state from SWR cache | — | — | `HubSpot API {code} at {time} · retrying every 30s · K.C. pages himself at hello@igc-growth.com if unresolved by {time}` DM Mono 11px amber (warm, not red). Plus `last synced · HH:MM` attribution. | Named escalation, no apology |

## 7. Interaction Model

### Glance
Zero interaction. Default state reads in under 2 seconds.

### Click filled square
- Right-drawer opens, 480px wide desktop / full-width mobile. `translate-x` from `100%` to `0`, 220ms, cubic-bezier(0.16, 1, 0.3, 1).
- Backdrop `rgba(8, 8, 8, 0.88)` dismissible on click-outside.
- Content: that conversation's full card (company, decision-maker, date held, K.C.'s qualification notes in Playfair italic, HubSpot link, transcript link if recorded).
- Hollow squares not clickable; cursor remains default on hover.

### Hover on filled square (desktop only, `@media (hover: hover)`)
- Existing custom cursor ring (DESIGN.md) grows from 28px to 40px.
- **No tooltip. No preview.** Detail requires a click.

### Click day-counter
- Soft scroll-anchor to `DaysRuler` component. `scroll-behavior: smooth`, 400ms.

### Keyboard
- `j` / `k` cycles through 5 squares (focus ring: 1px gold outline, 2px offset per DESIGN.md).
- `Return` opens drawer for focused square.
- `Esc` closes drawer.
- `g g` from command palette → `/portal/system/guarantee`.

### Signature moment (state transition → `met`)

t = 0ms: 5th square fill transitions ink (`#F2EDE4`) → gold (`#C9922A`) over 400ms cubic-bezier(0.16, 1, 0.3, 1). Color-only — no scale, no blur, no glow.
t = 200ms: 1px gold hairline begins drawing beneath row of squares, `scaleX` 0→1, `transform-origin: left`, duration 600ms total.
t = 400ms: Date stamp `met · {today}` fades in under row, `opacity` 0→1 + `y` 8px→0, 300ms.
t = 800ms: All motion complete.

**`prefers-reduced-motion: reduce`:** All three steps snap to final state instantly. No animation. End-state visual identical.

**Replay policy:** Once per engagement-lifetime. `localStorage.setItem('igc-guarantee-met-seen-{engagementUid}', '1')`. First render after met: play. All subsequent renders: static.

### Revalidation
- SWR `refreshInterval: 30000` on Overview.
- Revalidate on focus.
- HubSpot webhook → backend → DB → next poll picks it up.
- If user offline and returns post-met-transition, signature motion plays on first foreground render (subject to localStorage flag).

## 8. Content Requirements

### Copy inventory

| Element | Text | Typography |
|---|---|---|
| Eyebrow | `§ 01 · GUARANTEE` | DM Mono 11px, 0.16em tracking, `#4A4640` |
| Primary number | `N of 5` | Playfair 400, clamp(3rem, 5vw, 4.5rem), `#F2EDE4` |
| Qualifier | `qualified managed-contract conversations` (MSP) / `qualified mandate briefs` (recruitment) — **from `stage_config.guarantee_qualifier_label`** | Inter 300, 1.125rem/1.75, `#857F74` |
| Day counter (default) | `Day {N} of 30` | DM Mono 11px, 0.16em, `#4A4640` |
| Day counter (behind) | `Day {N} of 30 · behind pace` (tail in `#857F74`) | DM Mono 11px |
| Day counter (ahead) | `Day {N} of 30 · ahead` (tail in `#857F74`) | DM Mono 11px |
| Day counter (met) | `met · Day {N} of 30` | DM Mono 11px, `#857F74` |
| Day counter (unpaid-ext) | `Day 30 of 30 · +{N} days extended` | DM Mono 11px |
| Pre-outreach descriptor | `Outreach begins Day {N} · {Weekday DD Mon}` (computed from engagement.startDate + 13 days) | DM Mono 11px, `#857F74` |
| Unpaid-ext clarifier | `Guarantee not met by Day 30. Retainer continuing unpaid until N=5.` | Inter 400, 1rem, `#857F74` |
| Met date stamp | `met · {DD Mon YYYY}` | DM Mono 13px, `#857F74` |
| Archive tag | `engagement complete · handover complete` | DM Mono 11px, `#857F74` |
| K.C. hypothesis | `— K.C. · {hypothesis_text}, {fix_action} {fix_date}.` (≤140 chars, 2-line max) | Playfair italic 400, 1.125rem, `#F2EDE4` |
| Drawer title | `{company} · {decision-maker name}, {role}` | Playfair 400, 1.5rem, `#F2EDE4` |
| Drawer subtitle | `qualified · {DD Mon}` | DM Mono 11px, `#857F74` |
| Loading overlay | `Loading · HubSpot · {HH:MM:SS UTC}` | DM Mono 11px, `#4A4640` |
| Error overlay | `HubSpot API {code} at {time} · retrying every 30s · K.C. pages himself at hello@igc-growth.com if unresolved by {time}` | DM Mono 11px, amber warm (`#CF9B2E`) |
| Last-synced | `last synced · HH:MM` | DM Mono 11px, `#4A4640` |

### Voice rules (PRODUCT.md locked)
- Zero em-dashes in UI chrome (commas, colons, periods, middle-dot `·`).
- Zero emoji.
- Zero exclamation marks in UI chrome.
- K.C.'s hypothesis may sign with `—K.C.` (long-form signature byline, not UI chrome).

### Dynamic ranges
- `N ∈ [0, 5]`. Extras not displayed (counted in backend Cumulative Results only).
- `day ∈ [1, 90+]` (extensions allowed).
- `hypothesis.text`: DB max 140 chars, component hard line-break at 2 lines.

## 9. Implementation References (Impeccable)

Read before building:
- `reference/product.md` — register
- `reference/spatial-design.md` — non-card layout, 4pt grid, variant topology
- `reference/typography.md` — calibration across 9 text roles
- `reference/motion-design.md` — signature moment timing, reduced-motion
- `reference/interaction-design.md` — drawer, keyboard, hover-gating
- `reference/color-and-contrast.md` — OKLCH equivalents + WCAG audit for `#4A4640` text-tertiary
- `reference/cognitive-load.md` — glance-in-2-seconds
- `reference/harden.md` — error boundaries, reduced-motion snap, SWR contract, WCAG AA
- `reference/ux-writing.md` — editorial microcopy per state
- `reference/responsive-design.md` — 320/360/375/768px behaviors

## 10. Resolved Open Questions

1. **`stage_config.guarantee_qualifier_label`:** Added as part of the Phase 0 niche-agnostic schema rewrite. String field per engagement.
2. **Signature motion replay policy:** Static after real-time play. `localStorage.setItem('igc-guarantee-met-seen-{engagementUid}', '1')` on first play; subsequent renders static.
3. **Over-achievement (6+ of 5):** Backend counts for Cumulative Results; tracker caps visual at 5.
4. **Demo client:** Seed new `igc-msp-demo-001` (UK MSP, Manchester, 15 employees, Day 17 of 30, 2 of 5 qualified, on-pace state). Keep `igc-demo-001` (Vantage Technology) as niche-agnostic test case for recruitment stages.
5. **Expanded variant hypothesis thread overflow:** Reverse-chronological, latest 3 visible by default, "Show all" expands the rest.
6. **Mobile 320px edge case:** Squares scale 52→44px (WCAG AA touch-target minimum) + gaps 16→12px below 360px. At ≥360px, stay at 52px/16px.

---

## Build order (craft.md §5)

1. Structure (semantic HTML for primary state)
2. Layout and spacing (4pt rhythm, max-widths, vertical hierarchy)
3. Typography and color (DESIGN.md tokens applied)
4. Interactive states (hover, focus, active, disabled)
5. Edge-case states (all 7 from §6 + 2 overlays)
6. Motion (signature moment, reduced-motion guard)
7. Responsive (compact/expanded variants, 320→1920px)

Test with realistic data at every step. Each state checked as built, not all at end.

## Production-ready gates

- All 7 states + 2 overlays rendered and visually checked
- WCAG AA contrast verified (especially `#4A4640` on `#080808`)
- `prefers-reduced-motion` snaps end-state on signature moment
- Keyboard navigation complete (`j/k/Return/Esc`)
- Screen-reader labels on squares, counter, drawer
- SWR revalidation contract wired (`refreshInterval: 30000`, `revalidateOnFocus: true`)
- HubSpot API failure gracefully degrades to last-known-good + named-escalation error overlay
- No card wrapping
- No side-stripe borders >1px anywhere in the component
- No em-dashes in UI chrome
- `stage_config.guarantee_qualifier_label` reads niche-agnostic

End of brief.
