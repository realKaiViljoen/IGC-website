"use client"

import { useEffect, useRef } from "react"

/**
 * Global keyboard shortcut hook. Binds a single `keydown` listener at the
 * window level and dispatches to the provided actions.
 *
 * Scope rules (the "don't fight the user" principle):
 * - Ignore keys when focus is inside an input, textarea, contenteditable, or
 *   the cmdk search input. The palette's own `⌘K` is handled separately and
 *   always fires.
 * - `j` and `k` are NOT bound here. They remain local to Guarantee and
 *   Handover row-nav hooks so they don't collide when those rows own focus.
 *   They appear in the `?` cheatsheet for discoverability.
 * - `g` is a sequence prefix: `g o`, `g g`, `g p` etc., within 1000ms.
 *   Abandoned sequences time out silently.
 *
 * All modifiers resolved cross-platform: `Cmd` on Mac, `Ctrl` elsewhere. The
 * palette binding (`⌘K` / `Ctrl+K`) lives in PaletteProvider — this hook
 * handles everything else.
 */

export type GlobalShortcutActions = {
  /** Open command palette. */
  openPalette: () => void
  /** Close any overlay (palette, help, drawer). Best-effort; owners decide. */
  closeOverlays: () => void
  /** Open the `?` keyboard cheatsheet. */
  openHelp: () => void
  /** Route to a portal path via `router.push`. */
  navigate: (path: string) => void
  /** Compose email to K.C. */
  emailKc: () => void
  /** Trigger Export Everything. */
  exportEverything: () => void
}

const SEQUENCE_WINDOW_MS = 1000

/** Returns true when focus is inside an input-like surface — skip shortcuts. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
  if (target.isContentEditable) return true
  // cmdk input carries `[cmdk-input]`.
  if (target.hasAttribute("cmdk-input")) return true
  return false
}

export function useGlobalShortcuts(actions: GlobalShortcutActions) {
  const actionsRef = useRef(actions)
  actionsRef.current = actions

  // Sequence state lives in a ref to avoid re-binding the listener.
  const sequenceRef = useRef<{ prefix: string | null; at: number }>({
    prefix: null,
    at: 0,
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Escape always fires, even in editable fields — it closes overlays and
      // blurs the palette input.
      if (e.key === "Escape") {
        actionsRef.current.closeOverlays()
        return
      }

      if (isEditableTarget(e.target)) return

      // `⌘K` / `Ctrl+K`.
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault()
        actionsRef.current.openPalette()
        return
      }

      // Any other modifier combo is off-limits for our bindings.
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // `?` opens help. On most layouts this is Shift + /.
      if (e.key === "?") {
        e.preventDefault()
        actionsRef.current.openHelp()
        return
      }

      const now = Date.now()
      const seq = sequenceRef.current

      // Sequence second letter: `g o`, `g g`, etc.
      if (seq.prefix === "g" && now - seq.at < SEQUENCE_WINDOW_MS) {
        const target = goTargetFor(e.key)
        if (target) {
          e.preventDefault()
          actionsRef.current.navigate(target)
        }
        sequenceRef.current = { prefix: null, at: 0 }
        return
      }

      // Start a `g` sequence.
      if (e.key === "g") {
        e.preventDefault()
        sequenceRef.current = { prefix: "g", at: now }
        return
      }

      // Single-key bindings. `n` email, `e` export.
      if (e.key === "n") {
        e.preventDefault()
        actionsRef.current.emailKc()
        return
      }
      if (e.key === "e") {
        e.preventDefault()
        actionsRef.current.exportEverything()
        return
      }

      // Anything else resets the sequence.
      sequenceRef.current = { prefix: null, at: 0 }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}

/** Map `g X` second letter to a portal route. Returns null if no match. */
function goTargetFor(key: string): string | null {
  switch (key) {
    case "o":
      return "/portal/system/overview"
    case "g":
      return "/portal/system/guarantee"
    case "p":
      return "/portal/system/pipeline"
    case "r":
      return "/portal/system/outreach"
    case "d":
      return "/portal/system/deliverability"
    case "b":
      return "/portal/system/briefings"
    case "h":
      return "/portal/system/handover"
    default:
      return null
  }
}
