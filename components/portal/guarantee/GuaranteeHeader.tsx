import type { GuaranteeData } from "@/types/client"

/**
 * Row 1 · Eyebrow · Day counter.
 *
 * Left: `§ 01 · GUARANTEE` — the permanent section label.
 * Right: `Day N of 30`, with optional tail for behind / ahead / met / extension.
 *
 * The day counter is an anchor link to `#days-ruler` (Agent C will insert the
 * DaysRuler element on the page). Until then it's a no-op click that scrolls
 * to an anchor that doesn't exist yet; no visible breakage.
 *
 * Typography:
 *   - Geist Mono 11px, 0.16em tracking, tabular-nums.
 *   - Color `#857F74` (text-secondary). text-tertiary was bumped to `#93918E`
 *     at the token level, but the eyebrow role still wants the slightly firmer
 *     secondary tone against the warm-dark ground so it registers as a label,
 *     not a whisper.
 *   - Both eyebrow and day counter land in the same weight/color/tracking so
 *     the row reads as a single label-plane rather than two competing items.
 */
export function GuaranteeHeader({ guarantee }: { guarantee: GuaranteeData }) {
  const { state, day, totalDays, extension_days, met_date } = guarantee

  // Tail computation: what appears after `Day N of 30 · …`
  let tail: { text: string; tone: "quiet" | "met" } | null = null
  if (state === "ahead") tail = { text: "ahead", tone: "quiet" }
  else if (state === "behind") tail = { text: "behind pace", tone: "quiet" }
  else if (state === "unpaid-extension" && extension_days) {
    tail = { text: `+${extension_days} ${extension_days === 1 ? "day" : "days"} extended`, tone: "quiet" }
  }

  // `met`/`archive` replaces the whole counter with a "met · {date}" stamp-style string.
  const counterText = (() => {
    if ((state === "met" || state === "archive") && met_date) {
      return { prefix: "met", suffix: `Day ${day} of ${totalDays}` }
    }
    if (state === "unpaid-extension") {
      return { prefix: null, suffix: `Day ${totalDays} of ${totalDays}` }
    }
    return { prefix: null, suffix: `Day ${day} of ${totalDays}` }
  })()

  return (
    <div className="flex items-baseline justify-between gap-6">
      <p
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#857F74",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        § 01 · Guarantee
      </p>

      <a
        href="#days-ruler"
        className="font-mono no-underline transition-colors duration-200 hover:text-[#FAF9F7] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E] rounded-sm"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#857F74",
          fontVariantNumeric: "tabular-nums",
          textTransform: "lowercase",
        }}
      >
        {counterText.prefix && (
          <span style={{ color: "#857F74" }}>{counterText.prefix} · </span>
        )}
        <span>{counterText.suffix}</span>
        {tail && (
          <span style={{ color: "#857F74" }}> · {tail.text}</span>
        )}
      </a>
    </div>
  )
}
