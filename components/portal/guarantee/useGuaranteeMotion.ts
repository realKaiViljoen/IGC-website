"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import type { GuaranteeTrackerState } from "@/types/client"

/**
 * Governs the signature motion — the one moment the Guarantee Tracker
 * earns gold.
 *
 * The signature plays on the real-time `met` transition only:
 *   - Cold mount already in `met`: static render, no motion.
 *   - Cold mount in behind/on-pace/ahead, SWR revalidation flips to `met`: play once.
 *
 * Replay policy per brief §7:
 *   localStorage `igc-guarantee-met-seen-{uid}` → set once after first play.
 *   Subsequent mounts never replay.
 *
 * `prefers-reduced-motion: reduce` → snap to end-state instantly. Final visual identical.
 *
 * Returns:
 *   `shouldAnimate` — pass to sub-components so they opt into the sequence.
 *   `reducedMotion` — component renders the final gold+hairline+stamp without transitions.
 */
export function useGuaranteeMotion(opts: {
  state: GuaranteeTrackerState
  uid: string
}) {
  const { state, uid } = opts
  const reducedMotion = useReducedMotion() ?? false

  const [shouldAnimate, setShouldAnimate] = useState(false)
  const previousStateRef = useRef<GuaranteeTrackerState>(state)
  const initializedRef = useRef(false)

  const storageKey = `igc-guarantee-met-seen-${uid}`

  useEffect(() => {
    // First effect run: capture cold-mount state. If we start in met/archive, we
    // silently flip the seen flag on so a second visit is unambiguously static.
    if (!initializedRef.current) {
      initializedRef.current = true
      if (state === "met" || state === "archive") {
        try {
          window.localStorage.setItem(storageKey, "1")
        } catch {
          /* private-mode / quota — acceptable to skip */
        }
      }
      previousStateRef.current = state
      return
    }

    // Real transition into met (not archive — archive is the post-30-day
    // trophy state, which is always static per the brief).
    const prev = previousStateRef.current
    previousStateRef.current = state

    if (state !== "met") return
    if (prev === "met" || prev === "archive") return

    let seen = false
    try {
      seen = window.localStorage.getItem(storageKey) === "1"
    } catch {
      seen = false
    }
    if (seen) return

    // Fire the sequence.
    setShouldAnimate(true)

    // Flip the flag immediately so a mid-sequence reload doesn't replay.
    try {
      window.localStorage.setItem(storageKey, "1")
    } catch {
      /* ignore */
    }

    // Clean up the flag on unmount; subsequent renders read a static final state.
    const timeout = window.setTimeout(() => setShouldAnimate(false), 900)
    return () => window.clearTimeout(timeout)
  }, [state, storageKey])

  return { shouldAnimate, reducedMotion }
}
