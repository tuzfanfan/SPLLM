---
title: SPLLM workspace structure
created: 2026-05-26
updated: 2026-05-26
type: guide
status: active
---

# SPLLM Workspace Structure

This workspace has three different kinds of material. Keep them visually and operationally separate so future maintenance stays calm.

## Canonical Knowledge Assets

These are the long-lived parts of the project.

| Path | Role | Rule |
|---|---|---|
| `wiki/` | Obsidian-compatible knowledge base | Main knowledge pages live here. Use `wiki/sources/`, not `wiki/source/`. |
| `raw/` | Original source material | Read-only. Do not rewrite or normalize original files. |
| `daily-feed/` | New incoming material | Use as an ingest queue before promotion into `wiki/sources/`. |
| `book/` | Book material and book-derived inputs | Keep book ingestion inputs here. |
| `WORKSPACE_CONTEXT.md` | Compact warm context | Read before longer manuals when a task needs workspace rules. |
| `skills/` | Project skills | Treat as read-only unless explicitly asked to create or update a skill. |
| `.aweskill/` | Aweskill central store | Tracked project skill store. Do not duplicate project skills here by hand. |
| `agent-skills/` | External agent skill bundles | Tracked vendor/tooling bundle. Do not mix with project-authored `skills/`. |

## Runtime And Local State

These should not become knowledge assets just because they are in the root.

| Path | Role | Rule |
|---|---|---|
| `outputs/` | Generated run outputs | Runtime artifact; ignored by Git. Promote only selected final work into `wiki/`. |
| `.tmp_fabric_patterns/` | Temporary pattern/cache data | Runtime cache; ignored by Git. |
| `.uploads/` | Local upload staging | Runtime cache; ignored by Git. |
| `.codex/`, `.claudian/`, `.claude/`, `.workbuddy/` | Agent-local state | Keep out of wiki workflows unless a task explicitly targets agent configuration. |
| `node_modules/` | Local package install | Rebuild from `package-lock.json`; ignored by Git. |

## Tracked Support Areas

These are support assets, not primary wiki content.

| Path | Role | Rule |
|---|---|---|
| `records/` | Workflow records and templates | Tracked because it contains reusable process state and templates. |
| `reports/` | Audit and maintenance reports | Tracked when reports document repo health or knowledge-base maintenance. |
| `scripts/` | Project helper scripts | Keep reusable automation here, not in the root. |

## Wiki Naming Rules

Source pages use a dimension-first filename:

```text
行业维度-标题.md
```

Do not put dates in source filenames. Keep dates in frontmatter (`created`, `updated`) or in the source metadata table. If the dimension is uncertain, use `综合研究` as a temporary dimension and refine it later.

Large binary deliverables such as `.pptx` and `.pdf` should live under `wiki/assets/deliverables/`; `wiki/presentations/` should contain presentation source files such as Markdown.

## Anti-Drift Rules

- Prefer `WORKSPACE_CONTEXT.md` for compact durable operating rules; use `SOUL.md` for identity and collaboration stance.
- Do not recreate `wiki/source/`; use `wiki/sources/`.
- Do not create new source files with `YYYY-MM-DD-` prefixes; use `行业维度-标题.md`.
- Do not leave generated Markdown or zero-byte title stubs in the workspace root.
- Do not put temporary exports in `wiki/`; put them in `outputs/` first, then promote only finished assets.
- If a task creates repeatable logic, prefer `scripts/` or an approved skill workflow over one-off root files.
- Before moving tracked directories such as `.aweskill/`, `agent-skills/`, or `records/`, check Git status and document the migration plan first.
