'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'

const testimonial = {
  quote: "We'd run Facebook ads with three different agencies over two years. Every month, a new strategy. Every month, a new reason the numbers weren't there. IGC didn't touch our ads in the first three weeks — they fixed the follow-up first. WhatsApp sequences, review generation, lead nurturing. Month three: 22 confirmed consultations. We'd been averaging six. I own everything they built. No dependency, no lock-in.",
  name: 'Dr. A.M.',
  role: 'Medical Aesthetics, Sandton',
  tag: 'Retainer client since Q4 2025',
  statPrimary: '22',
  statPrimaryLabel: 'New consultations, Month 3',
  statSecondary: '6',
  statSecondaryLabel: 'Monthly average prior year',
}

export function TestimonialSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <SectionWrapper className="bg-[#080808]">
      <div className="relative overflow-hidden">
        {/* Depth whisper gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 10% 60%, rgba(242,237,228,0.03) 0%, transparent 65%)' }}
        />

        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp}>
            <span className="gold-line mb-6 block" aria-hidden="true" />
            <span className="section-label mb-4 block">From the field</span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-20 items-start max-w-[900px]"
          >
            {/* Quote block */}
            <div>
              <span className="font-display text-[8rem] leading-none text-[#CF9B2E]/[0.15] select-none block mb-4" aria-hidden="true">"</span>
              <blockquote className="font-sans text-body-lg text-[#C5C0BB] font-normal leading-relaxed mb-8 max-w-[56ch]">
                {testimonial.quote}
              </blockquote>
              <div className="border-t border-[#2D2A27] pt-5">
                <p className="font-sans font-semibold text-[#F2EDE4] text-base">{testimonial.name}</p>
                <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#A09890] mt-1">{testimonial.role}</p>
                <p className="font-mono text-[10px] tracking-[0.10em] uppercase text-[#857F74] italic mt-1">{testimonial.tag}</p>
              </div>
            </div>

            {/* Stat callout */}
            <div className="bg-[#CF9B2E]/[0.06] border border-[#CF9B2E]/20 p-6 rounded-sm flex flex-col gap-5">
              <div>
                <p className="font-display text-display-lg text-[#F2EDE4] leading-none mb-1">{testimonial.statPrimary}</p>
                <p className="font-mono font-medium text-[11px] tracking-[0.14em] uppercase text-[#A09890]">{testimonial.statPrimaryLabel}</p>
              </div>
              <div className="border-t border-[#CF9B2E]/15 pt-4">
                <p className="font-display text-display-md text-[#F2EDE4]/60 leading-none mb-1">{testimonial.statSecondary}</p>
                <p className="font-mono font-medium text-[11px] tracking-[0.14em] uppercase text-[#857F74]">{testimonial.statSecondaryLabel}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
