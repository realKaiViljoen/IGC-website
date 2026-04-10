"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { ClientData, MessageReference } from "@/types/client"
import { ReferencePicker } from "./ReferencePicker"
import { ReferenceCard } from "./ReferenceCard"
import { Button } from "@/components/ui/Button"

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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPickerOpen((v) => !v)}
          className={`flex-shrink-0 min-h-0 py-1 px-2.5 ${
            pickerOpen || hasActiveReference
              ? "border-[#CF9B2E] text-[#CF9B2E]"
              : ""
          }`}
        >
          Reference
        </Button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 bg-transparent text-[#F2EDE4] text-sm placeholder:text-[#4A4640] focus:outline-none"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleSend}
          className="flex-shrink-0 min-h-0 py-1 px-3 disabled:opacity-30"
        >
          Send
        </Button>
      </div>
    </div>
  )
}
