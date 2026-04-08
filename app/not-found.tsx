import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 text-center">
      {/* Gold line */}
      <span className="gold-line mb-8 mx-auto" aria-hidden="true" />

      {/* Ghost number */}
      <p
        className="font-display text-[#F2EDE4]/[0.04] select-none pointer-events-none leading-none mb-0"
        style={{ fontSize: 'clamp(8rem, 20vw, 18rem)' }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="font-display text-display-md text-[#F2EDE4] mb-4 -mt-4">
        Page not found.
      </h1>
      <p className="font-sans text-body-md text-[#A09890] max-w-[38ch] mb-10">
        This page does not exist or has been moved. The homepage has everything you need.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 font-sans font-semibold text-[0.8125rem] tracking-[0.08em] uppercase text-[#080808] bg-[#F2EDE4] border border-[#F2EDE4]/80 px-7 py-3.5 rounded-md shadow-[0_0_24px_rgba(242,237,228,0.14)] hover:bg-white hover:shadow-[0_0_36px_rgba(242,237,228,0.28)] transition-all duration-300 no-underline"
      >
        Back to Home
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
