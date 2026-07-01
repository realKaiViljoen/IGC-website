"use client"

import { Command } from "cmdk"
import type { PaletteItem as PaletteItemType } from "./usePaletteItems"

/**
 * A single palette row. 44px tall, 16px horizontal padding.
 *
 * Layout:
 *   [ glyph (16px) ]  [ primary / secondary ]  [ right-meta ]
 *
 * Highlighted state (arrow-key focus OR hover):
 *   background `#1A1D22`, left edge 1px gold `#C9922A`.
 *   1px strictly — honours the absolute ban on side-stripe borders >1px.
 */
export function PaletteItem({
  item,
  onSelect,
}: {
  item: PaletteItemType
  onSelect: () => void
}) {
  return (
    <Command.Item
      value={`${item.label} ${item.keywords.join(" ")}`}
      onSelect={onSelect}
      className="palette-item group relative flex cursor-pointer items-center gap-3 border-l border-l-transparent px-4 py-2.5 text-left outline-none transition-colors duration-75 data-[selected=true]:border-l-[#C9922A] data-[selected=true]:bg-[#1A1D22]"
    >
      <span
        aria-hidden="true"
        className="inline-flex w-4 shrink-0 justify-center font-mono text-[13px] leading-none text-[#857F74] group-data-[selected=true]:text-[#93918E]"
      >
        {item.glyph ?? ""}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-sans text-sm text-[#FAF9F7]">
          {item.label}
        </span>
        {item.secondary ? (
          <span className="mt-0.5 block truncate font-sans text-[12px] text-[#857F74]">
            {item.secondary}
          </span>
        ) : null}
      </span>

      {item.meta ? (
        <span className="shrink-0 font-mono text-[11px] tabular-nums tracking-[0.02em] text-[#93918E]">
          {item.meta}
        </span>
      ) : null}
    </Command.Item>
  )
}
