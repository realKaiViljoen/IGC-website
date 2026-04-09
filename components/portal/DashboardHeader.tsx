import type { ClientData, AnalyticsResult } from "@/types/client"

function getEngagementDay(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  return Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
}

function getConsultantStatus(): { available: boolean; label: string } {
  const now = new Date()
  const sast = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const day = sast.getUTCDay()
  const hour = sast.getUTCHours()
  const isWeekday = day >= 1 && day <= 5
  const isBusinessHours = hour >= 8 && hour < 18
  return {
    available: isWeekday && isBusinessHours,
    label: isWeekday && isBusinessHours ? "Available" : "Responds within 4h",
  }
}

interface Props {
  client: ClientData
  analytics: AnalyticsResult
  greeting: string
}

export function DashboardHeader({ client, analytics, greeting }: Props) {
  const updateLabel =
    analytics.daysToNextUpdate === 0
      ? "Today"
      : `${analytics.daysToNextUpdate} day${analytics.daysToNextUpdate !== 1 ? "s" : ""}`

  return (
    <div className="border-b border-[#242220] px-8 py-6 flex items-start justify-between gap-6">
      <div>
        <p className="font-playfair italic text-3xl text-[#F2EDE4] mb-3">
          {greeting}, {client.contactName}.
        </p>
        <h1 className="font-playfair text-lg text-[#857F74]">{client.company}</h1>
        <p className="text-[#857F74] text-sm mt-1">{client.engagement.title}</p>
        <p className="text-[#4A4640] text-xs font-mono mt-0.5">
          Day {getEngagementDay(client.engagement.startDate)}
        </p>
        {(() => {
          const status = getConsultantStatus()
          return (
            <p className="text-[#4A4640] text-xs mt-1 font-mono flex items-center gap-1.5">
              Consultant: {client.engagement.consultant}
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${status.available ? "bg-[#C9922A]" : "bg-[#4A4640]"}`} />
              <span className={status.available ? "text-[#857F74]" : "text-[#4A4640]"}>
                {status.label}
              </span>
            </p>
          )
        })()}
      </div>
      <div className="text-right flex-shrink-0">
        <div className="inline-flex items-center gap-2 border border-[#242220] bg-[#111110] px-3 py-2">
          <span className="w-1.5 h-1.5 bg-[#C9922A] rounded-full animate-pulse" />
          <span className="text-[#F2EDE4] text-xs">
            Next update in {updateLabel}
          </span>
        </div>
        <p className="text-[#4A4640] text-xs mt-1.5">{client.nextUpdate.description}</p>
      </div>
    </div>
  )
}
