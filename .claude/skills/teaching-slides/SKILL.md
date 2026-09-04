---
name: teaching-slides
description: Use when Azriel needs a slide-deck prompt for his lecturer-assistant (asdos) teaching sessions in DDP, PTI, or Matematika Diskrit. Takes lecturer material (PDF/doc/paste) or just a topic, and outputs one copyable prompt to paste into Claude Design.
---

## What This Skill Does

Turns lecturer material (or a bare topic) into a single copy-paste prompt for Claude Design that builds a teaching slide deck.

**Output rule:** the prompt is printed in chat inside one fenced code block. Never write it to a file, never build the slides here. Azriel pastes it into Claude Design himself.

## Scope

Courses supported: **DDP** (Dasar-Dasar Pemrograman, bahasa C), **PTI** (Pengantar Teknologi Informasi), **Matdis** (Matematika Diskrit). Anything else, ask before proceeding.

## Steps

### 1. Detect input

- **Material attached or pasted** (PDF, doc, screenshot, text): read it fully. Extract topic, Sub-CPMK, learning objectives, every code sample verbatim, tables, exercises, and any assignment spec. Do not paraphrase code, copy it character-for-character including the deliberate bugs in latihan code.
- **Topic only**: build the outline from the topic plus normal course sequence. Say plainly that no material was given and the outline is your construction.

### 2. Ask (one message, only what is still unknown)

1. Which course? (DDP / PTI / Matdis) -- skip if obvious from material.
2. Language of the deck? (Indonesian with English technical terms / full English / other) -- **always ask, no default.**
3. Anything to add beyond the material? (Azriel often adds a subtopic, e.g. type conversion added to DDP struktur C.)
4. Include an assignment slide? Only ask if the material has no assignment. If the material has one, include it automatically.

Do not ask about slide count or design. Those are fixed below.

### 3. Fixed rules baked into every generated prompt

- **Max 20 slides. Fewer is better.** Be efficient, one idea per slide, max 5 bullets per slide, minimal text.
- **Design:** follow the existing design system in Claude Design. Do not invent a new theme. Only ask for monospace on code.
- **Code:** always in a code block with syntax highlighting, copied exactly from source material.
- **Tone:** asisten dosen talking to first-year students. Casual, clear, analogy-heavy. Not a lecture.
- **Credits slide:** last slide, names + NIM of Azriel and the co-assistant(s) for that course (table below).

### 4. Per-course rules

**DDP**
- Always include a "Latihan baca kode" slide before the assignment: show code with deliberate errors, ask students whether it runs and why, then a follow-up question. Hint at the number of problems without listing the fix.
- Terminal / program output is rendered as a **Command Prompt window**: dark box, white monospace text, title bar reading "Command Prompt", first line `C:\Users\azriel>`, last line `Press any key to continue . . .`.
- Assignment file naming convention: `NIM_TugasN.c`.

**PTI**
- Light interaction only: one discussion or quick-quiz slide, not a code drill.
- No terminal rendering unless the material has one.

**Matdis**
- Interaction is a logic exercise: a proof step, truth table, or set/relation problem to work through on the slide.
- Render notation properly (logical operators, set notation, quantifiers). No terminal windows.

### 5. Assistant credits

| Course | Names + NIM |
|---|---|
| DDP | Azriel Fajar Wicaksono (672025121), Cynthia Elena Gunadi (672025001) |
| PTI | Azriel Fajar Wicaksono (672025121) |
| Matdis | Azriel Fajar Wicaksono (672025121), Augusta Nayra Naftali (672025055), Inayatul Safitri (672025087) |

PTI co-assistant is still TBD. If Azriel names one, ask for the NIM and update this table.

### 6. Generated prompt shape

Write the prompt in the deck's chosen language. Structure:

1. One opening paragraph: course, topic, audience, language rule, tone.
2. Constraint line: max 20 slides, efficient, one idea per slide, max 5 bullets, code in highlighted blocks.
3. Numbered slide-by-slide spec. Each slide gets a title plus what goes on it. Inline every code sample and table in full, so Claude Design never has to guess.
4. Interaction slide (per-course rule above).
5. Assignment slide if applicable, with the full task spec and the Command Prompt output block for DDP.
6. Credits slide with names + NIM.
7. Closing line: follow the existing design system, do not create a new theme; monospace for code.

Output it as one fenced block, nothing else after it except a one-line note if something needs Azriel's attention.

## Hard Rules

- Never write the prompt to a file. Chat only.
- Never generate the slides yourself.
- Never invent code output. If unsure what a program prints, say so instead of guessing.
- Copy buggy example code exactly as written, bugs intact. They are the exercise.
- Never assume the deck language. Ask.
