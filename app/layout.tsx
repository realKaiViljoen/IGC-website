import type { Metadata } from 'next'
import { Playfair_Display, Inter, DM_Mono } from 'next/font/google'
import './globals.css'
import { MotionProvider } from '@/components/ui/MotionProvider'
import { PublicShell } from '@/components/ui/PublicShell'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'IGC | BD Infrastructure for Recruitment Agencies',
    template: '%s | IGC',
  },
  description:
    'We build mandate acquisition systems for recruitment agencies. LinkedIn sequences, landing pages, automated follow-up. 5 client conversations in 30 days or we work free.',
  keywords: [
    'recruitment agency BD',
    'mandate acquisition',
    'recruitment business development',
    'South Africa',
    'LinkedIn outreach',
  ],
  metadataBase: new URL('https://integratedgrowthconsultants.com'),
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Integrated Growth Consultants',
    title: 'IGC | BD Infrastructure for Recruitment Agencies',
    description:
      'We build mandate acquisition systems for recruitment agencies. 5 client conversations in 30 days.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IGC | BD Infrastructure for Recruitment Agencies',
    description:
      'We build mandate acquisition systems for recruitment agencies. 5 client conversations in 30 days or we work free.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body className="bg-[#080808] text-[#F2EDE4] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-[#F2EDE4] focus:text-[#080808] focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold"
        >
          Skip to main content
        </a>
        <div className="grain" aria-hidden="true" />
        <PublicShell>
          <MotionProvider>
            <main id="main-content">{children}</main>
          </MotionProvider>
        </PublicShell>
      </body>
    </html>
  )
}
