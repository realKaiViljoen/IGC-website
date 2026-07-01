"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * ExportButton - the no-lock-in receipt.
 *
 * Mounted inline in the Sidebar (below Consultant block, above Sign out).
 * Full-width within the sidebar rail. No longer fixed-position chrome.
 *
 * States cycle through: idle -> compiling (with a live HH:MM:SS UTC timestamp)
 * -> success ("EXPORTED . HH:MM UTC" for 2.5s) -> idle. On failure we surface
 * "EXPORT FAILED . RETRY" in amber; a single click retries.
 *
 * Reduced-motion: snap to end-state (no state-flip transitions); everything
 * else is the same.
 *
 * Microcopy is uppercase Geist Mono, tabular-nums. No em-dashes, no
 * exclamation marks, no emoji (the success checkmark is a literal "✓").
 */

type ButtonState =
  | { kind: "idle" }
  | { kind: "compiling"; startedAt: number }
  | { kind: "success"; completedAt: number }
  | { kind: "error" }

type ExportButtonProps = {
  /** Authenticated client uid; used both for the API call and the filename. */
  uid: string
}

const SUCCESS_DURATION_MS = 2500

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

/** HH:MM:SS from a Date, UTC. */
function formatHms(d: Date): string {
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`
}

/** HH:MM from a Date, UTC. */
function formatHm(d: Date): string {
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`
}

/** YYYYMMDD from a Date, UTC; mirrors the route filename logic. */
function formatYyyymmdd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "")
}

export function ExportButton({ uid }: ExportButtonProps) {
  const [state, setState] = useState<ButtonState>({ kind: "idle" })
  // Ticker that forces a re-render once per second while compiling, so the
  // HH:MM:SS UTC label updates in place.
  const [, setTick] = useState(0)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const compileTickerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep the compiling ticker in lockstep with component state.
  useEffect(() => {
    if (state.kind === "compiling") {
      compileTickerRef.current = setInterval(() => setTick((n) => n + 1), 1000)
      return () => {
        if (compileTickerRef.current) {
          clearInterval(compileTickerRef.current)
          compileTickerRef.current = null
        }
      }
    }
    return
  }, [state.kind])

  // Auto-restore idle after a successful export.
  useEffect(() => {
    if (state.kind === "success") {
      successTimerRef.current = setTimeout(() => {
        setState({ kind: "idle" })
      }, SUCCESS_DURATION_MS)
      return () => {
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current)
          successTimerRef.current = null
        }
      }
    }
    return
  }, [state.kind])

  const triggerExport = useCallback(async () => {
    // Re-entrancy guard: ignore clicks while already compiling.
    if (state.kind === "compiling") return

    setState({ kind: "compiling", startedAt: Date.now() })

    try {
      const res = await fetch(`/api/client/${uid}/export`, {
        method: "GET",
        credentials: "same-origin",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)

      // Prefer the server-side filename if it arrived; fall back to a locally
      // computed one so behaviour is predictable even if headers are stripped
      // by an intermediary.
      const disposition = res.headers.get("Content-Disposition") ?? ""
      const match = disposition.match(/filename="?([^";]+)"?/i)
      const filename =
        match?.[1] ?? `igc-export-${uid}-${formatYyyymmdd(new Date())}.json`

      const a = document.createElement("a")
      a.href = objectUrl
      a.download = filename
      // Append -> click -> remove is the widely-compatible incantation.
      document.body.appendChild(a)
      a.click()
      a.remove()
      // Release the blob URL on the next tick so the download has latched.
      setTimeout(() => URL.revokeObjectURL(objectUrl), 0)

      setState({ kind: "success", completedAt: Date.now() })
    } catch {
      setState({ kind: "error" })
    }
  }, [state.kind, uid])

  // Label logic ----------------------------------------------------------
  const now = new Date()
  let label: React.ReactNode = "EXPORT EVERYTHING"
  if (state.kind === "compiling") {
    label = `COMPILING · ${formatHms(now)} UTC`
  } else if (state.kind === "success") {
    label = `✓ EXPORTED · ${formatHm(new Date(state.completedAt))} UTC`
  } else if (state.kind === "error") {
    label = "EXPORT FAILED · RETRY"
  }

  const isError = state.kind === "error"

  // Base classes: inline sidebar button, full-width within rail, 36px tall.
  // Geist Mono 11px uppercase with 0.14em tracking. Hover lifts border to
  // gold, no fill. Active dims the background a touch. Focus-visible mirrors
  // the Sidebar pattern. Error flips ink + border to amber without fill.
  const base =
    "inline-flex w-full h-9 items-center justify-center whitespace-nowrap " +
    "border px-[14px] font-mono text-[11px] font-medium uppercase tracking-[0.14em] tabular-nums " +
    "select-none transition-[border-color,background-color,color] duration-150 " +
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[#0A0B0E] motion-reduce:transition-none"
  const palette = isError
    ? "bg-[#101215] border-[#C78B28] text-[#C78B28] hover:border-[#C78B28] cursor-pointer"
    : "bg-[#101215] border-[#262A30] text-[#FAF9F7] hover:border-[#C9922A] active:bg-[#1A1D22] " +
      (state.kind === "compiling" ? "cursor-progress opacity-[0.85]" : "cursor-pointer")

  return (
    <button
      type="button"
      onClick={triggerExport}
      disabled={state.kind === "compiling"}
      aria-label="Export everything as a JSON file"
      aria-live="polite"
      data-state={state.kind}
      className={`${base} ${palette}`}
    >
      <span>{label}</span>
      {/* Screen-reader-only error hint; visible label already reads "RETRY". */}
      {isError ? (
        <span className="sr-only">
          Export failed. Activate the button to retry.
        </span>
      ) : null}
    </button>
  )
}
