"use client"

import { forwardRef } from "react"
import type { HandoverItem } from "@/types/client"

/**
 * A single ledger row. Six of these, stacked, form the Handover Pack.
 *
 * Visual contract:
 *   - Leading ordinal (01 · 02 · …) — Geist Mono, text-tertiary `#93918E`.
 *   - Item name — Fraunces 400 (NOT italic; italic reserved for K.C.'s voice).
 *   - Subtext line — Geist sans, text-secondary, smaller.
 *   - State label on the right — Geist Mono, uppercase, tabular-nums.
 *     Colour is the state's signal (see stateColor below).
 *
 * States & colours (Gold Rule — gold only for OWNED / transferred):
 *   not-started       → QUEUED   · #93918E (tertiary — quiet, waiting)
 *   in-progress       → IN PROG  · #857F74 (secondary — muted, working)
 *   ready-for-review  → READY    · #FAF9F7 (primary — asks attention)
 *   shipped           → SHIPPED  · #FAF9F7 (primary — completed)
 *   transferred       → OWNED    · #C9922A (gold — the ownership-transfer moment)
 *
 * Actionability:
 *   not-started rows are non-focusable, non-clickable, aria-disabled. No detail yet.
 *   All other rows are buttons that open the right-drawer.
 *
 * Focus: 1px gold focus-ring inset (focus-visible only, keyboard path).
 * Hover: no row-level scale or tilt. Custom portal cursor grows 28 → 40 via `button`
 * detection in components/ui/Cursor.tsx. Subtle name colour warm on hover.
 */
export type HandoverRowProps = {
  item: HandoverItem
  index: number
  /** Dot-separated spec line rendered after the name (e.g. "6 variants · LGM live"). */
  spec: string
  /** Second-line subtext — drawn from fixture metadata. */
  subtext: string
  /** Roving tabindex — 0 for the active row, -1 otherwise. */
  tabIndex: number
  drawerOpenForThis: boolean
  onClick?: () => void
}

const STATE_LABEL: Record<HandoverItem["state"], string> = {
  "not-started": "QUEUED",
  "in-progress": "IN PROG",
  "ready-for-review": "READY",
  shipped: "SHIPPED",
  transferred: "OWNED",
}

function stateColor(state: HandoverItem["state"]): string {
  switch (state) {
    case "transferred":
      return "#C9922A"
    case "shipped":
    case "ready-for-review":
      return "#FAF9F7"
    case "in-progress":
      return "#857F74"
    case "not-started":
    default:
      return "#93918E"
  }
}

export const HandoverRow = forwardRef<HTMLButtonElement | HTMLDivElement, HandoverRowProps>(
  function HandoverRow(props, ref) {
    const { item, index, spec, subtext, tabIndex, drawerOpenForThis, onClick } = props

    const isActionable = item.state !== "not-started"
    const label = STATE_LABEL[item.state]
    const color = stateColor(item.state)
    const ordinal = String(index + 1).padStart(2, "0")

    // Non-actionable row — semantic <div>, not focusable.
    if (!isActionable) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="listitem"
          data-igc-handover-row={item.key}
          data-igc-state={item.state}
          aria-disabled="true"
          className="block w-full text-left"
          style={{
            padding: "20px 0",
            cursor: "default",
            userSelect: "text",
          }}
        >
          <RowInner
            ordinal={ordinal}
            name={item.name}
            spec={spec}
            subtext={subtext}
            label={label}
            color={color}
            dim
          />
        </div>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        tabIndex={tabIndex}
        aria-haspopup="dialog"
        aria-expanded={drawerOpenForThis}
        aria-label={`${item.name}, ${label.toLowerCase()}. Open detail.`}
        data-igc-handover-row={item.key}
        data-igc-state={item.state}
        className="group block w-full text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
        style={{
          padding: "20px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <RowInner
          ordinal={ordinal}
          name={item.name}
          spec={spec}
          subtext={subtext}
          label={label}
          color={color}
        />
      </button>
    )
  },
)

function RowInner({
  ordinal,
  name,
  spec,
  subtext,
  label,
  color,
  dim = false,
}: {
  ordinal: string
  name: string
  spec: string
  subtext: string
  label: string
  color: string
  dim?: boolean
}) {
  const nameColor = dim ? "#A8A6A3" : "#FAF9F7"
  return (
    <div className="flex flex-col gap-1.5">
      {/* Line 1 · ordinal · name · spec  |  state label */}
      <div className="flex items-baseline gap-4 sm:gap-6">
        <span
          className="font-mono"
          aria-hidden="true"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            color: "#93918E",
            fontVariantNumeric: "tabular-nums",
            flex: "0 0 auto",
            minWidth: "2ch",
          }}
        >
          {ordinal}
        </span>

        <span
          className="font-sans transition-colors duration-150 group-hover:text-[#FAF9F7]"
          style={{
            fontWeight: 400,
            fontSize: "1.0625rem",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: nameColor,
            fontOpticalSizing: "auto",
            fontVariationSettings: '"opsz" 36, "SOFT" 40',
            flex: "1 1 auto",
            minWidth: 0,
            textWrap: "balance",
          }}
        >
          {name}
          {spec && (
            <span
              className="font-sans"
              style={{
                color: "#857F74",
                fontWeight: 400,
                fontSize: "0.8125rem",
                letterSpacing: 0,
                marginLeft: "0.75em",
              }}
            >
              {spec}
            </span>
          )}
        </span>

        <span
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color,
            fontVariantNumeric: "tabular-nums",
            flex: "0 0 auto",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>

      {/* Line 2 · subtext */}
      {subtext && (
        <p
          className="font-sans"
          style={{
            margin: 0,
            marginLeft: "calc(2ch + 1rem)", // align under name, offset past ordinal
            fontSize: "0.8125rem",
            lineHeight: 1.55,
            color: "#857F74",
            maxWidth: "64ch",
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  )
}
