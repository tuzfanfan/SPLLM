# Page-Level Production Stage

A page is the smallest approved visual production unit. It may be a still image, storyboard frame, UI screen, keyframe, or start/end frame pair.

## Page Types

- `character-card`
- `environment-card`
- `asset-card`
- `storyboard-frame`
- `keyframe`
- `start-frame`
- `end-frame`
- `ui-screen`
- `gameplay-hud`
- `transition-frame`
- `combat-key-art`
- `product-beauty-shot`

New workflow modules may add page types.

## Page Template

```yaml
page:
  id: PAGE-01-01-A
  type:
  project_id: PROJECT-01
  scene_id:
  shot_id:
  purpose:
  output_medium: image
  aspect_ratio:
  inherited_references:
    characters: []
    assets: []
    location:
    style:
    shot_language:
  local_overrides:
    costume:
    expression:
    damage_state:
    lighting:
    palette:
    shot_language:
  composition:
    framing:
    camera_angle:
    perspective:
    subject_placement:
    foreground:
    midground:
    background:
    negative_space:
  action:
    start_state:
    peak_moment:
    end_state:
    motion_cues:
  interface:
    required: false
    hierarchy:
    panels:
    hud_elements:
    exact_text:
  continuity:
    previous_page:
    next_page:
    must_match:
  generation:
    platform:
    prompt_language:
    negative_constraints:
    variants_requested:
  approval:
    status: draft
    notes:
```

## Page Assembly

Compile the page in this order:

1. Load project visual bible.
2. Load the approved script beat linked to the scene or shot.
3. Load linked character, asset, and location cards.
4. Load scene and shot requirements.
5. Load the canonical shot-language block from `references/cinematic-shot-language.md`.
6. Apply explicit local overrides.
7. Define composition and readable peak action.
8. Add UI, typography, or HUD only when the page type requires them.
9. Produce the platform-neutral canonical page prompt.
10. Convert it into the selected platform adapter prompt.

## Page Review

Check:
- fidelity to the approved script beat
- identity match
- composition clarity
- shot-language fidelity and internal compatibility
- action readability
- continuity with previous and next pages
- UI hierarchy and exact text
- accidental style inheritance from prompt screenshots
- feasibility for the chosen generation method

## Revision Record

When revising a page, record:

```text
Page ID:
Observed drift:
Layer responsible:
Change:
Unchanged locks:
Downstream impact:
```

Fix the responsible layer only.
