"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { GuaranteeData } from "@/types/client"

/**
 * Row 4 · State-dependent subtext.
 *
 *  pre-outreach        → "Outreach begins Day 14 · Tue 7 May" (Geist Mono 11px, text-secondary)
 *  met (animated)      → "met · 20 Mon 2026" fades in at t=400ms
 *  met (static)        → same, rendered immediately (cold-mount or reducedMotion)
 *  unpaid-extension    → "Guarantee not met by Day 30. Retainer continuing unpaid until N=5." (Geist 400)
 *  archive             → "engagement complete · handover complete" (Geist Mono 11px)
 *  on-pace / ahead / behind → null (subtext absent — KcHypothesis handles the `behind` case separately)
 */
export function GuaranteeSubtext(props: {
  guarantee: GuaranteeData
  shouldAnimate: boolean
  reducedMotion: boolean
}) {
  const { guarantee, shouldAnimate, reducedMotion } = props
  const { state, outreach_begins_date, met_date } = guarantee

  if (state === "pre-outreach" && outreach_begins_date) {
    return (
      <p
        className="font-mono"
        style={{
          fontSize: "0.6875rem",
          lineHeight: 1.3,
          letterSpacing: "0.14em",
          color: "#857F74",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
          textTransform: "lowercase",
        }}
      >
        outreach begins day 14 · {outreach_begins_date.toLowerCase()}
      </p>
    )
  }

  if ((state === "met" || state === "archive") && met_date) {
    const formatted = new Date(met_date + "T00:00:00Z").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    const shouldFadeIn = state === "met" && shouldAnimate && !reducedMotion
    const content = (
      <p
        className="font-mono"
        style={{
          fontSize: "0.8125rem",
          lineHeight: 1.3,
          letterSpacing: "0.08em",
          color: "#857F74",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
          textTransform: "lowercase",
        }}
      >
        met · {formatted.toLowerCase()}
      </p>
    )
    if (!shouldFadeIn) return content
    return (
      <AnimatePresence initial={false}>
        <motion.div
          key="met-stamp"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    )
  }

  if (state === "unpaid-extension") {
    return (
      <p
        className="font-sans"
        style={{
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: 1.7,
          color: "#857F74",
          margin: 0,
          maxWidth: "56ch",
          textWrap: "pretty",
        }}
      >
        Guarantee not met by Day 30. Retainer continuing unpaid until N=5.
      </p>
    )
  }

  if (state === "archive") {
    return (
      <p
        className="font-mono"
        style={{
          fontSize: "0.6875rem",
          lineHeight: 1.3,
          letterSpacing: "0.14em",
          color: "#857F74",
          margin: 0,
          textTransform: "lowercase",
        }}
      >
        engagement complete · handover complete
      </p>
    )
  }

  return null
}
