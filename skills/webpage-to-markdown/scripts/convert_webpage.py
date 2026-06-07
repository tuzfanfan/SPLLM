#!/usr/bin/env python
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Iterable

try:
    import requests
    from bs4 import BeautifulSoup
    from markdownify import markdownify as html_to_markdown
    from readability import Document
except ImportError as exc:  # pragma: no cover - dependency bootstrap path
    missing = getattr(exc, "name", str(exc))
    sys.stderr.write(
        "Missing dependency: "
        f"{missing}\n"
        "Install with:\n"
        "  pip install beautifulsoup4 markdownify readability-lxml requests\n"
    )
    raise SystemExit(2) from exc


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/136.0.0.0 Safari/537.36"
)

BAD_SELECTORS = [
    ".infobox",
    ".mw-editsection",
    ".navbox",
    ".metadata",
    ".reflist",
    ".reference",
    ".mw-empty-elt",
]

FALLBACK_SELECTORS = [
    "main",
    '[role="main"]',
    "#main-content",
    "#main",
    "#content",
    ".content",
    "article",
    "body",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert a webpage URL into clean, LLM-ready Markdown."
    )
    parser.add_argument("url", help="Source webpage URL")
    parser.add_argument(
        "--output",
        "-o",
        help="Write Markdown to a file instead of stdout",
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
    parser.add_argument(
        "--no-metadata",
        action="store_true",
        help="Skip title/author/date header",
    )
    parser.add_argument(
        "--no-source-url",
        action="store_true",
        help="Skip source URL line",
    )
    parser.add_argument(
        "--no-page-map",
        action="store_true",
        help="Skip generated heading outline",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30,
        help="HTTP timeout in seconds",
    )
    return parser.parse_args()


def fetch_html(url: str, timeout: int) -> str:
    response = requests.get(
        url,
        timeout=timeout,
        headers={"User-Agent": USER_AGENT},
    )
    response.raise_for_status()
    content_type = response.headers.get("content-type", "").lower()
    if "charset=" in content_type:
        pass
    elif not response.encoding or response.encoding.lower() == "iso-8859-1":
        response.encoding = response.apparent_encoding or response.encoding
    return response.text


def extract_article_html(raw_html: str) -> tuple[str, dict[str, str]]:
    doc = Document(raw_html)
    title = doc.short_title() or ""
    summary_html = doc.summary(html_partial=True)

    soup = BeautifulSoup(raw_html, "html.parser")
    for selector in BAD_SELECTORS:
        for node in soup.select(selector):
            node.decompose()

    if not summary_html.strip():
        for selector in FALLBACK_SELECTORS:
            main = soup.select_one(selector)
            if main:
                summary_html = str(main)
                break
        else:
            summary_html = str(soup)

    meta = {
        "title": title or extract_text(soup, "title"),
        "author": extract_meta(
            soup,
            [
                {"name": "author"},
                {"property": "author"},
                {"property": "article:author"},
            ],
        ),
        "date": extract_meta(
            soup,
            [
                {"property": "article:published_time"},
                {"name": "pubdate"},
                {"name": "date"},
                {"name": "publishdate"},
            ],
        ),
    }
    return summary_html, meta


def extract_text(soup: BeautifulSoup, selector: str) -> str:
    node = soup.select_one(selector)
    return node.get_text(" ", strip=True) if node else ""


def extract_meta(soup: BeautifulSoup, attr_candidates: Iterable[dict[str, str]]) -> str:
    for attrs in attr_candidates:
        node = soup.find("meta", attrs=attrs)
        if node and node.get("content"):
            return node["content"].strip()
    return ""


def sanitize_html(html: str, keep_images: bool) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag_name in [
        "script",
        "style",
        "noscript",
        "header",
        "footer",
        "nav",
        "aside",
        "svg",
        "iframe",
        "canvas",
        "form",
        "button",
        "dialog",
    ]:
        for node in soup.find_all(tag_name):
            node.decompose()

    if not keep_images:
        for image in soup.find_all("img"):
            image.decompose()
    else:
        for image in soup.find_all("img"):
            src = (image.get("src") or "").strip()
            if src.startswith("data:image"):
                image.decompose()

    return str(soup)


def convert_html_to_markdown(html: str) -> str:
    markdown = html_to_markdown(
        html,
        heading_style="ATX",
        bullets="-",
        strip=["script", "style", "noscript"],
    )
    return clean_markdown(markdown)


def clean_markdown(markdown: str) -> str:
    markdown = re.sub(r"^[ \t]*-[ \t]*$", "", markdown, flags=re.MULTILINE)
    markdown = re.sub(r"^[ \t]+$", "", markdown, flags=re.MULTILINE)
    markdown = re.sub(r"\n{3,}", "\n\n", markdown)
    return markdown.strip()


def strip_markdown_links(markdown: str) -> str:
    markdown = re.sub(r"!\[([^\]]*)\]\([^)]+\)", "", markdown)
    markdown = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", markdown)
    return clean_markdown(markdown)


def generate_page_map(markdown: str, title: str) -> str:
    headings: list[tuple[int, str]] = []
    for line in markdown.splitlines():
        match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if match:
            headings.append((len(match.group(1)), match.group(2).strip()))
    if not headings:
        return ""

    root_title = title or "Page structure map"
    lines = [root_title]
    stack: list[bool] = []

    for index, (level, text) in enumerate(headings):
        next_level = headings[index + 1][0] if index + 1 < len(headings) else 0
        while len(stack) >= level:
            stack.pop()
        is_last = next_level <= level
        prefix = "".join("    " if is_done else "|   " for is_done in stack[:-1])
        if stack:
            prefix += "`-- " if stack[-1] else "|-- "
        else:
            prefix = "`-- "
        lines.append(f"{prefix}{text}")
        stack.append(is_last)

    tree = "\n".join(lines)
    return f"# Page Structure Map\n```text\n{tree}\n```"


def build_output(
    url: str,
    markdown: str,
    meta: dict[str, str],
    include_metadata: bool,
    include_source_url: bool,
    include_page_map: bool,
) -> str:
    parts: list[str] = []
    meta_lines: list[str] = []

    if include_metadata:
        if meta.get("title"):
            meta_lines.append(f"**Title:** {meta['title']}")
        if meta.get("author"):
            meta_lines.append(f"**Author:** {meta['author']}")
        if meta.get("date"):
            meta_lines.append(f"**Date:** {meta['date']}")

    if include_source_url:
        meta_lines.append(f"**Source:** [{url}]({url})")

    if meta_lines:
        parts.append("\n\n".join(meta_lines))

    if include_page_map:
        page_map = generate_page_map(markdown, meta.get("title", ""))
        if page_map:
            parts.append(page_map)

    parts.append(markdown)
    return "\n\n---\n\n".join(part for part in parts if part).strip()
def main() -> int:
    args = parse_args()
    raw_html = fetch_html(args.url, args.timeout)
    article_html, meta = extract_article_html(raw_html)
    cleaned_html = sanitize_html(article_html, keep_images=args.keep_images)
    markdown = convert_html_to_markdown(cleaned_html)
    if not args.keep_links:
        markdown = strip_markdown_links(markdown)

    final_markdown = build_output(
        url=args.url,
        markdown=markdown,
        meta=meta,
        include_metadata=not args.no_metadata,
        include_source_url=not args.no_source_url,
        include_page_map=not args.no_page_map,
    )

    if args.output:
        output_path = Path(args.output)
    else:
        output_path = None

    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(final_markdown + "\n", encoding="utf-8")
        sys.stdout.write(str(output_path.resolve()) + "\n")
    else:
        sys.stdout.write(final_markdown + "\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
