# Change Log

This file is mandatory.

No matter which agent takes over this project, every change must be recorded here with a timestamp.

Required fields for each entry:

- Agent
- Files
- Summary
- Details
- Compatibility
- Follow-up

## 2026-06-29 02:32:17 +08:00

- Agent: Codex
- Files: `index.html`, `index-entry.html`
- Summary: Expanded the node system from lightweight comic planning toward cinematic video-preproduction.
- Details: Added active `visual`, `asset`, and `page` node types. Expanded `char`, `scene`, `shot`, and `line` schemas to include production-grade fields such as cinematic shot language, continuity locks, identity locks, scene topology, dialogue coverage, and generation-oriented page metadata. Updated palette entries, quick-create entries, inspector grouping, Markdown export grouping, AI preview grouping, AI parsing defaults, and project-manager type colors/labels.
- Compatibility: Existing data paths were kept working. New schema defaults now use values like `AUTO`, `INHERIT`, `OPEN`, and `draft` where appropriate.
- Follow-up: The current inspector is schema-complete but visually dense. A future pass should improve grouped rendering, condensed node summaries, and page-specific display treatments.

## 2026-06-29 02:32:17 +08:00

- Agent: Codex
- Files: `index.html`, `index-entry.html`
- Summary: Removed the active `branch` node type and treated `page` as the replacement planning unit.
- Details: Deleted `branch` from active type definitions, schema definitions, palette cards, quick-create UI, node rendering branches, AI preview ordering, Markdown export ordering, and project-manager labels. Updated the AI parsing prompt so it no longer asks for branch nodes.
- Compatibility: Legacy `branch` data is still supported. `normalizeNodeType()` maps old `branch` nodes to `page`, and legacy fields are translated into `page_id`, `page_type`, and `purpose` during load/import paths.
- Follow-up: Old exported Markdown or AI outputs may still describe branching in prose. If users want branching back later, that should be treated as a new design decision rather than undoing the current migration by accident.

## 2026-06-29 02:32:17 +08:00

- Agent: Codex
- Files: `CLAUDE.md`, `index.html`, `log.md`
- Summary: Rewrote the project handoff rules and made log updates mandatory for all future agents.
- Details: Replaced the stale `CLAUDE.md` with a current project rulebook covering architecture, active node model, Drawflow constraints, AI import/export responsibilities, verification expectations, and the explicit requirement that every future change must be written into `log.md` with a timestamp. Added an architecture note directly inside the main IIFE in `index.html` so code-level readers see the current system direction immediately.
- Compatibility: No runtime behavior changed from the documentation update itself.
- Follow-up: If `AGENTS.md` and `CLAUDE.md` begin to drift, reconcile them deliberately and log the reconciliation here.

## 2026-06-29 02:40:39 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Changed connection receipt behavior to stop auto-selecting a free input port.
- Details: Replaced the fallback that searched for an unused target input with direct port mapping. When a connection lands on a port, the code now resolves `input_x` to `input_x` and `output_x` to `input_x` instead of redirecting to the first available input. This keeps endpoints predictable and makes connections feel truly point-to-point.
- Compatibility: Existing connections are unchanged. Only the live connection completion path was adjusted.
- Follow-up: If you later want fully symmetric port semantics beyond Drawflow's native output-to-input model, that will need a dedicated data-model change rather than another fallback rule.

## 2026-06-29 02:51:21 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Preserved the visible source-port side during input-initiated connections.
- Details: When a connection starts from an input port, the code now temporarily reclassifies that exact port as an output at the same screen position, so the line begins where the user clicked instead of jumping to the opposite side. The port is restored immediately after the connection finishes.
- Compatibility: This only affects the input-start path. Existing edges and output-start behavior are unchanged.
- Follow-up: Touch-start input connections should be mirrored with the same proxy behavior if you plan to use mobile editing heavily.

## 2026-06-29 03:08:40 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Switched input-start connections to persistent proxy outputs so existing lines no longer jump to other ports.
- Details: Instead of temporarily borrowing Drawflow's real `output_1/output_2` ports, input ports now receive dedicated `output_proxy_1/output_proxy_2` anchors that stay attached to the same physical side. The Drawflow node data is seeded with these proxy outputs at node creation time, so later connections no longer repoint old lines to a different visible output.
- Compatibility: Existing normal output-start connections are unchanged. Legacy saved projects remain loadable because the proxy anchors are added during node creation and import paths.
- Follow-up: If the UI later needs explicit labels for proxy anchors, we should surface them in a hidden-debug layer rather than in the main inspector.

## 2026-06-29 03:18:27 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Prevented hidden proxy anchors from polluting visible port layout and snap targeting.
- Details: Proxy anchors are now separate hidden output nodes instead of extra classes attached to the real input ports. The port layout code positions them in parallel with the corresponding input ports, and snap targeting skips them so they do not become accidental connection destinations.
- Compatibility: Existing visible port behavior is unchanged. This change only affects the input-start proxy mechanism and its internal anchoring.
- Follow-up: If a third or fourth side port family is added later, the proxy-anchor helper should be generalized instead of duplicated again.

## 2026-06-29 03:24:46 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Tightened connection targeting so lower ports no longer jump to nearby ports.
- Details: Replaced the nearest-port snapping heuristic with direct hit testing against the port currently under the pointer. The drag logic now only connects to the exact endpoint the cursor is over, which prevents a lower-endpoint drag from being silently reassigned to a different nearby port.
- Compatibility: This affects live connection targeting only. Existing stored connections and proxy anchors are unchanged.
- Follow-up: If you later want a softer snap radius again, it should be added explicitly as a visual preview without changing the actual target selection.

## 2026-06-29 03:33:14 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Fixed lower-endpoint connections by adding same-position input proxies for output-side targets.
- Details: The target-port resolver no longer maps visible output endpoints onto ordinary `input_2` / `input_1`. It now resolves output-side drops to hidden `input_proxy_1` / `input_proxy_2` anchors that sit exactly on the visible output ports, so lower-endpoint connections stay on the endpoint the user actually picked instead of jumping to a different input position.
- Compatibility: Existing saved flows still load. New and rebuilt nodes now carry both output proxies for input-start connections and input proxies for output-start connections.
- Follow-up: If a node family ever needs more than two sides/positions, the proxy-anchor helper should be generalized rather than extended with more hard-coded pairs.

## 2026-06-29 04:12:11 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Completed browser verification for bidirectional port connections and removed temporary diagnostics.
- Details: Replayed real browser-side connections for both input-start and output-start flows. The input-start path now creates the expected proxy edge without retargeting to a neighboring port, and the output-start path still lands on the exact endpoint that was clicked. Temporary `window.__bidirectionalDebug` instrumentation was removed after verification.
- Compatibility: The clean state now contains only the original four baseline edges after test edges were removed.
- Follow-up: If you later add more than two port positions per side, the proxy mapping and direct-hit verification should be generalized together.

## 2026-06-29 04:23:46 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Applied Paul Hanaoka-inspired sidebar styling to the left asset panel only.
- Details: The left sidebar was restyled into a darker inset panel with 8px list items, flatter hover states, tighter section labels, and lighter typography so it matches the reference site's navigation feel without changing the drag/drop or node-creation behavior.
- Compatibility: No project content, node schema, or interaction logic was changed.
- Follow-up: If you want, we can next tune the canvas and inspector to echo the same visual language more lightly.

## 2026-06-29 04:28:46 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Added a light-theme frosted-glass override for the asset sidebar.
- Details: In light mode, the asset panel now uses a semi-transparent white glass surface with blur and a subtle border/shadow, and its labels switch to darker text for better contrast. The rest of the app remains unchanged.
- Compatibility: This only affects `[data-theme="light"] .palette` and its text styles.
- Follow-up: If the panel still feels too airy or too dense on your display, we can fine-tune the opacity or blur without touching the rest of the layout.

## 2026-06-30 01:15:00 +08:00

- Agent: QoderWork
- Files: `index.html`
- Summary: Added flowing light (流光) animation to connection lines.
- Details: Replaced static connection strokes with animated dash patterns (`stroke-dasharray: 14 22`, `stroke-dashoffset` keyframe animation at 1.6s cycle). Three visual states: base (black, opacity .5, subtle glow), hover (thicker, brighter, double drop-shadow), selected (accent color, max glow). Base color set to `#000`, hover/selected use `var(--fg-2)` and `var(--accent)`.
- Compatibility: `.type-dash` and `.type-dot` connection types retain their own `!important` dasharray overrides and are unaffected.
- Follow-up: If the animation feels too prominent on dense canvases, consider reducing dash segment length or slowing the cycle.

## 2026-06-30 01:30:00 +08:00

- Agent: QoderWork
- Files: `index.html`
- Summary: Optimized connection animation performance by replacing CSS `drop-shadow` with SVG filters.
- Details: Root cause of animation jank: CSS `filter: drop-shadow()` rebuilds the shadow stack every frame during `stroke-dashoffset` animation. Replaced with two SVG `<filter>` definitions (`conn-glow` and `conn-glow-strong`) using `feGaussianBlur` + `feColorMatrix` + `feMerge` in the SVG `<defs>` block. Added `will-change: stroke-dashoffset` for GPU compositing hint. Removed `transition` property (conflicts with infinite animation, causes double interpolation). Added `stroke-linecap: round` for lighter rendering. Default stroke-width increased to 5px, hover/selected to 6px.
- Compatibility: SVG filters are defined in the existing `<svg><defs>` block and referenced via `url(#conn-glow)`. No runtime JS changes.
- Follow-up: If filter performance is still an issue on low-end devices, consider disabling the animation via `prefers-reduced-motion` media query.

## 2026-06-30 01:50:00 +08:00

- Agent: QoderWork
- Files: `index.html`, `index-entry.html`, `pics/logo.png`
- Summary: Replaced text+emoji logo with image logo and added mirror-shine hover effect.
- Details: Replaced `<span class="logo">🎬</span> Copy Me <small>v1.0</small>` in `index.html` and `<span class="logo">🎨</span> 漫剧画布 <small>项目管理中心</small>` in `index-entry.html` with `<img src="pics/logo.png">`. Added CSS for `.logo-img` (height: 44px/48px), `.brand` with `position:relative; overflow:hidden` for shine clipping, and `::after` pseudo-element implementing a diagonal gradient band (`linear-gradient(105deg, transparent→white→transparent)`, `skewX(-25deg)`) that sweeps left-to-right on hover (0.6s ease transition). Logo scales to `1.05` on hover.
- Compatibility: Old `.brand .logo` and `.brand small` CSS rules are now dead code (no matching DOM elements) and can be cleaned up later.
- Follow-up: Consider updating the `<title>` tag and favicon to match the new branding.

## 2026-06-30 02:05:00 +08:00

- Agent: QoderWork
- Files: `pics/logo.png`
- Summary: Removed white/light-gray background from logo image, exported as transparent PNG.
- Details: Used Pillow to analyze corner pixels (~RGB 240,240,240), applied threshold-based background removal (brightness > 215, saturation < 25 → transparent). Transition zone (brightness > 195) uses partial alpha for smooth edges. Image cropped to content bounds, aspect ratio changed from 4:3 to ~2.14:1.
- Compatibility: Same file path `pics/logo.png`, just transparent background now. Works on both dark and light themes.
- Follow-up: None.

## 2026-06-30 02:15:00 +08:00

- Agent: QoderWork
- Files: `index.html`, `index-entry.html`
- Summary: Increased logo size and reduced gap to 文件 button.
- Details: Logo height set to 80px in both pages. Nav-links `margin-left` reduced from 24px to 8px to bring logo closer to the 文件 dropdown button.
- Compatibility: No structural HTML changes.
- Follow-up: If the logo is too large on smaller screens, add a media query to reduce height.

## 2026-06-30 02:25:00 +08:00

- Agent: QoderWork
- Files: `index.html`
- Summary: Aligned inspector panel height with asset palette panel.
- Details: Inspector was full grid-cell height while palette had `height:calc(100% - 64px)` + `margin:32px`. Applied matching height/margin to inspector. Changed `border-left` to full `border` with `border-radius:16px` for consistent card styling with the palette. Both panels now share the same visual treatment.
- Compatibility: Mobile responsive CSS (`.inspector{display:none}`) and `pure-mode` CSS (`transform:translateX(100%)`) are unaffected.
- Follow-up: The minimap `right:calc(var(--inspector-w) + 12px)` may need adjustment since the inspector now has a 32px right margin.

## 2026-06-30 02:40:00 +08:00

- Agent: QoderWork
- Files: `index.html`
- Summary: Inspector panel now auto-hides when no node is selected.
- Details: Added `.main.no-inspector` CSS class that collapses the grid from 3 columns to 2 (`grid-template-columns: var(--palette-w) 1fr`) and sets `.inspector{display:none}`. Modified `renderInspector()` to toggle this class: adds it when `!sel && selectedIds.length === 0`, removes it otherwise. Also fixed the empty `nodeUnselected` event handler — it now clears `store.selectedId`/`store.selectedIds` and calls `renderInspector()`, so clicking empty canvas properly hides the panel.
- Compatibility: The `no-inspector` class is on `.main`, not the inspector itself, avoiding conflicts with mobile `display:none` and `pure-mode` `transform` rules. All existing `renderInspector()` call sites (Delete key, Escape key, box selection, node deletion, connection deselect, etc.) work correctly with the new logic.
- Follow-up: The `_origRenderInspector` override pattern (inspector enhancement module) still works because it only adds fields when `sel` is a valid string.

## 2026-06-30 02:49:40 +08:00

- Agent: QoderWork
- Files: `index.html`, `log.md`
- Summary: Added collapsible sidebar toggle to the asset palette panel.
- Details: Added a « / » toggle button in the top-right corner of the palette. Clicking it toggles `.palette-collapsed` on `.main`, which shrinks the grid column from 272px to 56px, hides all text (section titles, card meta, grip handles, hint block), and centers the SVG icons vertically. The collapsed state maintains drag-and-drop functionality — dragging an icon from the narrow sidebar still creates nodes on the canvas. Added `position:relative` to `.palette` for proper button anchoring. Both dark and light theme styles are handled.
- Compatibility: The `.palette-collapsed` class works alongside the existing `.no-inspector` class (combined selector `.main.palette-collapsed.no-inspector`). Mobile responsive CSS already hides the palette entirely at 768px, so no conflict.
- Follow-up: Consider adding a CSS transition for smooth width animation, or persisting the collapsed state in `localStorage` across sessions.

## 2026-06-30 03:12:40 +08:00

- Agent: QoderWork
- Files: `index.html`, `log.md`
- Summary: Fixed minimap viewport box aspect ratio by using actual node dimensions instead of hardcoded 200×60.
- Details: The minimap bounding box calculation used hardcoded `w=200, h=60` for all nodes, which didn't match actual node sizes (char nodes are 160×245, containers are 280×200, etc.). This made the world bounding box disproportionately wide relative to its height, causing the viewport selection box to appear with incorrect aspect ratio. Fixed in three places: `renderMinimap()`, the `translate` event handler, and the minimap drag handler. All now use `el.offsetWidth`/`el.offsetHeight` from the DOM with 200×60 as fallback. Also updated SVG node rendering and connection line center-point calculations to use actual dimensions.
- Compatibility: If a node DOM element doesn't exist (e.g., during initialization), the code falls back to the previous 200×60 defaults. Added `container` type color to the minimap type-color map.
- Follow-up: The DOM query inside the translate handler adds slight overhead during canvas panning. If performance becomes an issue, cache the node dimensions and invalidate on node resize/create/delete.

## 2026-07-01 00:41:49 +08:00

- Agent: QoderWork
- Files: `index.html`, `index-entry.html`, `log.md`
- Summary: Continued the interrupted node-model refactor and repaired the project entry page syntax.
- Details: `index.html` now keeps the active node model aligned with the requested UX changes: line nodes use one port and derive speaker from connections, scene/asset/visual/end are folded into container/page/shot flows, container placement and snapping were tightened, and node refresh logic now keeps links and positions in sync during drag, undo, and container moves. `index-entry.html` was also repaired by fixing the duplicated-quote/new-name path and several comment/code line-break issues so the project manager script parses cleanly again.
- Verification: `node --check` passes for the extracted main application IIFE in `index.html` and for the full script block in `index-entry.html`.
- Follow-up: If you want, the next pass can focus on interactive smoke testing in the browser for container drop, undo/redo, and line-node presentation.

## 2026-07-01 01:05:17 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Fixed container follow behavior after nodes are placed into a container.
- Details: Added a shared position sync helper for node movement, clamped newly attached child nodes into the container's usable interior so they stop covering the whole container hit area, and updated drag capture so when a container is already selected, dragging across one of its child nodes routes the gesture to the parent container instead of accidentally dragging the child away. This keeps parent-child membership stable while moving the container.
- Compatibility: Verified against the live editor at `http://127.0.0.1:8080/index.html`; after attaching a character into a container, dragging the container moves both nodes together and preserves `_parentId` / `_children`.
- Follow-up: Undo/redo position recovery still needs a separate repair pass.

## 2026-07-01 01:10:30 +08:00

- Agent: Codex
- Files: `index.html`, `log.md`
- Summary: Restyled the dialogue node to match the provided speech-bubble reference.
- Details: Reworked the `line` node into a long rounded white bubble with a darker outline, centered body text, hidden inline speaker label, and a two-circle tail at the lower-left corner. Also raised the line node width override so the bubble keeps its horizontal silhouette instead of collapsing into the old square card proportions.
- Compatibility: Verified visually in the live editor by creating a new dialogue node and comparing its rendered silhouette against the supplied sample image.
- Follow-up: If you want, we can do one more pass to fine-tune the border thickness or tail size for even closer pixel-level matching.

## 2026-07-01 01:30:14 +08:00

- Agent: Codex
- Files: `music-player.js`, `log.md`
- Summary: Hardened roaming mode so it can fall back to other sources instead of stopping on a single-source miss.
- Details: Extracted plugin search into a reusable fallback path, added roaming source rotation (`wy/tx/kw/kg/mg/qsvip`), and taught roaming to automatically switch the active source button when another source successfully returns playable songs. The failure toast was also updated to reflect backend unavailability instead of incorrectly implying roaming itself was paused.
- Compatibility: `node --check music-player.js` passes. In a browser-level mock test where the current source returned no songs and `tx` returned one song, roaming switched to `tx`, updated the active source button, and appended the fallback song into the playlist.
- Follow-up: If the external proxy remains unavailable on this machine, the next pass should focus on the backend search source itself rather than the roaming control flow.

## 2026-07-01 05:31:39 +08:00

- Agent: Claudian
- Files: `index.html`, `CLAUDE.md`, `log.md`, `styles/*`, `modules/*`, `lib/drawflow/*`
- Summary: Completed three-phase architectural refactor: CSS separation → JS module split → Drawflow externalization.
- Details: 
  - **Phase 1 (CSS)**: Extracted ~2,000 lines of inline CSS from `index.html` into 4 modular files under `styles/`: `tokens.css` (theme variables + base reset), `navbar.css` (navbar/toolbar/menus/modals), `components.css` (layout/panels/nodes/connections/UI), `responsive.css` (media queries + pure-mode). `index.html` lost 1,970 CSS lines.
  - **Phase 2 (JS modules)**: Split the ~5,300-line IIFE into 9 ES modules under `modules/`: `config.js` (TYPE_META/SCHEMA), `store.js` (state), `theme.js` (dark/light), `ink-ripple.js` (audio-reactive animation), `sphere-drag.js` (3D sphere), `util.js` (helpers/history/serialization), `canvas.js` (core app logic — Drawflow init, node rendering, inspector, connections, AI, menus, boot), `navbar.js` (wave canvas), `index.js` (entry point). `index.html` lost ~3,360 JS lines.
  - **Phase 3 (Drawflow)**: Extracted the 46KB inline Drawflow 0.0.60 UMD bundle into `lib/drawflow/drawflow.min.js`. Created `lib/drawflow/index.js` as an ESM shim. Replaced inline `<script>` with `<script src="lib/drawflow/drawflow.min.js">`. Replaced the main IIFE with `<script type="module" src="modules/index.js">`.
  - **Result**: `index.html` reduced from 7,826 lines to ~550 lines (HTML structure only). Total project structure is now modular, maintainable, and follows the single-responsibility principle.
  - **Updated**: `CLAUDE.md` with new file map, architecture overview, load order, and module-level paths.
- Compatibility: All functionality preserved. Drawflow is loaded as a classic script before the ES module, so `window.Drawflow` is available to `canvas.js`. The navbar behavior script remains an inline classic script in `index.html` (unchanged). `lx-shim.js` and `music-player.js` remain classic scripts loaded after the module.
- Follow-up: `modules/canvas.js` (~2,980 lines) is still large and could be further split into sub-modules (node-rendering, inspector, connections, AI, menus) in a future pass. The unused `modules/navbar.js` can be removed or integrated.

