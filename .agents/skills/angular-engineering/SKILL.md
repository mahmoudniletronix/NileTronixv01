---
name: angular-engineering
description: "Use when project uses Angular and task modifies Angular components, routes, forms, RxJS, Signals, services, guards or architecture."
---

# Senior Angular implementation
## Discover version and local style first
Inspect `package.json`, `angular.json`, tsconfig, standalone vs NgModules, routing, form patterns, UI library, package lock and lint/test scripts. Never assume Angular 20/21/22.

## Guidelines
- Match existing feature-based boundaries and dependency injection practices; avoid giant components and unnecessary global singleton state.
- Use TypeScript models for API IO; typed reactive forms where suitable; Signals or RxJS based on application needs, not dogma.
- Handle subscriptions, teardown, cancellation, stale async results and change detection. Use `OnPush` where safe, `trackBy`/`track` for large lists.
- Respect SSR/hydration where configured; avoid accessing browser globals during server render.
- Guards and role-based navigation do not replace server-side enforcement.
- Preserve forms, templates, translations, route parameters, interceptors and material/bootstrap behaviors when styling changes.
- Prefer existing CLI/linters and compatibility-aware diagnostics; don't upgrade framework or add UI libraries without necessity.

## Finish
Focused build/typecheck/test appropriate to change; verify DOM/interaction on touched routes. In Angular UI reviews, pair with `ui-ux-product-design` or `mobile-ux-responsive` only when task requires it.
