import React from 'react'

export function PrivacyPage({ onBack }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#1b2b3b', background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <header style={{ background: '#102a43', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0f8b83', color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 800 }}>RC</div>
          <div style={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '.8px' }}>RAMAIAH CAPITAL</div>
        </div>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #3a5a72', color: '#8ca4bb', borderRadius: 7, padding: '8px 18px', fontSize: 11, cursor: 'pointer' }}>← Back</button>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '50px 40px 70px', width: '100%' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: '#0f8b83', marginBottom: 10 }}>LEGAL</div>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 32, fontWeight: 800, letterSpacing: '-0.8px', color: '#152c40', marginBottom: 6 }}>Privacy Policy</h1>
        <p style={{ fontSize: 11, color: '#8595a4', marginBottom: 40 }}>Last updated: November 2026</p>

        {[
          {
            title: '1. Overview',
            body: `Ramaiah Capital Private Limited ("we", "our", "us") is committed to protecting the privacy of our customers and employees. This Privacy Policy explains how we collect, use, store, and protect personal information through our CRM Platform. We comply with applicable Indian data protection laws and RBI guidelines on customer data privacy.`
          },
          {
            title: '2. Information We Collect',
            body: `Through the CRM Platform, we collect the following categories of information: (a) Customer Information — full name, mobile number, email address, address, income details, and loan application data provided by or about prospective borrowers; (b) Employee Information — name, employee ID, branch, and work activity logs; (c) Communication Records — call logs, email records, and WhatsApp interaction summaries; (d) Usage Data — login times, pages visited, and actions performed within the Platform.`
          },
          {
            title: '3. How We Use Your Information',
            body: `We use collected information strictly for: processing and evaluating loan applications, communicating with prospective and existing borrowers, monitoring telecaller performance and compliance, generating operational reports and analytics, ensuring the security and integrity of the Platform, and complying with regulatory requirements including KYC and AML obligations.`
          },
          {
            title: '4. Data Storage & Security',
            body: `All customer and employee data is stored on secured servers with access controls, encryption, and audit logging. We use industry-standard security measures to prevent unauthorised access, disclosure, or loss of personal data. Only authorised personnel with a legitimate business need may access personal data within the Platform.`
          },
          {
            title: '5. Data Sharing',
            body: `We do not sell, rent, or trade customer personal data to third parties. Data may be shared with: (a) Regulatory bodies such as the RBI or SEBI when required by law; (b) Credit bureaus (CIBIL, Experian, etc.) for credit assessment purposes; (c) Internal departments strictly on a need-to-know basis; (d) Technology service providers who support the Platform under strict data processing agreements.`
          },
          {
            title: '6. Data Retention',
            body: `Customer data is retained for the period required by RBI regulations and applicable law — typically 8 years from the date of the last transaction or loan closure. Employee activity logs are retained for 3 years. Data no longer required is securely deleted or anonymised.`
          },
          {
            title: '7. Your Rights',
            body: `Customers and employees have the right to: access the personal data we hold about them, request correction of inaccurate data, request deletion of data that is no longer necessary (subject to legal and regulatory obligations), and lodge a complaint regarding data handling. To exercise these rights, contact privacy@ramaiahcapital.com.`
          },
          {
            title: '8. Cookies & Local Storage',
            body: `The CRM Platform uses browser local storage to maintain login sessions and user preferences. No tracking cookies are used for advertising or analytics. Session data is cleared automatically on logout.`
          },
          {
            title: '9. Changes to This Policy',
            body: `We may update this Privacy Policy from time to time to reflect changes in law, technology, or our business practices. Updates will be communicated through the Platform or internal channels. Continued use of the Platform after any change constitutes acceptance of the updated Policy.`
          },
          {
            title: '10. Contact Us',
            body: `For any privacy-related concerns, data access requests, or complaints, please contact our Data Protection Officer at privacy@ramaiahcapital.com, or write to: Ramaiah Capital Private Limited, Bengaluru Branch, Karnataka — 560001.`
          },
        ].map(({ title, body }) => (
          <section key={title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 15, fontWeight: 800, color: '#1d3a51', marginBottom: 10 }}>{title}</h2>
            <p style={{ fontSize: 12, color: '#526477', lineHeight: 1.8, margin: 0 }}>{body}</p>
          </section>
        ))}
      </main>

      <footer style={{ background: '#102a43', color: '#7a92a8', padding: '20px 40px', textAlign: 'center', fontSize: 10 }}>
        © 2026 Ramaiah Capital Private Limited. All rights reserved.
      </footer>
    </div>
  )
}
