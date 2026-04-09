"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navItems = [
  { label: "Dashboard", href: "/portal/dashboard", icon: "◈" },
  { label: "Messages", href: "/portal/messages", icon: "◎" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 flex-shrink-0 border-r border-[#242220] flex flex-col">
      <div className="px-5 py-5 border-b border-[#242220]">
        <span className="font-playfair text-lg text-[#F2EDE4]">IGC</span>
        <span className="block text-[#4A4640] text-xs font-mono mt-0.5 tracking-wider uppercase">
          Client Portal
        </span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "text-[#C9922A]"
                  : "text-[#857F74] hover:text-[#F2EDE4]"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#C9922A]" />
              )}
              <span className="text-xs w-3">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 py-4 border-t border-[#242220]">
        <button
          onClick={() => signOut({ callbackUrl: "/portal" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#4A4640] hover:text-[#F2EDE4] transition-colors w-full"
        >
          <span className="text-xs w-3">→</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
