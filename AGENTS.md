# AGENTS.md - Hotpoint Live-Video LLM Wiki 构建说明

> **定位**：本文档面向所有参与维护此 Wiki 的 LLM Agent，说明维基的构建方式、核心约定、以及各工作流程应遵循的规范。
> **与 CLAUDE.md 的关系**：CLAUDE.md 是 Agent 的操作手册（"怎么做"），本文档是系统说明书（"是什么"和"为什么"）。
> **工作语言**：中文

---

## 0. Warm Context

执行需要工作空间规则的任务时，先读取 `WORKSPACE_CONTEXT.md` 获取短版上下文；只有在需要完整流程、模板或历史约定时，再读取 `AGENTS.md`、`CLAUDE.md`、`SCHEMA.md`、`SOUL.md` 等长文档。

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
├── book/                 # Layer 1：精品书籍素材（供后续方法论提炼与知识沉淀使用）
├── raw/                  # Layer 1：原始材料（只读，不修改）
├── skills/               # 技能插件目录
│   ├── hv-analysis/      # 横纵分析法深度研究技能（v2.0，含商业化分析）
│   ├── neat-freak/       # 知识同步与清理技能
│   ├── prompt-flow/      # 提示词决策流程技能（全局 guidance 已接管，此处保留项目级补充语义）
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
| Source | `sources/` | 原始材料的结构化摘要 | `AI技术-全球首个无人公司Box-YZ运营模式.md` |
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
| Source 文件名 | `行业维度-来源标题.md`（日期放在 frontmatter 或来源信息中） | `品牌营销-GEO时代的品牌获客革命.md` |
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

**目标**：将 `daily-feed/`、`raw/` 目录中的原始材料，以及通过 AList 访问的夸克网盘电子书素材，转化为结构化的 Wiki 页面

**输入**：
- `daily-feed/` 目录中的新文件
- `raw/` 目录中的新文件
- AList 网盘中的电子书素材（夸克网盘 `电子书数据_md/`）
**输出**：
- `wiki/sources/` 中的来源摘要页面
- 更新或新建的 entity / concept 页面
- 更新的 `index.md` 和 `log.md`

**流程**：
```
daily-feed/新文件 / raw/新文件 / 网盘电子书 → 阅读分析 → 提取实体/概念/数据
    → 创建 source 摘要 → 更新 entity 页面 → 更新 concept 页面
    → 建立 wikilink 交叉引用 → 更新 index + log
```

**固定 Prompt 协议**：

Ingest 任务内部统一采用“材料 - 指令 - 输出 - schema”四段结构。

```text
<materials>原始文件、网盘条目、旧页面片段</materials>
<instructions>抽取实体/概念/数据/洞察，并说明更新动作</instructions>
<output>source 摘要、entity/concept 更新项、index/log 更新项</output>
<schema>frontmatter、章节、wikilink、webdav_url、引用格式</schema>
```

**质量标准**：
- 每个来源文件或电子书条目对应一个 source 摘要页面
- 提取所有可识别的实体和概念，不遗漏
- source 页面必须链接到相关 entity 和 concept 页面
- entity/concept 页面必须添加反向链接
- 对有网盘原文的来源，优先补充 `webdav_url` 或等效在线预览链接

### 4.2 Digest（消化深度资料）

**目标**：对深度资料进行方法论级别的理解和提炼

**输入**：`raw/` 中的深度文章、研究报告，或 AList 网盘中的电子书/长文资料
**输出**：
- 带有方法论框架的 source 摘要
- 更新的 concept 页面（增加方法论、可操作步骤）
- 可选：与用户讨论后的应用建议

**固定 Prompt 协议**：

Digest 任务也统一采用“材料 - 指令 - 输出 - schema”四段结构，但要求显式区分事实、作者观点和可迁移方法。

```text
<materials>深度文章、研究报告、书籍章节、相关旧页</materials>
<instructions>提炼方法论、识别论证逻辑、抽取可操作框架</instructions>
<output>结构化摘要、方法论框架、适用场景、应用建议</output>
<schema>核心观点、方法框架、适用边界、关联知识、引用格式</schema>
```

**与 Ingest 的区别**：Ingest 侧重信息提取，Digest 侧重深度理解和知识内化。`source-material/` 已不再作为当前仓库的扫描入口。

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

**固定 Prompt 协议**：

Check 任务统一采用“材料 - 指令 - 输出 - schema”四段结构。

```text
<materials>待检查页面、索引、日志、模板、统计信息</materials>
<instructions>检查一致性、完整性、死链、孤立页、字段缺失、内容薄弱处</instructions>
<output>健康检查报告、问题清单、修复建议、优先级</output>
<schema>问题级别、定位页面、问题说明、修复动作、是否需人工确认</schema>
```

**输出**：健康检查报告 + 修复建议

---

## 5. 技能系统

### 5.1 概述

维基支持通过"技能"（Skill）扩展 Agent 的能力。技能是独立的方法论包，包含完整的分析框架、写作规范和工具脚本。

### 5.1.1 技能构建守则（四条铁律）

> 以下四条守则是技能系统的最高优先级规则，所有技能的创建、扩展、维护都必须遵守。

#### 铁律一：禁止一次性工作

如果我让你做的事以后可能还会重复，你就**必须**将其固化为技能：

| 步骤 | 动作 | 说明 |
|------|------|------|
| **第1次** | 手动做 3-10 个样本 | 用真实数据跑通流程，验证可行性 |
| **第2步** | 把结果给我看，问我是否满意 | 必须获得人类批准 |
| **批准后** | 立刻写成 `SKILL.md` | 放在 `e:\SPLLM\skills/` 目录 |
| **周期性任务** | 加入定时任务 | 用 `openclaw cron add` 自动运行 |

**判断标准**：如果同一件事你做了2次以上，它就应该是一个技能。

#### 铁律二：MECE 原则（互斥且穷尽）

每类工作只能有**一个**技能拥有者，不能重叠、不能有空白：

| 规则 | 说明 |
|------|------|
| **互斥** | 两个技能不能做同一件事，职责边界清晰 |
| **穷尽** | 每类工作都有对应的技能覆盖，没有空白区 |
| **扩展优先** | 创建新技能前必须先检查现有技能，能扩展就扩展，不重复造轮子 |

**操作要求**：创建新技能前，必须先列出所有现有技能，说明为什么现有技能无法覆盖，为什么必须新建。

#### 铁律三：失败判定

> 如果我第二次还得问你同一件事，你就失败了。

| 次数 | 定义 | 正确做法 |
|------|------|----------|
| **第1次** | "发现需求" | 手动完成，同时识别这是否为可重复任务 |
| **第2次** | "失败" | 说明你第1次就应该把它变成技能或定时任务 |

**推论**：所有重复性工作都必须被自动化。人类不应该说两次同样的话。

#### 铁律四：技能构建标准流程（6步法）

所有新技能的创建（或现有技能的重大扩展）都必须遵循以下流程：

```
Step 1: Concept    → 描述流程（用自然语言写出步骤）
Step 2: Prototype  → 用真实数据跑 3-10 个样本（不写技能文件）
Step 3: Evaluate   → 给我看结果，迭代修改直到满意
Step 4: Codify     → 写成 SKILL.md（或扩展现有技能）
Step 5: Cron       → 加入定时任务（如果是 recurring 任务）
Step 6: Monitor    → 监控前几次运行，继续优化
```

| 阶段 | 输入 | 输出 | 人类参与 |
|------|------|------|----------|
| **Concept** | 需求描述 | 流程步骤（自然语言） | 确认方向 |
| **Prototype** | 真实数据 | 3-10个样本结果 | 不参与（Agent独立完成） |
| **Evaluate** | 样本结果 | 修改意见 | **必须参与**（批准/打回） |
| **Codify** | 批准的流程 | SKILL.md 文件 | 不参与（Agent独立完成） |
| **Cron** | SKILL.md | 定时任务配置 | 确认周期 |
| **Monitor** | 运行日志 | 优化建议 | 按需参与 |

**关键约束**：
- **Step 2 和 Step 4 之间必须经过 Step 3（人类批准）**，不得跳过
- Prototype 阶段不写技能文件，只产出样本结果
- Codify 阶段才写 SKILL.md，确保写进去的都是验证过的流程

---

### 5.2 已安装技能

#### aweskill（本地技能仓库管理）

| 属性 | 值 |
|------|-----|
| 名称 | aweskill |
| 来源 | [github.com/mugpeng/aweskill](https://github.com/mugpeng/aweskill) |
| 用途 | 管理和投影跨 agent 的 Skill，中央仓库用于统一存放和分发技能资产 |
| 位置 | 由 `aweskill store where --verbose` 确认 |

**本项目约定**：
- 中央技能仓库放在当前工作空间：`E:\SPLLM\.aweskill`
- 对应环境变量：`AWESKILL_HOME=E:\SPLLM`
- 这样 aweskill 的 central store、备份和 bundle 都跟着项目走，便于多个 agent 共用同一套技能资产

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
| 用途 | 作为全局 `AGENTS.md` 中的默认前置思考框架：先理解意图、补齐高影响上下文、判断任务类别、再生成结果；本项目中继续用于 AI 视频/图像提示词优化与复杂请求澄清 |
| 位置 | `e:\SPLLM\skills\prompt-flow/` |
| 触发规则 | **全局默认已由 `C:\Users\Administrator\.codex\AGENTS.md` 接管**；本仓库不再单独声明“固定触发”，仅保留项目级补充约定 |

**文件结构**：
```
skills/prompt-flow/
└── SKILL.md                      # 技能定义（四阶段流程 + 7大提示词类别 + 8条核心原则 + E5 AI视频/图像生成类别）
```

**核心原则**（P1-P8）：上下文为王、避免谄媚、渐进式大纲、迭代头脑风暴、信息路径选择、评分标准驱动批评、多模态成本意识、代码与数据分析

## Execution style

- Do not turn prompt-flow into a ritual the user has to watch every time.
- For simple requests, run the flow silently and answer directly.
- For ambiguous or strategic requests, briefly expose the reasoning frame and assumptions.
- Be concise, practical, and forward-moving.

## Generation gate

- For any generation task, including multimodal generation, writing, presentations, reports, prompts, plans, or other content-producing requests, you must run `prompt-flow` before generating the final output.
- After `prompt-flow`, you must first present your execution judgment to the user. That judgment must include the task category, the real goal, the key assumptions, the main risks or boundaries, and the recommended output path.
- Do not begin the actual generation step until the user explicitly confirms that you may proceed.

**与 oral-copy 的协同**：当生成AI视频/图像提示词时，prompt-flow 提供结构框架（镜头+情绪+动作+背景 / 主体+运动+背景+镜头+光影+氛围），oral-copy 提供影视级叙事语言风格，两者结合可生成既符合技术要求又具有专业质感的提示词

#### thinking-extend（任务收尾延伸）

| 属性 | 值 |
|------|-----|
| 名称 | thinking-extend |
| 版本 | v1.0 |
| 来源 | 项目内生技能 |
| 用途 | 在主任务完成后回看 `wiki/`，做强关联发现、弱关联跨界观察，并追问 1 个高质量延伸问题 |
| 位置 | `e:\SPLLM\skills\thinking-extend/` |
| 触发规则 | **项目级默认收尾动作**；每次主任务完成后都必须执行一次“是否进入 thinking-extend”的判断 |

**文件结构**：
```
skills/thinking-extend/
└── SKILL.md                      # 技能定义（收尾规则、分层检索、跨界思考、延伸问题生成）
```

**项目级约定**：
- `thinking-extend` 不是可选装饰，而是默认收尾层
- 推荐顺序：`主任务执行 -> 结果交付 -> thinking-extend`
- 主任务交付后，不再默认“答案发出就算结束”，而要继续执行一次收尾判断
- 除非用户明确关闭、任务纯机械、或 `wiki/` 没有足够关联内容，否则不应跳过
- 只要不满足跳过条件，就必须补做一次 `thinking-extend` 判断
- 执行时必须优先检查 `concepts / entities / sources`，不能只在 `products/` 中找关联
- 默认至少给出一版最小化输出：`任务回看 + 关联发现 + 1 个延伸问题`

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

#### knowledge-extractor（知识提取）

| 属性 | 值 |
|------|-----|
| 名称 | knowledge-extractor |
| 来源 | 项目内生技能（由 `question-extractor`、`reference-extractor`、`tag-generator` 收缩合并） |
| 用途 | 从 transcript、文章、研究笔记、wiki 页面里抽取问题、引用对象与检索标签 |
| 位置 | `e:\SPLLM\skills\knowledge-extractor/` |
| 触发规则 | 按需触发（用户说“提取问题”“抽引用”“补标签”“整理检索标签”时） |

#### darwin-skill（技能优化器）

| 属性 | 值 |
|------|-----|
| 名称 | darwin-skill |
| 来源 | [github.com/alchaincyf/darwin-skill](https://github.com/alchaincyf/darwin-skill) |
| 用途 | 像训练模型一样优化 Agent Skills，借鉴 Karpathy autoresearch 的自主实验循环 |
| 位置 | `e:\SPLLM\skills\darwin-skill/` |
| 触发规则 | 按需触发（用户说"优化skill"/"skill评分"/"达尔文"/"darwin"时） |

**文件结构**：
```
skills/darwin-skill/
├── SKILL.md                      # 技能定义（8维度评估+优化循环）
├── templates/                    # 成果卡片模板
│   ├── result-card.html          # 3风格主模板（swiss/terminal/newspaper）
│   ├── result-card-dark.html
│   └── result-card-white.html
├── scripts/                      # 截图脚本
│   └── screenshot.mjs            # 2x高清截图，生成成果卡片PNG
├── assets/                       # 视觉资源
└── results.tsv                   # 优化历史记录
```

**核心方法论**：
- 8维度评估体系（结构60分+效果40分，总分100）
- 棘轮机制：只保留有改进的commit，自动回滚退步
- 双重评估：结构评分（静态分析）+ 效果验证（跑测试看输出）
- 人在回路：每个skill优化完后暂停等用户确认

**优化循环**：
```
Phase 0: 初始化 → 确认优化范围、创建git分支
Phase 0.5: 测试Prompt设计 → 为每个skill设计2-3个测试prompt
Phase 1: 基线评估 → 结构评分 + 效果评分（子agent独立评估）
Phase 2: 优化循环 → 诊断→改进→评估→决策（keep/revert）
Phase 2.5: 探索性重写 → 突破局部最优（需用户同意）
Phase 3: 汇总报告 → 生成分数变化表和成果卡片
```

**与其他技能的关系**：
- knowledge-extractor：负责前置结构化提取
- darwin-skill：优化已有skill的质量
- 生态定位：先抽结构，再写作、研究或固化

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

**文档版本**：1.7
**创建日期**：2026-05-09
**最后更新**：2026-05-11（新增 5.1.1 技能构建守则四条铁律）
**GitHub 仓库**：https://github.com/tuzfanfan/SPLLM （Private，main 分支）
**维护者**：LLM Agent
**关联文档**：[[SCHEMA.md]], [[CLAUDE.md]], [[wiki/index.md]], [[wiki/log.md]]
