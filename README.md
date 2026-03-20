# Calendar Logs

A habit and activity logging web app with a visual calendar. Log multiple activity types, each color-coded, and track them over time.

**Current mode:** Single-user, local storage only. No auth or backend required. Focus is on frontend/UX polish before scaling.

## Features

- **Calendar view** — See logged activities as color-coded dots on each date
- **Create activities** — Add activities via the + button or by clicking a date
- **Edit & delete** — Modify or remove activities from the side panel
- **View filter** — Filter the calendar by activity type (All, Gym, Dog Food, etc.)
- **Responsive** — Works on desktop and mobile

## Activity Types

| Type        | Color  |
|-------------|--------|
| Gym         | Blue   |
| Dog Food    | Green  |
| Cat Food    | Amber  |
| Wash Car    | Cyan   |
| Wash Sheets | Violet |

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

No `.env` or backend setup required. Data is stored in browser localStorage.

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4

## Future: Multi-user + Auth

When ready to scale, Supabase migration and auth wiring are documented in:

- `supabase/migrations/202602280001_phase1_foundation.sql`
- `docs/TECHNICAL_PLANNING.md`
- `docs/ENVIRONMENTS.md`
