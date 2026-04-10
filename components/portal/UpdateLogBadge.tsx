"use client"

import { useState } from "react"
import { UpdateLogModal } from "./UpdateLogModal"

interface ActivityEntry {
  date: string
  entry: string
}

interface NextUpdate {
  date: string
  description: string
}

interface Props {
  updateLabel: string
  nextUpdate: NextUpdate
  activity: ActivityEntry[]
}

export function UpdateLogBadge({ updateLabel, nextUpdate, activity }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 border border-[#CF9B2E]/30 bg-[#111110] rounded-lg px-5 py-3 cursor-pointer
          shadow-[0_0_0_1px_rgba(207,155,46,0.08),0_0_20px_-4px_rgba(207,155,46,0.2),0_4px_12px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(207,155,46,0.06)]
          hover:border-[#CF9B2E]/50 hover:shadow-[0_0_0_1px_rgba(207,155,46,0.12),0_0_28px_-4px_rgba(207,155,46,0.3),0_4px_12px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(207,155,46,0.08)]
          active:scale-[0.98] transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CF9B2E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
        aria-label="View update log"
      >
        <span className="w-2 h-2 bg-[#CF9B2E] rounded-full" />
        <span className="text-[#F2EDE4] text-sm font-medium">
          Next update in {updateLabel}
        </span>
        <svg
          className="w-3 h-3 text-[#4A4640] group-hover:text-[#857F74] transition-colors duration-200 ml-0.5"
          viewBox="0 0 12 12" fill="none"
        >
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      <UpdateLogModal
        open={open}
        onClose={() => setOpen(false)}
        nextUpdate={nextUpdate}
        activity={activity}
      />
    </>
  )
}
