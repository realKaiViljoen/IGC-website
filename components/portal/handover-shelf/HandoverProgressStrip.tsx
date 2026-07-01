"use client"

import type { HandoverItem } from "@/types/client"

/**
 * Progress strip — six small horizontal segments, one per asset item.
 *
 * Not a progress bar. A ledger rail. Each segment is a quiet index of where
 * that item stands. Colour-per-state:
 *   not-started      → faint `#7C7A76`
 *   in-progress      → `#C3C0BB`
 *   ready-for-review → `#FAF8F5`
 *   shipped          → gold outline `#C78B28` (hairline at top)
 *   transferred      → solid gold fill `#C78B28` (OWNED moment)
 *
 * Hairlines between segments, 1px, `#20242A` — matches the ledger DNA.
 */
type Props = {
  items: HandoverItem[]
}

function segmentStyle(state: HandoverItem["state"]): React.CSSProperties {
  switch (state) {
    case "transferred":
      return { backgroundColor: "#C78B28" }
    case "shipped":
      return {
        backgroundColor: "transparent",
        boxShadow: "inset 0 1px 0 0 #C78B28",
      }
    case "ready-for-review":
      return { backgroundColor: "#FAF8F5" }
    case "in-progress":
      return { backgroundColor: "#C3C0BB" }
    case "not-started":
    default:
      return { backgroundColor: "#31363E" }
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
