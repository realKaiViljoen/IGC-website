# Portal Audit 03: Copy, Data & Narrative

**Auditor:** Copy & data strategy review  
**Date:** 2026-04-10  
**Scope:** All client-facing text, labels, data presentation, empty states, tone  
**Rating key:** HIGH = cheap change, large perceptual reward | MEDIUM = worth doing | LOW = polish

---

## 1. Labels & Headings

### 1.1 Engagement title in DashboardHeader

**CURRENT:** `Senior Dentist, 2 Positions`  
**PROPOSED:** `Hiring: 2 Senior Dentists`  

The current string is an internal ops label. Pluralising the role and leading with "Hiring:" makes it read as a live mission, not a database field. The client sees *their goal*, not your ticket.

**Upside: HIGH**

### 1.2 "Your Candidates" section heading

**CURRENT:** `Your Candidates`  
**PROPOSED:** `Active Pipeline`  

"Your Candidates" is fine but slightly possessive-casual. "Active Pipeline" signals operational seriousness and matches the consultant-briefing register. Alternative: `Candidate Pipeline` if "Active" feels redundant when all displayed candidates are active.

**Upside: MEDIUM**

### 1.3 "Operations Log" heading

**CURRENT:** `Operations Log`  
**PROPOSED:** Keep as-is.  

This is already strong. It sounds like a flight recorder, not a blog. The word "Operations" does heavy lifting for the accountability positioning. No change needed.

**Upside: N/A**

### 1.4 "Our Commitments to You" heading

**CURRENT:** `Our Commitments to You`  
**PROPOSED:** `Our Commitments`  

"to You" is implied and slightly over-earnest. Dropping it makes the heading more confident. The commitments section already exists inside the client's personal portal -- the "to you" is structural, not verbal.

Alternative if you want warmth: `What We Promised`

**Upside: LOW**

### 1.5 "Coming Up" section heading

**CURRENT:** `Coming Up`  
**PROPOSED:** `What Happens Next`  

"Coming Up" is TV-presenter energy. "What Happens Next" is more specific and creates forward momentum. It answers the question every client has when they open the portal. Alternative: `Next Steps` (shorter, more operational).

**Upside: MEDIUM**

### 1.6 "In play this week" signal card label

**CURRENT:** `In play this week`  
**PROPOSED:** `Active this week`  

"In play" is a sports metaphor that slightly trivialises the process. "Active" is precise and professional. It also matches the "Active Pipeline" heading proposed above for tonal consistency.

**Upside: LOW**

### 1.7 "Promises kept" signal card label

**CURRENT:** `Promises kept`  
**PROPOSED:** Keep as-is.  

This is the single best piece of copy in the entire portal. It is bold, accountable, and emotionally loaded. The word "promises" is doing extraordinary work -- it elevates commitments from operational checkboxes to a personal bond. Do not change this.

**Upside: N/A**

### 1.8 "Last movement" signal card label

**CURRENT:** `Last movement`  
**PROPOSED:** `Last action`  

"Movement" is vague and slightly passive. "Action" implies agency -- someone *did something*. It reinforces the message that the firm is actively working, not passively waiting for things to move.

**Upside: MEDIUM**

### 1.9 "Next briefing" signal card label

**CURRENT:** `Next briefing`  
**PROPOSED:** Keep as-is.  

"Briefing" is excellent. It positions the update as a professional intelligence delivery, not a status email. This word alone justifies its weight.

**Upside: N/A**

### 1.10 Signal card sub-text: "X actions this month"

**CURRENT:** `{effortCount} actions this month`  
**PROPOSED:** `{effortCount} logged actions this month`  

Adding "logged" implies a formal record-keeping practice. It signals that every action is tracked and auditable. Small word, significant trust signal.

**Upside: HIGH**

---

## 2. Empty States & Edge Cases

### 2.1 "All on track" sub-text when all commitments are met

**CURRENT:** `All on track` (sub-text on Promises Kept card when `commitmentsMetCount === commitmentsTotalCount`)  
**PROPOSED:** `Every promise kept`  

Analysis of alternatives:
- "All on track" -- implies in-progress, not delivered. Weak because "on track" hedges.
- "All delivered" -- operational, good, but misses emotional register.
- "Every promise kept" -- echoes the card label ("Promises kept"), creates a closed loop of accountability. The word "every" is more emphatic than "all".
- "Clean record" -- too informal, sounds like a police check.

**PROPOSED:** `Every promise kept`

**Upside: HIGH**

### 2.2 Zero active candidates this week

**CURRENT:** Would display `0 candidates` with no sub-text.  
**PROPOSED:** Add sub-text: `Pipeline advancing next week`  

Zero active candidates with no context reads as inactivity. A brief contextual note pre-empts client anxiety. The copy should acknowledge the state without alarm.

Alternative for cases where there truly is no pipeline: `Sourcing in progress`

**Upside: HIGH**

### 2.3 Missing candidate notes

**CURRENT:** Candidates without `note` render nothing below their name.  
**PROPOSED:** Render `In progress` in the same muted style as existing notes.  

An empty space under a candidate name creates visual inconsistency and suggests incomplete data. "In progress" is neutral, accurate, and maintains row alignment. Alternatives considered:
- "Awaiting update" -- implies the consultant hasn't done their job.
- "No update" -- negative framing.
- "In progress" -- positive, factual, non-committal.

**Upside: MEDIUM**

---

## 3. Activity Entries (Voice & Style Audit)

### Current entries reviewed:

| Entry | Voice | Verdict |
|-------|-------|---------|
| `Interview scheduled: Dr. Mensah, 11 April.` | Active, precise, telegraphic | Good. The colon-separated format reads like a log entry. |
| `Offer accepted by Dr. Okafor. Start date confirmed 1 May.` | **Passive first clause.** Active second clause. | Rewrite first clause. |
| `Dr. Ferreira submitted. CV and references sent to Sarah.` | Active, specific, names the client | Good. Personal touch with "Sarah" is strong. |
| `Interview completed with Dr. Okafor. Strong feedback from the clinic.` | Active first clause. Second clause is qualitative without specifics. | Tighten second clause. |
| `3 candidates submitted ahead of deadline.` | Active, quantified, competitive | Excellent. This is the gold standard for activity entries. |

### Proposed rewrites:

**CURRENT:** `Offer accepted by Dr. Okafor. Start date confirmed 1 May.`  
**PROPOSED:** `Dr. Okafor accepted offer. Start date confirmed: 1 May.`  

Subject-verb-object. The candidate acts; we don't passively receive. Colon before date matches the telegraphic style of other entries.

**Upside: MEDIUM**

**CURRENT:** `Interview completed with Dr. Okafor. Strong feedback from the clinic.`  
**PROPOSED:** `Dr. Okafor interviewed. Clinic feedback: strong.`  

Tighter. The colon-value pattern (`feedback: strong`) reads like structured data, which reinforces the operations-log aesthetic.

**Upside: MEDIUM**

### Recommended style guide for future entries:
1. Lead with the candidate name or a number.
2. Active voice always. Subject-verb-object.
3. Colon-separated metadata (dates, outcomes, names).
4. One sentence per action. Two max per entry.
5. Quantify when possible ("3 candidates", "2 references", "within 14 days").
6. Name the client by first name when addressing them directly.

---

## 4. Commitment Promise Strings

### 4.1 First commitment

**CURRENT:** `3 qualified candidates submitted within 14 days`  
**PROPOSED:** `Deliver 3 qualified candidates within 14 days`  

Adding the verb "Deliver" transforms a noun phrase into a promise. As a client-facing commitment display, the current version reads like a metric label. With the verb, it reads like something someone *said to you* and is now being held to.

**Upside: HIGH**

### 4.2 Second commitment

**CURRENT:** `Written update delivered every Friday`  
**PROPOSED:** `Written briefing every Friday`  

"Update" is generic. "Briefing" aligns with the signal card language and the modal. "Delivered" is unnecessary -- the commitment tracker already shows whether it was met.

**Upside: LOW**

### 4.3 Third commitment

**CURRENT:** `First placement within 60 days`  
**PROPOSED:** `First candidate placed within 60 days`  

"Placement" is industry jargon. "First candidate placed" is more human and specific. It also front-loads the most emotionally resonant word -- "candidate" -- which is what the client actually cares about.

**Upside: MEDIUM**

---

## 5. "Next briefing: X days" Signal

### Current handling (DashboardHeader.tsx, line 31-33):

```ts
const updateLabel =
  analytics.daysToNextUpdate === 0
    ? "Today"
    : `${analytics.daysToNextUpdate} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`
```

This correctly handles:
- 0 days: "Today"
- 1 day: "1 day" (singular)
- 2+ days: "X days" (plural)

### Missing case: "Tomorrow"

**CURRENT:** 1 day shows as `1 day`  
**PROPOSED:** 1 day shows as `Tomorrow`  

"Tomorrow" is warmer and more immediate than "1 day". It creates anticipation rather than counting.

**Upside: MEDIUM**

### ConfidenceSignals.tsx does NOT mirror this logic

The signal card in ConfidenceSignals.tsx (line 78) displays `{daysCount} day(s)` but does NOT have the "Today" / "Tomorrow" handling. When `daysToNextUpdate === 0`, the card shows `0 days` while the header shows `Today`.

**CURRENT (ConfidenceSignals line 78):**  
```
value={`${daysCount} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`}
```

**PROPOSED:**  
```
value={
  analytics.daysToNextUpdate === 0
    ? "Today"
    : analytics.daysToNextUpdate === 1
    ? "Tomorrow"
    : `${daysCount} days`
}
```

This is a **consistency bug**, not just a copy preference.

**Upside: HIGH**

---

## 6. UpdateLogModal Footer

**CURRENT:** `Briefings delivered every 5-7 working days`  
**PROPOSED:** `You receive a briefing every 5-7 working days`  

Analysis:
- Adding "You" makes it personal and direct.
- "receive" positions the client as the beneficiary, not the firm as the deliverer.
- Considered adding "guaranteed" but rejected it -- the commitments section already handles accountability. Doubling down in the footer feels defensive.
- The current version is passive and impersonal ("Briefings delivered"). By whom? To whom? The proposed version answers both.

Shorter alternative: `Your briefing: every 5-7 working days`

**Upside: MEDIUM**

---

## 7. Missing Contextual Signals

### 7.1 `closestToPlacement` -- computed, never displayed

`analytics.ts` computes `closestToPlacement` (the candidate furthest along the pipeline) and returns it in `AnalyticsResult`. It is tested. It is typed. **It is never rendered in any component.**

This is the single highest-impact unused data point in the portal.

**PROPOSED:** Add a contextual line to DashboardHeader or as a sub-text on the "Active this week" signal card:

> `Dr. James Okafor -- closest to placement`

Or more narratively, as a highlight banner:

> `Nearest placement: Dr. James Okafor (offer accepted)`

This is the most emotionally resonant stat a client can see. It answers their deepest question: "Is anyone actually close to starting?" Every time they open the portal and see a name next to "nearest placement", they feel progress.

**PROPOSED implementation:** Add as sub-text on the pipeline section header:

```
<h2>Active Pipeline</h2>
<p class="sub">Nearest to placement: Dr. James Okafor</p>
```

**Upside: HIGH** -- This is the single highest-ROI change in this audit.

### 7.2 `effortSignalThisMonth` -- displayed but underexplained

Currently shows as `{count} actions this month` under the "Next briefing" card. This is good but could be stronger with context. When the count is high (say 8+), adding a qualifier like `above average` or comparing to the previous month would create a powerful effort signal.

For now, the "logged actions" change proposed in 1.10 is sufficient.

**Upside: LOW** (future enhancement)

### 7.3 `lastActivityDaysAgo` -- well-handled

The "Last movement" card correctly shows "Today", "Yesterday", or "X days ago". The live ticker (`Live -- Xs ago`) is a brilliant trust mechanism. No changes needed except the label rename to "Last action".

**Upside: N/A**

---

## 8. Candidate Notes (Empty State)

Covered in section 2.3. To summarise:

**CURRENT:** No `note` renders nothing.  
**PROPOSED:** Render `In progress` in `text-[#6E6762]` (dimmer than real notes at `text-[#857F74]`).

This maintains visual consistency across pipeline rows and prevents the "is something missing?" feeling.

**Upside: MEDIUM**

---

## 9. Engagement Title

Covered in section 1.1. The change from `Senior Dentist, 2 Positions` to `Hiring: 2 Senior Dentists` is a data-level change in `igc-demo-001.ts`, not a component change. This means it should be established as a formatting convention for all engagement titles:

**Convention:** `Hiring: {count} {pluralised role}`

**Upside: HIGH**

---

## 10. Upcoming Briefing Modal -- Edge Cases

### 10.1 "Today" handling

The modal header displays the full formatted date (`Wednesday, 16 April 2026`). When the briefing is today, it still shows the date -- there is no "Today" label. The UpcomingSection has `formatRelative()` which handles today/tomorrow, but the modal does not use it.

**PROPOSED:** Prepend "Today -- " when the briefing date is today:

**CURRENT:** `Wednesday, 16 April 2026`  
**PROPOSED (when today):** `Today -- Wednesday, 16 April 2026`  

This creates urgency and relevance without losing the specific date.

**Upside: MEDIUM**

### 10.2 Past-date handling

If `nextUpdate.date` is in the past (e.g., the briefing was yesterday and hasn't been rescheduled), the modal shows the past date with no indication it's overdue.

**PROPOSED:** When the date is past, show:

> `Overdue -- Wednesday, 9 April 2026`

With the date text in the warning colour `text-[#B84233]`.

**Upside: HIGH** -- A past-due briefing with no visual signal erodes the exact trust the portal is designed to build.

---

## 11. Tone Consistency Analysis

### Current tone map:

| Section | Register | Example |
|---------|----------|---------|
| Greeting | Warm-personal | "Good morning, Sarah." |
| Signal cards | Analytical-confident | "Promises kept", "2 of 3 delivered" |
| Pipeline | Operational-precise | Stage labels, day counters, progress bars |
| Commitments | Formal-accountable | Promise strings with check marks |
| Activity feed | Telegraphic-professional | "Interview scheduled: Dr. Mensah, 11 April." |
| Upcoming | Forward-looking | "Dr. Mensah: second interview, department head" |
| Modal footer | Institutional | "Briefings delivered every 5-7 working days" |

### Assessment:

The tonal variation is **appropriate and intentional**. Each section has a distinct register that matches its function:

- The greeting is warm because it's the first thing the client sees.
- The signal cards are analytical because they're data.
- The activity feed is telegraphic because it's a log.
- The commitments are formal because they're promises.

**One inconsistency:** The modal footer ("Briefings delivered every 5-7 working days") is impersonal-institutional, which clashes with the personal-accountable tone of the rest of the portal. The proposed change to "You receive a briefing every 5-7 working days" fixes this.

**Upside: MEDIUM**

---

## 12. The Screenshot Moment

**Question:** What would make a client screenshot this portal and send it to a colleague?

### Current closest candidate: The "Promises kept" signal card

`2 of 3 delivered` with a gold checkmark aesthetic and the label "Promises kept" is the most emotionally provocative element. It says: *our recruiter literally tracks their promises to us and shows us a scorecard.* 

### How to make it screenshot-worthy:

The missing piece is `closestToPlacement`. Imagine the signal card reading:

> **Promises kept**  
> 2 of 3 delivered  
> *Every promise kept* (when all are met)

Combined with a new contextual line somewhere prominent:

> **Nearest placement: Dr. James Okafor**  
> *Offer accepted -- starting 1 May*

A client seeing their recruiter's promise scorecard AND a named candidate with a confirmed start date -- that is the screenshot. It combines accountability (the scorecard) with outcome (the placement). 

The single change that gets closest to this with minimal effort: **surface `closestToPlacement` with the candidate's note** in a visible location.

**Upside: HIGH**

---

## Priority Summary

### Tier 1 -- Do immediately (HIGH upside):

| # | Change | Location |
|---|--------|----------|
| 7.1 | Surface `closestToPlacement` in UI | New sub-line in PipelineSection header or new signal |
| 2.1 | "All on track" to "Every promise kept" | ConfidenceSignals.tsx line 68 |
| 5 | Fix "0 days" / "1 day" inconsistency in signal card | ConfidenceSignals.tsx line 78 |
| 10.2 | Handle past-due briefing date in modal | UpdateLogModal.tsx |
| 1.1 | Engagement title format: "Hiring: 2 Senior Dentists" | Data convention |
| 4.1 | Commitment verbs: "Deliver 3 qualified candidates..." | Data convention |
| 1.10 | "actions" to "logged actions" | ConfidenceSignals.tsx line 79 |
| 2.2 | Zero-candidate sub-text | ConfidenceSignals.tsx |

### Tier 2 -- Do next (MEDIUM upside):

| # | Change | Location |
|---|--------|----------|
| 1.5 | "Coming Up" to "What Happens Next" | UpcomingSection.tsx |
| 1.8 | "Last movement" to "Last action" | ConfidenceSignals.tsx |
| 2.3 | Missing candidate notes: "In progress" | PipelineSection.tsx |
| 3 | Rewrite passive activity entries | igc-demo-001.ts |
| 5 | "Tomorrow" for 1-day-away briefing | DashboardHeader.tsx + ConfidenceSignals.tsx |
| 6 | Modal footer personalisation | UpdateLogModal.tsx |
| 10.1 | "Today" prefix in modal header | UpdateLogModal.tsx |
| 4.3 | "First candidate placed within 60 days" | Data |

### Tier 3 -- Polish (LOW upside):

| # | Change | Location |
|---|--------|----------|
| 1.4 | "Our Commitments to You" to "Our Commitments" | CommitmentsSection.tsx |
| 1.6 | "In play this week" to "Active this week" | ConfidenceSignals.tsx |
| 4.2 | "update" to "briefing" in commitment string | Data |
