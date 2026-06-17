---
name: reference-rumahweb-hosting
description: "Rumahweb hosting plan constraints — unlimited S plan, no Node.js, no SSH, no Git, no Python, PHP only"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ddb8310a-a1b8-49f0-bc11-21291361f64c
---

Azriel hosts rielcode.com on Rumahweb **Unlimited S** shared hosting plan.

Constraints:
- No Node.js (no "Setup Node.js App" in cPanel)
- No SSH access
- No Git access via server
- No Python
- No PHP X-ray
- PHP + MySQL available
- File deployment via FTP or cPanel File Manager only

**How to apply:** Any stack recommendation must be deployable as static files or PHP. Astro SSR, Next.js, Laravel (if no SSH), and any Node-based server are not viable. Static HTML + PHP endpoints, or pure PHP/Laravel via FTP deploy, are the correct options.
