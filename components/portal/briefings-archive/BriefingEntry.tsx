"use client"

/**
 * BriefingEntry — one entry in the archive stream.
 *
 * Structure:
 *   1. Week anchor row (Fraunces "Week N" + mono "WEEK OF DD MON YYYY" eyebrow,
 *      optional LATEST chip on most recent entry).
 *   2. Loom row (thumbnail 160x90 + mono duration + "Watch briefing" link).
 *   3. Written summary — Geist italic 15px, leading 1.7, max 62ch. The body.
 *   4. Authored byline — mono 11px, faint. Comma-separated, no em-dashes.
 *
 * Dividers between entries live in the parent stream, not here.
 */

import type { Briefing } from "@/types/client"
import { LoomThumbnail } from "./LoomThumbnail"

const GOLD = "#C78B28"

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

/** "06 Apr 2026" — uppercase 2-digit day, short month, UTC. */
function formatWeekOfLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00Z")
  const day = d.getUTCDate().toString().padStart(2, "0")
  const month = d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })
  const year = d.getUTCFullYear()
  return `${day} ${month} ${year}`.toUpperCase()
}

/** "09 Apr 2026 at 17:20" — for the authored byline. */
function formatAuthored(isoDateTime: string): string {
  const d = new Date(isoDateTime)
  const day = d.getUTCDate().toString().padStart(2, "0")
  const month = d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })
  const year = d.getUTCFullYear()
  const hh = d.getUTCHours().toString().padStart(2, "0")
  const mm = d.getUTCMinutes().toString().padStart(2, "0")
  return `${day} ${month} ${year} at ${hh}:${mm}`
}

export type BriefingEntryProps = {
  briefing: Briefing
  weekNumber: number
  isLatest: boolean
  entryIndex: number
}

export function BriefingEntry({
  briefing,
  weekNumber,
  isLatest,
  entryIndex,
}: BriefingEntryProps) {
  const duration =
    typeof briefing.loom_duration_seconds === "number"
      ? formatDuration(briefing.loom_duration_seconds)
      : null

  const summary = (briefing.written_summary_md ?? "").trim()
  const weekOfLabel = formatWeekOfLabel(briefing.week_of)
  const authoredLabel = formatAuthored(briefing.authored_by_kc_at)

  return (
    <article
      data-briefing-entry
      data-entry-index={entryIndex}
      tabIndex={-1}
      aria-labelledby={`briefing-week-${weekNumber}`}
      className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-8 focus-visible:ring-offset-[#0A0B0E]"
      style={{ scrollMarginTop: 32, paddingTop: 48, paddingBottom: 48 }}
    >
      {/* Week anchor row */}
      <header style={{ marginBottom: 28 }}>
        <div
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#857F74",
            fontVariantNumeric: "tabular-nums",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>Week of {weekOfLabel}</span>
          {isLatest && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "0.625rem",
                letterSpacing: "0.18em",
                color: GOLD,
                fontVariantNumeric: "tabular-nums",
                border: `1px solid ${GOLD}`,
                padding: "2px 7px",
                lineHeight: 1.3,
              }}
            >
              Latest
            </span>
          )}
        </div>
        <h2
          id={`briefing-week-${weekNumber}`}
          className="font-display"
          style={{
            fontWeight: 400,
            fontSize: "1.75rem",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            color: "#FAF9F7",
            margin: 0,
            fontOpticalSizing: "auto",
            fontVariationSettings: '"opsz" 48, "SOFT" 60',
          }}
        >
          Week {weekNumber}
        </h2>
      </header>

      {/* Loom row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 24,
        }}
      >
        <LoomThumbnail briefing={briefing} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minWidth: 0,
          }}
        >
          {duration && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                color: "#857F74",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {duration} runtime
            </span>
          )}
          <a
            href={briefing.loom_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group font-sans inline-flex items-center gap-2 transition-colors duration-150 hover:text-[#C78B28] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
            style={{
              fontSize: "0.875rem",
              color: "#FAF9F7",
              width: "fit-content",
            }}
          >
            <span>Watch briefing</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-[2px]"
              style={{ display: "inline-block" }}
            >
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* Written summary — the body of the entry */}
      {summary && (
        <p
          className="font-sans italic"
          style={{
            fontWeight: 400,
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "#E6DFD2",
            margin: 0,
            maxWidth: "62ch",
            textWrap: "pretty",
          }}
        >
          {summary}
        </p>
      )}

      {/* Authored byline — mono, comma-separated (no em-dashes) */}
      <p
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.14em",
          color: "#6E685E",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
          marginTop: 24,
        }}
      >
        Authored by K.C., {authoredLabel} UTC
      </p>
    </article>
  )
}
