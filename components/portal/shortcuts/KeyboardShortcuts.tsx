"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { usePalette } from "../palette/PaletteProvider"
import { useGlobalShortcuts } from "./useGlobalShortcuts"

/**
 * Mounts once at the portal layout level. Binds the global keyboard
 * shortcut listener and routes its events into the PaletteProvider.
 *
 * Universal chrome: same bindings for every client, every engagement state.
 *
 * The palette's own `⌘K` toggle is listener-owned (not cmdk-owned) so that
 * the shortcut works even when focus is sunk deep into a page's own
 * roving-tabindex controls (Guarantee row, Handover row).
 */

const KC_EMAIL = "hello@igc-growth.com"

function mailtoFor(company: string): string {
  const subject = encodeURIComponent(`${company} · note`)
  return `mailto:${KC_EMAIL}?subject=${subject}`
}

function triggerExport(uid: string) {
  if (typeof window === "undefined") return
  const d = new Date()
  const yyyymmdd = d.toISOString().slice(0, 10).replace(/-/g, "")
  const url = `/api/client/${uid}/export?date=${yyyymmdd}`
  const a = document.createElement("a")
  a.href = url
  a.download = `${uid}-${yyyymmdd}.zip`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const { setOpen, setHelpOpen, closeAll, client } = usePalette()

  const openPalette = useCallback(() => {
    setHelpOpen(false)
    setOpen(true)
  }, [setOpen, setHelpOpen])

  const openHelp = useCallback(() => {
    setOpen(false)
    setHelpOpen(true)
  }, [setOpen, setHelpOpen])

  const navigate = useCallback(
    (path: string) => {
      closeAll()
      router.push(path)
    },
    [closeAll, router],
  )

  const emailKc = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = mailtoFor(client.company)
    }
  }, [client.company])

  const exportEverything = useCallback(() => {
    triggerExport(client.uid)
  }, [client.uid])

  useGlobalShortcuts({
    openPalette,
    closeOverlays: closeAll,
    openHelp,
    navigate,
    emailKc,
    exportEverything,
  })

  return null
}
