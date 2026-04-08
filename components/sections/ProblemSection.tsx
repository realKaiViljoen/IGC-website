'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'

const painPoints = [
  {
    number: '01',
    statement: 'You ran ads. Enquiries came in. Most never booked.',
    consequence: 'Every unbooked enquiry costs R500–R1,200 in ad spend. You paid to find them. You lost them at the follow-up.',
  },
  {
    number: '02',
    statement: 'You hired an agency. They sent monthly reports measuring reach, not consultations.',
    consequence: 'Agencies optimise for metrics they can defend. Consultation bookings are not in their brief.',
  },
  {
    number: '03',
    statement: 'You have a strong clinical reputation. Your appointment book does not reflect it.',
    consequence: 'Reputation is your strongest asset. An empty pipeline is a systems failure, not a market failure.',
  },
  {
    number: '04',
    statement: 'You are not sure what is leaking, or where to start.',
    consequence: 'Without a diagnosed leak, every fix is a guess. Most clinics are losing patients at the same two points.',
  },
]

export function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [open, setOpen] = useState<string | null>(null)
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  return (
    <SectionWrapper className="bg-[#111110]">
      {/* Whisper depth gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 15% 0%, rgba(201,146,42,0.05) 0%, transparent 60%)',
        }}
      />

      <span className="gold-line mb-6 block" aria-hidden="true" />

      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section label */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-4 h-4 text-[#857F74] shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 8h2l2-5 3 10 2-7 2 4h1" />
            </svg>
            <p className="section-label">The situation</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="font-display text-display-md text-[#F2EDE4] mb-12 max-w-[26ch]"
        >
          Your clinic is good.<br />Your pipeline is not.
        </motion.h2>

        {/* Expansion rows */}
        <motion.div variants={stagger} className="mb-12">
          {painPoints.map((item) => (
            <motion.div
              key={item.number}
              variants={fadeUp}
              className="relative group border-t border-b border-[#2D2A27] py-7 cursor-pointer -mb-px"
              onHoverStart={canHover ? () => setOpen(item.number) : undefined}
              onHoverEnd={canHover ? () => setOpen(null) : undefined}
              onClick={!canHover ? () => setOpen(open === item.number ? null : item.number) : undefined}
            >
              <div className="flex items-start gap-8 md:gap-12">
                {/* Gold ordinal */}
                <span
                  className="font-display text-[#C9922A] leading-none shrink-0 mt-1 select-none"
                  style={{ fontSize: 'clamp(1.375rem,2.2vw,1.875rem)' }}
                >
                  {item.number}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-body-lg text-[#F2EDE4] leading-snug">
                    {item.statement}
                  </p>

                  <AnimatePresence>
                    {open === item.number && (
                      <motion.p
                        key="consequence"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans text-body-md text-[#A09890] leading-relaxed overflow-hidden"
                      >
                        {item.consequence}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right indicator — arrow that brightens on hover */}
                <svg
                  className={`w-4 h-4 shrink-0 mt-2 transition-all duration-300 ${open === item.number ? 'text-[#C9922A] translate-x-1' : 'text-[#2D2A27]'}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>

              {/* Row hover background */}
              <div
                className={`absolute inset-0 -mx-6 md:-mx-10 lg:-mx-16 transition-opacity duration-300 pointer-events-none ${open === item.number ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(242,237,228,0.025) 0%, transparent 70%)' }}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Closing paragraph */}
        <motion.p
          variants={fadeUp}
          className="font-sans text-body-lg text-[#C5C0BB] max-w-[52ch]"
        >
          This is not a branding problem. It is not a content problem. It is a systems problem, and it has a specific fix.
        </motion.p>
      </motion.div>
    </SectionWrapper>
  )
}
