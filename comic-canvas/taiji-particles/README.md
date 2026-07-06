# 太极粒子 · Taiji Particles

> **2 万粒子 + Three.js + Vite** 构筑的太极图粒子汇聚 / 点击消散前端效果。
> 纯白背景，阳鱼深橙金、阴鱼近黑，双鱼眼互嵌。点击爆裂消散后自动重聚。
> 背景随机出现水墨晕染效果，模拟宣纸上的墨汁扩散。

本文档供其他 AI Agent / 开发者快速查阅：包含完整文件清单、每文件职责、关键代码位置（行号）、可调参数表与架构说明。

---

## 一、快速启动

```bash
cd taiji-particles
npm install        # 安装 three + vite
npm run dev        # 启动开发服务器（默认 http://localhost:5173）
```

构建生产包：

```bash
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建产物
```

---

## 二、文件清单与职责

项目根目录：`e:/apps/comic-canvas/taiji-particles/`

| # | 文件路径 | 行数 | 职责 |
|---|---------|------|------|
| 1 | `index.html` | ~20 | 入口 HTML，挂载点、标题、提示栏、模块入口 |
| 2 | `package.json` | ~17 | 依赖声明（three ^0.160.0 / vite ^5.4.0）与脚本 |
| 3 | `src/main.js` | ~351 | **全部 Three.js 逻辑**（场景/粒子/动画/交互），引入水墨模块 |
| 4 | `src/ink-wash.js` | ~220 | **水墨晕染背景效果**（2D Canvas，随机墨晕生成/扩散/淡出） |
| 5 | `src/style.css` | ~82 | 白底背景、标题、提示栏样式 |
| 6 | `README.md` | — | 本文档 |
| 7 | `package-lock.json` | — | npm 锁文件（自动生成） |

### 层级关系（z-index）

```
body::before (z:0)          ← 极淡径向渐变
  ↓
ink-wash canvas (z:0)       ← 水墨晕染 2D Canvas（DOM 后置，覆盖 body::before）
  ↓
#app / Three.js canvas (z:1) ← 粒子云（alpha:true 透明，墨晕透出）
  ↓
#title / #hint (z:10)       ← 标题与提示栏
```

---

## 三、各文件详解

### `index.html`

> 完整路径：`e:/apps/comic-canvas/taiji-particles/index.html`

| 行 | 内容 | 说明 |
|----|------|------|
| 9 | `<div id="app">` | Three.js renderer canvas 挂载点 |
| 11-14 | `#title` 区块 | 标题"太 极 粒 子" + "20,000 PARTICLES" |
| 16 | `#hint` | 底部提示栏 |
| 18 | `<script type="module" src="/src/main.js">` | ES 模块入口 |

---

### `src/main.js`

> 完整路径：`e:/apps/comic-canvas/taiji-particles/src/main.js`　·　约 351 行

这是**唯一的核心 Three.js 逻辑文件**。按代码区块索引：

| 行号范围 | 区块 | 说明 |
|---------|------|------|
| 1-3 | 导入 | `three` + `style.css` + `ink-wash.js`（水墨晕染） |
| 7-12 | 配置参数 | 粒子数、半径、时长等全部可调常量 |
| 17-32 | 场景/相机/渲染器 | PerspectiveCamera(55°)、WebGLRenderer、双层 Group |
| 37-51 | 圆形光点贴图 | `makeCircleTexture()` 用 Canvas 径向渐变生成柔光圆点 |
| 58-68 | 太极区域判定 | `inYang(x,y)` 用两个 R/2 半圆判定阴阳归属 |
| 73-115 | 目标位置与颜色生成 | 均匀采样 + 鱼眼互嵌上色 |
| 119-128 | 散落起始位置 | 大球壳 (r=6~15) 随机分布 |
| 132-149 | 粒子几何与材质 | BufferGeometry + PointsMaterial(NormalBlending) |
| 153-177 | 背景星点 | 1400 颗浅灰远景星 |
| 179-276 | 动画状态机 | gather→formed→disperse→reform 四态循环 |
| 280-322 | 交互 | 拖拽旋转 + 点击消散 |
| 327-339 | 主循环 | `animate()` rAF 循环 |
| 343-348 | 自适应 | 窗口 resize 响应 |

---

### `src/ink-wash.js`

> 完整路径：`e:/apps/comic-canvas/taiji-particles/src/ink-wash.js`　·　约 220 行

在白底背景上随机生成有机不规则的水墨晕染效果，模拟宣纸上的墨汁扩散。位于 Three.js 画布后方（z-index:0），通过透明画布透出。

| 行号范围 | 区块 | 说明 |
|---------|------|------|
| 16-33 | 画布初始化 | 2D Canvas，DPR 适配，插入 DOM（z-index:0，在 #app 前） |
| 39-101 | `makeInkStamp()` | 预生成墨晕贴图：多偏移径向渐变叠加 + 像素噪点 + 湿边晕环 |
| 103 | `inkStamps[]` | 8 张预生成贴图，随机选用 |
| 107-125 | `makeSpeckStamp()` | 墨点溅射小贴图（环绕主晕染的细小墨粒） |
| 130-197 | `class Bloom` | 单次墨晕生命周期：位置/缩放/淡入淡出/墨点溅射 |
| 203-217 | 墨晕管理器 | 随机生成（避开中心太极区）、更新、绘制 |

**关键参数**：

| 参数 | 行号 | 当前值 | 含义 |
|------|------|--------|------|
| `MAX_BLOOMS` | `:204` | `7` | 同屏最大墨晕数 |
| `spawnInterval` | `:207` | `2~5s` | 生成间隔（随机） |
| `safeR` | `:140` | `min(W,H)*0.24` | 中心太极安全区半径，墨晕不在此生成 |
| `Bloom.life` | `:152` | `5~11s` | 单个墨晕生命周期 |
| `fadeInRatio` | `:153` | `0.15` | 淡入占比 |
| `fadeOutRatio` | `:154` | `0.4` | 淡出占比 |
| `baseScale` | `:146` | `0.5~1.7` | 初始缩放 |
| `growScale` | `:147` | `baseScale*1.6~2.4` | 扩散后最大缩放 |
| 墨色基调 | `:52-68` | 浓墨/淡墨/冷墨 | 三种随机墨色 |
| `inkStamps` 数量 | `:103` | `8` | 预生成贴图数 |

---

### `src/style.css`

> 完整路径：`e:/apps/comic-canvas/taiji-particles/src/style.css`　·　约 82 行

| 行号 | 内容 | 说明 |
|------|------|------|
| 12 | `background: #ffffff` | 纯白背景 |
| 24-33 | `body::before` | 极淡径向渐变（蓝 6% + 橙 5%） |
| 50-56 | `#title h1` | 深色标题 `rgba(40,40,50,0.85)` |
| 64-81 | `#hint` | 浅色玻璃拟态提示栏 |

---

## 四、可调参数速查表

### 粒子系统（`src/main.js`）

| 参数 | 位置 | 当前值 | 含义 |
|------|------|--------|------|
| `PARTICLE_COUNT` | `:7` | `20000` | 粒子总数 |
| `R` | `:8` | `2.2` | 太极图半径（世界单位） |
| `EYE_COUNT` | `:9` | `1200` | 鱼眼粒子数（两眼合计） |
| `GATHER_DUR` | `:10` | `3.2` | 汇聚时长（秒） |
| `DISPERSE_DUR` | `:11` | `2.6` | 消散飞行时长（秒） |
| `REFORM_DELAY` | `:12` | `1.4` | 消散后停留再重聚（秒） |
| `COL_YANG` | `:76` | `#e8741c` | 阳鱼颜色（深暖橙金） |
| `COL_YIN` | `:77` | `#0a0a0a` | 阴鱼颜色（近黑） |
| `mat.size` | `:140` | `0.045` | 单粒子大小 |
| `mat.blending` | `:144` | `NormalBlending` | 混合模式（白底禁用 Additive） |
| 螺旋角度系数 | `:223` | `2.2π` | 汇聚旋转圈数 |
| 消散初速度 | `:200` | `1.8+rand*3.6` | 粒子向外飞行速度 |
| 自转速度 | `:333` | `0.003/帧` | 太极平面自转 |

### 水墨晕染（`src/ink-wash.js`）

| 参数 | 位置 | 当前值 | 含义 |
|------|------|--------|------|
| `MAX_BLOOMS` | `:204` | `7` | 同屏最大墨晕数 |
| `spawnInterval` | `:207` | `2~5s` | 生成间隔（随机） |
| `Bloom.life` | `:152` | `5~11s` | 单个墨晕生命周期 |
| `safeR` | `:140` | `min(W,H)*0.24` | 中心安全区（避开太极） |
| `baseScale` | `:146` | `0.5~1.7` | 墨晕初始大小 |
| `growScale` | `:147` | `1.6~2.4×` | 扩散倍率 |
| `inkStamps` | `:103` | `8` 张 | 预生成墨晕贴图数 |

### 背景（`src/style.css`）

| 参数 | 位置 | 当前值 | 含义 |
|------|------|--------|------|
| `background` | `:12` | `#ffffff` | 背景色 |
| 渐变透明度 | `:31-32` | `0.05~0.06` | 极淡柔光强度 |

---

## 五、架构与原理

### 5.1 太极区域判定（`src/main.js:58-68`）

S 形分界线由两个半径 `R/2` 的半圆构成：
- 上半圆（y≥0）：圆心 `(0, R/2)`，取左半圆作为分界
- 下半圆（y<0）：圆心 `(0, -R/2)`，取右半圆作为分界

### 5.2 均匀面密度采样（`src/main.js:93-94`）

```js
const rr = R * Math.sqrt(Math.random());  // sqrt 修正，保证圆内均匀
```

### 5.3 动画状态机（`src/main.js:179-276`）

```
gather ──→ formed ──→ disperse ──→ reform ──→ gather ...
 (汇聚)     (成型)      (消散)      (减速重置)
```

### 5.4 水墨晕染系统（`src/ink-wash.js`）

**墨晕贴图生成**（`makeInkStamp`）：
1. 随机选择墨色基调：浓墨（近黑）/ 淡墨（中灰）/ 冷墨（偏蓝灰）
2. 6~10 个偏移径向渐变叠加 → 有机不规则轮廓
3. 像素级随机噪点 → 模拟宣纸颗粒质感
4. 50% 概率添加湿边晕环 → 墨汁在纸缘堆积效应

**Bloom 生命周期**：
```
淡入(15%) → 保持(45%) → 淡出(40%)
同时尺寸从 baseScale 缓慢扩散到 growScale
```

**安全区**：墨晕生成时避开屏幕中心 `min(W,H)*0.24` 半径范围，不遮挡太极图。

**层级穿透**：水墨 Canvas 在 z-index:0，Three.js 画布在 z-index:1 且 `alpha:true`，粒子间隙可透出墨晕。

### 5.5 为什么白底用 NormalBlending

`AdditiveBlending`：白色背景 + 任何色 = 白色，粒子不可见。`NormalBlending`：粒子正常显示。

### 5.6 双层 Group 旋转（`src/main.js:27-32`）

```
scene → tiltGroup（拖拽俯仰/偏航）→ spinGroup（平面自转）→ points
```

---

## 六、依赖说明

| 依赖 | 版本 | 用途 |
|------|------|------|
| `three` | ^0.160.0 | 3D 渲染引擎 |
| `vite` | ^5.4.0 | 开发服务器 + 构建工具 |

无其他第三方库。圆形粒子贴图和墨晕贴图均用 Canvas API 运行时生成。

---

## 七、二次开发指引

### 改粒子数
`src/main.js:7` → `const PARTICLE_COUNT = 30000;`

### 改颜色
`src/main.js:76-77` → `COL_YANG` / `COL_YIN`

### 改水墨密度
`src/ink-wash.js:204` → `MAX_BLOOMS = 12`（更多同时墨晕）
`src/ink-wash.js:207` → `spawnInterval` 减小（更频繁）

### 改水墨大小
`src/ink-wash.js:146-147` → `baseScale` / `growScale`

### 改水墨颜色
`src/ink-wash.js:52-68` → 调整浓墨/淡墨/冷墨的 RGB 值

### 改背景色
`src/style.css:12` → `background: #f5f6fa;`（微灰白）

---

## 八、验证清单

1. `node --check src/main.js` — 语法验证
2. `node --check src/ink-wash.js` — 水墨模块语法验证
3. `npm run dev` — 启动无报错
4. 浏览器打开 `http://localhost:5173` — 粒子汇聚正常
5. 观察背景 — 水墨晕染随机出现/扩散/淡出
6. 点击画面 — 消散后自动重聚
7. 拖拽 — 视角旋转正常
8. 控制台无 WebGL 错误

---

## 九、当前配置快照

```
粒子总数:     20,000
太极半径:     2.2
鱼眼粒子:     1,200（两眼各 600）
阳鱼颜色:     #e8741c（深暖橙金）
阴鱼颜色:     #0a0a0a（近黑）
背景:         #ffffff（纯白）
混合模式:     NormalBlending
粒子大小:     0.045
背景星点:     1,400 颗，浅灰 #c8d2e0，opacity 0.32
水墨晕染:     同屏最多 7 个，2~5 秒生成一次
墨色:         浓墨/淡墨/冷墨 三种随机
墨晕生命:     5~11 秒
汇聚时长:     3.2s
消散时长:     2.6s
重聚延迟:     1.4s
自转速度:     0.003 rad/帧
相机:         FOV 55°，z=6.5
```
