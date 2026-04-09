import type { ClientData, AnalyticsResult, PipelineStage } from "@/types/client"

const STAGE_ORDER: PipelineStage[] = [
  "sourced",
  "submitted",
  "interviewing",
  "offer-extended",
  "offer-accepted",
  "placed",
]

export function computeAnalytics(client: ClientData): AnalyticsResult {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const activeCandidatesThisWeek = client.pipeline.filter(
    (c) => new Date(c.lastUpdate) >= sevenDaysAgo
  ).length

  const commitmentsMetCount = client.commitments.filter((c) => c.met).length
  const commitmentsTotalCount = client.commitments.length

  const nextUpdateDate = new Date(client.nextUpdate.date)
  const daysToNextUpdate = Math.max(
    0,
    Math.ceil((nextUpdateDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  )

  const sortedActivity = [...client.activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const lastActivityDaysAgo =
    sortedActivity.length > 0
      ? Math.floor(
          (now.getTime() - new Date(sortedActivity[0].date).getTime()) /
            (24 * 60 * 60 * 1000)
        )
      : 0

  const closestToPlacement = client.pipeline.reduce<{
    name: string
    stage: PipelineStage
  } | null>((best, candidate) => {
    const currentIndex = STAGE_ORDER.indexOf(candidate.stage)
    const bestIndex = best ? STAGE_ORDER.indexOf(best.stage) : -1
    return currentIndex > bestIndex
      ? { name: candidate.name, stage: candidate.stage }
      : best
  }, null)

  const effortSignalThisMonth = client.activity.filter(
    (a) => new Date(a.date) >= startOfMonth
  ).length

  return {
    activeCandidatesThisWeek,
    commitmentsMetCount,
    commitmentsTotalCount,
    daysToNextUpdate,
    lastActivityDaysAgo,
    closestToPlacement,
    effortSignalThisMonth,
  }
}
