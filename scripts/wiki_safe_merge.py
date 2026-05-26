from __future__ import annotations

import re
from datetime import date
from pathlib import Path


ROOT = Path(r"E:\SPLLM")
WIKI = ROOT / "wiki"
TODAY = date(2026, 5, 24).isoformat()

REMOVE_CONCEPT_KEEP_ENTITY = [
    "Gustave Le Bon",
    "Hans Gross",
    "Jeremy Bentham",
    "Wilhelm Wundt",
    "William James",
    "William Shakespeare",
    "丁小云",
    "中国注册会计师协会",
    "休谟",
    "余世维",
    "佚名",
    "佟彤",
    "健康餐桌编委会",
    "傅建明",
    "儒勒·凡尔纳",
    "刘小顺",
    "刘成国",
    "华为",
    "周庆元",
    "唐浩明",
    "孙思邈",
    "孙良珠",
    "尹建莉",
    "张朴",
    "张艳婷",
    "成都市教育局",
    "成长分子",
    "斯文·赫定",
    "晏礼中",
    "曾国藩",
    "栾加芹",
    "法布尔",
    "王建南",
    "生活智慧编委会",
    "编辑部",
    "罗晓晖",
    "蒋玉燕",
    "蔡礼旭",
    "赵涛",
    "郑晓琴",
    "静电鱼",
    "马悦凌",
    "鬼谷子",
    "黑尔",
]

REMOVE_ENTITY_KEEP_CONCEPT = [
    "鲍姆测验",
]

CONCEPT_CANONICAL = {
    "concept-营销策略": "营销策略",
    "首因效应（第一印象）": "首因效应",
    "强制关联法": "强制关联",
    "认知学习论": "认知学习",
}

ENTITY_CANONICAL = {
    "entity-史玉柱": "史玉柱",
    "威廉姆·W.库克": "威廉姆·W·库克",
    "阿尔伯特-埃利斯": "阿尔伯特·埃利斯",
    "查尔斯·杜希格": "查尔斯·都希格",
    "米哈里·契克森米哈": "米哈里·契克森米哈赖",
    "罗伯特·斯滕伯格": "罗伯特·斯腾伯格",
    "大卫·韦尔奇": "大卫·A·韦尔奇",
}

CROSS_CANONICAL = {
    ("concepts", "威廉詹姆斯"): ("entities", "威廉·詹姆斯"),
}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def body_len(text: str) -> int:
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2]
    return sum(len(line.strip()) for line in text.splitlines() if line.strip())


def rewrite_title_and_heading(text: str, old: str, new: str) -> str:
    text = re.sub(r"(?m)^title:\s*.*$", f"title: {new}", text, count=1)
    text = re.sub(r"(?m)^#\s+.*$", f"# {new}", text, count=1)
    if old != new:
        text = text.replace(old, new)
    return text


def update_frontmatter_updated(text: str) -> str:
    if text.startswith("---"):
        return re.sub(r"(?m)^updated:\s*.*$", f"updated: '{TODAY}'", text, count=1)
    return text


def replace_wikilinks(old: str, new: str) -> int:
    pattern = re.compile(r"\[\[" + re.escape(old) + r"(?P<suffix>(?:#[^\]|]+)?(?:\|[^\]]+)?)\]\]")
    replaced = 0
    for path in WIKI.rglob("*.md"):
        text = read_text(path)
        new_text, count = pattern.subn(rf"[[{new}\g<suffix>]]", text)
        if count:
            write_text(path, new_text)
            replaced += count
    return replaced


def merge_alias(old_path: Path, new_path: Path, old_name: str, new_name: str) -> None:
    old_text = read_text(old_path)
    new_text = read_text(new_path)
    chosen = old_text if body_len(old_text) > body_len(new_text) else new_text
    chosen = rewrite_title_and_heading(chosen, old_name, new_name)
    chosen = update_frontmatter_updated(chosen)
    write_text(new_path, chosen)
    replace_wikilinks(old_name, new_name)
    old_path.unlink()


def remove_duplicate_page(path: Path, kept_path: Path) -> None:
    kept_text = update_frontmatter_updated(read_text(kept_path))
    write_text(kept_path, kept_text)
    path.unlink()


def update_index() -> None:
    path = WIKI / "index.md"
    text = read_text(path)
    counts = {
        "sources": len(list((WIKI / "sources").glob("*.md"))),
        "concepts": len(list((WIKI / "concepts").glob("*.md"))),
        "entities": len(list((WIKI / "entities").glob("*.md"))),
        "products": len(list((WIKI / "products").glob("*.md"))),
        "presentations": len(list((WIKI / "presentations").glob("*.md"))),
        "intents": len(list((WIKI / "intents").glob("*.md"))),
        "books": len(list((WIKI / "books").glob("*.md"))),
        "templates": len(list((WIKI / "templates").glob("*.md"))),
        "comparisons": len(list((WIKI / "comparisons").glob("*.md"))),
    }
    text = re.sub(r"(?m)^updated:\s*.*$", f"updated: '{TODAY}'", text, count=1)
    row_labels = {
        "sources": "| `sources/` |",
        "concepts": "| `concepts/` |",
        "entities": "| `entities/` |",
        "products": "| `products/` |",
        "presentations": "| `presentations/` |",
        "intents": "| `intents/` |",
        "books": "| `books/` |",
        "templates": "| `templates/` |",
        "comparisons": "| `comparisons/` |",
    }
    for key, label in row_labels.items():
        text = re.sub(
            rf"(?m)^(\| `{re.escape(key)}/` \| )\d+(\s+\|.*)$",
            rf"\g<1>{counts[key]}\2",
            text,
        )
        text = re.sub(
            rf"(?m)^(\| `{re.escape(key)}/` \| )\d+(\s+\|.*)$",
            rf"\g<1>{counts[key]}\2",
            text,
        )
    insert = (
        "### Concepts 第三轮层级整理（2026-05-24）\n\n"
        "- 合并同义理论页：将 `认知学习论` 并回主概念 `认知学习`\n"
        "- 保留层级差异：`群体心理 / 群体心理学 / 群体心理原理` 继续分层存在\n"
        "- 将 `人际关系` 由占位页提升为总入口页，承接 `人际关系管理 / 人际关系心理效应 / 职场人际关系`\n\n"
        "### Concepts / Entities 第二轮归并（2026-05-24）\n\n"
        "- 统一作者命名：将 `大卫·韦尔奇` 收口到更精确的 `大卫·A·韦尔奇`\n"
        "- 合并方法页：将 `强制关联法` 并回主概念 `强制关联`\n"
        "- 明确保留边界页：`英雄之旅（男性版）`、`群体心理学`、`江苏凤凰文艺出版社` 等暂不并稿\n\n"
        "### Concepts / Entities 安全归并（2026-05-24）\n\n"
        "- 清理跨目录错放页：将 `45` 个同名 concept 重复页并回对应 entity，并保留 `鲍姆测验` 的 concept 建模\n"
        "- 归并机械别名页：修复 `entity-` / `concept-` 前缀残留、标点差异与高置信译名重复\n"
        "- 同步替换旧 wikilink，避免删除重复页后出现内部引用歧义\n\n"
    )
    if "### Concepts 第三轮层级整理（2026-05-24）" not in text:
        marker = "## 近期重点更新"
        idx = text.find(marker)
        if idx != -1:
            line_end = text.find("\n", idx)
            text = text[: line_end + 2] + insert + text[line_end + 2 :]
    write_text(path, text)


def update_log() -> None:
    path = WIKI / "log.md"
    text = read_text(path)
    text = re.sub(r"(?m)^updated:\s*.*$", f"updated: '{TODAY}'", text, count=1)
    entry = (
        "## [2026-05-24] merge | Concepts 第三轮层级整理\n\n"
        "**操作类型**: Concept Hierarchy Merge Round 3  \n"
        "**操作人**: Assistant\n\n"
        "### 处理结果\n"
        "- 合并同义理论页：`认知学习论` -> `认知学习`\n"
        "- 保留但明确分层：`群体心理`、`群体心理学`、`群体心理原理`\n"
        "- 将 `人际关系` 补为总入口页，承接管理、心理效应和职场语境子页\n\n"
        "### 核心结论\n"
        "- 第三轮开始从机械去重转向知识层级整理\n"
        "- 当前剩余高频候选更多是上位概念与子概念关系，不适合继续批量硬合并\n\n"
        "---\n\n"
    )
    entry += (
        "## [2026-05-24] merge | Concepts / Entities 第二轮归并\n\n"
        "**操作类型**: Concept Entity Merge Round 2  \n"
        "**操作人**: Assistant\n\n"
        "### 处理结果\n"
        "- 统一实体命名：`大卫·韦尔奇` -> `大卫·A·韦尔奇`\n"
        "- 合并概念页：`强制关联法` -> `强制关联`\n"
        "- 明确保留边界页：`英雄之旅（男性版）`、`群体心理学`、`世界图书出版公司 / 广东世界图书出版公司`、`江苏凤凰文艺出版社 / 江苏文艺出版社`\n\n"
        "### 核心结论\n"
        "- 第二轮继续收敛了高置信别名，但不把真实差异页错误压平\n"
        "- 后续剩余问题已主要转为概念层级整理，而非机械命名修复\n\n"
        "---\n\n"
    )
    entry += (
        "## [2026-05-24] merge | Concepts / Entities 安全归并\n\n"
        "**操作类型**: Concept Entity Safe Merge  \n"
        "**操作人**: Assistant\n\n"
        "### 处理结果\n"
        "- 删除跨目录错放页：`46` 页（其中 concept 删除 `45` 页，entity 删除 `1` 页）\n"
        "- 归并机械别名页：`8` 页\n"
        "- 修复高置信旧别名 wikilink：`7` 组命名\n\n"
        "### 核心结论\n"
        "- 当前 `concepts / entities` 的高置信重名冲突已明显收敛\n"
        "- `鲍姆测验` 这类更适合概念建模的页面已保留在 `concepts/`\n"
        "- `英雄之旅（男性版）` 等存在真实语义差异的页面暂未机械合并，留待下一轮人工判断\n\n"
        "---\n\n"
    )
    if "## [2026-05-24] merge | Concepts 第三轮层级整理" not in text:
        marker = "# Wiki 操作日志\n"
        idx = text.find(marker)
        if idx != -1:
            line_end = text.find("\n", idx + len(marker))
            text = text[: line_end + 2] + entry + text[line_end + 2 :]
    write_text(path, text)


def main() -> None:
    for name in REMOVE_CONCEPT_KEEP_ENTITY:
        concept_path = WIKI / "concepts" / f"{name}.md"
        entity_path = WIKI / "entities" / f"{name}.md"
        if concept_path.exists() and entity_path.exists():
            remove_duplicate_page(concept_path, entity_path)

    for name in REMOVE_ENTITY_KEEP_CONCEPT:
        entity_path = WIKI / "entities" / f"{name}.md"
        concept_path = WIKI / "concepts" / f"{name}.md"
        if concept_path.exists() and entity_path.exists():
            remove_duplicate_page(entity_path, concept_path)

    for old_name, new_name in CONCEPT_CANONICAL.items():
        old_path = WIKI / "concepts" / f"{old_name}.md"
        new_path = WIKI / "concepts" / f"{new_name}.md"
        if old_path.exists() and new_path.exists():
            merge_alias(old_path, new_path, old_name, new_name)

    for old_name, new_name in ENTITY_CANONICAL.items():
        old_path = WIKI / "entities" / f"{old_name}.md"
        new_path = WIKI / "entities" / f"{new_name}.md"
        if old_path.exists() and new_path.exists():
            merge_alias(old_path, new_path, old_name, new_name)

    for (old_dir, old_name), (new_dir, new_name) in CROSS_CANONICAL.items():
        old_path = WIKI / old_dir / f"{old_name}.md"
        new_path = WIKI / new_dir / f"{new_name}.md"
        if old_path.exists() and new_path.exists():
            replace_wikilinks(old_name, new_name)
            remove_duplicate_page(old_path, new_path)

    update_index()
    update_log()


if __name__ == "__main__":
    main()
