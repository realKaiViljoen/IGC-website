"use client"

/**
 * BriefingsArchive — the archive stream. Client component because it owns
 * the j/k + arrow keyboard navigation between entries.
 *
 * Each entry is an <article> with data-briefing-entry and data-entry-index.
 * Pressing j/↓ moves focus to the next entry, k/↑ to the previous.
 *
 * The written summary IS the point of this page. The keyboard nav exists to
 * make the archive feel like a read surface, not a SaaS list.
 */

import { useEffect, useMemo, useRef } from "react"
import type { Briefing } from "@/types/client"
import { BriefingEntry } from "./BriefingEntry"
import { ArchiveExportButton } from "./ArchiveExportButton"

export type BriefingsArchiveProps = {
  briefings: Briefing[]
  startDate: string
}

/** Whole weeks between two ISO yyyy-mm-dd dates (UTC floor). */
function weeksBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + "T00:00:00Z").getTime()
  const b = new Date(toIso + "T00:00:00Z").getTime()
  const diffDays = Math.round((b - a) / 86_400_000)
  return Math.floor(diffDays / 7) + 1
}

export function BriefingsArchive({ briefings, startDate }: BriefingsArchiveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Sort descending by week_of (latest first). Attach the chronological week
  // number computed from startDate so "Week 1" stays the kickoff week no
  // matter the sort order.
  const sorted = useMemo(() => {
    const withWeek = briefings.map((b) => ({
      briefing: b,
      weekNumber: weeksBetween(startDate, b.week_of),
    }))
    withWeek.sort((a, b) =>
      b.briefing.week_of.localeCompare(a.briefing.week_of),
    )
    return withWeek
  }, [briefings, startDate])

  useEffect(() => {
    function getEntries(): HTMLElement[] {
      const root = containerRef.current
      if (!root) return []
      return Array.from(
        root.querySelectorAll<HTMLElement>("[data-briefing-entry]"),
      )
    }

    function handleKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      // Ignore if the user is typing in a form control.
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
      if (target?.isContentEditable) return

      const entries = getEntries()
      if (entries.length === 0) return

      const activeIndex = entries.findIndex((el) =>
        el.contains(document.activeElement),
      )

      let nextIndex: number | null = null
      if (e.key === "j" || e.key === "ArrowDown") {
        nextIndex = activeIndex === -1 ? 0 : Math.min(activeIndex + 1, entries.length - 1)
      } else if (e.key === "k" || e.key === "ArrowUp") {
        nextIndex = activeIndex === -1 ? 0 : Math.max(activeIndex - 1, 0)
      }

      if (nextIndex !== null) {
        e.preventDefault()
        const el = entries[nextIndex]
        if (el) {
          el.focus({ preventScroll: false })
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <div ref={containerRef} data-igc-component="briefings-archive">
      {sorted.length === 0 ? (
        <p
          className="font-sans"
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "#A8A6A3",
            margin: 0,
            maxWidth: "52ch",
          }}
        >
          No briefings yet. The first Loom and written summary ship end of
          Week 1.
        </p>
      ) : (
        sorted.map(({ briefing, weekNumber }, i) => (
          <div key={briefing.id}>
            <BriefingEntry
              briefing={briefing}
              weekNumber={weekNumber}
              isLatest={i === 0}
              entryIndex={i}
            />
            {i < sorted.length - 1 && (
              <div
                aria-hidden="true"
                style={{ height: 1, backgroundColor: "#262A30", width: "100%" }}
              />
            )}
          </div>
        ))
      )}

      {/* Foot: quiet export affordance, keyboard hint */}
      <div
        style={{
          marginTop: 56,
          paddingTop: 28,
          borderTop: "1px solid #262A30",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <ArchiveExportButton />
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "0.625rem",
            letterSpacing: "0.16em",
            color: "#6E685E",
            fontVariantNumeric: "tabular-nums",
            margin: 0,
          }}
        >
          Navigate with j / k or arrow keys
        </p>
      </div>
    </div>
  )
}
