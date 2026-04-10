'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { stagger, fadeUp } from '@/lib/motion'

const faqs = [
  {
    q: "What does R10,000 per month actually cover?",
    a: "The retainer covers ongoing system operation after the build: sequence monitoring, landing page optimisation, CRM maintenance, and monthly pipeline reporting. The 30-day build is a separate, fixed-fee engagement. Investment ranges from R25,000–R40,000 depending on your agency's sector focus and the complexity of your outreach targeting. Exact fee is quoted on the audit call after we understand your specific situation.",
  },
  {
    q: "We have worked with marketing agencies before. It did not work. What is different?",
    a: "Marketing agencies sell content and impressions. We build mandate acquisition infrastructure. LinkedIn outreach sequences, a landing page built to convert hiring manager traffic, automated follow-up, booking integration. At the end of 30 days, every asset is yours. If you leave, you leave with a working system. Not a void.",
  },
  {
    q: "How hands-on does our team need to be?",
    a: "Minimal. You approve the outreach messaging before it goes live, review a monthly pipeline report, and track one number: new client conversations booked per month. Your billers focus on filling roles. We run the BD system.",
  },
  {
    q: "What if we do not get 5 client conversations in the first 30 days?",
    a: "We tell you on the audit call whether your agency is positioned to hit that target. If the fit is wrong, we say so and do not proceed. If we proceed and miss the guarantee, we keep running the system at no charge until we deliver. Unconditional.",
  },
  {
    q: "What happens after 30 days?",
    a: "You own the full system. Keep us on retainer to operate it, take it in-house, or pause it. No lock-in. No accounts held back. No penalty for leaving.",
  },
  {
    q: "How quickly will we see new conversations coming in?",
    a: "LinkedIn sequences typically generate the first replies within the first two weeks of going live. The 30-day build tests and optimises the full system so that by month two you have a predictable flow of new client conversations running without manual BD from your team.",
  },
  {
    q: "Do you work with agencies outside Gauteng?",
    a: "Yes. The system is built for LinkedIn outreach, which is geography-agnostic. We have active builds across Gauteng, Western Cape, and KZN. The audit call is remote. The build is remote. Your target hiring managers are wherever they are.",
  },
  {
    q: "Can we see an example of what you build?",
    a: "On the audit call, we walk through the system architecture and show you examples from active deployments — anonymised where client agreements require it. We do not publish a public portfolio because every build is customised to the agency's sector, geography, and buyer persona. The audit itself is the demo.",
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
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5"/>
              <path d="M6 6.5c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 1.5-2 3"/>
              <circle cx="8" cy="11.5" r=".5" fill="currentColor"/>
            </svg>
            <p className="section-label">Common Questions</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="font-display text-display-md text-[#F2EDE4] mb-16 max-w-[24ch]"
        >
          Questions worth asking<br />before you sign anything.
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
                className="w-full flex items-start justify-between gap-6 py-6 text-left cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CF9B2E] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111110]"
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
                  className={`shrink-0 text-[#CF9B2E] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
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
                    <div className="border-l-2 border-[#CF9B2E]/40 pl-4">
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
