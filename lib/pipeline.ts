import type { Prospect } from "@/types/client"

/**
 * Pure formatting helpers for the Pipeline surface.
 *
 * Lives here (not inline) so the same formatters can be consumed by a row,
 * a drawer, a sparkline tooltip — anything that renders Prospect data.
 */

/**
 * GBP (or ZAR / USD) currency in whole units. No decimals. Thousands comma.
 * Example: 3_600_000 cents (GBP) → "£36,000".
 */
export function formatCurrency(cents: number, currency: Prospect["currency"]): string {
  const units = Math.round(cents / 100)
  const body = units.toLocaleString("en-GB")
  switch (currency) {
    case "GBP":
      return `£${body}`
    case "USD":
      return `$${body}`
    case "ZAR":
      return `R${body}`
    default:
      return body
  }
}

/**
 * Relative date phrasing. "today", "yesterday", "N days ago" up to 7,
 * then "DD Mon" (UTC, en-GB). Never emits an em-dash.
 *
 * `now` supplied by caller (derived from engagement.startDate + day - 1) so
 * SSR and CSR agree on the boundary. Dates are ISO (YYYY-MM-DD) and treated
 * as 00:00 UTC.
 */
export function formatRelativeDate(iso: string, nowUtcMs: number): string {
  const dayMs = 24 * 60 * 60 * 1000
  const thenMs = new Date(iso + "T00:00:00Z").getTime()
  const diffDays = Math.floor((nowUtcMs - thenMs) / dayMs)
  if (diffDays <= 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays <= 7) return `${diffDays} days ago`
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
}

/**
 * Day-start UTC ms for an ISO date — stable across server/client.
 */
export function dayStartUtc(iso: string): number {
  return new Date(iso + "T00:00:00Z").getTime()
}

/**
 * "Today" anchor derived from engagement, not the wall clock. Matches the
 * Commitments ledger rule so every surface agrees on "today".
 */
export function todayAnchorFromEngagement(startDate: string, day: number): number {
  return dayStartUtc(startDate) + (day - 1) * 24 * 60 * 60 * 1000
}
