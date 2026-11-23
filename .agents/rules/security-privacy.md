---
trigger: model_decision
description: "Use for authentication, authorization, PII, PHI, payments, tenant isolation, secrets or destructive actions."
---

# Security and privacy invariants
- Don't store or expose credentials, patient/private records, tokens, real customer data in source or testing artifacts.
- Never treat hidden UI controls or route guards as server-side authorization; verify role, ownership and tenant boundaries.
- Audit XSS/injection, insecure HTML, upload processing and unsafe external resources where touched.
- Don't run destructive scripts, schema migrations, production actions or publish changes without specific authorization.
- If data is regulated, follow project policy and jurisdictional requirements evidenced in the repo; do not invent compliance claims.
