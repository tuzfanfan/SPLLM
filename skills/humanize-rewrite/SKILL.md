---
name: humanize-rewrite
description: Rewrite stiff, overly averaged, or AI-sounding text into more natural, human, readable language while preserving facts and intent. 当用户说“去 AI 味”“更像人写的”“改自然一点”“顺口一点”时使用。适合已有文本润色，不适合替代原创写作。
---

# Humanize Rewrite

## 用途

让已有文字更自然，但不把它改成另一篇文章。

## 重点动作

- 打破平均句长
- 删掉套话
- 保留作者原本的立场和锋利度
- 补一点自然过渡

## 改写前先锁定

- 哪些事实、数字、专有名词不能动
- 原文的语气是克制、锋利、亲切，还是正式
- 用户到底要“更自然”还是“更口语”

## 输出结构

- `主要问题`
- `改写版`
- `改写说明`

## 推荐工作流

1. 先指出 AI 味最重的 3 个问题
2. 再给完整改写版
3. 最后说明你动了哪些地方，没动哪些地方

如果用户有需要，可以同时给：
- `保守版`
- `更有人味版`

## 边界

- 不新增未确认事实
- 不把有个性的表达磨平
- 不把判断降级成安全废话
