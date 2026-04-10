import Link from 'next/link'
import { Logo } from './Logo'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Results', href: '/results' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="LinkedIn"
    role="img"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-[rgba(242,237,228,0.06)] bg-[#080808]">
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Logo */}
          <Logo size="sm" />

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Footer navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-[#C5C0BB] hover:text-[#F2EDE4] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: LinkedIn + copyright */}
          <div className="flex items-center gap-5">
            <a
              href="https://linkedin.com/in/kai-viljoen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A09890] hover:text-[#F2EDE4] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <span className="font-mono text-[10px] text-[#857F74] tracking-wide uppercase">
              © {year} Integrated Growth Consultants
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
