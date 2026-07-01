import type { ClientData, GuaranteeData } from "@/types/client"
import { computeGuaranteeState } from "@/lib/guarantee"

/**
 * Load a client record by its uid.
 *
 * Backed by static TypeScript files under `data/clients/` during Phase 0.
 * Production roadmap: swap for Postgres/Supabase read keyed on the authenticated uid.
 */
export async function getClientData(uid: string): Promise<ClientData | null> {
  try {
    const mod = await import(`@/data/clients/${uid}`)
    return (mod.client as ClientData) ?? null
  } catch {
    return null
  }
}

/**
 * Convenience wrapper for RSC pages that need both the client and its derived guarantee state.
 * Keeps computation in one place; consumers don't have to remember to call both.
 */
export async function getClientDataWithGuarantee(
  uid: string,
): Promise<{ client: ClientData; guarantee: GuaranteeData } | null> {
  const client = await getClientData(uid)
  if (!client) return null
  const guarantee = computeGuaranteeState(client)
  return { client, guarantee }
}
