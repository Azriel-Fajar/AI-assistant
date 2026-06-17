---
name: Rielcode Figma Redesign
description: College project - Figma redesign of Rielcode app using existing design tokens
metadata:
  type: project
---

Azriel is building a Figma design system/redesign for Rielcode as a college project (started 2026-06-03).

Design decisions locked in:

**Color palette (8 tokens, hierarchy by usage):**
- Cream `#f4f1ea` - bg, most used (205px)
- Ink `#1a1a1a` - text/dark surface (165px)
- Forest `#2d4a3a` - primary accent (140px)
- Forest Mid `#4a6b58` - accent hover (100px)
- Cream Elev `#ebe7dc` - elevated surface (70px)
- Forest Pale `#8ba88f` - muted/disabled (50px)
- Cream 50 `#faf8f3` - lightest bg (40px)
- Ink 900 `#0a0a0a` - deepest black (30px)

**Canvas/frame separation:**
- Figma canvas bg: `#ebe7dc` (Cream Elev)
- Frame bg: `#f4f1ea` (Cream) - lighter so frames stand out

**Typography (from tokens.css):**
- Header: `Fraunces` (display serif)
- Subheader: `Fraunces` or `Inter`
- Body/Text: `Inter`

**Why:** College project requires documented design system matching live codebase tokens.
**How to apply:** Reference these decisions when helping with Figma or UI work for this project. Source of truth is `resources/css/tokens.css`.
