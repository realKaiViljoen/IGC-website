import type { Metadata } from 'next'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

export const metadata: Metadata = {
  title: 'Privacy Policy | IGC',
  description:
    'Privacy policy for Integrated Growth Consultants. How we collect, use, and protect your personal information in accordance with POPIA.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <SectionWrapper className="bg-[#080808]">
      <div className="max-w-[720px]">
        <span className="gold-line mb-6 block" aria-hidden="true" />
        <p className="section-label mb-4">Legal</p>

        <h1 className="font-display text-display-lg text-[#F2EDE4] mb-6">
          Privacy Policy
        </h1>
        <p className="font-sans text-body-md text-[#857F74] mb-16">
          Effective date: April 2026
        </p>

        {/* Section 1 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            1. Who We Are
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
            Integrated Growth Consultants ("IGC", "we", "us", or "our") is the responsible party in respect of personal information collected through this website, as contemplated by the Protection of Personal Information Act 4 of 2013 ("POPIA").
          </p>
          <p className="font-sans text-body-md text-[#C5C0BB]">
            <strong className="text-[#F2EDE4]">Responsible Party:</strong> K.C. Viljoen (Managing Director)<br />
            <strong className="text-[#F2EDE4]">Website:</strong> https://integratedgrowthconsultants.com<br />
            <strong className="text-[#F2EDE4]">Contact:</strong> hello@igc.co.za
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            2. What Personal Information We Collect and Why
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-6">
            We collect personal information only for specific, lawful purposes directly related to our services. We collect the minimum information necessary to fulfil those purposes.
          </p>

          <p className="font-sans text-body-md text-[#F2EDE4] mb-2 font-medium">Contact and Diagnostic Enquiry Form</p>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
            When you submit our enquiry form, we collect:
          </p>
          <ul className="list-none pl-0 mb-6 flex flex-col gap-2">
            {[
              'Full name',
              'Clinic or practice name',
              'Email address',
              'Phone number (optional)',
              'Description of your current growth challenge',
            ].map((item) => (
              <li key={item} className="font-sans text-body-md text-[#C5C0BB] flex items-start gap-3">
                <span className="text-[#857F74] mt-1 shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-8">
            <strong className="text-[#F2EDE4]">Purpose:</strong> To assess your enquiry, respond within one business day, and determine whether our services are an appropriate fit for your clinic.
          </p>

          <p className="font-sans text-body-md text-[#F2EDE4] mb-2 font-medium">Consultation Booking (Cal.com)</p>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
            When you book a diagnostic call via our Cal.com scheduling link, we collect:
          </p>
          <ul className="list-none pl-0 mb-6 flex flex-col gap-2">
            {[
              'Full name',
              'Email address',
              'Appointment date and time',
              'Any notes or questions submitted at booking',
            ].map((item) => (
              <li key={item} className="font-sans text-body-md text-[#C5C0BB] flex items-start gap-3">
                <span className="text-[#857F74] mt-1 shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="font-sans text-body-md text-[#C5C0BB]">
            <strong className="text-[#F2EDE4]">Purpose:</strong> To schedule and confirm a consultation call, send calendar invitations and reminders, and prepare for the diagnostic session.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            3. How We Use Your Information
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
            We process your personal information on the basis of your consent (given when you submit our form or book a call), and where necessary to fulfil our legitimate interest in responding to business enquiries. Specifically, we use your information to:
          </p>
          <ul className="list-none pl-0 flex flex-col gap-2">
            {[
              'Respond to your diagnostic enquiry and confirm your consultation',
              'Prepare relevant context ahead of a scheduled call',
              'Send calendar invitations and appointment reminders via Cal.com',
              'Communicate follow-up information directly related to your enquiry',
              'Comply with applicable legal obligations',
            ].map((item) => (
              <li key={item} className="font-sans text-body-md text-[#C5C0BB] flex items-start gap-3">
                <span className="text-[#857F74] mt-1 shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="font-sans text-body-md text-[#C5C0BB] mt-6">
            We do not sell, rent, or trade your personal information to any third party. We do not use your information for automated decision-making or profiling in a manner that produces legal or similarly significant effects.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            4. Storage and Security
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
            Your personal information is stored on servers operated by our third-party service providers (Netlify and Cal.com), which use industry-standard technical and organisational measures to protect data from unauthorised access, disclosure, alteration, or destruction.
          </p>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
            Access to your personal information within IGC is restricted to the responsible party and any personnel directly involved in managing enquiries. We implement reasonable administrative safeguards to prevent misuse of personal information.
          </p>
          <p className="font-sans text-body-md text-[#C5C0BB]">
            While we take appropriate steps to secure your information, no method of electronic transmission or storage is completely secure. In the event of a security compromise that is likely to prejudice you, we will notify you as required by POPIA.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            5. Third-Party Service Providers
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-6">
            We use the following third-party operators who may process personal information on our behalf. Each is bound by their own privacy and data protection policies and applicable law.
          </p>

          <div className="border-t border-[#2D2A27] pt-6 mb-6">
            <p className="font-sans text-body-md text-[#F2EDE4] font-medium mb-2">Netlify, Inc.</p>
            <p className="font-sans text-body-md text-[#C5C0BB] mb-1">
              <strong className="text-[#A09890]">Role:</strong> Website hosting and contact form processing.
            </p>
            <p className="font-sans text-body-md text-[#C5C0BB] mb-1">
              <strong className="text-[#A09890]">Data processed:</strong> Form submission data (name, clinic name, email, phone, challenge description), server logs, and visitor metadata.
            </p>
            <p className="font-sans text-body-md text-[#C5C0BB]">
              <strong className="text-[#A09890]">Privacy policy:</strong>{' '}
              <a
                href="https://www.netlify.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5C0BB] underline underline-offset-4 hover:text-[#F2EDE4] transition-colors duration-200"
              >
                netlify.com/privacy
              </a>
            </p>
          </div>

          <div className="border-t border-[#2D2A27] pt-6">
            <p className="font-sans text-body-md text-[#F2EDE4] font-medium mb-2">Cal.com, Inc.</p>
            <p className="font-sans text-body-md text-[#C5C0BB] mb-1">
              <strong className="text-[#A09890]">Role:</strong> Appointment scheduling and calendar management.
            </p>
            <p className="font-sans text-body-md text-[#C5C0BB] mb-1">
              <strong className="text-[#A09890]">Data processed:</strong> Name, email address, appointment date and time, and any notes submitted at the time of booking.
            </p>
            <p className="font-sans text-body-md text-[#C5C0BB]">
              <strong className="text-[#A09890]">Privacy policy:</strong>{' '}
              <a
                href="https://cal.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5C0BB] underline underline-offset-4 hover:text-[#F2EDE4] transition-colors duration-200"
              >
                cal.com/privacy
              </a>
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            6. Your Rights Under POPIA
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-6">
            As a data subject under POPIA, you have the following rights in relation to your personal information:
          </p>
          <ul className="list-none pl-0 flex flex-col gap-5">
            {[
              {
                right: 'Right of access',
                desc: 'You may request confirmation of whether we hold personal information about you, and obtain a record of that information.',
              },
              {
                right: 'Right to correction or deletion',
                desc: 'You may request that we correct inaccurate, irrelevant, excessive, out-of-date, incomplete, or misleading information. You may also request deletion where processing is no longer authorised.',
              },
              {
                right: 'Right to object',
                desc: 'You may object to the processing of your personal information on reasonable grounds. We will cease processing unless we can demonstrate legitimate grounds that override your interests.',
              },
              {
                right: 'Right to withdraw consent',
                desc: 'Where processing is based on your consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing prior to withdrawal.',
              },
              {
                right: 'Right to lodge a complaint',
                desc: 'You have the right to lodge a complaint with the Information Regulator if you believe your rights under POPIA have been infringed (see Section 8).',
              },
            ].map(({ right, desc }) => (
              <li key={right} className="flex flex-col gap-1">
                <span className="font-sans text-body-md text-[#F2EDE4] font-medium">{right}</span>
                <span className="font-sans text-body-md text-[#C5C0BB]">{desc}</span>
              </li>
            ))}
          </ul>
          <p className="font-sans text-body-md text-[#C5C0BB] mt-6">
            To exercise any of these rights, contact us at{' '}
            <a
              href="mailto:hello@igc.co.za"
              className="text-[#C5C0BB] underline underline-offset-4 hover:text-[#F2EDE4] transition-colors duration-200"
            >
              hello@igc.co.za
            </a>
            . We will respond within a reasonable period and no later than the timeframes prescribed by POPIA.
          </p>
        </div>

        {/* Section 7 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            7. Retention Period
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
            We retain personal information only for as long as necessary to fulfil the purpose for which it was collected, or as required by applicable law.
          </p>
          <ul className="list-none pl-0 flex flex-col gap-2">
            {[
              'Enquiry form submissions that do not lead to an engagement are retained for a maximum of 12 months, after which they are deleted.',
              'Booking records (via Cal.com) are retained for the duration of any engagement and up to 12 months thereafter, for administrative reference.',
              'Where an ongoing client relationship exists, relevant contact information is retained for the duration of that relationship and any legally required period thereafter.',
            ].map((item) => (
              <li key={item} className="font-sans text-body-md text-[#C5C0BB] flex items-start gap-3">
                <span className="text-[#857F74] mt-1 shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 8 */}
        <div className="mb-14">
          <h2 className="font-display text-display-sm text-[#F2EDE4] mb-4">
            8. Contact Us and How to Lodge a Complaint
          </h2>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-6">
            For any questions, requests, or concerns regarding this policy or the handling of your personal information, please contact the responsible party directly:
          </p>
          <p className="font-sans text-body-md text-[#C5C0BB] mb-10">
            <strong className="text-[#F2EDE4]">K.C. Viljoen — Managing Director, Integrated Growth Consultants</strong><br />
            <a
              href="mailto:hello@igc.co.za"
              className="text-[#C5C0BB] underline underline-offset-4 hover:text-[#F2EDE4] transition-colors duration-200"
            >
              hello@igc.co.za
            </a>
          </p>

          <div className="border-t border-[#2D2A27] pt-6">
            <p className="font-sans text-body-md text-[#C5C0BB] mb-4">
              If you are not satisfied with our response, you have the right to lodge a complaint with South Africa's Information Regulator:
            </p>
            <p className="font-sans text-body-md text-[#C5C0BB]">
              <strong className="text-[#F2EDE4]">The Information Regulator (South Africa)</strong><br />
              JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001<br />
              <a
                href="mailto:inforeg@justice.gov.za"
                className="text-[#C5C0BB] underline underline-offset-4 hover:text-[#F2EDE4] transition-colors duration-200"
              >
                inforeg@justice.gov.za
              </a>
              <br />
              <a
                href="https://www.inforegulator.org.za"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5C0BB] underline underline-offset-4 hover:text-[#F2EDE4] transition-colors duration-200"
              >
                www.inforegulator.org.za
              </a>
            </p>
          </div>
        </div>

        {/* Effective date footer */}
        <div className="border-t border-[#2D2A27] pt-8">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#857F74]">
            This policy is effective from April 2026 and may be updated from time to time. Material changes will be communicated via this page. Continued use of this website following any update constitutes acceptance of the revised policy.
          </p>
        </div>
      </div>
    </SectionWrapper>
  )
}
