---
trigger: model_decision
description: "Use for architecture, frontend/backend code changes, type safety, refactors, version compatibility, maintainability."
---

# Engineering standards
- Inspect actual framework, package versions and local conventions; avoid installing dependencies to enforce personal preferences.
- One feature's business logic has a clear owner. UI components focus on interaction/rendering; side-effects belong to suitable services/hooks/stores/facades based on project pattern.
- Prefer strict model types, explicit async error handling, cleanup/cancellation, resilient state transitions and stable public APIs.
- Avoid undocumented patterns, speculative APIs, prop drilling or global state unless the existing architecture demands them.
- Don't create abstractions before seeing at least two genuine uses; protect compatibility and regression behavior.
