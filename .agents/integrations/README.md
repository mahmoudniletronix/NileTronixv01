# Optional tools — off by default
No MCP server is automatically installed or started by this package. `*.example.json` files are **examples, not active configurations**. Copy the desired `mcpServers` entries into Antigravity's `.agents/mcp_config.json` (workspace) or `~/.gemini/config/mcp_config.json` (global), after checking the provider, version, required authentication and privacy implications. **Merge**, don't overwrite existing MCP entries.

- **Playwright MCP** (Microsoft): browser accessibility snapshots and workflows; useful for live responsive and form verification. Requires runtime/browser support. Example uses `@latest`; for predictable/reproducible projects, pin a reviewed version before enabling. Do not automate real customer transactions or submit production forms.
  Source: https://github.com/microsoft/playwright-mcp
- **Context7** (Upstash): current library docs when API/version uncertainty exists. May need API key or login for higher usage; no key is bundled. Uses a remote service; don't send private source or sensitive data.
  Source: https://github.com/upstash/context7 (repository may be under the `mcp` organization; see current official project at https://github.com/mcp/upstash/context7).
- **angular-eslint** (Angular-specific, not MCP): use only when actual Angular version compatible and project lint setup needs it. https://github.com/angular-eslint/angular-eslint
- **Lighthouse CI** (GoogleChrome): opt-in performance/accessibility regression checks, requires compatible Node/runtime. https://github.com/GoogleChrome/lighthouse-ci
- **axe-core** (Deque): accessible automated rule engine (scan does not replace manual a11y testing). https://github.com/dequelabs/axe-core

Do not paste credentials into checked-in config. Do not install remote GitHub skill packs blindly; review licenses and scripts first. MCP is an external tool, not proof of quality.

For opt-in setup without manually editing JSON, run the ZIP-root `configure_mcp.py` command described in `INSTALL.md` (defaults to dry run and merges existing MCP servers with a backup). The two example files are not automatically activated.
