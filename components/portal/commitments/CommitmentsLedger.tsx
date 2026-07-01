"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import type { ClientData, Commitment, GuaranteeData } from "@/types/client"
import { CommitmentRow, type CommitmentGroup } from "./CommitmentRow"

/**
 * Commitments Ledger · § 03 of the Overview.
 *
 * Makes K.C.'s accountability radically transparent. Every promise he made
 * (plus anything the client owes him back) surfaces here with a due date
 * and a met flag. The brand payoff: the willingness to display the miss IS
 * the trust architecture. Hiding it would kill it.
 *
 * Register: institutional ledger. No card wrapper. Same DNA as HandoverPack —
 * shared typography, shared tokens, shared error/loading vocabulary, same
 * hairline rhythm.
 *
 * Grouping (render order):
 *   1. Overdue          — due < today AND !met. Loudest tone: promise in
 *                         ink-primary, due-date in warm amber #C78B28.
 *   2. Due this week    — due within 7d AND !met. Promise in ink-primary.
 *   3. Upcoming         — due > 7d AND !met. Promise in text-secondary.
 *   4. Met              — met === true. Checkmark in gold #C9922A
 *                         (the Gold Rule — met commitments are receipts).
 *                         Row at opacity 0.7.
 *
 * Within each group, sort by due date ascending. Group labels render only
 * when the group has items. Top-hairline on each group label handles visual
 * separation — no row-divider after the last row of a group.
 *
 * Data flow:
 *   - RSC seeds via `initialData`.
 *   - SWR polls `/api/client/[uid]` every 30s; revalidates on focus.
 *
 * A11y:
 *   - <section> labelled by the eyebrow.
 *   - role="list" on the ledger container; each row role="listitem".
 *   - Rows non-focusable in Phase 2a (no drill-down yet).
 *
 * Empty state: editorial prose. Loading: mono timestamp. Error: named-
 * escalation amber line + last-synced stamp (matches HandoverPack exactly).
 */

export type CommitmentsLedgerProps = {
  initialData: { client: ClientData; guarantee: GuaranteeData }
}

type Payload = { client: ClientData; guarantee: GuaranteeData }

const fetcher = async (url: string): Promise<Payload> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** 00:00 UTC of the given ISO date. Stable across server/client. */
function dayStartUtc(iso: string): number {
  return new Date(iso + "T00:00:00Z").getTime()
}

type Grouped = Record<CommitmentGroup, Commitment[]>

/**
 * Classify + sort commitments. `todayIso` is the client's "today" — supplied
 * by the caller so SSR and CSR agree on the boundary (derived from the SWR
 * payload's engagement.startDate + engagement.day, not the local wall clock).
 */
function groupCommitments(
  commitments: Commitment[],
  todayStartUtcMs: number,
): Grouped {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  const weekCutoff = todayStartUtcMs + sevenDaysMs

  const grouped: Grouped = {
    overdue: [],
    "due-this-week": [],
    upcoming: [],
    met: [],
  }

  for (const c of commitments) {
    if (c.met) {
      grouped.met.push(c)
      continue
    }
    const dueMs = dayStartUtc(c.due)
    if (dueMs < todayStartUtcMs) {
      grouped.overdue.push(c)
    } else if (dueMs <= weekCutoff) {
      grouped["due-this-week"].push(c)
    } else {
      grouped.upcoming.push(c)
    }
  }

  // Due ascending within each live group; met descending (most recent first).
  const byDueAsc = (a: Commitment, b: Commitment) =>
    dayStartUtc(a.due) - dayStartUtc(b.due)
  const byMetDesc = (a: Commitment, b: Commitment) => {
    const ax = a.met_at ? dayStartUtc(a.met_at) : 0
    const bx = b.met_at ? dayStartUtc(b.met_at) : 0
    return bx - ax
  }

  grouped.overdue.sort(byDueAsc)
  grouped["due-this-week"].sort(byDueAsc)
  grouped.upcoming.sort(byDueAsc)
  grouped.met.sort(byMetDesc)

  return grouped
}

const GROUP_ORDER: CommitmentGroup[] = [
  "overdue",
  "due-this-week",
  "upcoming",
  "met",
]

const GROUP_LABEL: Record<CommitmentGroup, string> = {
  overdue: "Overdue",
  "due-this-week": "Due this week",
  upcoming: "Upcoming",
  met: "Met",
}

export function CommitmentsLedger({ initialData }: CommitmentsLedgerProps) {
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

  // Derive "today" from engagement so SSR and CSR agree. engagement.startDate
  // is an ISO date, engagement.day is 1-indexed. today = startDate + (day - 1).
  const todayStartUtcMs = useMemo(() => {
    const start = dayStartUtc(client.engagement.startDate)
    return start + (client.engagement.day - 1) * 24 * 60 * 60 * 1000
  }, [client.engagement.startDate, client.engagement.day])

  const grouped = useMemo(
    () => groupCommitments(client.commitments, todayStartUtcMs),
    [client.commitments, todayStartUtcMs],
  )

  const totalCount = client.commitments.length
  const metCount = grouped.met.length

  const showLoadingOverlay = !data && !error && !initialData
  const isEmpty = totalCount === 0

  return (
    <section
      aria-labelledby="commitments-ledger-eyebrow"
      data-igc-component="commitments-ledger"
      className="relative"
      style={{
        maxWidth: 720,
        width: "100%",
        opacity: showLoadingOverlay ? 0.35 : 1,
        transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Header row · § 03 · Commitments  ·  {met} of {total} */}
      <div
        id="commitments-ledger-eyebrow"
        className="flex items-baseline justify-between gap-6"
        style={{ paddingBottom: 24 }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#857F74",
            fontVariantNumeric: "tabular-nums",
            margin: 0,
          }}
        >
          § 03 · Commitments
        </p>
        {!isEmpty && (
          <p
            className="font-mono"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              color: "#857F74",
              fontVariantNumeric: "tabular-nums",
              textTransform: "lowercase",
              margin: 0,
            }}
          >
            {metCount} of {totalCount}
          </p>
        )}
      </div>

      {/* Empty state — editorial prose, declarative, no illustration */}
      {isEmpty && !isError && (
        <p
          className="font-sans"
          style={{
            fontWeight: 300,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#A8A6A3",
            maxWidth: "52ch",
            margin: 0,
          }}
        >
          No commitments logged yet. K.C. adds commitments here when promises
          are made, with due dates and met-status.
        </p>
      )}

      {/* Ledger body — four groups, hairline-separated */}
      {!isEmpty && (
        <div role="list" aria-label="Commitments ledger">
          {GROUP_ORDER.map((group) => {
            const items = grouped[group]
            if (items.length === 0) return null

            return (
              <div key={group} data-igc-commitment-group={group}>
                {/* Group label bar · top hairline · label · count */}
                <div
                  aria-hidden="true"
                  style={{
                    height: 1,
                    backgroundColor: "#2D2A27",
                    width: "100%",
                  }}
                />
                <div
                  className="flex items-baseline justify-between gap-6"
                  style={{ paddingTop: 14, paddingBottom: 14 }}
                >
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.6875rem",
                      letterSpacing: "0.14em",
                      color: "#93918E",
                      fontVariantNumeric: "tabular-nums",
                      margin: 0,
                    }}
                  >
                    {GROUP_LABEL[group]}{" "}
                    <span style={{ color: "#857F74" }}>
                      · {items.length}
                    </span>
                  </p>
                </div>

                {/* Group rows — 1px hairline between rows, not after the last */}
                {items.map((c, i) => {
                  const isLast = i === items.length - 1
                  return (
                    <div key={`${group}-${c.due}-${i}`}>
                      <CommitmentRow commitment={c} group={group} />
                      {!isLast && (
                        <div
                          aria-hidden="true"
                          style={{
                            height: 1,
                            backgroundColor: "#2D2A27",
                            width: "100%",
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Loading overlay — single mono timestamp, no spinner, no skeleton */}
      {showLoadingOverlay && (
        <p
          aria-live="polite"
          className="font-mono"
          style={{
            marginTop: 24,
            fontSize: "0.6875rem",
            lineHeight: 1.3,
            letterSpacing: "0.14em",
            color: "#857F74",
            fontVariantNumeric: "tabular-nums",
            textTransform: "lowercase",
            margin: 0,
          }}
        >
          loading · commitments · {new Date().toISOString().substring(11, 19)} utc
        </p>
      )}

      {/* Error overlay — named-escalation, no red banner, last-known-good shown */}
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
            commitments sync failed at{" "}
            {new Date().toISOString().substring(11, 16)} utc. last-known-good
            shown. k.c. pages himself at{" "}
            <a
              href="mailto:hello@igc-growth.com"
              className="underline transition-colors duration-150 hover:text-[#FAF9F7]"
              style={{ color: "#C78B28", textUnderlineOffset: "3px" }}
            >
              hello@igc-growth.com
            </a>{" "}
            if unresolved within the hour.
          </p>
          <LastSyncedLine />
        </div>
      )}
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
        color: "#857F74",
        fontVariantNumeric: "tabular-nums",
        textTransform: "lowercase",
        margin: 0,
      }}
    >
      last synced · {stamp}
    </p>
  )
}
