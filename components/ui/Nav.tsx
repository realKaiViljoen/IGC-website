'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from './Logo'
import { Button } from './Button'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Approach', href: '/results' },
  { label: 'Contact', href: '/contact' },
]

const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="7" width="10" height="8" rx="1.5" />
    <path d="M5 7V5a3 3 0 016 0v2" />
  </svg>
)

const ease = [0.16, 1, 0.3, 1] as const

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
  onClick?: () => void
  mobile?: boolean
}

function NavLink({ href, label, isActive, onClick, mobile = false }: NavLinkProps) {
  if (mobile) {
    return (
      <Link
        href={href}
        className={`font-sans text-base transition-colors duration-200 ${
          isActive ? 'text-[#F2EDE4]' : 'text-[#C5C0BB] hover:text-[#F2EDE4]'
        }`}
        onClick={onClick}
      >
        {label}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={`relative font-sans text-sm tracking-[0.02em] transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CF9B2E] focus-visible:ring-offset-1 focus-visible:ring-offset-[#080808] rounded-sm ${
        isActive ? 'text-[#F2EDE4]' : 'text-[#C5C0BB] hover:text-[#F2EDE4]'
      }`}
      onClick={onClick}
    >
      {label}
      <span
        className={`absolute left-0 bottom-[-2px] h-px w-full bg-[#CF9B2E] origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
        aria-hidden="true"
      />
    </a>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    /* Fixed positioner — out of document flow */
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 md:px-6">

      {/* ── Dock pill ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease, delay: 0.08 }}
        className={`w-full max-w-[1080px] rounded-full transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(8,8,8,0.94)] backdrop-blur-xl border border-[rgba(242,237,228,0.14)] shadow-[0_8px_48px_rgba(0,0,0,0.65)]'
            : 'bg-[rgba(8,8,8,0.72)] backdrop-blur-lg border border-[rgba(242,237,228,0.09)] shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
        }`}
      >
        <div className="flex items-center justify-between h-[52px] px-4 md:px-5">

          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}
          </nav>

          {/* Desktop right — Client Portal + LinkedIn + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/portal"
              className="flex items-center gap-1.5 text-[#6E6762] hover:text-[#A09890] transition-colors duration-200"
            >
              <LockIcon />
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase">Client Portal</span>
              <span className="font-mono text-[9px] tracking-[0.10em] uppercase text-[#CF9B2E]/70 border border-[#CF9B2E]/20 rounded-full px-1.5 py-0.5">Soon</span>
            </Link>
            <div className="w-px h-3.5 bg-[rgba(242,237,228,0.10)]" aria-hidden="true" />
            <a
              href="https://linkedin.com/in/kai-viljoen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#857F74] hover:text-[#C5C0BB] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <Button href="/diagnostic" variant="primary" size="sm">
              Book a BD Audit
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 -mr-1"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span
              className={`block w-[18px] h-px bg-[#F2EDE4] transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`}
            />
            <span
              className={`block w-[18px] h-px bg-[#F2EDE4] transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`}
            />
            <span
              className={`block w-[18px] h-px bg-[#F2EDE4] transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`}
            />
          </button>

        </div>
      </motion.div>

      {/* ── Mobile dropdown card (below pill, not inside it) ─────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: ease }}
            className="absolute top-[68px] left-4 right-4 max-w-[940px] mx-auto rounded-2xl bg-[rgba(10,10,9,0.97)] backdrop-blur-xl border border-[rgba(242,237,228,0.10)] shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden md:hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-5" aria-label="Mobile navigation">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={pathname === link.href}
                  onClick={() => setOpen(false)}
                  mobile
                />
              ))}

              <Link
                href="/portal"
                className="flex items-center text-[#6E6762] hover:text-[#A09890] transition-colors duration-200"
                onClick={() => setOpen(false)}
              >
                <LockIcon />
                <span className="font-sans text-base text-[#6E6762] ml-2">Client Portal</span>
                <span className="font-mono text-[10px] tracking-[0.10em] uppercase text-[#CF9B2E]/60 ml-2">Soon</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-[rgba(242,237,228,0.06)] pt-4 flex items-center gap-4">
                <a
                  href="https://linkedin.com/in/kai-viljoen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#857F74] hover:text-[#C5C0BB] transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <Button href="/diagnostic" variant="primary" size="sm" onClick={() => setOpen(false)}>
                  Book a BD Audit
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
