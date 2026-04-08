'use client'

import { type RefObject, useEffect } from 'react'

export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  strength: number = 0.4,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const TRIGGER_ZONE = 60
    const MAX_DRIFT = 10

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()

      // Expanded bounds including the trigger zone
      const inZone =
        e.clientX >= rect.left - TRIGGER_ZONE &&
        e.clientX <= rect.right + TRIGGER_ZONE &&
        e.clientY >= rect.top - TRIGGER_ZONE &&
        e.clientY <= rect.bottom + TRIGGER_ZONE

      if (!inZone) {
        el.style.transform = ''
        return
      }

      // Delta from element center
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      // Clamp to max drift
      const clampedX = Math.max(-MAX_DRIFT, Math.min(MAX_DRIFT, deltaX))
      const clampedY = Math.max(-MAX_DRIFT, Math.min(MAX_DRIFT, deltaY))

      el.style.transition = 'transform 0.15s ease-out'
      el.style.transform = `translate(${clampedX}px, ${clampedY}px)`
    }

    const onMouseLeave = () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = ''
    }

    // Attach to window so we catch movements in the trigger zone outside the element
    window.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.style.transform = ''
      el.style.transition = ''
    }
  }, [ref, strength])
}
