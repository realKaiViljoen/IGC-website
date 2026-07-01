"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  ClientData,
  Conversation,
  Prospect,
} from "@/types/client"
import { PipelineRow } from "./PipelineRow"
import { ProspectDrawer } from "./ProspectDrawer"
import { todayAnchorFromEngagement } from "@/lib/pipeline"

/**
 * Pipeline Ledger · dense prospect table.
 *
 * Presentational responsibilities:
 *   · Render prospects in stage-asc → last-touch-desc order by default
 *   · Column header row in mono, matching row grid
 *   · Filter input bound to `/` — substring match on company
 *   · Roving tabindex + j/k + Arrow↑↓ navigation; Enter/Space opens drawer
 *   · Esc closes drawer (drawer owns its own Esc handler)
 *
 * Shares the same register as HandoverPack: no card wrapper, hairlines only,
 * section-level eyebrow, qualified accent gated to the gold restriction.
 */
export type PipelineLedgerProps = {
  client: ClientData
}

export function PipelineLedger({ client }: PipelineLedgerProps) {
  const { prospects, conversations, engagement } = client
  const { stage_config, startDate, day } = engagement
  const stages = stage_config.stages
  const qualifiedStageIndex = stage_config.qualified_stage_index

  const nowUtcMs = useMemo(
    () => todayAnchorFromEngagement(startDate, day),
    [startDate, day],
  )

  const stageIndexOf = useCallback(
    (stage: string): number => {
      const i = stages.indexOf(stage)
      return i === -1 ? stages.length : i
    },
    [stages],
  )

  // Filter state.
  const [filter, setFilter] = useState("")
  const filterInputRef = useRef<HTMLInputElement>(null)

  // Sorted + filtered prospects.
  const sorted: Prospect[] = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    const rows = prospects.filter((p) =>
      needle === "" ? true : p.company.toLowerCase().includes(needle),
    )
    return rows.slice().sort((a, b) => {
      const as = stageIndexOf(a.stage)
      const bs = stageIndexOf(b.stage)
      if (as !== bs) return as - bs
      // Descending last_touch: newer first
      const at = new Date(a.last_touch + "T00:00:00Z").getTime()
      const bt = new Date(b.last_touch + "T00:00:00Z").getTime()
      return bt - at
    })
  }, [prospects, filter, stageIndexOf])

  // Conversations grouped by prospect_id.
  const convsByProspect = useMemo(() => {
    const map = new Map<string, Conversation[]>()
    for (const c of conversations) {
      const arr = map.get(c.prospect_id) ?? []
      arr.push(c)
      map.set(c.prospect_id, arr)
    }
    // Sort desc by held_at within each group.
    for (const [k, arr] of map) {
      arr.sort((a, b) =>
        b.held_at.localeCompare(a.held_at),
      )
      map.set(k, arr)
    }
    return map
  }, [conversations])

  // Keyboard navigation.
  const [activeIndex, setActiveIndex] = useState(0)
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    // Reset active index when filter collapses the list below it.
    if (activeIndex >= sorted.length) {
      setActiveIndex(Math.max(0, sorted.length - 1))
    }
  }, [sorted.length, activeIndex])

  // Drawer state.
  const [drawerProspect, setDrawerProspect] = useState<Prospect | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const openDrawer = useCallback((p: Prospect) => {
    const active = document.activeElement
    if (active instanceof HTMLElement) returnFocusRef.current = active
    setDrawerProspect(p)
  }, [])
  const closeDrawer = useCallback(() => setDrawerProspect(null), [])

  // Global key handler: `/` focuses the filter input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return
      const target = e.target as HTMLElement | null
      // Don't hijack if user is already typing in a field.
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }
      e.preventDefault()
      filterInputRef.current?.focus()
      filterInputRef.current?.select()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const moveFocus = useCallback(
    (nextIndex: number) => {
      if (sorted.length === 0) return
      const clamped = Math.max(0, Math.min(sorted.length - 1, nextIndex))
      setActiveIndex(clamped)
      const el = rowRefs.current[clamped]
      if (el) el.focus()
    },
    [sorted.length],
  )

  const onLedgerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault()
        moveFocus(activeIndex + 1)
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault()
        moveFocus(activeIndex - 1)
      } else if (e.key === "Home") {
        e.preventDefault()
        moveFocus(0)
      } else if (e.key === "End") {
        e.preventDefault()
        moveFocus(sorted.length - 1)
      } else if (e.key === "Enter" || e.key === " ") {
        const p = sorted[activeIndex]
        if (!p) return
        e.preventDefault()
        openDrawer(p)
      }
    },
    [activeIndex, moveFocus, openDrawer, sorted],
  )

  const drawerProspectQualified = drawerProspect
    ? stageIndexOf(drawerProspect.stage) >= qualifiedStageIndex
    : false

  const drawerConversations = drawerProspect
    ? (convsByProspect.get(drawerProspect.id) ?? [])
    : []

  const totalCount = prospects.length
  const shownCount = sorted.length

  return (
    <section
      aria-labelledby="pipeline-ledger-eyebrow"
      data-igc-component="pipeline-ledger"
      style={{ width: "100%" }}
    >
      {/* Header row · eyebrow + filter + count */}
      <div
        id="pipeline-ledger-eyebrow"
        className="flex items-baseline justify-between gap-6 flex-wrap"
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
          § 02 · Prospect ledger
        </p>

        <div className="flex items-center gap-4">
          <label
            className="flex items-center gap-2"
            style={{ cursor: "text" }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "0.625rem",
                letterSpacing: "0.16em",
                color: "#857F74",
                fontVariantNumeric: "tabular-nums",
              }}
              aria-hidden="true"
            >
              /
            </span>
            <input
              ref={filterInputRef}
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by company"
              aria-label="Filter prospects by company"
              className="font-sans focus-visible:outline-none"
              style={{
                width: 200,
                padding: "4px 8px",
                fontSize: "0.8125rem",
                color: "#FAF9F7",
                background: "#101215",
                border: "1px solid #262A30",
                borderRadius: 2,
              }}
            />
          </label>

          <p
            className="font-mono"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              color: "#857F74",
              fontVariantNumeric: "tabular-nums",
              textTransform: "lowercase",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {shownCount} of {totalCount}
          </p>
        </div>
      </div>

      {/* Column headers · mono, tabular, tracks the row grid exactly */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#2D2A27", width: "100%" }}
      />
      <div
        role="presentation"
        className="grid"
        style={{
          gridTemplateColumns:
            "minmax(0, 1.4fr) minmax(0, 1.2fr) 180px 110px 56px 110px",
          columnGap: 16,
          padding: "10px 12px",
          alignItems: "center",
        }}
      >
        {[
          { label: "Company", align: "left" as const },
          { label: "Contact", align: "left" as const },
          { label: "Stage", align: "left" as const },
          { label: "Last touch", align: "left" as const },
          { label: "Tier", align: "center" as const },
          { label: "Est. value", align: "right" as const },
        ].map((h) => (
          <span
            key={h.label}
            className="font-mono uppercase"
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.16em",
              color: "#93918E",
              fontVariantNumeric: "tabular-nums",
              textAlign: h.align,
            }}
          >
            {h.label}
          </span>
        ))}
      </div>
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#2D2A27", width: "100%" }}
      />

      {/* Rows */}
      <div
        role="list"
        aria-label="Prospect pipeline ledger"
        onKeyDown={onLedgerKeyDown}
        tabIndex={-1}
      >
        {sorted.length === 0 && (
          <p
            className="font-sans"
            style={{
              padding: "20px 12px",
              fontSize: "0.875rem",
              lineHeight: 1.55,
              color: "#857F74",
              margin: 0,
              maxWidth: "52ch",
            }}
          >
            No prospects match that filter.
          </p>
        )}

        {sorted.map((p, i) => {
          const isLast = i === sorted.length - 1
          return (
            <div key={p.id} role="listitem">
              <PipelineRow
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                prospect={p}
                stageIndex={stageIndexOf(p.stage)}
                qualifiedStageIndex={qualifiedStageIndex}
                nowUtcMs={nowUtcMs}
                tabIndex={i === activeIndex ? 0 : -1}
                isFocused={i === activeIndex}
                drawerOpenForThis={drawerProspect?.id === p.id}
                onClick={() => {
                  setActiveIndex(i)
                  openDrawer(p)
                }}
              />
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{
                    height: 1,
                    backgroundColor: "#221E1A",
                    width: "100%",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#2D2A27", width: "100%" }}
      />

      {/* Keyboard hint · mono, low-key */}
      <p
        className="font-mono"
        style={{
          marginTop: 12,
          fontSize: "0.625rem",
          letterSpacing: "0.16em",
          color: "#857F74",
          fontVariantNumeric: "tabular-nums",
          textTransform: "lowercase",
          margin: "12px 0 0 0",
        }}
      >
        j / k · navigate &nbsp;·&nbsp; enter · open &nbsp;·&nbsp; / · filter &nbsp;·&nbsp; esc · close
      </p>

      <ProspectDrawer
        prospect={drawerProspect}
        qualified={drawerProspectQualified}
        conversations={drawerConversations}
        nowUtcMs={nowUtcMs}
        onClose={closeDrawer}
        returnFocusRef={returnFocusRef}
      />
    </section>
  )
}
