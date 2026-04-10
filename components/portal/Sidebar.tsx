"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"

const navItems = [
  { label: "Dashboard", href: "/portal/dashboard", icon: "◈" },
  { label: "Messages", href: "/portal/messages", icon: "◎" },
]

export function Sidebar() {
  const pathname = usePathname()

  const [time, setTime] = useState("--:--")

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[#2D2A27] flex flex-col bg-[#0A0A09] shadow-[1px_0_12px_0_rgba(0,0,0,0.5)]">
      <div className="px-5 py-6 border-b border-[#2D2A27]">
        <span className="font-playfair text-2xl font-bold text-[#F2EDE4]">IGC</span>
        <span className="block text-[#A09890] text-xs font-mono mt-0.5 tracking-[0.14em] uppercase">
          Client Portal
        </span>
        <span className="block text-[#857F74] text-xs font-mono mt-0.5 tabular-nums">{time}</span>
        <span className="block text-[11px] font-mono text-[#6E6762] tracking-[0.14em]">SAST · Johannesburg</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-[#CF9B2E] bg-[rgba(207,155,46,0.06)] rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CF9B2E]/50"
                  : "text-[#857F74] hover:text-[#F2EDE4] hover:bg-[rgba(242,237,228,0.04)] rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CF9B2E]/50"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#CF9B2E]" />
              )}
              <span className="text-base w-5">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Engagement health panel */}
      <div className="px-4 py-4 border-t border-[#1A1918]">
        <p className="section-label mb-3">
          Engagement Health
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Pipeline", filled: 3, color: "#CF9B2E" },
            { label: "Commits", filled: 4, color: "#3D8B5E" },
            { label: "Activity", filled: 5, color: "#3D8B5E" },
          ].map(({ label, filled, color }) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A09890] w-12 flex-shrink-0">{label}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-3 rounded-sm transition-colors duration-300"
                    style={{ background: i <= filled ? color : "#1A1918" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-2 py-4 border-t border-[#2D2A27]">
        <button
          onClick={() => signOut({ callbackUrl: "/portal" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#857F74] hover:text-[#F2EDE4] hover:bg-[rgba(242,237,228,0.04)] rounded-lg transition-colors duration-200 w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CF9B2E]/50"
        >
          <span className="text-xs w-3">→</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
