import type { ClientData } from "@/types/client"

export const client: ClientData = {
  uid: "igc-demo-001",
  company: "Vantage Technology",
  contactName: "Thandi Nkosi",
  contactEmail: "thandi@vantech.co.za",
  role: "Chief People Officer",
  engagement: {
    title: "Lead Data Engineer + 2 Senior DevOps Engineers",
    startDate: "2026-02-24",
    status: "active",
    consultant: "Viljoen",
  },
  metrics: {
    placementsMade: 1,
    candidatesSubmitted: 7,
    interviewsBooked: 4,
    offersExtended: 2,
  },
  pipeline: [
    {
      id: "c-001",
      name: "Sipho Dlamini",
      stage: "offer-accepted",
      lastUpdate: "2026-04-05",
      note: "Signed. Starting 1 May.",
    },
    {
      id: "c-002",
      name: "Ayanda Mokoena",
      stage: "offer-extended",
      lastUpdate: "2026-04-09",
      note: "Response due 11 April.",
    },
    {
      id: "c-003",
      name: "Fatima Al-Hassan",
      stage: "interviewing",
      lastUpdate: "2026-04-08",
      note: "CEO final round — 14 April, 10:00.",
    },
    {
      id: "c-004",
      name: "Brendan Swart",
      stage: "interviewing",
      lastUpdate: "2026-04-06",
      note: "Architecture panel — 15 April, 14:00.",
    },
    {
      id: "c-005",
      name: "Nomsa Vilakazi",
      stage: "submitted",
      lastUpdate: "2026-04-04",
    },
    {
      id: "c-006",
      name: "James Steyn",
      stage: "submitted",
      lastUpdate: "2026-03-28",
    },
    {
      id: "c-007",
      name: "Kagiso Sithole",
      stage: "sourced",
      lastUpdate: "2026-04-09",
      note: "7yrs DevOps, AWS + Azure certified. Assessing fit.",
    },
  ],
  commitments: [
    {
      promise: "5 qualified CVs within 14 days of mandate",
      due: "2026-03-09",
      met: true,
    },
    {
      promise: "All candidates background-cleared before submission",
      due: "2026-04-10",
      met: true,
    },
    {
      promise: "Interview debrief delivered within 24 hours",
      due: "2026-04-10",
      met: true,
    },
    {
      promise: "Written pipeline update every Monday",
      due: "2026-04-13",
      met: true,
    },
    {
      promise: "First placement within 45 days",
      due: "2026-04-10",
      met: true,
    },
    {
      promise: "Full team of 3 placed within 90 days",
      due: "2026-05-24",
      met: false,
    },
  ],
  activity: [
    {
      date: "2026-04-09",
      entry: "Offer extended to A. Mokoena. Verbal confirmation expected by 11 April.",
    },
    {
      date: "2026-04-09",
      entry: "K. Sithole identified — 7 years DevOps, AWS + Azure certified. Fit assessment in progress.",
    },
    {
      date: "2026-04-08",
      entry: "Final round confirmed: F. Al-Hassan — CEO interview, 14 April, 10:00.",
    },
    {
      date: "2026-04-06",
      entry: "Architecture panel confirmed: B. Swart — 15 April, 14:00.",
    },
    {
      date: "2026-04-05",
      entry: "S. Dlamini accepted offer. Contract signed. Start date: 1 May. First placement confirmed on Day 40.",
    },
    {
      date: "2026-04-03",
      entry: "Background check cleared for A. Mokoena. Offer letter drafted and sent to Thandi for approval.",
    },
    {
      date: "2026-04-01",
      entry: "N. Vilakazi submitted. Senior DevOps, 6 years Kubernetes and GCP. CV and references sent.",
    },
    {
      date: "2026-03-28",
      entry: "J. Steyn submitted — second profile in DevOps stream. Awaiting Thandi's feedback.",
    },
    {
      date: "2026-03-25",
      entry: "S. Dlamini: final interview completed. Strong technical alignment. Offer recommendation sent.",
    },
    {
      date: "2026-03-20",
      entry: "Week 4 pipeline briefing delivered. 3 candidates active in process. No blockers.",
    },
    {
      date: "2026-03-14",
      entry: "F. Al-Hassan and B. Swart advanced to first interview. Scheduling underway.",
    },
    {
      date: "2026-03-09",
      entry: "5 qualified CVs submitted — 1 day ahead of commitment deadline.",
    },
  ],
  upcoming: [
    { date: "2026-04-11", description: "A. Mokoena: offer response deadline (Day 3 of 5)" },
    { date: "2026-04-14", description: "F. Al-Hassan: CEO final interview — 10:00, virtual" },
    { date: "2026-04-15", description: "B. Swart: architecture panel — 14:00, on-site Sandton" },
    { date: "2026-04-17", description: "Week 7 pipeline review & briefing with Thandi" },
    { date: "2026-04-25", description: "J. Steyn: follow-up call — awaiting feedback since 28 March" },
  ],
  nextUpdate: {
    date: "2026-04-17",
    description: "Week 7 review — 2 offers in flight, 1 confirmed start, 2 final interviews",
  },
}
