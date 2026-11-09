import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, X, Check, CheckCheck, Clock, AlertCircle, FileText, User } from 'lucide-react'

// WhatsApp conversation interface
export function WhatsAppInterface({ conversation, messages, onSendMessage, onClose, onOpenProfile, templates }) {
  const [messageText, setMessageText] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!messageText.trim() && !selectedTemplate) return

    const content = selectedTemplate 
      ? applyTemplate(selectedTemplate, conversation)
      : messageText

    onSendMessage({
      conversationId: conversation.id,
      leadId: conversation.leadId,
      content,
      type: selectedTemplate ? 'template' : 'text',
      templateId: selectedTemplate?.id
    })

    setMessageText('')
    setSelectedTemplate(null)
    setShowTemplates(false)
  }

  const applyTemplate = (template, conv) => {
    let content = template.content
    content = content.replace('{{customer_name}}', conv.customerName)
    content = content.replace('{{date}}', new Date().toLocaleDateString('en-IN'))
    content = content.replace('{{time}}', new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    return content
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Sent': return <Check size={14} />
      case 'Delivered': return <CheckCheck size={14} />
      case 'Read': return <CheckCheck size={14} className="read-check" />
      case 'Failed': return <AlertCircle size={14} className="failed-icon" />
      default: return <Clock size={14} />
    }
  }

  return (
    <div className="modal-backdrop whatsapp-backdrop">
      <div className="whatsapp-interface">
        <div className="whatsapp-header">
          <div className="whatsapp-header-info">
            <div className="whatsapp-avatar">
              {conversation.customerName.split(' ').map(s => s[0]).join('').slice(0, 2)}
            </div>
            <div className="whatsapp-header-text">
              <h3>{conversation.customerName}</h3>
              <span>{conversation.phone}</span>
            </div>
          </div>
          <div className="whatsapp-header-actions">
            {conversation.leadId && (
              <button className="icon-btn" onClick={onOpenProfile} title="View Profile">
                <User size={18} />
              </button>
            )}
            <button className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="whatsapp-conversation-info">
          {conversation.leadId && (
            <div className="conversation-meta">
              <span className="badge new">{conversation.status}</span>
              <span>•</span>
              <span>Assigned to {conversation.assignedTo}</span>
            </div>
          )}
          {!conversation.leadId && (
            <div className="unidentified-notice">
              <AlertCircle size={14} />
              <span>Unidentified contact - Consider creating a lead</span>
            </div>
          )}
        </div>

        <div className="whatsapp-messages">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`whatsapp-message ${msg.direction === 'outgoing' ? 'outgoing' : 'incoming'}`}
            >
              <div className="message-bubble">
                {msg.type === 'template' && (
                  <div className="template-indicator">
                    <FileText size={12} />
                    <span>Template Message</span>
                  </div>
                )}
                <div className="message-content">{msg.content}</div>
                <div className="message-meta">
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {msg.direction === 'outgoing' && (
                    <span className="message-status">
                      {getStatusIcon(msg.status)}
                    </span>
                  )}
                </div>
              </div>
              {msg.direction === 'outgoing' && msg.employeeName && (
                <div className="message-sender">Sent by {msg.employeeName}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showTemplates && (
          <div className="template-selector">
            <div className="template-selector-header">
              <h4>Select Template</h4>
              <button className="icon-btn" onClick={() => setShowTemplates(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="template-list">
              {templates.map(template => (
                <button
                  key={template.id}
                  className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedTemplate(template)
                    setMessageText(applyTemplate(template, conversation))
                    setShowTemplates(false)
                  }}
                >
                  <strong>{template.name}</strong>
                  <p>{template.content.substring(0, 100)}...</p>
                  <span className="badge approved">Approved</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form className="whatsapp-input" onSubmit={handleSend}>
          <button 
            type="button" 
            className="template-btn"
            onClick={() => setShowTemplates(!showTemplates)}
            title="Use Template"
          >
            <FileText size={18} />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="whatsapp-text-input"
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!messageText.trim() && !selectedTemplate}
          >
            <Send size={18} />
          </button>
        </form>

        <div className="whatsapp-footer-notice">
          <span className="demo-dot"></span>
          Demo mode - Messages are not sent via actual WhatsApp API
        </div>
      </div>
    </div>
  )
}

// WhatsApp conversation list
export function WhatsAppConversationList({ conversations, onSelectConversation, selectedId }) {
  return (
    <div className="whatsapp-conversation-list">
      {conversations.map(conv => (
        <button
          key={conv.id}
          className={`conversation-item ${selectedId === conv.id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
          onClick={() => onSelectConversation(conv)}
        >
          <div className="conversation-avatar">
            {conv.customerName.split(' ').map(s => s[0]).join('').slice(0, 2)}
          </div>
          <div className="conversation-details">
            <div className="conversation-header">
              <strong>{conv.customerName}</strong>
              <span className="conversation-time">
                {new Date(conv.lastMessageAt).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="conversation-preview">
              <span className="last-message">{conv.lastMessage}</span>
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
            <div className="conversation-meta">
              <span className="badge-small">{conv.status}</span>
              {conv.assignedTo && (
                <>
                  <span>•</span>
                  <span>{conv.assignedTo}</span>
                </>
              )}
            </div>
          </div>
        </button>
      ))}
      {conversations.length === 0 && (
        <div className="empty-conversations">
          <MessageSquare size={32} />
          <p>No conversations yet</p>
        </div>
      )}
    </div>
  )
}

// WhatsApp template manager
export function WhatsAppTemplateManager({ templates, onCreateTemplate, onEditTemplate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: 'Utility',
    content: '',
    variables: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateTemplate(form)
    setForm({ name: '', category: 'Utility', content: '', variables: [] })
    setShowForm(false)
  }

  return (
    <div className="template-manager">
      <div className="template-manager-header">
        <div>
          <h3>Message Templates</h3>
          <p>Manage approved WhatsApp message templates</p>
        </div>
        <button className="btn primary" onClick={() => setShowForm(true)}>
          Create Template
        </button>
      </div>

      <div className="template-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-card-header">
              <strong>{template.name}</strong>
              <span className={`badge ${template.status.toLowerCase()}`}>
                {template.status}
              </span>
            </div>
            <div className="template-card-body">
              <p>{template.content}</p>
            </div>
            <div className="template-card-footer">
              <span className="template-category">{template.category}</span>
              {template.variables.length > 0 && (
                <span className="template-variables">
                  Variables: {template.variables.join(', ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-head">
              <h2>Create WhatsApp Template</h2>
              <button className="icon-btn" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form className="form-body" onSubmit={handleSubmit}>
              <div className="field">
                <span>Template Name *</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Loan Approval Notification"
                  required
                />
              </div>
              <div className="field">
                <span>Category</span>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                >
                  <option>Utility</option>
                  <option>Marketing</option>
                  <option>Authentication</option>
                </select>
              </div>
              <div className="field">
                <span>Template Content *</span>
                <textarea
                  rows="5"
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Use {{customer_name}}, {{date}}, {{time}} for variables"
                  required
                />
              </div>
              <div className="notice-inline">
                Templates must be approved by WhatsApp before use. Demo templates are pre-approved.
              </div>
              <div className="form-footer">
                <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
