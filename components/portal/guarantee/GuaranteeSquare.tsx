"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import type { GuaranteeConversation } from "@/types/client"

export type SquareFill =
  | "hollow" // not yet filled — presentational
  | "filled-ink" // booked conversation, non-signature
  | "filled-gold" // 5th square on met — THE signature
  | "filled-member" // filled but not yet interactive (reserved for future)

/**
 * Individual square. 52×52 desktop, 44×44 sub-360px.
 *
 * Visual:
 *   - hollow: 1px `#262A30` border, no fill. `role="presentation"`, not focusable.
 *   - filled-ink: solid `#FAF9F7` fill, 1px same-color border. Button. Tab-index managed by parent.
 *   - filled-gold: solid `#C9922A` fill. Animated via Framer Motion when shouldAnimate=true.
 *
 * Focus ring: 1px `#C9922A`, 2px offset, focus-visible only (keyboard, not mouse).
 * Hover: cursor-only effect — the custom PortalCursor grows 28→40. No scale, no tooltip.
 *
 * Accessibility:
 *   - aria-label reads company + held date for filled squares (screen-reader navigation).
 *   - aria-haspopup="dialog" + aria-expanded communicate drawer affordance.
 */
type Props = {
  fill: SquareFill
  index: number
  total: number
  size: number
  /** If filled, metadata for the aria-label and click handler. */
  conversation?: GuaranteeConversation
  /** Only filled squares participate in tab order. */
  tabIndex: number
  /** Set by parent. */
  drawerOpenForThis: boolean
  onClick?: () => void
  /** True during the signature moment; turns on color-tween for the 5th square. */
  shouldAnimate: boolean
  reducedMotion: boolean
}

export const GuaranteeSquare = forwardRef<HTMLButtonElement | HTMLDivElement, Props>(
  function GuaranteeSquare(props, ref) {
    const {
      fill,
      index,
      total,
      size,
      conversation,
      tabIndex,
      drawerOpenForThis,
      onClick,
      shouldAnimate,
      reducedMotion,
    } = props

    const isGold = fill === "filled-gold"
    const isFilled = fill === "filled-ink" || fill === "filled-gold"
    const isHollow = fill === "hollow"

    // Target color — ink by default; gold only for the 5th-on-met square.
    // Hollow gets #101215 (bg-elev) — dim surface-in-waiting, not transparent void.
    // This fixes the "reads like content didn't load" comprehension failure.
    const targetColor = isGold ? "#C9922A" : isFilled ? "#FAF9F7" : "#101215"
    const borderColor = isGold
      ? "#C9922A"
      : isFilled
        ? "#FAF9F7"
        : "#262A30"

    if (isHollow) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="presentation"
          aria-hidden="true"
          style={{
            width: size,
            height: size,
            border: `1px solid ${borderColor}`,
            backgroundColor: targetColor,
            cursor: "default",
          }}
        />
      )
    }

    const held = conversation
      ? new Date(conversation.held_at + "T00:00:00Z").toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        })
      : ""

    const label = conversation
      ? `Conversation ${index + 1} of ${total}: ${conversation.company}, held ${held}`
      : `Conversation ${index + 1} of ${total}`

    // Color motion: when the 5th square flips ink → gold, tween the two CSS
    // properties. Otherwise snap.
    const animate = {
      backgroundColor: targetColor,
      borderColor: borderColor,
    }
    const transition =
      shouldAnimate && isGold && !reducedMotion
        ? { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
        : { duration: 0 }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        tabIndex={tabIndex}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={drawerOpenForThis}
        data-igc-square={index}
        data-igc-fill={fill}
        initial={{
          backgroundColor:
            shouldAnimate && isGold && !reducedMotion ? "#FAF9F7" : targetColor,
          borderColor:
            shouldAnimate && isGold && !reducedMotion ? "#FAF9F7" : borderColor,
        }}
        animate={animate}
        transition={transition}
        style={{
          width: size,
          height: size,
          padding: 0,
          borderStyle: "solid",
          borderWidth: 1,
          cursor: "pointer",
          outline: "none",
        }}
        className="focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E]"
      />
    )
  },
)
