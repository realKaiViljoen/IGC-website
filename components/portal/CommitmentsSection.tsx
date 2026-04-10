"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { fadeUp, stagger } from "@/lib/motion"
import type { ClientData } from "@/types/client"

interface Props {
  commitments: ClientData["commitments"]
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

export function CommitmentsSection({ commitments }: Props) {
  if (commitments.length === 0) return null

  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div className="mx-8 bg-[#111110] border border-[#2D2A27] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)]">
      <div className="px-6 py-5 border-b border-[#2D2A27]">
        <h2 className="font-display text-display-sm font-semibold text-[#F2EDE4]">Our Commitments to You</h2>
      </div>
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="divide-y divide-[#2D2A27]"
      >
        {commitments.map((c, i) => {
          const daysUntilDue = Math.floor((new Date(c.due).getTime() - Date.now()) / 86400000)

          const rowUrgency = !c.met && daysUntilDue < 0
            ? "border-l-2 border-[#B84233]"
            : !c.met && daysUntilDue <= 3
            ? "border-l-2 border-[#CF9B2E]/50"
            : "border-l-2 border-transparent"

          const circleClass = !c.met && daysUntilDue < 0
            ? "text-[#B84233] text-base"
            : "text-[#6E6762] text-base"

          const dueDateEl = c.met ? null : daysUntilDue < 0 ? (
            <p className="text-[#B84233] font-mono tabular-nums text-sm mt-1">{Math.abs(daysUntilDue)}d overdue</p>
          ) : daysUntilDue <= 3 ? (
            <p className="text-[#CF9B2E] font-mono tabular-nums text-sm mt-1">due in {daysUntilDue}d</p>
          ) : (
            <p className="text-sm text-[#857F74] font-mono mt-1">Due {formatDueDate(c.due)}</p>
          )

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`px-6 py-5 flex items-start gap-5 hover:bg-[#15140F] transition-colors duration-200 ${c.met ? "bg-[#13120F]" : ""} ${rowUrgency}`}
            >
              <span
                className={`flex-shrink-0 mt-0.5 ${
                  c.met
                    ? "text-[#CF9B2E] drop-shadow-[0_0_4px_rgba(207,155,46,0.5)] font-bold text-base"
                    : circleClass
                }`}
              >
                {c.met ? "✓" : "○"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-base text-[#F2EDE4]">{c.promise}</p>
                {c.met ? (
                  <p className="text-sm text-[#6E6762] font-mono mt-1">Delivered {formatDueDate(c.due)}</p>
                ) : dueDateEl}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
