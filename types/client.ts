export type NicheKind = "msp" | "recruitment"

export type StageConfig = {
  niche: NicheKind
  /** Ordered stage names (e.g. 11 for MSP, 8 for recruitment). */
  stages: string[]
  /** Human-readable qualifier, e.g. "qualified managed-contract conversations". */
  guarantee_qualifier_label: string
  /** Index at which a prospect counts as qualified (typically 4 = "Discovery Held"). */
  qualified_stage_index: number
}

export type EngagementPhase = "build" | "launch" | "operate" | "handover" | "archive"

export type Engagement = {
  title: string
  /** ISO date, e.g. "2026-04-07". */
  startDate: string
  /** Derived: today - startDate + 1 (min 1). */
  day: number
  /** Typically 30. */
  totalDays: number
  phase: EngagementPhase
  status: "active" | "on-hold" | "complete"
  /** Always "K.C. Viljoen" for the foreseeable future. */
  consultant: string
  /** IANA, e.g. "Europe/London". */
  timezone: string
  stage_config: StageConfig
  /** Typically 5. */
  guarantee_target: number
  /**
   * Where the data in this engagement comes from.
   * - "manual": authored via YAML schema under `data/schemas/{uid}.yaml`, compiled to `data/clients/{uid}.ts`.
   * - "live":   sourced from HubSpot / Cal / Gmail / Unipile ingestion (Phase 2b).
   */
  data_source: "manual" | "live"
}

export type Prospect = {
  id: string
  company: string
  /** Decision-maker full name. */
  name: string
  /** E.g. "Managing Director". */
  role: string
  /** Must match `stage_config.stages`. */
  stage: string
  /** ISO date. */
  last_touch: string
  /** In engagement currency minor units (pence/cents). */
  estimated_contract_value_cents: number
  currency: "GBP" | "USD" | "ZAR"
  hubspot_deal_url?: string
  apollo_id?: string
  tier?: 1 | 2 | 3
}

export type Conversation = {
  id: string
  prospect_id: string
  /** ISO date. */
  held_at: string
  /** True = counts toward guarantee. */
  qualified: boolean
  tier?: 1 | 2 | 3
  transcript_url?: string
  /** K.C.'s reasoning; rendered in Playfair italic in UI. */
  qualification_notes?: string
  counts_toward_guarantee: boolean
}

export type Commitment = {
  promise: string
  /** ISO date. */
  due: string
  met: boolean
  /** ISO date. */
  met_at?: string
  author: "kc" | "client"
}

export type ActivityEvent = {
  /** ISO date. */
  date: string
  entry: string
  actor?: "kc" | "automation" | "client"
  source?: "hubspot" | "lgm" | "gmail" | "cal" | "make" | "manual"
  link?: string
}

export type HypothesisEntry = {
  id: string
  /** ISO date-time. */
  created_at: string
  /** ≤140 chars. */
  text: string
  fix_action: string
  /** ISO date. */
  fix_date: string
  author: "kc"
}

export type HandoverItemKey =
  | "outreach-sequences"
  | "crm-config"
  | "copy-library"
  | "prospect-list"
  | "landing-page"
  | "sops-attestation"

export type HandoverItem = {
  key: HandoverItemKey
  name: string
  state: "not-started" | "in-progress" | "ready-for-review" | "shipped" | "transferred"
  /** ISO date. */
  shipped_at?: string
  /** ISO date. */
  transferred_at?: string
  artifact_url?: string
}

export type Briefing = {
  id: string
  /** ISO date (Monday of the week). */
  week_of: string
  loom_url: string
  loom_thumbnail?: string
  loom_duration_seconds?: number
  written_summary_md: string
  /** ISO date-time. */
  authored_by_kc_at: string
}

export type ClientData = {
  uid: string
  company: string
  contactName: string
  contactEmail: string
  role: string
  engagement: Engagement
  prospects: Prospect[]
  conversations: Conversation[]
  commitments: Commitment[]
  activity: ActivityEvent[]
  hypothesis_thread: HypothesisEntry[]
  handover: HandoverItem[]
  briefings: Briefing[]
  next_briefing?: { date: string; description: string }
}

export type GuaranteeTrackerState =
  | "pre-outreach"
  | "on-pace"
  | "ahead"
  | "behind"
  | "met"
  | "unpaid-extension"
  | "archive"

export type GuaranteeConversation = {
  id: string
  company: string
  decision_maker: string
  role: string
  /** ISO date. */
  held_at: string
  qualification_notes?: string
  hubspot_url?: string
}

export type GuaranteeData = {
  state: GuaranteeTrackerState
  /** Capped at `total` for display. */
  met: number
  /** `engagement.guarantee_target`. */
  total: number
  day: number
  totalDays: number
  /** Up to `total` entries, chronological. */
  conversations: GuaranteeConversation[]
  /** ISO date (from 5th qualified conversation's held_at) if state === met | archive. */
  met_date?: string
  /** Latest hypothesis if state === behind | unpaid-extension. */
  latest_hypothesis?: HypothesisEntry
  /** Formatted "Weekday DD Mon" (from engagement.startDate + 13 days) if state === pre-outreach. */
  outreach_begins_date?: string
  /** day - totalDays, if state === unpaid-extension. */
  extension_days?: number
  /** From `stage_config.guarantee_qualifier_label`. */
  qualifier_label: string
  /** HH:MM:SS UTC. */
  last_synced?: string
  error?: { code: string; at: string; next_retry_at: string; escalation_at: string }
}

export type AnalyticsResult = {
  activeProspectsThisWeek: number
  commitmentsMetCount: number
  commitmentsTotalCount: number
  daysToNextUpdate: number
  lastActivityDaysAgo: number
  closestToContract: { name: string; stage: string } | null
  effortSignalThisMonth: number
}

/** Legacy shape retained for MessagesClient / ReferencePicker compatibility. */
export type MessageReference = {
  type: "prospect" | "commitment" | "activity" | "signal"
  label: string
  detail: string
  id?: string
}
