import { auth } from "@/auth"
import { getClientDataWithGuarantee } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/client/[uid]
 *
 * Returns `{ client, guarantee }` for the authenticated client.
 * The caller (SWR) already has the initial snapshot from the RSC render; this
 * endpoint is the revalidation channel — 30s poll + focus revalidation.
 *
 * Authorization:
 *  - Session required.
 *  - A client can only read its own record. Cross-client reads are 403.
 *    (K.C. admin impersonation is out of scope; it will be layered in Phase 2.)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { uid } = await params
  if (uid !== session.user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const result = await getClientDataWithGuarantee(uid)
  if (!result) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  return NextResponse.json(result)
}
