---
name: hotspot-radar
description: 面向热点信息收集与日抓原文落地的 skill。用于验证一组资讯站和热榜站是否可抓、每日抓取最新标题和链接、为可抓取站点保存正文原文，或维护一套可复用的热点采集流程；当用户希望把当日抓到的信息继续交给 last30days 做聚类、对比和趋势研究时也使用。
---

# Hotspot Radar

这个 skill 做两件事：

1. 验证一组信息源是否可以抓取。
2. 对可抓取的信息源执行每日抓取，并把标题、链接和正文保存到本地。

## 何时使用

当用户提出以下需求时触发：
- “帮我看这些网站能不能爬”
- “做一个每日热点采集 skill”
- “把这些资讯站每天抓下来”
- “抓取今日资讯”
- “把新闻标题和正文原文都存起来”
- “验证哪个站能抓全文，哪个站只能抓榜单”

如果用户直接说“抓取今日资讯”，默认理解为：

1. 立即执行一次 `fetch`。
2. 使用当前已配置的信息源。
3. 优先返回本次抓取摘要和输出文件位置。

## 和 last30days 的连接

- `hotspot-radar` 负责把今日资讯抓稳，`last30days` 负责把这些本地结果放进更大的主题研究里做聚类、对比和结论提炼。
- 当用户目标不是单纯“抓”，而是“抓完以后看趋势、看争议点、看跨源一致性”时，优先先跑 `hotspot-radar fetch`，再把 `E:\SPLLM\outputs\hotspot-radar\<YYYY-MM-DD>\` 里的 `summary.json`、`probe.json`、`articles\`、`lists\` 交给 `last30days` 继续研究。
- `hotspot-radar` 的输出不是终点，而是 `last30days` 的本地证据输入之一。

## 输出位置

脚本默认把结果写到：

`E:\SPLLM\outputs\hotspot-radar\<YYYY-MM-DD>\`

其中包括：
- `probe.json`：站点能力验证结果
- `summary.json`：本次抓取摘要
- `articles\`：按站点保存的正文 markdown
- `lists\`：按站点保存的标题和链接 json

## 使用方法

先做能力验证：

```powershell
python E:\SPLLM\skills\hotspot-radar\scripts\fetch_hotspot_sources.py probe
```

再执行每日抓取：

```powershell
python E:\SPLLM\skills\hotspot-radar\scripts\fetch_hotspot_sources.py fetch
```

只抓指定站点：

```powershell
python E:\SPLLM\skills\hotspot-radar\scripts\fetch_hotspot_sources.py fetch --sources jazzyear,iresearch,199it
```

## 站点分层

这个 skill 把信息源分成三类：

1. `article`
   - 既能拿到标题和链接，也能拿到文章正文。
2. `list`
   - 只能稳定拿到榜单标题和跳转链接，不承诺正文原文。
3. `reminder`
   - 当前环境下不适合做稳定抓取，只保留提醒入口。

## 当前默认策略

- 对 `article` 源：抓首页最新文章，进入详情页提取正文段落。
- 对 `list` 源：抓榜单标题和跳转链接，不追正文。
- 对 `reminder` 源：记录提醒，不伪装成可自动正文抓取。

## 当前源状态

- `article`：甲子光年、艾瑞网、199IT、发现报告
- `list`：今日热榜、热点日报、NewsNow、知乎热榜
- `reminder`：热榜聚合、萝卜投研、BCG Publications

## 边界

- 像 BCG 这种直接返回 `403` 的站点，不纳入自动正文抓取。
- 强依赖前端渲染、登录或短时不稳定的站点，不默认纳入正文抓取。
- 热榜聚合站通常只抓榜单层，不把外链原文当作它自己的正文。

## 维护约定

- 新增站点时，优先修改 [sources.json](E:\SPLLM\skills\hotspot-radar\references\sources.json)。
- 如果某个站点需要特殊签名或正文清洗规则，再改脚本。
- 不要把“提醒源”伪装成“正文源”。

## 知乎源接入说明

- `知乎热榜` 已作为正式 `list` 源接入，当前通过知乎开放平台的 MCP `hot_list` 服务抓取。
- 运行前需要配置环境变量 `ZHIHU_ACCESS_SECRET`，脚本会在运行时以 Bearer 方式读取，不把 token 写入仓库。
- 对 `hotspot-radar` 来说，优先接入 `hot_list` 比 `zhihu_search` 更合适，因为它天然返回热点列表，而不是要求每次传入搜索词。
- 如后续需要做主题跟踪或关键词监控，可在当前知乎 MCP 客户端能力上继续扩展 `zhihu_search`。

## Fabric 融合增强

从 2026-05-19 起，这个 skill 增加一层 briefing 模块，让抓下来的热点不只停留在原始列表。需要把抓取结果变成摘要、微摘要、五句话摘要、标签、初步对比时，先读 `references/fabric-briefing-pack.md`。

优先使用的 Fabric 风格模块：
- `summarize`
- `create_micro_summary`
- `create_5_sentence_summary`
- `create_tags`
- `compare_and_contrast`

使用原则：
- `hotspot-radar` 先负责抓，再负责生成轻量 briefing
- 需要跨平台、跨 30 天、跨社区趋势判断时，再把结果交给 `last30days`
