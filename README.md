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
  - Market opportunities: register global prospects, preserve evidence URLs and research notes, score fit, and manage verification and pipeline status.
  - Buyer communications: log inbound/outbound emails, calls, WhatsApp, LinkedIn and internal notes (logging only; no messages are sent).
  - Customer offers: create draft quotations with supplier, shipping and other costs, margin, currency, validity, delivery/payment terms, and approval status.
  - Lead conversion: convert a qualified lead into a customer while linking the original lead.

## Backend and data separation

- Dedicated Supabase project: `FENVAR` (`zxeykzxoxylfsdnaimwk`).
- Company ID: `910c5fe2-1add-4c9c-9f3c-4434bd43bc6a`.
- Website function: `fenvar-website-inquiry` (active; public form validates origin and fields, then inserts leads using a server-side service-role secret).
- Leads, customers, opportunities and offers are stored in the FENVAR project.
- Row Level Security is enabled on the application tables. Owner/admin policies scope operational records, including supplier outreach and buyer communications, through the linked FENVAR opportunity.
- The service-role secret must remain only in Supabase Function Secrets. Never put it in this repository or browser code.

## Initial research pipeline

Five public-source prospect records have been added for Saudi Arabia, Qatar and the UAE. They are deliberately marked `needs_review`, not verified buyers: the public evidence shows relevant importing/trading or uPVC fabrication activity, but procurement intent and supplier openness still require qualification. Each record retains its public source URL and research notes.

## Production follow-up

1. Complete authenticated end-to-end browser tests for create/update, lead conversion, communications and quotation workflows.
2. Add verified company contact details, certifications, privacy notice and legal information.
3. Replace temporary/stock imagery with approved FENVAR factory and product photography.
4. Configure a custom domain, analytics, backups and operational monitoring.
5. Enable leaked-password protection in Supabase Auth.

## Important separation

This is the standalone FENVAR project. Do not connect it to or reuse ITQAN or Smart Growth OS data. No ITQAN resources are modified by this repository.
