import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getClientDataWithGuarantee } from "@/lib/data"
import { GuaranteeTracker } from "@/components/portal/guarantee"

/**
 * Expanded Guarantee view — full ledger.
 *
 * Auth-gated server component. Reads the client via `getClientDataWithGuarantee`
 * and renders `<GuaranteeTracker variant="expanded">` which composes Rows 1–4
 * from the compact variant plus Rows 5–7 (conversations, operator log, timeline)
 * via `GuaranteeExpandedBody`.
 */
export default async function GuaranteePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/portal")

  const data = await getClientDataWithGuarantee(session.user.id)
  if (!data) redirect("/portal")

  const { client, guarantee } = data

  return (
    <div className="px-8 pt-10 pb-16">
      <nav
        aria-label="Breadcrumb"
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#857F74",
          fontVariantNumeric: "tabular-nums",
          marginBottom: 32,
        }}
      >
        <Link
          href="/portal/system/overview"
          className="no-underline transition-colors duration-150 hover:text-[#FAF9F7] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0E] rounded-sm"
          style={{ color: "#857F74" }}
        >
          Overview
        </Link>
        <span aria-hidden="true"> / </span>
        <span style={{ color: "#FAF9F7" }}>Guarantee</span>
      </nav>

      <GuaranteeTracker variant="expanded" initialData={{ client, guarantee }} />
    </div>
  )
}
