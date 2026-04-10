"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerFast } from "@/lib/motion"
import type { ClientData } from "@/types/client"

interface Props {
  activity: ClientData["activity"]
}

function formatActivityDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000)

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days <= 7) return `${days} days ago`
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

export function ActivityFeed({ activity }: Props) {
  if (activity.length === 0) return null

  const sorted = [...activity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="mx-8 bg-[#111110] border border-[#2D2A27] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)]">
      <div className="px-6 py-5 border-b border-[#2D2A27]">
        <h2 className="font-playfair text-xl font-semibold text-[#F2EDE4]">Operations Log</h2>
      </div>
      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="divide-y divide-[#2D2A27]"
      >
        {sorted.map((item, i) => (
          <motion.div key={i} variants={fadeUp} className="px-6 py-5 flex items-start gap-6 hover:bg-[#15140F] transition-colors duration-200">
            <span className="text-sm text-[#857F74] font-mono flex-shrink-0 mt-0.5 w-24">
              {formatActivityDate(item.date)}
            </span>
            <p className={`text-base text-[#F2EDE4]${i === 0 ? " terminal-cursor" : ""}`}>{item.entry}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
