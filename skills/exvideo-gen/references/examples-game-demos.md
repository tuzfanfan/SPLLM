# Game Demo Examples

Use this file as the archive for concrete game-demo examples. Keep role-specific prompts, raw page ideas, and original working cases here so `references/游戏Demo.md` can stay focused on reusable module guidance.

## Usage Rules

- Treat examples as references, not universal defaults.
- Preserve original page logic and gameplay framing when the goal is recall.
- Move only generalized workflow lessons back into `references/游戏Demo.md`.
- Keep UI-heavy, HUD-heavy, and combat-heavy cases here even if they include character material.

## Example 01: Original Game Demo Module Seed

### Status

- Type: module seed example
- Purpose: preserve the original page families and prompt directions used to bootstrap the game-demo workflow
- Default inheritance: partial
- Replace before reuse: depicted character identity, specific combat skin assumptions, and any non-portable UI wording

### Source

- Primary module file: `references/游戏Demo.md`
- Workflow family: `game-demo`

### What This Seed Covers

- 主菜单界面
- 武器展示界面
- 角色服饰自定义界面
- 武器展示变体
- 强动作服装展示界面
- 手持武器特写界面
- 第三人称实机界面
- BOSS 战界面
- 最终打斗画面

### Original Page Prompts

#### 1. 主菜单界面

```text
截取一张电子游戏大厅的美女屏幕截图，其中应包含带有“开始新游戏”和“继续游戏”等选项的主菜单，界面简洁，背景为白色。
```

#### 2. 武器展示界面

```text
根据参考图生成武器展示界面，人物中景腾空姿势，以上半身为主，单手持枪向前瞄准，头发与外套随动作飘动，武器关键部位有标注说明，左侧武器数值，底部横排展示可切换武器皮肤，白色背景，极简 3A 游戏风格英文界面。
```

#### 3. 角色服饰自定义界面

```text
根据参考图生成角色服饰自定义界面，人物侧坐在行李箱上，一腿支撑一腿伸展，姿态放松有张力，人物占画面 60% 以上，具有标注线指向各服装部件，左侧装备列表带缩略图，右侧角色属性栏，白色背景，极简 3A 游戏风格英文界面。
```

#### 4. 武器展示变体

```text
根据参考图生成武器展示界面，人物中景腾空姿势，以上半身为主，单手持枪向镜头瞄准，头发与外套随动作飘动，武器关键部位有标注说明，左侧武器参数栏，底部横排展示可切换武器皮肤，白色背景，极简 3A 游戏风格英文界面。若原稿提及其他配色战术服，将其改写为同角色的高机动作战变体。
```

#### 5. 强动作服装展示界面

```text
参考人物身体前倾姿势，特写上半身为主，一臂向前镜头，一臂向后展，动作强烈。左侧服装分类列表带缩略图，人物展示周围有标注线指向各部件，右侧角色属性数值栏，白色背景，极简 3A 游戏风格英文界面。服装保持同角色世界观中的战术变体。
```

#### 6. 手持武器特写界面

```text
根据参考图生成人物手持武器特写界面，中央展示手枪大图 3D 特写，顶部显示武器名称与类型，左侧武器槽列表如 `Primary / Secondary / Melee / Grenade`，右侧显示伤害、射程、射速、稳定性，底部横排挂载目标或皮肤选项，白色背景，3A 游戏风格界面。
```

#### 7. 第三人称实机界面

```text
根据参考图生成游戏内实机界面，采用第三人称越肩跟随视角。人物背对镜头持枪，身着角色设定服装，场景为废都战场、残破建筑与阴天天空，战场感强烈。界面包含准星、半透明血条、右下角武器或技能 UI，顶部全局光照，3A 游戏真实质感。
```

#### 8. BOSS 战界面

```text
根据参考图生成游戏内 BOSS 战界面，采用第三人称越肩视角。人物背对屏幕持枪，身着同角色的作战强化变体，正前方出现机械化 BOSS 正逼近，能量弹道向前方射出，废墟战场背景，爆炸碎片四散。UI 显示左上角血量、右下角技能冷却信息、中央连击数跳动，顶部全局光照，3A 游戏真实质感。
```

#### 9. 最终打斗画面

```text
原始提示属于电影化战斗分镜，包含：
- 角色起势与能量聚焦
- 连贯拔枪或拔武器动作
- 跃起、腾空、推进
- 爆发冲击
- 闪切压迫
- 终结定格

用于单张生图时，压缩为“高潮瞬间”：
- 选择 12s-15s 的爆发与终结阶段作为单图主时刻
- 保留一镜到底的流动感
- 强调武器轨迹、能量切割、碎片、冲击和身体前冲
- 材质偏电影级写实 CGI
- 角色必须保持为同一角色卡的世界观与装备体系
```

### Original Page Spec Seed

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

### What To Preserve

- 角色卡先行，再注入 UI 页和实机页
- 游戏 Demo 里不同页面类型的分层组织方式
- 从资料页、菜单页到实机战斗页的产物顺序
- HUD、weapon slot、combat key art 这类游戏语法
- 战斗页中“角色身份不漂移”的连续性要求

### What To Replace Before Reuse

- 示例里默认的女性角色外观和服装想象
- 不适用于当前项目的武器、皮肤、BOSS 或场景设定
- 任何把示例误读成固定世界观默认值的内容

### Reuse Note

When reusing this seed, prefer the generalized workflow in `references/游戏Demo.md`. Pull exact raw phrases only when they still match the current game's UI language, camera language, and combat grammar.
