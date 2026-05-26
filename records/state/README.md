---
title: State 目录说明
created: '2026-05-20'
updated: '2026-05-20'
tags:
- state
- 目录说明
sources: []
type: note
status: active
---

# State 目录说明

本目录用于记录运行状态，而不是长期知识。

它主要解决三个问题：

1. 哪些内容已经见过
2. 哪些内容已经进入 digest
3. 哪些内容已经落库到 wiki

推荐记录类型：

- `match-run`
- `digest-run`
- `sync-run`
- `seen-snapshot`
- `promotion-log`

建议文件形态：

- 面向人读的运行记录：`.md`
- 面向程序读的状态快照：`.json` / `.jsonl`

最低要求：

- 每次批量匹配后，至少保留 1 份 state 记录
- 每次从 digest 推入 wiki 后，至少记录输出页面
- 同一条内容一旦进入正式 wiki，应能反查其对应的 digest 或 state
