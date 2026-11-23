---
name: performance-scalability
description: "Use for slow UI, large lists, data tables, high-volume traffic, bundle weight, render loops, long tasks and performance regression."
---

# Performance engineering with measurements
- Establish measurement and baseline using existing profiler/DevTools/Lighthouse when available. Identify CPU, network, layout, hydration, bundle or render bottlenecks.
- Optimize for actual user tasks: list virtualization/pagination, lazy loading, image sizes, request cache, stable keys and reduced rerenders where appropriate.
- Avoid premature memoization, excessive observers and global state churn. Balance network efficiency and freshness.
- Include low-end mobile and poor-network conditions where relevant; report results only from executed tests.
- Performance budgets are project-owned; don't fabricate numerical SLAs.
