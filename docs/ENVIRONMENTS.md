# Environments Guide (DEV, STAGING, PRODUCTION)

> **Status:** Auth and multi-user deployment are **deferred**. The app runs as single-user with localStorage. Use this guide when you're ready to add Supabase and scale.

This is the canonical guide for setting up and operating environments for Calendar Logs.

## Why this setup

We keep three fully separate environments so experiments and bugs never affect production users:

- **DEV**: local feature work and fast iteration
- **STAGING**: pre-release QA and integration testing
- **PRODUCTION**: live user traffic

---

## 1) Environment architecture

Use one GitHub repo with three branches and three backend/frontend stacks.

### Branches

- `dev` -> development integration branch
- `staging` -> release candidate branch
- `main` -> production branch

### Supabase projects (one per environment)

- `calendar-logs-dev`
- `calendar-logs-staging`
- `calendar-logs-prod`

### Vercel projects (one per environment)

- `calendar-logs-dev`
- `calendar-logs-staging`
- `calendar-logs-prod`

This 1:1 mapping is the easiest to reason about as a solo founder.

---

## 2) First-time setup checklist

## Step A — Create Supabase projects

Create the 3 Supabase projects listed above.

For each project:

1. Open SQL Editor.
2. Run migration file:
   - `supabase/migrations/202602280001_phase1_foundation.sql`
3. Confirm tables exist:
   - `profiles`
   - `activity_types`
   - `activities`
4. Confirm RLS is enabled on all three tables.

## Step B — Configure Google auth per environment

In Google Cloud Console, create separate OAuth clients:

- `calendar-logs-dev-web`
- `calendar-logs-staging-web`
- `calendar-logs-prod-web`

For each OAuth client, add authorized redirect URI:

- `https://<supabase-project-ref>.supabase.co/auth/v1/callback`

Then in each matching Supabase project:

1. Authentication -> Providers -> Google -> Enable
2. Paste client ID + client secret for that environment
3. Save

## Step C — Configure Supabase URL settings per environment

In each Supabase project:

Authentication -> URL Configuration

- **DEV**
  - Site URL: `http://localhost:5173`
  - Additional Redirect URLs:
    - `http://localhost:5173`
    - (optional) dev Vercel domain
- **STAGING**
  - Site URL: your staging Vercel URL
  - Additional Redirect URLs:
    - local URL if needed for debugging
    - staging URL
- **PRODUCTION**
  - Site URL: your production domain
  - Additional Redirect URLs:
    - production URL

## Step D — Configure Vercel projects

Create 3 Vercel projects and connect each to this GitHub repo.

Set environment variables in each Vercel project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use values from the matching Supabase project only.

---

## 3) Secrets and env variable rules

- `VITE_SUPABASE_ANON_KEY` is safe for frontend (publishable key).
- Never expose `service_role` key in frontend or any `VITE_*` variable.
- Keep service keys only in server-side secrets (future API/functions).

---

## 4) Day-to-day workflow

This is the exact workflow to follow while developing.

## Working in DEV

1. Start from `dev` branch.
2. Pull latest:
   - `git checkout dev`
   - `git pull`
3. Run locally with DEV Supabase `.env`.
4. Build and test feature.
5. Commit and push to `dev`.

Use DEV for:

- active coding
- schema experiments (via new migration files)
- rough QA

## Deploying to STAGING

Use staging when a feature is complete and needs verification.

1. Merge `dev` -> `staging`.
2. Apply any new migration to **staging Supabase** first.
3. Push `staging` branch.
4. Vercel staging deploy runs automatically.
5. Run release QA checklist:
   - auth login/logout
   - create/edit/delete activity
   - activity type rendering and colors
   - month navigation
   - mobile layout check
   - no console errors

Only release from staging after QA passes.

## Deploying to PRODUCTION

1. Merge `staging` -> `main`.
2. Apply same migrations to **prod Supabase**.
3. Push `main`.
4. Vercel production deploy runs.
5. Run post-deploy smoke test on production:
   - Google sign-in works
   - Existing users can load data
   - Create/edit/delete still works

---

## 5) Migration discipline (very important)

Always create additive SQL migration files in `supabase/migrations`.

Promotion order for every migration:

1. DEV Supabase
2. STAGING Supabase
3. PROD Supabase

Never hot-fix production schema manually without committing the migration file first.

---

## 6) Release checklist template

Copy this for each release:

- [ ] All feature work merged to `staging`
- [ ] All new migrations applied to staging
- [ ] Staging QA passed
- [ ] Merged `staging` -> `main`
- [ ] Migrations applied to production
- [ ] Production smoke test passed
- [ ] Rollback plan documented

---

## 7) Rollback strategy

If production issue appears:

1. Revert `main` to last known good commit and redeploy.
2. If migration caused issue, use a new forward-fix migration (prefer this).
3. Communicate incident and recovery notes in release log.

---

## 8) Environment inventory template

Fill this once and keep updated.

| Environment | Branch | Frontend URL | Supabase Project Ref | Google OAuth Client |
|---|---|---|---|---|
| DEV | `dev` | `<fill>` | `<fill>` | `<fill>` |
| STAGING | `staging` | `<fill>` | `<fill>` | `<fill>` |
| PROD | `main` | `<fill>` | `<fill>` | `<fill>` |

---

## 9) Practical founder defaults

If you want minimum overhead now:

- Keep local as DEV
- Use one hosted STAGING
- Keep PROD separate and protected

This gives strong safety without heavy DevOps complexity.
