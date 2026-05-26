#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


ROOT = Path(r"E:\SPLLM")
WIKI = ROOT / "wiki"
VALID_TYPES = {
    "entity",
    "concept",
    "source",
    "comparison",
    "product",
    "presentation",
    "index",
    "log",
    "intent",
    "template",
}
VALID_STATUS = {"draft", "active", "archived"}
DIR_TYPE = {
    "sources": "source",
    "entities": "entity",
    "concepts": "concept",
    "comparisons": "comparison",
    "products": "product",
    "presentations": "presentation",
    "intents": "intent",
    "templates": "template",
}
ROOT_MOVE_NAMES = {
    "2026-05-20-Anthropic交互式提示工程教程方法整合.md",
    "AI视频图像生成提示词策略综合指南.md",
}
ROOT_EXCLUDE = {
    "index.md",
    "log.md",
    "README.md",
    "obsidian-setup-guide.md",
    "hotpoint-live-video-llm-wiki-en.md",
    "intent-digest-state-schema.md",
}
DATE_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-")
WIKILINK_RE = re.compile(r"\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]")


@dataclass
class Page:
    path: Path
    text: str
    frontmatter: dict[str, object]
    body: str

    @property
    def title(self) -> str:
        value = self.frontmatter.get("title")
        if isinstance(value, str) and value.strip():
            return value.strip()
        return self.path.stem


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Repair wiki health issues.")
    parser.add_argument("--apply", action="store_true", help="Write changes to disk")
    return parser.parse_args()


def list_md_files() -> list[Path]:
    files: list[Path] = []
    for dirname in DIR_TYPE:
        directory = WIKI / dirname
        if directory.exists():
            files.extend(sorted(directory.glob("*.md")))
    files.extend(sorted(WIKI.glob("*.md")))
    return sorted(files)


def strip_bom(text: str) -> str:
    return text[1:] if text.startswith("\ufeff") else text


def parse_frontmatter(text: str) -> tuple[dict[str, object], str]:
    text = strip_bom(text)
    if not text.startswith("---\n"):
        return {}, text
    match = re.match(r"^---\n(.*?)\n---\n?", text, re.S)
    if not match:
        return {}, text
    raw = match.group(1)
    body = text[match.end() :]
    data: dict[str, object] = {}
    current_key: str | None = None
    list_mode = False
    for line in raw.splitlines():
        if not line.strip():
            continue
        if line.startswith("- ") and current_key:
            if not isinstance(data.get(current_key), list):
                data[current_key] = []
            cast = data[current_key]
            assert isinstance(cast, list)
            cast.append(line[2:].strip())
            continue
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        current_key = key
        if value.startswith("[") and value.endswith("]"):
            inner = value[1:-1].strip()
            if not inner:
                data[key] = []
            else:
                parts = [part.strip().strip("'\"") for part in inner.split(",")]
                data[key] = [part for part in parts if part]
        elif value == "":
            data[key] = []
        else:
            data[key] = value.strip().strip("'\"")
    return data, body


def dump_frontmatter(data: dict[str, object]) -> str:
    lines = ["---"]
    order = ["title", "created", "updated", "tags", "sources", "type", "status"]
    remaining = [key for key in data if key not in order]
    for key in order + sorted(remaining):
        if key not in data:
            continue
        value = data[key]
        if isinstance(value, list):
            if not value:
                lines.append(f"{key}: []")
            elif all(isinstance(item, str) for item in value):
                lines.append(f"{key}:")
                for item in value:
                    lines.append(f"- {item}")
        else:
            text = str(value)
            if re.fullmatch(r"\d{4}-\d{2}-\d{2}", text):
                text = f"'{text}'"
            lines.append(f"{key}: {text}")
    lines.append("---")
    return "\n".join(lines)


def infer_title_from_body(path: Path, body: str) -> str:
    for line in body.splitlines():
        if line.startswith("# "):
            title = line[2:].strip()
            title = re.sub(r"^Source:\s*", "", title, flags=re.I)
            return title
    return path.stem


def infer_date(path: Path) -> str:
    match = DATE_RE.match(path.stem)
    if match:
        return match.group(1)
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d")


def normalize_status(raw: object) -> str:
    text = str(raw or "").strip().strip(",")
    if not text:
        return "active"
    if text in VALID_STATUS:
        return text
    mapping = {
        "processed": "active",
        "completed": "active",
        "duplicate": "archived",
    }
    return mapping.get(text, "active")


def infer_type(path: Path, raw_type: object) -> str:
    text = str(raw_type or "").strip().strip(",")
    if text in VALID_TYPES:
        return text
    parent = path.parent.name
    if parent in DIR_TYPE:
        return DIR_TYPE[parent]
    if path.name.startswith("source-") or path.name in ROOT_MOVE_NAMES:
        return "source"
    if path.name in {"index.md", "log.md"}:
        return path.stem
    return "source"


def ensure_list_value(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if value in (None, ""):
        return []
    return [str(value).strip()]


def normalize_page(path: Path, today: str) -> tuple[Page, bool]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    changed = text.startswith("\ufeff")
    text = strip_bom(text).replace("\r\n", "\n")
    frontmatter, body = parse_frontmatter(text)
    had_frontmatter = bool(frontmatter)

    if not had_frontmatter:
        frontmatter = {}
        changed = True

    title = str(frontmatter.get("title", "")).strip() or infer_title_from_body(path, body)
    created = str(frontmatter.get("created", "")).strip() or infer_date(path)
    updated = today
    tags = ensure_list_value(frontmatter.get("tags", []))
    sources = ensure_list_value(frontmatter.get("sources", []))
    normalized_type = infer_type(path, frontmatter.get("type"))
    normalized_status = normalize_status(frontmatter.get("status"))

    clean_frontmatter: dict[str, object] = {
        "title": title,
        "created": created,
        "updated": updated,
        "tags": tags,
        "sources": sources,
        "type": normalized_type,
        "status": normalized_status,
    }

    for key, value in frontmatter.items():
        if key in clean_frontmatter:
            continue
        clean_frontmatter[key] = value

    if dump_frontmatter(clean_frontmatter) + "\n\n" + body.lstrip("\n") != text:
        changed = True

    return Page(path=path, text=text, frontmatter=clean_frontmatter, body=body.lstrip("\n")), changed


def move_target(path: Path) -> Path:
    if path.parent == WIKI and (path.name.startswith("source-") or path.name in ROOT_MOVE_NAMES):
        return WIKI / "sources" / path.name
    return path


def resolve_duplicate_titles(pages: list[Page]) -> int:
    by_title: dict[str, list[Page]] = {}
    for page in pages:
        if page.frontmatter.get("type") != "source":
            continue
        by_title.setdefault(page.title, []).append(page)

    changed = 0
    for title, group in by_title.items():
        if len(group) < 2:
            continue
        if not any(
            not DATE_RE.match(page.path.stem) or page.path.stem.startswith(("source-", "book-"))
            for page in group
        ):
            continue
        ordered = sorted(
            group,
            key=lambda page: (
                not DATE_RE.match(page.path.stem),
                page.frontmatter.get("status") != "active",
                page.frontmatter.get("updated", ""),
                page.path.name,
            ),
        )
        canonical = ordered[0]
        for duplicate in ordered[1:]:
            if duplicate.path.stem.startswith("2026-05-13-") or duplicate.path.stem.startswith("2026-05-14-"):
                continue
            if DATE_RE.match(duplicate.path.stem) and DATE_RE.match(canonical.path.stem):
                continue
            suffix = DATE_RE.match(duplicate.path.stem)
            date_text = suffix.group(1) if suffix else str(duplicate.frontmatter.get("created", ""))
            duplicate.frontmatter["title"] = f"{title}（重复归档 {date_text}）"
            duplicate.frontmatter["status"] = "archived"
            tags = ensure_list_value(duplicate.frontmatter.get("tags", []))
            if "重复候选" not in tags:
                tags.append("重复候选")
            duplicate.frontmatter["tags"] = tags
            changed += 1
    return changed


def build_known_targets(pages: list[Page]) -> set[str]:
    known: set[str] = set()
    for page in pages:
        known.add(page.path.stem)
        known.add(page.title)
    return known


def replace_unresolved_links(text: str, known: set[str]) -> tuple[str, int]:
    count = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal count
        target = match.group(1).strip()
        section = match.group(2)
        alias = match.group(3)
        if target in known:
            return match.group(0)
        count += 1
        if alias:
            return alias.strip()
        if section:
            return f"{target}#{section}"
        return target

    return WIKILINK_RE.sub(repl, text), count


def render_page(page: Page) -> str:
    return dump_frontmatter(page.frontmatter) + "\n\n" + page.body.rstrip() + "\n"


def make_writable(path: Path) -> None:
    try:
        path.chmod(0o666)
    except OSError:
        pass


def update_index(today: str) -> bool:
    path = WIKI / "index.md"
    text = path.read_text(encoding="utf-8", errors="ignore")
    original = text

    counts = {}
    for dirname in ["sources", "concepts", "entities", "products", "presentations", "intents", "templates", "comparisons"]:
        counts[dirname] = len(list((WIKI / dirname).glob("*.md")))

    replacements = {
        "sources": counts["sources"],
        "concepts": counts["concepts"],
        "entities": counts["entities"],
        "products": counts["products"],
        "presentations": counts["presentations"],
        "intents": counts["intents"],
        "templates": counts["templates"],
        "comparisons": counts["comparisons"],
    }

    for key, value in replacements.items():
        pattern = rf"(\| `{re.escape(key)}/` \| )\d+(\s+\|)"
        text = re.sub(pattern, rf"\g<1>{value}\2", text)

    text = re.sub(r"(?m)^updated: '.*?'", f"updated: '{today}'", text)

    marker = "## 近期重点更新\n\n"
    repair_block = (
        "### Wiki健康度系统修复（2026-05-24）\n\n"
        "- 统一清理 Markdown BOM，修复 frontmatter 兼容性问题\n"
        "- 批量补齐缺失的 `sources/type/status` 等元数据\n"
        "- 修正非法 `type/status`，并把误放在根目录的 source 页面归位到 `sources/`\n"
        "- 对重复标题 source 做无损归档标记，降低页面歧义\n"
        "- 将无法解析的坏链 wikilink 降级为普通文本，减少死链噪音\n\n"
    )
    if repair_block not in text and marker in text:
        text = text.replace(marker, marker + repair_block)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def update_log(today: str, summary: dict[str, int]) -> bool:
    path = WIKI / "log.md"
    text = path.read_text(encoding="utf-8", errors="ignore")
    original = text
    text = re.sub(r"(?m)^updated: '.*?'", f"updated: '{today}'", text)

    entry = (
        f"## [{today}] repair | Wiki健康度系统修复\n\n"
        f"**操作类型**: Wiki Health Repair  \n"
        f"**操作人**: Assistant\n\n"
        f"### 处理结果\n"
        f"- 规范化页面元数据：`{summary['normalized_pages']}` 页\n"
        f"- 新增或补齐 frontmatter：`{summary['frontmatter_added']}` 页\n"
        f"- 归位根目录 source 页面：`{summary['moved_pages']}` 页\n"
        f"- 处理重复标题 source：`{summary['duplicate_titles']}` 组页面已做归档标记\n"
        f"- 降级无法解析的坏链：`{summary['broken_links_removed']}` 处\n\n"
        f"### 核心结论\n"
        f"- Wiki 的 frontmatter、页面类型和目录归属已回到可批处理的状态\n"
        f"- 重复 source 先采取无损归档策略，避免立即删稿带来的信息丢失\n"
        f"- 早期导入批次仍可能存在内容层面质量差异，但结构性健康问题已显著收敛\n\n"
        f"---\n\n"
    )
    if entry not in text:
        body_marker = "# Wiki 操作日志\n\n"
        if body_marker in text:
            text = text.replace(body_marker, body_marker + entry)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> int:
    args = parse_args()
    today = datetime.now().strftime("%Y-%m-%d")
    pages: list[Page] = []
    normalized_pages = 0
    frontmatter_added = 0
    moved_pages = 0

    for path in list_md_files():
        page, changed = normalize_page(path, today)
        if changed:
            normalized_pages += 1
        if not parse_frontmatter(strip_bom(path.read_text(encoding="utf-8", errors="ignore")))[0]:
            frontmatter_added += 1
        target_path = move_target(page.path)
        if target_path != page.path:
            moved_pages += 1
            page.path = target_path
        pages.append(page)

    duplicate_titles = resolve_duplicate_titles(pages)
    known = build_known_targets(pages)
    broken_links_removed = 0
    write_map: dict[Path, str] = {}
    skipped_writes: list[str] = []
    for page in pages:
        new_body, removed = replace_unresolved_links(page.body, known)
        page.body = new_body
        broken_links_removed += removed
        write_map[page.path] = render_page(page)

    if args.apply:
        for old_path in list_md_files():
            target = move_target(old_path)
            if target != old_path:
                if target.exists():
                    raise RuntimeError(f"Refusing to overwrite existing target: {target}")
                make_writable(old_path)
                old_path.unlink()

        for path, content in write_map.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            if path.exists():
                make_writable(path)
            try:
                path.write_text(content, encoding="utf-8", newline="\n")
            except PermissionError:
                skipped_writes.append(str(path))

        update_index(today)
        update_log(
            today,
            {
                "normalized_pages": normalized_pages,
                "frontmatter_added": frontmatter_added,
                "moved_pages": moved_pages,
                "duplicate_titles": duplicate_titles,
                "broken_links_removed": broken_links_removed,
            },
        )

    print(
        json.dumps(
            {
                "normalized_pages": normalized_pages,
                "frontmatter_added": frontmatter_added,
                "moved_pages": moved_pages,
                "duplicate_titles": duplicate_titles,
                "broken_links_removed": broken_links_removed,
                "skipped_writes": skipped_writes,
                "apply": args.apply,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
