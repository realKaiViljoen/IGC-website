import type { AnalyticsResult } from "@/types/client"

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
  const lastActivityText =
    analytics.lastActivityDaysAgo === 0
      ? "Today"
      : analytics.lastActivityDaysAgo === 1
      ? "Yesterday"
      : `${analytics.lastActivityDaysAgo} days ago`

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-8 py-6">
      <SignalCard
        label="Active this week"
        value={`${analytics.activeCandidatesThisWeek} candidate${analytics.activeCandidatesThisWeek !== 1 ? "s" : ""}`}
      />
      <SignalCard
        label="Commitments"
        value={`${analytics.commitmentsMetCount} of ${analytics.commitmentsTotalCount} met`}
        sub={
          analytics.commitmentsMetCount === analytics.commitmentsTotalCount
            ? "All on track"
            : undefined
        }
      />
      <SignalCard label="Last activity" value={lastActivityText} />
      <SignalCard
        label="Next update"
        value={`${analytics.daysToNextUpdate} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`}
        sub={`${analytics.effortSignalThisMonth} touchpoints this month`}
      />
    </div>
  )
}
