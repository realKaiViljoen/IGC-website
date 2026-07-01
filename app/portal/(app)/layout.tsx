import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/portal/Sidebar"
import { getClientData } from "@/lib/data"
import { PaletteProvider, CommandPalette } from "@/components/portal/palette"
import { KeyboardShortcuts, HelpOverlay } from "@/components/portal/shortcuts"

export default async function PortalAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  // Load just enough client shape for the sidebar's Day X / Y line.
  // Page-level components re-load the full record; this is deliberately lightweight.
  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  return (
    // PaletteProvider is universal chrome: identical across every engagement
    // state (pre-outreach, on-pace, behind, met, unpaid-extension, archive).
    // The CommandPalette, KeyboardShortcuts listener, and HelpOverlay sit
    // here so they're present on every portal route, not scoped to a page.
    <PaletteProvider client={client}>
      <div className="flex min-h-screen">
        <Sidebar engagement={client.engagement} uid={client.uid} />
        <main className="flex-1 overflow-auto portal-scanlines portal-grid" style={{ background: 'radial-gradient(ellipse 80% 50% at 70% -20%, rgba(207,155,46,0.04) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 0% 60%, rgba(207,155,46,0.025) 0%, transparent 60%), #0A0B0E' }}>
          {children}
        </main>
        <div className="grain" aria-hidden="true" />
      </div>
      <CommandPalette />
      <HelpOverlay />
      <KeyboardShortcuts />
    </PaletteProvider>
  )
}
