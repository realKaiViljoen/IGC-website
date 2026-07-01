import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Outreach — Phase 3 target surface. Editorial empty-state for Phase 2a.
 *
 * The expanded version of the Overview's System Pulse. Daily + weekly
 * cadence detail. Per-mailbox breakdown, reply inbox, roll-up against
 * previous weeks.
 */
export default async function OutreachPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  return (
    <div className="px-8 pt-12 pb-24 max-w-[720px]">
      <header className="mb-10">
        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9C9995]">
          Outreach
        </div>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal text-[#FAF8F5] mt-3 tracking-[-0.015em]">
          The live outreach operation.
        </h1>
      </header>

      <div className="space-y-6 max-w-[52ch]">
        <p className="font-sans text-[15px] leading-[1.7] text-[#C3C0BB]">
          Per-day and per-week outreach cadence. Batches sent, connections accepted, replies surfaced. The expanded version of the Overview&apos;s System Pulse.
        </p>
        <p className="font-sans text-[15px] leading-[1.7] text-[#C3C0BB]">
          Opens in Phase 3. Until then the Overview&apos;s System Pulse reads today&apos;s cadence at a glance, and the Activity Log shows the per-event stream with timestamps.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t border-[#20242A]">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9C9995] mb-5">
          When it ships
        </p>
        <ul className="space-y-3 font-sans text-[14px] leading-[1.6] text-[#7C7A76] max-w-[58ch]">
          <li>Daily cadence chart: sent, connected, replied, booked</li>
          <li>Per-mailbox send breakdown with deliverability context</li>
          <li>Reply inbox with K.C.&apos;s classification of every response</li>
          <li>Weekly roll-up compared against the previous four weeks</li>
        </ul>
      </div>
    </div>
  )
}
