# Hermes 接入 Agnes

将 Agnes 配置为 Hermes 的自定义 OpenAI 兼容服务商：

```bash
hermes config set model.provider custom
hermes config set model.base_url https://apihub.agnes-ai.com/v1
hermes config set model.api_key YOUR_API_KEY
hermes config set model.default agnes-2.0-flash
```

注意：

- Base URL 只填到 `/v1`，不要包含 `/chat/completions`。
- `model.api_key` 通常只填 Key 本身，不手动添加 `Bearer`。
- 配置后启动测试会话，确认普通文本请求能够返回。
- 图片和视频调用优先通过本技能的 `scripts/agnes_api.py`，不要假设 Hermes 的普通文本模型配置会自动支持多模态生成端点。

自然语言调用示例：

```text
使用 Agnes 生成一张未来城市夜景图，1024x768。
```

```text
使用 Agnes 把这张公网图片改成雨夜赛博朋克风格，并保留原构图。
```

```text
使用 Agnes 生成一段约 5 秒的产品展示视频，完成后返回视频链接。
```
