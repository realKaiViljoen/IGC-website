import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import { computeAnalytics } from "@/lib/analytics"
import { DashboardHeader } from "@/components/portal/DashboardHeader"
import { ConfidenceSignals } from "@/components/portal/ConfidenceSignals"
import { PipelineSection } from "@/components/portal/PipelineSection"
import { CommitmentsSection } from "@/components/portal/CommitmentsSection"
import { ActivityFeed } from "@/components/portal/ActivityFeed"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  const analytics = computeAnalytics(client)

  return (
    <div className="pb-12">
      <DashboardHeader client={client} analytics={analytics} />
      <ConfidenceSignals analytics={analytics} />
      <div className="space-y-4">
        <PipelineSection pipeline={client.pipeline} />
        <CommitmentsSection commitments={client.commitments} />
        <ActivityFeed activity={client.activity} />
      </div>
    </div>
  )
}
