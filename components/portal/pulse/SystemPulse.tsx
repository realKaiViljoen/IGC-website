"use client"

import useSWR from "swr"
import type { ClientData, GuaranteeData } from "@/types/client"
import { computeSystemPulse, type SystemPulseData } from "@/lib/pulse"

export type SystemPulseProps = {
  /** Initial snapshot from RSC hydration. Mirrors GuaranteeTracker contract. */
  initialData: { client: ClientData; guarantee?: GuaranteeData }
}

type Payload = { client: ClientData; guarantee: GuaranteeData }

const fetcher = async (url: string): Promise<Payload> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * System Pulse — one-line mono sentence summarizing today's outreach activity.
 *
 * Mounts between the page header and the GuaranteeTracker on the Overview page.
 * Provides its own 1px hairline top and bottom with 24px margins, so the host
 * page does not need to add separators around it.
 *
 * Typography and color rules are calibrated to match GuaranteeHeader — Geist
 * Mono 11px, tabular-nums, warm-dark palette. Numbers brighten to text-primary
 * (`#FAF8F5`) when non-zero and quiet to text-tertiary (`#9C9995`) when zero.
 *
 * States rendered:
 *   - default   (post-outreach, events present today)
 *   - pre-pulse (engagement day < 14)
 *   - empty-day (post-outreach, no events today)
 *   - stale     (last batch >4h ago) — adds amber ` · stale` tail
 *
 * Data flow: SWR revalidates `/api/client/[uid]` on the same cadence as the
 * GuaranteeTracker (30s + focus). The pulse itself is derived client-side from
 * the fresh ClientData — no new endpoint needed for Phase 2a.
 */
export function SystemPulse({ initialData }: SystemPulseProps) {
  const uid = initialData.client.uid

  const { data } = useSWR<Payload>(`/api/client/${uid}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    fallbackData:
      initialData.guarantee !== undefined
        ? (initialData as Payload)
        : undefined,
    keepPreviousData: true,
  })

  const client = data?.client ?? initialData.client
  const pulse = computeSystemPulse(client)

  const COLOR = {
    tertiary: "#9C9995",
    secondary: "#7C7A76",
    primary: "#FAF8F5",
    amber: "#C78B28",
    hairline: "#20242A",
  }

  // Entire sentence softens to tertiary when stale (per spec).
  const baseLabelColor = pulse.isStale ? COLOR.tertiary : COLOR.secondary
  const numberColor = (n: number) =>
    pulse.isStale ? COLOR.tertiary : n > 0 ? COLOR.primary : COLOR.tertiary
  const separatorStyle: React.CSSProperties = { color: COLOR.tertiary }

  const monoLine: React.CSSProperties = {
    fontSize: "0.6875rem",
    letterSpacing: "0.14em",
    fontVariantNumeric: "tabular-nums",
    textTransform: "lowercase",
    margin: 0,
    lineHeight: 1.3,
  }

  const eyebrowStyle: React.CSSProperties = {
    ...monoLine,
    color: COLOR.tertiary,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  }

  // ---------------------------------------------------------------------------
  // Sentence rendering — one of three shapes.
  // ---------------------------------------------------------------------------
  let sentence: React.ReactNode

  if (pulse.prePulse) {
    // Pre-pulse: "Outreach begins Day 14 · Tue 7 May · pulse live from day 14"
    sentence = (
      <span style={{ ...monoLine, color: COLOR.secondary }}>
        outreach begins day 14
        <Dot />
        <span style={{ color: COLOR.secondary }}>
          {pulse.prePulseBeginsDate ?? "tbd"}
        </span>
        <Dot />
        pulse live from day 14
      </span>
    )
  } else if (pulse.empty) {
    // Empty day: "No batches yet today · last was Yesterday 16:32 UTC"
    const hasHistory = Boolean(pulse.lastActiveLabel)
    sentence = (
      <span style={{ ...monoLine, color: COLOR.secondary }}>
        no batches yet today
        {hasHistory && (
          <>
            <Dot />
            last was {pulse.lastActiveLabel?.toLowerCase()}
            {pulse.lastActiveTime && (
              <>
                {" "}
                <span style={{ color: COLOR.secondary }}>
                  {pulse.lastActiveTime}
                </span>{" "}
                utc
              </>
            )}
          </>
        )}
      </span>
    )
  } else {
    // Default: "Today · 48 sent · 12 connected · 4 replies · 1 booked · last batch 11:42 UTC"
    sentence = (
      <span style={{ ...monoLine, color: baseLabelColor }}>
        <span style={{ color: baseLabelColor }}>
          {pulse.label.toLowerCase()}
        </span>
        <Dot />
        <Number value={pulse.sent} color={numberColor(pulse.sent)} />{" "}
        <span style={{ color: baseLabelColor }}>sent</span>
        <Dot />
        <Number value={pulse.connected} color={numberColor(pulse.connected)} />{" "}
        <span style={{ color: baseLabelColor }}>connected</span>
        <Dot />
        <Number value={pulse.replies} color={numberColor(pulse.replies)} />{" "}
        <span style={{ color: baseLabelColor }}>replies</span>
        <Dot />
        <Number value={pulse.booked} color={numberColor(pulse.booked)} />{" "}
        <span style={{ color: baseLabelColor }}>booked</span>
        <Dot />
        <span style={{ color: baseLabelColor }}>
          last batch{" "}
          {pulse.lastBatchAt ? (
            <span style={{ color: baseLabelColor }}>{pulse.lastBatchAt}</span>
          ) : (
            <span style={{ color: COLOR.tertiary }}>..:..</span>
          )}{" "}
          utc
        </span>
        {pulse.isStale && (
          <>
            <span style={separatorStyle}> · </span>
            <span style={{ color: COLOR.amber }}>stale</span>
          </>
        )}
      </span>
    )
  }

  return (
    <section
      aria-label="System pulse"
      data-igc-pulse-state={
        pulse.prePulse
          ? "pre-pulse"
          : pulse.empty
            ? "empty"
            : pulse.isStale
              ? "stale"
              : "default"
      }
      style={{
        width: "100%",
        marginTop: 24,
        marginBottom: 24,
        paddingTop: 8,
        paddingBottom: 8,
        minHeight: 32,
        borderTop: `1px solid ${COLOR.hairline}`,
        borderBottom: `1px solid ${COLOR.hairline}`,
      }}
    >
      <div
        className="flex items-baseline justify-between gap-6 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2"
        style={{ minHeight: 16 }}
      >
        <p className="font-mono" style={eyebrowStyle}>
          System Pulse
        </p>
        <p
          className="font-mono text-right max-[640px]:text-left"
          style={monoLine}
        >
          {sentence}
        </p>
      </div>
    </section>
  )
}

/** Middle-dot separator in text-tertiary. */
function Dot() {
  return <span style={{ color: "#9C9995" }}> · </span>
}

/** Tabular-nums number span. */
function Number({ value, color }: { value: number; color: string }) {
  return (
    <span
      style={{
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
  )
}

// Re-export the pure type for consumers that want to pass a pre-computed pulse.
export type { SystemPulseData }
