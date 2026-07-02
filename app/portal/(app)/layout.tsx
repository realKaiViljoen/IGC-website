import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/portal/Sidebar"
import { getClientData } from "@/lib/data"
import { PaletteProvider, CommandPalette } from "@/components/portal/palette"
import { KeyboardShortcuts, HelpOverlay } from "@/components/portal/shortcuts"
import { PortalAtmosphere } from "@/components/portal/PortalAtmosphere"

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
      {/* The living brand atmosphere, behind everything */}
      <PortalAtmosphere />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar engagement={client.engagement} uid={client.uid} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <CommandPalette />
      <HelpOverlay />
      <KeyboardShortcuts />
    </PaletteProvider>
  )
}
