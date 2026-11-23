---
name: mobile-ux-responsive
description: "Use for phone-specific UI/UX, tablet ergonomics, responsive data tables/forms/dialogs/navigation, touch and virtual keyboard issues."
---

# Mobile is a distinct interaction environment
## Per-view adaptation
- Identify 1–2 primary mobile tasks and rank essential content/actions before adjusting CSS.
- Map Desktop → Tablet → Mobile patterns in `../../templates/responsive-plan.md`.
- Treat 320px, 375px, 430px, 768px, 1024px, 1280px and 1600px as test samples; use content-driven breakpoints.
- Account for landscape, mobile keyboard, browser zoom, dynamic viewport height, safe-area and touch/keyboard parity.
- Keep titles, search, filter, sort and detail access discoverable. Use compact summaries with drill-down for dense records when appropriate; do not delete critical columns without accessible detail paths.
- Choose bottom navigation only when roles have a small stable set of top-level destinations; forms may use full-screen flows, sheets, drawers and sticky actions sparingly.
- Dialogs: ensure focus trap/restoration, safe-area, keyboard avoidance, scroll region and clear close/cancel behavior.
- Prevent accidental page-level horizontal overflow, tiny touch controls, awkward fixed headers and stacked floating buttons.
- Verify empty/error/loading states, long labels and RTL on actual narrow view when tools available.

## Mobile UX quality gate
Can a first-time user complete the core task one-handed (where realistic), with errors recoverable and no hidden essential actions?
