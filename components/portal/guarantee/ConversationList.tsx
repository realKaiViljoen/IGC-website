import type { GuaranteeData } from "@/types/client"

/**
 * Row 5 · Conversation list (expanded variant only).
 *
 * Five counted conversations as a tabular Bloomberg-ledger register below the squares.
 * Not a card, not a table element — structured typography with hairline dividers.
 *
 * Row shape:
 *   ┌─ `20 Apr` · `Acme Logistics` · Sarah Chen, CFO              → HubSpot ─┐
 *   │   "30-seat site in Leeds, current MSP contract expires..."            │
 *   └──────────────────────────── 1px #20242A ────────────────────────────┘
 *
 * Rules (brief 5 · Row 5):
 *  - Date column Geist Mono tabular-nums, left-anchored.
 *  - Company · Decision-maker, Role in Geist, sharing the date's baseline.
 *  - HubSpot link right-aligned in Geist Mono, gold on hover.
 *  - Qualification note on its own line below in Fraunces italic.
 *  - Hairline dividers between rows. Not card borders.
 *  - `met` state: 5th row's date gets a subtle gold tint (one more receipt of the Gold Rule).
 *  - `pre-outreach`: editorial sentence. No empty rows.
 *
 * Section eyebrow: `01 · Conversations counted` — mirrors GuaranteeHeader cadence.
 */

function formatHeldAt(iso: string): string {
  return new Date(iso + "T00:00:00Z")
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
    .toUpperCase()
}

export function ConversationList({ guarantee }: { guarantee: GuaranteeData }) {
  const { state, conversations, total, outreach_begins_date } = guarantee

  return (
    <section aria-labelledby="guarantee-conversations-eyebrow" className="flex flex-col">
      <h3
        id="guarantee-conversations-eyebrow"
        className="font-mono uppercase"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.16em",
          color: "#7C7A76",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
          marginBottom: 24,
        }}
      >
        01 · Conversations counted
      </h3>

      {state === "pre-outreach" || conversations.length === 0 ? (
        <p
          className="font-sans"
          style={{
            fontWeight: 300,
            fontSize: "1.125rem",
            lineHeight: 1.75,
            color: "#7C7A76",
            margin: 0,
            maxWidth: "56ch",
            textWrap: "pretty",
          }}
        >
          {state === "pre-outreach" && outreach_begins_date
            ? `No conversations booked yet. Outreach begins ${outreach_begins_date}.`
            : "No conversations counted yet."}
        </p>
      ) : (
        <ol
          className="flex flex-col"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            // Each row gets its own bottom hairline; we also render a top hairline
            // on the list so the first row has a consistent divider above it.
            borderTop: "1px solid #20242A",
          }}
        >
          {conversations.map((c, idx) => {
            const isMetFifth =
              (state === "met" || state === "archive") && idx === total - 1
            const dateColor = isMetFifth ? "#C78B28" : "#7C7A76"

            return (
              <li
                key={c.id}
                className="flex flex-col"
                style={{
                  borderBottom: "1px solid #20242A",
                  paddingTop: 20,
                  paddingBottom: 20,
                  gap: 10,
                }}
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div className="flex items-baseline gap-4 flex-wrap min-w-0">
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: "0.875rem",
                        letterSpacing: "0.08em",
                        color: dateColor,
                        fontVariantNumeric: "tabular-nums",
                        flexShrink: 0,
                        minWidth: "5.5ch",
                      }}
                    >
                      {formatHeldAt(c.held_at)}
                    </span>
                    <span
                      className="font-sans"
                      style={{
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: "#FAF8F5",
                        lineHeight: 1.5,
                      }}
                    >
                      {c.company}
                      <span style={{ color: "#9C9995" }}> · </span>
                      <span style={{ color: "#7C7A76" }}>
                        {c.decision_maker}
                        {c.role ? `, ${c.role}` : ""}
                      </span>
                    </span>
                  </div>

                  {c.hubspot_url && (
                    <a
                      href={c.hubspot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono uppercase no-underline transition-colors duration-150 hover:text-[#C78B28] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C78B28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C0F] rounded-sm"
                      style={{
                        fontSize: "0.6875rem",
                        letterSpacing: "0.14em",
                        color: "#7C7A76",
                        fontVariantNumeric: "tabular-nums",
                        textUnderlineOffset: "3px",
                        flexShrink: 0,
                      }}
                    >
                      → HubSpot
                    </a>
                  )}
                </div>

                {c.qualification_notes && (
                  <p
                    className="font-sans italic"
                    style={{
                      fontWeight: 400,
                      fontSize: "1.125rem",
                      lineHeight: 1.55,
                      letterSpacing: "-0.005em",
                      color: "#FAF8F5",
                      margin: 0,
                      maxWidth: "65ch",
                      fontOpticalSizing: "auto",
                      fontVariationSettings: '"opsz" 72, "SOFT" 80',
                      textWrap: "pretty",
                    }}
                  >
                    {c.qualification_notes}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
