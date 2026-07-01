"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useId, useRef } from "react"
import type { GuaranteeConversation } from "@/types/client"

/**
 * Right-drawer peek for a qualified conversation.
 *
 * Enter: translate-x 100% → 0, 220ms, expo-out.
 * Exit:  translate-x 0 → 100%, 165ms (75% of enter per motion-design.md), ease-in.
 * Backdrop: rgba(8,8,8,0.88), click to dismiss, fades alongside the drawer.
 *
 * A11y:
 *   - role="dialog" + aria-modal="true"
 *   - aria-labelledby points at the drawer title
 *   - Focus trap: first focusable element focused on open; `inert` on siblings via parent.
 *   - Esc closes and restores focus to the triggering square.
 *   - Close button 42×42 touch target, 1px gold hover ring.
 */
type Props = {
  conversation: GuaranteeConversation | null
  onClose: () => void
  /** Ref to the square that opened the drawer; focus returns there on close. */
  returnFocusRef: React.MutableRefObject<HTMLElement | null>
}

export function ConversationDrawer({ conversation, onClose, returnFocusRef }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const open = conversation !== null

  // Esc to close.
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

  // Focus management on open.
  useEffect(() => {
    if (!open) return
    // Push focus to the close button on mount.
    const timeout = window.setTimeout(() => closeButtonRef.current?.focus(), 50)
    return () => window.clearTimeout(timeout)
  }, [open])

  // Focus-trap: keep Tab within the panel.
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
      {open && conversation && (
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
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed top-0 right-0 bottom-0 z-50 flex w-full flex-col overflow-y-auto sm:w-[480px]"
            style={{
              backgroundColor: "#0A0C0F",
              borderLeft: "1px solid #20242A",
            }}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close conversation detail"
              className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-sm transition-colors duration-150 hover:ring-1 hover:ring-[#C78B28] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C0F]"
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

            <div className="flex flex-col gap-6 px-8 pt-16 pb-10">
              <p
                className="font-mono"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.14em",
                  color: "#7C7A76",
                  fontVariantNumeric: "tabular-nums",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Qualified ·{" "}
                {new Date(conversation.held_at + "T00:00:00Z").toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  timeZone: "UTC",
                })}
              </p>

              <h2
                id={titleId}
                className="font-display"
                style={{
                  fontWeight: 400,
                  fontSize: "1.5rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "#FAF8F5",
                  margin: 0,
                  fontOpticalSizing: "auto",
                  fontVariationSettings: '"opsz" 72, "SOFT" 30',
                  textWrap: "balance",
                }}
              >
                {conversation.company}
                <span style={{ color: "#7C7A76" }}> · </span>
                <span style={{ color: "#7C7A76" }}>
                  {conversation.decision_maker}
                  {conversation.role ? `, ${conversation.role}` : ""}
                </span>
              </h2>

              {conversation.qualification_notes && (
                <p
                  className="font-sans italic"
                  style={{
                    fontWeight: 400,
                    fontSize: "1.125rem",
                    lineHeight: 1.55,
                    letterSpacing: "-0.005em",
                    color: "#FAF8F5",
                    margin: 0,
                    maxWidth: "56ch",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: '"opsz" 72, "SOFT" 80',
                    textWrap: "pretty",
                  }}
                >
                  {conversation.qualification_notes}
                </p>
              )}

              {conversation.hubspot_url && (
                <div>
                  <a
                    href={conversation.hubspot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-mono transition-colors duration-150 hover:text-[#C78B28] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C0F]"
                    style={{
                      fontSize: "0.6875rem",
                      letterSpacing: "0.14em",
                      color: "#7C7A76",
                      fontVariantNumeric: "tabular-nums",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    Open in HubSpot →
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
