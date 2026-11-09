import React, { useState } from 'react'
import { X, Send, Mail, Paperclip, Bold, Italic, List, Link2 } from 'lucide-react'

export function EmailComposer({ lead, onClose, onSend }) {
  const [toEmail, setToEmail] = useState(lead.email || '')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [template, setTemplate] = useState('custom')
  
  const emailTemplates = {
    custom: { subject: '', body: '' },
    introduction: {
      subject: 'Regarding Your Loan Inquiry - Ramaiah Capital',
      body: `Dear ${lead.name},

Thank you for your interest in our ${lead.product} services at Ramaiah Capital.

We would like to understand your requirements better and guide you through our loan products that best suit your needs.

Could we schedule a brief call to discuss your requirements?

Best regards,
Ramaiah Capital Lending Team
${lead.branch} Branch

Contact: ${lead.phone}
Email: info@ramaiahcapital.com`
    },
    followup: {
      subject: 'Following Up on Your Loan Application - Ramaiah Capital',
      body: `Dear ${lead.name},

I hope this email finds you well.

I wanted to follow up on our previous conversation regarding ${lead.product}.

We have exciting offers that might interest you. Would you be available for a quick discussion?

Looking forward to hearing from you.

Best regards,
Ramaiah Capital Lending Team
${lead.branch} Branch`
    },
    documentation: {
      subject: 'Document Requirements for Your Loan Application',
      body: `Dear ${lead.name},

Thank you for choosing Ramaiah Capital for your ${lead.product} needs.

To proceed with your application, please provide the following documents:
- Identity Proof (Aadhaar/PAN Card)
- Address Proof
- Income Proof (Last 3 months salary slips/ITR)
- Bank Statements (Last 6 months)

You can reply to this email with the documents or visit our ${lead.branch} branch.

Best regards,
Ramaiah Capital Lending Team`
    },
    approval: {
      subject: 'Great News! Your Loan Application Status - Ramaiah Capital',
      body: `Dear ${lead.name},

Congratulations! We are pleased to inform you that your ${lead.product} application has been approved.

Our team will contact you shortly with the next steps.

Thank you for choosing Ramaiah Capital.

Best regards,
Ramaiah Capital Lending Team
${lead.branch} Branch`
    }
  }
  
  const handleTemplateChange = (templateName) => {
    setTemplate(templateName)
    if (emailTemplates[templateName]) {
      setSubject(emailTemplates[templateName].subject)
      setBody(emailTemplates[templateName].body)
    }
  }
  
  const handleSend = (e) => {
    e.preventDefault()
    if (!toEmail.trim()) {
      alert('Please enter the recipient email address')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail.trim())) {
      alert('Please enter a valid email address')
      return
    }
    if (!subject.trim() || !body.trim()) {
      alert('Please enter both subject and email body')
      return
    }
    
    onSend({
      to: toEmail.trim(),
      subject,
      body,
      template
    })
  }
  
  return (
    <div className="email-composer">
      <div className="email-header">
        <div className="email-to">
          <Mail size={16} />
          <div style={{flex:1}}>
            <strong>To: {lead.name}</strong>
            <input
              type="email"
              value={toEmail}
              onChange={e => setToEmail(e.target.value)}
              placeholder="Enter recipient email address..."
              required
              style={{
                display:'block',
                width:'100%',
                marginTop:'4px',
                padding:'4px 8px',
                border:'1px solid #d1d5db',
                borderRadius:'6px',
                fontSize:'13px',
                background:'#f9fafb'
              }}
            />
          </div>
        </div>
        <button className="icon-btn" onClick={onClose} title="Close">
          <X size={18} />
        </button>
      </div>
      
      <form onSubmit={handleSend}>
        <div className="email-templates">
          <label>
            <span>Email Template:</span>
            <select value={template} onChange={(e) => handleTemplateChange(e.target.value)}>
              <option value="custom">Custom Email</option>
              <option value="introduction">Introduction Email</option>
              <option value="followup">Follow-up Email</option>
              <option value="documentation">Document Request</option>
              <option value="approval">Approval Notification</option>
            </select>
          </label>
        </div>
        
        <div className="email-subject">
          <label>
            <span>Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              required
            />
          </label>
        </div>
        
        <div className="email-body">
          <div className="email-toolbar">
            <button type="button" className="icon-btn" title="Bold">
              <Bold size={14} />
            </button>
            <button type="button" className="icon-btn" title="Italic">
              <Italic size={14} />
            </button>
            <button type="button" className="icon-btn" title="List">
              <List size={14} />
            </button>
            <button type="button" className="icon-btn" title="Link">
              <Link2 size={14} />
            </button>
            <button type="button" className="icon-btn" title="Attach">
              <Paperclip size={14} />
            </button>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Compose your email message..."
            rows={12}
            required
          />
        </div>
        
        <div className="email-footer">
          <div className="email-info">
            <span>From: {lead.owner || 'Telecaller'} • {lead.branch} Branch</span>
          </div>
          <div className="email-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              <Send size={15} />
              Send Email
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export function EmailTimeline({ emails, leadName }) {
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
      {emails.map((email) => (
        <div key={email.id} className="email-item">
          <div className="email-item-header">
            <div className="email-item-icon">
              <Mail size={14} />
            </div>
            <div className="email-item-meta">
              <strong>{email.subject}</strong>
              <span>{email.timestamp}</span>
            </div>
            <span className={`email-status ${email.status}`}>{email.status}</span>
          </div>
          <div className="email-item-body">
            <p>{email.body.substring(0, 150)}{email.body.length > 150 ? '...' : ''}</p>
          </div>
          {email.template !== 'custom' && (
            <div className="email-item-template">
              Template: {email.template}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
