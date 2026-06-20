# Dialogue Coverage

`module.id: dialogue-coverage`

Use this module when the user's main problem is staging and covering dialogue rather than spectacle or worldbuilding. Typical requests include:

- how to shoot two people talking
- reverse-shot planning
- over-shoulder versus single coverage
- confrontation dialogue with power imbalance
- dialogue scene with emotional escalation

Treat dialogue coverage as a relationship-reading problem. The goal is not to alternate random singles, but to map power, intimacy, threat, and interiority into a coherent shot plan.

## Module Definition

```yaml
module:
  id: dialogue-coverage
  name: Dialogue Coverage
  use_cases:
    - two-person dialogue coverage
    - emotional confrontation scenes
    - power-shift dialogue blocking
    - over-shoulder and reverse-shot planning
    - dialogue-first storyboard design
  trigger_phrases:
    - dialogue coverage
    - reverse shot
    - over shoulder
    - two person dialogue
    - conversation scene
  required_intake_fields:
    - scene_goal
    - speaker_count
    - relationship_state
    - tension_level
    - current_deliverable
  optional_intake_fields:
    - power_imbalance
    - intimacy_level
    - geography_clarity_priority
    - foreground_occluder_options
    - escalation_beats
    - dialogue_density
  default_visual_rules:
    - do not default to symmetrical shot-reverse-shot coverage without purpose
    - match framing logic to power, intimacy, and threat
    - use foreground, height, and lens choices to shape perceived power
    - wide or environmental resets should refresh geography, not dilute tension
    - choose inner versus outer reverse shots intentionally
  shot_grammar:
    - two-shot anchor
    - over-shoulder coverage
    - inner reverse single
    - outer reverse single
    - power close-up
    - geographic reset wide
    - insert reaction close-up
  page_types:
    - dialogue-coverage-board
    - power-framing-sheet
    - conversation-beat-storyboard
  asset_types:
    - relationship-blocking-spec
    - power-framing-rules
  continuity_checks:
    - eye-line drift
    - crossed screen direction
    - unexplained framing logic shifts
    - lost geography in high-tension exchanges
    - repeated same-size coverage with no emotional escalation
  platform_adapters:
    - generic-image-model
    - generic-video-model
  example_projects:
    - confrontation-dialogue-scene
```

## What This Module Changes

This module mainly modifies:
- Stage 4: Storyboard
- Stage 5: Page-Level Production
- Stage 6: Prompt Compilation

## Core Principle

Coverage must answer three questions:

1. who currently has power
2. whose interior state matters most
3. when the scene needs geography versus pressure

## Dialogue Coverage Logic

- `two-shot anchor`: establish shared space, relationship distance, and mutual geometry
- `inner reverse single`: favors interiority, pressure, and private emotional reading
- `outer reverse single`: favors relationship tension, threat, and physical opposition
- `over-shoulder`: keeps relational tension alive while focusing one speaker
- `foreground occlusion`: can strengthen the apparent force of the blocked or dominant party
- `wide reset`: reintroduces geography or changes scene energy after a concentrated exchange

## Intake Additions

```yaml
dialogue_coverage:
  relationship_state:
  power_imbalance: balanced / unstable / one-sided
  intimacy_level: low / medium / high
  geography_clarity_priority: low / medium / high
  escalation_beats: []
  foreground_occluder_options: []
```

## Shot Selection Heuristics

- Use inner reverse singles when the scene is about felt interior damage, shame, doubt, or compressed emotional pressure.
- Use outer reverse singles when the scene is about open relational conflict, threat, pursuit, or physical readiness.
- Use a wider frame when the audience must understand who can move where.
- Add a close-up or tighter single when the scene crosses into a new emotional phase.
- Use height difference, foreground blocking, and lens compression to reinforce power imbalance.

## Example Archive

Read `references/examples-dialogue-coverage.md` when you need preserved method notes or compact examples.
