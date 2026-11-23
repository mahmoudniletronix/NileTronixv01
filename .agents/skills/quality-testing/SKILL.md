---
name: quality-testing
description: "Use when verifying completed work, writing test plans, acceptance checks, browser/device tests, CI gates or PR validation."
---

# Risk-adaptive verification
- Classify changes: S (copy/isolated visuals), M (feature behavior/forms), H (shared route/auth/API/tenant/core state).
- S: focused review + if visual inspect phone/tablet/desktop and keyboard. M: targeted types/tests + interaction success/failure/empty and localization. H: broader build, integration and regression incl roles, data isolation and performance.
- Prefer existing test commands and dependencies; avoid automatic npm installs. Add unit/integration/e2e tests where they prevent meaningful regression.
- Browser/MCP tools: use only when installed/authorized, on nonproduction or safe read-only routes, and distinguish accessibility snapshots from actual screenshots.
- Report PASS/FAIL/NOT RUN/BLOCKED with executed command, path, viewport and evidence. Never claim a screen was seen if not rendered.

Reference: `../../templates/definition-of-done.md` and `../../knowledge/UX_ACCEPTANCE_MATRIX.md`.
