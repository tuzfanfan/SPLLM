# Routing Reference

## Default Routes

| Source | Route | Backend | Notes |
|---|---|---|---|
| General HTTP/HTTPS page | `web` | `webpage-auto` | Delegates to `net-to-markdown/backends/webpage/convert_auto.py` |
| `mp.weixin.qq.com` | `browser-session` | `webbridge` | Requires a connected browser window |
| Xiaohongshu | `social` | `mediacrawler-jsonl` | Platform code `xhs` |
| Douyin | `social` | `mediacrawler-jsonl` | Platform code `dy` |
| Bilibili | `social` | `mediacrawler-jsonl` | Platform code `bili` |
| Weibo | `social` | `mediacrawler-jsonl` | Platform code `wb` |
| Baidu Tieba | `social` | `mediacrawler-jsonl` | Platform code `tieba` |
| Zhihu | `web` | `webpage-auto` | Force `social --platform zhihu` for MediaCrawler exports |

## Domain Matches

- Xiaohongshu: `xiaohongshu.com`, `xhslink.com`
- Douyin: `douyin.com`, `iesdouyin.com`
- Bilibili: `bilibili.com`, `b23.tv`
- Weibo: `weibo.com`, `m.weibo.cn`
- Tieba: `tieba.baidu.com`
- Browser session: `mp.weixin.qq.com`

Subdomains inherit the parent-domain route.

## Overrides

- `--backend web`: force the general webpage converter.
- `--backend browser-session`: force the live browser converter.
- `--backend social --platform <code>`: force the MediaCrawler JSONL adapter.
- `--route-only`: report the decision without fetching or writing Markdown.

## Failure Semantics

- Missing delegated script: fail with `Web backend not found`.
- Browser unavailable: preserve the WebBridge error in the route report.
- Social route without content JSONL: fail with a clear input requirement.
- Invalid JSONL: report file and line number.
- Backend non-zero exit: expose the final diagnostic excerpt and mark the route report `failed`.

Do not automatically switch to a weaker backend after a failure when that could change content fidelity. Report the failure and let the operator choose an override.
