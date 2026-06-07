#!/usr/bin/env python
from __future__ import annotations

import argparse
import importlib.util
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlparse


def load_module(filename: str):
    module_path = Path(__file__).with_name(filename)
    spec = importlib.util.spec_from_file_location(module_path.stem, module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


CONVERTER = load_module("convert_webpage.py")

WECHAT_SHELL_MARKERS = [
    "微信扫一扫",
    "使用小程序",
    "赞",
    "在看",
    "分享",
    "留言",
    "收藏",
    "听过",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert a webpage into Markdown with automatic routing: direct fetch first, then headless browser fallback."
    )
    parser.add_argument("url", help="Source webpage URL")
    parser.add_argument("--output", "-o", help="Write Markdown to a file instead of stdout")
    parser.add_argument("--wait-ms", type=int, default=8000, help="Headless-browser wait time in milliseconds")
    parser.add_argument("--keep-links", action="store_true", help="Preserve Markdown links instead of keeping link text only")
    parser.add_argument("--keep-images", action="store_true", help="Preserve images instead of removing them")
    parser.add_argument("--no-metadata", action="store_true", help="Skip title/author/date header")
    parser.add_argument("--no-source-url", action="store_true", help="Skip source URL line")
    parser.add_argument("--no-page-map", action="store_true", help="Skip generated heading outline")
    parser.add_argument(
        "--headless-python",
        help="Python executable to use for the headless-browser fallback",
    )
    parser.add_argument(
        "--route-report",
        action="store_true",
        help="Print the chosen route to stderr",
    )
    return parser.parse_args()


def render_direct(args: argparse.Namespace) -> str:
    raw_html = CONVERTER.fetch_html(args.url, 30)
    article_html, meta = CONVERTER.extract_article_html(raw_html)
    cleaned_html = CONVERTER.sanitize_html(article_html, keep_images=args.keep_images)
    markdown = CONVERTER.convert_html_to_markdown(cleaned_html)
    if not args.keep_links:
        markdown = CONVERTER.strip_markdown_links(markdown)
    return CONVERTER.build_output(
        url=args.url,
        markdown=markdown,
        meta=meta,
        include_metadata=not args.no_metadata,
        include_source_url=not args.no_source_url,
        include_page_map=not args.no_page_map,
    )


def score_is_bad(markdown: str, url: str) -> tuple[bool, str]:
    text = markdown.strip()
    domain = urlparse(url).netloc.lower()
    if len(text) < 80:
        return True, "output too short"

    shell_hits = sum(1 for marker in WECHAT_SHELL_MARKERS if marker in text)
    if "mp.weixin.qq.com" in domain and shell_hits >= 4 and len(text) < 1500:
        return True, "wechat share-shell markers detected"

    if "Page not found" in text or "Access denied" in text:
        return True, "error page detected"

    return False, "looks usable"


def find_headless_python(args: argparse.Namespace) -> str | None:
    candidates = []
    if args.headless_python:
        candidates.append(args.headless_python)
    env_python = os.environ.get("WEBPAGE_TO_MARKDOWN_HEADLESS_PYTHON")
    if env_python:
        candidates.append(env_python)
    candidates.append(sys.executable)
    candidates.append(r"E:\SPLLM\.venv-crawl4ai\Scripts\python.exe")

    seen: set[str] = set()
    for candidate in candidates:
        if not candidate or candidate in seen:
            continue
        seen.add(candidate)
        path = Path(candidate)
        if not path.exists():
            continue
        check = subprocess.run(
            [str(path), "-c", "import playwright"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
        if check.returncode == 0:
            return str(path)
    return None


def render_headless(args: argparse.Namespace) -> str:
    headless_python = find_headless_python(args)
    if not headless_python:
        raise RuntimeError(
            "No Python with playwright is available for headless fallback. Install playwright or use the Crawl4AI virtual environment."
        )

    helper = Path(__file__).with_name("convert_via_headless.py")
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_output = Path(tmp_dir) / "headless.md"
        command = [
            headless_python,
            str(helper),
            args.url,
            "-o",
            str(tmp_output),
            "--wait-ms",
            str(args.wait_ms),
        ]
        if args.keep_links:
            command.append("--keep-links")
        if args.keep_images:
            command.append("--keep-images")
        if args.no_metadata:
            command.append("--no-metadata")
        if args.no_source_url:
            command.append("--no-source-url")
        if args.no_page_map:
            command.append("--no-page-map")
        subprocess.run(command, check=True)
        return tmp_output.read_text(encoding="utf-8")


def write_output(markdown: str, output: str | None) -> None:
    if output:
        output_path = Path(output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(markdown + "\n", encoding="utf-8")
        sys.stdout.write(str(output_path.resolve()) + "\n")
    else:
        sys.stdout.write(markdown + "\n")


def main() -> int:
    args = parse_args()
    direct_error = ""
    try:
        direct_markdown = render_direct(args)
        bad, reason = score_is_bad(direct_markdown, args.url)
        if not bad:
            if args.route_report:
                sys.stderr.write(f"route=direct reason={reason}\n")
            write_output(direct_markdown, args.output)
            return 0
        direct_error = reason
    except Exception as exc:
        direct_error = str(exc)

    try:
        headless_markdown = render_headless(args)
        bad, reason = score_is_bad(headless_markdown, args.url)
        if not bad:
            if args.route_report:
                sys.stderr.write(f"route=headless reason={reason}; direct={direct_error}\n")
            write_output(headless_markdown, args.output)
            return 0
        raise RuntimeError(reason)
    except Exception as exc:
        raise SystemExit(
            "Automatic routing could not produce usable Markdown.\n"
            f"Direct-fetch result: {direct_error}\n"
            f"Headless-browser result: {exc}\n"
            "Next step: use convert_via_webbridge.py for a real browser session if the page depends on login state or anti-bot bypass."
        ) from exc


if __name__ == "__main__":
    raise SystemExit(main())
