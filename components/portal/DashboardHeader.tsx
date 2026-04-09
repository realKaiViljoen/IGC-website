import type { ClientData, AnalyticsResult } from "@/types/client"
import { UpdateLogBadge } from "./UpdateLogBadge"

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
    <div className="border-b border-[#242220] px-8 py-8 flex items-start justify-between gap-6">
      <div>
        <p className="font-playfair italic text-4xl text-[#F2EDE4] mb-3">
          {greeting}, {client.contactName}.
        </p>
        <h1 className="font-playfair text-xl text-[#F2EDE4] font-semibold">{client.company}</h1>
        <p className="text-[#857F74] text-base mt-1">{client.engagement.title}</p>
        <p className="text-[#6E6762] text-sm font-mono mt-0.5">
          Day {getEngagementDay(client.engagement.startDate)}
        </p>
        {(() => {
          const status = getConsultantStatus()
          return (
            <p className="text-[#6E6762] text-sm mt-1 font-mono flex items-center gap-1.5">
              Consultant: {client.engagement.consultant}
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${status.available ? "bg-[#CF9B2E] animate-glow-pulse" : "bg-[#4A4640]"}`} />
              {status.available ? (
                <span className="text-[#857F74]">Available</span>
              ) : (
                <>
                  <span className="text-[#857F74]">Responds within 4h</span>
                  <span className="text-[#6E6762]"> · within working hours</span>
                </>
              )}
            </p>
          )
        })()}
      </div>
      <div className="text-right flex-shrink-0">
        <UpdateLogBadge
          updateLabel={updateLabel}
          nextUpdate={client.nextUpdate}
          activity={client.activity}
        />
      </div>
    </div>
  )
}
