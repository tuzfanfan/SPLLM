# CLAUDE.md - comic-canvas project handoff guide

This file is the project-level rulebook for any AI agent working in `E:\apps\comic-canvas`.

Read this file before changing code.
Read [log.md](/E:/apps/comic-canvas/log.md) before changing code.

## Non-negotiable rule

No matter which agent takes over this project, every code or rule change must be recorded in `log.md` with a timestamp.

Minimum requirement for every log entry:

- timestamp
- agent name or source
- files changed
- what changed
- why it changed
- compatibility notes or follow-up risk

If you modify code and do not update `log.md`, the work is incomplete.

## Project purpose

`comic-canvas` is a browser-based storyboarding and comic/video planning tool built around a visual node canvas.

It started as a lightweight comic node editor and is now being pushed toward a more film-ready, AI-video-friendly workflow tool. The current direction is:

- use nodes as structured production specs
- capture cinematic shot language earlier
- preserve scene and character continuity
- support page/keyframe planning
- make downstream AI generation faster and more consistent

## Run and verify

Always run the project with:

```bash
cd E:\apps\comic-canvas
node server.cjs
```

Do not use `python -m http.server`.

Reason:

- `server.cjs` provides `GET /api/plugins`
- `server.cjs` provides `GET /api/proxy?url=<encoded>`
- music search and playback depend on those endpoints

Primary URLs:

- project manager: `http://localhost:8080/index-entry.html`
- editor: `http://localhost:8080/index.html`
- project-scoped editor: `http://localhost:8080/index.html?project=<id>`

## Current file map

- [index.html](/E:/apps/comic-canvas/index.html): main editor, single-file app, most business logic lives here
- [index-entry.html](/E:/apps/comic-canvas/index-entry.html): project manager and multi-project launcher
- [server.cjs](/E:/apps/comic-canvas/server.cjs): static server, proxy endpoint, plugin discovery
- [music-player.js](/E:/apps/comic-canvas/music-player.js): embedded player, search, roaming mode
- [music-player.css](/E:/apps/comic-canvas/music-player.css): music UI styles
- [lx-shim.js](/E:/apps/comic-canvas/lx-shim.js): browser shim for LX music plugins
- [sphere3d.js](/E:/apps/comic-canvas/sphere3d.js): Three.js sphere widget for character visuals
- [log.md](/E:/apps/comic-canvas/log.md): required change log for all agents

## Architecture overview

The main app is a single IIFE inside [index.html](/E:/apps/comic-canvas/index.html). The important flow is:

1. `TYPE_META` and `SCHEMA` define the node system.
2. `store` holds editor state, node data, edge data, history, theme, and UI state.
3. `initDrawflow()` boots Drawflow and attaches event bridges into `store`.
4. `buildNodeHtml()` renders node shells for each node type.
5. `renderInspector()` exposes schema-driven editing in the right panel.
6. `serialize()`, `loadFrom()`, `doExportMd()`, and AI import/export keep project data portable.
7. `boot()` wires up the whole app.

The code is intentionally sectioned with large comment banners. Preserve that structure when editing.

## Current node model

As of `2026-06-29`, the active node types are:

- `char`
- `shot`
- `line`
- `scene`
- `end`
- `container`
- `visual`
- `asset`
- `page`

Important change:

- `branch` is no longer an active node type.
- Old saved data may still contain `branch`.
- Compatibility is handled by `normalizeNodeType()` in [index.html](/E:/apps/comic-canvas/index.html), which maps legacy `branch` nodes into `page`.

Do not reintroduce `branch` unless the user explicitly requests that design reversal and the downstream migration impact is documented in `log.md`.

## Product direction

The editor is no longer just a loose comic outline board. It is moving toward a structured production-planning tool for cinematic video creation.

That means agents should prefer changes that strengthen:

- shot intention
- continuity tracking
- character identity lock
- scene topology lock
- page/keyframe planning
- inheritance from project defaults
- AI generation readiness

Avoid changes that push the tool back toward vague note-taking.

## Schema editing rules

When changing `SCHEMA` or node behavior:

1. Update `TYPE_META` and `SCHEMA` together.
2. Check whether `TITLE_FIELD`, `DESC_FIELD`, `FIELD_SECTIONS`, and AI preview ordering also need updates.
3. Check whether Markdown export and AI import/export mappings also need updates.
4. Check whether project manager color/label summaries in [index-entry.html](/E:/apps/comic-canvas/index-entry.html) also need updates.
5. If removing a node type, keep or deliberately remove backward compatibility and document that choice in `log.md`.

## Drawflow constraints

These are easy to break and must be respected:

- `removeNodeId()` expects the full `node-XX` format.
- `addNode()` must pass `false` as the ninth argument.
- the app overrides Drawflow zoom behavior to allow wheel zoom without Ctrl.
- do not reparent node DOM into container DOM

That last point is critical:

- Drawflow positioning depends on `offsetLeft` and `offsetTop`
- child nodes inside container DOM will break drag math
- container membership must remain data-driven, not DOM-nesting-driven

## Container system rules

Container nodes use:

- `_children`
- `_parentId`
- `_width`
- `_height`

Behavior expectations:

- children stay as sibling DOM nodes
- moving a container moves its children in the same frame
- deleting a container releases children
- loading a project must restore container relationships

If you change container behavior, verify both drag and load paths.

## AI import/export rules

The Markdown and AI pipeline is now part of the core product, not an accessory.

When changing node schemas or names:

- update Markdown export grouping
- update AI preview grouping
- update AI system prompt field descriptions
- update fallback and migration behavior for older project snapshots

Do not let AI keep generating removed node types.

## UI binding rules

Use safe binding patterns when touching toolbar or optional DOM elements.

Existing helper pattern:

```js
const bind = (sel, evt, fn) => { const el = $(sel); if (el) el[evt] = fn; };
```

Some historical buttons no longer exist in the DOM, so direct blind binding can crash `boot()`.

## Verification checklist after edits

Minimum checks:

1. syntax-check the main IIFE with `node --check`
2. syntax-check any edited standalone JS file
3. start with `node server.cjs`
4. verify `index.html` loads
5. verify `index-entry.html` loads
6. if schema changed:
   confirm node creation still works
   confirm inspector still renders
   confirm Markdown export still works
   confirm AI preview still works
7. append the change to `log.md`

## Agent workflow rules

Before editing:

- read this file
- read `log.md`
- inspect the relevant code area

After editing:

- verify the affected flow
- update `log.md`

If you are uncertain whether something counts as a change worth logging, log it.

## Log format

Use this format in [log.md](/E:/apps/comic-canvas/log.md):

```md
## 2026-06-29 02:32:17 +08:00

- Agent: Codex / <agent-name>
- Files: `index.html`, `CLAUDE.md`, `log.md`
- Summary: one concise description
- Details: key architectural or product changes
- Compatibility: legacy behavior kept / broken / migrated
- Follow-up: optional next steps or risks
```

## Current known state summary

Recent important changes already reflected in code:

- schema expanded toward cinematic/video planning
- added `visual`, `asset`, and `page` nodes
- removed active `branch` node usage
- legacy `branch` data now migrates to `page`

Any future agent should assume the project is in transition from comic editor to structured video-preproduction tool, and should make changes in that direction unless the user says otherwise.
