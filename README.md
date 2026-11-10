# FENVAR INDUSTRIAL GROUP

Standalone bilingual (English / Arabic) public website and private export-sales workspace for FENVAR Industrial Group.

## Public website

- Live: https://asemitqan-cell.github.io/fenvar-industrial-group/
- Main files: `index.html`, `styles.css`, `script.js`
- Responsive black / silver / gold industrial brand presentation.
- English / Arabic language switch.
- Quote request form submits to the Supabase Edge Function:
  `https://zxeykzxoxylfsdnaimwk.supabase.co/functions/v1/fenvar-website-inquiry`

## Private control center

- Admin: https://asemitqan-cell.github.io/fenvar-industrial-group/admin.html
- Files: `admin.html`, `admin.css`, `admin.js`
- Uses Supabase Auth and the publishable key in the browser.
- Access requires an authenticated, active FENVAR profile with `owner` or `admin` role and the FENVAR company ID.
- Current modules:
  - Overview metrics and recent leads.
  - Lead management: create leads, update pipeline status, and set follow-up dates.
  - Customer directory: add buyers, distributors, manufacturers and other business contacts.
  - Market opportunities: register global buyers, product requirements, source URLs, verification state and pipeline status.
  - Customer offers: view quotations and approval states.

## Backend and data separation

- Dedicated Supabase project: `FENVAR` (`zxeykzxoxylfsdnaimwk`).
- Company ID: `910c5fe2-1add-4c9c-9f3c-4434bd43bc6a`.
- Website function: `fenvar-website-inquiry` (active; public form validates origin and fields, then inserts leads using a server-side service-role secret).
- Leads, customers, opportunities and offers are stored in the FENVAR project.
- Row Level Security is enabled on the application tables. Owner/admin policies scope operational records to the authenticated FENVAR company.
- The service-role secret must remain only in Supabase Function Secrets. Never put it in this repository or browser code.

## Production follow-up

1. Test create/update operations in the admin workspace using real FENVAR records.
2. Add verified company contact details, certifications, privacy notice and legal information.
3. Replace temporary/stock imagery with approved FENVAR factory and product photography.
4. Configure a custom domain, analytics, backups and operational monitoring.
5. Enable leaked-password protection in Supabase Auth.

## Important separation

This is the standalone FENVAR project. Do not connect it to or reuse ITQAN or Smart Growth OS data. No ITQAN resources are modified by this repository.
