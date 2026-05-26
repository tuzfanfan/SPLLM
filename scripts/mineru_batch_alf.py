#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import sys
import time
import zipfile
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Iterable

import requests


ROOT = Path(r"C:\Users\Administrator\Desktop\ALF")
OUT = Path(r"E:\SPLLM\daily-feed")
API_BASE = "https://mineru.net/api/v4"
MODEL_VERSION = "vlm"
ENABLE_TABLE = True
ENABLE_FORMULA = True
LANGUAGE = "ch"
IS_OCR = True
BATCH_SIZE = 50
POLL_INTERVAL = 5
POLL_TIMEOUT = 60 * 60
UPLOAD_TIMEOUT = 300
API_TIMEOUT = 30
DOWNLOAD_TIMEOUT = 300
MANIFEST = OUT / "_mineru_batch_manifest.jsonl"


@dataclass
class FileItem:
    src: Path
    rel: Path
    data_id: str

    @property
    def is_pdf(self) -> bool:
        return self.src.suffix.lower() == ".pdf"


def get_token() -> str:
    token = os.environ.get("MINERU_TOKEN", "").strip()
    if not token:
        raise SystemExit("Missing MINERU_TOKEN environment variable.")
    return token


def sanitize_part(part: str) -> str:
    part = re.sub(r'[\\/:*?"<>|]', "_", part)
    part = part.strip().strip(".")
    return part or "_"


def safe_rel_path(path: Path) -> Path:
    return Path(*[sanitize_part(p) for p in path.parts])


def list_all_files(root: Path) -> list[Path]:
    return sorted([p for p in root.rglob("*") if p.is_file()])


def make_data_id(rel: Path) -> str:
    base = rel.as_posix()
    digest = hashlib.sha1(base.encode("utf-8")).hexdigest()[:10]
    clean = re.sub(r"[^0-9A-Za-z._-]+", "_", base)
    data_id = f"{clean}__{digest}"
    return data_id[:128]


def unique_path(dest: Path) -> Path:
    if not dest.exists():
        return dest
    stem = dest.stem
    suffix = dest.suffix
    for i in range(2, 1000):
        candidate = dest.with_name(f"{stem}__dup{i}{suffix}")
        if not candidate.exists():
            return candidate
    raise RuntimeError(f"Could not find free name for {dest}")


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def write_manifest(entry: dict) -> None:
    ensure_parent(MANIFEST)
    with MANIFEST.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def move_non_pdf(item: FileItem) -> Path:
    rel = safe_rel_path(item.rel)
    dest = unique_path(OUT / rel)
    ensure_parent(dest)
    shutil.move(str(item.src), str(dest))
    write_manifest(
        {
            "type": "move",
            "source": str(item.src),
            "dest": str(dest),
            "relative": str(item.rel),
        }
    )
    return dest


def post_json(session: requests.Session, url: str, payload: dict, token: str) -> requests.Response:
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "*/*",
    }
    return session.post(url, json=payload, headers=headers, timeout=API_TIMEOUT)


def get_json(session: requests.Session, url: str, token: str) -> requests.Response:
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "*/*",
    }
    return session.get(url, headers=headers, timeout=API_TIMEOUT)


def submit_batch(session: requests.Session, batch: list[FileItem], token: str) -> tuple[str, list[str]]:
    payload = {
        "files": [{"name": item.src.name, "data_id": item.data_id} for item in batch],
        "model_version": MODEL_VERSION,
        "enable_table": ENABLE_TABLE,
        "enable_formula": ENABLE_FORMULA,
        "language": LANGUAGE,
        "is_ocr": IS_OCR,
    }
    resp = post_json(session, f"{API_BASE}/file-urls/batch", payload, token)
    resp.raise_for_status()
    body = resp.json()
    if body.get("code") != 0:
        raise RuntimeError(f"submit failed: {body.get('msg')}")
    data = body["data"]
    return data["batch_id"], data["file_urls"]


def upload_batch(batch: list[FileItem], upload_urls: list[str]) -> None:
    if len(batch) != len(upload_urls):
        raise RuntimeError("upload url count mismatch")
    for item, url in zip(batch, upload_urls):
        with item.src.open("rb") as f:
            resp = requests.put(url, data=f, timeout=UPLOAD_TIMEOUT)
        if resp.status_code not in (200, 201):
            raise RuntimeError(f"upload failed for {item.src.name}: HTTP {resp.status_code}")


def poll_batch(session: requests.Session, batch_id: str, token: str) -> list[dict]:
    url = f"{API_BASE}/extract-results/batch/{batch_id}"
    start = time.time()
    last_print = 0.0
    while True:
        if time.time() - start > POLL_TIMEOUT:
            raise TimeoutError(f"batch {batch_id} timed out")
        resp = get_json(session, url, token)
        resp.raise_for_status()
        body = resp.json()
        if body.get("code") != 0:
            raise RuntimeError(f"poll failed: {body.get('msg')}")
        data = body.get("data", {})
        items = data.get("extract_result", data if isinstance(data, list) else [])
        if not isinstance(items, list):
            raise RuntimeError(f"unexpected poll payload: {body}")

        done = sum(1 for item in items if item.get("state") == "done")
        failed = sum(1 for item in items if item.get("state") == "failed")
        total = len(items)
        now = time.time()
        if now - last_print >= 10:
            print(f"  progress batch={batch_id} done={done} failed={failed} total={total}")
            last_print = now

        if done + failed == total:
            return items

        time.sleep(POLL_INTERVAL)


def safe_extract_zip(zip_bytes: bytes, dest: Path) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(BytesIO(zip_bytes)) as zf:
        for member in zf.infolist():
            member_path = dest / member.filename
            resolved = member_path.resolve()
            if dest.resolve() not in resolved.parents and resolved != dest.resolve():
                raise RuntimeError(f"zip path traversal blocked: {member.filename}")
        zf.extractall(dest)


def download_and_store(item: FileItem, result: dict) -> None:
    state = result.get("state")
    out_dir = OUT / safe_rel_path(item.rel.with_suffix(""))
    if state != "done":
        write_manifest(
            {
                "type": "parse",
                "source": str(item.src),
                "data_id": item.data_id,
                "state": state,
                "error": result.get("err_msg", ""),
                "output": str(out_dir),
            }
        )
        print(f"  skip {item.rel} state={state} err={result.get('err_msg', '')}")
        return

    zip_url = result.get("full_zip_url")
    if not zip_url:
        raise RuntimeError(f"missing full_zip_url for {item.src}")

    resp = requests.get(zip_url, timeout=DOWNLOAD_TIMEOUT)
    resp.raise_for_status()
    safe_extract_zip(resp.content, out_dir)

    write_manifest(
        {
            "type": "parse",
            "source": str(item.src),
            "data_id": item.data_id,
            "state": state,
            "output": str(out_dir),
            "zip_url": zip_url,
        }
    )
    print(f"  done {item.rel} -> {out_dir}")


def already_parsed(item: FileItem) -> bool:
    out_dir = OUT / safe_rel_path(item.rel.with_suffix(""))
    if not out_dir.exists():
        return False
    return any(out_dir.rglob("*.md"))


def batchify(items: list[FileItem], size: int) -> Iterable[list[FileItem]]:
    for i in range(0, len(items), size):
        yield items[i : i + size]


def build_file_items() -> tuple[list[FileItem], list[FileItem]]:
    all_files = list_all_files(ROOT)
    pdf_items: list[FileItem] = []
    other_items: list[FileItem] = []
    for src in all_files:
        rel = src.relative_to(ROOT)
        item = FileItem(src=src, rel=rel, data_id=make_data_id(rel))
        if item.is_pdf:
            pdf_items.append(item)
        else:
            other_items.append(item)
    return pdf_items, other_items


def process() -> None:
    token = get_token()
    OUT.mkdir(parents=True, exist_ok=True)
    pdf_items, other_items = build_file_items()
    pending_pdfs: list[FileItem] = []
    skipped_existing = 0
    for item in pdf_items:
        if already_parsed(item):
            skipped_existing += 1
            continue
        pending_pdfs.append(item)

    print(f"found {len(pdf_items)} pdf files and {len(other_items)} non-pdf files")
    if skipped_existing:
        print(f"skipping {skipped_existing} already parsed pdf files")

    moved = 0
    for item in other_items:
        dest = move_non_pdf(item)
        moved += 1
        print(f"moved {item.rel} -> {dest}")
    print(f"moved {moved} non-pdf files")

    session = requests.Session()
    total_pdf = len(pending_pdfs)
    total_batches = (total_pdf + BATCH_SIZE - 1) // BATCH_SIZE
    print(f"processing {total_pdf} pdf files in {total_batches} batches")

    for idx, batch in enumerate(batchify(pending_pdfs, BATCH_SIZE), 1):
        print(f"[batch {idx}/{total_batches}] submit {len(batch)} files")
        retry = 0
        while True:
            try:
                batch_id, upload_urls = submit_batch(session, batch, token)
                print(f"  batch_id={batch_id}")
                upload_batch(batch, upload_urls)
                results = poll_batch(session, batch_id, token)
                break
            except Exception as exc:
                retry += 1
                if retry >= 3:
                    raise
                wait = 5 * retry
                print(f"  retry {retry}/3 after error: {exc}")
                time.sleep(wait)

        by_data_id = {item["data_id"]: item for item in results if item.get("data_id")}
        for item in batch:
            result = by_data_id.get(item.data_id)
            if result is None:
                write_manifest(
                    {
                        "type": "parse",
                        "source": str(item.src),
                        "data_id": item.data_id,
                        "state": "missing-result",
                    }
                )
                print(f"  missing result for {item.rel}")
                continue
            download_and_store(item, result)

    print("all tasks finished")


if __name__ == "__main__":
    try:
        process()
    except KeyboardInterrupt:
        sys.exit(130)
