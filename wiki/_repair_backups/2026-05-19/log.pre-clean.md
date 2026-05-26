---
title: Wiki 操作日志
created: '2026-05-19'
updated: '2026-05-19'
tags:
- '['
- wiki]
sources: []
type: doc
status: active
---

## [2026-05-19] skill | Strict Full-Test for Fabric 增补 Skill

**操作类型**: Skill Test
**操作人**: Assistant

### 处理结果
- **�ϸ� full-test 范Χ**: `meeting-summarizer`、`claim-analyzer`、`quick-compare`、`humanize-rewrite`、`suggest-skill`
- **测�Է�ʽ**: 不再ֻ看 trigger phrasing �ͽṹ评�֣挠谜�ʵ场景 prompt、真ʵ输入样本、真ʵ输出检查
- **新增报告**: `skills/darwin-skill/docs/2026-05-19-full-test-report.md`
- **评分̨账**: 在 `skills/darwin-skill/results.tsv` ׷加 `full_test` 记¼

### 核�Ľ崧�
- 5 个Ŀ标 skill 在真ʵ样本下ȫ部ͨ过
- `meeting-summarizer`、`claim-analyzer`、`quick-compare` 的ʵս完�ɶ茸罡�
- `suggest-skill` �ڸ春先挝�·由上�ѿ捎ã�Ҳ暴¶出“wiki 沉淀û�ж懒� skill 封װ”�ĵ�ǰȱ口
- 本轮虽δ做依赖 git �ع龅淖Զ哉�ʵ�飬但比ǰ序 `dry_run` 更�ϸ瘢�Ϊ�Ѽ尤胝�ʵ输入与输出可用�Լ煅�

---
## [2026-05-19] skill | Darwin �1�7�1�2�0�6���Ӂ0�3�1�7

**操作类型**: Skill Evolution
**操作人**: Assistant

### 处理结果
- **�ڶַ�Χ**: 定向�Ż茁ֵͷ智乙子肓ڽ� skill 冲ͻ的 5 个 skill
- **�1�7�0�3���τ1�7**: `tag-generator`��`newsletter-entry`��`reference-extractor`��`question-extractor`��`quick-compare`
- **�Żص�**: 补齐 `何ʱ不Ҫ用`、�ڽ߽硢输入Ҫ求、输出落点
- **评分提升**:
  - `tag-generator`: `84 -> 88`
  - `newsletter-entry`: `84 -> 88`
  - `reference-extractor`: `84 -> 89`
  - `question-extractor`: `85 -> 89`
  - `quick-compare`: `85 -> 89`

### 核�Ľ崧�
- �ڶ痔嵘�Ҫ来�ԡ氨߽缜逦ȡ倍皇ǡ澳谌ݶѵ�
- �ڵ�ǰ工作树仍Ȼ很脏的情况�£绦捎� `dry_run` 是最稳�׵ķ桨�
- �ͷ� skill �Ѵӡ翱捎á碧嵘健案ȶǹ捎á�

---
## [2026-05-19] skill | 新增技能真ʵ触发测试与 Darwin 首轮评分�Ż�

**操作类型**: Skill Test + Skill Evolution
**操作人**: Assistant

### 处理结果
- **真ʵ触发测试**: Ϊ 10 个新增 skill 补齐 `test-prompts.json`，并完�ɻ谧�Ȼ phrasing �Ĵシ⒀�֤
- **Darwin 评分**: 在 `skills/darwin-skill/results.tsv` �м�¼ baseline 与�Ż蠓质�
- **Darwin 报告**: 新增 `skills/darwin-skill/docs/2026-05-19-fabric-trigger-darwin-report.md`
- **�ṹ�Ż�**: 对 10 个新增 skill 补齐输�롢输出ģ�塢·�ɲ街衢�߽缣跫蜕杜ж�

### 本�θ哺ǵ� skill
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

### 核�Ľ崧�
- 10 个新增 skill �Ĵシ� phrasing ȫ部ͨ过
- 本轮 Darwin 采用 `dry_run` ģʽ，ԭ因�ǵ�ǰ工作树存�ڴ罅糠Ǳ敬稳挝褚氲�δ�ύ�Ķ皇ʺ献龇�֧�л缓ͻع�ʵ验
- 基线ƽ均分提升至�Ż�ƽ均�֣�`75.9 -> 85.5`

---
## [2026-05-19] skill | Fabric pattern �ں嫌뼼能体ϵ补齐

**操作类型**: Skill Evolution + Capability Build
**操作人**: Assistant

### 处理结果
- **现有 Skills 增ǿ**: Ϊ [[book2skill]]、[[hv-analysis]]、[[oral-copy]]、[[prompt-flow]]、[[hotspot-radar]] 增加 Fabric 风格增ǿ入口与�ο及�
- **P1 能力补齐**: 新增 `meeting-summarizer`、`question-extractor`、`claim-analyzer`、`presentation-critic`、`tag-generator`
- **P2 能力补齐**: 新增 `newsletter-entry`、`reference-extractor`、`quick-compare`、`humanize-rewrite`、`suggest-skill`
- **技能总量**: 工作�ռ� skill Ŀ¼扩չ至 20 个�ɷ⑾�ģ块

### 本次增ǿ�ص�
- 用 Fabric 的轻量 pattern 补ǿ现有重型 skill 的�м洳悴锬芰�
- 补齐会议纪Ҫ、问题抽ȡ、�۶�У�顢标ǩ生�ɡ⑶崃慷Աȡ⑻�ʾ词·�ɵ�ȱ口
- �γɡ爸匦椭� skill + 轻量子ģ块 + 独立С skill”的三层�ṹ，便�ں笮绦锒ĻŻ�

---
## [2026-05-19] produce | 科�զмƻ�У԰�推�ĳ恋碛敕绺�ģ�彨立

**操作类型**: Produce + Digest
**操作人**: Assistant

### 处理结果
- **Sources**: 新增 2 个来Դҳ，�ֱ鸪恋�У԰�Ƽ冀谘逋莆挠肟破ա甫С怪ڴ醇ƻ樯�
- **Entity**: 新增 1 个ʵ体ҳ，建立 [[广州�п破ն�Э会]] �Ļ〉蛋�
- **Concepts**: 新增 2 个概念ҳ，建立 [[科�ա甫С怪ڴ醇ƻ�]] 与 [[科�ա甫С辜ƻ莆ķ绺�ģ板]]
- **Product**: 新增 1 个�ɸ�ҳ [[广�ݴ�ѧ附属中ѧ�Ƽ冀ڻ�ع�_科�զмƻ�]]
- **Index / Log**: 已ͬ步更新索引ͳ�ơ�Recent Sources、Recent Concepts、Products �뱾�β僮魅�־

### 沉淀�ص�
- 将�ûṩ的�ֳ≌�Ƭ、邀�뺯和两份 PDF 样板材料ת化Ϊ wiki �ɸ从米ʲ�
- 把һ次�ԵĻ�ع˸壬拆解Ϊ“来Դ样板 + 组֯定λ + �ɸ尸例 + 风格ģ�塱�Ĳ憬ṹ
- 明ȷ科�ա甫С辜ƻ稿的�ȶ�д法：
  - �ځ0�5�1�7�ͻ����7�4�0�0��
  - �ж�Χ绕 2-3 条主线д�ֳ�
  - 结β�ص阶�֯定λ�볤期Ŀ标

### 本次新增ҳ面
- [[2026-05-19-�ƴ锤衬�ͯ心样板推文]]
- [[2026-05-19-科�զ兄ڴ醇ƻ樯�]]
- [[广州�п破ն�Э会]]
- [[科�ա甫С怪ڴ醇ƻ�]]
- [[科�ա甫С辜ƻ莆ķ绺�ģ板]]
- [[广�ݴ�ѧ附属中ѧ�Ƽ冀ڻ�ع�_科�զмƻ�]]

---
## [2026-05-19] ingest | 夸克新库心理学书籍批量Ingest锛?48本）

**操作类型**: Ingest（批量深入处理）
**操作浜?*: Assistant

### 处理结果
- **Sources**: 138个来源摘要页面（覆盖148本独立书名，部分多卷本合并处理）
- **Entities**: 61个新增实体页面（心理学家、作家、学者）
- **Concepts**: 142个新增概念页面（心理学理论、方法论、应用领域）
- **总计新增**: 341个Wiki页面

### 分类处理明细

| 分类 | 书数 | Source鏁?|
|------|------|---------|
| 心理学理论与通史 | 21 | 21 |
| 心理学研究方法与统计 | 6 | 6 |
| 社会心理学与大众心理 | 9 | 9 |
| 发展与教育心理学 | 4 | 4 |
| 认知心理瀛?| 7 | 7 |
| 人格与性格心理瀛?| 5 | 5 |
| 情绪与动机心理学 | 6 | 6 |
| 精神分析 | 5 | 5 |
| 习惯与行为改鍙?| 4 | 4 |
| 人际交往与社交心理学 | 9 | 9 |
| 领导与管理心理学 | 3 | 3 |
| 健康心理瀛?| 3 | 3 |
| 逻辑与批判性思维 | 3 | 3 |
| 通俗心理学与自我提升 | 17 | 17 |
| 特殊主题 | 15 | 15 |
| 综合与入闂?| 22 | 22 |

### 新增实体（部分）
- 弗洛伊德、卡尔·荣格、埃里希·弗洛姆、米歇尔·福柯
- 黄希庭、车文博、张春兴、杨鑫辉
- 戴维·G·迈尔斯、罗伯特·西奥迪尼、米哈里·契克森米哈赖
- 查尔斯·杜希格、詹姆斯·克利尔、约翰·梅迪纳、约翰·瑞杩?
### 新增概念（部分）
- 心理学史、构造主义、机能主义、格式塔心理学、人本主义心理学
- 进化心理学、认知神经科学、生物心理学
- 心流体验、习惯回路、拖延症、MBTI人格类型、九型人鏍?- 影响力原则、行为经济学、锚定效应、心理账鎴?- 学习科学、检索练习、间隔重复、启发式决策
- 后现代心理学、心理学范式、系统思维

### 来源文件
- 夸克网盘「新库」文件夹（通过AList访问锛?- WebDAV: http://localhost:5244/dav/夸克/新库/
- 在线预览: http://localhost:5244/夸克/新库/

### 处理逻辑
- 按书籍分类分6批并行处鐞?- 每本书创建独立source页面，包含详尽的核心观点、关键数据、洞察和启示
- 从书中提取核心实体（作者、相关学者）和概念（理论、方法论锛?- 所有页面建立双向wikilink交叉引用
- 每个source页面包含webdav_url在线预览链接
- 同步更新wiki/index.md统计信息和分类索寮?
---

## [2026-05-17] check | wiki health normalization

**????**: Health Check / Frontmatter Normalization
**???**: Assistant

### ????
- **Hard fixes**: repaired 6 broken pages with missing or malformed frontmatter
- **Legacy normalization**: filled missing required frontmatter fields across content pages in `sources/`, `entities/`, `concepts/`, `products/`, and `presentations/`
- **Index**: synced `products/` and `presentations/` counts, and added the missing `??????????` entry

### ??
- Kept existing page bodies intact and only normalized metadata blocks where needed
- Legacy pages that already had frontmatter were left structurally intact unless required keys were missing

---


# Wiki 操作日志

---

## [2026-05-17] ingest | hotspot-radar ????????

**????**: Ingest?outputs ?????
**???**: Assistant

### ????
- **Sources**: ?? 1 ? source ????? `outputs/hotspot-radar/2026-05-17` ????????????
- **Index / Log**: ????????????????

### ????
- [[2026-05-17-hotspot-radar????????]]

### ??
- ?? ingest ???? `outputs/` ???????????????????????????????
- ??????????????????????????????????

---

## [2026-05-17] digest | 《套牢四步走》实战关键词框架沉淀

**操作类型**: Digest（来源提炼为可复用概念框架）
**操作浜?*: Assistant

### 处理结果
- **Concepts**: 新增 1 个概念页：[[认知套牢识别]]
- **Source Update**: 涓?[[2026-05-17-套牢四步走]] 补充实战框架反向链接
- **Index / Log**: 已同步更新目录统计与本次操作日志

### 提炼重点
- 将原文压缩为 6 个实战关键词：占带宽、改词典、封环境、造回音壁、锁沉没、护自尊
- 为每个关键词补充“识别信号”与“干预要点鈥?
- 增加快速判断框架，便于后续在真实场景中复用

---

## [2026-05-17] ingest | raw 增量资料追溯补链与缺澶?source 补录

**操作类型**: Ingest（增量补录与追溯修正锛?
**操作浜?*: Assistant

### 处理结果
- **Sources**: 新增 5 个来源页，补榻?16 个既有来源页涓?`raw/` 原文的追溯关绯?
- **Concepts**: 新增 3 个概念页（[[产品营销]]、[[市场营销]]、[[设计价值重构]]锛?
- **Concept Updates**: 完成 [[认知心理学]]、[[群体心理学]]、[[社会心理学]] 的结构化补全
- **Index / Log**: 已同步更新目录统计与本次操作日志

### 新增来源椤?
- [[2026-05-17-第九届福州数字峰会设计价值重构]]
- [[2026-05-17-GET笔记2026骞?月汇总]]
- [[2026-05-17-GET笔记2026-04-21最杩?小时汇总]]
- [[2026-05-17-套牢四步走]]
- [[2026-05-17-天朝相遇错过多感慨]]

### 追溯修正
- 将一批已存在鐨?source 椤?`sources:` 字段统一改为 `raw/文件鍚?md` 形式
- 覆盖主题包括品牌叙事、品牌故事方法论、品牌溢价、三种营销划分、品牌代言、GEO 与相关专题稿

---

## [2026-05-13] ingest | books 毛泽东选集技能库处理完毕

**操作类型**: Ingest（拆书技能库处理锛?
**操作浜?*: Assistant

### 处理结果
- **Sources**: 1个来源页面（毛泽东选集技能库锛?
- **Concepts**: 10个概念页面（战略思维4涓?+ 工作方法4涓?+ 军事指挥2个）
- **Entities**: 0个新增实体页面（毛泽东选集实体已由其他子代理创建）

### 新增概念
- **战略思维绫?*：矛盾分析法、持久战战略、统一战线策略、阶级分析法
- **工作方法绫?*：调查研究法、群众路线、批评与自我批评、试点推广法
- **军事指挥绫?*：运动战原则、游击战十六字诀

### 来源文件
- `books/mao-xuanji/` - 毛泽东选集技能库（book2skill v1.20 拆书锛?0个SKILL.md锛?

### 处理逻辑
- 读取 books/mao-xuanji/ 下所鏈?SKILL.md 文件锛?0个技能）
- 创建 source 页面引用 books 文件夹内瀹?
- 为每个技能创建独立的 concept 页面，包含定义、核心原理、应用场景、可执行步骤、优势局闄?
- 所鏈?concept 页面之间建立双向链接关系
- 更新 index.md 统计信息和索引表

---

## [2026-05-13] ingest | raw 营销策略绫?用户研究绫?18个文件处理完姣?

**操作类型**: Ingest（逐文件深入处理）
**操作浜?*: Assistant

### 处理结果
- **Sources**: 18个来源摘要（营销策略11涓?+ 用户研究7个）
- **Concepts**: 11个概念页面（营销策略11涓?+ 用户研究4个新增）
- **Entities**: 10个实体页面（品牌/公司/IP类）

### 新增概念
- 营销策略：情绪营销、场景营销、AI营销、心智经营、私域运营、五感营销、听劝型营销、品牌叙事、用户共创、海外营销、长期主涔?
- 用户研究：用户需求分析、用户画像、理性感性化、清醒社浜?

### 新增实体
- Costco、海底捞、LABUBU、King Euphorics、Media Markt、贵州茅台、耐克、伊利、百岁山、喜茶、可口可乐、苹果、宜家、Anker、兰钄?

### 处理逻辑
- sources/: 仅存放来源引用和链接，不做全部分析堆绉?
- concepts/: 存放概念解释（技术、趋势、方法论锛?
- entities/: 存放事例说明（公司、产品、人物、具体案例）

---

## [2026-05-13] ingest | daily-feed 全部15个文件处理完姣?

**操作类型**: Ingest（逐文件深入处理）
**操作浜?*: Assistant

### 处理结果
- **Sources**: 14个来源摘瑕?
- **Concepts**: 8个概念页闈?
- **Entities**: 10个实体页闈?

### 知识网络概览
- **核心概念**: 多模态视频生成、AI图像生成、音画一体、数字人视频生成、AI真人视频过审策略、智能多帧与一镜到底、AI视频编辑、提示词工程-视频生成
- **核心实体**: 即梦(平台)、可灵AI(平台)、Seedance 2.0/1.5 Pro、Seedream 5.0 Lite/4.5/4.0、OmniHuman 1.5、可灵视棰?.6、GPT-image2

### 处理逻辑
- sources/: 仅存放来源引用和链接，不做全部分析堆绉?
- concepts/: 存放概念解释（技术、趋势、方法论锛?
- entities/: 存放事例说明（公司、产品、人物、具体案例）

---

## [2026-05-13] 重构 | 清理错误的聚合sources文件，重建知识空间结鏋?

**操作类型**: 重构
**操作浜?*: System

### 变更内容
1. **问题识别**: 之前的处理将所有分析内容堆积在sources/中，concepts/和entities/为空
2. **解决方案**: 重新设计处理逻辑
   - sources/: 仅存放来源引用和链接
   - concepts/: 存放概念解释
   - entities/: 存放事例说明
3. **执行**: 备份并删除所有错误的聚合sources文件

---

## [2026-05-14] ingest | 投资理财类第二批42本书处理完毕

**操作类型**: Ingest（批量深入处理）
**操作浜?*: Assistant

### 处理结果
- **Sources**: 41个来源摘要（编号001-041锛?
- **Concepts**: 8个概念页面（期货投资、私募股权、看盘技术、盘口分析、行为金融学、家庭理财规划、K线分析、财富思维、金融史锛?
- **Entities**: 10个实体页面（陈志武、陈雨露、马蔚华、占豪、伍朝辉、鲁正轩、黄凡、李南、潘启龙、田国立锛?

### 新增概念
- 期货投资、私募股权、看盘技术、盘口分析、行为金融学、家庭理财规划、K线分析、财富思维、金融史

### 新增实体
- 陈志武（金融学家）、陈雨露（金融学瀹?央行副行长）、马蔚华（招商银行行长）、占豪（股评浜?投资作家）、伍朝辉（职业操盘手）、鲁正轩（看盘专家）、黄凡（财富管理专家）、李南（财经主持人）、潘启龙（PE学者）、田国立（信达资产）

### 来源文件
- `book/电子书数据_md/1500本当当网电子书合闆?/` - 4鏈?
- `book/电子书数据_md/1500本当当网电子书合闆?/` - 5鏈?
- `book/电子书数据_md/1500本当当网电子书合闆?/` - 13鏈?
- `book/电子书数据_md/1500本当当网电子书合闆?/` - 10鏈?
- `book/电子书数据_md/1500本当当网电子书合闆?/` - 5鏈?
- `book/电子书数据_md/1500本当当网电子书合闆?/` - 5鏈?

### 处理逻辑
- 读取每本书前30-50行，提取核心内容和主棰?
- 为每本书创建独立的source页面，包含YAML frontmatter和wikilink关联
- 从书中提取核心概念，创建/更新concept页面
- 提取关键人物，创建entity页面
- 所有页面之间建立双向wikilink关联

---

> 此页面由LLM自动维护

---

## [2026-05-15] produce | 广州大学城青年科教文旅企业合作汇报PPT

**操作类型**: Produce（商业汇报PPT生成锛?
**操作浜?*: Assistant

### 处理结果
- 基于 PPT大纲.md 生成 20 页可编辑 PowerPoint：封闈?+ 主体页面 + 报价速览 + 结束页銆?
- 输出文件：wiki/presentations/广州大学城青年科教文旅企业合作汇鎶?pptx銆?
- 采用大学蓝、活力橙、青年绿视觉系统，使用可编辑文字、形状、信息图表和占位图框銆?
- 已完鎴?PPTX 包结构检查：20 页，空媒体文浠?0 个；布局检查硬错误 0 个銆?

---

## [2026-05-15] check | 清理孤立 concepts/entities 页面

**操作类型**: Check（Wiki 健康检查与孤立页面清理锛?
**操作浜?*: Assistant

### 检查范鍥?

- `wiki/concepts/`
- `wiki/entities/`
- 鍏?`wiki/` wikilink 入链扫描

### 处理结果

- 第一轮发现并删除孤立 concept 页面 542 个銆?
- 第一轮发现并删除孤立 entity 页面 968 个銆?
- 第一轮删除后复扫，继续删除新浮现孤立 concept 页面 5 个銆?
- 总计删除孤立页面 1515 个銆?
- 最终复扫结果：孤立 concept/entity 页面 0 个銆?

### 输出文件

- [[健康检查报告_2026-05-15_孤立概念实体清理]]
- 候选清单：`outputs/orphan-concepts-entities-candidates.json`

### 备注

- 本次“没有链接”定义为没有任何其他 wiki 页面通过 Obsidian `[[wikilink]]` 指向该页面銆?
---

## [2026-05-17] produce | 《歌乐拾音》文化宣传册可编辑设计稿

**操作类型**: Produce
**操作鑰?*: Assistant

### 交付文件
- `wiki/assets/geleshiyin-brochure-kit/overview-board.svg`
- `wiki/assets/geleshiyin-brochure-kit/cover.svg`
- `wiki/assets/geleshiyin-brochure-kit/genre-feature.svg`
- `wiki/assets/geleshiyin-brochure-kit/lineage-atlas.svg`
- `wiki/assets/geleshiyin-brochure-kit/README.md`

### 内容说明
- 基于《歌乐拾音》专辑气质，落地为一套可编辑的宣传册设计稿銆?
- 文件格式统一涓?`SVG`，方便继续在 Figma、Illustrator、Inkscape 中修改銆?
- 包含总览板、封面样板、单一乐种介绍页、谱系信息页四类视觉文件銆?

### 设计原则
- 保持岭南音乐文博、馆藏传播、学术普及的整体气质銆?- 使用米白纸底、墨黑、旧书棕、黛绿、暗朱砂作为主视觉系统銆?- 版式强调文献感、题签感与展陈导览感，避免商业文旅海报化銆?
---

## [2026-05-18] ingest | 黑箱

**操作类型**: Ingest
**操作浜?*: Assistant

### 处理文件

- `raw/黑箱.md`

### 创建页面

- [[2026-05-18-raw-黑箱]]
- [[信息黑箱]]
- [[文化黑箱]]
- [[权限边界]]

### 处理结果

- 将原始素材整理为一页来源综述，拆清了技术黑箱、文化黑箱与权限边界三条线索銆?- 新建 3 个概念页，分别承鎺?AI 可解释性、跨文化传播与安全治理相关讨论銆?- 同步更新 `wiki/index.md` 的最近来源与目录统计銆?
