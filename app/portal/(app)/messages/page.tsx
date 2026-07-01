import { redirect } from "next/navigation"

// Legacy URL. Messages moved under /portal/system/messages alongside the other System surfaces.
export default function LegacyMessagesRedirect(): never {
  redirect("/portal/system/messages")
}
