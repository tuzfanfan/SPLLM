# Hotpoint Live-Video LLM Wiki

## Description

This document is adapted from Karpathy's LLM Wiki and applied to the routine monitoring of trending topics, with the goal of promptly converting insights into conceptual products and product demo presentations. This workflow helps users maintain sharp awareness across industry, academia, and research.

## Core Idea

Most people's experience of interacting with LLMs and documents looks like RAG: you upload a set of files, the LLM retrieves relevant text chunks at query time, and then generates an answer. This works, but the LLM re-discovers knowledge from scratch on every question. There is no accumulation. Ask a nuanced question that requires synthesizing content from five documents, and the LLM has to find and stitch together the relevant fragments every single time. Nothing is being built up. NotebookLM, ChatGPT file uploads, and most RAG systems all work this way.

The idea here is different. Instead of only retrieving from raw documents at query time, the LLM incrementally builds and maintains a persistent wiki — a structured, cross-linked collection of markdown files that sits between you and your source material. When you add new material, the LLM doesn't just index it for later retrieval. It reads it, extracts key information, and integrates it into the existing wiki — updating entity pages, revising topic summaries, noting where new data contradicts or reinforces or challenges the evolving synthesis. Knowledge is compiled once, then kept current, rather than re-derived on every query.

This is the key distinction: the wiki is a persistent, accumulating artifact. Cross-references already exist. Contradictions are already flagged. The synthesis already reflects everything you've read. Every source you add and every question you ask makes the wiki richer.

You rarely (if ever) write the wiki yourself — the LLM writes and maintains everything. Your job is to find sources, guide the analysis, and ask the right questions. The LLM handles all the tedious work — summarizing, cross-referencing, filing, and bookkeeping that keeps a knowledge base useful over time. In practice, I keep an LLM agent open on one side and Obsidian open on the other. The LLM edits based on our conversation, and I browse the results in real time — following links, checking the graph view, reading updated pages. Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase.

This can be applied to many different scenarios. A few examples:

- **Personal**: Track your own goals, health, psychology, self-improvement — journal entries, articles, podcast notes, building a structured picture of yourself over time.
- **Research**: Deep-dive into a topic over weeks or months — reading papers, articles, reports, and incrementally building a synthesis wiki with evolving arguments.
- **Reading a book**: Log each chapter as you read, creating pages for characters, themes, plot threads, and their connections. By the end, you have a rich companion wiki. Think of something like Tolkien Gateway — thousands of cross-linked pages covering characters, locations, events, and languages, built by volunteers over years. You can personally build something like this while reading, with the LLM doing all the cross-referencing and maintenance.
- **Business (Industry Tracking) / Team**: An internal wiki maintained by the LLM, informed by Slack threads, meeting notes, project docs, customer calls, and more. Optionally with human review of updates. The wiki stays current because the LLM takes on the maintenance work nobody on the team wants to do.
- **Competitive analysis, due diligence, trip planning, course notes, hobby deep-dives** — anything where you need to accumulate knowledge over time and want it organized rather than scattered.

## Architecture

There are four layers:

- **Daily Feed** — The latest market information you collect through agent-based automated workflows. These are immutable — the LLM reads from them but never modifies them. This is your source of inspiration.
- **Source Material** — Your curated collection of source documents, primarily oriented toward methodology learning. Articles, papers, images, data files. These are immutable — the LLM reads from them but never modifies them. This is your source of truth.
- **Wiki** — A directory of LLM-generated markdown files. Summaries, entity pages, concept pages, comparisons, overviews, syntheses. The LLM fully owns this layer. It creates pages, updates them when new material arrives, maintains cross-references, and keeps everything consistent. You read it; the LLM writes it.
- **Schema** — A document (e.g., Codex's AGENTS.md or Claude Code's CLAUDE.md) that tells the LLM how the wiki is structured, what the conventions are, and which workflows to follow when ingesting material, answering questions, or maintaining the wiki. This is the critical configuration file — it's what makes the LLM a disciplined wiki maintainer rather than a generic chatbot. You and the LLM co-evolve this schema as you figure out what works for your domain.

## Operations

### Ingest (Daily Feed)

You place a new source into the daily feed collection and tell the LLM to process it. An example workflow: the LLM reads the material as a product expert and marketing expert, providing insights from a professional perspective. The LLM writes a summary page in the wiki, updates the index, updates relevant entity and concept pages in the wiki, and appends an entry to the log.

### Digest (Source Material)

You place a new source into the source material collection and tell the LLM to process it. An example workflow: the LLM reads the material, discusses key takeaways with you, writes a summary page in the wiki, updates the index, updates relevant entity and concept pages in the wiki, and appends an entry to the log. A single source might touch 10–15 wiki pages. I personally prefer ingesting one source at a time and staying engaged — I read the summaries, check the updates, and guide the LLM on what to emphasize. But you can also batch-ingest many sources at a lower level of supervision. It's up to you to develop a workflow that fits your style and document it in the schema for future sessions.

### Query

You ask questions against the wiki. The LLM searches for relevant pages, reads them, and synthesizes an answer with citations. Depending on the question, the answer can take different forms — a markdown page, a comparison table, a slide deck (Marp), a chart (matplotlib), or a canvas. The key insight: good answers can be archived back into the wiki as new pages. The comparisons, analyses, and connections you discover are valuable and shouldn't disappear into chat history. This way, your explorations accumulate in the knowledge base just like ingested material.

### Produce

You can actively leverage the wiki's productivity. The LLM will assist your work based on the wiki's knowledge, skills, and concepts, following the schema document. The output format depends on the task you want to complete — a markdown page, a comparison table, a slide deck, a project document, and so on. The key insight: good production outputs can be archived back into the wiki as new pages. The comparisons, analyses, and connections you discover are valuable and shouldn't disappear into chat history. This way, your explorations accumulate in the knowledge base just like ingested material.

### Check

Periodically ask the LLM to perform a health check on the wiki. Look for: contradictions between pages, outdated claims superseded by newer material, orphaned pages with no incoming links, important concepts that are mentioned but lack dedicated pages, missing cross-references, and data gaps that could be filled through web searches. The LLM is excellent at surfacing new questions to investigate and new sources to find. This keeps the wiki healthy as it grows.

## Index and Log

Two special files help the LLM (and you) navigate the wiki as it grows. They serve different purposes:

- **index.md** is content-oriented. It's a table of contents for everything in the wiki — every page listed with a link, a one-line summary, and optional metadata like date or source count. Organized by category (entities, concepts, sources, etc.). The LLM updates it on every ingestion. When answering queries, the LLM reads the index first to find relevant pages, then dives into them. This works surprisingly well at medium scale (~100 sources, hundreds of pages) and avoids the need for embedding-based RAG infrastructure.
- **log.md** is chronological. It's an append-only record of what happened and when — ingestions, queries, checks. A useful trick: if each entry starts with a consistent prefix (e.g., `## [2026-04-02] ingest | Article Title`), then the log can be parsed with simple unix tools — `grep "^## \[" log.md | tail -5` gives you the last 5 entries. The log gives you a chronology of the wiki's evolution and helps the LLM understand what work was recently completed.

## Optional: CLI Tools

At some point, you may want to build small tools to help the LLM operate the wiki more efficiently. A search engine for wiki pages is the most obvious need — at small scale, the index file suffices, but as the wiki grows, you need real search. qmd is a good option: it's a local search engine for markdown files with hybrid BM25/vector search and LLM reranking, all running on your local device. It has both a CLI (so the LLM can shell into it) and an MCP server (so the LLM can use it as a native tool). You could also build something simpler yourself — when the need arises, the LLM can help you write a simple search script without code.

## Tips and Tricks

- **Obsidian Web Clipper** is a browser extension that converts web articles into markdown. Extremely useful for quickly getting material into your source collection.
- Download images locally. In Obsidian Settings → Files and Links, set "Attachment folder path" to a fixed directory (e.g., `raw/assets/`). Then, in Settings → Hotkeys, search for "Download" to find "Download attachments for current file" and bind it to a shortcut (e.g., Ctrl+Shift+D). After clipping an article, press the shortcut and all images will be downloaded to local disk. This is optional but useful — it lets the LLM view and reference images directly rather than relying on URLs that may break. Note that the LLM cannot natively read a markdown file with inline images all at once — the workaround is to have the LLM read the text first, then separately view some or all of the referenced images for additional context. It's a bit clunky but works well enough.
- **Obsidian's graph view** is the best way to see the wiki's structure — what connects to what, which pages are hubs, and which are islands.
- **Marp** is a markdown-based slide format. Obsidian has a plugin for it. Useful for generating presentations directly from wiki content.
- **Dataview** is an Obsidian plugin that can run queries against page frontmatter. If your LLM adds YAML frontmatter to wiki pages (tags, dates, source count), Dataview can generate dynamic tables and lists.
- The wiki is just a git repository of markdown files. You get version history, branching, and collaboration for free.

## Why This Works

The tedious part of maintaining a knowledge base isn't the reading or the thinking — it's the bookkeeping. Updating cross-references, keeping summaries current, noting when new data contradicts old claims, maintaining consistency across dozens of pages. People abandon wikis because the maintenance burden grows faster than the value. The LLM doesn't get bored, doesn't forget to update a cross-reference, and can process 15 files at once. The wiki gets maintained because the maintenance cost approaches zero.

The human's job is to curate sources, guide the analysis, ask good questions, and think about what it all means. The LLM's job is everything else.

This idea is spiritually related to Vannevar Bush's Memex (1945) — a personal, curated knowledge store with associative trails between documents. Bush's vision was closer to this than what the web later became: private, actively curated, where the connections between documents were as valuable as the documents themselves. The part he couldn't solve was who does the maintenance work. The LLM solves that.

## Note

This document is intentionally kept abstract. It describes the idea, not a specific implementation. The exact directory structure, schema conventions, page formats, tools — all of these depend on your domain, your preferences, and your choice of LLM. Everything above is optional and modular — use what's useful, ignore what isn't. For example: your sources might be text-only, so you don't need image handling at all. Your wiki might be small enough that the index file suffices without a search engine. You might not care about slides and only want markdown pages. You might want an entirely different set of output formats. The right way to use this document is to share it with your LLM agent and collaborate to instantiate a version that fits your needs. This document's only job is to convey the pattern. Your LLM can handle the rest.
