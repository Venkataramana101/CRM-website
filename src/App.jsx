import React, { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Bell, BriefcaseBusiness, CalendarClock, ChartNoAxesCombined, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Download, FileUp, Filter, Headphones, LayoutDashboard, ListTodo, Menu, MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Target, Users, X, PhoneCall, Clock3, TrendingUp, UserRound, Megaphone, ShieldCheck, RefreshCw, MessageSquare, PhoneMissed, PhoneIncoming, PhoneOutgoing, Mail } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts'
import { products, branches, sources, statuses, callDispositions, seedCalls, seedMissedCalls, callStats, whatsappTemplates, seedConversations, seedWhatsAppMessages, whatsappStats } from './data/demoData'
import { loadData, saveData, exportCsv, resetDemo } from './utils/storage'
import { CallingInterface, CallOutcomeForm, IncomingCallNotification } from './components/CallingInterface'
import { CommunicationTimeline, CommunicationSummary } from './components/CommunicationTimeline'
import { EmailComposer, EmailTimeline } from './components/EmailInterface'
import { initiateCall, simulateCallProgress, endCall, CALL_STATUS } from './services/telephonyService'
import { sendEmail, EMAIL_STATUS, getEmailStats } from './services/emailService'

const nav = [
 {label:'Overview',icon:LayoutDashboard},{label:'Leads',icon:Users},{label:'Telecaller Desk',icon:Headphones},
 {label:'Tasks & Follow-ups',icon:ListTodo},
 {label:'Campaigns',icon:Megaphone},{label:'Reports & Analytics',icon:ChartNoAxesCombined},{label:'Settings',icon:Settings}
]
const fmt = n => new Intl.NumberFormat('en-IN').format(n)
const money = n => '₹'+fmt(n)
const shortDate = v => v ? new Date(v).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}) : '—'
const chartTooltip = {contentStyle:{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}}
function Badge({children, tone=''}) { return <span className={`badge ${tone || String(children).toLowerCase().replaceAll(' ','-')}`}>{children}</span> }
function Button({children,onClick,kind='primary',icon:Icon,disabled=false,type='button'}) { return <button type={type} disabled={disabled} className={`btn ${kind}`} onClick={onClick}>{Icon&&<Icon size={15}/>}{children}</button> }
function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label> }
function Modal({title,onClose,children,wide=false}) { return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className={`modal ${wide?'wide':''}`}><header className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X size={18}/></button></header>{children}</section></div> }
function KPI({title,value,delta,icon:Icon,tone='teal',foot}) { return <div className="kpi"><div className={`kpi-icon ${tone}`}><Icon size={18}/></div><div className="kpi-title">{title}</div><div className="kpi-value">{value}</div><div className="kpi-foot">{delta&&<span className="trend"><ArrowUpRight size={13}/>{delta}</span>}{foot||'vs. previous period'}</div></div> }
function Empty({title,desc}) { return <div className="empty"><div className="empty-icon"><Search size={22}/></div><strong>{title}</strong><span>{desc}</span></div> }

export default function App() {
 // Authentication state
 const [isLoggedIn, setIsLoggedIn] = useState(()=>localStorage.getItem('rcl-crm-logged-in')==='true')
 const [loginEmail, setLoginEmail] = useState('')
 const [loginPassword, setLoginPassword] = useState('')
 const [loginError, setLoginError] = useState('')
 
 // Current telecaller selection (Priya or Rohan)
 const [currentAgent, setCurrentAgent] = useState(()=>localStorage.getItem('rcl-crm-current-agent')||'Priya')
 
 const [page,setPage] = useState('Overview'), [mobileNav,setMobileNav] = useState(false)
 const [leads,setLeads] = useState(()=>loadData('leads')), [tasks,setTasks] = useState(()=>loadData('tasks')), [campaigns,setCampaigns] = useState(()=>loadData('campaigns')), [activities,setActivities] = useState(()=>loadData('activities'))
 
 // Current logged-in user (frontdesk account, but calling as specific agent)
 const currentUser = {id:'EMP-DESK',name:currentAgent,branch:'Bengaluru',role:'Telecaller'}
 
 // Communication state - start with empty arrays, no demo data
 const [calls,setCalls] = useState(()=>loadData('calls'))
 const [missedCalls,setMissedCalls] = useState(()=>loadData('missedCalls'))
 const [activeCall,setActiveCall] = useState(null)
 
 // Email state
 const [emails,setEmails] = useState(()=>loadData('emails'))
 const [activeEmail,setActiveEmail] = useState(null)
 
 const [query,setQuery] = useState(''), [toast,setToast] = useState(''), [modal,setModal] = useState(''), [selected,setSelected] = useState(null), [leadFilter,setLeadFilter] = useState({status:'All statuses',branch:'All branches',product:'All products',source:'All sources',priority:'All priorities'}), [sort,setSort] = useState({key:'created',dir:-1}), [pageNum,setPageNum] = useState(1), [taskTab,setTaskTab] = useState('Pending'), [reportFilter,setReportFilter] = useState('All branches')
 const [leadForm,setLeadForm] = useState({name:'',phone:'',product:products[0],source:sources[0],campaign:'',branch:branches[0],owner:'Priya',priority:'Medium',status:'New',followUp:'',notes:''})
 const [callForm,setCallForm] = useState({disposition:'Connected — Interested',notes:'',callback:'',reason:'',nextAction:'Follow-up'})
 const [taskForm,setTaskForm] = useState({title:'',leadId:'',type:'Callback',owner:'Priya',due:'',priority:'Medium'})
 const [globalSearchOpen,setGlobalSearchOpen] = useState(false)
 
 // CSV Import state
 const [importData, setImportData] = useState([])
 const [importHeaders, setImportHeaders] = useState([])
 const [columnMapping, setColumnMapping] = useState({})
 const [showImportPreview, setShowImportPreview] = useState(false)
 
 useEffect(()=>{saveData('leads',leads)},[leads]); useEffect(()=>{saveData('tasks',tasks)},[tasks]); useEffect(()=>{saveData('campaigns',campaigns)},[campaigns]); useEffect(()=>{saveData('activities',activities)},[activities])
 useEffect(()=>{saveData('calls',calls)},[calls]); useEffect(()=>{saveData('missedCalls',missedCalls)},[missedCalls]); useEffect(()=>{saveData('emails',emails)},[emails])
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(t)},[toast])
 useEffect(()=>{localStorage.setItem('rcl-crm-current-agent',currentAgent)},[currentAgent])
 
 // Login handler
 const handleLogin = (e) => {
   e.preventDefault()
   if (loginEmail === 'frontdesk@ramaiahcapital.com' && loginPassword === 'Welcome@123') {
     setLoginError('')
     localStorage.setItem('rcl-crm-logged-in', 'true')
     // Force immediate state update and page reload to ensure clean render
     window.location.reload()
   } else {
     setLoginError('Invalid email or password. Please try again.')
   }
 }
 
 // Logout handler
 const handleLogout = (e) => {
   if (e) {
     e.preventDefault()
     e.stopPropagation()
   }
   if (confirm('Are you sure you want to logout?')) {
     localStorage.removeItem('rcl-crm-logged-in')
     localStorage.setItem('rcl-crm-current-agent', 'Priya') // Reset to default
     // Force immediate page reload to ensure clean render
     window.location.reload()
   }
 }
 
 // Agent selector
 const switchAgent = (agent) => {
   setCurrentAgent(agent)
   notify(`Switched to ${agent}'s workspace`)
 }
 
 // CSV Import functions
 const handleFileUpload = (e) => {
   const file = e.target.files?.[0]
   if (!file) return
   
   const reader = new FileReader()
   reader.onload = (event) => {
     try {
       const text = event.target.result
       const lines = text.split(/\r?\n/).filter(Boolean)
       
       if (lines.length < 2) {
         notify('CSV file must contain headers and at least one data row')
         return
       }
       
       // Parse headers
       const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
       
       // Parse data rows
       const data = lines.slice(1).map(line => {
         const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
         const row = {}
         headers.forEach((header, index) => {
           row[header] = values[index] || ''
         })
         return row
       })
       
       setImportHeaders(headers)
       setImportData(data)
       
       // Auto-map common column names
       const autoMapping = {}
       headers.forEach(header => {
         const lowerHeader = header.toLowerCase()
         if (lowerHeader.includes('name') || lowerHeader === 'customer') autoMapping[header] = 'name'
         else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile') || lowerHeader.includes('contact')) autoMapping[header] = 'phone'
         else if (lowerHeader.includes('email')) autoMapping[header] = 'email'
         else if (lowerHeader.includes('product') || lowerHeader.includes('loan')) autoMapping[header] = 'product'
         else if (lowerHeader.includes('source')) autoMapping[header] = 'source'
         else if (lowerHeader.includes('branch') || lowerHeader.includes('location')) autoMapping[header] = 'branch'
         else if (lowerHeader.includes('priority')) autoMapping[header] = 'priority'
         else if (lowerHeader.includes('note') || lowerHeader.includes('comment')) autoMapping[header] = 'notes'
       })
       
       setColumnMapping(autoMapping)
       setShowImportPreview(true)
       notify(`CSV loaded: ${data.length} rows found`)
     } catch (error) {
       notify('Error parsing CSV file. Please check the format.')
     }
   }
   reader.readAsText(file)
   e.target.value = '' // Reset input
 }
 
 const importLeads = () => {
   let imported = 0
   let skipped = 0
   
   const newLeads = importData.map((row, index) => {
     // Get mapped values
     const name = row[Object.keys(columnMapping).find(k => columnMapping[k] === 'name')] || ''
     const phone = row[Object.keys(columnMapping).find(k => columnMapping[k] === 'phone')] || ''
     
     // Skip if no name or phone
     if (!name || !phone) {
       skipped++
       return null
     }
     
     // Check for duplicate phone
     if (leads.some(l => l.phone === phone)) {
       skipped++
       return null
     }
     
     imported++
     
     const productCol = Object.keys(columnMapping).find(k => columnMapping[k] === 'product')
     const sourceCol = Object.keys(columnMapping).find(k => columnMapping[k] === 'source')
     const branchCol = Object.keys(columnMapping).find(k => columnMapping[k] === 'branch')
     const priorityCol = Object.keys(columnMapping).find(k => columnMapping[k] === 'priority')
     const notesCol = Object.keys(columnMapping).find(k => columnMapping[k] === 'notes')
     
     return {
       id: 'LED-' + Date.now() + '-' + index,
       name: name,
       phone: phone.replace(/\D/g, '').slice(0, 10),
       product: (productCol && products.includes(row[productCol])) ? row[productCol] : products[0],
       source: (sourceCol && sources.includes(row[sourceCol])) ? row[sourceCol] : 'Import',
       campaign: 'Bulk Import',
       branch: (branchCol && branches.includes(row[branchCol])) ? row[branchCol] : branches[0],
       owner: currentAgent,
       priority: (priorityCol && ['Low','Medium','High'].includes(row[priorityCol])) ? row[priorityCol] : 'Medium',
       status: 'New',
       created: new Date().toISOString().slice(0,10),
       lastContacted: '—',
       followUp: '',
       qualification: '',
       notes: notesCol ? row[notesCol] : ''
     }
   }).filter(Boolean)
   
   setLeads(prev => [...newLeads, ...prev])
   setShowImportPreview(false)
   setImportData([])
   setImportHeaders([])
   setColumnMapping({})
   
   notify(`Import complete: ${imported} leads added, ${skipped} skipped (duplicates or missing data)`)
 }
 
 // If not logged in, show login page
 if (!isLoggedIn) {
   return <div className="login-page">
     <div className="login-container">
       <div className="login-brand">
         <div className="brand-mark">RC</div>
         <h1>RAMAIAH CAPITAL</h1>
         <p>CRM Workspace Login</p>
       </div>
       <form className="login-form" onSubmit={handleLogin}>
         <h2>Sign In</h2>
         <p className="login-subtitle">Enter your credentials to access the CRM</p>
         {loginError && <div className="login-error">{loginError}</div>}
         <div className="field">
           <span>Email Address</span>
           <input 
             type="email" 
             value={loginEmail} 
             onChange={e=>setLoginEmail(e.target.value)} 
             placeholder="frontdesk@ramaiahcapital.com"
             required
             autoFocus
           />
         </div>
         <div className="field">
           <span>Password</span>
           <input 
             type="password" 
             value={loginPassword} 
             onChange={e=>setLoginPassword(e.target.value)} 
             placeholder="Enter your password"
             required
           />
         </div>
         <button type="submit" className="btn primary" style={{width:'100%',marginTop:'10px'}}>
           Sign In
         </button>
         <div className="login-demo-info">
           <strong>Demo Credentials:</strong><br/>
           Email: frontdesk@ramaiahcapital.com<br/>
           Password: Welcome@123
         </div>
       </form>
       <div className="login-footer">
         © 2026 Ramaiah Capital Private Limited
       </div>
     </div>
   </div>
 }
 const filteredLeads = useMemo(()=>leads.filter(l=>{
  const q=query.trim().toLowerCase()
  const matchQ=!q||[l.id,l.name,l.phone,l.product,l.source,l.owner,l.campaign].some(v=>String(v||'').toLowerCase().includes(q))
  return matchQ&&(leadFilter.status==='All statuses'||l.status===leadFilter.status)&&(leadFilter.branch==='All branches'||l.branch===leadFilter.branch)&&(leadFilter.product==='All products'||l.product===leadFilter.product)&&(leadFilter.source==='All sources'||l.source===leadFilter.source)&&(leadFilter.priority==='All priorities'||l.priority===leadFilter.priority)
 }).sort((a,b)=>String(a[sort.key]||'').localeCompare(String(b[sort.key]||''))*sort.dir),[leads,query,leadFilter,sort])
 const pageRows = filteredLeads.slice((pageNum-1)*6,pageNum*6)
 const counts = useMemo(()=>({total:leads.length,new:leads.filter(l=>l.status==='New').length,contacted:leads.filter(l=>l.status==='Contacted').length,qualified:leads.filter(l=>['Qualified','Handed Over','Converted'].includes(l.status)).length,converted:leads.filter(l=>l.status==='Converted').length,callbacks:tasks.filter(t=>t.status==='Pending'&&t.type==='Callback').length,overdue:tasks.filter(t=>t.status==='Pending'&&t.due&&new Date(t.due)<new Date('2026-10-17T09:00')).length}),[leads,tasks])
 
 // Communication counts
 const commCounts = useMemo(()=>({
  totalCalls:calls.length,
  incomingCalls:calls.filter(c=>c.direction==='Incoming').length,
  outgoingCalls:calls.filter(c=>c.direction==='Outgoing').length,
  connectedCalls:calls.filter(c=>c.status==='Completed'&&c.duration>0).length,
  missedCallsCount:missedCalls.filter(m=>m.status==='Pending').length,
  avgCallDuration:calls.filter(c=>c.duration>0).reduce((sum,c)=>sum+c.duration,0)/Math.max(1,calls.filter(c=>c.duration>0).length)
 }),[calls,missedCalls])
 
 const notify = msg => setToast(msg)
 const changePage = p => {setPage(p);setMobileNav(false);setQuery('');setPageNum(1)}
 const openAddLead = () => {setSelected(null);setLeadForm({name:'',phone:'',product:products[0],source:sources[0],campaign:'',branch:branches[0],owner:'Priya',priority:'Medium',status:'New',followUp:'',notes:''});setModal('lead')}
 const editLead = l => {setSelected(l);setLeadForm({...l});setModal('lead')}
 const saveLead = e => {
  e.preventDefault()
  if(!leadForm.name.trim()||!/^\d{10}$/.test(leadForm.phone)) {notify('Enter a name and valid 10-digit phone number.');return}
  if(leads.some(l=>l.phone===leadForm.phone&&l.id!==selected?.id)){notify('Possible duplicate: this phone number already exists.');return}
  if(selected){setLeads(prev=>prev.map(l=>l.id===selected.id?{...l,...leadForm}:l));notify('Lead updated successfully.')}
  else {const id='RCL-'+String(Date.now()).slice(-6);setLeads(prev=>[{...leadForm,id,created:new Date().toISOString().slice(0,10),lastContacted:'—',qualification:'Pending',closureReason:''},...prev]);notify('Lead created successfully.')}
  setModal('');setSelected(null)
 }
 const updateLeadStatus=(id,status)=>{setLeads(prev=>prev.map(l=>l.id===id?{...l,status,qualification:status==='Qualified'?'Qualified':l.qualification}:l));notify('Lead status updated.')}
 const saveCall=e=>{e.preventDefault();if(!selected)return;const a={id:'ACT-'+Date.now(),leadId:selected.id,date:new Date().toLocaleString('en-IN'),disposition:callForm.disposition,notes:callForm.notes,owner:selected.owner};setActivities(prev=>[a,...prev]);setLeads(prev=>prev.map(l=>l.id===selected.id?{...l,lastContacted:new Date().toISOString().slice(0,10),status:callForm.disposition==='Qualified'?'Qualified':callForm.disposition==='Callback Requested'?'Callback':callForm.disposition==='Do Not Contact'?'Do Not Contact':'Contacted',followUp:callForm.callback||l.followUp,notes:callForm.notes||l.notes}:l));if(callForm.callback){setTasks(prev=>[{id:'TSK-'+Date.now(),title:`Callback — ${selected.name}`,leadId:selected.id,type:'Callback',owner:selected.owner,due:callForm.callback,priority:selected.priority,status:'Pending'},...prev])}setModal('');notify('Demo call activity saved. No real call was placed.')}
 const saveTask=e=>{e.preventDefault();if(!taskForm.title.trim()||!taskForm.due){notify('Enter task title and due date/time.');return}setTasks(prev=>[{...taskForm,id:'TSK-'+Date.now(),status:'Pending'},...prev]);setModal('');notify('Follow-up task created.')}
 const completeTask=id=>{setTasks(prev=>prev.map(t=>t.id===id?{...t,status:'Completed'}:t));notify('Task marked completed.')}
 const showLead = l=>{setSelected(l);setModal('detail')}
 
 // Call handling functions
 const initiateCallToCustomer = async (lead) => {
   try {
     // Use the lead's assigned owner (telecaller) for the call
     const employeeName = lead.owner || currentUser.name
     // Map employee names to IDs (Priya and Rohan)
     const employeeId = 'EMP-' + (employeeName === 'Priya' ? '001' : employeeName === 'Rohan' ? '002' : '001')
     
     const result = await initiateCall(lead.phone, lead.id, employeeId, employeeName)
     
     if (result.success) {
       const newCall = {
         id: result.callId,
         leadId: lead.id,
         customerId: lead.id,
         customerName: lead.name,
         phone: lead.phone,
         direction: 'Outgoing',
         status: result.status,
         disposition: '',
         duration: 0,
         startTime: new Date().toISOString(),
         endTime: null,
         employeeId: employeeId,
         employeeName: employeeName,
         branch: lead.branch,
         product: lead.product,
         notes: '',
         recordingUrl: null,
         createdAt: new Date().toISOString(),
         isDemoCall: result.isDemoCall
       }
       
       setActiveCall(newCall)
       
       // Simulate call progress in demo mode
       if (result.isDemoCall) {
         const cleanup = simulateCallProgress(result.callId, (statusUpdate) => {
           setActiveCall(prev => prev ? {...prev, status: statusUpdate.status} : null)
         })
         return () => cleanup && cleanup()
       }
     } else {
       notify('Failed to initiate call: ' + (result.error || 'Unknown error'))
     }
   } catch (error) {
     notify('Error initiating call: ' + error.message)
   }
 }
 
 const handleEndCall = async (duration) => {
   if (!activeCall) return
   
   const result = await endCall(activeCall.id, duration)
   
   if (result.success) {
     const completedCall = {
       ...activeCall,
       status: CALL_STATUS.COMPLETED,
       duration,
       endTime: new Date().toISOString()
     }
     
     // Open call outcome form
     setSelected(leads.find(l => l.id === activeCall.leadId))
     setActiveCall(completedCall)
     setModal('callOutcome')
   }
 }
 
 const saveCallOutcome = (outcome) => {
   console.log('saveCallOutcome called with:', outcome)
   console.log('activeCall:', activeCall)
   
   if (!activeCall) {
     console.error('No active call to save!')
     notify('Error: No active call found')
     return
   }
   
   const finalCall = {
     ...activeCall,
     disposition: outcome.disposition,
     notes: outcome.notes,
     status: 'Completed',
     endTime: new Date().toISOString(),
     duration: activeCall.duration || 0
   }
   
   console.log('Saving call:', finalCall)
   
   // Save call to history - ADD TO BEGINNING OF ARRAY
   setCalls(prev => {
     const updatedCalls = [finalCall, ...prev]
     console.log('Updated calls array length:', updatedCalls.length)
     // Force save to localStorage immediately
     saveData('calls', updatedCalls)
     console.log('Saved to localStorage')
     return updatedCalls
   })
   
   // Create activity log
   const activity = {
     id: 'ACT-' + Date.now(),
     leadId: activeCall.leadId,
     date: new Date().toLocaleString('en-IN'),
     disposition: outcome.disposition,
     notes: outcome.notes,
     owner: activeCall.employeeName
   }
   setActivities(prev => [activity, ...prev])
   
   // Update lead with proper status logic
   setLeads(prev => prev.map(l => {
     if (l.id !== activeCall.leadId) return l
     
     let newStatus = l.status
     if (outcome.disposition.includes('Qualified')) {
       newStatus = 'Qualified'
     } else if (outcome.disposition.includes('Callback') || outcome.disposition.includes('No Answer')) {
       newStatus = 'Callback'
     } else if (outcome.disposition.includes('Not Interested') || outcome.disposition.includes('Wrong Number')) {
       newStatus = 'Not Qualified'
     } else if (outcome.disposition.includes('Do Not Contact')) {
       newStatus = 'Do Not Contact'
     } else if (outcome.disposition.includes('Interested') || outcome.disposition.includes('Connected')) {
       newStatus = 'Contacted'
     }
     
     return {
       ...l,
       lastContacted: new Date().toISOString().slice(0,10),
       status: newStatus
     }
   }))
   
   // Create follow-up task if needed
   if (outcome.nextFollowUp) {
     const followUpDateTime = `${outcome.nextFollowUp}T${outcome.nextFollowUpTime || '10:00'}`
     setTasks(prev => [{
       id: 'TSK-' + Date.now(),
       title: `Follow-up call — ${activeCall.customerName}`,
       leadId: activeCall.leadId,
       type: 'Callback',
       owner: activeCall.employeeName,
       due: followUpDateTime,
       priority: outcome.priority,
       status: 'Pending'
     }, ...prev])
   }
   
   setActiveCall(null)
   setModal('')
   
   // Automatically navigate to Call History page to show the saved call
   setPage('Call History')
   notify('Call saved successfully! Viewing in Call History.')
 }
 
 // WhatsApp handling functions
 const openWhatsAppConversation = (lead) => {
   // Open WhatsApp Web directly with the customer's phone number
   // Format: https://wa.me/[country_code][phone_number]
   // For India, country code is 91
   const phoneNumber = lead.phone.replace(/\D/g, '') // Remove non-digits
   const whatsappUrl = `https://wa.me/91${phoneNumber}`
   
   // Open in new tab
   window.open(whatsappUrl, '_blank')
   
   // Use the lead's assigned owner for logging
   const employeeName = lead.owner || currentUser.name
   
   // Log the WhatsApp interaction
   const activity = {
     id: 'ACT-' + Date.now(),
     leadId: lead.id,
     date: new Date().toLocaleString('en-IN'),
     disposition: 'WhatsApp Message Initiated',
     notes: `Opened WhatsApp conversation with ${lead.name}`,
     owner: employeeName
   }
   setActivities(prev => [activity, ...prev])
   
   // Update last contacted
   setLeads(prev => prev.map(l => 
     l.id === lead.id 
       ? {...l, lastContacted: new Date().toISOString().slice(0,10)}
       : l
   ))
   
   notify(`Opening WhatsApp chat with ${lead.name}...`)
 }
 
 // Email handling functions
 const openEmailComposer = (lead) => {
   setActiveEmail(lead)
   setModal('email')
 }
 
 const handleSendEmail = async (emailData) => {
   if (!activeEmail) return
   
   try {
     const employeeName = activeEmail.owner || currentUser.name
     const employeeId = 'EMP-' + (employeeName === 'Priya' ? '001' : employeeName === 'Rohan' ? '002' : '001')
     
     const result = await sendEmail({
       ...emailData,
       leadId: activeEmail.id,
       employeeId: employeeId,
       employeeName: employeeName,
       branch: activeEmail.branch
     })
     
     if (result.success) {
       // Save email to history
       setEmails(prev => [result.email, ...prev])
       
       // Log the email activity
       const activity = {
         id: 'ACT-' + Date.now(),
         leadId: activeEmail.id,
         date: new Date().toLocaleString('en-IN'),
         disposition: 'Email Sent',
         notes: `Sent email: ${emailData.subject}`,
         owner: employeeName
       }
       setActivities(prev => [activity, ...prev])
       
       // Update last contacted
       setLeads(prev => prev.map(l => 
         l.id === activeEmail.id 
           ? {...l, lastContacted: new Date().toISOString().slice(0,10)}
           : l
       ))
       
       setActiveEmail(null)
       setModal('')
       notify(`Email sent successfully to ${activeEmail.name}!`)
     } else {
       notify('Failed to send email: ' + (result.error || 'Unknown error'))
     }
   } catch (error) {
     notify('Error sending email: ' + error.message)
   }
 }
 
 const dispositionOptions=['Connected — Interested','Connected — Not Interested','Callback Requested','No Answer','Busy','Switched Off','Unreachable','Wrong Number','More Information Required','Qualified','Not Qualified','Do Not Contact']

 // Generate real chart data from actual leads (last 6 days)
 const chartLeads = useMemo(() => {
   const days = []
   const today = new Date()
   
   for (let i = 5; i >= 0; i--) {
     const date = new Date(today)
     date.setDate(date.getDate() - i)
     const dateStr = date.toISOString().split('T')[0]
     const dayLabel = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
     
     const dayLeads = leads.filter(l => l.created && l.created.startsWith(dateStr))
     const qualified = dayLeads.filter(l => ['Qualified', 'Handed Over', 'Converted'].includes(l.status))
     
     days.push({
       day: dayLabel,
       leads: dayLeads.length,
       qualified: qualified.length
     })
   }
   
   return days
 }, [leads])

 const sourceData=sources.map((s,i)=>({name:s,value:leads.filter(l=>l.source===s).length})).filter(x=>x.value)
 const funnel=[{name:'Total Leads',value:leads.length,fill:'#0f766e'},{name:'Contacted',value:leads.filter(l=>l.lastContacted!=='—').length,fill:'#168b85'},{name:'Qualified',value:counts.qualified,fill:'#36aaa2'},{name:'Converted',value:counts.converted,fill:'#8bd2cb'}]
 const campaignRows=campaigns.map(c=>({...c,contactRate:c.leads?Math.round(c.valid/c.leads*100):0,conversionRate:c.leads?Math.round(c.conversions/c.leads*100):0,cpl:c.leads?Math.round(c.spend/c.leads):0,cpq:c.qualified?Math.round(c.spend/c.qualified):0}))
 const inputSelect=(value,onChange,options)=> <select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>
 const selectFilter=(key,options)=> <select value={leadFilter[key]} onChange={e=>{setLeadFilter(p=>({...p,[key]:e.target.value}));setPageNum(1)}}>{options.map(o=><option key={o}>{o}</option>)}</select>
 const leadTable=(rows, compact=false)=><div className="table-wrap"><table><thead><tr>{['Lead / Customer','Product','Source','Branch','Owner','Priority','Status','Next follow-up','Actions'].map((h,i)=><th key={h||i}>{h}</th>)}</tr></thead><tbody>{rows.map(l=><tr key={l.id}><td><button className="lead-name" onClick={()=>showLead(l)}>{l.name}</button><span className="subtext">{l.id} · {l.phone}</span></td><td>{l.product}</td><td>{l.source}</td><td>{l.branch}</td><td>{l.owner}</td><td><Badge tone={l.priority.toLowerCase()}>{l.priority}</Badge></td><td><select className="status-select" value={l.status} onChange={e=>updateLeadStatus(l.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td><td>{l.followUp?new Date(l.followUp).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'—'}</td><td><div style={{display:'flex',gap:'6px'}}><button className="icon-btn" title="Call" onClick={()=>initiateCallToCustomer(l)}><PhoneCall size={16}/></button><button className="icon-btn" title="WhatsApp" onClick={()=>openWhatsAppConversation(l)}><MessageSquare size={16}/></button><button className="icon-btn" title="Email" onClick={()=>openEmailComposer(l)}><Mail size={16}/></button><button className="icon-btn" title="Edit" onClick={()=>editLead(l)}><MoreHorizontal size={17}/></button></div></td></tr>)}</tbody></table>{!rows.length&&<Empty title="No leads found" desc="Try changing the search or filters."/>}</div>
 const sectionHead=(eyebrow,title,desc,action)=><div className="section-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>
 return <div className="app-shell">
  <aside className={`sidebar ${mobileNav?'open':''}`}><div className="brand"><div className="brand-mark">RC</div><div><strong>RAMAIAH CAPITAL</strong><small>CRM WORKSPACE</small></div><button className="mobile-close icon-btn" onClick={()=>setMobileNav(false)}><X size={18}/></button></div><div className="workspace-label">WORKSPACE</div><nav>{nav.map(n=><button key={n.label} className={`nav-item ${page===n.label?'active':''}`} onClick={()=>changePage(n.label)}><n.icon size={18}/><span>{n.label}</span>{n.label==='Tasks & Follow-ups'&&tasks.filter(t=>t.status==='Pending').length>0&&<em>{tasks.filter(t=>t.status==='Pending').length}</em>}</button>)}</nav><div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need help?</strong><span>CRM prototype workspace</span><button onClick={()=>notify('This prototype uses illustrative data. Contact your internal administrator for production support.')}>View help <ChevronRight size={13}/></button></div><div className="profile"><div className="avatar">FD</div><div><strong>Front Desk</strong><small>Ramaiah Capital · Telecaller</small></div><ChevronDown size={15}/></div></div></aside>
  {mobileNav&&<div className="mobile-overlay" onClick={()=>setMobileNav(false)}/>}
  <main className="main-area"><header className="topbar"><div className="top-left"><button className="mobile-menu icon-btn" onClick={()=>setMobileNav(true)}><Menu size={19}/></button><span className="crumb">Workspace</span><ChevronRight size={14}/><strong>{page}</strong></div><div className="top-actions"><div className="global-search"><Search size={16}/><input value={query} onChange={e=>{setQuery(e.target.value);if(page!=='Leads')setPage('Leads')}} placeholder="Search leads, phone, product..." /><kbd>⌘ K</kbd></div><button className="icon-btn notification" onClick={()=>notify(`${tasks.filter(t=>t.owner===currentAgent&&t.status==='Pending').length} pending tasks for ${currentAgent}.`)}><Bell size={18}/>{tasks.filter(t=>t.owner===currentAgent&&t.status==='Pending').length>0&&<i/>}</button><div className="top-user" onClick={handleLogout} style={{cursor:'pointer'}} title="Click to logout"><div className="avatar small">FD</div><div><strong>Front Desk</strong><small>frontdesk@ramaiahcapital.com · Logout</small></div><ChevronDown size={14}/></div></div></header>
  <div className="content">
  {page==='Overview'&&<>{sectionHead('MANAGEMENT OVERVIEW','Good morning, Front Desk','Here’s a snapshot of your lead operations. All metrics shown are illustrative demo data.',<Button icon={Download} kind="secondary" onClick={()=>exportCsv(leads,'ramaiah-crm-leads.csv')}>Export data</Button>)}<div className="demo-notice"><span className="demo-dot"/> DEMO ENVIRONMENT <span>Sample records and illustrative metrics — not actual company performance.</span></div><div className="kpi-grid"><KPI title="Total leads" value={fmt(counts.total)} delta="12.8%" icon={Users}/><KPI title="New leads" value={fmt(counts.new)} delta="8.4%" icon={UserRound} tone="blue"/><KPI title="Qualified leads" value={fmt(counts.qualified)} delta="5.2%" icon={Target} tone="purple"/><KPI title="Converted leads" value={fmt(counts.converted)} delta="3.1%" icon={Check} tone="green"/><KPI title="Callbacks pending" value={fmt(counts.callbacks)} icon={PhoneCall} tone="orange" foot="Needs follow-up"/><KPI title="Overdue tasks" value={fmt(counts.overdue)} icon={Clock3} tone="red" foot="Review required"/></div><div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-head"><div><h3>Lead intake trend</h3><p>Daily lead volume and qualified leads</p></div><Badge tone="neutral">Last 6 days</Badge></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartLeads} margin={{top:8,right:8,left:-22,bottom:0}}><defs><linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f8b83" stopOpacity={.2}/><stop offset="95%" stopColor="#0f8b83" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#8492a6'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#8492a6'}}/><Tooltip {...chartTooltip}/><Area type="monotone" dataKey="leads" stroke="#0f8b83" strokeWidth={2.5} fill="url(#leadFill)"/><Area type="monotone" dataKey="qualified" stroke="#8b7de2" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-teal"/> Leads received</span><span><i className="legend-purple"/> Qualified leads</span></div></div><div className="panel funnel-panel"><div className="panel-head"><div><h3>Lead conversion funnel</h3><p>Current demo pipeline</p></div><button className="icon-btn" onClick={()=>changePage('Reports & Analytics')}><MoreHorizontal size={18}/></button></div><div className="funnel-list">{funnel.map((f,i)=><div className="funnel-row" key={f.name}><div className="funnel-label"><span>{f.name}</span><strong>{f.value}</strong></div><div className="funnel-track"><div style={{width:`${Math.max(5,f.value/Math.max(1,counts.total)*100)}%`,background:f.fill}}/></div></div>)}</div><div className="funnel-footer"><span>Lead-to-conversion rate</span><strong>{counts.total?Math.round(counts.converted/counts.total*100):0}%</strong></div></div></div><div className="dashboard-grid lower-grid"><div className="panel"><div className="panel-head"><div><h3>Recent leads</h3><p>Latest activity in the pipeline</p></div><button className="text-action" onClick={()=>changePage('Leads')}>View all <ChevronRight size={14}/></button></div>{leadTable([...leads].sort((a,b)=>b.created.localeCompare(a.created)).slice(0,4),true)}</div><div className="panel"><div className="panel-head"><div><h3>Today's follow-up queue</h3><p>Priority items to action</p></div><button className="text-action" onClick={()=>changePage('Tasks & Follow-ups')}>View tasks <ChevronRight size={14}/></button></div><div className="queue-list">{tasks.filter(t=>t.status==='Pending').slice(0,4).map(t=>{const l=leads.find(x=>x.id===t.leadId);return <div className="queue-item" key={t.id}><div className="queue-time"><strong>{t.due?new Date(t.due).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}):'—'}</strong><small>{shortDate(t.due)}</small></div><div className="queue-detail"><strong>{t.title}</strong><span>{l?.product||'CRM task'} · {t.owner}</span></div><Badge tone={t.priority.toLowerCase()}>{t.priority}</Badge></div>})}{!tasks.some(t=>t.status==='Pending')&&<Empty title="All caught up" desc="No pending follow-ups."/>}</div></div></div></>}
  {page==='Leads'&&<>{sectionHead('PIPELINE MANAGEMENT','Lead management','Track, qualify, assign, and progress every lead through the funnel.',<><Button kind="secondary" icon={Download} onClick={()=>exportCsv(filteredLeads,'ramaiah-crm-leads.csv')}>Export CSV</Button><Button kind="primary" icon={Plus} onClick={openAddLead}>Add lead</Button></>)}<div className="kpi-grid compact-kpis"><KPI title="All leads" value={counts.total} icon={Users}/><KPI title="New" value={counts.new} icon={UserRound} tone="blue"/><KPI title="Contacted" value={counts.contacted} icon={PhoneCall} tone="purple"/><KPI title="Qualified" value={counts.qualified} icon={Target} tone="green"/></div><div className="panel"><div className="filter-toolbar"><div className="search-control"><Search size={15}/><input value={query} onChange={e=>{setQuery(e.target.value);setPageNum(1)}} placeholder="Search name, lead ID, phone, source..."/></div><div className="filters"><Filter size={15}/>{selectFilter('status',['All statuses',...statuses])}{selectFilter('branch',['All branches',...branches])}{selectFilter('product',['All products',...products])}<button className="filter-more" onClick={()=>setLeadFilter({status:'All statuses',branch:'All branches',product:'All products',source:'All sources',priority:'All priorities'})}><RefreshCw size={13}/> Reset</button></div></div>{leadTable(pageRows)}<div className="table-footer"><span>Showing {filteredLeads.length?((pageNum-1)*6+1):0}–{Math.min(pageNum*6,filteredLeads.length)} of {filteredLeads.length} leads</span><div className="pagination"><button disabled={pageNum===1} onClick={()=>setPageNum(p=>p-1)}><ChevronLeft size={15}/></button><span>{pageNum} / {Math.max(1,Math.ceil(filteredLeads.length/6))}</span><button disabled={pageNum>=Math.ceil(filteredLeads.length/6)} onClick={()=>setPageNum(p=>p+1)}><ChevronRight size={15}/></button></div></div></div><div className="csv-note"><FileUp size={15}/> <span><strong>Import leads:</strong> Select a CSV file to preview and validate records before importing.</span><label className="text-action upload-label">Choose CSV<input type="file" accept=".csv,text/csv" hidden onChange={handleFileUpload}/></label></div></>}
  {page==='Telecaller Desk'&&<>{sectionHead('CALL OPERATIONS','Telecaller desk','Work through assigned leads and record call outcomes.',<Button icon={Plus} onClick={()=>{setSelected(null);setModal('select-call')}}>Log interaction</Button>)}<div className="agent-selector-bar"><div className="agent-selector-label">Select Agent:</div><div className="agent-buttons">{['Priya','Rohan'].map(agent=><button key={agent} className={`agent-btn ${currentAgent===agent?'active':''}`} onClick={()=>switchAgent(agent)}><div className="agent-avatar">{agent[0]}</div><div><strong>{agent}</strong><small>{leads.filter(l=>l.owner===agent).length} leads assigned</small></div></button>)}</div></div><div className="kpi-grid"><KPI title={`Leads assigned to ${currentAgent}`} value={leads.filter(l=>l.owner===currentAgent).length} icon={Users}/><KPI title="Call attempts today" value={calls.filter(c=>c.employeeName===currentAgent&&new Date(c.startTime||c.createdAt).toDateString()===new Date().toDateString()).length} icon={PhoneCall} tone="blue"/><KPI title="Connected today" value={calls.filter(c=>c.employeeName===currentAgent&&c.status==='Completed'&&c.duration>0&&new Date(c.startTime||c.createdAt).toDateString()===new Date().toDateString()).length} icon={Activity} tone="green"/><KPI title="Awaiting handover" value={leads.filter(l=>l.owner===currentAgent&&l.status==='Qualified').length} icon={BriefcaseBusiness} tone="purple"/></div><div className="panel"><div className="panel-head"><div><h3>{currentAgent}'s lead queue</h3><p>Leads assigned to {currentAgent} for calling</p></div><Badge tone="neutral">{leads.filter(l=>l.owner===currentAgent).length} leads</Badge></div><div className="queue-tabs"><button className="selected">All assigned <span>{leads.filter(l=>l.owner===currentAgent).length}</span></button><button onClick={()=>setLeadFilter(p=>({...p,status:'New'}))}>First contact <span>{leads.filter(l=>l.owner===currentAgent&&l.status==='New').length}</span></button><button onClick={()=>setLeadFilter(p=>({...p,priority:'High'}))}>High priority <span>{leads.filter(l=>l.owner===currentAgent&&l.priority==='High').length}</span></button><button onClick={()=>changePage('Tasks & Follow-ups')}>Callbacks due <span>{tasks.filter(t=>t.owner===currentAgent&&t.status==='Pending').length}</span></button></div>{leadTable(leads.filter(l=>l.owner===currentAgent))}</div><div className="panel activity-panel"><div className="panel-head"><div><h3>{currentAgent}'s call activity</h3><p>Recent call dispositions and notes</p></div></div>{calls.filter(c=>c.employeeName===currentAgent).length?<div className="activity-list">{calls.filter(c=>c.employeeName===currentAgent).sort((a,b)=>new Date(b.startTime||b.createdAt)-new Date(a.startTime||a.createdAt)).slice(0,6).map(c=><div className="activity-row" key={c.id}><div className="activity-symbol"><PhoneCall size={15}/></div><div className="activity-body"><strong>{c.disposition||'Call completed'}</strong><span>{c.customerName} · {new Date(c.startTime||c.createdAt).toLocaleString('en-IN')}</span>{c.notes&&<p>{c.notes}</p>}</div><Badge tone="neutral">{c.duration>0?`${Math.floor(c.duration/60)}m ${c.duration%60}s`:'0s'}</Badge></div>)}</div>:<Empty title="No call activity yet" desc="Your call history will appear here."/>}</div></>}
  {page==='Tasks & Follow-ups'&&<>{sectionHead('WORK QUEUE','Tasks & follow-ups','Keep callbacks and next actions on time.',<Button icon={Plus} onClick={()=>{setTaskForm({title:'',leadId:leads[0]?.id||'',type:'Callback',owner:'Priya S',due:'',priority:'Medium'});setModal('task')}}>Create task</Button>)}<div className="kpi-grid compact-kpis"><KPI title="Pending tasks" value={tasks.filter(t=>t.status==='Pending').length} icon={ListTodo}/><KPI title="Callbacks" value={tasks.filter(t=>t.status==='Pending'&&t.type==='Callback').length} icon={PhoneCall} tone="blue"/><KPI title="High priority" value={tasks.filter(t=>t.status==='Pending'&&t.priority==='High').length} icon={Target} tone="orange"/><KPI title="Completed" value={tasks.filter(t=>t.status==='Completed').length} icon={Check} tone="green"/></div><div className="panel"><div className="panel-head"><div><h3>Task board</h3><p>Review due dates and mark tasks complete.</p></div><div className="segmented">{['Pending','Completed','All'].map(t=><button className={taskTab===t?'on':''} onClick={()=>setTaskTab(t)} key={t}>{t}</button>)}</div></div><div className="table-wrap"><table><thead><tr><th>Task</th><th>Related lead</th><th>Type</th><th>Assigned to</th><th>Due date</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>{tasks.filter(t=>taskTab==='All'||t.status===taskTab).sort((a,b)=>String(a.due).localeCompare(String(b.due))).map(t=>{const l=leads.find(x=>x.id===t.leadId);const overdue=t.status==='Pending'&&t.due&&new Date(t.due)<new Date('2026-10-17T09:00');return <tr key={t.id}><td><strong>{t.title}</strong><span className="subtext">{t.id}</span></td><td>{l?.name||'—'}</td><td>{t.type}</td><td>{t.owner}</td><td><span className={overdue?'overdue-text':''}>{t.due?new Date(t.due).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'—'}</span>{overdue&&<span className="subtext overdue-text">Overdue</span>}</td><td><Badge tone={t.priority.toLowerCase()}>{t.priority}</Badge></td><td><Badge tone={t.status.toLowerCase()}>{t.status}</Badge></td><td>{t.status==='Pending'?<Button kind="small" icon={Check} onClick={()=>completeTask(t.id)}>Complete</Button>:<span className="muted">Done</span>}</td></tr>})}</tbody></table>{!tasks.filter(t=>taskTab==='All'||t.status===taskTab).length&&<Empty title="No tasks in this view" desc="Create a task or switch tabs."/>}</div></div></>}
  {page==='Campaigns'&&<>{sectionHead('MARKETING ATTRIBUTION','Campaigns','Understand lead quality and acquisition costs by source.',<Button icon={Plus} onClick={()=>notify('Campaign creation form is planned for the next phase. Existing demo campaign data is editable in source files.')}>New campaign</Button>)}<div className="kpi-grid"><KPI title="Campaign spend" value={money(campaigns.reduce((s,c)=>s+c.spend,0))} icon={Target}/><KPI title="Leads received" value={campaigns.reduce((s,c)=>s+c.leads,0)} icon={Users} tone="blue"/><KPI title="Qualified leads" value={campaigns.reduce((s,c)=>s+c.qualified,0)} icon={Check} tone="green"/><KPI title="Average cost / lead" value={money(Math.round(campaigns.reduce((s,c)=>s+c.spend,0)/Math.max(1,campaigns.reduce((s,c)=>s+c.leads,0))))} icon={TrendingUp} tone="purple"/></div><div className="panel"><div className="panel-head"><div><h3>Campaign performance</h3><p>Illustrative cost and conversion metrics</p></div><Button kind="secondary" icon={Download} onClick={()=>exportCsv(campaignRows,'ramaiah-crm-campaigns.csv')}>Export CSV</Button></div><div className="table-wrap"><table><thead><tr>{['Campaign','Platform','Spend','Leads','Valid','Qualified','Contact rate','Conversion rate','Cost / lead','Status'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{campaignRows.map(c=><tr key={c.id}><td><strong>{c.name}</strong><span className="subtext">{c.campaignId}</span></td><td>{c.platform}</td><td>{money(c.spend)}</td><td>{c.leads}</td><td>{c.valid}</td><td>{c.qualified}</td><td>{c.contactRate}%</td><td>{c.conversionRate}%</td><td>{money(c.cpl)}</td><td><Badge tone={c.status.toLowerCase()}>{c.status}</Badge></td></tr>)}</tbody></table></div></div><div className="integration-panel"><div className="integration-icon"><ShieldCheck size={22}/></div><div><h3>Integration readiness</h3><p>Live connections to Google Ads, Meta, Instagram, website forms, and telephony are not active in this prototype. Production integrations require approved APIs, credentials, backend services, consent controls, and monitoring.</p><div className="integration-tags"><Badge tone="neutral">Website forms · Planned</Badge><Badge tone="neutral">Meta API · Planned</Badge><Badge tone="neutral">Google Ads · Planned</Badge><Badge tone="neutral">Telephony · Planned</Badge></div></div></div></>}
  {page==='Call History'&&<>{sectionHead('TELEPHONY','Call History','Complete log of all incoming and outgoing calls.',<Button icon={Download} kind="secondary" onClick={()=>exportCsv(calls,'ramaiah-call-history.csv')}>Export CSV</Button>)}<div className="kpi-grid compact-kpis"><KPI title="Total Calls" value={commCounts.totalCalls} icon={PhoneCall}/><KPI title="Incoming" value={commCounts.incomingCalls} icon={PhoneIncoming} tone="blue"/><KPI title="Outgoing" value={commCounts.outgoingCalls} icon={PhoneOutgoing} tone="purple"/><KPI title="Connected" value={commCounts.connectedCalls} icon={Check} tone="green"/></div><div className="panel"><div className="panel-head"><div><h3>Call logs</h3><p>All call records with duration and disposition (newest first)</p></div><Badge tone="neutral">{calls.length} calls</Badge></div><div className="table-wrap"><table><thead><tr>{['Date & Time','Customer','Phone','Direction','Product','Duration','Status','Disposition','Employee','Branch',''].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{[...calls].sort((a,b)=>new Date(b.startTime||b.createdAt)-new Date(a.startTime||a.createdAt)).map(c=><tr key={c.id}><td><strong>{new Date(c.startTime||c.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</strong><span className="subtext">{new Date(c.startTime||c.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span></td><td><button className="lead-name" onClick={()=>{const lead=leads.find(l=>l.id===c.leadId);if(lead)showLead(lead)}}>{c.customerName}</button><span className="subtext">{c.leadId||'—'}</span></td><td>{c.phone}</td><td><Badge tone={c.direction==='Incoming'?'blue':'purple'}>{c.direction}</Badge></td><td>{c.product||'—'}</td><td>{c.duration>0?`${Math.floor(c.duration/60)}m ${c.duration%60}s`:'0s'}</td><td><Badge tone={c.status.toLowerCase()}>{c.status}</Badge></td><td>{c.disposition||'—'}</td><td>{c.employeeName||'—'}</td><td>{c.branch||'—'}</td><td>{c.recordingUrl?<button className="text-action">Play</button>:<span className="muted">No rec.</span>}</td></tr>)}</tbody></table>{!calls.length&&<Empty title="No call history" desc="Call logs will appear here once calls are made."/>}</div></div></>}
  {page==='Missed Calls'&&<>{sectionHead('CALLBACK MANAGEMENT','Missed Calls','Track and return missed incoming calls.',null)}<div className="kpi-grid compact-kpis"><KPI title="Pending Callbacks" value={commCounts.missedCallsCount} icon={PhoneMissed} tone="orange"/><KPI title="Total Missed" value={missedCalls.length} icon={PhoneMissed} tone="red"/><KPI title="Returned" value={missedCalls.filter(m=>m.status==='Returned').length} icon={Check} tone="green"/></div><div className="panel"><div className="panel-head"><div><h3>Missed calls queue</h3><p>Incoming calls that require action</p></div></div><div className="table-wrap"><table><thead><tr>{['Missed At','Phone Number','Customer','Lead','Assigned To','Status','Priority',''].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{missedCalls.filter(m=>m.status==='Pending').map(m=><tr key={m.id}><td><strong>{new Date(m.missedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</strong><span className="subtext">{new Date(m.missedAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span></td><td>{m.phone}</td><td>{m.customerName}</td><td>{m.leadId?<button className="lead-name" onClick={()=>{const lead=leads.find(l=>l.id===m.leadId);if(lead)showLead(lead)}}>{m.leadId}</button>:'—'}</td><td>{m.assignedTo||'Unassigned'}</td><td><Badge tone={m.status.toLowerCase()}>{m.status}</Badge></td><td><Badge tone={m.priority.toLowerCase()}>{m.priority}</Badge></td><td><Button kind="small" icon={PhoneCall} onClick={()=>{const lead=leads.find(l=>l.id===m.leadId);if(lead){initiateCallToCustomer(lead)}else{notify('Create lead first to return call')}}}>Return Call</Button></td></tr>)}</tbody></table>{!missedCalls.filter(m=>m.status==='Pending').length&&<Empty title="No pending missed calls" desc="All missed calls have been returned."/>}</div></div></>}
  {page==='Reports & Analytics'&&<>{sectionHead('BUSINESS INTELLIGENCE','Reports & analytics','Explore pipeline, source, branch, and productivity indicators.',<Button icon={Download} kind="secondary" onClick={()=>exportCsv(leads,'ramaiah-crm-report-leads.csv')}>Export report</Button>)}<div className="report-toolbar"><span><SlidersHorizontal size={15}/> Report filters</span><Field label="Branch">{inputSelect(reportFilter,setReportFilter,['All branches',...branches])}</Field><span className="report-demo">Illustrative demo metrics</span></div><div className="kpi-grid"><KPI title="Lead-to-qualified rate" value={`${counts.total?Math.round(counts.qualified/counts.total*100):0}%`} icon={Target}/><KPI title="Lead-to-conversion" value={`${counts.total?Math.round(counts.converted/counts.total*100):0}%`} icon={TrendingUp} tone="green"/><KPI title="Pending follow-ups" value={tasks.filter(t=>t.status==='Pending').length} icon={CalendarClock} tone="orange"/><KPI title="Activity records" value={activities.length} icon={Activity} tone="purple"/><KPI title="Total calls made" value={commCounts.totalCalls} icon={PhoneCall} tone="blue"/><KPI title="Call connect rate" value={`${commCounts.totalCalls?Math.round(commCounts.connectedCalls/commCounts.totalCalls*100):0}%`} icon={Check} tone="green"/></div><div className="panel"><div className="panel-head"><div><h3>Calling Performance Dashboard</h3><p>Telephony and communication metrics</p></div></div><div className="kpi-grid compact-kpis"><KPI title="Total Calls" value={commCounts.totalCalls} icon={PhoneCall}/><KPI title="Incoming" value={commCounts.incomingCalls} icon={PhoneIncoming} tone="blue"/><KPI title="Outgoing" value={commCounts.outgoingCalls} icon={PhoneOutgoing} tone="purple"/><KPI title="Connected" value={commCounts.connectedCalls} icon={Check} tone="green"/><KPI title="Avg Duration" value={`${Math.floor(commCounts.avgCallDuration/60)}m ${Math.floor(commCounts.avgCallDuration%60)}s`} icon={Clock3} tone="orange"/><KPI title="Missed Calls" value={commCounts.missedCallsCount} icon={PhoneMissed} tone="red"/></div><div className="table-wrap" style={{marginTop:'20px'}}><table><thead><tr><th>Employee</th><th>Total Calls</th><th>Connected</th><th>Avg Duration</th><th>Connect Rate</th></tr></thead><tbody>{['Priya S','Kiran M','Naveen R'].map(emp=>{const empCalls=calls.filter(c=>c.employeeName===emp);const connected=empCalls.filter(c=>c.duration>0).length;const avgDur=empCalls.reduce((s,c)=>s+c.duration,0)/Math.max(1,empCalls.length);return <tr key={emp}><td><strong>{emp}</strong></td><td>{empCalls.length}</td><td>{connected}</td><td>{avgDur>0?`${Math.floor(avgDur/60)}m ${Math.floor(avgDur%60)}s`:'—'}</td><td>{empCalls.length?Math.round(connected/empCalls.length*100):0}%</td></tr>})}</tbody></table></div></div><div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-head"><div><h3>Lead status distribution</h3><p>Current pipeline by status</p></div></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={statuses.map(s=>({status:s,count:leads.filter(l=>l.status===s&&(reportFilter==='All branches'||l.branch===reportFilter)).length})).filter(x=>x.count)} margin={{top:8,right:8,left:-20,bottom:25}}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="status" angle={-25} textAnchor="end" interval={0} height={55} tick={{fontSize:10,fill:'#8492a6'}} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#8492a6'}}/><Tooltip {...chartTooltip}/><Bar dataKey="count" fill="#0f8b83" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div><div className="panel"><div className="panel-head"><div><h3>Lead source mix</h3><p>By source · current demo records</p></div></div><div className="source-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sources.map(s=>({name:s,value:leads.filter(l=>l.source===s&&(reportFilter==='All branches'||l.branch===reportFilter)).length})).filter(x=>x.value)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3}>{sources.map((s,i)=><Cell key={s} fill={['#0f8b83','#6d9de8','#8b7de2','#e7a44e','#dc7180','#5ba7b1','#8dbb7b'][i%7]}/>)}</Pie><Tooltip {...chartTooltip}/></PieChart></ResponsiveContainer></div><div className="source-legend">{sources.map((s,i)=>{const v=leads.filter(l=>l.source===s&&(reportFilter==='All branches'||l.branch===reportFilter)).length;return v?<div key={s}><span><i style={{background:['#0f8b83','#6d9de8','#8b7de2','#e7a44e','#dc7180','#5ba7b1','#8dbb7b'][i%7]}}/>{s}</span><strong>{v}</strong></div>:null})}</div></div></div><div className="panel"><div className="panel-head"><div><h3>Branch-wise lead performance</h3><p>Lead count and qualified pipeline by branch</p></div></div><div className="table-wrap"><table><thead><tr><th>Branch</th><th>Total leads</th><th>Qualified</th><th>Converted</th><th>Qualification rate</th></tr></thead><tbody>{branches.map(b=>{const rows=leads.filter(l=>l.branch===b),q=rows.filter(l=>['Qualified','Handed Over','Converted'].includes(l.status)).length,c=rows.filter(l=>l.status==='Converted').length;return <tr key={b}><td><strong>{b}</strong></td><td>{rows.length}</td><td>{q}</td><td>{c}</td><td>{rows.length?Math.round(q/rows.length*100):0}%</td></tr>})}</tbody></table></div></div></>}
  {page==='Settings'&&<>{sectionHead('CONFIGURATION','Settings & administration','Review demo configuration and production readiness.')}<div className="settings-grid"><div className="panel settings-menu"><h3>CRM configuration</h3>{[{icon:BriefcaseBusiness,title:'Loan products',desc:products.join(' · ')},{icon:Users,title:'Branches & teams',desc:branches.join(' · ')},{icon:Activity,title:'Lead sources',desc:sources.join(' · ')},{icon:PhoneCall,title:'Call dispositions',desc:`${dispositionOptions.length} demo dispositions available`},{icon:Clock3,title:'SLA & follow-up rules',desc:'First contact target and callback rules'},{icon:Bell,title:'Notifications',desc:'In-app demo notifications'}].map(item=><div className="setting-item" key={item.title}><div className="setting-icon"><item.icon size={17}/></div><div><strong>{item.title}</strong><span>{item.desc}</span></div><ChevronRight size={16}/></div>)}</div><div className="panel readiness"><div className="readiness-title"><div className="setting-icon green"><ShieldCheck size={20}/></div><div><h3>Production readiness</h3><p>Items required before real customer data is used.</p></div></div>{['Backend API and database','Real authentication and role-based access','Server-side validation and permissions','Audit logging and retention policy','Encryption, secrets management, and backups','Approved LOS/LMS and marketing integrations','Privacy, consent, and Do Not Contact enforcement','Monitoring, recovery, and security testing'].map((s,i)=><div className="check-row" key={s}><span className="check-empty">{i<0?<Check size={12}/>:null}</span><span>{s}</span><Badge tone="planned">Planned</Badge></div>)}<div className="warning-box"><ShieldCheck size={17}/><p><strong>Prototype limitation</strong><br/>LocalStorage is browser-local and not secure shared storage. Do not enter real customer, financial, identity, or confidential organizational information.</p></div><Button kind="secondary" icon={RefreshCw} onClick={()=>{if(confirm('Reset all CRM demo data to its original sample state?'))resetDemo()}}>Reset demo data</Button></div></div><div className="panel config-panel"><div><h3>Demo workspace details</h3><p>These settings describe the current prototype only; they do not enforce production security.</p></div><div className="config-fields"><Field label="Organization"><input value="Ramaiah Capital Private Limited" readOnly/></Field><Field label="Workspace mode"><input value="Frontend demo · LocalStorage" readOnly/></Field><Field label="First-contact SLA (demo)"><select defaultValue="Within 30 minutes"><option>Within 15 minutes</option><option>Within 30 minutes</option><option>Within 1 hour</option><option>Within 4 hours</option></select></Field><Field label="Contact hours"><select defaultValue="09:30–18:00"><option>09:30–18:00</option><option>10:00–17:00</option><option>24 × 7</option></select></Field></div><Button kind="secondary" onClick={()=>notify('Settings shown are frontend demo controls; persistent production configuration is not implemented.')}>Save demo preferences</Button></div><div className="panel config-panel"><div><h3>Communication Settings</h3><p>Configure telephony and WhatsApp Business integration</p></div><div className="setting-section"><h4><PhoneCall size={16}/> Cloud Telephony Configuration</h4><div className="config-fields"><Field label="Provider Name"><input placeholder="e.g., Exotel, Knowlarity, Twilio" readOnly value="Demo Provider"/></Field><Field label="API Endpoint"><input placeholder="https://api.provider.com" readOnly value="Not configured"/></Field><Field label="Account / Tenant ID"><input placeholder="Your account identifier" readOnly value="—"/></Field><Field label="Connection Status"><input readOnly value="Demo Mode Active" style={{color:'#b58a3b'}}/></Field></div><div className="notice-inline">Production telephony requires approved provider credentials, webhook configuration, and backend API. Current implementation uses demo mode only.</div><Button kind="secondary" icon={PhoneCall} onClick={()=>notify('Telephony configuration requires backend implementation. Demo mode allows testing UX flows.')}>Test Connection</Button></div><div className="setting-section" style={{marginTop:'24px'}}><h4><MessageSquare size={16}/> WhatsApp Business Configuration</h4><div className="config-fields"><Field label="Business Account ID"><input placeholder="WhatsApp Business Account ID" readOnly value="—"/></Field><Field label="Phone Number ID"><input placeholder="Registered phone number ID" readOnly value="—"/></Field><Field label="Verification Status"><input readOnly value="Not Verified" style={{color:'#c45d4d'}}/></Field><Field label="API Access Token"><input type="password" placeholder="*****************" readOnly value="—"/></Field><Field label="Connection Status"><input readOnly value="Demo Mode Active" style={{color:'#b58a3b'}}/></Field></div><div className="notice-inline">WhatsApp Business API requires Meta Business verification, approved account, and Cloud API or BSP integration. Templates must be pre-approved by WhatsApp.</div><Button kind="secondary" icon={MessageSquare} onClick={()=>notify('WhatsApp configuration requires Meta Business account and Cloud API setup. Demo mode allows testing messaging flows.')}>Test Connection</Button></div><div className="warning-box" style={{marginTop:'20px'}}><ShieldCheck size={17}/><p><strong>Security Requirements</strong><br/>Never expose API credentials in frontend code. Production implementation must store credentials securely on backend, validate webhook signatures, implement rate limiting, and maintain audit logs for all communications.</p></div></div></>}
  </div><footer className="app-footer"><span>© 2026 Ramaiah Capital Private Limited · Internal CRM prototype</span><span><i className="demo-dot"/> Demo mode · Not connected to production systems</span></footer></main>
  {modal==='lead'&&<Modal title={selected?'Edit lead':'Add new lead'} onClose={()=>setModal('')} wide><form className="form-body" onSubmit={saveLead}><div className="form-grid"><Field label="Customer name *"><input value={leadForm.name} onChange={e=>setLeadForm(p=>({...p,name:e.target.value}))} placeholder="Enter full name" required/></Field><Field label="Phone number *"><input value={leadForm.phone} onChange={e=>setLeadForm(p=>({...p,phone:e.target.value.replace(/\D/g,'').slice(0,10)}))} placeholder="10-digit mobile number" inputMode="numeric" required/></Field><Field label="Loan product">{inputSelect(leadForm.product,v=>setLeadForm(p=>({...p,product:v})),products)}</Field><Field label="Lead source">{inputSelect(leadForm.source,v=>setLeadForm(p=>({...p,source:v})),sources)}</Field><Field label="Campaign name"><input value={leadForm.campaign||''} onChange={e=>setLeadForm(p=>({...p,campaign:e.target.value}))} placeholder="Optional campaign"/></Field><Field label="Branch">{inputSelect(leadForm.branch,v=>setLeadForm(p=>({...p,branch:v})),branches)}</Field><Field label="Assigned telecaller">{inputSelect(leadForm.owner,v=>setLeadForm(p=>({...p,owner:v})),['Priya','Rohan'])}</Field><Field label="Priority">{inputSelect(leadForm.priority,v=>setLeadForm(p=>({...p,priority:v})),['Low','Medium','High'])}</Field><Field label="Lead status">{inputSelect(leadForm.status,v=>setLeadForm(p=>({...p,status:v})),statuses)}</Field><Field label="Next follow-up"><input type="datetime-local" value={leadForm.followUp||''} onChange={e=>setLeadForm(p=>({...p,followUp:e.target.value}))}/></Field><Field label="Notes"><textarea rows="3" value={leadForm.notes||''} onChange={e=>setLeadForm(p=>({...p,notes:e.target.value}))} placeholder="Add relevant notes"/></Field></div><div className="form-footer"><span className="muted">* Required fields. Duplicate phone numbers are flagged.</span><Button kind="secondary" onClick={()=>setModal('')}>Cancel</Button><Button type="submit">{selected?'Save changes':'Create lead'}</Button></div></form></Modal>}
  {modal==='detail'&&selected&&<Modal title="Lead profile" onClose={()=>setModal('')} wide><div className="detail-body"><div className="detail-profile"><div className="detail-avatar">{selected.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div><div><h2>{selected.name}</h2><span>{selected.id} · {selected.phone}</span></div><Badge tone={selected.status.toLowerCase().replaceAll(' ','-')}>{selected.status}</Badge><Button kind="secondary" icon={PhoneCall} onClick={()=>initiateCallToCustomer(selected)}>Call Customer</Button><Button kind="secondary" icon={MessageSquare} onClick={()=>openWhatsAppConversation(selected)}>WhatsApp</Button><Button kind="secondary" icon={PhoneCall} onClick={()=>{setCallForm({disposition:'Connected — Interested',notes:'',callback:'',reason:'',nextAction:'Follow-up'});setModal('call')}}>Log interaction</Button><Button kind="secondary" onClick={()=>editLead(selected)}>Edit</Button></div><CommunicationSummary calls={calls.filter(c=>c.leadId===selected.id)} whatsappMessages={[]} activities={activities.filter(a=>a.leadId===selected.id)} /><div className="detail-grid">{[['Product',selected.product],['Source',selected.source],['Campaign',selected.campaign||'—'],['Branch',selected.branch],['Assigned owner',selected.owner],['Priority',selected.priority],['Created date',shortDate(selected.created)],['Last contacted',selected.lastContacted],['Next follow-up',selected.followUp?new Date(selected.followUp).toLocaleString('en-IN'):'—'],['Qualification',selected.qualification||'Pending']].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div><div className="detail-notes"><h3>Lead notes</h3><p>{selected.notes||'No notes have been added.'}</p></div><CommunicationTimeline leadId={selected.id} calls={calls.filter(c=>c.leadId===selected.id)} whatsappMessages={[]} activities={activities.filter(a=>a.leadId===selected.id)} /></div></Modal>}
  {modal==='call'&&selected&&<Modal title={`Log interaction · ${selected.name}`} onClose={()=>setModal('')}><form className="form-body" onSubmit={saveCall}><Field label="Call disposition *">{inputSelect(callForm.disposition,setCallFormVal=>setCallForm(p=>({...p,disposition:setCallFormVal})),dispositionOptions)}</Field><Field label="Call notes"><textarea rows="4" value={callForm.notes} onChange={e=>setCallForm(p=>({...p,notes:e.target.value}))} placeholder="Summarise the demo interaction"/></Field><Field label="Callback date & time"><input type="datetime-local" value={callForm.callback} onChange={e=>setCallForm(p=>({...p,callback:e.target.value}))}/></Field><Field label="Follow-up reason"><input value={callForm.reason} onChange={e=>setCallForm(p=>({...p,reason:e.target.value}))} placeholder="Optional reason"/></Field><div className="notice-inline">Demo only: saving this form does not place a real phone call or send a message.</div><div className="form-footer"><Button kind="secondary" onClick={()=>setModal('detail')}>Cancel</Button><Button type="submit">Save interaction</Button></div></form></Modal>}
  {modal==='select-call'&&<Modal title="Choose a lead" onClose={()=>setModal('')}><div className="form-body"><p className="muted">Select a lead to record a demo interaction.</p>{leads.slice(0,8).map(l=><button className="choose-lead" key={l.id} onClick={()=>{setSelected(l);setCallForm({disposition:'Connected — Interested',notes:'',callback:'',reason:'',nextAction:'Follow-up'});setModal('call')}}><span className="avatar small">{l.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</span><span><strong>{l.name}</strong><small>{l.id} · {l.product}</small></span><ChevronRight size={16}/></button>)}</div></Modal>}
  {modal==='task'&&<Modal title="Create follow-up task" onClose={()=>setModal('')}><form className="form-body" onSubmit={saveTask}><Field label="Task title *"><input value={taskForm.title} onChange={e=>setTaskForm(p=>({...p,title:e.target.value}))} required placeholder="e.g. Call customer"/></Field><Field label="Related lead">{inputSelect(taskForm.leadId,v=>setTaskForm(p=>({...p,leadId:v})),leads.map(l=>l.id))}</Field><Field label="Task type">{inputSelect(taskForm.type,v=>setTaskForm(p=>({...p,type:v})),['First contact','Callback','Follow-up','Handover','Document reminder','Other'])}</Field><Field label="Assigned employee">{inputSelect(taskForm.owner,v=>setTaskForm(p=>({...p,owner:v})),['Priya','Rohan'])}</Field><Field label="Due date & time *"><input type="datetime-local" value={taskForm.due} onChange={e=>setTaskForm(p=>({...p,due:e.target.value}))} required/></Field><Field label="Priority">{inputSelect(taskForm.priority,v=>setTaskForm(p=>({...p,priority:v})),['Low','Medium','High'])}</Field><div className="form-footer"><Button kind="secondary" onClick={()=>setModal('')}>Cancel</Button><Button type="submit">Create task</Button></div></form></Modal>}
  {activeCall&&<CallingInterface call={activeCall} onEndCall={handleEndCall} onClose={()=>{setActiveCall(null);notify('Call cancelled')}} />}
  {modal==='callOutcome'&&activeCall&&<CallOutcomeForm call={activeCall} onSave={saveCallOutcome} onCancel={()=>{setActiveCall(null);setModal('')}} dispositions={callDispositions} />}
  {modal==='email'&&activeEmail&&<Modal title="Compose Email" onClose={()=>{setActiveEmail(null);setModal('')}} wide><EmailComposer lead={activeEmail} onClose={()=>{setActiveEmail(null);setModal('')}} onSend={handleSendEmail} /></Modal>}
  {showImportPreview&&<Modal title="Import Leads from CSV" onClose={()=>{setShowImportPreview(false);setImportData([]);setImportHeaders([]);setColumnMapping({})}} wide><div className="form-body"><div className="import-preview-header"><h3>Preview & Map Columns</h3><p>{importData.length} rows found in CSV file. Map columns to lead fields below.</p></div><div className="column-mapping"><table style={{width:'100%',marginBottom:'20px'}}><thead><tr><th style={{textAlign:'left',padding:'8px',background:'#f8fafb'}}>CSV Column</th><th style={{textAlign:'left',padding:'8px',background:'#f8fafb'}}>Sample Data</th><th style={{textAlign:'left',padding:'8px',background:'#f8fafb'}}>Map To Field</th></tr></thead><tbody>{importHeaders.map(header=><tr key={header}><td style={{padding:'8px',fontWeight:'500'}}>{header}</td><td style={{padding:'8px',color:'#667a8d',fontSize:'12px'}}>{importData[0]?.[header]}</td><td style={{padding:'8px'}}><select value={columnMapping[header]||''} onChange={e=>setColumnMapping(p=>({...p,[header]:e.target.value}))} style={{width:'100%',padding:'6px',border:'1px solid #e2e8f0',borderRadius:'4px'}}><option value="">Skip this column</option><option value="name">Customer Name *</option><option value="phone">Phone Number *</option><option value="product">Product</option><option value="source">Lead Source</option><option value="branch">Branch</option><option value="priority">Priority</option><option value="notes">Notes</option></select></td></tr>)}</tbody></table></div><div className="import-preview-data"><h4 style={{fontSize:'13px',marginBottom:'10px'}}>Preview (first 5 rows)</h4><div style={{maxHeight:'200px',overflow:'auto',border:'1px solid #e2e8f0',borderRadius:'4px'}}><table style={{width:'100%',fontSize:'11px'}}><thead><tr style={{background:'#f8fafb'}}>{importHeaders.map(h=><th key={h} style={{padding:'6px',textAlign:'left',borderBottom:'1px solid #e2e8f0'}}>{h}</th>)}</tr></thead><tbody>{importData.slice(0,5).map((row,i)=><tr key={i} style={{borderBottom:'1px solid #f1f3f5'}}>{importHeaders.map(h=><td key={h} style={{padding:'6px'}}>{row[h]}</td>)}</tr>)}</tbody></table></div></div><div className="notice-inline" style={{marginTop:'20px'}}>Required fields: Customer Name and Phone Number. Duplicate phone numbers will be skipped. All imported leads will be assigned to <strong>{currentAgent}</strong>.</div><div className="form-footer" style={{marginTop:'20px'}}><Button kind="secondary" onClick={()=>{setShowImportPreview(false);setImportData([]);setImportHeaders([]);setColumnMapping({})}}>Cancel</Button><Button kind="primary" onClick={importLeads} disabled={!Object.values(columnMapping).includes('name')||!Object.values(columnMapping).includes('phone')}>Import {importData.length} Leads</Button></div></div></Modal>}
  {toast&&<div className="toast"><Check size={16}/>{toast}<button onClick={()=>setToast('')}><X size={14}/></button></div>}
 </div>
}