import type { ActivityEvent, ClientData } from "@/types/client"

const MS_PER_DAY = 86400000
const OUTREACH_START_DAY = 14 // Outreach begins on day 14 (parity with lib/guarantee.ts)
const STALE_THRESHOLD_MS = 4 * 60 * 60 * 1000 // 4 hours

/**
 * SystemPulseData — a single-sentence aggregate of today's outreach telemetry.
 *
 * Rendered by `components/portal/pulse/SystemPulse.tsx` as one mono line:
 *
 *   SYSTEM PULSE    Today · 48 sent · 12 connected · 4 replies · 1 booked · last batch 11:42 UTC
 *
 * Phase 2a derives this from `client.activity[]` (fixture data). Phase 2b
 * replaces derivation with live HubSpot / LGM / Gmail ingestion — the component
 * shape stays identical.
 */
export type SystemPulseData = {
  /** The date the pulse covers. ISO "YYYY-MM-DD". May be today or a prior day. */
  today: string
  /** Label for the date segment: "Today", "Yesterday", or "Wed 23 Apr". */
  label: string
  /** Count of outreach sends on the pulse date. */
  sent: number
  /** Count of LinkedIn connections accepted on the pulse date. */
  connected: number
  /** Count of replies received on the pulse date. */
  replies: number
  /** Count of discovery calls booked on the pulse date. */
  booked: number
  /** "HH:MM" UTC of the most recent outreach batch on the pulse date, or null. */
  lastBatchAt: string | null
  /** True if the most recent batch is > 4h ago (based on `now`). */
  isStale: boolean
  /** True if engagement day < 14, outreach hasn't begun yet. */
  prePulse: boolean
  /** If prePulse, formatted date outreach begins (e.g. "Tue 7 May"). */
  prePulseBeginsDate?: string
  /** True if no activity events exist at all (not a pre-pulse day, just silent). */
  empty: boolean
  /** For empty-day messaging: label of the most recent prior day with activity. */
  lastActiveLabel?: string
  /** For empty-day messaging: "HH:MM" UTC of the last batch on that prior day, or null. */
  lastActiveTime?: string | null
  /** HH:MM:SS UTC of `now`, for debug/inspection parity with GuaranteeData. */
  last_synced: string
}

/**
 * Compute the System Pulse for a client at a given moment.
 *
 * Pure, deterministic, side-effect-free. Safe for RSC and tests.
 *
 * Derivation rules (Phase 2a heuristics over `client.activity[]`):
 *   - sent       = events with source ∈ {lgm, gmail} whose entry mentions batch/sent/outreach
 *   - connected  = events whose entry mentions connect/acceptance
 *   - replies    = events whose entry mentions reply/replied
 *   - booked     = events whose entry mentions book/booked
 *   - lastBatchAt = most recent {lgm|gmail} event on the pulse date
 *
 * These are heuristics because the fixture activity entries carry no structured
 * per-event type or timestamp. That is acceptable for MVP: the rendering is
 * faithful regardless of derivation quality, and Phase 2b replaces this with
 * real per-source counters.
 */
export function computeSystemPulse(
  client: ClientData,
  now: Date = new Date(),
): SystemPulseData {
  const { engagement, activity } = client

  // --- Engagement day (computed live; engagement.day on the fixture can be stale).
  const start = new Date(engagement.startDate + "T00:00:00Z")
  const day = Math.max(
    1,
    Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY) + 1,
  )

  const nowIsoDate = isoDateUtc(now)
  const last_synced = now.toISOString().substring(11, 19)

  // --- Pre-pulse: outreach hasn't begun.
  if (day < OUTREACH_START_DAY) {
    const outreachStart = new Date(
      start.getTime() + (OUTREACH_START_DAY - 1) * MS_PER_DAY,
    )
    return {
      today: nowIsoDate,
      label: "Today",
      sent: 0,
      connected: 0,
      replies: 0,
      booked: 0,
      lastBatchAt: null,
      isStale: false,
      prePulse: true,
      prePulseBeginsDate: formatOutreachDate(outreachStart, engagement.timezone),
      empty: true,
      last_synced,
    }
  }

  // --- Group activity events by ISO date for O(1) lookup.
  const byDate = new Map<string, ActivityEvent[]>()
  for (const ev of activity) {
    const key = ev.date // already ISO "YYYY-MM-DD"
    const bucket = byDate.get(key)
    if (bucket) bucket.push(ev)
    else byDate.set(key, [ev])
  }

  // --- Determine the pulse date: today if any events today, else most recent day with events.
  const todaysEvents = byDate.get(nowIsoDate) ?? []
  let pulseDate: string
  let pulseEvents: ActivityEvent[]
  let label: string

  if (todaysEvents.length > 0) {
    pulseDate = nowIsoDate
    pulseEvents = todaysEvents
    label = "Today"
  } else {
    // Empty day — find most recent prior day with any activity.
    const sortedDates = Array.from(byDate.keys())
      .filter((d) => d <= nowIsoDate) // never count future-dated fixtures
      .sort((a, b) => (a < b ? 1 : -1))
    if (sortedDates.length === 0) {
      // No activity at all, post-outreach — the truly silent case.
      return {
        today: nowIsoDate,
        label: "Today",
        sent: 0,
        connected: 0,
        replies: 0,
        booked: 0,
        lastBatchAt: null,
        isStale: false,
        prePulse: false,
        empty: true,
        last_synced,
      }
    }
    const lastActive = sortedDates[0]
    const lastActiveEvents = byDate.get(lastActive) ?? []
    return {
      today: nowIsoDate,
      label: "Today",
      sent: 0,
      connected: 0,
      replies: 0,
      booked: 0,
      lastBatchAt: null,
      isStale: false,
      prePulse: false,
      empty: true,
      lastActiveLabel: dayLabel(lastActive, nowIsoDate, engagement.timezone),
      lastActiveTime: lastBatchTime(lastActiveEvents),
      last_synced,
    }
  }

  // --- Counts from pulseEvents.
  let sent = 0
  let connected = 0
  let replies = 0
  let booked = 0

  for (const ev of pulseEvents) {
    const entry = (ev.entry ?? "").toLowerCase()
    const src = ev.source

    // sent: batches from lgm or gmail automation.
    if (
      (src === "lgm" || src === "gmail") &&
      /\b(batch|sent|outreach|contacted)\b/.test(entry)
    ) {
      sent += 1
    }

    if (/\b(connect|connection|acceptance|accepted)\b/.test(entry)) {
      connected += 1
    }

    if (/\b(repl(y|ied|ies))\b/.test(entry)) {
      replies += 1
    }

    if (/\b(book|booked|booking)\b/.test(entry)) {
      booked += 1
    }
  }

  // --- lastBatchAt: most recent lgm/gmail event's time (if any).
  const lastBatchAt = lastBatchTime(pulseEvents)

  // --- Staleness: only meaningful when we have a lastBatchAt AND it's today's date.
  // If the pulse date is today but the last batch was >4h before `now`, mark stale.
  let isStale = false
  if (lastBatchAt && pulseDate === nowIsoDate) {
    const [hh, mm] = lastBatchAt.split(":").map((s) => parseInt(s, 10))
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      const batchUtc = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          hh,
          mm,
          0,
          0,
        ),
      )
      isStale = now.getTime() - batchUtc.getTime() > STALE_THRESHOLD_MS
    }
  }

  return {
    today: pulseDate,
    label,
    sent,
    connected,
    replies,
    booked,
    lastBatchAt,
    isStale,
    prePulse: false,
    empty: false,
    last_synced,
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** ISO "YYYY-MM-DD" in UTC for a given Date. */
function isoDateUtc(d: Date): string {
  return d.toISOString().substring(0, 10)
}

/**
 * Extract a "HH:MM" UTC timestamp from the most recent outreach-like event in
 * a list. Fixture events only carry a date (no time), so this returns null
 * when no time can be recovered. Phase 2b will populate real timestamps.
 */
function lastBatchTime(events: ActivityEvent[]): string | null {
  const batches = events.filter(
    (e) => e.source === "lgm" || e.source === "gmail",
  )
  if (batches.length === 0) return null

  // Look for an ISO datetime on the most recent batch event.
  const withTime = batches.find((e) => /T\d{2}:\d{2}/.test(e.date))
  if (withTime) {
    // e.date looks like "2026-04-23T11:42:00Z" — take HH:MM in UTC.
    const m = withTime.date.match(/T(\d{2}):(\d{2})/)
    if (m) return `${m[1]}:${m[2]}`
  }

  return null
}

/**
 * Label a date relative to "today":
 *   - same date          → "Today"
 *   - one day prior      → "Yesterday"
 *   - otherwise          → "Wed 23 Apr"
 */
function dayLabel(isoDate: string, todayIso: string, timeZone: string): string {
  if (isoDate === todayIso) return "Today"

  const a = new Date(todayIso + "T00:00:00Z")
  const b = new Date(isoDate + "T00:00:00Z")
  const diffDays = Math.round((a.getTime() - b.getTime()) / MS_PER_DAY)
  if (diffDays === 1) return "Yesterday"

  return formatOutreachDate(b, timeZone)
}

/** Format a date as e.g. "Tue 7 May" in the given IANA timezone (with fallback). */
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
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
  }
}
