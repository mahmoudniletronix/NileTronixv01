---
name: security-permissions
description: "Use for auth, role/tenant permission logic, sensitive data, payment/patient/user details, uploads and destructive actions."
---

# Secure product implementation
- Identify trust boundaries, owner/tenant scope, permission requirements and real server enforcement. Hidden buttons/route guards alone never constitute security.
- Guard token storage/headers/logging and redact credentials and PII/PHI from screenshots and bug reports.
- Be mindful of XSS, unsafe HTML, injection, data URL abuse, file uploads, third-party resources and dependency supply-chain risk.
- Require explicit authorization for destructive or external state changes. Use synthetic/test data for automation; production side effects are not testing.
- Escalate ambiguous permissions or policy instead of inventing them.
