'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'

export function ClosingCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <SectionWrapper className="bg-[#080808] min-h-screen flex items-center overflow-hidden relative">
      {/* Large decorative background text */}
      <span
        className="absolute bottom-0 left-0 right-0 font-display text-[#F2EDE4]/[0.04] select-none pointer-events-none text-center leading-none"
        style={{ fontSize: 'clamp(5rem, 20vw, 22rem)', lineHeight: 0.85 }}
        aria-hidden="true"
      >
        IGC
      </span>

      {/* Radial bloom — maximum gold warmth top right + counter-bloom bottom left + subtle centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 70% 55% at 100% -5%, rgba(201,146,42,0.28) 0%, transparent 55%)',
            'radial-gradient(ellipse 50% 40% at 0% 100%, rgba(201,146,42,0.10) 0%, transparent 55%)',
            'radial-gradient(ellipse 40% 30% at 50% 50%, rgba(201,146,42,0.03) 0%, transparent 70%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="w-full relative z-10"
      >
        <motion.span variants={fadeUp} className="gold-line mb-8 block" aria-hidden="true" />

        <motion.p variants={fadeUp} className="section-label mb-6">
          Limited availability
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-display text-display-lg text-[#F2EDE4] mb-8 max-w-[18ch]"
        >
          Your Q2 2026 build slot<br />is open.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="font-sans text-body-lg text-[#C5C0BB] font-normal max-w-[48ch] mb-12"
        >
          Three of six Q2 slots are filled. Book a 20-minute BD audit and find out whether your agency is a fit for the build. No commitment. No pitch. An honest look at your current mandate pipeline.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col items-start gap-5">
          <Button href="/diagnostic" variant="primary" size="lg">
            Claim Your Q2 Slot
          </Button>
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#C5C0BB] font-medium">
            20-minute BD audit. Free. We tell you honestly what we find.
          </p>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
