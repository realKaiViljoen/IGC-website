'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { fadeUp, fadeIn, lineReveal } from '@/lib/motion'

const ease = [0.16, 1, 0.3, 1] as const

const metrics = [
  { value: '5+', unit: 'Guaranteed', label: 'Client Conversations', note: 'In your first 30 days' },
  { value: '30', unit: 'Days', label: 'Full System Live', note: null },
  { value: 'R10k', unit: 'Per month', label: 'Retainer After Build', note: null },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -40])
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#080808] px-6 md:px-10 lg:px-16 overflow-hidden"
    >
      {/* ── Full-bleed precision grid ─────────────────────────── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="precision-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F2EDE4" strokeWidth="0.5" strokeOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#precision-grid)" />
        </svg>
      </motion.div>

      {/* ── Radial bloom — center top + horizon warmth ───────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 90% 55% at 50% -8%, rgba(201,146,42,0.24) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 35% at 50% 80%, rgba(201,146,42,0.04) 0%, transparent 65%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />

      {/* ── Ghost "01" — centered behind headline ─────────────── */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[28vw] leading-none text-[#F2EDE4]/[0.025] select-none pointer-events-none"
        aria-hidden="true"
      >
        01
      </span>

      {/* ── Main content ──────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-[900px] mx-auto flex flex-col items-center text-center"
      >
        {/* Gold line */}
        <motion.span
          variants={lineReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15, duration: 0.9, ease: [...ease] }}
          className="gold-line mb-6"
          aria-hidden="true"
        />

        {/* Badge pill */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.7, ease: [...ease] }}
          className="inline-flex items-center gap-2 border-2 border-[rgba(242,237,228,0.22)] rounded-full px-4 py-1.5 mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF7A]" aria-hidden="true" />
          <span className="font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[#A09890]">
            3 of 6 Q2 build slots remaining
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.45, duration: 0.9, ease: [...ease] }}
          className="font-display text-display-xl text-[#F2EDE4] mb-8"
        >
          We build the BD pipeline<br />your billers will not.
        </motion.h1>

        {/* Sub-headline — plain language what we do */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6, duration: 0.7, ease: [...ease] }}
          className="font-sans text-body-lg text-[#A09890] max-w-[52ch] mb-3"
        >
          LinkedIn sequences, conversion landing pages, automated follow-up, booking infrastructure. Built for recruitment agencies. Running in the background while your team fills roles.
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.68, duration: 0.7, ease: [...ease] }}
          className="font-sans text-body-md text-[#857F74] max-w-[44ch] mb-12"
        >
          Not campaigns. Not content. A mandate acquisition system built in 30 days and owned by you.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.78, duration: 0.6, ease: [...ease] }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/diagnostic" variant="primary" size="lg">
              Book a BD Audit
            </Button>
            <Button href="/services" variant="ghost" size="lg">
              How it works
            </Button>
          </div>
          <p className="font-mono font-medium text-[12px] tracking-[0.12em] uppercase text-[#A09890]">
            20-minute audit. Free. No pitch.
          </p>
        </motion.div>

        {/* ── Metric strip ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: [...ease] }}
          className="w-full mt-20 pt-8 border-t border-[rgba(242,237,228,0.08)] grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-6 divide-y divide-[rgba(242,237,228,0.06)] sm:divide-y-0"
          aria-hidden="true"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center gap-1 py-5 sm:py-0">
              <div className="flex items-baseline gap-1.5 justify-center">
                <span className="font-display text-[1.75rem] leading-tight text-[#F2EDE4]">
                  {metric.value}
                </span>
                <span className="font-mono font-medium text-[11px] tracking-[0.08em] text-[#A09890]">
                  {metric.unit}
                </span>
              </div>
              <p className="font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[#857F74]">
                {metric.label}
              </p>
              {metric.note && (
                <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#6E6762]/80">
                  {/* ⚠️ PLACEHOLDER — replace with real clinic name */}
                  {metric.note}
                </p>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll cue ────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: scrollCueOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5, ease: [...ease] }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-px h-8 bg-[#F2EDE4]/20" />
        <motion.div
          className="w-1 h-1 rounded-full bg-[#F2EDE4]/30"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
