#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Horizontal-Vertical Analysis Report Markdown to PDF converter (fpdf2 version)
For Windows environments without GTK/WeasyPrint.
Usage: python md_to_pdf_fpdf2.py input.md output.pdf [--title "Report Title"]
"""

import sys
import os
import re
import argparse
from fpdf import FPDF


FONT_DIR = "C:/Windows/Fonts/"


class ReportPDF(FPDF):
    def __init__(self, title="横纵分析报告"):
        super().__init__()
        self.title = title
        self.set_auto_page_break(auto=True, margin=25)
        self.add_font("SimSun", "", FONT_DIR + "NotoSansSC-VF.ttf")
        self.add_font("SimSun", "B", FONT_DIR + "NotoSansSC-VF.ttf")
        self.add_font("SimSun", "I", FONT_DIR + "NotoSansSC-VF.ttf")
        self.add_font("SimSun", "BI", FONT_DIR + "NotoSansSC-VF.ttf")
        self.add_font("KaiTi", "", FONT_DIR + "STKAITI.TTF")
        self.add_font("KaiTi", "B", FONT_DIR + "STKAITI.TTF")
        # Default to SimSun
        self.set_font("SimSun", "", 10)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("SimSun", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 6, f"{self.title}  |  横纵分析法深度研究报告", align="C")
        self.ln(4)

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-15)
        self.set_font("SimSun", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"第 {self.page_no()} 页", align="C")
        self.set_draw_color(26, 82, 118)
        self.line(self.l_margin, self.get_y() - 2, self.w - self.r_margin, self.get_y() - 2)

    def cover_page(self, title, subtitle="横纵分析法深度研究报告", meta="", author="数字生命卡兹克"):
        self.add_page()
        self.ln(60)
        self.set_font("SimSun", "B", 22)
        self.set_text_color(26, 82, 118)
        self.multi_cell(0, 10, title, align="C")
        self.ln(8)
        self.set_font("SimSun", "", 12)
        self.set_text_color(150, 150, 150)
        self.multi_cell(0, 8, subtitle, align="C")
        if meta:
            self.ln(4)
            self.set_font("SimSun", "", 10)
            self.multi_cell(0, 7, meta, align="C")
        self.ln(10)
        self.set_draw_color(26, 82, 118)
        self.set_line_width(0.8)
        self.line(60, self.get_y(), self.w - 60, self.get_y())
        self.ln(10)
        self.set_font("SimSun", "", 10)
        self.set_text_color(150, 150, 150)
        self.cell(0, 7, f"作者: {author}", align="C")

    def add_heading(self, text, level=1):
        text = re.sub(r'^#+\s*', '', text).strip()
        if level == 1:
            self.ln(4)
            self.set_font("SimSun", "B", 16)
            self.set_text_color(26, 82, 118)
            self.cell(0, 10, text)
            self.ln(2)
            self.set_draw_color(26, 82, 118)
            self.set_line_width(0.5)
            self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
            self.ln(4)
        elif level == 2:
            self.ln(3)
            self.set_font("SimSun", "B", 13)
            self.set_text_color(30, 132, 73)
            self.cell(0, 8, text)
            self.ln(3)
        elif level == 3:
            self.ln(2)
            self.set_font("SimSun", "B", 11)
            self.set_text_color(46, 134, 193)
            self.cell(0, 7, text)
            self.ln(2)
        elif level >= 4:
            self.ln(1)
            self.set_font("SimSun", "B", 10)
            self.set_text_color(91, 44, 111)
            self.cell(0, 6, text)
            self.ln(1)

    def add_paragraph(self, text):
        text = text.strip()
        if not text:
            self.ln(2)
            return
        self.set_font("SimSun", "", 10)
        self.set_text_color(44, 62, 80)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def add_blockquote(self, text):
        text = text.strip()
        self.set_fill_color(240, 241, 242)
        self.set_draw_color(26, 82, 118)
        x = self.get_x()
        y = self.get_y()
        w = self.w - self.r_margin - x
        self.set_font("SimSun", "I", 9)
        lines_count = max(1, int(len(text) / (w / 2.5)) + 1)
        h = max(8, lines_count * 5) + 4
        self.rect(x, y, w, h, style="DF")
        self.set_line_width(1)
        self.line(x, y, x, y + h)
        self.ln(h + 1)
        self.set_font("SimSun", "I", 9)
        self.set_text_color(93, 109, 126)
        self.multi_cell(w - 3, 4.5, text)
        self.ln(2)

    def add_table(self, headers, rows):
        total_cols = max(len(headers), max((len(r) for r in rows), default=0))
        available_w = self.w - self.r_margin - self.l_margin
        cw = available_w / total_cols

        self.set_font("SimSun", "B", 8)
        self.set_fill_color(26, 82, 118)
        self.set_text_color(255, 255, 255)
        for h in headers:
            self.cell(cw, 7, str(h), border=1, fill=True, align="C")
        self.ln()

        self.set_font("SimSun", "", 8)
        self.set_text_color(44, 62, 80)
        for row_idx, row in enumerate(rows):
            if row_idx % 2 == 0:
                self.set_fill_color(245, 246, 247)
            else:
                self.set_fill_color(255, 255, 255)
            rh = 7
            x_start = self.get_x()
            y_start = self.get_y()
            for i, cell_text in enumerate(row):
                self.set_xy(x_start + cw * i, y_start)
                self.cell(cw, rh, str(cell_text), border=1, fill=True)
            self.set_xy(x_start, y_start + rh)
        self.ln(4)
        self.set_text_color(44, 62, 80)

    def add_list(self, items, indent=10):
        self.set_font("SimSun", "", 10)
        self.set_text_color(44, 62, 80)
        bullet = chr(8226)
        for item in items:
            item = item.strip()
            if not item:
                continue
            self.set_x(indent)
            self.cell(5, 5.5, bullet)
            self.multi_cell(self.w - self.r_margin - indent - 5, 5.5, item)
        self.ln(2)

    def add_bold_paragraph(self, bold_part, normal_part):
        self.set_font("SimSun", "B", 10)
        self.set_text_color(26, 37, 48)
        bw = self.get_string_width(bold_part)
        self.cell(bw + 1, 5.5, bold_part)
        self.set_font("SimSun", "", 10)
        self.set_text_color(44, 62, 80)
        self.multi_cell(0, 5.5, normal_part)
        self.ln(1)

    def add_hr(self):
        self.set_draw_color(189, 195, 199)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)


def parse_markdown(md_text):
    """Parse markdown text into structured elements for PDF rendering."""
    lines = md_text.split('\n')
    elements = []
    i = 0

    while i < len(lines):
        line = lines[i]

        if not line.strip():
            elements.append(('blank', ''))
            i += 1
            continue

        heading_match = re.match(r'^(#{1,4})\s+(.+)$', line)
        if heading_match:
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            elements.append(('heading', text, level))
            i += 1
            continue

        if line.strip().startswith('>'):
            bq_lines = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                bq_lines.append(re.sub(r'^>\s?', '', lines[i]))
                i += 1
            elements.append(('blockquote', '\n'.join(bq_lines)))
            continue

        if '|' in line and i + 1 < len(lines) and re.match(r'^[\s|-|:]+$', lines[i + 1]):
            headers = [h.strip() for h in line.split('|') if h.strip()]
            i += 2
            rows = []
            while i < len(lines) and '|' in lines[i]:
                row = [c.strip() for c in lines[i].split('|') if c.strip()]
                rows.append(row)
                i += 1
            elements.append(('table', headers, rows))
            continue

        if re.match(r'^(\s*)[-*]\s+', line):
            items = []
            while i < len(lines) and re.match(r'^\s*[-*]\s+', lines[i]):
                item_text = re.sub(r'^\s*[-*]\s+', '', lines[i])
                items.append(item_text)
                i += 1
            elements.append(('list', items))
            continue

        if re.match(r'^-{3,}$', line.strip()):
            elements.append(('hr', ''))
            i += 1
            continue

        if '**' in line:
            parts = line.split('**')
            parsed_parts = []
            for j, part in enumerate(parts):
                if j % 2 == 1:
                    parsed_parts.append(('B', part))
                else:
                    parsed_parts.append(('N', part))
            elements.append(('formatted_text', parsed_parts))
            i += 1
            continue

        para_lines = []
        while i < len(lines) and lines[i].strip():
            if lines[i].startswith('#') or lines[i].startswith('|') or re.match(r'^\s*[-*]\s+', lines[i]) or lines[i].strip().startswith('>') or '---' in lines[i]:
                break
            para_lines.append(lines[i])
            i += 1
        if para_lines:
            elements.append(('paragraph', '\n'.join(para_lines)))
        else:
            i += 1

    return elements


def render_elements(pdf, elements):
    """Render parsed elements to PDF."""
    for elem in elements:
        etype = elem[0]

        if etype == 'blank':
            pdf.ln(2)

        elif etype == 'heading':
            text, level = elem[1], elem[2]
            if level == 1:
                continue
            pdf.add_heading(text, level)

        elif etype == 'blockquote':
            pdf.add_blockquote(elem[1])

        elif etype == 'table':
            pdf.add_table(elem[1], elem[2])

        elif etype == 'list':
            pdf.add_list(elem[1])

        elif etype == 'hr':
            pdf.add_hr()

        elif etype == 'formatted_text':
            for style, text in elem[1]:
                if style == 'B':
                    pdf.set_font("SimSun", "B", 10)
                    pdf.set_text_color(26, 37, 48)
                    bw = pdf.get_string_width(text)
                    pdf.cell(bw + 1, 5.5, text)
                else:
                    pdf.set_font("SimSun", "", 10)
                    pdf.set_text_color(44, 62, 80)
                    pdf.multi_cell(0, 5.5, text)
            pdf.ln(1)

        elif etype == 'paragraph':
            pdf.add_paragraph(elem[1])


def main():
    parser = argparse.ArgumentParser(description="HV Analysis Report Markdown -> PDF (fpdf2)")
    parser.add_argument("input", help="Input Markdown file path")
    parser.add_argument("output", help="Output PDF file path")
    parser.add_argument("--title", default=None, help="Report title")
    parser.add_argument("--author", default="数字生命卡兹克", help="Author name")
    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        md_text = f.read()

    title = args.title or "横纵分析报告"

    meta_line = ""
    for line in md_text.split("\n"):
        stripped = line.strip().lstrip(">").strip()
        if "研究时间" in stripped or "所属领域" in stripped or "研究对象类型" in stripped:
            meta_line = stripped
            break

    pdf = ReportPDF(title=title)
    pdf.set_margins(25, 25, 25)
    pdf.cover_page(title, meta=meta_line, author=args.author)

    elements = parse_markdown(md_text)
    render_elements(pdf, elements)

    pdf.output(args.output)
    size_kb = os.path.getsize(args.output) / 1024
    print(f"[OK] PDF generated: {args.output} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
