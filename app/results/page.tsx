import type { Metadata } from 'next'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'How We Measure: Our Verification Standard',
  description:
    'IGC publishes only what we can verify. Our measurement standard, the metrics we track, and the timeline for Cohort 1 results.',
}

const metrics = [
  {
    metric: 'New consultations booked',
    why: 'The only output that matters. Tracked per month, attributed to channel.',
  },
  {
    metric: 'Cost per consultation',
    why: 'Ad spend divided by consultations booked. Not leads. Confirmed bookings.',
  },
  {
    metric: 'WhatsApp response time',
    why: 'Average time from lead message to first reply. Target: under 3 minutes.',
  },
  {
    metric: 'Review score delta',
    why: 'Google review score before and after reputation engine deployment.',
  },
]

export default function ResultsPage() {
  return (
    <>
      {/* Hero */}
      <SectionWrapper className="bg-[#080808]">
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <p className="section-label mb-4">How We Measure</p>

        <h1 className="font-display text-display-lg text-[#F2EDE4] max-w-[18ch] mb-6">
          We only publish what we can prove.
        </h1>

        <p className="font-sans text-body-lg text-[#C5C0BB] max-w-prose mb-10">
          Most agencies publish the metrics that make them look good. We publish the metrics that tell the truth about acquisition performance. The standard below is what every IGC deployment is held to.
        </p>

        <div className="border-l-2 border-[rgba(201,146,42,0.4)] pl-6">
          <p className="font-sans text-body-md text-[#C5C0BB]">
            When we publish a case study, it will be specific, documented, and attributable. Not marketing copy dressed as proof. We will not publish metrics we cannot verify with receipts.
          </p>
        </div>
      </SectionWrapper>

      {/* Metrics scorecard */}
      <SectionWrapper className="bg-[#111110]">
        <p className="section-label mb-8">The Scorecard</p>
        <h2 className="font-display text-display-md text-[#F2EDE4] max-w-[20ch] mb-10">
          Four numbers. Everything else is noise.
        </h2>

        <div className="flex flex-col divide-y divide-[#2D2A27]">
          {metrics.map((item) => (
            <div key={item.metric} className="py-6 flex flex-col md:flex-row md:gap-12">
              <h3 className="font-sans font-medium text-[#F2EDE4] text-base md:w-64 shrink-0 mb-2 md:mb-0">
                {item.metric}
              </h3>
              <p className="font-sans text-body-md text-[#C5C0BB]">{item.why}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Cohort status */}
      <SectionWrapper className="bg-[#080808]">
        <p className="section-label mb-6">Cohort 1 Status</p>

        <div className="flex flex-col md:flex-row md:items-start gap-8 max-w-[800px]">
          <div className="border border-[#2D2A27] p-6 flex-1">
            <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#A09890] mb-3">Current Status</p>
            <p className="font-display text-display-md text-[#F2EDE4] leading-tight mb-2">In Progress</p>
            <p className="font-sans text-body-md text-[#C5C0BB]">4 clinics actively running the system. Deployment began Q1 2026.</p>
          </div>

          <div className="border border-[#2D2A27] p-6 flex-1">
            <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#A09890] mb-3">Results Published</p>
            <p className="font-display text-display-md text-[#F2EDE4] leading-tight mb-2">Q3 2026</p>
            <p className="font-sans text-body-md text-[#C5C0BB]">First verified case studies published after full 90-day deployment cycle completes.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-[#111110]">
        <div className="flex flex-col items-start gap-4">
          <p className="font-sans text-body-lg text-[#F2EDE4] max-w-prose">
            Want to be part of Cohort 2?
          </p>
          <p className="font-sans text-body-md text-[#C5C0BB] max-w-prose mb-4">
            Q2 2026 slots are being filled now. Book a diagnostic. We tell you honestly whether your clinic is a fit for the Sprint.
          </p>
          <Button href="/diagnostic" variant="primary" size="md">
            Book a Diagnostic
          </Button>
        </div>
      </SectionWrapper>
    </>
  )
}
