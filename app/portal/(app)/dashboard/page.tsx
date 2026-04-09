import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import { computeAnalytics } from "@/lib/analytics"
import { DashboardHeader } from "@/components/portal/DashboardHeader"
import { ConfidenceSignals } from "@/components/portal/ConfidenceSignals"
import { PipelineSection } from "@/components/portal/PipelineSection"
import { CommitmentsSection } from "@/components/portal/CommitmentsSection"
import { ActivityFeed } from "@/components/portal/ActivityFeed"
import { UpcomingSection } from "@/components/portal/UpcomingSection"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  if (hour < 21) return "Good evening"
  return "Good night"
}

export default async function DashboardPage() {
  // const session = await auth()
  // if (!session?.user?.id) redirect("/portal")

  const client = await getClientData("igc-demo-001")
  if (!client) redirect("/portal")

  const analytics = computeAnalytics(client)
  const greeting = getGreeting()

  return (
    <div className="pb-12">
      <DashboardHeader client={client} analytics={analytics} greeting={greeting} />
      <ConfidenceSignals analytics={analytics} />
      <div className="space-y-4">
        <PipelineSection pipeline={client.pipeline} />
        <CommitmentsSection commitments={client.commitments} />
        <UpcomingSection upcoming={client.upcoming} />
        <ActivityFeed activity={client.activity} />
      </div>
    </div>
  )
}
