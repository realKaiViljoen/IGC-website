"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"
import type { ClientData } from "@/types/client"

interface Props {
  commitments: ClientData["commitments"]
}

export function CommitmentsSection({ commitments }: Props) {
  if (commitments.length === 0) return null

  return (
    <div className="mx-8 bg-[#111110] border border-[#242220] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)]">
      <div className="px-6 py-5 border-b border-[#242220]">
        <h2 className="font-playfair text-xl font-semibold text-[#F2EDE4]">Commitments</h2>
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="divide-y divide-[#242220]"
      >
        {commitments.map((c, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className={`px-6 py-5 flex items-start gap-5${c.met ? " bg-[#13120F]" : ""}`}
          >
            <span
              className={`flex-shrink-0 mt-0.5 ${
                c.met
                  ? "text-[#CF9B2E] drop-shadow-[0_0_4px_rgba(207,155,46,0.5)] font-bold text-base"
                  : "text-[#4A4640] text-base"
              }`}
            >
              {c.met ? "✓" : "○"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-base text-[#F2EDE4]">{c.promise}</p>
              <p className="text-sm text-[#857F74] mt-1">Due {c.due}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
