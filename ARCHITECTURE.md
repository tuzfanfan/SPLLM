# SPLLM Core Architecture

## 1. Purpose

SPLLM turns scattered information into structured knowledge, reusable
procedures, and concrete deliverables while keeping private content separate
from reusable system logic.

Its central design choice is separation of ownership:

- **Materials are evidence**
- **Wiki pages are durable knowledge**
- **Skills are executable methods**
- **Outputs are disposable until deliberately promoted**

## 2. Layer Model

```text
Layer 4  Governance
         AGENTS.md / CLAUDE.md / SCHEMA.md / WORKSPACE_CONTEXT.md
                         |
Layer 3  Reusable workflows
         skills/<skill>/SKILL.md + references + scripts
                         |
Layer 2  Structured knowledge (private)
         wiki/sources -> concepts/entities -> comparisons/products
                         |
Layer 1  Inputs and runtime state (private)
         raw / daily-feed / book / outputs
```

### Governance

Defines naming, metadata, retrieval, editing, validation, and promotion rules.
`WORKSPACE_CONTEXT.md` is the short warm context; longer manuals are loaded
only when a task needs them.

### Reusable workflows

Skills encode repeatable work such as research, writing, comparison, source
collection, meeting summarization, and workspace maintenance. A workflow
should have one clear Skill owner to prevent duplicated responsibility.

### Structured knowledge

The private Obsidian-compatible Wiki uses:

- `sources/` for traceable source summaries
- `entities/` for people, companies, products, and organizations
- `concepts/` for methods, trends, and abstract ideas
- `comparisons/` for cross-object analysis
- `products/` and `presentations/` for promoted deliverables

Pages use YAML frontmatter and Wikilinks to form a navigable knowledge graph.

### Inputs and runtime state

`raw/`, `daily-feed/`, and `book/` contain original material. `outputs/`
contains temporary or generated artifacts. These areas remain private and are
not published to GitHub.

## 3. Core Flows

### Ingest

```text
raw material
  -> source summary
  -> entity and concept extraction
  -> Wikilink connections
  -> index and log maintenance
```

### Digest

```text
deep material
  -> argument and evidence analysis
  -> transferable method
  -> concept enrichment or reusable Skill
```

### Query

```text
user question
  -> targeted retrieval
  -> evidence comparison
  -> cited answer
  -> optional knowledge promotion
```

### Produce

```text
knowledge + user constraints
  -> selected Skill
  -> draft output
  -> validation
  -> private deliverable
```

### Maintain

```text
health check
  -> detect drift, dead links, weak metadata, or duplicated ownership
  -> repair
  -> update durable context
```

## 4. Context OS

SPLLM also acts as a context operating system for long-running agent work:

1. Identity and collaboration stance
2. Compact always-on context
3. Source-backed facts
4. Session recall and handoffs
5. Context compression
6. Procedural memory through Skills
7. Project-level rules
8. Knowledge retrieval
9. After-action promotion decisions
10. Scheduled maintenance loops
11. External tools and connectors

The system prefers retrieval over loading everything, and promotion over
allowing temporary output to become permanent by accident.

## 5. Publication Boundary

The local workspace is the full operating system. GitHub is a sanitized
distribution surface.

Published:

- Architecture and schema documents
- Agent operating rules
- Reviewed reusable Skills
- Empty private-directory skeletons

Not published:

- Wiki contents and source summaries
- Raw materials and books
- Generated reports, media, and presentations
- Runtime logs, caches, local agent state, and credentials
- Personal identifiers and machine-specific authentication data
