# Design System Playbook

This playbook is the canonical guide for design quality, interaction craft, and design-engineering collaboration on Calendar Logs.

## Purpose

- Keep visual and interaction quality consistently high.
- Reduce ambiguity between design intent and implementation.
- Make iteration cycles faster and more objective.

## Product Design Principles

- Calm and elegant, never noisy.
- Fast, low-friction logging over feature complexity.
- Predictable patterns across views and devices.
- Accessibility and clarity are non-negotiable.

## Visual Foundation

### Brand and Tone

- App background: `#eae9e3`
- Primary surface: `#ffffff`
- Type family: DM Mono
- Style direction: minimal, premium utility, soft contrast

### Spacing Rhythm

- Use 4px spacing scale (`4, 8, 12, 16, 20, 24, 32, 40, 48`).
- Prefer consistent vertical rhythm over dense layouts.
- Keep form groups visually chunked with clear breathing room.

### Radius, Borders, Shadows

- Default control radius: `rounded-lg`
- Border color baseline: neutral 300
- Surface borders should be subtle and informative.
- Shadows should be low elevation and used sparingly.

### Color Usage

- Activity type colors should remain high-contrast and stable.
- UI chrome remains neutral so activity dots/colors stay dominant.
- Avoid introducing new semantic colors without documenting why.

## Interaction and Motion

- Motion should explain state changes, not decorate.
- Transition duration target: `200-300ms` for panel and control state changes.
- Keep easing smooth and restrained.
- Preserve perceived performance by avoiding jarring reflows.

## Component Quality Bar

Every UI component should define and support:

- Default
- Hover
- Focus-visible
- Active/pressed
- Disabled (if applicable)
- Error (for inputs)
- Loading (if asynchronous)

## Accessibility Baseline

- Keyboard navigable interactive controls.
- Visible focus indicators on all actionable elements.
- Form controls must have labels.
- Color is never the only signal; include shape/text/state.

## Collaboration Protocol (Design + Engineering)

Use this format whenever we work on design-heavy tasks.

### 1) Intent Brief

Provide 2-5 bullets:

- user problem
- desired user feeling
- primary success moment
- hard constraints (time/tech/business)

### 2) Reference Direction

Provide 2-3 examples and annotate:

- what to borrow
- what to avoid

### 3) UX State Spec

Define required states:

- default, hover, focus, active
- empty, loading, error, success
- responsive behavior (mobile/tablet/desktop)

### 4) Quality Non-Negotiables

List explicit requirements:

- spacing discipline
- motion style
- typography tone
- accessibility checks

### 5) Acceptance Checklist

Define objective ship criteria:

- visual consistency
- interaction behavior
- responsiveness
- accessibility baseline

### 6) Crit and Iteration Loop

- implementation pass
- visual critique pass
- refinement pass
- final QA pass

## Design Interview Script (Required Before Design Changes)

Before implementing design changes, ask these questions:

1. Who is the target user for this change?
2. What exact behavior should change after this update?
3. What emotion should the interface evoke?
4. What references best represent the intended quality?
5. What constraints are fixed vs flexible?
6. What are the non-negotiable details?
7. How will we judge whether this is successful?

If any answer is unclear, pause implementation and clarify first.

## Design QA Checklist

- Layout aligns with spacing scale.
- Contrast and readability are solid across breakpoints.
- Controls share consistent radius, border, and focus treatment.
- Motion is smooth and purposeful.
- No visual regressions in key flows (calendar, panel, create/edit).

## Change Log

- Initial playbook created as canonical design collaboration guide.
