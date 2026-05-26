---
title: AI应用层入口竞争
created: '2026-05-20'
updated: '2026-05-24'
tags:
- intent
- AI应用
- 产品竞争
- 工作流
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

# AI应用层入口竞争

## 监控目标

> 持续跟踪 AI 如何嵌入协作、内容、搜索、办公与创作入口，观察谁正在成为用户默认工作流入口。

## 为什么持续跟踪

- AI 竞争正在从模型能力转向具体产品入口与使用场景。
- 这类变化最容易转化为产品洞察、竞品比较与概念产品机会。
- 对当前工作空间里的 AI 产品分析、内容生产和知识产品化都直接相关。

## 监控边界

### 包含

- 协作产品中的 AI 助手、AI 画布、AI 工作区
- 搜索、视频、邮箱、文档、设计等高频入口的 AI 改造
- 面向普通用户或团队工作流的 AI 原生交互方式
- 能改变使用习惯或平台默认入口的产品更新

### 不包含

- 纯底层模型发布但没有明确应用入口的更新
- 与用户工作流弱相关的学术论文或纯基础设施消息
- 只具备营销口号、缺少产品形态信息的泛 AI 宣发

## 优先来源

- `hotspot-radar`
- `aihot`
- `last30days`
- `TechCrunch`
- `36氪`
- `The Guardian Technology`
- 产品官方博客 / 发布会 / 更新日志

## 默认分析口径

- 谁在争夺默认入口
- 它替代的是哪一步旧工作流
- 用户会不会真正迁移
- 是功能叠加，还是产品范式变化

适合映射的 skill：

- `quick-compare`
- `newsletter-entry`
- `hv-analysis`

## 建议输出去向

- `concept`
- `comparison`
- `product`

## 关联页面

- [[intent-digest-state-schema]]
- [[AI视频图像生成提示词策略综合指南]]

## 状态备注

- 当前阶段：候选 intent 初稿
- 最近一次有效命中：2026-05-20 RSS 抓取中出现 Figma AI assistant、Ask YouTube、Gmail AI inbox 等信号
- 后续动作：继续累计 3 到 7 天样本，再决定是否拆分为“协作入口”“搜索入口”“创作入口”子 intent
