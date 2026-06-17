---
name: feedback_demo_url_base
description: "Correct public demo URL base is rielcode.com/demos/{niche}/ not demo.rielcode.com"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3241b206-e5f4-4b70-a7f8-b8362c3ef4fe
---

Public demo sites live at `rielcode.com/demos/{niche}/` (with trailing slash). NOT `demo.rielcode.com/{niche}`.

**Why:** Azriel corrected me twice for sending `demo.rielcode.com/...`. That subdomain is wrong.

**How to apply:** When sending a demo link in any follow-up/WA message, use `rielcode.com/demos/{niche}/`. Niches: company, beauty-salon, dental-clinic, gym-fitness, logistics, real-estate, restaurant-cafe, tour-travel. Keep trailing slash (relative CSS/JS 404s without it, see [[feedback_static_trailing_slash]]). Related: [[project_demo_sites]].
