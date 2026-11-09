import React, { useEffect, useState } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Volume2, X } from 'lucide-react'

// Professional calling interface with real-time status and controls
export function CallingInterface({ call, onEndCall, onClose }) {
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [callStatus, setCallStatus] = useState(call.status)

  useEffect(() => {
    if (callStatus === 'Connected') {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [callStatus])

  useEffect(() => {
    setCallStatus(call.status)
  }, [call.status])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleEndCall = () => {
    onEndCall(callDuration)
  }

  const getStatusColor = () => {
    switch (callStatus) {
      case 'Connected': return 'status-connected'
      case 'Ringing': return 'status-ringing'
      case 'Initiating': return 'status-initiating'
      case 'Failed': return 'status-failed'
      default: return ''
    }
  }

  return (
    <div className="modal-backdrop calling-backdrop">
      <div className="calling-interface">
        <div className="calling-header">
          <div className={`call-status-indicator ${getStatusColor()}`}>
            <span className="status-pulse"></span>
            {callStatus}
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="calling-body">
          <div className="call-avatar">
            {call.customerName.split(' ').map(s => s[0]).join('').slice(0, 2)}
          </div>

          <h2 className="call-customer-name">{call.customerName}</h2>
          <div className="call-details">
            <span>{call.phone}</span>
            <span>•</span>
            <span>{call.product}</span>
          </div>
          <div className="call-metadata">
            <span>{call.leadId || call.customerId}</span>
            <span>•</span>
            <span>{call.employeeName}</span>
          </div>

          {callStatus === 'Connected' && (
            <div className="call-timer">
              {formatDuration(callDuration)}
            </div>
          )}

          {callStatus === 'Ringing' && (
            <div className="call-ringing">
              <div className="ringing-animation">
                <Phone size={24} />
              </div>
              <p>Calling...</p>
            </div>
          )}

          {callStatus === 'Initiating' && (
            <div className="call-initiating">
              <div className="spinner"></div>
              <p>Initiating call...</p>
            </div>
          )}

          {call.isDemoCall && (
            <div className="demo-call-notice">
              <span className="demo-dot"></span>
              Demo mode - No actual call is being placed
            </div>
          )}
        </div>

        <div className="calling-controls">
          {callStatus === 'Connected' && (
            <>
              <button 
                className={`call-control-btn ${isMuted ? 'active' : ''}`}
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
              <button 
                className="call-control-btn"
                title="Volume"
              >
                <Volume2 size={20} />
                <span>Volume</span>
              </button>
            </>
          )}
        </div>

        <div className="calling-actions">
          {(callStatus === 'Connected' || callStatus === 'Ringing') && (
            <button className="btn-end-call" onClick={handleEndCall}>
              <PhoneOff size={20} />
              End Call
            </button>
          )}
          {callStatus === 'Initiating' && (
            <button className="btn-cancel-call" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Incoming call notification
export function IncomingCallNotification({ call, onAccept, onReject, onOpenProfile }) {
  return (
    <div className="incoming-call-notification">
      <div className="incoming-call-header">
        <Phone size={18} className="incoming-icon" />
        <span>Incoming Call</span>
      </div>
      
      <div className="incoming-call-body">
        <div className="incoming-avatar">
          {call.customerName ? call.customerName.split(' ').map(s => s[0]).join('').slice(0, 2) : '?'}
        </div>
        <div className="incoming-details">
          <strong>{call.customerName || 'Unknown Caller'}</strong>
          <span>{call.phone}</span>
          {call.leadId && (
            <div className="incoming-lead-info">
              <span className="badge new">{call.product}</span>
              <span className="subtext">{call.leadId}</span>
            </div>
          )}
          {call.previousInteractions > 0 && (
            <span className="previous-calls">{call.previousInteractions} previous interactions</span>
          )}
        </div>
      </div>

      <div className="incoming-call-actions">
        <button className="btn-reject-call" onClick={onReject}>
          <PhoneOff size={18} />
          Decline
        </button>
        <button className="btn-accept-call" onClick={onAccept}>
          <Phone size={18} />
          Accept
        </button>
      </div>

      {call.leadId && (
        <button className="view-profile-link" onClick={onOpenProfile}>
          View customer profile
        </button>
      )}

      {!call.leadId && (
        <button className="create-lead-link" onClick={onOpenProfile}>
          Create new lead from this call
        </button>
      )}
    </div>
  )
}

// Call outcome form modal
export function CallOutcomeForm({ call, onSave, onCancel, dispositions }) {
  const [form, setForm] = useState({
    status: call?.status || 'Completed',
    disposition: 'Connected — Interested',
    response: '',
    notes: '',
    interestLevel: 'Medium',
    nextFollowUp: '',
    nextFollowUpTime: '',
    priority: 'Medium'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      callId: call.id,
      duration: call.duration || 0
    })
  }

  const interestLevels = ['High', 'Medium', 'Low', 'Not Interested']
  const priorities = ['High', 'Medium', 'Low']

  return (
    <div className="modal-backdrop">
      <div className="modal call-outcome-modal">
        <div className="modal-head">
          <h2>Call Outcome - {call.customerName}</h2>
          <button className="icon-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="call-outcome-summary">
            <div className="outcome-detail">
              <span>Duration</span>
              <strong>{call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '0s'}</strong>
            </div>
            <div className="outcome-detail">
              <span>Phone</span>
              <strong>{call.phone}</strong>
            </div>
            <div className="outcome-detail">
              <span>Product</span>
              <strong>{call.product}</strong>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <span>Call Disposition *</span>
              <select 
                value={form.disposition} 
                onChange={e => setForm(p => ({ ...p, disposition: e.target.value }))}
                required
              >
                {dispositions.map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <span>Customer Interest Level</span>
              <select 
                value={form.interestLevel} 
                onChange={e => setForm(p => ({ ...p, interestLevel: e.target.value }))}
              >
                {interestLevels.map(level => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Customer Response</span>
              <input 
                type="text"
                value={form.response} 
                onChange={e => setForm(p => ({ ...p, response: e.target.value }))}
                placeholder="Brief summary of customer response"
              />
            </div>

            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <span>Call Notes *</span>
              <textarea 
                rows="4"
                value={form.notes} 
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Document the conversation details, customer requirements, and next steps..."
                required
              />
            </div>

            <div className="field">
              <span>Next Follow-up Date</span>
              <input 
                type="date"
                value={form.nextFollowUp} 
                onChange={e => setForm(p => ({ ...p, nextFollowUp: e.target.value }))}
              />
            </div>

            <div className="field">
              <span>Follow-up Time</span>
              <input 
                type="time"
                value={form.nextFollowUpTime} 
                onChange={e => setForm(p => ({ ...p, nextFollowUpTime: e.target.value }))}
              />
            </div>

            <div className="field">
              <span>Follow-up Priority</span>
              <select 
                value={form.priority} 
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
              >
                {priorities.map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {call.isDemoCall && (
            <div className="notice-inline">
              Demo mode: This outcome will be saved to demo data only
            </div>
          )}

          <div className="form-footer">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save Call Outcome
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
