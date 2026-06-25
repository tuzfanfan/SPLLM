#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


SOCIAL_DOMAINS = {
    "xiaohongshu.com": "xhs",
    "xhslink.com": "xhs",
    "douyin.com": "dy",
    "iesdouyin.com": "dy",
    "bilibili.com": "bili",
    "b23.tv": "bili",
    "weibo.com": "wb",
    "m.weibo.cn": "wb",
    "tieba.baidu.com": "tieba",
}
BROWSER_SESSION_DOMAINS = {"mp.weixin.qq.com"}
PLATFORM_NAMES = {
    "xhs": "小红书",
    "dy": "抖音",
    "bili": "B站",
    "wb": "微博",
    "tieba": "百度贴吧",
    "zhihu": "知乎",
}


@dataclass
class Comment:
    comment_id: str = ""
    author: str = ""
    content: str = ""
    published_at: str = ""
    like_count: int = 0
    reply_count: int = 0
    parent_comment_id: str = ""
    ip_location: str = ""


@dataclass
class UnifiedDocument:
    document_type: str
    source_url: str
    title: str = ""
    author: str = ""
    platform: str = ""
    published_at: str = ""
    collected_at: str = ""
    body: str = ""
    tags: list[str] = field(default_factory=list)
    media: list[str] = field(default_factory=list)
    engagement: dict[str, int | str] = field(default_factory=dict)
    comments: list[Comment] = field(default_factory=list)
    source_backend: str = ""
    source_id: str = ""
    source_keyword: str = ""


def default_web_backend_root() -> str:
    return str(Path(__file__).resolve().parents[1] / "backends" / "webpage")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Route webpages and social exports into traceable Markdown."
    )
    parser.add_argument("url", help="Source URL")
    parser.add_argument("--output", "-o", help="Markdown output path")
    parser.add_argument("--model-output", help="Normalized document JSON path")
    parser.add_argument("--route-report", help="Routing details JSON path")
    parser.add_argument("--route-only", action="store_true")
    parser.add_argument(
        "--backend",
        choices=("auto", "web", "browser-session", "social"),
        default="auto",
    )
    parser.add_argument("--platform", choices=tuple(PLATFORM_NAMES))
    parser.add_argument("--social-content-jsonl", help="MediaCrawler content JSONL")
    parser.add_argument("--social-comments-jsonl", help="MediaCrawler comments JSONL")
    parser.add_argument("--max-comments", type=int, default=20)
    parser.add_argument(
        "--web-backend-root",
        default=default_web_backend_root(),
        help="Directory containing the built-in webpage backend scripts.",
    )
    parser.add_argument(
        "--webpage-skill-root",
        help="Deprecated compatibility alias for --web-backend-root.",
    )
    parser.add_argument("--wait-ms", type=int, default=8000)
    parser.add_argument("--keep-links", action="store_true")
    parser.add_argument("--keep-images", action="store_true")
    return parser.parse_args()


def matching_domain(hostname: str, domains: set[str] | dict[str, str]) -> str | None:
    hostname = hostname.lower().split(":", 1)[0]
    return next(
        (
            domain
            for domain in domains
            if hostname == domain or hostname.endswith("." + domain)
        ),
        None,
    )


def classify_url(url: str) -> dict[str, str]:
    hostname = urlparse(url).hostname or ""
    social_domain = matching_domain(hostname, SOCIAL_DOMAINS)
    if social_domain:
        return {
            "route": "social",
            "backend": "mediacrawler-jsonl",
            "platform": SOCIAL_DOMAINS[social_domain],
            "reason": f"social platform domain: {social_domain}",
        }
    if hostname == "zhihu.com" or hostname.endswith(".zhihu.com"):
        return {
            "route": "web",
            "backend": "webpage-auto",
            "platform": "zhihu",
            "reason": "Zhihu articles default to webpage conversion",
        }
    browser_domain = matching_domain(hostname, BROWSER_SESSION_DOMAINS)
    if browser_domain:
        return {
            "route": "browser-session",
            "backend": "webbridge",
            "platform": "",
            "reason": f"live browser session preferred for: {browser_domain}",
        }
    return {
        "route": "web",
        "backend": "webpage-auto",
        "platform": "",
        "reason": "general webpage",
    }


def resolve_route(args: argparse.Namespace) -> dict[str, str]:
    route = classify_url(args.url)
    if args.backend == "auto":
        return route
    if args.backend == "social":
        platform = args.platform or route.get("platform")
        if not platform:
            raise ValueError("--backend social requires --platform for this domain.")
        return {
            "route": "social",
            "backend": "mediacrawler-jsonl",
            "platform": platform,
            "reason": "operator override",
        }
    if args.backend == "browser-session":
        return {
            "route": "browser-session",
            "backend": "webbridge",
            "platform": args.platform or route.get("platform", ""),
            "reason": "operator override",
        }
    return {
        "route": "web",
        "backend": "webpage-auto",
        "platform": args.platform or route.get("platform", ""),
        "reason": "operator override",
    }


def read_jsonl(path: str | None) -> list[dict[str, Any]]:
    if not path:
        return []
    records = []
    for line_number, line in enumerate(
        Path(path).read_text(encoding="utf-8-sig").splitlines(), 1
    ):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSONL at {path}:{line_number}: {exc}") from exc
        if isinstance(value, dict):
            records.append(value)
    return records


def first_value(record: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        value = record.get(key)
        if value not in (None, ""):
            return value
    return ""


def to_int(value: Any) -> int:
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        digits = re.sub(r"[^\d-]", "", value)
        if digits and digits != "-":
            try:
                return int(digits)
            except ValueError:
                pass
    return 0


def to_timestamp(value: Any) -> str:
    if value in (None, ""):
        return ""
    if isinstance(value, str) and not value.isdigit():
        return value
    try:
        timestamp = int(value)
        if timestamp > 10_000_000_000:
            timestamp //= 1000
        return datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat()
    except (ValueError, TypeError, OSError):
        return str(value)


def split_values(value: Any) -> list[str]:
    if not value:
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, str):
        return [item.strip() for item in value.split(",") if item.strip()]
    return [str(value)]


def source_id(record: dict[str, Any]) -> str:
    return str(
        first_value(
            record,
            "note_id",
            "aweme_id",
            "video_id",
            "article_id",
            "post_id",
            "content_id",
            "id",
        )
    )


def source_url(record: dict[str, Any], fallback: str) -> str:
    return str(
        first_value(
            record,
            "note_url",
            "aweme_url",
            "video_url",
            "article_url",
            "post_url",
            "url",
        )
        or fallback
    )


def select_content(records: list[dict[str, Any]], url: str) -> dict[str, Any]:
    if not records:
        raise ValueError("The social route requires --social-content-jsonl.")
    for record in records:
        record_url = source_url(record, "")
        record_id = source_id(record)
        if record_url and (record_url == url or record_url in url or url in record_url):
            return record
        if record_id and record_id in url:
            return record
    return records[0]


def comment_source_id(record: dict[str, Any]) -> str:
    return str(
        first_value(
            record, "note_id", "aweme_id", "video_id", "article_id", "post_id"
        )
    )


def normalize_comment(record: dict[str, Any]) -> Comment:
    return Comment(
        comment_id=str(first_value(record, "comment_id", "id", "cid", "rpid")),
        author=str(first_value(record, "nickname", "user_name", "author")),
        content=str(first_value(record, "content", "text", "message")),
        published_at=to_timestamp(
            first_value(record, "create_time", "time", "publish_time")
        ),
        like_count=to_int(first_value(record, "like_count", "liked_count", "digg_count")),
        reply_count=to_int(
            first_value(record, "sub_comment_count", "reply_count", "rcount")
        ),
        parent_comment_id=str(
            first_value(record, "parent_comment_id", "reply_id", "parent")
        ),
        ip_location=str(first_value(record, "ip_location", "ip_label")),
    )


def normalize_social(
    url: str,
    platform: str,
    content_records: list[dict[str, Any]],
    comment_records: list[dict[str, Any]],
    max_comments: int,
) -> UnifiedDocument:
    content = select_content(content_records, url)
    content_id = source_id(content)
    comments = [
        normalize_comment(record)
        for record in comment_records
        if not content_id or comment_source_id(record) in ("", content_id)
    ]
    comments = [comment for comment in comments if comment.content]
    comments.sort(key=lambda item: (item.like_count, item.published_at), reverse=True)

    media = []
    for key in (
        "image_list",
        "video_download_url",
        "video_cover_url",
        "cover_url",
        "note_download_url",
    ):
        media.extend(split_values(content.get(key)))

    engagement_keys = {
        "likes": ("liked_count", "like_count", "digg_count"),
        "favorites": ("collected_count", "video_favorite_count", "favorite_count"),
        "comments": ("comment_count", "video_comment", "reply_count"),
        "shares": ("share_count", "video_share_count"),
        "plays": ("video_play_count", "play_count"),
        "coins": ("video_coin_count",),
        "danmaku": ("video_danmaku",),
    }
    engagement = {}
    for name, keys in engagement_keys.items():
        value = to_int(first_value(content, *keys))
        if value:
            engagement[name] = value

    return UnifiedDocument(
        document_type="social",
        source_url=source_url(content, url),
        title=str(first_value(content, "title", "desc", "content"))[:500],
        author=str(first_value(content, "nickname", "user_name", "author")),
        platform=PLATFORM_NAMES.get(platform, platform),
        published_at=to_timestamp(
            first_value(content, "time", "create_time", "publish_time", "pub_ts")
        ),
        collected_at=datetime.now(timezone.utc).isoformat(),
        body=str(first_value(content, "desc", "content", "text", "title")),
        tags=split_values(first_value(content, "tag_list", "tags")),
        media=list(dict.fromkeys(media)),
        engagement=engagement,
        comments=comments[: max(max_comments, 0)],
        source_backend="MediaCrawler JSONL adapter",
        source_id=content_id,
        source_keyword=str(first_value(content, "source_keyword", "keyword")),
    )


def yaml_string(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)


def render_social_markdown(document: UnifiedDocument) -> str:
    title = document.title or document.source_id or "社交媒体内容"
    frontmatter = [
        "---",
        f"title: {yaml_string(title)}",
        f"type: {yaml_string(document.document_type)}",
        f"platform: {yaml_string(document.platform)}",
        f"author: {yaml_string(document.author)}",
        f"published: {yaml_string(document.published_at)}",
        f"collected: {yaml_string(document.collected_at)}",
        f"source_url: {yaml_string(document.source_url)}",
        f"source_backend: {yaml_string(document.source_backend)}",
        f"source_id: {yaml_string(document.source_id)}",
        f"source_keyword: {yaml_string(document.source_keyword)}",
        f"tags: {json.dumps(document.tags, ensure_ascii=False)}",
        "---",
    ]
    parts = ["\n".join(frontmatter), f"# {title}"]

    facts = []
    if document.author:
        facts.append(f"- 作者：{document.author}")
    if document.platform:
        facts.append(f"- 平台：{document.platform}")
    if document.published_at:
        facts.append(f"- 发布时间：{document.published_at}")
    facts.append(f"- 原始链接：[{document.source_url}]({document.source_url})")
    parts.append("## 来源信息\n\n" + "\n".join(facts))

    if document.body:
        parts.append("## 正文\n\n" + document.body.strip())
    if document.engagement:
        rows = ["| 指标 | 数值 |", "|---|---:|"]
        rows.extend(f"| {key} | {value} |" for key, value in document.engagement.items())
        parts.append("## 互动数据\n\n" + "\n".join(rows))
    if document.media:
        parts.append(
            "## 媒体资源\n\n"
            + "\n".join(f"- [{item}]({item})" for item in document.media)
        )
    if document.comments:
        lines = []
        for index, comment in enumerate(document.comments, 1):
            details = [f"赞 {comment.like_count}"]
            if comment.reply_count:
                details.append(f"回复 {comment.reply_count}")
            if comment.published_at:
                details.append(comment.published_at)
            lines.append(
                f"{index}. **{comment.author or '匿名用户'}**（{' · '.join(details)}）\n\n"
                f"   {comment.content.strip()}"
            )
        parts.append("## 代表性评论\n\n" + "\n\n".join(lines))

    parts.append(
        "## 采集说明\n\n"
        f"- 采集后端：{document.source_backend}\n"
        f"- 评论展示策略：按点赞数优先，实际保留 {len(document.comments)} 条\n"
        "- 本文件是结构化采集结果，不代表平台整体舆论。"
    )
    return "\n\n".join(parts).strip() + "\n"


def run_web_backend(args: argparse.Namespace, route: dict[str, str]) -> None:
    root = Path(args.webpage_skill_root or args.web_backend_root)
    script_name = (
        "convert_via_webbridge.py"
        if route["route"] == "browser-session"
        else "convert_auto.py"
    )
    script = root / script_name
    if not script.exists():
        raise FileNotFoundError(f"Web backend not found: {script}")
    command = [sys.executable, str(script), args.url]
    if args.output:
        command.extend(["-o", args.output])
    if args.keep_links:
        command.append("--keep-links")
    if args.keep_images:
        command.append("--keep-images")
    if route["route"] == "browser-session":
        command.extend(["--wait-ms", str(args.wait_ms)])
    else:
        command.append("--route-report")
    completed = subprocess.run(command, text=True, capture_output=True, check=False)
    if completed.stdout:
        sys.stdout.write(completed.stdout)
    if completed.stderr:
        sys.stderr.write(completed.stderr)
    if completed.returncode != 0:
        detail = (completed.stderr or completed.stdout or "unknown backend error").strip()
        raise RuntimeError(f"{route['backend']} failed: {detail[-1200:]}")


def write_json(path: str | None, payload: Any) -> None:
    if not path:
        return
    output = Path(path)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def main() -> int:
    args = parse_args()
    try:
        route = resolve_route(args)
    except Exception as exc:
        sys.stderr.write(f"net-to-markdown routing failed: {exc}\n")
        return 2

    report = {"url": args.url, **route, "status": "planned"}
    write_json(args.route_report, report)
    if args.route_only:
        report["status"] = "route-only"
        write_json(args.route_report, report)
        sys.stdout.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
        return 0

    try:
        if route["route"] in {"web", "browser-session"}:
            run_web_backend(args, route)
        else:
            document = normalize_social(
                url=args.url,
                platform=route["platform"],
                content_records=read_jsonl(args.social_content_jsonl),
                comment_records=read_jsonl(args.social_comments_jsonl),
                max_comments=args.max_comments,
            )
            markdown = render_social_markdown(document)
            write_json(args.model_output, asdict(document))
            if args.output:
                output = Path(args.output)
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_text(markdown, encoding="utf-8")
                sys.stdout.write(str(output.resolve()) + "\n")
            else:
                sys.stdout.write(markdown)
        report["status"] = "completed"
        write_json(args.route_report, report)
        return 0
    except Exception as exc:
        report["status"] = "failed"
        report["error"] = str(exc)
        write_json(args.route_report, report)
        sys.stderr.write(f"net-to-markdown backend failed: {exc}\n")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
