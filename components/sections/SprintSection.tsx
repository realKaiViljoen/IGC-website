'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { stagger, fadeUp } from '@/lib/motion'

// ─── CountUp ────────────────────────────────────────────────────────────────

function CountUp({
  to,
  suffix = '',
  duration = 2,
  format,
}: {
  to: number
  suffix?: string
  duration?: number
  format?: (n: number) => string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (!inView) return

    let start: number | null = null
    let raf: number

    function step(timestamp: number) {
      if (start === null) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / (duration * 1000), 1)
      // ease-out: decelerate as it approaches target
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * to))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  const display = format ? format(count) : String(count)

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

// ─── Stats config ────────────────────────────────────────────────────────────

const stats = [
  {
    id: 'retainer',
    label: 'Monthly retainer after build',
    node: (
      <CountUp
        to={10000}
        duration={2.2}
        format={(n) => 'R' + n.toLocaleString('en-ZA')}
      />
    ),
  },
  {
    id: 'days',
    label: 'Full system live',
    node: <CountUp to={30} suffix=" days" duration={2} />,
  },
  {
    id: 'conversations',
    label: 'Guaranteed client conversations',
    node: <CountUp to={5} suffix="+" duration={1.8} />,
  },
]

// ─── Section ─────────────────────────────────────────────────────────────────

export function SprintSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <SectionWrapper className="bg-[#111110] text-[#F2EDE4] overflow-hidden">
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Depth — gold atmospheric glow from right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 55% 65% at 95% 45%, rgba(201,146,42,0.10) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        {/* Section label */}
        <motion.p variants={fadeUp}>
          <span className="gold-line mb-6 block" aria-hidden="true" />
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 1L4 9h5l-2 6 7-8h-5l2-6z"/>
            </svg>
            <span className="section-label">The BD Build</span>
          </div>
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="font-display text-display-md text-[#F2EDE4] mb-6 max-w-[22ch]"
        >
          The 30-Day BD Infrastructure Build
        </motion.h2>

        {/* Body */}
        <motion.p
          variants={fadeUp}
          className="font-sans text-body-lg text-[#C5C0BB] font-normal max-w-prose mb-12"
        >
          A fixed-scope, fixed-fee engagement. We build your complete mandate acquisition infrastructure in 30 days. At the end, you own every asset. We operate it on retainer, or hand it over to your team. No lock-in.
        </motion.p>

        {/* Stat blocks — monumental numbers with decorative watermark */}
        <div className="relative">
          <span
            className="absolute top-0 right-0 font-display text-[#F2EDE4]/[0.02] select-none pointer-events-none leading-none"
            aria-hidden="true"
            style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', lineHeight: 1 }}
          >
            90
          </span>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-6 border-t border-[#302D2A] pt-12"
          >
            {stats.map((stat) => (
              <motion.div key={stat.id} variants={fadeUp} className="flex flex-col gap-2">
                <p className="font-display text-display-lg text-[#F2EDE4] leading-none">
                  {stat.node}
                </p>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#C5C0BB] font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Revenue callout — elevated */}
        <motion.div variants={fadeUp} className="border-l-2 border-[#CF9B2E]/40 pl-6 mb-10">
          <p className="font-display text-display-md text-[#F2EDE4] leading-tight mb-2">
            R40,000+
          </p>
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#C5C0BB] font-medium">
            One new retained mandate. Average placement fee, Gauteng tech and engineering.
          </p>
        </motion.div>

        {/* Risk reversal — ownership statements */}
        <motion.div variants={fadeUp} className="flex flex-col gap-2 mb-10">
          {[
            'You own every asset we build: LinkedIn sequences, landing pages, CRM setup, automation workflows.',
            'Fixed fee. No percentage of placement revenue. No performance billing.',
            'No lock-in. After 30 days, you decide whether we continue on retainer.',
          ].map((item, index) => (
            <div
              key={item}
              className={`flex items-start gap-4 py-3 px-4 rounded-sm ${index % 2 === 0 ? 'bg-[#F2EDE4]/[0.02]' : 'bg-transparent'}`}
            >
              <span
                className="font-display text-[#CF9B2E] shrink-0 leading-none"
                style={{ fontSize: 'clamp(1.375rem,2.2vw,1.875rem)' }}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-sans text-body-md text-[#C5C0BB] font-normal mt-1">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* Guarantee block */}
        <motion.div
          variants={fadeUp}
          className="mb-10 p-6 border border-[#CF9B2E]/20 bg-[#CF9B2E]/[0.04] rounded-sm"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#CF9B2E] font-medium mb-2">
            The guarantee
          </p>
          <p className="font-sans text-body-lg text-[#F2EDE4] font-normal leading-snug mb-1">
            5 qualified client conversations in your first 30 days.
          </p>
          <p className="font-sans text-body-md text-[#C5C0BB] font-normal">
            If we miss that mark, we keep running the system at no charge until we deliver. Unconditional.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <Button href="/diagnostic" variant="primary">
            Book a BD Audit
          </Button>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
