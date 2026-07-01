"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useId, useRef } from "react"
import type { HandoverItem } from "@/types/client"
import { HandoverStateChain } from "./HandoverStateChain"

/**
 * Full-detail right-drawer for an asset shelf row.
 *
 * NOT the same as `handover/HandoverDrawer` — that one is the Overview-card
 * compact version. This one shows the full item register: name in Fraunces
 * display, five-state chain, artifact URL, ship/transfer timestamps, and
 * walkthrough-notes placeholder for future K.C. notes.
 *
 * Motion: translate-x from 100%, 220ms expo-out. Backdrop rgba(8,8,8,0.88).
 * Esc closes and restores focus to the triggering row.
 */
type Props = {
  item: HandoverItem | null
  onClose: () => void
  returnFocusRef: React.MutableRefObject<HTMLElement | null>
}

function formatUKDate(iso: string): string {
  return new Date(iso + (iso.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  )
}

export function HandoverItemDrawer({ item, onClose, returnFocusRef }: Props) {
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
            className="fixed top-0 right-0 bottom-0 z-50 flex w-full flex-col overflow-y-auto sm:w-[520px]"
            style={{
              backgroundColor: "#0F1216",
              borderLeft: "1px solid #20242A",
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close handover item detail"
              className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-sm transition-colors duration-150 hover:ring-1 hover:ring-[#C78B28] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1216]"
              style={{
                width: 42,
                height: 42,
                color: "#7C7A76",
                backgroundColor: "transparent",
                border: "1px solid #20242A",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "1rem", lineHeight: 1 }}>
                ✕
              </span>
            </button>

            <div className="flex flex-col gap-7 px-8 pt-16 pb-10">
              {/* State eyebrow */}
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.18em",
                  color:
                    item.state === "transferred" || item.state === "shipped"
                      ? "#C78B28"
                      : "#7C7A76",
                  fontVariantNumeric: "tabular-nums",
                  margin: 0,
                }}
              >
                Asset · {stateEyebrow(item.state)}
              </p>

              {/* Item name — Fraunces display */}
              <h2
                id={titleId}
                className="font-display"
                style={{
                  fontWeight: 400,
                  fontSize: "1.75rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "#FAF8F5",
                  margin: 0,
                  fontOpticalSizing: "auto",
                  fontVariationSettings: '"opsz" 72, "SOFT" 30',
                  textWrap: "balance",
                }}
              >
                {item.name}
              </h2>

              {/* State chain */}
              <div style={{ marginTop: 4 }}>
                <HandoverStateChain state={item.state} />
              </div>

              {/* Hairline */}
              <div
                aria-hidden="true"
                style={{ height: 1, backgroundColor: "#20242A" }}
              />

              {/* Dates */}
              <dl className="flex flex-col" style={{ margin: 0, gap: 14 }}>
                {item.shipped_at && (
                  <DetailRow
                    label="Shipped"
                    value={formatUKDate(item.shipped_at)}
                    tone="quiet"
                  />
                )}
                {item.transferred_at && (
                  <DetailRow
                    label="Transferred"
                    value={formatUKDate(item.transferred_at)}
                    tone="gold"
                  />
                )}
                {!item.shipped_at && !item.transferred_at && (
                  <DetailRow
                    label="Scheduled"
                    value={
                      item.state === "ready-for-review"
                        ? "Awaiting review"
                        : item.state === "in-progress"
                          ? "In build"
                          : "In the 30-day plan"
                    }
                    tone="quiet"
                  />
                )}
              </dl>

              {/* Artifact link */}
              {item.artifact_url && (
                <div>
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.6875rem",
                      letterSpacing: "0.16em",
                      color: "#7C7A76",
                      margin: 0,
                      marginBottom: 8,
                    }}
                  >
                    Artifact
                  </p>
                  <a
                    href={item.artifact_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-mono transition-colors duration-150 hover:text-[#C78B28] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1216]"
                    style={{
                      fontSize: "0.8125rem",
                      letterSpacing: "0.02em",
                      color: "#FAF8F5",
                      fontVariantNumeric: "tabular-nums",
                      textUnderlineOffset: "4px",
                      wordBreak: "break-all",
                    }}
                  >
                    {item.artifact_url}
                  </a>
                </div>
              )}

              {/* Transfer-completed note — mono, only when transferred */}
              {item.state === "transferred" && item.transferred_at && (
                <p
                  className="font-mono"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.04em",
                    color: "#C78B28",
                    margin: 0,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Credential transfer completed on{" "}
                  {formatUKDate(item.transferred_at)}.
                </p>
              )}

              {/* Walkthrough notes — placeholder in Geist italic (NOT Fraunces italic) */}
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.16em",
                    color: "#7C7A76",
                    margin: 0,
                    marginBottom: 10,
                  }}
                >
                  Walkthrough notes
                </p>
                <p
                  className="font-sans italic"
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "#7C7A76",
                    margin: 0,
                    maxWidth: "48ch",
                  }}
                >
                  {item.state === "not-started"
                    ? "Not started yet. Scheduled in the 30-day build plan. Walkthrough notes attach when the build opens."
                    : "K.C.'s walkthrough notes will attach here when this item ships."}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function stateEyebrow(state: HandoverItem["state"]): string {
  switch (state) {
    case "not-started":
      return "Not started"
    case "in-progress":
      return "In progress"
    case "ready-for-review":
      return "Ready for review"
    case "shipped":
      return "Shipped"
    case "transferred":
      return "Transferred"
  }
}

function DetailRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "quiet" | "gold"
}) {
  const valueColor = tone === "gold" ? "#C78B28" : "#FAF8F5"
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#7C7A76",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
        }}
      >
        {label}
      </dt>
      <dd
        className="font-mono"
        style={{
          fontSize: "0.8125rem",
          letterSpacing: "0.02em",
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
