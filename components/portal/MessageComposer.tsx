"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { ClientData, MessageReference } from "@/types/client"
import { ReferencePicker } from "./ReferencePicker"
import { ReferenceCard } from "./ReferenceCard"

interface Props {
  client: ClientData
  onSend: (text: string, reference?: MessageReference) => void
}

export function MessageComposer({ client, onSend }: Props) {
  const [text, setText] = useState("")
  const [reference, setReference] = useState<MessageReference | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  function handleSend() {
    if (!text.trim()) return
    onSend(text.trim(), reference ?? undefined)
    setText("")
    setReference(null)
    setPickerOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === "Escape") {
      setPickerOpen(false)
    }
  }

  const hasActiveReference = !!reference

  return (
    <div className="relative border-t border-[#2D2A27] bg-[#080808]">
      {reference && (
        <div className="px-4 pt-3">
          <ReferenceCard reference={reference} onRemove={() => setReference(null)} />
        </div>
      )}

      <AnimatePresence>
        {pickerOpen && (
          <ReferencePicker
            client={client}
            onSelect={(ref) => {
              setReference(ref)
              setPickerOpen(false)
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className={`text-xs px-2.5 py-1 border transition-colors flex-shrink-0 ${
            pickerOpen || hasActiveReference
              ? "border-[#CF9B2E] text-[#CF9B2E]"
              : "border-[#2D2A27] text-[#4A4640] hover:text-[#857F74] hover:border-[#4A4640]"
          }`}
        >
          Reference
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 bg-transparent text-[#F2EDE4] text-sm placeholder:text-[#4A4640] focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="text-xs px-3 py-1 border border-[#CF9B2E] text-[#CF9B2E] hover:bg-[#1F4D3A] hover:text-[#F2EDE4] hover:border-[#1F4D3A] transition-colors disabled:opacity-30 flex-shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  )
}
