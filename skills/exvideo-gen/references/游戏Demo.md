# 游戏Demo

`module.id: game-demo`

本文件是 `exvideo-gen` 的游戏 Demo 工作流模块。用它来组织从角色卡、资料页、UI 页面、实机镜头到战斗关键帧的整套游戏演示产物。

这些提示词框架来自既有工作案例。除非用户明确指定，否则其中的人物、服装和世界观都不应被自动继承为身份参考。

Read `references/examples-index.md` for the full example archive map.
Read `references/examples-game-demos.md` when you need preserved raw demo cases, exact page-family references, or future archival additions that should not bloat this module file.

## 模块定义

```yaml
module:
  id: game-demo
  name: 游戏Demo
  use_cases:
    - 角色与装备展示
    - 游戏菜单和自定义页面
    - 第三人称实机画面
    - BOSS 战
    - 战斗关键帧
  required_intake_fields:
    - game_genre
    - demo_goal
    - player_character
    - visual_target
    - requested_pages_or_shots
  optional_intake_fields:
    - ui_language
    - hud_density
    - combat_system
    - enemy_or_boss
    - loadout_categories
  page_types:
    - ui-screen
    - character-card
    - asset-card
    - gameplay-hud
    - combat-key-art
  continuity_checks:
    - 角色脸型、发型与轮廓
    - 服装结构和战斗变体继承
    - 标志武器形态
    - UI 字体、栏位和强调色
    - 实机镜头中的武器手持与屏幕方向
```

## 标准项目输入示例

```yaml
project:
  id: PROJECT-GAME-01
  title: 游戏Demo
  workflow_module: game-demo
  intended_use: 游戏概念演示
  target_duration: 15s
  aspect_ratio: 16:9
  current_deliverable: 角色资料页、界面分镜、实机关键帧

visual_bible:
  medium_and_rendering: 3A 科幻幻想游戏
  art_direction: 官方设定资料与真实实机并存
  palette: 从角色卡继承
  camera_language: 资料页使用正交展示，实机使用第三人称越肩
  typography_or_ui: 极简英文 UI

production:
  characters:
    - CHAR-01
  scenes:
    - SCENE-UI
    - SCENE-RUINS
  target_platform_or_model: OPEN
```

## 阶段映射

| 阶段 | 本模块常见产物 |
|---|---|
| 角色卡 | 三视图、表情、服装装备拆解、色板、世界观 |
| 分镜 | 菜单、武器、换装、实机、BOSS、终结战斗 |
| 页面级制作 | 每个菜单页、HUD 页、关键帧独立编译 |
| 提示词编译 | 将角色母设定注入每个页面，保留原框架 |

## 使用说明

- 先提取角色卡母设定，再绑定到 UI 页、实机页和战斗页。
- 不直接照搬示例中的原人物设定。
- 若原始案例里出现其他服装风格，只能改写为同角色的派生战术变体。
- 每个页面框架应先写成 `SHOT` 或 `PAGE` 规格，再编译成平台提示词。
- 原始页面案例、raw prompt 和页面种子统一存放在 `references/examples-game-demos.md`。

## 推荐改写原则

将任意游戏 Demo 提示词绑定到目标角色时，统一加入这些约束：

- 使用所附角色资料卡作为严格人物身份参考
- 不要发明不同角色
- 保持脸、发型、主色、外套结构、标志武器一致
- 若需战术变体，只能在原设定上升级，不能跳世界观
- 先锁定角色，再扩展 UI、HUD、场景和战斗演出

## 页面规格示例

```yaml
page:
  id: PAGE-GAME-07
  type: gameplay-hud
  project_id: PROJECT-GAME-01
  scene_id: SCENE-RUINS
  shot_id: SHOT-RUINS-01
  purpose: 展示角色在废都中的基础战斗实机
  aspect_ratio: 16:9
  inherited_references:
    characters: [CHAR-01]
    location: LOCATION-RUINS
  composition:
    framing: 第三人称越肩中远景
    subject_placement: 角色位于画面左下三分区
    background: 残破建筑、阴天天空、尘埃
  action:
    start_state: 角色持枪向前移动
    peak_moment: 瞄准远处敌人
    end_state: 保持推进方向
    motion_cues: 外套下摆与发丝受移动和风力影响
  interface:
    required: true
    hud_elements: [准星, 半透明血条, 武器信息, 技能状态]
  continuity:
    must_match: [角色后视轮廓, 武器手持方向, 服装基础状态]
```
