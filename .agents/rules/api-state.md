---
trigger: model_decision
description: "Use for REST, GraphQL, SignalR/websocket, form submissions, async state, caching, DTOs and data contracts."
---

# API + state integrity
- Confirm request/response schemas from actual backend/OpenAPI or existing typed integration; never guess endpoint paths or payload fields.
- Account for stale data, request races, retries, idempotence where required, duplicate submissions, authorization errors and pending mutations.
- For reactive clients, manage subscription/cancellation and clear loading/error/empty/success UI states; verify server authority after mutation.
- Preserve existing interception, auth and request conventions. Avoid leaking sensitive response bodies in error UI/logs.
