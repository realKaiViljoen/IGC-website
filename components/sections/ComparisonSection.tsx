'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'
import { Button } from '@/components/ui/Button'

const columns = [
  {
    id: 'agency',
    label: 'Digital Agency',
    labelColor: '#857F74',
    borderClass: 'border border-[#2D2A27]',
    bgClass: 'bg-[#080808]',
    pointColor: 'text-[#C5C0BB]',
    points: [
      'Rents you their service. Accounts stay with them.',
      'Optimises for their metrics, not your consultations',
      'No system left when the contract ends',
      'Account managers, not operators',
      'New team member every few months',
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
      'You own every asset we build',
      'One named operator accountable for your results',
      'Full system operational in 90 days',
      'AI-augmented: senior attention, scaled output',
      'Fixed fee. No lock-in.',
    ],
  },
  {
    id: 'hire',
    label: 'In-House Hire',
    labelColor: '#857F74',
    borderClass: 'border border-[#2D2A27]',
    bgClass: 'bg-[#080808]',
    pointColor: 'text-[#C5C0BB]',
    points: [
      'R30,000+ salary before benefits',
      '3-month ramp before meaningful output',
      'Generalist, not a specialist system-builder',
      'No infrastructure compounds when they leave',
      'You manage a person, not a system',
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
          Why not hire an agency or a marketing manager?
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
            The diagnostic is free. In 20 minutes you will know exactly where your clinic is leaking patients, and whether the Sprint is the right fix.
          </p>
          <Button href="/diagnostic" variant="primary" size="md">
            Book a Diagnostic
          </Button>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
