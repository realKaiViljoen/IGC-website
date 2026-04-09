import type { ClientData, AnalyticsResult } from "@/types/client"

interface Props {
  client: ClientData
  analytics: AnalyticsResult
}

export function DashboardHeader({ client, analytics }: Props) {
  const updateLabel =
    analytics.daysToNextUpdate === 0
      ? "Today"
      : `${analytics.daysToNextUpdate} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`

  return (
    <div className="border-b border-[#242220] px-8 py-6 flex items-start justify-between gap-6">
      <div>
        <h1 className="font-playfair text-2xl text-[#F2EDE4]">{client.company}</h1>
        <p className="text-[#857F74] text-sm mt-1">{client.engagement.title}</p>
        <p className="text-[#4A4640] text-xs mt-1 font-mono">
          Consultant: {client.engagement.consultant}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="inline-flex items-center gap-2 border border-[#242220] bg-[#111110] px-3 py-2">
          <span className="w-1.5 h-1.5 bg-[#C9922A] rounded-full" />
          <span className="text-[#F2EDE4] text-xs">
            Next update in {updateLabel}
          </span>
        </div>
        <p className="text-[#4A4640] text-xs mt-1.5">{client.nextUpdate.description}</p>
      </div>
    </div>
  )
}
