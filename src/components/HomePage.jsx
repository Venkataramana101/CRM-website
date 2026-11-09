import React from 'react'
import { ShieldCheck, TrendingUp, Users, Headphones, PhoneCall, BarChart2, Mail, MessageSquare } from 'lucide-react'

export function HomePage({ onLogin, onTerms, onPrivacy }) {
  const features = [
    { icon: Users, title: 'Lead Management', desc: 'Track every lead from first contact to loan conversion in one place.' },
    { icon: PhoneCall, title: 'Telecaller Desk', desc: 'Make calls, log outcomes, and schedule follow-ups without switching apps.' },
    { icon: Mail, title: 'Email & WhatsApp', desc: 'Reach customers via email or WhatsApp directly from the CRM.' },
    { icon: BarChart2, title: 'Reports & Analytics', desc: 'Live dashboards show branch performance, conversion rates and trends.' },
    { icon: ShieldCheck, title: 'Secure Access', desc: 'Role-based login keeps your customer data safe and auditable.' },
    { icon: TrendingUp, title: 'Campaign Tracking', desc: 'Measure cost-per-lead and ROI across all your lending campaigns.' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#1b2b3b', background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <header style={{ background: '#102a43', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0f8b83', color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 800, letterSpacing: '-0.5px' }}>RC</div>
          <div>
            <div style={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '.8px' }}>RAMAIAH CAPITAL</div>
            <div style={{ color: '#8ca4bb', fontSize: 9, letterSpacing: '1.7px', marginTop: 2 }}>LENDING CRM</div>
          </div>
        </div>
        <button
          onClick={onLogin}
          style={{ background: '#0e827b', color: '#fff', border: 'none', borderRadius: 7, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background .15s' }}
          onMouseOver={e => e.target.style.background = '#096d67'}
          onMouseOut={e => e.target.style.background = '#0e827b'}
        >
          Login to CRM →
        </button>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #102a43 0%, #164e63 60%, #0f766e 100%)', color: '#fff', padding: '80px 40px 90px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: '#0f8b8333', border: '1px solid #0f8b8355', borderRadius: 20, padding: '5px 16px', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: '#7de0d4', marginBottom: 22 }}>
            TELECALLER CRM PLATFORM
          </div>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 44, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.15, margin: '0 0 20px' }}>
            Manage Every Lead.<br />Close Every Loan.
          </h1>
          <p style={{ fontSize: 15, color: '#a8c4d8', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
            Ramaiah Capital CRM gives your telecalling team a single workspace to track leads, make calls, send emails, and hit your loan targets — faster.
          </p>
          <button
            onClick={onLogin}
            style={{ background: '#0e827b', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 25px #0e827b55', transition: 'all .15s' }}
            onMouseOver={e => e.target.style.background = '#096d67'}
            onMouseOut={e => e.target.style.background = '#0e827b'}
          >
            Go to Login →
          </button>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '24px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          {[['10,000+','Loans Processed'],['98%','Customer Satisfaction'],['5 Cities','Branch Network'],['24/7','Support Available']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 28, fontWeight: 800, color: '#0e827b', letterSpacing: '-1px' }}>{val}</div>
              <div style={{ fontSize: 10, color: '#8595a4', marginTop: 4, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '70px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: '#0f8b83', marginBottom: 10 }}>PLATFORM FEATURES</div>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', margin: '0 0 12px', color: '#152c40' }}>Everything your team needs</h2>
          <p style={{ fontSize: 12, color: '#7e8d9e', maxWidth: 480, margin: '0 auto' }}>Built for lending companies — from lead capture to loan disbursal.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #e7edf2', borderRadius: 10, padding: '24px 22px', boxShadow: '0 2px 8px #1c354308' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e4f5f2', color: '#0c827a', display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                <Icon size={18} />
              </div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 800, color: '#1d3a51', marginBottom: 7 }}>{title}</div>
              <div style={{ fontSize: 11, color: '#7e8d9e', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ background: 'linear-gradient(135deg, #0f766e, #164e63)', padding: '50px 40px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px', margin: '0 0 12px' }}>Ready to start?</h2>
        <p style={{ fontSize: 12, color: '#a8d8d4', marginBottom: 28 }}>Log in to the CRM and manage your leads right now.</p>
        <button
          onClick={onLogin}
          style={{ background: '#fff', color: '#0f766e', border: 'none', borderRadius: 8, padding: '13px 30px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          Login to CRM →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: '#102a43', color: '#7a92a8', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 10 }}>
        <div>© 2026 Ramaiah Capital Private Limited. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <button onClick={onTerms} style={{ background: 'none', border: 'none', color: '#7a92a8', cursor: 'pointer', fontSize: 10, textDecoration: 'underline' }}>Terms & Conditions</button>
          <button onClick={onPrivacy} style={{ background: 'none', border: 'none', color: '#7a92a8', cursor: 'pointer', fontSize: 10, textDecoration: 'underline' }}>Privacy Policy</button>
        </div>
      </footer>
    </div>
  )
}
