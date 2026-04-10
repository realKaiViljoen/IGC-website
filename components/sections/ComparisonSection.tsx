'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'
import { Button } from '@/components/ui/Button'

const columns = [
  {
    id: 'agency',
    label: 'Marketing Agency',
    labelColor: '#857F74',
    borderClass: 'border border-[#2D2A27]',
    bgClass: 'bg-[#080808]',
    pointColor: 'text-[#C5C0BB]',
    points: [
      'Optimises for impressions. You bill on placements.',
      'Monthly report shows reach. Not mandates won.',
      'No BD infrastructure left when the contract ends.',
      'Account manager who has never worked a recruitment desk.',
      'New contact every three months.',
    ],
  },
  {
    id: 'igc',
    label: 'IGC',
    labelColor: '#CF9B2E',
    borderClass: 'border border-[#CF9B2E]/40 border-l-2 border-l-[#CF9B2E]/70',
    bgClass: 'bg-[#111110]',
    pointColor: 'text-[#F2EDE4]',
    points: [
      'You own every sequence, page, and workflow we build.',
      'One metric tracked: new client conversations booked.',
      'Full BD system operational in 30 days.',
      'One named operator. Direct line. No account managers.',
      'Fixed fee. No lock-in.',
    ],
  },
  {
    id: 'hire',
    label: 'In-House BD Person',
    labelColor: '#857F74',
    borderClass: 'border border-[#2D2A27]',
    bgClass: 'bg-[#080808]',
    pointColor: 'text-[#C5C0BB]',
    points: [
      'R40,000–55,000+ salary before commission.',
      '3-month ramp before meaningful BD output.',
      'Generalist, not a BD infrastructure builder.',
      'When they leave, the pipeline goes with them.',
      'You manage a person, not a system.',
    ],
  },
]

export function ComparisonSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <SectionWrapper className="bg-[#080808] text-[#F2EDE4]">
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section label */}
        <motion.div variants={fadeUp}>
          <span className="gold-line mb-6 block" aria-hidden="true" />
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 2v12M2 5l6-3 6 3M2 11l6 3 6-3"/>
              <path d="M2 5v6M14 5v6"/>
            </svg>
            <p className="section-label">The honest comparison</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="font-display text-display-md text-[#F2EDE4] mb-12 max-w-[28ch]"
        >
          Why not hire a marketing agency or a dedicated BD person?
        </motion.h2>

        {/* Comparison grid */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {columns.map((col) => (
            <motion.div
              key={col.id}
              variants={fadeUp}
              className={`${col.borderClass} ${col.bgClass} p-6 ${
                col.id === 'igc'
                  ? 'order-first md:order-none mx-auto w-full md:mx-0 md:max-w-none max-w-sm relative shadow-[0_0_30px_rgba(207,155,46,0.06)]'
                  : ''
              }`}
            >
              {/* IGC "recommended" badge */}
              {col.id === 'igc' && (
                <div className="absolute -top-px left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#CF9B2E]/80 to-transparent md:hidden" aria-hidden="true" />
              )}

              {/* Column label */}
              <div className="flex items-center justify-between mb-6">
                <p
                  className="font-mono text-[11px] tracking-[0.14em] uppercase font-medium"
                  style={{ color: col.labelColor }}
                >
                  {col.label}
                </p>
                {col.id === 'igc' && (
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#CF9B2E] border border-[#CF9B2E]/30 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>

              {/* Points */}
              <ul className="flex flex-col gap-4">
                {col.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    {col.id === 'igc' ? (
                      <svg
                        className="w-[14px] h-[14px] text-[#CF9B2E] shrink-0 mt-[3px]"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 7l3.5 3.5L12 3.5" />
                      </svg>
                    ) : (
                      <svg
                        className="w-[14px] h-[14px] text-[#5A5550] shrink-0 mt-[3px]"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 3l8 8M11 3l-8 8" />
                      </svg>
                    )}
                    <span className={`font-sans text-[0.9375rem] ${col.pointColor} leading-snug`}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16 pt-10 border-t border-[#2D2A27] flex flex-col items-start gap-4">
          <p className="font-sans font-normal text-body-md text-[#C5C0BB] max-w-[44ch]">
            The BD audit is free. Twenty minutes and you will know exactly where your mandate pipeline is breaking, and whether the build is the right fix.
          </p>
          <Button href="/diagnostic" variant="primary" size="md">
            Book a BD Audit
          </Button>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
