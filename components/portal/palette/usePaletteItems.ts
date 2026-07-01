"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { ClientData } from "@/types/client"

/**
 * Palette item taxonomy. Every selectable row is one of these.
 *
 * The `id` is stable across sections so the Recent list can dedupe across
 * palette sessions. Prospect ids already ship as `p-001`; we prefix each
 * other section so there's no collision.
 */
export type PaletteSectionKind =
  | "recent"
  | "navigation"
  | "prospects"
  | "briefings"
  | "actions"
  | "help"

export type PaletteItem = {
  id: string
  section: PaletteSectionKind
  /** Primary line (Geist sans). */
  label: string
  /** Optional second line (Geist sans, text-secondary). */
  secondary?: string
  /** Right-side meta (Geist Mono). */
  meta?: string
  /** Icon glyph (DM Mono character) — matches Sidebar vocabulary. */
  glyph?: string
  /**
   * Value passed into cmdk's keyword matcher. By default cmdk indexes the
   * `value` prop; we collapse the visible text so search hits on any part.
   */
  keywords: string[]
  /** Called when this row is executed (Enter or click). */
  onSelect: () => void
}

export type PaletteSection = {
  kind: PaletteSectionKind
  heading: string
  items: PaletteItem[]
}

type RecentEntry = {
  id: string
  section: PaletteSectionKind
  label: string
  secondary?: string
  meta?: string
  glyph?: string
  /** Carried through so we can resurrect the right onSelect target. */
  payload?:
    | { kind: "navigate"; href: string }
    | { kind: "prospect"; prospectId: string }
    | { kind: "briefing"; loomUrl: string }
    | { kind: "action"; actionId: string }
}

const RECENT_CAP = 5

function recentStorageKey(uid: string): string {
  return `igc-palette-recent-${uid}`
}

function readRecent(uid: string): RecentEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(recentStorageKey(uid))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, RECENT_CAP) as RecentEntry[]
  } catch {
    return []
  }
}

function writeRecent(uid: string, next: RecentEntry[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      recentStorageKey(uid),
      JSON.stringify(next.slice(0, RECENT_CAP)),
    )
  } catch {
    // Quota / private mode. Silent fail — Recent is an enhancement.
  }
}

/** Format a briefing `week_of` ISO date into `Week of DD Mon`. */
function formatWeekOf(iso: string): string {
  const d = new Date(iso + "T00:00:00Z")
  if (Number.isNaN(d.getTime())) return "Week"
  const day = d.getUTCDate().toString().padStart(2, "0")
  const mon = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" })
  return `Week of ${day} ${mon}`
}

/** Loom duration seconds → `MM:SS`. */
function formatDuration(seconds: number | undefined): string {
  if (!seconds) return ""
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/** Days between `from` and today (UTC). Rounds down. */
function daysAgo(iso: string): number {
  const then = new Date(iso + "T00:00:00Z").getTime()
  const now = Date.now()
  return Math.max(0, Math.floor((now - then) / 86400000))
}

const NAV_ITEMS: Array<{
  href: string
  label: string
  glyph: string
  shortcut: string
}> = [
  { href: "/portal/system/overview", label: "Overview", glyph: "◇", shortcut: "g o" },
  { href: "/portal/system/guarantee", label: "Guarantee", glyph: "◯", shortcut: "g g" },
  { href: "/portal/system/pipeline", label: "Pipeline", glyph: "◈", shortcut: "g p" },
  { href: "/portal/system/outreach", label: "Outreach", glyph: "◉", shortcut: "g r" },
  { href: "/portal/system/deliverability", label: "Deliverability", glyph: "◎", shortcut: "g d" },
  { href: "/portal/system/briefings", label: "Briefings", glyph: "◍", shortcut: "g b" },
  { href: "/portal/system/handover", label: "Handover", glyph: "◐", shortcut: "g h" },
]

export type PaletteActions = {
  navigate: (href: string) => void
  openHelp: () => void
  exportEverything: () => void
  emailKc: () => void
  signOut: () => void
  /** Called after any row is selected so the provider can close / log. */
  onAfterSelect: () => void
}

/**
 * Assembles the full set of sections for the palette, wires recent-history
 * persistence, and returns a helper to flush a pick into Recent.
 */
export function usePaletteItems(
  client: ClientData,
  actions: PaletteActions,
): { sections: PaletteSection[]; recordPick: (item: PaletteItem) => void } {
  const { uid } = client

  // Recent items — hydrated after mount to keep SSR output stable.
  const [recent, setRecent] = useState<RecentEntry[]>([])
  useEffect(() => {
    setRecent(readRecent(uid))
  }, [uid])

  const recordPick = useCallback(
    (item: PaletteItem) => {
      // Translate the item into a resurrectable Recent entry.
      let payload: RecentEntry["payload"]
      if (item.section === "navigation") {
        const nav = NAV_ITEMS.find((n) => n.label === item.label)
        if (nav) payload = { kind: "navigate", href: nav.href }
      } else if (item.section === "prospects") {
        payload = { kind: "prospect", prospectId: item.id.replace(/^prospect:/, "") }
      } else if (item.section === "briefings") {
        // Reconstitute the Loom URL by looking up the briefing id.
        const briefingId = item.id.replace(/^briefing:/, "")
        const b = client.briefings.find((x) => x.id === briefingId)
        if (b) payload = { kind: "briefing", loomUrl: b.loom_url }
      } else if (item.section === "actions") {
        payload = { kind: "action", actionId: item.id.replace(/^action:/, "") }
      }

      const entry: RecentEntry = {
        id: item.id,
        section: item.section,
        label: item.label,
        secondary: item.secondary,
        meta: item.meta,
        glyph: item.glyph,
        payload,
      }
      setRecent((prev) => {
        const without = prev.filter((e) => e.id !== entry.id)
        const next = [entry, ...without].slice(0, RECENT_CAP)
        writeRecent(uid, next)
        return next
      })
    },
    [client.briefings, uid],
  )

  const sections = useMemo<PaletteSection[]>(() => {
    // ── Navigation ─────────────────────────────────────────────────────
    const navigation: PaletteItem[] = NAV_ITEMS.map((n) => ({
      id: `nav:${n.href}`,
      section: "navigation",
      label: n.label,
      glyph: n.glyph,
      meta: n.shortcut,
      keywords: ["go to", n.label.toLowerCase(), n.shortcut],
      onSelect: () => {
        actions.navigate(n.href)
        actions.onAfterSelect()
      },
    }))

    // ── Prospects (top 10 by last_touch desc) ──────────────────────────
    const prospects: PaletteItem[] = [...client.prospects]
      .sort(
        (a, b) =>
          new Date(b.last_touch).getTime() - new Date(a.last_touch).getTime(),
      )
      .slice(0, 10)
      .map((p) => ({
        id: `prospect:${p.id}`,
        section: "prospects",
        label: `${p.company}`,
        secondary: `${p.name}, ${p.role}`,
        meta: p.stage,
        keywords: [
          p.company.toLowerCase(),
          p.name.toLowerCase(),
          p.role.toLowerCase(),
          p.stage.toLowerCase(),
        ],
        onSelect: () => {
          // Phase 3 will wire the drawer; for now, navigate with a query param.
          actions.navigate(`/portal/system/pipeline?prospect=${p.id}`)
          actions.onAfterSelect()
        },
      }))

    // ── Briefings ──────────────────────────────────────────────────────
    const briefings: PaletteItem[] = [...client.briefings]
      .sort(
        (a, b) =>
          new Date(b.week_of).getTime() - new Date(a.week_of).getTime(),
      )
      .map((b) => {
        const title = formatWeekOf(b.week_of)
        const duration = formatDuration(b.loom_duration_seconds)
        return {
          id: `briefing:${b.id}`,
          section: "briefings",
          label: duration ? `${title}, ${duration}` : title,
          meta: `${daysAgo(b.week_of)} days`,
          keywords: ["briefing", "loom", title.toLowerCase()],
          onSelect: () => {
            if (typeof window !== "undefined") {
              window.open(b.loom_url, "_blank", "noopener,noreferrer")
            }
            actions.onAfterSelect()
          },
        }
      })

    // ── Actions ────────────────────────────────────────────────────────
    const actionItems: PaletteItem[] = [
      {
        id: "action:copy-email",
        section: "actions",
        label: "Copy K.C.'s email",
        keywords: ["copy", "email", "clipboard", "kc"],
        onSelect: () => {
          const email = "hello@igc-growth.com"
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            void navigator.clipboard.writeText(email)
          }
          actions.onAfterSelect()
        },
      },
      {
        id: "action:email-kc",
        section: "actions",
        label: "Email K.C.",
        meta: "n",
        keywords: ["email", "mailto", "kc", "write"],
        onSelect: () => {
          actions.emailKc()
          actions.onAfterSelect()
        },
      },
      {
        id: "action:latest-briefing",
        section: "actions",
        label: "Open latest briefing",
        keywords: ["briefing", "loom", "weekly", "latest"],
        onSelect: () => {
          const latest = [...client.briefings].sort(
            (a, b) =>
              new Date(b.week_of).getTime() - new Date(a.week_of).getTime(),
          )[0]
          if (latest && typeof window !== "undefined") {
            window.open(latest.loom_url, "_blank", "noopener,noreferrer")
          }
          actions.onAfterSelect()
        },
      },
      {
        id: "action:export",
        section: "actions",
        label: "Export everything",
        meta: "e",
        keywords: ["export", "download", "zip", "backup"],
        onSelect: () => {
          actions.exportEverything()
          actions.onAfterSelect()
        },
      },
      {
        id: "action:shortcuts",
        section: "actions",
        label: "Show keyboard shortcuts",
        meta: "?",
        keywords: ["help", "shortcuts", "keyboard", "cheatsheet"],
        onSelect: () => {
          actions.openHelp()
          actions.onAfterSelect()
        },
      },
      {
        id: "action:sign-out",
        section: "actions",
        label: "Sign out",
        keywords: ["sign out", "logout", "log out", "exit"],
        onSelect: () => {
          actions.signOut()
          actions.onAfterSelect()
        },
      },
    ]

    // ── Help ───────────────────────────────────────────────────────────
    const help: PaletteItem[] = [
      {
        id: "help:what-is-this",
        section: "help",
        label: "What is this?",
        keywords: ["about", "what", "portal", "help"],
        onSelect: () => {
          actions.navigate("/portal/system/overview")
          actions.onAfterSelect()
        },
      },
      {
        id: "help:glossary",
        section: "help",
        label: "Glossary",
        secondary: "qualified, on-pace, behind, met, unpaid extension",
        keywords: ["glossary", "terms", "qualified", "met", "behind"],
        onSelect: () => {
          actions.openHelp()
          actions.onAfterSelect()
        },
      },
    ]

    // ── Recent (only if hydrated and non-empty) ────────────────────────
    const recentItems: PaletteItem[] = recent.map((r) => {
      const onSelect: PaletteItem["onSelect"] = () => {
        if (r.payload?.kind === "navigate") {
          actions.navigate(r.payload.href)
        } else if (r.payload?.kind === "prospect") {
          actions.navigate(
            `/portal/system/pipeline?prospect=${r.payload.prospectId}`,
          )
        } else if (r.payload?.kind === "briefing") {
          if (typeof window !== "undefined") {
            window.open(r.payload.loomUrl, "_blank", "noopener,noreferrer")
          }
        } else if (r.payload?.kind === "action") {
          // Fire through to the live action entry by id.
          const target = actionItems.find((a) => a.id === `action:${r.payload && "actionId" in r.payload ? r.payload.actionId : ""}`)
          target?.onSelect()
          return
        }
        actions.onAfterSelect()
      }
      return {
        id: `recent:${r.id}`,
        section: "recent",
        label: r.label,
        secondary: r.secondary,
        meta: r.meta,
        glyph: r.glyph,
        keywords: [r.label.toLowerCase(), r.section],
        onSelect,
      }
    })

    const sections: PaletteSection[] = []
    if (recentItems.length > 0) {
      sections.push({ kind: "recent", heading: "Recent", items: recentItems })
    }
    sections.push({ kind: "navigation", heading: "Navigation", items: navigation })
    if (prospects.length > 0) {
      sections.push({ kind: "prospects", heading: "Prospects", items: prospects })
    }
    if (briefings.length > 0) {
      sections.push({ kind: "briefings", heading: "Briefings", items: briefings })
    }
    sections.push({ kind: "actions", heading: "Actions", items: actionItems })
    sections.push({ kind: "help", heading: "Help", items: help })

    return sections
  }, [client.prospects, client.briefings, recent, actions])

  return { sections, recordPick }
}
