---
trigger: model_decision
description: "Use for Arabic/English i18n, RTL/LTR, forms, keyboard navigation, screen reader, responsive controls."
---

# Accessibility and localization
- Prefer semantic markup, form labels and error associations, visible focus and usable keyboard access.
- Use logical CSS properties, test mirrored directional icons and overlay placement; do not simply toggle `dir` and assume correctness.
- Check dates, times, currencies, phone numbers, mixed-script strings and long translations; don't hardcode display phrases outside existing i18n pattern.
- Respect reduced motion, zoom and contrast; automated scanners are a supplement to keyboard/reader tests.
