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
    <div className="mx-8 bg-[#111110] border border-[#242220]">
      <div className="px-5 py-4 border-b border-[#242220]">
        <h2 className="font-playfair text-[#F2EDE4]">Commitments</h2>
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="divide-y divide-[#242220]"
      >
        {commitments.map((c, i) => (
          <motion.div key={i} variants={fadeUp} className="px-5 py-4 flex items-start gap-4">
            <span
              className={`text-sm flex-shrink-0 mt-0.5 ${
                c.met ? "text-[#C9922A]" : "text-[#4A4640]"
              }`}
            >
              {c.met ? "✓" : "○"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[#F2EDE4] text-sm">{c.promise}</p>
              <p className="text-[#857F74] text-xs mt-0.5">Due {c.due}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
