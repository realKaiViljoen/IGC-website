import type { Metadata } from 'next'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Book a Call: 20-Minute Diagnostic',
  description:
    'Book a 20-minute diagnostic call with IGC. We look at your current acquisition setup and tell you honestly whether we can move the needle.',
}

export default function ContactPage() {
  return (
    <>
      <SectionWrapper className="bg-[#080808]">
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <p className="section-label mb-4">Contact</p>

        <h1 className="font-display text-display-lg text-[#F2EDE4] max-w-[14ch] mb-4">
          Book Your Diagnostic
        </h1>
        <p className="font-sans text-body-lg text-[#C5C0BB] max-w-prose mb-12">
          Not a sales call. 20 minutes. We look at your current acquisition setup and tell you exactly where the leakage is. Then we tell you honestly whether we are the right fix.
        </p>

        {/* Netlify Form */}
        <form
          name="contact"
          method="POST"
          action="/thank-you/"
          data-netlify="true"
          className="max-w-[640px] flex flex-col gap-6"
        >
          <input type="hidden" name="form-name" value="contact" />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="section-label">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full bg-transparent border border-[#2D2A27] px-4 py-3 font-sans text-sm text-[#F2EDE4] placeholder:text-[#857F74] focus:outline-none focus:border-[#F2EDE4]/50 transition-colors duration-200"
              placeholder="Full name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="clinic" className="section-label">Clinic Name</label>
            <input
              id="clinic"
              name="clinic"
              type="text"
              required
              className="w-full bg-transparent border border-[#2D2A27] px-4 py-3 font-sans text-sm text-[#F2EDE4] placeholder:text-[#857F74] focus:outline-none focus:border-[#F2EDE4]/50 transition-colors duration-200"
              placeholder="Clinic or practice name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="section-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-transparent border border-[#2D2A27] px-4 py-3 font-sans text-sm text-[#F2EDE4] placeholder:text-[#857F74] focus:outline-none focus:border-[#F2EDE4]/50 transition-colors duration-200"
              placeholder="you@clinic.co.za"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="section-label">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full bg-transparent border border-[#2D2A27] px-4 py-3 font-sans text-sm text-[#F2EDE4] placeholder:text-[#857F74] focus:outline-none focus:border-[#F2EDE4]/50 transition-colors duration-200"
              placeholder="+27 __ ___ ____"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="challenge" className="section-label">
              What is your biggest challenge right now?
            </label>
            <textarea
              id="challenge"
              name="challenge"
              rows={4}
              className="w-full bg-transparent border border-[#2D2A27] px-4 py-3 font-sans text-sm text-[#F2EDE4] placeholder:text-[#857F74] focus:outline-none focus:border-[#F2EDE4]/50 transition-colors duration-200 resize-none"
              placeholder="Be specific. It helps us prepare."
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" variant="primary" size="md">
              Request Your Diagnostic
            </Button>
            <p className="font-mono text-[11px] tracking-[0.10em] text-[#857F74]">
              By submitting you agree to our{' '}
              <a href="/privacy" className="underline underline-offset-2 hover:text-[#A09890] transition-colors duration-200">
                Privacy Policy
              </a>
              . We do not share your data with third parties.
            </p>
          </div>
        </form>
        <p className="font-mono font-medium text-[12px] tracking-[0.10em] uppercase text-[#857F74] mt-6">
          We reply within one business day to confirm your diagnostic time.
        </p>
      </SectionWrapper>
    </>
  )
}
