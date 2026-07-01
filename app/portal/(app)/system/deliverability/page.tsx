import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Deliverability — Phase 3 target surface. Editorial empty-state for Phase 2a.
 *
 * Infrastructure health. Most outreach systems fail silently on
 * deliverability before they fail on strategy. This surface surfaces
 * the silent fails early.
 */
export default async function DeliverabilityPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  return (
    <div className="px-8 pt-12 pb-24 max-w-[720px]">
      <header className="mb-10">
        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#93918E]">
          § Deliverability
        </div>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal text-[#FAF9F7] mt-3 tracking-[-0.015em]">
          Sender reputation, bounce trend, inbox placement.
        </h1>
      </header>

      <div className="space-y-6 max-w-[52ch]">
        <p className="font-sans text-[15px] leading-[1.7] text-[#A8A6A3]">
          The infrastructure health signal. Most outreach systems fail silently on deliverability before they fail on strategy. This surface makes the fail visible early.
        </p>
        <p className="font-sans text-[15px] leading-[1.7] text-[#A8A6A3]">
          Opens in Phase 3. Until then K.C. monitors deliverability manually and notes any flags in the weekly Briefing.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t border-[#262A30]">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#93918E] mb-5">
          When it ships
        </p>
        <ul className="space-y-3 font-sans text-[14px] leading-[1.6] text-[#857F74] max-w-[58ch]">
          <li>Per-mailbox warmup status and current send volume</li>
          <li>28-day bounce-rate trend, tolerance band at 0 to 2 percent</li>
          <li>Inbox placement checks across Mimecast, Proofpoint, Google postmaster</li>
          <li>Spam-complaint and unsubscribe rates, weekly</li>
        </ul>
      </div>
    </div>
  )
}
