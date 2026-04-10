'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'

const painPoints = [
  {
    number: '01',
    statement: 'You ran LinkedIn ads. Impressions climbed. Nobody called.',
    consequence: 'LinkedIn spend without conversion infrastructure is a brand exercise. Mandates come from conversations, not impressions. You paid to be visible. Nobody responded.',
  },
  {
    number: '02',
    statement: 'You hired a marketing agency. They delivered a content calendar. Not a mandate.',
    consequence: 'Agencies optimise for what they can report: followers, sessions, engagement. None of those pay a placement fee. The brief was mandate pipeline. They delivered posts.',
  },
  {
    number: '03',
    statement: 'Your billers are excellent at filling roles. They will not do cold BD.',
    consequence: 'You hired recruiters, not salespeople. Asking your team to also run client development is asking pilots to build the plane. The BD responsibility falls on you, and you are running out of hours.',
  },
  {
    number: '04',
    statement: 'You have tried to do BD yourself. It works when you have time. You never have time.',
    consequence: 'Owner-led BD is the most common pipeline in independent recruitment. It is also the most fragile. One busy quarter and the pipeline goes cold. The feast-famine cycle is not a motivation problem — it is a systems problem.',
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
          background: 'radial-gradient(ellipse 70% 50% at 15% 0%, rgba(207,155,46,0.05) 0%, transparent 60%)',
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
            <p className="section-label">The pipeline problem</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="font-display text-display-md text-[#F2EDE4] mb-12 max-w-[26ch]"
        >
          Your agency is good.<br className="hidden md:inline" />Your mandate pipeline is not.
        </motion.h2>

        {/* Expansion rows */}
        <motion.div variants={stagger} className="mb-12">
          {painPoints.map((item) => (
            <motion.div
              key={item.number}
              variants={fadeUp}
              className="relative group border-t border-b border-[#2D2A27] py-7 cursor-pointer -mb-px"
              role="button"
              tabIndex={0}
              aria-expanded={open === item.number}
              onHoverStart={canHover ? () => setOpen(item.number) : undefined}
              onHoverEnd={canHover ? () => setOpen(null) : undefined}
              onClick={!canHover ? () => setOpen(open === item.number ? null : item.number) : undefined}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === item.number ? null : item.number) } }}
            >
              <div className="flex items-start gap-8 md:gap-12">
                {/* Gold ordinal */}
                <span
                  className="font-display text-[#CF9B2E] leading-none shrink-0 mt-1 select-none"
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
                  className={`w-4 h-4 shrink-0 mt-2 transition-all duration-300 ${open === item.number ? 'text-[#CF9B2E] translate-x-1' : 'text-[#2D2A27]'}`}
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
          This is not a content problem. It is not a LinkedIn presence problem. It is a BD infrastructure problem, and it has a specific fix.
        </motion.p>
      </motion.div>
    </SectionWrapper>
  )
}
