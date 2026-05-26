---
title: AI算力与供应链基础设施
created: '2026-05-20'
updated: '2026-05-24'
tags:
- intent
- AI基础设施
- 算力
- 供应链
sources: []
type: intent
status: active
cadence: daily
default_digest_kind: daily
default_output: concept
intent_status: active
owner: assistant
priority: high
related_pages: []
upstreams:
- hotspot-radar
- aihot
- last30days
---

# AI算力与供应链基础设施

## 监控目标

> 持续跟踪 AI 产业背后的算力部署、芯片、存储、材料、数据中心、区域节点与供应链重组信号。

## 为什么持续跟踪

- AI 竞争的长期上限，不只取决于模型，还取决于算力供给与供应链稳定性。
- 这类信号往往对产业判断、投资叙事和产品机会判断有前置作用。
- 如果后续做产业研究、商业分析或产品机会筛选，这会是一条高价值长期主线。

## 监控边界

### 包含

- GPU、存储、数据中心、云基础设施布局
- 芯片、电子材料、上游供应链协同与国产替代
- 区域 AI 投资与节点部署，例如新加坡、中东、东南亚等
- 会影响 AI 成本、供给、可用性的行业变化

### 不包含

- 单纯消费电子新品发布
- 只讲模型效果、没有基础设施含义的普通 AI 新闻
- 与算力或供应链关系较弱的泛科技投融资消息

## 优先来源

- `hotspot-radar`
- `aihot`
- `last30days`
- `36氪`
- `财联社/华尔街见闻` 类快讯
- 国际科技商业媒体
- 公司财报、官方公告、交易所公告

## 默认分析口径

- 这条信号影响的是成本、产能、交付还是区域布局
- 它是短期行情噪音，还是长期供给变化
- 背后反映的是单点公司动作，还是产业链结构变化
- 对中国语境下的产品机会意味着什么

适合映射的 skill：

- `newsletter-entry`
- `hv-analysis`

## 建议输出去向

- `concept`
- `product`

## 关联页面

- [[intent-digest-state-schema]]

## 状态备注

- 当前阶段：候选 intent 初稿
- 最近一次有效命中：2026-05-20 RSS 抓取中出现新加坡 AI 投资、DRAM/NAND 涨价、中芯国际等供应链中心消息
- 后续动作：连续观察一周，建立“算力供给 / 存储 / 区域节点 / 供应链协同”四个子标签
