import type { Metadata } from 'next'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'The 90-Day Growth Sprint: Services',
  description:
    'A fixed-scope, fixed-fee patient acquisition system for med-aesthetic clinics. Built in 90 days. No lock-in.',
}

const components = [
  {
    number: '01',
    title: 'Paid Acquisition',
    body: 'Meta and Google campaigns built for patient intent, not vanity metrics. Every rand tracked to consultation booked.',
  },
  {
    number: '02',
    title: 'Lead Capture Funnel',
    body: 'Landing pages and intake flows engineered to convert interest into booked appointments. No friction, no leakage.',
  },
  {
    number: '03',
    title: 'WhatsApp Automation',
    body: 'Instant follow-up, appointment reminders, and re-engagement sequences. The system works while you treat patients.',
  },
  {
    number: '04',
    title: 'Reputation Engine',
    body: 'Systematic review generation that builds your Google and social proof without manual chasing.',
  },
  {
    number: '05',
    title: 'Monthly Reporting',
    body: 'One dashboard. One number that matters: new consultations booked per month. Every month, reported with full transparency.',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <SectionWrapper className="bg-[#111110] text-[#F2EDE4]">
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <p className="section-label mb-4">The Entry Point</p>
        <h1 className="font-display text-display-lg text-[#F2EDE4] mb-6 max-w-[20ch]">
          The 90-Day Growth Sprint
        </h1>
        <p className="font-sans text-body-lg text-[#C5C0BB] max-w-prose mb-6">
          A fixed-scope, fixed-fee engagement. We build your full patient acquisition system in 90 days.
        </p>
        <p className="font-sans text-body-md text-[#C5C0BB] max-w-prose mb-10">
          At the end, you own the infrastructure. We operate it on retainer or hand it over to your team. No lock-in. No retainer trap. A built system that generates new consultations on a predictable cadence.
        </p>

        <div className="flex flex-wrap gap-8 border-t border-[#2D2A27] pt-10">
          {[
            { value: '15+', label: 'New consultations per month' },
            { value: '90 days', label: 'Full system live' },
            { value: 'R15,000', label: 'Monthly retainer' },
          ].map((stat) => (
            <div key={stat.value}>
              <p className="font-display text-display-md text-[#F2EDE4] leading-none mb-1">{stat.value}</p>
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#857F74]">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* What is included */}
      <SectionWrapper className="bg-[#080808]">
        <p className="section-label mb-4">What Is Included</p>
        <h2 className="font-display text-display-md text-[#F2EDE4] mb-14 max-w-[22ch]">
          Five system components. One deployment.
        </h2>

        <div className="flex flex-col divide-y divide-[#2D2A27]">
          {components.map((item) => (
            <div key={item.number} className="py-8 flex flex-col md:flex-row md:gap-12">
              <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#A09890] mb-3 md:mb-0 md:w-12 shrink-0 pt-0.5">
                {item.number}
              </span>
              <div>
                <h3 className="font-sans font-medium text-[#F2EDE4] text-base mb-2">{item.title}</h3>
                <p className="font-sans text-body-md text-[#C5C0BB]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-[#111110]">
        <div className="flex flex-col items-start gap-4">
          <p className="font-sans text-body-lg text-[#F2EDE4] max-w-prose">
            Your Q2 2026 slot is open.
          </p>
          <p className="font-sans text-body-md text-[#C5C0BB] max-w-prose">
            Book a 20-minute diagnostic. No commitment. We tell you honestly whether your clinic is a fit.
          </p>
          <Button href="/diagnostic" variant="primary" size="lg">
            Book Your Diagnostic
          </Button>
        </div>
      </SectionWrapper>
    </>
  )
}
