"use client"

import { forwardRef } from "react"
import type { Prospect } from "@/types/client"
import { TierDot } from "./TierDot"
import { formatCurrency, formatRelativeDate } from "@/lib/pipeline"

/**
 * A single Pipeline Ledger row. Dense, tabular, Bloomberg-register.
 *
 * Columns (desktop grid, aligned to the header row above the ledger):
 *   1. Company   · flex      · Geist 400 14px, primary
 *   2. Contact   · flex      · Geist 400 13px, secondary
 *   3. Stage     · 180px     · Geist 400 13px, primary (gold if qualified)
 *   4. Touch     · 110px     · Geist Mono 12px tabular, tertiary
 *   5. Tier      · 56px      · TierDot glyph (gold-flipped when qualified)
 *   6. Value     · 110px rt  · Geist Mono 12px tabular, primary
 *
 * Row height ~32px. No side-stripes. Gold stays gated to the qualified flag
 * and the single restricted accent colour.
 *
 * Behaviour:
 *   - <button> with roving tabIndex.
 *   - Hover: surface warms to #0F1216; gold only if already in qualified zone.
 *   - Click → open drawer; Enter/Space from keyboard likewise.
 */
export type PipelineRowProps = {
  prospect: Prospect
  qualifiedStageIndex: number
  stageIndex: number
  nowUtcMs: number
  tabIndex: number
  isFocused: boolean
  drawerOpenForThis: boolean
  onClick: () => void
}

export const PipelineRow = forwardRef<HTMLButtonElement, PipelineRowProps>(
  function PipelineRow(props, ref) {
    const {
      prospect,
      qualifiedStageIndex,
      stageIndex,
      nowUtcMs,
      tabIndex,
      isFocused,
      drawerOpenForThis,
      onClick,
    } = props

    const qualified = stageIndex >= qualifiedStageIndex

    const stageColor = qualified ? "#C78B28" : "#FAF8F5"
    const relative = formatRelativeDate(prospect.last_touch, nowUtcMs)
    const value = formatCurrency(
      prospect.estimated_contract_value_cents,
      prospect.currency,
    )

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        tabIndex={tabIndex}
        aria-haspopup="dialog"
        aria-expanded={drawerOpenForThis}
        aria-label={`${prospect.company}, ${prospect.name}, ${prospect.stage}. Open detail.`}
        data-igc-pipeline-row={prospect.id}
        data-igc-qualified={qualified ? "true" : "false"}
        data-igc-focused={isFocused ? "true" : "false"}
        className="group w-full text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-inset"
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1.4fr) minmax(0, 1.2fr) 180px 110px 56px 110px",
          columnGap: 16,
          alignItems: "center",
          padding: "6px 12px",
          minHeight: 30,
          background: isFocused ? "#0F1216" : "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        {/* Company */}
        <span
          className="font-sans transition-colors duration-150 group-hover:text-[#FAF8F5]"
          style={{
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: 1.35,
            letterSpacing: "-0.005em",
            color: "#FAF8F5",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {prospect.company}
        </span>

        {/* Contact */}
        <span
          className="font-sans"
          style={{
            fontWeight: 400,
            fontSize: "0.8125rem",
            lineHeight: 1.35,
            color: "#C3C0BB",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {prospect.name}
        </span>

        {/* Stage */}
        <span
          className="font-sans"
          style={{
            fontWeight: 400,
            fontSize: "0.8125rem",
            lineHeight: 1.35,
            color: stageColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {prospect.stage}
        </span>

        {/* Last touch */}
        <span
          className="font-mono"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.02em",
            color: "#9C9995",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {relative}
        </span>

        {/* Tier */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 12,
          }}
        >
          <TierDot tier={prospect.tier} qualified={qualified} />
        </span>

        {/* Value */}
        <span
          className="font-mono"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.02em",
            color: "#FAF8F5",
            fontVariantNumeric: "tabular-nums",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>
      </button>
    )
  },
)
