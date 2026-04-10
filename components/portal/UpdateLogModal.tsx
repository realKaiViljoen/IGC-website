"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ActivityEntry {
  date: string
  entry: string
}

interface NextUpdate {
  date: string
  description: string
}

interface Props {
  open: boolean
  onClose: () => void
  nextUpdate: NextUpdate
  activity: ActivityEntry[]
}

export function UpdateLogModal({ open, onClose, nextUpdate, activity }: Props) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  const recent = [...activity]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  const updateDate = new Date(nextUpdate.date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal positioner */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              className="bg-[#111110] border border-[#CF9B2E]/20 rounded-2xl w-full max-w-md pointer-events-auto overflow-hidden shadow-[0_0_0_1px_rgba(207,155,46,0.08),0_32px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(207,155,46,0.04)]"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-[#1E1C1A]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#857F74]">
                    Upcoming Briefing
                  </span>
                  <button
                    autoFocus
                    onClick={onClose}
                    className="text-[#857F74] hover:text-[#F2EDE4] transition-colors duration-200 flex-shrink-0 -mt-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CF9B2E]/50 rounded"
                    aria-label="Close"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <h2 className="font-playfair text-2xl font-semibold text-[#F2EDE4] mb-3">
                  {updateDate}
                </h2>
                <p className="text-sm text-[#A09890] leading-relaxed">
                  {nextUpdate.description}
                </p>
              </div>

              {/* Operations history */}
              <div className="px-6 pt-5 pb-5">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#857F74] mb-4">
                  Operations History
                </p>
                <div>
                  {recent.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 py-3 border-b border-[#1A1918] last:border-b-0"
                    >
                      <span className="text-[11px] font-mono text-[#6E6762] flex-shrink-0 w-22 pt-0.5 tabular-nums">
                        {item.date}
                      </span>
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span className="w-1 h-1 rounded-full bg-[#4A4640] flex-shrink-0 mt-2" />
                        <p className="text-sm text-[#A09890] leading-relaxed">{item.entry}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#1E1C1A] bg-[rgba(0,0,0,0.2)]">
                <p className="text-[11px] font-mono text-[#6E6762]">
                  Briefings delivered every 5–7 working days
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
