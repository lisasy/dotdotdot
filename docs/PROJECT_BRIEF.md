# Calendar Logs — Project Brief & Design

> **Purpose:** This document is the single source of truth for product requirements, UX, and design decisions. Update this brief when refining the product. All code changes should align with this document.

---

## Product Concept

**Calendar Logs** is a habit and activity logging web app. The real-world analogy: people marking dates on a physical calendar when they complete a habit. As software, we enable logging **multiple activity types** at once, each with its own visual identity.

---

## User Stories

1. **View** — User can see a calendar of logged activities, each represented by a simple dot, color-coded by activity type.
2. **Create** — User can log an activity (date + type).
3. **Edit / Delete** — User can edit or delete an existing activity.

---

## Activity Types

Each type has an id, name, and color. Current configuration:

| Type        | ID          | Color   |
|-------------|-------------|---------|
| Gym         | `gym`       | #3b82f6 |
| Dog Food    | `dog-food`  | #22c55e |
| Cat Food    | `cat-food`  | #f59e0b |
| Wash Car    | `wash-car`  | #06b6d4 |
| Wash Sheets | `wash-sheets` | #8b5cf6 |

To add or change activity types, update `src/config/activityTypes.js`.

---

## Interface Design

### Visual

- **Background:** `#eae9e3`
- **Font:** DM Mono (Google Fonts)
- **Calendar:** White background, subtle border, centered
- **Tone:** Elegant, simple, minimal

### Layout & Components

- **Calendar:** Centered in the viewport; shows current month by default.
- **FAB (+):** Circular action button fixed bottom-right; opens Create Activity flow.
- **View filter:** Dropdown at top of calendar; default `All`; filters which activity types appear as dots.

### Create / Edit Panel

- Slides in from the right when opened.
- Calendar shifts left to accommodate (desktop); on mobile, panel overlays with backdrop.
- Form fields: **Date** (date picker), **Activity type** (list of selectable cells, each with color dot and name; uses same rounded-lg as other form elements).
- When opened via date click: date is pre-filled but editable.

---

## UX Flows

1. **Create via FAB** — Click + → panel opens with today’s date → fill form → Create.
2. **Create via date click** — Click calendar date → panel opens with that date pre-filled → fill form → Create.
3. **Edit / Delete** — Panel open → see “Logged for this date” → click edit or delete on an activity.

---

## Technical Stack

- React
- Vite
- Tailwind CSS
- LocalStorage for persistence

---

## Design Principles

- **Clean, repeatable code** — Reuse the same panel for create (FAB) and create (date click).
- **Responsive** — Must work on mobile and desktop.
- **Consistency** — Color-coding and layout should match this brief.

---

## Changelog

- *Activity type selector* — Replaced dropdown with list cells for clearer color visibility and selection.
- *Initial brief* — Captured from project kickoff and first implementation.
