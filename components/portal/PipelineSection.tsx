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
    <div className="flex gap-1.5 items-center">
      {STAGES.map((stage, i) => (
        <div key={stage} className="relative flex items-center justify-center">
          {i === currentIndex && (
            <span className="absolute w-3.5 h-3.5 rounded-full bg-[#CF9B2E] animate-ping opacity-40" />
          )}
          <div
            className={`relative w-3.5 h-3.5 rounded-full transition-colors ${
              i < currentIndex
                ? "bg-[#857F74]"
                : i === currentIndex
                ? "bg-[#CF9B2E] shadow-[0_0_6px_2px_rgba(207,155,46,0.5),0_0_12px_4px_rgba(207,155,46,0.2)]"
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
    <div className="mx-8 bg-[#111110] border border-[#242220] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)]">
      <div className="px-6 py-5 border-b border-[#242220]">
        <h2 className="font-playfair text-xl font-semibold text-[#F2EDE4]">Pipeline</h2>
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
            className="px-6 py-5 flex items-center gap-4 hover:bg-[#15140F] transition-colors duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-[#F2EDE4]">{candidate.name}</p>
              {candidate.note && (
                <p className="text-sm text-[#857F74] mt-1">{candidate.note}</p>
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
