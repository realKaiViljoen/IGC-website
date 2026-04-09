import type { Metadata } from 'next'
import Image from 'next/image'
import { CalEmbed } from '@/components/ui/CalEmbed'

export const metadata: Metadata = {
  title: 'Book a BD Audit with K.C. Viljoen, IGC',
  description:
    'Book a 20-minute BD audit with K.C. Viljoen. We look at your current mandate acquisition setup and tell you honestly where the pipeline is breaking.',
}

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="w-full px-6 md:px-10 lg:px-16 pt-32 pb-12">
        <div className="max-w-site mx-auto">
          <span className="gold-line mb-6 block" aria-hidden="true" />
          <p className="section-label mb-3">20-Minute BD Audit</p>
          <h1 className="font-display text-display-lg text-[#F2EDE4] max-w-[22ch]">
            Book your mandate pipeline audit.
          </h1>
        </div>
      </div>

      {/* ── Main layout: profile left, booking right ──────────────── */}
      <div className="w-full px-6 md:px-10 lg:px-16 pb-24">
        <div className="max-w-site mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* ── Profile card ────────────────────────────────────── */}
            <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-24">
              <div className="border border-[#2D2A27] bg-[#0D0D0C] p-6 rounded-md">

                {/* Photo */}
                <div className="mb-5">
                  <Image
                    src="/profile.jpg"
                    alt="K.C. Viljoen, IGC"
                    width={300}
                    height={360}
                    className="w-full object-cover rounded-lg"
                    style={{ objectPosition: '50% 5%', aspectRatio: '5/6' }}
                    priority
                  />
                </div>

                {/* Name + title */}
                <h2 className="font-display text-[1.5rem] text-[#F2EDE4] leading-tight mb-1">
                  K.C. Viljoen
                </h2>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A09890] mb-4">
                  Growth Infrastructure Operator
                </p>

                {/* Divider */}
                <div className="border-t border-[#2D2A27] my-4" />

                {/* Credential points */}
                <ul className="flex flex-col gap-3">
                  {[
                    'Managing Director, IGC',
                    'BD infrastructure deployments across B2B services, professional services, and recruitment',
                    'Active builds running across Q1/Q2 2026 cohort',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="w-1 h-1 rounded-full bg-[#4CAF7A] mt-2 shrink-0" aria-hidden="true" />
                      <span className="font-sans text-base text-[#C5C0BB] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-[#2D2A27] my-4" />

                {/* What happens in the call */}
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A09890] mb-3">
                  What happens in 20 minutes
                </p>
                <ul className="flex flex-col gap-2.5">
                  {[
                    'We review your current BD and mandate pipeline setup',
                    'Identify exactly where client conversations are being lost',
                    'Tell you honestly whether the build is the right fix',
                    'No commitment. No pitch.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="font-mono text-[#C9922A] text-[10px] mt-0.5 shrink-0">→</span>
                      <span className="font-sans text-base text-[#C5C0BB] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* LinkedIn link */}
                <div className="border-t border-[#2D2A27] mt-4 pt-4">
                  <a
                    href="https://linkedin.com/in/kai-viljoen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#A09890] hover:text-[#F2EDE4] transition-colors duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    linkedin.com/in/kai-viljoen
                  </a>
                </div>
              </div>
            </aside>

            {/* ── Booking embed ───────────────────────────────────── */}
            <div className="flex-1 w-full min-w-0 min-h-[700px]">
              <CalEmbed />
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#857F74] mt-3">
                Prefer email? hello@igc.co.za
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
