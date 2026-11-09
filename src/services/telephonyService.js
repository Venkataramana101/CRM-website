// Telephony Service - Provider Integration Layer
// This module provides an abstraction layer for cloud telephony providers
// Production: Connect to Exotel, Knowlarity, Twilio, or similar providers

export const CALL_STATUS = {
  INITIATING: 'Initiating',
  RINGING: 'Ringing',
  CONNECTED: 'Connected',
  BUSY: 'Busy',
  NO_ANSWER: 'No Answer',
  FAILED: 'Failed',
  COMPLETED: 'Completed',
  MISSED: 'Missed'
}

export const CALL_DIRECTION = {
  OUTGOING: 'Outgoing',
  INCOMING: 'Incoming'
}

// Demo mode configuration
let isDemoMode = true
let providerConfig = {
  providerName: 'Demo Provider',
  apiEndpoint: '',
  accountId: '',
  apiKey: '',
  webhookUrl: '',
  recordingEnabled: false
}

export const setProviderConfig = (config) => {
  providerConfig = { ...providerConfig, ...config }
  isDemoMode = !config.apiKey || !config.apiEndpoint
}

export const getProviderConfig = () => ({ ...providerConfig, isDemoMode })

// Simulate call initiation
export const initiateCall = async (customerPhone, leadId, employeeId, employeeName) => {
  if (isDemoMode) {
    // Demo simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const callId = `CALL-${Date.now()}`
        resolve({
          success: true,
          callId,
          status: CALL_STATUS.INITIATING,
          isDemoCall: true,
          message: 'Demo call initiated - no actual call placed'
        })
      }, 500)
    })
  } else {
    // Production integration - would call actual provider API
    try {
      // Example structure for real implementation:
      // const response = await fetch(`${providerConfig.apiEndpoint}/calls`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${providerConfig.apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     to: customerPhone,
      //     from: providerConfig.agentNumber,
      //     callerId: providerConfig.callerId,
      //     customData: { leadId, employeeId }
      //   })
      // })
      // return await response.json()
      
      throw new Error('Provider not configured. Please configure telephony provider in Settings.')
    } catch (error) {
      return {
        success: false,
        error: error.message,
        isDemoCall: false
      }
    }
  }
}

// Simulate call status progression for demo
export const simulateCallProgress = (callId, onStatusChange) => {
  if (!isDemoMode) return

  const statuses = [
    { status: CALL_STATUS.RINGING, delay: 1000 },
    { status: CALL_STATUS.CONNECTED, delay: 2000 }
  ]

  let currentIndex = 0
  const interval = setInterval(() => {
    if (currentIndex >= statuses.length) {
      clearInterval(interval)
      return
    }
    
    onStatusChange({
      callId,
      status: statuses[currentIndex].status,
      timestamp: new Date().toISOString()
    })
    
    currentIndex++
  }, statuses[0].delay)

  return () => clearInterval(interval)
}

// End call
export const endCall = async (callId, duration) => {
  if (isDemoMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          callId,
          status: CALL_STATUS.COMPLETED,
          duration,
          isDemoCall: true
        })
      }, 300)
    })
  } else {
    // Production: Call provider API to end call
    try {
      // await fetch(`${providerConfig.apiEndpoint}/calls/${callId}/end`, { method: 'POST' })
      throw new Error('Provider not configured')
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Handle incoming call webhook (production)
export const handleIncomingCall = (webhookData) => {
  // In production, this would be called by webhook endpoint
  // Parse provider-specific webhook data
  return {
    callId: webhookData.callId || webhookData.CallSid,
    from: webhookData.from || webhookData.From,
    to: webhookData.to || webhookData.To,
    status: CALL_STATUS.RINGING,
    direction: CALL_DIRECTION.INCOMING,
    timestamp: new Date().toISOString()
  }
}

// Get call recording URL (if available)
export const getCallRecording = async (callId) => {
  if (isDemoMode) {
    return {
      success: false,
      message: 'Recording not available in demo mode'
    }
  } else {
    // Production: Fetch recording URL from provider
    try {
      // const response = await fetch(`${providerConfig.apiEndpoint}/recordings/${callId}`)
      // return await response.json()
      throw new Error('Provider not configured')
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Test connection to provider
export const testConnection = async () => {
  if (isDemoMode) {
    return {
      success: true,
      message: 'Demo mode active - no provider connection required',
      isDemoMode: true
    }
  } else {
    try {
      // const response = await fetch(`${providerConfig.apiEndpoint}/status`)
      // return await response.json()
      throw new Error('Provider not configured')
    } catch (error) {
      return {
        success: false,
        error: error.message,
        isDemoMode: false
      }
    }
  }
}
