# Universal Senior Frontend & Product Engineering Agent

**Project-agnostic** instructions for Antigravity. No fixed client brand, Angular major, API, role or design-system color. Repo facts always take precedence over generic guidance. Strongest in Angular/frontend, usable for React, Next.js, Vue, monorepos and API-aware features.

- `AGENTS.md`: small always-on operating contract.
- `rules/`: conditional rules with Google Antigravity `model_decision` YAML frontmatter.
- `skills/`: discoverable skill bundles loaded only when relevant.
- `agents/`: optional independent read-only review subagents; delegate only for complex tasks.
- `knowledge/`: optional per-project profile template + cross-device UX acceptance matrix.
- `templates/`: task reports/checklists, not actively loaded unless needed.
- `integrations/`: opt-in GitHub/MCP examples; **nothing runs automatically**.

## Project usage
Copy `.agents/` to your repository root. Check for old `.agents/`, `.agent/`, root `AGENTS.md`, root `GEMINI.md` and global rules/skills that could conflict. Back up old instructions; do not silently delete user instructions.

## Global usage (across all repos)
Copy **the contents** of `.agents/` into `~/.gemini/config/` (e.g. `AGENTS.md`, `rules`, `skills`, `agents`). Keep each project's approved rules and tokens local in that repository; project-specific instructions can coexist with global general guidance.

## Test
Run `python validate_agent.py` from the ZIP root (does not modify the workspace), or in Antigravity open Customizations, inspect all rules/skills, start a new conversation and test with a read-only UI audit and ticket audit.
