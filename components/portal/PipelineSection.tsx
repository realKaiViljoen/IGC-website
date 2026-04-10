"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
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

function StageBar({ stage }: { stage: PipelineStage }) {
  const currentIndex = STAGES.indexOf(stage)
  const progressPercent = ((currentIndex + 1) / STAGES.length) * 100

  const isLate = stage === "offer-extended" || stage === "offer-accepted"
  const isPlaced = stage === "placed"

  const fillGradient = isPlaced
    ? "linear-gradient(90deg, #2A5A3A, #3D8B5E)"
    : isLate
    ? "linear-gradient(90deg, #7D5E1C, #CF9B2E)"
    : "linear-gradient(90deg, #2A2825, #6E6762)"

  return (
    <div className="flex-1 h-1.5 bg-[#1A1918] rounded-full overflow-visible relative">
      {/* Fill */}
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${progressPercent}%`, background: fillGradient }}
      />
      {/* Pulsing head */}
      {!isPlaced && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#CF9B2E] shadow-[0_0_6px_2px_rgba(207,155,46,0.5)]"
          style={{ left: `calc(${progressPercent}% - 5px)` }}
        >
          <div className="absolute inset-0 rounded-full bg-[#CF9B2E] animate-pulse opacity-30" />
        </div>
      )}
    </div>
  )
}

interface Props {
  pipeline: ClientData["pipeline"]
}

export function PipelineSection({ pipeline }: Props) {
  if (pipeline.length === 0) return null

  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div className="mx-8 bg-[#111110] border border-[#2D2A27] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)]">
      <div className="px-6 py-5 border-b border-[#2D2A27]">
        <h2 className="font-display text-display-sm font-semibold text-[#F2EDE4]">Your Candidates</h2>
      </div>
      {/* Stage coordinate markers */}
      <div className="px-6 py-2 flex items-center border-b border-[#1A1918]">
        <div className="w-48 flex-shrink-0" />
        <div className="flex-1 flex justify-between">
          {STAGES.map((s) => (
            <span key={s} className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A09890]">
              {STAGE_LABELS[s].slice(0, 3)}
            </span>
          ))}
        </div>
        <div className="w-10 flex-shrink-0" />
      </div>
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="divide-y divide-[#2D2A27]"
      >
        {pipeline.map((candidate) => {
          const daysSince = Math.floor((Date.now() - new Date(candidate.lastUpdate).getTime()) / 86400000)
          const urgencyBorder =
            daysSince >= 8
              ? "border-l-2 border-[#B84233]"
              : daysSince >= 4
              ? "border-l-2 border-[#CF9B2E]/50"
              : "border-l-2 border-transparent"

          return (
            <motion.div
              key={candidate.id}
              variants={fadeUp}
              className={`px-6 py-5 flex items-center gap-4 hover:bg-[#15140F] transition-colors duration-200 ${urgencyBorder}`}
            >
              <div className="w-48 flex-shrink-0 min-w-0">
                <p title={candidate.name} className="text-base font-medium text-[#F2EDE4] truncate">{candidate.name}</p>
                {candidate.note && (
                  <p className="text-sm text-[#857F74] mt-1 truncate">{candidate.note}</p>
                )}
              </div>
              <StageBar stage={candidate.stage} />
              <span className={`text-sm font-mono tabular-nums w-10 text-right flex-shrink-0 ${
                daysSince >= 8 ? "text-[#B84233]" : daysSince >= 4 ? "text-[#CF9B2E]" : "text-[#4A4640]"
              }`}>
                {daysSince}d
              </span>
              <span className="text-[#857F74] text-sm w-32 text-right flex-shrink-0">
                {STAGE_LABELS[candidate.stage]}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
