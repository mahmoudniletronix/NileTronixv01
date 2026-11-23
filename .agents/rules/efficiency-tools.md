---
trigger: model_decision
description: "Use for selecting skills, repository search scope, MCP, GitHub tools, extra installations or subagents."
---

# Tool economy and safety
- Start with filenames and targeted search; stop expanding scope when sufficient evidence exists.
- Skills on demand; initial skill metadata is sufficient to decide. Do not read all references and scripts proactively.
- MCP tools like Playwright/Context7 are optional and opt-in; don't silently install, configure credentials or execute remote packages.
- Prefer existing npm scripts, lockfile and local tools to fetching new dependencies; verify third-party trust and compatibility.
- Delegate to review subagents only for genuinely complex or independent audits; keep findings concise with file evidence.
