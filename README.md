# SPLLM

> Structured Personal Learning and LLM Management

SPLLM is a private knowledge workspace and reusable agent-workflow system.
It is designed to turn scattered material into structured knowledge,
reusable Skills, and concrete outputs while keeping private content separate
from publishable architecture.

This GitHub repository is the public core layer of that system. It focuses on
governance, reusable workflows, and workspace structure rather than personal
source material or task outputs.

---

## What This Repo Is

SPLLM is built around one simple separation:

- materials are evidence
- wiki pages are durable knowledge
- skills are executable methods
- outputs stay temporary until deliberately promoted

That separation keeps the workspace usable over time. It also makes it easier
to publish the system logic without exposing private content.

---

## Core Architecture

```text
Layer 4  Governance
         AGENTS.md / CLAUDE.md / SCHEMA.md / ARCHITECTURE.md

Layer 3  Reusable workflows
         skills/<skill>/SKILL.md + references + scripts

Layer 2  Structured knowledge (private)
         wiki/sources -> concepts/entities -> comparisons/products

Layer 1  Inputs and runtime state (private)
         raw / outputs / records in progress / local agent state
```

### Governance layer

The governance layer defines how the workspace should behave:

- task routing and prompt-flow rules
- metadata and naming conventions
- wiki editing and linking rules
- maintenance and health-check expectations
- publication boundaries between local and GitHub

Main files:

- [AGENTS.md](/E:/SPLLM/AGENTS.md)
- [CLAUDE.md](/E:/SPLLM/CLAUDE.md)
- [SCHEMA.md](/E:/SPLLM/SCHEMA.md)
- [ARCHITECTURE.md](/E:/SPLLM/ARCHITECTURE.md)
- [WORKSPACE_STRUCTURE.md](/E:/SPLLM/WORKSPACE_STRUCTURE.md)

### Skill layer

Skills are the reusable operating units of SPLLM. A Skill should own one clear
kind of work so the system avoids overlap and drift.

Current project-facing Skills include:

- `prompt-flow`: front-door task judgment and generation gate
- `thinking-extend`: default post-task reflection layer
- `net-to-markdown`: unified network-content to Markdown pipeline
- `knowledge-extractor`: extract questions, references, and retrieval tags
- `claim-analyzer`: evaluate evidence chains and claim boundaries
- `quick-compare`: fast multi-option comparison
- `hv-analysis`: deep horizontal-vertical analysis workflow
- `darwin-skill`: Skill evaluation and optimization loop
- `khazix-writer` / `oral-copy`: long-form and public-writing workflows
- `meeting-summarizer`, `presentation-critic`, `humanize-rewrite`, `hotspot-radar`

Skill source lives under [skills](/E:/SPLLM/skills).

### Knowledge layer

The local knowledge base is Obsidian-compatible and remains private by
default. It uses:

- `wiki/sources/` for traceable source summaries
- `wiki/entities/` for people, products, companies, and organizations
- `wiki/concepts/` for abstract ideas and methods
- `wiki/comparisons/` for cross-object analysis
- `wiki/products/` and `wiki/presentations/` for promoted deliverables

Pages use YAML frontmatter and Wikilinks to form a navigable knowledge graph.

### Runtime layer

Runtime and personal state stay out of the public core:

- raw inputs
- generated outputs
- reports in progress
- local caches
- agent-local state
- credentials and machine-specific configuration

---

## Core Flows

### 1. Ingest

```text
raw material
  -> source summary
  -> entity and concept extraction
  -> wikilink connections
  -> index/log maintenance
```

### 2. Digest

```text
deep material
  -> argument and evidence analysis
  -> transferable method
  -> concept enrichment or reusable Skill
```

### 3. Query

```text
user question
  -> targeted retrieval
  -> evidence comparison
  -> cited answer
  -> optional promotion into durable knowledge
```

### 4. Produce

```text
knowledge + constraints
  -> selected Skill
  -> draft output
  -> validation
  -> deliverable
```

### 5. Maintain

```text
health check
  -> detect drift / dead links / weak metadata / ownership overlap
  -> repair
  -> sync durable context
```

---

## Repo Boundary

This repository is intentionally sanitized.

Published here:

- workspace rules and architecture documents
- reviewed reusable Skills
- support scripts and structural assets
- public-facing app scaffolds when explicitly kept

Not published here:

- private wiki contents
- source summaries and personal knowledge accumulation
- raw materials
- generated reports and task outputs
- local agent state and caches
- secrets, tokens, and machine-specific auth data

---

## Top-Level Structure

```text
SPLLM/
|- skills/                  reusable project Skills
|- wiki/                    private knowledge base skeleton
|- raw/                     private source material
|- outputs/                 private generated outputs
|- app/                     local app/runtime area
|- assets/                  shared static assets
|- records/                 tracked workflow records
|- reports/                 tracked audit or maintenance reports
|- comic-canvas/            browser-based comic/storyboard creation tool
|- AGENTS.md                project operating instructions
|- CLAUDE.md                agent manual
|- SCHEMA.md                schema and content rules
|- ARCHITECTURE.md          core architecture summary
`- README.md                this file
```

---

## Projects

### comic-canvas

A browser-based comic and storyboard creation tool built as a single-file
vanilla HTML/JS application with no build tools or frameworks.

Key features:

- **Visual node canvas**: organize characters, shots, dialogue, scenes, pages,
  and containers on a Drawflow-powered canvas with drag-and-drop, connection
  snapping, and container grouping.
- **Cinematic node model**: production-grade fields for shot language, continuity
  locks, identity locks, scene topology, dialogue coverage, and page metadata.
- **AI integration**: OpenAI-compatible API for Markdown import/export with
  embedded JSON snapshots for lossless round-trip.
- **Music system**: embedded player with NetEase Cloud Music API, multi-source
  plugin support via lx-shim, and a roaming mode that auto-discovers music.
- **Design system**: Totality Festival purple theme with dark/light modes,
  glass-morphism effects, flowing-light connection animations, and a 3D
  character card component (Three.js sphere).

Tech stack: single `index.html` (~7000 lines), Drawflow 0.0.60 (inlined),
Three.js v0.160.0 (CDN), Node.js dev server (`server.cjs`).

Run locally:

```bash
cd comic-canvas
node server.cjs
# Open http://localhost:8080/index-entry.html
```

---

## How To Read This Workspace

If you are trying to understand SPLLM, start in this order:

1. [README.md](/E:/SPLLM/README.md)
2. [ARCHITECTURE.md](/E:/SPLLM/ARCHITECTURE.md)
3. [AGENTS.md](/E:/SPLLM/AGENTS.md)
4. [SCHEMA.md](/E:/SPLLM/SCHEMA.md)
5. browse [skills](/E:/SPLLM/skills)

If you are trying to extend the system, think in this order:

1. does an existing Skill already own this work
2. if not, can an existing Skill be expanded cleanly
3. only then create a new Skill with a clear ownership boundary

---

## Recent Direction

The current direction of SPLLM is:

- shrink overlapping Skills
- consolidate network collection around `net-to-markdown`
- keep `thinking-extend` as a default closing layer
- separate public architecture from private execution residue
- make GitHub represent the core system, not the personal workspace exhaust

---

## Notes

- This is a private-first system with a public core.
- The GitHub view is not the full workspace state.
- The real value of SPLLM is the combination of governance, Skills, and
  disciplined promotion from temporary work into durable knowledge.
