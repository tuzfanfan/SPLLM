#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from typing import Any

import requests


BASE_URL = "https://aihot.virxact.com/api/public"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"
)
BEIJING = timezone(timedelta(hours=8))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def request_json(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    response = requests.get(
        f"{BASE_URL}{path}",
        params=params,
        headers={"User-Agent": UA},
        timeout=30,
    )
    response.raise_for_status()
    response.encoding = "utf-8"
    return response.json()


def format_time(value: str) -> str:
    if not value:
        return ""
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(BEIJING).strftime("%Y-%m-%d %H:%M")
    except ValueError:
        return value


def render_items(payload: dict[str, Any]) -> str:
    lines = [f"# AI HOT 资讯流（{payload.get('count', 0)} 条）", ""]
    for index, item in enumerate(payload.get("items", []), start=1):
        lines.extend(
            [
                f"## {index}. {item.get('title') or item.get('title_en') or '未命名'}",
                f"- 来源：{item.get('source', '未知')}",
                f"- 分类：{item.get('category', '未分类')}",
                f"- 时间：{format_time(str(item.get('publishedAt') or ''))}",
                f"- 链接：{item.get('url', '')}",
                "",
                str(item.get("summary") or ""),
                "",
            ]
        )
    return "\n".join(lines)


def render_daily(payload: dict[str, Any]) -> str:
    lines = [f"# AI HOT 日报：{payload.get('date', '')}", ""]
    lead = payload.get("lead")
    if lead:
        lines.extend([str(lead), ""])
    for section in payload.get("sections", []):
        lines.extend([f"## {section.get('label', '未分类')}", ""])
        for item in section.get("items", []):
            lines.append(f"- [{item.get('title', '未命名')}]({item.get('sourceUrl', '')})")
            if item.get("summary"):
                lines.append(f"  {item['summary']}")
        lines.append("")
    flashes = payload.get("flashes", [])
    if flashes:
        lines.extend(["## 快讯", ""])
        for item in flashes:
            lines.append(f"- [{item.get('title', '未命名')}]({item.get('sourceUrl', '')})")
    return "\n".join(lines)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Query AI HOT public API.")
    parser.add_argument("mode", choices=["items", "daily", "dailies"])
    parser.add_argument("--date", help="Daily date in YYYY-MM-DD format")
    parser.add_argument("--category")
    parser.add_argument("-q", "--query")
    parser.add_argument("--days", type=int, default=1, choices=range(1, 8))
    parser.add_argument("--all", action="store_true", help="Use all items instead of selected items")
    parser.add_argument("--take", type=int, default=20)
    parser.add_argument("--json", action="store_true", help="Print raw JSON")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    if args.mode == "items":
        params: dict[str, Any] = {
            "mode": "all" if args.all else "selected",
            "take": max(1, min(args.take, 100)),
            "since": (datetime.now(timezone.utc) - timedelta(days=args.days)).isoformat().replace("+00:00", "Z"),
        }
        if args.category:
            params["category"] = args.category
        if args.query:
            params["q"] = args.query
        payload = request_json("/items", params)
        output = json.dumps(payload, ensure_ascii=False, indent=2) if args.json else render_items(payload)
    elif args.mode == "daily":
        payload = request_json(f"/daily/{args.date}" if args.date else "/daily")
        output = json.dumps(payload, ensure_ascii=False, indent=2) if args.json else render_daily(payload)
    else:
        payload = request_json("/dailies")
        output = json.dumps(payload, ensure_ascii=False, indent=2)
    print(output)


if __name__ == "__main__":
    main()
