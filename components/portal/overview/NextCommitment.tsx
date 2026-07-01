import type { ClientData } from "@/types/client"

/**
 * Next commitment — the dated forward move, promoted to sit directly beneath
 * the guarantee on the Overview.
 *
 * Why it lives here: on Days 1-13 the guarantee reads "0 of 5" and the buyer is
 * rawest about the spend. The dead-zone rule (docs/PORTAL_REDESIGN_SPEC.md §1.2)
 * is that the empty number must never appear without a dated forward commitment
 * in the same viewport. This block is that commitment: the soonest unmet promise,
 * in K.C.'s voice, with its due date. Committed future before logged past.
 */

function fmtDue(iso: string): string {
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00Z" : iso)
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
}

export function NextCommitment({ client }: { client: ClientData }) {
  const commitments = client.commitments ?? []
  const open = commitments
    .filter((c) => !c.met && c.author === "kc")
    .sort((a, b) => a.due.localeCompare(b.due))

  const next = open[0]
  // Fall back to the next briefing if there is no open commitment, so the
  // block is never empty — a quiet screen must still name its next event.
  const nextBriefing = client.next_briefing

  if (!next && !nextBriefing) return null

  const now = Date.now()
  const overdue = next ? new Date(next.due + "T00:00:00Z").getTime() < now : false

  return (
    <section aria-labelledby="next-commitment-eyebrow" className="section-in" style={{ marginTop: 28, maxWidth: 720 }}>
      <p id="next-commitment-eyebrow" className="eyebrow">Next from K.C.</p>
      {next ? (
        <div className="mt-4 flex items-start justify-between gap-8">
          <p className="kc-voice text-[15px] leading-[1.55] max-w-[52ch]">{next.promise}</p>
          <p className={`ledger text-[12px] whitespace-nowrap pt-0.5 ${overdue ? "text-[#DE9C31]" : "text-[#9C9995]"}`}>
            {overdue ? "Overdue" : "Due"} {fmtDue(next.due)}
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-[15px] leading-[1.55] text-[#C3C0BB] max-w-[52ch]">{nextBriefing!.description}</p>
          <p className="ledger text-[12px] text-[#9C9995] mt-1.5">Expected {fmtDue(nextBriefing!.date)}</p>
        </div>
      )}
    </section>
  )
}
