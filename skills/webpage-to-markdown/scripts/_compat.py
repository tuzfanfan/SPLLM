#!/usr/bin/env python
from __future__ import annotations

import runpy
import sys
from pathlib import Path


def backend_script(script_name: str) -> Path:
    root = Path(__file__).resolve().parents[2] / "net-to-markdown" / "backends" / "webpage"
    script = root / script_name
    if not script.exists():
        raise FileNotFoundError(f"Canonical webpage backend not found: {script}")
    return script


def main(script_name: str) -> int:
    script = backend_script(script_name)
    sys.argv[0] = str(script)
    runpy.run_path(str(script), run_name="__main__")
    return 0
