// WhatsApp Business Service - Provider Integration Layer
// This module provides integration with WhatsApp Business Cloud API
// or authorized Business Solution Providers

export const MESSAGE_STATUS = {
  QUEUED: 'Queued',
  SENT: 'Sent',
  DELIVERED: 'Delivered',
  READ: 'Read',
  FAILED: 'Failed'
}

export const MESSAGE_TYPE = {
  TEXT: 'text',
  TEMPLATE: 'template',
  IMAGE: 'image',
  DOCUMENT: 'document'
}

export const CONVERSATION_STATUS = {
  OPEN: 'Open',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  WAITING: 'Waiting for Customer',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
}

// Demo mode configuration
let isDemoMode = true
let whatsappConfig = {
  businessAccountId: '',
  phoneNumberId: '',
  accessToken: '',
  webhookVerifyToken: '',
  apiVersion: 'v18.0',
  verified: false
}

export const setWhatsAppConfig = (config) => {
  whatsappConfig = { ...whatsappConfig, ...config }
  isDemoMode = !config.accessToken || !config.phoneNumberId
}

export const getWhatsAppConfig = () => ({ ...whatsappConfig, isDemoMode })

// Send WhatsApp message
export const sendMessage = async (recipientPhone, message, leadId, employeeId, templateId = null) => {
  if (isDemoMode) {
    // Demo simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const messageId = `MSG-${Date.now()}`
        resolve({
          success: true,
          messageId,
          status: MESSAGE_STATUS.SENT,
          isDemoMessage: true,
          message: 'Demo message - not actually sent via WhatsApp',
          timestamp: new Date().toISOString()
        })
      }, 600)
    })
  } else {
    // Production: WhatsApp Business Cloud API integration
    try {
      // Example structure for real implementation:
      // const url = `https://graph.facebook.com/${whatsappConfig.apiVersion}/${whatsappConfig.phoneNumberId}/messages`
      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${whatsappConfig.accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     messaging_product: 'whatsapp',
      //     to: recipientPhone,
      //     type: templateId ? 'template' : 'text',
      //     [templateId ? 'template' : 'text']: templateId 
      //       ? { name: templateId, language: { code: 'en' } }
      //       : { body: message }
      //   })
      // })
      // return await response.json()
      
      throw new Error('WhatsApp provider not configured. Please configure in Settings.')
    } catch (error) {
      return {
        success: false,
        error: error.message,
        isDemoMessage: false
      }
    }
  }
}

// Simulate message status progression for demo
export const simulateMessageProgress = (messageId, onStatusChange) => {
  if (!isDemoMode) return

  const statuses = [
    { status: MESSAGE_STATUS.DELIVERED, delay: 1500 },
    { status: MESSAGE_STATUS.READ, delay: 4000 }
  ]

  let currentIndex = 0
  const interval = setInterval(() => {
    if (currentIndex >= statuses.length) {
      clearInterval(interval)
      return
    }
    
    onStatusChange({
      messageId,
      status: statuses[currentIndex].status,
      timestamp: new Date().toISOString()
    })
    
    currentIndex++
  }, statuses[0].delay)

  return () => clearInterval(interval)
}

// Handle incoming WhatsApp message webhook (production)
export const handleIncomingMessage = (webhookData) => {
  // In production, this would be called by webhook endpoint
  // Parse WhatsApp webhook data
  const entry = webhookData.entry?.[0]
  const change = entry?.changes?.[0]
  const message = change?.value?.messages?.[0]

  if (!message) return null

  return {
    messageId: message.id,
    from: message.from,
    timestamp: message.timestamp,
    type: message.type,
    text: message.text?.body || '',
    status: MESSAGE_STATUS.DELIVERED,
    direction: 'incoming'
  }
}

// Verify WhatsApp webhook (required for setup)
export const verifyWebhook = (mode, token, challenge) => {
  if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
    return challenge
  }
  return null
}

// Get approved templates
export const getMessageTemplates = async () => {
  if (isDemoMode) {
    // Return demo templates
    return {
      success: true,
      templates: [
        {
          id: 'new_enquiry_ack',
          name: 'New Enquiry Acknowledgement',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          content: 'Dear {{1}}, thank you for your interest in Ramaiah Capital. Our team will contact you shortly regarding your loan enquiry.'
        },
        {
          id: 'gold_loan_enquiry',
          name: 'Gold Loan Enquiry',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          content: 'Dear {{1}}, thank you for enquiring about our Gold Loan facility. Our team will assist you with the available options and eligibility requirements.'
        },
        {
          id: 'callback_confirmation',
          name: 'Callback Confirmation',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          content: 'Dear {{1}}, your callback has been scheduled for {{2}} at {{3}}. Thank you for choosing Ramaiah Capital.'
        },
        {
          id: 'appointment_confirmation',
          name: 'Appointment Confirmation',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          content: 'Dear {{1}}, your appointment with Ramaiah Capital has been scheduled for {{2}} at {{3}}.'
        },
        {
          id: 'application_status',
          name: 'Application Status Update',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          content: 'Dear {{1}}, there is an update regarding your loan application {{2}}. Please contact our representative for further assistance.'
        }
      ],
      isDemoMode: true
    }
  } else {
    // Production: Fetch templates from WhatsApp Business Manager
    try {
      // const url = `https://graph.facebook.com/${whatsappConfig.apiVersion}/${whatsappConfig.businessAccountId}/message_templates`
      // const response = await fetch(url, {
      //   headers: { 'Authorization': `Bearer ${whatsappConfig.accessToken}` }
      // })
      // return await response.json()
      
      throw new Error('WhatsApp provider not configured')
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Test WhatsApp connection
export const testConnection = async () => {
  if (isDemoMode) {
    return {
      success: true,
      message: 'Demo mode active - no WhatsApp connection required',
      isDemoMode: true
    }
  } else {
    try {
      // const url = `https://graph.facebook.com/${whatsappConfig.apiVersion}/${whatsappConfig.phoneNumberId}`
      // const response = await fetch(url, {
      //   headers: { 'Authorization': `Bearer ${whatsappConfig.accessToken}` }
      // })
      // return await response.json()
      
      throw new Error('WhatsApp provider not configured')
    } catch (error) {
      return {
        success: false,
        error: error.message,
        isDemoMode: false
      }
    }
  }
}

// Mark message as read
export const markAsRead = async (messageId) => {
  if (isDemoMode) {
    return { success: true, isDemoMode: true }
  } else {
    try {
      // await fetch(`https://graph.facebook.com/${whatsappConfig.apiVersion}/${whatsappConfig.phoneNumberId}/messages`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${whatsappConfig.accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     messaging_product: 'whatsapp',
      //     status: 'read',
      //     message_id: messageId
      //   })
      // })
      throw new Error('Provider not configured')
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
