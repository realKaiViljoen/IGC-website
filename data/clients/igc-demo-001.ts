// AUTO-GENERATED FROM data/schemas/igc-demo-001.yaml
// DO NOT EDIT BY HAND. Run `npm run compile-schema igc-demo-001` to regenerate.

import type { ClientData } from "@/types/client"

export const client: ClientData = {
  "uid": "igc-demo-001",
  "company": "Vantage Technology Pty Ltd",
  "contactName": "Thandi Nkosi",
  "contactEmail": "thandi@vantagetech.co.za",
  "role": "Chief People Officer",
  "engagement": {
    "title": "Mandate Acquisition Build — LinkedIn + CRM + Landing Page",
    "startDate": "2026-06-18",
    "day": 1,
    "totalDays": 30,
    "phase": "operate",
    "status": "active",
    "consultant": "K.C. Viljoen",
    "timezone": "Africa/Johannesburg",
    "stage_config": {
      "niche": "recruitment",
      "stages": [
        "Contacted",
        "Replied",
        "Qualified Intro",
        "Discovery Brief Held",
        "Mandate Brief Sent",
        "Mandate Signed",
        "Placement Sourced",
        "Closed"
      ],
      "guarantee_qualifier_label": "qualified mandate briefs",
      "qualified_stage_index": 3
    },
    "guarantee_target": 5,
    "data_source": "manual"
  },
  "prospects": [
    {
      "id": "p-001",
      "company": "Aurum Financial Services",
      "name": "Lerato Mahlangu",
      "role": "Head of Engineering",
      "stage": "Mandate Signed",
      "last_touch": "2026-07-29",
      "estimated_contract_value_cents": 1800000,
      "currency": "ZAR",
      "tier": 1
    },
    {
      "id": "p-002",
      "company": "Northbound Logistics",
      "name": "Pieter van der Merwe",
      "role": "COO",
      "stage": "Mandate Brief Sent",
      "last_touch": "2026-07-28",
      "estimated_contract_value_cents": 1250000,
      "currency": "ZAR",
      "tier": 2
    },
    {
      "id": "p-003",
      "company": "Meraki Digital Labs",
      "name": "Zinhle Dlamini",
      "role": "Engineering Director",
      "stage": "Discovery Brief Held",
      "last_touch": "2026-07-26",
      "estimated_contract_value_cents": 2200000,
      "currency": "ZAR",
      "tier": 1
    },
    {
      "id": "p-004",
      "company": "Harbourline Mining Services",
      "name": "Sipho Khumalo",
      "role": "People Director",
      "stage": "Discovery Brief Held",
      "last_touch": "2026-07-25",
      "estimated_contract_value_cents": 1500000,
      "currency": "ZAR",
      "tier": 2
    },
    {
      "id": "p-005",
      "company": "Crown Print & Design",
      "name": "Mpho Sibanda",
      "role": "Talent Lead",
      "stage": "Replied",
      "last_touch": "2026-07-23",
      "estimated_contract_value_cents": 800000,
      "currency": "ZAR",
      "tier": 3
    },
    {
      "id": "p-006",
      "company": "Helios Renewables",
      "name": "Karabo Mthembu",
      "role": "CTO",
      "stage": "Qualified Intro",
      "last_touch": "2026-07-21",
      "estimated_contract_value_cents": 2000000,
      "currency": "ZAR",
      "tier": 1
    },
    {
      "id": "p-007",
      "company": "Sable Retail Group",
      "name": "Naledi Mofokeng",
      "role": "Head of Talent",
      "stage": "Contacted",
      "last_touch": "2026-07-29",
      "estimated_contract_value_cents": 1000000,
      "currency": "ZAR",
      "tier": 3
    }
  ],
  "conversations": [
    {
      "id": "cv-001",
      "prospect_id": "p-003",
      "held_at": "2026-07-02",
      "qualified": true,
      "tier": 1,
      "qualification_notes": "Scaling engineering team from 14 to 22 by Q3. Previous agency missed on three roles. Ready to retain us on two mandates immediately.",
      "counts_toward_guarantee": true
    },
    {
      "id": "cv-002",
      "prospect_id": "p-004",
      "held_at": "2026-07-05",
      "qualified": true,
      "tier": 2,
      "qualification_notes": "Rotational mining-services staffing. Tight location constraints, but willing to pay premium for retained search. Mandate size 3 roles.",
      "counts_toward_guarantee": true
    },
    {
      "id": "cv-003",
      "prospect_id": "p-002",
      "held_at": "2026-07-08",
      "qualified": true,
      "tier": 2,
      "qualification_notes": "COO sponsoring. Logistics-tech niche, two operations leaders needed. Clean handover from incumbent partner.",
      "counts_toward_guarantee": true
    },
    {
      "id": "cv-004",
      "prospect_id": "p-001",
      "held_at": "2026-07-11",
      "qualified": true,
      "tier": 1,
      "qualification_notes": "Aurum moving to microservices. Needs a staff engineer and two seniors. Budgeted. Signed mandate on the second call.",
      "counts_toward_guarantee": true
    },
    {
      "id": "cv-005",
      "prospect_id": "p-006",
      "held_at": "2026-07-15",
      "qualified": true,
      "tier": 1,
      "qualification_notes": "Helios hiring a CTO's first engineering lead. Series B closed in March. Retained search agreed pending mandate paperwork.",
      "counts_toward_guarantee": true
    }
  ],
  "commitments": [
    {
      "promise": "LinkedIn sequence live within 7 days of kickoff",
      "due": "2026-06-25",
      "met": true,
      "met_at": "2026-06-24",
      "author": "kc"
    },
    {
      "promise": "HubSpot CRM configured and mandate pipeline imported within 5 days",
      "due": "2026-06-23",
      "met": true,
      "met_at": "2026-06-22",
      "author": "kc"
    },
    {
      "promise": "Mandate-brief landing page live within 10 days of kickoff",
      "due": "2026-06-28",
      "met": true,
      "met_at": "2026-06-28",
      "author": "kc"
    },
    {
      "promise": "5 qualified mandate briefs within 30 days",
      "due": "2026-07-18",
      "met": true,
      "met_at": "2026-07-15",
      "author": "kc"
    },
    {
      "promise": "Weekly Loom briefing every Friday during build month",
      "due": "2026-07-19",
      "met": true,
      "met_at": "2026-07-19",
      "author": "kc"
    },
    {
      "promise": "Reporting dashboard live by Day 14",
      "due": "2026-07-02",
      "met": true,
      "met_at": "2026-07-01",
      "author": "kc"
    }
  ],
  "activity": [
    {
      "date": "2026-07-29",
      "entry": "Sable Retail Group identified — 200-head retail group, no current retained partner. Added to sequence.",
      "actor": "automation",
      "source": "hubspot"
    },
    {
      "date": "2026-07-28",
      "entry": "Mandate brief sent to Northbound Logistics (2 operations leaders). Client review by Friday.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-07-26",
      "entry": "Discovery brief held with Meraki Digital Labs. 22-head engineering scale-up. Mandate paperwork drafted.",
      "actor": "kc",
      "source": "cal"
    },
    {
      "date": "2026-07-25",
      "entry": "Discovery brief held with Harbourline Mining Services. Rotational roles. Premium retained search agreed.",
      "actor": "kc",
      "source": "cal"
    },
    {
      "date": "2026-07-23",
      "entry": "Crown Print & Design replied to sequence. Agreed to an intro call next week.",
      "actor": "automation",
      "source": "lgm"
    },
    {
      "date": "2026-07-19",
      "entry": "Week 4 Loom briefing delivered. Pipeline: 5 mandate briefs qualified, 1 mandate signed.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-07-15",
      "entry": "Helios Renewables agreed retained search. Day 28. Guarantee met: 5 of 5 qualified mandate briefs.",
      "actor": "kc",
      "source": "cal"
    },
    {
      "date": "2026-07-11",
      "entry": "Aurum Financial Services signed first mandate on the second call. 3-role brief.",
      "actor": "kc",
      "source": "hubspot"
    },
    {
      "date": "2026-07-08",
      "entry": "Discovery brief held with Northbound Logistics. COO sponsoring. Clean handover from incumbent.",
      "actor": "kc",
      "source": "cal"
    },
    {
      "date": "2026-07-02",
      "entry": "Discovery brief held with Meraki Digital Labs. First qualified mandate brief of the engagement.",
      "actor": "kc",
      "source": "cal"
    },
    {
      "date": "2026-06-28",
      "entry": "Mandate-brief landing page live at vantagetech.co.za/mandates. Calendly embed confirmed.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-06-22",
      "entry": "HubSpot CRM configured. Mandate pipeline stages live. 120 prospects imported from Apollo.",
      "actor": "kc",
      "source": "manual"
    },
    {
      "date": "2026-06-18",
      "entry": "Engagement started. Kickoff call held. Outreach messaging approved by Thandi. Sequences authored in her voice.",
      "actor": "kc",
      "source": "manual"
    }
  ],
  "hypothesis_thread": [],
  "handover": [
    {
      "key": "outreach-sequences",
      "name": "LinkedIn outreach sequences",
      "state": "shipped",
      "shipped_at": "2026-06-24"
    },
    {
      "key": "crm-config",
      "name": "HubSpot CRM configuration",
      "state": "shipped",
      "shipped_at": "2026-06-22"
    },
    {
      "key": "copy-library",
      "name": "Copy library (sequence, DM, landing)",
      "state": "shipped",
      "shipped_at": "2026-06-26"
    },
    {
      "key": "prospect-list",
      "name": "Apollo prospect list (120 records)",
      "state": "shipped",
      "shipped_at": "2026-06-20"
    },
    {
      "key": "landing-page",
      "name": "Mandate-brief landing page",
      "state": "shipped",
      "shipped_at": "2026-06-28"
    },
    {
      "key": "sops-attestation",
      "name": "SOP attestation pack",
      "state": "ready-for-review"
    }
  ],
  "briefings": [
    {
      "id": "b-week-1",
      "week_of": "2026-06-17",
      "loom_url": "https://www.loom.com/share/placeholder-rec-week-1",
      "loom_duration_seconds": 264,
      "written_summary_md": "Day 4. Kickoff held Tuesday. Outreach messaging approved by Thandi, sequences authored in her voice. HubSpot CRM configured Friday, mandate pipeline stages live, 120 prospects imported from Apollo. Landing-page copy drafted for review over the weekend. Week 2 opens with LinkedIn sequence going live and landing page shipping by Day 10.",
      "authored_by_kc_at": "2026-06-21T15:10:00Z"
    },
    {
      "id": "b-week-2",
      "week_of": "2026-06-24",
      "loom_url": "https://www.loom.com/share/placeholder-rec-week-2",
      "loom_duration_seconds": 331,
      "written_summary_md": "Day 10. LinkedIn sequence live Monday, one day ahead of commitment. Mandate-brief landing page shipped Friday at vantagetech.co.za/mandates, Calendly embed confirmed. First reply cluster landed Thursday, two intros warming inside engineering-services ICP. No discovery briefs held yet. Next week targets first qualified brief.",
      "authored_by_kc_at": "2026-06-28T14:30:00Z"
    },
    {
      "id": "b-week-3",
      "week_of": "2026-07-01",
      "loom_url": "https://www.loom.com/share/placeholder-rec-week-3",
      "loom_duration_seconds": 397,
      "written_summary_md": "Day 15. First discovery brief held Tuesday with Meraki Digital Labs, qualified. Second brief held Friday with Harbourline Mining Services, qualified on premium retained search. Pipeline reads 2 of 5 against the guarantee at the midpoint. Northbound Logistics intro scheduled for Monday. Sequence reply rate holding at 3.1 percent.",
      "authored_by_kc_at": "2026-07-05T16:00:00Z"
    },
    {
      "id": "b-week-4",
      "week_of": "2026-07-15",
      "loom_url": "https://www.loom.com/share/placeholder-week-4",
      "loom_duration_seconds": 482,
      "written_summary_md": "Guarantee met Day 28. 5 of 5 qualified mandate briefs. 1 mandate signed (Aurum). Week 5 focus: convert two remaining signed mandates into placement-ready briefs.",
      "authored_by_kc_at": "2026-07-19T09:15:00Z"
    }
  ],
  "next_briefing": {
    "date": "2026-08-03",
    "description": "Week 7 review — 1 mandate signed, 2 briefs sent, 2 in discovery. Pipeline cumulative over guarantee target."
  }
}
