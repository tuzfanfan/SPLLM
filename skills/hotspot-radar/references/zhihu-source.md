# Zhihu Source Integration

## What Was Added

- `知乎热榜` 已作为 `list` 源接入 `hotspot-radar`
- 当前走知乎开放平台的 MCP `hot_list` 服务
- 实现位置：
  - `E:\SPLLM\skills\hotspot-radar\scripts\fetch_hotspot_sources.py`
  - `E:\SPLLM\skills\hotspot-radar\references\sources.json`

## Why `hot_list` First

- `hotspot-radar` 的核心任务是“抓每日热点列表”
- 知乎开放平台同时提供 `zhihu_search` 和 `hot_list`
- 对于固定信息源接入，`hot_list` 比 `zhihu_search` 更适合，因为它天然返回热榜条目，而不是要求每次传入查询词

## Auth

- 运行前需要配置环境变量：`ZHIHU_ACCESS_SECRET`
- 脚本会在运行时读取该环境变量，不把 token 写进仓库文件

## Official Endpoints

- 文档集合接口：`https://developer.zhihu.com/console/api/v2/docs`
- 热榜 MCP SSE：`https://developer.zhihu.com/api/mcp/hot_list/v1/sse`
- 搜索 MCP SSE：`https://developer.zhihu.com/api/mcp/zhihu_search/v1/sse`

## Current Scope

- 已支持：知乎热榜抓取
- 预留扩展：基于同一套 MCP 客户端继续接 `zhihu_search`
