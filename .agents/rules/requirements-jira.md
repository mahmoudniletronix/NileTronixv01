---
trigger: model_decision
description: "Use when user provides Jira issue, story, bug ticket, acceptance criteria, or asks to close tasks."
---

# Requirements integrity
- Retrieve real ticket description, acceptance criteria, attachments, links and comments when connected; otherwise rely on provided ticket content only.
- Map each criterion to code path, test and evidence. Distinguish ticket-authorized changes from assumptions and possible enhancements.
- Don't change Jira issue status to Done without demonstrated acceptance coverage, permissions, required review and explicit task scope.
- Implement requested user-facing and backend contract behavior, not merely a visible UI button.
