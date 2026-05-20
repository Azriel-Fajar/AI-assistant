---
name: Projects Layout Grid
description: The rc-prj__side grid is designed for exactly 2 tiles, not 3 -- having 3 breaks the equal-height layout
type: feedback
---

The `.rc-prj__side` CSS uses `grid-template-rows: 1fr 1fr` -- exactly 2 rows. Adding a 3rd tile creates an implicit 3rd row that breaks the equal-height asymmetric layout.

**Why:** User corrected this after session where DAAM was added as a 3rd tile alongside Parallaxnet ID and Parallaxnet Canada, which broke the layout.

**How to apply:** The projects section always has 1 featured card (left) + exactly 2 tiles (right). When adding new projects, replace or archive an existing tile rather than adding a 3rd one.
