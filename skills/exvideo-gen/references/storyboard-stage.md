# Storyboard Stage

Use this stage to move from story intent to a shootable and generatable sequence.

Read `references/script-writing-stage.md` first when the project requires story, narration, dialogue, adaptation, or structural rewriting. Treat the approved canonical script as upstream truth.
Read `references/cinematic-shot-language.md` before assigning camera vocabulary.

## Story Layers

Work in this order:

```text
approved script -> beats -> scenes -> shots -> pages
```

Do not write detailed prompts before the shot structure is stable.
Do not silently rewrite locked midpoint, climax, ending, dialogue, or theme decisions for visual convenience.

## Scene Template

```yaml
scene:
  id: SCENE-01
  title:
  narrative_function:
  location_id:
  time_and_weather:
  entering_state:
  exiting_state:
  characters_present: []
  required_assets: []
  dramatic_beat:
  continuity_from:
  continuity_to:
```

## Shot Template

```yaml
shot:
  id: SHOT-01-01
  scene_id: SCENE-01
  purpose:
  duration_seconds:
  shot_language:
    narrative_intent:
    composition:
    shot_size:
    camera_angle:
    camera_view:
    camera_movement:
    lens:
    depth_of_field:
    focus_treatment:
    lighting_direction:
    lighting_quality:
    color_atmosphere:
    rationale:
  subject_blocking:
  action_sequence:
  expression_or_emotion:
  start_state:
  end_state:
  foreground_midground_background:
  dialogue_or_text:
  sound_and_music:
  transition_in:
  transition_out:
  continuity_dependencies: []
  required_pages: []
```

## Action Timing

For shots longer than one simple action, use beats:

```text
0.0-1.5s:
1.5-3.0s:
3.0-5.0s:
```

Each beat should change one primary visual state. Split the shot when:
- the camera performs incompatible moves
- the subject teleports or changes pose without a readable transition
- more than one climax competes for attention
- the duration cannot support the listed actions

## Continuity Fields

Track these explicitly:
- screen direction
- eyeline
- hand and weapon occupancy
- costume and damage state
- prop location
- environment condition
- time of day
- emotional state
- start/end pose

## Storyboard Table

For user review, present a compact table:

| Shot ID | Duration | Purpose | Framing | Camera | Action | Start -> End | Required page |
|---|---:|---|---|---|---|---|---|

## Storyboard Gate Checklist

- Every shot advances story, information, emotion, or spectacle.
- Shot duration matches action complexity.
- Start and end states connect to neighboring shots.
- Camera movement has a reason.
- Shot size, composition, angle, movement, lens, focus, and lighting use the canonical shot-language fields.
- The selected shot-language combination supports the narrative purpose without contradictory instructions.
- Key characters and props are linked by ID.
- Required keyframes or start/end frames are identified.
- Every scene and shot can be traced to an approved script beat or explicit non-narrative production purpose.
