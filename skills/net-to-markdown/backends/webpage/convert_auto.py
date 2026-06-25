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


CONVERTER = None


def get_converter():
    global CONVERTER
    if CONVERTER is None:
        CONVERTER = load_module("convert_webpage.py")
    return CONVERTER

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

VIDEO_OCR_DOMAINS = {
    "douyin.com",
    "www.douyin.com",
    "iesdouyin.com",
    "www.iesdouyin.com",
    "v.douyin.com",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert a webpage or video page into Markdown with automatic routing across direct fetch, headless render, and video OCR."
    )
    parser.add_argument("url", help="Source webpage URL")
    parser.add_argument("--output", "-o", help="Write Markdown to a file instead of stdout")
    parser.add_argument("--wait-ms", type=int, default=8000, help="Headless-browser wait time in milliseconds")
    parser.add_argument("--prefer-video-ocr", action="store_true", help="Route directly to the video-page OCR flow")
    parser.add_argument("--video-ocr-interval", type=float, default=1.0, help="Sampling interval in seconds for video OCR")
    parser.add_argument("--video-ocr-start", type=float, default=0.0, help="Start time in seconds for video OCR")
    parser.add_argument("--video-ocr-end", type=float, default=-1.0, help="End time in seconds for video OCR; -1 means until video end")
    parser.add_argument("--video-ocr-max-duration", type=float, default=-1.0, help="Maximum capture duration in seconds for video OCR")
    parser.add_argument("--video-ocr-selector", default="video", help="Screenshot target for video OCR: video / viewport / CSS selector")
    parser.add_argument("--video-ocr-backend", default="local-ocr", choices=["manual-vlm", "local-ocr", "vlm-api", "none"], help="OCR backend for video-page extraction")
    parser.add_argument("--video-ocr-session", default="net-to-markdown-video-ocr", help="Kimi WebBridge session name for video OCR")
    parser.add_argument("--video-ocr-keep-frames", action="store_true", help="Keep sampled frame images in the video OCR artifacts directory")
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


def should_route_video_ocr(url: str, prefer_video_ocr: bool) -> tuple[bool, str]:
    if prefer_video_ocr:
        return True, "user requested video OCR"

    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    path = parsed.path.lower()
    query = parsed.query.lower()

    if domain in VIDEO_OCR_DOMAINS:
        if "/video/" in path:
            return True, "video-platform path detected"
        if "modal_id=" in query or "from_tab_name=main" in query:
            return True, "video-platform modal detected"

    return False, "not a known video-page route"


def render_direct(args: argparse.Namespace) -> str:
    converter = get_converter()
    raw_html = converter.fetch_html(args.url, 30)
    article_html, meta = converter.extract_article_html(raw_html)
    cleaned_html = converter.sanitize_html(article_html, keep_images=args.keep_images)
    markdown = converter.convert_html_to_markdown(cleaned_html)
    if not args.keep_links:
        markdown = converter.strip_markdown_links(markdown)
    return converter.build_output(
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


def render_video_ocr(args: argparse.Namespace) -> str:
    helper = Path(__file__).with_name("convert_video_page_ocr.py")
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_output = Path(tmp_dir) / "video-ocr.md"
        artifacts_dir = Path(tmp_dir) / "artifacts"
        command = [
            sys.executable,
            str(helper),
            args.url,
            "-o",
            str(tmp_output),
            "--artifacts-dir",
            str(artifacts_dir),
            "--interval",
            str(args.video_ocr_interval),
            "--start",
            str(args.video_ocr_start),
            "--end",
            str(args.video_ocr_end),
            "--max-duration",
            str(args.video_ocr_max_duration),
            "--selector",
            str(args.video_ocr_selector),
            "--ocr-backend",
            str(args.video_ocr_backend),
            "--session",
            str(args.video_ocr_session),
            "--overwrite",
        ]
        if args.video_ocr_keep_frames:
            command.append("--keep-frames")
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
    route_video_ocr, video_reason = should_route_video_ocr(args.url, args.prefer_video_ocr)
    if route_video_ocr:
        video_markdown = render_video_ocr(args)
        if args.route_report:
            sys.stderr.write(f"route=video-ocr reason={video_reason}\n")
        write_output(video_markdown, args.output)
        return 0

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
