# SPLLM - 结构化知识库与技能系统
> **S**tructured **P**ersonal **L**earning & **L**LM **M**anagement

一个基于 Obsidian 构建的、与 LLM 深度集成的个人知识管理系统，支持书籍蒸馏、概念提取、技能生成和 AI 辅助创作。

---

## 🌟 项目愿景

将零散的学习资料转化为结构化的知识资产，通过 AI 辅助实现：
- **知识沉淀**：自动提取书籍、文章中的核心概念和实体
- **技能生成**：将知识提炼为可复用的技能模块
- **智能检索**：通过概念网络快速定位相关知识
- **创作辅助**：基于知识库生成高质量内容

---

## 📦 项目结构

```
SPLLM/
├── 📚 wiki/                    # 核心知识库（Obsidian Vault）
│   ├── sources/               # 来源摘要（2,791个）- 书籍/文章摘要
│   ├── concepts/              # 概念页面（1,240个）- 抽象概念/主题
│   ├── entities/              # 实体页面（1,244个）- 人物/公司/产品
│   └── index.md               # 知识库总索引
├── 🛠️ skills/                  # 技能插件系统
│   ├── hv-analysis/           # 横纵分析法 v2.0
│   ├── book2skill/            # 书籍蒸馏（RIA-TV++）
│   ├── prompt-flow/           # 提示词决策流程 v1.3
│   ├── oral-copy/             # 口播文案与公众号长文
│   ├── neat-freak/            # 知识库清理
│   ├── khazix-writer/         # 卡兹克写作风格
│   ├── darwin-skill/          # 技能优化器
│   └── hotspot-radar/         # 热点采集与 AI HOT 查询
├── 📖 books/                   # 书籍蒸馏产物
│   └── mao-xuanji/            # 毛选选集技能化（10个技能）
├── 📰 daily-feed/              # 每日市场信息（15个AI工具手册）
├── 📄 raw/                     # 原始素材（82个品牌营销文档）
├── 📑 CLAUDE.md                # Agent操作手册 v1.8
├── 📑 AGENTS.md                # 工作流程说明 v1.6
├── 📑 SCHEMA.md                # 完整规范文档
└── 📑 README.md                # 本文档
```

---

## 🍎 核心功能

### 1. 知识库（Wiki）
基于 Obsidian 的三层知识架构：

| 类型 | 数量 | 用途 | 示例 |
|------|------|------|------|
| **Sources** | 2,791 | 来源摘要 | 书籍摘要、文章摘要 |
| **Concepts** | 1,240 | 抽象概念 | "心理学"、"投资"、"持久战" |
| **Entities** | 1,244 | 具体实体 | "马云"、"苹果公司"、"脑白金" |

**关联方式**：
- 双向链接：`[[概念名]]`
- 网盘关联：每个 source 包含 `webdav_url` 指向夸克网盘原始文件
- 标签系统：`#tag` 和 frontmatter 标签

### 2. 技能系统（Skills）
可复用的 AI 辅助技能模块：

#### hv-analysis v2.0 - 横纵分析法（六维度商业分析框架）
- 需求场景、解决方案、商业模式
- 竞争优势、风险挑战、增长飞轮

#### book2skill - 书籍蒸馏
RIA-TV++ 六阶段流水线：
1. **R**ead - 粗读定位
2. **I**nterpret - 细读拆分
3. **A**nnotate - 标注提炼
4. **T**ransform - 转译重构
5. **V**alidate - 验证测试
6. **I**ntegrate - 整合发布

#### prompt-flow v1.3 - 提示词决策（五阶段决策流程）
1. 反向沟通（明确需求）
2. 维度判断（选择类别）
3. 类别判断（确定子类）
4. 生成内容
5. 自检优化

类别体系：A(写作)、B(分析)、C(创意)、D(书籍)、E(AI生成)

### 3. 网盘整合

**夸克网盘（AList）**：
- Web界面：`http://localhost:5244`
- WebDAV：`http://localhost:5244/dav/夸克/电子书数据/md/`
- API：`http://localhost:5244/api/fs/list`
- 已存储：1,817本电子书

**关联机制**：
- wiki 中 1,236 个文件包含 `webdav_url`
- 点击链接直接在线预览（非下载）
- 本地 book 文件夹已清空，减轻硬盘负担

---

## 🚀 工作流程

### Ingest（知识摄入）
```
daily-feed/ + raw/ + 网盘电子书
    → 提取摘要 → wiki/sources/
    → 提取实体 → wiki/entities/
    → 提取概念 → wiki/concepts/
    → 添加网盘链接 → webdav_url
    → 更新索引 → wiki/index.md
```

### Digest（知识消化）
```
网盘电子书 + raw文档
    → book2skill 蒸馏
    → 生成技能模块
    → skills/
```

### Create（内容创作）
```
prompt-flow 决策
    → 选择技能（oral-copy/hv-analysis/etc）
    → 生成内容
```

---

## 🔧 技术栈

| 组件 | 技术 |
|------|------|
| 知识库 | Obsidian + Markdown |
| 版本控制 | Git + GitHub |
| 网盘服务 | AList v3 + 夸克网盘 |
| PDF生成 | fpdf2 (Python) |
| 自动化 | PowerShell / Python |

---

## 📊 项目统计

| 指标 | 数量 |
|------|------|
| 知识库总页面 | 5,275 |
| 技能模块 | 20个 |
| 网盘电子书 | 1,817本 |
| 原始素材 | 82个文档 |
| AI工具手册 | 15个 |
| 毛选技能 | 10个 |

---

## 📖 使用指南

### 快速开始
1. **克隆仓库**
   ```bash
   git clone https://github.com/tuzfanfan/SPLLM.git
   cd SPLLM
   ```

2. **用 Obsidian 打开**
   - 打开 Obsidian
   - "Open folder as vault" → 选择 `SPLLM/wiki/`

3. **启动 AList（如需网盘访问）**
   ```bash
   # AList 需单独安装配置
   # 默认访问 http://localhost:5244
   ```

### 添加新内容
1. 将文件放入 `daily-feed/` 或 `raw/`
2. 触发 Ingest 流程（通过 Agent）
3. 自动提取并生成 wiki 页面

### 书籍蒸馏

1. 确保书籍在夸克网盘
2. 运行 book2skill 技能
3. 按 RIA-TV++ 流程处理
4. 输出到 `skills/` 或 `books/`

---

## 🔗 重要链接

- **GitHub 仓库**：https://github.com/tuzfanfan/SPLLM
- **CLAUDE.md**：Agent 操作手册
- **AGENTS.md**：工作流程说明
- **SCHEMA.md**：完整规范文档

---

## 📝 更新日志

### 2026-05-15
- Wiki 健康度清理：删除 1,591 个空壳/重复/乱码页面
- 网盘资源整合：1,236 个文件添加 webdav_url
- CLAUDE.md 更新至 v1.8

### 2026-05-14
- 批量处理 1,472 本电子书到 wiki
- 上传电子书到夸克网盘
- 清空本地 book 文件夹

### 2026-05-11
- 安装 book2skill、darwin-skill
- 毛选选集拆书试点
- prompt-flow 升级至 v1.3

### 2026-05-10
- 项目上传 GitHub
- oral-copy 升级至 v2.0
- 生成 AI 提示词策略指南

### 2026-05-09
- 项目初始化
- 搭建基础架构
- 安装首批技能

---

## 👥 维护者

- **创建者**：tuzfanfan
- **邮箱**：47049333@qq.com
- **AI 助手**：Claude (Anthropic)

---

## 📄 许可证

Private Repository - 个人知识管理系统

---

> 💡 **提示**：本项目是高度个人化的知识管理系统，建议根据自身需求调整结构和流程。
