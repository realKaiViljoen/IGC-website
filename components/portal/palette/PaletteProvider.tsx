"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { ClientData } from "@/types/client"

/**
 * PaletteProvider owns the open/close state for the command palette and the
 * help overlay. One listener, one mount point, one source of truth — the
 * rest of the portal consumes through hooks.
 *
 * Scope of state:
 * - `open`          — palette visibility
 * - `query`         — current search string (lifted so actions can seed it)
 * - `helpOpen`      — `?` cheatsheet visibility
 *
 * The provider is universal chrome. It renders the same for every client
 * regardless of engagement phase (`pre-outreach` … `archive`). Content piped
 * through (prospects, briefings) changes; the surface does not.
 */

type PaletteContextValue = {
  open: boolean
  setOpen: (next: boolean) => void
  toggle: () => void
  query: string
  setQuery: (next: string) => void
  helpOpen: boolean
  setHelpOpen: (next: boolean) => void
  closeAll: () => void
  /** Client record, piped down so items can read prospects / briefings / company. */
  client: ClientData
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

export function PaletteProvider({
  client,
  children,
}: {
  client: ClientData
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [helpOpen, setHelpOpen] = useState(false)

  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  const closeAll = useCallback(() => {
    setOpen(false)
    setHelpOpen(false)
  }, [])

  // When the palette closes, clear the query so next open starts fresh.
  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  // Lock background scroll while any overlay is open. Universal chrome rule:
  // the page beneath stays exactly where the client left it.
  useEffect(() => {
    if (open || helpOpen) {
      const previous = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = previous
      }
    }
  }, [open, helpOpen])

  const value = useMemo<PaletteContextValue>(
    () => ({
      open,
      setOpen,
      toggle,
      query,
      setQuery,
      helpOpen,
      setHelpOpen,
      closeAll,
      client,
    }),
    [open, toggle, query, helpOpen, closeAll, client],
  )

  return (
    <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
  )
}

export function usePalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext)
  if (!ctx) {
    throw new Error("usePalette must be used inside <PaletteProvider>.")
  }
  return ctx
}
