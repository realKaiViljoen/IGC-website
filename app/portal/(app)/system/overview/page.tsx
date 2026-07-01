import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientDataWithGuarantee } from "@/lib/data"
import { GuaranteeTracker } from "@/components/portal/guarantee"
import { CommitmentsLedger } from "@/components/portal/commitments"
import { BriefingCard } from "@/components/portal/briefing"
import { SystemPulse } from "@/components/portal/pulse"
import { ActivityLog } from "@/components/portal/activity"
import { NextCommitment } from "@/components/portal/overview/NextCommitment"

/**
 * Overview — the daily-touch home the client opens to answer, in one glance:
 * "is my promise on track, and is someone working for me today?"
 *
 * Composition doctrine (docs/PORTAL_REDESIGN_SPEC.md §1.3): committed future
 * before logged past.
 *   1. Header — company + day counter.
 *   2. Guarantee (compact) — the single most important number, the hero.
 *   3. Next commitment — the dated forward move, so the pre-outreach "0 of 5"
 *      dead-zone never appears without a dated commitment beside it.
 *   4. System Pulse — today's cadence (or an honest empty/pre-outreach state).
 *   5. Commitments ledger — the fuller forward/settled record.
 *   6. Weekly Briefing — the one place K.C.'s face appears; the return anchor.
 *   7. Activity — the receipts spine.
 * The Handover Pack is deliberately NOT here: a Day-3 "0 of 6 shipped" under an
 * empty guarantee reads as total emptiness. It lives on the Handover screen.
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
      <header className="mb-12 section-in">
        <div className="flex items-baseline justify-between gap-8">
          <div>
            <p className="eyebrow">Overview</p>
            <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#FAF8F5] mt-2.5 tracking-[-0.02em] leading-[1.1]">
              {client.company}
            </h1>
          </div>
          <p className="eyebrow ledger whitespace-nowrap">
            Day {guarantee.day} of {guarantee.totalDays} · {engagement.phase}
          </p>
        </div>
      </header>

      {/* 01 · Guarantee — the hero number */}
      <GuaranteeTracker variant="compact" initialData={{ client, guarantee }} />

      {/* Next commitment — the dated forward move (dead-zone rule) */}
      <NextCommitment client={client} />

      {/* System Pulse — today's cadence, honest empty/pre-outreach states */}
      <div style={{ marginTop: 44 }}>
        <SystemPulse initialData={{ client, guarantee }} />
      </div>

      {/* Commitments — the fuller forward/settled ledger */}
      <div style={{ marginTop: 44 }}>
        <CommitmentsLedger initialData={{ client, guarantee }} />
      </div>

      {/* Weekly Briefing — the return anchor, K.C.'s voice */}
      <div style={{ marginTop: 56 }}>
        <BriefingCard initialData={{ client, guarantee }} />
      </div>

      {/* Activity — receipts spine, actor-distinct typography */}
      <div style={{ marginTop: 56 }}>
        <ActivityLog initialData={{ client, guarantee }} />
      </div>
    </div>
  )
}
