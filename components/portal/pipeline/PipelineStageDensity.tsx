"use client"

import { useMemo } from "react"
import type { Prospect, StageConfig } from "@/types/client"

/**
 * Stage density rows. One row per stage, in canonical `stage_config.stages`
 * order. Each row shows:
 *
 *   · Ordinal (01 / 02 / …) in mono, tertiary
 *   · Stage name in Geist (primary if any prospects here, muted if empty)
 *   · Count, tabular-nums, right-aligned
 *   · A single-line "bar" rendered as N filled cells of a fixed-width grid
 *     that scales to the max count in the set. This IS the sparkline —
 *     tabular, not a canvas.
 *
 * Stages at or beyond `qualified_stage_index` render their count in gold.
 * Empty stages render at the muted `#7C7A76` tone.
 *
 * No card wrapper, no borders wider than 1px, no side-stripe accents.
 */
export type PipelineStageDensityProps = {
  prospects: Prospect[]
  stageConfig: StageConfig
}

const BAR_SLOTS = 20 // fixed column count for the bar grid

export function PipelineStageDensity({
  prospects,
  stageConfig,
}: PipelineStageDensityProps) {
  const { stages, qualified_stage_index } = stageConfig

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of stages) map.set(s, 0)
    for (const p of prospects) {
      map.set(p.stage, (map.get(p.stage) ?? 0) + 1)
    }
    return map
  }, [prospects, stages])

  const maxCount = useMemo(() => {
    let m = 0
    for (const v of counts.values()) if (v > m) m = v
    return m
  }, [counts])

  return (
    <section
      aria-labelledby="pipeline-density-eyebrow"
      data-igc-component="pipeline-stage-density"
      style={{ width: "100%" }}
    >
      {/* Header */}
      <div
        id="pipeline-density-eyebrow"
        className="flex items-baseline justify-between gap-6"
        style={{ paddingBottom: 16 }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#7C7A76",
            fontVariantNumeric: "tabular-nums",
            margin: 0,
          }}
        >
          01 · Stage density
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#7C7A76",
            fontVariantNumeric: "tabular-nums",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          {stages.length} stages
        </p>
      </div>

      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#20242A", width: "100%" }}
      />

      <div role="list" aria-label="Pipeline stage density">
        {stages.map((stage, i) => {
          const count = counts.get(stage) ?? 0
          const isEmpty = count === 0
          const isQualified = i >= qualified_stage_index
          const ordinal = String(i + 1).padStart(2, "0")
          const isLast = i === stages.length - 1

          const nameColor = isEmpty ? "#7C7A76" : "#FAF8F5"
          const countColor = isEmpty
            ? "#7C7A76"
            : isQualified
              ? "#C78B28"
              : "#FAF8F5"

          // Bar: scale count to BAR_SLOTS cells relative to max.
          const filled =
            maxCount > 0 ? Math.round((count / maxCount) * BAR_SLOTS) : 0
          const barColor = isEmpty
            ? "#20242A"
            : isQualified
              ? "#C78B28"
              : "#C3C0BB"

          return (
            <div key={stage} role="listitem">
              <div
                data-igc-pipeline-stage={stage}
                data-igc-empty={isEmpty ? "true" : "false"}
                data-igc-qualified={isQualified ? "true" : "false"}
                className="grid items-center"
                style={{
                  gridTemplateColumns:
                    "32px minmax(0, 1fr) minmax(0, 1.2fr) 48px",
                  columnGap: 16,
                  padding: "8px 0",
                  minHeight: 32,
                }}
              >
                {/* Ordinal */}
                <span
                  className="font-mono"
                  aria-hidden="true"
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    color: isEmpty ? "#7C7A76" : "#9C9995",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {ordinal}
                </span>

                {/* Name */}
                <span
                  className="font-sans"
                  style={{
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    lineHeight: 1.35,
                    letterSpacing: "-0.005em",
                    color: nameColor,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {stage}
                </span>

                {/* Bar — tabular, 20 slot grid */}
                <span
                  className="inline-grid"
                  aria-hidden="true"
                  style={{
                    gridTemplateColumns: `repeat(${BAR_SLOTS}, 1fr)`,
                    columnGap: 2,
                    width: "100%",
                    maxWidth: 240,
                  }}
                >
                  {Array.from({ length: BAR_SLOTS }).map((_, j) => (
                    <span
                      key={j}
                      style={{
                        height: 8,
                        backgroundColor:
                          j < filled ? barColor : "#20242A",
                        opacity: j < filled ? 1 : 1,
                      }}
                    />
                  ))}
                </span>

                {/* Count */}
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.8125rem",
                    letterSpacing: "0.02em",
                    color: countColor,
                    fontVariantNumeric: "tabular-nums",
                    textAlign: "right",
                  }}
                >
                  {count}
                </span>
              </div>

              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{
                    height: 1,
                    backgroundColor: "#20242A",
                    width: "100%",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
