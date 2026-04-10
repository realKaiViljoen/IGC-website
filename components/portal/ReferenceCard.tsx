import type { MessageReference } from "@/types/client"

const TYPE_ICONS: Record<MessageReference["type"], string> = {
  pipeline: "●",
  commitment: "✓",
  activity: "◎",
  signal: "◈",
}

interface Props {
  reference: MessageReference
  onRemove?: () => void
}

export function ReferenceCard({ reference, onRemove }: Props) {
  return (
    <div className="flex items-start gap-3 bg-[#0D0D0C] border-l-2 border-[#CF9B2E] px-3 py-2">
      <span className="text-[#CF9B2E] text-xs mt-0.5 flex-shrink-0">
        {TYPE_ICONS[reference.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[#F2EDE4] text-xs leading-snug truncate">
          {reference.label}
        </p>
        <p className="text-[#857F74] text-xs">{reference.detail}</p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-[#4A4640] hover:text-[#F2EDE4] text-xs flex-shrink-0 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  )
}
