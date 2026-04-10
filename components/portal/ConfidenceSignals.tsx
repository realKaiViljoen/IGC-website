"use client"

import { useState, useEffect } from "react"
import type { AnalyticsResult } from "@/types/client"
import { useCountUp } from "@/hooks/useCountUp"

function SignalCard({
  label,
  value,
  sub,
  showCursor,
}: {
  label: string
  value: { number: string; unit?: string }
  sub?: string
  showCursor?: boolean
}) {
  return (
    <div className="bg-[#111110] border border-[#2D2A27] rounded-xl px-6 py-6 shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)] hover:bg-[#151413] hover:border-[#2E2B27] transition-all duration-200">
      <p className="text-[#857F74] text-sm font-mono uppercase tracking-wider mb-3">
        {label}
      </p>
      <div className={`flex items-baseline gap-1.5${showCursor ? " terminal-cursor" : ""}`}>
        <span className="text-4xl font-mono font-bold tabular-nums text-[#CF9B2E] [text-shadow:0_0_20px_rgba(207,155,46,0.15)]">
          {value.number}
        </span>
        {value.unit && (
          <span className="text-lg font-mono font-normal text-[#857F74]">
            {value.unit}
          </span>
        )}
      </div>
      {sub && <p className="text-[#6E6762] text-xs mt-2">{sub}</p>}
    </div>
  )
}

interface Props {
  analytics: AnalyticsResult
}

export function ConfidenceSignals({ analytics }: Props) {
  const activeCount = useCountUp(analytics.activeCandidatesThisWeek, 600)
  const metCount = useCountUp(analytics.commitmentsMetCount, 700)
  const totalCount = useCountUp(analytics.commitmentsTotalCount, 500)
  const daysCount = useCountUp(analytics.daysToNextUpdate, 800)
  const effortCount = useCountUp(analytics.effortSignalThisMonth, 900)

  const [secondsAgo, setSecondsAgo] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setSecondsAgo((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const lastActivityText = (() => {
    const d = analytics.lastActivityDaysAgo
    if (d === 0) return "Today"
    if (d === 1) return "Yesterday"
    if (d <= 7) return `${d} days ago`
    const date = new Date()
    date.setDate(date.getDate() - d)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  })()

  const checkedText =
    secondsAgo < 60
      ? `Live · ${secondsAgo}s ago`
      : `Live · ${Math.floor(secondsAgo / 60)}m ago`

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-8 py-8">
      <SignalCard
        label="In play this week"
        value={
          analytics.activeCandidatesThisWeek === 0
            ? { number: "None", unit: "in play" }
            : {
                number: String(activeCount),
                unit: `candidate${analytics.activeCandidatesThisWeek !== 1 ? "s" : ""}`,
              }
        }
        sub={analytics.closestToPlacement ? `${analytics.closestToPlacement.name} — nearest to placement` : undefined}
      />
      <SignalCard
        label="Promises kept"
        value={{
          number: `${metCount} of ${totalCount}`,
          unit: "delivered",
        }}
        sub={
          analytics.commitmentsMetCount === analytics.commitmentsTotalCount
            ? "Every promise kept"
            : undefined
        }
      />
      <SignalCard
        label="Last movement"
        value={{ number: lastActivityText }}
        sub={checkedText}
        showCursor
      />
      <SignalCard
        label="Next briefing"
        value={
          analytics.daysToNextUpdate === 0
            ? { number: "Today" }
            : { number: String(daysCount), unit: `day${analytics.daysToNextUpdate !== 1 ? "s" : ""}` }
        }
        sub={`${effortCount} actions this month`}
      />
    </div>
  )
}
