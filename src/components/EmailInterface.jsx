import React, { useState } from 'react'
import { X, Send, Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { sendGmail, isGmailAuthorised, requestGmailAccess } from '../services/gmailService'

// ── Template definitions ────────────────────────────────────────────────────
function buildTemplates(lead) {
  return {
    custom: { label: 'Custom Email', subject: '', body: '' },
    introduction: {
      label: 'Introduction Email',
      subject: 'Regarding Your Loan Inquiry - Ramaiah Capital',
      body: `Dear ${lead.name},

Thank you for your interest in our ${lead.product} services at Ramaiah Capital.

We would like to understand your requirements better and guide you through our loan products that best suit your needs.

Could we schedule a brief call to discuss your requirements?

Best regards,
Ramaiah Capital Lending Team
${lead.branch} Branch

Contact: ${lead.phone}
Email: info@ramaiahcapital.com`,
    },
    followup: {
      label: 'Follow-up Email',
      subject: 'Following Up on Your Loan Application - Ramaiah Capital',
      body: `Dear ${lead.name},

I hope this email finds you well.

I wanted to follow up on our previous conversation regarding ${lead.product}.

We have exciting offers that might interest you. Would you be available for a quick discussion?

Looking forward to hearing from you.

Best regards,
Ramaiah Capital Lending Team
${lead.branch} Branch`,
    },
    documentation: {
      label: 'Document Request',
      subject: 'Document Requirements for Your Loan Application',
      body: `Dear ${lead.name},

Thank you for choosing Ramaiah Capital for your ${lead.product} needs.

To proceed with your application, please provide the following documents:
- Identity Proof (Aadhaar / PAN Card)
- Address Proof
- Income Proof (Last 3 months salary slips / ITR)
- Bank Statements (Last 6 months)

You can reply to this email with the documents or visit our ${lead.branch} branch.

Best regards,
Ramaiah Capital Lending Team`,
    },
    approval: {
      label: 'Approval Notification',
      subject: 'Great News! Your Loan Application Status - Ramaiah Capital',
      body: `Dear ${lead.name},

Congratulations! We are pleased to inform you that your ${lead.product} application has been approved.

Our team will contact you shortly with the next steps.

Thank you for choosing Ramaiah Capital.

Best regards,
Ramaiah Capital Lending Team
${lead.branch} Branch`,
    },
  }
}

// ── EmailComposer ────────────────────────────────────────────────────────────
export function EmailComposer({ lead, onClose, onSend }) {
  const templates = buildTemplates(lead)

  const [toEmail, setToEmail]     = useState(lead.email || '')
  const [template, setTemplate]   = useState('introduction')
  const [subject, setSubject]     = useState(templates.introduction.subject)
  const [body, setBody]           = useState(templates.introduction.body)
  const [status, setStatus]       = useState('idle') // idle | connecting | sending | sent | error
  const [errorMsg, setErrorMsg]   = useState('')

  const handleTemplateChange = (key) => {
    setTemplate(key)
    setSubject(templates[key].subject)
    setBody(templates[key].body)
  }

  const handleSend = async (e) => {
    e.preventDefault()

    if (!toEmail.trim()) { alert('Please enter the recipient email address'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail.trim())) { alert('Please enter a valid email address'); return }
    if (!subject.trim() || !body.trim()) { alert('Please fill in subject and body'); return }

    setErrorMsg('')

    try {
      // Step 1: authorise if needed (shows Google popup once)
      if (!isGmailAuthorised()) {
        setStatus('connecting')
        await requestGmailAccess()
      }

      // Step 2: send
      setStatus('sending')
      const result = await sendGmail({
        to: toEmail.trim(),
        subject,
        body,
        fromName: lead.owner || 'Ramaiah Capital',
      })

      if (result.success) {
        setStatus('sent')
        // Notify parent to log the email record
        onSend({
          to: toEmail.trim(),
          subject,
          body,
          template,
          messageId: result.messageId,
        })
        // Auto-close after 2s
        setTimeout(onClose, 2000)
      } else {
        setStatus('error')
        setErrorMsg(result.error || 'Failed to send email')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Unknown error')
    }
  }

  // ── Sent success screen ──
  if (status === 'sent') {
    return (
      <div className="email-composer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40, minHeight: 220 }}>
        <CheckCircle size={44} color="#0e827b" />
        <strong style={{ fontSize: 15, color: '#1d3a51' }}>Email sent!</strong>
        <span style={{ fontSize: 11, color: '#7e8d9e' }}>To: {toEmail}</span>
      </div>
    )
  }

  const isBusy = status === 'connecting' || status === 'sending'

  return (
    <div className="email-composer">
      {/* Header */}
      <div className="email-header">
        <div className="email-to" style={{ flex: 1 }}>
          <Mail size={16} />
          <div style={{ flex: 1 }}>
            <strong>To: {lead.name}</strong>
            <input
              type="email"
              value={toEmail}
              onChange={e => setToEmail(e.target.value)}
              placeholder="Enter recipient email address..."
              required
              disabled={isBusy}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, background: '#f9fafb' }}
            />
          </div>
        </div>
        <button className="icon-btn" onClick={onClose} title="Close" disabled={isBusy}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSend}>
        {/* Template dropdown */}
        <div className="email-templates">
          <label>
            <span>Email Template:</span>
            <select value={template} onChange={e => handleTemplateChange(e.target.value)} disabled={isBusy}>
              {Object.entries(templates).map(([key, t]) => (
                <option key={key} value={key}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Subject */}
        <div className="email-subject">
          <label>
            <span>Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              required
              disabled={isBusy}
            />
          </label>
        </div>

        {/* Body */}
        <div className="email-body">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Compose your email message..."
            rows={10}
            required
            disabled={isBusy}
          />
        </div>

        {/* Error */}
        {status === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff0ef', border: '1px solid #f5d0ce', borderRadius: 6, padding: '9px 12px', margin: '0 0 10px', fontSize: 11, color: '#c45d4d' }}>
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        {/* Footer */}
        <div className="email-footer">
          <div className="email-info">
            <span>From: {lead.owner || 'Telecaller'} · {lead.branch} Branch</span>
            {!isGmailAuthorised() && (
              <span style={{ marginLeft: 10, color: '#b47a2e', fontSize: 10 }}>⚠ Google sign-in required on first send</span>
            )}
          </div>
          <div className="email-actions">
            <button type="button" className="btn secondary" onClick={onClose} disabled={isBusy}>Cancel</button>
            <button type="submit" className="btn primary" disabled={isBusy}>
              {isBusy
                ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />{status === 'connecting' ? 'Connecting…' : 'Sending…'}</>
                : <><Send size={14} />Send Email</>
              }
            </button>
          </div>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── EmailTimeline (unchanged) ────────────────────────────────────────────────
export function EmailTimeline({ emails }) {
  if (!emails || emails.length === 0) {
    return (
      <div className="empty">
        <Mail size={22} />
        <strong>No email history</strong>
        <span>Email communications will appear here</span>
      </div>
    )
  }

  return (
    <div className="email-timeline">
      <h4>Email History</h4>
      {emails.map(email => (
        <div key={email.id} className="email-item">
          <div className="email-item-header">
            <div className="email-item-icon"><Mail size={14} /></div>
            <div className="email-item-meta">
              <strong>{email.subject}</strong>
              <span>{new Date(email.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <span className={`email-status ${email.status?.toLowerCase()}`}>{email.status}</span>
          </div>
          <div className="email-item-body">
            <p>{email.body?.substring(0, 150)}{email.body?.length > 150 ? '…' : ''}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
