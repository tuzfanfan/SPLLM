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
