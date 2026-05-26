#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
import zipfile
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Iterable

import requests
from requests import Response


API_BASE = "https://mineru.net/api/v4"
SUPPORTED_SUFFIXES = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".jp2",
    ".webp",
    ".gif",
    ".bmp",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
}


@dataclass(frozen=True)
class Config:
    input_dir: Path
    output_dir: Path
    token: str
    model_version: str
    language: str
    is_ocr: bool
    enable_table: bool
    enable_formula: bool
    batch_size: int
    poll_interval: int
    poll_timeout: int
    api_timeout: int
    upload_timeout: int
    download_timeout: int
    skip_existing: bool
    batch_pause_seconds: int

    @property
    def manifest_path(self) -> Path:
        return self.output_dir / "_mineru_manifest.jsonl"

    @property
    def failed_path(self) -> Path:
        return self.output_dir / "_mineru_failed.jsonl"


@dataclass(frozen=True)
class FileItem:
    src: Path
    rel: Path
    data_id: str

    @property
    def output_dir_name(self) -> Path:
        return safe_rel_path(self.rel.with_suffix(""))


def parse_args() -> Config:
    parser = argparse.ArgumentParser(
        description="Batch upload a local folder to MinerU for parsing."
    )
    parser.add_argument("input_dir", type=Path, help="Folder containing ebooks/files")
    parser.add_argument("output_dir", type=Path, help="Folder for parsed results")
    parser.add_argument(
        "--token",
        default=os.environ.get("MINERU_TOKEN", "").strip(),
        help="MinerU token. Defaults to MINERU_TOKEN env var.",
    )
    parser.add_argument("--model-version", default="vlm", choices=["pipeline", "vlm", "MinerU-HTML"])
    parser.add_argument("--language", default="ch")
    parser.add_argument("--batch-size", type=int, default=50)
    parser.add_argument("--poll-interval", type=int, default=5)
    parser.add_argument("--poll-timeout", type=int, default=3600)
    parser.add_argument("--api-timeout", type=int, default=30)
    parser.add_argument("--upload-timeout", type=int, default=300)
    parser.add_argument("--download-timeout", type=int, default=300)
    parser.add_argument("--batch-pause-seconds", type=int, default=75)
    parser.add_argument("--disable-ocr", action="store_true")
    parser.add_argument("--disable-table", action="store_true")
    parser.add_argument("--disable-formula", action="store_true")
    parser.add_argument(
        "--no-skip-existing",
        action="store_true",
        help="Re-download results even if output folder already has markdown.",
    )

    args = parser.parse_args()
    token = args.token.strip()
    if not token:
        raise SystemExit("Missing MinerU token. Use --token or set MINERU_TOKEN.")
    if not args.input_dir.exists() or not args.input_dir.is_dir():
        raise SystemExit(f"Input folder not found: {args.input_dir}")
    if args.batch_size < 1 or args.batch_size > 50:
        raise SystemExit("--batch-size must be between 1 and 50.")

    return Config(
        input_dir=args.input_dir.resolve(),
        output_dir=args.output_dir.resolve(),
        token=token,
        model_version=args.model_version,
        language=args.language,
        is_ocr=not args.disable_ocr,
        enable_table=not args.disable_table,
        enable_formula=not args.disable_formula,
        batch_size=args.batch_size,
        poll_interval=args.poll_interval,
        poll_timeout=args.poll_timeout,
        api_timeout=args.api_timeout,
        upload_timeout=args.upload_timeout,
        download_timeout=args.download_timeout,
        skip_existing=not args.no_skip_existing,
        batch_pause_seconds=args.batch_pause_seconds,
    )


def sanitize_part(part: str) -> str:
    part = re.sub(r'[\\/:*?"<>|]', "_", part)
    part = part.strip().strip(".")
    return part or "_"


def safe_rel_path(path: Path) -> Path:
    return Path(*[sanitize_part(p) for p in path.parts])


def make_data_id(rel: Path) -> str:
    raw = rel.as_posix()
    digest = hashlib.sha1(raw.encode("utf-8")).hexdigest()[:10]
    clean = re.sub(r"[^0-9A-Za-z._/-]+", "_", raw).replace("/", "__")
    return f"{clean}__{digest}"[:128]


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def write_jsonl_line(path: Path, payload: dict) -> None:
    ensure_parent(path)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False) + "\n")


def list_supported_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED_SUFFIXES:
            files.append(path)
    return files


def build_items(cfg: Config) -> list[FileItem]:
    return [
        FileItem(src=src, rel=src.relative_to(cfg.input_dir), data_id=make_data_id(src.relative_to(cfg.input_dir)))
        for src in list_supported_files(cfg.input_dir)
    ]


def already_parsed(cfg: Config, item: FileItem) -> bool:
    out_dir = cfg.output_dir / item.output_dir_name
    if not out_dir.exists():
        return False
    return any(out_dir.rglob("*.md"))


def batchify(items: list[FileItem], size: int) -> Iterable[list[FileItem]]:
    for idx in range(0, len(items), size):
        yield items[idx : idx + size]


def api_headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "*/*",
    }


def retry_after_seconds(response: Response | None, default: int) -> int:
    if response is None:
        return default
    raw = response.headers.get("Retry-After", "").strip()
    if raw.isdigit():
        return max(int(raw), 1)
    return default


def submit_batch(session: requests.Session, cfg: Config, batch: list[FileItem]) -> tuple[str, list[str]]:
    payload = {
        "files": [{"name": item.src.name, "data_id": item.data_id} for item in batch],
        "model_version": cfg.model_version,
        "language": cfg.language,
        "is_ocr": cfg.is_ocr,
        "enable_table": cfg.enable_table,
        "enable_formula": cfg.enable_formula,
    }
    response = session.post(
        f"{API_BASE}/file-urls/batch",
        json=payload,
        headers=api_headers(cfg.token),
        timeout=cfg.api_timeout,
    )
    if response.status_code == 429:
        wait_seconds = retry_after_seconds(response, cfg.batch_pause_seconds)
        raise RuntimeError(f"RATE_LIMIT:{wait_seconds}")
    response.raise_for_status()
    body = response.json()
    if body.get("code") != 0:
        raise RuntimeError(f"submit failed: {body.get('msg')}")
    data = body["data"]
    return data["batch_id"], data["file_urls"]


def upload_batch(cfg: Config, batch: list[FileItem], upload_urls: list[str]) -> None:
    if len(batch) != len(upload_urls):
        raise RuntimeError("Upload URL count mismatch.")
    for item, upload_url in zip(batch, upload_urls):
        attempts = 0
        while True:
            attempts += 1
            try:
                with item.src.open("rb") as handle:
                    response = requests.put(upload_url, data=handle, timeout=cfg.upload_timeout)
                if response.status_code in (200, 201):
                    break
                if response.status_code == 429:
                    wait_seconds = retry_after_seconds(response, max(10, attempts * 15))
                    if attempts >= 5:
                        raise RuntimeError(f"Upload rate limited for {item.src}: wait={wait_seconds}s")
                    print(f"  upload rate limited for {item.rel}, wait {wait_seconds}s")
                    time.sleep(wait_seconds)
                    continue
                raise RuntimeError(f"Upload failed for {item.src}: HTTP {response.status_code}")
            except requests.RequestException as exc:
                if attempts >= 5:
                    raise RuntimeError(f"Upload failed for {item.src}: {exc}") from exc
                wait_seconds = min(30, attempts * 5)
                print(f"  upload retry {attempts}/5 for {item.rel} after error: {exc}")
                time.sleep(wait_seconds)


def poll_batch(session: requests.Session, cfg: Config, batch_id: str) -> list[dict]:
    url = f"{API_BASE}/extract-results/batch/{batch_id}"
    started = time.time()
    last_log = 0.0
    while True:
        if time.time() - started > cfg.poll_timeout:
            raise TimeoutError(f"Batch timed out: {batch_id}")

        response = session.get(
            url,
            headers={"Authorization": f"Bearer {cfg.token}", "Accept": "*/*"},
            timeout=cfg.api_timeout,
        )
        if response.status_code == 429:
            wait_seconds = retry_after_seconds(response, cfg.poll_interval * 2)
            print(f"  poll rate limited, wait {wait_seconds}s")
            time.sleep(wait_seconds)
            continue
        response.raise_for_status()
        body = response.json()
        if body.get("code") != 0:
            raise RuntimeError(f"poll failed: {body.get('msg')}")

        data = body.get("data", {})
        results = data.get("extract_result", [])
        if not isinstance(results, list):
            raise RuntimeError(f"Unexpected result payload: {body}")

        done_count = sum(1 for result in results if result.get("state") == "done")
        failed_count = sum(1 for result in results if result.get("state") == "failed")
        total = len(results)

        now = time.time()
        if now - last_log >= 10:
            print(f"  progress batch={batch_id} done={done_count} failed={failed_count} total={total}")
            last_log = now

        if total > 0 and done_count + failed_count == total:
            return results

        time.sleep(cfg.poll_interval)


def safe_extract_zip(zip_bytes: bytes, dest: Path) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    resolved_dest = dest.resolve()
    with zipfile.ZipFile(BytesIO(zip_bytes)) as archive:
        for member in archive.infolist():
            member_path = (dest / member.filename).resolve()
            if member_path != resolved_dest and resolved_dest not in member_path.parents:
                raise RuntimeError(f"Blocked unsafe zip path: {member.filename}")
        archive.extractall(dest)


def download_result(cfg: Config, item: FileItem, result: dict) -> None:
    state = result.get("state")
    out_dir = cfg.output_dir / item.output_dir_name

    if state != "done":
        payload = {
            "source": str(item.src),
            "relative": str(item.rel),
            "data_id": item.data_id,
            "state": state,
            "error": result.get("err_msg", ""),
        }
        write_jsonl_line(cfg.failed_path, payload)
        write_jsonl_line(cfg.manifest_path, payload)
        print(f"  failed {item.rel} state={state} err={result.get('err_msg', '')}")
        return

    zip_url = result.get("full_zip_url")
    if not zip_url:
        raise RuntimeError(f"Missing full_zip_url for {item.src}")

    response = requests.get(zip_url, timeout=cfg.download_timeout)
    response.raise_for_status()
    safe_extract_zip(response.content, out_dir)

    payload = {
        "source": str(item.src),
        "relative": str(item.rel),
        "data_id": item.data_id,
        "state": state,
        "output": str(out_dir),
        "zip_url": zip_url,
    }
    write_jsonl_line(cfg.manifest_path, payload)
    print(f"  done {item.rel} -> {out_dir}")


def process_batch(session: requests.Session, cfg: Config, batch: list[FileItem], index: int, total_batches: int) -> None:
    print(f"[batch {index}/{total_batches}] submit {len(batch)} files")
    retries = 0
    while True:
        try:
            batch_id, upload_urls = submit_batch(session, cfg, batch)
            print(f"  batch_id={batch_id}")
            upload_batch(cfg, batch, upload_urls)
            results = poll_batch(session, cfg, batch_id)
            by_data_id = {result.get("data_id"): result for result in results if result.get("data_id")}
            for item in batch:
                result = by_data_id.get(item.data_id)
                if result is None:
                    payload = {
                        "source": str(item.src),
                        "relative": str(item.rel),
                        "data_id": item.data_id,
                        "state": "missing-result",
                    }
                    write_jsonl_line(cfg.failed_path, payload)
                    write_jsonl_line(cfg.manifest_path, payload)
                    print(f"  missing result for {item.rel}")
                    continue
                download_result(cfg, item, result)
            return
        except Exception as exc:
            message = str(exc)
            if message.startswith("RATE_LIMIT:"):
                wait_seconds = int(message.split(":", 1)[1])
                print(f"  submit rate limited, wait {wait_seconds}s")
                time.sleep(wait_seconds)
                continue
            retries += 1
            if retries >= 3:
                raise
            wait_seconds = 5 * retries
            print(f"  retry {retries}/3 after error: {exc}")
            time.sleep(wait_seconds)


def main() -> int:
    cfg = parse_args()
    cfg.output_dir.mkdir(parents=True, exist_ok=True)

    all_items = build_items(cfg)
    pending_items: list[FileItem] = []
    skipped_count = 0
    for item in all_items:
        if cfg.skip_existing and already_parsed(cfg, item):
            skipped_count += 1
            continue
        pending_items.append(item)

    print(f"input: {cfg.input_dir}")
    print(f"output: {cfg.output_dir}")
    print(f"found {len(all_items)} supported files")
    if skipped_count:
        print(f"skipping {skipped_count} files with existing markdown output")
    print(f"pending {len(pending_items)} files")

    if not pending_items:
        print("nothing to do")
        return 0

    total_batches = (len(pending_items) + cfg.batch_size - 1) // cfg.batch_size
    session = requests.Session()

    for index, batch in enumerate(batchify(pending_items, cfg.batch_size), start=1):
        process_batch(session, cfg, batch, index, total_batches)
        if index < total_batches and cfg.batch_pause_seconds > 0:
            print(f"pause {cfg.batch_pause_seconds}s before next batch")
            time.sleep(cfg.batch_pause_seconds)

    print("all tasks finished")
    print(f"manifest: {cfg.manifest_path}")
    print(f"failed: {cfg.failed_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
