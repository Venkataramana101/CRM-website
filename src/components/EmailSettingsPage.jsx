import React, { useState, useEffect } from 'react'
import { Mail, CheckCircle, XCircle, LogOut, RefreshCw, Send, User, Shield, Info } from 'lucide-react'
import {
  requestGmailAccess,
  revokeGmailAccess,
  isGmailAuthorised,
  sendGmail,
} from '../services/gmailService'

export function EmailSettingsPage() {
  const [authorised, setAuthorised] = useState(isGmailAuthorised())
  const [connecting, setConnecting] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testStatus, setTestStatus] = useState('') // '' | 'sending' | 'sent' | 'error'
  const [testError, setTestError] = useState('')
  const [connectedAccount, setConnectedAccount] = useState(
    () => localStorage.getItem('gmail-connected-account') || ''
  )

  // Poll authorisation state in case token expires
  useEffect(() => {
    const interval = setInterval(() => {
      const nowAuth = isGmailAuthorised()
      if (!nowAuth && authorised) {
        setAuthorised(false)
        setConnectedAccount('')
        localStorage.removeItem('gmail-connected-account')
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [authorised])

  const handleConnect = async () => {
    setConnecting(true)
    try {
      await requestGmailAccess()
      setAuthorised(true)

      // Try to get the connected email from the token info endpoint
      try {
        const token = (await import('../services/gmailService')).getAccessToken
          ? null
          : null
        // Use the Google userinfo endpoint to fetch the email address
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${await (await import('../services/gmailService')).getAccessToken()}` },
        })
        if (res.ok) {
          const info = await res.json()
          setConnectedAccount(info.email || '')
          localStorage.setItem('gmail-connected-account', info.email || '')
        }
      } catch (_) {
        // non-critical — just don't show the email address
      }
    } catch (err) {
      // user cancelled or error
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = () => {
    revokeGmailAccess()
    setAuthorised(false)
    setConnectedAccount('')
    localStorage.removeItem('gmail-connected-account')
  }

  const handleTestSend = async (e) => {
    e.preventDefault()
    if (!testEmail.trim()) return
    setTestStatus('sending')
    setTestError('')
    const result = await sendGmail({
      to: testEmail.trim(),
      subject: 'Test Email from Ramaiah Capital CRM',
      body: `Hi,

This is a test email sent from the Ramaiah Capital CRM email integration.

If you received this, the Gmail connection is working correctly.

— Ramaiah Capital CRM`,
    })
    if (result.success) {
      setTestStatus('sent')
    } else {
      setTestStatus('error')
      setTestError(result.error || 'Unknown error')
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: '#0f8b83', marginBottom: 8 }}>
          COMMUNICATION SETTINGS
        </div>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 25, fontWeight: 800, letterSpacing: '-0.7px', color: '#152c40', margin: 0 }}>
          Email Settings
        </h1>
        <p style={{ fontSize: 11, color: '#7e8d9e', margin: '8px 0 0' }}>
          Connect your Gmail account to send emails to leads directly from the CRM.
        </p>
      </div>

      {/* Gmail Connection Card */}
      <div style={{ background: '#fff', border: '1px solid #e7edf2', borderRadius: 10, padding: 24, marginBottom: 16, boxShadow: '0 2px 8px #1c354308' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: '#e4f5f2', color: '#0c827a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Mail size={20} />
          </div>
          <div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 800, color: '#1d3a51' }}>Gmail Account</div>
            <div style={{ fontSize: 11, color: '#7e8d9e', marginTop: 3 }}>Send emails on your behalf via Google Gmail API</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {authorised
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e8f7ee', color: '#248956', borderRadius: 20, padding: '5px 12px', fontSize: 10, fontWeight: 700 }}>
                  <CheckCircle size={13} /> Connected
                </span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f7fa', color: '#8595a4', borderRadius: 20, padding: '5px 12px', fontSize: 10, fontWeight: 700 }}>
                  <XCircle size={13} /> Not connected
                </span>
            }
          </div>
        </div>

        {authorised ? (
          <>
            {connectedAccount && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafb', border: '1px solid #edf1f4', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
                <User size={15} color="#8595a4" />
                <div>
                  <div style={{ fontSize: 10, color: '#7e8d9e' }}>Connected as</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1d3a51', marginTop: 2 }}>{connectedAccount}</div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleConnect}
                style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#f0f8f7', border: '1px solid #d3eeea', color: '#087a73', borderRadius: 7, padding: '9px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                <RefreshCw size={13} /> Re-authorise
              </button>
              <button
                onClick={handleDisconnect}
                style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff0ef', border: '1px solid #f5d0ce', color: '#c45d4d', borderRadius: 7, padding: '9px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                <LogOut size={13} /> Disconnect Gmail
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#0e827b', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 12, fontWeight: 700, cursor: connecting ? 'not-allowed' : 'pointer', opacity: connecting ? 0.7 : 1, transition: 'all .15s' }}
          >
            {connecting
              ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Connecting…</>
              : <><Mail size={14} /> Connect Gmail Account</>
            }
          </button>
        )}
      </div>

      {/* How it works */}
      <div style={{ background: '#f0f8f7', border: '1px solid #d3eeea', borderRadius: 10, padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={15} color="#0e827b" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1d3a51', marginBottom: 6 }}>How it works</div>
            <ul style={{ fontSize: 11, color: '#526477', lineHeight: 1.8, margin: 0, paddingLeft: 16 }}>
              <li>Click <strong>Connect Gmail Account</strong> — a Google sign-in popup appears.</li>
              <li>Sign in with the Gmail account you want to send emails from.</li>
              <li>Grant the <strong>Send email on your behalf</strong> permission.</li>
              <li>After connecting, the Send Email button in Leads will send directly via your Gmail account.</li>
              <li>The connection lasts for this browser session. Re-authorise after closing the browser.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div style={{ background: '#fff8e9', border: '1px solid #f5e5bf', borderRadius: 10, padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Shield size={15} color="#b47a2e" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8b5e1a', marginBottom: 4 }}>Privacy & Security</div>
            <div style={{ fontSize: 11, color: '#987f53', lineHeight: 1.7 }}>
              This integration uses Google Identity Services with OAuth 2.0. Your Gmail password is never shared with the CRM — only a time-limited access token is used. The token is stored in memory only and cleared when you disconnect or close the browser.
            </div>
          </div>
        </div>
      </div>

      {/* Test email sender */}
      {authorised && (
        <div style={{ background: '#fff', border: '1px solid #e7edf2', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px #1c354308' }}>
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 800, color: '#1d3a51', marginBottom: 6 }}>Send a test email</div>
          <div style={{ fontSize: 11, color: '#7e8d9e', marginBottom: 16 }}>Verify that your Gmail connection is working correctly.</div>
          <form onSubmit={handleTestSend} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#617487', marginBottom: 6 }}>Recipient email address</label>
              <input
                type="email"
                value={testEmail}
                onChange={e => { setTestEmail(e.target.value); setTestStatus('') }}
                placeholder="yourname@gmail.com"
                required
                disabled={testStatus === 'sending'}
                style={{ width: '100%', border: '1px solid #dfe6ec', borderRadius: 6, padding: '9px 11px', fontSize: 11, color: '#354b5e', outline: 'none' }}
              />
            </div>
            <button
              type="submit"
              disabled={testStatus === 'sending' || !testEmail.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#0e827b', color: '#fff', border: 'none', borderRadius: 7, padding: '10px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: testStatus === 'sending' ? 0.7 : 1, whiteSpace: 'nowrap' }}
            >
              {testStatus === 'sending'
                ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</>
                : <><Send size={13} /> Send Test</>
              }
            </button>
          </form>
          {testStatus === 'sent' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#248956', fontSize: 11, fontWeight: 600 }}>
              <CheckCircle size={14} /> Test email sent successfully!
            </div>
          )}
          {testStatus === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#c45d4d', fontSize: 11 }}>
              <XCircle size={14} /> {testError}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
