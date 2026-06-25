---
name: knowledge-extractor
description: Extract structured knowledge objects from a source text, transcript, article, report, note, or wiki page. Use when the user wants to extract real questions, external references, reusable tags, or a combined extraction pass before writing, wiki ingestion, meeting follow-up, or research synthesis. Triggers include “提取问题”, “抽引用”, “补标签”, “整理检索标签”, “看看这篇提到了哪些人/书/论文”, and “先把材料里的问题与引用抽出来”.
---

# Knowledge Extractor

## Overview

Use one lightweight extraction skill to replace three thin single-purpose skills:

- `questions`: pull out explicit and implicit user questions
- `references`: pull out books, papers, people, concepts, organizations, and cases
- `tags`: generate stable retrieval tags for wiki pages, reports, and articles

Prefer this skill when the job is to prepare a source text for downstream use, not to fully summarize, rewrite, or evaluate it.

## Route The Request

Choose one mode first:

1. `questions`
   - Use for interviews, meetings, podcasts, transcripts, comment threads, and Q&A notes
   - Goal: preserve what people are actually asking

2. `references`
   - Use for articles, research notes, long-form writing, or source pages
   - Goal: surface the external objects the text points to

3. `tags`
   - Use for wiki pages, source summaries, reports, or content assets
   - Goal: produce compact, reusable retrieval tags

4. `combined`
   - Use when the source is dense and will feed later writing, wiki ingestion, or research
   - Default order: `questions -> references -> tags`

## Output Contract

### Questions mode

Output:

- `原始问题清单`
- `归并后的问题主题`
- `高频问题`
- `待回答问题`

Rules:

- Preserve question intent, not just literal punctuation
- Separate real questions from emotional venting
- Merge only when the semantic core is the same
- Mark rewritten questions as `整理后表达` when needed

### References mode

Output:

- `人物`
- `书籍`
- `论文`
- `组织`
- `案例`
- `概念`
- `值得建页的候选`
- `待确认引用`

Rules:

- Extract only objects explicitly mentioned or clearly pointed to
- Mark vague references as `待确认`
- Keep one short note on why the object matters in context
- Merge duplicates while preserving differing contexts of use

### Tags mode

Output:

- `主标签`
- `补充标签`
- `可合并别名`
- `不建议采用的标签`

Rules:

- Default to 5-12 tags
- Prefer short, stable, reusable tags
- Prioritize retrieval over decoration
- Reuse existing vocabulary when the workspace already has a stable term
- Avoid turning a full opinion sentence into a tag

## When Not To Use

Do not use this skill when:

- the user wants a meeting memo rather than question extraction
- the user wants a full summary rather than reference or tag extraction
- the user wants claim verification rather than object extraction
- the material is too thin to support meaningful extraction

Route elsewhere:

- claim checking -> `claim-analyzer`
- meeting decisions and action items -> `meeting-summarizer`
- full writing and newsletter reshaping -> `oral-copy`
- deep research and formal comparison -> `hv-analysis` or `quick-compare`

## Recommended Workflow

1. Identify the source type:
   - transcript / meeting / interview
   - article / report / note
   - wiki page / source page / archive artifact
2. Choose the smallest sufficient mode.
3. Run `combined` only when the result will clearly feed later work.
4. Keep extraction separate from interpretation.
5. If the user then wants writing or promotion, hand off the extracted structure instead of re-reading the whole source.

## Downstream Handoffs

- To `oral-copy`: pass `核心问题`, `关键引用`, and `建议标签`
- To wiki ingest: pass `references` and `tags`
- To research planning: pass `questions` and `references`
- To `prompt-flow`: use the extracted structure as front-loaded context rather than free-form source dumping
