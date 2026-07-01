import type { ActivityEvent } from "@/types/client"

export type ActivityEntryBucket = "today" | "this-week" | "earlier"

export type ActivityEntryProps = {
  event: ActivityEvent
  /** Which date bucket this entry lives in — drives timestamp format. */
  bucket: ActivityEntryBucket
  /** When true, fade the row in (newly arrived via SWR). */
  isNew?: boolean
}

/**
 * ActivityEntry — a single row of the receipts spine.
 *
 * Anatomy (desktop ≥720px, 4-column):
 *   [timestamp 80px] · [actor 48px] · [entry flex] · [link arrow]
 *
 * Brand rule — actor-distinct typography (PRODUCT.md Brand #6):
 *   • K.C. entries render in Fraunces italic 400 (voice-register).
 *   • Automation entries render in Geist Mono (machine-register).
 *   • Client entries render in Geist sans (neutral — neither voice nor telemetry).
 *
 * When a `link` is present the whole row becomes a focusable <a> that opens in
 * a new tab; otherwise it renders as a plain <div role="listitem">.
 *
 * Responsive:
 *   • Tablet 480–720px: timestamp+actor collapse onto a single meta line above
 *     the entry. Handled via CSS grid area reflow.
 *   • Mobile <480px: two-line rows — meta line then entry (wrapping).
 *   The component ships one HTML structure and reflows with pure CSS grid +
 *   media queries so SSR/hydration stays stable.
 */
export function ActivityEntry({ event, bucket, isNew }: ActivityEntryProps) {
  const { actor = "automation", entry, link } = event

  const timestamp = formatTimestamp(event.date, bucket)
  const actorLabel = actorLabelFor(actor)
  const hasLink = Boolean(link)

  const commonRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "80px 48px 1fr auto",
    columnGap: 16,
    alignItems: "baseline",
    paddingTop: 8,
    paddingBottom: 8,
    width: "100%",
    textAlign: "left",
    opacity: isNew ? 0 : 1,
    animation: isNew
      ? "igc-activity-fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
      : undefined,
  }

  const tsNode = (
    <span
      className="font-mono"
      style={{
        fontSize: "0.6875rem",
        letterSpacing: "0.02em",
        color: "#9C9995",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        gridArea: "ts",
      }}
    >
      {timestamp}
    </span>
  )

  const actorNode = (
    <span
      className="font-mono uppercase"
      style={{
        fontSize: "0.6875rem",
        letterSpacing: "0.14em",
        color: actor === "kc" ? "#FAF8F5" : "#9C9995",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        gridArea: "actor",
      }}
    >
      {actorLabel}
    </span>
  )

  const entryNode = renderEntryText(actor, entry)

  const arrowNode = hasLink ? (
    <span
      aria-hidden="true"
      className="font-mono"
      style={{
        fontSize: "0.75rem",
        color: "#9C9995",
        gridArea: "link",
        lineHeight: 1,
      }}
    >
      {"\u2192"}
    </span>
  ) : (
    <span aria-hidden="true" style={{ gridArea: "link" }} />
  )

  // Shared inner grid — areas let the CSS media queries below reflow rows on
  // narrow viewports without a second JSX tree.
  const inner = (
    <>
      {tsNode}
      {actorNode}
      {entryNode}
      {arrowNode}
    </>
  )

  if (hasLink) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="igc-activity-row group"
        role="listitem"
        style={{
          ...commonRowStyle,
          textDecoration: "none",
          color: "inherit",
          transition: "background-color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {inner}
      </a>
    )
  }

  return (
    <div role="listitem" className="igc-activity-row" style={commonRowStyle}>
      {inner}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */

function actorLabelFor(actor: ActivityEvent["actor"]): string {
  switch (actor) {
    case "kc":
      return "K.C."
    case "client":
      return "YOU"
    case "automation":
    default:
      return "auto"
  }
}

/**
 * Renders entry text in the typography register dictated by the actor.
 *   - kc         → Fraunces italic 400, 15px, text-primary. Voice.
 *   - automation → Geist Mono 13px, text-secondary. Telemetry.
 *   - client     → Geist sans 14px, text-secondary. Neutral.
 *
 * Fraunces variation axes (opsz 72 / SOFT 80) match KcHypothesis — the same
 * warm-optical voice setting used in the Guarantee Tracker's hypothesis line.
 */
function renderEntryText(actor: ActivityEvent["actor"], entry: string) {
  const sharedBase: React.CSSProperties = {
    gridArea: "entry",
    margin: 0,
    textWrap: "pretty",
    minWidth: 0,
  }

  if (actor === "kc") {
    return (
      <p
        className="font-sans italic"
        style={{
          ...sharedBase,
          fontWeight: 400,
          fontSize: "0.9375rem",
          lineHeight: 1.55,
          letterSpacing: "-0.005em",
          color: "#FAF8F5",
          fontOpticalSizing: "auto",
          fontVariationSettings: '"opsz" 72, "SOFT" 80',
        }}
      >
        {entry}
      </p>
    )
  }

  if (actor === "client") {
    return (
      <p
        className="font-sans"
        style={{
          ...sharedBase,
          fontWeight: 400,
          fontSize: "0.875rem",
          lineHeight: 1.55,
          letterSpacing: "-0.005em",
          color: "#C3C0BB",
        }}
      >
        {entry}
      </p>
    )
  }

  // automation — machine register
  return (
    <p
      className="font-mono"
      style={{
        ...sharedBase,
        fontSize: "0.8125rem",
        lineHeight: 1.55,
        letterSpacing: "0em",
        color: "#C3C0BB",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {entry}
    </p>
  )
}

/**
 * Formats an ISO date string per bucket:
 *   - today     → "HH:MM UTC"
 *   - this-week → "Mon 22 · HH:MM"
 *   - earlier   → "22 Apr · HH:MM"
 *
 * Fixtures currently carry date-only strings; when the time part is missing
 * we render a dotted placeholder ("..: UTC") rather than a fabricated clock.
 * For non-today buckets the prefix (weekday or day-month) carries the weight.
 */
function formatTimestamp(iso: string, bucket: ActivityEntryBucket): string {
  const hasTime = iso.includes("T")
  const d = new Date(hasTime ? iso : iso + "T00:00:00Z")

  const hh = d.getUTCHours().toString().padStart(2, "0")
  const mm = d.getUTCMinutes().toString().padStart(2, "0")
  const clock = hasTime ? `${hh}:${mm}` : ""

  if (bucket === "today") {
    return hasTime ? `${clock} UTC` : "··:·· UTC"
  }

  if (bucket === "this-week") {
    const weekday = d.toLocaleDateString("en-GB", {
      weekday: "short",
      timeZone: "UTC",
    })
    const day = d.getUTCDate().toString().padStart(2, "0")
    return hasTime ? `${weekday} ${day} · ${clock}` : `${weekday} ${day}`
  }

  // earlier
  const day = d.getUTCDate().toString().padStart(2, "0")
  const month = d.toLocaleDateString("en-GB", {
    month: "short",
    timeZone: "UTC",
  })
  return hasTime ? `${day} ${month} · ${clock}` : `${day} ${month}`
}
