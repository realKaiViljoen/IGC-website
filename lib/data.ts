import type { ClientData } from "@/types/client"

export async function getClientData(uid: string): Promise<ClientData | null> {
  try {
    const mod = await import(`@/data/clients/${uid}`)
    return (mod.client as ClientData) ?? null
  } catch {
    return null
  }
}
