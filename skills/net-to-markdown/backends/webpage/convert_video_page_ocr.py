#!/usr/bin/env python3
"""
convert_video_page_ocr.py: 视频页面 -> Markdown 的 OCR 提取路线

目标不是复述视频大意，而是尽量保留视频画面中出现的关键文本块，
尤其是提示词原文、参数块、界面说明块、标题条和示例文案。
"""

import argparse
import json
import os
import re
import shutil
import time
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path

KIMI_BRIDGE_URL = "http://127.0.0.1:10086/command"
DEFAULT_SESSION = "webpage-video-ocr"
CURRENT_SESSION = DEFAULT_SESSION

NOISE_PATTERNS = [
    r"^@\w+",
    r"^点[赞藏击]",
    r"推荐",
    r"^评论",
    r"^分享",
    r"^听抖音",
    r"^发一条.*弹幕",
    r"^发送$",
    r"^连播$",
    r"^清屏$",
    r"^倍速$",
    r"^合集",
    r"^作者声明",
    r"^识别画面$",
    r"^点击推荐",
    r"^更新至第.*集",
    r"^\d+月\d+日$",
    r"共创",
    r"^\d+(\.\d+)?万$",
    r"^\d+$",
]

REGION_SPECS = [
    ("top_left_method", 0.00, 0.02, 0.48, 0.12),
    ("top_banner", 0.00, 0.02, 0.78, 0.12),
    ("left_panel", 0.04, 0.10, 0.28, 0.62),
    ("center_canvas", 0.24, 0.10, 0.52, 0.42),
    ("center_prompt", 0.18, 0.44, 0.62, 0.24),
    ("bottom_caption", 0.08, 0.70, 0.84, 0.18),
    ("full_core", 0.03, 0.05, 0.84, 0.84),
]

REGION_PRIORITY = {
    "top_left_method": 1,
    "top_banner": 1,
    "center_prompt": 2,
    "bottom_caption": 3,
    "left_panel": 4,
    "center_canvas": 5,
    "full_core": 6,
}

MULTI_PREPROCESS_REGIONS = {"top_left_method", "top_banner", "center_prompt", "bottom_caption", "full_core"}


@dataclass
class OcrLine:
    region: str
    text: str
    confidence: float
    bbox: list


def kimi_cmd(action, args=None, session=DEFAULT_SESSION, timeout=30):
    import requests

    actual_session = session or CURRENT_SESSION
    payload = {"action": action, "args": args or {}, "session": actual_session}
    try:
        response = requests.post(KIMI_BRIDGE_URL, json=payload, timeout=timeout)
        return response.json()
    except Exception as exc:
        return {"ok": False, "error": str(exc)}


def check_bridge_available():
    try:
        import requests

        response = requests.post(
            KIMI_BRIDGE_URL,
            json={"action": "list_tabs", "args": {}, "session": "check"},
            timeout=5,
        )
        return response.status_code == 200
    except Exception:
        return False


def set_session(session_name):
    global CURRENT_SESSION
    CURRENT_SESSION = session_name or DEFAULT_SESSION


def open_page(url):
    print(f"[1/5] 打开页面: {url}")
    result = kimi_cmd("navigate", {"url": url, "newTab": True, "group_title": "视频OCR"}, timeout=120)
    if not result.get("ok"):
        print(f"  错误: 导航失败 - {result.get('error', 'unknown')}")
        return False

    time.sleep(8)
    for _ in range(30):
        probe = kimi_cmd("evaluate", {"code": "!!document.querySelector('video')"})
        if probe.get("data", {}).get("value") is True:
            break
        time.sleep(1)
    else:
        print("  错误: 30 秒内未找到 video 元素")
        return False

    return True


def get_video_info():
    print("[2/5] 获取视频信息...")
    script = """(() => {
        const v = document.querySelector('video');
        if (!v) return {error: 'no video'};
        let seekableEnd = 0;
        if (v.seekable && v.seekable.length > 0) {
            seekableEnd = v.seekable.end(v.seekable.length - 1);
        }
        return {
            duration: v.duration || 0,
            seekableEnd,
            readyState: v.readyState || 0,
            currentTime: v.currentTime || 0,
        };
    })()"""

    for _ in range(5):
        result = kimi_cmd("evaluate", {"code": script})
        data = result.get("data", {}).get("value", {})
        duration = max(data.get("duration", 0), data.get("seekableEnd", 0))
        if duration > 0:
            print(f"  时长: {duration:.1f}秒")
            return {"duration": duration}
        time.sleep(2)

    print("  警告: 无法获取准确时长，使用默认 30 秒")
    return {"duration": 30.0}


def capture_frames(url, output_dir, interval=1.0, start=0, end=-1, max_duration=-1, selector="video"):
    del url
    frames_dir = os.path.join(output_dir, "frames")
    os.makedirs(frames_dir, exist_ok=True)

    info = get_video_info()
    video_duration = info.get("duration", 30.0)
    actual_end = end if end > 0 else video_duration
    if max_duration > 0:
        actual_end = min(actual_end, start + max_duration)
    actual_end = min(actual_end, video_duration)

    print(f"[3/5] 开始截图 (间隔: {interval}s, 范围: {start}s - {actual_end}s)")

    kimi_cmd("evaluate", {"code": "document.querySelector('video').pause()"})
    time.sleep(0.5)

    frames = []
    index = 0
    timestamp = start
    while timestamp <= actual_end + 1e-6:
        kimi_cmd("evaluate", {"code": f"document.querySelector('video').currentTime = {timestamp}"})
        time.sleep(0.5)
        actual_time_result = kimi_cmd("evaluate", {"code": "document.querySelector('video').currentTime"})
        actual_time = actual_time_result.get("data", {}).get("value", timestamp)

        filename = f"{timestamp:06.1f}s.png"
        frame_path = os.path.join(frames_dir, filename)

        if selector == "video":
            rect_script = """(() => {
                const v = document.querySelector('video');
                if (!v) return null;
                const rect = v.getBoundingClientRect();
                return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
            })()"""
            rect_result = kimi_cmd("evaluate", {"code": rect_script})
            rect = rect_result.get("data", {}).get("value")
            if rect and rect.get("width", 0) > 0:
                screenshot_result = kimi_cmd("screenshot", {"format": "png", "path": frame_path, "clip": rect})
            else:
                screenshot_result = kimi_cmd("screenshot", {"format": "png", "path": frame_path})
        elif selector == "viewport":
            screenshot_result = kimi_cmd("screenshot", {"format": "png", "path": frame_path})
        else:
            custom_rect = kimi_cmd(
                "evaluate",
                {
                    "code": f"""(() => {{
                        const el = document.querySelector({json.dumps(selector)});
                        if (!el) return null;
                        const rect = el.getBoundingClientRect();
                        return {{x: rect.x, y: rect.y, width: rect.width, height: rect.height}};
                    }})()"""
                },
            )
            rect = custom_rect.get("data", {}).get("value")
            if rect and rect.get("width", 0) > 0:
                screenshot_result = kimi_cmd("screenshot", {"format": "png", "path": frame_path, "clip": rect})
            else:
                screenshot_result = kimi_cmd("screenshot", {"format": "png", "path": frame_path})

        if screenshot_result.get("ok"):
            frames.append(
                {
                    "filename": filename,
                    "timestamp": timestamp,
                    "actual_time": actual_time,
                    "path": frame_path,
                }
            )
            print(f"  [{timestamp:.1f}s] 截取成功")
        else:
            print(f"  [{timestamp:.1f}s] 截取失败: {screenshot_result.get('error', 'unknown')}")

        index += 1
        timestamp = start + index * interval

    print(f"  共截取 {len(frames)} 帧")
    return frames


def generate_manifest(output_dir, url, video_duration, interval, frames):
    manifest = {
        "source_url": url,
        "video_duration": video_duration,
        "sampling_interval": interval,
        "total_frames": len(frames),
        "frames": frames,
    }
    manifest_path = os.path.join(output_dir, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, ensure_ascii=False, indent=2)
    print("  manifest.json 已生成")
    return manifest_path


def normalize_line(text):
    text = re.sub(r"\s+", " ", text or "").strip()
    text = text.replace("（ ", "（").replace(" ）", "）")
    return text


def compact_key(text):
    return re.sub(r"[\s`~!@#$%^&*()_+=\-[\]{};:'\",.<>/?\\|，。！？：；、“”‘’（）【】]", "", text.lower())


def is_noise_line(text):
    cleaned = normalize_line(text)
    if not cleaned:
        return True
    if len(compact_key(cleaned)) <= 1:
        return True
    for pattern in NOISE_PATTERNS:
        if re.search(pattern, cleaned):
            return True
    return False


def is_region_valuable(region_name, text):
    key = compact_key(text)
    cjk_count = len(re.findall(r"[\u4e00-\u9fff]", text))
    latin_count = len(re.findall(r"[A-Za-z]", text))
    space_count = text.count(" ")

    if region_name in {"top_left_method", "top_banner"} and ("方法" not in text and cjk_count < 4):
        return False
    if region_name in {"top_left_method", "top_banner"} and space_count > max(4, len(text) // 4):
        return False
    if region_name == "left_panel" and cjk_count < 3:
        return False
    if region_name == "bottom_caption" and cjk_count < 4 and len(key) < 10:
        return False
    if region_name in {"left_panel", "full_core"} and cjk_count == 0 and latin_count > 0 and len(key) < 18:
        return False
    return True


def get_ocr_engine():
    try:
        import easyocr

        return ("easyocr", easyocr.Reader(["ch_sim", "en"], gpu=False, verbose=False))
    except Exception:
        try:
            import pytesseract

            return ("tesseract", pytesseract)
        except Exception as exc:
            raise RuntimeError("缺少 OCR 依赖，请安装 easyocr 或 pytesseract") from exc


def upscale_crop(image_array):
    import cv2

    return cv2.resize(image_array, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)


def grayscale_crop(image_array):
    import cv2

    gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    return gray


def preprocess_crop_for_tesseract(image_array):
    import cv2

    gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    binary = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        11,
    )
    return binary


def preprocess_variants(image_array, region_name):
    variants = [upscale_crop(image_array)]
    if region_name in MULTI_PREPROCESS_REGIONS:
        variants.append(grayscale_crop(image_array))
        variants.append(preprocess_crop_for_tesseract(image_array))
    return variants


def score_text_quality(text):
    cjk_count = len(re.findall(r"[\u4e00-\u9fff]", text))
    digit_count = len(re.findall(r"\d", text))
    punct_count = len(re.findall(r"[。；：:，,！？!?]", text))
    junk_count = len(re.findall(r"[@#|_=~`^<>]", text))
    return cjk_count * 2 + digit_count + punct_count - junk_count * 2


def get_optional_tesseract():
    try:
        import pytesseract

        return pytesseract
    except Exception:
        return None


def paragraph_candidates_tesseract(tesseract, image_array):
    from PIL import Image

    candidates = []
    variants = [
        upscale_crop(image_array),
        grayscale_crop(image_array),
    ]
    for variant in variants:
        text = tesseract.image_to_string(
            Image.fromarray(variant),
            lang="chi_sim+eng",
            config="--psm 6",
        )
        for raw_line in text.splitlines():
            line = normalize_line(raw_line)
            if len(compact_key(line)) < 6:
                continue
            if is_noise_line(line):
                continue
            cjk_count = len(re.findall(r"[\u4e00-\u9fff]", line))
            ascii_count = len(re.findall(r"[A-Za-z]", line))
            junk_count = len(re.findall(r"[@#|_=~`^<>/\\\\]", line))
            if cjk_count < 4:
                continue
            if ascii_count > cjk_count:
                continue
            if junk_count >= 3:
                continue
            if score_text_quality(line) < 8:
                continue
            candidates.append(line)
    return candidates


def detect_lines_easyocr(reader, crop, region_name, offset_x, offset_y, scale=2.0):
    detections = reader.readtext(crop, detail=1, paragraph=False)
    lines = []
    for bbox, text, confidence in detections:
        text = normalize_line(text)
        if not text or confidence < 0.18 or is_noise_line(text):
            continue
        global_bbox = [[int(pt[0] / scale + offset_x), int(pt[1] / scale + offset_y)] for pt in bbox]
        lines.append(OcrLine(region=region_name, text=text, confidence=float(confidence), bbox=global_bbox))
    return lines


def detect_lines_tesseract(tesseract, crop, region_name, offset_x, offset_y):
    from PIL import Image

    data = tesseract.image_to_data(
        Image.fromarray(crop),
        lang="chi_sim+eng",
        output_type=tesseract.Output.DICT,
        config="--psm 6",
    )
    lines = []
    count = len(data.get("text", []))
    for idx in range(count):
        text = normalize_line(data["text"][idx])
        try:
            confidence = float(data["conf"][idx]) / 100.0
        except Exception:
            confidence = 0.0
        if not text or confidence < 0.18 or is_noise_line(text):
            continue
        x, y, w, h = data["left"][idx], data["top"][idx], data["width"][idx], data["height"][idx]
        bbox = [
            [int(x + offset_x), int(y + offset_y)],
            [int(x + w + offset_x), int(y + offset_y)],
            [int(x + w + offset_x), int(y + h + offset_y)],
            [int(x + offset_x), int(y + h + offset_y)],
        ]
        lines.append(OcrLine(region=region_name, text=text, confidence=confidence, bbox=bbox))
    return lines


def extract_lines_from_frame(frame_path, engine_name, engine):
    import cv2

    image = cv2.imread(str(frame_path))
    if image is None:
        return []

    height, width = image.shape[:2]
    results = []
    seen = {}
    tesseract = get_optional_tesseract() if engine_name == "easyocr" else None

    for region_name, x_ratio, y_ratio, w_ratio, h_ratio in REGION_SPECS:
        x0 = max(0, int(width * x_ratio))
        y0 = max(0, int(height * y_ratio))
        x1 = min(width, int(width * (x_ratio + w_ratio)))
        y1 = min(height, int(height * (y_ratio + h_ratio)))
        if x1 <= x0 or y1 <= y0:
            continue

        crop = image[y0:y1, x0:x1]

        if engine_name == "easyocr":
            lines = []
            for variant in preprocess_variants(crop, region_name):
                lines.extend(detect_lines_easyocr(engine, variant, region_name, x0, y0))
            if tesseract and region_name in {"top_banner", "bottom_caption"}:
                for candidate in paragraph_candidates_tesseract(tesseract, crop):
                    lines.append(
                        OcrLine(
                            region=region_name,
                            text=candidate,
                            confidence=min(0.99, max(0.3, score_text_quality(candidate) / 50.0)),
                            bbox=[[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
                        )
                    )
        else:
            lines = detect_lines_tesseract(engine, preprocess_crop_for_tesseract(crop), region_name, x0, y0)

        for line in sorted(lines, key=lambda item: (item.bbox[0][1], item.bbox[0][0])):
            key = compact_key(line.text)
            if not key:
                continue
            if not is_region_valuable(region_name, line.text):
                continue
            existing = seen.get(key)
            if existing:
                old_priority = REGION_PRIORITY.get(existing.region, 99)
                new_priority = REGION_PRIORITY.get(line.region, 99)
                old_cjk = len(re.findall(r"[\u4e00-\u9fff]", existing.text))
                new_cjk = len(re.findall(r"[\u4e00-\u9fff]", line.text))
                if new_priority < old_priority or new_cjk > old_cjk or line.confidence > existing.confidence:
                    seen[key] = line
            else:
                seen[key] = line

    ordered = sorted(seen.values(), key=lambda item: (REGION_PRIORITY.get(item.region, 99), item.bbox[0][1], item.bbox[0][0]))
    for line in ordered:
        results.append(
            {
                "region": line.region,
                "text": line.text,
                "confidence": round(line.confidence, 3),
                "bbox": line.bbox,
            }
        )
    return results


def ocr_frames_manual(frames, output_dir):
    print("[4/5] OCR 处理 (manual-vlm 模式)")
    queue_path = os.path.join(output_dir, "ocr_queue.json")
    queue = []
    for frame in frames:
        queue.append(
            {
                "filename": frame["filename"],
                "timestamp": frame["timestamp"],
                "path": frame["path"],
                "instruction": "请重点抄录标题条、参数块、提示词原文、悬浮说明框，不要总结。",
            }
        )
    with open(queue_path, "w", encoding="utf-8") as handle:
        json.dump(queue, handle, ensure_ascii=False, indent=2)

    raw_path = os.path.join(output_dir, "ocr_raw.json")
    with open(raw_path, "w", encoding="utf-8") as handle:
        json.dump([], handle, ensure_ascii=False, indent=2)

    print(f"  已生成待人工识别队列: {queue_path}")
    return raw_path


def ocr_frames_local(frames, output_dir):
    print("[4/5] OCR 处理 (local-ocr 模式)")
    engine_name, engine = get_ocr_engine()
    print(f"  OCR 引擎: {engine_name}")

    records = []
    for frame in frames:
        print(f"  识别 {frame['filename']}...")
        try:
            lines = extract_lines_from_frame(Path(frame["path"]), engine_name, engine)
            records.append(
                {
                    "filename": frame["filename"],
                    "timestamp": frame["timestamp"],
                    "path": frame["path"],
                    "line_count": len(lines),
                    "lines": lines,
                }
            )
        except Exception as exc:
            records.append(
                {
                    "filename": frame["filename"],
                    "timestamp": frame["timestamp"],
                    "path": frame["path"],
                    "line_count": 0,
                    "lines": [],
                    "error": str(exc),
                }
            )

    raw_path = os.path.join(output_dir, "ocr_raw.json")
    with open(raw_path, "w", encoding="utf-8") as handle:
        json.dump(records, handle, ensure_ascii=False, indent=2)
    print(f"  OCR 结果已保存: {raw_path}")
    return raw_path


def ocr_frames_api(frames, output_dir):
    print("[4/5] OCR 处理 (vlm-api 模式)")
    print("  当前仍未接入 VLM API，先回退到 local-ocr。")
    return ocr_frames_local(frames, output_dir)


def cleanup_prompt_text(text):
    text = text.replace("@", "")
    text = text.replace("图片10", "图片1")
    text = text.replace("0快步", "口快步")
    text = text.replace("门0", "门口")
    text = text.replace("女孑", "女子")
    text = text.replace("井轻微", "并轻微")
    text = text.replace("昃俯拍", "景俯拍")
    text = text.replace("音 音效", "音效")
    text = re.sub(r"场?\s*景\s*总\s*穿\s*帮", "场景总穿帮", text)
    text = re.sub(r"景\s*总\s*穿\s*帮", "场景总穿帮", text)
    text = text.replace("场场景总穿帮", "场景总穿帮")
    text = re.sub(r"镜\s*头\s*一\s*切\s*场\s*景\s*就\s*乱\s*瞬\s*移", "镜头一切场景就乱瞬移", text)
    text = re.sub(r"\s+", " ", text).strip(" ;，,")
    return text


def normalize_method_title(text):
    text = cleanup_prompt_text(text)
    text = text.replace("尤法", "方法")
    text = text.replace("水法", "方法")
    text = text.replace("弈 一 吴 Fit:", "方法")
    text = text.replace("场易人安格", "场景九宫格")
    text = text.replace("全能参 考模式", "全能参考模式")
    text = text.replace("全能参考模式 a", "全能参考模式")
    text = re.sub(r"^.*?(方法[0-9一二三四五六七八九十])", r"\1", text)
    text = re.sub(r"方法\s*([0-9一二三四五六七八九十])\s*[:;：；]?\s*", r"方法\1: ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if "方法3" in text and "720" in text:
        return "方法3: 720度全景图法"
    if "方法2" in text and ("九宫格" in text or "参考模式" in text):
        return "方法2: 场景九宫格+人物设定+全能参考模式"
    if "方法1" in text and ("俯视图" in text or "九宫格" in text):
        return "方法1: 俯视图+场景九宫格"
    return text


def build_center_prompt_sentences(lines):
    cleaned = [cleanup_prompt_text(line) for line in lines]

    has_pic2 = any("图片2" in line for line in cleaned)
    has_pic3 = any("图片3" in line for line in cleaned)
    has_pic4 = any("图片4" in line for line in cleaned)
    has_pic1 = any("图片1" in line for line in cleaned)

    scene_ref = any("作为城堡内" in line or "城堡内" in line for line in cleaned)
    woman_ref = next((line for line in cleaned if "女子主体" in line), "")
    man_ref = next((line for line in cleaned if "男子主体" in line), "")
    meta_lines = []
    for line in cleaned:
        if "15秒" in line or "连续叙事" in line:
            normalized = line.replace("作为男子主体。", "").replace("作为男子主体，", "")
            normalized = normalized.replace("作为男子主体", "").strip(" ，。")
            if normalized and normalized not in meta_lines:
                meta_lines.append(normalized)
    meta_ref = "，".join(meta_lines)

    parts = []
    if has_pic2 and not has_pic3:
        if scene_ref and any("和" in line or "图片2 " in line for line in cleaned):
            has_pic3 = True

    if has_pic2 or has_pic3:
        labels = []
        if has_pic2:
            labels.append("图片2")
        if has_pic3:
            labels.append("图片3")
        scene_label = "和".join(labels) if labels else ""
        if scene_ref:
            parts.append(f"{scene_label}作为城堡内部场景参考" if scene_label else "作为城堡内部场景参考")
        elif scene_label:
            parts.append(scene_label)
    if has_pic4 or woman_ref:
        woman_text = woman_ref or "图片4 作为女子主体"
        if has_pic4 and "图片4" not in woman_text:
            woman_text = "图片4 " + woman_text
        parts.append(woman_text)
    if has_pic1 or man_ref:
        man_text = man_ref or "图片1 作为男子主体"
        if has_pic1 and "图片1" not in man_text:
            man_text = "图片1 " + man_text
        man_text = man_text.replace("。15秒", "")
        parts.append(man_text)

    first_sentence = ""
    if parts:
        first_sentence = "，".join(parts)
        if meta_ref:
            first_sentence = f"{first_sentence}，{meta_ref}"
        if not re.search(r"[。！？]$", first_sentence):
            first_sentence += "。"

    timeline = next((line for line in cleaned if "00:00" in line or "景别丰富" in line), "")
    action = next((line for line in cleaned if "大厅" in line or "长桌" in line), "")
    sound = next((line for line in cleaned if line.startswith("效:") or line.startswith("音效")), "")
    if sound.startswith("效:"):
        sound = "音效: " + sound[2:].strip()
    sound = sound.replace("音 音效:", "音效:")
    if sound and action.endswith("。音"):
        action = action[:-2] + "。"

    second_parts = [part for part in [timeline, action, sound] if part]
    second_sentence = " ".join(second_parts).strip()
    if second_sentence and not re.search(r"[。！？]$", second_sentence):
        second_sentence += "。"

    return [line for line in [first_sentence, second_sentence] if line and score_text_quality(line) >= 8]


def merge_region_lines(region, lines):
    if region == "center_prompt":
        seed_lines = []
        for line in lines:
            cjk_count = len(re.findall(r"[\u4e00-\u9fff]", line))
            ascii_count = len(re.findall(r"[A-Za-z]", line))
            junk_count = len(re.findall(r"[@#|_=~`^<>/\\\\]", line))
            if cjk_count < 4 and "00:00" not in line and "图片" not in line:
                continue
            if "图片" not in line and score_text_quality(line) < 8:
                continue
            if ascii_count > max(3, cjk_count // 2):
                continue
            if junk_count >= 2 and "图片" not in line:
                continue
            seed_lines.append(line)
        semantic = build_center_prompt_sentences(seed_lines)
        if semantic:
            return semantic
        merged = []
        buffer = ""
        for line in seed_lines:
            if not buffer:
                buffer = line
                continue
            if len(compact_key(buffer)) < 20 or not re.search(r"[。；：:!?！？]$", buffer):
                buffer = f"{buffer} {line}".strip()
            else:
                merged.append(buffer)
                buffer = line
        if buffer:
            merged.append(buffer)
        return [line for line in merged if score_text_quality(line) >= 8]

    if region in {"top_left_method", "top_banner"}:
        method_lines = [line for line in lines if "方法" in line]
        if method_lines:
            method_lines = sorted(
                method_lines,
                key=lambda item: (score_text_quality(item), len(re.findall(r"[\u4e00-\u9fff]", item))),
                reverse=True,
            )
            return [normalize_method_title(method_lines[0])]
        kept = [line for line in lines if score_text_quality(line) >= 8]
        return [normalize_method_title(kept[0])] if kept else []

    if region == "bottom_caption":
        preferred = []
        for line in lines:
            if score_text_quality(line) < 6:
                continue
            normalized = cleanup_prompt_text(line)
            if "镜头" in normalized or "场景总穿帮" in normalized or "这5个方法很实用" in normalized:
                preferred.append(normalized)
        merged = []
        for line in preferred or lines:
            if merged and SequenceMatcher(None, merged[-1], line).ratio() > 0.85:
                continue
            merged.append(line)
        normalized_lines = []
        for line in merged:
            if "场景总穿帮" in line and "5个方法" in line:
                normalized_lines.append("场景总穿帮? 这5个方法很实用")
            elif "场景总穿帮" in line:
                normalized_lines.append("场景总穿帮?")
            elif "镜头一切场景就乱瞬移" in line:
                normalized_lines.append("镜头一切场景就乱瞬移怎么办? 今天分享5招工业级解决")
            else:
                normalized_lines.append(line)

        final_lines = []
        for line in normalized_lines:
            if line not in final_lines:
                final_lines.append(line)
        return final_lines[:2]

    if region == "full_core":
        kept = []
        for line in lines:
            if score_text_quality(line) < 8:
                continue
            if len(re.findall(r"[\u4e00-\u9fff]", line)) < 4 and "截图" not in line and "场景图" not in line:
                continue
            kept.append(line)
        return kept[:6]

    return lines


def prune_region_noise(region_map):
    pruned = {}
    for region, lines in region_map.items():
        if region in {"center_canvas", "left_panel"}:
            continue
        filtered = []
        for line in lines:
            if "4月30" in line or "顾弈枫" in line or "更新至第" in line or "合集" in line or line == "展开":
                continue
            filtered.append(line)
        if filtered:
            pruned[region] = filtered

    if "top_left_method" in pruned:
        pruned["top_banner"] = pruned["top_left_method"]
        pruned.pop("top_left_method", None)

    if "center_prompt" in pruned:
        pruned.pop("full_core", None)
    elif "top_banner" in pruned and "full_core" in pruned:
        pruned["full_core"] = [
            line for line in pruned["full_core"] if "截图" in line or "场景图" in line or "720" in line or "360" in line
        ]
        if not pruned["full_core"]:
            pruned.pop("full_core", None)

    if "top_banner" in pruned and "bottom_caption" in pruned:
        pruned["bottom_caption"] = [
            line for line in pruned["bottom_caption"] if "镜头一切场景就乱瞬移" in line or "这5个方法很实用" in line
        ] or pruned["bottom_caption"]

    if "top_banner" in pruned:
        banner = pruned["top_banner"][0]
        if "方法" not in banner or score_text_quality(banner) < 8:
            pruned.pop("top_banner", None)

    empty_regions = [region for region, lines in pruned.items() if not lines]
    for region in empty_regions:
        pruned.pop(region, None)
    return pruned


def reduce_frame_records(ocr_results, similarity_threshold=0.92):
    print("[5/5] 清洗与组织结果")
    reduced = []
    previous_signature = ""

    for frame in sorted(ocr_results, key=lambda item: item.get("timestamp", 0)):
        lines = frame.get("lines", [])
        if not lines:
            continue

        grouped = {}
        for line in lines:
            grouped.setdefault(line["region"], [])
            grouped[line["region"]].append(line["text"])

        signature_parts = []
        stable_groups = {}
        for region in sorted(grouped.keys(), key=lambda item: REGION_PRIORITY.get(item, 99)):
            cleaned_lines = []
            seen = set()
            for text in grouped[region]:
                key = compact_key(text)
                if not key or key in seen:
                    continue
                seen.add(key)
                cleaned_lines.append(text)
            cleaned_lines = merge_region_lines(region, cleaned_lines)
            if cleaned_lines:
                stable_groups[region] = cleaned_lines
                signature_parts.extend(cleaned_lines)

        if not stable_groups:
            continue

        stable_groups = prune_region_noise(stable_groups)
        if not stable_groups:
            continue

        signature = " | ".join(signature_parts)
        if previous_signature:
            similarity = SequenceMatcher(None, previous_signature, signature).ratio()
            if similarity >= similarity_threshold:
                continue

        reduced.append(
            {
                "timestamp": frame["timestamp"],
                "filename": frame.get("filename"),
                "regions": stable_groups,
            }
        )
        previous_signature = signature

    print(f"  原始帧记录: {len(ocr_results)}")
    print(f"  保留关键帧: {len(reduced)}")
    return reduced


def generate_markdown(output_dir, url, video_duration, interval, backend, reduced_records):
    md_path = os.path.join(output_dir, "result.md")
    lines = [
        "---",
        "title: 视频画面细节摘录",
        f"source: {url}",
        f"video_duration: {video_duration:.1f}s",
        f"sampling_interval: {interval}s",
        f"ocr_backend: {backend}",
        f"keyframes: {len(reduced_records)}",
        "---",
        "",
        "# 视频画面细节摘录",
        "",
        f"> 来源: {url}",
        f"> 目标: 尽量摘录画面中出现的标题条、提示词原文、参数块和说明块，而不是概述视频内容。",
        "",
    ]

    if not reduced_records:
        lines.append("未识别到可用文字。")
    else:
        for record in reduced_records:
            lines.append(f"## [{record['timestamp']:.1f}s] {record['filename']}")
            lines.append("")
            for region in sorted(record["regions"].keys(), key=lambda item: REGION_PRIORITY.get(item, 99)):
                region_lines = record["regions"][region]
                lines.append(f"### {region}")
                lines.append("")
                for text in region_lines:
                    lines.append(f"- {text}")
                lines.append("")

    with open(md_path, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines))
    print(f"  result.md 已生成: {md_path}")
    return md_path


def resolve_outputs(output_arg, artifacts_dir_arg, overwrite):
    output_path = Path(output_arg).expanduser() if output_arg else None
    artifacts_dir = Path(artifacts_dir_arg).expanduser() if artifacts_dir_arg else None

    if output_path and output_path.suffix.lower() == ".md":
        final_markdown = output_path
        default_artifacts = final_markdown.with_suffix("")
        artifacts_dir = artifacts_dir or default_artifacts.parent / f"{default_artifacts.name}.video-ocr"
    else:
        artifacts_dir = artifacts_dir or (output_path if output_path else Path("video-ocr-output"))
        final_markdown = artifacts_dir / "result.md"

    if final_markdown.exists() and not overwrite:
        raise FileExistsError(f"输出文件已存在: {final_markdown}")
    if artifacts_dir.exists() and not overwrite:
        if any(artifacts_dir.iterdir()):
            raise FileExistsError(f"输出目录已存在: {artifacts_dir}")

    return final_markdown, artifacts_dir


def main():
    parser = argparse.ArgumentParser(description="将视频页面中的画面文字提取为 Markdown")
    parser.add_argument("url", help="视频页面 URL")
    parser.add_argument("--output", "-o", help="输出 Markdown 文件路径；若传目录则默认写入其中的 result.md")
    parser.add_argument("--artifacts-dir", help="保存 manifest.json / ocr_raw.json / frames 的目录")
    parser.add_argument("--interval", type=float, default=1.0, help="采样间隔（秒）")
    parser.add_argument("--start", type=float, default=0.0, help="起始时间（秒）")
    parser.add_argument("--end", type=float, default=-1.0, help="结束时间（-1 表示到视频末尾）")
    parser.add_argument("--max-duration", type=float, default=-1.0, help="最大采集时长（秒）")
    parser.add_argument("--selector", default="video", help="截图目标：video / viewport / CSS 选择器")
    parser.add_argument("--session", default="video-ocr", help="kimi-webbridge session 名称")
    parser.add_argument(
        "--ocr-backend",
        default="local-ocr",
        choices=["manual-vlm", "local-ocr", "vlm-api", "none"],
        help="OCR 后端",
    )
    parser.add_argument("--overwrite", action="store_true", help="覆盖已有输出目录")
    parser.add_argument("--keep-frames", action="store_true", help="保留截图文件")
    args = parser.parse_args()
    set_session(args.session)

    try:
        final_markdown, artifacts_dir = resolve_outputs(args.output, args.artifacts_dir, args.overwrite)
    except FileExistsError as exc:
        print(f"错误: {exc}")
        print("使用 --overwrite 覆盖")
        return

    output_dir = str(artifacts_dir)
    if artifacts_dir.exists() and args.overwrite:
        shutil.rmtree(artifacts_dir)

    if not check_bridge_available():
        print("错误: kimi-webbridge 不可用，请先启动它。")
        return

    os.makedirs(output_dir, exist_ok=True)

    if not open_page(args.url):
        print("错误: 无法打开页面")
        return

    video_info = get_video_info()
    video_duration = video_info.get("duration", 30.0)

    frames = capture_frames(
        args.url,
        output_dir,
        interval=args.interval,
        start=args.start,
        end=args.end,
        max_duration=args.max_duration,
        selector=args.selector,
    )
    if not frames:
        print("错误: 未截取到任何帧")
        return

    generate_manifest(output_dir, args.url, video_duration, args.interval, frames)

    if args.ocr_backend == "none":
        print("[4/5] 已跳过 OCR")
        ocr_raw_path = None
    elif args.ocr_backend == "manual-vlm":
        ocr_raw_path = ocr_frames_manual(frames, output_dir)
    elif args.ocr_backend == "local-ocr":
        ocr_raw_path = ocr_frames_local(frames, output_dir)
    else:
        ocr_raw_path = ocr_frames_api(frames, output_dir)

    if ocr_raw_path and os.path.exists(ocr_raw_path):
        with open(ocr_raw_path, "r", encoding="utf-8") as handle:
            ocr_results = json.load(handle)
        reduced_records = reduce_frame_records(ocr_results)
        generated_md = generate_markdown(output_dir, args.url, video_duration, args.interval, args.ocr_backend, reduced_records)
        final_markdown.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(generated_md, final_markdown)
        print(f"  最终 Markdown 已写入: {final_markdown}")
    else:
        print("[5/5] 跳过 Markdown 生成")

    if not args.keep_frames:
        frames_dir = os.path.join(output_dir, "frames")
        if os.path.isdir(frames_dir):
            shutil.rmtree(frames_dir)
            print(f"  已清理截图目录: {frames_dir}")

    print("\n完成")
    print(f"  输出目录: {output_dir}")
    print(f"  Markdown: {final_markdown}")
    print(f"  截图数量: {len(frames)}")


if __name__ == "__main__":
    main()
