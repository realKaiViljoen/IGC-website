// import { auth } from "@/auth"
// import { redirect } from "next/navigation"
import { Sidebar } from "@/components/portal/Sidebar"
import { PortalCursor } from "@/components/portal/PortalCursor"

export default async function PortalAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const session = await auth()
  // if (!session?.user?.id) redirect("/portal")

  return (
    <div className="flex min-h-screen">
      <PortalCursor />
      <Sidebar />
      <main className="flex-1 overflow-auto portal-scanlines portal-grid" style={{ background: 'radial-gradient(ellipse 80% 50% at 70% -20%, rgba(207,155,46,0.025) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 0% 60%, rgba(207,155,46,0.015) 0%, transparent 60%), #080808' }}>
        {children}
      </main>
    </div>
  )
}
