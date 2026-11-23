---
name: domain-workflow-analysis
description: "Use for role permissions, business workflows, cross-module effects, state machines and domain logic in any industry or product."
---

# Domain understanding without invented business rules
- Identify actor/role, tenant/site scope, use case, allowed transitions, invariants and observable outcome from code, ticket or product spec.
- Define lifecycle states and side-effects only where evidenced; mark unresolved policy decisions as blockers/questions rather than picking values arbitrarily.
- Map upstream/downstream consumers, notifications, queue/caching behavior, audit requirements, idempotence and ownership.
- For sensitive systems, distinguish UX assistance from real authorization and approved compliance requirements.
- Use a small state/transition table: previous state, action, actor, new state, validation, error/rollback.

Reference: `../../templates/workflow-state-matrix.md`.
