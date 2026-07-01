"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import type {
  ClientData,
  GuaranteeData,
  HandoverItem,
  HandoverItemKey,
} from "@/types/client"
import { HandoverRow } from "./HandoverRow"
import { HandoverDrawer } from "./HandoverDrawer"
import { useHandoverKeyboard } from "./useHandoverKeyboard"

export type HandoverPackProps = {
  initialData: { client: ClientData; guarantee: GuaranteeData }
}

type Payload = { client: ClientData; guarantee: GuaranteeData }

const fetcher = async (url: string): Promise<Payload> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * Handover Pack Status · 02 of the Overview.
 *
 * Makes the no-lock-in positioning tangible pixel-by-pixel: the six handover
 * items are visible from Day 1, each with its live build state. By Day 30 all
 * six ship; Day 30+ flips items to `transferred` (gold · OWNED) as the client
 * actually takes possession.
 *
 * Register: institutional ledger. No card. Six hairline-divided rows. Shares
 * DNA with the Guarantee Tracker — same typography, same tokens, same drawer
 * motion, same keyboard vocabulary.
 *
 * Data flow:
 *   - Server render seeds via `initialData` (same source as GuaranteeTracker).
 *   - SWR polls `/api/client/[uid]` every 30s, revalidates on focus.
 *   - `handover[]` is the single source of truth; row order is canonical.
 *
 * A11y:
 *   - <section> with aria-labelledby pointing at the eyebrow.
 *   - role="list" on the six rows; each row a <button> (or <div> if not-started).
 *   - Roving tabindex: only actionable rows (state !== "not-started") are focusable.
 *   - Keyboard: j/k / Arrow↑↓, Home, End. Enter / Space opens the drawer.
 */

// Canonical row order. Mirrors the brief's mock and the fixture order; we sort
// the incoming handover[] by this key so a mis-ordered fixture never affects UI.
const ROW_ORDER: HandoverItemKey[] = [
  "outreach-sequences",
  "crm-config",
  "copy-library",
  "prospect-list",
  "landing-page",
  "sops-attestation",
]

/**
 * Per-item presentational metadata drawn from the fixture's engagement context.
 * These are FIXTURE-FACING labels — short descriptors of what the item is —
 * NOT invented marketing copy. They describe the artifact, not its progress.
 * Progress-level substate (dates, review status) is pulled dynamically below.
 */
const ITEM_SPEC: Record<HandoverItemKey, string> = {
  "outreach-sequences": "LinkedIn + email, multi-step",
  "crm-config": "HubSpot, MSP pipeline",
  "copy-library": "sequences, DM, proposal",
  "prospect-list": "Apollo, 200 records",
  "landing-page": "managed-contract, booking flow",
  "sops-attestation": "handover walkthrough + signed PDF",
}

/**
 * Dynamic substate line. Prefers live fixture data (shipped_at, transferred_at)
 * over static copy; falls back to state-appropriate plain language. Never
 * invents numbers — only reads what the item already carries.
 */
function subtextFor(item: HandoverItem): string {
  if (item.transferred_at) {
    return `Transferred · client holds credentials.`
  }
  if (item.shipped_at && item.state === "shipped") {
    const d = new Date(item.shipped_at + "T00:00:00Z").toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "short", timeZone: "UTC" },
    )
    return `Shipped ${d}. Open for review.`
  }
  switch (item.state) {
    case "ready-for-review":
      return "Ready for review. Open to inspect."
    case "in-progress":
      return "Build in progress."
    case "shipped":
      return "Shipped. Open for review."
    case "not-started":
    default:
      return "Scheduled in the 30-day build plan."
  }
}

export function HandoverPack({ initialData }: HandoverPackProps) {
  const { client: initialClient } = initialData
  const uid = initialClient.uid

  const { data, error } = useSWR<Payload>(`/api/client/${uid}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    fallbackData: initialData,
    keepPreviousData: true,
  })

  const current = data ?? initialData
  const client = current.client
  const isError = !!error

  // Order rows by canonical key; fall back to fixture order if a key is missing.
  const orderedItems = useMemo<HandoverItem[]>(() => {
    const byKey = new Map<HandoverItemKey, HandoverItem>()
    for (const it of client.handover) byKey.set(it.key, it)
    const out: HandoverItem[] = []
    for (const key of ROW_ORDER) {
      const it = byKey.get(key)
      if (it) out.push(it)
      else {
        // Declarative placeholder for a missing row — never empty.
        out.push({ key, name: humanize(key), state: "not-started" })
      }
    }
    return out
  }, [client.handover])

  const actionableIndices = useMemo(
    () =>
      orderedItems
        .map((it, i) => (it.state !== "not-started" ? i : -1))
        .filter((i) => i !== -1),
    [orderedItems],
  )

  const [activeIndex, setActiveIndex] = useState<number>(
    actionableIndices[0] ?? 0,
  )
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([])
  const { onKeyDown } = useHandoverKeyboard({
    actionableIndices,
    activeIndex,
    setActiveIndex,
    rowRefs,
  })

  // Drawer state.
  const [drawerItem, setDrawerItem] = useState<HandoverItem | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const openDrawer = useCallback((item: HandoverItem) => {
    const active = document.activeElement
    if (active instanceof HTMLElement) returnFocusRef.current = active
    setDrawerItem(item)
  }, [])
  const closeDrawer = useCallback(() => setDrawerItem(null), [])

  const showLoadingOverlay = !data && !error && !initialData

  // Completion telemetry for header — "shipped + transferred" counted as complete.
  const completedCount = useMemo(
    () =>
      orderedItems.filter(
        (it) => it.state === "shipped" || it.state === "transferred",
      ).length,
    [orderedItems],
  )

  return (
    <section
      aria-labelledby="handover-pack-eyebrow"
      data-igc-component="handover-pack"
      className="relative"
      style={{
        maxWidth: 720,
        width: "100%",
        opacity: showLoadingOverlay ? 0.35 : 1,
        transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Header row */}
      <div
        id="handover-pack-eyebrow"
        className="flex items-baseline justify-between gap-6"
        style={{ paddingBottom: 16 }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#7C7A76",
            fontVariantNumeric: "tabular-nums",
            margin: 0,
          }}
        >
          02 · Handover Pack
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#7C7A76",
            fontVariantNumeric: "tabular-nums",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          {completedCount} of {orderedItems.length}
        </p>
      </div>

      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          backgroundColor: "#20242A",
          width: "100%",
        }}
      />

      {/* Ledger */}
      <div
        role="list"
        aria-label="Handover pack items"
        onKeyDown={onKeyDown}
        tabIndex={-1}
      >
        {orderedItems.map((item, i) => {
          const isLast = i === orderedItems.length - 1
          const isActionable = item.state !== "not-started"
          return (
            <div key={item.key}>
              <HandoverRow
                ref={(el: HTMLButtonElement | HTMLDivElement | null) => {
                  rowRefs.current[i] = el as HTMLButtonElement | null
                }}
                item={item}
                index={i}
                spec={ITEM_SPEC[item.key] ?? ""}
                subtext={subtextFor(item)}
                tabIndex={isActionable && i === activeIndex ? 0 : -1}
                drawerOpenForThis={drawerItem?.key === item.key}
                onClick={isActionable ? () => openDrawer(item) : undefined}
              />
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{
                    height: 1,
                    backgroundColor: "#20242A",
                    width: "100%",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Loading overlay — editorial mono line, no spinner, no skeleton */}
      {showLoadingOverlay && (
        <p
          aria-live="polite"
          className="font-mono"
          style={{
            marginTop: 24,
            fontSize: "0.6875rem",
            lineHeight: 1.3,
            letterSpacing: "0.14em",
            color: "#7C7A76",
            fontVariantNumeric: "tabular-nums",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          loading · handover · {new Date().toISOString().substring(11, 19)} utc
        </p>
      )}

      {/* Error overlay — named-escalation, no red banner */}
      {isError && (
        <div
          aria-live="polite"
          role="status"
          className="flex flex-col gap-2"
          style={{ marginTop: 24 }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: "0.6875rem",
              lineHeight: 1.6,
              letterSpacing: "0.14em",
              color: "#C78B28",
              fontVariantNumeric: "tabular-nums",
              textTransform: "lowercase",
              margin: 0,
              maxWidth: "72ch",
            }}
          >
            handover sync failed at{" "}
            {new Date().toISOString().substring(11, 16)} utc. last-known-good
            shown. k.c. pages himself at{" "}
            <a
              href="mailto:hello@igc-growth.com"
              className="underline transition-colors duration-150 hover:text-[#FAF8F5]"
              style={{ color: "#C78B28", textUnderlineOffset: "3px" }}
            >
              hello@igc-growth.com
            </a>{" "}
            if unresolved within the hour.
          </p>
          <LastSyncedLine />
        </div>
      )}

      <HandoverDrawer
        item={drawerItem}
        onClose={closeDrawer}
        returnFocusRef={returnFocusRef}
      />
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */

function LastSyncedLine() {
  // Client-only timestamp — avoids hydration drift.
  const [stamp, setStamp] = useState<string | null>(null)
  useEffect(() => {
    setStamp(new Date().toISOString().substring(11, 16))
  }, [])
  if (!stamp) return null
  return (
    <p
      className="font-mono"
      style={{
        fontSize: "0.6875rem",
        lineHeight: 1.3,
        letterSpacing: "0.14em",
        color: "#7C7A76",
        fontVariantNumeric: "tabular-nums",
        textTransform: "lowercase",
        margin: 0,
      }}
    >
      last synced · {stamp}
    </p>
  )
}

function humanize(key: HandoverItemKey): string {
  switch (key) {
    case "outreach-sequences":
      return "Outreach sequences"
    case "crm-config":
      return "CRM configuration"
    case "copy-library":
      return "Copy library"
    case "prospect-list":
      return "Prospect list"
    case "landing-page":
      return "Landing page"
    case "sops-attestation":
      return "SOPs and attestation"
  }
}
