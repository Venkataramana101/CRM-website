# Ramaiah Capital CRM — Frontend Prototype

A responsive internal CRM frontend for Ramaiah Capital Private Limited, built with React, Vite, Tailwind CSS 3, Recharts, and Lucide React.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

To validate a production build:

```bash
npm run build
npm run preview
```

## Screens included

- **Overview:** KPI cards, illustrative lead intake chart, funnel, recent leads, and follow-up queue.
- **Leads:** search, status/branch/product filters, pagination, add/edit forms, duplicate-phone warning, status updates, detail profile, CSV export, CSV import row-count preview.
- **Telecaller Desk:** productivity KPIs, lead queue, interaction logging, disposition history, optional callback task creation.
- **Tasks & Follow-ups:** pending/completed/all tabs, due dates, overdue highlighting, create task, complete task.
- **Campaigns:** campaign performance table, cost/lead and conversion calculations, CSV export, integration readiness panel.
- **Reports & Analytics:** lead status distribution, source mix, branch-wise metrics, branch filter, CSV export.
- **Settings:** demo configuration, product/branch/source overview, production readiness checklist, reset demo data.

## Working demo interactions

- Sidebar navigation and responsive mobile menu.
- Global search routes to Leads and filters matching records.
- Search/filter/sortable lead data (sort can be changed by clicking the relevant control if extended).
- Add/edit lead with mandatory fields and 10-digit phone validation.
- Duplicate phone warning.
- Lead status updates.
- Lead profile and activity timeline.
- Save demo call dispositions and notes; optionally create callback task.
- Create and complete follow-up tasks.
- CSV export for leads, campaigns, and reports.
- CSV file selection and row-count preview for import.
- Browser LocalStorage persistence across refreshes.
- Reset demo records to original seed data.
- Toast feedback and modal close behavior.

## Demo data and safety

All displayed lead names, phone numbers, dates, campaign spends, and metrics are illustrative sample data. They are not actual company results. Do not enter real customer, financial, identity, or confidential organizational data.

LocalStorage is browser-local and is not a secure shared database. This frontend does not provide real authentication, authorization, backend permissions, server-side audit logging, database backups, telephony, SMS/WhatsApp/email delivery, live campaign ingestion, or LOS/LMS integrations.

## Suggested next production phases

1. Confirm business workflows, lead statuses, ownership rules, and SLA definitions with stakeholders.
2. Add backend API and approved database.
3. Implement authentication, role-based access control, server-side validation, audit logs, backups, and monitoring.
4. Add secure CSV import mapping, validation, duplicate reconciliation, and import audit trail.
5. Integrate approved marketing, telephony, LOS/LMS, and notification services.
6. Complete privacy, consent, Do Not Contact, security, and operational acceptance testing.

## Project structure

```text
src/
  components/    # Shared components (reserved for continued modularization)
  data/          # Illustrative demo data
  pages/         # Page components (reserved for continued modularization)
  utils/         # LocalStorage and CSV helpers
  App.jsx
  main.jsx
  index.css
```

The current version keeps page rendering in `App.jsx` for a fast first prototype. As workflows are confirmed, the next iteration should extract each major screen and reusable table/form components into the modular folders above.
