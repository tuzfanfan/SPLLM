from __future__ import annotations

import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).parent
SPEC = importlib.util.spec_from_file_location("net_to_markdown", ROOT / "net_to_markdown.py")
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class RouterTests(unittest.TestCase):
    def test_general_web_route(self):
        self.assertEqual(
            MODULE.classify_url("https://github.com/NanmiCoder/MediaCrawler")["route"],
            "web",
        )

    def test_browser_session_route(self):
        self.assertEqual(
            MODULE.classify_url("https://mp.weixin.qq.com/s/example")["route"],
            "browser-session",
        )

    def test_social_route(self):
        route = MODULE.classify_url("https://www.xiaohongshu.com/explore/note-123")
        self.assertEqual((route["route"], route["platform"]), ("social", "xhs"))

    def test_forced_social_route(self):
        args = type(
            "Args",
            (),
            {
                "url": "https://www.zhihu.com/question/example",
                "backend": "social",
                "platform": "zhihu",
            },
        )()
        self.assertEqual(MODULE.resolve_route(args)["platform"], "zhihu")


class SocialAdapterTests(unittest.TestCase):
    def setUp(self):
        self.contents = [
            {
                "note_id": "note-123",
                "note_url": "https://www.xiaohongshu.com/explore/note-123",
                "title": "一条可复用的测试笔记",
                "desc": "正文内容",
                "nickname": "测试作者",
                "liked_count": "128",
                "collected_count": 42,
                "comment_count": 2,
                "tag_list": "AI,工作流",
            }
        ]
        self.comments = [
            {
                "note_id": "note-123",
                "comment_id": "c1",
                "nickname": "甲",
                "content": "高赞评论",
                "like_count": 31,
            },
            {
                "note_id": "note-123",
                "comment_id": "c2",
                "nickname": "乙",
                "content": "普通评论",
                "like_count": 2,
            },
            {
                "note_id": "other",
                "comment_id": "c3",
                "content": "不应进入结果",
                "like_count": 99,
            },
        ]

    def test_social_jsonl_to_markdown(self):
        document = MODULE.normalize_social(
            self.contents[0]["note_url"], "xhs", self.contents, self.comments, 2
        )
        markdown = MODULE.render_social_markdown(document)
        self.assertEqual(document.platform, "小红书")
        self.assertEqual([item.comment_id for item in document.comments], ["c1", "c2"])
        self.assertIn("## 正文", markdown)
        self.assertIn("## 互动数据", markdown)
        self.assertIn("## 代表性评论", markdown)
        self.assertIn("不代表平台整体舆论", markdown)
        self.assertNotIn("不应进入结果", markdown)

    def test_jsonl_and_model_serialization(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            jsonl = Path(temp_dir) / "content.jsonl"
            jsonl.write_text(
                json.dumps(self.contents[0], ensure_ascii=False) + "\n",
                encoding="utf-8",
            )
            records = MODULE.read_jsonl(str(jsonl))
            document = MODULE.normalize_social(
                self.contents[0]["note_url"], "xhs", records, [], 0
            )
            model = Path(temp_dir) / "model.json"
            MODULE.write_json(str(model), MODULE.asdict(document))
            self.assertEqual(
                json.loads(model.read_text(encoding="utf-8"))["source_id"], "note-123"
            )


if __name__ == "__main__":
    unittest.main()
