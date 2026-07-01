"use client"

import { useState } from "react"
import type { HypothesisEntry } from "@/types/client"

/**
 * Row 6 · Hypothesis thread (expanded variant only).
 *
 * Append-only weekly K.C. hypothesis entries, reverse-chronological.
 * Default visible: 3 most-recent. "Show all" discloses the remainder.
 *
 * Each entry:
 *   Fraunces italic 400 body (opsz 72, SOFT 80 — voice-warm), signed
 *   `— K.C. · 20 Apr 2026` in Geist Mono uppercase below.
 *
 * Empty state: one-line editorial sentence. No "first entry will appear here" placeholder.
 *
 * Rules (brief 5 · Row 6):
 *  - Entries separated by 24px vertical gaps.
 *  - Latest at top (append-only log, not a state ticker — always render whatever
 *    entries exist regardless of current state).
 *  - No card. No container. Structured typography.
 */

function formatEntryDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase()
}

export function HypothesisThread({ entries }: { entries: HypothesisEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const [expanded, setExpanded] = useState(false)

  const visibleEntries = expanded ? sorted : sorted.slice(0, 3)
  const hasMore = sorted.length > 3
  const remaining = sorted.length - 3

  return (
    <section aria-labelledby="guarantee-hypothesis-eyebrow" className="flex flex-col">
      <h3
        id="guarantee-hypothesis-eyebrow"
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#7C7A76",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
          marginBottom: 24,
        }}
      >
        02 · Operator log
      </h3>

      {sorted.length === 0 ? (
        <p
          className="font-sans"
          style={{
            fontWeight: 300,
            fontSize: "1.125rem",
            lineHeight: 1.75,
            color: "#7C7A76",
            margin: 0,
            maxWidth: "56ch",
            textWrap: "pretty",
          }}
        >
          No operator log entries yet. K.C. writes here when pace breaks or the plan shifts.
        </p>
      ) : (
        <ol
          className="flex flex-col"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: 24,
          }}
        >
          {visibleEntries.map((entry) => {
            const fixDate = entry.fix_date
              ? new Date(entry.fix_date + "T00:00:00Z").toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  timeZone: "UTC",
                })
              : ""
            const body = `${entry.text}${entry.fix_action ? `, ${entry.fix_action}` : ""}${
              fixDate ? ` ${fixDate}` : ""
            }.`
            return (
              <li key={entry.id} className="flex flex-col gap-2">
                <p
                  className="font-sans italic"
                  style={{
                    fontWeight: 400,
                    fontSize: "1.125rem",
                    lineHeight: 1.55,
                    letterSpacing: "-0.005em",
                    color: "#FAF8F5",
                    margin: 0,
                    maxWidth: "65ch",
                    fontOpticalSizing: "auto",
                    fontVariationSettings: '"opsz" 72, "SOFT" 80',
                    textWrap: "pretty",
                  }}
                >
                  {body}
                </p>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.14em",
                    color: "#7C7A76",
                    fontVariantNumeric: "tabular-nums",
                    margin: 0,
                  }}
                >
                  — K.C. · {formatEntryDate(entry.created_at)}
                </p>
              </li>
            )
          })}
        </ol>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="self-start font-mono uppercase transition-colors duration-150 hover:text-[#C78B28] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C0F] rounded-sm"
          style={{
            marginTop: 24,
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#7C7A76",
            fontVariantNumeric: "tabular-nums",
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textUnderlineOffset: "3px",
          }}
        >
          {expanded ? "Collapse" : `Show all ${remaining} more`}
        </button>
      )}
    </section>
  )
}
