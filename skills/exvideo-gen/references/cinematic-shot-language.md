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
| `close-up` | 鐗瑰啓 | Close-Up |
| `medium-close-up` | 杩戞櫙 | Medium Close-Up |
| `medium-shot` | 涓櫙 | Medium Shot |
| `full-shot` | 鍏ㄦ櫙 | Full Shot |
| `long-shot` | 杩滄櫙 | Long Shot |
| `extreme-long-shot` | 澶у叏鏅?| Extreme Long Shot |
| `cowboy-shot` | 鐗涗粩鏅?| Cowboy Shot |
| `two-shot` | 鍙屼汉闀滃ご | Two-Shot |
| `group-shot` | 缇ゅ儚闀滃ご | Group Shot |

## Composition

| Canonical Value | Chinese | Common English |
|---|---|---|
| `centered` | 涓績鏋勫浘 | Centered Composition |
| `symmetrical` | 瀵圭О鏋勫浘 | Symmetrical Composition |
| `rule-of-thirds` | 涓夊垎鏋勫浘 | Rule of Thirds |

Composition and shot size are separate fields. A medium shot may use centered, symmetrical, or rule-of-thirds composition.

## Camera Angle and View

| Canonical Value | Chinese | Common English |
|---|---|---|
| `eye-level` | 骞宠瑙掑害 | Eye-Level Shot |
| `high-angle` | 淇瑙掑害 | High Angle |
| `low-angle` | 浠拌瑙掑害 | Low Angle |
| `side-profile` | 渚ч潰瑙嗚 | Side Profile |
| `overhead` | 椤惰 | Overhead Shot |
| `back-view` | 鑳岃 | Back View |
| `birds-eye` | 楦熺灠 | Bird's-Eye View |
| `worms-eye` | 铏锛忓湴闈㈣瑙?| Worm's-Eye View |
| `dutch-angle` | 鍊炬枩闀滃ご | Dutch Angle |

## Camera Movement and Optical Effects

| Canonical Value | Chinese | Common English |
|---|---|---|
| `slow-push-in` | 闀滃ご鎱㈡帹 | Slow Push-In |
| `pull-out` | 闀滃ご鎷夎繙 | Pull-Out |
| `tracking` | 璺熼殢闀滃ご | Tracking Shot |
| `orbit-360` | 鐜粫闀滃ご | 360-Degree Orbit |
| `dolly-zoom` | 甯屽尯鏌厠鍙樼劍 | Dolly Zoom |
| `static` | 鍥哄畾闀滃ご | Static Shot |

Wide-angle is a lens choice, not camera movement. Dutch angle is an angle or framing choice, not camera movement.

## Lighting and Atmosphere

| Canonical Value | Chinese | Common English |
|---|---|---|
| `cinematic-lighting` | 鐢靛奖甯冨厜 | Cinematic Lighting |
| `natural-light` | 鑷劧鍏?| Natural Light |
| `rembrandt-light` | 浼﹀媰鏈楀厜 | Rembrandt Lighting |
| `rim-light` | 杞粨鍏?| Rim Light |
| `backlight` | 閫嗗厜 | Backlight |
| `chiaroscuro` | 鏄庢殫瀵规瘮鍏?| Chiaroscuro Lighting |
| `soft-light` | 鏌斿厜 | Soft Light |
| `hard-light` | 纭厜 | Hard Light |
| `tyndall-light` | 涓佽揪灏斿厜 | Tyndall Light |
| `cool-tone` | 鍐疯壊璋冨厜 | Cool-Tone Lighting |
| `warm-tone` | 鏆栬壊璋冨厜 | Warm-Tone Lighting |
| `neon-lighting` | 闇撹櫣鍏?| Neon Lighting |

Separate light direction and quality from color atmosphere where useful. For example, `rim-light + backlight + warm-tone` is a valid combination.

## Lighting Setup Logic

Treat lighting as a controllable system, not a style adjective list.

### Three-Point Base

- `key light`: the dominant exposure source that sets the main contrast logic.
- `fill light`: a weaker correction source used to recover shadow information without creating a second dominant shadow pattern.
- `rim light`: an edge-separation source used to detach the subject from the background.

Useful defaults:

- Keep fill weaker than key. A common starting point is roughly one-half to one-third of key intensity.
- Keep rim on the opposite side of the key when separation is the goal.
- Use softer fill when realism matters; hard fill often creates competing shadows.
- Treat three-point lighting as a base system that can be shifted, not a fixed front-facing recipe.

### Practical Light Motivation

In narrative shots, avoid making the frame look lit by unexplained production lamps unless that is the point.

- Prefer to motivate warm side light as a lamp, practical fixture, street light, or window spill.
- Prefer to motivate cool ambient light as skylight, monitor light, moonlight, or bounced room light.
- If a fixture appears in frame, its direction, color, and intensity should help explain the subject light.

### Character Effect Mapping

- `front 45-degree key`: balanced default, readable features, flexible for beauty or neutral dialogue.
- `side key`: increases facial shadow and tension; useful for suspicion, confrontation, or asymmetry.
- `side-back key`: stronger contrast and silhouette pressure; useful for threat, secrecy, or moral ambiguity.
- `rembrandt-light`: controlled dramatic realism with a shadow-side triangle; useful for mature, reflective, or hard-edged character moments.
- `soft rim`: natural separation for hair-heavy or soft-profile characters.
- `hard rim`: sharper separation for stylized or aggressive visual language.

## Lens and Focus

| Canonical Value | Chinese | Common English |
|---|---|---|
| `macro` | 寰窛闀滃ご | Macro Lens |
| `telephoto` | 闀跨劍闀滃ご | Telephoto Lens |
| `24mm-wide` | 24mm 骞胯 | 24mm Wide-Angle Lens |
| `35mm` | 35mm 浜烘枃 | 35mm Lens |
| `50mm-standard` | 50mm 鏍囧噯 | 50mm Standard Lens |
| `85mm-portrait` | 85mm 浜哄儚 | 85mm Portrait Lens |
| `shallow-depth-of-field` | 娴呮櫙娣?| Shallow Depth of Field |
| `deep-focus` | 娣辨櫙娣?| Deep Focus |
| `bokeh` | 鏁ｆ櫙锛忓厜鏂?| Bokeh |
| `soft-focus` | 鏌旂劍 | Soft Focus |
| `motion-blur` | 杩愬姩妯＄硦 | Motion Blur |
| `sharp-focus` | 閿愬埄瀵圭劍 | Sharp Focus |

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
  lighting_setup:
  lighting_direction:
  lighting_quality:
  practical_light_motivation:
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
- Use motivated practical-light logic when the frame should feel photographed rather than demo-lit.
- Use fill to repair readability, not to flatten all contrast.

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
涓櫙锛屼腑蹇冩瀯鍥撅紝骞宠瑙掑害锛岄暅澶寸紦鎱㈠悜鍓嶆帹杩涖€備娇鐢?85mm 浜哄儚闀滃ご銆佹祬鏅繁涓庨攼鍒╀汉鐗╁鐒︺€備汉鐗╄竟缂樺甫鏈夎疆寤撳厜鍜岄€嗗厜锛屾暣浣撻噰鐢ㄦ俯鏆栫殑鐢靛奖鑹茶皟銆?
```

## Shot-Language Gate

- The shot design serves a clear narrative or communication purpose.
- Composition and shot size are not conflated.
- Angle, movement, lens, lighting, and focus are classified correctly.
- The movement is achievable within the shot duration.
- The lens and depth of field preserve required spatial information.
- The lighting setup has one dominant source and no accidental second key unless intentional.
- The practical light logic can be explained by the scene world when realism is required.
- The prompt does not stack contradictory camera instructions.
- Project-wide defaults are inherited instead of repeated without reason.
- Local overrides are explicit and scoped to the shot or page.
