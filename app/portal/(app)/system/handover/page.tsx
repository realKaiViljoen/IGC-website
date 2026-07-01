import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import { HandoverShelf } from "@/components/portal/handover-shelf"
import type { HandoverItem, HandoverItemKey } from "@/types/client"

/**
 * Handover — full asset shelf.
 *
 * The per-item detail surface behind the Overview's Handover Pack. Six rows,
 * one per deliverable, with drawer-level detail: artifact URLs, transfer
 * state, shipped / transferred timestamps, K.C.'s walkthrough notes.
 *
 * Register: private-bank deliverables ledger. Editorial restraint. Generous
 * row spacing (56–72px). Gold reserved for OWNED / transferred state only.
 *
 * Data flow: server component loads the client record and seeds the client
 * shelf, which manages drawer + keyboard state.
 */

// Canonical row order — mirrors the compact HandoverPack.
const ROW_ORDER: HandoverItemKey[] = [
  "outreach-sequences",
  "crm-config",
  "copy-library",
  "prospect-list",
  "landing-page",
  "sops-attestation",
]

function humanize(key: HandoverItemKey): string {
  switch (key) {
    case "outreach-sequences":
      return "Outreach sequences"
    case "crm-config":
      return "CRM configuration"
    case "copy-library":
      return "Copy library"
    case "prospect-list":
      return "Prospect list"
    case "landing-page":
      return "Landing page"
    case "sops-attestation":
      return "SOPs and attestation"
  }
}

export default async function HandoverPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  // Order rows by canonical key; fall back to declarative placeholder.
  const byKey = new Map<HandoverItemKey, HandoverItem>()
  for (const it of client.handover) byKey.set(it.key, it)
  const orderedItems: HandoverItem[] = ROW_ORDER.map((key) => {
    const it = byKey.get(key)
    return it ?? { key, name: humanize(key), state: "not-started" as const }
  })

  const shippedCount = orderedItems.filter(
    (it) => it.state === "shipped" || it.state === "transferred",
  ).length

  return (
    <div className="px-8 pt-12 pb-24 max-w-[960px]">
      <header className="mb-10">
        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#7C7A76]">
          Handover
        </div>
        <h1
          className="font-display text-[clamp(2rem,4vw,3rem)] font-normal text-[#FAF8F5] mt-3"
          style={{
            letterSpacing: "-0.015em",
            fontOpticalSizing: "auto",
            fontVariationSettings: '"opsz" 72, "SOFT" 30',
          }}
        >
          Your asset shelf.
        </h1>
        <p
          className="font-sans mt-4 text-[#C3C0BB]"
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            maxWidth: "52ch",
          }}
        >
          {shippedCount} of {orderedItems.length} shipped. By Day 30, every row
          is either shipped or transferred to your ownership.
        </p>
      </header>

      <HandoverShelf items={orderedItems} />
    </div>
  )
}
