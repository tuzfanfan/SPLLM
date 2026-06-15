---
name: exvideo-gen
description: Plan and produce complex AI video projects through structured intake, story and script development, character-card design, storyboard development, page-level keyframe production, prompt compilation, and consistency review. Use when the user wants help turning an idea, reference work, script, reference images, character sheet, or prompt screenshots into a coherent multi-shot video workflow; when generating or restructuring video scripts; when creating reusable character, scene, shot, page, or asset specifications; or when extending the skill with new video-production modules such as game demos, ads, narrative films, product videos, music videos, explainers, or social shorts.
---

# Exvideo Gen

Build video projects as linked production specifications rather than isolated prompts. Help the user supply information progressively, preserve confirmed decisions, and compile each stage into generation-ready prompts.

## Operating Model

Use this production chain:

```text
project brief
-> story and script
-> visual bible
-> character and asset cards
-> scene and storyboard plan
-> page-level production specs
-> platform prompt compilation
-> generation and consistency review
```

Treat images, screenshots, and example prompts as evidence or structural references. Do not assume their depicted character, costume, or world should be copied unless the user explicitly says so.

## Start Every Project

Read `references/input-protocol.md`.
Use `references/standard-input-template.md` when the user wants a copyable project form.

1. Inventory supplied materials and label each item:
   - `identity-reference`
   - `style-reference`
   - `composition-reference`
   - `motion-reference`
   - `prompt-framework`
   - `edit-target`
   - `content-source`
2. Determine the current stage and requested deliverable.
3. Create or update the project state using stable IDs.
4. Ask only for missing P0 information that changes the output materially.
5. Show a compact execution judgment before generating new creative artifacts when confirmation is required.

## Production Stages

### Stage 0: Project Brief

Define the video's purpose, audience, platform, duration, aspect ratio, narrative goal, visual direction, deliverables, and constraints.

Do not enter shot production until these P0 fields are known:
- intended use
- target duration or shot count
- aspect ratio
- core subject
- desired output for the current turn

### Stage 1: Story and Script

Read `references/script-writing-stage.md`.
Read `references/cinematic-shot-language.md` when the script requires visual beats, reveal logic, camera-led emotion, or storyboard-ready shot intent.

Turn the project brief, source material, or reference-work analysis into a canonical story specification before building shots. Support:
- original story development from an idea
- script adaptation from supplied material
- structural rewriting that preserves abstract dramatic functions while replacing surface settings
- narration, dialogue, beat sheet, treatment, scene outline, or full script deliverables

For structural rewriting, lock these five elements before replacing the story shell:
- character obsession
- inner flaw
- midpoint reversal
- climax conflict
- core theme

Do not copy proprietary characters, dialogue, signature scenes, or a distinctive event sequence from a reference work. Preserve abstract dramatic logic, then redesign relationships, conflict mechanisms, midpoint events, climax actions, and consequences.

Do not enter storyboard production until the story causal chain and requested script artifact are approved.

### Stage 2: Visual Bible

Read `references/cinematic-shot-language.md` when defining camera, lens, lighting, focus, and movement defaults.

Lock project-wide invariants:
- world and era
- art direction
- rendering medium
- palette and lighting logic
- camera language
- motion language
- typography and UI language when relevant
- prohibited styles and continuity rules

Store project-wide decisions once. Let downstream stages inherit them.

### Stage 3: Character and Asset Cards

Read `references/character-card-stage.md`.

Support both workflows:
- design a new character or asset from text and references
- extract a reusable identity specification from an existing card

Separate immutable identity traits from shot-specific variants. Do not treat poses, temporary lighting, or one-shot costumes as permanent identity unless confirmed.

If the user wants a white-background character board, identity sheet, expression sheet, silhouette sheet, or artbook-style layout, read `references/module-character-identity-board.md` and decide whether the request is:
- a canonical character-card deliverable inside a larger video project
- a standalone identity-board project that should still preserve reusable stage outputs

### Stage 4: Storyboard

Read `references/storyboard-stage.md`.
Use `references/cinematic-shot-language.md` to normalize shot size, composition, angle, movement, lighting, lens, and focus choices.

Convert story intent into scenes, beats, and shots. Each shot must define:
- narrative function
- duration
- framing and camera
- subject action
- emotional transition
- start state and end state
- continuity dependencies
- audio or dialogue when relevant

Reject overloaded shots. Split a shot when it contains more action than the target duration can communicate clearly.

### Stage 5: Page-Level Production

Read `references/page-production-stage.md`.
Inherit the approved canonical shot-language block before composing each visual page.

Treat a page as one production-ready visual unit:
- storyboard frame
- keyframe
- start/end frame pair
- UI or HUD screen
- character action sheet
- environment establishing frame
- transition frame
- final combat or product beauty shot

Compile inherited project, character, scene, and shot data into the page. Apply only explicit local overrides.

### Stage 6: Prompt Compilation

Compile specifications for the selected image or video tool only after the page is approved.
Use the compilation order in `references/cinematic-shot-language.md`; include only fields that support the shot.

Keep two layers:
- `canonical spec`: platform-neutral production truth
- `adapter prompt`: wording tailored to the selected model or platform

Never allow platform-specific prompt syntax to become the canonical source of truth.

### Stage 7: Review and Revision

Run checks at the cheapest useful level:
- schema completeness
- script-to-storyboard fidelity
- storyboard-to-page traceability
- character and asset continuity
- shot-to-shot screen direction
- costume, prop, environment, and time continuity
- prompt feasibility for duration
- output comparison against locked invariants

Revise the smallest responsible layer. If one page drifts, fix the page override or adapter prompt; do not rewrite the character bible.

## Inheritance Model

Use stable IDs:

```text
PROJECT-01
SCRIPT-01
CHAR-01
ASSET-01
SCENE-01
SHOT-01-03
PAGE-01-03-A
```

Resolve values in this order:

```text
project defaults
< workflow-module defaults
< canonical script
< character/asset cards
< scene specification
< shot specification
< page override
< platform adapter
```

Later layers may override earlier layers only when the override is explicit and scoped.

## Change Locks

Mark important fields with one of these states:
- `LOCKED`: downstream work must preserve it
- `FLEXIBLE`: variations are allowed within stated bounds
- `OPEN`: undecided; propose options
- `SHOT_ONLY`: applies only to one shot or page

When the user changes a locked field, report which downstream scenes, shots, or pages are affected before regenerating them.

## Interaction Modes

### Quick Mode

Use when the user has a small task or wants to explore:
- collect only P0 fields
- propose sensible defaults
- create a compact script, character, shot, or page spec
- generate after confirmation when required

### Production Mode

Use for long, multi-scene, multi-character, or client-facing work:
- maintain the complete project state
- assign stable IDs
- use stage gates
- validate script causality before storyboard production
- validate continuity before prompt compilation
- maintain a revision log inside the task artifact

## Extension Architecture

Read `references/workflow-module-spec.md` before adding or using a new video type.
Read `references/module-registry.md` to see available modules and their ownership boundaries.

Keep the core stages stable. Add video types as workflow modules that define:
- additional intake fields
- stage defaults
- shot grammar
- page types
- continuity checks
- platform adapters
- example projects

Do not hard-code game UI, combat, or white-background sheets into the core workflow.

## Available Example Module

Read `references/examples-index.md` as the top-level case-library index.
Read `references/examples-cinematic-shot-prompts.md` for preserved shot-language formulas and worked prompt cases.

Read `references/examples-game-demos.md` for the game-demo examples. They demonstrate:
- character-card identity extraction
- prompt-framework substitution
- game menu and loadout pages
- gameplay HUD and boss battle shots
- cinematic combat key art

Use it as an example, not as a universal default.

Read `references/module-character-identity-board.md` for a worked module focused on premium white-background identity boards. It demonstrates:
- asymmetrical artbook-style character board layout
- separation between identity lock and layout language
- expression, silhouette, and detail-study subzones
- continuity rules for multi-view character consistency
- adapter-ready prompt examples for standalone character-board generation
