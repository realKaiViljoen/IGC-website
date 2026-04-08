'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useMagnetic } from '@/hooks/useMagnetic'

type Variant = 'primary' | 'ghost' | 'outline' | 'light' | 'tertiary'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  href?: string
  external?: boolean
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

// Base: group for arrow hover, transition — font-weight applied per variant
const base =
  'group inline-flex items-center justify-center font-sans transition-all duration-300 ease-expo-out no-underline rounded-md'

const variants: Record<Variant, string> = {
  // Primary — white fill: clean, clinical, no-pitch confidence
  primary:
    'font-semibold tracking-[0.08em] uppercase text-[#080808] ' +
    'bg-[#F2EDE4] border border-[#F2EDE4]/80 ' +
    'shadow-[0_0_24px_rgba(242,237,228,0.14),0_2px_8px_rgba(0,0,0,0.30)] ' +
    'hover:bg-white hover:border-white ' +
    'hover:shadow-[0_0_36px_rgba(242,237,228,0.28),0_4px_16px_rgba(0,0,0,0.40)] ' +
    'hover:scale-[1.02] active:scale-[0.99]',

  // Ghost — stronger border, brighter text, border-2
  ghost:
    'font-medium tracking-[0.1em] uppercase ' +
    'bg-transparent text-[rgba(242,237,228,0.68)] border-2 border-[rgba(242,237,228,0.20)] ' +
    'hover:border-[rgba(242,237,228,0.40)] hover:text-[rgba(242,237,228,0.92)]',

  // Outline — dark equivalent
  outline:
    'font-medium tracking-[0.08em] uppercase ' +
    'bg-transparent text-[#F2EDE4] border-2 border-[#F2EDE4] ' +
    'hover:bg-[#F2EDE4] hover:text-[#080808]',

  // Light — for dark section CTA
  light:
    'font-medium tracking-[0.08em] uppercase ' +
    'bg-transparent text-[#F2EDE4] border-2 border-[rgba(242,237,228,0.4)] ' +
    'hover:bg-[#F2EDE4] hover:text-[#080808]',

  // Tertiary — text-only, no border, no uppercase, no tracking
  tertiary:
    'font-normal text-sm ' +
    'bg-transparent border-none text-[#A09890] ' +
    'hover:text-[#F2EDE4] hover:underline underline-offset-4',
}

const sizes: Record<Size, string> = {
  sm: 'text-[0.75rem] px-5 py-2.5 min-h-[44px]',
  md: 'text-[0.8125rem] px-7 py-3.5 min-h-[44px]',
  lg: 'text-[0.875rem] px-10 py-[1.0625rem] min-h-[44px]',
}

// Inner content for primary buttons: text + animated arrow
function PrimaryContent({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="translate-x-0 transition-transform duration-200 ease-expo-out group-hover:translate-x-2"
      >
        &#8594;
      </span>
    </span>
  )
}

// Wrapper that applies magnetic effect for primary buttons
function MagneticWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useMagnetic(wrapperRef, 0.4)

  return (
    <div ref={wrapperRef} className={className} style={{}}>
      {children}
    </div>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  type = 'button',
  children,
  className = '',
  onClick,
}: ButtonProps) {
  const sizeClass = variant === 'tertiary' ? '' : sizes[size]
  const classes = `${base} ${variants[variant]} ${sizeClass} ${className}`

  const content = variant === 'primary' ? (
    <PrimaryContent>{children}</PrimaryContent>
  ) : (
    children
  )

  // Render as button when no href provided (e.g. form submit)
  if (!href) {
    const buttonEl = (
      <button
        type={type}
        onClick={onClick}
        className={`${classes} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`}
      >
        {content}
      </button>
    )

    if (variant === 'primary') {
      return (
        <MagneticWrapper className="inline-block">
          {buttonEl}
        </MagneticWrapper>
      )
    }
    return buttonEl
  }

  // Render as Link when href provided (existing behaviour)
  const linkEl = (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${classes} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9922A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`}
    >
      {content}
    </Link>
  )

  if (variant === 'primary') {
    return (
      <MagneticWrapper className="inline-block">
        {linkEl}
      </MagneticWrapper>
    )
  }

  return linkEl
}
