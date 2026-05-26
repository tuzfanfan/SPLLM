# Hotspot Radar Source Types v2

这份文档定义 `hotspot-radar` 下一阶段的 source type 设计。

目标不是替换现有 `article / list / reminder`，而是在现有抓取器上补两类更稳定、维护成本更低的源：

1. `rss`
2. `newsapi_aggregator`

## 为什么要加这两类

当前 `hotspot-radar` 的强项是：

- 自建站首页抓取
- 热榜页抓取
- 个别详情页正文落地

当前的短板是：

- 很多站点只能靠 HTML 规则，维护成本高
- 国际媒体与英文科技媒体覆盖弱
- 已经能标准化订阅的源还在被当成网页硬抓

因此 v2 的判断是：

- 能用 RSS 的，优先 RSS
- 能用聚合 API 的，不再逐站手写解析

## Source Type 1: `rss`

### 适用场景

- 媒体、博客、研究机构、快讯流已提供 RSS / Atom
- 希望稳定获取 `标题 + 链接 + 发布时间 + 摘要`
- 不想继续依赖首页 HTML 结构

### 推荐接入对象

- The Guardian
- SCMP
- NPR
- Washington Post
- Bloomberg Markets
- 华尔街见闻
- 第一财经
- 36氪
- 虎嗅
- 财联社电报
- 澎湃
- 国家统计局
- Nature
- HelloGitHub

### 配置字段

```json
{
  "id": "guardian-world",
  "label": "The Guardian World",
  "kind": "rss",
  "home_url": "https://www.theguardian.com/world",
  "feed_url": "https://www.theguardian.com/world/rss",
  "rss_fetch_detail": false,
  "rss_use_content_field": true
}
```

字段说明：

- `kind`: 固定为 `rss`
- `feed_url`: 实际 RSS / Atom 地址；可与 `home_url` 不同
- `rss_fetch_detail`: 是否在拿到 feed 条目后继续抓详情页正文
- `rss_use_content_field`: 是否优先使用 feed 自带摘要或正文片段

### 抓取策略

1. 拉 feed
2. 解析 `title / link / published_at / summary`
3. 将完整条目保存到 `feeds/<source_id>.json`
4. 如摘要足够丰富，直接落地为 `articles/<source_id>/*.md`
5. 如 `rss_fetch_detail=true`，则继续抓文章详情页正文

## Source Type 2: `newsapi_aggregator`

### 适用场景

- 想快速补齐国际主流媒体覆盖
- 不希望为 Reuters / FT / WSJ / Wired 等逐个写抓取规则
- 更在意统一结构和稳定拉取，而不是站点 HTML 细节

### 背后服务

当前默认按 NewsAPI.ai 官方公开的 Event Registry 文章检索接口设计：

- 官方主页示例展示了 `eventregistry.org/api/v1/article/getArticles`
- 官方说明支持按 `sourceUri`、`sourceGroupUri`、`lang` 等方式过滤

### 推荐接入对象

- Reuters
- BBC
- NYT
- WSJ
- FT
- The Economist
- Bloomberg
- The Atlantic
- NPR
- TechCrunch
- Wired
- Ars Technica
- Vox

### 配置字段

```json
{
  "id": "global-business-wire",
  "label": "Global Business Wire",
  "kind": "newsapi_aggregator",
  "home_url": "https://newsapi.ai/",
  "api_url": "https://eventregistry.org/api/v1/article/getArticles",
  "api_key_env": "NEWSAPIAI_API_KEY",
  "source_uris": ["reuters.com", "ft.com", "wsj.com", "bloomberg.com"],
  "lang": ["eng"],
  "article_sort_by": "date",
  "article_data_type": "news"
}
```

字段说明：

- `kind`: 固定为 `newsapi_aggregator`
- `api_url`: 聚合接口地址
- `api_key_env`: 读取 API key 的环境变量名
- `source_uris`: 希望纳入的媒体域名或 source URI
- `lang`: 语言过滤
- `article_sort_by`: 排序策略，默认建议 `date`
- `article_data_type`: 默认建议 `news`，避免 blog / PR 噪音

### 抓取策略

1. 用 `source_uris` 或 `source_group_uri` 调聚合接口
2. 取统一返回的 `title / url / body or summary / date / source`
3. 将完整结果保存到 `feeds/<source_id>.json`
4. 将有摘要或正文片段的条目落成 `articles/<source_id>/*.md`

### 使用边界

- 这层更适合“稳定补国际媒体覆盖”，不适合代替你的深度正文抓取器
- 如果某条来源后续非常重要，再单独升级为 `article` 源
- 如果没有 `NEWSAPIAI_API_KEY`，此类型应在 probe/fetch 中明确报缺失，而不是静默失败

## 推荐分层

- `article`: 自建站或资讯站正文抓取
- `list`: 热榜/快讯标题抓取
- `rss`: 稳定订阅型信息源
- `newsapi_aggregator`: 国际媒体聚合入口
- `reminder`: 暂不自动化但值得保留的源

## 推荐演进顺序

1. 先接 3 到 5 个高价值 RSS 源
2. 再接 1 个国际媒体聚合源
3. 连续跑 3 到 7 天，观察失败率、重复率、信息密度和对 `last30days` 的可用性
4. 再决定是否继续扩容
