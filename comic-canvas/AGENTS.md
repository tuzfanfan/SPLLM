# AGENTS.md — 漫剧画布 (comic-canvas) 项目指南

> 本文件为 AI 编程助手提供项目上下文。修改代码前请务必通读。

## 项目概述

漫剧画布是一个基于浏览器的漫画/分镜创作工具，使用可视化节点画布组织角色、分镜、台词、场景等创作元素。

- **位置**: `E:\apps\comic-canvas`
- **技术栈**: 单文件 vanilla HTML/JS，无构建工具，无框架
- **核心依赖**: Drawflow 0.0.60（内联在 index.html 中）、Three.js v0.160.0（CDN）

---

## 启动方式（重要！）

```bash
cd E:\apps\comic-canvas
node server.cjs
```

**必须使用 `node server.cjs` 启动**，端口 8080。

绝对不能用 `python -m http.server`，因为 Python 服务器不提供以下关键接口：
- `GET /api/plugins` — 扫描 `music/` 目录返回音源插件列表
- `GET /api/proxy?url=<encoded>` — CORS 代理，音乐播放器搜索和播放歌曲的唯一通道

没有这两个接口，音乐功能完全失效。

入口页面：
- 项目管理器: `http://localhost:8080/index-entry.html`
- 编辑器: `http://localhost:8080/index.html` 或 `http://localhost:8080/index.html?project=xxx`

---

## 文件结构

```
index.html              主编辑器，约 6700 行，单文件包含全部应用逻辑
index-entry.html        项目管理入口页（约 1221 行）
server.cjs              Node.js 开发服务器（静态文件 + CORS 代理 + 插件 API）
music-player.js         内嵌音乐播放器（搜索、播放列表、网易云 API + 洛雪插件）
music-player.css        播放器样式
lx-shim.js              洛雪音乐插件浏览器兼容层（模拟 lx 运行时）
sphere3d.js             Three.js 3D 球体组件（角色头像展示）
music/                  洛雪音源插件目录（6 个音源）
pics/                   图标资源
```

没有 `package.json`，唯一的 npm 包是 `node_modules/ws`。

---

## index.html 架构（核心文件）

整个应用在一个 HTML 文件中，结构如下：

| 行号范围 | 内容 |
|---------|------|
| 1-184 | 设计系统 CSS 变量（Totality Festival 紫色主题，dark/light） |
| 185-1449 | 应用 CSS（工具栏、节点、连线、容器、响应式等） |
| 1456-1520 | SVG 滤镜定义（三层分形噪声水波纹 + 色相旋转） |
| 1522-1661 | HTML 主体（顶栏、三栏布局：调色板/画布/检查器） |
| 1792-1794 | Drawflow 0.0.60 库（内联压缩版） |
| **2044-6544** | **主应用 IIFE — 所有业务逻辑都在这里** |
| 6546-6547 | lx-shim.js 和 music-player.js 脚本引用 |

### IIFE 内部关键模块

- **TYPE_META / SCHEMA**（~line 1877-1930）：7 种节点类型定义（char/shot/line/scene/branch/end/container）
- **store**（~line 1945-1970）：全局状态中心，包含 editor、data、undo/redo 历史等
- **initDrawflow()**（~line 2676）：Drawflow 实例化和事件绑定
- **容器节点系统**（~line 3059-3105）：`assignNodeToContainer` / `findContainerUnderNode`，父子关系管理、拖拽放入
- **容器自由缩放**（~line 3265-3460, `initContainerResize` IIFE）：8 方向拖拽缩放（4 角 + 4 边），`setProperty(value, 'important')` 写入尺寸
- **拖拽增强**（~line 3111-3260, `enhanceDragging` IIFE）：节点拖拽 + 容器子节点同帧同步移动 + 容器重叠检测
- **连线吸附**（~line 2920-3055）：三种模式（网格/节点/端口），端口吸附用 IIFE 实现
- **AI 集成**（~line 4700-5000）：OpenAI 兼容 API，Markdown 导入导出
- **boot()**（~line 6300-6370）：启动序列，初始化所有子系统

---

## 关键注意事项（必读）

### 1. IIFE 作用域隔离

所有应用逻辑在 IIFE 内部，变量无法从全局 `window` 访问。如果需要通过浏览器控制台或 WebBridge 调试，必须通过 `store` 对象（挂载在 IIFE 内部的闭包中）或 DOM 事件间接操作。

### 2. IIFE 内 strict mode 的声明冲突

IIFE 内部使用 `'use strict'`。**绝对不能重复声明变量**——之前出过 `escapeHtml` 同时被 `const` 和 `function` 声明导致 `SyntaxError`，整个 `boot()` 未执行，所有按钮失效。

**排查方法**：从 index.html 提取 IIFE 部分（当前约第 2044-6544 行），去掉 `<script>` 标签后用 `node --check` 验证语法：
```bash
sed -n '2044,6544p' index.html | grep -v '<script' | grep -v '</script' > /tmp/check.js
node --check /tmp/check.js
```

### 3. Drawflow 库的坑

- **`removeNodeId()`** 要求完整 `"node-XX"` 格式，内部做 `e.slice(5)` 提取数字 ID。传 `"XX"` 会出错。
- **`zoom_enter`** 默认需要 Ctrl+滚轮，项目已 override 为无需 Ctrl。
- **`addNode()` 第 9 个参数必须传 `false`**，否则进入 Vue 渲染路径导致错误。
- **函数作用域在 IIFE 内非全局**，Drawflow 回调中的 `this` 指向需注意。
- **DOM 与 store 数据可能不同步**：`boot()` 异常时 Drawflow DOM 已创建节点但 store 数据为空。修复方法：用 `editor.export()` 获取 DOM 节点 ID，再调用 `removeNodeId()` 清理。
- **`position()` 方法依赖 `offsetLeft/offsetTop`**：Drawflow 的拖拽定位使用 `ele_selected.offsetLeft - i` 计算新位置。`offsetLeft` 是相对于 `offsetParent` 的值，因此**不能将节点 DOM reparent 到容器内**（否则 offsetLeft 变成相对容器的值，位置计算完全错误）。子节点与容器必须保持平级 DOM 结构，位置同步通过 JS 手动计算 delta 实现。

### 4. 两个连线吸附实现共存

- `initConnectionSnap()`（节点级，~line 2284 附近）：自动创建连接
- `enhanceConnectionSnap` IIFE（端口级，~line 1688 附近）：视觉引导，高亮最近端口

两者互补不冲突，修改时注意不要破坏另一套逻辑。

### 5. 容器节点（container）数据模型

- 容器持有 `_children[]` 数组（子节点 ID 列表）
- 子节点持有 `_parentId` 指向父容器
- 容器支持自由拖拽缩放（8 方向手柄），尺寸存储在 `_width`/`_height` 字段
- **子节点跟随移动**：`enhanceDragging` 的 `mousemove` 中，`editor.position(e)` 之后立即计算容器 delta 并同步更新子节点位置（DOM + Drawflow 内部 + store 三处），同帧完成无分离感。`nodeMoved` 处理器中也有跟随逻辑作为 programmatic move 的兜底
- **子节点层级**：放入容器时 `zIndex = '5'`（高于容器的默认 `z-index: 2`），移出/删除时重置为 `''`。加载项目时在 `nodeCreated` 中通过 `_parentId` 恢复
- **拖拽基准初始化**：容器创建时在 `nodeCreated` 中设置 `dataset._lastX/_lastY = offsetLeft/offsetTop`，防止首次拖拽时 `parseFloat(undefined) → NaN` 导致子节点不跟随
- 删除容器会释放子节点（重置 `_parentId` 和 `zIndex`）；删除子节点会从父容器的 `_children` 中移除
- CSS 中容器默认尺寸 `280x200px` 不带 `!important`，运行时通过 `setProperty(value, 'important')` 覆盖（缩放时防止 Drawflow CSS 干扰）

### 6. Markdown 导出/导入

- 导出时在 Markdown 中嵌入完整 JSON 快照（`<details>` 块内的 code fence）
- 导入时优先提取快照精确还原，无快照才走 AI 分析
- AI 分析需要配置有效的 OpenAI 兼容 API

### 7. AI 设置

- 存储在 `localStorage` key `comic-canvas:ai-settings`
- 格式：`{endpoint, apiKey, model}`，兼容 OpenAI / DeepSeek / Qwen / Codex 等
- 预览弹窗需要 `flexbox column` 布局，防止长内容把按钮挤出视口

### 8. 设计系统

- 主题名 "Totality Festival"，紫色调
- CSS 变量定义在 `:root`（dark）和 `[data-theme="light"]`
- 节点类型各有专属颜色（定义在 `--type-*` 变量）
- 右侧属性面板已隐藏（`.inspector { display: none }`），实际为两栏布局
- 玻璃拟态效果（`backdrop-filter: blur`）
- 节点样式：`border-radius: var(--radius-md)`（卡片风格），不要用 `50%`（会导致球形裁剪）
- 节点容器：`overflow: visible`（不要用 hidden，否则 Drawflow 的删除按钮会被裁剪）
- **角色节点 (CometCard)**：节点尺寸 160×245px（`!important`），无玻璃背景/边框/阴影（`background:transparent`、`border:none`、`box-shadow:none`）。卡片 `position:absolute; inset:0` 填满节点，`display:flex; flex-direction:column`，`border-radius:16px`。body 用 `flex:1` 填充图片区域（≈3:4 比例），图片 `filter:saturate(0) contrast(.75)`。底栏白色等宽字体（"Comet Invitation" + "#ID"）。3D 倾斜交互由 `initCometCardTilt` IIFE 实现（rotateX/Y ±17.5deg + translateX/Y ±20px + scale 1.05 + 眩光层），拖拽时自动禁用。pointer-events 需在 `.drawflow_content_node *` 通配符之后单独覆盖为 `auto`

### 9. DOM 元素安全绑定（重要！）

`$` 选择器函数只接受一个参数：`const $ = sel => document.querySelector(sel);`。传入第二个参数（如 `$('#ctx-delete', ctxMenu)`）会被忽略。

**部分 HTML 元素已从旧版 topbar 移除但 JS 仍引用其 ID**（如 `btn-export`, `btn-undo`, `btn-grid` 等）。`initToolbar()` 中使用 `bind()` 辅助函数做安全绑定：

```js
const bind = (sel, evt, fn) => { const el = $(sel); if(el) el[evt] = fn; };
```

新增事件绑定时也应使用此模式，或在赋值前做 null 检查，防止 `Cannot set properties of null` 导致 `boot()` 崩溃。

同理，`#save-text` 元素不存在于 HTML 中，所有引用处已加 null 保护。

### 10. localStorage 数据键

| Key | 用途 |
|-----|------|
| `comic-canvas:projects` | 项目注册表 `[{id, name, createdAt, updatedAt, nodeCount}]` |
| `comic-canvas:proj:{id}` | 单个项目数据（nodes/positions/edges） |
| `comic-canvas:v1` | 默认项目数据（无 `?project=` 参数时） |
| `comic-canvas:theme` | 主题偏好（dark/light） |
| `comic-canvas:ai-settings` | AI 配置 |
| `comic-canvas:playlist` | 音乐播放列表 |

### 11. 性能优化模式

- `rAF.schedule()` 自定义工具：将 minimap、groups、conn-labels、markDirty 等重操作合并到同一帧
- `nodeCache` / `connCache`：缓存 DOM 引用，避免拖拽时重复 `querySelector`
- 边元数据预播种：导入时先写 `store.data.edges[eid]` 再调 `addConnection()`，`connectionCreated` 回调检测到已有元数据会直接复用

---

## 修改代码后的检查清单

1. **语法验证**：用 `node --check` 检查 IIFE 部分无语法错误
2. **启动服务器**：`node server.cjs`，确认控制台输出插件列表
3. **功能验证**：打开浏览器访问 `http://localhost:8080/index.html`，测试：
   - 节点拖拽创建是否正常
   - 连线吸附是否正常
   - 容器节点放入/移出是否正常
   - 音乐搜索和播放是否正常
   - AI 导入/导出是否正常
4. **strict mode 检查**：确保没有变量重复声明

---

## 外部依赖 CDN

- Three.js: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js`
- Background Removal: `https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm`

---

## 音乐系统架构简述

- `MusicAPI`（IIFE）：搜索 + URL 解析，主通道为网易云 API（经 CORS 代理），备用通道为洛雪插件
- `FlowController`：背景动画驱动，黄金比例多正弦波漂移 + 音频能量响应
- `AudioReactor`：Web Audio API 频谱分析，提取低/中/高频能量推送给 FlowController
- `MusicPlayer`：播放器主类（music-player.js），搜索面板（5 个音源）、播放列表、播放控制、MediaSession API、**漫游模式**
- `lx-shim.js`：模拟洛雪桌面插件运行时（`globalThis.lx`），动态加载 `music/` 下的插件

### 漫游模式（Roaming）

类似网易云「私人 FM」，点击播放栏右侧指南针按钮开启。开启后系统自动从关键词池（轻音乐/古风/电子/氛围等 30+ 关键词）中随机选取搜索，将结果添加到播放列表并自动播放。核心机制：

- **自动续播**：`_onEnded()` 中检测播放列表剩余不足 2 首时提前触发 `_roamingDiscover()`
- **避免重复**：`_roamingHistory` 记录已播放歌曲 ID，搜索结果过滤掉已播放的
- **喜好学习**：`roamingLike()` 将当前歌曲名/歌手中的关键词加回池中增加权重；`roamingSkip()` 移除相关关键词
- **防并发**：`_roamingLoading` 标志防止多次搜索同时发起
- **UI 反馈**：漫游按钮 `active` 类触发脉冲动画 + 发光效果；Toast 提示开关状态
