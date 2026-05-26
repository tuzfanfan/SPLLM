# Fabric Routing Pack

## 模块 1：Prompt Refine

适用：
- 用户给了 prompt 草稿
- 用户说“帮我优化这条提示词”
- 任务本身清楚，但输出不稳定

优化检查：
- 目标是否清楚
- 输入是否说清
- 输出格式是否清楚
- 约束是否明确
- 有没有把“思考方式”讲清楚

输出：
- 原 prompt 的问题清单
- 改进版 prompt
- 如果合适，再给一个更短版本

## 模块 2：Suggest Skill

适用：
- 用户描述的是任务，不知道该调哪个 skill
- 一个任务可能同时触发研究、写作、整理、分发多个链条

输出：
- 推荐使用的 skill
- 推荐顺序
- 不推荐走的 skill 及原因

对 `E:\SPLLM\skills` 的优先映射：
- 研究型：`hv-analysis`
- 书籍蒸馏：`book2skill`
- 文案与长文：`oral-copy`
- 热点采集：`hotspot-radar`
- 近 30 天社会回声研究：`last30days`
- skill 评估进化：`darwin-skill`
