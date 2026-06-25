# Unified Document Schema

The social adapter normalizes platform-specific JSONL records into this model before rendering Markdown.

| Field | Type | Meaning |
|---|---|---|
| `document_type` | string | Currently `social` |
| `source_url` | string | Canonical or supplied source URL |
| `title` | string | Title, description fallback, or source ID |
| `author` | string | Creator display name |
| `platform` | string | Human-readable platform name |
| `published_at` | string | ISO timestamp or source-provided date |
| `collected_at` | string | UTC ISO collection time |
| `body` | string | Main text or description |
| `tags` | string[] | Source tags |
| `media` | string[] | Deduplicated image, video, or cover URLs |
| `engagement` | object | Non-zero interaction counters |
| `comments` | Comment[] | Representative comments |
| `source_backend` | string | Collection adapter name |
| `source_id` | string | Platform content ID |
| `source_keyword` | string | Collection keyword when present |

## Comment

| Field | Type | Meaning |
|---|---|---|
| `comment_id` | string | Platform comment ID |
| `author` | string | Commenter display name |
| `content` | string | Comment text |
| `published_at` | string | ISO timestamp or source value |
| `like_count` | integer | Likes |
| `reply_count` | integer | Replies |
| `parent_comment_id` | string | Parent ID when available |
| `ip_location` | string | Platform-provided location label |

## Selection Rules

1. Match content by URL, then by source ID contained in the URL.
2. If no record matches, use the first content record and preserve the supplied URL as fallback.
3. Keep only comments whose content ID is empty or matches the selected content.
4. Remove empty comments.
5. Sort comments by like count, then publication time, descending.
6. Apply `--max-comments` after sorting.

## Markdown Shape

1. YAML frontmatter
2. H1 title
3. Source information
4. Main body
5. Engagement table
6. Media resources
7. Representative comments
8. Collection notes

Empty optional sections are omitted. The source URL and collection backend are never omitted.
