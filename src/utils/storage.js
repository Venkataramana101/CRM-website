import { seedLeads, seedTasks, seedCampaigns, seedActivities, seedCalls, seedMissedCalls, seedConversations, seedWhatsAppMessages, whatsappTemplates } from '../data/demoData'

// Start with empty data by default, no demo data
const defaults = {
  leads: [],
  tasks: [],
  campaigns: [],
  activities: [],
  calls: [],
  missedCalls: [],
  emails: [],
  whatsappConversations: [],
  whatsappMessages: [],
  templates: []
}

export function loadData(key, fallback) {
 try { 
   const saved = localStorage.getItem(`rcl-crm-${key}`)
   return saved ? JSON.parse(saved) : (fallback !== undefined ? fallback : defaults[key])
 }
 catch { return fallback !== undefined ? fallback : defaults[key] }
}
export function saveData(key, value) { localStorage.setItem(`rcl-crm-${key}`, JSON.stringify(value)) }
export function exportCsv(rows, filename) {
 if (!rows.length) return
 const keys = [...new Set(rows.flatMap(r => Object.keys(r)))]
 const esc = v => `"${String(v ?? '').replaceAll('"','""')}"`
 const csv = [keys.map(esc).join(','), ...rows.map(r => keys.map(k => esc(r[k])).join(','))].join('\r\n')
 const blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8;'})
 const url = URL.createObjectURL(blob), a = document.createElement('a')
 a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url)
}
export function resetDemo() { 
  const keys = ['leads','tasks','campaigns','activities','calls','missedCalls','emails','whatsappConversations','whatsappMessages','templates']
  keys.forEach(k => localStorage.removeItem(`rcl-crm-${k}`))
  // Also clear authentication state
  localStorage.removeItem('rcl-crm-logged-in')
  localStorage.removeItem('rcl-crm-current-agent')
  location.reload() 
}