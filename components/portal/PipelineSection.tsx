"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"
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
        <div key={stage} className="relative flex items-center justify-center">
          {i === currentIndex && (
            <span className="absolute w-2.5 h-2.5 rounded-full bg-[#C9922A] animate-ping opacity-40" />
          )}
          <div
            className={`relative w-2.5 h-2.5 rounded-full transition-colors ${
              i < currentIndex
                ? "bg-[#857F74]"
                : i === currentIndex
                ? "bg-[#C9922A]"
                : "bg-[#242220]"
            }`}
          />
        </div>
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
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="divide-y divide-[#242220]"
      >
        {pipeline.map((candidate) => (
          <motion.div
            key={candidate.id}
            variants={fadeUp}
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
