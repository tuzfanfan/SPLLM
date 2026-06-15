# Example Archive Index

Use this file as the top-level index for reusable prompt archives in `exvideo-gen`.

## Structure Rule

Keep the reference layer split into:

- module files: reusable workflow logic and generalized templates
- example archive files: preserved originals, role-specific prompts, and raw working cases

When adding a new case:

1. Decide which workflow family it belongs to.
2. Add one entry to the relevant archive file.
3. If no archive exists yet, create a new `examples-*.md` file.
4. Add that archive file to the table below.
5. Only move generalized lessons back into the module file.

## Current Archive Files

| Archive File | Scope | Use For | Seed Status |
|---|---|---|---|
| `references/examples-identity-boards.md` | 角色身份板、白底设定板、艺术书式角色研究页 | 保存原始角色板 prompt、角色锁定案例、布局参考 | active |
| `references/examples-game-demos.md` | 游戏 Demo、UI 页面、HUD、战斗关键帧、玩法展示 | 保存原始游戏 Demo prompt、界面页案例、战斗画面案例 | active |
| `references/examples-cinematic-shot-prompts.md` | 电影镜头公式、双语镜头术语、镜头提示词实战 | 保存原始学习模板、镜头公式与编译案例 | active |

## Routing Guide

- If the case is about face lock, silhouette, costume readability, expressions, or white-background layouts, store it in `examples-identity-boards.md`.
- If the case is about menus, loadouts, HUD, gameplay framing, boss fights, or combat key art, store it in `examples-game-demos.md`.
- If the case is about shot size, composition, angle, movement, lighting, lens, focus, or cinematic prompt formulas, store it in `examples-cinematic-shot-prompts.md`.
- If a case spans several families, store the raw prompt in the primary archive and cross-reference the related archive in a note.

## Naming Pattern

Use this section pattern inside each archive:

```text
## Example NN: Title
### Status
### Original Prompt
### What To Preserve
### What To Replace Before Reuse
### Reuse Note
```

Keep the original wording when archival fidelity matters. Add concise notes around it rather than rewriting the source.

## Core Production Templates

| Template | Purpose |
|---|---|
| `references/script-writing-stage.md` | 脚本文案生成、故事内核重构、结构改写、脚本审批与分镜交接 |
| `references/cinematic-shot-language.md` | 脚本、视觉圣经、分镜、页面与提示词编译共用的标准镜头语言 |
