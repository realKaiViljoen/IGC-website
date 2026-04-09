"use client"

import { useState, useEffect } from "react"
import type { AnalyticsResult } from "@/types/client"
import { useCountUp } from "@/hooks/useCountUp"

function SignalCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-[#111110] border border-[#242220] rounded-xl px-6 py-6 shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)] hover:bg-[#151413] hover:border-[#2E2B27] transition-all duration-200">
      <p className="text-[#6E6762] text-xs font-mono uppercase tracking-wider mb-3">
        {label}
      </p>
      <p className="text-4xl font-mono font-bold tracking-tight tabular-nums terminal-cursor text-[#F2EDE4] [text-shadow:0_0_20px_rgba(207,155,46,0.08)]">{value}</p>
      {sub && <p className="text-[#857F74] text-sm mt-2">{sub}</p>}
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

  const lastActivityText =
    analytics.lastActivityDaysAgo === 0
      ? "Today"
      : analytics.lastActivityDaysAgo === 1
      ? "Yesterday"
      : `${analytics.lastActivityDaysAgo} days ago`

  const checkedText =
    secondsAgo < 60
      ? `Live · ${secondsAgo}s ago`
      : `Live · ${Math.floor(secondsAgo / 60)}m ago`

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-8 py-8">
      <SignalCard
        label="In play this week"
        value={`${activeCount} candidate${analytics.activeCandidatesThisWeek !== 1 ? "s" : ""}`}
      />
      <SignalCard
        label="Promises kept"
        value={`${metCount} of ${totalCount} delivered`}
        sub={
          analytics.commitmentsMetCount === analytics.commitmentsTotalCount
            ? "All on track"
            : undefined
        }
      />
      <SignalCard
        label="Last movement"
        value={lastActivityText}
        sub={checkedText}
      />
      <SignalCard
        label="Next briefing"
        value={`${daysCount} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`}
        sub={`${effortCount} actions this month`}
      />
    </div>
  )
}
