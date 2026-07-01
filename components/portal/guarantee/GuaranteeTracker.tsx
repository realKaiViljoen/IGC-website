"use client"

import { useCallback, useRef, useState } from "react"
import useSWR from "swr"
import type { ClientData, GuaranteeConversation, GuaranteeData } from "@/types/client"
import { GuaranteeHeader } from "./GuaranteeHeader"
import { GuaranteePrimary } from "./GuaranteePrimary"
import { GuaranteeSquares } from "./GuaranteeSquares"
import { GuaranteeSubtext } from "./GuaranteeSubtext"
import { KcHypothesis } from "./KcHypothesis"
import { ConversationDrawer } from "./ConversationDrawer"
import { GuaranteeExpandedBody } from "./GuaranteeExpandedBody"
import { useGuaranteeMotion } from "./useGuaranteeMotion"

export type GuaranteeTrackerProps = {
  variant: "compact" | "expanded"
  initialData: { client: ClientData; guarantee: GuaranteeData }
}

type Payload = { client: ClientData; guarantee: GuaranteeData }

const fetcher = async (url: string): Promise<Payload> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * Guarantee Tracker — the hero component of the client portal.
 *
 * Responsibilities:
 *   - Revalidate every 30s + on focus via SWR (`/api/client/[uid]`).
 *   - Render the 4-row stack (header / primary / squares / subtext).
 *   - Play the signature motion on real-time `met` transitions (see useGuaranteeMotion).
 *   - Degrade gracefully on API error: render last-known-good from SWR's fallback and
 *     append the named-escalation error overlay line.
 *   - Orchestrate the conversation drawer (right-side peek on square click).
 *
 * Layout is non-card by design (brief §5). Max-width 680px compact, 1024px expanded.
 * Vertical rhythm on the 4pt grid: 24 / 32 / 24 (row 1→2, 2→3, 3→4).
 */
export function GuaranteeTracker({ variant, initialData }: GuaranteeTrackerProps) {
  const { client: initialClient, guarantee: initialGuarantee } = initialData
  const uid = initialClient.uid

  const { data, error } = useSWR<Payload>(`/api/client/${uid}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    fallbackData: initialData,
    keepPreviousData: true,
  })

  // Current view = latest payload if available, else fallback.
  const current = data ?? initialData
  const client = current.client
  const guarantee = current.guarantee
  const isError = !!error

  const { shouldAnimate, reducedMotion } = useGuaranteeMotion({
    state: guarantee.state,
    uid,
  })

  // Drawer state.
  const [drawerConv, setDrawerConv] = useState<GuaranteeConversation | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const onSelectConversation = useCallback((c: GuaranteeConversation) => {
    // Capture the triggering square so focus can return there on drawer close.
    const active = document.activeElement
    if (active instanceof HTMLElement) returnFocusRef.current = active
    setDrawerConv(c)
  }, [])

  const onCloseDrawer = useCallback(() => setDrawerConv(null), [])

  // Dim rows during loading overlay. Loading here is: SWR fetching with no prior
  // data (rare — we always have fallbackData). The subtle "loading" state is more
  // interesting: post-mount polling shouldn't dim. So `showLoadingOverlay` is gated
  // on lack of current guarantee — virtually never true in practice, but preserves
  // the contract from the brief.
  const showLoadingOverlay = !data && !error && !initialData

  const maxWidth = variant === "compact" ? 680 : 1024

  // Outer wrapper — NOT a card. Non-styled container; layout only.
  return (
    <section
      aria-labelledby="guarantee-tracker-eyebrow"
      data-igc-variant={variant}
      data-igc-state={guarantee.state}
      style={{ maxWidth, width: "100%" }}
      className="relative"
    >
      <div
        className="flex flex-col"
        style={{
          gap: 0,
          opacity: showLoadingOverlay ? 0.35 : 1,
          transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Row 1 · eyebrow + day counter */}
        <div id="guarantee-tracker-eyebrow">
          <GuaranteeHeader guarantee={guarantee} />
        </div>

        {/* Row 2 · primary number + qualifier (24px after row 1) */}
        <div style={{ marginTop: 24 }}>
          <GuaranteePrimary guarantee={guarantee} />
        </div>

        {/* Row 3 · squares (32px — critical breathing room) */}
        <div style={{ marginTop: 32 }}>
          <GuaranteeSquares
            guarantee={guarantee}
            onSelectConversation={onSelectConversation}
            openDrawerForId={drawerConv?.id ?? null}
            shouldAnimate={shouldAnimate}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Row 4 · state-dependent subtext (24px) — may be null */}
        {(guarantee.state === "pre-outreach" ||
          guarantee.state === "met" ||
          guarantee.state === "archive" ||
          guarantee.state === "unpaid-extension") && (
          <div style={{ marginTop: 24 }}>
            <GuaranteeSubtext
              guarantee={guarantee}
              shouldAnimate={shouldAnimate}
              reducedMotion={reducedMotion}
            />
          </div>
        )}

        {/* K.C. hypothesis — behind + unpaid-extension always inline */}
        {(guarantee.state === "behind" || guarantee.state === "unpaid-extension") &&
          guarantee.latest_hypothesis && (
            <div style={{ marginTop: 24 }}>
              <KcHypothesis entry={guarantee.latest_hypothesis} />
            </div>
          )}

        {/* Expanded-variant body (Rows 5–7) — conversations, operator log, timeline */}
        {variant === "expanded" && (
          <GuaranteeExpandedBody client={client} guarantee={guarantee} />
        )}
      </div>

      {/* Loading overlay line — single mono timestamp, no spinner, no skeleton */}
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
          }}
        >
          loading · hubspot · {new Date().toISOString().substring(11, 19)} utc
        </p>
      )}

      {/* Error overlay — named-escalation, no red banner */}
      {isError && (
        <div
          aria-live="polite"
          role="status"
          style={{ marginTop: 24 }}
          className="flex flex-col gap-2"
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
            hubspot sync failed at {new Date().toISOString().substring(11, 16)} utc · retrying every 30s · k.c. pages himself at{" "}
            <a
              href="mailto:hello@igc-growth.com"
              className="underline transition-colors duration-150 hover:text-[#FAF9F7]"
              style={{ color: "#C78B28", textUnderlineOffset: "3px" }}
            >
              hello@igc-growth.com
            </a>{" "}
            if unresolved within the hour.
          </p>
          {guarantee.last_synced && (
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
              last synced · {guarantee.last_synced.substring(0, 5)}
            </p>
          )}
        </div>
      )}

      {/* Right-drawer peek */}
      <ConversationDrawer
        conversation={drawerConv}
        onClose={onCloseDrawer}
        returnFocusRef={returnFocusRef}
      />
    </section>
  )
}
