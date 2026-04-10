'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'
import { Button } from '@/components/ui/Button'

const points = [
  {
    title: 'Built for recruiters. Not retailers.',
    body: 'We know what a mandate is. We know what a PSL is. We know why MPC calls feel desperate. This system was built for the way recruitment actually works, not for how a generic marketing playbook assumes it does.',
    link: null,
  },
  {
    title: 'A named operator. Not an account manager.',
    body: 'K.C. Viljoen runs the system personally. You have a direct line. No junior handoff, no contact rotation, no monthly standup with someone who started last week. One person. Full accountability.',
    link: {
      href: 'https://linkedin.com/in/kai-viljoen',
      label: 'View LinkedIn Profile →',
    },
  },
  {
    title: 'Small team. Serious output.',
    body: 'AI-augmented delivery means we operate at the output of a team five times our size. Senior operator attention on your mandate pipeline. Every week, not just at the monthly report.',
    link: null,
  },
]

export function TrustSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <SectionWrapper id="why-igc" className="bg-[#080808]">
      <div ref={ref}>
        {/* Section label */}
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 1l5.5 2.5v4c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7v-4L8 1z"/>
            <path d="M5.5 8l2 2 3-3"/>
          </svg>
          <p className="section-label">Why IGC</p>
        </div>

        {/* Section headline */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-display text-display-md text-[#F2EDE4] mb-16 max-w-[20ch]"
        >
          Built for recruitment.<br />Accountable for results.
        </motion.h2>

        {/* Proof points */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mt-12"
        >
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="relative border-t border-[#2D2A27] pt-8 overflow-hidden"
            >
              {/* Large background ordinal — texture */}
              <span
                className="absolute -top-4 -right-2 font-display text-[8rem] leading-none text-[#CF9B2E]/[0.08] select-none pointer-events-none"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Small ordinal label */}
              <p className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#C5C0BB] font-medium mb-4">
                {String(index + 1).padStart(2, '0')}
              </p>

              <h3 className="font-sans font-medium text-[#F2EDE4] text-display-sm mb-4">
                {point.title}
              </h3>

              <p className="font-sans font-normal text-body-md text-[#C5C0BB] mb-4 max-w-[32ch]">
                {point.body}
              </p>

              {point.link && (
                <a
                  href={point.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#C5C0BB] hover:text-[#F2EDE4] transition-colors duration-200"
                >
                  {point.link.label}
                </a>
              )}
            </motion.div>
          ))}

          <motion.div variants={fadeUp} className="md:col-span-3 mt-16 pt-10 border-t border-[#2D2A27]">
            {/* Social proof anchor */}
            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#857F74] mb-8">
              Working with recruitment agencies across Johannesburg, Cape Town, and Durban
            </p>
            <div className="border-l-2 border-[#CF9B2E]/30 pl-6">
              <Button href="/diagnostic" variant="primary" size="md">
                Book a BD Audit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
