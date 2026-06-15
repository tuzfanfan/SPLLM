# Cinematic Shot Language

Use this reference whenever a script, storyboard, page, keyframe, or generation prompt needs explicit cinematic shot design.

## Core Formula

```text
composition
+ shot size
+ camera angle
+ camera movement
+ lighting
+ atmosphere
+ lens
+ depth of field or focus treatment
```

The formula is a selection framework, not a requirement to force all eight fields into every shot. Choose only the fields that serve the narrative function and remain compatible with the target duration and generation model.

## Production Responsibilities

- Script stage: record visual intention only when it affects storytelling, reveal, emotion, or rhythm.
- Visual bible: define project-wide camera, lens, lighting, and focus tendencies.
- Storyboard stage: select the shot-specific combination and explain its purpose.
- Page stage: inherit the approved shot design and convert it into a readable frame.
- Prompt compilation: translate canonical fields into platform-appropriate natural language.

Do not use camera vocabulary as decoration. Every major choice should support information, emotion, spatial clarity, subject status, or transition.

## Shot Size

| Canonical Value | Chinese | Common English |
|---|---|---|
| `close-up` | 特写 | Close-Up |
| `medium-close-up` | 近景 | Medium Close-Up |
| `medium-shot` | 中景 | Medium Shot |
| `full-shot` | 全景 | Full Shot |
| `long-shot` | 远景 | Long Shot |
| `extreme-long-shot` | 大全景 | Extreme Long Shot |
| `cowboy-shot` | 牛仔景 | Cowboy Shot |
| `two-shot` | 双人镜头 | Two-Shot |
| `group-shot` | 群像镜头 | Group Shot |

## Composition

| Canonical Value | Chinese | Common English |
|---|---|---|
| `centered` | 中心构图 | Centered Composition |
| `symmetrical` | 对称构图 | Symmetrical Composition |
| `rule-of-thirds` | 三分构图 | Rule of Thirds |

Composition and shot size are separate fields. A medium shot may use centered, symmetrical, or rule-of-thirds composition.

## Camera Angle and View

| Canonical Value | Chinese | Common English |
|---|---|---|
| `eye-level` | 平视角度 | Eye-Level Shot |
| `high-angle` | 俯视角度 | High Angle |
| `low-angle` | 仰视角度 | Low Angle |
| `side-profile` | 侧面视角 | Side Profile |
| `overhead` | 顶视 | Overhead Shot |
| `back-view` | 背视 | Back View |
| `birds-eye` | 鸟瞰 | Bird's-Eye View |
| `worms-eye` | 虫视／地面视角 | Worm's-Eye View |
| `dutch-angle` | 倾斜镜头 | Dutch Angle |

## Camera Movement and Optical Effects

| Canonical Value | Chinese | Common English |
|---|---|---|
| `slow-push-in` | 镜头慢推 | Slow Push-In |
| `pull-out` | 镜头拉远 | Pull-Out |
| `tracking` | 跟随镜头 | Tracking Shot |
| `orbit-360` | 环绕镜头 | 360-Degree Orbit |
| `dolly-zoom` | 希区柯克变焦 | Dolly Zoom |
| `static` | 固定镜头 | Static Shot |

Wide-angle is a lens choice, not camera movement. Dutch angle is an angle or framing choice, not camera movement.

## Lighting and Atmosphere

| Canonical Value | Chinese | Common English |
|---|---|---|
| `cinematic-lighting` | 电影布光 | Cinematic Lighting |
| `natural-light` | 自然光 | Natural Light |
| `rembrandt-light` | 伦勃朗光 | Rembrandt Lighting |
| `rim-light` | 轮廓光 | Rim Light |
| `backlight` | 逆光 | Backlight |
| `chiaroscuro` | 明暗对比光 | Chiaroscuro Lighting |
| `soft-light` | 柔光 | Soft Light |
| `hard-light` | 硬光 | Hard Light |
| `tyndall-light` | 丁达尔光 | Tyndall Light |
| `cool-tone` | 冷色调光 | Cool-Tone Lighting |
| `warm-tone` | 暖色调光 | Warm-Tone Lighting |
| `neon-lighting` | 霓虹光 | Neon Lighting |

Separate light direction and quality from color atmosphere where useful. For example, `rim-light + backlight + warm-tone` is a valid combination.

## Lens and Focus

| Canonical Value | Chinese | Common English |
|---|---|---|
| `macro` | 微距镜头 | Macro Lens |
| `telephoto` | 长焦镜头 | Telephoto Lens |
| `24mm-wide` | 24mm 广角 | 24mm Wide-Angle Lens |
| `35mm` | 35mm 人文 | 35mm Lens |
| `50mm-standard` | 50mm 标准 | 50mm Standard Lens |
| `85mm-portrait` | 85mm 人像 | 85mm Portrait Lens |
| `shallow-depth-of-field` | 浅景深 | Shallow Depth of Field |
| `deep-focus` | 深景深 | Deep Focus |
| `bokeh` | 散景／光斑 | Bokeh |
| `soft-focus` | 柔焦 | Soft Focus |
| `motion-blur` | 运动模糊 | Motion Blur |
| `sharp-focus` | 锐利对焦 | Sharp Focus |

## Canonical Shot-Language Block

```yaml
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
```

Use `AUTO` for fields the agent should recommend and `INHERIT` for project-wide choices.

## Selection Heuristics

- Use close shots to emphasize emotion, recognition, detail, or withheld information.
- Use wide shots to establish geography, isolation, scale, or spectacle.
- Use eye level for neutrality; high angle for vulnerability or overview; low angle for power or awe.
- Use movement only when it reveals, follows, intensifies, separates, or transitions.
- Use longer lenses for compression and portrait isolation; wider lenses for spatial energy and proximity.
- Use shallow depth of field for selective attention; deep focus when spatial relationships matter.
- Keep one dominant visual idea per short AI-generated shot.

## Compilation Pattern

Compile canonical values in this order:

```text
[shot size and composition],
[camera angle or view],
[camera movement],
[subject and action],
[lens and focus],
[lighting and color atmosphere],
[environment and continuity constraints]
```

Example:

```text
中景，中心构图，平视角度，镜头缓慢向前推进。使用 85mm 人像镜头、浅景深与锐利人物对焦。人物边缘带有轮廓光和逆光，整体采用温暖的电影色调。
```

## Shot-Language Gate

- The shot design serves a clear narrative or communication purpose.
- Composition and shot size are not conflated.
- Angle, movement, lens, lighting, and focus are classified correctly.
- The movement is achievable within the shot duration.
- The lens and depth of field preserve required spatial information.
- The prompt does not stack contradictory camera instructions.
- Project-wide defaults are inherited instead of repeated without reason.
- Local overrides are explicit and scoped to the shot or page.

