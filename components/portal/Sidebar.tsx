"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { ExportButton } from "@/components/portal/ExportButton"
import type { Engagement } from "@/types/client"

/**
 * Portal navigation. One quiet, persistent chrome layer.
 *
 * Outreach and Deliverability are Phase-3 (no data yet); a nav item that opens
 * to "coming soon" reprices the engagement by pattern-match, so they are hidden
 * until they carry real data. Messages is likewise absent until real mail ships.
 * The sidebar sits on the deepest ground (canvas-deep) so content reads as the
 * plane that moves; the chrome never does. No ticking clock — HUD cosplay, and
 * a live second-hand adds anxiety, not information.
 */
const navItems: { label: string; href: string }[] = [
  { label: "Overview", href: "/portal/system/overview" },
  { label: "Guarantee", href: "/portal/system/guarantee" },
  { label: "Pipeline", href: "/portal/system/pipeline" },
  { label: "Briefings", href: "/portal/system/briefings" },
  { label: "Handover", href: "/portal/system/handover" },
]

interface SidebarProps {
  engagement: Engagement
  uid: string
}

export function Sidebar({ engagement, uid }: SidebarProps) {
  const pathname = usePathname()

  // Day counter: today - startDate + 1, clamped >= 1. Static, no interval.
  const startMs = new Date(engagement.startDate + "T00:00:00Z").getTime()
  const day = Math.max(1, Math.floor((Date.now() - startMs) / 86400000) + 1)

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[#31363E] flex flex-col bg-[#060709]">
      {/* Lockup — the one branding placement in the whole portal */}
      <div className="px-5 py-6 border-b border-[#20242A]">
        <div className="flex items-center gap-2.5">
          <Image src="/peak.png" alt="" width={20} height={21} className="h-[20px] w-auto" aria-hidden="true" priority />
          <span className="text-[18px] font-bold tracking-[-0.03em] text-[#FAF8F5] leading-none">IGC</span>
        </div>
        <span className="eyebrow block mt-2.5 text-[#7C7A76]">The System</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-none ${
                isActive ? "text-[#FAF8F5]" : "text-[#9C9995] hover:text-[#FAF8F5]"
              }`}
            >
              <span className="relative">
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-px bg-[#C78B28]"
                  />
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Engagement day counter. Single editorial line, tabular, no progress bar. */}
      <div className="px-5 py-4 border-t border-[#20242A]">
        <p className="text-[12px] text-[#9C9995] ledger">
          Day {day} / {engagement.totalDays}
        </p>
      </div>

      <div className="px-5 py-4 border-t border-[#20242A]">
        <p className="eyebrow mb-1.5 text-[#7C7A76]">Consultant</p>
        <p className="text-[13px] text-[#C3C0BB]">{engagement.consultant}</p>
      </div>

      {/* Export Everything · no-lock-in, in software form. Inline so it's
          reachable from every route, and present from Day 1, not unlocked. */}
      <div className="px-5 py-4 border-t border-[#20242A]">
        <ExportButton uid={uid} />
      </div>

      <div className="px-2 py-4 border-t border-[#20242A]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/portal" })}
          className="w-full justify-start gap-3 px-3 py-2.5 min-h-0 text-[#7C7A76] hover:text-[#FAF8F5]"
        >
          Sign out
        </Button>
      </div>
    </aside>
  )
}
