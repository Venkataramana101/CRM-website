import React from 'react'

export function TermsPage({ onBack }) {
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
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 32, fontWeight: 800, letterSpacing: '-0.8px', color: '#152c40', marginBottom: 6 }}>Terms & Conditions</h1>
        <p style={{ fontSize: 11, color: '#8595a4', marginBottom: 40 }}>Last updated: November 2026</p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: `By accessing or using the Ramaiah Capital CRM platform ("Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use the Platform. These terms apply to all employees, telecallers, branch managers, and authorised users of Ramaiah Capital Private Limited.`
          },
          {
            title: '2. Authorised Use',
            body: `The Platform is intended solely for internal business use by authorised personnel of Ramaiah Capital Private Limited. Users must not share login credentials, access the Platform for personal gain, or use it in any manner that violates applicable laws and regulations including the Reserve Bank of India guidelines on data security and customer privacy.`
          },
          {
            title: '3. User Accounts & Security',
            body: `Each user is responsible for maintaining the confidentiality of their login credentials. You must notify your administrator immediately if you suspect unauthorised access. Ramaiah Capital reserves the right to suspend or terminate accounts that show signs of misuse, sharing of credentials, or policy violations.`
          },
          {
            title: '4. Customer Data Handling',
            body: `All customer data stored in the Platform — including names, phone numbers, email addresses, and financial information — is the property of Ramaiah Capital Private Limited. Users must handle customer data with the utmost care and must not share, export, or transmit data to unauthorised parties. Data must only be used for legitimate business purposes related to loan processing and customer service.`
          },
          {
            title: '5. Communication Guidelines',
            body: `Calls, emails, and WhatsApp messages sent through the Platform must be professional, accurate, and compliant with the Telecom Regulatory Authority of India (TRAI) guidelines and the RBI Fair Practices Code. Users must not engage in misleading, aggressive, or harassing communication with customers.`
          },
          {
            title: '6. Intellectual Property',
            body: `All content, design, software, and data within the Platform are the intellectual property of Ramaiah Capital Private Limited. Reproduction, reverse engineering, or redistribution of any part of the Platform without written permission is strictly prohibited.`
          },
          {
            title: '7. Limitation of Liability',
            body: `Ramaiah Capital Private Limited shall not be liable for any indirect, incidental, or consequential damages arising from the use of this Platform. The Platform is provided "as is" and may be updated or modified at any time without prior notice.`
          },
          {
            title: '8. Amendments',
            body: `These Terms may be updated periodically. Continued use of the Platform after any changes constitutes acceptance of the revised Terms. Users will be notified of material changes via the Platform or internal communication channels.`
          },
          {
            title: '9. Governing Law',
            body: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.`
          },
          {
            title: '10. Contact',
            body: `For questions about these Terms, contact your branch administrator or email legal@ramaiahcapital.com.`
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
