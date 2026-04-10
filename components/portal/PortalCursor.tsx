"use client"

import { useEffect, useRef } from "react"

export function PortalCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const hasMovedRef = useRef(false)

  useEffect(() => {
    // Don't run on touch/coarse pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rafId: number

    function onMouseMove(e: MouseEvent) {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true
        if (ringRef.current) {
          ringRef.current.style.opacity = "1"
        }
      }
      targetX = e.clientX
      targetY = e.clientY
    }

    function loop() {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`
      }

      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener("mousemove", onMouseMove)
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-50 rounded-full [@media_(pointer:coarse)]:hidden"
      style={{
        width: 36,
        height: 36,
        marginLeft: -18,
        marginTop: -18,
        border: "1px solid rgba(201, 146, 42, 0.2)",
        willChange: "transform",
        opacity: 0,
        transition: "opacity 150ms ease-in",
      }}
    />
  )
}
