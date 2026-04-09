import type { Metadata } from 'next'
import { Playfair_Display, Inter, DM_Mono, Poppins } from 'next/font/google'
import './globals.css'
import { MotionProvider } from '@/components/ui/MotionProvider'
import { PublicShell } from '@/components/ui/PublicShell'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://integratedgrowthconsultants.com'),
  title: {
    default: 'Integrated Growth Consultants: Growth Infrastructure Operators',
    template: '%s | Integrated Growth Consultants',
  },
  description:
    'We build patient acquisition systems for med-aesthetic clinics. Infrastructure, not campaigns. The 90-Day Growth Sprint.',
  keywords: ['growth infrastructure', 'med-aesthetic marketing', 'patient acquisition', 'South Africa'],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Integrated Growth Consultants',
    title: 'Integrated Growth Consultants: Growth Infrastructure Operators',
    description:
      'We build patient acquisition systems for med-aesthetic clinics. Infrastructure, not campaigns.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Integrated Growth Consultants',
    description: 'Growth infrastructure operators. Patient acquisition systems for med-aesthetic clinics.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${dmMono.variable} ${poppins.variable}`}
    >
      <body className="bg-[#080808] text-[#F2EDE4] antialiased">
        <div className="grain" aria-hidden="true" />
        <PublicShell>
          <MotionProvider>
            <main>{children}</main>
          </MotionProvider>
        </PublicShell>
      </body>
    </html>
  )
}
