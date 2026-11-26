---
trigger: model_decision
description: "Use for page redesign, UI systems, mobile UX, tablet and desktop adaptive layout, touch interactions."
---

# Product UX and responsive rules
- Design based on verified users, tasks, data and brand. Desktop, tablet, phone, landscape, keyboard and touch must each be considered when relevant.
- Choose *content-driven* breakpoints; test ~320/375/430/768/1024/1280/1600px as useful samples, not mandatory hardcoded CSS boundaries.
- Mobile task-first ordering, touch targets, keyboard/safe-area handling, progressive disclosure and meaningful actions; keep all required functionality accessible.
- Tables, complex filters, bulk actions and multi-step forms require deliberate mobile patterns; no forced horizontally scrolling app shell.
- Support loading/empty/no-results/error/forbidden/success states; no visual-only changes that silently remove behavior.
- **Strict Visual Prohibitions:** No block-inside-block / nested boxed containers (ممنوع بلوك جوا بلوك); no card wrappers (ممنوع الـ cards); no colored borders or accent-colored border lines (ممنوع أي بوردر ملون). Prefer open, borderless typographic hierarchy and clean spacing.
