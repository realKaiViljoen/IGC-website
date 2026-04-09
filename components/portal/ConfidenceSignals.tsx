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
    <div className="bg-[#111110] border border-[#242220] px-5 py-4">
      <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="font-playfair text-xl text-[#F2EDE4]">{value}</p>
      {sub && <p className="text-[#857F74] text-xs mt-1">{sub}</p>}
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
      ? `Checked ${secondsAgo}s ago`
      : `Checked ${Math.floor(secondsAgo / 60)}m ago`

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-8 py-6">
      <SignalCard
        label="Active this week"
        value={`${activeCount} candidate${analytics.activeCandidatesThisWeek !== 1 ? "s" : ""}`}
      />
      <SignalCard
        label="Commitments"
        value={`${metCount} of ${totalCount} met`}
        sub={
          analytics.commitmentsMetCount === analytics.commitmentsTotalCount
            ? "All on track"
            : undefined
        }
      />
      <SignalCard
        label="Last activity"
        value={lastActivityText}
        sub={checkedText}
      />
      <SignalCard
        label="Next update"
        value={`${daysCount} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`}
        sub={`${effortCount} touchpoints this month`}
      />
    </div>
  )
}
