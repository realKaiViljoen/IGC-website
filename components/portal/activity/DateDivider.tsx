/**
 * DateDivider — full-width hairline with an inline mono label.
 *
 * Used to group activity entries by time bucket:
 *   - "Today"      — same calendar day as now (UTC)
 *   - "Yesterday"  — one calendar day before
 *   - "This week"  — Mon–Sat of the current week before yesterday
 *   - "Earlier"    — before the current week
 *
 * Register: Bloomberg terminal section break. A 1px hairline in border-mute
 * (#20242A) runs edge-to-edge; the label sits inline on the left, spaced off
 * the rule with a small gutter. Geist Mono 11px, uppercase, 0.14em tracking,
 * text-tertiary — same mono eyebrow idiom used in HandoverPack headers.
 *
 * Spacing: 16px above, 8px below. Placed once per date bucket by ActivityLog.
 */
export function DateDivider({ label }: { label: string }) {
  return (
    <div
      role="presentation"
      className="flex items-center"
      style={{ marginTop: 16, marginBottom: 8, gap: 10 }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.14em",
          color: "#9C9995",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        style={{
          flex: 1,
          height: 1,
          backgroundColor: "#20242A",
        }}
      />
    </div>
  )
}
