#!/usr/bin/env python
from __future__ import annotations

import argparse
import base64
import importlib.util
import json
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError as exc:  # pragma: no cover - dependency bootstrap path
    missing = getattr(exc, "name", str(exc))
    sys.stderr.write(
        "Missing dependency: "
        f"{missing}\n"
        "Install with:\n"
        "  pip install requests\n"
    )
    raise SystemExit(2) from exc


WEBBRIDGE_URL = "http://127.0.0.1:10086/command"
DEFAULT_SESSION = "webpage-to-markdown"
DEFAULT_WAIT_MS = 8000


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
        description="Convert a webpage into Markdown using a real browser session via Kimi WebBridge."
    )
    parser.add_argument("url", help="Source webpage URL")
    parser.add_argument(
        "--output",
        "-o",
        help="Write Markdown to a file instead of stdout",
    )
    parser.add_argument(
        "--session",
        default=DEFAULT_SESSION,
        help=f"WebBridge session name (default: {DEFAULT_SESSION})",
    )
    parser.add_argument(
        "--group-title",
        default="webpage-md",
        help="Visible Chrome tab group title",
    )
    parser.add_argument(
        "--wait-ms",
        type=int,
        default=DEFAULT_WAIT_MS,
        help=f"Wait time after navigation in milliseconds (default: {DEFAULT_WAIT_MS})",
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
        "--keep-session-open",
        action="store_true",
        help="Do not close the WebBridge session when conversion completes",
    )
    return parser.parse_args()


def call_webbridge(action: str, args: dict, session: str) -> dict:
    response = requests.post(
        WEBBRIDGE_URL,
        json={"action": action, "args": args, "session": session},
        timeout=120,
    )
    response.raise_for_status()
    payload = response.json()
    if not payload.get("ok"):
        raise RuntimeError(f"WebBridge action failed: {payload}")
    return payload["data"]


def close_session(session: str) -> None:
    try:
        call_webbridge("close_session", {}, session)
    except Exception:
        pass


def encode_js_string(value: str) -> str:
    return json.dumps(value)


def extract_rendered_payload(session: str) -> dict[str, str]:
    code = """
(() => {
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
  return JSON.stringify({
    title: pack(title),
    author: pack(author),
    date: pack(date),
    html: pack(html),
    url: location.href
  });
})()
""".strip()
    data = call_webbridge("evaluate", {"code": code}, session)
    return json.loads(data["value"])


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
    try:
        call_webbridge(
            "navigate",
            {"url": args.url, "newTab": True, "group_title": args.group_title},
            args.session,
        )
        time.sleep(max(args.wait_ms, 0) / 1000)
        payload = extract_rendered_payload(args.session)
        final_markdown = build_markdown(payload, args)
        if args.output:
            output_path = Path(args.output)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(final_markdown + "\n", encoding="utf-8")
            sys.stdout.write(str(output_path.resolve()) + "\n")
        else:
            sys.stdout.write(final_markdown + "\n")
        return 0
    finally:
        if not args.keep_session_open:
            close_session(args.session)


if __name__ == "__main__":
    raise SystemExit(main())
