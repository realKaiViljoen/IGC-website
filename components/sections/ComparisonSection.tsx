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
    labelColor: '#C9922A',
    borderClass: 'border border-[#C9922A]/30 border-l-2 border-l-[#C9922A]/50',
    bgClass: 'bg-[#0D0D0C]',
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
      'R35,000+ salary before commission.',
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
        <motion.p variants={fadeUp}>
          <span className="gold-line mb-6 block" aria-hidden="true" />
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 2v12M2 5l6-3 6 3M2 11l6 3 6-3"/>
              <path d="M2 5v6M14 5v6"/>
            </svg>
            <p className="section-label">The honest comparison</p>
          </div>
        </motion.p>

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
              className={`${col.borderClass} ${col.bgClass} p-6 ${col.id === 'igc' ? 'order-first md:order-none' : ''}`}
            >
              {/* Column label */}
              <p
                className="font-mono text-[11px] tracking-[0.14em] uppercase font-medium mb-6"
                style={{ color: col.labelColor }}
              >
                {col.label}
              </p>

              {/* Points */}
              <ul className="flex flex-col gap-3">
                {col.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="font-mono text-[#C5C0BB] text-[10px] mt-0.5 shrink-0">
                      ·
                    </span>
                    <span className={`font-sans text-base ${col.pointColor} leading-snug`}>
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
