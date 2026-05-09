---
title: Obsidian配置指南
created: 2026-05-08
updated: 2026-05-08
tags: [配置, Obsidian]
sources: []
type: concept
status: active
---

# Obsidian配置指南

## 快速开始

### 1. 打开工作空间
在Obsidian中：
1. 点击"打开文件夹作为仓库"
2. 选择 `e:\SPLLM` 目录
3. 确认打开

### 2. 推荐插件安装

#### 核心插件（已内置，需启用）
- **图谱视图 (Graph View)**：可视化Wiki结构
- **反向链接 (Backlinks)**：查看哪些页面链接到当前页面
- **出站链接 (Outgoing Links)**：查看当前页面链接到哪些页面
- **标签面板 (Tags)**：浏览和管理标签
- **搜索 (Search)**：全文搜索Wiki内容
- **大纲 (Outline)**：查看当前页面的大纲结构

#### 社区插件（需安装）

| 插件名称 | 用途 | 安装ID |
|----------|------|--------|
| Dataview | 查询前置元数据，生成动态表格 | dataview |
| Marp | Markdown转演示文稿 | obsidian-marp-plugin |
| Excalidraw | 设计画布 | obsidian-excalidraw-plugin |
| Mermaid图表增强 | 更好的Mermaid图表支持 | 已内置 |
| Templater | 高级模板系统 | templater-obsidian |
| Quick Add | 快速添加内容 | quickadd |

### 3. 推荐设置

#### 文件和链接设置
路径：`设置 → 文件和链接`

- **默认新笔记位置**：指定到Wiki子目录
- **附件文件夹路径**：`wiki/assets`
- **内部链接类型**：Wiki链接
- **使用 [[Wikilinks]]**：✅ 启用
- **为 wikilinks 检测 Markdown 链接**：✅ 启用

#### 编辑器设置
路径：`设置 → 编辑器`

- **默认编辑模式**：实时预览
- **显示行号**：✅ 启用
- **可读行长度**：✅ 启用

#### 外观设置
路径：`设置 → 外观`

- **基础字体大小**：16
- **界面字体**：系统默认
- **文本字体**：系统默认

### 4. 快捷键设置

路径：`设置 → 快捷键`

建议添加的快捷键：
- **下载当前文件的附件**：`Ctrl+Shift+D`
- **打开图谱视图**：`Ctrl+G`
- **打开反向链接**：`Ctrl+R`
- **全文搜索**：`Ctrl+Shift+F`

### 5. 工作流程

#### 日常使用
1. **LLM维护Wiki**：通过对话让LLM更新Wiki内容
2. **Obsidian浏览**：实时查看更新，使用图谱视图了解结构
3. **搜索导航**：使用搜索和链接快速找到相关内容
4. **标签筛选**：使用标签面板按主题浏览内容

#### 添加新内容
1. 将新来源放入 `daily-feed/` 或 `source-material/`
2. 告诉LLM处理新来源
3. LLM自动创建摘要、更新相关页面
4. 在Obsidian中查看更新结果

#### 查询和分析
1. 在对话中提出问题
2. LLM基于Wiki内容回答
3. 查看引用的Wiki页面
4. 可选：将分析结果保存为Wiki页面

#### 生成演示文稿
1. 基于Wiki内容生成Marp演示文稿
2. 在Obsidian中使用Marp插件预览
3. 导出为PDF或HTML

### 6. Dataview查询示例

#### 列出所有活跃的实体页面
```dataview
TABLE status, tags, updated
FROM "wiki/entities"
WHERE status = "active"
SORT updated DESC
```

#### 列出最近更新的页面
```dataview
TABLE type, status, updated
FROM "wiki"
SORT updated DESC
LIMIT 10
```

#### 按标签分组
```dataview
TABLE rows.file.link
FROM "wiki"
GROUP BY tags
```

### 7. 维护建议

#### 定期检查
- 每周查看一次图谱视图，了解Wiki结构
- 检查是否有孤立页面（没有入链的页面）
- 确认所有链接有效

#### 版本控制
- 建议将整个工作空间纳入Git版本控制
- 定期提交更改
- 使用有意义的提交信息

#### 备份
- 定期备份整个 `e:\SPLLM` 目录
- 可以使用Obsidian的同步功能
- 或使用第三方同步工具

---

> 此配置指南基于Hotpoint Live-Video LLM Wiki架构设计