# Claude Code Mastery (Opus 4.8)

Last updated: 2026-05-30
Purpose: Make Azriel's daily Claude Code use faster and sharper. Distilled Opus 4.8 prompting + agentic best practices, with copy-paste snippets.
Sources: Anthropic Opus 4.8 prompting best practices (pasted 2026-05-30); anthropic.com/news/claude-opus-4-8; platform.claude.com docs.

This is the single source of truth for the `/claude-coach` skill. Grow this file, the skill stays thin.

---

## 1. Effort and thinking (the biggest lever)

Opus 4.8 respects effort strictly. If reasoning is shallow on a hard task, raise effort instead of adding prompt words.

| Effort | Use for |
|--------|---------|
| `max` | Hardest intelligence-demanding tasks. May overthink. Test before defaulting. |
| `xhigh` | Best default for coding and agentic work. |
| `high` | Minimum for any intelligence-sensitive task. |
| `medium` | Cost-sensitive, accept lower intelligence. |
| `low` | Short scoped tasks, latency-sensitive. Risk of under-thinking on complex work. |

In Claude Code the levers are `/effort` and `/model` (Azriel already uses these). Set them before a heavy task, not mid-stream.

Thinking is off on Opus 4.8 unless adaptive thinking is enabled. For coding/agentic, `xhigh` or `high` effort already drives deep reasoning. If running `low`/`medium` on a complex task and seeing under-thinking, raise effort first.

```text
This task involves multi-step reasoning. Think carefully through the problem before responding.
```

## 2. Verbosity and literal instruction following

Opus 4.8 calibrates length to task complexity (short on lookups, long on open analysis) and follows instructions literally. Two consequences:

- It will not silently generalize an instruction. State scope explicitly: "Apply this to every section, not just the first."
- If output is too long, ask for concision directly:

```text
Provide concise, focused responses. Skip non-essential context, and keep examples minimal.
```

## 3. Core prompt rules

- **Be clear and direct.** Treat Claude as a brilliant new hire with no context. Golden rule: if a colleague would be confused by your prompt, so will Claude.
- **Want "above and beyond"? Ask for it.** Vague: "Create a dashboard." Strong: "Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics."
- **Add motivation.** Explaining *why* generalizes better than a flat rule. Not "NEVER use ellipses" but "this is read aloud by TTS, so never use ellipses."
- **Use 3-5 examples.** Diverse, relevant, wrapped in `<example>` tags (multiple in `<examples>`). Most reliable way to steer format/tone.
- **Structure with XML tags.** `<instructions>`, `<context>`, `<input>` reduce misinterpretation.
- **Give a role.** Even one sentence in the system prompt focuses tone and behavior.

## 4. Long context (20k+ tokens)

- Put long documents/data at the TOP, query and instructions at the BOTTOM. Up to ~30% quality gain on multi-doc inputs.
- Wrap each doc in `<document>` with `<source>` and `<document_content>`.
- Ground answers in quotes: ask Claude to extract relevant quotes first, then answer based on them.

## 5. Make it act, not just suggest

"Can you suggest changes" → Claude suggests. "Make these edits" → Claude acts. Be explicit when you want action.

```text
<default_to_action>
By default, implement changes rather than only suggesting them. If the user's intent is unclear, infer the most useful likely action and proceed, using tools to discover any missing details instead of guessing. Try to infer the user's intent about whether a tool call (e.g., file edit or read) is intended or not, and act accordingly.
</default_to_action>
```

When you want it to hold back and research first:

```text
<do_not_act_before_instructions>
Do not jump into implementation or change files unless clearly instructed to make changes. When the user's intent is ambiguous, default to providing information, doing research, and providing recommendations rather than taking action. Only proceed with edits when the user explicitly requests them.
</do_not_act_before_instructions>
```

## 6. Frontend defaults trap (matters for Rielcode client work)

Opus 4.8 has a persistent house style: cream/off-white backgrounds (~#F4F1EA), serif display fonts (Georgia, Fraunces, Playfair), terracotta/amber accents. Great for editorial/hospitality/portfolio. Wrong for dashboards, dev tools, fintech, healthcare.

Generic instructions ("don't use cream", "make it clean") just shift it to a different fixed palette. Two reliable overrides:

1. **Give a concrete spec** — exact hex palette, font character, radius, spacing. Opus 4.8 follows precise specs well.
2. **Ask for options first:**

```text
Before building, propose 4 distinct visual directions tailored to this brief (each as: bg hex / accent hex / typeface - one-line rationale). Ask me to pick one, then implement only that direction.
```

Anti-slop snippet:

```text
<frontend_aesthetics>
NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white or dark backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character. Use unique fonts, cohesive colors and themes, and animations for effects and micro-interactions.
</frontend_aesthetics>
```

## 7. Anti-overengineering (matches the Karpathy rules in CLAUDE.md)

Opus 4.8 can over-engineer: extra files, abstractions, unrequested flexibility. Counter it:

```text
Avoid over-engineering. Only make changes that are directly requested or clearly necessary. Keep solutions simple and focused:
- Scope: Don't add features, refactor, or make "improvements" beyond what was asked.
- Documentation: Don't add docstrings/comments/types to code you didn't change.
- Defensive coding: Don't add error handling for scenarios that can't happen. Only validate at system boundaries.
- Abstractions: Don't create helpers for one-time operations or design for hypothetical future needs. Use the minimum complexity needed for the current task.
```

## 8. Hallucination-free coding

```text
<investigate_before_answering>
Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Investigate and read relevant files BEFORE answering questions about the codebase. Never make claims about code before investigating unless certain.
</investigate_before_answering>
```

Also: tell it not to over-fit to tests. "Implement a solution that works for all valid inputs, not just the test cases. Do not hard-code values. If a test is wrong, tell me rather than working around it."

## 9. Long-horizon and multi-window work

For tasks that span context windows (big builds, migrations):

- Track structured state in `tests.json` (test name + status), freeform progress in `progress.txt`.
- Use git as the checkpoint log. Opus 4.8 reconstructs state well from the filesystem.
- Tell it not to stop early:

```text
Your context window will be automatically compacted as it approaches its limit, so do not stop tasks early due to token budget. As you approach the limit, save progress and state to memory before the window refreshes. Be persistent and complete tasks fully.
```

- Clean up temp files when done:

```text
If you create any temporary files or scripts for iteration, remove them at the end of the task.
```

## 10. Reusable snippet library (copy-paste)

All snippets above, in one place: concision (s2), default-to-action / do-not-act (s5), frontend-aesthetics + propose-4-directions (s6), anti-overengineering (s7), investigate-before-answering (s8), persistence + cleanup (s9). Pull what fits the task.

## 11. How Azriel uses this

- Before a coding/agentic task: set `/effort xhigh` and `/model` Opus 4.8.
- For client sites: never accept the default cream/serif look. Use the propose-4-directions prompt or a concrete spec.
- For a clear one-shot result: specify task, intent, and constraints upfront in the FIRST message. Opus 4.8 is autonomous; underspecified multi-turn prompts waste tokens.
- Drop old "be thorough / always use this tool" prompting from earlier models. Opus 4.8 over-triggers on it.

## How JARVIS uses this

The `/claude-coach` skill reads this file to grade Azriel's prompts, route him to the right skill, and recommend effort levels. When new Claude/Opus guidance appears, update THIS file and bump `Last updated`.
