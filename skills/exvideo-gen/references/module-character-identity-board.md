# Character Identity Board

`module.id: character-identity-board`

Use this module when the user wants a premium character board rather than a technical turnaround sheet. Typical requests include:
- role identity board
- white-background character sheet
- artbook-style character layout
- character study board for later image or video generation
- expression, silhouette, and costume research page

Treat the board as a production page that strengthens downstream consistency. The board is not only presentation; it is also a reusable identity lock artifact for later shots and prompts.

## Module Definition

```yaml
module:
  id: character-identity-board
  name: Character Identity Board
  use_cases:
    - 角色身份板
    - 艺术化角色研究页
    - 白底角色设定页
    - 多视角身份锁定页
    - 供后续视频生成复用的角色母页
  trigger_phrases:
    - identity board
    - character board
    - character sheet
    - 角色板
    - 身份板
    - 设定页
    - 白底角色研究
  required_intake_fields:
    - core_character_identity
    - role_or_archetype
    - aspect_ratio
    - board_goal
    - consistency_priority
  optional_intake_fields:
    - board_text_language
    - board_text_density
    - board_mood
    - cultural_inspiration
    - required_views
    - prohibited_elements
  default_visual_rules:
    - 纯白或柔和米白背景
    - 不使用环境叙事补位
    - 角色之间不得重叠
    - 保持充足留白和视觉分区
    - 优先使用非对称艺术书布局而非网格
  page_types:
    - identity-board
    - expression-sheet
    - silhouette-sheet
    - detail-study
    - turnaround-lite
  asset_types:
    - character-core-spec
    - costume-spec
    - expression-range
    - silhouette-set
  continuity_checks:
    - 脸型、五官比例和发型轮廓一致
    - 服装主轮廓和层次一致
    - 身体比例一致
    - 手部清晰可见
    - 不同视角仍能识别为同一角色
    - 文字区不抢主体
    - 版式保持艺术性而非技术说明书化
  platform_adapters:
    - generic-image-model
  example_projects:
    - generic-character-identity-board
```

## What This Module Changes

This module mainly modifies:
- Stage 3: Character and Asset Cards
- Stage 5: Page-Level Production
- Stage 6: Prompt Compilation

Keep the core intake, IDs, inheritance, and lock-state model unchanged.

## Intake Additions

Add these fields when the user asks for a board:

```yaml
identity_board:
  board_goal:
  layout_mode: artbook-asymmetric / technical-clean / editorial-minimal
  background_mode: pure-white / soft-ivory
  text_language: AUTO
  text_density: sparse / medium
  hero_view_required: true
  study_zones:
    - portraits
    - expressions
    - silhouettes
    - costume-details
  required_views:
    - hero-full-body
    - neutral-full-body
    - back-view
    - side-view
  prohibited_elements:
    - environment
    - overlapping-figures
    - props-not-in-identity
```

## Board Grammar

Use this visual grammar unless the user overrides it:

1. Place one hero full-body figure as the anchor.
2. Surround it with clearly separated supporting studies.
3. Keep all figures fully readable with no merged poses.
4. Use white space as structure, not filler.
5. Reserve small zones for silhouette, expression, and detail studies.
6. Keep text minimal and editorial.
7. Preserve identity more strictly than pose variety.

Avoid:
- grid-heavy technical presentation
- scene-like compositions
- repeated same-scale panels
- props or environments that dilute identity reading
- aggressive typography

## Deliverable Routing

Choose one or more of these outputs:
- canonical character text spec
- identity lock bullets
- board page spec
- adapter-ready image prompt
- downstream reuse note for storyboard or video prompts

If the user only wants a single finished board, still write a compact identity lock so later prompts can reuse the same character.

## Page Spec Template

```yaml
page:
  id: PAGE-CHAR-01
  type: identity-board
  project_id: PROJECT-01
  character_ids: [CHAR-01]
  purpose: 用一张艺术性角色身份板锁定角色的脸、轮廓、服装、姿态语言和情绪范围
  aspect_ratio: 16:9
  output_medium: image
  board_layout:
    background: soft-ivory
    composition: asymmetrical artbook
    hero_anchor: off-center full-body
    overlap_allowed: false
    negative_space_priority: high
  required_views:
    - hero-full-body
    - neutral-full-body
    - back-view
    - side-view
    - seated
    - leaning
    - crouching
    - top-down-body-angle
    - low-angle-body-view
    - expressive-portraits
  study_zones:
    silhouettes: 2-3 simplified black silhouettes
    expressions: subtle emotional range
    details: face, hair, costume features
  text_block:
    fields: [Name, Role, Core Mood, Visual Signature]
    handwritten_notes: minimal
  must_match:
    - same face
    - same hairstyle
    - same costume system
    - same body proportions
    - same visual personality
  avoid:
    - environment
    - props
    - logo
    - watermark
    - overlapped figures
    - cropped faces
```

## Prompt Construction Rules

When compiling prompts from this module:

1. Separate identity from layout.
2. State prohibited elements explicitly.
3. State anti-patterns explicitly when needed:
   - not a standard reference sheet
   - not a blueprint
   - not a grid
4. List required views as distinct studies.
5. Reinforce consistency across all views.
6. If the character role suggests objects, remove them unless the user wants them locked into identity.

Useful wording patterns:
- "Each view should feel like an independent clean character study."
- "Do not overlap any figures."
- "Keep strict identity consistency across all studies."
- "Use asymmetrical artbook composition rather than a technical turnaround layout."

## Compact Example

### Example Project

```yaml
project:
  id: PROJECT-CHAR-BOARD-01
  title: Generic Character Identity Board
  workflow_module: character-identity-board
  intended_use: 锁定角色母设定，供后续图像与视频生成复用
  target_duration: N/A
  aspect_ratio: 16:9
  current_deliverable: 单张角色身份板

character:
  id: CHAR-01
  name: AUTO
  narrative_role: 任意角色原型
  locked_traits:
    - clear facial identity
    - recognizable hairstyle silhouette
    - stable costume silhouette
    - readable body proportions
    - consistent pose language
  open_traits:
    - specific archetype or profession
    - cultural styling
    - costume detailing density
    - text language

identity_board:
  board_goal: 帮助模型理解角色的面部、轮廓、服装、姿势和情感范围
  layout_mode: artbook-asymmetric
  background_mode: soft-ivory
  text_density: sparse
  hero_view_required: true
  prohibited_elements:
    - environment
    - props
    - logo
    - watermark
```

### Example Adapter Prompt

Use this as a structural example, not a mandatory default:

```text
Create a single highly artistic 16:9 character identity board for one character. Pure white to soft ivory background only. No environment, no props unless explicitly part of the identity, no symbols, no watermark, no scene framing.

Do not make a standard reference sheet, turnaround sheet, blueprint, grid, or catalog. Create a cinematic, premium animation studio artbook layout with elegant asymmetry, large negative space, varied image scales, and memorable editorial composition.

Keep one large hero full-body view slightly off-center as the visual anchor. Arrange clearly separated supporting studies around it with generous breathing room: neutral full-body, back view, side view, seated pose, leaning pose, crouching pose, top-down body angle, low-angle body view, and expressive portrait studies. Do not overlap any character images. Do not crop faces. Do not hide limbs. Do not stack bodies.

Maintain strict identity consistency across every study: same face, same facial proportions, same hairstyle, same costume, same body proportions, same pose language, same visual personality.

Character design: use the supplied role or archetype as the identity anchor. Give the character a clear facial shape, a distinct hairstyle silhouette, a readable costume silhouette, stable body proportions, clear hands, and a strong visual personality suitable for later image and video generation. Preserve role-specific styling only when it supports identity clarity. Avoid unnecessary props or environment-based storytelling.

Include a small silhouette study area with 2-3 simplified black character silhouettes, a small expression study area with subtle emotional variation, and a small detail study area focused on face, hair, and costume features.

Add a minimal stylish character ID block using only: Name, Role, Core Mood, Visual Signature. Allow tiny handwritten notes only where helpful. Keep all typography restrained and artistic.

The final image should feel like an expressive production-ready character identity board designed to help later AI image and video generation understand the character clearly.
```

## Example Archive

Read `references/examples-identity-boards.md` when you need concrete prompt references, preserved user originals, or side-by-side board examples.
Read `references/examples-index.md` when you need the full archive map across all example families.

Use the archive to:
- recall exact user wording that should be preserved
- compare generic templates against concrete role-specific prompts
- expand the module with additional identity-board examples without bloating this file

## Validation Checks

Before approving the board spec or prompt, verify:
- the request is truly identity-first, not scene-first
- the board can be generated without environment support
- no study zone duplicates the same function
- required views are separated and readable
- identity lock is reusable in later storyboard or shot prompts

## Reuse Note

After this module produces a board, extract a short downstream identity lock in 5-10 bullets. Reuse that lock in storyboard pages, keyframes, and video prompts instead of repeating the full board description every time.
