"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { ExportButton } from "@/components/portal/ExportButton"
import type { Engagement } from "@/types/client"

/**
 * Portal navigation. Seven routes, one surface.
 *
 * Messages is intentionally absent until real messaging ships; an empty-shell
 * route reads as noise and reprices the engagement by pattern-match with
 * agency tools. Restored in Phase 2 if Discord / real mail lands.
 */
const navItems: { label: string; href: string }[] = [
  { label: "Overview", href: "/portal/system/overview" },
  { label: "Guarantee", href: "/portal/system/guarantee" },
  { label: "Pipeline", href: "/portal/system/pipeline" },
  { label: "Outreach", href: "/portal/system/outreach" },
  { label: "Deliverability", href: "/portal/system/deliverability" },
  { label: "Briefings", href: "/portal/system/briefings" },
  { label: "Handover", href: "/portal/system/handover" },
]

interface SidebarProps {
  engagement: Engagement
  uid: string
}

export function Sidebar({ engagement, uid }: SidebarProps) {
  const pathname = usePathname()

  const [time, setTime] = useState("--:--")

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: engagement.timezone,
        }),
      )
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [engagement.timezone])

  // Day counter: today - startDate + 1, clamped ≥ 1.
  const startMs = new Date(engagement.startDate + "T00:00:00Z").getTime()
  const day = Math.max(1, Math.floor((Date.now() - startMs) / 86400000) + 1)

  // Timezone label (e.g. "Europe/London" → "London").
  const cityLabel = engagement.timezone.split("/").pop()?.replace(/_/g, " ") ?? engagement.timezone

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[#262A30] flex flex-col bg-[#070809]">
      <div className="px-5 py-6 border-b border-[#262A30]">
        <span className="font-display text-2xl font-normal tracking-[-0.015em] text-[#FAF9F7]">
          IGC
        </span>
        <span className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#857F74] mt-1">
          The System
        </span>
        <span className="block font-mono text-[11px] text-[#857F74] mt-3 tabular-nums">
          {time}
        </span>
        <span className="block font-mono text-[11px] tracking-[0.14em] text-[#93918E]">
          {cityLabel}
        </span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center px-3 py-2 font-sans text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E] ${
                isActive
                  ? "text-[#FAF9F7]"
                  : "text-[#857F74] hover:text-[#FAF9F7]"
              }`}
            >
              <span className="relative">
                {item.label}
                {/*
                  Active nav indicator: 1px gold underline. Per-surface override
                  of DESIGN.md's 2px left-bar pattern — respects the absolute ban
                  on side-stripe borders >1px while keeping gold as the earned
                  signal of current surface.
                */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-px bg-[#C9922A]"
                  />
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Engagement day counter. Single editorial line — no progress bar. */}
      <div className="px-5 py-4 border-t border-[#262A30]">
        <p className="font-mono text-[11px] text-[#93918E] tabular-nums">
          Day {day} / {engagement.totalDays}
        </p>
      </div>

      <div className="px-5 py-4 border-t border-[#262A30]">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#93918E] mb-1">
          Consultant
        </p>
        <p className="font-sans text-xs text-[#857F74]">{engagement.consultant}</p>
      </div>

      {/* Export Everything · no-lock-in, in software form. Inline here so
          it's accessible from every portal route, not floating chrome. */}
      <div className="px-5 py-4 border-t border-[#262A30]">
        <ExportButton uid={uid} />
      </div>

      <div className="px-2 py-4 border-t border-[#262A30]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/portal" })}
          className="w-full justify-start gap-3 px-3 py-2.5 min-h-0 font-sans text-[#857F74] hover:text-[#FAF9F7]"
        >
          Sign out
        </Button>
      </div>
    </aside>
  )
}
