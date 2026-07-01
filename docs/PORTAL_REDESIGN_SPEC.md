# The System — Portal Redesign Spec

Synthesis of a seven-lens agent pass (anxiety, information architecture, momentum
mechanics, two component audits, look-and-feel, reference research). This is the
single source of truth for the portal rebrand + experience redesign.

Last assembled: 2026-07-02.

---

## The one finding that reframes everything

The portal's **skeleton is right**: the Guarantee (N of 5) is the hero, Handover
makes ownership countable, Briefings carry K.C.'s voice, and the machinery for
honesty already exists (pre-outreach states, concede-before-claim hypothesis
threads, an 8-day briefing SLA). The gap is not structure. It is two things:

1. **The evidence layer is empty.** Every "receipt" is prose, not proof. No
   timestamps (dates only), no artifact links (every optional link field is
   populated in zero records), and the Pulse counts are regex guesses over free
   text. "Receipts over claims" is currently a claim.
2. **The Overview shows the dead-zone raw.** On Days 1–13 the guarantee reads
   `0 of 5`, and today that empty number appears with nothing dated beside it.
   That is the single sharpest progress-fear trigger in the product.

And the reframe that resolves "quiet is the feature" vs "must feel alive":

> **Quiet is achieved by removing chrome, not by removing life. Life comes from
> motion, freshness, and dated forward commitments on a still surface — never
> from color, decoration, or celebration. A quiet ledger of timestamped, named
> facts reads as more alive to this buyer than any animated gauge.**

The buyer cannot be reassured *by the software*. He is reassured only by
**evidence** (timestamped, named, sourced, drillable) and by **K.C.** (named,
dated, conceding before claiming). The moment the app itself tries to comfort
him (a banner, a badge, a score, a 🎉), it becomes the 51st agency and the
£3,500 reprices in his head.

---

## 1. What the dashboard must show

### 1.1 The hero, always
`N of 5 qualified conversations · Day X of 30 · pace-word`, above the fold on
every visit. The 5th square turning brass when met is the one signature moment
of the engagement. Numbers are white; only *achievement* is brass.

### 1.2 The dead-zone rule (highest-leverage single rule)
The muted `0 of 5` must **never appear in a viewport without a dated forward
commitment beside it.** Days 1–13 are when the buyer is rawest and the hero
number is structurally zero. The schedule around the number must be loud with
specifics even when the number is quiet.

### 1.3 Recomposed Overview (the daily-touch home)
Ordering principle: **committed future before logged past.**

| # | Section | Leads with | Why |
|---|---|---|---|
| 1 | Header — company, `Day N of 30 · phase` | day counter | Orients in the 30-day clock. No greeting banner. |
| 2 | Guarantee (compact) — `N of 5` + squares + pace | `N of 5` | The hero number; the brass-fill moment lives here. |
| 3 | **Next commitment (dated, forward)** — soonest unmet promise, K.C.'s voice | the promise + date | Sits directly under the guarantee so `0 of 5` is always paired with the dated thing that moves it. Kills the dead-zone. |
| 4 | System Pulse — today's cadence (or honest pre-outreach/empty state) | today's activity | Answers "is someone working for me today." Must degrade truthfully, never fake a timestamp. |
| 5 | **Since your last visit** — new events + guarantee delta since prior login | "+2 since Tuesday" | The daily-return hook; makes progress felt, not archived. (Needs new state.) |
| 6 | Weekly Briefing Card — latest Loom + amber-if-overdue SLA | latest briefing | The one place K.C.'s face appears; SLA proves consistency. |
| 7 | Activity tail — last 3–4 events, actor-distinct, "full log →" | most recent receipt | Receipts spine, tailed. The full log lives on its own surface. |

Moves vs today: promote a dated forward commitment to slot 3; **demote the
Handover Pack off home** (a Day-3 "0 of 6 shipped" under `0 of 5` reads as total
emptiness); tail the Activity Log instead of dumping the full spine; add the
"since last visit" delta.

### 1.4 Per-screen verdicts
- **Guarantee** — strongest screen. Each qualified conversation is individually
  inspectable (company, decision-maker, role, date, K.C.'s qualification note).
  Gap: the per-conversation source link (HubSpot / transcript) is empty. Highest-
  value link to populate.
- **Pipeline** — good ("M in the guarantee zone" ties volume to the promise).
  Gap: per-row HubSpot deal link. Watch: do not let `estimated_contract_value`
  become a headline "£X in pipeline" figure (HubSpot-shaped repricing signal).
- **Outreach + Deliverability** — both are Phase-3 empty "coming soon" doors.
  **29% of the nav opens to nothing** — the biggest IA credibility drag. Decision
  needed: hide until built, or fold real Pulse/cadence data in now.
- **Briefings** — doctrine-clean. Gap: surface the 8-day amber self-SLA.
- **Handover** — right shape ("X of 6"). Gap: every artifact link is empty; a
  "shipped" shelf with nothing to open is the no-lock-in promise unmet.

### 1.5 Cleanup surfaced by the audit
- **Two golds coexist** (`#C9922A` vs `#C78B28`) both claiming to be "the one
  accent." Unify on ember `#C78B28`.
- **`lib/analytics.ts`** (`effortSignalThisMonth`, `closestToContract`) is
  orphaned AND doctrine-violating (composite/effort metrics). Delete it.
- **Messages** redirects to a nonexistent route (redirect-to-404). Cut it.
- Divergent state vocabularies across handover surfaces (`IN PROG` vs
  `IN PROGRESS`, `OWNED` vs `TRANSFERRED`) and two LoomThumbnail components.

---

## 2. How it looks and feels (the igc-sa system, product register)

Strip the terminal costume; unify on Satoshi + oklch cool-black + one ember; let
motion and hairline craft — not color — carry liveness.

### 2.1 Tokens — two neutral layers (from `dark-tokens.css`)
| Role | oklch | Where |
|---|---|---|
| Sidebar / panel ground `canvas-deep` | `oklch(0.06 0.005 265)` | Chrome sits *below* the content plane |
| Working canvas | `oklch(0.10 0.006 265)` | The page the client reads |
| Card / row surface | `oklch(0.13 0.007 265)` | Guarantee card, briefing card, rows |
| Hover / second lift | `oklch(0.16 0.008 265)` | Row hover, drawer body |
| Hairline (structural) | `oklch(0.22 0.008 265)` | Every internal divider — the workhorse |
| Hairline (emphasized) | `oklch(0.32 0.008 265)` | Sidebar seam, table header underline |
| fg-strong / fg / fg-dim / fg-quiet | `0.98 / 0.92 / 0.80 / 0.72` (hue 80, warm) | Headlines → body → meta → labels |
| Ember (the one accent) | `oklch(0.68 0.13 75)` ≈ `#C78B28` | See Gold Rule |

Depth = background step + 1px hairline only. No shadows, no glow, no blur (one
drawer-scrim exception). Square corners on structural surfaces (`radius: 0`);
`radius-sm` 6px only on interactive controls.

### 2.2 Type — Satoshi only, fixed rem, ~1.2 ratio
`11 (eyebrow) → 12 (label) → 13 (body-sm) → 15 (body) → 16 (subsection) →
20 (section) → 28 (page-title)`; figure-hero (the guarantee N) 40px/700.
`font-variant-numeric: tabular-nums` on every count/time/date — **this is what
lets one family do the Bloomberg-ledger job the mono font used to do.**

### 2.3 The eyebrow (retires the `§` mono label)
Satoshi 500, 11px, `letter-spacing: 0.18em`, uppercase, `fg-quiet` (never brass).
No `§`, no `·` lead, no glyph. Optional index as a separate 700 span. Eyebrow +
one hairline is the section-opener unit.

### 2.4 Voice vs machine, without a serif (the key reconciliation)
- **K.C.'s authored words** → Satoshi **500**, `letter-spacing -0.01em`,
  `fg-strong`, with a 2px `border` left-inset (not brass).
- **Automation output** → Satoshi **400**, `fg-dim`, `tabular-nums`.
The glance-difference is weight + brightness + the quiet inset. Survives losing
Fraunces.

### 2.5 The Gold Rule for ember (brass ≤ 2 per viewport)
**Allowed:** the 5th guarantee square on met; the single primary CTA (Export);
the active-nav 1px underline; the focus ring (transient); the one self-SLA
caution word (`ember-dim`, on genuine breach only). **Banned:** eyebrows, labels,
column heads, any icon fill, any decorative line, any always-on figure, any
"good number" coloring, any glow/bloom/tint. On a normal Operate day with the
guarantee unmet, the only brass on screen is the active-nav underline.

### 2.6 Motion carries liveness (three speeds, ease-out-expo, no bounce)
- **150ms** affordances (hover, underline, focus, button fill).
- **300ms** reveals (section entrance `opacity + translateY(8→0)`; container
  fades, not per-row waterfalls; drawer slide).
- **400–600ms** the guarantee square fill only (`#FAF8F5 → #C78B28`, 500ms; then
  the subtext cross-fades to a flat stated line — no confetti, no scale).
- **Value updates** whisper-quiet: old value fades out 120ms, new fades/translates
  in 180ms, no color flash. Motion means something *actually happened*; a poll
  with no change animates nothing. Stillness is honest.

### 2.7 Craft / pleasure (non-decorative)
1px inset-aligned hairlines; tabular numerals everywhere; `:focus-visible` brass
ring; the peak mark once at the top of the sidebar (white, 20px, never recolored);
a single 2% fixed film-grain overlay (warms the flat black; no bloom); quiet
hover (bg step + text brighten, never brass); native cursor, no magnetic buttons.

### 2.8 Remove (the cheapeners)
The `§` glyph; the mono font entirely; the ticking `HH:MM` sidebar clock (HUD
cosplay + anxiety); the Pulse top/bottom mono-line frame; `lowercase` sentences;
Fraunces; the old gold `#C9922A`; the hand-picked legacy hexes; rounded cards;
all shadows/glow/bloom; per-row entrance staggers and highlight-then-fade.

---

## 3. How we defeat progress-fear (anti-FOMO)

Grounded in operational-transparency / labor-illusion research (Buell & Norton):
showing the work being done raises perceived value and trust — but only when the
work shown is *real*; fabricated or padded transparency backfires. So every
mechanism below converts felt progress into cited fact with a name and a time.

### 3.1 Empty-state doctrine (THE crux — four parts, in order)
A quiet screen must read as *handled / intentional / on track*, never
*abandoned*. Every empty state:
1. **State-as-fact** (quiet): `no batches yet today` / `0 of 5`.
2. **The reason** (prose, a human decided this): `Outreach begins Day 14, once
   mailbox warmup completes.`
3. **The scheduled change** (dated — the load-bearing line): `outreach begins
   day 14 · tue 7 may`.
4. **Provenance stamp** (proves it was checked, not neglected): `last checked
   09:14 utc · smartlead`.
Escalation: an empty state that *should* have filled flips to **amber self-SLA**
(like the briefing at 8 days). Neutral = on track; amber = K.C. already knows.
There is no third state where the client is left guessing.

### 3.2 Actor-distinct type = "a human moved today"
The single highest-leverage momentum signal at near-zero cost. A client scanning
the feed sees a mix of human (500-weight) and machine (400 tabular) lines today,
without reading a word. That mix *is* the proof of a principal-led operation.

### 3.3 Concede-before-claim on the bad week
Any declining metric shows the raw drop, and directly beneath it K.C.'s named,
dated hypothesis + fix: `Reply rate 1.8% this week, down from 3.1%. Hypothesis:
segment 3 burned. Swapping to segment 5, Mon 28 Apr. —K.C.` A bad week handled
this way builds more trust than a good week handled silently. The *app* must
never console; only K.C. interprets a bad number.

### 3.4 The daily and weekly metronomes
- **Daily:** the "since your last visit" delta + a current System Pulse. On a
  thin day it still names its next event (`outreach resumes 08:00 utc mon`), so
  a quiet day never reads as a dead portal.
- **Weekly:** the Briefing (Loom + K.C.'s written summary) is the heartbeat and
  the compelling reason to return; the 8-day amber SLA holds K.C. to it in the
  client's plain view. In Operate mode (the value cliff when the guarantee moves
  to past tense) this metronome + a cumulative-results view is what stops the
  portal reading as *finished while still billing*.

### 3.5 Receipts, not claims
Populate the link + timestamp fields so every number is drillable: the qualified
conversation opens its HubSpot deal; the shipped asset opens its artifact; the
activity row links its source. The `Export Everything` button and the openable
6-item Handover Pack are visible from Day 1 — the proof there's no cage is that
the door is always drawn open.

### 3.6 Reference patterns to borrow / avoid
**Borrow:** motion-signals-liveness (an indicator that animates while work runs
and stills when settled — Vercel status dot); color-is-never-the-only-signal
(every state also has a text label); feed row = actor + what + source + timestamp,
most-recent-first; "system works for you" = do the work silently, then show a
calm state change, never celebrate it. **Avoid:** watermelon reporting (green
over red), vanity/health scores, composite confidence gauges, fabricated
activity, streaks/badges/confetti, "Welcome back!".

---

## 4. Build order

**Track A — Visual rebrand (makes it read as our system).** Satoshi + oklch
tokens in `globals.css`; delete Fraunces/Geist/mono; kill `§`, the ticking clock,
the Pulse frame; unify the two golds → ember; build the shared primitives
(`Eyebrow`, `PageHeader`, the voice/automation treatments, tabular `Figure`),
peak in the sidebar, 2% grain, the three-speed motion; retime the guarantee fill
to 500ms/ember.

**Track B — IA + anxiety (makes it feel like progress).** Recompose the Overview
(§1.3); demote Handover off home; tail the Activity log; add the dead-zone rule;
standardize the four-part empty-state; decide the two empty doors; delete
`analytics.ts` + the Messages redirect.

**Track C — Evidence layer (makes receipts real).** Promote dates → ISO
datetimes; populate the link fields; a typed per-day event stream (replace regex
Pulse counts); `last_seen_at` for "since last visit"; a briefing SLA anchor;
attestation/export artifacts.

For a demo-login going live tonight, Track A + Track B on **enriched fixtures**
(add realistic timestamps + working artifact links to the demo client data) is
the fast path to "it reads as receipts." Track C's full backend is the follow-up.

---

## 5. Research validation + additions (reference pass)

The external research validated the whole thrust and added five mechanics worth
building in.

- **Labor illusion / operational transparency (Buell, Harvard).** Showing the
  real work raises perceived value and trust (measured: +8% value from naming the
  steps of a wait; +22% perceived quality when work is made visible; +16% from
  attaching a named human). **This is the scientific spine of "receipts over
  claims."** Two hard caveats: (a) it *backfires* if the process shown is weak or
  reads as surveillance — only put a window on work you're proud of; (b) frame
  every visible step as **client-serving, never self-justifying**: "we analysed
  14 competitors so your positioning is airtight," never "look how hard we
  worked." Self-justifying copy raises perceived self-orientation, the single
  most trust-destroying variable.
- **Author substance, automate logistics.** The cleanest rule from every agency-
  portal reference (Wayfront, Copilot, Basecamp). Silent state changes for
  housekeeping; a *notification only when K.C. authors something real*. Every
  ping the client gets is a genuine update, never a mechanical status flip. This
  keeps the surface quiet and makes each notification mean something.
- **Peak-end + timing (Bray et al., 4.68M deliveries).** Late silence is punished
  more than early silence. Do **not** let the portal go dark in the final stretch
  before Day 30, and engineer a deliberate, strong **delivery/handover moment**
  (the brass 5th-square fill, the handover pack resolving). The last interaction
  disproportionately sets the memory of the whole engagement.
- **The pausing clock (Wayfront).** When the ball is in the client's court, the
  countdown visibly pauses. Apply to commitments/guarantee: a promise waiting on
  the client's input shows "waiting on you," and that time never reads as IGC
  being slow. Quietly trains the client that delays are theirs, not ours.
- **Single source of truth (NN/G).** The portal must always be *more* current
  than a DM. If the client learns more by messaging K.C. than by opening the
  portal, the portal is dead weight. Operational rule: the portal updates first.
  Plus a low-granularity heartbeat on a fixed cadence beats silence — even
  "warmup running, first batch Monday" is worth more than a blank week.

Convergent external finding, quantified: clients churn because they feel
**forgotten and unsure what they paid for**, not because the work is bad
(agency data: ~1 client lost to bad work per ~11 lost to communication). The
portal's whole job is to defeat that feeling. And the buyer is himself an agency/
MSP owner, so the portal doubles as a live demonstration of the exact delivery
competence he sells, which makes it a referral engine.

## Open decisions for the operator
1. **The two empty nav doors (Outreach, Deliverability):** hide until built
   (recommended for tonight — 29% empty is the biggest credibility drag), or fold
   real Pulse/cadence data into them now?
2. **Tonight's scope:** Track A + B on enriched demo fixtures (recommended), or
   also begin the Track C data-model work?
3. **Confirm the voice mechanism:** all-Satoshi (K.C. = 500 + inset; automation =
   400 tabular), retiring mono entirely — or keep a light mono for pure machine
   telemetry?
