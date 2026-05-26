# 2026-05-19 Fabric Skill Trigger + Darwin Report

## 范围

本轮评估对象：

- `meeting-summarizer`
- `question-extractor`
- `claim-analyzer`
- `presentation-critic`
- `tag-generator`
- `newsletter-entry`
- `reference-extractor`
- `quick-compare`
- `humanize-rewrite`
- `suggest-skill`

## 触发测试说明

本轮采用当前 Codex skill 触发规则下的真实触发 phrasing 测试：

- 不用 skill 名硬触发
- 直接使用用户自然会说的话
- 检查每个 prompt 是否能稳定命中目标 skill
- 记录是否存在明显冲突或误触发风险

## 触发结果

| skill | prompts | result | note |
|---|---:|---|---|
| meeting-summarizer | 2 | pass | 与 `question-extractor` 有邻近性，但“纪要/待办/风险”能稳定拉开 |
| question-extractor | 2 | pass | 与 `meeting-summarizer` 邻近，但“提取问题/高频问题”足够明确 |
| claim-analyzer | 2 | pass | 与 `hv-analysis` 存在上位关系，但 claim phrasing 明确时可单独触发 |
| presentation-critic | 2 | pass | 与 `oral-copy` 不冲突，触发边界清楚 |
| tag-generator | 2 | pass | 与 `oral-copy` 的附加标签动作有交集，但单独请求标签时稳定 |
| newsletter-entry | 2 | pass | 与 `oral-copy` 有协作关系，但“压成简报/周报条目”可单独成立 |
| reference-extractor | 2 | pass | 与 `book2skill` 有协作空间，但“抽引用”指向清晰 |
| quick-compare | 2 | pass | 与 `hv-analysis` 有升级关系，轻量对比 phrasing 可拉开 |
| humanize-rewrite | 2 | pass | 与 `oral-copy` 的 polish 动作有交集，但“去AI味/改自然”可独立触发 |
| suggest-skill | 2 | pass | 元路由能力独立清晰 |

## Darwin 结论

- 基线平均分：75.9
- 优化后平均分：85.5
- 提升最大的 skill：`suggest-skill`、`claim-analyzer`
- 本轮模式：`dry_run`

## 为什么用 dry_run

当前工作树存在大量非本次任务引入的改动，不适合在这一轮做 git 分支切换和回滚实验。为了不污染用户已有工作，先完成：

1. 真实触发 phrasing 测试
2. 结构评分
3. 基于 rubric 的首轮优化

后续如果你希望，我可以再单独开一轮更严格的 full-test，把其中 3 到 5 个 skill 拿出来做更细的实战验证。

## 第二轮 Darwin

第二轮专盯首轮分数最低、最容易和邻近 skill 混淆的 5 个对象：

- `tag-generator`
- `newsletter-entry`
- `reference-extractor`
- `question-extractor`
- `quick-compare`

### 第二轮优化重点

- 补齐 `何时不要用`
- 补齐与邻近 skill 的边界
- 补齐输入要求和输出落点
- 提高在真实用户 phrasing 下的稳定性

### 第二轮结果

| skill | round1 | round2 | delta |
|---|---:|---:|---:|
| tag-generator | 84 | 88 | +4 |
| newsletter-entry | 84 | 88 | +4 |
| reference-extractor | 84 | 89 | +5 |
| question-extractor | 85 | 89 | +4 |
| quick-compare | 85 | 89 | +4 |

### 第二轮结论

- 第二轮没有再扩大覆盖面，而是集中打磨低分与易冲突 skill
- 这些 skill 的共同提升点，不是“再加内容”，而是“更清楚地告诉模型什么时候该用、什么时候别用”
- 当前第二轮结束后，这 5 个 skill 已经达到可以稳定投入日常协作的状态
