import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { SprintSection } from '@/components/sections/SprintSection'
import { ComparisonSection } from '@/components/sections/ComparisonSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ClosingCTA } from '@/components/sections/ClosingCTA'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <TrustSection />
      <HowItWorksSection />
      <SprintSection />
      <ComparisonSection />
      <FAQSection />
      <ClosingCTA />
    </>
  )
}
