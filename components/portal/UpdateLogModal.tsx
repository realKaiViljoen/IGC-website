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
  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Sort activity descending, take last 6
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
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#111110] border border-[#CF9B2E]/20 rounded-2xl w-full max-w-md pointer-events-auto shadow-[0_0_0_1px_rgba(207,155,46,0.08),0_24px_64px_rgba(0,0,0,0.7),0_0_40px_rgba(207,155,46,0.05)]"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Modal header */}
              <div className="px-6 pt-6 pb-5 border-b border-[#1E1C1A]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#4A4640] mb-1">
                      Upcoming Briefing
                    </p>
                    <h2 className="font-playfair text-xl font-semibold text-[#F2EDE4]">
                      {updateDate}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#4A4640] hover:text-[#857F74] transition-colors duration-200 mt-0.5 flex-shrink-0"
                    aria-label="Close"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-[#857F74] mt-3 leading-relaxed">
                  {nextUpdate.description}
                </p>
              </div>

              {/* Activity log section */}
              <div className="px-6 pt-5 pb-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#4A4640] mb-4">
                  Operations History
                </p>
                <div className="space-y-0">
                  {recent.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 py-3 border-b border-[#1A1918] last:border-b-0"
                    >
                      <span className="text-xs font-mono text-[#4A4640] flex-shrink-0 w-20 pt-0.5">
                        {item.date}
                      </span>
                      <p className="text-sm text-[#857F74] leading-relaxed">{item.entry}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#1E1C1A]">
                <p className="text-xs text-[#3A3530] font-mono">
                  Updates delivered every 5-7 working days
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
