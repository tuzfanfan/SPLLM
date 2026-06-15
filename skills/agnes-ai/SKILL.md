---
name: agnes-ai
description: Use this skill only when the user explicitly asks to use Agnes AI, Agnes API, Agnes models, agnes-2.0-flash, agnes-image, agnes-video, or asks to configure/troubleshoot Agnes in Hermes or another client. Do not trigger for generic text, image, or video generation requests unless the user clearly says to use Agnes.
---

# Agnes AI

统一调用 Agnes AI 的文本、图片和视频能力，并处理 Agnes 接入、Hermes 配置与故障排查。

## 触发边界

只有当用户的任务中**明确涉及 Agnes** 时才使用本技能。

应该触发：

- “使用 Agnes 生成一张图”
- “用 Agnes Video 做一段视频”
- “帮我配置 Hermes 使用 Agnes”
- “Agnes API 返回 401 怎么办”
- “调用 agnes-2.0-flash 写一段文案”
- “用 Agnes Image 2.1 改这张图”

不应该触发：

- “生成一张图”
- “写一段文案”
- “做一个视频”
- “帮我调用一个免费模型”
- “用 AI 生成封面”

如果用户没有明确说 Agnes，按当前环境的默认工具或其他更合适的技能处理；不要主动切换到 Agnes。

## 入口

使用统一脚本，不要临时重写请求：

```powershell
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py <command>
```

API Key 只从环境变量读取：

```powershell
$env:AGNES_API_KEY="YOUR_API_KEY"
```

兼容 `AGNES_API_TOKEN`、`APIHUB_AGNES_API_KEY`。可用 `AGNES_API_BASE` 覆盖默认网关。禁止把密钥写入技能、代码、日志或回复。

## 路由

- 文本、流式输出、工具调用：`text`
- 文生图、图生图、图片编辑：`image`
- 文生视频、图生视频、多图/关键帧：`video`
- 查询视频结果：`video-get`
- 最小真实验证：`smoke-test`
- Hermes 接入：读取 [hermes.md](references/hermes.md)
- 参数细节：读取 [api.md](references/api.md)
- 错误诊断：读取 [troubleshooting.md](references/troubleshooting.md)

## 常用命令

```powershell
# 文本
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py text --prompt "用三句话解释 Agent skill"

# 流式文本
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py text --prompt "写一段产品介绍" --stream

# 文生图
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py image --prompt "未来城市夜景，电影感" --size 1024x768

# 图生图
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py image --prompt "改成雨夜赛博朋克风格，保留构图" --image "https://example.com/input.png"

# 文生视频并轮询
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py video --prompt "海边日落，一只猫缓慢行走，电影镜头" --poll

# 查询视频，优先使用创建响应中的 video_id
python E:\SPLLM\skills\agnes-ai\scripts\agnes_api.py video-get "<video_id>"
```

## 生成规则

1. 图片和视频提示词若含非英文内容，默认翻译为英文后调用，并保留原始视觉要求。
2. 图片默认使用 `agnes-image-2.1-flash`。
3. 视频默认使用 `agnes-video-v2.0`，`num_frames=121`、`frame_rate=24`。
4. `num_frames` 必须满足 `8n+1` 且不超过 441。
5. 视频是异步任务。创建后优先用 `video_id` 查询 `/agnesapi?video_id=...`。
6. 仅在兼容旧任务时使用 `video-get <task_id> --legacy-task-id`。
7. 真实视频测试耗时较长；用户明确要求使用 Agnes 生成视频时可直接执行，否则 smoke test 默认不创建视频。

## 冲突处理

本技能整合：

- `lj1270998580-crypto/Agnes-help-skill`：接入、Hermes 配置和故障诊断
- `kangarooking/agnes-free-model-skills`：参数校验和分模态调用实践
- `Yacey/agnes-ai-generation-skill`：统一 CLI、提示词翻译和生成工作流

当社区说明冲突时，以 Agnes 官方文档和较新的接口行为为准。特别是视频查询，使用 `video_id` 优先，不沿用旧版默认 `task_id` 查询。
