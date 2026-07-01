import { redirect } from "next/navigation"

// Legacy URL. The product is now named "The System" and lives under /portal/system/*.
export default function LegacyDashboardRedirect(): never {
  redirect("/portal/system/overview")
}
