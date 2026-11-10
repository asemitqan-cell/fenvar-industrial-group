# FENVAR INDUSTRIAL GROUP

Bilingual English/Arabic public website and private operations dashboard for FENVAR Industrial Group.

## Public website

- GitHub Pages: https://asemitqan-cell.github.io/fenvar-industrial-group/
- Main files: `index.html`, `styles.css`, `script.js`
- Responsive dark / silver / gold brand presentation.
- English/Arabic language switch.
- Quote request form posts to the Supabase Edge Function:
  `https://zxeykzxoxylfsdnaimwk.supabase.co/functions/v1/fenvar-website-inquiry`

## Backend

- Supabase project: `FENVAR` (`zxeykzxoxylfsdnaimwk`)
- Edge Function: `fenvar-website-inquiry` (active; JWT verification disabled because it is a public website form; the function validates origin and fields, then inserts a lead using the server-side service-role secret).
- Leads are stored in `public.leads` and associated with the FENVAR company record.
- The service-role secret must remain configured only in Supabase Function Secrets. Never place it in this repository or browser code.

## Private admin dashboard

- URL: https://asemitqan-cell.github.io/fenvar-industrial-group/admin.html
- Files: `admin.html`, `admin.css`, `admin.js`
- Uses Supabase Auth and the publishable key in the browser.
- Dashboard access requires an authenticated, active FENVAR profile with the `owner` or `admin` role and the FENVAR company ID.
- **Owner account provisioning is not complete yet.** The FENVAR Auth project currently has no users/profiles, so the dashboard login cannot be used until the owner account is securely created and linked to the FENVAR company.

## n8n automation

A workflow shell exists in the n8n account:
`FENVAR | Weekly Global Buyer Intelligence`

Current verified state:
- The workflow is saved but inactive.
- The last independent inspection found only a Schedule Trigger and one RSS Read node.
- The RSS node points to `https://www.fenv.com/blog`; it does not yet implement the four-source buyer research pipeline, topic tagging, deduplication, or 50-result limit.
- Do not publish this workflow until it is completed and tested.
- Target schedule: every Monday at 08:00 Africa/Cairo.

## Production checklist

1. Provision the first FENVAR owner securely in Supabase Auth and create the matching active `public.profiles` record with role `owner` and the FENVAR company ID.
2. Test the public quote form end-to-end and verify the lead appears in the FENVAR admin dashboard. Use a clearly identified test inquiry and remove it after verification.
3. Review and test RLS policies for every table exposed to the browser; keep service-role credentials server-side only.
4. Complete and manually test the n8n weekly buyer-intelligence workflow, then publish it with the Africa/Cairo timezone.
5. Replace stock imagery with approved FENVAR product/factory photography and add verified company contact details, certifications, privacy notice, and legal information.
6. Configure a custom domain, analytics, backups, and operational monitoring.

## Important separation

This Supabase project is the standalone FENVAR project. Do not connect it to or reuse ITQAN or Smart Growth OS data.
