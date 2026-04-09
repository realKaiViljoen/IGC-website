import type { ClientData, PipelineStage } from "@/types/client"

const STAGES: PipelineStage[] = [
  "sourced",
  "submitted",
  "interviewing",
  "offer-extended",
  "offer-accepted",
  "placed",
]

const STAGE_LABELS: Record<PipelineStage, string> = {
  sourced: "Sourced",
  submitted: "Submitted",
  interviewing: "Interviewing",
  "offer-extended": "Offer extended",
  "offer-accepted": "Offer accepted",
  placed: "Placed",
}

function StageBar({ currentStage }: { currentStage: PipelineStage }) {
  const currentIndex = STAGES.indexOf(currentStage)
  return (
    <div className="flex gap-1 items-center">
      {STAGES.map((stage, i) => (
        <div
          key={stage}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i < currentIndex
              ? "bg-[#857F74]"
              : i === currentIndex
              ? "bg-[#C9922A]"
              : "bg-[#242220]"
          }`}
        />
      ))}
    </div>
  )
}

interface Props {
  pipeline: ClientData["pipeline"]
}

export function PipelineSection({ pipeline }: Props) {
  if (pipeline.length === 0) return null

  return (
    <div className="mx-8 bg-[#111110] border border-[#242220]">
      <div className="px-5 py-4 border-b border-[#242220]">
        <h2 className="font-playfair text-[#F2EDE4]">Pipeline</h2>
      </div>
      <div className="divide-y divide-[#242220]">
        {pipeline.map((candidate) => (
          <div
            key={candidate.id}
            className="px-5 py-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[#F2EDE4] text-sm">{candidate.name}</p>
              {candidate.note && (
                <p className="text-[#857F74] text-xs mt-0.5">{candidate.note}</p>
              )}
            </div>
            <StageBar currentStage={candidate.stage} />
            <span className="text-[#857F74] text-xs w-28 text-right flex-shrink-0">
              {STAGE_LABELS[candidate.stage]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
