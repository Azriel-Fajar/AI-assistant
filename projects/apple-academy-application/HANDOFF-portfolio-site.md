# Handoff Prompt — Update portfolio.rielcode.com

Paste everything below the line into a fresh Claude Code session.

---

Update my portfolio website at portfolio.rielcode.com. It is live and returns HTTP 200, but I do
not remember which directory serves it. Find it first, confirm with me before editing anything.

Likely locations to check:
- `C:\xampp\htdocs\Rielcode-laravel` (main Laravel app, may serve a portfolio subdomain)
- `C:\xampp\htdocs\` (other project folders)
- `c:\Users\afw14\OneDrive\Documents\JARVIS\projects\`

**Why I am updating it:** I am applying to Apple Developer Academy Indonesia. I just rewrote my CV
and portfolio PDF, and the site is now out of date and inconsistent with them. The submission form
takes portfolio links, and I am submitting portfolio.rielcode.com and rielcode.com. A reviewer will
click through, so the site has to agree with the PDF.

**Source of truth for content** (read both before proposing changes):
- `c:\Users\afw14\OneDrive\Documents\JARVIS\projects\apple-academy-application\portfolio-content.md`
- `c:\Users\afw14\OneDrive\Documents\JARVIS\projects\apple-academy-application\CV-content.md`

## Facts that must be consistent across site, CV, and PDF

- 3 years of experience (not "2+")
- GPA 3.91 / 4.00, Computer Science, Satya Wacana Christian University, semester 3
- 31 industry demo websites, live at rielcode.com/demos/
- 45 modular skills in the JARVIS assistant system
- 93 rendered video ad assets
- Two client projects delivered and paid; four company websites shipped in total
- Rielcode Laravel platform: order management, invoicing (IDR + USD), audit logging, admin
  settlement. **No payment gateway yet — do not claim one.**

## Do not put these on the site

- The free website audit tool. `rielcode.com/audit` returns 404 and is not linked from the
  homepage. It is built but not deployed. Only add it back if I redeploy it first.
- Any link to `fti.uksw.edu/fit2026`. The site is down. The FIT Competition work can still be
  listed, just without a hyperlink.
- Any iOS or Swift experience. I have none. "Learning Swift and SwiftUI" is acceptable and is
  what the CV says.

## The five projects the PDF leads with

Match these, in this order, so a reviewer moving from PDF to site sees the same story:

1. Rielcode — building a web studio from zero (entrepreneurial)
2. Rielcode Business Platform — Laravel + Filament operations system
3. JARVIS — personal AI operating system, 45 skills
4. Programmatic video ad pipeline — Remotion + Manim, 93 assets
5. Parallaxnet Canada — company website with admin news system and AI chatbot

## What I want you to do

1. Locate the portfolio site source. Show me the path and the current page structure. Stop there
   and confirm with me before editing.
2. Once confirmed, propose a specific change list before touching files. I want to see the plan,
   not a finished rewrite.
3. Verify every outbound link with an HTTP check before it ships. I have already been bitten by
   two dead links in this application.
4. After changes, run the build/verify pass and show me screenshots at desktop and mobile widths.

## Working constraints

- Do not run `git checkout --` or `git reset --hard` without asking. I lost CSS that way once.
- List files to be staged before any commit.
- Kill any stale process on the target port before starting a dev server.
- Before multi-file edits, enumerate every affected file first and show me the impact map.
