"use client"

import { useMemo } from "react"
import useSWR from "swr"
import type { Briefing, ClientData, GuaranteeData } from "@/types/client"

export type BriefingCardProps = {
  initialData: { client: ClientData; guarantee: GuaranteeData }
}

type Payload = { client: ClientData; guarantee: GuaranteeData }

const fetcher = async (url: string): Promise<Payload> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * Weekly Briefing Card · 04 of the Overview.
 *
 * The one place K.C.'s face appears in the entire portal.
 *
 * Per PRODUCT.md Strategic Principle #4:
 *   "The operator vs the operation. K.C.'s face appears in exactly ONE place —
 *    the Loom thumbnail on the weekly Briefing Card."
 *
 * This card therefore carries the principal-led weight of the product surface.
 * Editorial. Serious. Restrained. No card wrapper — structured typography only.
 *
 * States (all five):
 *   1. default         — latest briefing within 8 days: thumbnail + italic summary
 *   2. empty-early     — no briefings, engagement.day < 7: editorial prose
 *   3. empty-late      — no briefings, engagement.day >= 7: amber self-SLA prose
 *   4. sla-breach      — latest briefing >8 days old: amber ring, amber tag,
 *                        amber next-briefing line beneath. The brand moment.
 *   5. error           — last-known-good retained, mono-amber escalation line.
 *
 * Self-SLA amber (PRODUCT.md Strategic Principle #5):
 *   "When K.C. misses a weekly briefing target, the Briefing Card turns amber
 *    after 8 days — a visible self-SLA."
 *   The willingness to display the failure IS the brand.
 */

/** Self-SLA threshold in days. Past this, the card flips amber. */
const SLA_DAYS = 8
const AMBER = "#C78B28"

/** "today" as a UTC date floor — fixture dates are ISO yyyy-mm-dd UTC. */
function todayUtc(): Date {
  const now = new Date()
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
}

/** Whole-day delta between two ISO `YYYY-MM-DD` dates (UTC). */
function daysSince(isoDate: string, today: Date): number {
  const d = new Date(isoDate + "T00:00:00Z")
  const ms = today.getTime() - d.getTime()
  return Math.floor(ms / 86_400_000)
}

/** "18 Apr 2026" */
function formatLongDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** "18 Apr" */
function formatShortDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
}

/** "7:42" — mm:ss duration label. */
function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * Compute the right-rail header tag for a latest briefing.
 * - Within 8 days → neutral: "Latest · {DD Mon} · this week"
 * - Past 8 days → amber: "Last · {N} days ago · overdue"
 */
function headerTagFor(latest: Briefing, today: Date) {
  const age = daysSince(latest.week_of, today)
  if (age > SLA_DAYS) {
    return {
      text: `Last · ${age} days ago · overdue`,
      color: AMBER,
    }
  }
  return {
    text: `Latest · ${formatShortDate(latest.week_of)} · this week`,
    color: "#C3C0BB",
  }
}

export function BriefingCard({ initialData }: BriefingCardProps) {
  const { client: initialClient } = initialData
  const uid = initialClient.uid

  const { data, error } = useSWR<Payload>(`/api/client/${uid}`, fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    fallbackData: initialData,
    keepPreviousData: true,
  })

  const current = data ?? initialData
  const client = current.client
  const isError = !!error
  const showLoadingOverlay = !data && !error && !initialData

  // Derive state. Fixture dates are ISO UTC; we measure against UTC "today".
  const today = useMemo(todayUtc, [])

  // Most recent briefing by week_of (descending). Defensive sort — the fixture
  // may not guarantee order once multiple entries land.
  const latest = useMemo<Briefing | null>(() => {
    if (!client.briefings || client.briefings.length === 0) return null
    const sorted = [...client.briefings].sort((a, b) =>
      b.week_of.localeCompare(a.week_of),
    )
    return sorted[0] ?? null
  }, [client.briefings])

  const latestAgeDays = latest ? daysSince(latest.week_of, today) : null
  const isSlaBreach = latestAgeDays !== null && latestAgeDays > SLA_DAYS
  const engagementDay = client.engagement.day
  const hasNoBriefings = latest === null
  const isEmptyLate = hasNoBriefings && engagementDay >= 7
  const isEmptyEarly = hasNoBriefings && engagementDay < 7

  return (
    <section
      aria-labelledby="briefing-card-eyebrow"
      data-igc-component="briefing-card"
      className="relative"
      style={{
        maxWidth: 720,
        width: "100%",
        opacity: showLoadingOverlay ? 0.35 : 1,
        transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Header row — eyebrow + right-rail tag */}
      <div
        id="briefing-card-eyebrow"
        className="flex items-baseline justify-between gap-6"
        style={{ paddingBottom: 16 }}
      >
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
          04 · Weekly Briefing
        </p>
        {latest && (
          <p
            className="font-mono"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
              color: headerTagFor(latest, today).color,
              fontVariantNumeric: "tabular-nums",
              textTransform: "lowercase",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {headerTagFor(latest, today).text}
          </p>
        )}
      </div>

      {/* Top hairline — matches HandoverPack */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          backgroundColor: "#20242A",
          width: "100%",
        }}
      />

      {/* Body */}
      <div style={{ paddingTop: 28 }}>
        {latest && (
          <DefaultBody
            briefing={latest}
            isSlaBreach={isSlaBreach}
            nextBriefing={client.next_briefing}
          />
        )}

        {isEmptyEarly && <EmptyEarly />}

        {isEmptyLate && <EmptyLate today={today} />}
      </div>

      {/* Error overlay — named-escalation, no red banner */}
      {isError && (
        <p
          aria-live="polite"
          role="status"
          className="font-mono"
          style={{
            marginTop: 24,
            fontSize: "0.6875rem",
            lineHeight: 1.6,
            letterSpacing: "0.14em",
            color: AMBER,
            fontVariantNumeric: "tabular-nums",
            textTransform: "lowercase",
            margin: "24px 0 0",
            maxWidth: "72ch",
          }}
        >
          briefing sync failed at {new Date().toISOString().substring(11, 16)}{" "}
          utc. last-known-good shown. k.c. pages himself at{" "}
          <a
            href="mailto:hello@igc-growth.com"
            className="underline transition-colors duration-150 hover:text-[#FAF8F5]"
            style={{ color: AMBER, textUnderlineOffset: "3px" }}
          >
            hello@igc-growth.com
          </a>{" "}
          if unresolved within the hour.
        </p>
      )}
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Default / SLA-breach body. Two-column on wide, stacked on narrow.           */

function DefaultBody({
  briefing,
  isSlaBreach,
  nextBriefing,
}: {
  briefing: Briefing
  isSlaBreach: boolean
  nextBriefing?: { date: string; description: string }
}) {
  const signatureDate = formatLongDate(briefing.week_of)
  const summary = (briefing.written_summary_md ?? "").trim()

  return (
    <div
      data-briefing-body
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 32,
        alignItems: "start",
      }}
      className="briefing-body"
    >
      <LoomThumbnail briefing={briefing} isSlaBreach={isSlaBreach} />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {summary && (
          <p
            className="font-sans italic"
            style={{
              fontWeight: 400,
              fontSize: "1.0625rem",
              lineHeight: 1.55,
              letterSpacing: "-0.005em",
              color: "#FAF8F5",
              margin: 0,
              maxWidth: "52ch",
              fontOpticalSizing: "auto",
              fontVariationSettings: '"opsz" 72, "SOFT" 80',
              textWrap: "pretty",
            }}
          >
            &ldquo;{summary}&rdquo;
          </p>
        )}

        <p
          className="font-mono"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.14em",
            color: "#C3C0BB",
            fontVariantNumeric: "tabular-nums",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {/* Signature byline — the ONE permitted long-form em-dash in UI chrome.
              Per PRODUCT.md: long-form signatures are allowed. */}
          — K.C. · {signatureDate}
        </p>

        {isSlaBreach && (
          <SlaNextBriefingLine nextBriefing={nextBriefing} />
        )}

        <BriefingLink loomUrl={briefing.loom_url} />
      </div>

      {/* Responsive: stack under 720px. Inline <style> scoped via attribute
          selector — no global CSS, no Tailwind config edits. */}
      <style>{`
        @media (max-width: 720px) {
          [data-briefing-body] {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Loom thumbnail — 16:9, play triangle overlay, duration pill, amber ring.    */

function LoomThumbnail({
  briefing,
  isSlaBreach,
}: {
  briefing: Briefing
  isSlaBreach: boolean
}) {
  const hasImage = Boolean(briefing.loom_thumbnail)
  const duration =
    typeof briefing.loom_duration_seconds === "number"
      ? formatDuration(briefing.loom_duration_seconds)
      : null

  return (
    <a
      href={briefing.loom_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open weekly briefing Loom video (${duration ?? "watch"})`}
      className="group relative block overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C0F]"
      style={{
        width: "100%",
        maxWidth: 240,
        aspectRatio: "16 / 9",
        backgroundColor: "#0F1216",
        border: "1px solid #20242A",
        boxShadow: isSlaBreach ? `0 0 0 1px ${AMBER}` : undefined,
        transition: "opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={briefing.loom_thumbnail}
          alt=""
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}

      {/* Dimming scrim — only over image, subtle */}
      {hasImage && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(8, 8, 8, 0.25)",
            transition: "background-color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="group-hover:bg-[rgba(8,8,8,0.15)]"
        />
      )}

      {/* Centered play triangle */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PlayTriangle muted={!hasImage} />
      </div>

      {/* Duration pill — bottom-left */}
      {duration && (
        <span
          className="font-mono"
          style={{
            position: "absolute",
            left: 8,
            bottom: 8,
            fontSize: "0.6875rem",
            letterSpacing: "0.06em",
            color: "#FAF8F5",
            fontVariantNumeric: "tabular-nums",
            backgroundColor: "rgba(8, 8, 8, 0.7)",
            padding: "2px 6px",
            lineHeight: 1.3,
          }}
        >
          {duration}
        </span>
      )}
    </a>
  )
}

function PlayTriangle({ muted }: { muted: boolean }) {
  // Semi-transparent circle + triangle. Warm-dark, no gold, no glow.
  return (
    <svg
      width={44}
      height={44}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <circle
        cx={22}
        cy={22}
        r={21}
        fill="rgba(8, 8, 8, 0.55)"
        stroke={muted ? "#20242A" : "rgba(242, 237, 228, 0.6)"}
        strokeWidth={1}
      />
      <path
        d="M18 14.5 L31 22 L18 29.5 Z"
        fill={muted ? "#7C7A76" : "#FAF8F5"}
      />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* "View full briefing" link — mono, gold underline only on hover.             */

function BriefingLink({ loomUrl }: { loomUrl: string }) {
  return (
    <a
      href={loomUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group font-mono inline-flex items-center gap-2 uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C0F]"
      style={{
        fontSize: "0.6875rem",
        letterSpacing: "0.14em",
        color: "#FAF8F5",
        fontVariantNumeric: "tabular-nums",
        marginTop: 4,
        width: "fit-content",
      }}
    >
      <span
        className="group-hover:border-b group-hover:border-[#C78B28]"
        style={{
          borderBottom: "1px solid transparent",
          paddingBottom: 1,
          transition: "border-color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        View full briefing
      </span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          transition: "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="group-hover:translate-x-[3px]"
      >
        →
      </span>
    </a>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* SLA "Next briefing" amber line.                                             */

function SlaNextBriefingLine({
  nextBriefing,
}: {
  nextBriefing?: { date: string; description: string }
}) {
  const nextText = nextBriefing?.date
    ? `Next briefing lands ${formatLongDate(nextBriefing.date)}.`
    : "Next briefing: TBD."

  return (
    <p
      className="font-mono"
      style={{
        fontSize: "0.6875rem",
        lineHeight: 1.6,
        letterSpacing: "0.14em",
        color: AMBER,
        fontVariantNumeric: "tabular-nums",
        textTransform: "lowercase",
        margin: 0,
        maxWidth: "72ch",
      }}
    >
      self-sla · weekly briefing committed. {nextText.toLowerCase()}
    </p>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Empty states.                                                               */

function EmptyEarly() {
  return (
    <p
      className="font-sans"
      style={{
        fontWeight: 300,
        fontSize: "1rem",
        lineHeight: 1.7,
        color: "#C3C0BB",
        margin: 0,
        maxWidth: "52ch",
      }}
    >
      First weekly briefing ships end of Week 1. Loom and written summary
      delivered by K.C.
    </p>
  )
}

function EmptyLate({ today }: { today: Date }) {
  const stamp = today.toISOString().substring(0, 10)
  return (
    <p
      className="font-mono"
      style={{
        fontSize: "0.6875rem",
        lineHeight: 1.6,
        letterSpacing: "0.14em",
        color: AMBER,
        fontVariantNumeric: "tabular-nums",
        textTransform: "lowercase",
        margin: 0,
        maxWidth: "72ch",
      }}
    >
      weekly briefing overdue. k.c. paged · {stamp}.
    </p>
  )
}
