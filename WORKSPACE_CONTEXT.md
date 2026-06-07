---
title: SPLLM Workspace Context
created: 2026-06-04
updated: 2026-06-04
type: context
status: active
---

# SPLLM Workspace Context

This file is the compact warm context for `E:\SPLLM`. Use it before loading longer manuals.

## Mission

Build `E:\SPLLM` into a durable knowledge and project operating system for LLM agents. The workspace should turn scattered materials into structured knowledge, reusable workflows, products, reports, presentations, and repeatable skills.

## Operating Order

1. Understand the user's real task and classify it.
2. Use existing workspace context before creating new structures.
3. For wiki work, search first, then read targeted pages, then edit.
4. Keep raw materials read-only.
5. Keep generated runtime output out of `wiki/` until it is worth promoting.
6. After substantial work, record what changed and whether it should become a page, script, skill, memory, or nothing.
7. At the end of each non-mechanical task, always run the `thinking-extend` default closing check unless the user explicitly disables it.
8. At the end of each meaningful task, actively maintain the Context OS layers instead of treating the task as isolated.

## Canonical Paths

| Path | Role |
|---|---|
| `wiki/` | Long-lived Obsidian-compatible knowledge base |
| `wiki/sources/` | Structured source summaries |
| `wiki/concepts/` | Abstract concepts, methods, trends, theories |
| `wiki/entities/` | Companies, products, people, brands, institutions |
| `wiki/products/` | Reports, product concepts, long-form outputs |
| `raw/` | Original source material, read-only |
| `daily-feed/` | Incoming material queue |
| `skills/` | Project skills, normally read-only |
| `.aweskill/` | Central skill store and projections |
| `scripts/` | Reusable helper scripts |
| `outputs/` | Runtime artifacts; promote selectively |
| `reports/` | Architecture, audit, and maintenance reports |
| `records/facts/facts-ledger.md` | Source-backed atomic workspace facts |
| `records/templates/promotion-decision.md` | Decide where lessons and repeated work should be promoted |
| `reports/context-os-expansion-inventory.md` | Inventory of external tools, plugins, and context ports |

## Wiki Rules

- Every wiki page should have frontmatter.
- Use wikilinks for internal knowledge links.
- Source filenames use `行业维度-来源标题.md`.
- Do not use `YYYY-MM-DD-` prefixes for new source filenames.
- Put dates in frontmatter or source metadata.
- Do not recreate `wiki/source/`; use `wiki/sources/`.
- Update `wiki/index.md` and `wiki/log.md` after meaningful wiki changes.

## Retrieval

Use `scripts/wiki_search.py` for first-pass wiki retrieval:

```powershell
python scripts/wiki_search.py "AI Agent" --limit 5
python scripts/wiki_search.py "品牌叙事" --kind sources --limit 5 --json
```

Use direct file reads only after search narrows the target pages.

For prior session recall, use:

```powershell
python scripts/codex_session_search.py "hotspot-radar" --limit 5
```

For long or interrupted tasks, write a compact handoff using `records/templates/session-handoff.md`.

For reusable atomic workspace facts, check or update `records/facts/facts-ledger.md` instead of burying them in long prose.

For architecture maintenance, run:

```powershell
python scripts/context_os_health_check.py
```

When deciding whether a lesson becomes context, wiki, script, skill, or automation, use `records/templates/promotion-decision.md`.

## Context OS Maintenance Loop

At task completion, run this lightweight closing loop:

1. Run the `thinking-extend` default closing check for every completed non-mechanical task: task recap, wiki association, weak cross-domain link, and one follow-up question unless a skip condition applies.
2. Decide whether the result needs no promotion, a handoff, a fact, workspace context, wiki page, script, skill, automation, or expansion inventory entry.
3. If the promotion choice affects durable behavior, ask the user for confirmation before changing major rules, skills, or automations.
4. If the choice is low-risk and clearly supported, update the relevant layer directly and report it.
5. If the task was long, interrupted, or likely to continue, create or update a handoff note from `records/templates/session-handoff.md`.
6. If the task changes workspace architecture, update `reports/context-os-roadmap.md`, `records/facts/facts-ledger.md`, and run `scripts/context_os_health_check.py`.
7. Do not force the promotion template for tiny one-off tasks; mention that no durable promotion was needed.

## Skill Routing

- Deep company/product/concept/person research: `hv-analysis`.
- Writing, oral scripts, public-account long-form: `oral-copy` or `khazix-writer`.
- Meeting or transcript summaries: `meeting-summarizer`.
- Claim checking: `claim-analyzer`.
- Quick comparisons: `quick-compare`.
- Webpage to clean markdown: `webpage-to-markdown`.
- Hotspot/news collection: `hotspot-radar`.
- End-of-session cleanup and doc sync: `neat-freak`.
- Post-task wiki reflection: `thinking-extend`.

## Current Context OS Priorities

1. Stabilize project rules and remove drift.
2. Improve wiki retrieval beyond `index.md`.
3. Build compact always-on context.
4. Define session recall and handoff summaries.
5. Keep source-backed facts in `records/facts/facts-ledger.md`.
6. Turn repeated checks into scheduled or scripted loops.
7. Keep external tool surfaces documented in `reports/context-os-expansion-inventory.md`.

## Boundaries

- Do not overwrite user changes.
- Do not modify `raw/` original materials.
- Do not modify skills unless the task explicitly asks for skill creation or updates.
- Do not add new durable rules to `SOUL.md` without checking whether they belong in `WORKSPACE_CONTEXT.md`, `wiki/`, `scripts/`, or a skill instead.
