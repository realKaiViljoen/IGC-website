"use client"

/**
 * Tier indicator. Mono-colored glyph, never gold unless qualified.
 *
 *   Tier 1 → filled circle 6px
 *   Tier 2 → hollow ring 6px (1px stroke)
 *   Tier 3 → small filled dot 3px
 *   undefined → faint en-space dash at muted colour
 *
 * `qualified` flips the default tertiary into the gold signal — reserved for
 * prospects that have crossed the qualified_stage_index boundary.
 */
export function TierDot({
  tier,
  qualified,
}: {
  tier?: 1 | 2 | 3
  qualified: boolean
}) {
  const color = qualified ? "#C78B28" : "#A8A6A3"

  if (tier === 1) {
    return (
      <span
        aria-label="Tier 1"
        role="img"
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: color,
          verticalAlign: "middle",
        }}
      />
    )
  }

  if (tier === 2) {
    return (
      <span
        aria-label="Tier 2"
        role="img"
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          backgroundColor: "transparent",
          verticalAlign: "middle",
        }}
      />
    )
  }

  if (tier === 3) {
    return (
      <span
        aria-label="Tier 3"
        role="img"
        style={{
          display: "inline-block",
          width: 3,
          height: 3,
          borderRadius: "50%",
          backgroundColor: color,
          verticalAlign: "middle",
          marginLeft: 1.5,
          marginRight: 1.5,
        }}
      />
    )
  }

  return (
    <span
      aria-label="No tier"
      style={{
        display: "inline-block",
        color: "#857F74",
        fontSize: "0.6875rem",
        verticalAlign: "middle",
      }}
    >
      ·
    </span>
  )
}
