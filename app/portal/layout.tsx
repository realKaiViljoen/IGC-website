export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-[#080808]">{children}</div>
}
