"use client"

import { motion } from "framer-motion"
import type { ClientData, MessageReference, PipelineStage } from "@/types/client"

const STAGE_LABELS: Record<PipelineStage, string> = {
  sourced: "Sourced",
  submitted: "Submitted",
  interviewing: "Interviewing",
  "offer-extended": "Offer extended",
  "offer-accepted": "Offer accepted",
  placed: "Placed",
}

interface Props {
  client: ClientData
  onSelect: (ref: MessageReference) => void
  onClose: () => void
}

export function ReferencePicker({ client, onSelect, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 right-0 mb-1 bg-[#111110] border border-[#2D2A27] max-h-72 overflow-y-auto z-10"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D2A27] sticky top-0 bg-[#111110]">
        <span className="text-[#4A4640] text-xs font-mono uppercase tracking-wider">
          Reference a dashboard item
        </span>
        <button
          onClick={onClose}
          className="text-[#4A4640] hover:text-[#F2EDE4] text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {client.pipeline.length > 0 && (
        <div className="px-4 py-3">
          <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
            Pipeline
          </p>
          {client.pipeline.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                onSelect({
                  type: "pipeline",
                  label: c.name,
                  detail: STAGE_LABELS[c.stage],
                  id: c.id,
                })
              }
              className="w-full text-left px-3 py-2 hover:bg-[#1A1918] transition-colors flex items-center justify-between"
            >
              <span className="text-[#F2EDE4] text-sm">{c.name}</span>
              <span className="text-[#857F74] text-xs">{STAGE_LABELS[c.stage]}</span>
            </button>
          ))}
        </div>
      )}

      {client.commitments.length > 0 && (
        <div className="px-4 py-3 border-t border-[#2D2A27]">
          <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
            Commitments
          </p>
          {client.commitments.map((c, i) => (
            <button
              key={i}
              onClick={() =>
                onSelect({
                  type: "commitment",
                  label: c.promise,
                  detail: c.met ? "Met" : "Pending",
                  id: `commitment-${i}`,
                })
              }
              className="w-full text-left px-3 py-2 hover:bg-[#1A1918] transition-colors flex items-center justify-between gap-4"
            >
              <span className="text-[#F2EDE4] text-sm truncate">{c.promise}</span>
              <span
                className={`text-xs flex-shrink-0 ${
                  c.met ? "text-[#CF9B2E]" : "text-[#857F74]"
                }`}
              >
                {c.met ? "Met" : "Pending"}
              </span>
            </button>
          ))}
        </div>
      )}

      {client.activity.length > 0 && (
        <div className="px-4 py-3 border-t border-[#2D2A27]">
          <p className="text-[#4A4640] text-xs font-mono uppercase tracking-wider mb-2">
            Recent Activity
          </p>
          {client.activity.slice(0, 5).map((a, i) => (
            <button
              key={i}
              onClick={() =>
                onSelect({
                  type: "activity",
                  label: a.entry,
                  detail: a.date,
                  id: `activity-${i}`,
                })
              }
              className="w-full text-left px-3 py-2 hover:bg-[#1A1918] transition-colors"
            >
              <span className="text-[#F2EDE4] text-sm block">{a.entry}</span>
              <span className="text-[#4A4640] text-xs">{a.date}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
