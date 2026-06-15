# Task Spec Capsule Protocol

Use this reference when a user request is ambiguous, strategic, generative, multi-step, or likely to affect the wiki, skills, reports, automations, code, or other durable workspace assets.

## Purpose

The Task Spec Capsule turns a loose request into a compact execution specification before the agent starts producing the final answer or artifact. It is inspired by PRD-style requirement framing, but it stays lighter than a full PRD.

The goal is not to create paperwork. The goal is to expose the constraints that determine whether the task succeeds.

## When To Use

Use the capsule for:

- Writing, reports, presentations, prompts, images, videos, plans, and other generation tasks
- Research, evaluation, strategy, product, skill, workflow, or system-design tasks
- Code or app work where expected behavior, scope, or verification matters
- Wiki ingestion, knowledge promotion, skill updates, recurring workflows, and automation design
- Any request where doing too much is as risky as doing too little

Skip or keep it internal for:

- Simple factual answers
- Mechanical file reads, format conversions, or tiny edits
- Requests where the user explicitly asks for only a short direct answer

## Capsule Fields

For substantial tasks, create this internally before execution. Show a shortened version to the user when confirmation is required or when the task is strategic.

```markdown
## Task Spec Capsule
- Need / problem:
- Real goal:
- Target user / audience:
- Inputs / source material:
- Output artifact:
- Scope P0:
- Scope P1:
- Scope P2:
- Non-goals:
- Constraints:
- Success criteria:
- Evidence / context path:
- Risks:
- Open questions:
- Recommended next action:
```

## Field Guidance

- `Need / problem`: The literal request or pain point.
- `Real goal`: The underlying job to be done.
- `Target user / audience`: Who will use, judge, read, or be affected by the output.
- `Inputs / source material`: Files, links, data, screenshots, wiki pages, existing text, code, or prior decisions.
- `Output artifact`: The concrete deliverable, such as an answer, Markdown page, PRD, prompt, code change, report, deck, chart, script, or automation.
- `Scope P0`: What must be completed in this turn for the task to count as handled.
- `Scope P1`: Useful additions if time/context allows.
- `Scope P2`: Future considerations, follow-up artifacts, or longer-term promotion candidates.
- `Non-goals`: 1-5 things this turn explicitly should not do. Use this to prevent scope creep.
- `Constraints`: Format, style, budget, tools, privacy, time, repo rules, source quality, legal/safety, or platform limits.
- `Success criteria`: Observable checks for whether the output is good enough.
- `Evidence / context path`: Which context source should be used first: conversation, workspace context, wiki, records, local files, web, official docs, tools, or code execution.
- `Risks`: Failure modes such as hallucination, stale facts, over-generation, missing user preference, bad formatting, broken code, unsafe automation, or wiki drift.
- `Open questions`: Separate questions into `must ask`, `can discover`, and `defer`.
- `Recommended next action`: Execute, ask one question, browse, read local context, route to skill, create artifact, verify, or stop.

## P0 / P1 / P2 Scope Rule

Use this priority ladder for complex work:

- `P0`: Required for the current user request. Do this before considering anything else.
- `P1`: Improves usefulness but is not required for the current request.
- `P2`: Worth recording as a future direction, but do not let it consume the current turn unless the user asks.

If the task expands while working, keep the current P0 stable and move new ideas to P1/P2 unless the user explicitly changes the goal.

## Non-Goals Rule

Always consider non-goals when:

- The task could produce multiple artifact types
- The user asks for analysis that could become wiki work, skill work, report work, and automation work at the same time
- There is a risk of modifying durable files too early
- The request involves strategy, product, coding, public output, or high-stakes factual claims

Good non-goals are specific:

- "Do not modify wiki pages yet."
- "Do not create a new skill; only analyze whether one is needed."
- "Do not verify every external claim; only flag claims that require verification."
- "Do not redesign unrelated files."

## Context Path Rule For SPLLM

When the request depends on workspace knowledge, use this order unless a more specific instruction overrides it:

1. Current conversation
2. `WORKSPACE_CONTEXT.md`
3. Target local files or supplied links
4. `wiki/index.md` or `scripts/wiki_search.py`
5. Relevant `wiki/concepts`, `wiki/entities`, and `wiki/sources`
6. `records/facts/facts-ledger.md`
7. `outputs/` for temporary artifacts
8. Relevant skill `SKILL.md`
9. Web or official sources when facts are time-sensitive, external, or high-risk

Do not read all layers mechanically. Stop when the context is sufficient.

## Open Question Routing

Classify missing information before asking the user:

- `must ask`: The answer changes the artifact, risk, permissions, or direction materially.
- `can discover`: Local files, wiki, tools, or web can answer it cheaply.
- `defer`: Useful later but not needed for the P0 deliverable.

Ask at most 1-3 high-leverage questions. Prefer proceeding with stated assumptions when the risk is low.

## Execution Judgment Add-On

When showing execution judgment for generation or strategic tasks, include these concise fields:

```markdown
Task category:
Real goal:
P0 scope:
Non-goals:
Key assumptions:
Main risks:
Recommended output path:
```

For simple tasks, keep the capsule internal and answer directly.

