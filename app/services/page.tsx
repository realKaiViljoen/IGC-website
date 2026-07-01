import type { Metadata } from 'next'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'The 30-Day BD Infrastructure Build: Services',
  description:
    'A fixed-scope, fixed-fee mandate acquisition system for recruitment agencies. Built in 30 days. No lock-in.',
}

const components = [
  {
    number: '01',
    title: 'LinkedIn Outreach Sequences',
    body: 'Automated sequences targeting your buyer persona: HR directors, CFOs, department heads. Built for your sector, your geography, your agency positioning.',
  },
  {
    number: '02',
    title: 'Mandate Acquisition Landing Page',
    body: 'A conversion-optimised page built to turn hiring manager traffic into booked calls. Case study led. No friction.',
  },
  {
    number: '03',
    title: 'CRM Setup and Pipeline Tracking',
    body: 'HubSpot configured for mandate pipeline tracking. You see exactly where every prospect is, and what happens next.',
  },
  {
    number: '04',
    title: 'Automated Follow-Up Sequences',
    body: 'Email and LinkedIn follow-up running on a structured cadence. Warm leads that did not book get nurtured until they do.',
  },
  {
    number: '05',
    title: 'Booking System Integration',
    body: 'Cal.com or Calendly integrated so a hiring manager can book directly from the landing page or outreach sequence. No back-and-forth.',
  },
  {
    number: '06',
    title: 'Monthly Pipeline Reporting',
    body: 'One report. One number that matters: new client conversations booked per month. Reported with full transparency.',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <SectionWrapper className="bg-[#101215] text-[#FAF9F7]">
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <p className="section-label mb-4">The BD Build</p>
        <h1 className="font-display text-display-lg text-[#FAF9F7] mb-6 max-w-[20ch]">
          The 30-Day BD Infrastructure Build
        </h1>
        <p className="font-sans text-body-lg text-[#E7E5E2] max-w-prose mb-6">
          A fixed-scope, fixed-fee engagement. We build your complete mandate acquisition infrastructure in 30 days.
        </p>
        <p className="font-sans text-body-md text-[#E7E5E2] max-w-prose mb-10">
          At the end, you own every asset. We operate it on retainer or hand it over to your team. No lock-in. No retainer trap. A system that generates new client conversations on a predictable cadence.
        </p>

        <div className="flex flex-wrap gap-8 border-t border-[#262A30] pt-10">
          {[
            { value: '5+', label: 'Guaranteed client conversations' },
            { value: '30 days', label: 'Full system live' },
            { value: 'R10,000', label: 'Monthly retainer after build' },
          ].map((stat) => (
            <div key={stat.value}>
              <p className="font-display text-display-md text-[#FAF9F7] leading-none mb-1">{stat.value}</p>
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#857F74]">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* What is included */}
      <SectionWrapper className="bg-[#0A0B0E]">
        <p className="section-label mb-4">What Is Included</p>
        <h2 className="font-display text-display-md text-[#FAF9F7] mb-14 max-w-[22ch]">
          Six system components. One deployment.
        </h2>

        <div className="flex flex-col divide-y divide-[#262A30]">
          {components.map((item) => (
            <div key={item.number} className="py-8 flex flex-col md:flex-row md:gap-12">
              <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#A8A6A3] mb-3 md:mb-0 md:w-12 shrink-0 pt-0.5">
                {item.number}
              </span>
              <div>
                <h3 className="font-sans font-medium text-[#FAF9F7] text-base mb-2">{item.title}</h3>
                <p className="font-sans text-body-md text-[#E7E5E2]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-[#101215]">
        <div className="flex flex-col items-start gap-4">
          <p className="font-sans text-body-lg text-[#FAF9F7] max-w-prose">
            Your Q2 2026 build slot is open.
          </p>
          <p className="font-sans text-body-md text-[#E7E5E2] max-w-prose">
            Book a 20-minute BD audit. No commitment. We tell you honestly whether your agency is a fit for the build.
          </p>
          <Button href="/diagnostic" variant="primary" size="lg">
            Book Your BD Audit
          </Button>
        </div>
      </SectionWrapper>
    </>
  )
}
