"use client"

import { useEffect, useRef } from "react"
import { usePalette } from "../palette/PaletteProvider"

/**
 * The `?` cheatsheet. Three-column mono layout, squared corners, same dark
 * surface as the palette. Dismiss on `Esc` or click-outside.
 *
 * Register: reads as the Bloomberg keyboard reference, not SaaS onboarding.
 * Zero em-dashes. No prose-long intro. Just the map.
 */

type Row = { key: string; action: string }

const NAVIGATION: Row[] = [
  { key: "⌘K", action: "command palette" },
  { key: "?", action: "shortcuts" },
  { key: "g o", action: "overview" },
  { key: "g g", action: "guarantee" },
  { key: "g p", action: "pipeline" },
  { key: "g r", action: "outreach" },
  { key: "g d", action: "deliverability" },
  { key: "g b", action: "briefings" },
  { key: "g h", action: "handover" },
]

const ROW_NAV: Row[] = [
  { key: "j", action: "next row" },
  { key: "k", action: "prev row" },
  { key: "↵", action: "open row" },
  { key: "Esc", action: "close drawer" },
]

const OPERATOR: Row[] = [
  { key: "n", action: "email K.C." },
  { key: "e", action: "export everything" },
  { key: "Esc", action: "close overlays" },
]

export function HelpOverlay() {
  const { helpOpen, setHelpOpen } = usePalette()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // Esc to close + restore focus.
  useEffect(() => {
    if (!helpOpen) {
      returnFocusRef.current?.focus?.()
      returnFocusRef.current = null
      return
    }
    returnFocusRef.current = (document.activeElement as HTMLElement) ?? null
    panelRef.current?.focus?.()
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        setHelpOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [helpOpen, setHelpOpen])

  if (!helpOpen) return null

  return (
    <>
      <HelpScopedStyles />
      <div
        className="igc-help-backdrop"
        aria-hidden="true"
        onClick={() => setHelpOpen(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        className="igc-help-panel"
      >
        <div className="igc-help-header">
          <span className="igc-help-title">KEYBOARD · THE SYSTEM</span>
        </div>

        <div className="igc-help-grid">
          <HelpColumn heading="NAVIGATION" rows={NAVIGATION} />
          <HelpColumn heading="PROSPECT LIST" rows={ROW_NAV} />
          <HelpColumn heading="OPERATOR" rows={OPERATOR} />
        </div>

        <div className="igc-help-footer">
          <span>esc to close</span>
        </div>
      </div>
    </>
  )
}

function HelpColumn({ heading, rows }: { heading: string; rows: Row[] }) {
  return (
    <div className="igc-help-col">
      <div className="igc-help-col-heading">{heading}</div>
      <dl className="igc-help-dl">
        {rows.map((r) => (
          <div key={`${heading}-${r.key}-${r.action}`} className="igc-help-row">
            <dt className="igc-help-key">{r.key}</dt>
            <dd className="igc-help-action">{r.action}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function HelpScopedStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
        .igc-help-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(20, 18, 16, 0.88);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9998;
          animation: igcHelpBackdropIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .igc-help-panel {
          position: fixed;
          left: 50%;
          top: 14vh;
          transform: translateX(-50%);
          width: min(560px, calc(100vw - 48px));
          background: #0F1216;
          border: 1px solid #20242A;
          border-radius: 0;
          outline: none;
          z-index: 9999;
          animation: igcHelpPanelIn 180ms cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.55);
        }
        .igc-help-header {
          padding: 16px 20px 12px 20px;
          border-bottom: 1px solid #20242A;
        }
        .igc-help-title {
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9C9995;
        }
        .igc-help-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          padding: 20px;
        }
        .igc-help-col-heading {
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9C9995;
          margin-bottom: 10px;
        }
        .igc-help-dl {
          margin: 0;
        }
        .igc-help-row {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 12px;
          padding: 4px 0;
        }
        .igc-help-key {
          margin: 0;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 12px;
          font-variant-numeric: tabular-nums;
          color: #FAF8F5;
        }
        .igc-help-action {
          margin: 0;
          font-family: 'Satoshi', system-ui, sans-serif;
          font-size: 12px;
          color: #7C7A76;
        }
        .igc-help-footer {
          padding: 10px 20px 14px 20px;
          border-top: 1px solid #20242A;
          display: flex;
          justify-content: flex-end;
          font-family: var(--font-geist-mono), ui-monospace, monospace;
          font-size: 10px;
          color: #9C9995;
          letter-spacing: 0.08em;
        }

        @keyframes igcHelpBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes igcHelpPanelIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .igc-help-backdrop, .igc-help-panel { animation: none; }
        }
      `,
      }}
    />
  )
}
