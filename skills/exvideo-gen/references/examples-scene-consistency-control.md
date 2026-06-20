# Scene Consistency Control Examples

Use this file as the archive for concrete scene-consistency cases. Keep method articles, source notes, preserved prompt blocks, and workflow-specific examples here so `module-scene-consistency-control.md` can stay focused on reusable guidance.

## Usage Rules

- Treat examples as references, not universal defaults.
- Preserve source method wording when the goal is archival recall.
- Move only generalized control logic back into `module-scene-consistency-control.md`.
- Record which parts of each example are stable method lessons and which are source-specific tool or model choices.

## Example 01: Five Methods For AI Video Scene Consistency

### Status

- Type: source-method example
- Purpose: preserve the article's five-method control framework and convert it into reusable workflow language for `exvideo-gen`
- Default inheritance: partial
- Replace before reuse: concrete scene subject, platform names, and any source-specific model preference

### Source

- Source article: `C:/Users/Administrator/Desktop/下载池/AI视频制作场景一致性解决方案：从盲目抽卡到精准控场的五种方法-2026年06月19日-来自【Get 笔记】.md`
- Companion extraction: `E:/SPLLM/outputs/video-ocr-7634523224475058771/full-pass-v1/merged.note-and-delivery.md`
- Workflow family: `scene-consistency-control`

### What This Example Covers

- 俯视图 + 场景九宫格
- 场景九宫格 + 人物设定 + 全能参考模式
- 720 度全景图取景
- 360 度环绕视频截图
- 基于已有关键信息的改机位与补镜头

### Method Summary

The article's reusable core idea is simple:

1. Do not let the model guess the whole space again on every shot.
2. Lock one environment first.
3. Extract or plan camera angles from that locked environment.
4. Bind character identity separately.
5. Use segmented shot instructions for motion and timing.
6. Use re-angle or repair-shot logic only after the scene is stable.

### Reusable Mapping Into `exvideo-gen`

| Source Method | Internal Method Family | Best Use |
|---|---|---|
| 俯视图 + 场景九宫格 | `topdown-grid` | strongest spatial reasoning, dialogue coverage, room geography |
| 场景九宫格 + 人物设定 + 全能参考模式 | `full-reference-clip` | short continuous clips with scene and character locks |
| 720 度全景图 | `panorama-source` | environment-first multi-angle extraction |
| 360 度环绕视频截图 | `orbit-capture` | fast background library for wide and medium-wide shots |
| 改机位 / 补镜头 | `repair-shot-reframe` | missing coverage, reverse shot, transition angle |

### Preserved Operational Details

#### A. Topdown Grid Logic

- Start from one stable scene image.
- Generate a top-down interpretation of the space.
- Derive a 3x3 angle grid from that space.
- Use the grid to decide:
  - dialogue angles
  - establishing angles
  - insert or key dramatic angles

#### B. Full Reference Continuous Clip Logic

- Keep scene references and character references separate.
- Do not write a loose plot summary.
- Split a short clip into timed blocks.
- For each block, specify:
  - time
  - shot size
  - subject action
  - camera motion

#### C. Panorama Logic

- Build one complete panoramic environment first.
- Extract needed angles interactively from the same space.
- Watch distortion risk on extreme wide edges.
- Prefer medium focal logic when realism matters.

#### D. Orbit Capture Logic

- Generate a rotating environment pass.
- Extract background frames from the pass.
- Use it when speed matters more than free shot grammar.

#### E. Repair-Shot Logic

- Start from one approved frame.
- Change only camera position or angle.
- Keep subject position, room layout, and light logic unchanged unless explicitly overridden.

### Preserved Example Shot Grammar

This example strongly supports segmented shot instructions over plot summary.

Structural pattern:

```text
00:00-00:03 [shot size and angle], [subject action], [camera motion], [sound cue], [continuity dependency]
00:03-00:06 [shot size and angle], [subject action], [camera motion], [sound cue], [continuity dependency]
```

### What To Preserve

- 先锁空间，再选镜头
- 分离环境参考与人物参考
- 用分段镜头说明替代剧情简介
- 把全景、环绕、补镜头看成同一控制链上的不同工具
- 优先在已锁定空间上提角度，而不是重复随机生图

### What To Replace Before Reuse

- Source-specific platform recommendations
- Any one-model preference that does not generalize
- The castle-room example if the new project uses a different environment
- Any direct dependence on one UI or site workflow

### Reuse Note

When reusing this example, start from `module-scene-consistency-control.md` and pull source-specific details only when the current project needs the same control method family.

## Example 02: Panorama, Orbit, And Re-Angle Repair Workflow

### Status

- Type: source-method example
- Purpose: preserve the environment-first workflow for fast multi-angle continuity and repair coverage
- Default inheritance: partial
- Replace before reuse: exact platform names, source scene subject, and one-model claims

### What This Example Covers

- 720 panorama scene generation for complete space capture
- 360 orbit clip generation for quick angle harvesting
- medium focal preference to reduce panorama distortion
- direct camera re-angle from one approved image
- using storyboard-like image tables as intermediate control assets

### What To Preserve

- lock one complete environment before farming angles from it
- use panorama when you need flexible angle picking from one space
- use orbit capture when you need speed more than full shot grammar freedom
- prefer medium focal logic when panorama edges would distort character composites
- use re-angle repair prompts to patch coverage gaps instead of rebuilding the scene

### What To Replace Before Reuse

- the exact platform UI flow
- any claim that one model is universally best
- the demo-specific office or castle room subject
