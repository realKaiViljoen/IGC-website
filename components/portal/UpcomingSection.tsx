"use client"

import { motion } from "framer-motion"
import { stagger, fadeUp } from "@/lib/motion"

interface UpcomingItem {
  date: string
  description: string
}

interface Props {
  upcoming: UpcomingItem[]
}

function formatRelative(dateStr: string): { label: string; urgent: boolean } {
  const date = new Date(dateStr)
  const now = new Date()
  const days = Math.ceil((date.getTime() - now.getTime()) / 86400000)

  if (days < 0) return { label: `${Math.abs(days)}d ago`, urgent: false }
  if (days === 0) return { label: "Today", urgent: true }
  if (days === 1) return { label: "Tomorrow", urgent: true }
  if (days <= 7) return { label: `In ${days}d`, urgent: false }
  const month = date.toLocaleDateString("en-GB", { month: "short", day: "numeric" })
  return { label: month, urgent: false }
}

export function UpcomingSection({ upcoming }: Props) {
  if (!upcoming || upcoming.length === 0) return null

  const sorted = [...upcoming].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="mx-8">
      <div className="bg-[#111110] border border-[#CF9B2E]/15 rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(242,237,228,0.03),0_1px_3px_0_rgba(0,0,0,0.5),0_4px_12px_0_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1E1C1A] bg-[rgba(242,237,228,0.02)]">
          <h2 className="font-playfair text-xl font-semibold text-[#F2EDE4]">Coming Up</h2>
        </div>

        {/* Items */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {sorted.map((item, i) => {
            const { label, urgent } = formatRelative(item.date)
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="px-6 py-5 flex items-start gap-6 border-b border-[#1A1918] last:border-b-0 hover:bg-[#15140F] transition-colors duration-200"
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-20 pt-0.5">
                  <span className={`text-sm font-mono font-medium ${urgent ? "text-[#CF9B2E]" : "text-[#857F74]"}`}>
                    {label}
                  </span>
                </div>

                {/* Description */}
                <div className="flex-1 flex items-center gap-2">
                  <span className={`w-1 h-1 rounded-full flex-shrink-0 ${urgent ? "bg-[#CF9B2E] shadow-[0_0_4px_rgba(207,155,46,0.6)]" : "bg-[#4A4640]"}`} />
                  <p className="text-sm text-[#F2EDE4]">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
