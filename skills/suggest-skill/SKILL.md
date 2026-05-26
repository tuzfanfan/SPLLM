---
name: suggest-skill
description: Recommend which local skill or workflow in E:\\SPLLM should handle a user task, and in what order. 当用户说“这件事该用哪个 skill”“帮我路由一下”“现在应该走哪套流程”“这个任务适合什么方法”时使用。适合做 skill 路由和任务编排。
---

# Suggest Skill

## 用途

把用户的任务翻译成最合适的 skill 路径，而不是直接盲做。

## 输出结构

1. `推荐 skill`
2. `推荐顺序`
3. `为什么这样走`
4. `不推荐的路径`

## 路由步骤

1. 先判断任务是研究、写作、整理、抓取，还是 skill 优化
2. 再判断是单 skill 能做，还是多 skill 串联
3. 如果是重复性动作，判断是否值得新增 skill
4. 输出主路径和备用路径

## 当前工作空间优先映射

- `hv-analysis`：深度研究、竞品分析、重型报告
- `book2skill`：把书蒸馏成方法论 skill
- `oral-copy`：口播、长文、公众号内容
- `prompt-flow`：需求澄清、提示词与任务入口判断
- `hotspot-radar`：热点抓取与原始资讯落地
- `last30days`：近 30 天的社媒与社区回声研究
- `darwin-skill`：评估和优化已有 skill
- `neat-freak`：收尾、清理、同步

## 规则

- 如果任务明显是重复性动作，优先建议 skill 化
- 如果任务已经被现有 skill 覆盖，不重复造轮子
- 如果需要多 skill 协作，给出自然顺序
- 如果多个 skill 都能做，优先推荐更贴任务本质的那个
- 如果任务超出当前技能边界，要明确说“现有 skill 不完全覆盖”

## 推荐输出模板

- `主路径`
- `备用路径`
- `为什么主路径更合适`
- `是否建议沉淀为新 skill`
