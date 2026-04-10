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

      {/* Atmospheric depth — warm neutral ceiling. Gold is reserved for design elements only. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(242,237,228,0.04) 0%, transparent 60%)',
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
        <motion.span variants={fadeUp} className="gold-line mb-6 block" aria-hidden="true" />

        <motion.p variants={fadeUp} className="section-label mb-4">
          Limited availability
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-display text-display-lg text-[#F2EDE4] mb-8 max-w-[18ch]"
        >
          Your next build slot<br />is open.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="font-sans text-body-lg text-[#C5C0BB] font-normal max-w-[48ch] mb-12"
        >
          Build capacity is limited to 6 agencies per quarter. Book a 20-minute BD audit and find out whether your agency is a fit for the build. No commitment. No pitch. An honest look at your current mandate pipeline.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col items-start gap-5">
          <Button href="/diagnostic" variant="primary" size="lg">
            Claim Your Build Slot
          </Button>
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#C5C0BB] font-medium">
            20-minute BD audit. Free. We tell you honestly what we find.
          </p>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
