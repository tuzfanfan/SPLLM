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

## File map (post-refactor 2026-07-01)

### Core files

| File | Lines | Description |
|------|-------|-------------|
| `index.html` | ~550 | HTML structure only. No CSS/JS inline. |
| `index-entry.html` | ~1,243 | Project manager and multi-project launcher |
| `server.cjs` | ~193 | Static server, proxy endpoint, plugin discovery |

### Styles (extracted from index.html)

| File | Lines | Description |
|------|-------|-------------|
| `styles/tokens.css` | ~230 | CSS variables (dark/light themes), base reset, global shadow bg |
| `styles/navbar.css` | ~550 | Navbar, toolbar, menus, modals, AI dialogs |
| `styles/components.css` | ~1,150 | Layout (3-column), panels, nodes, connections, context menu, minimap, mobile UI |
| `styles/responsive.css` | ~45 | Media queries + pure-mode |
| `music-player.css` | ~785 | Music player UI styles |

### Modules (ES modules, loaded via index.html)

| File | Lines | Description |
|------|-------|-------------|
| `modules/index.js` | ~24 | Entry point: initializes sub-systems, calls `boot()` on DOMContentLoaded |
| `modules/config.js` | ~170 | TYPE_META, SCHEMA, field definitions |
| `modules/store.js` | ~33 | Global state object |
| `modules/theme.js` | ~51 | Dark/light theme switching |
| `modules/ink-ripple.js` | ~230 | Ink fluid animation (audio-reactive) |
| `modules/sphere-drag.js` | ~85 | 3D sphere drag manager |
| `modules/util.js` | ~630 | Utilities, history, serialization, helpers |
| `modules/canvas.js` | ~2,980 | Core: Drawflow init, node rendering, inspector, connections, AI, menus, boot |
| `modules/navbar.js` | ~141 | Navbar wave canvas (unused — navbar logic is inline in index.html) |

### External libraries

| File | Lines | Description |
|------|-------|-------------|
| `lib/drawflow/drawflow.min.js` | ~1 | Drawflow 0.0.60 UMD bundle (loaded as classic script) |
| `lib/drawflow/index.js` | ~5 | ESM shim: `export default window.Drawflow` |
| `sphere3d.js` | ~226 | Three.js 3D sphere widget |
| `lx-shim.js` | ~417 | Browser shim for LX music plugins |
| `music-player.js` | ~1,591 | Music player, search, roaming mode |

## Architecture overview

The main app uses ES modules loaded via `<script type="module">` in `index.html`:

1. **Entry**: `modules/index.js` imports all modules, initializes sub-systems (ink-ripple, sphere-drag), then calls `boot()` on DOMContentLoaded.
2. **Config**: `TYPE_META` + `SCHEMA` define the node model.
3. **Store**: `store` holds editor state, node data, edge data, history, theme, and UI state.
4. **Theme**: `initTheme()` / `toggleTheme()` manage dark/light switching.
5. **Canvas**: `modules/canvas.js` contains the bulk of application logic:
   - `initDrawflow()` boots Drawflow (accessed via `window.Drawflow` global)
   - `buildNodeHtml()` renders node shells for each type
   - `renderInspector()` exposes schema-driven editing
   - `serialize()` / `loadFrom()` / `doExportMd()` handle data persistence
   - AI import/export, clipboard, groups, minimap, context menu
   - `boot()` wires everything together
6. **Navbar**: Inline classic script in `index.html` handles scroll-hide/show and wave canvas.

### Load order

```
1. styles/tokens.css          (CSS variables)
2. styles/navbar.css          (navbar/menu/modal styles)
3. styles/components.css      (layout/node/component styles)
4. styles/responsive.css      (media queries)
5. music-player.css           (player styles)
6. lib/drawflow/drawflow.min.js  (classic script → window.Drawflow)
7. Three.js CDN               (classic script → window.THREE)
8. sphere3d.js                (classic script)
9. bg-removal CDN             (ESM inline)
10. modules/index.js          (ES module entry → boot())
11. lx-shim.js                (classic script)
12. music-player.js           (classic script)
13. navbar inline script      (classic script)
```

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
- Compatibility is handled by `normalizeNodeType()` in `modules/util.js`, which maps legacy `branch` nodes into `page`.

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

1. Update `TYPE_META` and `SCHEMA` in `modules/config.js` together.
2. Check whether `TITLE_FIELD`, `DESC_FIELD`, `FIELD_SECTIONS`, and AI preview ordering also need updates.
3. Check whether Markdown export and AI import/export mappings also need updates.
4. Check whether project manager color/label summaries in `index-entry.html` also need updates.
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

1. syntax-check edited JS files with `node --check modules/canvas.js` etc.
2. start with `node server.cjs`
3. verify `index.html` loads without console errors
4. verify `index-entry.html` loads
5. if schema changed:
   - confirm node creation still works
   - confirm inspector still renders
   - confirm Markdown export still works
   - confirm AI preview still works
6. append the change to `log.md`

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

Use this format in `log.md`:

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
- **2026-07-01**: Refactored from single-file to modular architecture:
  - CSS split into 4 files under `styles/`
  - JS split into ES modules under `modules/`
  - Drawflow 0.0.60 extracted to `lib/drawflow/`
  - `index.html` reduced from 7,826 to ~550 lines

Any future agent should assume the project is in transition from comic editor to structured video-preproduction tool, and should make changes in that direction unless the user says otherwise.
