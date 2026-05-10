# AGENTS.md - Hotpoint Live-Video LLM Wiki 构建说明

> **定位**：本文档面向所有参与维护此 Wiki 的 LLM Agent，说明维基的构建方式、核心约定、以及各工作流程应遵循的规范。
> **与 CLAUDE.md 的关系**：CLAUDE.md 是 Agent 的操作手册（"怎么做"），本文档是系统说明书（"是什么"和"为什么"）。
> **工作语言**：中文

---

## 1. 维基是什么

### 1.1 核心定位

这是一个 **LLM 驱动的知识管理维基**，用于：

- **监控热门话题**：持续追踪市场、技术、品牌、消费趋势等领域的动态
- **沉淀结构化知识**：将碎片化的信息转化为可检索、可关联的知识页面
- **支持概念产品孵化**：从洞察中提炼产品机会，生成分析报告和演示文稿

### 1.2 设计哲学

| 原则 | 说明 |
|------|------|
| LLM-first | 维基主要由 LLM 通过对话维护，人类通过 Obsidian 辅助浏览和管理 |
| 知识网络化 | 页面之间通过 wikilink 建立双向关联，形成图谱而非孤立文档 |
| 来源可追溯 | 每条知识都有原始来源支撑，可回溯到 raw/ 目录中的原始文件 |
| 渐进式构建 | 从 raw → source → entity/concept → product，逐层提炼，越往上越精炼 |
| 模板驱动 | 所有页面类型都有标准模板，确保结构一致性 |

---

## 2. 架构概览

### 2.1 四层知识架构

```
┌─────────────────────────────────────────────────┐
│  Layer 4: Schema（规范层）                        │
│  SCHEMA.md / CLAUDE.md / AGENTS.md              │
│  定义维基的结构、约定、工作流程                      │
├─────────────────────────────────────────────────┤
│  Layer 3: Wiki（知识层）                          │
│  entities/ concepts/ comparisons/ products/      │
│  结构化的知识页面，通过 wikilink 互联               │
├─────────────────────────────────────────────────┤
│  Layer 2: Source（来源层）                        │
│  wiki/sources/ + raw/                            │
│  原始材料的结构化摘要，保留核心信息和元数据           │
├─────────────────────────────────────────────────┤
│  Layer 1: Daily Feed（信息层）                     │
│  raw/ 目录中的原始文件                             │
│  未加工的市场信息、文章、笔记、案例等                 │
└─────────────────────────────────────────────────┘
```

**信息流向**：Layer 1 → Layer 2 → Layer 3，逐层提炼。Layer 4 规范所有层的操作。

### 2.2 目录结构

```
e:\SPLLM/
├── raw/                  # Layer 1：原始材料（只读，不修改）
├── skills/               # 技能插件目录
│   ├── hv-analysis/      # 横纵分析法深度研究技能（v2.0，含商业化分析）
│   ├── neat-freak/       # 知识同步与清理技能
│   ├── prompt-flow/      # 提示词决策流程技能（v1.1，全局固定触发）
│   ├── oral-copy/        # 口播文案与公众号长文创作技能（v2.0，四大类型）
│   └── khazix-writer/    # 卡兹克公众号长文写作风格技能
├── SCHEMA.md             # Layer 4：完整规范文档（面向人类）
├── CLAUDE.md             # Layer 4：Agent 操作指南（面向 LLM）
├── AGENTS.md             # Layer 4：本文件，系统说明（面向 LLM）
└── wiki/                 # Layer 2-3：知识库
    ├── index.md          # 内容索引（所有页面的入口）
    ├── log.md            # 操作日志（记录所有变更）
    ├── entities/         # Layer 3：实体页面
    ├── concepts/         # Layer 3：概念页面
    ├── sources/          # Layer 2：来源摘要
    ├── comparisons/      # Layer 3：对比分析
    ├── products/         # Layer 3：产品概念/研究报告
    ├── presentations/    # Layer 3：演示文稿
    ├── assets/           # 图片、图表等资源
    └── templates/        # 页面模板（参考用，不直接使用）
```

### 2.3 页面类型

| 类型 | 目录 | 说明 | 示例 |
|------|------|------|------|
| Entity | `entities/` | 公司、产品、人物、品牌等具体对象 | `泡泡玛特.md`, `王一博.md` |
| Concept | `concepts/` | 技术范式、方法论、趋势等抽象概念 | `品牌叙事.md`, `GEO.md` |
| Source | `sources/` | 原始材料的结构化摘要 | `2026-04-29-全球首个无人公司Box-YZ运营模式.md` |
| Comparison | `comparisons/` | 多个实体/概念的横向对比 | （按需创建） |
| Product | `products/` | 概念产品定义、研究报告 | （按需创建） |
| Presentation | `presentations/` | Marp 格式演示文稿 | （按需创建） |

---

## 3. 核心约定

### 3.1 命名约定

| 对象 | 规则 | 示例 |
|------|------|------|
| Entity 文件名 | `实体名称.md`（使用常用中文名） | `泡泡玛特.md`, `Box-YZ.md` |
| Concept 文件名 | `概念名称.md` | `品牌叙事.md`, `AI-Agent.md` |
| Source 文件名 | `YYYY-MM-DD-来源标题.md` | `2026-05-01-GEO时代的品牌获客革命.md` |
| Product 文件名 | `[研究对象]_横纵分析报告.md` | `泡泡玛特_横纵分析报告.md` |
| 标签 | 小写中文或英文，用连字符连接 | `品牌营销`, `AI视频`, `消费趋势` |

### 3.2 Frontmatter 约定

每个 Wiki 页面**必须**包含 YAML frontmatter：

```yaml
---
title: 页面标题          # 与文件名一致
created: YYYY-MM-DD      # 创建日期
updated: YYYY-MM-DD      # 最后更新日期
tags: [tag1, tag2]       # 标签数组
sources: [来源1, 来源2]  # 来源引用（source 页面指向 raw 文件）
type: entity|concept|source|comparison|product|presentation
status: draft|active|archived
---
```

### 3.3 Wikilink 约定

维基使用 Obsidian 兼容的 wikilink 语法建立页面关联：

| 用法 | 语法 | 示例 |
|------|------|------|
| 基本链接 | `[[页面名称]]` | `[[品牌叙事]]` |
| 带别名 | `[[页面名称\|显示文本]]` | `[[品牌叙事\|品牌叙事理论]]` |
| 章节链接 | `[[页面名称#章节]]` | `[[品牌叙事#核心原理]]` |
| 嵌入内容 | `![[页面名称]]` | `![[品牌叙事#定义]]` |

**规则**：
- 提及维基中已存在的实体/概念时，**必须**使用 wikilink
- 不使用相对路径链接（如 `./page.md`）
- 不使用 Markdown 标准链接语法指向内部页面

### 3.4 内容质量约定

1. **准确性**：所有事实必须有来源支撑，不确定的信息标注"待验证"
2. **完整性**：每个页面覆盖核心信息，不遗漏重要关联
3. **一致性**：同一实体在不同页面中描述一致，术语统一
4. **可读性**：清晰的标题结构，适当使用列表、表格、引用
5. **关联性**：每个页面都与其他页面建立 wikilink 连接

---

## 4. 工作流程

维基维护围绕五个核心工作流展开。详细操作步骤见 `CLAUDE.md`，此处说明每个流程的目标、输入输出和质量标准。

### 4.1 Ingest（摄取资料）

**目标**：将 raw/ 目录中的原始材料转化为结构化的 Wiki 页面

**输入**：`raw/` 目录中的新文件
**输出**：
- `wiki/sources/` 中的来源摘要页面
- 更新或新建的 entity / concept 页面
- 更新的 `index.md` 和 `log.md`

**流程**：
```
raw/新文件 → 阅读分析 → 提取实体/概念/数据
    → 创建 source 摘要 → 更新 entity 页面 → 更新 concept 页面
    → 建立 wikilink 交叉引用 → 更新 index + log
```

**质量标准**：
- 每个来源文件对应一个 source 摘要页面
- 提取所有可识别的实体和概念，不遗漏
- source 页面必须链接到相关 entity 和 concept 页面
- entity/concept 页面必须添加反向链接

### 4.2 Digest（消化深度资料）

**目标**：对深度资料进行方法论级别的理解和提炼

**输入**：`source-material/` 或 `raw/` 中的深度文章、研究报告
**输出**：
- 带有方法论框架的 source 摘要
- 更新的 concept 页面（增加方法论、可操作步骤）
- 可选：与用户讨论后的应用建议

**与 Ingest 的区别**：Ingest 侧重信息提取，Digest 侧重深度理解和知识内化。

### 4.3 Query（回答问题）

**目标**：基于维基内容回答用户问题，提供有引用的结构化答案

**输入**：用户的问题
**输出**：带引用的结构化答案，可选保存为维基页面

**流程**：
```
用户问题 → 理解问题类型 → 搜索 index.md 定位相关页面
    → 阅读相关 entity/concept/source 页面
    → 整合信息，形成答案 → 标注来源引用
    → 可选：保存为维基页面 → 更新 index + log
```

**质量标准**：
- 每个关键论断都有 wikilink 引用
- 整合多个页面的信息，而非单一页面复述
- 识别信息间的联系和矛盾

### 4.4 Produce（生产文件）

**目标**：将维基中的洞察转化为可交付的输出物

**输入**：维基中的知识 + 用户的具体需求
**输出**：Markdown 文档、演示文稿、图表、设计画布、PDF 研究报告

#### 4.4.1 通用输出

| 输出类型 | 保存位置 | 格式 |
|---------|---------|------|
| 产品文档 | `wiki/products/` | Markdown |
| 演示文稿 | `wiki/presentations/` | Marp Markdown |
| 图表 | `wiki/assets/charts/` | PNG/SVG |
| 设计画布 | `wiki/assets/canvases/` | Excalidraw |

#### 4.4.2 深度研究报告（hv-analysis 技能）

> **核心约定**：当用户要求对某个对象进行系统性深度研究时，使用 hv-analysis（横纵分析法）技能。

**技能定义**：`e:\SPLLM\skills\hv-analysis\SKILL.md`

**方法论**：横纵分析法（Horizontal-Vertical Analysis）
- **纵轴**：追踪研究对象从诞生到当下的完整生命历程（叙事体）
- **横轴**：在当前时间截面上与竞品/同类进行系统性对比
- **交汇**：结合两条轴产出独到洞察和未来推演

**适用对象**：产品、公司、概念、技术、人物

**输出**：
- Markdown 稿件 → `wiki/products/[研究对象]_横纵分析报告.md`
- PDF 报告 → `e:\SPLLM/[研究对象]_横纵分析报告.pdf`

**PDF 转换**：使用 fpdf2（Windows 环境无 GTK，不可用 WeasyPrint）
- 依赖：`pip install fpdf2 --break-system-packages`
- 中文字体：C:/Windows/Fonts/msyh.ttc（微软雅黑）
- 临时脚本：`c:\Users\Administrator\.trae-cn\work\69fdfc469bf12e8ac9660a06\md2pdf.py`

**篇幅要求**：全文 16,000 - 40,000 字
- 纵向分析：6,000 - 15,000 字
- 横向分析：3,000 - 10,000 字
- 横纵交汇：1,500 - 3,000 字

**触发词**：横纵分析、研究一下、帮我分析、深度研究、竞品分析、调研一下

### 4.5 Check（健康检查）

**目标**：定期检查维基质量，发现并修复问题

**检查维度**：

| 维度 | 检查内容 |
|------|---------|
| 内容一致性 | 页面间是否有矛盾信息、过时数据 |
| 结构完整性 | 是否有孤立页面、缺失交叉引用 |
| 链接有效性 | 是否有死链、断链、格式错误 |
| 元数据完整性 | frontmatter 是否完整、日期格式是否正确 |
| 质量评估 | 是否有内容薄弱的页面、信息缺口 |

**输出**：健康检查报告 + 修复建议

---

## 5. 技能系统

### 5.1 概述

维基支持通过"技能"（Skill）扩展 Agent 的能力。技能是独立的方法论包，包含完整的分析框架、写作规范和工具脚本。

### 5.2 已安装技能

#### hv-analysis（横纵分析法）

| 属性 | 值 |
|------|-----|
| 名称 | hv-analysis |
| 来源 | [github.com/KKKKhazix/khazix-skills](https://github.com/KKKKhazix/khazix-skills/tree/main/hv-analysis) |
| 版本 | v2.0（2026-05-09 升级，新增产品商业化分析六维度） |
| 方法论 | 横纵分析法（Horizontal-Vertical Analysis） |
| 作者 | 数字生命卡兹克（Khazix） |
| 用途 | 对产品/公司/概念/人物进行系统性深度研究 |
| 位置 | `e:\SPLLM\skills\hv-analysis/` |

**文件结构**：
```
skills/hv-analysis/
├── SKILL.md              # 技能定义（方法论、步骤、写作风格、质检清单）
├── references/
│   └── schema.json       # 分析框架的 JSON Schema（v2.0）
└── scripts/
    └── md_to_pdf.py      # Markdown → PDF 转换脚本（WeasyPrint）
```

#### neat-freak（知识同步与清理）

| 属性 | 值 |
|------|-----|
| 名称 | neat-freak |
| 来源 | [github.com/KKKKhazix/khazix-skills](https://github.com/KKKKhazix/khazix-skills/tree/main/neat-freak) |
| 用途 | 会话结束时对项目文档和记忆进行洁癖级审查与同步 |
| 位置 | `e:\SPLLM\skills\neat-freak/` |

**文件结构**：
```
skills/neat-freak/
├── SKILL.md                      # 技能定义（五步同步流程）
└── references/
    ├── agent-paths.md            # Agent 记忆路径速查
    └── sync-matrix.md            # 变更影响矩阵
```

**触发词**："update memory"、"sync up"、"tidy up docs"、"整理文档"、"更新记忆"、"收尾"、"同步一下"

#### prompt-flow（提示词决策流程）

| 属性 | 值 |
|------|-----|
| 名称 | prompt-flow |
| 版本 | v1.2（整合AI视频/图像生成提示词策略） |
| 来源 | 基于 Andrew Ng《AI Prompting for Everyone》全三模块课程 + 即梦/可灵官方使用手册 |
| 用途 | 每次用户提问时自动执行的四阶段决策流程（反向沟通→类别判断→生成→自检），支持AI视频/图像生成提示词优化 |
| 位置 | `e:\SPLLM\skills\prompt-flow/` |
| 触发规则 | **固定触发**，优先于其他技能执行 |

**文件结构**：
```
skills/prompt-flow/
└── SKILL.md                      # 技能定义（四阶段流程 + 7大提示词类别 + 8条核心原则 + E5 AI视频/图像生成类别）
```

**核心原则**（P1-P8）：上下文为王、避免谄媚、渐进式大纲、迭代头脑风暴、信息路径选择、评分标准驱动批评、多模态成本意识、代码与数据分析

**提示词类别**（A-G + E5）：
- A信息查找、B头脑风暴、C写作、D批评/评估、E多模态、F代码/应用、G推理/复杂任务
- **E5 AI视频/图像生成（即梦/可灵）**：结构化提示词工程法，包含六步流程（平台选择→结构模板→要素填充→进阶技巧→关键词优化→质量检查）

**与 oral-copy 的协同**：当生成AI视频/图像提示词时，prompt-flow 提供结构框架（镜头+情绪+动作+背景 / 主体+运动+背景+镜头+光影+氛围），oral-copy 提供影视级叙事语言风格，两者结合可生成既符合技术要求又具有专业质感的提示词

#### oral-copy（口播文案与公众号长文创作）

| 属性 | 值 |
|------|-----|
| 名称 | oral-copy |
| 版本 | v2.0 |
| 来源 | 整合"数据活人感v2.0" + 高赞视频文案拆解方法论 + 卡兹克公众号长文写作方法论 |
| 用途 | 一站式文案创作，覆盖口播短视频（A/B/C三类）和公众号长文（D类） |
| 位置 | `e:\SPLLM\skills\oral-copy/` |
| 触发词 | "写口播文案""短视频文案""视频脚本""写文章""写稿子""公众号文章""长文"、/活人感文案v2.0 |

**文件结构**：
```
skills/oral-copy/
└── SKILL.md                      # 技能定义（四大类型公式 + 通用规范 + 四层自检清单）
```

**四大文案类型**：
- **类型A 数据活人感**：权威数据背书 + 个人真实体验（适合产品/服务推广 · 短视频口播）
- **类型B 人生感悟**：小事→转折→认知升级→共鸣→升华（适合情感/价值观内容 · 短视频口播）
- **类型C 产品种草**：痛点→方案→信任→行动（适合电商/带货/品牌推广 · 短视频口播）
- **类型D 公众号长文**：5种文章原型 + HKR选题法 + 风格内核 + 四层自检体系（适合深度内容/公众号输出 · 长文写作）

#### khazix-writer（卡兹克公众号长文写作风格）

| 属性 | 值 |
|------|-----|
| 名称 | khazix-writer |
| 来源 | [github.com/KKKKhazix/khazix-skills](https://github.com/KKKKhazix/khazix-skills/tree/main/khazix-writer) |
| 用途 | 「数字生命卡兹克」公众号长文写作风格skill，提供完整的方法论、风格示例和内容选题参考 |
| 位置 | `e:\SPLLM\skills\khazix-writer/` |

**文件结构**：
```
skills/khazix-writer/
├── SKILL.md                      # 技能定义（核心价值观 + 五种原型 + 风格内核 + 绝对禁区 + 四层自检）
└── references/
    ├── content_methodology.md    # 选题方法论（HKR质检法、选题交集模型、创意案例工作法）
    └── style_examples.md         # 风格示例库（开头/转场/知识输出/人物画像/文化升维等19类示例）
```

**核心方法论**：
- HKR选题法（Happy/Knowledge/Resonance）
- 5种文章原型（调查实验/产品体验/现象解读/工具分享/方法论分享）
- 风格内核（节奏感/亲自下场/人物画像法/文化升维/回环呼应等）
- 绝对禁区（禁用词/标点禁令/结构性套话）
- 四层自检体系（L1硬性规则→L2风格一致性→L3内容质量→L4活人感终审）

### 5.3 技能使用约定

1. **按需加载**：Agent 在执行对应任务时读取 SKILL.md，不需要预加载
2. **遵循方法论**：使用技能时必须严格遵循 SKILL.md 中定义的步骤和质量标准
3. **不修改技能文件**：skills/ 目录中的文件是只读的，不要修改
4. **输出归属**：技能生成的产出物保存到 wiki/ 对应目录，遵循维基的命名和结构约定

---

## 6. 维护约定

### 6.1 每次操作必须做的事

1. **更新 `wiki/index.md`**：添加新页面条目，更新统计信息
2. **更新 `wiki/log.md`**：记录操作类型、处理的文件、创建/更新的页面
3. **检查 frontmatter**：确保新页面有完整的 YAML 元数据
4. **建立 wikilink**：新页面必须与已有相关页面建立双向链接

### 6.2 禁止做的事

1. ❌ 不要修改 `raw/` 目录中的原始文件
2. 不要创建没有 frontmatter 的页面
3. 不要使用相对路径链接指向内部页面
4. 不要在维基页面中存储临时或草稿内容（使用 `status: draft`）
5. 不要修改 `skills/` 目录中的技能文件
6. 不要编造信息：搜不到的信息标注"暂缺"

### 6.3 文档体系

| 文档 | 面向对象 | 内容 |
|------|---------|------|
| `SCHEMA.md` | 人类 | 完整的维基规范文档 |
| `CLAUDE.md` | LLM Agent | 操作指南，详细的步骤说明 |
| `AGENTS.md` | LLM Agent | 系统说明，架构、约定、工作流概述 |
| `wiki/index.md` | 人类 + LLM | 内容索引，所有页面的入口 |
| `wiki/log.md` | 人类 + LLM | 操作日志，变更历史 |

---

## 7. Obsidian 集成

维基使用 Obsidian 兼容的 Markdown 格式，支持以下 Obsidian 特性：

- **Wikilink**：`[[页面名称]]` 双向链接
- **Frontmatter**：YAML 属性，支持 Dataview 插件查询
- **Graph View**：通过 wikilink 自动生成知识图谱
- **Marp**：通过 Marp 插件预览和导出演示文稿

详细配置见 `wiki/obsidian-setup-guide.md`。

---

**文档版本**：1.3
**创建日期**：2026-05-09
**最后更新**：2026-05-10（补充 GitHub 仓库信息、prompt-flow v1.2 整合提示词策略、商业思维素材处理）
**GitHub 仓库**：https://github.com/tuzfanfan/SPLLM （Private，main 分支）
**维护者**：LLM Agent
**关联文档**：[[SCHEMA.md]], [[CLAUDE.md]], [[wiki/index.md]], [[wiki/log.md]]
