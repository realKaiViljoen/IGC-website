import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Request Received',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 text-center">
      {/* Gold line */}
      <span className="gold-line mb-8 mx-auto" aria-hidden="true" />

      {/* Check icon */}
      <div className="mb-8">
        <svg
          className="w-12 h-12 text-[#4CAF7A] mx-auto"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="20" opacity="0.15" fill="currentColor" stroke="none"/>
          <circle cx="24" cy="24" r="20"/>
          <path d="M15 24l7 7 11-14"/>
        </svg>
      </div>

      <h1 className="font-display text-display-md text-[#F2EDE4] mb-4">
        Request received.
      </h1>
      <p className="font-sans text-body-lg text-[#C5C0BB] max-w-[40ch] mb-3">
        We will review your details and confirm your diagnostic time within one business day.
      </p>
      <p className="font-sans text-body-md text-[#857F74] max-w-[36ch] mb-10">
        Check your inbox — and your spam folder if you do not hear from us.
      </p>

      <Link
        href="/"
        className="font-mono font-medium text-[0.75rem] tracking-[0.12em] uppercase text-[#857F74] hover:text-[#F2EDE4] transition-colors duration-200 no-underline"
      >
        ← Back to home
      </Link>
    </div>
  )
}
