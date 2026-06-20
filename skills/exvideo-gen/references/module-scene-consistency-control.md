# Scene Consistency Control

`module.id: scene-consistency-control`

Use this module when the user's main problem is not story invention but keeping one scene, room, street, set, or environment stable across multiple shots, angles, or generations. Typical requests include:
- 鍦烘櫙涓€鑷存€?
- 鎺у満
- 澶氭満浣嶅悓绌洪棿
- 鍏堥攣绌洪棿鍐嶅垏闀滃ご
- 杩炵画闀滃ご涓嶇┛甯?
- 琛ラ暅澶翠絾涓嶆兂閲嶅缓鏁翠釜鍦烘櫙

Treat scene consistency as a control layer that sits across Stage 2 to Stage 7. The goal is to stop the model from re-inventing space on every shot.

## Module Definition

```yaml
module:
  id: scene-consistency-control
  name: Scene Consistency Control
  use_cases:
    - multi-shot same-space scene planning
    - stable interior or exterior continuity
    - continuous scene generation from one locked environment
    - panorama or orbit based angle extraction
    - repair-shot generation from an approved base frame
    - storyboard generation for consistency-first video workflows
  trigger_phrases:
    - scene consistency
    - lock the space first
    - scene continuity
    - multi-angle same room
    - panorama scene control
    - orbit capture
    - re-angle from one frame
  required_intake_fields:
    - core_scene_reference
    - aspect_ratio
    - current_deliverable
    - continuity_priority
    - space_control_method
  optional_intake_fields:
    - space_anchor_description
    - scene_topology
    - camera_angle_library
    - character_identity_reference
    - reference_bundle_mode
    - beat_duration_hint
    - preferred_focal_band
    - panorama_source
    - orbit_source
    - repair_shot_goal
    - lighting_invariants
    - prop_anchor_list
    - prohibited_drift
  default_visual_rules:
    - preserve room topology before adding shot variation
    - preserve light direction and dominant practical sources
    - preserve anchor props and their rough spatial relations
    - preserve screen direction unless a shot explicitly reverses it
    - prefer extracting angles from one locked space model over regenerating unrelated single shots
    - prefer medium focal logic for panorama-derived backgrounds when realism matters
  shot_grammar:
    - space-anchor shot
    - dialogue coverage from locked positions
    - insert shot anchored to existing geography
    - panorama-derived angle
    - orbit-capture background shot
    - repair-shot re-angle
  page_types:
    - space-topdown-board
    - scene-grid-board
    - panorama-source-page
    - orbit-capture-page
    - continuity-shot-sheet
    - shot-reframe-page
    - visual-storyboard-page
  asset_types:
    - space-model
    - angle-library
    - scene-anchor-spec
    - panorama-base
    - orbit-base
    - repair-shot-spec
  continuity_checks:
    - room layout drift
    - camera-side drift
    - light-direction drift
    - prop anchor drift
    - window and door position drift
    - character-to-background mismatch
    - panorama edge distortion risk
    - repair-shot compatibility with previous approved shot
  platform_adapters:
    - generic-image-model
    - generic-video-model
  example_projects:
    - castle-room-scene-consistency
```

## What This Module Changes

This module mainly modifies:
- Stage 2: Visual Bible
- Stage 4: Storyboard
- Stage 5: Page-Level Production
- Stage 6: Prompt Compilation
- Stage 7: Review and Revision

Keep the core intake, IDs, inheritance, and change-lock model unchanged.

## Core Principle

Use this rule everywhere in the module:

1. Lock the space.
2. Build the angle library.
3. Add character continuity.
4. Add shot timing and movement.
5. Use repair shots only after the base space is stable.

Do not let prompt wording jump directly from scene idea to many unrelated shots without a shared space anchor.

## Method Families

This module supports five method families. They are tools inside one control layer, not five unrelated workflows.

### 1. Topdown Grid

Use when the user wants the clearest possible spatial reasoning.

- First output: a top-down space model
- Second output: a 3x3 or equivalent angle grid
- Best for: dialogue coverage, geography-heavy scenes, blocking logic

### 2. Full Reference Continuous Clip

Use when the user wants a short continuous scene built from:
- scene angle references
- character references
- segmented shot instructions

Best for:
- 5s to 20s continuous clips
- multi-beat actions in one room
- models that accept strong reference bundles

Operational rule:

- Do not send only a plot summary.
- Split the clip into timed blocks.
- A strong default is `3 seconds per beat` unless the motion logic clearly needs a different rhythm.
- For each beat, specify time window, shot size, subject action, and camera motion.

### 3. Panorama Source

Use when the user wants to extract multiple angles from one complete panoramic space.

Best for:
- environment-first workflows
- fast angle picking
- continuity-first background generation

Operational rule:

- Prefer medium focal assumptions when converting panorama output into reusable backgrounds.
- Warn about edge distortion before using extreme-wide panorama areas for character-composite shots.

### 4. Orbit Capture

Use when the user wants a quick background library from a rotating or orbiting view.

Best for:
- full shot and medium-wide shot backgrounds
- rapid scene coverage
- later character compositing

### 5. Repair-Shot Reframe

Use when the user already has one approved shot and wants:
- reverse shot
- higher angle
- lower angle
- over-shoulder
- transition angle
- patch shot for storyboard completeness

Best for:
- fixing coverage gaps
- adding one missing angle without rebuilding the whole scene

## Intake Additions

Add these fields when the request is consistency-first:

```yaml
scene_consistency:
  space_control_method: topdown-grid / full-reference-clip / panorama-source / orbit-capture / repair-shot-reframe
  continuity_priority: high / very-high
  space_anchor_description:
  scene_topology:
    environment_type:
    dominant_landmarks: []
    entry_exit_points: []
    practical_light_sources: []
    key_prop_anchors: []
  camera_angle_library:
    required_angles: []
    prohibited_angles: []
  reference_bundle_mode: separate-scene-and-character / merged-scene-with-characters
  beat_duration_hint: 3s-default / custom
  preferred_focal_band: 50mm-plus / custom
  character_background_binding:
    required: true
    identity_reference_mode: separate
  repair_shot_goal:
  prohibited_drift:
    - room topology rewrite
    - swapped light direction
    - missing anchor furniture
    - unrelated wall or window redesign
```

## Stage Mapping

### Stage 2: Visual Bible Additions

Lock these scene-wide fields once:

```yaml
scene_invariants:
  space_model_strategy:
  room_topology_lock:
  camera_side_rules:
  light_direction_lock:
  prop_anchor_lock:
  environment_density_lock:
```

### Stage 4: Storyboard Additions

Each shot should declare how it inherits the space:

```yaml
shot:
  space_control_method:
  space_anchor:
  inherited_angle_family:
  continuity_dependency:
  allowed_local_override:
```

### Stage 5: Page-Level Production Additions

Prefer these page types:
- `space-topdown-board`
- `scene-grid-board`
- `panorama-source-page`
- `orbit-capture-page`
- `continuity-shot-sheet`
- `shot-reframe-page`

### Stage 6: Prompt Compilation Additions

When compiling prompts, keep the shot description structured:

```yaml
prompt_control_fields:
  time_window:
  shot_size:
  subject_action:
  camera_motion:
  sound_cue:
  space_lock_source:
  character_lock_source:
```

Do not collapse the shot into a loose plot paragraph when continuity is the primary goal.

## Shot Instruction Grammar

When the user wants segmented shot control, describe each beat with:

1. time window
2. shot size
3. camera angle
4. subject action
5. camera motion
6. sound cue if relevant
7. continuity dependency

Preferred compact form:

```text
00:00-00:03 high-angle wide establishing shot, woman enters from lower doorway and slows near the long table, camera gently cranes down and pushes forward, footsteps and fireplace sound, must preserve fireplace-window-table spatial relation from space grid
```

Avoid vague forms like:
- "the scene continues"
- "the mood intensifies"
- "show the room from another angle"

Those are too weak to preserve geography.

For short continuous clips, a practical default is:

```text
00:00-00:03 ...
00:03-00:06 ...
00:06-00:09 ...
```

Use longer beats only when the camera action or blocking needs room to breathe.

## Page Spec Template

```yaml
page:
  id: PAGE-SCENE-01
  type: scene-grid-board
  project_id: PROJECT-01
  purpose: lock one environment before generating multiple shots
  aspect_ratio: 16:9
  workflow_module: scene-consistency-control
  space_control_method: topdown-grid
  inherited_references:
    environment: [ASSET-SCENE-01]
    characters: [CHAR-01, CHAR-02]
  must_match:
    - same room topology
    - same fireplace and window relation
    - same table placement
    - same light direction
  avoid:
    - rewritten walls
    - missing anchors
    - random furniture swaps
    - contradictory door positions
```

## Prompt Construction Rules

When compiling prompts from this module:

1. Separate environment lock from character lock.
2. State the source of spatial truth explicitly.
3. Prefer angle extraction over scene re-invention.
4. Name anchor props and dominant light sources.
5. If using panorama or orbit methods, warn about distortion and shot-size limits.
6. If using repair-shot reframe, specify what must stay unchanged.
7. If using segmented clip prompts, prefer explicit beat timing over loose story summary.

Useful wording patterns:
- "Preserve the exact room topology and landmark relationships from the approved base scene."
- "Change only camera position and framing, not environment design."
- "Keep fireplace, window, table, and doorway positions consistent with the locked scene reference."
- "Maintain the same light direction and practical light logic."

## Compact Example

### Example Project

```yaml
project:
  id: PROJECT-SCENE-01
  title: Castle Room Scene Consistency
  workflow_module: scene-consistency-control
  intended_use: generate a stable multi-shot interior sequence
  aspect_ratio: 16:9
  current_deliverable: continuity-first storyboard and prompt package

scene_consistency:
  space_control_method: full-reference-clip
  continuity_priority: very-high
  space_anchor_description: nineteenth-century castle room with fireplace, long table, tall window, stone walls, side doorway
  prohibited_drift:
    - room topology rewrite
    - swapped fireplace/window relation
    - random furniture redesign
    - changed light direction
```

### Example Reuse Logic

- Build or select one stable room reference.
- Derive an angle library from topdown, panorama, or orbit.
- Bind character references separately.
- Write segmented shot beats instead of a loose synopsis.
- Use repair-shot reframing only for missing coverage.

## Example Archive

Read `references/examples-scene-consistency-control.md` when you need concrete method cases, source article notes, or preserved workflow examples.
Read `references/examples-index.md` when you need the full archive map across all example families.

## Validation Checks

Before approving the spec or prompt, verify:
- the user's real problem is continuity, not only cinematic style
- the method family matches the need for speed versus control
- the environment and character references are separated correctly
- the shot instructions are operational and not just narrative summary
- a missing angle is solved with repair-shot logic before rebuilding the whole scene

## Stop Conditions

Pause and ask for confirmation only if:
- the user wants to replace the locked space model mid-project
- the requested shot requires a topology change that conflicts with previous locks
- the same artifact is being used as both environment truth and character truth in a way that will cause drift

## Reuse Note

After this module produces a stable scene package, extract a short continuity lock in 5-10 bullets. Reuse that lock in later page prompts instead of repeating the full scene description every time.
