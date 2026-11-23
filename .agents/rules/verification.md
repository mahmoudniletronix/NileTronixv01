---
trigger: model_decision
description: "Use when verifying a change, selecting tests, reviewing PRs, checking visuals, or claiming completion."
---

# Risk-based quality gates
- Styling change: validate touched component visually/keyboard and representative phone/tablet/desktop if tools permit.
- Business logic change: focused typecheck/tests for success, failure, boundaries and async behavior.
- Shared auth/permission/routes/API contract change: broader integration/build/regression checks when supported.
- Do not mandate a full production build or screenshots for every small text edit; don't bypass necessary safety tests to save tokens.
- Report executed commands and actual results; distinguish not run, blocked and passed.
