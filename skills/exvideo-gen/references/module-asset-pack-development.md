# Asset Pack Development

`module.id: asset-pack-development`

Use this module when the user is not ready to jump into shots and instead needs a reusable visual asset system first. Typical requests include:

- build character and scene assets before storyboarding
- prepare costume variants for one recurring character
- create prop lock references for later prompts
- define a palette card per sequence or world
- generate reusable environment anchors before page production

Treat the asset pack as an upstream production layer. The goal is to stop later shots from inventing identity, wardrobe, props, and color logic from scratch every time.

## Module Definition

```yaml
module:
  id: asset-pack-development
  name: Asset Pack Development
  use_cases:
    - reusable asset preparation before storyboard
    - same-character multi-costume systems
    - key prop lock references
    - palette and look-dev control
    - scene-anchor asset building
  trigger_phrases:
    - asset pack
    - visual asset pack
    - costume variants
    - prop lock
    - palette card
    - look dev
  required_intake_fields:
    - core_subject
    - intended_use
    - asset_pack_goal
    - consistency_priority
    - current_deliverable
  optional_intake_fields:
    - character_count
    - costume_variant_count
    - key_prop_list
    - scene_anchor_list
    - palette_strategy
    - output_density
    - prohibited_drift
  default_visual_rules:
    - separate identity, costume, props, environment, and palette into distinct asset layers
    - do not rely on one master prompt to carry all continuity
    - create reusable assets before shot-specific variation
    - keep each asset page focused on one job
    - preserve color logic as an explicit artifact rather than a memory note
  shot_grammar:
    - asset-hero sheet
    - costume-variant sheet
    - prop lock sheet
    - palette card
    - scene-anchor page
  page_types:
    - character-asset-pack
    - costume-variant-board
    - prop-lock-board
    - palette-card
    - scene-anchor-board
  asset_types:
    - character-core-spec
    - costume-variant-spec
    - prop-lock-spec
    - palette-spec
    - scene-anchor-spec
  continuity_checks:
    - identity drift across costume variants
    - prop shape drift
    - palette mismatch between assets and later shots
    - environment anchor drift
    - overpacked asset pages that mix incompatible goals
  platform_adapters:
    - generic-image-model
    - generic-video-model
  example_projects:
    - high-consistency-world-asset-pack
```

## What This Module Changes

This module mainly modifies:
- Stage 2: Visual Bible
- Stage 3: Character and Asset Cards
- Stage 5: Page-Level Production
- Stage 6: Prompt Compilation

Keep the core intake, IDs, inheritance, and lock-state model unchanged.

## Core Principle

Build reusable truth before expressive variation.

1. lock identity
2. lock costume variants
3. lock props
4. lock scene anchors
5. lock palette cards
6. only then move into storyboards and shot prompts

## Intake Additions

```yaml
asset_pack:
  asset_pack_goal:
  character_count:
  costume_variant_count:
  key_prop_list: []
  scene_anchor_list: []
  palette_strategy: project-wide / sequence-based / character-based
  output_density: compact / standard / deep
  prohibited_drift:
    - face change across outfits
    - prop redesign
    - palette collapse
    - environment anchor rewrite
```

## Deliverable Routing

Choose one or more of these outputs:
- identity lock bullets
- costume variant sheet
- prop lock sheet
- scene anchor board
- palette card set
- adapter-ready prompt bundle

## Page Spec Template

```yaml
page:
  id: PAGE-ASSET-01
  type: character-asset-pack
  project_id: PROJECT-01
  workflow_module: asset-pack-development
  purpose: build reusable assets before shot generation
  must_match:
    - same character identity across all variants
    - stable prop geometry
    - explicit palette logic
    - reusable environment anchors
  avoid:
    - mixing scene storytelling into asset pages
    - treating one costume as permanent identity unless locked
    - vague color labels without visual anchor
```

## Prompt Construction Rules

When compiling prompts from this module:

1. separate asset families instead of stacking them into one prompt
2. describe image elements first
3. describe light and color second
4. describe consistency rules third
5. add negative or exclusion constraints last
6. preserve one palette artifact per major sequence or world state

## Example Archive

Read `references/examples-asset-pack-development.md` when you need preserved cases, source-method notes, or compact examples.

## Validation Checks

Before approving the spec or prompt, verify:
- the project actually needs reusable assets rather than only one hero frame
- each asset page has one primary continuity job
- costumes are separated from immutable identity
- props are described as reusable objects, not scene accidents
- palette logic can survive later shot generation
