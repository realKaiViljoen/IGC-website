"use client"

import { motion } from "framer-motion"

/**
 * 1px gold hairline beneath the five-square row.
 *
 * Three modes:
 *  - `animate`: play the signature scaleX 0→1 from left, 600ms, 200ms in.
 *  - `static`: render final state immediately (cold-mount met, archive).
 *  - `hidden`: don't render (default — not in met state).
 *
 * Width matches the squares row width (passed by the caller via `width`).
 */
export function GoldHairline(props: {
  mode: "animate" | "static" | "hidden"
  width: number
  reducedMotion: boolean
}) {
  const { mode, width, reducedMotion } = props
  if (mode === "hidden") return null

  const shouldTween = mode === "animate" && !reducedMotion

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldTween ? { scaleX: 0 } : false}
      animate={{ scaleX: 1 }}
      transition={
        shouldTween
          ? { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0 }
      }
      style={{
        width,
        height: 1,
        backgroundColor: "#C78B28",
        transformOrigin: "left center",
        willChange: "transform",
      }}
    />
  )
}
