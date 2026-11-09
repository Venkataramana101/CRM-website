import React, { useMemo, useState } from 'react'
import { PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, MessageSquare, Mail, Calendar, Filter } from 'lucide-react'

// Unified communication timeline showing all interactions
export function CommunicationTimeline({ leadId, calls = [], whatsappMessages = [], activities = [], emails = [] }) {
  const [filterType, setFilterType] = useState('All')
  const [filterDate, setFilterDate] = useState('All time')

  // Combine all communication events into a unified timeline
  const timeline = useMemo(() => {
    const events = []

    // Add call events
    calls.forEach(call => {
      events.push({
        id: call.id,
        type: 'call',
        subtype: call.direction,
        timestamp: call.startTime || call.createdAt,
        title: `${call.direction} Call`,
        description: call.disposition,
        details: call.notes,
        duration: call.duration,
        status: call.status,
        employee: call.employeeName,
        phone: call.phone,
        icon: call.direction === 'Incoming' ? PhoneIncoming : PhoneOutgoing
      })
    })

    // Add WhatsApp messages
    whatsappMessages.forEach(msg => {
      if (msg.direction === 'incoming') {
        events.push({
          id: msg.id,
          type: 'whatsapp',
          subtype: msg.direction,
          timestamp: msg.timestamp,
          title: 'WhatsApp Message Received',
          description: msg.content.substring(0, 100),
          details: msg.content,
          status: msg.status,
          employee: null,
          icon: MessageSquare
        })
      } else {
        events.push({
          id: msg.id,
          type: 'whatsapp',
          subtype: msg.direction,
          timestamp: msg.timestamp,
          title: 'WhatsApp Message Sent',
          description: msg.content.substring(0, 100),
          details: msg.content,
          status: msg.status,
          employee: msg.employeeName,
          icon: MessageSquare
        })
      }
    })

    // Add activity events
    activities.forEach(activity => {
      events.push({
        id: activity.id,
        type: 'activity',
        timestamp: activity.date,
        title: 'Call Activity',
        description: activity.disposition,
        details: activity.notes,
        employee: activity.owner,
        icon: PhoneCall
      })
    })

    // Sort by timestamp descending (most recent first)
    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [calls, whatsappMessages, activities])

  // Filter timeline
  const filteredTimeline = useMemo(() => {
    let filtered = timeline

    if (filterType !== 'All') {
      filtered = filtered.filter(event => event.type === filterType.toLowerCase())
    }

    // Additional date filtering could be added here

    return filtered
  }, [timeline, filterType, filterDate])

  const getEventColor = (type, subtype) => {
    if (type === 'call') {
      if (subtype === 'Incoming') return 'event-incoming'
      if (subtype === 'Outgoing') return 'event-outgoing'
    }
    if (type === 'whatsapp') return 'event-whatsapp'
    if (type === 'email') return 'event-email'
    return 'event-activity'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const formatDuration = (seconds) => {
    if (!seconds) return null
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="communication-timeline">
      <div className="timeline-header">
        <div>
          <h3>Communication History</h3>
          <p>Complete timeline of all interactions</p>
        </div>
        <div className="timeline-filters">
          <div className="filter-group">
            <Filter size={14} />
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option>All</option>
              <option>Call</option>
              <option>WhatsApp</option>
              <option>Activity</option>
            </select>
          </div>
          <div className="timeline-count">
            {filteredTimeline.length} events
          </div>
        </div>
      </div>

      <div className="timeline-list">
        {filteredTimeline.map((event, index) => {
          const Icon = event.icon
          return (
            <div key={event.id} className="timeline-event">
              <div className="timeline-marker">
                <div className={`timeline-icon ${getEventColor(event.type, event.subtype)}`}>
                  <Icon size={16} />
                </div>
                {index < filteredTimeline.length - 1 && <div className="timeline-connector" />}
              </div>

              <div className="timeline-content">
                <div className="timeline-event-header">
                  <strong>{event.title}</strong>
                  <span className="timeline-time">{formatTimestamp(event.timestamp)}</span>
                </div>

                <div className="timeline-event-body">
                  <p className="timeline-description">{event.description}</p>
                  
                  {event.details && event.details !== event.description && (
                    <p className="timeline-details">{event.details}</p>
                  )}

                  <div className="timeline-meta">
                    {event.employee && (
                      <span className="timeline-employee">
                        <span className="meta-label">By:</span> {event.employee}
                      </span>
                    )}
                    {event.duration > 0 && (
                      <span className="timeline-duration">
                        <span className="meta-label">Duration:</span> {formatDuration(event.duration)}
                      </span>
                    )}
                    {event.status && (
                      <span className={`timeline-status status-${event.status.toLowerCase().replace(' ', '-')}`}>
                        {event.status}
                      </span>
                    )}
                    {event.phone && (
                      <span className="timeline-phone">
                        <span className="meta-label">Phone:</span> {event.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="timeline-event-footer">
                  <span className="timeline-timestamp">
                    {new Date(event.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {filteredTimeline.length === 0 && (
          <div className="empty-timeline">
            <Calendar size={32} />
            <strong>No communication history</strong>
            <span>Interactions will appear here once logged</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact communication summary widget
export function CommunicationSummary({ calls = [], whatsappMessages = [], activities = [] }) {
  const stats = useMemo(() => {
    return {
      totalCalls: calls.length,
      totalMessages: whatsappMessages.length,
      lastContact: [...calls, ...whatsappMessages, ...activities]
        .sort((a, b) => new Date(b.startTime || b.timestamp || b.date) - new Date(a.startTime || a.timestamp || a.date))[0],
      callDuration: calls.reduce((sum, call) => sum + (call.duration || 0), 0)
    }
  }, [calls, whatsappMessages, activities])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const getLastContactText = () => {
    if (!stats.lastContact) return 'No contact yet'
    
    const timestamp = stats.lastContact.startTime || stats.lastContact.timestamp || stats.lastContact.date
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / 86400000)
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="communication-summary">
      <div className="comm-summary-item">
        <PhoneCall size={16} />
        <div>
          <strong>{stats.totalCalls}</strong>
          <span>Calls</span>
        </div>
      </div>
      <div className="comm-summary-item">
        <MessageSquare size={16} />
        <div>
          <strong>{stats.totalMessages}</strong>
          <span>Messages</span>
        </div>
      </div>
      <div className="comm-summary-item">
        <Calendar size={16} />
        <div>
          <strong>{getLastContactText()}</strong>
          <span>Last contact</span>
        </div>
      </div>
      {stats.callDuration > 0 && (
        <div className="comm-summary-item">
          <PhoneCall size={16} />
          <div>
            <strong>{formatDuration(stats.callDuration)}</strong>
            <span>Talk time</span>
          </div>
        </div>
      )}
    </div>
  )
}
