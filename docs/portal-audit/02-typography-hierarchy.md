# Portal Typography & Information Design Audit

Audit date: 2026-04-10
Auditor scope: DashboardHeader, ConfidenceSignals, PipelineSection, CommitmentsSection, ActivityFeed, UpcomingSection, Sidebar, data layer, analytics layer.

---

## 1. Number Formatting

### 1A. Confidence signal values mix number and unit at same weight — HIGH

**File:** `ConfidenceSignals.tsx`, line 21 (SignalCard value rendering)
**Current:** The entire value string (`"3 candidates"`, `"2 of 3 delivered"`) renders at `text-4xl font-mono font-bold` uniformly.
**Problem:** The number is the data; the unit is the label. Rendering both at identical weight forces the eye to parse the whole string instead of scanning numbers. In a dashboard with four signal cards, the user should be able to glance across the top row and read `3 ... 2/3 ... Today ... 6` without reading words.
**Proposed fix:** Split value into numeric and unit parts. Render numeric portion as `text-4xl font-mono font-bold text-[#F2EDE4]` and unit portion as `text-lg font-mono font-normal text-[#857F74] ml-1.5`. This requires changing SignalCard to accept structured value props rather than a single string. Alternatively, at minimum, render numbers in gold `text-[#CF9B2E]` and units in the existing cream.

### 1B. "days" badge in pipeline lacks tabular-nums — MEDIUM

**File:** `PipelineSection.tsx`, line 110-113
**Current:** `text-sm font-mono` but no `tabular-nums`.
**Problem:** As day counts change (e.g., `2d` vs `12d`), digit widths may shift slightly depending on font rendering, causing micro-jitter in the column alignment.
**Proposed fix:** Add `tabular-nums` to the `<span>` className.

### 1C. Commitment overdue/due badges lack tabular-nums — MEDIUM

**File:** `CommitmentsSection.tsx`, lines 39-41
**Current:** `font-mono text-sm` for `{Math.abs(daysUntilDue)}d overdue` and `due in {daysUntilDue}d`.
**Proposed fix:** Add `tabular-nums` to these `<p>` elements.

---

## 2. Date Formatting

### 2A. Activity feed uses raw ISO dates — HIGH

**File:** `ActivityFeed.tsx`, line 32
**Current:** `{item.date}` renders as `"2026-04-08"` — raw ISO 8601.
**Problem:** ISO dates are machine-readable, not human-premium. They violate the dashboard's luxury tone. Every other temporal display in the portal uses human-friendly formatting (UpcomingSection uses "Today", "Tomorrow", "In 3d", "8 Apr").
**Proposed fix:** Add a formatting function identical to or reusing `formatRelative` from UpcomingSection. For past dates: "Today", "Yesterday", "3 days ago" for within 7 days; "8 Apr" for older. This is a 10-line change with the highest perceptual payoff in the entire audit.

### 2B. Commitment due dates use raw ISO when not urgent — MEDIUM

**File:** `CommitmentsSection.tsx`, line 43
**Current:** `Due {c.due}` renders as `"Due 2026-04-30"` for commitments that are not yet urgent (> 3 days away).
**Problem:** Same ISO date issue as the activity feed.
**Proposed fix:** Format as `"Due 30 Apr"` using `toLocaleDateString("en-GB", { day: "numeric", month: "short" })`.

### 2C. Met commitment due dates also raw ISO — LOW

**File:** `CommitmentsSection.tsx`, line 64
**Current:** `Due {c.due}` on met (checked off) commitments also shows `"Due 2026-03-15"`.
**Proposed fix:** Same formatting. Consider changing to `"Delivered 15 Mar"` or just `"15 Mar"` for met items, since "Due" for a completed item reads oddly.

---

## 3. Label vs Value Hierarchy

### 3A. Confidence signal label and sub-text compete — MEDIUM

**File:** `ConfidenceSignals.tsx`, lines 18, 22
**Current:** Label is `text-sm font-mono uppercase tracking-wider text-[#857F74]`. Sub-text is `text-sm text-[#857F74]`. Same size, same color.
**Problem:** The label (top) and the sub-text (bottom) are visually identical. The label is differentiated only by uppercase and mono, but at the same size and color, the hierarchy is ambiguous. Sub-text should be more recessive.
**Proposed fix:** Change sub-text to `text-xs text-[#6E6762]` (one step smaller, one shade darker/more muted). This creates a clear three-tier: label (sm/muted/mono) > value (4xl/bold) > sub (xs/dim).

### 3B. Pipeline stage label column weight competes with name — LOW

**File:** `PipelineSection.tsx`, line 115-116
**Current:** Stage label is `text-sm text-[#857F74] w-32 text-right`. Candidate name is `text-base text-[#F2EDE4]`.
**Finding:** The hierarchy is actually correct here. Name is larger and brighter. Stage label is appropriately subordinate. No change needed.

---

## 4. Line Length and Truncation

### 4A. Pipeline name column at w-48 is tight for long names — MEDIUM

**File:** `PipelineSection.tsx`, line 103
**Current:** `w-48 flex-shrink-0 min-w-0` (12rem = ~192px).
**Problem:** "Dr. Alexandra Vanden Berg" would truncate to roughly "Dr. Alexandra Van..." which is acceptable but not ideal. The current demo data has names like "Dr. James Okafor" and "Dr. Priya Mensah" which fit. But real-world names with double-barrelled surnames or long prefixes will truncate awkwardly.
**Proposed fix:** Increase to `w-56` (14rem) or `w-64` (16rem). Alternatively, keep `w-48` but add a `title` attribute with the full name so hover reveals it: `<p title={candidate.name} className="...truncate">`.

### 4B. Pipeline note truncation has no tooltip — LOW

**File:** `PipelineSection.tsx`, line 106-107
**Current:** `truncate` with no fallback.
**Proposed fix:** Add `title={candidate.note}` to the `<p>` element.

---

## 5. Capitalization Conventions

### 5A. Inconsistent uppercase mono usage across labels — HIGH

The dashboard uses uppercase mono (`uppercase tracking-wider` or `tracking-widest`) for category labels, but inconsistently:

| Component | Element | Treatment | Line |
|-----------|---------|-----------|------|
| ConfidenceSignals | Card label | `text-sm font-mono uppercase tracking-wider` | 18 |
| Sidebar | "Client Portal" | `text-xs font-mono tracking-wider uppercase` | 37 |
| Sidebar | "Engagement Health" | `text-[11px] font-mono uppercase tracking-[0.2em]` | 73 |
| Sidebar | "SAST - Johannesburg" | `text-[11px] font-mono tracking-wider` (no explicit uppercase, but content is caps) | 43 |
| Sidebar | Health labels | `text-[11px] font-mono` (no uppercase) | 83 |
| PipelineSection | Stage markers | `text-[10px] font-mono uppercase tracking-widest` | 75 |

**Problems:**
1. Three different tracking values: `tracking-wider`, `tracking-widest`, `tracking-[0.2em]`.
2. Three different sizes: `text-sm`, `text-xs`, `text-[11px]`, `text-[10px]`.
3. Sidebar health labels ("Pipeline", "Commits", "Activity") are NOT uppercase despite being the same class of element as "Engagement Health" above them.

**Proposed fix:** Standardize on a single utility class pattern for "meta labels": `text-[11px] font-mono uppercase tracking-wider text-[#857F74]`. Apply consistently. The stage markers in PipelineSection can remain at `text-[10px]` since they are a special compact context.

### 5B. Section headings: Title Case vs Sentence case — LOW

| Section | Heading | Case |
|---------|---------|------|
| PipelineSection | "Your Candidates" | Title Case |
| CommitmentsSection | "Our Commitments to You" | Sentence Case (with Title Case words) |
| ActivityFeed | "Operations Log" | Title Case |
| UpcomingSection | "Coming Up" | Title Case |

**Finding:** Mostly consistent Title Case. "Our Commitments to You" is actually correct Title Case (preposition "to" lowercase). No change needed.

---

## 6. Number Precision / Singular-Plural

### 6A. Confidence signal singular/plural is handled correctly — NO ISSUE

**File:** `ConfidenceSignals.tsx`, lines 60, 78
**Current:** `candidate${analytics.activeCandidatesThisWeek !== 1 ? "s" : ""}` and `day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`.
**Finding:** Correctly handles singular. However, note that the count used for the plural check is the raw analytics value, but the displayed value is the animated `activeCount` from `useCountUp`. During the count-up animation, the displayed number may show `1` briefly while the analytics value is `3`, meaning the text says "1 candidates" during animation. This is a micro-issue that most users would never notice because the animation is fast (600ms).

### 6B. Zero case reads awkwardly — LOW

**Current:** `0 candidates` is grammatically correct but reads oddly as a confidence signal.
**Proposed fix:** Consider special-casing zero: display `"No active candidates"` or `"--"` for zero values, which reads more intentional.

### 6C. "days" in DashboardHeader handles singular — NO ISSUE

**File:** `DashboardHeader.tsx`, line 33
**Current:** Correctly pluralized.

---

## 7. Relative vs Absolute Date Thresholds

### 7A. Last activity "days ago" has no upper bound — MEDIUM

**File:** `ConfidenceSignals.tsx`, lines 44-49
**Current:** `lastActivityDaysAgo === 0` -> "Today", `=== 1` -> "Yesterday", else `"X days ago"`.
**Problem:** For `lastActivityDaysAgo = 45`, it would display `"45 days ago"` which is absurd for a confidence signal meant to reassure the client. At that point the signal is actively damaging.
**Proposed fix:** Cap relative display at 7 days. Beyond that, show the actual date formatted as "8 Mar". Beyond 14 days, consider changing the card's tone (e.g., muted/warning state).

### 7B. UpcomingSection formatRelative handles this well — NO ISSUE

**File:** `UpcomingSection.tsx`, lines 15-26
**Finding:** Correctly switches to absolute date (`"8 Apr"`) beyond 7 days. The activity feed and confidence signals should follow this same pattern.

---

## 8. The Greeting Punctuation

### 8A. Period after greeting feels formal-flat — MEDIUM

**File:** `DashboardHeader.tsx`, line 39
**Current:** `{greeting}, {client.contactName}.`
**Problem:** "Good morning, Sarah." with a period reads like a statement of fact rather than a warm welcome. "Good evening, Sarah." with a period feels almost cold. No punctuation at all (`Good morning, Sarah`) reads more natural and confident in a premium context. An exclamation mark (`Good morning, Sarah!`) is too energetic for a dark, serious dashboard.
**Proposed fix:** Remove the period. The greeting is a visual element, not a sentence. Premium brands (Amex, private banking portals) typically omit terminal punctuation on greetings.

---

## 9. Pipeline Row Hierarchy

### 9A. Reading order is correct but days badge needs more separation — LOW

**File:** `PipelineSection.tsx`, lines 98-118
**Current reading order:** Name (left, bright, base size) -> Note (below name, muted) -> Progress bar (visual center) -> Days badge (right, mono, color-coded) -> Stage label (far right, muted).
**Finding:** The hierarchy is well-constructed. The eye reads name first (correct), then scans right to the progress bar (visual weight), then to the days badge (color draws attention if urgent). The stage label is appropriately subordinate as a text echo of the bar position.
**Minor issue:** The days badge (`w-10`) and stage label (`w-32`) are separated only by the default `gap-4`. On wide screens, the stage label can feel disconnected from the row. Consider reducing the gap between days badge and stage label specifically, or grouping them.

---

## 10. Font Mixing

### 10A. Commitment due date "Due 2026-04-30" uses Inter, should use mono — MEDIUM

**File:** `CommitmentsSection.tsx`, line 43
**Current:** `<p className="text-sm text-[#857F74] mt-1">Due {c.due}</p>` -- no `font-mono`.
**Problem:** All other date/time displays in the portal use `font-mono`. The non-urgent commitment due date breaks this convention, making dates feel inconsistent.
**Proposed fix:** Add `font-mono` to match the urgent date elements on lines 39-41 which already use `font-mono`.

### 10B. Met commitment due date also lacks mono — LOW

**File:** `CommitmentsSection.tsx`, line 64
**Current:** `<p className="text-sm text-[#857F74] mt-1">Due {c.due}</p>` -- same issue.
**Proposed fix:** Add `font-mono`.

### 10C. Activity feed date is correctly mono — NO ISSUE

**File:** `ActivityFeed.tsx`, line 31
**Finding:** `font-mono` is correctly applied.

### 10D. DashboardHeader "Day N" engagement counter is correctly mono — NO ISSUE

**File:** `DashboardHeader.tsx`, line 43
**Finding:** `font-mono` correctly applied.

---

## 11. Activity Feed Date Column Ratio

### 11A. w-24 date column is adequate but tight — LOW

**File:** `ActivityFeed.tsx`, line 31
**Current:** `w-24` (6rem = ~96px) for dates like `"2026-04-08"`.
**Problem:** ISO dates are 10 characters wide. At `text-sm font-mono`, this fits but has minimal breathing room. If dates are reformatted to relative strings like "3 days ago" (10 chars) or "Yesterday" (9 chars), `w-24` remains sufficient.
**Proposed fix:** If adopting the relative date format from finding 2A, `w-24` is fine. If keeping ISO dates, consider `w-28` for breathing room. Either way, this is low priority.

---

## 12. Orphaned Words

### 12A. Activity feed entries risk orphans on narrow viewports — LOW

**File:** `ActivityFeed.tsx`, line 34
**Current:** Activity entries like `"Offer accepted by Dr. Okafor. Start date confirmed 1 May."` will wrap at different points depending on viewport width. A narrow viewport could orphan `"May."` on its own line.
**Problem:** The entries are data-driven strings, not editable copy, so CSS orphan control is the only lever.
**Proposed fix:** Add `text-wrap: pretty` (modern CSS) or `text-wrap: balance` to the entry `<p>` element. Browser support is good (Chrome 117+, Safari 17.4+). Tailwind: `text-pretty` or `text-balance`.

### 12B. Commitment promise text has same risk — LOW

**File:** `CommitmentsSection.tsx`, line 62
**Same issue and fix as 12A.**

---

## Summary: Priority Implementation Order

### Tier 1 — HIGH asymmetric upside (do these first)

| # | Finding | Component | Effort |
|---|---------|-----------|--------|
| 2A | Activity feed ISO dates -> human format | ActivityFeed.tsx | ~15 min |
| 1A | Split number/unit weight in confidence signals | ConfidenceSignals.tsx | ~20 min |
| 5A | Standardize uppercase mono label pattern | Multiple files | ~10 min |

### Tier 2 — MEDIUM asymmetric upside

| # | Finding | Component | Effort |
|---|---------|-----------|--------|
| 8A | Remove period from greeting | DashboardHeader.tsx | 1 min |
| 2B | Commitment due dates -> human format | CommitmentsSection.tsx | ~5 min |
| 10A | Add font-mono to non-urgent commitment dates | CommitmentsSection.tsx | 1 min |
| 3A | Differentiate signal card sub-text from label | ConfidenceSignals.tsx | 2 min |
| 7A | Cap "days ago" at 7 in confidence signal | ConfidenceSignals.tsx | 3 min |
| 1B | Add tabular-nums to pipeline days badge | PipelineSection.tsx | 1 min |
| 1C | Add tabular-nums to commitment date badges | CommitmentsSection.tsx | 1 min |
| 4A | Widen pipeline name column or add title attr | PipelineSection.tsx | 2 min |

### Tier 3 — LOW asymmetric upside

| # | Finding | Component | Effort |
|---|---------|-----------|--------|
| 2C | Met commitment "Due" label -> "Delivered" | CommitmentsSection.tsx | 2 min |
| 6B | Zero-case special display | ConfidenceSignals.tsx | 5 min |
| 12A | text-pretty on wrapping entries | ActivityFeed.tsx, CommitmentsSection.tsx | 1 min |
| 4B | Title attribute on truncated notes | PipelineSection.tsx | 1 min |
| 10B | font-mono on met commitment dates | CommitmentsSection.tsx | 1 min |
