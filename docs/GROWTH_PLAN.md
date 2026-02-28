# GROWTH PLAN

This document defines how Calendar Logs grows to 10K users and reaches at least $1K/month revenue with disciplined experimentation.

## 1) Positioning and Thesis

### Product Positioning

Calendar Logs is not just a generic habit tracker. It is a **recurring life maintenance tracker** for people who want a low-friction visual history of what happened and when.

### Core Promise

- Log real-life recurring activities quickly.
- View activity history on a visual calendar.
- Reduce cognitive load and avoid forgetting important routines.

### Beachhead Niches

- Pet care tracking
- Household routines (laundry/sheets/cleaning)
- Personal care cadence tracking
- Executive-function support users seeking low-friction logging

---

## 2) Monetization Strategy and Pricing Wall

Primary strategy: **Freemium subscription** with clear utility upgrades.

### Free Plan (default)

- Up to 3 activity types
- Calendar view + core logging
- Last 90 days of history
- Basic account sync

### Pro Plan ($4.99/month or $39/year)

- Unlimited activity types
- Unlimited history
- Calendar insights (streak windows, missed cadence alerts)
- CSV export
- Smart reminders and summary digest
- Early access to new features

### Launch Offer (optional)

- Lifetime Early Adopter: $19 one-time (limited to first 100-250 customers)
- Purpose: bootstrap first paid users, collect testimonials, and fund iteration

### Why this pricing works

- At $4.99/month, target is realistic for utility apps.
- To reach $1K MRR:
  - 201 Pro subscribers at $4.99/month
  - or 84 annual subscribers at $39/year equivalent monthly

### Paywall Trigger Recommendations

- Trigger paywall when user attempts to:
  - create 4th activity type
  - view history older than 90 days
  - enable reminders or export
- Do not block first-week core loop; let users reach value before monetization pressure.

---

## 3) Technical Roadmap and Rollout

Monetization recommendation: **web-first for speed, iOS-native second for stronger consumer subscription conversion and retention**.

### Platform Strategy

- **Phase A (now):** Responsive web app as primary build surface
- **Phase B (after baseline PMF signals):** Native iOS app for App Store trust, better retention loops, and in-app subscription monetization
- **Phase C (later):** Android native app after iOS unit economics are healthy

### Core Stack Decisions

- Frontend web: React + Tailwind (existing)
- Backend: Supabase (Postgres + Auth + RLS)
- Auth: Supabase Auth with Google OAuth
- Payments:
  - Web: Stripe subscriptions
  - iOS: StoreKit / App Store subscriptions
- Analytics: Product events + funnel dashboard (Mixpanel/PostHog/Amplitude acceptable)

### Shared Architecture Plan (Web + iOS)

- Keep one source of truth for:
  - schema and business rules
  - activity type logic
  - cadence/reminder logic
  - analytics event taxonomy
- Share backend + data models across clients.
- Keep UI layers platform-specific to preserve quality and native expectations.

### Technical Rollout Milestones

#### Milestone T1 (Weeks 1-4): Multi-user foundation on web

- Supabase schema + migrations + RLS
- Google sign-in
- User-scoped activity and type CRUD
- Seed defaults for new users: Gym, Tan, Laundry
- Basic production monitoring and error tracking

**Exit criteria:**

- secure user isolation verified
- sign-in to first log <= 60 seconds median
- no critical auth/data bugs for 7 consecutive days

#### Milestone T2 (Weeks 5-8): Paid-ready web product

- Paywall logic on feature gates
- Stripe checkout + entitlement state
- Reminders/insights MVP (paid differentiator)
- 90-day history limit for free

**Exit criteria:**

- paywall -> checkout -> active entitlement works end-to-end
- baseline paid conversion measured

#### Milestone T3 (Weeks 9-14): iOS monetization expansion

- Expo/React Native iOS app
- Supabase auth/session parity
- calendar + logging core loop parity
- StoreKit subscription flow + entitlement sync
- push notifications/reminders (if included in paid)

**Exit criteria:**

- iOS onboarding and paid flow fully functional
- D7 retention on iOS meets or exceeds web baseline

#### Milestone T4 (Post-iOS): scale and channel optimization

- Android prioritization decision based on ROI
- performance optimization on highest-retention segments
- mature lifecycle messaging and referral loop

**Exit criteria:**

- 10K user growth trajectory intact
- paid growth stable across at least 2 channels

---

## 4) 8-Week Growth Experiment Backlog

Run weekly experiments with one primary metric and one secondary metric.

## Week 1: Analytics + Baseline

- Implement event tracking:
  - `visit`
  - `signup_started`
  - `signup_completed`
  - `first_activity_logged`
  - `activity_type_created`
  - `day7_active`
  - `paywall_viewed`
  - `upgrade_started`
  - `upgrade_completed`
- Define baseline funnel conversion.

**Success metric:** instrumentation completeness and daily dashboard reliability.

## Week 2: Onboarding Compression

- Add 30-second guided onboarding:
  - choose use-case (pet / home / personal)
  - pre-seed suggested types by use-case
  - prompt first log immediately

**Primary metric:** `signup_completed -> first_activity_logged` conversion  
**Target:** +20% from baseline

## Week 3: SEO Foundation

- Launch 8-12 landing pages targeting long-tail intent:
  - pet feeding log
  - laundry schedule tracker
  - recurring chore calendar
  - dog care log calendar
- Add internal links and basic schema markup.

**Primary metric:** organic sessions/week  
**Target:** first 300+ organic visits/week

## Week 4: Short-Form Content Loop

- Publish 10-15 short videos showing real workflows.
- CTA to one dedicated landing page for each niche.

**Primary metric:** landing page CTR from social  
**Target:** >1.5% click-through

## Week 5: Community Distribution

- Post value-driven examples to niche communities (no spam):
  - productivity
  - pet owner groups
  - ADHD/executive function communities
- Share templates and “how I track X” posts.

**Primary metric:** referred signups/week  
**Target:** 150+ signups/week

## Week 6: Referral Loop v1

- Add in-app referral link with lightweight incentive:
  - 1 month Pro for each successful invite (cap per month)

**Primary metric:** invite-to-signup conversion  
**Target:** >15%

## Week 7: Paywall and Offer Test

- A/B test two pricing presentations:
  - monthly-first
  - annual-first (“save 35%” framing)

**Primary metric:** `paywall_viewed -> upgrade_completed`  
**Target:** 2-4% early-stage conversion

## Week 8: Retention Optimization

- Add reminder options and weekly digest
- Improve empty states for users with no logs in 3+ days

**Primary metric:** Day-7 retention  
**Target:** +15-25% relative lift

---

## 5) KPI Dashboard (Single Operating View)

Track one dashboard weekly with these sections.

### Acquisition

- Website visitors
- Signup conversion rate
- Source mix (organic, social, referral, community)
- CAC (if paid channels used)

### Activation

- `% users logging first activity within 24h`
- Median time to first activity
- `% users creating >=2 activity types in first 7 days`

### Retention

- D1, D7, D30 retention
- WAU/MAU ratio
- Average logged days per active user/week

### Revenue

- MRR
- Paid conversion rate
- ARPU
- Churn (logo and revenue churn)

### Operational Health

- Support tickets per 100 users
- App error rate
- Median page/API latency

---

## 6) Numeric Milestones to 10K Users and $1K/Month

## User Growth Milestones

- 1K users: prove onboarding + first value loop
- 3K users: stable organic/community acquisition
- 10K users: referrals + repeatable content engine working

## Revenue Milestones

- 25 paid users: first willingness-to-pay signal
- 100 paid users: initial PMF signal in at least one segment
- 201 paid users: $1K+ MRR at $4.99/month

---

## 7) Execution Cadence

- Weekly:
  - pick one growth experiment
  - define metric + target
  - ship by Friday
  - review results Monday
- Monthly:
  - prune low-performing channels
  - double down on top 1-2 channels
  - revisit pricing and retention metrics

---

## 8) Risks and Mitigations

- Risk: crowded generic habit category  
  Mitigation: niche positioning around recurring life maintenance.

- Risk: weak retention after novelty  
  Mitigation: reminders, weekly digests, and better onboarding templates.

- Risk: low paid conversion  
  Mitigation: tighten free limits around advanced value, test annual framing.

- Risk: channel inconsistency  
  Mitigation: build owned channels (SEO + referral) to reduce platform dependency.

---

## 9) Immediate Next Actions

1. Implement Supabase schema, auth, and RLS as first technical foundation.
2. Ship onboarding use-case selector with seeded templates and default types.
3. Implement analytics events and baseline funnel dashboard.
4. Add paywall trigger for 4th activity type and 90-day history.
5. Launch first 5 SEO pages and first 5 short videos.
6. Review first 2 weeks of data before expanding channel spend.
