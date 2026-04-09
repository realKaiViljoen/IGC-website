"use client"

import { usePathname } from "next/navigation"
import { Nav } from "./Nav"
import { Footer } from "./Footer"
import { Cursor } from "./Cursor"

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortal = pathname.startsWith("/portal")

  return (
    <>
      {!isPortal && <Cursor />}
      {!isPortal && <Nav />}
      {children}
      {!isPortal && <Footer />}
    </>
  )
}
