# Agnes 故障诊断

## 401

- 检查 `Authorization: Bearer <KEY>` 格式。
- 检查环境变量是否存在、是否带换行或多余空格。
- 在控制台确认 Key 未失效。

## 400

- 文本必须包含 `model` 和 `messages`。
- 图片必须包含 `model`、`prompt`、`size`。
- 图生图的 `image` 应放在 `extra_body`。
- 图片 `response_format` 应放在 `extra_body`。
- 视频帧数必须满足 `8n+1` 且不超过 441。

## 429

- 降低请求频率。
- 对批量任务做队列和指数退避。
- 不要假设社区资料中的免费 RPM 永远不变。

## 500 / 503

- 保留服务端错误正文。
- 对临时错误使用 1、2、4、8 秒退避。
- 视频任务逐个提交，避免同时创建大量任务。

## 视频长时间无结果

先检查查询标识和端点：

- 推荐：创建响应中的 `video_id`
- 推荐端点：`GET /agnesapi?video_id=<ID>`
- 旧兼容：`GET /v1/videos/{task_id}`

不要把 `task_id` 兼容路径当作默认查询路径。

## 工具调用没有 tool_calls

服务端可能接受 `tools` 参数但不稳定返回 `tool_calls`。普通验证可记录 warning；严格验证使用：

```powershell
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py smoke-test --strict-tools
```
