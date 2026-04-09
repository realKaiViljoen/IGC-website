# IGC Client Portal — v1 Design Spec
**Date:** 2026-04-09
**Status:** Approved — ready for implementation

---

## Purpose

A password-protected client portal that positions IGC as a serious, accountable operator. Clients log in to see a live battle-map of their engagement — not a brochure, not a report PDF, not a WhatsApp update. A real dashboard that signals: *we know what we're doing and we have nothing to hide.*

This is a trust tool, not a transparency tool. Data is curated to build confidence, not to expose process metrics that invite second-guessing.

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **Auth:** next-auth v5, credentials provider
- **Styling:** Tailwind CSS v4, existing IGC design system (warm dark, Playfair Display + Inter)
- **Animation:** Framer Motion (consistent with rest of site)
- **Messaging:** CometChat (adapted from existing TS architecture)
- **Data:** Static TS files per client (`data/clients/[uid].ts`) — no database

---

## Auth

**Provider:** next-auth v5 credentials (email + password)

**Client registry:** `lib/auth/clients.ts`
- Array of client objects: `{ uid, email, hashedPassword }`
- Adding a client = one object added to the array
- Passwords hashed with bcrypt

**Session:** Stores `uid` — used to load correct client data file on every dashboard request

**Middleware:** `middleware.ts` protects `/portal/dashboard*` and `/portal/messages*`. Unauthenticated requests redirect to `/portal`.

---

## Routes

```
/portal                → Login page (redirects to /portal/dashboard if session active)
/portal/dashboard      → Protected client battle-map
/portal/messages       → Protected CometChat messaging interface
```

Nested under `/portal` intentionally — leaves room for lateral expansion (admin panel, documents, etc.) without architecture changes.

---

## Data Schema

One file per client at `data/clients/[uid].ts`. Filled manually by consultant, pushed to deploy.

```ts
type PipelineStage =
  | "sourced"
  | "submitted"
  | "interviewing"
  | "offer-extended"
  | "offer-accepted"
  | "placed"

type ClientData = {
  uid: string
  company: string
  contactName: string
  contactEmail: string
  role: string

  engagement: {
    title: string
    startDate: string        // ISO date
    status: "active" | "on-hold" | "complete"
    consultant: string
  }

  metrics: {
    placementsMade: number
    candidatesSubmitted: number
    interviewsBooked: number
    offersExtended: number
  }

  pipeline: Array<{
    id: string
    name: string
    stage: PipelineStage
    lastUpdate: string       // ISO date
    note?: string
  }>

  commitments: Array<{
    promise: string
    due: string              // ISO date
    met: boolean
  }>

  activity: Array<{
    date: string             // ISO date
    entry: string
  }>

  nextUpdate: {
    date: string             // ISO date
    description: string
  }
}
```

---

## Analytics Engine

`lib/analytics.ts` — pure function, computes confidence signals from raw schema at runtime. Never stored, never exposed as raw ratios.

**Surfaces:**
- Active candidates this week (pipeline entries updated in last 7 days)
- Commitments met (X of Y)
- Days to next update
- Last activity (most recent activity entry, days ago)
- Closest to placement (highest-stage candidate name + stage label)
- Effort signal (total activity entries this month)

**Principle:** No percentages, no conversion rates, no funnel drop-off. Anxiety-inducing metrics stay in internal tooling. The dashboard makes the client feel *reassured*, not *analytical*.

---

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR          │ MAIN CONTENT                                  │
│                  │                                               │
│ IGC logo         │ ┌─ Header ──────────────────────────────────┐ │
│                  │ │ Aperture Medical          Next update in   │ │
│ ● Dashboard      │ │ Senior Dentist — 2x       7 days  ──────  │ │
│ ○ Messages       │ │ Consultant: Viljoen        Apr 16          │ │
│                  │ └───────────────────────────────────────────┘ │
│                  │                                               │
│                  │ ┌─ Confidence Signals ──────────────────────┐ │
│                  │ │ 3 candidates    Commitments   Last        │ │
│                  │ │ active this     met: 4 of 4   activity:   │ │
│                  │ │ week            ✓              2 days ago  │ │
│                  │ └───────────────────────────────────────────┘ │
│                  │                                               │
│                  │ ┌─ Pipeline ────────────────────────────────┐ │
│                  │ │ Dr. Okafor    ●●●●●○  Offer accepted      │ │
│                  │ │ Dr. Mensah    ●●●○○○  Interviewing        │ │
│                  │ │ Dr. Patel     ●●○○○○  Submitted           │ │
│                  │ └───────────────────────────────────────────┘ │
│                  │                                               │
│                  │ ┌─ Commitments ─────────────────────────────┐ │
│                  │ │ ✓ 3 candidates submitted within 14 days   │ │
│                  │ │ ✓ Weekly update delivered every Friday    │ │
│                  │ └───────────────────────────────────────────┘ │
│                  │                                               │
│                  │ ┌─ Activity ────────────────────────────────┐ │
│                  │ │ Apr 7  Offer accepted — Dr. Okafor        │ │
│                  │ │ Apr 3  Interview completed — Dr. Mensah   │ │
│                  │ └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Design system:** Fully consistent with existing site — warm dark (`#080808` base), Playfair Display for company name and section headers, Inter for data. Gold (`#C9922A`) used only on active pipeline stage dots and commitment tick marks.

---

## Messaging (`/portal/messages`)

CometChat integration adapted from existing TS architecture. "Message your consultant" in sidebar nav. Simple 1:1 chat between client and consultant. No group channels in v1.

### Reference Feature

Either party can reference a dashboard element directly in a message — similar to swipe-to-reply, but for data. This keeps conversations contextual and eliminates "which candidate were you asking about?" ambiguity.

**How it works:**
1. User clicks the "Reference" button in the message composer (or clicks any dashboard element directly from the dashboard view)
2. Dashboard elements become selectable — cursor changes, elements highlight on hover
3. User clicks a target: a pipeline candidate card, a commitment row, a confidence signal card, or an activity entry
4. A reference preview card attaches to the composer showing the element type + summary (e.g. *"Dr. Okafor — Offer accepted"*)
5. Message sends with the reference block prepended — renders in chat as a compact quoted card above the message text, identical to both parties

**Reference types:**
- `pipeline` — candidate name + current stage
- `commitment` — promise text + met/unmet status
- `activity` — date + entry text
- `signal` — signal label + value (e.g. "Commitments met: 4 of 4")

**Data structure attached to message:**
```ts
type MessageReference = {
  type: "pipeline" | "commitment" | "activity" | "signal"
  label: string    // display title in the quoted card
  detail: string   // secondary line
  id?: string      // element ID for future deep-linking
}
```

This is stored as CometChat message metadata — no schema changes to client data files needed.

---

## What's NOT in v1

- Self-service signup (consultant creates all accounts)
- Admin panel (data updated by editing TS files and deploying)
- Magic link / passwordless auth (add Resend later)
- Multiple users per client account
- Document storage
- Real-time data sync
- Conversion metrics or funnel visualizations (intentionally excluded)
