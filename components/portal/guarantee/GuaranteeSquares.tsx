"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { GuaranteeConversation, GuaranteeData } from "@/types/client"
import { GuaranteeSquare, type SquareFill } from "./GuaranteeSquare"
import { GoldHairline } from "./GoldHairline"
import { useGuaranteeKeyboard } from "./useGuaranteeKeyboard"

type Props = {
  guarantee: GuaranteeData
  onSelectConversation: (conversation: GuaranteeConversation) => void
  openDrawerForId: string | null
  shouldAnimate: boolean
  reducedMotion: boolean
}

/**
 * Row 3 · Five-square row.
 *
 * Layout: 5 squares × 52px with 16px gaps (≥360px). Below 360px: 44px × 12px.
 *
 * Each square's `fill`:
 *   - indices 0..met-1: `filled-ink` (or `filled-gold` if state=met/archive AND index=4).
 *   - indices met..4: `hollow`.
 *
 * Hairline:
 *   - state=met with signature motion → `animate` (scaleX draw).
 *   - state=met (cold mount) or state=archive → `static` (final, no motion).
 *   - else → `hidden`.
 *
 * Keyboard: roving tabindex driven by useGuaranteeKeyboard.
 */
export function GuaranteeSquares(props: Props) {
  const { guarantee, onSelectConversation, openDrawerForId, shouldAnimate, reducedMotion } = props
  const { state, met, total, conversations } = guarantee

  const [size, setSize] = useState(52)
  const [gap, setGap] = useState(16)

  // Responsive: reduce to 44/12 below 360px.
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 359px)")
    const sync = () => {
      setSize(mql.matches ? 44 : 52)
      setGap(mql.matches ? 12 : 16)
    }
    sync()
    mql.addEventListener("change", sync)
    return () => mql.removeEventListener("change", sync)
  }, [])

  const filledIndices = useMemo(
    () => Array.from({ length: met }, (_, i) => i),
    [met],
  )

  const [activeIndex, setActiveIndex] = useState<number>(0)
  // If met becomes 0 (pre-outreach / cold start), nothing focusable — keep activeIndex
  // at 0 but don't give anything tabindex=0.
  useEffect(() => {
    if (filledIndices.length > 0 && !filledIndices.includes(activeIndex)) {
      setActiveIndex(filledIndices[0])
    }
  }, [filledIndices, activeIndex])

  const squareRefs = useRef<Array<HTMLButtonElement | null>>([])
  const { onKeyDown } = useGuaranteeKeyboard({
    filledIndices,
    activeIndex,
    setActiveIndex,
    squareRefs,
  })

  const rowWidth = total * size + (total - 1) * gap

  function fillFor(index: number): SquareFill {
    if (index >= met) return "hollow"
    if ((state === "met" || state === "archive") && index === total - 1) {
      return "filled-gold"
    }
    return "filled-ink"
  }

  const hairlineMode =
    state === "archive"
      ? ("static" as const)
      : state === "met"
        ? shouldAnimate
          ? ("animate" as const)
          : ("static" as const)
        : ("hidden" as const)

  return (
    <div className="flex flex-col gap-3">
      <div
        role="group"
        aria-label={`Guarantee progress, ${met} of ${total} conversations booked`}
        onKeyDown={onKeyDown}
        tabIndex={-1}
        className="flex items-center"
        style={{ gap }}
      >
        {Array.from({ length: total }, (_, i) => {
          const fill = fillFor(i)
          const conv: GuaranteeConversation | undefined = conversations[i]
          const isFilled = fill !== "hollow"
          const drawerOpenForThis = !!conv && openDrawerForId === conv.id

          return (
            <GuaranteeSquare
              key={i}
              ref={(el: HTMLButtonElement | HTMLDivElement | null) => {
                squareRefs.current[i] = el as HTMLButtonElement | null
              }}
              fill={fill}
              index={i}
              total={total}
              size={size}
              conversation={conv}
              tabIndex={isFilled && i === activeIndex ? 0 : -1}
              drawerOpenForThis={drawerOpenForThis}
              onClick={conv ? () => onSelectConversation(conv) : undefined}
              shouldAnimate={shouldAnimate}
              reducedMotion={reducedMotion}
            />
          )
        })}
      </div>

      <GoldHairline mode={hairlineMode} width={rowWidth} reducedMotion={reducedMotion} />
    </div>
  )
}
