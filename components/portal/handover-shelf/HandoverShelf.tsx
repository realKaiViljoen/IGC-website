"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { HandoverItem } from "@/types/client"
import { HandoverProgressStrip } from "./HandoverProgressStrip"
import { HandoverShelfRow } from "./HandoverShelfRow"
import { HandoverItemDrawer } from "./HandoverItemDrawer"

/**
 * Full-page Handover asset shelf — client shell.
 *
 * Owns: drawer state, row focus (roving tabindex), and the global keyboard
 * vocabulary for the surface:
 *   j / ArrowDown → focus next row (all 6; empty rows remain reachable)
 *   k / ArrowUp   → focus previous row
 *   Enter / Space → open drawer for focused row
 *   Esc           → close drawer (handled in drawer)
 *   /             → focus the name-filter input
 *
 * Filter: substring match on item.name (case-insensitive). When filtered,
 * rows not matching are hidden from DOM, which keeps keyboard nav coherent.
 *
 * Notable: all rows — even `not-started` — are clickable on this surface.
 * The compact HandoverPack on Overview deliberately hides not-started detail;
 * this page's purpose is the full ledger, so empty-state rows open the drawer
 * with a "Not started yet" note so the client can see what's coming.
 */
type Props = {
  items: HandoverItem[]
}

export function HandoverShelf({ items }: Props) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [drawerItem, setDrawerItem] = useState<HandoverItem | null>(null)

  const rowRefs = useRef<Array<HTMLButtonElement | null>>([])
  const filterInputRef = useRef<HTMLInputElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // Filtered view — keeps canonical indices stable, only the render list shrinks.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.map((item, index) => ({ item, index }))
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.name.toLowerCase().includes(q))
  }, [items, query])

  // Snap active index into the visible set if we filtered it out.
  useEffect(() => {
    if (visible.length === 0) return
    if (!visible.some(({ index }) => index === activeIndex)) {
      setActiveIndex(visible[0].index)
    }
  }, [visible, activeIndex])

  const focusAt = useCallback((idx: number) => {
    setActiveIndex(idx)
    queueMicrotask(() => rowRefs.current[idx]?.focus())
  }, [])

  const openDrawer = useCallback((item: HandoverItem) => {
    const active = document.activeElement
    if (active instanceof HTMLElement) returnFocusRef.current = active
    setDrawerItem(item)
  }, [])
  const closeDrawer = useCallback(() => setDrawerItem(null), [])

  // Global key handler — bound to the shelf container (not window) to avoid
  // hijacking j/k in other portal surfaces or inside inputs.
  const onShelfKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Ignore navigation keys while typing in the filter.
      const target = e.target as HTMLElement
      const inInput =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA"

      if (!inInput) {
        const order = visible.map((v) => v.index)
        if (order.length === 0) return
        const cursor = order.indexOf(activeIndex)

        switch (e.key) {
          case "ArrowDown":
          case "j": {
            e.preventDefault()
            const next = order[(Math.max(cursor, 0) + 1) % order.length]
            focusAt(next)
            return
          }
          case "ArrowUp":
          case "k": {
            e.preventDefault()
            const next =
              order[
                (Math.max(cursor, 0) - 1 + order.length) % order.length
              ]
            focusAt(next)
            return
          }
          case "Home": {
            e.preventDefault()
            focusAt(order[0])
            return
          }
          case "End": {
            e.preventDefault()
            focusAt(order[order.length - 1])
            return
          }
        }
      }

      // `/` focuses the filter — from anywhere on the shelf, including rows.
      if (e.key === "/" && !inInput) {
        e.preventDefault()
        filterInputRef.current?.focus()
        filterInputRef.current?.select()
      }
    },
    [visible, activeIndex, focusAt],
  )

  return (
    <div onKeyDown={onShelfKeyDown}>
      {/* Progress strip */}
      <div style={{ marginBottom: 40 }}>
        <HandoverProgressStrip items={items} />
      </div>

      {/* Filter — quiet, single line, mono. No "Search" label; the key hint is the affordance. */}
      <div
        className="flex items-baseline justify-between gap-6"
        style={{ marginBottom: 24 }}
      >
        <label className="flex items-baseline gap-3" style={{ flex: "1 1 auto" }}>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              color: "#5E5850",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Filter
          </span>
          <input
            ref={filterInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter by name…"
            className="font-mono flex-1 bg-transparent focus:outline-none"
            style={{
              fontSize: "0.8125rem",
              letterSpacing: "0.02em",
              color: "#FAF9F7",
              border: "none",
              padding: 0,
            }}
            aria-label="Filter asset shelf by name"
          />
        </label>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.14em",
            color: "#5E5850",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          press / to filter · j k to navigate
        </span>
      </div>

      {/* Top hairline — opens the ledger */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#242220" }}
      />

      {/* Rows */}
      <div
        role="list"
        aria-label="Handover asset shelf"
        tabIndex={-1}
      >
        {visible.length === 0 && (
          <p
            className="font-sans italic"
            style={{
              padding: "40px 0",
              fontSize: "0.9375rem",
              color: "#5E5850",
              margin: 0,
            }}
          >
            No items match {JSON.stringify(query)}.
          </p>
        )}
        {visible.map(({ item, index }, vi) => {
          const isLast = vi === visible.length - 1
          return (
            <div key={item.key} role="listitem">
              <HandoverShelfRow
                ref={(el) => {
                  rowRefs.current[index] = el
                }}
                item={item}
                index={index}
                tabIndex={index === activeIndex ? 0 : -1}
                drawerOpenForThis={drawerItem?.key === item.key}
                onClick={() => openDrawer(item)}
              />
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{ height: 1, backgroundColor: "#242220" }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom hairline — closes the ledger */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#242220" }}
      />

      <HandoverItemDrawer
        item={drawerItem}
        onClose={closeDrawer}
        returnFocusRef={returnFocusRef}
      />
    </div>
  )
}
