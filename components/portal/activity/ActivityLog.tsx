"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import type { ActivityEvent, ClientData, GuaranteeData } from "@/types/client"
import { ActivityEntry, type ActivityEntryBucket } from "./ActivityEntry"
import { DateDivider } from "./DateDivider"

export type ActivityLogProps = {
  initialData: { client: ClientData; guarantee: GuaranteeData }
}

type Payload = { client: ClientData; guarantee: GuaranteeData }

const fetcher = async (url: string): Promise<Payload> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const DEFAULT_VISIBLE = 10
const EXPANDED_MAX = 50
const TAIL_SCROLL_THRESHOLD_PX = 50
const NEW_ENTRIES_PILL_TIMEOUT_MS = 3000

/**
 * Activity Log · § 05 of the Overview — the receipts spine.
 *
 * Register: Bloomberg terminal tail-log. Entries flow top-to-bottom, newest
 * first, grouped by date divider ("Today", "Yesterday", "This week",
 * "Earlier"). The visual language literally distinguishes principal-led work
 * from automation — K.C.'s entries render in Fraunces italic, automation in
 * Geist Mono. That distinction IS the brand (PRODUCT.md §Brand #6).
 *
 * Data:
 *   - Seeded by `initialData` (RSC hydration).
 *   - SWR polls `/api/client/[uid]` every 30s + revalidates on focus.
 *   - Reads `client.activity`; sorts client-side by `date` descending.
 *
 * Pagination:
 *   - Default: 10 most-recent entries.
 *   - "Show earlier →" expands to 50. Bounded. No infinite scroll — the log
 *     is finite and legible.
 *
 * Tail-follow:
 *   - On SWR revalidation, if new entries arrive the top row fades in 200ms.
 *   - If the user has scrolled >50px from the log's top, we do NOT auto-scroll
 *     (reading position preserved); a subtle "new entries above" pill appears
 *     for 3s, linked to scroll-to-top.
 *   - If scroll is <50px, new entries simply animate in at the top in place.
 */
export function ActivityLog({ initialData }: ActivityLogProps) {
  const { client: initialClient } = initialData
  const uid = initialClient.uid

  const { data, error } = useSWR<Payload>(`/api/client/${uid}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    fallbackData: initialData,
    keepPreviousData: true,
  })

  const current = data ?? initialData
  const activity = current.client.activity
  const isError = !!error
  const showLoadingOverlay = !data && !error && !initialData

  // Sort newest first. Stable secondary sort by original array index so
  // same-date entries keep authored order.
  const sortedAll = useMemo<ActivityEvent[]>(() => {
    return [...activity]
      .map((e, i) => ({ e, i }))
      .sort((a, b) => {
        const da = timeValue(a.e.date)
        const db = timeValue(b.e.date)
        if (db !== da) return db - da
        return a.i - b.i
      })
      .map(({ e }) => e)
  }, [activity])

  // Expansion state — default collapsed to 10.
  const [expanded, setExpanded] = useState(false)
  const visibleCount = expanded ? EXPANDED_MAX : DEFAULT_VISIBLE
  const visibleEvents = sortedAll.slice(0, visibleCount)
  const olderCount = Math.max(0, sortedAll.length - DEFAULT_VISIBLE)

  // Group the visible events by bucket, preserving order.
  const grouped = useMemo(() => groupByBucket(visibleEvents), [visibleEvents])

  // Tail-follow: detect newly arrived top entry since last render.
  const lastTopKeyRef = useRef<string | null>(null)
  const [newTopKey, setNewTopKey] = useState<string | null>(null)
  const [showNewPill, setShowNewPill] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (visibleEvents.length === 0) return
    const topKey = eventKey(visibleEvents[0])
    const prev = lastTopKeyRef.current

    // First mount — record, do not animate.
    if (prev === null) {
      lastTopKeyRef.current = topKey
      return
    }

    if (topKey !== prev) {
      // A new entry has arrived at the top via revalidation.
      const scrolled = typeof window !== "undefined" ? window.scrollY : 0
      const section = sectionRef.current
      const sectionTop = section
        ? section.getBoundingClientRect().top + scrolled
        : 0
      const distanceFromLogTop = Math.max(0, scrolled - sectionTop)

      if (distanceFromLogTop > TAIL_SCROLL_THRESHOLD_PX) {
        // User is reading further down — do NOT auto-scroll. Show pill.
        setShowNewPill(true)
        const t = window.setTimeout(
          () => setShowNewPill(false),
          NEW_ENTRIES_PILL_TIMEOUT_MS,
        )
        // Still fade the new row in — just no scroll.
        setNewTopKey(topKey)
        const t2 = window.setTimeout(() => setNewTopKey(null), 250)
        lastTopKeyRef.current = topKey
        return () => {
          window.clearTimeout(t)
          window.clearTimeout(t2)
        }
      }

      // At top of log — fade in place, no pill.
      setNewTopKey(topKey)
      const t = window.setTimeout(() => setNewTopKey(null), 250)
      lastTopKeyRef.current = topKey
      return () => window.clearTimeout(t)
    }
  }, [visibleEvents])

  const jumpToTop = () => {
    setShowNewPill(false)
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="activity-log-eyebrow"
      data-igc-component="activity-log"
      className="relative"
      style={{
        maxWidth: 720,
        width: "100%",
        opacity: showLoadingOverlay ? 0.35 : 1,
        transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Scoped keyframes + responsive reflow — no global CSS touched. */}
      <style>{SCOPED_CSS}</style>

      {/* Header row */}
      <div
        id="activity-log-eyebrow"
        className="flex items-baseline justify-between gap-6"
        style={{ paddingBottom: 16 }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#857F74",
            fontVariantNumeric: "tabular-nums",
            margin: 0,
          }}
        >
          § 05 · Activity
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.14em",
            color: "#A8A6A3",
            fontVariantNumeric: "tabular-nums",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          {sortedAll.length} entries · tail-follow live
        </p>
      </div>

      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#2D2A27", width: "100%" }}
      />

      {/* "New entries above" pill — shown for 3s when entries arrive while
          the user has scrolled away from the top of the log. */}
      {showNewPill && (
        <button
          type="button"
          onClick={jumpToTop}
          className="font-mono"
          style={{
            position: "sticky",
            top: 16,
            zIndex: 2,
            marginTop: 12,
            marginLeft: "auto",
            marginRight: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            fontSize: "0.6875rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#FAF9F7",
            backgroundColor: "#101215",
            border: "1px solid #262A30",
            borderRadius: 2,
            cursor: "pointer",
            fontVariantNumeric: "tabular-nums",
            animation:
              "igc-activity-fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          new entries above {"\u2191"}
        </button>
      )}

      {/* Empty state — editorial prose, never an illustration. */}
      {sortedAll.length === 0 && !showLoadingOverlay && (
        <p
          className="font-sans"
          style={{
            marginTop: 24,
            fontWeight: 300,
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            color: "#A8A6A3",
            maxWidth: "56ch",
            margin: "24px 0 0",
          }}
        >
          Activity log is empty. Entries appear here with timestamps and source
          attribution as K.C. works and the system operates.
        </p>
      )}

      {/* Ledger */}
      {sortedAll.length > 0 && (
        <div role="list" aria-label="Activity log entries">
          {grouped.map((group, gi) => (
            <div key={`g-${gi}-${group.label}`}>
              <DateDivider label={group.label} />
              {group.events.map((ev, ei) => {
                const key = eventKey(ev)
                const isLast =
                  gi === grouped.length - 1 && ei === group.events.length - 1
                return (
                  <div key={key}>
                    <ActivityEntry
                      event={ev}
                      bucket={group.bucket}
                      isNew={key === newTopKey}
                    />
                    {!isLast && (
                      <div
                        aria-hidden="true"
                        style={{
                          height: 1,
                          backgroundColor: "#262A30",
                          width: "100%",
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Show earlier — only when there are more entries than the current
              visible window. Caps at EXPANDED_MAX (50). */}
          {!expanded && sortedAll.length > DEFAULT_VISIBLE && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="font-mono"
              style={{
                marginTop: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                textTransform: "lowercase",
                color: "#93918E",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontVariantNumeric: "tabular-nums",
                transition: "color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FAF9F7")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#93918E")}
            >
              show earlier ({olderCount}) {"\u2192"}
            </button>
          )}
        </div>
      )}

      {/* Loading — editorial mono line, no spinner, no skeleton. */}
      {showLoadingOverlay && (
        <p
          aria-live="polite"
          className="font-mono"
          style={{
            marginTop: 24,
            fontSize: "0.6875rem",
            lineHeight: 1.3,
            letterSpacing: "0.14em",
            color: "#857F74",
            fontVariantNumeric: "tabular-nums",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          loading · activity · {new Date().toISOString().substring(11, 19)} utc
        </p>
      )}

      {/* Error — last-known-good shown, amber mono line, named escalation. */}
      {isError && (
        <div
          aria-live="polite"
          role="status"
          className="flex flex-col gap-2"
          style={{ marginTop: 24 }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: "0.6875rem",
              lineHeight: 1.6,
              letterSpacing: "0.14em",
              color: "#C78B28",
              fontVariantNumeric: "tabular-nums",
              textTransform: "lowercase",
              margin: 0,
              maxWidth: "72ch",
            }}
          >
            activity sync failed at{" "}
            {new Date().toISOString().substring(11, 16)} utc. last-known-good
            shown. k.c. pages himself at{" "}
            <a
              href="mailto:hello@igc-growth.com"
              className="underline transition-colors duration-150 hover:text-[#FAF9F7]"
              style={{ color: "#C78B28", textUnderlineOffset: "3px" }}
            >
              hello@igc-growth.com
            </a>{" "}
            if unresolved within the hour.
          </p>
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */

type Bucket = ActivityEntryBucket
type BucketKey = "today" | "yesterday" | "this-week" | "earlier"

type Group = {
  /** Rendered divider label, e.g. "Today". */
  label: string
  /** Timestamp format bucket for entries in this group. */
  bucket: Bucket
  /** Stable group key for React. */
  key: BucketKey
  events: ActivityEvent[]
}

/**
 * Groups events into the four canonical buckets, preserving the input order
 * (which is already newest-first). "Yesterday" collapses into the "today"
 * formatting bucket — it is its own divider but uses the same HH:MM UTC
 * timestamp idiom since it's <48h out.
 */
function groupByBucket(events: ActivityEvent[]): Group[] {
  const now = new Date()
  const todayUTC = startOfUtcDay(now)
  const yesterdayUTC = new Date(todayUTC.getTime() - 86400000)
  // "This week" = Monday of current ISO week.
  const weekMonUTC = startOfUtcWeek(now)

  const groups: Record<BucketKey, Group> = {
    today: { label: "Today", bucket: "today", key: "today", events: [] },
    yesterday: {
      label: "Yesterday",
      bucket: "today",
      key: "yesterday",
      events: [],
    },
    "this-week": {
      label: "This week",
      bucket: "this-week",
      key: "this-week",
      events: [],
    },
    earlier: {
      label: "Earlier",
      bucket: "earlier",
      key: "earlier",
      events: [],
    },
  }

  for (const ev of events) {
    const evDay = startOfUtcDay(
      new Date(ev.date.includes("T") ? ev.date : ev.date + "T00:00:00Z"),
    ).getTime()

    if (evDay === todayUTC.getTime()) groups.today.events.push(ev)
    else if (evDay === yesterdayUTC.getTime())
      groups.yesterday.events.push(ev)
    else if (evDay >= weekMonUTC.getTime() && evDay < yesterdayUTC.getTime())
      groups["this-week"].events.push(ev)
    else groups.earlier.events.push(ev)
  }

  const ordered: BucketKey[] = ["today", "yesterday", "this-week", "earlier"]
  return ordered.map((k) => groups[k]).filter((g) => g.events.length > 0)
}

function startOfUtcDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  )
}

function startOfUtcWeek(d: Date): Date {
  const day = startOfUtcDay(d)
  // ISO week — Monday as day 1.
  const dow = (day.getUTCDay() + 6) % 7 // Mon=0 … Sun=6
  return new Date(day.getTime() - dow * 86400000)
}

function timeValue(iso: string): number {
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z")
  const t = d.getTime()
  return Number.isFinite(t) ? t : 0
}

function eventKey(ev: ActivityEvent): string {
  // Entries don't carry an id; (date + actor + entry) is unique enough in
  // practice and stable across revalidations.
  return `${ev.date}|${ev.actor ?? "automation"}|${ev.entry}`
}

/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Scoped CSS — keyframes for the 200ms opacity fade-in on newly arrived rows,
 * hover affordance on linked rows, and responsive reflow of the row grid at
 * tablet (<720px) and mobile (<480px) breakpoints.
 *
 * Written as a <style> block inside the component so the ActivityLog ships
 * self-contained: no token file edits, no global stylesheet additions.
 */
const SCOPED_CSS = `
@keyframes igc-activity-fade-in {
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: translateY(0); }
}

[data-igc-component="activity-log"] a.igc-activity-row:hover,
[data-igc-component="activity-log"] a.igc-activity-row:focus-visible {
  background-color: rgba(242, 237, 228, 0.02);
  outline: none;
}

[data-igc-component="activity-log"] a.igc-activity-row:focus-visible {
  box-shadow: inset 0 0 0 1px #262A30;
}

@media (max-width: 720px) {
  [data-igc-component="activity-log"] .igc-activity-row {
    grid-template-columns: 1fr auto !important;
    grid-template-areas:
      "meta link"
      "entry link" !important;
    row-gap: 4px;
  }
  [data-igc-component="activity-log"] .igc-activity-row > *[style*="grid-area: ts"] {
    grid-area: meta !important;
  }
  [data-igc-component="activity-log"] .igc-activity-row > *[style*="grid-area: actor"] {
    grid-area: meta !important;
    margin-left: 12px;
  }
}

@media (max-width: 480px) {
  [data-igc-component="activity-log"] .igc-activity-row {
    grid-template-columns: 1fr !important;
    grid-template-areas:
      "meta"
      "entry"
      "link" !important;
    row-gap: 4px;
  }
  [data-igc-component="activity-log"] .igc-activity-row > *[style*="grid-area: link"] {
    justify-self: flex-start;
  }
}
`
