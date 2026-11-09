// Email Service for CRM
// Uses mailto: to open the user's default email client (Gmail, Outlook, etc.)

export const EMAIL_STATUS = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  DELIVERED: 'Delivered',
  OPENED: 'Opened',
  FAILED: 'Failed'
}

/**
 * Send an email by opening the user's default mail client via mailto:
 * @param {Object} emailData - Email details
 * @returns {Object} Result with success status and email record
 */
export const sendEmail = async (emailData) => {
  const { to, subject, body } = emailData

  // Open Gmail compose window directly in a new tab
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  window.open(gmailUrl, '_blank')

  // Create a local record of the sent email
  const emailRecord = {
    id: 'EMAIL-' + Date.now(),
    to,
    subject,
    body,
    template: emailData.template || 'custom',
    status: EMAIL_STATUS.SENT,
    timestamp: new Date().toISOString(),
    leadId: emailData.leadId,
    employeeId: emailData.employeeId,
    employeeName: emailData.employeeName,
    branch: emailData.branch,
    isDemoEmail: false
  }

  return {
    success: true,
    email: emailRecord,
    message: 'Email client opened successfully'
  }
}

/**
 * Get email statistics
 * @param {Array} emails - Array of email records
 * @returns {Object} Email statistics
 */
export const getEmailStats = (emails) => {
  if (!emails || emails.length === 0) {
    return {
      totalSent: 0,
      delivered: 0,
      opened: 0,
      failed: 0,
      openRate: 0,
      deliveryRate: 0
    }
  }
  
  const totalSent = emails.length
  const delivered = emails.filter(e => 
    e.status === EMAIL_STATUS.DELIVERED || e.status === EMAIL_STATUS.OPENED
  ).length
  const opened = emails.filter(e => e.status === EMAIL_STATUS.OPENED).length
  const failed = emails.filter(e => e.status === EMAIL_STATUS.FAILED).length
  
  return {
    totalSent,
    delivered,
    opened,
    failed,
    openRate: totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0,
    deliveryRate: totalSent > 0 ? Math.round((delivered / totalSent) * 100) : 0
  }
}

/**
 * Validate email address (basic validation)
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get email templates
 * @returns {Array} List of available templates
 */
export const getEmailTemplates = () => {
  return [
    {
      id: 'introduction',
      name: 'Introduction Email',
      category: 'Initial Contact',
      description: 'First contact with a new lead'
    },
    {
      id: 'followup',
      name: 'Follow-up Email',
      category: 'Follow-up',
      description: 'Follow up on previous conversation'
    },
    {
      id: 'documentation',
      name: 'Document Request',
      category: 'Documentation',
      description: 'Request required documents from customer'
    },
    {
      id: 'approval',
      name: 'Approval Notification',
      category: 'Status Update',
      description: 'Notify customer of loan approval'
    }
  ]
}
