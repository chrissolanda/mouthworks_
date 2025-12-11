# Mouthworks Dental Clinic Management System

## Overview
- End-to-end clinic management for Patients, Dentists, and HR.
- Real Supabase-backed CRUD across appointments, treatments, payments, inventory, and users.
- Role-based dashboards with immediate cross-role sync (HR ↔ Dentist ↔ Patient).

## Tech Stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind (shadcn/ui + Radix UI).
- Backend: Supabase (PostgreSQL, Auth, Row-Level Security, PostgREST).
- Build: Turbopack (Next.js dev server), PNPM/NPM.

## Key Features
- Patients: register, book appointments, view payments and profile.
- HR: manage patients, appointments, inventory, treatments, payments, reports, settings.
- Dentists: personal schedule, complete treatments, record payments, earnings and reports.
- Payments: linked to appointments and dentists; real-time visibility across dashboards.
- Treatments: configurable services; treatment records saved with quantities.

## Roles & Dashboards
- Patient
  - Appointments: create and manage bookings.
  - Dashboard: upcoming visits, history, and quick actions.
  - Payments: transaction history tied to their appointments.
  - Profile: personal details management.
- Dentist
  - Schedule: view assigned appointments; complete treatments and trigger payment flows.
  - Treatments: add services, record treatment details and quantities.
  - Earnings: per-dentist transactions, net balance, filters.
  - Reports: performance summaries.
- HR
  - Dashboard: high-level metrics and quick actions.
  - Patients: full CRUD with view/edit modals.
  - Appointments: create, assign dentist, approve/complete, record payments.
  - Treatments: catalog management; add/edit services.
  - Inventory: manage supplies; dentist supply requests supported.
  - Payments: record/edit/delete payments; search/filter; status badges.
  - Reports & Settings: system-level insights and configuration.

## Data & Services
- Supabase tables: patients, dentists, appointments, treatments, treatment_records, payments, inventory, supply_requests.
- Service layer: `lib/db-service.ts` implements CRUD for all modules.
- Auth: Supabase Auth; users in Supabase drive Quick Login entries via `app/api/auth/quicklogins/route.ts`.
- Server APIs: `app/api/*` routes (e.g., payments/create) use service role where needed.

## Project Structure
- App pages: see `app/` folders for role-specific routes.
- Components: modals and UI primitives under `components/`.
- Hooks & Lib: `hooks/` for UI helpers; `lib/` for auth/db clients and utilities.
- Scripts: SQL migrations under `scripts/` to set up schema, seed data, and RLS.

## Setup
1. Create `.env.local` with Supabase credentials.
2. In Supabase SQL Editor, run schema and policy scripts from `scripts/` (start with `01-create-schema.sql`).
3. Optionally run emergency policy scripts to unblock development (see `DISABLE_RLS_ALL.sql` and `YOU_MUST_RUN_THIS_NOW.sql`).
4. Install dependencies and start dev server: `npm install` then `npm run dev`. Alternatively run `./setup.ps1` on Windows.

## Important Notes
- RLS: For production, enable and configure proper policies; development can temporarily disable.
- Payments: ensure `payments` has `dentist_id`, `appointment_id`, `patient_id`, `amount`, `status`, `method`, `date`.
- Treatments: treatment_records include `quantity` to avoid completion errors.
- Cache: after altering schema, send `NOTIFY pgrst, 'reload schema';` and restart dev server.

## Quick Links
- HR Payments: `app/hr/payments/page.tsx`
- Dentist Schedule: `app/dentist/schedule/page.tsx`
- Quick Login API: `app/api/auth/quicklogins/route.ts`
- DB Services: `lib/db-service.ts`
- Supabase Client: `lib/supabase-client.ts`, `lib/supabase-server.ts`
- SQL Setup: `scripts/01-create-schema.sql` and related scripts

## Getting Help
- Troubleshooting and setup docs are in the repo root: STATUS, SYSTEM_READY, QUICKSTART, SUPABASE_SETUP, PAYMENT_* docs.
- Verify policies and schema using provided SQL verification scripts.
