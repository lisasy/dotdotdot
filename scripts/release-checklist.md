# Release Checklist

Use this checklist for every release from `staging` to `main`.

## 1) Pre-release (Staging readiness)

- [ ] `dev` has been merged into `staging`
- [ ] App builds cleanly (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] All new migrations are committed in `supabase/migrations`
- [ ] Migrations applied successfully to **staging Supabase**
- [ ] Staging environment variables are correct
- [ ] Google auth works on staging URL

## 2) Staging QA

- [ ] Sign in with Google
- [ ] Sign out and sign back in
- [ ] Create activity
- [ ] Edit activity
- [ ] Delete activity
- [ ] Activity type filter works
- [ ] Calendar month navigation works
- [ ] Mobile layout sanity check
- [ ] No major console errors in browser

## 3) Production deployment

- [ ] Merge `staging` into `main`
- [ ] Apply same migrations to **production Supabase**
- [ ] Verify production env vars in Vercel
- [ ] Deploy `main` to production

## 4) Post-release smoke test (Production)

- [ ] Google auth works on production domain
- [ ] Existing user data loads
- [ ] Create/edit/delete still works
- [ ] Activity types display correctly
- [ ] No broken UI on mobile viewport

## 5) Monitoring and rollback readiness

- [ ] Watch logs/errors for first 30-60 minutes
- [ ] Confirm no auth or data spikes in errors
- [ ] Rollback commit identified (last stable SHA)
- [ ] Rollback steps documented in release notes

## 6) Release log (fill every time)

- **Release date:** `<YYYY-MM-DD>`
- **Release owner:** `<name>`
- **Staging URL tested:** `<url>`
- **Production URL:** `<url>`
- **Migrations included:** `<filenames>`
- **Notable changes:** `<summary>`
- **Post-release status:** `<healthy / issues>`
