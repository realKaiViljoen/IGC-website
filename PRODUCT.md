# IGC — Product Context (Canonical)

**Last updated:** 2026-04-24
**Owner:** K.C. Viljoen
**Primary codebase:** `/Users/viljoen/IGC-website` (Next.js 15, App Router, Tailwind v4, NextAuth v5, Framer Motion 11)
**Scope of this file:** The product — the client portal, "The System." This is the surface the paying client logs into.

---

## Register

**product**

The client portal is product, not brand. Design SERVES operations. Every pixel either delivers useful information, reduces specific buyer anxiety, signals premium quality that justifies the price, or reinforces the brand posture. Pixels that do none of those four things do not belong.

(The marketing site at `igc-growth.com` is the brand register. Different file, different doctrine. Do not mix the two.)

---

## Product Purpose

"The System" is the named client portal for agencies and MSPs who have paid IGC for the 30-day Build + optional monthly retainer. It is the daily-touch surface where the client verifies that what they paid for is being built, that the guarantee is tracking, and that their ownership transfer on day 30 is real.

Three operating modes, one codebase:
- **Build (Days 1–30).** Client anxiety: "Is this real? Is someone working on my behalf today?" Portal answers: sprint progress, deliverable artifacts, K.C.'s commitments, the guarantee tracker starting to fill.
- **Operate (Month 2+, on retainer).** Client anxiety: "What's happening this week? Am I paying for air?" Portal answers: live system pulse, BD pipeline, weekly operator briefing, cumulative results.
- **Handover (Day 30 forward).** Client anxiety: "Do I actually own this? Can I leave without losing everything?" Portal answers: handover pack (6 items shipped), signed attestation PDF, Export Everything button, frictionless End Access path.

---

## Users

**Primary user:** The paying client — the agency or MSP owner. Single human, not a team.

- **Demographic:** 35–55. Owner-operator of an independent firm (5–50 employees). UK primary market; US and (preserved) SA secondary.
- **Industry:** Independent IT MSPs (primary, post-pivot). Independent recruitment agencies (preserved niche on the same codebase via `stage_config` string configuration).
- **State of mind when logging in:** Just paid £3,500. Monday morning. Asking — consciously or not — *"Was I an idiot to pay for this?"* Every pixel must help answer "no."
- **Pattern-match sensitivity:** High. This buyer has been pitched by 50+ agencies in their career. Is trained to detect inauthenticity signals — AI-tone copy, em-dash ornament, emoji greetings, confetti, gamification, "Welcome back!" banners, generic success scores. Any of those signals reprices the £3,500 offer downward in their head.
- **Technical comfort:** Medium. Can read a dashboard. Cannot be expected to assemble a CRM from configurable widgets. Does not want to "configure their workspace."
- **Audiences for the dashboard beyond the user:** The partner at home ("show me what you bought"). Their own engineers/billers ("this is our new client acquisition infrastructure"). Their accountant ("this is what £3,500 + £1,750/mo bought"). A peer they may refer ("look at the portal they give you"). The dashboard is a permanent sales asset.

**Secondary user:** K.C. Viljoen — operator. Reads the portal daily as the person doing the work. His admin surface is at `/portal/admin/*`, gated to his email only. Separate surface, separate doctrine — the client does not see operator diagnostics (LinkedIn SSI scores, reply-rate funnel leakage, mid-funnel mechanics); those live in admin view only.

---

## Brand (Voice, Tone, Posture)

**One-line identity:** IGC is an **infrastructure operator**, not a marketing agency, not a growth hacker, not a 2016 playbook shop. The portal should feel like the product dashboard of a company that is genuinely ahead — not visually loud, not trying to impress with effects, but **unmistakably capable**. Every interaction should make the client feel: *"These people know what they're doing."*

**Eight non-negotiable principles:**

1. **The Gold Rule, applied to the whole portal.** Restraint creates rarity creates meaning. Gold (`#C9922A`) appears 4–6 times per 30-day engagement lifecycle — most notably when the guarantee's 5th square fills. Everything else is warm-dark and cream.
2. **Receipts over claims.** Every number has a source link. Every action has a timestamp AND a named actor. No composite metrics. No "health scores." No synthetic confidence.
3. **Concede before claim.** Bad numbers show. K.C.'s hypothesis and fix date appear inline, in display serif, under the raw counter. The willingness to display the failure IS the brand — hiding it kills it.
4. **The operator vs the operation.** K.C.'s face appears in exactly ONE place — the Loom thumbnail on the weekly Briefing Card. Never as a sidebar chip, footer widget, or "your consultant" avatar. When he is not speaking, his quiet absence is the brand.
5. **Quiet is the feature.** No greeting banner. No celebration copy. No "Welcome back!". No onboarding modal. The portal opens to work.
6. **Principal-authored vs automated content, visually distinct.** Anywhere K.C. types: Fraunces (display serif, italic for voice moments). Anywhere automation writes: Geist Mono with tabular-nums. The two are visibly different at a glance. This is the single highest-leverage brand rule at near-zero cost.
7. **No-lock-in, in software form.** `Export Everything` is persistent from Day 1, not just Day 30. Frictionless End Access with auto-triggered final export. The positioning claim becomes tangible pixel-by-pixel.
8. **The 55-year-old-owner test.** Every design decision passes: *"Does this make him feel like he bought something serious from a principal-led operator, or does it make him feel like he's using another SaaS?"*

**Voice rules (UI chrome specifically):**

- Count, then qualify. Numbers lead. Prose subordinates.
- State what happened. Do not celebrate it. `"3 of 5 conversations booked."` Not `"Great — 3 down! 🎉"`.
- Attribute everything. Every number has a source link. Every action has a name and a timestamp.
- Concede before claiming. `"Reply rate 1.8% this week, down from 3.1%. Hypothesis: list segment 3 burned. Swapping to segment 5 Mon 28 Apr. —K.C."`
- No exclamation marks in UI chrome. Zero. No em-dashes as ornament (natural clause rhythm in long-form briefings is allowed; in UI labels, replace with commas, colons, periods).
- No emoji anywhere in the portal surface.
- The app does not have a personality. K.C. does.
- Banned phrases: `"Great work!"` `"Keep it up!"` `"Let's do this!"` `"Pro tip:"` `"Oops!"` `"Welcome back!"` `"at a glance"` `"streamline"` `"empower"` `"unlock"` `"leverage"` `"seamless"` `"level up"` `"effortless"`.

---

## Anti-References (Do Not Resemble)

The archetypes that would reprice the £3,500 offer downward by pattern-match. Each is listed with the specific patterns it brings:

- **Sales CRM (HubSpot, Salesforce, Pipedrive)** — Deal Kanban columns with drag-to-advance, forecast revenue gauges, colored stage chips. Client already pays for HubSpot; a HubSpot-shaped portal reads as a skin on what they already own.
- **Agency PM tools (Monday, Asana, ClickUp)** — Gantt timelines, task assignees, swim lanes, comment threads. Implies a team (IGC is one operator) and recasts the relationship as client/vendor.
- **Productised "success-score" dashboards (Intercom, Drift, Gainsight)** — Health scores, gauges, ring meters, "You're doing great!" tiles, gamified streaks/badges. The UI signature of low-touch SaaS that cannot afford humans.
- **Crypto / AI-tool / dev-infra glow (Linear copies, generic dark dashboards)** — Gradient line charts, glowing dots, neon accents, animated mesh backgrounds, "AI-powered insights" panels, purple-to-blue gradients. Reads as hype.
- **Consumer fintech (Monzo, Revolut, Cash App)** — Emoji-headline pairs, "Hey [firstName]! 👋", rounded playful cards, confetti. Reads as not-serious.
- **Platform admin (WordPress, cPanel, Shopify)** — 12-tab sidebars, "Getting Started (3/7)" checklists, admin-grey chrome, dense-but-cheap table rows with tiny action buttons. Reads as retail SaaS.
- **AR-cockpit / sci-fi HUD (Cyberpunk menus, Apex HUDs, Arc splash pages, mission-control)** — Radar sweeps, cyan glow, animated grids, bar-meter pulses, etched bezels, synthetic-serif display fonts. Reads as junior-dev-with-Tailwind.

---

## Reference Set (Do Resemble)

The aesthetic target is **institutional trading desk — Bloomberg terminal modernized — warm operator-dark**, carrying the register of **institutional investment management**. Concretely:

- **Allan Gray, Baillie Gifford, Oaktree Capital, Ruane Cunniff, the FT weekend long-read layout.** Institutional-investment-management register. Quiet confidence. Editorial serif display. Generational-wealth gravitas. This is the luxury layer the "Bloomberg + Linear + Mercury" set doesn't carry alone.
- **Bloomberg Terminal** — tabular-nums everywhere, monospace density, live log streams, every pixel a receipt.
- **Linear / Vercel / Resend / Mercury** — warm-dark editorial restraint, 1px strokes, unified activity feeds, keyboard-first.
- **Raycast / Superhuman / Warp / Cron** — keyboard shortcuts are the brand. `⌘K` as the primary surface.
- **Things / Obsidian / Arc** — editorial density, typographic precision, quiet power.

**Typography stack (binding):** Fraunces (editorial serif display, `opsz` + `SOFT` axes) + Geist (body sans) + Geist Mono (telemetry / tabular-nums). Matches the marketing site at `igc-growth.com` — one cross-brand family from long-read headline to machine ledger.

What this means operationally:
- Dense information, not card grids.
- Tabular numerals locked on every figure.
- 1px hairline borders; zero decorative glow.
- Motion ceiling: 150–250ms for affordances, 400–600ms for section entries, nothing longer. Opacity + translateY only. No spring. No bounce. No glow pulse.
- Empty states as declarative editorial prose, never illustrations.
- Loading states as 1px shimmer lines or static mono timestamps (`"Loading — HubSpot · 11:04:22 UTC"`). No skeletons. No spinners.
- Errors as mono inline text with named-human escalation: `"HubSpot API 500 at 09:14. Retrying every 30s. If unresolved by 10:00, K.C. pages himself at hello@igc-growth.com."` No red banners. No apologies from the software.

---

## Strategic Principles

**1. The dashboard is a brand artifact, not a SaaS utility.**
It is priced into the £3,500 + £1,750/mo engagement. Quality perception here underwrites quality perception everywhere. A cheap-SaaS-register portal reprices the whole offer.

**2. Niche-agnostic data model.**
`stage_config` is a per-engagement string array. MSP clients get `["Prospect Identified", "Outreach Active", "Replied", "Discovery Booked", "Discovery Held", "Proposal Sent", "Negotiation", "Closed Won" …]`. Recruitment clients get their own stage vocabulary. Same UI, different labels. Zero per-niche code forks.

**3. Principal-led made literal in the pixels.**
K.C. is the only named human. His face appears exactly once. His typed words render in display serif; automation renders in DM Mono. The dashboard does not speak in first person.

**4. The guarantee is the single most important number.**
`N of 5 qualified conversations · Day X of 30 · on pace | behind | ahead`. Above the fold, always. The 5th square turning gold when met is the signature moment of the entire engagement — maximum emotional weight through maximum restraint.

**5. Transparency is the trust architecture.**
Every automated number has a source. When an API fails, the portal names which, when, why, and who to call. When K.C. misses a weekly briefing target, the Briefing Card turns amber after 8 days — a visible self-SLA.

**6. No-lock-in in software form.**
`Export Everything` is a persistent top-right action, not a buried settings item. The 6-item Handover Pack Status is visible from Day 1, not unlocked on Day 30. The claim `"yours from the start"` is tangible.

**7. Two surfaces, strictly separated.**
Client surface: outcomes and evidence-of-activity. Operator surface (`/portal/admin/*`): diagnostics, mid-funnel metrics, LinkedIn SSI, warmup controls, raw API. A client never sees operator tooling. Mixing the two cheapens both.

**8. Impeccable doctrine is the design gate.**
No `frontend-design` skill invocations on this codebase, ever. All design work runs through `$impeccable` sub-commands. Absolute bans (side-stripe borders >1px, gradient text, glassmorphism default, hero-metric template, identical card grids, modals-first, em-dashes) are enforced.

---

## Phase Scope

**Phase 0 (Foundation, 2 days):** Re-enable auth guards (commented out in layout.tsx + dashboard/page.tsx). Fix SAST timezone bug in `DashboardHeader.getConsultantStatus()`. Rename `/portal/dashboard` → `/portal/overview`. Delete "Engagement Health" 5-dot bar in Sidebar. Rewrite `types/client.ts` to niche-agnostic schema. Reconcile DESIGN.md v2 canonical tokens against HANDOFF-documented drift.

**Phase 1 (Must-ships, Week 1):** Guarantee Tracker (the hero feature end-to-end). Pipeline re-alignment to BD stages. Activity Log upgrade (tail-follow, date dividers, actor-distinct rendering). Handover Pack Status card. Weekly Briefing Card with 8-day amber SLA. Export Everything. System Pulse inline sentence.

**Phase 2 (Backend plumbing, Weeks 2–3):** HubSpot webhook + 5-min poll fallback. Cal.com webhook → Conversation creation. Gmail per-mailbox counter. LGM/Unipile poller. Make.com event ingestion. K.C. admin UI. Event log schema.

**Phase 3 (Quality saturation, Weeks 3–4):** Command palette (`cmdk`). Prospect side-drawer peek. Deliverability view. Keyboard shortcuts + `?` overlay. 1px shimmer loading. Editorial empty states. Named-escalation error component. Days Ruler.

**Phase 4 (Late, Month 2+):** Cumulative Results View. Signed Attestation archive. 90-day read-only post-handover state. Shareable read-only referral link (opt-in).

---

## Integration Inventory

| Source | Purpose | Cadence | Criticality |
|---|---|---|---|
| HubSpot | Deal stages, qualified flag, pipeline truth | Webhook + 5-min poll | **Central. If HubSpot dies, the portal dies.** |
| Cal.com | Booked discovery calls → Conversation rows | Webhook | High |
| Gmail / Smartlead | Per-mailbox send / reply / bounce | 15-min poll | High |
| LGM / Heyreach / Unipile | LinkedIn outreach, connections | 15-min poll, rate-limited | Medium (fragile) |
| Apollo | Cohort list load | Once per cohort | Load-time only |
| Loom | Weekly briefing thumbnail, duration, permalink | Manual paste or API | Weekly |
| Make.com | Automation event emissions | Webhook | Supplementary |
| K.C. admin UI | Manual authoring: commitments, handover state, briefing text, hypothesis annotations | On demand | **Critical dual-write partner.** |

---

## Success Definition

In the first engagement cohort (Q2 2026, UK IT MSPs):

1. Every client reaches Day 30 with a completed Handover Pack, a signed attestation PDF, and a working `Export Everything` download.
2. The Guarantee Tracker's 5th square turns gold before Day 30 for at least 4 of 6 clients.
3. No client reports a dashboard quality issue that affects their perception of the engagement price.
4. The portal is referred to as "the system" by clients (signal of the named framing taking hold).
5. At least one client screenshots the portal to show a peer. (Track via referrals received attributing to "they showed me the portal.")
