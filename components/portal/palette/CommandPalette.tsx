"use client"

import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useCallback, useEffect, useRef } from "react"
import { usePalette } from "./PaletteProvider"
import { usePaletteItems, type PaletteActions } from "./usePaletteItems"
import { PaletteItem } from "./PaletteItem"
import { PaletteSection } from "./PaletteSection"

/**
 * The `⌘K` surface. Rendered once at the portal layout level, opens on
 * `⌘K` / `Ctrl+K`, wherever the client is in the portal.
 *
 * Universal chrome: identical across every engagement state. Only the
 * content (prospect names, briefing weeks) differs per client.
 */

const KC_EMAIL = "hello@igc-growth.com"

/**
 * Compose a mailto link to K.C. with a subject prefilled with the client's
 * company. Declarative subject so the client doesn't face a blank compose.
 */
function mailtoFor(company: string): string {
  const subject = encodeURIComponent(`${company} · note`)
  return `mailto:${KC_EMAIL}?subject=${subject}`
}

/**
 * Fires the same flow as the Sidebar ExportButton: hit the server zip route
 * and download. This is a palette-owned path; the Sidebar's button retains
 * its richer state UI (compiling / success / error). From the palette, we
 * keep it dead simple — kick off the download and trust the route.
 */
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

export function CommandPalette() {
  const { open, setOpen, query, setQuery, setHelpOpen, closeAll, client } =
    usePalette()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Restore focus on close. Capture the element that held focus at open time.
  const returnFocusRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (open) {
      returnFocusRef.current = (document.activeElement as HTMLElement) ?? null
      // cmdk autofocuses its input; belt-and-braces if styling defers it.
      queueMicrotask(() => inputRef.current?.focus())
    } else {
      returnFocusRef.current?.focus?.()
      returnFocusRef.current = null
    }
  }, [open])

  const actions = useCallback<() => PaletteActions>(
    () => ({
      navigate: (href: string) => {
        router.push(href)
      },
      openHelp: () => {
        setHelpOpen(true)
      },
      exportEverything: () => {
        triggerExport(client.uid)
      },
      emailKc: () => {
        if (typeof window !== "undefined") {
          window.location.href = mailtoFor(client.company)
        }
      },
      signOut: () => {
        void signOut({ callbackUrl: "/portal" })
      },
      onAfterSelect: () => {
        setOpen(false)
      },
    }),
    [router, setHelpOpen, client.uid, client.company, setOpen],
  )()

  const { sections, recordPick } = usePaletteItems(client, actions)

  // Wrap each item's onSelect so Recent is recorded and the palette closes.
  const wrap = useCallback(
    (onSelect: () => void, itemSnapshot: Parameters<typeof recordPick>[0]) => {
      return () => {
        // Don't record a pick from the Recent section itself — it would just
        // shuffle identically.
        if (itemSnapshot.section !== "recent") {
          recordPick(itemSnapshot)
        }
        onSelect()
      }
    },
    [recordPick],
  )

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      shouldFilter
      // cmdk loops focus; Esc dispatch comes from the Command primitive.
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault()
          closeAll()
        }
      }}
      className="igc-palette-dialog"
      // aria-modal and role handled by cmdk's Dialog primitive.
    >
      <PaletteScopedStyles />

      <div
        aria-hidden="true"
        className="igc-palette-backdrop"
        onClick={() => setOpen(false)}
      />

      <div className="igc-palette-panel" role="document">
        <Command.Input
          ref={inputRef}
          value={query}
          onValueChange={setQuery}
          placeholder="Search prospects, briefings, commands"
          className="igc-palette-input"
        />

        <Command.List className="igc-palette-list">
          <Command.Empty className="igc-palette-empty">
            Nothing matches.
          </Command.Empty>

          {sections.map((section) => (
            <PaletteSection key={section.kind} heading={section.heading}>
              {section.items.map((item) => (
                <PaletteItem
                  key={item.id}
                  item={item}
                  onSelect={wrap(item.onSelect, item)}
                />
              ))}
            </PaletteSection>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  )
}

/**
 * Scoped CSS for the palette. Kept local so we don't edit `app/globals.css`
 * (other agents may be working there in parallel).
 *
 * Motion:
 *   backdrop  opacity 0→0.88 · 150ms expo-out
 *   panel     opacity 0→1 + translateY 8→0 · 180ms expo-out
 *   exit      reverse at 75% duration · expo-in
 *
 * Reduced motion: snap, no translate.
 *
 * Register: squared corners (`border-radius: 0`) — matches the Allan Gray
 * institutional-register doctrine already locked for the Guarantee Tracker.
 */
function PaletteScopedStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
        .igc-palette-dialog[data-state="closed"] { display: none; }

        .igc-palette-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(20, 18, 16, 0.88);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9998;
          animation: igcPaletteBackdropIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .igc-palette-panel {
          position: fixed;
          left: 50%;
          top: 12vh;
          transform: translateX(-50%);
          width: min(640px, calc(100vw - 48px));
          max-height: 520px;
          display: flex;
          flex-direction: column;
          background: #101215;
          border: 1px solid #262A30;
          border-radius: 0;
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.55);
          z-index: 9999;
          overflow: hidden;
          animation: igcPalettePanelIn 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .igc-palette-input {
          appearance: none;
          width: 100%;
          height: 48px;
          padding: 0 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid #262A30;
          outline: none;
          color: #FAF9F7;
          font-family: 'Satoshi', system-ui, sans-serif;
          font-weight: 300;
          font-size: 20px;
          letter-spacing: -0.005em;
        }
        .igc-palette-input::placeholder {
          color: #857F74;
          font-weight: 300;
        }

        .igc-palette-list {
          flex: 1 1 auto;
          max-height: 400px;
          overflow-y: auto;
          padding: 4px 0 8px 0;
          scrollbar-width: none;
        }
        .igc-palette-list::-webkit-scrollbar { display: none; }

        .igc-palette-empty {
          padding: 24px 16px;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 12px;
          color: #857F74;
        }

        .palette-group [cmdk-group-heading] {
          padding: 10px 16px 4px 16px;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #93918E;
        }

        .palette-item {
          min-height: 44px;
        }
        .palette-item[data-selected="true"] {
          /* 1px gold left edge — honours absolute-ban rule exactly at 1px. */
        }

        @keyframes igcPaletteBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes igcPalettePanelIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .igc-palette-backdrop,
          .igc-palette-panel {
            animation: none;
          }
        }
      `,
      }}
    />
  )
}
