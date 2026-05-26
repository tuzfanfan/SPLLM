# Fabric Extraction Pack

这个参考包把 Fabric 中最适合 `book2skill` 的 extraction pattern，翻译成可直接插入现有流程的轻量模块。

## 何时加载

- 书很长，单靠摘要很容易丢信息
- 用户明确要“观点池”“方法论卡片”“引用网络”
- 你需要把一本书顺手沉淀进 wiki，而不仅仅是做 skill 蒸馏

## 模块 1：Wisdom Pass

目标：先做一轮高密度拆解，再进入 RIA-TV++。

固定输出：
- `SUMMARY`
- `IDEAS`
- `INSIGHTS`
- `FACTS`
- `REFERENCES`
- `ONE-SENTENCE TAKEAWAY`

要求：
- `IDEAS` 聚焦作者明确表达的可迁移观点
- `INSIGHTS` 聚焦从全文推出来、但不是表层复述的认识
- `FACTS` 只保留书中可定位的事实、案例、数据
- `REFERENCES` 记录书中引用过的书、论文、模型、人物、作品

## 模块 2：Ideas Pass

目标：快速形成候选 skill 单元池。

输出格式：
- 一条 idea 一行
- 每条 idea 都要能回答“这个观点能指导什么真实场景”

筛掉：
- 纯鸡汤句
- 脱离上下文就失效的例子
- 任何“聪明人都知道”的常识

## 模块 3：Insights Pass

目标：形成候选洞察池，供 Stage 1.5 三重验证使用。

输出要求：
- 最多 10 条
- 每条 1 到 3 句
- 必须体现因果、结构或反常识，不要写成目录标题

## 模块 4：References Pass

目标：补强知识网络。

输出要求：
- 列出书中出现的外部引用对象
- 能区分：人物 / 书籍 / 论文 / 案例 / 概念 / 组织
- 标记“可转成 wiki 页面候选”的对象

## 嵌入建议

- Stage 1 前：先跑 `Wisdom Pass`
- Stage 1 后：对候选结果补跑 `Ideas Pass` 和 `Insights Pass`
- Stage 1.5 后：把保留下来的引用对象汇总到 `References Pass`
