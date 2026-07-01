"use client"

import type { HandoverItem } from "@/types/client"

/**
 * Progress strip — six small horizontal segments, one per asset item.
 *
 * Not a progress bar. A ledger rail. Each segment is a quiet index of where
 * that item stands. Colour-per-state:
 *   not-started      → faint `#857F74`
 *   in-progress      → `#A8A6A3`
 *   ready-for-review → `#FAF9F7`
 *   shipped          → gold outline `#C9922A` (hairline at top)
 *   transferred      → solid gold fill `#C9922A` (OWNED moment)
 *
 * Hairlines between segments, 1px, `#2D2A27` — matches the ledger DNA.
 */
type Props = {
  items: HandoverItem[]
}

function segmentStyle(state: HandoverItem["state"]): React.CSSProperties {
  switch (state) {
    case "transferred":
      return { backgroundColor: "#C9922A" }
    case "shipped":
      return {
        backgroundColor: "transparent",
        boxShadow: "inset 0 1px 0 0 #C9922A",
      }
    case "ready-for-review":
      return { backgroundColor: "#FAF9F7" }
    case "in-progress":
      return { backgroundColor: "#A8A6A3" }
    case "not-started":
    default:
      return { backgroundColor: "#3A342E" }
  }
}

export function HandoverProgressStrip({ items }: Props) {
  return (
    <div
      role="img"
      aria-label={`Asset shelf state · ${items.length} items`}
      className="flex w-full"
      style={{ gap: 2, height: 3 }}
    >
      {items.map((item) => (
        <div
          key={item.key}
          data-state={item.state}
          className="flex-1"
          style={{
            ...segmentStyle(item.state),
            minWidth: 0,
          }}
        />
      ))}
    </div>
  )
}
