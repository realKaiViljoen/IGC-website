import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientDataWithGuarantee } from "@/lib/data"
import { GuaranteeTracker } from "@/components/portal/guarantee"
import { HandoverPack } from "@/components/portal/handover"
import { CommitmentsLedger } from "@/components/portal/commitments"
import { BriefingCard } from "@/components/portal/briefing"
import { SystemPulse } from "@/components/portal/pulse"
import { ActivityLog } from "@/components/portal/activity"

/**
 * Overview — the surface the client opens to verify the engagement is real.
 *
 * Composition doctrine (Phase 1):
 *   1. A minimal page-level header — section label, company name, day counter.
 *   2. The GuaranteeTracker (compact) — the single most important number.
 *   3. Nothing else. The cleared surface is the point.
 *
 * Any addition here reprices the signal. Phase 2 intentionally adds what
 * earns its place; until then, restraint IS the feature.
 */
export default async function OverviewPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const data = await getClientDataWithGuarantee(session.user.id)
  if (!data) redirect("/portal")

  const { client, guarantee } = data
  const { engagement } = client

  return (
    <div className="px-8 pt-12 pb-24">
      <header className="mb-12">
        <div className="flex items-baseline justify-between gap-8">
          <div>
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#857F74]">
              § Overview
            </div>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal text-[#FAF9F7] mt-2 tracking-[-0.015em]">
              {client.company}
            </h1>
          </div>
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#857F74] tabular-nums whitespace-nowrap">
            Day {guarantee.day} of {guarantee.totalDays} · {engagement.phase}
          </div>
        </div>
      </header>

      {/* System Pulse · single mono line between header and tracker. Its own hairlines. */}
      <SystemPulse initialData={{ client, guarantee }} />

      <GuaranteeTracker variant="compact" initialData={{ client, guarantee }} />

      {/* § 02 · Handover Pack */}
      <div style={{ marginTop: 56 }}>
        <HandoverPack initialData={{ client, guarantee }} />
      </div>

      {/* § 03 · Commitments */}
      <div style={{ marginTop: 56 }}>
        <CommitmentsLedger initialData={{ client, guarantee }} />
      </div>

      {/* § 04 · Weekly Briefing */}
      <div style={{ marginTop: 56 }}>
        <BriefingCard initialData={{ client, guarantee }} />
      </div>

      {/* § 05 · Activity Log — receipts spine, tail-follow, actor-distinct typography. */}
      <div style={{ marginTop: 56 }}>
        <ActivityLog initialData={{ client, guarantee }} />
      </div>
    </div>
  )
}
