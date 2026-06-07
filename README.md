# SPLLM

SPLLM (Structured Personal Learning and LLM Management) is an LLM-first
knowledge and workflow operating system.

This repository publishes the reusable architecture and Skill layer only.
Private knowledge, raw material, generated deliverables, runtime output, and
personal configuration are intentionally excluded.

## Core Model

```text
inputs -> structured knowledge -> reusable workflows -> deliverables
 raw       wiki (private)          skills (public)      outputs (private)
```

The system is organized around four layers:

1. **Context layer**: compact operating context and agent instructions.
2. **Knowledge layer**: source, entity, concept, comparison, and product pages.
3. **Workflow layer**: reusable Skills that encode repeatable methods.
4. **Output layer**: reports, presentations, media, and other generated work.

Only the context, specification, and workflow layers are published here.

## Repository Contents

| Path | Published content |
|---|---|
| `ARCHITECTURE.md` | Condensed system architecture and information flow |
| `AGENTS.md` | Agent-facing project rules |
| `CLAUDE.md` | Detailed operating guide |
| `SCHEMA.md` | Knowledge page and metadata specification |
| `WORKSPACE_CONTEXT.md` | Compact warm context |
| `WORKSPACE_STRUCTURE.md` | Workspace ownership and path conventions |
| `skills/` | Reviewed reusable Skills |
| `wiki/`, `raw/`, `outputs/`, etc. | Empty directory skeletons only |

## Privacy Boundary

The GitHub repository does **not** contain:

- Wiki page contents
- Raw source files or books
- Daily-feed materials
- Reports, presentations, PDFs, images, or generated outputs
- Agent-local state, authentication files, cookies, or environment files
- API keys, access tokens, passwords, or personal contact details

See [SECURITY.md](SECURITY.md) for the publication policy.

## Skills

Each Skill is a self-contained workflow under `skills/<skill-name>/`, normally
with a `SKILL.md` entrypoint and optional `references/`, `scripts/`, `assets/`,
or `templates/`.

Skills may describe environment-variable names or credential setup, but real
credential values must never be committed.

## Local Workspace

The complete local workspace can populate the empty private directories:

```text
book/ daily-feed/ outputs/ raw/ records/ reports/ scripts/ wiki/
```

Those directories are represented in Git only by `.gitkeep` files.

