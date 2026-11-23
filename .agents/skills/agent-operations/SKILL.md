---
name: agent-operations
description: "Use for selecting skills, using MCP or custom subagents, controlling context/token cost, and configuring the universal agent."
---

# Agent orchestration and token economy
- Classify intent: audit-only, design, implementation, debug, Jira, API, review or release. Load only most relevant 1–2 skills; expand when the task truly crosses domains.
- Start with narrow search; search more only for proven dependencies. Reuse previously seen file evidence; don't rerun builds or screenshots for unchanged code.
- Before GitHub/plugin install, verify vendor/trust, license, maintenance, runtime requirements and privacy; use opt-in integration profiles under `../../integrations/`.
- For ambiguous business constraints that materially block correctness, surface them. Otherwise use conservative implementation consistent with project evidence.
- Delegate read-only independent audits to `agents/*` only when justified; avoid parallel agents for trivial edits.
- Keep outcomes explicit: implemented vs suggested; tested vs not tested; authorized vs pending.
