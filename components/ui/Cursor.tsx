'use client'

import { useEffect, useRef, useState } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Track ring position for lerp
  const ringPos = useRef({ x: 0, y: 0 })
  // Track actual cursor position
  const cursorPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't run cursor on touch-only devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    // Hide native cursor on desktop
    document.body.style.cursor = 'none'

    const onMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY }

      // Dot follows instantly via direct DOM manipulation
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }

      if (!visible) setVisible(true)
    }

    const onMouseEnter = () => setVisible(true)
    const onMouseLeave = () => setVisible(false)

    // Detect hover on interactive elements
    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as Element
      if (target.closest('a, button')) {
        setHovered(true)
      }
    }

    const onPointerOut = (e: PointerEvent) => {
      const target = e.target as Element
      if (target.closest('a, button')) {
        setHovered(false)
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)

    // rAF loop for spring-lagged ring interpolation
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, cursorPos.current.x, 0.12)
      ringPos.current.y = lerp(ringPos.current.y, cursorPos.current.y, 0.12)

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [visible])

  return (
    <>
      {/* Dot — 5px, instant, z-9999 */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: '50%',
          backgroundColor: '#F2EDE4',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />

      {/* Ring — 28px default, 40px on hover, spring lag, z-9998 */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] will-change-transform"
        style={{
          width: hovered ? 40 : 28,
          height: hovered ? 40 : 28,
          marginLeft: hovered ? -20 : -14,
          marginTop: hovered ? -20 : -14,
          borderRadius: '50%',
          border: '1px solid rgba(242, 237, 228, 0.3)',
          opacity: visible ? (hovered ? 0.6 : 1) : 0,
          transition:
            'width 0.2s cubic-bezier(0.16,1,0.3,1), height 0.2s cubic-bezier(0.16,1,0.3,1), margin 0.2s cubic-bezier(0.16,1,0.3,1), opacity 0.2s',
        }}
      />
    </>
  )
}
