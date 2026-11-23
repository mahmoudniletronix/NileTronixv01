---
name: api-contract-integration
description: "Use when integrating REST/GraphQL, WebSockets/SignalR, DTOs, typed responses, authentication, real-time state and request failures."
---

# Contract-first integration
- Establish contract from backend source, OpenAPI/schema and real service behavior. Compare existing frontend service methods and request/response shapes before edits.
- Build typed models mapping only verified fields; handle optionality, pagination, error envelope and server validation accurately.
- Use existing auth headers/interceptors/session approach; avoid token logging. Client visibility is not backend security.
- Consider pending state, duplicate submission, request cancellation, race/stale data, concurrency, retries/backoff where justified and authoritative data after mutations.
- Real-time transports: reconnect only with consistent state, deduplicate events, resynchronize snapshots and clean up subscriptions.
- Verify actual HTTP status/errors from a safe environment; if no backend access, distinguish static contract review from live integration testing.

Template: `../../templates/api-contract-matrix.md`.
