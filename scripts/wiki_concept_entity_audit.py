from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path


ROOT = Path(r"E:\SPLLM")
WIKI = ROOT / "wiki"
REPORT = ROOT / "reports" / "wiki-concept-entity-audit-2026-05-24.md"

PREFIX_RE = re.compile(r"^(concept|entity)-", re.I)
PAREN_RE = re.compile(r"[（(][^（）()]{1,20}[）)]")
PUNCT_RE = re.compile(r"""[《》【】\[\]、,，.。:：;；!！?？“”"'`·\s]""")


@dataclass(frozen=True)
class Page:
    kind: str
    name: str
    path: Path


def load_pages(kind: str) -> list[Page]:
    base = WIKI / kind
    return [Page(kind=kind[:-1], name=path.stem, path=path) for path in sorted(base.glob("*.md"))]


def normalize(name: str) -> str:
    text = unicodedata.normalize("NFKC", name)
    text = PREFIX_RE.sub("", text)
    text = text.replace("_", "").replace("-", "")
    text = PAREN_RE.sub("", text)
    text = PUNCT_RE.sub("", text)
    return text.lower()


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, normalize(a), normalize(b)).ratio()


def read_frontmatter_title(path: Path) -> str | None:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return None
    if not text.startswith("---"):
        return None
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None
    match = re.search(r"(?m)^title:\s*(.+?)\s*$", parts[1])
    return match.group(1).strip() if match else None


def grouped_by_norm(pages: list[Page]) -> dict[str, list[Page]]:
    bucket: dict[str, list[Page]] = defaultdict(list)
    for page in pages:
        bucket[normalize(page.name)].append(page)
    return bucket


def cross_exact_duplicates(concepts: list[Page], entities: list[Page]) -> list[dict]:
    concept_map = grouped_by_norm(concepts)
    entity_map = grouped_by_norm(entities)
    rows = []
    for key in sorted(set(concept_map) & set(entity_map)):
        rows.append(
            {
                "normalized": key,
                "concepts": [p.name for p in concept_map[key]],
                "entities": [p.name for p in entity_map[key]],
            }
        )
    return rows


def same_kind_exact_duplicates(pages: list[Page]) -> list[dict]:
    rows = []
    for key, group in grouped_by_norm(pages).items():
        if len(group) > 1:
            rows.append({"normalized": key, "names": [p.name for p in group]})
    rows.sort(key=lambda row: (-len(row["names"]), row["normalized"]))
    return rows


def same_kind_near_duplicates(
    pages: list[Page],
    threshold: float,
    substring_delta: int = 6,
) -> list[dict]:
    rows: list[dict] = []
    for i, page_a in enumerate(pages):
        norm_a = normalize(page_a.name)
        if len(norm_a) < 4:
            continue
        for page_b in pages[i + 1 :]:
            norm_b = normalize(page_b.name)
            if len(norm_b) < 4 or norm_a == norm_b:
                continue
            relation = None
            score = similarity(page_a.name, page_b.name)
            if norm_a in norm_b or norm_b in norm_a:
                short, long = sorted([norm_a, norm_b], key=len)
                if len(long) - len(short) <= substring_delta:
                    relation = "substring"
            if relation is None and score >= threshold:
                relation = "similar"
            if relation is None:
                continue
            rows.append(
                {
                    "relation": relation,
                    "score": round(score, 3),
                    "left": page_a.name,
                    "right": page_b.name,
                }
            )
    rows.sort(key=lambda row: (row["relation"] != "substring", -row["score"], row["left"], row["right"]))
    return rows


def concepts_looking_like_entities(concepts: list[Page], entities: list[Page]) -> list[dict]:
    entity_map = {normalize(page.name): page.name for page in entities}
    rows = []
    for page in concepts:
        norm = normalize(page.name)
        if norm in entity_map:
            rows.append(
                {
                    "concept": page.name,
                    "entity": entity_map[norm],
                    "path": str(page.path),
                }
            )
    return rows


def entity_alias_candidates(entities: list[Page]) -> list[dict]:
    rows: list[dict] = []
    skip_keywords = ("Seedream", "Seedance", "OmniHuman")
    for i, page_a in enumerate(entities):
        if any(keyword in page_a.name for keyword in skip_keywords):
            continue
        for page_b in entities[i + 1 :]:
            if any(keyword in page_b.name for keyword in skip_keywords):
                continue
            score = similarity(page_a.name, page_b.name)
            if score >= 0.84 and normalize(page_a.name) != normalize(page_b.name):
                rows.append(
                    {
                        "score": round(score, 3),
                        "left": page_a.name,
                        "right": page_b.name,
                    }
                )
    rows.sort(key=lambda row: (-row["score"], row["left"], row["right"]))
    return rows


def build_report() -> str:
    concepts = load_pages("concepts")
    entities = load_pages("entities")

    cross = cross_exact_duplicates(concepts, entities)
    concept_exact = same_kind_exact_duplicates(concepts)
    entity_exact = same_kind_exact_duplicates(entities)
    concept_near = same_kind_near_duplicates(concepts, threshold=0.82)
    entity_aliases = entity_alias_candidates(entities)
    misplaced_concepts = concepts_looking_like_entities(concepts, entities)

    summary = {
        "concept_count": len(concepts),
        "entity_count": len(entities),
        "cross_exact_duplicates": len(cross),
        "concept_exact_duplicates": len(concept_exact),
        "entity_exact_duplicates": len(entity_exact),
        "concept_near_candidates": len(concept_near),
        "entity_alias_candidates": len(entity_aliases),
    }

    lines = [
        "# Concepts / Entities 归并检查",
        "",
        "## 摘要",
        "",
        f"- concepts 总数：`{summary['concept_count']}`",
        f"- entities 总数：`{summary['entity_count']}`",
        f"- 跨目录同名重复：`{summary['cross_exact_duplicates']}`",
        f"- concepts 目录内机械重复：`{summary['concept_exact_duplicates']}`",
        f"- entities 目录内机械重复：`{summary['entity_exact_duplicates']}`",
        f"- concepts 近似归并候选：`{summary['concept_near_candidates']}`",
        f"- entities 别名候选：`{summary['entity_alias_candidates']}`",
        "",
        "## 第一优先级：跨目录同名重复",
        "",
    ]
    for row in cross[:45]:
        lines.append(f"- `{row['concepts'][0]}` 同时存在于 `concepts/` 与 `entities/`")

    lines.extend(
        [
            "",
            "## 第二优先级：机械重复",
            "",
            "### concepts",
            "",
        ]
    )
    for row in concept_exact:
        lines.append(f"- `{row['names'][0]}` / `{row['names'][1]}`")
    lines.extend(["", "### entities", ""])
    for row in entity_exact:
        lines.append(f"- `{row['names'][0]}` / `{row['names'][1]}`")

    lines.extend(["", "## 第三优先级：entities 别名候选", ""])
    for row in entity_aliases[:20]:
        lines.append(f"- `{row['left']}` / `{row['right']}`，相似度 `{row['score']}`")

    lines.extend(["", "## 第四优先级：concept 层级或近义候选", ""])
    for row in concept_near[:40]:
        lines.append(f"- `{row['left']}` / `{row['right']}`，关系 `{row['relation']}`，相似度 `{row['score']}`")

    lines.extend(["", "## 建议处理顺序", ""])
    lines.append("- 先处理跨目录同名重复，把明显属于人物、机构、品牌的 concept 页并回 entity 页。")
    lines.append("- 再处理机械重复页，例如 `concept-` / `entity-` 前缀残留、括号别名页、标点差异页。")
    lines.append("- 最后人工判断近义 concept，避免把上位概念与子方法错误合并。")
    lines.append("")
    lines.append("## 机器摘要")
    lines.append("")
    lines.append("```json")
    lines.append(json.dumps(summary, ensure_ascii=False, indent=2))
    lines.append("```")
    return "\n".join(lines) + "\n"


def main() -> None:
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(build_report(), encoding="utf-8")
    print(str(REPORT))


if __name__ == "__main__":
    main()
