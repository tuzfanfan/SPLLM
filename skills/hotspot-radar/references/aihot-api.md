# AI HOT API 接入说明

`AI HOT` 已合并为 `hotspot-radar` 的标准信息源，不再单独维护一个 skill。

## 公共接口

- 基础地址：`https://aihot.virxact.com/api/public`
- 资讯流：`GET /items`
- 当日日报：`GET /daily`
- 指定日期日报：`GET /daily/{YYYY-MM-DD}`
- 日报列表：`GET /dailies`

请求必须携带常规浏览器 `User-Agent`。接口按 UTF-8 解码。

## 资讯流参数

- `mode=selected|all`：默认使用精选流 `selected`
- `since`：最多回溯 7 天
- `category`：按分类筛选
- `q`：关键词搜索，长度 2 到 200 个字符
- `take`：最多 100 条
- `cursor`：服务端返回的翻页游标，按原样透传

每日自动抓取使用精选流。需要临时检索、回溯日报或扩大范围时，使用专项查询脚本：

```powershell
python E:\SPLLM\skills\hotspot-radar\scripts\query_aihot.py items --days 1 --take 20
python E:\SPLLM\skills\hotspot-radar\scripts\query_aihot.py items --days 7 --all -q agent
python E:\SPLLM\skills\hotspot-radar\scripts\query_aihot.py daily
python E:\SPLLM\skills\hotspot-radar\scripts\query_aihot.py daily --date 2026-05-31
python E:\SPLLM\skills\hotspot-radar\scripts\query_aihot.py dailies
```

## 路由规则

- 用户说“抓取今日资讯”：运行 `fetch_hotspot_sources.py fetch`，AI HOT 会和其它来源一起抓取。
- 用户说“查 AI 行业热点”“查 AI HOT”：运行 `query_aihot.py items`。
- 用户说“看 AI 日报”：运行 `query_aihot.py daily`。
- 用户说“检查信息源是否通畅”：运行 `fetch_hotspot_sources.py probe`。
