---
name: webpage-to-markdown
description: Convert a webpage URL into clean, LLM-ready Markdown using either direct fetch or a real browser session. Use when the user wants to turn an article, blog post, documentation page, reference URL, WeChat article, logged-in page, or client-rendered page into Markdown for notes, Obsidian, wiki ingestion, RAG, prompt input, or structured reading. Trigger on requests such as "convert this webpage to markdown", "extract the main body from this page", "clean this page for LLMs", "save this URL as markdown", "make this page suitable for Obsidian", or "open this page in the browser and turn it into markdown".
---

# Webpage To Markdown

Convert a webpage into usable Markdown with either a direct-fetch script, a headless-browser script, a one-command auto-router, or a real-browser-session script. Prefer this skill when the main job is extraction and cleanup, not broad multi-page crawling.

Read [workflow.md](E:\SPLLM\skills\webpage-to-markdown\references\workflow.md) only when you need the fit/limits summary. The core workflow is below.

## Quick Start

Run the direct-fetch converter script:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_webpage.py "https://example.com/article" -o "E:\SPLLM\outputs\article.md"
```

Run the one-command auto-router:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_auto.py "https://example.com/article" -o "E:\SPLLM\outputs\article.md"
```

Run the real-browser-session converter script:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_via_webbridge.py "https://example.com/article" -o "E:\SPLLM\outputs\article.md"
```

Install dependencies if the script reports missing packages:

```powershell
pip install -r E:\SPLLM\skills\webpage-to-markdown\scripts\requirements.txt
```

## Workflow

1. Confirm the task is about turning one webpage into Markdown, not deep crawling across many pages.
2. Use `scripts/convert_auto.py` when you want the skill to decide between direct fetch and headless browser render automatically.
3. Use `scripts/convert_webpage.py` when you explicitly want a lightweight direct-fetch path.
4. Use `scripts/convert_via_headless.py` when you know the page needs browser rendering but not the user's live login session.
5. Use `scripts/convert_via_webbridge.py` for logged-in pages, anti-bot pages, or any page that must be read through the user's real browser session.
6. Save to a user-relevant path when the request implies persistence; otherwise print to stdout or summarize the result in-chat.
7. If the user wants the content saved into the wiki, choose a matching destination under `wiki/` and keep filenames readable.

## Command Patterns

Basic conversion:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_webpage.py "<URL>"
```

Automatic routing:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_auto.py "<URL>"
```

Write to file:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_webpage.py "<URL>" -o "<OUTPUT>.md"
```

Automatic routing with route report:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_auto.py "<URL>" -o "<OUTPUT>.md" --route-report
```

Headless-browser conversion:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_via_headless.py "<URL>" -o "<OUTPUT>.md"
```

Browser-session conversion:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_via_webbridge.py "<URL>" -o "<OUTPUT>.md"
```

Browser-session conversion with extra wait time:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_via_webbridge.py "<URL>" -o "<OUTPUT>.md" --wait-ms 12000
```

Preserve links and images:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_webpage.py "<URL>" --keep-links --keep-images
```

Minimal body only:

```powershell
python E:\SPLLM\skills\webpage-to-markdown\scripts\convert_webpage.py "<URL>" --no-metadata --no-source-url --no-page-map
```

## Output Shape

- Optional metadata block: title, author, date, source URL
- Optional page structure map based on Markdown headings
- Cleaned Markdown body with clutter stripped and spacing normalized

## Escalation Rules

Do not force the direct-fetch script on pages that obviously require rendering or a live session first.

Escalate to a browser-render path when:

- The page is mostly blank in direct fetch output
- The site is behind login, consent walls, or anti-bot gates
- The content is clearly client-rendered
- The page is a WeChat article and direct fetch only returns the share shell
- The user asks for "exactly what I'm seeing in the browser"

Prefer the auto-router before manual escalation when the page is public and you are not sure whether direct fetch is enough.

Escalate away from this skill when:

- The user wants multi-page crawling or site-wide traversal
- The user wants structured extraction into JSON schema across many URLs
- The user mainly needs browsing automation rather than Markdown output

## Browser-session requirements

Before using `convert_via_webbridge.py`, make sure Kimi WebBridge is healthy:

```powershell
~/.kimi-webbridge/bin/kimi-webbridge status
```

Proceed only when `running` is true and `extension_connected` is true.

## Resources

- `scripts/convert_auto.py`: One-command router for direct fetch, then headless fallback
- `scripts/convert_webpage.py`: Main URL-to-Markdown converter
- `scripts/convert_via_headless.py`: Headless-browser converter for rendered public pages
- `scripts/convert_via_webbridge.py`: Real-browser-session converter through Kimi WebBridge
- `scripts/requirements.txt`: Python dependencies for the converter
- `references/workflow.md`: Short notes on fit and limits

## Important Note

This skill is stored in `E:\SPLLM\skills\`, which matches the project's own skill convention. It is not one of Codex's default global auto-discovery roots, so future automatic triggering depends on project-level instructions or copying the skill into a global Codex skill directory later.
