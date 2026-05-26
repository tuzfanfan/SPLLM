---
title: Intent Digest State 中间层规范草案
created: '2026-05-20'
updated: '2026-05-24'
tags:
- 架构
- workflow
- intent
- digest
- state
sources: []
type: source
status: draft
---

# Intent Digest State 中间层规范草案

> 用于在 `采集层` 与 `Wiki 知识层` 之间增加一层可持续监控、摘要沉淀与运行状态追踪的中间结构。

## 这层解决什么问题

当前工作空间已经具备较强的：

- 信息采集能力：`hotspot-radar`、`aihot`、`last30days`
- 知识沉淀能力：`source -> entity/concept -> product/presentation`
- 生产能力：`hv-analysis`、`oral-copy`、`newsletter-entry`

但仍缺少三类长期对象：

1. 我们要持续盯什么
2. 今天抓到的新信息与哪些长期主题有关
3. 哪些内容已经看过、写过、用过，不该重复进入摘要或 Wiki

因此补入一层：

`input streams -> intent -> digest -> wiki`

同时用 `state` 追踪运行状态、去重状态和落库状态。

## 三个核心对象

### 1. Intent

`Intent` 是长期存在的关注主题，不是一次性请求。

适合承载：

- 长期追踪的话题
- 竞争监控对象
- 行业观察哨
- 产品机会雷达
- 特定项目的招商/合作/政策信号

示例：

- `低空经济商业化进展`
- `AI 视频生成工具竞争格局`
- `大学城科教文旅合作机会`

### 2. Digest

`Digest` 是某个时间窗内、围绕一个或多个 intent 的摘要性中间产物。

它的定位不是最终知识页，而是：

- 当日简报
- 周度摘要
- 事件触发摘要
- 准备进入 wiki 前的候选分析稿

### 3. State

`State` 记录运行中的事实状态，不承担长期知识表达。

它负责保存：

- 哪些条目已经见过
- 哪些条目已匹配到哪些 intent
- 哪些条目已经进入 digest
- 哪些条目已经落库到 wiki
- 某次运行的输入、输出与异常

## 目录约定

### 1. `wiki/intents/`

存放长期关注主题页，属于半知识页、半配置页。

建议内容：

- 主题定义
- 监控边界
- 优先来源
- 默认分析视角
- 与现有 concept/entity/product 的关联

### 2. `records/digests/`

存放阶段性摘要，不直接等同于正式 wiki 页面。

建议按时间粒度分层：

- `records/digests/daily/`
- `records/digests/weekly/`
- `records/digests/event/`

### 3. `records/state/`

存放运行状态、匹配状态、去重状态和同步状态。

这层允许 Markdown、JSON、JSONL 并存，但建议：

- 面向人读的运行记录用 `.md`
- 面向程序读的状态快照用 `.json` / `.jsonl`

## 与现有工作流的关系

### Ingest 前后新增一层匹配动作

推荐流程从：

`raw/daily-feed/AList -> source -> entity/concept -> product`

演进为：

`raw/daily-feed/AList/API -> candidate items -> intent match -> digest -> source/entity/concept/product`

### 推荐职责划分

- `hotspot-radar`：采集今日热点原文和列表
- `aihot`：采集 AI 资讯流
- `last30days`：做主题研究、跨平台讨论提炼
- `intent`：定义持续关注主题
- `digest`：承接当天或当周的命中内容
- `wiki`：只吸收值得长期沉淀的部分

## Frontmatter 规范

## Intent 页面 frontmatter

```yaml
---
title: 低空经济商业化进展
created: 2026-05-20
updated: 2026-05-20
tags: [intent, 低空经济, 产业观察]
sources: []
type: intent
status: active
intent_status: active
priority: high
cadence: daily
owner: assistant
upstreams: [hotspot-radar, last30days]
default_digest_kind: daily
default_output: source
related_pages: [低空经济]
---
```

字段说明：

- `type`: 固定为 `intent`
- `intent_status`: `active | paused | archived`
- `priority`: `high | medium | low`
- `cadence`: `hourly | daily | weekly | event | manual`
- `upstreams`: 默认采集来源或上游技能
- `default_digest_kind`: 默认进入哪类 digest
- `default_output`: 默认导向 `source | concept | entity | product | presentation`

## Digest 页面 frontmatter

```yaml
---
title: 2026-05-20_AI视频生成工具竞争_日报
created: 2026-05-20
updated: 2026-05-20
tags: [digest, 日报, AI视频]
sources: []
type: digest
status: active
digest_kind: daily
digest_status: draft
window_start: 2026-05-19T00:00:00+08:00
window_end: 2026-05-20T00:00:00+08:00
intents: [AI视频生成工具竞争格局]
upstreams: [hotspot-radar, aihot]
item_count: 12
output_candidates: [concept, product]
---
```

字段说明：

- `type`: 固定为 `digest`
- `digest_kind`: `daily | weekly | event | ad-hoc`
- `digest_status`: `draft | reviewed | promoted | archived`
- `window_start` / `window_end`: 摘要覆盖时间窗
- `intents`: 本摘要对应的 intent
- `item_count`: 进入本摘要的候选条目数
- `output_candidates`: 可能导向的 wiki 类型

## State 记录 frontmatter

```yaml
---
title: 2026-05-20_hotspot-radar_intent-match_run-01
created: 2026-05-20
updated: 2026-05-20
tags: [state, run-log, hotspot-radar]
sources: []
type: state
status: active
state_kind: match-run
run_status: success
upstream: hotspot-radar
window_start: 2026-05-20T00:00:00+08:00
window_end: 2026-05-20T23:59:59+08:00
intent_count: 4
item_count: 38
matched_count: 16
digest_outputs: []
wiki_outputs: []
---
```

字段说明：

- `type`: 固定为 `state`
- `state_kind`: `match-run | digest-run | sync-run | seen-snapshot | promotion-log`
- `run_status`: `success | partial | failed`
- `intent_count`: 本次运行参与匹配的 intent 数
- `item_count`: 本次读取的候选条目数
- `matched_count`: 成功命中的条目数
- `digest_outputs`: 产出的 digest 文件
- `wiki_outputs`: 推入 wiki 的正式页面

## 最小落地原则

第一阶段不要求：

- Qdrant
- embedding
- 向量匹配
- 自动触发服务

第一阶段先做到：

1. 有 intent 页
2. 有 digest 页
3. 有 state 页
4. 有统一 frontmatter
5. 有明确的“从哪来、到哪去、是否已用”的状态记录

## 推荐推进顺序

1. 先人工创建 3 到 5 个高价值 intent
2. 用 `hotspot-radar` 或 `aihot` 的结果先手工生成一轮 digest
3. 用 `state` 记录一次完整运行
4. 再决定是否把匹配逻辑脚本化
5. 最后再考虑 embedding / vector store

## 关联页面

- [[index]]
- [[log]]
- [[README]]
- [[hotpoint-live-video-llm-wiki-en]]
