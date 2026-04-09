export type PipelineStage =
  | "sourced"
  | "submitted"
  | "interviewing"
  | "offer-extended"
  | "offer-accepted"
  | "placed"

export type ClientData = {
  uid: string
  company: string
  contactName: string
  contactEmail: string
  role: string
  engagement: {
    title: string
    startDate: string
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
    lastUpdate: string
    note?: string
  }>
  commitments: Array<{
    promise: string
    due: string
    met: boolean
  }>
  activity: Array<{
    date: string
    entry: string
  }>
  nextUpdate: {
    date: string
    description: string
  }
}

export type MessageReference = {
  type: "pipeline" | "commitment" | "activity" | "signal"
  label: string
  detail: string
  id?: string
}

export type AnalyticsResult = {
  activeCandidatesThisWeek: number
  commitmentsMetCount: number
  commitmentsTotalCount: number
  daysToNextUpdate: number
  lastActivityDaysAgo: number
  closestToPlacement: { name: string; stage: PipelineStage } | null
  effortSignalThisMonth: number
}
