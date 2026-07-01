"use client"

/**
 * ArchiveExportButton — quiet, non-gold affordance at the foot of the page.
 *
 * Placeholder state: clicking sets a short "Queued for Phase 3b" label in
 * place of the original. No toast library, no navigation. The affordance is
 * the point — the user wanted it present.
 */

import { useCallback, useEffect, useRef, useState } from "react"

type State = "idle" | "queued"

const QUEUED_MS = 2200

export function ArchiveExportButton() {
  const [state, setState] = useState<State>("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (state === "queued") {
      timerRef.current = setTimeout(() => setState("idle"), QUEUED_MS)
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
      }
    }
    return
  }, [state])

  const onClick = useCallback(() => {
    if (state === "queued") return
    setState("queued")
  }, [state])

  const label =
    state === "queued" ? "Queued for Phase 3b" : "Export archive as PDF ↓"

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className="font-sans inline-flex items-center justify-center h-9 px-4 border bg-transparent text-[#FAF9F7] border-[#262A30] transition-colors duration-150 hover:border-[#857F74] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
      style={{
        fontSize: "0.875rem",
        letterSpacing: "0",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  )
}
