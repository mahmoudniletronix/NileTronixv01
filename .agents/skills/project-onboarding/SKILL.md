---
name: project-onboarding
description: "Use when starting in any new repository or changing stacks; discover framework, structure, product, business rules, design system, tests and tools."
---

# Project onboarding — project truth, not assumptions
## Minimal discovery sequence
1. Read root readme, package/manifests, lockfile indicators, scripts and known agent/project instructions. Inspect git status before edits.
2. Determine frontend framework(s) and versions, backend language, monorepo/package manager, styling/UI libraries, state/i18n/auth/test setup.
3. Identify app entry points, routes/screens, major roles and business entities via code/evidence, plus API source-of-truth and test commands.
4. Locate approved visual identity/design tokens and identify unknown decisions. Never import another project profile.
5. Create a *brief in-chat* project snapshot and only if explicitly requested, materialize a project-specific knowledge file (template under `../../knowledge/PROJECT_PROFILE.template.md`).
6. Classify risks, impacted modules and tools needed; inspect narrower scope for small requests.

## Deliverable
Stack + versions; top-level route/module map; existing conventions; brand source; API/testing tooling; uncertainty; next action.
Use `../../templates/project-discovery.md` when a full audit is requested.
