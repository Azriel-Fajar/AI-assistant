# Portfolio Content - Azriel Fajar Wicaksono

Submission file: `AzrielFajarWicaksono_Portfolio_Academy.pdf` (A4 landscape, cover + 5 projects)

Per project: bold 2-sentence summary, then Problem / Approach / Impact / Learned.
This satisfies the slide deck ("one- or two-sentence summary") and the template
("comprehensive reasoning ... problem understanding, research skill, effective
problem solving and good logical explanation").

---

## FOOTER (every project page)

Azriel Fajar Wicaksono | Satya Wacana Christian University, Student, Computer Science, Semester 3  
+62 812 9553 6876 | afw1407@gmail.com | rielcode.com  
Portfolio Submission for Apple Developer Academy Indonesia

---

# PROJECT 1 of 5

**Title:** Rielcode — Building a Web Studio From Zero

**Year:** 2024 – 2026 (ongoing)

**Role:** Founder, Developer, Designer — Self-initiated · Individual project

**Link:** rielcode.com

**Description**

> A solo web development studio I founded in October 2024 to learn how software actually reaches people, not just how it compiles. It has grown into a working pipeline of demo sites, client projects, and delivered company websites.

**Problem.** Small Indonesian businesses could not picture what they were buying. A proposal describing "a responsive company website" means nothing to someone who has never commissioned one. Conversations died at that gap.

**Approach.** Stop describing, start showing. I built a library of 31 industry demo websites, one per niche, so a salon owner receives a working salon website instead of a paragraph and a restaurant owner receives a restaurant one. The pitch became something they could click through rather than imagine.

**Impact.** Two client projects delivered and paid, four company websites shipped, over fifty tracked prospects. The impact on me was larger: my closing problem was a communication problem wearing a technical costume.

**Learned.** Build the thing that removes the other person's uncertainty, not the thing that showcases your skill. Those are rarely the same thing. Fifty leads and two closed clients teaches you something only if you refuse to round it up.

**Images needed:** rielcode.com homepage · grid of 6–8 demo site thumbnails · demo site on desktop and mobile

---

# PROJECT 2 of 5

**Title:** Rielcode Business Platform — Laravel Operations System

**Year:** 2025 – 2026

**Role:** Full-Stack Developer — Self-initiated · Individual project

**Link:** rielcode.com

**Description**

> A Laravel and Filament platform that runs my studio's operations: orders, invoicing in two currencies, audit logging, and admin settlement. Live at rielcode.com, with payment gateway integration still ahead.

**Problem.** For a year I ran the business out of spreadsheets and chat history. Invoices in one folder, scope in WhatsApp, payment status in my memory. When I forgot which client had paid a deposit, I understood the business had outgrown my notes.

**Approach.** Laravel with Filament for admin, MySQL underneath. Orders, invoice generation in IDR and USD for local and international clients, and a settlement view. The hard call was audit logging: free editing was faster to build, but a record that can be silently changed is not a record.

**Impact.** Client state lives in one queryable place instead of across four apps. The payment gateway is the next milestone and is not yet built, which I state plainly because a portfolio of only finished things is not an honest picture of how software gets made.

**Learned.** Modeling a real domain is harder than implementing features. I rewrote the order and package relationship three times before it stopped fighting me. Constraints I impose early, like immutable audit trails, are the ones I thank myself for later.

**Images needed:** Filament admin dashboard · order detail with audit log · invoice output in IDR and USD

---

# PROJECT 3 of 5

**Title:** JARVIS — A Personal AI Operating System

**Year:** 2025 – 2026 (ongoing)

**Role:** Architect and Developer — Self-initiated · Individual project

**Link:** Private repository, walkthrough available on request

**Description**

> A personal AI assistant system of 45 modular skills, built to externalize the decision of what to work on next. It sits between software engineering, knowledge management, and self-observation.

**Problem.** I am a full-time student running a business alone. My scarcest resource is not skill, it is deciding what to do next. I would open my laptop with six hours free and spend forty minutes deciding how to spend them.

**Approach.** 45 modular skills on Claude Code. Some I imported and studied; the ones I wrote target my own friction: client proposals from a pricing source of truth, lead tracking, deployment checklists, coursework support. The design problem was memory, since an assistant that forgets your rules each session is a search engine with better manners.

**Impact.** Work that took an evening takes an hour, and work I avoided because starting was expensive now gets started. The unmeasured outcome matters more: the system remembers the standard I set on a good day and holds me to it on a tired one.

**Learned.** Designing a tool that shapes your own behavior is a different discipline from designing one for a stranger. I had to be honest about my actual weaknesses rather than my imagined ones.

**Images needed:** Directory tree of the 45 skills · memory file structure · before and after of an automated workflow

---

# PROJECT 4 of 5

**Title:** Rendering Advertisements With Code

**Year:** 2026

**Role:** Developer and Creative Director — Self-initiated · Individual project

**Link:** Sample renders available on request

**Description**

> A pipeline that renders video advertisements from code instead of editing them by hand, built with Remotion and Manim. It produced 93 finished video assets across four aspect ratios.

**Problem.** I needed ads in four aspect ratios, in several message variants, refreshed constantly because advertising creative decays. Editing those by hand would have consumed every hour I had. Editing them twice would have consumed hours I did not have.

**Approach.** Remotion renders video from React components; Manim handles animated explanatory sequences. Scene timing, typography, and brand color tokens live in one shared theme file, so changing the palette re-renders the whole library. My creative constraint was a three second maximum per scene, drawn from studying which ads held attention.

**Impact.** 93 finished video assets across formats and campaigns, including the referral program. What used to be a bottleneck became a build step.

**Learned.** Version control, refactoring, and shared design tokens are not concepts video production usually borrows from software, and they should be. I also found that concurrent renders collide silently while reporting success, which taught me to distrust any signal I have not verified myself.

**Images needed:** Grid of frames from several ads · one ad in 4 aspect ratios · theme file beside its rendered output

---

# PROJECT 5 of 5

**Title:** Parallaxnet Canada — Company Website and AI Assistant

**Year:** 2025 – 2026

**Role:** Lead Developer — Client project · Individual role

**Link:** Available on request

**Description**

> A company website rebuild for the Canadian entity of an international education network, with an admin-managed news system and an AI chatbot. Delivered and paid in May 2026.

**Problem.** They had a website, but it was a rough basic build that did not represent an organization of their size. Behind one complaint were two problems: the visible one was presentation, the real one was dependency, since every content change required a developer, so the site went stale and stayed stale.

**Approach.** I rebuilt the site with a proper visual identity and responsive layout, then solved the dependency directly. An admin-managed news system lets their team publish without touching code. An AI chatbot trained on company information answers visitor questions at any hour instead of queuing them in an inbox.

**Impact.** The client moved from a placeholder presence to a website their team owns and operates. The news section is updated by staff, not by me, which was the actual goal. Delivered on schedule and closed in May 2026.

**Learned.** Clients describe symptoms, not causes. This one asked for a nicer website and needed independence from their developer. The most valuable feature I shipped was the one that made me unnecessary.

**Images needed:** Homepage before and after · admin panel news editor · chatbot conversation

---

## NOTES

- Each project states self-initiated or client work, as required.
- All five are individual projects, so no GROUP PROJECT label is used.
- Each states impact and what was learned, both explicitly requested.
- Project 2 states the payment gateway is unbuilt. The guidance welcomes work-in-progress.
- Audit tool removed 2026-08-31: rielcode.com/audit returns 404 and is not linked from the homepage.
- FIT Competition URL removed from CV: fti.uksw.edu/fit2026 is down. Work still listed.
- Verified live: rielcode.com, portfolio.rielcode.com, rielcode.com/demos/ (HTTP 200).
- Descriptions average ~195 words. Screenshots still needed for every project.