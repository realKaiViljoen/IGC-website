"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Roving-tabindex keyboard navigation for the five-square row.
 *
 * `j` / `ArrowRight`  → focus next filled square
 * `k` / `ArrowLeft`   → focus previous filled square
 * `Home`              → focus first filled square
 * `End`               → focus last filled square
 * `Enter` / `Space`   → open drawer for focused square (handled by the square itself)
 *
 * Scope: key handling is bound to the group element (`onKeyDown`). This avoids
 * hijacking j/k anywhere else in the portal.
 *
 * Only filled squares are focusable. Hollow squares are `role="presentation"`.
 */
export function useGuaranteeKeyboard(opts: {
  /** The set of indices [0..total-1] that are filled (= focusable). */
  filledIndices: number[]
  /** Index currently carrying tabindex=0; others carry tabindex=-1. */
  activeIndex: number
  setActiveIndex: (next: number) => void
  /** Refs array; caller wires square nodes by index. */
  squareRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>
}) {
  const { filledIndices, activeIndex, setActiveIndex, squareRefs } = opts
  const activeRef = useRef(activeIndex)
  activeRef.current = activeIndex

  const focusAt = useCallback(
    (idx: number) => {
      setActiveIndex(idx)
      // Next tick — let roving tabindex settle, then shift focus.
      queueMicrotask(() => {
        squareRefs.current[idx]?.focus()
      })
    },
    [setActiveIndex, squareRefs],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (filledIndices.length === 0) return
      const current = filledIndices.indexOf(activeRef.current)
      if (current === -1) return

      switch (e.key) {
        case "ArrowRight":
        case "j": {
          e.preventDefault()
          const next = filledIndices[(current + 1) % filledIndices.length]
          focusAt(next)
          break
        }
        case "ArrowLeft":
        case "k": {
          e.preventDefault()
          const next =
            filledIndices[(current - 1 + filledIndices.length) % filledIndices.length]
          focusAt(next)
          break
        }
        case "Home": {
          e.preventDefault()
          focusAt(filledIndices[0])
          break
        }
        case "End": {
          e.preventDefault()
          focusAt(filledIndices[filledIndices.length - 1])
          break
        }
      }
    },
    [filledIndices, focusAt],
  )

  // If the active square was re-classified as hollow (stale data), snap focus
  // to the first filled square to keep keyboard nav sane.
  useEffect(() => {
    if (filledIndices.length === 0) return
    if (!filledIndices.includes(activeIndex)) {
      setActiveIndex(filledIndices[0])
    }
  }, [filledIndices, activeIndex, setActiveIndex])

  return { onKeyDown }
}
