"use client"

import { Command } from "cmdk"
import type { ReactNode } from "react"

/**
 * Section wrapper around cmdk's `Group`. Renders the Raycast-style
 * mono-uppercase section label plus the items inside.
 *
 * Tracking 0.16em, 11px DM Mono, text-tertiary `#9C9995`.
 */
export function PaletteSection({
  heading,
  children,
}: {
  heading: string
  children: ReactNode
}) {
  return (
    <Command.Group
      heading={heading}
      className="palette-group"
    >
      {children}
    </Command.Group>
  )
}
