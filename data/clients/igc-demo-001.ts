import type { ClientData } from "@/types/client"

export const client: ClientData = {
  uid: "igc-demo-001",
  company: "Aperture Medical",
  contactName: "Sarah Lowe",
  contactEmail: "sarah@aperture.com",
  role: "Practice Manager",
  engagement: {
    title: "Senior Dentist — 2x Positions",
    startDate: "2026-03-01",
    status: "active",
    consultant: "Viljoen",
  },
  metrics: {
    placementsMade: 1,
    candidatesSubmitted: 8,
    interviewsBooked: 3,
    offersExtended: 2,
  },
  pipeline: [
    {
      id: "c-001",
      name: "Dr. James Okafor",
      stage: "offer-accepted",
      lastUpdate: "2026-04-07",
      note: "Starting 1 May",
    },
    {
      id: "c-002",
      name: "Dr. Priya Mensah",
      stage: "interviewing",
      lastUpdate: "2026-04-08",
    },
    {
      id: "c-003",
      name: "Dr. Luca Ferreira",
      stage: "submitted",
      lastUpdate: "2026-04-06",
    },
  ],
  commitments: [
    {
      promise: "3 qualified candidates submitted within 14 days",
      due: "2026-03-15",
      met: true,
    },
    {
      promise: "Written update delivered every Friday",
      due: "2026-04-11",
      met: true,
    },
    {
      promise: "First placement within 60 days",
      due: "2026-04-30",
      met: false,
    },
  ],
  activity: [
    {
      date: "2026-04-08",
      entry: "Interview scheduled for Dr. Mensah — confirmed for 11 April.",
    },
    {
      date: "2026-04-07",
      entry: "Offer accepted by Dr. Okafor. Start date confirmed 1 May.",
    },
    {
      date: "2026-04-03",
      entry: "Dr. Ferreira submitted. CV and references sent to Sarah.",
    },
    {
      date: "2026-03-28",
      entry: "Interview completed — Dr. Okafor. Positive feedback from clinic.",
    },
    {
      date: "2026-03-14",
      entry: "3 candidates submitted ahead of deadline.",
    },
  ],
  upcoming: [
    { date: "2026-04-11", description: "Dr. Mensah — second interview with department head" },
    { date: "2026-04-16", description: "Week 6 pipeline review & client briefing" },
    { date: "2026-04-25", description: "Dr. Ferreira — offer finalisation call" },
    { date: "2026-05-01", description: "Dr. Okafor — confirmed start date" },
  ],
  nextUpdate: {
    date: "2026-04-16",
    description: "Week 6 pipeline review",
  },
}
