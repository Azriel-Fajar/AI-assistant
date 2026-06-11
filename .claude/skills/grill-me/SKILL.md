---
name: grill-me
description: Use when Azriel wants a plan, design, or decision stress-tested before committing. Triggers on "grill me", "stress-test this plan", "poke holes in this", "challenge my thinking". Interviews relentlessly until shared understanding, then saves what was learned.
argument-hint: [plan, idea, or topic to grill]
---

## What This Skill Does

Interviews Azriel relentlessly about a plan or design until every branch of the decision tree is resolved. Then records the resolved decisions and any durable facts learned about Azriel, so future sessions start smarter.

Adapted from mattpocock/skills grill-me. Original: ask everything, one at a time. This version: ask only what cannot be answered any other way, and persist what you learn.

## Step 0: Identify the Target

The thing being grilled is `$ARGUMENTS`, or if empty, the plan/idea from the current conversation. If neither exists, ask Azriel what to grill and stop until answered.

## Step 1: Answer Questions Yourself First

Before asking Azriel anything, resolve every question you can from:

1. The current conversation.
2. Context files (`context/*.md`), `memory/MEMORY.md` and linked memories, `decisions/log.md`, relevant `projects/*/README.md`.
3. The codebase, if the plan touches code. Explore it instead of asking.

A question already answered by these sources is a wasted question. Asking it breaks the skill's contract.

## Step 2: Grill

Walk down each branch of the design tree, resolving dependencies between decisions one by one. Order questions so earlier answers prune later branches.

Rules:

- One question at a time, via the AskUserQuestion tool.
- Always provide your recommended answer as the FIRST option, labeled "(Recommended)", with a one-line reason. Azriel taps instead of types.
- Other options = the real alternatives, each with its tradeoff in the description.
- Question priority: (1) decisions that invalidate the whole plan if wrong, (2) decisions other decisions depend on, (3) scope and cost, (4) details.
- Budget: 10 questions max per session. At 10, summarize remaining open branches and ask whether to continue.
- Frame against Azriel's reality: solo operator, college + Rielcode time split, IDR budgets, Rumahweb-style cheap hosting constraints. Flag when a plan assumes time, money, or infrastructure he does not have.
- Push back when an answer conflicts with stated priorities or past decisions. Cite the conflicting source.

Stop grilling when: no unresolved branch can change the plan's outcome, or Azriel says stop.

## Step 3: Record What Was Learned

After the grill, do all three:

1. **Shared-understanding summary** in chat:

```
## Grill Result: [topic]

**Verdict:** [proceed / proceed with changes / rethink]

**Resolved decisions:**
- [decision]: [chosen answer] ([why])

**Changes to the plan:**
- [change]

**Open risks accepted:**
- [risk]
```

2. **Decision log.** Append each material decision to `decisions/log.md` in the existing format: `[YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: grill-me session on [topic]`.

3. **Memory.** For each durable fact learned about Azriel (a preference, constraint, working style, or recurring pattern that future sessions should know), save a memory file per the memory protocol and index it in MEMORY.md. Session-only details do not qualify. Zero new facts is a valid outcome; do not invent memories.

## Notes

- This skill produces no code and changes no plan files itself. It resolves understanding; implementation is a separate request.
- Do not soften questions to be agreeable. The value is in finding the weak branch before money or time is spent.
- If grilling reveals the plan duplicates something that already exists (check memory: portfolio site, audit tool, testimonials system), say so immediately instead of continuing the interview.
- No emojis, no em dashes, short sentences, per communication style rules.
