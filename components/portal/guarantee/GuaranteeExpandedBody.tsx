import type { ClientData, GuaranteeData } from "@/types/client"
import { ConversationList } from "./ConversationList"
import { HypothesisThread } from "./HypothesisThread"
import { EngagementTimeline } from "./EngagementTimeline"

/**
 * Composition wrapper for the expanded variant's Rows 5–7.
 *
 * - Row 5: ConversationList
 * - Row 6: HypothesisThread
 * - Row 7: EngagementTimeline
 *
 * 48px vertical gap between sections. No card. No container. Max-width 1024px
 * (set at the parent `<GuaranteeTracker>` wrapper).
 */
export function GuaranteeExpandedBody({
  client,
  guarantee,
}: {
  client: ClientData
  guarantee: GuaranteeData
}) {
  return (
    <div className="flex flex-col" style={{ gap: 48, marginTop: 48 }}>
      <ConversationList guarantee={guarantee} />
      <HypothesisThread entries={client.hypothesis_thread} />
      <EngagementTimeline guarantee={guarantee} startDate={client.engagement.startDate} />
    </div>
  )
}
