import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/portal/Sidebar"

export default async function PortalAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
