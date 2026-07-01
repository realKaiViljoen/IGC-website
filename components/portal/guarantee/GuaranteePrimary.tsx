import type { GuaranteeData } from "@/types/client"

/**
 * Row 2 · Primary number + qualifier subtitle.
 *
 *   3 of 5
 *   qualified managed-contract conversations
 *
 * Number rules (brief 8, DESIGN.md Gold Rule):
 *   - Fraunces 400 regular (not bold). At display sizes regular reads as declarative.
 *   - clamp(3rem, 5vw, 4.5rem) fluid scale; line-height 1.0.
 *   - Variable-axis pinned: opsz 144 (large optical — sharpest strokes, architectural),
 *     SOFT 30 (moderate — institutional-ledger, not wedding-invitation).
 *   - text-wrap balance on the numeral line.
 *   - tabular-nums locked on numeric substrings.
 *   - Color: `#FAF8F5` (ink) for all non-pre-outreach states, including `met`.
 *     The Gold Rule reserves gold for the 5th square + hairline only.
 *   - pre-outreach: `#7C7A76` (text-secondary). Guarantee hasn't started, number muted.
 *
 * Qualifier reads from `stage_config.guarantee_qualifier_label` — niche-agnostic.
 * Geist 300 light, 1.125rem / 1.75. Light weight creates contrast against display regular.
 */
export function GuaranteePrimary({ guarantee }: { guarantee: GuaranteeData }) {
  const { met, total, state, qualifier_label } = guarantee

  const numberColor = state === "pre-outreach" ? "#7C7A76" : "#FAF8F5"

  return (
    <div className="flex flex-col gap-3">
      <p
        className="font-display leading-none"
        style={{
          fontSize: "clamp(3rem, 5vw, 4.5rem)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: numberColor,
          fontVariantNumeric: "tabular-nums",
          fontOpticalSizing: "auto",
          fontVariationSettings: '"opsz" 144, "SOFT" 30',
          textWrap: "balance",
          margin: 0,
        }}
      >
        <span>{met}</span>
        <span style={{ color: "#7C7A76" }}> of </span>
        <span>{total}</span>
      </p>
      <p
        className="font-sans"
        style={{
          fontWeight: 300,
          fontSize: "1.125rem",
          lineHeight: 1.75,
          color: "#7C7A76",
          margin: 0,
          maxWidth: "44ch",
          textWrap: "pretty",
        }}
      >
        {qualifier_label}
      </p>
    </div>
  )
}
