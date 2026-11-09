export const products = ['Gold Loan', 'Personal Loan', 'Business Loan', 'Loan Against Property', 'Festival Loan']
export const branches = ['Bengaluru', 'Mangaluru', 'Udupi', 'Mysuru']
export const sources = ['Website', 'Meta Lead Form', 'Google Ads', 'Referral', 'Inbound Call', 'Branch Walk-in', 'Instagram']
export const statuses = ['New', 'Contacted', 'Callback', 'Qualified', 'Handed Over', 'Converted', 'Not Qualified', 'Do Not Contact']
export const seedLeads = [
 {id:'RCL-26001',name:'Ananya Rao',phone:'9876543210',product:'Gold Loan',source:'Website',campaign:'Gold Loan Search',branch:'Bengaluru',owner:'Priya',priority:'High',status:'New',created:'2026-10-16',lastContacted:'—',followUp:'2026-10-17T11:30',qualification:'Pending',closureReason:'',notes:'Requested details on gold loan eligibility.'},
 {id:'RCL-26002',name:'Rohit Shetty',phone:'9845012345',product:'Business Loan',source:'Referral',campaign:'Partner Referrals',branch:'Mangaluru',owner:'Rohan',priority:'Medium',status:'Contacted',created:'2026-10-15',lastContacted:'2026-10-16',followUp:'2026-10-17T14:00',qualification:'Pending',closureReason:'',notes:'Asked for document checklist.'},
 {id:'RCL-26003',name:'Meera Hegde',phone:'9900123456',product:'Personal Loan',source:'Meta Lead Form',campaign:'Personal Loan Oct',branch:'Udupi',owner:'Priya',priority:'High',status:'Qualified',created:'2026-10-14',lastContacted:'2026-10-16',followUp:'2026-10-17T16:00',qualification:'Qualified',closureReason:'',notes:'Interested; handover pending.'},
 {id:'RCL-26004',name:'Arjun Kumar',phone:'9844001122',product:'Loan Against Property',source:'Google Ads',campaign:'LAP Search',branch:'Bengaluru',owner:'Rohan',priority:'Low',status:'Callback',created:'2026-10-13',lastContacted:'2026-10-15',followUp:'2026-10-18T10:00',qualification:'Pending',closureReason:'',notes:'Requested a callback on weekend.'},
 {id:'RCL-26005',name:'Divya Pai',phone:'9880765432',product:'Gold Loan',source:'Branch Walk-in',campaign:'Walk-in',branch:'Mysuru',owner:'Priya',priority:'Medium',status:'Handed Over',created:'2026-10-12',lastContacted:'2026-10-14',followUp:'',qualification:'Qualified',closureReason:'',notes:'Referred to branch team.'},
 {id:'RCL-26006',name:'Sandeep N',phone:'9731000000',product:'Festival Loan',source:'Instagram',campaign:'Festival Oct',branch:'Udupi',owner:'Rohan',priority:'Low',status:'Not Qualified',created:'2026-10-11',lastContacted:'2026-10-12',followUp:'',qualification:'Not Qualified',closureReason:'Outside eligibility',notes:'Demo record.'},
 {id:'RCL-26007',name:'Nisha Bhat',phone:'9988776655',product:'Personal Loan',source:'Inbound Call',campaign:'Inbound',branch:'Mangaluru',owner:'Priya',priority:'High',status:'New',created:'2026-10-17',lastContacted:'—',followUp:'2026-10-17T12:00',qualification:'Pending',closureReason:'',notes:'Wants to understand rates and tenure.'},
 {id:'RCL-26008',name:'Vikram Shetty',phone:'9845112233',product:'Business Loan',source:'Website',campaign:'Business Loan Landing',branch:'Bengaluru',owner:'Rohan',priority:'Medium',status:'Converted',created:'2026-10-09',lastContacted:'2026-10-12',followUp:'',qualification:'Qualified',closureReason:'',notes:'Illustrative converted lead.'}
]
export const seedTasks = [
 {id:'TSK-101',title:'Call Ananya Rao',leadId:'RCL-26001',type:'First contact',owner:'Priya',due:'2026-10-17T11:30',priority:'High',status:'Pending'},
 {id:'TSK-102',title:'Callback — Rohit Shetty',leadId:'RCL-26002',type:'Callback',owner:'Rohan',due:'2026-10-17T14:00',priority:'Medium',status:'Pending'},
 {id:'TSK-103',title:'Handover qualified lead',leadId:'RCL-26003',type:'Handover',owner:'Priya',due:'2026-10-17T16:00',priority:'High',status:'Pending'},
 {id:'TSK-104',title:'Update document checklist',leadId:'RCL-26005',type:'Follow-up',owner:'Rohan',due:'2026-10-16T15:00',priority:'Low',status:'Completed'}
]
export const seedCampaigns = [
 {id:'CMP-01',name:'Gold Loan Search',platform:'Google Ads',campaignId:'GL-SEARCH-OCT',spend:42000,leads:146,valid:122,duplicates:9,qualified:38,conversions:8,status:'Active'},
 {id:'CMP-02',name:'Personal Loan Oct',platform:'Meta Lead Form',campaignId:'PL-META-OCT',spend:28500,leads:118,valid:97,duplicates:11,qualified:29,conversions:5,status:'Active'},
 {id:'CMP-03',name:'Business Loan Landing',platform:'Website',campaignId:'BL-WEB-OCT',spend:12000,leads:54,valid:49,duplicates:3,qualified:17,conversions:4,status:'Active'},
 {id:'CMP-04',name:'Festival Oct',platform:'Instagram',campaignId:'FEST-IG-OCT',spend:18000,leads:91,valid:70,duplicates:12,qualified:15,conversions:2,status:'Paused'}
]
export const seedActivities = [
 {id:'ACT-01',leadId:'RCL-26002',date:'2026-10-16 15:30',disposition:'Connected — Interested',notes:'Asked for document checklist.',owner:'Kiran M'},
 {id:'ACT-02',leadId:'RCL-26003',date:'2026-10-16 12:10',disposition:'Qualified',notes:'Basic requirements discussed.',owner:'Priya S'},
 {id:'ACT-03',leadId:'RCL-26004',date:'2026-10-15 17:00',disposition:'Callback Requested',notes:'Call back on weekend.',owner:'Naveen R'}
]

// Call dispositions
export const callDispositions = [
 'Connected — Interested',
 'Connected — Not Interested',
 'Callback Requested',
 'No Answer',
 'Busy',
 'Switched Off',
 'Unreachable',
 'Wrong Number',
 'More Information Required',
 'Qualified',
 'Not Qualified',
 'Do Not Contact',
 'Already Availed Loan',
 'Application In Progress',
 'Documents Required',
 'Not Eligible'
]

// Seed call logs
export const seedCalls = [
 {id:'CALL-001',leadId:'RCL-26001',customerId:'RCL-26001',customerName:'Ananya Rao',phone:'9876543210',direction:'Outgoing',status:'Completed',disposition:'Connected — Interested',duration:245,startTime:'2026-10-16T11:30:00',endTime:'2026-10-16T11:34:05',employeeId:'EMP-001',employeeName:'Priya S',branch:'Bengaluru',product:'Gold Loan',notes:'Discussed gold loan eligibility and documentation.',recordingUrl:null,createdAt:'2026-10-16T11:30:00'},
 {id:'CALL-002',leadId:'RCL-26002',customerId:'RCL-26002',customerName:'Rohit Shetty',phone:'9845012345',direction:'Outgoing',status:'Completed',disposition:'Callback Requested',duration:180,startTime:'2026-10-16T14:15:00',endTime:'2026-10-16T14:18:00',employeeId:'EMP-002',employeeName:'Kiran M',branch:'Mangaluru',product:'Business Loan',notes:'Customer requested callback on Saturday morning.',recordingUrl:null,createdAt:'2026-10-16T14:15:00'},
 {id:'CALL-003',leadId:'RCL-26003',customerId:'RCL-26003',customerName:'Meera Hegde',phone:'9900123456',direction:'Outgoing',status:'Completed',disposition:'Qualified',duration:420,startTime:'2026-10-16T10:00:00',endTime:'2026-10-16T10:07:00',employeeId:'EMP-001',employeeName:'Priya S',branch:'Udupi',product:'Personal Loan',notes:'Lead qualified. Ready for handover to branch team.',recordingUrl:null,createdAt:'2026-10-16T10:00:00'},
 {id:'CALL-004',leadId:'RCL-26004',customerId:'RCL-26004',customerName:'Arjun Kumar',phone:'9844001122',direction:'Outgoing',status:'Completed',disposition:'No Answer',duration:0,startTime:'2026-10-15T16:30:00',endTime:'2026-10-15T16:30:28',employeeId:'EMP-003',employeeName:'Naveen R',branch:'Bengaluru',product:'Loan Against Property',notes:'No response. Will retry tomorrow.',recordingUrl:null,createdAt:'2026-10-15T16:30:00'},
 {id:'CALL-005',leadId:'RCL-26007',customerId:'RCL-26007',customerName:'Nisha Bhat',phone:'9988776655',direction:'Incoming',status:'Completed',disposition:'Connected — Interested',duration:310,startTime:'2026-10-17T09:15:00',endTime:'2026-10-17T09:20:10',employeeId:'EMP-001',employeeName:'Priya S',branch:'Mangaluru',product:'Personal Loan',notes:'Incoming enquiry about personal loan rates and tenure.',recordingUrl:null,createdAt:'2026-10-17T09:15:00'},
 {id:'CALL-006',leadId:'RCL-26001',customerId:'RCL-26001',customerName:'Ananya Rao',phone:'9876543210',direction:'Outgoing',status:'Completed',disposition:'Documents Required',duration:195,startTime:'2026-10-17T15:00:00',endTime:'2026-10-17T15:03:15',employeeId:'EMP-001',employeeName:'Priya S',branch:'Bengaluru',product:'Gold Loan',notes:'Shared document checklist. Customer will visit branch.',recordingUrl:null,createdAt:'2026-10-17T15:00:00'},
 {id:'CALL-007',leadId:null,customerId:null,customerName:'Unknown',phone:'9123456789',direction:'Incoming',status:'Missed',disposition:'Missed',duration:0,startTime:'2026-10-17T13:45:00',endTime:'2026-10-17T13:45:00',employeeId:null,employeeName:null,branch:null,product:null,notes:'Missed incoming call - unidentified number.',recordingUrl:null,createdAt:'2026-10-17T13:45:00'},
 {id:'CALL-008',leadId:'RCL-26002',customerId:'RCL-26002',customerName:'Rohit Shetty',phone:'9845012345',direction:'Outgoing',status:'Completed',disposition:'Busy',duration:0,startTime:'2026-10-16T15:30:00',endTime:'2026-10-16T15:30:10',employeeId:'EMP-002',employeeName:'Kiran M',branch:'Mangaluru',product:'Business Loan',notes:'Line busy. Will try again later.',recordingUrl:null,createdAt:'2026-10-16T15:30:00'}
]

// Missed calls requiring action
export const seedMissedCalls = [
 {id:'CALL-007',phone:'9123456789',customerName:'Unknown',leadId:null,missedAt:'2026-10-17T13:45:00',assignedTo:null,status:'Pending',priority:'Medium',notes:'Unidentified incoming call'},
 {id:'CALL-009',phone:'9900112233',customerName:'Unknown',leadId:null,missedAt:'2026-10-17T11:20:00',assignedTo:'Priya S',status:'Pending',priority:'High',notes:'Second attempt from same number'},
 {id:'CALL-010',phone:'9876543210',customerName:'Ananya Rao',leadId:'RCL-26001',missedAt:'2026-10-16T17:30:00',assignedTo:'Priya S',status:'Returned',priority:'High',notes:'Existing customer - already called back'}
]

// Call statistics for reporting
export const callStats = {
 today: {totalCalls:12,incoming:4,outgoing:8,connected:9,missed:2,avgDuration:267},
 yesterday: {totalCalls:15,incoming:5,outgoing:10,connected:11,missed:3,avgDuration:245},
 thisWeek: {totalCalls:78,incoming:28,outgoing:50,connected:62,missed:12,avgDuration:258},
 thisMonth: {totalCalls:342,incoming:118,outgoing:224,connected:276,missed:48,avgDuration:251}
}


// WhatsApp message templates
export const whatsappTemplates = [
 {id:'TPL-001',name:'New Enquiry Acknowledgement',category:'Utility',status:'Approved',language:'en',content:'Dear {{customer_name}}, thank you for your interest in Ramaiah Capital. Our team will contact you shortly regarding your loan enquiry.',variables:['customer_name']},
 {id:'TPL-002',name:'Gold Loan Enquiry',category:'Utility',status:'Approved',language:'en',content:'Dear {{customer_name}}, thank you for enquiring about our Gold Loan facility. Our team will assist you with the available options and eligibility requirements.',variables:['customer_name']},
 {id:'TPL-003',name:'Callback Confirmation',category:'Utility',status:'Approved',language:'en',content:'Dear {{customer_name}}, your callback has been scheduled for {{date}} at {{time}}. Thank you for choosing Ramaiah Capital.',variables:['customer_name','date','time']},
 {id:'TPL-004',name:'Appointment Confirmation',category:'Utility',status:'Approved',language:'en',content:'Dear {{customer_name}}, your appointment with Ramaiah Capital has been scheduled for {{date}} at {{time}}.',variables:['customer_name','date','time']},
 {id:'TPL-005',name:'Application Status Update',category:'Utility',status:'Approved',language:'en',content:'Dear {{customer_name}}, there is an update regarding your loan application {{application_id}}. Please contact our representative for further assistance.',variables:['customer_name','application_id']},
 {id:'TPL-006',name:'Business Loan Document Checklist',category:'Utility',status:'Approved',language:'en',content:'Dear {{customer_name}}, to proceed with your Business Loan enquiry, please contact our representative for the applicable document checklist.',variables:['customer_name']}
]

// WhatsApp conversations
export const seedConversations = [
 {id:'CONV-001',leadId:'RCL-26001',customerId:'RCL-26001',customerName:'Ananya Rao',phone:'9876543210',lastMessage:'Thank you! I will visit the branch tomorrow.',lastMessageAt:'2026-10-17T15:30:00',unreadCount:0,status:'In Progress',assignedTo:'Priya S',priority:'Medium',createdAt:'2026-10-16T11:00:00'},
 {id:'CONV-002',leadId:'RCL-26003',customerId:'RCL-26003',customerName:'Meera Hegde',phone:'9900123456',lastMessage:'What documents do I need to bring?',lastMessageAt:'2026-10-17T10:15:00',unreadCount:1,status:'Open',assignedTo:'Priya S',priority:'High',createdAt:'2026-10-16T09:00:00'},
 {id:'CONV-003',leadId:'RCL-26007',customerId:'RCL-26007',customerName:'Nisha Bhat',phone:'9988776655',lastMessage:'Please share the interest rates for personal loan.',lastMessageAt:'2026-10-17T08:45:00',unreadCount:0,status:'Assigned',assignedTo:'Priya S',priority:'Medium',createdAt:'2026-10-17T08:30:00'},
 {id:'CONV-004',leadId:null,customerId:null,customerName:'Unknown',phone:'9845678901',lastMessage:'I need information about gold loan',lastMessageAt:'2026-10-17T14:00:00',unreadCount:1,status:'Open',assignedTo:null,priority:'Medium',createdAt:'2026-10-17T14:00:00'}
]

// WhatsApp messages
export const seedWhatsAppMessages = [
 {id:'MSG-001',conversationId:'CONV-001',leadId:'RCL-26001',from:'9876543210',to:'company',direction:'incoming',type:'text',content:'Hi, I want to know about gold loan',status:'Read',timestamp:'2026-10-16T11:00:00',employeeId:null,employeeName:null},
 {id:'MSG-002',conversationId:'CONV-001',leadId:'RCL-26001',from:'company',to:'9876543210',direction:'outgoing',type:'text',content:'Hello Ananya! Thank you for contacting Ramaiah Capital. Our Gold Loan offers attractive interest rates with minimal documentation. May I know the approximate gold value?',status:'Read',timestamp:'2026-10-16T11:05:00',employeeId:'EMP-001',employeeName:'Priya S'},
 {id:'MSG-003',conversationId:'CONV-001',leadId:'RCL-26001',from:'9876543210',to:'company',direction:'incoming',type:'text',content:'Around 50 grams of 22K gold jewelry',status:'Read',timestamp:'2026-10-16T11:08:00',employeeId:null,employeeName:null},
 {id:'MSG-004',conversationId:'CONV-001',leadId:'RCL-26001',from:'company',to:'9876543210',direction:'outgoing',type:'template',content:'Dear Ananya Rao, thank you for enquiring about our Gold Loan facility. Our team will assist you with the available options and eligibility requirements.',status:'Read',timestamp:'2026-10-16T11:10:00',employeeId:'EMP-001',employeeName:'Priya S',templateId:'TPL-002'},
 {id:'MSG-005',conversationId:'CONV-001',leadId:'RCL-26001',from:'company',to:'9876543210',direction:'outgoing',type:'text',content:'Based on current gold rates, you may be eligible for a loan up to ₹1,50,000. Would you like to visit our Bengaluru branch for evaluation?',status:'Read',timestamp:'2026-10-17T15:15:00',employeeId:'EMP-001',employeeName:'Priya S'},
 {id:'MSG-006',conversationId:'CONV-001',leadId:'RCL-26001',from:'9876543210',to:'company',direction:'incoming',type:'text',content:'Thank you! I will visit the branch tomorrow.',status:'Read',timestamp:'2026-10-17T15:30:00',employeeId:null,employeeName:null},
 {id:'MSG-007',conversationId:'CONV-002',leadId:'RCL-26003',from:'9900123456',to:'company',direction:'incoming',type:'text',content:'What documents do I need to bring?',status:'Delivered',timestamp:'2026-10-17T10:15:00',employeeId:null,employeeName:null},
 {id:'MSG-008',conversationId:'CONV-003',leadId:'RCL-26007',from:'9988776655',to:'company',direction:'incoming',type:'text',content:'Please share the interest rates for personal loan.',status:'Read',timestamp:'2026-10-17T08:45:00',employeeId:null,employeeName:null},
 {id:'MSG-009',conversationId:'CONV-003',leadId:'RCL-26007',from:'company',to:'9988776655',direction:'outgoing',type:'text',content:'Hello Nisha! Our personal loan interest rates start from 11.99% p.a. The rate depends on your credit profile and loan amount. Would you like to discuss your requirement?',status:'Read',timestamp:'2026-10-17T08:50:00',employeeId:'EMP-001',employeeName:'Priya S'},
 {id:'MSG-010',conversationId:'CONV-004',leadId:null,from:'9845678901',to:'company',direction:'incoming',type:'text',content:'I need information about gold loan',status:'Delivered',timestamp:'2026-10-17T14:00:00',employeeId:null,employeeName:null}
]

// WhatsApp statistics
export const whatsappStats = {
 today: {totalMessages:8,incoming:3,outgoing:5,unreadCount:2,activeConversations:4},
 yesterday: {totalMessages:12,incoming:5,outgoing:7,unreadCount:0,activeConversations:3},
 thisWeek: {totalMessages:45,incoming:18,outgoing:27,unreadCount:2,activeConversations:8},
 thisMonth: {totalMessages:156,incoming:64,outgoing:92,unreadCount:2,activeConversations:24}
}
