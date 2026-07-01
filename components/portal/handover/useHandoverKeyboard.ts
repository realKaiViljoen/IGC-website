"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Roving-tabindex keyboard navigation for the six-row handover ledger.
 *
 * `j` / `ArrowDown` → focus next actionable row
 * `k` / `ArrowUp`   → focus previous actionable row
 * `Home`            → focus first actionable row
 * `End`             → focus last actionable row
 * `Enter` / `Space` → open drawer for focused row (handled by the row itself)
 *
 * Scope: key handling is bound to the group element via the returned `onKeyDown`.
 * This avoids hijacking j/k elsewhere in the portal.
 *
 * Only actionable rows (state !== "not-started") participate in tab order.
 * Mirrors useGuaranteeKeyboard — same affordance vocabulary across Overview.
 */
export function useHandoverKeyboard(opts: {
  /** Indices [0..n-1] that are focusable. Not-started rows are excluded. */
  actionableIndices: number[]
  /** Index currently holding tabindex=0; others hold tabindex=-1. */
  activeIndex: number
  setActiveIndex: (next: number) => void
  /** Refs array; caller wires row nodes by index. */
  rowRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>
}) {
  const { actionableIndices, activeIndex, setActiveIndex, rowRefs } = opts
  const activeRef = useRef(activeIndex)
  activeRef.current = activeIndex

  const focusAt = useCallback(
    (idx: number) => {
      setActiveIndex(idx)
      queueMicrotask(() => {
        rowRefs.current[idx]?.focus()
      })
    },
    [setActiveIndex, rowRefs],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (actionableIndices.length === 0) return
      const current = actionableIndices.indexOf(activeRef.current)
      if (current === -1) return

      switch (e.key) {
        case "ArrowDown":
        case "j": {
          e.preventDefault()
          const next =
            actionableIndices[(current + 1) % actionableIndices.length]
          focusAt(next)
          break
        }
        case "ArrowUp":
        case "k": {
          e.preventDefault()
          const next =
            actionableIndices[
              (current - 1 + actionableIndices.length) % actionableIndices.length
            ]
          focusAt(next)
          break
        }
        case "Home": {
          e.preventDefault()
          focusAt(actionableIndices[0])
          break
        }
        case "End": {
          e.preventDefault()
          focusAt(actionableIndices[actionableIndices.length - 1])
          break
        }
      }
    },
    [actionableIndices, focusAt],
  )

  // If the active row was reclassified as not-actionable (stale data), snap to
  // the first actionable row to keep keyboard nav sane.
  useEffect(() => {
    if (actionableIndices.length === 0) return
    if (!actionableIndices.includes(activeIndex)) {
      setActiveIndex(actionableIndices[0])
    }
  }, [actionableIndices, activeIndex, setActiveIndex])

  return { onKeyDown }
}
