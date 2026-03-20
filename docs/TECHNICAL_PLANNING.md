# Technical Planning

> **Status:** Phase 1 (Supabase + Google Auth) is **deferred**. App currently uses localStorage only. Use this doc when ready to add backend and auth.

This document is the implementation blueprint for **Phase 1: Data + Auth Foundation**.

## Phase 1 Objective

Move Calendar Logs from browser-only local storage to secure, user-scoped cloud storage with authentication.

By the end of Phase 1:

- Users can sign in with Google.
- All activity data is scoped to authenticated users.
- Data persists across devices and sessions.
- Authorization is enforced at the database layer with RLS.

---

## Scope (Phase 1)

### In Scope

- Supabase project setup and environment configuration
- Postgres schema for:
  - `profiles`
  - `activity_types`
  - `activities`
- Row Level Security policies for all user tables
- Google authentication through Supabase Auth
- Frontend integration of auth state + protected data operations
- Migration from localStorage model to Supabase-backed reads/writes
- Default activity type seeding for new users (`Gym`, `Tan`, `Laundry`)

### Out of Scope

- Billing/paywall
- Advanced reminders
- Shared household collaboration
- Native mobile app (iOS/Android)

---

## Architecture (Phase 1)

### Platform

- Frontend: React + Tailwind
- Backend: Supabase (Postgres, Auth, SQL migrations)
- Auth Provider: Google OAuth via Supabase

### Data Ownership Model

- Every user-owned row includes `user_id uuid not null`.
- `user_id` matches `auth.uid()`.
- RLS policy pattern:
  - `SELECT`: `user_id = auth.uid()`
  - `INSERT`: `user_id = auth.uid()`
  - `UPDATE`: `user_id = auth.uid()`
  - `DELETE`: `user_id = auth.uid()`

---

## Database Design

### 1) `profiles`

Purpose: lightweight app profile tied to auth user.

Recommended columns:

- `id uuid primary key references auth.users(id) on delete cascade`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### 2) `activity_types`

Purpose: user-defined or seeded categories with colors.

Recommended columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `name text not null`
- `color text not null`
- `is_default boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null` (optional soft delete)

Constraints:

- unique per user (case-insensitive): `unique (user_id, lower(name))`

### 3) `activities`

Purpose: calendar log entries.

Recommended columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `activity_type_id uuid not null references activity_types(id) on delete restrict`
- `activity_date date not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Recommended uniqueness:

- If one log per type/day: `unique (user_id, activity_type_id, activity_date)`

Indexes:

- `idx_activities_user_date (user_id, activity_date)`
- `idx_activities_user_type_date (user_id, activity_type_id, activity_date)`
- `idx_activity_types_user_active (user_id, deleted_at)`

---

## Security and RLS Plan

### RLS Principles

- Enable RLS on `profiles`, `activity_types`, `activities`.
- Do not rely only on frontend filtering.
- Keep policy definitions explicit and table-specific.

### RLS Checklist

- [ ] RLS enabled on all user-owned tables
- [ ] Policies exist for select/insert/update/delete
- [ ] Cross-user read/write blocked in verification tests
- [ ] Service role access used only in controlled backend/migrations

---

## Auth and Session Flow

### User Flow

1. User clicks **Continue with Google**
2. Supabase OAuth redirect
3. App receives authenticated session
4. App fetches user profile and user-scoped data
5. If first sign-in, seed defaults and continue into calendar

### Technical Notes

- Use Supabase client session persistence.
- Use protected route guard for calendar UI.
- On sign-out, clear in-memory state and return to auth screen.

---

## Default Type Seeding (Phase 1 requirement)

Seed once per new account:

- Gym
- Tan
- Laundry

Implementation options:

- Preferred: DB function + trigger on new user creation
- Alternative: first-login bootstrap from app client with idempotency checks

Idempotency rule:

- Seeding operation must be safe if executed multiple times.

---

## Frontend Refactor Plan

### Current State

- App uses localStorage hook for activities.

### Target State

- Replace localStorage operations with Supabase-backed data service layer.
- Keep UI components mostly unchanged.

### Suggested App Layers

- `auth/` (session and provider logic)
- `data/` (queries/mutations for activities and types)
- `hooks/`:
  - `useAuthSession()`
  - `useActivityTypes()`
  - `useActivities()`

---

## Implementation Milestones (Phase 1)

### Milestone P1.1 — Project Setup

- [ ] Create Supabase project
- [ ] Configure env vars in app
- [ ] Add Supabase client package

### Milestone P1.2 — Schema + Policies

- [ ] Create tables and indexes
- [ ] Enable RLS + apply policies
- [ ] Add timestamp update triggers

### Milestone P1.3 — Google Auth

- [ ] Configure Google OAuth in Supabase + Google Cloud Console
- [ ] Add sign-in and sign-out flows
- [ ] Add protected route logic

### Milestone P1.4 — Data Integration

- [ ] Replace localStorage CRUD with Supabase CRUD
- [ ] Ensure month calendar queries are performant
- [ ] Add first-login default seeding

### Milestone P1.5 — Validation + Hardening

- [ ] Verify cross-user isolation
- [ ] Verify create/edit/delete across refresh and new sessions
- [ ] Add basic error/loading states

---

## Validation and Test Matrix

### Functional

- [ ] New user can sign in with Google
- [ ] User sees only their own activity types and activities
- [ ] User can create, edit, delete activities
- [ ] Data appears on second device after sign-in

### Security

- [ ] User A cannot read User B rows
- [ ] User A cannot mutate User B rows
- [ ] Unauthenticated access to user tables is blocked

### Performance

- [ ] Current-month calendar query returns quickly under typical load
- [ ] Month navigation does not feel delayed

---

## Risks and Mitigations

- OAuth misconfiguration  
  Mitigation: configure local + production callback URLs up front.

- Policy mistakes causing unauthorized access  
  Mitigation: explicit RLS tests before rollout.

- Data model churn between phases  
  Mitigation: keep migrations additive and documented.

- Migration bugs from localStorage to cloud  
  Mitigation: ship with staged rollout and debug logging.

---

## Definition of Done (Phase 1)

Phase 1 is complete when:

- Google login works in local + production.
- Activity and type data is fully Supabase-backed.
- RLS blocks all cross-user access in testing.
- New users receive default activity types exactly once.
- Core calendar experience remains responsive and stable.
