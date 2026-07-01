import type {
  ClientData,
  GuaranteeData,
  GuaranteeConversation,
  GuaranteeTrackerState,
  HypothesisEntry,
} from "@/types/client"

const MS_PER_DAY = 86400000
const OUTREACH_START_DAY = 14 // Outreach begins on day 14 (startDate + 13 days)

/**
 * Compute the Guarantee Tracker's derived state for a client at a given moment.
 *
 * Pure, deterministic, side-effect-free. Suitable for RSC rendering and tests.
 *
 * @param client The ClientData record (with conversations, hypothesis thread, engagement).
 * @param now Optional Date — injects test clock. Defaults to new Date().
 */
export function computeGuaranteeState(client: ClientData, now: Date = new Date()): GuaranteeData {
  const { engagement } = client
  const total = engagement.guarantee_target
  const totalDays = engagement.totalDays

  const start = new Date(engagement.startDate + "T00:00:00Z")
  const day = Math.max(
    1,
    Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY) + 1,
  )

  // End-of-day-30 cutoff: conversations held strictly after Day totalDays are not counted toward guarantee
  // (surfaced separately in Cumulative Results, per brief 10).
  const endOfDayTotal = new Date(start.getTime() + totalDays * MS_PER_DAY - 1)

  // Gather counted conversations in chronological order.
  const counted = client.conversations
    .filter((c) => c.counts_toward_guarantee)
    .filter((c) => new Date(c.held_at + "T00:00:00Z").getTime() <= endOfDayTotal.getTime())
    .sort((a, b) => new Date(a.held_at).getTime() - new Date(b.held_at).getTime())

  const metRaw = counted.length
  const met = Math.min(metRaw, total)

  // State derivation (order matters).
  let state: GuaranteeTrackerState
  if (engagement.status === "complete" && met >= total) {
    state = "archive"
  } else if (day <= OUTREACH_START_DAY - 1 && met === 0) {
    // pre-outreach: Days 1–13 inclusive, no qualified conversations yet.
    state = "pre-outreach"
  } else if (met >= total) {
    state = "met"
  } else if (day > totalDays) {
    state = "unpaid-extension"
  } else {
    // Linear pace from Day 14 to Day 30: expected = (day - 13) / (totalDays - 13) * total.
    const denom = totalDays - (OUTREACH_START_DAY - 1)
    const expectedPace = denom > 0 ? ((day - (OUTREACH_START_DAY - 1)) / denom) * total : 0
    if (met >= expectedPace + 1) state = "ahead"
    else if (met < expectedPace - 0.5) state = "behind"
    else state = "on-pace"
  }

  // Resolve display conversations (capped at total).
  const displayed = counted.slice(0, total)
  const conversations: GuaranteeConversation[] = displayed.map((c) => {
    const prospect = client.prospects.find((p) => p.id === c.prospect_id)
    return {
      id: c.id,
      company: prospect?.company ?? "Unknown company",
      decision_maker: prospect?.name ?? "Unknown",
      role: prospect?.role ?? "",
      held_at: c.held_at,
      qualification_notes: c.qualification_notes,
      hubspot_url: prospect?.hubspot_deal_url,
    }
  })

  // met_date: held_at of the Nth qualified conversation (where N === total).
  let met_date: string | undefined
  if ((state === "met" || state === "archive") && counted[total - 1]) {
    met_date = counted[total - 1].held_at
  }

  // latest_hypothesis: most recent hypothesis if behind / unpaid-extension.
  let latest_hypothesis: HypothesisEntry | undefined
  if (state === "behind" || state === "unpaid-extension") {
    const sorted = [...client.hypothesis_thread].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    latest_hypothesis = sorted[0]
  }

  // outreach_begins_date: formatted "Tue 7 May" in engagement timezone, if pre-outreach.
  let outreach_begins_date: string | undefined
  if (state === "pre-outreach") {
    const outreachStart = new Date(start.getTime() + (OUTREACH_START_DAY - 1) * MS_PER_DAY)
    outreach_begins_date = formatOutreachDate(outreachStart, engagement.timezone)
  }

  // extension_days if beyond totalDays.
  const extension_days = state === "unpaid-extension" ? day - totalDays : undefined

  // last_synced: HH:MM:SS UTC of `now`.
  const last_synced = now.toISOString().substring(11, 19)

  return {
    state,
    met,
    total,
    day,
    totalDays,
    conversations,
    met_date,
    latest_hypothesis,
    outreach_begins_date,
    extension_days,
    qualifier_label: engagement.stage_config.guarantee_qualifier_label,
    last_synced,
  }
}

/** Format a date as e.g. "Tue 7 May" in the given IANA timezone, with a robust fallback. */
function formatOutreachDate(date: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).formatToParts(date)
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? ""
    const day = parts.find((p) => p.type === "day")?.value ?? ""
    const month = parts.find((p) => p.type === "month")?.value ?? ""
    return `${weekday} ${day} ${month}`.trim()
  } catch {
    // Fallback: UK locale in UTC if the timezone is invalid.
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
  }
}
