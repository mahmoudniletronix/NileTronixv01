---
name: jira-feature-delivery
description: "Use for executing or auditing Jira or issue-tracker tickets, acceptance criteria, subtasks, implementation planning and safe status updates."
---

# Ticket to verified feature
## Workflow
1. Retrieve original issue fields, linked tickets, attachments, comments and acceptance criteria via available connected source. No access? Request ticket text or work only from pasted content, and label gaps.
2. Convert criteria to evidence matrix using `../../templates/jira-acceptance-matrix.md`; identify role, workflow, state machine, permissions, backend/frontend ownership and dependencies.
3. Inspect actual code and contract selectively, plan smallest coherent changes, flag true blockers before irreversible choices.
4. Implement complete functional path: business logic, UI where needed, API, loading/validation/permissions, errors and edge cases. Never stop at a button-only feature.
5. Test criterion-by-criterion, reproduce important edge cases, capture evidence and regression risks.
6. If asked to update Jira, leave concise comment referencing actual code/tests. Transition to Done *only* when verified, ticket workflow allows it, and user has requested completion. Otherwise report blockers transparently.

Never hallucinate ticket content, backend endpoints or success state.
