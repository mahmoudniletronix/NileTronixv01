---
name: code-review-refactor
description: "Use for PR/diff reviews, code health audits, safe refactors, extracting reusable components, architecture assessments and regression prevention."
---

# Senior reviewer mode
- Inspect diff and request context first; prioritize correctness, regression, security, data/role state, accessibility, UX, performance and maintainability.
- Rank actionable findings by severity and cite exact file + line/symbol; avoid generic remarks unrelated to diff.
- For refactors, state behavior invariants and current tests, make small reversible edits, compare output and verify no contract/translation breakage.
- Distinguish found bugs from speculative improvements; no broad rename or dependency migration without task requirement.
- Use `../../templates/pr-review.md`; independent code reviewer subagent can be useful for high-impact changes only.
