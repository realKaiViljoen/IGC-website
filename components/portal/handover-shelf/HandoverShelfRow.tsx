"use client"

import { forwardRef } from "react"
import type { HandoverItem } from "@/types/client"

/**
 * Asset shelf row — full-page register. One of six on the Handover surface.
 *
 * Register: editorial ledger, not tabular. Generous row padding (~24px top/
 * bottom inside a 56–72px rhythm). Three-column baseline grid:
 *
 *   [01  Outreach sequences]          [IN PROGRESS]        [not started]
 *    ordinal  name (Fraunces 20px)     state chip (mono)    timestamp / label
 *
 * All rows are clickable — even `not-started`. not-started rows stay visually
 * muted (no hover gold), but do open the drawer to show the empty state note.
 *
 * States → chip text / colour (Gold Rule):
 *   not-started      → "NOT STARTED"       — #5E5850 (faint)
 *   in-progress      → "IN PROGRESS"       — #A8A6A3
 *   ready-for-review → "READY FOR REVIEW"  — #FAF9F7
 *   shipped          → "SHIPPED"           — #C9922A (OWNED)
 *   transferred      → "TRANSFERRED"       — #C9922A (OWNED)
 */
export type HandoverShelfRowProps = {
  item: HandoverItem
  index: number
  tabIndex: number
  drawerOpenForThis: boolean
  onClick: () => void
}

const STATE_LABEL: Record<HandoverItem["state"], string> = {
  "not-started": "NOT STARTED",
  "in-progress": "IN PROGRESS",
  "ready-for-review": "READY FOR REVIEW",
  shipped: "SHIPPED",
  transferred: "TRANSFERRED",
}

function stateColor(state: HandoverItem["state"]): string {
  switch (state) {
    case "transferred":
    case "shipped":
      return "#C9922A"
    case "ready-for-review":
      return "#FAF9F7"
    case "in-progress":
      return "#A8A6A3"
    case "not-started":
    default:
      return "#5E5850"
  }
}

function formatUKDate(iso: string): string {
  return new Date(iso + (iso.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  )
}

function timestampFor(item: HandoverItem): string {
  if (item.transferred_at) return formatUKDate(item.transferred_at)
  if (item.shipped_at) return formatUKDate(item.shipped_at)
  if (item.state === "not-started") return "not started"
  if (item.state === "ready-for-review") return "awaiting review"
  if (item.state === "in-progress") return "in build"
  return ""
}

export const HandoverShelfRow = forwardRef<HTMLButtonElement, HandoverShelfRowProps>(
  function HandoverShelfRow(props, ref) {
    const { item, index, tabIndex, drawerOpenForThis, onClick } = props
    const isEmpty = item.state === "not-started"
    const ordinal = String(index + 1).padStart(2, "0")
    const label = STATE_LABEL[item.state]
    const color = stateColor(item.state)
    const timestamp = timestampFor(item)
    const nameColor = isEmpty ? "#5E5850" : "#FAF9F7"

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        tabIndex={tabIndex}
        aria-haspopup="dialog"
        aria-expanded={drawerOpenForThis}
        aria-label={`${item.name}, ${label.toLowerCase()}. Open detail.`}
        data-igc-handover-shelf-row={item.key}
        data-igc-state={item.state}
        className="group block w-full text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
        style={{
          padding: "28px 0",
          background: "transparent",
          border: "none",
          cursor: isEmpty ? "default" : "pointer",
        }}
      >
        <div
          className="grid items-baseline"
          style={{
            gridTemplateColumns: "auto 1fr auto auto",
            columnGap: "1.75rem",
          }}
        >
          {/* Ordinal */}
          <span
            aria-hidden="true"
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              color: isEmpty ? "#5E5850" : "#857F74",
              fontVariantNumeric: "tabular-nums",
              minWidth: "2ch",
            }}
          >
            {ordinal}
          </span>

          {/* Name — Fraunces 20px. Body register (below display threshold
              used for H1/H2), but this is the item-level title in a ledger
              where each row carries gravitas; kept at 20px per brief. */}
          <span
            className="font-display"
            style={{
              fontWeight: 400,
              fontSize: "1.25rem",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              color: nameColor,
              fontOpticalSizing: "auto",
              fontVariationSettings: '"opsz" 36, "SOFT" 30',
              textWrap: "balance",
              transition: "color 150ms",
            }}
          >
            {item.name}
          </span>

          {/* State chip — text, no pill */}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              color,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>

          {/* Timestamp / faint label */}
          <span
            className="font-mono"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.04em",
              color: isEmpty ? "#5E5850" : "#857F74",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
              minWidth: "9ch",
              textAlign: "right",
              textTransform: isEmpty ? "lowercase" : "none",
            }}
          >
            {timestamp}
          </span>
        </div>
      </button>
    )
  },
)
