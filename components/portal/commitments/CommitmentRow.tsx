"use client"

import type { Commitment } from "@/types/client"

/**
 * A single commitments-ledger row.
 *
 * Visual contract (ledger register, same DNA as HandoverRow):
 *   - Author column (52px) — Geist Mono 11px uppercase, 0.14em tracking,
 *     text-tertiary #93918E. "K.C." or "YOU" (client-authored commitments).
 *   - Promise column (flex) — Fraunces 400 (NOT italic; italic is reserved
 *     for K.C.'s voice moments). 16px. Ink-primary for active commitments,
 *     text-secondary for met / upcoming quieter groups.
 *   - Due/Met column (right-aligned, 160px on desktop) — Geist Mono 11px,
 *     tabular-nums. Format:
 *       · `Due {Wk DD Mon}`  — active, ink-secondary
 *       · `Due {Wk DD Mon}`  — overdue, warm amber #C78B28
 *       · `✓ Met {Wk DD Mon}` — met, gold checkmark #C9922A + text-tertiary
 *
 * Subtext (line 2): optional. Renders when the promise contains a colon or
 * "within …" qualifier — the part after the primary phrase becomes subtext.
 * Geist sans 14px, text-secondary, max-width 52ch.
 *
 * Non-interactive in Phase 2a. Rows are <div role="listitem">, non-focusable.
 * Drill-down to notes (Phase 2b) will make actionable rows into <button>s.
 *
 * Mobile (<640px): stack to two lines — author + due on line 1 (smaller),
 * promise on line 2.
 */

export type CommitmentGroup = "overdue" | "due-this-week" | "upcoming" | "met"

export type CommitmentRowProps = {
  commitment: Commitment
  group: CommitmentGroup
}

/**
 * Split a promise string into primary + subtext.
 * Rule: if the string contains " — " (em-dash is banned in UI chrome so we
 * won't see one), " · ", or " within " / " by Day " / " by " followed by a
 * qualifier, split on that. Otherwise, return the full promise as primary.
 * Deliberately conservative — we'd rather render one clean line than a
 * mis-parsed second line.
 */
function splitPromise(promise: string): { primary: string; subtext: string | null } {
  // Look for "within Nd/Ndays" tail
  const withinMatch = promise.match(/^(.+?)\s+(within\s+\d+\s+(?:day|days|d))$/i)
  if (withinMatch) {
    return { primary: withinMatch[1].trim(), subtext: capitalize(withinMatch[2]) }
  }
  // Look for "by Day N" tail
  const byDayMatch = promise.match(/^(.+?)\s+(by\s+Day\s+\d+)$/i)
  if (byDayMatch) {
    return { primary: byDayMatch[1].trim(), subtext: capitalize(byDayMatch[2]) }
  }
  // Look for "every X during Y" tail
  const everyMatch = promise.match(/^(.+?)\s+(every\s+.+)$/i)
  if (everyMatch && everyMatch[1].split(" ").length >= 2) {
    return { primary: everyMatch[1].trim(), subtext: capitalize(everyMatch[2]) }
  }
  return { primary: promise, subtext: null }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** "Weekday DD Mon" — e.g., "Fri 19 Apr". UTC to avoid hydration drift. */
function formatLedgerDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z")
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
}

export function CommitmentRow({ commitment, group }: CommitmentRowProps) {
  const { primary, subtext } = splitPromise(commitment.promise)
  const authorLabel = commitment.author === "kc" ? "K.C." : "YOU"

  // Promise colour per group.
  const promiseColor =
    group === "overdue" || group === "due-this-week"
      ? "#FAF9F7"
      : group === "upcoming"
        ? "#A8A6A3"
        : "#A8A6A3" // met — text-secondary with lower opacity via wrapper

  // Right column — date + label.
  const rightLine = (() => {
    if (commitment.met && commitment.met_at) {
      return {
        marker: "✓",
        markerColor: "#C9922A",
        text: `Met ${formatLedgerDate(commitment.met_at)}`,
        textColor: "#93918E",
      }
    }
    if (group === "overdue") {
      return {
        marker: null,
        markerColor: null,
        text: `Due ${formatLedgerDate(commitment.due)}`,
        textColor: "#C78B28",
      }
    }
    return {
      marker: null,
      markerColor: null,
      text: `Due ${formatLedgerDate(commitment.due)}`,
      textColor: group === "upcoming" ? "#857F74" : "#93918E",
    }
  })()

  return (
    <div
      role="listitem"
      data-igc-commitment-row
      data-igc-group={group}
      data-igc-met={commitment.met ? "true" : "false"}
      style={{
        padding: "16px 0",
        opacity: group === "met" ? 0.7 : 1,
      }}
    >
      {/* Desktop · 3-column grid */}
      <div
        className="hidden sm:grid"
        style={{
          gridTemplateColumns: "52px 1fr 160px",
          columnGap: 24,
          alignItems: "baseline",
        }}
      >
        {/* Col 1 · author */}
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.14em",
            color: "#93918E",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {authorLabel}
        </span>

        {/* Col 2 · promise + optional subtext */}
        <div className="flex flex-col gap-1">
          <span
            className="font-sans"
            style={{
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "1rem",
              lineHeight: 1.4,
              letterSpacing: "-0.005em",
              color: promiseColor,
              fontOpticalSizing: "auto",
              fontVariationSettings: '"opsz" 24, "SOFT" 30',
              textWrap: "balance",
            }}
          >
            {primary}
          </span>
          {subtext && (
            <span
              className="font-sans"
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.55,
                color: "#857F74",
                maxWidth: "52ch",
              }}
            >
              {subtext}
            </span>
          )}
        </div>

        {/* Col 3 · due/met */}
        <span
          className="font-mono"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.04em",
            fontVariantNumeric: "tabular-nums",
            textAlign: "right",
            whiteSpace: "nowrap",
            color: rightLine.textColor,
          }}
        >
          {rightLine.marker && (
            <span
              aria-hidden="true"
              style={{
                color: rightLine.markerColor ?? undefined,
                marginRight: 6,
              }}
            >
              {rightLine.marker}
            </span>
          )}
          {rightLine.text}
        </span>
      </div>

      {/* Mobile · stacked layout */}
      <div className="flex flex-col gap-1.5 sm:hidden">
        {/* Line 1 · author + due/met */}
        <div className="flex items-baseline justify-between gap-4">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.14em",
              color: "#93918E",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {authorLabel}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums",
              color: rightLine.textColor,
              whiteSpace: "nowrap",
            }}
          >
            {rightLine.marker && (
              <span
                aria-hidden="true"
                style={{
                  color: rightLine.markerColor ?? undefined,
                  marginRight: 4,
                }}
              >
                {rightLine.marker}
              </span>
            )}
            {rightLine.text}
          </span>
        </div>
        {/* Line 2 · promise */}
        <span
          className="font-sans"
          style={{
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "0.9375rem",
            lineHeight: 1.4,
            letterSpacing: "-0.005em",
            color: promiseColor,
            fontOpticalSizing: "auto",
            fontVariationSettings: '"opsz" 24, "SOFT" 30',
          }}
        >
          {primary}
        </span>
        {subtext && (
          <span
            className="font-sans"
            style={{
              fontSize: "0.8125rem",
              lineHeight: 1.5,
              color: "#857F74",
            }}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  )
}
