import { type ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  as?: 'section' | 'div' | 'article'
  divide?: boolean
}

export function SectionWrapper({
  children,
  className = '',
  id,
  as: Tag = 'section',
  divide = false,
}: SectionWrapperProps) {
  return (
    <Tag
      id={id}
      className={`w-full px-6 md:px-10 lg:px-16 py-28 md:py-32 lg:py-40${divide ? ' section-divide' : ''} ${className}`}
    >
      <div className="max-w-site mx-auto">{children}</div>
    </Tag>
  )
}
