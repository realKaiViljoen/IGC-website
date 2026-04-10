import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { SprintSection } from '@/components/sections/SprintSection'
import { ComparisonSection } from '@/components/sections/ComparisonSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ClosingCTA } from '@/components/sections/ClosingCTA'

export const metadata: Metadata = {
  title: 'IGC | BD Infrastructure for Recruitment Agencies in South Africa',
  description: 'We build mandate acquisition systems for recruitment agencies. LinkedIn sequences, landing pages, automated follow-up. 5 client conversations guaranteed in 30 days or we work free.',
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <ComparisonSection />
      <SprintSection />
      <TrustSection />
      <FAQSection />
      <ClosingCTA />
    </>
  )
}
