#!/usr/bin/env python
from __future__ import annotations

import argparse
import base64
import importlib.util
import json
import sys
from pathlib import Path

try:
    import asyncio
    from playwright.async_api import async_playwright
except ImportError as exc:  # pragma: no cover - dependency bootstrap path
    missing = getattr(exc, "name", str(exc))
    sys.stderr.write(
        "Missing dependency: "
        f"{missing}\n"
        "Install Playwright in the current Python environment, or run this script via a Python that already has playwright.\n"
    )
    raise SystemExit(2) from exc


def load_converter_module():
    module_path = Path(__file__).with_name("convert_webpage.py")
    spec = importlib.util.spec_from_file_location("convert_webpage", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


CONVERTER = load_converter_module()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert a webpage into Markdown using a headless browser render."
    )
    parser.add_argument("url", help="Source webpage URL")
    parser.add_argument("--output", "-o", help="Write Markdown to a file instead of stdout")
    parser.add_argument(
        "--wait-ms",
        type=int,
        default=8000,
        help="Wait time after navigation in milliseconds",
    )
    parser.add_argument(
        "--keep-links",
        action="store_true",
        help="Preserve Markdown links instead of keeping link text only",
    )
    parser.add_argument(
        "--keep-images",
        action="store_true",
        help="Preserve images instead of removing them",
    )
    parser.add_argument("--no-metadata", action="store_true", help="Skip title/author/date header")
    parser.add_argument("--no-source-url", action="store_true", help="Skip source URL line")
    parser.add_argument("--no-page-map", action="store_true", help="Skip generated heading outline")
    return parser.parse_args()


async def extract_payload(url: str, wait_ms: int) -> dict[str, str]:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        try:
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=120000)
            await page.wait_for_timeout(max(wait_ms, 0))
            return await page.evaluate(
                """() => {
                    const content =
                      document.querySelector('#js_content') ||
                      document.querySelector('.rich_media_content') ||
                      document.querySelector('article') ||
                      document.querySelector('main') ||
                      document.querySelector('[role="main"]') ||
                      document.body;
                    const title =
                      (document.querySelector('#activity-name')?.innerText || document.title || '').trim();
                    const author =
                      (document.querySelector('#js_name')?.innerText ||
                        document.querySelector('[rel="author"]')?.innerText ||
                        '').trim();
                    const date =
                      (document.querySelector('#publish_time')?.innerText ||
                        document.querySelector('time')?.innerText ||
                        '').trim();
                    const html = content ? content.innerHTML : '';
                    const pack = (s) => btoa(unescape(encodeURIComponent(s || '')));
                    return {
                      title: pack(title),
                      author: pack(author),
                      date: pack(date),
                      html: pack(html),
                      url: location.href
                    };
                }"""
            )
        finally:
            await browser.close()


def unpack(value: str) -> str:
    return base64.b64decode(value).decode("utf-8") if value else ""


def build_markdown(payload: dict[str, str], args: argparse.Namespace) -> str:
    html = unpack(payload.get("html", ""))
    meta = {
        "title": unpack(payload.get("title", "")),
        "author": unpack(payload.get("author", "")),
        "date": unpack(payload.get("date", "")),
    }
    cleaned_html = CONVERTER.sanitize_html(html, keep_images=args.keep_images)
    markdown = CONVERTER.convert_html_to_markdown(cleaned_html)
    if not args.keep_links:
        markdown = CONVERTER.strip_markdown_links(markdown)
    return CONVERTER.build_output(
        url=payload.get("url", args.url),
        markdown=markdown,
        meta=meta,
        include_metadata=not args.no_metadata,
        include_source_url=not args.no_source_url,
        include_page_map=not args.no_page_map,
    )


def main() -> int:
    args = parse_args()
    payload = asyncio.run(extract_payload(args.url, args.wait_ms))
    final_markdown = build_markdown(payload, args)
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(final_markdown + "\n", encoding="utf-8")
        sys.stdout.write(str(output_path.resolve()) + "\n")
    else:
        sys.stdout.write(final_markdown + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
