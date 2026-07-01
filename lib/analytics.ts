import type { ClientData, AnalyticsResult } from "@/types/client"

const MS_PER_DAY = 86400000

/**
 * Compute the small set of derived numbers the Overview page needs at a glance.
 *
 * Niche-agnostic: stages come from `client.engagement.stage_config.stages`,
 * so MSP and recruitment clients both render through this single path.
 */
export function computeAnalytics(client: ClientData): AnalyticsResult {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * MS_PER_DAY)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const stages = client.engagement.stage_config.stages

  const activeProspectsThisWeek = client.prospects.filter(
    (p) => new Date(p.last_touch).getTime() >= sevenDaysAgo.getTime(),
  ).length

  const commitmentsMetCount = client.commitments.filter((c) => c.met).length
  const commitmentsTotalCount = client.commitments.length

  const daysToNextUpdate = client.next_briefing
    ? Math.max(
        0,
        Math.ceil(
          (new Date(client.next_briefing.date).getTime() - now.getTime()) / MS_PER_DAY,
        ),
      )
    : 0

  const sortedActivity = [...client.activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const lastActivityDaysAgo =
    sortedActivity.length > 0
      ? Math.max(
          0,
          Math.floor(
            (now.getTime() - new Date(sortedActivity[0].date).getTime()) / MS_PER_DAY,
          ),
        )
      : 0

  // Closest to contract: the prospect whose stage has the highest index in stage_config.stages.
  // Unknown stages (index === -1) are excluded so they can't outrank a real stage.
  const closestToContract = client.prospects.reduce<{
    name: string
    stage: string
  } | null>((best, prospect) => {
    const currentIndex = stages.indexOf(prospect.stage)
    if (currentIndex < 0) return best
    const bestIndex = best ? stages.indexOf(best.stage) : -1
    return currentIndex > bestIndex
      ? { name: prospect.company, stage: prospect.stage }
      : best
  }, null)

  const effortSignalThisMonth = client.activity.filter(
    (a) => new Date(a.date).getTime() >= startOfMonth.getTime(),
  ).length

  return {
    activeProspectsThisWeek,
    commitmentsMetCount,
    commitmentsTotalCount,
    daysToNextUpdate,
    lastActivityDaysAgo,
    closestToContract,
    effortSignalThisMonth,
  }
}
