"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useId, useRef } from "react"
import type { HandoverItem } from "@/types/client"

/**
 * Right-drawer peek for a handover item.
 *
 * Enter: translate-x 100% → 0, 220ms, expo-out.
 * Exit:  translate-x 0 → 100%, 165ms (75% of enter per motion-design.md), ease-in.
 * Backdrop: rgba(8,8,8,0.88), click to dismiss, fades alongside the drawer.
 *
 * Inherits pattern from ConversationDrawer for cross-consistency across Overview.
 *
 * A11y:
 *   - role="dialog" + aria-modal="true"
 *   - aria-labelledby points at the drawer title
 *   - Focus trap: close button focused on open; Tab wraps within the panel.
 *   - Esc closes and restores focus to the triggering row.
 */
type Props = {
  item: HandoverItem | null
  onClose: () => void
  /** Ref to the row that opened the drawer; focus returns there on close. */
  returnFocusRef: React.MutableRefObject<HTMLElement | null>
}

/** Human-readable short labels used in the drawer timeline. */
const STATE_LABEL: Record<HandoverItem["state"], string> = {
  "not-started": "Queued",
  "in-progress": "In progress",
  "ready-for-review": "Ready for review",
  shipped: "Shipped",
  transferred: "Owned",
}

function formatUKDate(iso: string): string {
  return new Date(iso + (iso.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  )
}

export function HandoverDrawer({ item, onClose, returnFocusRef }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const open = item !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => closeButtonRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return
    const panel = panelRef.current
    if (!panel) return
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    queueMicrotask(() => returnFocusRef.current?.focus())
  }, [onClose, returnFocusRef])

  return (
    <AnimatePresence>
      {open && item && (
        <>
          <motion.div
            key="backdrop"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(8, 8, 8, 0.88)" }}
            aria-hidden="true"
          />

          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={onKeyDown}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 flex w-full flex-col overflow-y-auto sm:w-[480px]"
            style={{
              backgroundColor: "#0A0B0E",
              borderLeft: "1px solid #262A30",
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close handover item detail"
              className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-sm transition-colors duration-150 hover:ring-1 hover:ring-[#C9922A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
              style={{
                width: 42,
                height: 42,
                color: "#857F74",
                backgroundColor: "transparent",
                border: "1px solid #262A30",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "1rem", lineHeight: 1 }}>
                ✕
              </span>
            </button>

            <div className="flex flex-col gap-6 px-8 pt-16 pb-10">
              {/* State eyebrow */}
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.16em",
                  color:
                    item.state === "transferred" ? "#C9922A" : "#857F74",
                  fontVariantNumeric: "tabular-nums",
                  margin: 0,
                }}
              >
                {STATE_LABEL[item.state]}
                {item.shipped_at && item.state !== "transferred" && (
                  <span style={{ color: "#857F74" }}>
                    {" "}
                    · {formatUKDate(item.shipped_at)}
                  </span>
                )}
                {item.transferred_at && (
                  <span style={{ color: "#857F74" }}>
                    {" "}
                    · {formatUKDate(item.transferred_at)}
                  </span>
                )}
              </p>

              {/* Item name */}
              <h2
                id={titleId}
                className="font-display"
                style={{
                  fontWeight: 400,
                  fontSize: "1.5rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "#FAF9F7",
                  margin: 0,
                  fontOpticalSizing: "auto",
                  fontVariationSettings: '"opsz" 72, "SOFT" 30',
                  textWrap: "balance",
                }}
              >
                {item.name}
              </h2>

              {/* Timeline — deterministic, data-driven. No invented copy. */}
              <dl className="flex flex-col gap-3" style={{ margin: 0 }}>
                <TimelineRow
                  label="Engaged"
                  value={
                    item.state !== "not-started"
                      ? "Build in progress"
                      : "Not started"
                  }
                  tone={item.state !== "not-started" ? "live" : "quiet"}
                />
                {item.state === "ready-for-review" && (
                  <TimelineRow label="Review" value="Awaiting client review" tone="live" />
                )}
                {item.shipped_at && (
                  <TimelineRow
                    label="Shipped"
                    value={formatUKDate(item.shipped_at)}
                    tone="live"
                  />
                )}
                {item.transferred_at && (
                  <TimelineRow
                    label="Transferred"
                    value={formatUKDate(item.transferred_at)}
                    tone="gold"
                  />
                )}
              </dl>

              {/* Artifact link */}
              {item.artifact_url && (
                <div>
                  <a
                    href={item.artifact_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-mono transition-colors duration-150 hover:text-[#C9922A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
                    style={{
                      fontSize: "0.6875rem",
                      letterSpacing: "0.14em",
                      color: "#857F74",
                      fontVariantNumeric: "tabular-nums",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    Open artifact →
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function TimelineRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "quiet" | "live" | "gold"
}) {
  const valueColor =
    tone === "gold" ? "#C9922A" : tone === "live" ? "#FAF9F7" : "#857F74"
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#857F74",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
        }}
      >
        {label}
      </dt>
      <dd
        className="font-mono"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          color: valueColor,
          fontVariantNumeric: "tabular-nums",
          margin: 0,
          textAlign: "right",
        }}
      >
        {value}
      </dd>
    </div>
  )
}
