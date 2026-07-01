import type { HypothesisEntry } from "@/types/client"

/**
 * K.C.'s hypothesis block — Fraunces italic 400, 1.125rem, ink.
 *
 * Appears inline (NOT in a card) on `behind` and `unpaid-extension` states.
 * Concede-before-claim is the brand. Hiding a bad number kills it. Showing K.C.'s
 * hypothesis and fix date IS the trust artifact.
 *
 * Typography:
 *   - Fraunces italic 400 carries K.C.'s voice. Variable axes tuned for expressive
 *     voice: opsz 72 (medium optical), SOFT 80 (warmer, less architectural — reads
 *     as operator speaking, not institutional plaque).
 *   - Letter-spacing -0.005em, line-height 1.55, text-wrap pretty.
 *   - Leading `K.C. ·` stamp in Geist Mono — machine-attribution contrast against
 *     principal-authored italic body.
 *
 * Format (brief 8):
 *   "{hypothesis_text}, {fix_action} {fix_date}." prefixed by a `K.C. ·` mono tag.
 *
 * ≤140 chars, hard two-line cap.
 */
export function KcHypothesis({ entry }: { entry: HypothesisEntry }) {
  const fixDate = entry.fix_date
    ? new Date(entry.fix_date + "T00:00:00Z").toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
    : ""

  const body = `${entry.text}${entry.fix_action ? `, ${entry.fix_action}` : ""}${fixDate ? ` ${fixDate}` : ""}.`

  return (
    <p
      className="font-sans italic"
      style={{
        fontWeight: 400,
        fontSize: "1.125rem",
        lineHeight: 1.55,
        letterSpacing: "-0.005em",
        color: "#FAF8F5",
        margin: 0,
        maxWidth: "56ch",
        fontOpticalSizing: "auto",
        fontVariationSettings: '"opsz" 72, "SOFT" 80',
        textWrap: "pretty",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      <span
        className="font-mono not-italic"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.14em",
          color: "#9C9995",
          fontVariantNumeric: "tabular-nums",
          marginRight: "0.5em",
          verticalAlign: "0.1em",
          textTransform: "uppercase",
        }}
      >
        K.C. ·
      </span>
      {body}
    </p>
  )
}
