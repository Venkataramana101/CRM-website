// Email Service for CRM
// Actual sending is handled by gmailService.js (Gmail API via GIS).
// This file manages local email records only.

export const EMAIL_STATUS = {
  SENT: 'Sent',
  FAILED: 'Failed'
}

/**
 * Create a local email record after a successful Gmail send.
 */
export const sendEmail = async (emailData) => {
  const emailRecord = {
    id: 'EMAIL-' + Date.now(),
    to: emailData.to,
    subject: emailData.subject,
    body: emailData.body,
    template: emailData.template || 'custom',
    status: EMAIL_STATUS.SENT,
    timestamp: new Date().toISOString(),
    leadId: emailData.leadId,
    employeeId: emailData.employeeId,
    employeeName: emailData.employeeName,
    branch: emailData.branch,
    messageId: emailData.messageId || null,
  }
  return { success: true, email: emailRecord }
}

export const getEmailStats = (emails) => {
  if (!emails || emails.length === 0) return { totalSent: 0, failed: 0 }
  return {
    totalSent: emails.filter(e => e.status === EMAIL_STATUS.SENT).length,
    failed: emails.filter(e => e.status === EMAIL_STATUS.FAILED).length,
  }
}

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
