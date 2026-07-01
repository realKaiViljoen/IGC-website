export { auth as default } from "@/auth"

// Protect every authenticated portal surface (/portal/system/**, /portal/messages/**, …).
// The public login lives at /portal exactly — excluded so unauthenticated users can reach it.
export const config = {
  matcher: [
    "/portal/system/:path*",
    "/portal/admin/:path*",
    "/portal/messages/:path*",
  ],
}
