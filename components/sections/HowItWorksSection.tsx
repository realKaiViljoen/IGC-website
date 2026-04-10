'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'
import { Button } from '@/components/ui/Button'

const steps = [
  {
    number: '01',
    title: 'Audit',
    subtitle: 'Map your pipeline leaks',
    body: 'We map your current BD setup: what you have, where it breaks, and which hiring managers you are not reaching. A clear diagnosis before a single sequence goes live.',
    icon: (
      <svg className="w-5 h-5 text-[#CF9B2E]/60" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="9" r="6"/>
        <path d="M15 15l3 3"/>
        <path d="M9 6v3l2 2"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Build',
    subtitle: 'Deploy your BD infrastructure',
    body: 'LinkedIn outreach sequences, conversion landing page, CRM, automated follow-up, booking system. Your complete mandate acquisition infrastructure, deployed and tested in 30 days.',
    icon: (
      <svg className="w-5 h-5 text-[#CF9B2E]/60" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2l1.5 5h5l-4 3 1.5 5L10 12l-4 3 1.5-5-4-3h5z"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Run',
    subtitle: 'Operate and optimise monthly',
    body: 'The system runs continuously. You track one number: new client conversations booked per month. We handle everything else.',
    icon: (
      <svg className="w-5 h-5 text-[#CF9B2E]/60" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="10" r="3"/>
        <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.5 3.5l1.4 1.4M15.1 15.1l1.4 1.4M3.5 16.5l1.4-1.4M15.1 4.9l1.4-1.4"/>
      </svg>
    ),
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <SectionWrapper id="how-it-works" className="bg-[#111110] text-[#F2EDE4] overflow-hidden">
      <div ref={ref}>
        {/* Section label */}
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="3" cy="8" r="1.5"/>
            <circle cx="13" cy="8" r="1.5"/>
            <circle cx="8" cy="3" r="1.5"/>
            <path d="M4.5 8h7M8 4.5v7"/>
          </svg>
          <p className="section-label">How It Works</p>
        </div>

        {/* Section headline */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-display text-display-md text-[#F2EDE4] mb-20 max-w-[18ch]"
        >
          Three steps.<br className="hidden md:inline" />One outcome.
        </motion.h2>

        {/* Steps */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 relative"
        >
          <div
            className="hidden md:block absolute top-[1.5rem] left-[2rem] right-[2rem] h-px bg-gradient-to-r from-[#CF9B2E]/0 via-[#CF9B2E]/20 to-[#CF9B2E]/0"
            aria-hidden="true"
          />
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="relative border-t border-[#302D2A] pt-8 group"
            >
              {/* Enormous background number — texture */}
              <span
                className="absolute -top-8 left-0 font-display text-[12rem] leading-none text-[#F2EDE4]/[0.025] select-none pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.06]"
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Step icon */}
              <div className="relative z-10 mb-4">
                {step.icon}
              </div>

              {/* Small step label */}
              <p className="relative font-mono font-medium text-[11px] tracking-[0.16em] uppercase text-[#C5C0BB] mb-5 z-10">
                Step {step.number}
              </p>

              <h3 className="relative font-sans font-medium text-display-sm text-[#F2EDE4] mb-1 z-10">
                {step.title}
              </h3>

              {step.subtitle && (
                <p className="relative font-mono text-[11px] tracking-[0.12em] uppercase text-[#CF9B2E]/70 mb-4 z-10">
                  {step.subtitle}
                </p>
              )}

              <p className="relative font-sans font-normal text-body-md text-[#C5C0BB] max-w-[30ch] z-10">
                {step.body}
              </p>
            </motion.div>
          ))}

          <motion.div variants={fadeUp} className="md:col-span-3 mt-16 pt-10 border-t border-[#2D2A27]">
            <p className="font-sans font-normal text-body-md text-[#C5C0BB] mb-6 max-w-[44ch]">
              Want to know exactly where your mandate pipeline is breaking? The audit takes 20 minutes.
            </p>
            <Button href="/diagnostic" variant="primary" size="md">
              Book a BD Audit
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
