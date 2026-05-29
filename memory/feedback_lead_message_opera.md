---
name: Lead message WhatsApp links open in Opera
description: When generating a WhatsApp link for a lead, always open it in Opera browser automatically
type: feedback
---

Always open wa.me WhatsApp links in Opera browser using `start opera "..."` in Bash -- not the default browser.

**Why:** User preference, confirmed when they said "always bring it up on Opera" after the default browser was used.

**How to apply:** Any time a WhatsApp link is generated via `/lead-tracker message` or similar, run `start opera "[url]"` instead of `start "[url]"`.
