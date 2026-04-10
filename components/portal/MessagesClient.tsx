"use client"

import { useCallback } from "react"
import type { ClientData, MessageReference } from "@/types/client"
import { MessageComposer } from "./MessageComposer"

interface Props {
  client: ClientData
  consultantId: string
  clientUserId: string
}

export function MessagesClient({ client, consultantId, clientUserId }: Props) {
  const handleSend = useCallback(
    (text: string, reference?: MessageReference) => {
      // Wire your CometChat send function here.
      // The reference is stored as CometChat message metadata.
      // Example:
      // sendCometChatMessage({
      //   receiverUID: consultantId,
      //   text,
      //   metadata: reference ? { reference } : undefined,
      // })
      console.log("send:", { text, reference, to: consultantId })
    },
    [consultantId]
  )

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b border-[#2D2A27] px-6 py-4 flex-shrink-0">
        <h1 className="font-playfair text-[#F2EDE4]">Messages</h1>
        <p className="text-[#857F74] text-xs mt-0.5">
          Direct line to your consultant
        </p>
      </div>

      {/* ─── CometChat message list ──────────────────────────────────────
          Replace this placeholder div with your CometChat message list
          component. Conversations are between clientUserId and consultantId.

          For messages with references, render ReferenceCard above the text:
            import { ReferenceCard } from "./ReferenceCard"
            const ref = message.metadata?.reference as MessageReference | undefined
            {ref && <ReferenceCard reference={ref} />}
      ──────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <p className="text-[#4A4640] text-sm text-center mt-8 font-mono text-xs uppercase tracking-wider">
          CometChat integration point
        </p>
      </div>

      <MessageComposer client={client} onSend={handleSend} />
    </div>
  )
}
