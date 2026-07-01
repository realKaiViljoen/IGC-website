import { auth } from "@/auth"
import { getClientDataWithGuarantee } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/client/[uid]/export
 *
 * No-lock-in, in software form. Returns the authenticated client's entire state
 * as a single JSON file with `Content-Disposition: attachment` so the browser
 * triggers a download. Phase 2a MVP is a JSON blob; later phases layer in a
 * zip-with-attachments shape behind the same endpoint.
 *
 * Authorization mirrors `/api/client/[uid]/route.ts`:
 *  - Session required.
 *  - A client can only export its own record. Cross-client reads are 403.
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

  const payload = {
    exported_at: new Date().toISOString(),
    export_version: "1.0",
    client: result.client,
    guarantee: result.guarantee,
  }

  const filename = `igc-export-${uid}-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}.json`

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
