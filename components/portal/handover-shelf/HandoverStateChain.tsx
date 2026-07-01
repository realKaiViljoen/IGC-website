"use client"

import type { HandoverItem } from "@/types/client"

/**
 * Five-state visualisation for a single handover item, rendered in the drawer.
 *
 * not-started → in-progress → ready-for-review → shipped → transferred
 *
 * Visual language: five hairline-connected dots. Earlier states are filled
 * (past); the current state is the filled terminus; future states are
 * hollow outlines. Gold reserved for `transferred` only.
 */
type Props = {
  state: HandoverItem["state"]
}

const STATES: HandoverItem["state"][] = [
  "not-started",
  "in-progress",
  "ready-for-review",
  "shipped",
  "transferred",
]

const STATE_LABEL: Record<HandoverItem["state"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  "ready-for-review": "Ready",
  shipped: "Shipped",
  transferred: "Transferred",
}

export function HandoverStateChain({ state }: Props) {
  const currentIdx = STATES.indexOf(state)
  return (
    <div className="flex flex-col gap-3" aria-label={`State: ${STATE_LABEL[state]}`}>
      <div className="flex items-center" style={{ gap: 0 }}>
        {STATES.map((s, i) => {
          const isPast = i < currentIdx
          const isCurrent = i === currentIdx
          const isGold = s === "transferred" && (isCurrent || isPast)

          // dot
          const dotBg = isGold
            ? "#C78B28"
            : isCurrent
              ? "#FAF8F5"
              : isPast
                ? "#7C7A76"
                : "transparent"
          const dotBorder = isGold
            ? "#C78B28"
            : isCurrent
              ? "#FAF8F5"
              : isPast
                ? "#7C7A76"
                : "#31363E"

          return (
            <div key={s} className="flex items-center" style={{ flex: i === STATES.length - 1 ? "0 0 auto" : "1 1 auto" }}>
              <span
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: dotBg,
                  border: `1px solid ${dotBorder}`,
                  flex: "0 0 auto",
                }}
              />
              {i < STATES.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    height: 1,
                    backgroundColor: i < currentIdx ? "#7C7A76" : "#20242A",
                    flex: "1 1 auto",
                    margin: "0 6px",
                    minWidth: 12,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex items-baseline" style={{ gap: 0 }}>
        {STATES.map((s, i) => {
          const isCurrent = i === currentIdx
          return (
            <span
              key={s}
              className="font-mono uppercase"
              style={{
                flex: i === STATES.length - 1 ? "0 0 auto" : "1 1 auto",
                fontSize: "0.625rem",
                letterSpacing: "0.14em",
                color: isCurrent
                  ? s === "transferred"
                    ? "#C78B28"
                    : "#FAF8F5"
                  : "#6B6966",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                textAlign: i === 0 ? "left" : i === STATES.length - 1 ? "right" : "left",
              }}
            >
              {STATE_LABEL[s]}
            </span>
          )
        })}
      </div>
    </div>
  )
}
