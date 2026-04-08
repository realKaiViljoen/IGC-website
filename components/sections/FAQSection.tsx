'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'

const faqs = [
  {
    q: "What does R15,000 per month actually cover?",
    a: "The retainer covers ongoing system operation after the Sprint: ad management, WhatsApp automation monitoring, reputation engine, and monthly reporting. The 90-Day Sprint itself is a separate fixed-fee engagement. We quote the Sprint fee on the diagnostic call once we understand your clinic's setup.",
  },
  {
    q: "We've worked with agencies before and it didn't work. What's different?",
    a: "Agencies sell campaigns. We build infrastructure. At the end of 90 days, every asset we build (your ad accounts, automations, lead capture flows, reputation assets) is yours. You're not renting access to our platform. If you leave, you leave with a system, not a void.",
  },
  {
    q: "How hands-on do we need to be?",
    a: "Minimal. You review a monthly report, approve ad creative, and track one number: new consultations booked. We handle the rest.",
  },
  {
    q: "What if we don't hit 15 new consultations per month?",
    a: "We tell you upfront on the diagnostic whether your clinic is positioned to hit that target. If the fit isn't right, we say so and don't proceed. We'd rather turn down the engagement than overpromise.",
  },
  {
    q: "What happens after 90 days?",
    a: "You own the full system. Choose to keep us on retainer to operate it, or take it in-house. No lock-in, no penalty, no accounts held hostage.",
  },
  {
    q: "How quickly do results appear?",
    a: "First leads typically appear within weeks of paid acquisition going live. The 90-day timeline builds, tests, and stabilises the full system. By month three you have a predictable, compounding acquisition engine, not a one-time spike.",
  },
]

export function FAQSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <SectionWrapper className="bg-[#111110] text-[#F2EDE4]">
      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section label */}
        <motion.span variants={fadeUp} className="gold-line mb-6 block" aria-hidden="true" />
        <motion.p variants={fadeUp}>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5"/>
              <path d="M6 6.5c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 1.5-2 3"/>
              <circle cx="8" cy="11.5" r=".5" fill="currentColor"/>
            </svg>
            <p className="section-label">Common Questions</p>
          </div>
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="font-display text-display-md text-[#F2EDE4] mb-16 max-w-[24ch]"
        >
          Questions worth asking<br />before you commit.
        </motion.h2>

        {/* FAQ list */}
        <motion.div variants={stagger} className="max-w-[720px]">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="border-t border-[#2D2A27]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start justify-between gap-6 py-6 text-left cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9922A] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111110]"
                aria-expanded={openIndex === index}
              >
                <span className={`font-sans font-medium text-xl leading-snug transition-colors duration-300 ${openIndex === index ? 'text-[#F2EDE4]' : 'text-[#C5C0BB]'}`}>
                  {faq.q}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className={`shrink-0 text-[#C9922A] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-l-2 border-[#C9922A]/40 pl-4">
                      <p className="font-sans text-body-md text-[#C5C0BB] font-normal max-w-[60ch] pb-6 pr-10">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div className="border-t border-[#2D2A27]" />
        </motion.div>
      </motion.div>
    </SectionWrapper>
  )
}
