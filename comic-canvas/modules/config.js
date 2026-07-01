/* ============================================================
   config —— 节点 schema 定义、配色、图标
============================================================ */

export const TYPE_META = {
  char:      { label:'角色',  icon:'🎭', cls:'node-char',   icCls:'ic-char'   },
  shot:      { label:'分镜',  icon:'🎬', cls:'node-shot',   icCls:'ic-shot'   },
  line:      { label:'台词',  icon:'💬', cls:'node-line',   icCls:'ic-line'   },
  container: { label:'容器',  icon:'📁', cls:'node-container', icCls:'ic-container' },
  page:      { label:'页面帧', icon:'🖼️', cls:'node-page', icCls:'ic-page' },
};

export const SCHEMA = {
  char: [
    { key:'name',     label:'姓名',   type:'text',     ph:'角色名称', required:true },
    { key:'role',     label:'身份/叙事职能',   type:'text',     ph:'如：主角 / 反派 / 证人 / 情绪锚点' },
    { key:'age_read', label:'年龄观感', type:'text', ph:'如：20岁出头 / 中年 / 少年感' },
    { key:'body_type', label:'体型与身高', type:'text', ph:'身高、体态、比例、力量感' },
    { key:'face_hair', label:'脸型与发型', type:'textarea', ph:'脸型、发色、发型、五官识别点' },
    { key:'eyes_marks', label:'眼睛/标志特征', type:'textarea', ph:'眼神、疤痕、痣、纹身、特殊标记' },
    { key:'silhouette', label:'轮廓锁', type:'textarea', ph:'不用颜色也能认出的轮廓特征' },
    { key:'outfit', label:'主服装', type:'textarea', ph:'服装层次、材质、鞋、配饰、装备挂载' },
    { key:'palette', label:'角色配色', type:'text', ph:'主色 / 辅色 / 禁用色' },
    { key:'signature_prop', label:'标志道具', type:'text', ph:'武器、包、饰品、常拿物' },
    { key:'persona',  label:'性格/内在驱动',   type:'textarea', ph:'性格特点、欲望、弱点、人物弧光' },
    { key:'performance', label:'表演方式', type:'textarea', ph:'默认姿态、动作质感、表情范围、说话方式' },
    { key:'identity_lock', label:'身份锁', type:'textarea', ph:'5-10条必须保持不变的生成特征' },
    { key:'allowed_variants', label:'允许变体', type:'textarea', ph:'可换服装、发型、损伤、情绪或年龄阶段' },
    { key:'lock_state', label:'锁定状态', type:'select', options:['OPEN','FLEXIBLE','LOCKED'] },
    { key:'note',     label:'设定备注', type:'textarea', ph:'背景故事、引用来源、禁用改动等' },
  ],
  shot: [
    { key:'no',       label:'镜号',   type:'text',     ph:'如：S01', required:true },
    { key:'scene_id', label:'所属场景ID', type:'text', ph:'如：SCENE-01 / 继承容器' },
    { key:'purpose', label:'镜头目的', type:'select', options:['','交代空间','推进信息','情绪转折','关系压力','动作展示','悬念/揭示','视觉奇观','转场衔接'] },
    { key:'narrative_intent', label:'叙事意图', type:'textarea', ph:'这个镜头为什么存在？观众应获得什么信息或情绪？' },
    { key:'composition', label:'构图', type:'select', options:['AUTO','INHERIT','centered','symmetrical','rule-of-thirds'] },
    { key:'size',     label:'景别',   type:'select',   options:['AUTO','INHERIT','close-up','medium-close-up','medium-shot','full-shot','long-shot','extreme-long-shot','cowboy-shot','two-shot','group-shot'] },
    { key:'camera_angle', label:'机位角度', type:'select', options:['AUTO','INHERIT','eye-level','high-angle','low-angle','side-profile','overhead','back-view','birds-eye','worms-eye','dutch-angle'] },
    { key:'camera_view', label:'视角/覆盖', type:'select', options:['','single','two-shot','over-shoulder','inner-reverse','outer-reverse','insert','establishing','reaction'] },
    { key:'move',     label:'镜头运动',   type:'select',   options:['AUTO','INHERIT','static','slow-push-in','pull-out','tracking','orbit-360','dolly-zoom','pan','tilt','crane','handheld'] },
    { key:'lens', label:'镜头焦段', type:'select', options:['AUTO','INHERIT','macro','24mm-wide','35mm','50mm-standard','85mm-portrait','telephoto'] },
    { key:'depth_of_field', label:'景深', type:'select', options:['AUTO','INHERIT','shallow-depth-of-field','deep-focus','bokeh','soft-focus','sharp-focus'] },
    { key:'focus_treatment', label:'焦点处理', type:'text', ph:'如：先虚后实 / 焦点从手转到眼神 / 保持深焦' },
    { key:'lighting_direction', label:'光线方向', type:'select', options:['AUTO','INHERIT','front-45-key','side-key','side-back-key','backlight','rim-light','top-light','practical-source'] },
    { key:'lighting_quality', label:'光质', type:'select', options:['AUTO','INHERIT','soft-light','hard-light','rembrandt-light','chiaroscuro','natural-light','neon-lighting','tyndall-light'] },
    { key:'color_atmosphere', label:'色彩氛围', type:'text', ph:'如：冷绿色监控光 / 暖钨丝灯 / 低饱和雨夜' },
    { key:'practical_light', label:'实用光动机', type:'text', ph:'灯、窗、屏幕、月光、火光等画内光源逻辑' },
    { key:'dur',      label:'时长(秒)', type:'text',   ph:'如：3' },
    { key:'desc',     label:'画面描述', type:'textarea', ph:'本镜头呈现的内容', required:true },
    { key:'subject_blocking', label:'人物/主体调度', type:'textarea', ph:'站位、走位、朝向、与道具或空间关系' },
    { key:'action_sequence', label:'动作节拍', type:'textarea', ph:'0.0-1.5s / 1.5-3.0s 分段描述，复杂就拆镜头' },
    { key:'start_state', label:'起始状态', type:'textarea', ph:'镜头开始时人物、道具、空间、情绪的位置状态' },
    { key:'end_state', label:'结束状态', type:'textarea', ph:'镜头结束时必须接到下一镜的状态' },
    { key:'fg_mg_bg', label:'前中后景', type:'textarea', ph:'前景 / 中景 / 背景分别承担什么信息' },
    { key:'continuity', label:'连续性依赖', type:'textarea', ph:'视线、屏幕方向、道具位置、服装伤痕、情绪、时间天气' },
    { key:'dialogue_or_text', label:'台词/字幕', type:'textarea', ph:'镜头内出现或对应的台词、旁白、屏幕文字' },
    { key:'sound_music', label:'声音/BGM', type:'textarea', ph:'环境声、音效、音乐进入/退出点' },
    { key:'transition_in', label:'入场转场', type:'text', ph:'cut / fade / match cut / whip pan 等' },
    { key:'transition_out', label:'出场转场', type:'text', ph:'切到哪个状态或页面帧' },
    { key:'required_pages', label:'所需页面帧', type:'text', ph:'如：start-frame, end-frame, keyframe' },
    { key:'rationale', label:'镜头设计理由', type:'textarea', ph:'为什么用这个景别、角度、运动、灯光和焦段？' },
    { key:'visual_title', label:'视觉基调名', type:'text', ph:'如：雨夜霓虹现实主义 / 温暖写实 / 压抑悬疑' },
    { key:'world_era', label:'世界与时代', type:'textarea', ph:'时代、地域、科技水平、社会质感' },
    { key:'medium_rendering', label:'媒介/渲染', type:'text', ph:'live action / anime / 3D / ink / cinematic realism' },
    { key:'art_direction', label:'美术方向', type:'textarea', ph:'建筑、服装、材质、画面密度、参考风格' },
    { key:'palette', label:'调色板', type:'textarea', ph:'主色、辅助色、禁用色、情绪色' },
    { key:'lighting_logic', label:'灯光逻辑', type:'textarea', ph:'主光、补光、轮廓光、实用光动机' },
    { key:'camera_language', label:'镜头语言默认值', type:'textarea', ph:'常用景别、构图、机位、焦段、运动' },
    { key:'motion_language', label:'运动语言', type:'textarea', ph:'节奏、镜头运动、人物动作质感' },
    { key:'edit_rhythm', label:'剪辑节奏', type:'text', ph:'慢推 / 快切 / 长镜头 / 三秒一节拍' },
    { key:'typography_ui', label:'字幕/UI语言', type:'textarea', ph:'字体、屏幕文字、HUD、图形语言' },
    { key:'avoid', label:'禁用规则', type:'textarea', ph:'禁止的风格、镜头、色彩、构图或生成倾向' },
    { key:'visual_lock_state', label:'视觉锁定状态', type:'select', options:['OPEN','FLEXIBLE','LOCKED'] },
    { key:'status', label:'完成状态', type:'select', options:['OPEN','AUTO','DRAFT','LOCKED','NEEDS_PAGE','PROMPT_READY'] },
    { key:'note',     label:'备注',   type:'textarea', ph:'特效、生成限制、平台提示词注意事项' },
  ],
  line: [
    { key:'content',  label:'内容',   type:'textarea', ph:'台词 / 旁白文本', required:true },
    { key:'mood',     label:'情绪',   type:'select',   options:['','平静','激动','悲伤','愤怒','喜悦','紧张','嘲讽'] },
    { key:'dur',      label:'时长(秒)', type:'text',   ph:'如：2' },
    { key:'subtext', label:'潜台词', type:'textarea', ph:'角色真正想表达但没有说出口的东西' },
  ],
  container: [
    { key:'title',    label:'章节标题', type:'text',   ph:'如：第一幕·初遇', required:true },
    { key:'content_type', label:'容器类型', type:'select', options:['chapter','scene','prop','asset','location','mixed'] },
    { key:'project_id', label:'项目ID', type:'text', ph:'如：PROJECT-01 / ACT-01' },
    { key:'workflow_module', label:'工作流模块', type:'select', options:['AUTO','narrative-film','social-short-drama','dialogue-coverage','scene-consistency-control','game-demo','product-video','music-video','explainer'] },
    { key:'intended_use', label:'用途', type:'text', ph:'如：短剧分镜 / AI视频生成 / 客户提案' },
    { key:'target_duration', label:'目标时长', type:'text', ph:'如：30s / 12 shots / 3 scenes' },
    { key:'aspect_ratio', label:'画幅', type:'select', options:['AUTO','16:9','9:16','1:1','4:5','21:9'] },
    { key:'desc', label:'场景/资产描述', type:'textarea', ph:'外观、细节、用途、空间主题' },
    { key:'mood', label:'氛围', type:'text', ph:'如：温馨、压抑、神秘、潮湿、热闹' },
    { key:'location_id', label:'地点/资产ID', type:'text', ph:'如：LOC-01 / PROP-01 / ASSET-01' },
    { key:'asset_type', label:'资产类型', type:'select', options:['','prop','costume','location','vehicle','creature','ui','reference-bundle','space-model','angle-library'] },
    { key:'time_weather', label:'时间与天气', type:'text', ph:'夜雨 / 清晨薄雾 / 正午硬光' },
    { key:'narrative_function', label:'场景叙事功能', type:'textarea', ph:'这个容器承载什么冲突、信息或情绪' },
    { key:'function', label:'资产功能', type:'textarea', ph:'它在剧情、动作或视觉识别中承担什么作用' },
    { key:'placement_logic', label:'放置/挂载逻辑', type:'textarea', ph:'在谁身上、空间哪里、如何移动或被使用' },
    { key:'material_palette', label:'材质与配色', type:'textarea', ph:'金属、布料、玻璃、主色、反光程度' },
    { key:'visual_default', label:'视觉默认值', type:'textarea', ph:'本章节继承的风格、镜头、灯光、运动规则' },
    { key:'entering_state', label:'进入状态', type:'textarea', ph:'角色进入时空间、情绪、道具状态' },
    { key:'exiting_state', label:'离开状态', type:'textarea', ph:'场景结束时留下什么变化' },
    { key:'topology', label:'空间拓扑', type:'textarea', ph:'门窗、桌椅、道路、入口出口、运动路径' },
    { key:'landmarks', label:'空间锚点', type:'textarea', ph:'必须保持的家具、窗口、招牌、道具及相对位置' },
    { key:'practical_lights', label:'实用光源', type:'textarea', ph:'灯、窗、屏幕、火光、霓虹等光源位置和颜色' },
    { key:'continuity_priorities', label:'连续性优先级', type:'textarea', ph:'角色、场景、道具、时间、屏幕方向等重点' },
    { key:'continuity_lock', label:'一致性锁', type:'textarea', ph:'必须保持不变的空间、道具、位置、颜色和状态' },
    { key:'allowed_variants', label:'允许变体', type:'textarea', ph:'可替换、可损坏、可隐藏或可改色范围' },
    { key:'source_refs', label:'参考来源', type:'textarea', ph:'图片、截图、文字来源、禁止复制点' },
    { key:'prohibited_drift', label:'禁止漂移', type:'textarea', ph:'不要改门窗位置 / 不要换墙面 / 不要改变主光方向' },
    { key:'locked_fields', label:'锁定字段', type:'textarea', ph:'下游镜头必须保留的项目级决定' },
    { key:'note',     label:'备注',     type:'textarea', ph:'章节说明、剧情概要' },
  ],
  page: [
    { key:'page_id', label:'页面ID', type:'text', ph:'如：PAGE-01-03-A', required:true },
    { key:'page_type', label:'页面类型', type:'select', options:['storyboard-frame','keyframe','start-frame','end-frame','character-card','environment-card','asset-card','transition-frame','ui-screen','continuity-shot-sheet'] },
    { key:'linked_scene', label:'关联场景', type:'text', ph:'SCENE-01' },
    { key:'linked_shot', label:'关联镜头', type:'text', ph:'SHOT-01-03' },
    { key:'purpose', label:'页面目的', type:'textarea', ph:'锁空间、锁角色、生成关键帧、补反打等' },
    { key:'aspect_ratio', label:'画幅', type:'select', options:['INHERIT','16:9','9:16','1:1','4:5','21:9'] },
    { key:'inherited_refs', label:'继承引用', type:'textarea', ph:'角色、容器、镜头语言、页面约束' },
    { key:'local_overrides', label:'局部覆盖', type:'textarea', ph:'本页特有服装、表情、损伤、灯光、构图' },
    { key:'composition', label:'画面构成', type:'textarea', ph:'构图、机位、主体位置、前中后景、留白' },
    { key:'peak_moment', label:'峰值动作/关键瞬间', type:'textarea', ph:'这一帧最该被看见的动作或情绪' },
    { key:'continuity_must_match', label:'必须匹配', type:'textarea', ph:'必须与前后页一致的身份、空间、道具、光线' },
    { key:'generation_platform', label:'生成平台', type:'text', ph:'如：可灵 / 即梦 / Runway / Midjourney / UNKNOWN' },
    { key:'negative_constraints', label:'负面约束', type:'textarea', ph:'不要改变、不要出现、不要漂移的内容' },
    { key:'approval_status', label:'审批状态', type:'select', options:['draft','review','approved','needs-revision','prompt-ready'] },
  ],
};

// 支持多项目：从 URL ?project=xxx 读取项目 id，动态隔离 localStorage
export const PROJECT_REG_KEY = 'comic-canvas:projects';

export function getProjectId(){
  const m = new URLSearchParams(location.search);
  return m.get('project') || null;
}

export const LS_KEY = (() => {
  const pid = getProjectId();
  return pid ? ('comic-canvas:proj:' + pid) : 'comic-canvas:v1';
})();

// 各类节点的"标题字段"和"摘要字段"，用于卡片显示
export const TITLE_FIELD = { char:'name', shot:'no', line:'content', container:'title', page:'page_id' };
export const DESC_FIELD  = { char:'persona', shot:'purpose', line:'subtext', container:'note', page:'purpose' };

export const FIELD_SECTIONS = {
  char: {
    name:'身份基础', persona:'表演与性格', identity_lock:'生成锁定', note:'备注'
  },
  shot: {
    no:'基础', narrative_intent:'叙事功能', composition:'镜头语言', dur:'动作与时间',
    fg_mg_bg:'画面层次', dialogue_or_text:'声音与转场', required_pages:'生成状态',
    visual_title:'视觉基调', palette:'视觉基调', typography_ui:'视觉基调', avoid:'视觉基调'
  },
  line: {
    content:'台词基础', subtext:'表演信息'
  },
  container: {
    title:'容器基础', content_type:'场景与资产', desc:'场景与资产', asset_type:'场景与资产',
    visual_default:'继承与锁定', topology:'空间与连续性', continuity_lock:'空间与连续性', note:'备注'
  },
  page: {
    page_id:'页面基础', inherited_refs:'继承与覆盖', composition:'构图与动作',
    continuity_must_match:'生成与审批'
  }
};
