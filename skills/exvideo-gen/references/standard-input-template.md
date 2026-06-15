# Standard Input Template

Copy only the sections needed for the current project. Leave unknown fields as `UNKNOWN`, use `AUTO` for recommendations, and use `INHERIT` for inherited values.

## A. Project

```yaml
project:
  title:
  workflow_module: AUTO
  intended_use:
  audience:
  target_duration:
  aspect_ratio:
  distribution_platform:
  current_goal:
  current_deliverable:
  target_generation_platform: UNKNOWN
```

## B. Source Materials

```yaml
materials:
  - id: REF-01
    file_or_description:
    role: identity-reference
    preserve:
    may_change:
    must_not_copy:
```

Role options: `identity-reference`, `style-reference`, `composition-reference`, `motion-reference`, `prompt-framework`, `edit-target`, `content-source`.

## C. Story and Script

```yaml
story:
  premise:
  communication_goal:
  script_mode: original / adapt / restructure / narration / dialogue
  target_script_format: synopsis / treatment / beat-sheet / scene-outline / full-script
  reference_works: []
  protagonist_obsession:
  protagonist_inner_flaw:
  midpoint_reversal:
  climax_conflict:
  core_theme:
  causal_chain:
  beginning_state:
  turning_point:
  ending_state:
  must_keep: []
  prohibited_reuse: []
  originality_changes: []
```

For story-core reconstruction or reference-based rewriting, use the complete copyable form in `references/script-writing-stage.md`.

## D. Visual Bible

```yaml
visual_bible:
  world_and_era:
  medium_and_rendering:
  art_direction:
  palette: AUTO
  lighting: AUTO
  camera_language: AUTO
  motion_language: AUTO
  preferred_shot_sizes: []
  preferred_compositions: []
  preferred_camera_angles: []
  preferred_lenses: []
  depth_of_field: AUTO
  edit_rhythm: AUTO
  typography_or_ui:
  avoid: []
```

## E. Character Request

```yaml
character:
  id: CHAR-01
  source: REF-01
  creation_mode: extract / design / redesign
  narrative_role:
  locked_traits: []
  open_traits: []
  allowed_variants: []
  required_card_pages:
    - three-view
    - expressions
    - outfit-and-equipment
    - palette
```

## F. Storyboard Request

```yaml
storyboard:
  source_script_or_beats:
  target_scene_count: AUTO
  target_shot_count: AUTO
  required_shots: []
  shot_language_defaults:
    composition: AUTO
    shot_size: AUTO
    camera_angle: AUTO
    camera_movement: AUTO
    lens: AUTO
    depth_of_field: AUTO
    lighting: INHERIT
    atmosphere: INHERIT
  pacing:
  dialogue_or_voiceover:
  music_or_sound_direction:
  continuity_priorities: []
```

## G. Page-Level Request

Repeat for each required page:

```yaml
page:
  id: PAGE-01
  type:
  linked_scene:
  linked_shot:
  purpose:
  character_ids: []
  asset_ids: []
  composition:
  action_or_peak_moment:
  local_overrides:
  ui_or_text:
  exact_text:
  output_medium: image
  variants_requested: 1
  must_match: []
```

## H. Approval and Locks

```yaml
approval:
  generate_after_each_stage: false
  require_script_approval: true
  require_storyboard_approval: true
  locked_project_fields: []
  locked_character_fields: []
  allowed_agent_assumptions: []
  prohibited_changes: []
```

## Minimal Start

For a fast start, provide only:

```text
项目用途：
时长与画幅：
现有材料：
故事来源：原创 / 改编 / 结构重构 / 口播 / 对话
脚本文案目标：
核心角色或主体：
希望先完成：脚本文案 / 角色卡 / 分镜 / 页面 / 最终提示词
必须保留：
禁止改动：
```

The agent should expand this into the full project state and ask only the next blocking questions.
