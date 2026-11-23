---
name: debugging-root-cause
description: "Use for frontend/backend bugs, state mismatches, CSS regressions, async races, failed builds and browser runtime errors."
---

# Root-cause debugging loop
1. Reproduce actual failure and capture expected/actual; note environment, route, role, viewport, locale and sequence if relevant.
2. Form 2–4 hypotheses; inspect smallest related code, logs, network/schema and git diff to isolate the failing boundary.
3. Prove the root cause with observable evidence (not just a plausible guess); avoid masking issues with timeouts, reloads, !important or broad `any`.
4. Fix at source; add a targeted regression test where feasible; check adjacent user paths.
5. Report what was reproduced, root cause, changed files, verification and remaining uncertainty.

Use `../../templates/bug-investigation.md`; never paste production secrets or personal data into bug evidence.
