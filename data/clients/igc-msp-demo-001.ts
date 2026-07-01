// AUTO-GENERATED FROM data/schemas/igc-msp-demo-001.yaml
// DO NOT EDIT BY HAND. Run `npm run compile-schema igc-msp-demo-001` to regenerate.

import type { ClientData } from "@/types/client"

export const client: ClientData = {
  "uid": "igc-msp-demo-001",
  "company": "Meridian Networks Ltd",
  "contactName": "James Carter",
  "contactEmail": "james@meridian.network",
  "role": "Managing Director",
  "engagement": {
    "title": "Managed-Contract Build — Outreach + CRM + Proposal Path",
    "startDate": "2026-06-16",
    "day": 1,
    "totalDays": 30,
    "phase": "launch",
    "status": "active",
    "consultant": "K.C. Viljoen",
    "timezone": "Europe/London",
    "stage_config": {
      "niche": "msp",
      "stages": [
        "Prospect Identified",
        "Outreach Active",
        "Replied",
        "Discovery Booked",
        "Discovery Held",
        "Proposal Sent",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
        "Nurture",
        "Disqualified"
      ],
      "guarantee_qualifier_label": "qualified managed-contract conversations",
      "qualified_stage_index": 4
    },
    "guarantee_target": 5,
    "data_source": "manual"
  },
  "prospects": [
    {
      "id": "p-001",
      "company": "Acme Logistics",
      "name": "Sarah Chen",
      "role": "CFO",
      "stage": "Discovery Held",
      "last_touch": "2026-06-29",
      "estimated_contract_value_cents": 3600000,
      "currency": "GBP",
      "tier": 1
    },
    {
      "id": "p-002",
      "company": "Northfield Engineering",
      "name": "David O'Connor",
      "role": "Operations Director",
      "stage": "Discovery Held",
      "last_touch": "2026-06-30",
      "estimated_contract_value_cents": 2800000,
      "currency": "GBP",
      "tier": 1
    },
    {
      "id": "p-003",
      "company": "Lowry Dental Group",
      "name": "Priya Patel",
      "role": "Practice Manager",
      "stage": "Discovery Booked",
      "last_touch": "2026-07-01",
      "estimated_contract_value_cents": 2200000,
      "currency": "GBP",
      "tier": 2
    },
    {
      "id": "p-004",
      "company": "Caldwell Accountants",
      "name": "Michael Caldwell",
      "role": "Managing Partner",
      "stage": "Replied",
      "last_touch": "2026-07-02",
      "estimated_contract_value_cents": 1800000,
      "currency": "GBP",
      "tier": 2
    },
    {
      "id": "p-005",
      "company": "Trinity Legal",
      "name": "Fiona Armstrong",
      "role": "Practice Director",
      "stage": "Replied",
      "last_touch": "2026-07-01",
      "estimated_contract_value_cents": 2400000,
      "currency": "GBP",
      "tier": 2
    },
    {
      "id": "p-006",
      "company": "Parkside Manufacturing",
      "name": "Robert Hargreaves",
      "role": "Operations Manager",
      "stage": "Outreach Active",
      "last_touch": "2026-07-02",
      "estimated_contract_value_cents": 4200000,
      "currency": "GBP",
      "tier": 1
    },
    {
      "id": "p-007",
      "company": "Ashford & Wren Architects",
      "name": "Nicola Ashford",
      "role": "Managing Partner",
      "stage": "Outreach Active",
      "last_touch": "2026-07-01",
      "estimated_contract_value_cents": 1400000,
      "currency": "GBP",
      "tier": 3
    },
    {
      "id": "p-008",
      "company": "Briarwood Care Homes",
      "name": "Thomas Reid",
      "role": "Finance Director",
      "stage": "Outreach Active",
      "last_touch": "2026-06-30",
      "estimated_contract_value_cents": 3000000,
      "currency": "GBP",
      "tier": 2
    }
  ],
  "conversations": [
    {
      "id": "cv-001",
      "prospect_id": "p-001",
      "held_at": "2026-06-29",
      "qualified": true,
      "tier": 1,
      "qualification_notes": "30-seat site in Leeds, current MSP contract expires July, complained about ticket SLA. Ready to quote.",
      "counts_toward_guarantee": true
    },
    {
      "id": "cv-002",
      "prospect_id": "p-002",
      "held_at": "2026-07-01",
      "qualified": true,
      "tier": 1,
      "qualification_notes": "22-seat firm outside Manchester, break-fix currently, growing to 35 by Q3. Wants vCIO service. Shortlist of 3.",
      "counts_toward_guarantee": true
    }
  ],
  "commitments": [
    {
      "promise": "Apollo prospect list (200 records) uploaded within 3 days",
      "due": "2026-06-18",
      "met": true,
      "met_at": "2026-06-18",
      "author": "kc"
    },
    {
      "promise": "HubSpot CRM configured with MSP pipeline stages by Day 5",
      "due": "2026-06-20",
      "met": true,
      "met_at": "2026-06-19",
      "author": "kc"
    },
    {
      "promise": "First outreach batch live by Day 7",
      "due": "2026-06-22",
      "met": true,
      "met_at": "2026-06-22",
      "author": "kc"
    },
    {
      "promise": "5 qualified managed-contract conversations within 30 days",
      "due": "2026-07-16",
      "met": false,
      "author": "kc"
    },
    {
      "promise": "Weekly Loom briefing every Thursday during build month",
      "due": "2026-07-02",
      "met": true,
      "met_at": "2026-07-02",
      "author": "kc"
    },
    {
      "promise": "Managed-contract proposal template delivered by Day 21",
      "due": "2026-07-06",
      "met": false,
      "author": "kc"
    }
  ],
  "activity": [
    {
      "date": "2026-07-02",
      "entry": "Week 3 Loom briefing delivered. Pipeline: 2 discovery calls held, 1 booked for next week, 2 replies warming.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-07-02",
      "entry": "Caldwell Accountants replied to Day-16 follow-up. Intro call requested next week.",
      "actor": "automation",
      "source": "lgm"
    },
    {
      "date": "2026-07-01",
      "entry": "Lowry Dental Group booked discovery call for 29 April via Cal.com.",
      "actor": "automation",
      "source": "cal"
    },
    {
      "date": "2026-07-01",
      "entry": "Discovery call held with Northfield Engineering (David O'Connor, Operations Director). Qualified — growing to 35 seats, vCIO need, shortlist of 3.",
      "actor": "kc",
      "source": "cal"
    },
    {
      "date": "2026-07-01",
      "entry": "Trinity Legal replied via LinkedIn sequence. Exploring managed services change in Q3.",
      "actor": "automation",
      "source": "lgm"
    },
    {
      "date": "2026-06-29",
      "entry": "Discovery call held with Acme Logistics (Sarah Chen, CFO). Qualified — 30 seats, Leeds site, SLA frustration with incumbent.",
      "actor": "kc",
      "source": "cal"
    },
    {
      "date": "2026-06-28",
      "entry": "Second outreach batch sent (100 prospects). Manufacturing + professional services segments.",
      "actor": "automation",
      "source": "gmail"
    },
    {
      "date": "2026-06-27",
      "entry": "First discovery call booked — Acme Logistics via Cal.com, held 20 April.",
      "actor": "automation",
      "source": "cal"
    },
    {
      "date": "2026-06-26",
      "entry": "Parkside Manufacturing, Briarwood Care Homes, Ashford & Wren Architects confirmed in outreach. Tier-2 signals (reply rate 2.4%).",
      "actor": "automation",
      "source": "gmail"
    },
    {
      "date": "2026-06-24",
      "entry": "Week 2 Loom briefing delivered. Pipeline: 1 discovery booked, 3 replies, 0 calls held.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-06-22",
      "entry": "First outreach batch live. 100 prospects contacted across LinkedIn + email sequences.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-06-19",
      "entry": "HubSpot CRM configured. 11-stage MSP pipeline live. 200 prospects imported from Apollo.",
      "actor": "kc",
      "source": "hubspot"
    },
    {
      "date": "2026-06-18",
      "entry": "Apollo prospect list (200 records) uploaded. ICP filters: 15–60 seats, UK North-West, no enterprise IT.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-06-17",
      "entry": "Outreach messaging approved by James. Sequence drafted in his voice. 2 revisions.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-06-16",
      "entry": "Engagement started. Kickoff call held. 30-day build plan agreed.",
      "actor": "kc",
      "source": "manual"
    }
  ],
  "hypothesis_thread": [],
  "handover": [
    {
      "key": "outreach-sequences",
      "name": "LinkedIn + email outreach sequences",
      "state": "in-progress"
    },
    {
      "key": "crm-config",
      "name": "HubSpot CRM configuration",
      "state": "in-progress"
    },
    {
      "key": "copy-library",
      "name": "Copy library (sequence, DM, proposal)",
      "state": "in-progress"
    },
    {
      "key": "prospect-list",
      "name": "Apollo prospect list (200 records)",
      "state": "in-progress"
    },
    {
      "key": "landing-page",
      "name": "Managed-contract landing page",
      "state": "not-started"
    },
    {
      "key": "sops-attestation",
      "name": "SOP attestation pack",
      "state": "not-started"
    }
  ],
  "briefings": [
    {
      "id": "b-week-1",
      "week_of": "2026-06-15",
      "loom_url": "https://www.loom.com/share/placeholder-week-1",
      "loom_duration_seconds": 287,
      "written_summary_md": "Day 3. Kickoff held Monday. Outreach messaging approved by James, sequences authored in his voice across two revisions. Apollo prospect list uploaded, 200 records, ICP locked on 15 to 60 seats across UK North-West. HubSpot CRM configured with the 11-stage MSP pipeline; 200 records imported and tagged. Week 2 opens with the first outreach batch going live on Day 7.",
      "authored_by_kc_at": "2026-06-18T17:20:00Z"
    },
    {
      "id": "b-week-2",
      "week_of": "2026-06-22",
      "loom_url": "https://www.loom.com/share/placeholder-week-2",
      "loom_duration_seconds": 358,
      "written_summary_md": "Day 10. First outreach batch went live Monday. 100 prospects contacted across LinkedIn and email sequences. Early reply signals concentrated in the manufacturing segment. Second batch sent Thursday, another 100 records. Three warm replies by Friday: Lowry Dental, Trinity Legal, Caldwell Accountants. First discovery call booked for Week 3. No calls held yet.",
      "authored_by_kc_at": "2026-06-25T16:45:00Z"
    },
    {
      "id": "b-week-3",
      "week_of": "2026-06-29",
      "loom_url": "https://www.loom.com/share/placeholder-week-3",
      "loom_duration_seconds": 412,
      "written_summary_md": "Day 17. 2 discovery calls held, both qualified (Acme Logistics, Northfield Engineering). 1 discovery booked for 29 April (Lowry Dental). 2 warm replies pending intro call. On-pace for guarantee.",
      "authored_by_kc_at": "2026-07-02T16:30:00Z"
    }
  ],
  "next_briefing": {
    "date": "2026-07-09",
    "description": "Week 4 review — pipeline velocity, proposal cadence for two qualified discoveries, next outreach batch."
  }
}
