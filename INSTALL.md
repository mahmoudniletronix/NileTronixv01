# Installation — Windows, macOS, Linux

## Option A — For EVERY project (recommended for a reusable personal agent)
Global Antigravity App/CLI/IDE location: `~/.gemini/config/` (Windows: `%USERPROFILE%\.gemini\config\`).
1. Extract the ZIP to any temporary folder.
2. Run `python install_agent.py --scope global` for a **dry run** (shows planned writes).
3. Run `python install_agent.py --scope global --apply` to back up existing affected items and merge these named agent files into your global config.
4. Restart agent conversation or use supported reload; inspect Customizations to verify discovery.
5. Add any **project-specific** rules/design tokens to that project's `.agents/` instead of corrupting a global profile.

## Option B — One project only
1. `python install_agent.py --scope workspace --target "C:\path\to\project"` — dry run.
2. For a new repo: `python install_agent.py --scope workspace --target "C:\path\to\project" --apply`.
3. If replacing an existing workspace `.agents`, backup and replace it explicitly: add `--replace-workspace --apply`. (Read the script warnings first.)
4. Do not overwrite unrelated root `AGENTS.md` or `GEMINI.md`; review conflicts manually.

## Important limitations
- **Dry-run is default.** Backups go to an external `agent-backups/` path, not under active `.agents/` discovery.
- Global install merges only named package files and doesn't remove unrelated legacy global skills/rules. Review duplicates in Customizations.
- Installing doesn't automatically connect Jira, Playwright, Context7 or GitHub or ensure they're available to the agent.
- `integrations/*.example.json` are opt-in; do not automatically enable them. Do not commit API keys or credentials.
- Windows: use `py -3 install_agent.py` if `python` command is unavailable.
- Validate package with `python validate_agent.py` (no third-party Python dependencies).

## Optional: enable GitHub-backed MCP tools
After installing the agent, activate one or both examples safely (dry run unless `--apply`):

```sh
python configure_mcp.py --scope workspace --target "/path/to/project" --tool playwright
python configure_mcp.py --scope workspace --target "/path/to/project" --tool playwright --apply
# Or for all projects (privacy/cost impacts may be larger):
python configure_mcp.py --scope global --tool context7 --apply
```

This merges existing MCP entries and creates a config backup when applicable. It does **not** download, launch, authenticate or verify the external servers; enabling Playwright may trigger `npx` download when Antigravity runs it later. Review external dependencies, versions, credentials and terms before enabling.
