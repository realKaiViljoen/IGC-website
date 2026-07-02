import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import {
  PipelineStageDensity,
  PipelineLedger,
} from "@/components/portal/pipeline"

/**
 * Pipeline · the prospect surface.
 *
 * An institutional trading desk, not a kanban board. Two sections:
 *   01 · Stage density — one tabular row per canonical stage, with the
 *         count and a 20-cell bar that reads like a Bloomberg ladder.
 *         Qualified stages render their count in gold.
 *   02 · Prospect ledger — dense, flat table of every prospect, sorted
 *         stage-asc → last-touch-desc. Click or press Enter to open the
 *         drawer. `/` focuses the filter input. j/k navigates rows. Esc
 *         closes the drawer.
 *
 * Max-width 1200px — wider than the 720px editorial pages because this is
 * a data surface, not prose.
 */
export default async function PipelinePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  const { prospects, engagement } = client
  const { stage_config } = engagement
  const qualifiedIndex = stage_config.qualified_stage_index

  // Header telemetry — "X prospects, Y in guarantee zone"
  const guaranteeZoneCount = prospects.filter(
    (p) => stage_config.stages.indexOf(p.stage) >= qualifiedIndex,
  ).length

  return (
    <div className="mx-auto w-full max-w-[1200px] px-10 pt-16 pb-28 md:px-14">
      <header className="mb-12">
        <div className="flex items-baseline justify-between gap-8 flex-wrap">
          <div>
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9C9995]">
              Pipeline
            </div>
            <h1
              className="font-display text-[clamp(2rem,4vw,3rem)] font-normal text-[#FAF8F5] mt-3 tracking-[-0.015em]"
              style={{
                fontOpticalSizing: "auto",
                fontVariationSettings: '"opsz" 72, "SOFT" 30',
              }}
            >
              The prospect pipeline.
            </h1>
            <p
              className="font-sans mt-4"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.55,
                color: "#C3C0BB",
                maxWidth: "56ch",
                margin: "16px 0 0 0",
              }}
            >
              {prospects.length} prospects live.{" "}
              <span style={{ color: "#FAF8F5" }}>{guaranteeZoneCount}</span>{" "}
              in the guarantee zone. Ordered by stage, then last touch.
            </p>
          </div>
          <div
            className="font-mono tabular-nums whitespace-nowrap"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              color: "#7C7A76",
              textTransform: "uppercase",
            }}
          >
            {stage_config.niche} · {stage_config.stages.length} stages
          </div>
        </div>
      </header>

      {/* 01 · Stage density */}
      <PipelineStageDensity
        prospects={prospects}
        stageConfig={stage_config}
      />

      {/* 02 · Prospect ledger */}
      <div style={{ marginTop: 56 }}>
        <PipelineLedger client={client} />
      </div>
    </div>
  )
}
