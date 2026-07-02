import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import { BriefingsArchive } from "@/components/portal/briefings-archive"

/**
 * Briefings — the full surface. An operator's logbook, reverse-chronological.
 *
 * Composition doctrine:
 *   1. Narrow max-width (760px) — this is a read surface, not a dashboard.
 *   2. Eyebrow + Fraunces H1 + Geist subtitle; the entry count is load-bearing.
 *   3. BriefingsArchive — each entry is a vertical stack (week anchor, Loom
 *      row, written summary, authored byline) separated by hairline dividers.
 *      The written summary is the body of the page.
 *   4. Export affordance + keyboard hint at the foot.
 *
 * Gold is used in exactly one place on this page: the LATEST chip next to the
 * most recent entry's Week anchor. Everything else is warm-dark + paper.
 */
export default async function BriefingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  const count = client.briefings.length

  return (
    <div className="mx-auto w-full max-w-[820px] px-10 pt-16 pb-28 md:px-14">
      <header className="mb-10">
        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9C9995]">
          Briefings
        </div>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal text-[#FAF8F5] mt-3 tracking-[-0.015em]">
          The operator log.
        </h1>
        <p
          className="font-sans mt-5"
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "#C3C0BB",
            margin: "20px 0 0",
            maxWidth: "58ch",
          }}
        >
          {count === 0
            ? "No entries yet. The first Loom and written summary ship end of Week 1."
            : `${count} weekly ${count === 1 ? "entry" : "entries"}, authored by K.C. Every Thursday during the build month.`}
        </p>
      </header>

      {/* Top hairline before the stream */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: "#20242A", width: "100%" }}
      />

      <BriefingsArchive
        briefings={client.briefings}
        startDate={client.engagement.startDate}
      />
    </div>
  )
}
