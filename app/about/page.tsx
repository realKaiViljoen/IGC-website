'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="LinkedIn"
    role="img"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <SectionWrapper className="bg-[#080808]">
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-display-lg text-[#F2EDE4] max-w-[16ch] mb-8"
        >
          We are operators, not vendors.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-body-lg text-[#C5C0BB] max-w-prose"
        >
          IGC was built on one premise: most agencies sell activity. We sell outcomes. We build the infrastructure that makes acquisition predictable. Then we run it.
        </motion.p>
      </SectionWrapper>

      {/* Founder */}
      <SectionWrapper className="bg-[#111110]">
        <p className="section-label mb-8">The Principal</p>

        <div className="max-w-prose">
          <h2 className="font-display text-display-md text-[#F2EDE4] mb-2">
            K.C. Viljoen
          </h2>
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#C5C0BB] mb-6">
            Group Chair, Ingenuity Industries South Africa
          </p>

          <p className="font-sans text-body-md text-[#C5C0BB] mb-6">
            Growth infrastructure operator. Built acquisition systems across consumer, services, and technology sectors in South Africa. Focused on one question: what actually moves the booking number?
          </p>

          <p className="font-sans text-body-md text-[#C5C0BB] mb-8">
            IGC is that capability, applied specifically to med-aesthetic clinics. If your clinic is booking fewer consultations than it should be, this is where to start.
          </p>

          <a
            href="https://linkedin.com/in/kai-viljoen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[#C5C0BB] hover:text-[#F2EDE4] transition-colors duration-200"
          >
            <LinkedInIcon />
            View LinkedIn Profile
          </a>
        </div>
      </SectionWrapper>

      {/* Philosophy */}
      <SectionWrapper className="bg-[#080808]">
        <p className="section-label mb-8">The Approach</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[900px]">
          {[
            {
              title: 'Systems over campaigns',
              body: 'Campaigns are events. Systems are infrastructure. Build the latter and acquisition becomes repeatable, measurable, owned by your clinic.',
            },
            {
              title: 'Operators, not consultants',
              body: 'We do not advise and leave. We build and run. The difference in output is not marginal. It is categorical.',
            },
            {
              title: 'AI-augmented delivery',
              body: 'Small team. Disproportionate output. AI tooling means we operate at the level of a team five times our size.',
            },
            {
              title: 'No lock-in by design',
              body: 'You own the infrastructure we build. The retainer is operational, not contractual dependency. Walk away any time.',
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-[#2D2A27] pt-6">
              <h3 className="font-sans font-medium text-[#F2EDE4] text-base mb-3">{item.title}</h3>
              <p className="font-sans text-body-md text-[#C5C0BB]">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-[#111110]">
        <div className="flex flex-col items-start gap-4">
          <p className="font-sans text-body-lg text-[#F2EDE4]">
            Next step: see the full Sprint.
          </p>
          <Button href="/services" variant="primary" size="md">
            See the Sprint
          </Button>
        </div>
      </SectionWrapper>
    </>
  )
}
