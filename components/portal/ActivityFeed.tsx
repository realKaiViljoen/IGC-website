"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/motion"
import type { ClientData } from "@/types/client"

interface Props {
  activity: ClientData["activity"]
}

export function ActivityFeed({ activity }: Props) {
  if (activity.length === 0) return null

  const sorted = [...activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="mx-8 bg-[#111110] border border-[#242220]">
      <div className="px-5 py-4 border-b border-[#242220]">
        <h2 className="font-playfair text-[#F2EDE4]">Activity</h2>
      </div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="divide-y divide-[#242220]"
      >
        {sorted.map((item, i) => (
          <motion.div key={i} variants={fadeUp} className="px-5 py-4 flex items-start gap-5">
            <span className="text-[#4A4640] font-mono text-xs flex-shrink-0 mt-0.5 w-20">
              {item.date}
            </span>
            <p className="text-[#F2EDE4] text-sm">{item.entry}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
