# Agnes API Reference

## 基础配置

- API 网关：`https://apihub.agnes-ai.com`
- OpenAI 兼容 Base URL：`https://apihub.agnes-ai.com/v1`
- 鉴权：`Authorization: Bearer <API_KEY>`

## 模型与端点

| 能力 | 模型 | 端点 |
| --- | --- | --- |
| 文本/推理/Agent | `agnes-2.0-flash` | `POST /v1/chat/completions` |
| 图片生成/编辑 | `agnes-image-2.1-flash` | `POST /v1/images/generations` |
| 视频生成 | `agnes-video-v2.0` | `POST /v1/videos` |
| 视频查询 | 创建响应中的 `video_id` | `GET /agnesapi?video_id=<ID>` |

## 图片

文生图必填：`model`、`prompt`、`size`。

图生图的输入图片和输出格式放在 `extra_body`：

```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "Preserve composition and change the scene to a rainy night",
  "size": "1024x768",
  "extra_body": {
    "image": ["https://example.com/input.png"],
    "response_format": "url"
  }
}
```

## 视频

- `num_frames <= 441`
- `num_frames = 8n + 1`
- 常用值：81、121、161、241、441
- `frame_rate`：1-60，推荐 24
- 近似时长：`num_frames / frame_rate`
- 单图可用顶层 `image`
- 多图和关键帧使用 `extra_body.image`

视频创建后从响应中读取 `video_id` 或兼容字段 `id`，然后使用：

```text
GET /agnesapi?video_id=<ID>
```

旧接口 `GET /v1/videos/{task_id}` 只作为兼容回退。

## 文本高级能力

- 流式输出：`stream: true`
- 工具定义：OpenAI Chat Completions 的 `tools`
- 工具选择：`tool_choice`
- Thinking 可通过兼容参数配置，但不同客户端可能过滤未知参数

## 易变信息

模型规格、价格、免费额度和 RPM 会变化。需要精确当前值时查阅：

- https://agnes-ai.com/doc/overview
- https://agnes-ai.com/doc/agnes-video-v20
- https://platform.agnes-ai.com
