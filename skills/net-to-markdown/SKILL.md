---
name: net-to-markdown
description: Convert public webpages, browser-session pages, and MediaCrawler social-platform JSONL exports into clean, traceable Markdown through one routing interface. Use when the user provides a URL or social export and wants Markdown for reading, archiving, Obsidian, wiki ingestion, RAG, analysis, or downstream writing. Covers general webpages, WeChat/browser-only pages, Xiaohongshu, Douyin, Bilibili, Weibo, Tieba, and optional Zhihu social exports.
---

# Net To Markdown

## Overview

Use one entry point to select an independent collection backend and produce a consistent Markdown result. Preserve the source URL, backend, timestamps, and structured social metadata so downstream work remains traceable.

## Route The Input

1. General webpage or article:
   - Route to the built-in webpage backend under `backends/webpage/convert_auto.py`.
   - This is also the default route for Zhihu articles.
2. Page that needs the user's live browser session:
   - Route to the built-in webpage backend `backends/webpage/convert_via_webbridge.py`.
   - WeChat public-account pages use this route by default.
3. Social-platform content exported by MediaCrawler:
   - Route to the JSONL adapter.
   - Supported platform codes: `xhs`, `dy`, `bili`, `wb`, `tieba`, `zhihu`.
4. Unknown URL:
   - Start with the general webpage route.
   - Override the route only when the first backend fails for a known access reason.

Read [routing.md](references/routing.md) when changing domain rules or diagnosing fallback behavior.

## Run The Converter

The script lives at `scripts/net_to_markdown.py` relative to this skill.
The webpage backend lives under `backends/webpage/` relative to this skill.

Classify without fetching:

```powershell
python scripts/net_to_markdown.py "https://example.com/article" --route-only
```

Convert a general webpage:

```powershell
python scripts/net_to_markdown.py "https://example.com/article" `
  --output "outputs/net-to-markdown/article.md" `
  --route-report "outputs/net-to-markdown/article.route.json"
```

Convert a page through the live browser session:

```powershell
python scripts/net_to_markdown.py "https://mp.weixin.qq.com/s/example" `
  --backend browser-session `
  --output "outputs/net-to-markdown/wechat.md"
```

Normalize a MediaCrawler export:

```powershell
python scripts/net_to_markdown.py "https://www.xiaohongshu.com/explore/example" `
  --social-content-jsonl "data/xhs_contents.jsonl" `
  --social-comments-jsonl "data/xhs_comments.jsonl" `
  --output "outputs/net-to-markdown/xhs.md" `
  --model-output "outputs/net-to-markdown/xhs.model.json" `
  --route-report "outputs/net-to-markdown/xhs.route.json"
```

## Output Contract

- Write runtime results under `outputs/` or a user-specified path.
- Do not write directly into `wiki/`; promote the result through the workspace ingest flow after review.
- For social content, emit YAML frontmatter plus source information, body, engagement, media, representative comments, and collection notes.
- When requested, also emit:
  - normalized model JSON via `--model-output`;
  - route and failure details via `--route-report`.
- Fail explicitly when the selected backend is unavailable. Do not silently return partial or fabricated content.

Read [unified-document-schema.md](references/unified-document-schema.md) before changing field mappings or Markdown structure. Use [social-document.md.template](assets/social-document.md.template) when a downstream workflow needs a blank compatible document.

## Boundaries

- This skill is the canonical Markdown-conversion entry point and may host multiple independent backends under `backends/`.
- The social route consumes MediaCrawler JSONL exports. It does not launch MediaCrawler, manage accounts, solve captchas, or store cookies.
- Browser-session conversion requires a healthy Kimi WebBridge connection and an open browser window.
- Respect platform terms, copyright, privacy, rate limits, and MediaCrawler's license. Do not bypass access controls.
- Use `hotspot-radar` for recurring multi-source monitoring or daily collection. Use this skill for individual conversions and normalized handoff.
- Keep secrets, cookies, tokens, and personal account data out of Markdown and route reports.

## Backend Layout

- `scripts/net_to_markdown.py`: unified router and output contract
- `backends/webpage/`: webpage extraction backend
- future backends: add siblings under `backends/` instead of creating a new top-level net-adjacent skill

## Quality Check

Before delivering:

1. Confirm the route matches the source type.
2. Confirm the output contains a source URL and backend.
3. Confirm Chinese text is UTF-8 and readable.
4. Confirm failure reports identify the backend and reason.
5. Confirm social comments belong to the selected content ID.
6. Confirm the Markdown can be read independently without the route report.
