#!/usr/bin/env python
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import queue
import random
import re
import string
import sys
import threading
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urljoin
import xml.etree.ElementTree as ET

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "references" / "sources.json"
DEFAULT_OUTPUT_ROOT = Path(r"E:\SPLLM\outputs\hotspot-radar")
DEFAULT_NEWSAPI_AGGREGATOR_URL = "https://eventregistry.org/api/v1/article/getArticles"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"
)

LINK_RE = re.compile(r"<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", re.I | re.S)
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
PARAGRAPH_RE = re.compile(r"<p[^>]*>(.*?)</p>", re.I | re.S)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


@dataclass
class Source:
    id: str
    label: str
    kind: str
    home_url: str
    note: str = ""
    link_substrings: list[str] | None = None
    link_regex: str | None = None
    detail_strategy: str | None = None
    list_strategy: str | None = None
    use_apparent_encoding: bool = False
    api_url: str | None = None
    source_ids: list[str] | None = None
    feed_url: str | None = None
    rss_fetch_detail: bool = False
    rss_use_content_field: bool = True
    api_key_env: str | None = None
    source_uris: list[str] | None = None
    source_group_uri: str | None = None
    lang: list[str] | None = None
    article_data_type: str | None = None
    article_sort_by: str | None = None
    mcp_sse_url: str | None = None
    mcp_tool_name: str | None = None
    mcp_protocol_version: str | None = None


def load_sources() -> list[Source]:
    data = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    return [Source(**item) for item in data["sources"]]


def get_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({"User-Agent": UA})
    retries = Retry(
        total=2,
        backoff_factor=0.8,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def fetch_text(session: requests.Session, url: str, use_apparent_encoding: bool = False) -> tuple[requests.Response, str]:
    resp = session.get(url, timeout=30)
    if use_apparent_encoding:
        resp.encoding = resp.apparent_encoding or resp.encoding
    return resp, resp.text


def normalize_text(raw: str) -> str:
    text = re.sub(r"<[^>]+>", " ", raw)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_title(page_html: str) -> str:
    match = TITLE_RE.search(page_html)
    return normalize_text(match.group(1)) if match else ""


def extract_links(page_html: str, base_url: str) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for href, inner in LINK_RE.findall(page_html):
        url = urljoin(base_url, href)
        text = normalize_text(inner)
        if not text or not url.startswith("http"):
            continue
        key = (text, url)
        if key in seen:
            continue
        seen.add(key)
        items.append({"title": text, "url": url})
    return items


def local_name(tag: str) -> str:
    return tag.split("}", 1)[-1] if "}" in tag else tag


def find_child_text(node: ET.Element, names: list[str]) -> str:
    for child in node.iter():
        if child is node:
            continue
        if local_name(child.tag) in names:
            text = normalize_text("".join(child.itertext()))
            if text:
                return text
    return ""


def find_first_link(node: ET.Element) -> str:
    for child in node.iter():
        if local_name(child.tag) != "link":
            continue
        href = child.attrib.get("href")
        if href:
            return href
        text = normalize_text("".join(child.itertext()))
        if text.startswith("http"):
            return text
    return ""


def parse_rss_items(xml_text: str, fallback_base_url: str, limit: int) -> list[dict[str, str]]:
    root = ET.fromstring(xml_text)
    items: list[dict[str, str]] = []
    for node in root.iter():
        tag = local_name(node.tag)
        if tag not in {"item", "entry"}:
            continue
        title = find_child_text(node, ["title"])
        url = find_first_link(node)
        if not url:
            raw_link = find_child_text(node, ["link", "id"])
            if raw_link.startswith("http"):
                url = raw_link
        url = urljoin(fallback_base_url, url) if url else ""
        summary = find_child_text(node, ["description", "summary", "encoded", "content"])
        published_at = find_child_text(node, ["pubDate", "published", "updated"])
        if not title or not url:
            continue
        items.append(
            {
                "title": title,
                "url": url,
                "summary": summary,
                "published_at": published_at,
            }
        )
        if len(items) >= limit:
            break
    return items


def fetch_rss_list(session: requests.Session, source: Source, limit: int) -> list[dict[str, str]]:
    feed_url = source.feed_url or source.home_url
    _, xml_text = fetch_text(session, feed_url, use_apparent_encoding=source.use_apparent_encoding)
    return parse_rss_items(xml_text, feed_url, limit)


def parse_newsapi_aggregator_items(payload: dict[str, Any], limit: int) -> list[dict[str, Any]]:
    containers: list[Any] = []
    for key in ("articles", "results", "items"):
        if key in payload:
            containers.append(payload[key])
    if isinstance(payload.get("articles"), dict):
        for key in ("results", "articles"):
            if key in payload["articles"]:
                containers.append(payload["articles"][key])

    records: list[dict[str, Any]] = []
    for container in containers:
        if not isinstance(container, list):
            continue
        for entry in container:
            if not isinstance(entry, dict):
                continue
            source_meta = entry.get("source") if isinstance(entry.get("source"), dict) else {}
            source_name = (
                source_meta.get("title")
                or source_meta.get("name")
                or entry.get("sourceTitle")
                or entry.get("sourceUri")
                or ""
            )
            url = entry.get("url") or entry.get("articleUrl") or entry.get("uri") or ""
            title = entry.get("title") or entry.get("articleTitle") or ""
            body = entry.get("body") or entry.get("content") or entry.get("summary") or ""
            published_at = entry.get("date") or entry.get("publishedAt") or entry.get("dateTime") or ""
            if not title or not url:
                continue
            records.append(
                {
                    "title": normalize_text(title),
                    "url": url,
                    "summary": normalize_text(body),
                    "published_at": published_at,
                    "source_name": normalize_text(str(source_name)),
                }
            )
            if len(records) >= limit:
                return records
    return records


def fetch_newsapi_aggregator_list(session: requests.Session, source: Source, limit: int) -> list[dict[str, Any]]:
    api_key_env = source.api_key_env or "NEWSAPIAI_API_KEY"
    api_key = os.environ.get(api_key_env, "").strip()
    if not api_key:
        raise RuntimeError(f"Missing API key in environment variable: {api_key_env}")

    api_url = source.api_url or DEFAULT_NEWSAPI_AGGREGATOR_URL
    params: list[tuple[str, str]] = [
        ("resultType", "articles"),
        ("articlesSortBy", source.article_sort_by or "date"),
        ("apiKey", api_key),
    ]
    for value in source.source_uris or []:
        params.append(("sourceUri", value))
    if source.source_group_uri:
        params.append(("sourceGroupUri", source.source_group_uri))
    for value in source.lang or []:
        params.append(("lang", value))
    if source.article_data_type:
        params.append(("dataType", source.article_data_type))

    response = session.get(api_url, params=params, timeout=30)
    response.raise_for_status()
    payload = response.json()
    return parse_newsapi_aggregator_items(payload, limit)


def filter_article_links(source: Source, links: list[dict[str, str]]) -> list[dict[str, str]]:
    result: list[dict[str, str]] = []
    seen: set[str] = set()
    regex = re.compile(source.link_regex) if source.link_regex else None
    for item in links:
        url = item["url"]
        matched = False
        if source.link_substrings:
            matched = any(piece in url for piece in source.link_substrings)
        if regex and regex.search(url):
            matched = True
        if matched and url not in seen:
            seen.add(url)
            result.append(item)
    return result


def clean_paragraphs(source_id: str, paragraphs: list[str]) -> list[str]:
    cleaned: list[str] = []
    for para in paragraphs:
        text = normalize_text(para)
        if len(text) < 20:
            continue
        if source_id == "fxbaogao":
            if "发现报告（www.fxbaogao.com）" in text:
                continue
            if "0512-88971002" in text or "苏州市工业园区" in text or "2018- 2026" in text:
                continue
        if source_id == "199it" and "京公网安备" in text:
            continue
        cleaned.append(text)
    return cleaned


def fetch_article_detail(session: requests.Session, source: Source, item: dict[str, str]) -> dict[str, Any]:
    response, page_html = fetch_text(session, item["url"], use_apparent_encoding=source.use_apparent_encoding)
    paragraphs = clean_paragraphs(source.id, PARAGRAPH_RE.findall(page_html))
    return {
        "title": item["title"],
        "url": item["url"],
        "status": response.status_code,
        "page_title": extract_title(page_html),
        "paragraph_count": len(paragraphs),
        "content": paragraphs,
    }


def redian_headers() -> dict[str, str]:
    timestamp = str(int(time.time() * 1000))
    api_key = "".join(random.choice(string.ascii_letters + string.digits) for _ in range(20))
    signature = hashlib.sha256(f"{timestamp}{api_key}oSoHMwinaGG0SvSr".encode("utf-8")).hexdigest()
    return {
        "User-Agent": UA,
        "x-timestamp": timestamp,
        "x-api-key": api_key,
        "x-signature": signature,
        "Content-Type": "application/json",
    }


def fetch_redian_list(limit: int) -> list[dict[str, str]]:
    response = requests.get(
        "https://newsapi.redian.me/api/recommend_articles",
        headers=redian_headers(),
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    items = data.get("data", [])
    result = []
    for entry in items[:limit]:
        result.append(
            {
                "title": entry.get("title", ""),
                "url": entry.get("title_url", ""),
            }
        )
    return result


def fetch_newsnow_list(session: requests.Session, source: Source, limit: int) -> list[dict[str, str]]:
    if not source.api_url or not source.source_ids:
        return []

    results: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    per_source_limit = max(3, min(limit, 6))

    for source_id in source.source_ids:
        response = session.get(source.api_url, params={"id": source_id}, timeout=30)
        response.raise_for_status()
        payload = response.json()
        items = payload.get("items", [])
        for entry in items[:per_source_limit]:
            title = normalize_text(entry.get("title", ""))
            url = entry.get("url", "") or entry.get("mobileUrl", "")
            if not title or not url:
                continue
            key = (title, url)
            if key in seen:
                continue
            seen.add(key)
            results.append(
                {
                    "title": title,
                    "url": url,
                    "source_id": source_id,
                }
            )
            if len(results) >= limit:
                return results
    return results


def fetch_tophub_list(session: requests.Session, source: Source, limit: int) -> list[dict[str, str]]:
    _, page_html = fetch_text(session, source.home_url)
    links = extract_links(page_html, source.home_url)
    items: list[dict[str, str]] = []
    for item in links:
        title = item["title"]
        url = item["url"]
        if url.startswith("https://www.tophubdata.com/"):
            continue
        if "/n/" in url or re.match(r"^https?://", url):
            if re.match(r"^\d+\s", title) or url.startswith("https://www.") or url.startswith("https://m."):
                items.append(item)
    deduped: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for item in items:
        key = (item["title"], item["url"])
        if key not in seen:
            seen.add(key)
            deduped.append(item)
    return deduped[:limit]


def zhihu_auth_headers(source: Source) -> dict[str, str]:
    api_key_env = source.api_key_env or "ZHIHU_ACCESS_SECRET"
    access_secret = os.environ.get(api_key_env, "").strip()
    if not access_secret:
        raise RuntimeError(f"Missing API key in environment variable: {api_key_env}")
    return {"Authorization": f"Bearer {access_secret}"}


def start_sse_reader(response: requests.Response) -> queue.Queue[tuple[str | None, str]]:
    events: queue.Queue[tuple[str | None, str]] = queue.Queue()

    def reader() -> None:
        event_name: str | None = None
        data_lines: list[str] = []
        try:
            for raw in response.iter_lines(decode_unicode=True):
                if raw is None:
                    continue
                line = raw.strip("\r")
                if not line:
                    if data_lines:
                        events.put((event_name, "\n".join(data_lines)))
                        data_lines = []
                    continue
                if line.startswith("event:"):
                    event_name = line.split(":", 1)[1].strip()
                    continue
                if line.startswith("data:"):
                    payload = line.split(":", 1)[1].lstrip()
                    data_lines.append(payload)
                    continue
                if data_lines:
                    data_lines[-1] += line
            if data_lines:
                events.put((event_name, "\n".join(data_lines)))
        except Exception:
            return

    threading.Thread(target=reader, daemon=True).start()
    return events


def wait_for_sse_endpoint(events: queue.Queue[tuple[str | None, str]], timeout_sec: float) -> str:
    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        remaining = max(0.1, deadline - time.time())
        try:
            event_name, payload = events.get(timeout=remaining)
        except queue.Empty as exc:
            raise RuntimeError("Timed out waiting for MCP endpoint event") from exc
        if event_name == "endpoint":
            return payload
    raise RuntimeError("Timed out waiting for MCP endpoint event")


def wait_for_jsonrpc_result(
    events: queue.Queue[tuple[str | None, str]],
    expected_id: int,
    timeout_sec: float,
) -> dict[str, Any]:
    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        remaining = max(0.1, deadline - time.time())
        try:
            event_name, payload = events.get(timeout=remaining)
        except queue.Empty as exc:
            raise RuntimeError(f"Timed out waiting for MCP response id={expected_id}") from exc
        if event_name != "message":
            continue
        message = json.loads(payload)
        if message.get("id") != expected_id:
            continue
        if "error" in message:
            raise RuntimeError(f"MCP call failed for id={expected_id}: {message['error']}")
        result = message.get("result")
        if isinstance(result, dict):
            return result
    raise RuntimeError(f"Timed out waiting for MCP response id={expected_id}")


def parse_zhihu_hot_list_xml(xml_text: str, limit: int) -> list[dict[str, str]]:
    root = ET.fromstring(xml_text)
    items: list[dict[str, str]] = []
    for node in root.findall("item"):
        title = normalize_text(node.findtext("title", default=""))
        url = normalize_text(node.findtext("url", default=""))
        summary = normalize_text(node.findtext("summary", default=""))
        thumbnail_url = normalize_text(node.findtext("thumbnail_url", default=""))
        rank = normalize_text(node.attrib.get("rank", ""))
        if not title or not url:
            continue
        items.append(
            {
                "title": title,
                "url": url,
                "summary": summary,
                "thumbnail_url": thumbnail_url,
                "rank": rank,
            }
        )
        if len(items) >= limit:
            break
    return items


def fetch_zhihu_mcp_text(
    session: requests.Session,
    source: Source,
    arguments: dict[str, Any],
) -> str:
    sse_url = source.mcp_sse_url or source.api_url
    tool_name = source.mcp_tool_name or "hot_list"
    protocol_version = source.mcp_protocol_version or "2024-11-05"
    if not sse_url:
        raise RuntimeError("Missing MCP SSE URL for Zhihu source")

    auth_headers = zhihu_auth_headers(source)
    sse_headers = dict(auth_headers)
    sse_headers["Accept"] = "text/event-stream"

    with session.get(sse_url, headers=sse_headers, stream=True, timeout=(10, 120)) as response:
        response.raise_for_status()
        response.encoding = "utf-8"
        events = start_sse_reader(response)
        message_url = urljoin(sse_url, wait_for_sse_endpoint(events, timeout_sec=12))
        post_headers = dict(auth_headers)
        post_headers["Content-Type"] = "application/json"

        init_payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": protocol_version,
                "clientInfo": {"name": "spllm-hotspot-radar", "version": "1.0.0"},
                "capabilities": {},
            },
        }
        init_response = session.post(message_url, headers=post_headers, json=init_payload, timeout=30)
        init_response.raise_for_status()
        wait_for_jsonrpc_result(events, expected_id=1, timeout_sec=12)

        call_payload = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {"name": tool_name, "arguments": arguments},
        }
        call_response = session.post(message_url, headers=post_headers, json=call_payload, timeout=30)
        call_response.raise_for_status()
        result = wait_for_jsonrpc_result(events, expected_id=2, timeout_sec=20)

    content = result.get("content")
    if not isinstance(content, list):
        raise RuntimeError("Unexpected MCP response: missing content list")
    for item in content:
        if isinstance(item, dict) and item.get("type") == "text" and item.get("text"):
            return str(item["text"])
    raise RuntimeError("Unexpected MCP response: missing text payload")


def fetch_zhihu_hot_list(session: requests.Session, source: Source, limit: int) -> list[dict[str, str]]:
    xml_text = fetch_zhihu_mcp_text(session, source, {"limit": max(1, min(limit, 30))})
    return parse_zhihu_hot_list_xml(xml_text, limit=limit)


def probe_source(session: requests.Session, source: Source) -> dict[str, Any]:
    result: dict[str, Any] = {
        "id": source.id,
        "label": source.label,
        "kind": source.kind,
        "home_url": source.home_url,
    }
    if source.kind == "reminder":
        result["status"] = "reminder"
        result["note"] = source.note
        try:
            response, _ = fetch_text(session, source.home_url)
            result["http_status"] = response.status_code
        except Exception as exc:
            result["http_error"] = repr(exc)
        return result

    if source.kind == "list":
        try:
            if source.list_strategy == "redian_signed_api":
                items = fetch_redian_list(limit=8)
            elif source.list_strategy == "newsnow_api":
                items = fetch_newsnow_list(session, source, limit=12)
            elif source.list_strategy == "zhihu_hot_list_mcp":
                items = fetch_zhihu_hot_list(session, source, limit=12)
            elif source.list_strategy == "html_hotlist":
                items = fetch_tophub_list(session, source, limit=12)
            else:
                items = []
            result["status"] = "ok" if items else "empty"
            result["sample_count"] = len(items)
            result["sample_items"] = items[:5]
        except Exception as exc:
            result["status"] = "error"
            result["error"] = repr(exc)
        return result

    if source.kind == "rss":
        try:
            items = fetch_rss_list(session, source, limit=12)
            result["status"] = "ok" if items else "empty"
            result["sample_count"] = len(items)
            result["sample_items"] = items[:5]
        except Exception as exc:
            result["status"] = "error"
            result["error"] = repr(exc)
        return result

    if source.kind == "newsapi_aggregator":
        try:
            items = fetch_newsapi_aggregator_list(session, source, limit=12)
            result["status"] = "ok" if items else "empty"
            result["sample_count"] = len(items)
            result["sample_items"] = items[:5]
        except Exception as exc:
            result["status"] = "error"
            result["error"] = repr(exc)
        return result

    try:
        response, page_html = fetch_text(session, source.home_url, use_apparent_encoding=source.use_apparent_encoding)
        links = extract_links(page_html, source.home_url)
        article_links = filter_article_links(source, links)
        result["http_status"] = response.status_code
        result["sample_count"] = len(article_links)
        result["sample_items"] = article_links[:5]
        if article_links:
            detail = fetch_article_detail(session, source, article_links[0])
            result["detail_status"] = detail["status"]
            result["detail_paragraph_count"] = detail["paragraph_count"]
            result["detail_sample"] = detail["content"][:3]
            result["status"] = "ok" if detail["paragraph_count"] > 0 else "detail-empty"
        else:
            result["status"] = "empty"
    except Exception as exc:
        result["status"] = "error"
        result["error"] = repr(exc)
    return result


def slugify(value: str) -> str:
    raw = value
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    if value:
        return value
    digest = hashlib.md5(raw.encode("utf-8")).hexdigest()[:8]
    return f"item-{digest}"


def write_article_markdown(article: dict[str, Any], target: Path, source_label: str) -> None:
    lines = [
        f"# {article['title']}",
        "",
        f"- 来源：{source_label}",
        f"- 链接：{article['url']}",
        "",
    ]
    if article.get("published_at"):
        lines.append(f"- 发布时间：{article['published_at']}")
        lines.append("")
    content = article.get("content", [])
    if isinstance(content, str):
        content = [content] if content else []
    lines.extend(content)
    target.write_text("\n".join(lines), encoding="utf-8")


def ensure_output_dir(base_dir: Path) -> Path:
    day = datetime.now().strftime("%Y-%m-%d")
    root = base_dir / day
    (root / "articles").mkdir(parents=True, exist_ok=True)
    (root / "lists").mkdir(parents=True, exist_ok=True)
    (root / "feeds").mkdir(parents=True, exist_ok=True)
    return root


def parse_requested_source_ids(source_ids: str | None) -> list[str]:
    if not source_ids:
        return []
    return [item.strip() for item in source_ids.split(",") if item.strip()]


def build_run_metadata(
    all_sources: list[Source],
    selected_sources: list[Source],
    requested_source_ids: list[str],
) -> dict[str, Any]:
    selected_ids = [source.id for source in selected_sources]
    return {
        "configured_source_count": len(all_sources),
        "selected_source_count": len(selected_sources),
        "selected_source_ids": selected_ids,
        "source_filter_applied": bool(requested_source_ids),
        "requested_source_ids": requested_source_ids,
        "missing_source_ids": [source_id for source_id in requested_source_ids if source_id not in selected_ids],
    }


def run_probe(sources: list[Source], output_dir: Path, run_metadata: dict[str, Any]) -> dict[str, Any]:
    session = get_session()
    results = [probe_source(session, source) for source in sources]
    payload = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        **run_metadata,
        "results": results,
    }
    (output_dir / "probe.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return payload


def run_fetch(
    sources: list[Source],
    output_dir: Path,
    article_limit: int,
    list_limit: int,
    run_metadata: dict[str, Any],
) -> dict[str, Any]:
    session = get_session()
    summary: dict[str, Any] = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        **run_metadata,
        "article_sources": [],
        "list_sources": [],
        "rss_sources": [],
        "aggregator_sources": [],
        "reminders": [],
    }
    for source in sources:
        if source.kind == "reminder":
            summary["reminders"].append(
                {
                    "id": source.id,
                    "label": source.label,
                    "home_url": source.home_url,
                    "note": source.note,
                }
            )
            continue

        if source.kind == "list":
            try:
                if source.list_strategy == "redian_signed_api":
                    items = fetch_redian_list(limit=list_limit)
                elif source.list_strategy == "newsnow_api":
                    items = fetch_newsnow_list(session, source, limit=list_limit)
                elif source.list_strategy == "zhihu_hot_list_mcp":
                    items = fetch_zhihu_hot_list(session, source, limit=list_limit)
                else:
                    items = fetch_tophub_list(session, source, limit=list_limit)
                payload = {
                    "source": source.label,
                    "home_url": source.home_url,
                    "items": items,
                }
                target = output_dir / "lists" / f"{source.id}.json"
                target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
                summary["list_sources"].append(
                    {
                        "id": source.id,
                        "label": source.label,
                        "item_count": len(items),
                        "file": str(target),
                    }
                )
            except Exception as exc:
                summary["list_sources"].append(
                    {
                        "id": source.id,
                        "label": source.label,
                        "error": repr(exc),
                    }
                )
            continue

        if source.kind == "rss":
            try:
                items = fetch_rss_list(session, source, limit=list_limit)
                payload = {
                    "source": source.label,
                    "feed_url": source.feed_url or source.home_url,
                    "items": items,
                }
                feed_target = output_dir / "feeds" / f"{source.id}.json"
                feed_target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

                saved = []
                source_dir = output_dir / "articles" / source.id
                if source.rss_fetch_detail or source.rss_use_content_field:
                    source_dir.mkdir(parents=True, exist_ok=True)

                for item in items[:article_limit]:
                    article: dict[str, Any]
                    if source.rss_fetch_detail:
                        article = fetch_article_detail(session, source, item)
                        article["published_at"] = item.get("published_at", "")
                    else:
                        content = item.get("summary", "")
                        if not content:
                            continue
                        article = {
                            "title": item["title"],
                            "url": item["url"],
                            "published_at": item.get("published_at", ""),
                            "content": [content],
                        }
                    slug_base = slugify(item["title"])[:80]
                    digest = hashlib.md5(item["url"].encode("utf-8")).hexdigest()[:8]
                    target = source_dir / f"{slug_base}-{digest}.md"
                    write_article_markdown(article, target, source.label)
                    saved.append({"title": item["title"], "url": item["url"], "file": str(target)})

                summary["rss_sources"].append(
                    {
                        "id": source.id,
                        "label": source.label,
                        "item_count": len(items),
                        "saved_count": len(saved),
                        "feed_file": str(feed_target),
                        "sample": saved[:5],
                    }
                )
            except Exception as exc:
                summary["rss_sources"].append(
                    {
                        "id": source.id,
                        "label": source.label,
                        "error": repr(exc),
                    }
                )
            continue

        if source.kind == "newsapi_aggregator":
            try:
                items = fetch_newsapi_aggregator_list(session, source, limit=list_limit)
                payload = {
                    "source": source.label,
                    "api_url": source.api_url or DEFAULT_NEWSAPI_AGGREGATOR_URL,
                    "items": items,
                }
                feed_target = output_dir / "feeds" / f"{source.id}.json"
                feed_target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

                saved = []
                source_dir = output_dir / "articles" / source.id
                source_dir.mkdir(parents=True, exist_ok=True)
                for item in items[:article_limit]:
                    content = item.get("summary", "")
                    if not content:
                        continue
                    article = {
                        "title": item["title"],
                        "url": item["url"],
                        "published_at": item.get("published_at", ""),
                        "content": [content],
                    }
                    slug_base = slugify(item["title"])[:80]
                    digest = hashlib.md5(item["url"].encode("utf-8")).hexdigest()[:8]
                    target = source_dir / f"{slug_base}-{digest}.md"
                    label = source.label
                    if item.get("source_name"):
                        label = f"{source.label} / {item['source_name']}"
                    write_article_markdown(article, target, label)
                    saved.append({"title": item["title"], "url": item["url"], "file": str(target)})

                summary["aggregator_sources"].append(
                    {
                        "id": source.id,
                        "label": source.label,
                        "item_count": len(items),
                        "saved_count": len(saved),
                        "feed_file": str(feed_target),
                        "sample": saved[:5],
                    }
                )
            except Exception as exc:
                summary["aggregator_sources"].append(
                    {
                        "id": source.id,
                        "label": source.label,
                        "error": repr(exc),
                    }
                )
            continue

        try:
            _, page_html = fetch_text(session, source.home_url, use_apparent_encoding=source.use_apparent_encoding)
            links = filter_article_links(source, extract_links(page_html, source.home_url))[:article_limit]
            source_dir = output_dir / "articles" / source.id
            source_dir.mkdir(parents=True, exist_ok=True)
            saved = []
            for item in links:
                article = fetch_article_detail(session, source, item)
                if article["paragraph_count"] <= 0:
                    continue
                slug_base = slugify(item["title"])[:80]
                digest = hashlib.md5(item["url"].encode("utf-8")).hexdigest()[:8]
                target = source_dir / f"{slug_base}-{digest}.md"
                write_article_markdown(article, target, source.label)
                saved.append({"title": article["title"], "url": article["url"], "file": str(target)})
            summary["article_sources"].append(
                {
                    "id": source.id,
                    "label": source.label,
                    "saved_count": len(saved),
                    "sample": saved[:5],
                }
            )
        except Exception as exc:
            summary["article_sources"].append(
                {
                    "id": source.id,
                    "label": source.label,
                    "error": repr(exc),
                }
            )
    (output_dir / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    return summary


def select_sources(all_sources: list[Source], source_ids: str | None) -> list[Source]:
    if not source_ids:
        return all_sources
    wanted = {item.strip() for item in source_ids.split(",") if item.strip()}
    return [source for source in all_sources if source.id in wanted]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Probe and fetch hotspot sources.")
    parser.add_argument("mode", choices=["probe", "fetch"])
    parser.add_argument("--sources", help="Comma-separated source ids")
    parser.add_argument("--article-limit", type=int, default=8)
    parser.add_argument("--list-limit", type=int, default=20)
    parser.add_argument("--output-dir", default=str(DEFAULT_OUTPUT_ROOT))
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    all_sources = load_sources()
    requested_source_ids = parse_requested_source_ids(args.sources)
    sources = select_sources(all_sources, args.sources)
    run_metadata = build_run_metadata(all_sources, sources, requested_source_ids)
    output_dir = ensure_output_dir(Path(args.output_dir))
    if args.mode == "probe":
        payload = run_probe(sources, output_dir, run_metadata)
    else:
        payload = run_fetch(
            sources,
            output_dir,
            article_limit=args.article_limit,
            list_limit=args.list_limit,
            run_metadata=run_metadata,
        )
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
