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
    <div className="mx-auto w-full max-w-[1080px] px-10 pt-16 pb-28 md:px-14">
      <header className="mb-10 section-in">
        <div className="flex items-baseline justify-between gap-8">
          <div>
            <p className="eyebrow">Overview</p>
            <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold text-[#FAF8F5] tracking-[-0.025em] leading-[1.05]">
              {client.company}
            </h1>
          </div>
          <p className="eyebrow ledger whitespace-nowrap">
            Day {guarantee.day} of {guarantee.totalDays} · {engagement.phase}
          </p>
        </div>
      </header>

      {/* The focal block — status + the next move, lifted off the atmosphere as
          one crisp, instantly-readable material panel (the balanced priority). */}
      <section
        className="section-in relative overflow-hidden"
        style={{
          border: "1px solid #20242A",
          background:
            "linear-gradient(180deg, rgba(15,18,22,0.72) 0%, rgba(10,12,15,0.60) 100%)",
          padding: "34px 36px 30px",
        }}
      >
        <GuaranteeTracker variant="compact" initialData={{ client, guarantee }} />
        <NextCommitment client={client} />
      </section>

      {/* Everything below flows editorially on the atmosphere — no boxes. */}
      <div className="mt-14">
        <SystemPulse initialData={{ client, guarantee }} />
      </div>

      <div className="mt-14">
        <CommitmentsLedger initialData={{ client, guarantee }} />
      </div>

      <div className="mt-16">
        <BriefingCard initialData={{ client, guarantee }} />
      </div>

      <div className="mt-16">
        <ActivityLog initialData={{ client, guarantee }} />
      </div>
    </div>
  )
}
