# Test Plan

This document tracks implementation progress against the phased rollout for turning Calendar Logs into a multi-user product.

## Success Criteria

- Data is user-scoped and durable across devices.
- Users can sign in securely with minimal friction.
- Users can create/manage their own activity types.
- New users are seeded with sensible defaults.
- Core UX remains fast and elegant on mobile and desktop.

## Phase 1 — Core Platform (Data + Auth Foundation)

**Goal:** Move from local-only storage to secure, per-user cloud data.

### Scope

- Set up Supabase project.
- Add production database schema:
  - `profiles`
  - `activity_types`
  - `activities`
- Add indexes for common calendar queries.
- Implement Row-Level Security (RLS) for all user-owned tables.
- Integrate Google sign-in via Supabase Auth.
- Require auth for all write operations and user data reads.

### Validation / Tests

- New user can sign in with Google and access app.
- User A cannot read/edit User B data.
- Activity create/edit/delete persists across refresh and sign-ins.
- Calendar load for current month is performant.

### Status

- [ ] Not started

---

## Phase 2 — Activity Type Productization

**Goal:** Let each user customize activity types with safe defaults.

### Scope

- Seed default activity types for every new account:
  - Gym
  - Tan
  - Laundry
- Build CRUD for activity types:
  - Create type (name + color)
  - Edit type
  - Delete type
- Decide and implement delete behavior for types with existing activities:
  - Recommended: block delete and require reassignment first.

### Validation / Tests

- New account receives defaults exactly once.
- User can create custom types and see them in panel/calendar.
- Deleting defaults works according to selected policy.
- Existing activities remain consistent after type edits.

### Status

- [ ] Not started

---

## Phase 3 — UX Hardening + Reliability

**Goal:** Improve retention-critical UX and app quality.

### Scope

- Protected route handling + session persistence UX.
- Empty states and onboarding tips for first-week users.
- Error handling and loading states for auth/data requests.
- Basic analytics events:
  - signup completed
  - first activity logged
  - activity type created
  - day-7 retention marker

### Validation / Tests

- No broken states on slow network.
- New user reaches first logged activity in < 60 seconds.
- Error messages are actionable and non-technical.

### Status

- [ ] Not started

---

## Phase 4 — Growth + Monetization Readiness

**Goal:** Prepare the product for distribution and revenue experiments.

### Scope

- Add lightweight referral/share flow.
- Add billing scaffolding (if paid tier introduced).
- Add export/import basics (optional but trust-building).
- Instrument funnel:
  - visit -> signup -> first log -> week-1 retention -> upgrade

### Validation / Tests

- Referral flow produces trackable invite events.
- Pricing/paywall experiments can be A/B tested safely.
- Funnel metrics are queryable weekly.

### Status

- [ ] Not started

---

## Ongoing Working Agreement

When implementing features, map each task to one of the above phases and update this file:

- Mark checkboxes as work begins/completes.
- Add dated notes under relevant phase when scope changes.
- Keep this file and `docs/PROJECT_BRIEF.md` aligned.
