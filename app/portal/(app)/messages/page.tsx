import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientData } from "@/lib/data"
import { MessagesClient } from "@/components/portal/MessagesClient"

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const client = await getClientData(session.user.id)
  if (!client) redirect("/portal")

  return (
    <MessagesClient
      client={client}
      consultantId="viljoen"
      clientUserId={client.uid}
    />
  )
}
