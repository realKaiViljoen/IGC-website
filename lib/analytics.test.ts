import { describe, it, expect } from "vitest"
import { computeAnalytics } from "./analytics"
import type { ClientData } from "@/types/client"

const today = new Date().toISOString().split("T")[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
const oldDate = "2020-01-01"
const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

const mockClient: ClientData = {
  uid: "test-001",
  company: "Test Clinic",
  contactName: "Test User",
  contactEmail: "test@test.com",
  role: "Manager",
  engagement: { title: "Senior Dentist", startDate: "2026-03-01", status: "active", consultant: "Viljoen" },
  metrics: { placementsMade: 1, candidatesSubmitted: 8, interviewsBooked: 3, offersExtended: 2 },
  pipeline: [
    { id: "c1", name: "Dr. A", stage: "offer-accepted", lastUpdate: today },
    { id: "c2", name: "Dr. B", stage: "interviewing", lastUpdate: yesterday },
    { id: "c3", name: "Dr. C", stage: "submitted", lastUpdate: oldDate },
  ],
  commitments: [
    { promise: "3 candidates in 14 days", due: "2026-03-15", met: true },
    { promise: "Weekly update", due: "2026-04-09", met: true },
    { promise: "Placement in 60 days", due: "2026-04-30", met: false },
  ],
  activity: [
    { date: today, entry: "Offer accepted" },
    { date: "2026-04-03", entry: "Interview completed" },
  ],
  upcoming: [],
  nextUpdate: { date: in7Days, description: "Week 6 review" },
}

describe("computeAnalytics", () => {
  it("counts only candidates updated within last 7 days", () => {
    const result = computeAnalytics(mockClient)
    expect(result.activeCandidatesThisWeek).toBe(2)
  })

  it("counts met commitments correctly", () => {
    const result = computeAnalytics(mockClient)
    expect(result.commitmentsMetCount).toBe(2)
    expect(result.commitmentsTotalCount).toBe(3)
  })

  it("calculates days to next update", () => {
    const result = computeAnalytics(mockClient)
    expect(result.daysToNextUpdate).toBe(7)
  })

  it("identifies closest-to-placement as highest stage candidate", () => {
    const result = computeAnalytics(mockClient)
    expect(result.closestToPlacement?.name).toBe("Dr. A")
    expect(result.closestToPlacement?.stage).toBe("offer-accepted")
  })

  it("returns null closestToPlacement for empty pipeline", () => {
    const result = computeAnalytics({ ...mockClient, pipeline: [] })
    expect(result.closestToPlacement).toBeNull()
  })

  it("counts last activity as today = 0 days ago", () => {
    const result = computeAnalytics(mockClient)
    expect(result.lastActivityDaysAgo).toBe(0)
  })
})
