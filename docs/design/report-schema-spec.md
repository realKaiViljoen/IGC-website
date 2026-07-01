# IGC Report Schema — Authoring Spec

**Audience:** K.C. (operator) and the future admin UI.
**Status:** Canonical. Every manual-data client is authored against this spec.
**Source of truth:** `/Users/viljoen/IGC-website/types/client.ts` — this document mirrors that type 1:1. If the two disagree, the TypeScript type wins and the compiler will catch it.

---

## Overview

A schema is a single YAML file at `data/schemas/{uid}.yaml` that encodes everything the client portal needs to render a client's engagement. The compiler (`scripts/compile-schema.mjs`) validates the schema, then writes `data/clients/{uid}.ts` — a typed TypeScript module that the dashboard imports.

The schema exists because most Phase 1 data comes from K.C., not from live integrations. We would rather K.C. author YAML in 10 minutes than edit a 300-line `.ts` by hand. In Phase 3 an admin UI will replace the YAML hand-off — but the schema shape and the compiler stay; only the authoring surface changes.

Two data modes:

- `data_source: manual` — the YAML schema is canonical. Dashboard reads from the compiled fixture.
- `data_source: live` — HubSpot / Cal / Gmail / Unipile are canonical. Dashboard reads from ingestion (Phase 2b).

A client is in exactly one mode at a time. Mixing is not supported.

---

## File location

`data/schemas/{uid}.yaml`

`uid` is a kebab-case string. It MUST match an entry in `/Users/viljoen/IGC-website/lib/auth/clients.ts` — otherwise the client cannot sign in and see their fixture. The compiler enforces that the `uid:` field inside the YAML matches the filename.

Examples:

- `data/schemas/igc-msp-demo-001.yaml`
- `data/schemas/igc-demo-001.yaml`

---

## Compiling

```bash
# One schema
npm run compile-schema -- igc-msp-demo-001

# All schemas in data/schemas/
npm run compile-schemas:all
```

On success:

```
Compiled data/schemas/igc-msp-demo-001.yaml → data/clients/igc-msp-demo-001.ts
```

On failure: a single line naming the file, the field path, and the problem; exit code 1; no destructive write.

Example validation error:

```
data/schemas/igc-msp-demo-001.yaml: prospects[3].stage — value "Discovered" not in stage_config.stages. Valid values: ["Prospect Identified","Outreach Active","Replied","Discovery Booked","Discovery Held","Proposal Sent","Negotiation","Closed Won","Closed Lost","Nurture","Disqualified"]
```

The output `.ts` file is auto-generated and diff-stable — do not edit it by hand.

---

## Required top-level fields

Every schema MUST include these top-level keys:

| Key | Type | Notes |
|---|---|---|
| `uid` | string | Must match filename and `lib/auth/clients.ts` mapping. |
| `company` | string | Client company name as it will render in the portal. |
| `contactName` | string | Primary contact. |
| `contactEmail` | string | Primary contact email. Auth mapping. |
| `role` | string | Primary contact's role, e.g. "Managing Director". |
| `engagement` | mapping | See "Engagement sub-schema" below. |
| `prospects` | list | May be empty. See "Prospects". |
| `conversations` | list | May be empty. See "Conversations". |
| `commitments` | list | K.C.'s commitments + their met state. |
| `activity` | list | The activity feed. |
| `hypothesis_thread` | list | K.C.'s hypothesis entries. Typically empty. |
| `handover` | list | The 6 handover pack items. |
| `briefings` | list | Weekly Loom briefings. |

Optional:

| Key | Type | Notes |
|---|---|---|
| `next_briefing` | mapping | `{ date, description }`. Optional. |

---

## Engagement sub-schema

```yaml
engagement:
  title: string                    # e.g. "Managed-Contract Build — Outreach + CRM + Proposal Path"
  startDate: YYYY-MM-DD            # ISO 8601 date
  day: integer >= 1                # Seed only; runtime recomputes from startDate. OK to leave as 1.
  totalDays: integer > 0           # Typically 30.
  phase: build | launch | operate | handover | archive
  status: active | on-hold | complete
  consultant: string               # "K.C. Viljoen" for all current engagements.
  timezone: string                 # IANA, e.g. "Europe/London", "Africa/Johannesburg".
  guarantee_target: integer > 0    # Typically 5.
  data_source: manual | live       # Defaults to "manual" if omitted.
  stage_config:
    niche: msp | recruitment
    stages:
      - "Prospect Identified"
      - "Outreach Active"
      - ...                        # Non-empty ordered list of stage names.
    guarantee_qualifier_label: string   # e.g. "qualified managed-contract conversations"
    qualified_stage_index: integer  # 0-based index into stages[]. Typically 4 (Discovery Held).
```

**Rules:**

- `timezone` must be a valid IANA name. The compiler does not check against `tzdata`; the portal does at render time. Use `Europe/London`, `America/New_York`, `Africa/Johannesburg` — not `GMT` or `BST`.
- `stages` is the full pipeline vocabulary. Every prospect's `stage` must be exactly one of these strings.
- `qualified_stage_index` must point at a valid index of `stages` (0-based). It marks the stage at which a prospect counts as qualified for the guarantee.

---

## Prospects

```yaml
prospects:
  - id: p-001                      # Unique within this schema. Use p-001, p-002, …
    company: Acme Logistics
    name: Sarah Chen
    role: CFO
    stage: Discovery Held          # MUST be one of engagement.stage_config.stages
    last_touch: 2026-04-20
    estimated_contract_value_cents: 3600000   # Minor units (pence / cents)
    currency: GBP | USD | ZAR
    tier: 1 | 2 | 3                # Optional
    hubspot_deal_url: string       # Optional
    apollo_id: string              # Optional
```

**Rules:**

- `id` must be unique in `prospects[]`. Convention: `p-001`, `p-002`, …
- `stage` must match one of `engagement.stage_config.stages` exactly — case and punctuation identical.
- `estimated_contract_value_cents` is in minor units. £36,000 → `3600000`. Use integers only.
- `tier` is `1`, `2`, or `3` if present. Any other value fails validation.

---

## Conversations

The Guarantee Tracker counts rows where `qualified: true AND counts_toward_guarantee: true`.

```yaml
conversations:
  - id: cv-001
    prospect_id: p-001             # MUST reference an existing prospects[].id
    held_at: 2026-04-20            # ISO 8601 date
    qualified: true                # Boolean
    counts_toward_guarantee: true  # Boolean
    tier: 1                        # Optional
    qualification_notes: >-        # Optional. Rendered in display serif (Fraunces italic).
      30-seat site in Leeds, current MSP contract expires July, complained about ticket SLA.
    transcript_url: string         # Optional
```

**Rules:**

- `prospect_id` MUST exist in `prospects[]` in the same schema. Cross-reference is enforced.
- Both `qualified` and `counts_toward_guarantee` must be present and boolean. A conversation that is `qualified: true` but `counts_toward_guarantee: false` is a held-after-Day-30 case (Cumulative Results, not the tracker).
- `id` must be unique in `conversations[]`. Convention: `cv-001`, `cv-002`, …

---

## Commitments

```yaml
commitments:
  - promise: Apollo prospect list (200 records) uploaded within 3 days
    due: 2026-04-09                # ISO 8601 date
    met: true                      # Boolean
    met_at: 2026-04-09             # REQUIRED when met is true; else omit.
    author: kc | client
```

**Rules:**

- If `met: true`, `met_at` must be present.
- If `met: false`, `met_at` must be absent or omitted.
- `author` is `kc` or `client`.

---

## Activity

Reverse-chronological by convention (most recent first) but the compiler does not enforce order — the UI sorts.

```yaml
activity:
  - date: 2026-04-23               # ISO 8601 date
    entry: >-
      Week 3 Loom briefing delivered. Pipeline: 2 discovery calls held, 1 booked for next week.
    actor: kc | automation | client         # Optional
    source: hubspot | lgm | gmail | cal | make | manual   # Optional
    link: string                   # Optional
```

**Rules:**

- `entry` is free-form prose. Voice rule from PRODUCT.md applies: count first, qualify second; no exclamation marks; no emojis.
- `actor` controls typographic rendering in the Activity Log. `kc` renders in Fraunces. `automation` and `client` render in Geist Mono.

---

## Hypothesis thread

Typically empty. Populated when the guarantee is behind and K.C. publishes his hypothesis inline. Text capped at 140 characters — this is a tweet-length constraint, deliberate.

```yaml
hypothesis_thread:
  - id: h-001
    created_at: 2026-04-24T09:30:00Z    # ISO 8601 date-time
    text: Reply rate 1.8% this week, down from 3.1%. Hypothesis - list segment 3 burned.
    fix_action: Swapping to segment 5 on Monday 28 Apr.
    fix_date: 2026-04-28
    author: kc                            # Always "kc"
```

**Rules:**

- `text.length <= 140`. The compiler rejects anything longer.
- `author` must be `"kc"`. No other value permitted.

---

## Handover

Exactly 6 items, one per canonical key. The keys ARE the 6-item Handover Pack. Missing keys are not an error (the compiler lets you ship a partial pack) but duplicate keys ARE an error.

```yaml
handover:
  - key: outreach-sequences
    name: LinkedIn + email outreach sequences
    state: not-started | in-progress | ready-for-review | shipped | transferred
    shipped_at: YYYY-MM-DD          # Optional
    transferred_at: YYYY-MM-DD      # Optional
    artifact_url: string            # Optional
```

**Canonical keys:**

- `outreach-sequences`
- `crm-config`
- `copy-library`
- `prospect-list`
- `landing-page`
- `sops-attestation`

Anything else fails validation.

---

## Briefings

One entry per weekly Loom briefing.

```yaml
briefings:
  - id: b-week-3
    week_of: 2026-04-20              # Monday of the briefing week.
    loom_url: https://www.loom.com/share/...
    loom_thumbnail: string           # Optional
    loom_duration_seconds: 412       # Optional integer
    written_summary_md: >-
      Day 17. 2 discovery calls held — both qualified (Acme, Northfield). 1 booked for 29 April.
    authored_by_kc_at: 2026-04-23T16:30:00Z
```

---

## next_briefing (optional)

```yaml
next_briefing:
  date: 2026-04-30
  description: Week 4 review — pipeline velocity, proposal cadence, next outreach batch.
```

---

## Constraints the compiler enforces

The compiler is strict. The list below is exhaustive; anything not enforced here is the portal's responsibility at render time.

1. **Shape.** All required top-level fields present. `engagement`, `stage_config`, every entry in each list must be a mapping.
2. **Enums.** `phase`, `status`, `data_source`, `currency`, `actor`, `source`, `author`, `niche`, handover `key`, handover `state` all matched against closed lists.
3. **Cross-references.** `conversations[].prospect_id` must reference an existing `prospects[].id`.
4. **Stage validity.** Every `prospects[].stage` must be in `engagement.stage_config.stages`.
5. **Index validity.** `stage_config.qualified_stage_index` must be a valid 0-based index into `stage_config.stages`.
6. **Uniqueness.** `prospects[].id` unique. `conversations[].id` unique. `handover[].key` unique.
7. **Dates.** All date strings are ISO 8601 (`YYYY-MM-DD` or full RFC3339). The compiler parses each — unparseable dates fail. Bare YYYY-MM-DD is preferred for readability.
8. **Lengths.** `hypothesis_thread[].text.length <= 140`.
9. **Booleans & integers.** `qualified`, `counts_toward_guarantee`, `met` are strictly boolean. Numeric fields (`totalDays`, `guarantee_target`, `day`, `estimated_contract_value_cents`, `tier`, `loom_duration_seconds`, `qualified_stage_index`) are strictly integers in their declared ranges.
10. **Commitment coherence.** `met: true` requires `met_at`. `met: false` rejects `met_at`.
11. **Default.** `engagement.data_source` defaults to `"manual"` if omitted.
12. **Filename match.** `uid:` inside the YAML must match the filename stem.

If any of these fail, the compiler prints a one-line error of the form:

```
{file}: {path} — {reason}
```

…and exits with code 1. No partial write. The existing `.ts` fixture is untouched.

---

## Complete example

A minimal MSP schema — copy, edit, compile.

```yaml
uid: igc-msp-acme-001
company: Acme Managed Services Ltd
contactName: Emma Fletcher
contactEmail: emma@acme.example.com
role: Managing Director

engagement:
  title: Managed-Contract Build — Outreach + CRM + Proposal Path
  startDate: 2026-05-05
  day: 1
  totalDays: 30
  phase: build
  status: active
  consultant: K.C. Viljoen
  timezone: Europe/London
  guarantee_target: 5
  data_source: manual
  stage_config:
    niche: msp
    stages:
      - Prospect Identified
      - Outreach Active
      - Replied
      - Discovery Booked
      - Discovery Held
      - Proposal Sent
      - Negotiation
      - Closed Won
      - Closed Lost
      - Nurture
      - Disqualified
    guarantee_qualifier_label: qualified managed-contract conversations
    qualified_stage_index: 4

prospects: []
conversations: []

commitments:
  - promise: Apollo prospect list uploaded within 3 days
    due: 2026-05-08
    met: false
    author: kc

activity:
  - date: 2026-05-05
    entry: Engagement started. Kickoff call held. 30-day build plan agreed.
    actor: kc
    source: manual

hypothesis_thread: []

handover:
  - key: outreach-sequences
    name: LinkedIn + email outreach sequences
    state: not-started
  - key: crm-config
    name: HubSpot CRM configuration
    state: not-started
  - key: copy-library
    name: Copy library (sequence, DM, proposal)
    state: not-started
  - key: prospect-list
    name: Apollo prospect list
    state: not-started
  - key: landing-page
    name: Managed-contract landing page
    state: not-started
  - key: sops-attestation
    name: SOP attestation pack
    state: not-started

briefings: []
```

Compile it:

```bash
npm run compile-schema -- igc-msp-acme-001
```

Add `igc-msp-acme-001` to `lib/auth/clients.ts` (email + bcrypt hash) and the client can sign in and see their portal.

---

## Voice check

All prose authored into a schema — `title`, `qualification_notes`, `promise`, `entry`, `written_summary_md`, `text` — renders in the portal. The portal's voice rules (PRODUCT.md §Voice) apply:

- Count then qualify. Numbers lead, prose subordinates.
- No exclamation marks in UI chrome.
- No emojis anywhere.
- No banned phrases ("Great work!", "at a glance", "streamline", "seamless", "effortless", etc.).
- K.C.-authored prose renders in display serif; automation in mono. Use `actor: kc` vs `actor: automation` deliberately.
- Em-dashes within clauses (like this one) are fine in long-form prose such as `written_summary_md` or `qualification_notes`. Do not use them as ornament in short UI strings like `title` or `name`.
