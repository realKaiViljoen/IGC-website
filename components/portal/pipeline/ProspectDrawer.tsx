"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useId, useRef } from "react"
import type { Conversation, Prospect } from "@/types/client"
import { formatCurrency, formatRelativeDate } from "@/lib/pipeline"
import { TierDot } from "./TierDot"

/**
 * Prospect detail drawer. Same visual language as ConversationDrawer in
 * components/portal/guarantee — radial backdrop, right-slide panel, 42×42
 * close target, Fraunces display title, Geist body, Geist Mono eyebrow.
 *
 * Content:
 *   · Eyebrow line · "Stage · last-touch" in mono (gold if qualified)
 *   · Fraunces title · "{company} · {name}, {role}"
 *   · Grid of meta · tier / value / next step hint
 *   · Conversations list filtered by prospect_id, in descending held_at.
 *     Each conversation shows held_at + qualification_notes in Fraunces
 *     italic (the principal-authored voice moment).
 *   · Outbound HubSpot link if present.
 */
type Props = {
  prospect: Prospect | null
  qualified: boolean
  conversations: Conversation[]
  nowUtcMs: number
  onClose: () => void
  returnFocusRef: React.MutableRefObject<HTMLElement | null>
}

export function ProspectDrawer({
  prospect,
  qualified,
  conversations,
  nowUtcMs,
  onClose,
  returnFocusRef,
}: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const open = prospect !== null

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
    const timeout = window.setTimeout(() => closeButtonRef.current?.focus(), 50)
    return () => window.clearTimeout(timeout)
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
      {open && prospect && (
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
              backgroundColor: "#0A0C0F",
              borderLeft: "1px solid #20242A",
            }}
          >
            {/* Close */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close prospect detail"
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
              {/* Eyebrow */}
              <p
                className="font-mono"
                style={{
                  fontSize: "0.6875rem",
                  letterSpacing: "0.14em",
                  color: qualified ? "#C78B28" : "#7C7A76",
                  fontVariantNumeric: "tabular-nums",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {prospect.stage} · Last touch {formatRelativeDate(prospect.last_touch, nowUtcMs)}
              </p>

              {/* Title · Fraunces */}
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
                {prospect.company}
                <span style={{ color: "#7C7A76" }}> · </span>
                <span style={{ color: "#7C7A76" }}>
                  {prospect.name}, {prospect.role}
                </span>
              </h2>

              {/* Meta grid · tier / value */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  columnGap: 24,
                  rowGap: 12,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderTop: "1px solid #20242A",
                  borderBottom: "1px solid #20242A",
                }}
              >
                <MetaCell label="Tier">
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <TierDot tier={prospect.tier} qualified={qualified} />
                    <span
                      className="font-sans"
                      style={{
                        fontSize: "0.875rem",
                        color: "#FAF8F5",
                      }}
                    >
                      {prospect.tier ? `Tier ${prospect.tier}` : "Untiered"}
                    </span>
                  </span>
                </MetaCell>
                <MetaCell label="Estimated value" align="right">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.875rem",
                      color: "#FAF8F5",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatCurrency(
                      prospect.estimated_contract_value_cents,
                      prospect.currency,
                    )}
                  </span>
                </MetaCell>
              </div>

              {/* Conversations */}
              {conversations.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.6875rem",
                      letterSpacing: "0.16em",
                      color: "#7C7A76",
                      fontVariantNumeric: "tabular-nums",
                      margin: 0,
                    }}
                  >
                    Conversations · {conversations.length}
                  </p>
                  <div className="flex flex-col gap-5">
                    {conversations.map((c) => {
                      const held = new Date(c.held_at + "T00:00:00Z").toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", timeZone: "UTC" },
                      )
                      const qualifiedConv = c.counts_toward_guarantee
                      return (
                        <div key={c.id} className="flex flex-col gap-2">
                          <p
                            className="font-mono"
                            style={{
                              fontSize: "0.6875rem",
                              letterSpacing: "0.14em",
                              color: qualifiedConv ? "#C78B28" : "#7C7A76",
                              fontVariantNumeric: "tabular-nums",
                              textTransform: "uppercase",
                              margin: 0,
                            }}
                          >
                            {qualifiedConv ? "Qualified" : "Held"} · {held}
                          </p>
                          {c.qualification_notes && (
                            <p
                              className="font-display italic"
                              style={{
                                fontWeight: 400,
                                fontSize: "1rem",
                                lineHeight: 1.55,
                                letterSpacing: "-0.005em",
                                color: "#FAF8F5",
                                margin: 0,
                                maxWidth: "52ch",
                                fontOpticalSizing: "auto",
                                fontVariationSettings: '"opsz" 36, "SOFT" 80',
                                textWrap: "pretty",
                              }}
                            >
                              {c.qualification_notes}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <p
                  className="font-sans"
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.55,
                    color: "#7C7A76",
                    margin: 0,
                    maxWidth: "52ch",
                  }}
                >
                  No conversations logged yet. K.C. adds qualification notes
                  here once a discovery call is held.
                </p>
              )}

              {/* HubSpot link */}
              {prospect.hubspot_deal_url && (
                <div>
                  <a
                    href={prospect.hubspot_deal_url}
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

function MetaCell({
  label,
  align = "left",
  children,
}: {
  label: string
  align?: "left" | "right"
  children: React.ReactNode
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: "0.625rem",
          letterSpacing: "0.16em",
          color: "#7C7A76",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}
