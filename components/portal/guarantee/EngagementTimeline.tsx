import type { GuaranteeData } from "@/types/client"

/**
 * Row 7 · Engagement timeline (expanded variant only).
 *
 * Horizontal Days 1–30 ruler with dots at each counted conversation.
 *
 * Visual grammar (brief 5 · Row 7):
 *  - 1px baseline `#20242A`, full-width.
 *  - 30 tick marks evenly distributed. Every 5th labeled below (5, 10, 15, 20, 25, 30).
 *  - Day 1 and the current day get slightly longer ticks.
 *  - Phase boundaries (1 / 14 / 30) get subtly-longer ticks + label above:
 *    Build (1–13), Launch (14–30), Operate (post-30, only when relevant).
 *  - Current-day marker: vertical 1px `#7C7A76`, 12px tall, `Day N` label below.
 *  - Conversation dots: 6px circle `#FAF8F5` at held_at column. Multiple same-day dots stack vertically above baseline with 8px offset.
 *  - Met dot: the conversation that tipped count to 5 renders 6px gold `#C78B28` with 1px ring.
 *    Exactly one gold dot per ruler.
 *  - Unpaid-extension: ruler continues past Day 30 as 1px dashed line to the current day, labeled `Extension` above.
 *  - No animation, no fill, no gradient.
 *
 * Implementation:
 *  - Ruler is a CSS-positioned strip. No SVG (no need — 30 ticks + a handful of dots).
 *  - Width uses percentage positioning: day N → `left: ((N - 1) / (rulerDays - 1)) * 100%`.
 *  - When state === unpaid-extension, rulerDays expands past 30 to include extension days
 *    so proportions stay honest.
 */

const RULER_HEIGHT = 80 // Total vertical budget: labels above + baseline + dots + labels below.
const BASELINE_TOP = 36 // y-position of the 1px baseline within RULER_HEIGHT.
const DOT_SIZE = 6
const TICK_HEIGHT_DEFAULT = 4
const TICK_HEIGHT_ACCENT = 8
const TICK_HEIGHT_PHASE = 10

const PHASE_END_BUILD = 13 // Build: Days 1–13 inclusive.
const PHASE_END_LAUNCH = 30 // Launch: Days 14–30 inclusive.

function dayFromHeldAt(heldAt: string, startDate: string): number {
  const start = new Date(startDate + "T00:00:00Z").getTime()
  const held = new Date(heldAt + "T00:00:00Z").getTime()
  return Math.floor((held - start) / 86400000) + 1
}

export function EngagementTimeline({
  guarantee,
  startDate,
}: {
  guarantee: GuaranteeData
  startDate: string
}) {
  const { state, day, totalDays, conversations, total } = guarantee

  // Ruler span. Default = totalDays. Extension pushes ruler right to current day.
  const rulerDays = state === "unpaid-extension" ? Math.max(totalDays, day) : totalDays
  const denom = rulerDays - 1 || 1
  const pctForDay = (n: number) => Math.max(0, Math.min(100, ((n - 1) / denom) * 100))

  // Position of Day 30 when ruler extends beyond (for the extension segment).
  const day30Pct = pctForDay(PHASE_END_LAUNCH)
  const showExtension = state === "unpaid-extension" && day > PHASE_END_LAUNCH

  // Cap the current-day marker to rulerDays (don't let it overshoot past right edge).
  const currentDayForMarker = Math.max(1, Math.min(day, rulerDays))
  const currentDayPct = pctForDay(currentDayForMarker)

  // Group conversations by day so stacked dots align predictably.
  const byDay = new Map<number, number>() // day → count
  const conversationDays: Array<{ day: number; stackIndex: number; id: string; isGold: boolean }> =
    []
  conversations.forEach((c, idx) => {
    const d = dayFromHeldAt(c.held_at, startDate)
    const stackIndex = byDay.get(d) ?? 0
    byDay.set(d, stackIndex + 1)
    conversationDays.push({
      day: d,
      stackIndex,
      id: c.id,
      // The conversation that tipped count to 5 (index === total - 1) gets gold —
      // only when state === met or archive.
      isGold:
        (state === "met" || state === "archive") && idx === total - 1,
    })
  })

  // Tick marks at every day 1..totalDays plus extension days when present.
  // Phase boundaries per brief 5 Row 7: Day 1 (Build starts), Day 13 (Build→Launch),
  // Day 30 (Launch→Operate).
  const ticks: Array<{ day: number; height: number; label?: string }> = []
  for (let d = 1; d <= totalDays; d += 1) {
    const isPhaseBoundary = d === 1 || d === PHASE_END_BUILD || d === PHASE_END_LAUNCH
    const isDecadal = d % 5 === 0
    let height = TICK_HEIGHT_DEFAULT
    if (isPhaseBoundary) height = TICK_HEIGHT_PHASE
    else if (isDecadal) height = TICK_HEIGHT_ACCENT
    ticks.push({
      day: d,
      height,
      label: isDecadal ? String(d) : undefined,
    })
  }

  return (
    <section aria-labelledby="guarantee-timeline-eyebrow" className="flex flex-col">
      <h3
        id="guarantee-timeline-eyebrow"
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#7C7A76",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
          marginBottom: 24,
        }}
      >
        03 · Engagement timeline
      </h3>

      <div
        role="img"
        aria-label={`Day ${day} of ${totalDays}, ${conversations.length} conversation${
          conversations.length === 1 ? "" : "s"
        } booked.`}
        className="relative w-full"
        style={{ height: RULER_HEIGHT }}
      >
        {/* Phase bands — labels centered above each phase span. */}
        <span
          className="absolute font-mono uppercase"
          style={{
            left: `${(pctForDay(1) + pctForDay(PHASE_END_BUILD)) / 2}%`,
            top: 0,
            transform: "translateX(-50%)",
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#9C9995",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Build
        </span>
        <span
          className="absolute font-mono uppercase"
          style={{
            left: `${(pctForDay(PHASE_END_BUILD + 1) + pctForDay(PHASE_END_LAUNCH)) / 2}%`,
            top: 0,
            transform: "translateX(-50%)",
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            color: "#9C9995",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Launch
        </span>
        {showExtension && (
          <span
            className="absolute font-mono uppercase"
            style={{
              left: `${(day30Pct + 100) / 2}%`,
              top: 0,
              transform: "translateX(-50%)",
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              color: "#9C9995",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Extension
          </span>
        )}

        {/* Baseline: solid segment Days 1–30 */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            left: `${pctForDay(1)}%`,
            width: `${day30Pct - pctForDay(1)}%`,
            top: BASELINE_TOP,
            height: 1,
            backgroundColor: "#20242A",
          }}
        />

        {/* Baseline extension: dashed segment past Day 30 (unpaid-extension only) */}
        {showExtension && (
          <div
            aria-hidden="true"
            className="absolute"
            style={{
              left: `${day30Pct}%`,
              width: `${100 - day30Pct}%`,
              top: BASELINE_TOP,
              height: 0,
              borderTop: "1px dashed #20242A",
            }}
          />
        )}

        {/* Ticks */}
        {ticks.map((t) => (
          <div key={`tick-${t.day}`} aria-hidden="true">
            <div
              className="absolute"
              style={{
                left: `${pctForDay(t.day)}%`,
                top: BASELINE_TOP,
                height: t.height,
                width: 1,
                backgroundColor: "#20242A",
                transform: "translateX(-0.5px)",
              }}
            />
            {t.label && (
              <span
                className="absolute font-mono"
                style={{
                  left: `${pctForDay(t.day)}%`,
                  top: BASELINE_TOP + t.height + 6,
                  transform: "translateX(-50%)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  color: "#9C9995",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {t.label}
              </span>
            )}
          </div>
        ))}

        {/* Conversation dots — stacked upward from baseline when multiple share a day */}
        {conversationDays.map((d, i) => (
          <div
            key={`dot-${d.id}-${i}`}
            aria-hidden="true"
            className="absolute"
            style={{
              left: `${pctForDay(d.day)}%`,
              // Dot centered on baseline; stack offsets rise upward 8px each.
              top: BASELINE_TOP - DOT_SIZE / 2 - d.stackIndex * 8,
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: "50%",
              backgroundColor: d.isGold ? "#C78B28" : "#FAF8F5",
              boxShadow: d.isGold ? "0 0 0 1px #C78B28" : "none",
              transform: "translateX(-50%)",
            }}
          />
        ))}

        {/* Current-day marker */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            left: `${currentDayPct}%`,
            top: BASELINE_TOP - 6,
            height: 12,
            width: 1,
            backgroundColor: "#7C7A76",
            transform: "translateX(-0.5px)",
          }}
        />
        <span
          className="absolute font-mono uppercase"
          style={{
            left: `${currentDayPct}%`,
            top: BASELINE_TOP + 20,
            transform: "translateX(-50%)",
            fontSize: "0.6875rem",
            letterSpacing: "0.1em",
            color: "#7C7A76",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          Day {day}
        </span>
      </div>
    </section>
  )
}
