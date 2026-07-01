import { describe, it, expect } from "vitest"
import { computeAnalytics } from "./analytics"
import type { ClientData } from "@/types/client"

const today = new Date().toISOString().split("T")[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
const oldDate = "2020-01-01"
const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

const mockClient: ClientData = {
  uid: "test-001",
  company: "Test Co",
  contactName: "Test User",
  contactEmail: "test@test.com",
  role: "Managing Director",
  engagement: {
    title: "Managed-Contract Build",
    startDate: "2026-03-01",
    day: 1,
    totalDays: 30,
    phase: "operate",
    status: "active",
    consultant: "K.C. Viljoen",
    timezone: "Europe/London",
    stage_config: {
      niche: "msp",
      stages: [
        "Prospect Identified",
        "Outreach Active",
        "Replied",
        "Discovery Booked",
        "Discovery Held",
        "Proposal Sent",
        "Negotiation",
        "Closed Won",
      ],
      guarantee_qualifier_label: "qualified managed-contract conversations",
      qualified_stage_index: 4,
    },
    guarantee_target: 5,
    data_source: "manual",
  },
  prospects: [
    {
      id: "p1",
      company: "Acme Ltd",
      name: "A",
      role: "MD",
      stage: "Closed Won",
      last_touch: today,
      estimated_contract_value_cents: 0,
      currency: "GBP",
    },
    {
      id: "p2",
      company: "Beta Ltd",
      name: "B",
      role: "Ops",
      stage: "Discovery Held",
      last_touch: yesterday,
      estimated_contract_value_cents: 0,
      currency: "GBP",
    },
    {
      id: "p3",
      company: "Gamma Ltd",
      name: "C",
      role: "CFO",
      stage: "Outreach Active",
      last_touch: oldDate,
      estimated_contract_value_cents: 0,
      currency: "GBP",
    },
  ],
  conversations: [],
  commitments: [
    { promise: "p1", due: "2026-03-15", met: true, author: "kc" },
    { promise: "p2", due: "2026-04-09", met: true, author: "kc" },
    { promise: "p3", due: "2026-04-30", met: false, author: "kc" },
  ],
  activity: [
    { date: today, entry: "Offer accepted" },
    { date: "2026-04-03", entry: "Discovery held" },
  ],
  hypothesis_thread: [],
  handover: [],
  briefings: [],
  next_briefing: { date: in7Days, description: "Week 6 review" },
}

describe("computeAnalytics", () => {
  it("counts only prospects touched within last 7 days", () => {
    const result = computeAnalytics(mockClient)
    expect(result.activeProspectsThisWeek).toBe(2)
  })

  it("counts met commitments correctly", () => {
    const result = computeAnalytics(mockClient)
    expect(result.commitmentsMetCount).toBe(2)
    expect(result.commitmentsTotalCount).toBe(3)
  })

  it("calculates days to next briefing", () => {
    const result = computeAnalytics(mockClient)
    expect(result.daysToNextUpdate).toBe(7)
  })

  it("identifies closest-to-contract by stage index", () => {
    const result = computeAnalytics(mockClient)
    expect(result.closestToContract?.name).toBe("Acme Ltd")
    expect(result.closestToContract?.stage).toBe("Closed Won")
  })

  it("returns null closestToContract for empty prospects", () => {
    const result = computeAnalytics({ ...mockClient, prospects: [] })
    expect(result.closestToContract).toBeNull()
  })

  it("counts last activity as today = 0 days ago", () => {
    const result = computeAnalytics(mockClient)
    expect(result.lastActivityDaysAgo).toBe(0)
  })
})
