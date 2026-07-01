/* ============================================================
   canvas —— 主应用逻辑
   包含：Drawflow 初始化、节点渲染、连线管理、属性编辑、
   拖拽创建、剪贴板、持久化、导入导出、菜单、键盘、
   小地图、右键菜单、双向端口、启动引导
============================================================ */

import { store } from './store.js';
import { TYPE_META, SCHEMA, TITLE_FIELD, DESC_FIELD, FIELD_SECTIONS, PROJECT_REG_KEY, getProjectId, LS_KEY } from './config.js';
import { initTheme, toggleTheme } from './theme.js';
import { $, escapeHtml, nodeTitle, nodeDesc, normalizeNodeType, migrateLegacyNodeData, schemaDefaultValue, haptic, formatSize, fileIcon, compressImage, fileToDataUrl, isImageFile, positionPorts, deriveLineSpeakerName, refreshConnectionsForNode, refreshLinePresentation, refreshLineNodesForCharNode, makeEdgeId, findEdgeByPorts, resolveDirectInputPort, proxyInputPortAsOutput, ensureInputProxyOutputs, updateConnLabel, updateConnLabelsForNode, updateAllConnLabels, updateAllConnStyles, nodeInputCount, nodeOutputCount, rAF, nodeCache, connCache, snapToGrid, markDirty, clearCanvas, doSave, doExport, doImport, serialize, loadFrom, histPush, histUndo, histRedo, resetHistoryToCurrent, toggleSelected, removeSelectedNodes } from './util.js';

// Re-export commonly needed items
export { TYPE_META, SCHEMA, TITLE_FIELD, DESC_FIELD, FIELD_SECTIONS, LS_KEY, getProjectId, PROJECT_REG_KEY };
export { $, escapeHtml, nodeTitle, nodeDesc, normalizeNodeType, migrateLegacyNodeData, schemaDefaultValue, haptic, formatSize, fileIcon, compressImage, fileToDataUrl, isImageFile, positionPorts, deriveLineSpeakerName, refreshConnectionsForNode, refreshLinePresentation, refreshLineNodesForCharNode, makeEdgeId, findEdgeByPorts, resolveDirectInputPort, proxyInputPortAsOutput, ensureInputProxyOutputs, updateConnLabel, updateConnLabelsForNode, updateAllConnLabels, updateAllConnStyles, nodeInputCount, nodeOutputCount, rAF, nodeCache, connCache, snapToGrid, markDirty, clearCanvas, doSave, serialize, loadFrom, histPush, histUndo, histRedo, resetHistoryToCurrent, toggleSelected, removeSelectedNodes };

// Shared state
let idMap = {};

const NODE_COLORS = [
  '#b07cff', '#3ea6ff', '#ff9a3c', '#3ecf8e', '#ffd64b', '#ff5c5c',
  '#ff6b9d', '#5bc0be', '#f093fb', '#4facfe', '#43e97b', '#fa709a',
];

export { NODE_COLORS };

/* ============================================================
   buildNodeHtml —— 构造节点的内部 HTML
============================================================ */
export function buildNodeHtml(type, data){
  const m = TYPE_META[type];
  const d = data || {};
  let bubbles = '';
  if(type === 'char'){
    bubbles = '<div class="node-bubbles">'
            + '<div class="bubble bubble-name">'
            + '<div class="b-label">姓名</div>'
            + '<div class="b-value"></div>'
            + '</div>'
            + '<div class="bubble bubble-role">'
            + '<div class="b-label">身份</div>'
            + '<div class="b-value"></div>'
            + '</div>'
            + '<div class="bubble bubble-persona">'
            + '<div class="b-label">性格</div>'
            + '<div class="b-value"></div>'
            + '</div>'
            + '</div>';
  }
  if(type === 'char'){
    const charName = d.name || '新角色';
    const charId = '#' + (d.role || '').slice(0,4).toUpperCase() || '#CHAR';
    return `<div class="comet-card">
      <div class="comet-card-body">
        <div class="comet-card-img-wrap">
          <img src="" alt="${escapeHtml(charName)}" data-role="char-img">
          <div class="comet-card-placeholder">
            🎭<span>上传角色图片</span>
          </div>
        </div>
      </div>
      <div class="comet-card-footer">
        <div class="card-label">Comet Invitation</div>
        <div class="card-id">${escapeHtml(charId)}</div>
      </div>
      <div class="comet-card-glare"></div>
    </div>`;
  }
  if(type === 'container'){
    return `<div class="container-skin" data-type="${type}">
      <div class="ct-header">
        <span class="ct-icon">${m.icon}</span>
        <span class="ct-title" data-field="title">新章节</span>
        <span class="ct-count" data-field="count">0 节点</span>
      </div>
      <div class="ct-body">
        <div class="ct-empty">拖拽节点到此容器中<br>或右键选择"放入容器"</div>
      </div>
    </div>`;
  }
  if(type === 'line'){
    return `<div class="line-bubble" data-type="${type}">
      <div class="line-speaker" data-field="speaker">未指派</div>
      <div class="line-content" data-field="content">输入台词内容</div>
      <div class="line-meta" data-field="meta"></div>
    </div>`;
  }
  return `<div class="node-skin" data-type="${type}">
    <div class="n-top">
      <div class="n-ic ${m.icCls}">${m.icon}</div>
      <div style="flex:1;min-width:0">
        <div class="n-type">${m.label}</div>
        <div class="n-title" data-field="title">（未命名）</div>
      </div>
    </div>
    <div class="n-desc" data-field="desc"></div>
    ${bubbles}
  </div>`;
}

/* ============================================================
   refreshNodeDisplay —— 刷新节点显示
============================================================ */
export function refreshNodeDisplay(id){
  const node = store.data.nodes[id];
  if(!node) return;
  const el = document.querySelector(`#node-${id} .node-skin, #node-${id} .comet-card, #node-${id} .line-bubble`) || document.querySelector(`#node-${id} .container-skin`);
  if(!el) return;
  if(node.type === 'container'){
    const titleEl = el.querySelector('[data-field="title"]');
    const countEl = el.querySelector('[data-field="count"]');
    const bodyEl = el.querySelector('.ct-body');
    if(titleEl) titleEl.textContent = node.data.title || '新章节';
    var children = node.data._children || [];
    if(countEl) countEl.textContent = children.length + ' 节点';
    if(bodyEl){
      if(children.length === 0){
        bodyEl.innerHTML = '<div class="ct-empty">拖拽节点到此容器中<br>或右键选择"放入容器"</div>';
      } else if(node.data.note){
        bodyEl.innerHTML = '<div class="ct-note">' + escapeHtml(node.data.note) + '</div>';
      } else {
        bodyEl.innerHTML = '<div class="ct-empty">' + children.length + ' 个节点已收入</div>';
      }
    }
    return;
  }
  if(node.type === 'line'){
    const speakerEl = el.querySelector('[data-field="speaker"]');
    const contentEl = el.querySelector('[data-field="content"]');
    const metaEl = el.querySelector('[data-field="meta"]');
    const speaker = deriveLineSpeakerName(id, node.data);
    if(speakerEl) speakerEl.textContent = speaker === '未指派' ? '等待角色连线' : speaker;
    if(contentEl) contentEl.textContent = node.data.content || '输入台词内容';
    if(metaEl){
      const bits = [node.data.mood, node.data.dur ? node.data.dur + 's' : ''].filter(Boolean);
      metaEl.textContent = bits.join(' · ');
      metaEl.style.display = bits.length ? 'block' : 'none';
    }
    return;
  }
  if(node.type !== 'char'){
    const titleEl = el.querySelector('[data-field="title"]');
    const descEl = el.querySelector('[data-field="desc"]');
    if(titleEl) titleEl.textContent = nodeTitle(node.type, node.data);
    if(descEl){
      descEl.textContent = nodeDesc(node.type, node.data);
      descEl.style.display = nodeDesc(node.type, node.data) ? 'block':'none';
    }
  }
  if(node.type === 'char'){
    const label = el.querySelector('.card-label');
    if(label) label.textContent = node.data.name || '新角色';
    const idEl = el.querySelector('.card-id');
    if(idEl){
      const roleId = (node.data.role || '').slice(0,4).toUpperCase();
      idEl.textContent = roleId ? '#' + roleId : '#CHAR';
    }
  }
}

/* ============================================================
   updateEmpty / updateZoomPct
============================================================ */
export function updateEmpty(){
  const empty = $('#canvas-empty');
  const cnt = store.editor ? Object.keys(store.editor.export().drawflow.Home.data).length : 0;
  empty.classList.toggle('hidden', cnt>0);
}

export function updateZoomPct(){
  if(!store.editor) return;
  const z = Math.round(store.editor.zoom * 100);
  const zp = $('#zoom-pct');
  if(zp) zp.textContent = z + '%';
  const fp = $('#zoom-pct-f');
  if(fp) fp.textContent = z + '%';
}

/* ============================================================
   renderInspector —— 右侧属性区编辑
============================================================ */
export function renderInspector(){
  const insp = $('#inspector');
  const sel = store.selectedId;
  const mainEl = $('.main');

  if(!sel && store.selectedIds.length === 0){
    if(mainEl) mainEl.classList.add('no-inspector');
    insp.innerHTML = '';
    return;
  }

  if(mainEl) mainEl.classList.remove('no-inspector');

  if(store.selectedIds.length > 1){
    insp.innerHTML = `<div class="insp-head">
      <div class="badge" style="background:var(--accent)">🔢</div>
      <div class="tt"><div class="type">多选</div><div class="name">已选中 ${store.selectedIds.length} 个节点</div></div>
    </div>
    <p style="font-size:12px;color:var(--text-dim);line-height:1.7">按 <b>Delete</b> 批量删除 · <b>Esc</b> 取消选中</p>
    <div class="insp-actions"><button class="tbtn danger" id="del-multi">🗑 删除全部</button></div>`;
    $('#del-multi').onclick = removeSelectedNodes;
    return;
  }

  if(typeof sel==='object' && sel.kind==='edge'){
    const edgeId = sel.edgeId;
    const edgeMeta = edgeId ? store.data.edges[edgeId] : null;
    const typeVal = edgeMeta ? (edgeMeta.type || 'solid') : 'solid';
    const labelVal = edgeMeta ? (edgeMeta.label || '') : '';
    const colorVal = edgeMeta ? (edgeMeta.color || '') : '';
    const widthVal = edgeMeta ? (edgeMeta.width || 2.5) : 2.5;

    insp.innerHTML = `<div class="insp-head">
        <div class="badge" style="background:var(--border-2)">🔗</div>
        <div class="tt"><div class="type">连线</div><div class="name">引用关系</div></div>
      </div>
      <div class="field"><label>连线类型</label>
        <select id="edge-type">
          <option value="solid"${typeVal==='solid'?' selected':''}>━ 实线（顺序）</option>
          <option value="dash"${typeVal==='dash'?' selected':''}>┅ 虚线（跳转）</option>
          <option value="dot"${typeVal==='dot'?' selected':''}>·· 点线</option>
          <option value="arrow"${typeVal==='arrow'?' selected':''}>➤ 箭头（分支）</option>
        </select>
      </div>
      <div class="field"><label>连线颜色</label>
        <div class="color-picker" id="edge-colors">
          ${NODE_COLORS.map(c=>`<div class="color-dot ${colorVal===c?'active':''}" style="background:${c}" data-color="${c}"></div>`).join('')}
          <div class="color-dot ${colorVal===''?'active':''}" style="background:transparent;border:2px dashed var(--border-2)" data-color="" title="默认色"></div>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>线宽 (px)</label>
          <input type="number" id="edge-width" value="${widthVal}" min="1" max="10" step="0.5" />
        </div>
      </div>
      <div class="field"><label>关系标签</label>
        <input type="text" id="edge-label" value="${escapeHtml(labelVal)}" placeholder="如：前提、反转、伏笔" />
      </div>
      <p style="font-size:12px;color:var(--text-dim);line-height:1.7">按 <b>Delete</b> 可删除此连线。</p>
      <div class="insp-actions"><button class="tbtn danger" id="del-edge">🗑 删除连线</button></div>`;

    function getConnEl(){
      return document.querySelector(`.connection.node_in_node-${sel.in}.node_out_node-${sel.out}.${sel.oc}.${sel.ic}`);
    }

    function updateConnStyle(){
      const connEl = getConnEl();
      if(!connEl || !edgeId) return;
      const em = store.data.edges[edgeId];
      if(!em) return;
      const path = connEl.querySelector('.main-path');
      if(path){
        if(em.color) path.style.stroke = em.color;
        else path.style.stroke = '';
        if(em.width) path.style.strokeWidth = em.width + 'px';
        else path.style.strokeWidth = '';
      }
    }

    const etypeSel = $('#edge-type');
    if(etypeSel) etypeSel.addEventListener('change', ()=>{
      if(!edgeId) return;
      const connEl = getConnEl();
      if(connEl){
        connEl.classList.remove('type-solid','type-dash','type-dot','type-arrow');
        connEl.classList.add('type-' + etypeSel.value);
      }
      store.data.edges[edgeId].type = etypeSel.value;
      markDirty();
      haptic('light');
    });

    const colorPicker = $('#edge-colors');
    if(colorPicker){
      colorPicker.querySelectorAll('.color-dot').forEach(dot=>{
        dot.addEventListener('click', ()=>{
          if(!edgeId) return;
          const c = dot.dataset.color;
          store.data.edges[edgeId].color = c;
          colorPicker.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));
          dot.classList.add('active');
          updateConnStyle();
          markDirty();
          haptic('light');
        });
      });
    }

    const widthInp = $('#edge-width');
    if(widthInp) widthInp.addEventListener('input', ()=>{
      if(!edgeId) return;
      const w = parseFloat(widthInp.value) || 2.5;
      store.data.edges[edgeId].width = Math.max(1, Math.min(10, w));
      updateConnStyle();
      markDirty();
    });

    const elabelInp = $('#edge-label');
    if(elabelInp) elabelInp.addEventListener('input', ()=>{
      if(!edgeId) return;
      store.data.edges[edgeId].label = elabelInp.value;
      updateConnLabel(edgeId);
      markDirty();
    });

    $('#del-edge').onclick = ()=>{
      store.editor.removeSingleConnection(sel.out, sel.in, sel.oc, sel.ic);
      if(edgeId) delete store.data.edges[edgeId];
      store.selectedId=null; renderInspector();
      haptic('medium');
    };
    return;
  }

  const node = store.data.nodes[sel];
  if(!node){ store.selectedId=null; renderInspector(); return; }
  const m = TYPE_META[node.type];
  const fields = SCHEMA[node.type];
  const derivedSpeaker = node.type === 'line' ? deriveLineSpeakerName(sel, node.data) : '';

  let html = `<div class="insp-head">
    <div class="badge ${m.icCls}">${m.icon}</div>
    <div class="tt">
      <div class="type">${m.label}节点</div>
      <div class="name">${escapeHtml(nodeTitle(node.type, node.data) || '未命名')}</div>
      <div class="id">${sel}</div>
    </div>
  </div>`;

  if(node.type === 'line'){
    html += `<div class="field">
      <label>说话人（由连线推断）</label>
      <div class="field-readonly">${escapeHtml(derivedSpeaker)}</div>
    </div>`;
  }

  let currentSection = '';
  fields.forEach((f,i)=>{
    const section = FIELD_SECTIONS[node.type] && FIELD_SECTIONS[node.type][f.key];
    if(section && section !== currentSection){
      currentSection = section;
      html += `<div class="field-section">${escapeHtml(section)}</div>`;
    }
    const val = node.data[f.key] ?? '';
    const req = f.required ? ' <span class="req">*</span>' : '';
    let ctrl;
    if(f.type==='textarea'){
      ctrl = `<textarea data-key="${f.key}" placeholder="${escapeHtml(f.ph||'')}">${escapeHtml(val)}</textarea>`;
    } else if(f.type==='select'){
      const opts = (f.options||[]).map(o=>`<option value="${escapeHtml(o)}"${o===val?' selected':''}>${escapeHtml(o||'（选择）')}</option>`).join('');
      ctrl = `<select data-key="${f.key}">${opts}</select>`;
    } else {
      ctrl = `<input type="text" data-key="${f.key}" value="${escapeHtml(val)}" placeholder="${escapeHtml(f.ph||'')}" />`;
    }
    html += `<div class="field"><label>${f.label}${req}</label>${ctrl}</div>`;
  });

  html += `<div class="insp-actions">
    <button class="tbtn" id="dup-node">📋 复制</button>
    <button class="tbtn danger" id="del-node">🗑 删除</button>
  </div>`;

  insp.innerHTML = html;

  insp.querySelectorAll('[data-key]').forEach(input=>{
    const ev = (input.tagName==='SELECT') ? 'change' : 'input';
    input.addEventListener(ev, ()=>{
      node.data[input.dataset.key] = input.value;
      refreshNodeDisplay(sel);
      markDirty();
      const headName = insp.querySelector('.insp-head .name');
      if(headName) headName.textContent = nodeTitle(node.type, node.data) || '未命名';
    });
  });

  $('#del-node').onclick = ()=>{ store.editor.removeNodeId('node-'+sel); };
  $('#dup-node').onclick = ()=>duplicateNode(sel);
}

/* ============================================================
   initDrawflow —— Drawflow 初始化
============================================================ */
export function initDrawflow(){
  console.log('[initDrawflow] #drawflow=', $('#drawflow'));
  console.log('[initDrawflow] Drawflow global=', typeof window.Drawflow);
  const editor = new Drawflow($('#drawflow'));
  console.log('[initDrawflow] editor=', editor);
  editor.reroute = true;
  editor.reroute_fix_curvature = true;
  editor.force_first_input = false;
  editor.start();

  const _origZoomEnter = editor.zoom_enter.bind(editor);
  editor.zoom_enter = function(e){
    e.preventDefault();
    if(e.deltaY > 0){ this.zoom_out(); }
    else if(e.deltaY < 0){ this.zoom_in(); }
  };
  editor.container.removeEventListener('wheel', _origZoomEnter);
  editor.container.addEventListener('wheel', editor.zoom_enter.bind(editor), { passive: false });

  editor.on('nodeSelected', id => {
    const shift = store._shiftDown;
    toggleSelected(String(id), shift);
  });
  editor.on('nodeUnselected', () => {
    store.selectedId = null;
    store.selectedIds = [];
    renderInspector();
  });
  editor.on('connectionSelected', info => {
    store.selectedId = { kind:'edge', out:info.output_id, in:info.input_id, oc:info.output_class, ic:info.input_class };
    const edgeMeta = findEdgeByPorts(info.output_id, info.input_id, info.output_class, info.input_class);
    if(edgeMeta) store.selectedId.edgeId = edgeMeta.id;
    renderInspector();
  });
  editor.on('connectionUnselected', () => {
    if(store.selectedId && typeof store.selectedId==='object'){ store.selectedId=null; renderInspector(); }
  });

  editor.on('nodeCreated', id => {
    const pending = store.pendingNodes.shift();
    if(pending){
      store.data.nodes[id] = { type: pending.type, data: pending.data };
      if(pending.type === 'container' && !store.data.nodes[id].data._children){
        store.data.nodes[id].data._children = [];
      }
      if(pending.remap!=null) idMap[pending.remap] = id;
      refreshNodeDisplay(id);
      if(pending.type === 'container' && pending.data){
        const el = document.querySelector(`#node-${id}`);
        if(el){
          if(pending.data._width)  el.style.width  = pending.data._width + 'px';
          if(pending.data._height) el.style.height = pending.data._height + 'px';
          el.dataset._lastX = el.offsetLeft;
          el.dataset._lastY = el.offsetTop;
        }
      }
      if(pending.type === 'container'){
        const nodeEl = document.querySelector(`#node-${id}`);
        if(nodeEl){
          nodeEl.dataset._lastX = nodeEl.offsetLeft;
          nodeEl.dataset._lastY = nodeEl.offsetTop;
          if(!nodeEl.querySelector('.resize-handle')){
            const dirs = ['n','s','e','w','ne','nw','se','sw'];
            dirs.forEach(d => {
              const h = document.createElement('div');
              h.className = 'resize-handle resize-handle-' + d;
              h.dataset.dir = d;
              nodeEl.appendChild(h);
            });
          }
        }
      }
      if(pending.data && pending.data._parentId){
        const el = document.querySelector(`#node-${id}`);
        if(el) el.style.zIndex = '5';
      }
      if(pending.data && pending.data._thumb){
        setTimeout(()=> setNodeThumb(id, pending.data._thumb), 0);
      }
      ensureInputProxyOutputs(id);
      if(pending.select){
        store.selectedId = String(id);
        store.selectedIds = [String(id)];
        const el = document.querySelector(`#node-${id}`);
        if(el) el.classList.add('selected');
        renderInspector();
      }
    }
    nodeCache.invalidate(id);
    positionPorts(id);
    refreshLinePresentation(id);
    markDirty(); updateEmpty();
  });

  editor.on('nodeRemoved', id => {
    const removedNode = store.data.nodes[id];
    if(removedNode){
      if(removedNode.type === 'container' && removedNode.data._children){
        removedNode.data._children.forEach(childId => {
          const child = store.data.nodes[childId];
          if(child) delete child.data._parentId;
          const childEl = nodeCache.get(childId) || document.querySelector(`#node-${childId}`);
          if(childEl) childEl.style.zIndex = '';
        });
      }
      if(removedNode.data._parentId){
        const parent = store.data.nodes[removedNode.data._parentId];
        if(parent && parent.data._children){
          parent.data._children = parent.data._children.filter(cid => String(cid) !== String(id));
          refreshNodeDisplay(removedNode.data._parentId);
        }
      }
    }
    const removedType = removedNode ? removedNode.type : '';
    delete store.data.nodes[id];
    nodeCache.invalidate(id);
    connCache.invalidate();
    if(store.selectedId==String(id)){store.selectedId=null;renderInspector();}
    if(store.nodeSpheres && store.nodeSpheres[id]){
      try{ store.nodeSpheres[id].dispose(); }catch(e){}
      delete store.nodeSpheres[id];
    }
    if(removedType === 'char') refreshLineNodesForCharNode(id);
    markDirty(); updateEmpty();
  });

  editor.on('connectionCreated', info => {
    const existing = findEdgeByPorts(info.output_id, info.input_id, info.output_class, info.input_class);
    if(existing) {
      connCache.invalidate(info.output_id, info.input_id, info.output_class, info.input_class);
      const connEl = connCache.get(info.output_id, info.input_id, info.output_class, info.input_class);
      if(connEl && existing.meta.type){
        connEl.classList.remove('type-solid','type-dash','type-dot','type-arrow');
        connEl.classList.add('type-' + existing.meta.type);
      }
      setTimeout(()=>updateAllConnLabels(), 50);
      if(store.data.nodes[info.output_id]?.type === 'line') refreshLinePresentation(info.output_id);
      if(store.data.nodes[info.input_id]?.type === 'line') refreshLinePresentation(info.input_id);
      if(store.data.nodes[info.output_id]?.type === 'char') refreshLineNodesForCharNode(info.output_id);
      if(store.data.nodes[info.input_id]?.type === 'char') refreshLineNodesForCharNode(info.input_id);
      markDirty();
      return;
    }
    const eid = makeEdgeId();
    store.data.edges[eid] = {
      from: info.output_id, to: info.input_id,
      out_port: info.output_class, in_port: info.input_class,
      type: 'solid', label: '', color: '', width: 2.5,
    };
    connCache.invalidate(info.output_id, info.input_id, info.output_class, info.input_class);
    const connEl = connCache.get(info.output_id, info.input_id, info.output_class, info.input_class);
    if(connEl) connEl.classList.add('type-solid');
    setTimeout(()=>updateAllConnLabels(), 50);
    if(store.data.nodes[info.output_id]?.type === 'line') refreshLinePresentation(info.output_id);
    if(store.data.nodes[info.input_id]?.type === 'line') refreshLinePresentation(info.input_id);
    if(store.data.nodes[info.output_id]?.type === 'char') refreshLineNodesForCharNode(info.output_id);
    if(store.data.nodes[info.input_id]?.type === 'char') refreshLineNodesForCharNode(info.input_id);
    markDirty();
  });

  editor.on('connectionRemoved', info => {
    const found = findEdgeByPorts(info.output_id, info.input_id, info.output_class, info.input_class);
    if(found) delete store.data.edges[found.id];
    connCache.invalidate(info.output_id, info.input_id, info.output_class, info.input_class);
    if(store.data.nodes[info.output_id]?.type === 'line') refreshLinePresentation(info.output_id);
    if(store.data.nodes[info.input_id]?.type === 'line') refreshLinePresentation(info.input_id);
    if(store.data.nodes[info.output_id]?.type === 'char') refreshLineNodesForCharNode(info.output_id);
    if(store.data.nodes[info.input_id]?.type === 'char') refreshLineNodesForCharNode(info.input_id);
    markDirty();
  });

  editor.on('nodeDataChanged', () => markDirty());

  editor.on('nodeMoved', id=>{
    const movedStoreNode = store.data.nodes[id];
    const movedEl = nodeCache.get(id) || document.querySelector(`#node-${id}`);
    if(movedStoreNode && movedEl){
      movedStoreNode.data._posX = movedEl.offsetLeft;
      movedStoreNode.data._posY = movedEl.offsetTop;
    }
    const movedNode = movedStoreNode;
    if(movedNode && movedNode.type === 'container' && movedNode.data._children && movedNode.data._children.length){
      const el = nodeCache.get(id) || document.querySelector(`#node-${id}`);
      if(el){
        const newX = el.offsetLeft, newY = el.offsetTop;
        const oldX = parseFloat(el.dataset._lastX) || newX;
        const oldY = parseFloat(el.dataset._lastY) || newY;
        const dx = newX - oldX, dy = newY - oldY;
        if((dx !== 0 || dy !== 0) && store.liveDragNodeId !== String(id)){
          movedNode.data._children.forEach(childId => {
            const childEl = nodeCache.get(childId) || document.querySelector(`#node-${childId}`);
            if(childEl){
              const cx = childEl.offsetLeft + dx;
              const cy = childEl.offsetTop + dy;
              childEl.style.left = cx + 'px';
              childEl.style.top = cy + 'px';
              const dfData = editor.drawflow.drawflow[editor.module].data;
              if(dfData[childId]){ dfData[childId].pos_x = cx; dfData[childId].pos_y = cy; }
              const childStore = store.data.nodes[childId];
              if(childStore){ childStore.data._posX = cx; childStore.data._posY = cy; }
              refreshConnectionsForNode(childId);
            }
          });
        }
        el.dataset._lastX = newX;
        el.dataset._lastY = newY;
      }
    }
    if(store.snapToNode){
      const node = store.data.nodes[id];
      if(!node) return;
      const el = nodeCache.get(id);
      if(!el) return;
      const ex = el.offsetLeft, ey = el.offsetTop;
      let nearestDist = 15;
      let snapX = null, snapY = null;
      Object.keys(store.data.nodes).forEach(otherId=>{
        if(otherId === id) return;
        const otherEl = nodeCache.get(otherId);
        if(!otherEl) return;
        const ox = otherEl.offsetLeft, oy = otherEl.offsetTop;
        const dx = Math.abs(ex - ox);
        const dy = Math.abs(ey - oy);
        if(dx < nearestDist){ snapX = ox; nearestDist = dx; }
        if(dy < 15){ snapY = oy; }
      });
      if(snapX !== null){ el.style.left = snapX + 'px'; node.data._posX = snapX; }
      if(snapY !== null){ el.style.top = snapY + 'px'; node.data._posY = snapY; }
    }
    refreshConnectionsForNode(id);
    rAF.schedule(`conn-label-${id}`, () => { updateConnLabelsForNode(id); });
    rAF.schedule('mark-dirty', markDirty);
    rAF.schedule('minimap-update', () => { renderMinimap(); });
    rAF.schedule('groups-update', () => { renderGroups(); });
  });

  editor.on('translate', () => {});
  editor.on('zoom', () => updateZoomPct());

  store.editor = editor;

  // 连线吸附增强
  (function enhanceConnectionSnap(){
    let _origUpdateConn = editor.updateConnection.bind(editor);
    function clearSnapHighlight(){
      if(store.connSnapTarget){
        store.connSnapTarget.classList.remove('snap-target');
        store.connSnapTarget = null;
      }
    }
    function getHoveredInputPort(mouseX, mouseY){
      const hit = document.elementFromPoint(mouseX, mouseY);
      if(!hit) return null;
      const port = hit.closest('.input');
      if(!port) return null;
      const sourceNode = editor.ele_selected ? editor.ele_selected.closest('.drawflow-node') : null;
      const targetNode = port.closest('.drawflow-node');
      if(sourceNode && targetNode && sourceNode === targetNode) return null;
      return port;
    }
    editor.updateConnection = function(mouseX, mouseY){
      if(!store.snapToPort){ clearSnapHighlight(); return _origUpdateConn(mouseX, mouseY); }
      clearSnapHighlight();
      const snapPort = getHoveredInputPort(mouseX, mouseY);
      if(snapPort){
        snapPort.classList.add('snap-target');
        store.connSnapTarget = snapPort;
        const rect = snapPort.getBoundingClientRect();
        return _origUpdateConn(rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else { return _origUpdateConn(mouseX, mouseY); }
    };
    editor.on('connectionCreated', () => { clearSnapHighlight(); });
    editor.on('connectionUnselected', () => { clearSnapHighlight(); });
    if(!document.getElementById('conn-snap-style')){
      const style = document.createElement('style');
      style.id = 'conn-snap-style';
      style.textContent = `
        .input.snap-target { box-shadow: 0 0 0 3px var(--accent), 0 0 12px var(--accent) !important; transform: scale(1.22); transition: all 0.12s ease; }
        .drawflow-node.snap-target{ box-shadow: 0 0 0 2px var(--accent), 0 10px 28px rgba(91,141,230,.22) !important; }
      `;
      document.head.appendChild(style);
    }
  })();

  // 同步节点位置
  function syncNodePositionState(nodeId, x, y){
    const dfData = editor.drawflow.drawflow[editor.module].data;
    if(dfData[nodeId]){ dfData[nodeId].pos_x = x; dfData[nodeId].pos_y = y; }
    const storeNode = store.data.nodes[nodeId];
    if(storeNode){ storeNode.data._posX = x; storeNode.data._posY = y; }
  }

  function placeChildInsideContainer(childId, containerId){
    const childEl = nodeCache.get(childId) || document.querySelector(`#node-${childId}`);
    const containerEl = nodeCache.get(containerId) || document.querySelector(`#node-${containerId}`);
    if(!childEl || !containerEl) return;
    const headerH = 42, padX = 12, padBottom = 12;
    const containerX = containerEl.offsetLeft, containerY = containerEl.offsetTop;
    const containerW = containerEl.offsetWidth, containerH = containerEl.offsetHeight;
    const childW = childEl.offsetWidth, childH = childEl.offsetHeight;
    const minX = containerX + padX;
    const maxX = containerX + Math.max(padX, containerW - childW - padX);
    const minY = containerY + headerH;
    const maxY = containerY + Math.max(headerH, containerH - childH - padBottom);
    const nextX = Math.min(maxX, Math.max(minX, childEl.offsetLeft));
    const nextY = Math.min(maxY, Math.max(minY, childEl.offsetTop));
    childEl.style.left = nextX + 'px';
    childEl.style.top = nextY + 'px';
    syncNodePositionState(childId, nextX, nextY);
    refreshConnectionsForNode(childId);
  }

  function assignNodeToContainer(childId, containerId){
    const container = store.data.nodes[containerId];
    if(!container || container.type !== 'container') return false;
    const child = store.data.nodes[childId];
    if(!child || child.type === 'container') return false;
    if(String(childId) === String(containerId)) return false;
    if(child.data._parentId){
      const oldParent = store.data.nodes[child.data._parentId];
      if(oldParent && oldParent.data._children){
        oldParent.data._children = oldParent.data._children.filter(cid => String(cid) !== String(childId));
        refreshNodeDisplay(child.data._parentId);
      }
    }
    if(!container.data._children) container.data._children = [];
    if(!container.data._children.includes(childId)){ container.data._children.push(childId); }
    child.data._parentId = containerId;
    const childEl = nodeCache.get(childId) || document.querySelector(`#node-${childId}`);
    if(childEl) childEl.style.zIndex = '5';
    placeChildInsideContainer(childId, containerId);
    refreshConnectionsForNode(childId);
    refreshConnectionsForNode(containerId);
    refreshNodeDisplay(containerId);
    markDirty();
    return true;
  }

  function findContainerUnderNode(dragNodeEl, dragNodeId){
    const dragRect = dragNodeEl.getBoundingClientRect();
    let bestContainer = null, bestScore = 0;
    Object.keys(store.data.nodes).forEach(cid => {
      if(String(cid) === String(dragNodeId)) return;
      if(store.data.nodes[cid].type !== 'container') return;
      const cEl = document.querySelector(`#node-${cid}`);
      if(!cEl) return;
      const cRect = cEl.getBoundingClientRect();
      const overlapW = Math.max(0, Math.min(dragRect.right, cRect.right) - Math.max(dragRect.left, cRect.left));
      const overlapH = Math.max(0, Math.min(dragRect.bottom, cRect.bottom) - Math.max(dragRect.top, cRect.top));
      const overlapArea = overlapW * overlapH;
      const minArea = Math.min(dragRect.width * dragRect.height, cRect.width * cRect.height) || 1;
      const score = overlapArea / minArea;
      if(score > bestScore){ bestScore = score; bestContainer = cid; }
    });
    return bestScore >= 0.12 ? bestContainer : null;
  }

  // enhanceDragging
  (function enhanceDragging(){
    const container = editor.container;
    let dragNode = null;
    let isDragging = false;
    container.addEventListener('mousedown', function(e){
      let nodeEl = e.target.closest('.drawflow-node');
      if(!nodeEl) return;
      if(e.target.closest('.resize-handle')) return;
      if(e.target.closest('.input') || e.target.closest('.output')) return;
      const clickedId = nodeEl.id.replace('node-','');
      const clickedNode = store.data.nodes[clickedId];
      const selectedNode = store.selectedId ? store.data.nodes[store.selectedId] : null;
      if(clickedNode && clickedNode.data && clickedNode.data._parentId && selectedNode && selectedNode.type === 'container' && String(clickedNode.data._parentId) === String(store.selectedId)){
        const parentEl = nodeCache.get(store.selectedId) || document.querySelector(`#node-${store.selectedId}`);
        if(parentEl) nodeEl = parentEl;
      }
      if(nodeEl.classList.contains('locked')) return;
      dragNode = nodeEl;
      isDragging = true;
      store.liveDragNodeId = nodeEl.id.replace('node-','');
      if(!editor.drag){ editor.drag = true; editor.ele_selected = nodeEl; editor.pos_x = e.clientX; editor.pos_y = e.clientY; }
      requestAnimationFrame(() => { if(nodeEl) nodeEl.classList.add('dragging'); });
    }, true);

    document.addEventListener('mousemove', function(e){
      if(!isDragging || !dragNode) return;
      if(!editor.drag){ editor.drag = true; editor.ele_selected = dragNode; }
      if(editor.drag && editor.ele_selected) editor.position(e);
      const cDragId = dragNode.id ? dragNode.id.replace('node-','') : null;
      if(cDragId){
        const draggedStore = store.data.nodes[cDragId];
        if(draggedStore && draggedStore.type === 'container' && draggedStore.data._children && draggedStore.data._children.length){
          const newLeft = dragNode.offsetLeft, newTop = dragNode.offsetTop;
          const oldLeft = parseFloat(dragNode.dataset._lastX), oldTop = parseFloat(dragNode.dataset._lastY);
          const cdx = newLeft - oldLeft, cdy = newTop - oldTop;
          if(cdx !== 0 || cdy !== 0){
            draggedStore.data._children.forEach(childId => {
              const childEl = nodeCache.get(childId) || document.querySelector('#node-' + childId);
              if(childEl){
                const cx = childEl.offsetLeft + cdx, cy = childEl.offsetTop + cdy;
                childEl.style.left = cx + 'px'; childEl.style.top = cy + 'px';
                const dfData = editor.drawflow.drawflow[editor.module].data;
                if(dfData[childId]){ dfData[childId].pos_x = cx; dfData[childId].pos_y = cy; }
                const cs = store.data.nodes[childId];
                if(cs){ cs.data._posX = cx; cs.data._posY = cy; }
                refreshConnectionsForNode(childId);
              }
            });
          }
          dragNode.dataset._lastX = newLeft; dragNode.dataset._lastY = newTop;
        }
      }
      if(!dragNode.classList.contains('dragging')) dragNode.classList.add('dragging');
      document.querySelectorAll('.drawflow-node.node-container.drag-over').forEach(el => el.classList.remove('drag-over'));
      const dragNodeId = dragNode.id ? dragNode.id.replace('node-','') : null;
      if(dragNodeId){
        const hoverContainer = findContainerUnderNode(dragNode, dragNodeId);
        if(hoverContainer){ const cEl = document.querySelector(`#node-${hoverContainer}`); if(cEl) cEl.classList.add('drag-over'); }
      }
    }, true);

    function clearDrag(){
      isDragging = false;
      if(dragNode){
        const dragNodeId = dragNode.id ? dragNode.id.replace('node-','') : null;
        if(dragNodeId){ const targetContainer = findContainerUnderNode(dragNode, dragNodeId); if(targetContainer) assignNodeToContainer(dragNodeId, targetContainer); }
        dragNode.classList.remove('dragging');
        document.querySelectorAll('.drawflow-node.node-container.drag-over').forEach(el => el.classList.remove('drag-over'));
        dragNode = null;
      }
      store.liveDragNodeId = null;
    }
    document.addEventListener('mouseup', clearDrag, true);
    document.addEventListener('mouseleave', clearDrag, true);
    container.addEventListener('touchstart', function(e){
      let nodeEl = e.target.closest('.drawflow-node');
      if(!nodeEl) return;
      if(e.target.closest('.input') || e.target.closest('.output')) return;
      if(nodeEl.classList.contains('locked')) return;
      const clickedId = nodeEl.id.replace('node-','');
      const clickedNode = store.data.nodes[clickedId];
      const selectedNode = store.selectedId ? store.data.nodes[store.selectedId] : null;
      if(clickedNode && clickedNode.data && clickedNode.data._parentId && selectedNode && selectedNode.type === 'container' && String(clickedNode.data._parentId) === String(store.selectedId)){
        const parentEl = nodeCache.get(store.selectedId) || document.querySelector(`#node-${store.selectedId}`);
        if(parentEl) nodeEl = parentEl;
      }
      dragNode = nodeEl; isDragging = true;
      store.liveDragNodeId = nodeEl.id.replace('node-','');
      nodeEl.classList.add('dragging');
      if(!editor.drag){ const touch = e.touches[0]; editor.drag = true; editor.ele_selected = nodeEl; editor.pos_x = touch.clientX; editor.pos_y = touch.clientY; }
    }, { passive: true, capture: true });
    document.addEventListener('touchmove', function(e){
      if(!isDragging || !dragNode) return;
      if(editor.drag && editor.ele_selected) editor.position(e);
    }, { passive: true, capture: true });
    document.addEventListener('touchend', clearDrag, true);
    document.addEventListener('touchcancel', clearDrag, true);
  })();

  // CometCard 3D 倾斜
  (function initCometCardTilt(){
    const ROTATE_DEPTH = 17.5, TRANSLATE_DEPTH = 20;
    const precanvas = editor.container;
    let activeCard = null;
    precanvas.addEventListener('mousemove', function(e){
      const dragNode = precanvas.querySelector('.drawflow-node.dragging');
      if(dragNode){ resetCard(); return; }
      const card = e.target.closest('.comet-card');
      if(!card){ resetCard(); return; }
      const nodeEl = card.closest('.drawflow-node');
      if(!nodeEl || !nodeEl.classList.contains('node-char')){ resetCard(); return; }
      if(nodeEl.classList.contains('locked')){ resetCard(); return; }
      activeCard = card;
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
      const xPct = mouseX / rect.width - 0.5, yPct = mouseY / rect.height - 0.5;
      const rotateX = -yPct * ROTATE_DEPTH * 2, rotateY = xPct * ROTATE_DEPTH * 2;
      const translateX = xPct * TRANSLATE_DEPTH * 2, translateY = -yPct * TRANSLATE_DEPTH * 2;
      card.style.transform = 'rotateX('+rotateX.toFixed(2)+'deg) rotateY('+rotateY.toFixed(2)+'deg) translateX('+translateX.toFixed(2)+'px) translateY('+translateY.toFixed(2)+'px) scale(1.05)';
      const glare = card.querySelector('.comet-card-glare');
      if(glare){ const glareX = (xPct+0.5)*100, glareY = (yPct+0.5)*100; glare.style.background = 'radial-gradient(circle at '+glareX.toFixed(1)+'% '+glareY.toFixed(1)+'%, rgba(255,255,255,0.9) 10%, rgba(255,255,255,0.75) 20%, rgba(255,255,255,0) 80%)'; }
    }, true);
    function resetCard(){ if(activeCard){ activeCard.style.transform = ''; const glare = activeCard.querySelector('.comet-card-glare'); if(glare) glare.style.background = ''; activeCard = null; } }
    precanvas.addEventListener('mouseleave', resetCard, true);
  })();

  // 容器缩放
  (function initContainerResize(){
    const MIN_W = 160, MIN_H = 120, MAX_W = 1200, MAX_H = 900;
    let resizing = false, resizeNode = null, resizeNodeId = null, resizeDir = '';
    let startMouseX = 0, startMouseY = 0, startW = 0, startH = 0, startNodeX = 0, startNodeY = 0;
    const container = editor.container;
    container.addEventListener('mousedown', function(e){
      const handle = e.target.closest('.resize-handle');
      if(!handle) return;
      const nodeEl = handle.closest('.drawflow-node.node-container');
      if(!nodeEl) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      editor.drag = false; editor.ele_selected = null;
      resizing = true; resizeNode = nodeEl; resizeNodeId = nodeEl.id.replace('node-','');
      resizeDir = handle.dataset.dir;
      startMouseX = e.clientX; startMouseY = e.clientY;
      startW = nodeEl.offsetWidth; startH = nodeEl.offsetHeight;
      startNodeX = nodeEl.offsetLeft; startNodeY = nodeEl.offsetTop;
      nodeEl.classList.add('resizing');
      document.body.style.cursor = getComputedStyle(handle).cursor;
      document.body.style.userSelect = 'none';
    }, true);
    document.addEventListener('mousemove', function(e){
      if(!resizing || !resizeNode) return;
      e.preventDefault();
      const zoom = store.editor.zoom || 1;
      const dx = (e.clientX - startMouseX) / zoom, dy = (e.clientY - startMouseY) / zoom;
      let newW = startW, newH = startH, newX = startNodeX, newY = startNodeY;
      if(resizeDir.includes('e')) newW = startW + dx;
      if(resizeDir.includes('w')) newW = startW - dx;
      if(resizeDir.includes('s')) newH = startH + dy;
      if(resizeDir.includes('n')) newH = startH - dy;
      newW = Math.max(MIN_W, Math.min(MAX_W, newW));
      newH = Math.max(MIN_H, Math.min(MAX_H, newH));
      if(resizeDir.includes('w')) newX = startNodeX + (startW - newW);
      if(resizeDir.includes('n')) newY = startNodeY + (startH - newH);
      resizeNode.style.setProperty('width', newW+'px', 'important');
      resizeNode.style.setProperty('height', newH+'px', 'important');
      if(resizeDir.includes('w') || resizeDir.includes('n')){
        resizeNode.style.left = newX+'px'; resizeNode.style.top = newY+'px';
        const modData = editor.drawflow.drawflow[editor.module].data;
        if(modData[resizeNodeId]){ modData[resizeNodeId].pos_x = newX; modData[resizeNodeId].pos_y = newY; }
        const ns = store.data.nodes[resizeNodeId];
        if(ns){ ns.data._posX = newX; ns.data._posY = newY; }
      }
      const nd = store.data.nodes[resizeNodeId];
      if(nd){ nd.data._width = newW; nd.data._height = newH; }
      positionPorts(resizeNodeId);
      rAF.schedule('conn-label-'+resizeNodeId, () => { updateConnLabelsForNode(resizeNodeId); });
      rAF.schedule('minimap-update', renderMinimap);
    }, true);
    document.addEventListener('mouseup', function(){
      if(!resizing) return;
      resizing = false;
      if(resizeNode) resizeNode.classList.remove('resizing');
      document.body.style.cursor = ''; document.body.style.userSelect = '';
      resizeNode = null; markDirty();
    }, true);
    container.addEventListener('touchstart', function(e){
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if(!el) return;
      const handle = el.closest('.resize-handle');
      if(!handle) return;
      const nodeEl = handle.closest('.drawflow-node.node-container');
      if(!nodeEl) return;
      e.preventDefault(); editor.drag = false; editor.ele_selected = null;
      resizing = true; resizeNode = nodeEl; resizeNodeId = nodeEl.id.replace('node-','');
      resizeDir = handle.dataset.dir;
      startMouseX = touch.clientX; startMouseY = touch.clientY;
      startW = nodeEl.offsetWidth; startH = nodeEl.offsetHeight;
      startNodeX = nodeEl.offsetLeft; startNodeY = nodeEl.offsetTop;
      nodeEl.classList.add('resizing');
    }, { passive: false, capture: true });
    document.addEventListener('touchmove', function(e){
      if(!resizing || !resizeNode) return;
      e.preventDefault();
      const touch = e.touches[0];
      const zoom = store.editor.zoom || 1;
      const dx = (touch.clientX - startMouseX) / zoom, dy = (touch.clientY - startMouseY) / zoom;
      let newW = startW, newH = startH, newX = startNodeX, newY = startNodeY;
      if(resizeDir.includes('e')) newW = startW + dx;
      if(resizeDir.includes('w')) newW = startW - dx;
      if(resizeDir.includes('s')) newH = startH + dy;
      if(resizeDir.includes('n')) newH = startH - dy;
      newW = Math.max(MIN_W, Math.min(MAX_W, newW));
      newH = Math.max(MIN_H, Math.min(MAX_H, newH));
      if(resizeDir.includes('w')) newX = startNodeX + (startW - newW);
      if(resizeDir.includes('n')) newY = startNodeY + (startH - newH);
      resizeNode.style.setProperty('width', newW+'px', 'important');
      resizeNode.style.setProperty('height', newH+'px', 'important');
      if(resizeDir.includes('w') || resizeDir.includes('n')){
        resizeNode.style.left = newX+'px'; resizeNode.style.top = newY+'px';
        const modData = editor.drawflow.drawflow[editor.module].data;
        if(modData[resizeNodeId]){ modData[resizeNodeId].pos_x = newX; modData[resizeNodeId].pos_y = newY; }
        const ns = store.data.nodes[resizeNodeId];
        if(ns){ ns.data._posX = newX; ns.data._posY = newY; }
      }
      const nd = store.data.nodes[resizeNodeId];
      if(nd){ nd.data._width = newW; nd.data._height = newH; }
    }, { passive: false, capture: true });
    document.addEventListener('touchend', function(){
      if(!resizing) return;
      resizing = false;
      if(resizeNode) resizeNode.classList.remove('resizing');
      resizeNode = null; markDirty();
    }, true);
  })();

  // 节点旋转
  (function initNodeRotation(){
    const container = editor.container;
    let rotNode = null, rotStartX = 0, rotAngle = 0, isRotating = false, isDraggingNode = false;
    container.addEventListener('mousedown', function(e){
      const nodeEl = e.target.closest('.drawflow-node');
      if(nodeEl && !e.target.closest('.input') && !e.target.closest('.output') && !nodeEl.classList.contains('locked')) isDraggingNode = true;
    }, true);
    document.addEventListener('mouseup', function(){ isDraggingNode = false; }, true);
    container.addEventListener('mousedown', function(e){
      const nodeEl = e.target.closest('.drawflow-node');
      if(!nodeEl) return;
      if(e.target.closest('.input') || e.target.closest('.output')) return;
      if(isDraggingNode) return;
      const skin = nodeEl.querySelector('.node-skin');
      if(!skin) return;
      rotNode = nodeEl; isRotating = true; rotStartX = e.clientX;
      rotAngle = parseFloat(skin.dataset.rotAngle || '0');
      e.preventDefault();
    }, true);
    document.addEventListener('mousemove', function(e){
      if(!isRotating || !rotNode) return;
      const skin = rotNode.querySelector('.node-skin');
      if(!skin) return;
      const dx = e.clientX - rotStartX;
      rotAngle += dx * 0.5; rotStartX = e.clientX;
      skin.style.transform = 'rotate('+rotAngle+'deg)';
      skin.dataset.rotAngle = String(rotAngle);
    }, true);
    function stopRotate(){ isRotating = false; rotNode = null; }
    document.addEventListener('mouseup', stopRotate, true);
    document.addEventListener('mouseleave', stopRotate, true);
  })();

  // 画布点击水墨绽放
  const cw = $('.canvas-wrap');
  if (cw){
    cw.addEventListener('click', e=>{
      if (e.target.closest('#drawflow')) return;
      if (window.__inkRipple) window.__inkRipple.triggerSplash(0.6);
    });
  }

  // 框选
  const canvasWrap = $('.canvas-wrap');
  let boxRect = null, boxDragging = false;
  canvasWrap.addEventListener('mousedown', e=>{
    if(e.target.closest('#drawflow')) return;
    if(e.target === canvasWrap || (e.target.classList.contains('canvas-wrap') && !e.target.closest('#drawflow'))){
      if(e.shiftKey){
        e.preventDefault(); boxDragging = true;
        const rect = $('#drawflow').getBoundingClientRect();
        store.boxSelect.active = true;
        store.boxSelect.startX = e.clientX - rect.left;
        store.boxSelect.startY = e.clientY - rect.top;
        store.boxSelect.curX = store.boxSelect.startX;
        store.boxSelect.curY = store.boxSelect.startY;
        boxRect = document.createElement('div');
        boxRect.className = 'box-select-rect';
        boxRect.style.left = store.boxSelect.startX+'px';
        boxRect.style.top = store.boxSelect.startY+'px';
        boxRect.style.width = '0px'; boxRect.style.height = '0px';
        canvasWrap.appendChild(boxRect);
      }
    }
  });
  canvasWrap.addEventListener('mousemove', e=>{
    if(e.target.closest('#drawflow')) return;
    if(!boxDragging || !boxRect) return;
    const rect = $('#drawflow').getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    store.boxSelect.curX = cx; store.boxSelect.curY = cy;
    const x = Math.min(store.boxSelect.startX, cx), y = Math.min(store.boxSelect.startY, cy);
    const w = Math.abs(cx - store.boxSelect.startX), h = Math.abs(cy - store.boxSelect.startY);
    boxRect.style.left = x+'px'; boxRect.style.top = y+'px';
    boxRect.style.width = w+'px'; boxRect.style.height = h+'px';
  });
  canvasWrap.addEventListener('mouseup', e=>{
    if(e.target.closest('#drawflow')) return;
    if(!boxDragging) return;
    boxDragging = false;
    if(boxRect){
      const bx = parseFloat(boxRect.style.left), by = parseFloat(boxRect.style.top);
      const bw = parseFloat(boxRect.style.width), bh = parseFloat(boxRect.style.height);
      if(bw > 5 && bh > 5){
        store.selectedIds = []; store.selectedId = null;
        document.querySelectorAll('#drawflow .drawflow-node.selected').forEach(n=>n.classList.remove('selected'));
        const nodes = document.querySelectorAll('#drawflow .drawflow-node:not(.parent-node .parent-node)');
        nodes.forEach(nd=>{
          const nx = nd.offsetLeft, ny = nd.offsetTop, nw = nd.offsetWidth, nh = nd.offsetHeight;
          if(nx+nw > bx && nx < bx+bw && ny+nh > by && ny < by+bh){
            const nid = nd.id.slice(5);
            store.selectedIds.push(nid); nd.classList.add('selected');
          }
        });
        if(store.selectedIds.length > 1) store.selectedId = null;
        else if(store.selectedIds.length === 1) store.selectedId = store.selectedIds[0];
        renderInspector();
      }
      boxRect.remove(); boxRect = null;
    }
    store.boxSelect.active = false;
  });
}

/* ============================================================
   palette —— 左侧拖拽创建节点
============================================================ */
export function initPalette(){
  console.log('[initPalette] starting, TYPE_META=', TYPE_META);
  const cards = document.querySelectorAll('.asset-card');
  console.log('[initPalette] found', cards.length, 'asset cards');
  cards.forEach(card=>{
    card.addEventListener('dragstart', e=>{
      console.log('[dragstart]', card.dataset.type);
      e.dataTransfer.setData('text/node-type', card.dataset.type);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });
  const df = $('#drawflow');
  console.log('[initPalette] drawflow element=', df);
  if(!df) { console.error('[initPalette] #drawflow not found!'); return; }
  df.addEventListener('dragover', e=>{ e.preventDefault(); e.dataTransfer.dropEffect='copy'; });
  df.addEventListener('drop', e=>{
    console.log('[drop] event received');
    e.preventDefault();
    const type = e.dataTransfer.getData('text/node-type');
    console.log('[drop] type=', type, 'valid=', !!TYPE_META[type]);
    if(!type || !TYPE_META[type]) return;
    const ed = store.editor;
    console.log('[drop] editor=', ed);
    if(!ed) { console.error('[drop] store.editor is null!'); return; }
    const preLeft = ed.precanvas.getBoundingClientRect().left;
    const preTop = ed.precanvas.getBoundingClientRect().top;
    const x = (e.clientX - preLeft) / ed.zoom;
    const y = (e.clientY - preTop) / ed.zoom;
    console.log('[drop] creating node at', x, y);
    createNode(type, x - 100, y - 30);
  });
  const toggleBtn = $('#palette-toggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', ()=>{
      const mainEl = $('.main');
      if(!mainEl) return;
      const collapsed = mainEl.classList.toggle('palette-collapsed');
      toggleBtn.textContent = collapsed ? '»' : '«';
      toggleBtn.title = collapsed ? '展开资产区' : '收缩资产区';
    });
  }
}

export function initPalette3DSpheres(){
  if(typeof Sphere3D === 'undefined' || typeof THREE === 'undefined'){
    console.warn('[3D球体] Sphere3D 或 Three.js 未加载，跳过初始化');
    return;
  }
  const charContainer = document.getElementById('char-3d-sphere');
  const sceneContainer = document.getElementById('scene-3d-sphere');
  try{
    if(charContainer){
      const charSphere = new Sphere3D(charContainer, { bgColor: 0x1a1a2e, autoRotateSpeed: 0.008, fov: 50 });
      charSphere.loadImage('mqsfbu71-image.png').then(()=>{ charSphere.startAutoRotate(); }).catch(()=>{ charSphere.setBackgroundColor(0x2d1f3d); charSphere.startAutoRotate(); });
      charSphere.disableDrag();
    }
  }catch(err){ console.error('[3D球体] 角色球体初始化失败:', err); }
  try{
    if(sceneContainer){
      const sceneSphere = new Sphere3D(sceneContainer, { bgColor: 0x1a2e1a, autoRotateSpeed: 0.006, fov: 50 });
      sceneSphere.loadImage('mqsg78bg-drawing-2026-06-24T19-10-14-997Z.png').then(()=>{ sceneSphere.startAutoRotate(); }).catch(()=>{ sceneSphere.setBackgroundColor(0x1a3d2f); sceneSphere.startAutoRotate(); });
      sceneSphere.disableDrag();
    }
  }catch(err){ console.error('[3D球体] 场景球体初始化失败:', err); }
}

export function createNode(type, posX, posY){
  console.log('[createNode] type=', type, 'pos=', posX, posY);
  console.log('[createNode] SCHEMA[type]=', SCHEMA[type]);
  console.log('[createNode] TYPE_META[type]=', TYPE_META[type]);
  console.log('[createNode] store.editor=', !!store.editor);
  try {
    const data = {};
    SCHEMA[type].forEach(f=>{ data[f.key]=schemaDefaultValue(f); });
    console.log('[createNode] data=', data);
    const html = buildNodeHtml(type, data);
    console.log('[createNode] html length=', html.length);
    store.pendingNodes.push({ type, data, select:true });
    const inputs = nodeInputCount(type);
    const outputs = nodeOutputCount(type);
    console.log('[createNode] calling addNode with', type, inputs, outputs, posX, posY);
    const nodeId = store.editor.addNode(type, inputs, outputs, posX, posY, TYPE_META[type].cls, data, html, false);
    console.log('[createNode] addNode returned id=', nodeId);
    updateEmpty();
  } catch(err) {
    console.error('[createNode] FAILED:', err);
  }
}

export function duplicateNode(srcId){
  const src = store.data.nodes[srcId];
  if(!src) return;
  const exp = store.editor.export().drawflow.Home.data[srcId];
  const x = (exp?exp.pos_x:0)+40, y=(exp?exp.pos_y:0)+40;
  const data = {...src.data};
  const html = buildNodeHtml(src.type, data);
  store.pendingNodes.push({ type: src.type, data, select:true });
  const inputs = nodeInputCount(src.type);
  const outputs = nodeOutputCount(src.type);
  store.editor.addNode(src.type, inputs, outputs, x, y, TYPE_META[src.type].cls, data, html, false);
  updateEmpty();
}

/* ============================================================
   clipboard —— 复制粘贴
============================================================ */
let clipData = null;

export function copyNodeToClipboard(nodeId){
  const node = store.data.nodes[nodeId];
  if(!node) return;
  const exp = store.editor.export().drawflow.Home.data[nodeId];
  clipData = { type: node.type, data: {...node.data}, pos_x: exp ? exp.pos_x : 0, pos_y: exp ? exp.pos_y : 0 };
  try{ navigator.clipboard.writeText(JSON.stringify(clipData)); }catch(_){}
}

export function pasteFromClipboard(){
  if(!clipData) return;
  const { type, data, pos_x, pos_y } = clipData;
  const html = buildNodeHtml(type, data);
  store.pendingNodes.push({ type, data, select:true });
  const inputs = nodeInputCount(type);
  const outputs = nodeOutputCount(type);
  store.editor.addNode(type, inputs, outputs, pos_x+40, pos_y+40, TYPE_META[type].cls, data, html, false);
  updateEmpty();
}

export function initClipboardKeys(){
  document.addEventListener('keydown', e=>{
    const tag = (e.target.tagName||'').toLowerCase();
    const editing = tag==='input'||tag==='textarea'||tag==='select';
    if(editing) return;
    if(e.ctrlKey && e.key === 'c' && store.selectedId && typeof store.selectedId === 'string'){
      e.preventDefault(); copyNodeToClipboard(store.selectedId);
    }
    if(e.ctrlKey && e.key === 'v'){
      e.preventDefault();
      try{
        navigator.clipboard.readText().then(text=>{
          try{
            const parsed = JSON.parse(text);
            if(parsed.type && parsed.data){ clipData = parsed; pasteFromClipboard(); }
          }catch(_){}
        }).catch(()=>{});
      }catch(_){}
    }
  });
}

/* ============================================================
   Markdown 导出/导入 + AI
============================================================ */
const AI_SETTINGS_KEY = 'comic-canvas:ai-settings';
export function getAiSettings(){
  try{ return JSON.parse(localStorage.getItem(AI_SETTINGS_KEY)) || {}; }
  catch(_){ return {}; }
}
export function saveAiSettings(s){
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(s));
}

export function openAiSettings(){
  const modal = $('#ai-settings-modal');
  const s = getAiSettings();
  $('#ai-endpoint').value = s.endpoint || '';
  $('#ai-api-key').value = s.apiKey || '';
  $('#ai-model').value = s.model || '';
  modal.style.display = 'flex';
}
export function closeAiSettings(){
  $('#ai-settings-modal').style.display = 'none';
}
export function doSaveAiSettings(){
  saveAiSettings({
    endpoint: $('#ai-endpoint').value.trim(),
    apiKey: $('#ai-api-key').value.trim(),
    model: $('#ai-model').value.trim(),
  });
  closeAiSettings();
}

export function doExportMd(){
  const data = serialize();
  const lines = [];
  lines.push('# 漫剧画布 · 项目导出');
  lines.push('');
  lines.push('> 导出时间：' + new Date().toLocaleString('zh-CN'));
  lines.push('');
  const typeOrder = ['char','container','shot','page','line'];
  const nodesByType = {};
  typeOrder.forEach(t => nodesByType[t] = []);
  Object.keys(data.nodes).forEach(id => {
    const n = data.nodes[id];
    if(nodesByType[n.type]) nodesByType[n.type].push({id, ...n});
  });
  const sectionMeta = {
    char: {icon:'🎭', title:'角色'},
    container: {icon:'📁', title:'容器 / 场景资产'},
    shot: {icon:'🎬', title:'分镜'},
    page: {icon:'🖼️', title:'页面帧'},
    line: {icon:'💬', title:'台词'},
  };
  typeOrder.forEach(type => {
    const nodes = nodesByType[type];
    if(!nodes.length) return;
    const m = sectionMeta[type];
    lines.push('## ' + m.icon + ' ' + m.title);
    lines.push('');
    nodes.forEach(n => {
      const d = n.data || {};
      const titleField = TITLE_FIELD[type];
      lines.push('### ' + (d[titleField] || '未命名'));
      lines.push('');
      const schema = SCHEMA[type];
      if(schema){
        if(type === 'line'){
          const speaker = deriveLineSpeakerName(String(n.id), d);
          if(speaker) lines.push('- **说话人（由连线推断）**：' + speaker);
        }
        schema.forEach(f => {
          if(f.key === titleField) return;
          const v = d[f.key];
          if(v != null && v !== '') lines.push('- **' + f.label + '**：' + v);
        });
      }
      lines.push('');
    });
  });
  const edgeKeys = Object.keys(data.edges);
  if(edgeKeys.length){
    lines.push('## 🔗 连线关系');
    lines.push('');
    edgeKeys.forEach(eid => {
      const e = data.edges[eid];
      const fromNode = data.nodes[e.from];
      const toNode = data.nodes[e.to];
      if(fromNode && toNode){
        const fromTitle = getNodeTitle(fromNode);
        const toTitle = getNodeTitle(toNode);
        let desc = '- ' + fromTitle + ' → ' + toTitle;
        if(e.label) desc += '（' + e.label + '）';
        lines.push(desc);
      }
    });
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('<details><summary>📦 项目数据快照（点击展开）</summary>');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(data, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('</details>');
  lines.push('');
  const md = lines.join('\n');
  const blob = new Blob([md], {type:'text/markdown;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  const stamp = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0')
    + '-' + String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0');
  a.href = url; a.download = '漫剧画布-' + stamp + '.md';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function getNodeTitle(n){
  const d = n.data || {};
  return d.name || d.no || d.page_id || d.title || d.content || d.label || '未命名';
}

export function doImportMd(file){
  const reader = new FileReader();
  reader.onload = function(){
    const text = reader.result;
    var jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if(jsonMatch){
      try{
        var obj = JSON.parse(jsonMatch[1]);
        if(obj && obj.app === 'comic-canvas' && obj.nodes){ loadFrom(obj); return; }
      }catch(_){}
    }
    var settings = getAiSettings();
    if(settings.apiKey && settings.endpoint){
      analyzeWithAi(text, settings);
    } else {
      var hasSettings = settings.apiKey || settings.endpoint;
      var msg = '该 Markdown 文件不包含项目数据快照。\n\n';
      if(hasSettings){ msg += '已配置的 AI 设置不完整，请检查 API 地址和 Key。'; }
      else { msg += '如需 AI 自动分析内容并生成节点，请先在菜单中配置 AI 设置。'; }
      alert(msg);
    }
  };
  reader.readAsText(file);
}

var aiLastText = '';

export function analyzeWithAi(mdText, settings){
  aiLastText = mdText;
  var overlay = $('#ai-loading-overlay');
  var loadingText = $('#ai-loading-text');
  overlay.style.display = 'flex';
  loadingText.textContent = 'AI 正在分析内容…';

  var systemPrompt = ''
    + '你是一个专业的漫剧/漫画创作助手，擅长把各种格式的文本解析为结构化的画布节点。\n\n'
    + '## 你的任务\n'
    + '分析用户提供的文本（可能是 Markdown、剧本、小说、纯文本），提取角色、容器场景资产、分镜、页面帧、台词等元素，'
    + '转化为漫剧画布的节点和连线结构。\n\n'
    + '## 节点类型与字段（务必严格遵守字段取值约束）\n'
    + '- char（角色）：name(必填,姓名), role(身份职能), face_hair(脸型与发型), outfit(主服装), persona(性格驱动), identity_lock(身份锁)\n'
    + '- container（容器/场景资产）：title(必填,标题), content_type(类型, chapter/scene/prop/asset/location/mixed), desc(描述), mood(氛围), topology(空间拓扑), continuity_lock(一致性锁)\n'
    + '- shot（分镜）：no(必填,镜号如S01), purpose(镜头目的), size(景别), camera_angle(机位角度), move(镜头运动), dur(时长秒数), desc(必填,画面描述), start_state(起始状态), end_state(结束状态), continuity(连续性依赖), visual_title(视觉基调名), art_direction(美术方向), palette(调色板)\n'
    + '- page（页面帧）：page_id(必填,页面ID), page_type(类型), linked_shot(关联镜头), purpose(页面目的), composition(构图), peak_moment(关键瞬间)\n'
    + '- line（台词）：content(必填,台词内容), mood(情绪), subtext(潜台词), speaker(可选,仅作无连线时回退)\n\n'
    + '## 格式识别策略（自动适配多种输入）\n'
    + '1. 若文本是「漫剧画布导出的 Markdown」：识别 `## 🎭 角色`、`## 📁 容器 / 场景资产`、`## 🎬 分镜`、`## 🖼️ 页面帧`、`## 💬 台词` 等分区标题；'
    + '每个 `### 标题` 是一个节点的标题字段（角色→name、容器→title、分镜→no、页面帧→page_id、台词→content）；'
    + '形如 `- **字段名**：值` 的列表项对应同名字段（如"**身份**：主角"→role="主角"，"**性格**：勇敢"→persona="勇敢"）。'
    + '`## 🔗 连线关系` 区的 `A → B` 描述需转为 edges。\n'
    + '2. 若文本是「剧本/脚本」：`[场景名]` 或「场景：xx」提取为 container 节点；'
    + '形如「角色名：台词」或「角色名（情绪）：台词」的行提取为 line 节点（括号内为 mood），并尽量建立角色到台词的直接连线；'
    + '可按出场顺序补充 shot 分镜节点和 page 页面帧节点串联叙事。\n'
    + '3. 若文本是「小说/散文」：从中识别人物→char、关键地点/物品→container、重要对话→line、镜头设计→shot，并按情节顺序建立连线。\n'
    + '4. 其它纯文本：尽力推断最贴切的节点类型，宁缺毋滥，但至少产出几个核心节点。\n\n'
    + '## 连线规则\n'
    + '- 每条边用 {"from":"源id","to":"目标id","out_port":"output_1","in_port":"input_1"} 表示；台词节点优先只使用 `output_1` / `input_1`；'
    + '- 按"容器→分镜""分镜→页面帧""角色→其首句台词""分镜→台词"等叙事逻辑合理串联，避免出现孤立节点。\n\n'
    + '## 输出格式（极其重要）\n'
    + '只返回一个 JSON 对象，禁止任何额外文字、解释或 markdown 代码块标记。结构：\n'
    + '{"nodes":[{"id":"1","type":"char","data":{"name":"小明","role":"主角"}},'
    + '{"id":"2","type":"line","data":{"speaker":"小明","content":"你好！","mood":"喜悦"}}],'
    + '"edges":[{"from":"1","to":"2","out_port":"output_1","in_port":"input_1"}]}\n'
    + '- id 用字符串数字 "1","2","3"…按节点出现顺序递增。\n'
    + '- 缺失的字段可省略，但必填字段不可省略且不可为空。\n'
    + '- 字段取值必须符合上面"仅限"约束，超出范围的值请映射到最接近的合法值或留空。\n\n'
    + '## 示例\n'
    + '输入：\n```\n## 🎭 角色\n\n### 小明\n\n- **身份**：主角\n- **性格**：勇敢、善良\n\n## 💬 台词\n\n### 小明\n\n- **内容**：我一定会拯救大家！\n- **情绪**：激动\n```\n'
    + '输出：\n'
    + '{"nodes":[{"id":"1","type":"char","data":{"name":"小明","role":"主角","persona":"勇敢、善良"}},'
    + '{"id":"2","type":"line","data":{"speaker":"小明","content":"我一定会拯救大家！","mood":"激动"}}],'
    + '"edges":[{"from":"1","to":"2","out_port":"output_1","in_port":"input_1"}]}';

  fetch(settings.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + settings.apiKey },
    body: JSON.stringify({
      model: settings.model || 'gpt-4o',
      messages: [
        {role: 'system', content: systemPrompt},
        {role: 'user', content: '请将以下内容转化为漫剧画布节点：\n\n' + mdText}
      ],
      temperature: 0.3,
    }),
  })
  .then(function(resp){ return resp.json(); })
  .then(function(result){
    overlay.style.display = 'none';
    var content = '';
    if(result.choices && result.choices[0]){
      content = result.choices[0].message.content;
    } else if(result.error){
      showAiPreview(null, mdText, 'AI 分析失败：' + (result.error.message || JSON.stringify(result.error)));
      return;
    } else {
      showAiPreview(null, mdText, 'AI 返回格式异常（未找到 choices）');
      return;
    }
    content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    try{
      var parsed = JSON.parse(content);
      if(parsed.nodes && Array.isArray(parsed.nodes)){
        showAiPreview(parsed, mdText, null);
      } else {
        showAiPreview(null, mdText, 'AI 返回的数据缺少 nodes 数组');
      }
    }catch(err){
      showAiPreview(null, mdText, '解析 AI 返回的 JSON 失败：' + err.message, content);
    }
  })
  .catch(function(err){
    overlay.style.display = 'none';
    showAiPreview(null, mdText, 'AI 请求失败：' + err.message);
  });
}

var aiPreviewResult = null;
var AI_TITLE_FIELD = TITLE_FIELD;
var AI_PREVIEW_ORDER = [
  {type:'char',   icon:'🎭', title:'角色'},
  {type:'container', icon:'📁', title:'容器 / 场景资产'},
  {type:'shot',   icon:'🎬', title:'分镜'},
  {type:'page',   icon:'🖼️', title:'页面帧'},
  {type:'line',   icon:'💬', title:'台词'},
];

export function showAiPreview(parsed, rawText, errMsg, rawContent){
  aiPreviewResult = parsed;
  var overlay = $('#ai-preview-overlay');
  var body = $('#ai-preview-body');
  var applyBtn = $('#ai-preview-apply');
  var retryBtn = $('#ai-preview-retry');
  applyBtn.style.display = parsed ? '' : 'none';

  var html = '';
  if(errMsg){ html += '<div class="ai-preview-error">' + escapeHtml(errMsg) + '</div>'; }

  if(parsed && parsed.nodes){
    var nodes = parsed.nodes;
    var edges = parsed.edges || [];
    var byType = {};
    nodes.forEach(function(n){
      var t = normalizeNodeType(n.type || 'shot');
      if(!byType[t]) byType[t] = [];
      byType[t].push({...n, data: migrateLegacyNodeData(n.type || t, n.data || {}, n.id || '')});
    });
    html += '<div class="ai-preview-stats">';
    html += '<span class="ai-preview-stat">共 <span class="num">' + nodes.length + '</span> 个节点</span>';
    html += '<span class="ai-preview-stat"><span class="num">' + edges.length + '</span> 条连线</span>';
    AI_PREVIEW_ORDER.forEach(function(g){
      if(byType[g.type]) html += '<span class="ai-preview-stat">' + g.icon + ' ' + g.title + ' <span class="num">' + byType[g.type].length + '</span></span>';
    });
    html += '</div>';
    html += '<div class="ai-preview-summary">确认无误后点击「应用到画布」即可生成节点；不满意可「重新分析」。</div>';
    html += '<div class="ai-preview-nodes">';
    AI_PREVIEW_ORDER.forEach(function(g){
      var list = byType[g.type];
      if(!list || !list.length) return;
      html += '<div class="ai-preview-group-title">' + g.icon + ' ' + g.title + '（' + list.length + '）</div>';
      list.forEach(function(n){
        var d = n.data || {};
        var titleField = AI_TITLE_FIELD[g.type];
        var title = d[titleField] || ('未命名 ' + g.title);
        var schema = SCHEMA[g.type] || [];
        var subBits = [];
        for(var i = 0; i < schema.length && subBits.length < 2; i++){
          var f = schema[i];
          if(f.key === titleField) continue;
          var v = d[f.key];
          if(v != null && v !== '') subBits.push(f.label + '：' + v);
        }
        var sub = subBits.length ? ' <span style="color:var(--muted)">· ' + escapeHtml(subBits.join(' / ')) + '</span>' : '';
        html += '<div class="ai-preview-node-item">' + escapeHtml(title) + sub + '</div>';
      });
    });
    html += '</div>';
  } else if(rawContent){
    html += '<div class="ai-preview-raw">' + escapeHtml(rawContent) + '</div>';
  }

  body.innerHTML = html;
  overlay.style.display = 'flex';
}

export function closeAiPreview(){
  $('#ai-preview-overlay').style.display = 'none';
}

export function openAiPaste(){
  $('#ai-paste-overlay').style.display = 'flex';
  setTimeout(function(){ $('#ai-paste-textarea').focus(); }, 50);
}
export function closeAiPaste(){
  $('#ai-paste-overlay').style.display = 'none';
}
export function doAiPasteSubmit(){
  var text = $('#ai-paste-textarea').value.trim();
  if(!text){ alert('请先粘贴需要分析的文本内容'); return; }
  var settings = getAiSettings();
  if(!(settings.apiKey && settings.endpoint)){ alert('请先在「AI 设置」中配置 API 地址和 Key。'); closeAiPaste(); openAiSettings(); return; }
  closeAiPaste();
  $('#ai-paste-textarea').value = '';
  analyzeWithAi(text, settings);
}

export function loadFromAiResult(parsed){
  store.mutingDirty = true;
  clearCanvas(false);
  idMap = {};
  edgeIdCounter = 0;
  var cols = Math.max(4, Math.min(8, Math.floor((window.innerWidth - 360) / 220)));
  var gapX = 220, gapY = 200, startX = 80, startY = 80;
  parsed.nodes.forEach(function(n, idx){
    var type = normalizeNodeType(n.type || 'shot');
    var sourceData = migrateLegacyNodeData(n.type || type, n.data || {}, n.id || idx + 1);
    var data = {};
    var schema = SCHEMA[type];
    if(schema){ schema.forEach(function(f){ data[f.key] = sourceData[f.key] || schemaDefaultValue(f); }); }
    if(type === 'line' && sourceData.speaker) data.speaker = sourceData.speaker;
    var requiredField = TITLE_FIELD[type];
    if(requiredField && !data[requiredField]){ data[requiredField] = sourceData[requiredField] || TYPE_META[type].label; }
    var col = idx % cols, row = Math.floor(idx / cols);
    var posX = startX + col * gapX + (Math.random() * 16 - 8);
    var posY = startY + row * gapY + (Math.random() * 16 - 8);
    var html = buildNodeHtml(type, data);
    var inputs = nodeInputCount(type), outputs = nodeOutputCount(type);
    store.pendingNodes.push({type: type, data: data, select: false, remap: String(n.id)});
    store.editor.addNode(type, inputs, outputs, posX, posY, TYPE_META[type].cls, data, html, false);
  });
  if(parsed.edges && Array.isArray(parsed.edges)){
    parsed.edges.forEach(function(e){
      var outN = idMap[String(e.from)], inN = idMap[String(e.to)];
      if(outN == null || inN == null) return;
      var outPort = e.out_port || 'output_1', inPort = e.in_port || 'input_1';
      try{ store.editor.addConnection(outN, inN, outPort, inPort); }catch(_){}
    });
  }
  setTimeout(function(){
    store.mutingDirty = false;
    resetHistoryToCurrent();
    doSave();
  }, 200);
}

/* ============================================================
   文件菜单 & 工具栏
============================================================ */
const fileMenuActions = {
  'new': function(){ if(!Object.keys(store.data.nodes).length || confirm('确定要新建画布吗？当前内容会先自动备份。')) clearCanvas(true); },
  'save': function(){ doSave(); },
  'import': function(){
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json,.md,.markdown';
    inp.onchange = function(){
      var f = inp.files[0];
      if(!f) return;
      if(/\.(md|markdown)$/i.test(f.name)) doImportMd(f);
      else doImport(f);
    };
    inp.click();
  },
  'export': function(){
    if(confirm('导出为 JSON？\n\n点击「确定」导出 JSON\n点击「取消」导出 Markdown')) doExport();
    else doExportMd();
  },
  'undo': function(){ histUndo(); },
  'redo': function(){ histRedo(); },
  'ai-settings': function(){ openAiSettings(); },
  'ai-paste': function(){ openAiPaste(); },
};

export function handleMenuAction(action){
  var fn = fileMenuActions[action];
  if(fn) fn();
  closeFileMenu();
}

export function closeFileMenu(){
  var dd = document.querySelector('.nav-item-dropdown.open');
  if(dd) dd.classList.remove('open');
}

export function updateToggleIndicator(id, on){
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = on ? '●' : '○';
  el.className = 'toggle-indicator ' + (on ? 'on' : 'off');
}

export function initToolbar(){
  const bind = (sel, evt, fn) => { const el = $(sel); if(el) el[evt] = fn; };
  const menuBtn = $('#btn-menu');
  const menuPanel = $('#menu-panel');
  if(menuBtn && menuPanel){
    menuBtn.onclick = (e)=>{
      e.stopPropagation();
      const isOpen = menuPanel.classList.toggle('open');
      menuBtn.classList.toggle('active', isOpen);
    };
    menuPanel.querySelectorAll('.menu-item').forEach(item=>{
      item.addEventListener('click', ()=>{
        menuPanel.classList.remove('open');
        menuBtn.classList.remove('active');
      });
    });
    document.addEventListener('click', (e)=>{
      if(!menuBtn.contains(e.target) && !menuPanel.contains(e.target)){
        menuPanel.classList.remove('open');
        menuBtn.classList.remove('active');
      }
    });
  }
  const projBtn = $('#btn-projects');
  if(projBtn) projBtn.onclick = ()=>{ location.href = 'index-entry.html'; };
  bind('#btn-export','onclick', doExport);
  bind('#btn-import','onclick', ()=>$('#file-input').click());
  bind('#file-input','onchange', e=>{ if(e.target.files[0]) doImport(e.target.files[0]); e.target.value=''; });
  bind('#btn-export-md','onclick', doExportMd);
  bind('#btn-import-md','onclick', ()=>$('#file-input-md').click());
  bind('#file-input-md','onchange', e=>{ if(e.target.files[0]) doImportMd(e.target.files[0]); e.target.value=''; });
  bind('#ai-settings-close','onclick', closeAiSettings);
  bind('#ai-settings-cancel','onclick', closeAiSettings);
  bind('#ai-settings-save','onclick', doSaveAiSettings);
  bind('#ai-settings-modal','onclick', function(e){ if(e.target === this) closeAiSettings(); });
  bind('#btn-ai-settings','onclick', openAiSettings);
  bind('#btn-ai-paste','onclick', openAiPaste);
  bind('#ai-paste-close','onclick', closeAiPaste);
  bind('#ai-paste-cancel','onclick', closeAiPaste);
  bind('#ai-paste-overlay','onclick', function(e){ if(e.target === this) closeAiPaste(); });
  bind('#ai-paste-submit','onclick', doAiPasteSubmit);
  bind('#ai-preview-close','onclick', closeAiPreview);
  bind('#ai-preview-overlay','onclick', function(e){ if(e.target === this) closeAiPreview(); });
  bind('#ai-preview-apply','onclick', ()=>{ if(aiPreviewResult){ loadFromAiResult(aiPreviewResult); closeAiPreview(); } });
  bind('#ai-preview-retry','onclick', ()=>{
    if(!aiLastText){ alert('没有可重新分析的文本。'); return; }
    var settings = getAiSettings();
    if(!(settings.apiKey && settings.endpoint)){ alert('请先在菜单中配置 AI 设置。'); return; }
    analyzeWithAi(aiLastText, settings);
  });
  bind('#btn-new','onclick', ()=>{
    if(!confirm('确定要新建空白画布吗？当前内容会先自动备份到浏览器（可在 localStorage 恢复）。')) return;
    clearCanvas(true);
  });
  bind('#btn-undo','onclick', histUndo);
  bind('#btn-redo','onclick', histRedo);
  bind('#btn-clear','onclick', ()=>{
    if(!Object.keys(store.data.nodes).length){ alert('画布已经是空的了。'); return; }
    if(!confirm('确定要清空画布吗？当前内容会先自动备份到浏览器。')) return;
    clearCanvas(true);
  });
  const zoomInBtn = $('#btn-zoom-in');
  if(zoomInBtn) zoomInBtn.onclick = ()=>{ store.editor.zoom_in(); updateZoomPct(); };
  const zoomOutBtn = $('#btn-zoom-out');
  if(zoomOutBtn) zoomOutBtn.onclick = ()=>{ store.editor.zoom_out(); updateZoomPct(); };
  const zoomFitBtn = $('#btn-zoom-fit');
  if(zoomFitBtn) zoomFitBtn.onclick = ()=>{ store.editor.canvas_x = 0; store.editor.canvas_y = 0; store.editor.zoom_reset(); updateZoomPct(); };
  bind('#btn-zoom-in-f','onclick', ()=>{ store.editor.zoom_in(); updateZoomPct(); });
  bind('#btn-zoom-out-f','onclick', ()=>{ store.editor.zoom_out(); updateZoomPct(); });
  bind('#btn-zoom-fit-f','onclick', ()=>{ store.editor.canvas_x = 0; store.editor.canvas_y = 0; store.editor.zoom_reset(); updateZoomPct(); });
  bind('#btn-grid','onclick', ()=>{
    store.showGrid = !store.showGrid;
    const df = $('#drawflow');
    if(!store.showGrid) df.style.backgroundImage = 'none';
    else df.style.backgroundImage = '';
    updateToggleIndicator('grid-indicator', store.showGrid);
  });
  bind('#btn-snap','onclick', ()=>{
    store.snapToGrid = !store.snapToGrid;
    updateToggleIndicator('snap-indicator', store.snapToGrid);
  });
  store.snapToNode = false;
  bind('#btn-snap-node','onclick', ()=>{
    store.snapToNode = !store.snapToNode;
    updateToggleIndicator('snap-node-indicator', store.snapToNode);
  });
  store.snapToPort = true;
  bind('#btn-snap-port','onclick', ()=>{
    store.snapToPort = !store.snapToPort;
    updateToggleIndicator('snap-port-indicator', store.snapToPort);
  });
  updateToggleIndicator('grid-indicator', store.showGrid);
  updateToggleIndicator('snap-indicator', store.snapToGrid);
  updateToggleIndicator('snap-node-indicator', store.snapToNode);
  updateToggleIndicator('snap-port-indicator', store.snapToPort);

  bind('#nav-file-btn', 'onclick', function(e){ e.preventDefault(); e.stopPropagation(); toggleFileMenu(); });
  document.addEventListener('click', function(e){ if(!e.target.closest('.nav-item-dropdown')) closeFileMenu(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeFileMenu(); });

  var fileMenu = $('#file-menu');
  if(fileMenu){
    fileMenu.addEventListener('click', function(e){
      var btn = e.target.closest('.menu-item');
      if(btn){ var action = btn.dataset.action; if(action) handleMenuAction(action); }
    });
  }
  var mobileMenu = $('#mobile-menu');
  if(mobileMenu){
    mobileMenu.addEventListener('click', function(e){
      var btn = e.target.closest('.mobile-menu-item');
      if(btn){
        var action = btn.dataset.action;
        if(action){ handleMenuAction(action); mobileMenu.classList.remove('active'); }
      }
    });
  }
  document.addEventListener('keydown', function(e){
    var tag = (e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea'||tag==='select'||e.target.isContentEditable) return;
    var ctrl = e.ctrlKey || e.metaKey;
    if(!ctrl) return;
    if(e.altKey && (e.key==='n'||e.key==='N')){ e.preventDefault(); handleMenuAction('new'); return; }
    if(e.shiftKey){
      var shiftMap = { 'S':'export', 'V':'ai-paste', 'Z':'redo' };
      if(shiftMap[e.key]){ e.preventDefault(); handleMenuAction(shiftMap[e.key]); }
    } else {
      var map = { 's':'save', 'o':'import' };
      if(map[e.key]){ e.preventDefault(); handleMenuAction(map[e.key]); }
    }
  });
}

function toggleFileMenu(){
  var dd = document.querySelector('.nav-item-dropdown');
  if(dd) dd.classList.toggle('open');
}

/* ============================================================
   节点颜色标签
============================================================ */
export function setNodeColor(id, color){
  const node = store.data.nodes[id];
  if(!node) return;
  node.data._color = color;
  const el = document.querySelector(`#node-${id}`);
  if(el){
    let tag = el.querySelector('.node-color-tag');
    if(!tag){ tag = document.createElement('div'); tag.className = 'node-color-tag'; el.insertBefore(tag, el.firstChild); }
    tag.style.background = color;
  }
  markDirty();
}

export function removeNodeColor(id){
  const node = store.data.nodes[id];
  if(!node) return;
  delete node.data._color;
  const el = document.querySelector(`#node-${id} .node-color-tag`);
  if(el) el.remove();
  markDirty();
}

/* ============================================================
   节点锁定
============================================================ */
export function toggleNodeLock(id){
  const node = store.data.nodes[id];
  if(!node) return;
  node.data._locked = !node.data._locked;
  const el = document.querySelector(`#node-${id}`);
  if(el){
    el.classList.toggle('locked', node.data._locked);
    let badge = el.querySelector('.lock-badge');
    if(node.data._locked){
      if(!badge){ badge = document.createElement('div'); badge.className = 'lock-badge'; badge.textContent = '🔒'; el.appendChild(badge); }
    } else if(badge){ badge.remove(); }
  }
  haptic('light');
  markDirty();
  return node.data._locked;
}

export function initLockInterceptor(){
  const df = $('#drawflow');
  df.addEventListener('mousedown', e=>{
    const nodeEl = e.target.closest('.drawflow-node');
    if(nodeEl && nodeEl.classList.contains('locked')){ e.stopPropagation(); e.preventDefault(); haptic('error'); }
  }, true);
  df.addEventListener('touchstart', e=>{
    const nodeEl = e.target.closest('.drawflow-node');
    if(nodeEl && nodeEl.classList.contains('locked')){ e.stopPropagation(); e.preventDefault(); haptic('error'); }
  }, true);
}

/* ============================================================
   节点缩略图
============================================================ */
export function setNodeThumb(id, dataUrl){
  const node = store.data.nodes[id];
  if(!node) return;
  node.data._thumb = dataUrl;
  const skin = document.querySelector(`#node-${id} .node-skin, #node-${id} .comet-card`);
  if(skin){
    if(node.type === 'char'){
      const img = skin.querySelector('[data-role="char-img"]');
      if(img){ img.src = dataUrl; img.classList.add('loaded'); const placeholder = skin.querySelector('.comet-card-placeholder'); if(placeholder) placeholder.style.display = 'none'; }
      const label = skin.querySelector('.card-label');
      if(label){ const name = node.data.name || '新角色'; label.textContent = name; }
      const idEl = skin.querySelector('.card-id');
      if(idEl){ const roleId = (node.data.role || '').slice(0,4).toUpperCase(); idEl.textContent = roleId ? '#' + roleId : '#CHAR'; }
    } else {
      skin.classList.add('has-thumb');
      let thumb = skin.querySelector('.node-thumb');
      if(!thumb){ thumb = document.createElement('div'); thumb.className = 'node-thumb'; skin.insertBefore(thumb, skin.firstChild); }
      thumb.style.backgroundImage = 'url('+dataUrl+')';
    }
  }
  markDirty();
}

/* ============================================================
   节点附件
============================================================ */
const ATTACH_MAX_FILE = 2 * 1024 * 1024;
const ATTACH_IMG_MAXDIM = 800;
const ATTACH_IMG_QUALITY = 0.85;

function getAttachments(node){
  if(!Array.isArray(node.data._attachments)) node.data._attachments = [];
  return node.data._attachments;
}

function renderAttachHtml(nodeId){
  const node = store.data.nodes[nodeId];
  if(!node) return '';
  const list = getAttachments(node);
  let items = '';
  if(list.length === 0){
    items = '<div class="attach-empty">暂无附件，点击上方按钮或拖入文件上传</div>';
  } else {
    items = list.map(a=>{
      const isImg = a.type && a.type.startsWith('image/');
      const left = isImg
        ? `<div class="attach-thumb" style="background-image:url(${a.dataUrl})" data-preview="${a.id}" title="点击预览"></div>`
        : `<div class="attach-file-ic">${fileIcon(a.name)}</div>`;
      const actions = isImg
        ? `<button class="attach-btn attach-bgremove" data-bgremove="${a.id}" title="一键抠图">✂️</button>
           <button class="attach-btn attach-del" data-del="${a.id}" title="删除附件">✕</button>`
        : `<button class="attach-btn attach-del" data-del="${a.id}" title="删除附件">✕</button>`;
      return `<div class="attach-item">${left}<div class="attach-meta"><div class="a-name" title="${escapeHtml(a.name)}">${escapeHtml(a.name)}</div><div class="a-size">${formatSize(a.size)}</div></div>${actions}</div>`;
    }).join('');
  }
  return `<div class="attach-section" id="attach-section"><div class="attach-head"><div class="attach-title">📎 附件</div><div class="attach-count">${list.length ? list.length + ' 个' : ''}</div></div><div class="attach-upload" id="attach-upload-zone"><span>📤 点击上传 或 拖入文件</span><input type="file" id="attach-file-input" multiple style="display:none" /></div><div class="attach-list">${items}</div></div>`;
}

export function syncNodeThumb(nodeId){
  const node = store.data.nodes[nodeId];
  if(!node) return;
  const firstImg = getAttachments(node).find(a=> a.type && a.type.startsWith('image/'));
  if(firstImg){
    setNodeThumb(nodeId, firstImg.dataUrl);
  } else {
    node.data._thumb = '';
    const skin = document.querySelector(`#node-${nodeId} .node-skin, #node-${nodeId} .comet-card`);
    if(skin){
      if(node.type === 'char'){
        const img = skin.querySelector('[data-role="char-img"]');
        if(img){ img.src = ''; img.classList.remove('loaded'); }
        const placeholder = skin.querySelector('.comet-card-placeholder');
        if(placeholder) placeholder.style.display = '';
      } else {
        skin.classList.remove('has-thumb');
        const thumb = skin.querySelector('.node-thumb');
        if(thumb) thumb.remove();
      }
    }
    markDirty();
  }
}

export async function removeImageBackground(nodeId, attId){
  const node = store.data.nodes[nodeId];
  if(!node) return;
  const list = getAttachments(node);
  const att = list.find(a=> a.id === attId);
  if(!att || !att.type.startsWith('image/')) return;
  if(!window.__removeBackground){ alert('抠图工具正在加载中，请稍候再试...'); return; }
  try{
    const btn = document.querySelector(`[data-bgremove="${attId}"]`);
    if(btn){ btn.disabled = true; btn.textContent = '⏳'; btn.title = '抠图处理中...'; }
    const blob = await window.__removeBackground(att.dataUrl, {
      progress: (key, current, total) => {
        if(btn && total){ const pct = Math.round(current / total * 100); btn.textContent = pct + '%'; }
      }
    });
    const resultDataUrl = await new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    att.dataUrl = resultDataUrl;
    att.size = Math.round((resultDataUrl.length - 22) * 0.75);
    att.name = att.name.replace(/\.[^.]+$/, '') + '_no_bg.png';
    att.type = 'image/png';
    syncNodeThumb(nodeId);
    renderInspector();
    haptic('success');
  } catch(err){
    console.error('抠图失败:', err);
    alert('抠图失败：' + (err.message || err));
  } finally{
    const btn = document.querySelector(`[data-bgremove="${attId}"]`);
    if(btn){ btn.disabled = false; btn.textContent = '✂️'; btn.title = '一键抠图'; }
  }
}

export async function addNodeAttachment(nodeId, file){
  const node = store.data.nodes[nodeId];
  if(!node) return;
  try{
    let dataUrl, size;
    if(isImageFile(file)){
      dataUrl = await compressImage(file);
      size = Math.round((dataUrl.length - 22) * 0.75);
    } else {
      if(file.size > ATTACH_MAX_FILE){
        alert(`「${file.name}」超过 2MB 限制（当前 ${formatSize(file.size)}），请压缩后再传或改传图片。`);
        return;
      }
      dataUrl = await fileToDataUrl(file);
      size = file.size;
    }
    const list = getAttachments(node);
    list.push({
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
      name: file.name, type: file.type || 'application/octet-stream',
      dataUrl, size, addedAt: Date.now()
    });
    syncNodeThumb(nodeId);
    renderInspector();
    haptic('light');
  }catch(err){
    console.error('附件上传失败', err);
    alert('附件上传失败：' + (err && err.message ? err.message : '未知错误'));
  }
}

export function removeNodeAttachment(nodeId, attachId){
  const node = store.data.nodes[nodeId];
  if(!node) return;
  const list = getAttachments(node);
  node.data._attachments = list.filter(a=> a.id !== attachId);
  syncNodeThumb(nodeId);
  markDirty();
  renderInspector();
  haptic('light');
}

export function previewAttachment(nodeId, attachId){
  const node = store.data.nodes[nodeId];
  if(!node) return;
  const a = getAttachments(node).find(x=> x.id === attachId);
  if(!a) return;
  let ov = document.getElementById('attach-overlay');
  if(!ov){
    ov = document.createElement('div');
    ov.id = 'attach-overlay';
    ov.className = 'attach-overlay';
    document.body.appendChild(ov);
    ov.addEventListener('click', ()=> ov.classList.remove('show'));
  }
  ov.innerHTML = `<img src="${a.dataUrl}" alt="${escapeHtml(a.name)}" />`;
  ov.classList.add('show');
}

/* ============================================================
   分组
============================================================ */
const groups = { data: {} };
let groupIdCounter = 0;

export function createGroup(nodeIds, label){
  const gid = 'g' + (++groupIdCounter);
  groups.data[gid] = {
    id: gid, label: label || '分组 ' + groupIdCounter,
    nodes: [...nodeIds], color: NODE_COLORS[groupIdCounter % NODE_COLORS.length], collapsed: false,
  };
  renderGroups();
  markDirty();
  return gid;
}

export function renderGroups(){
  const layer = $('#groups-layer');
  if(!layer) return;
  layer.innerHTML = '';
  const ed = store.editor;
  if(!ed) return;
  Object.values(groups.data).forEach(g=>{
    if(g.nodes.length < 2) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    g.nodes.forEach(nid=>{
      const el = document.querySelector(`#node-${nid}`);
      if(!el) return;
      const x = el.offsetLeft, y = el.offsetTop;
      const w = el.offsetWidth, h = el.offsetHeight;
      if(x < minX) minX = x; if(y < minY) minY = y;
      if(x+w > maxX) maxX = x+w; if(y+h > maxY) maxY = y+h;
    });
    if(minX === Infinity) return;
    const pad = 20; minX -= pad; minY -= pad; maxX += pad; maxY += pad;
    const box = document.createElement('div');
    box.className = 'group-box';
    box.style.left = minX+'px'; box.style.top = minY+'px';
    box.style.width = (maxX-minX)+'px'; box.style.height = (maxY-minY)+'px';
    box.style.borderColor = g.color+'60'; box.style.background = g.color+'08';
    box.innerHTML = `<div class="group-label" style="color:${g.color};border-color:${g.color}40">${escapeHtml(g.label)} · ${g.nodes.length} 节点</div>`;
    layer.appendChild(box);
  });
}

/* ============================================================
   小地图
============================================================ */
export function renderMinimap(){
  if(!store.editor) return;
  const ed = store.editor;
  const nodes = ed.export().drawflow.Home.data;
  const nodeIds = Object.keys(nodes);
  if(nodeIds.length === 0){
    const minimapSvg = $('#minimap-svg');
    const minimapVp = $('#minimap-vp');
    if(minimapSvg) minimapSvg.innerHTML = '';
    if(minimapVp) minimapVp.style.display = 'none';
    return;
  }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodeIds.forEach(id=>{
    const n = nodes[id];
    const el = document.querySelector('#node-'+id);
    const w = el ? el.offsetWidth : 200;
    const h = el ? el.offsetHeight : 60;
    if(n.pos_x < minX) minX = n.pos_x;
    if(n.pos_y < minY) minY = n.pos_y;
    if(n.pos_x + w > maxX) maxX = n.pos_x + w;
    if(n.pos_y + h > maxY) maxY = n.pos_y + h;
  });
  const pad = 40; minX -= pad; minY -= pad; maxX += pad; maxY += pad;
  const worldW = maxX - minX, worldH = maxY - minY;
  const mmW = 180, mmH = 135;
  const scale = Math.min(mmW / worldW, mmH / worldH);
  const offX = (mmW - worldW * scale) / 2;
  const offY = (mmH - worldH * scale) / 2;

  let svgContent = '';
  nodeIds.forEach(id=>{
    const n = nodes[id];
    const srcEl = document.querySelector('#node-'+id);
    const srcW = srcEl ? srcEl.offsetWidth : 200;
    const srcH = srcEl ? srcEl.offsetHeight : 60;
    Object.keys(n).forEach(key=>{
      if(key.startsWith('output_') && n[key] && n[key].connections){
        n[key].connections.forEach(c=>{
          const target = nodes[c.node];
          if(!target) return;
          const tgtEl = document.querySelector('#node-'+c.node);
          const tgtW = tgtEl ? tgtEl.offsetWidth : 200;
          const tgtH = tgtEl ? tgtEl.offsetHeight : 60;
          const x1 = offX + (n.pos_x + srcW/2 - minX) * scale;
          const y1 = offY + (n.pos_y + srcH/2 - minY) * scale;
          const x2 = offX + (target.pos_x + tgtW/2 - minX) * scale;
          const y2 = offY + (target.pos_y + tgtH/2 - minY) * scale;
          const connStroke = store.theme === 'light' ? '#c5c0cc' : '#34265e';
          svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${connStroke}" stroke-width="0.5"/>`;
        });
      }
    });
  });
  const typeColor = {char:'#c084fc',shot:'#818cf8',line:'#fb923c',scene:'#34d399',visual:'#22d3ee',asset:'#a3e635',page:'#f472b6',end:'#ff6b9d',container:'#64748b'};
  nodeIds.forEach(id=>{
    const n = nodes[id];
    const nodeData = store.data.nodes[id];
    const color = nodeData ? (typeColor[nodeData.type]||'#c084fc') : '#c084fc';
    const el = document.querySelector('#node-'+id);
    const nw = el ? el.offsetWidth : 200;
    const nh = el ? el.offsetHeight : 60;
    const x = offX + (n.pos_x - minX) * scale;
    const y = offY + (n.pos_y - minY) * scale;
    const w = nw * scale, h = nh * scale;
    svgContent += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${color}" opacity="0.6"/>`;
  });
  const minimapSvg = $('#minimap-svg');
  if(minimapSvg) minimapSvg.innerHTML = svgContent;
  updateMinimapViewport(minX, minY, worldW, worldH, scale, offX, offY);
}

export function updateMinimapViewport(minX, minY, worldW, worldH, scale, offX, offY){
  if(!store.editor) return;
  const ed = store.editor;
  const container = $('#drawflow');
  const rect = container.getBoundingClientRect();
  const vpLeft = (-ed.canvas_x / ed.zoom - minX);
  const vpTop = (-ed.canvas_y / ed.zoom - minY);
  const vpW = rect.width / ed.zoom;
  const vpH = rect.height / ed.zoom;
  const mx = offX + vpLeft * scale;
  const my = offY + vpTop * scale;
  const mw = vpW * scale, mh = vpH * scale;
  const minimapVp = $('#minimap-vp');
  if(minimapVp){
    minimapVp.style.left = mx+'px'; minimapVp.style.top = my+'px';
    minimapVp.style.width = mw+'px'; minimapVp.style.height = mh+'px';
    minimapVp.style.display = 'block';
  }
}

/* ============================================================
   右键菜单
============================================================ */
let ctxTargetId = null;

export function hideCtxMenu(){
  const ctxMenu = $('#ctx-menu');
  if(ctxMenu) ctxMenu.classList.remove('show');
}

export function initEnhancedContextMenu(){
  const df = $('#drawflow');
  // 节点右键菜单
  $('#drawflow').addEventListener('contextmenu', e=>{
    const nodeEl = e.target.closest('.drawflow-node');
    if(nodeEl){
      e.preventDefault();
      const nodeId = nodeEl.id.slice(5);
      ctxTargetId = nodeId;
      const ctxMenu = $('#ctx-menu');
      ctxMenu.innerHTML = `
        <div class="ctx-menu-item" id="ctx-copy">📋 复制<span class="shortcut">Ctrl+C</span></div>
        <div class="ctx-menu-item" id="ctx-duplicate">📑 复制节点</div>
        <div class="ctx-menu-sep"></div>
        <div class="ctx-menu-item" id="ctx-from-container">📁 移出容器</div>
        <div class="ctx-menu-sep"></div>
        <div class="ctx-menu-item danger" id="ctx-delete">🗑 删除<span class="shortcut">Del</span></div>
      `;
      const currentNode = store.data.nodes[nodeId];
      const fromContainerEl = $('#ctx-from-container', ctxMenu);
      if(currentNode && currentNode.data._parentId){
        fromContainerEl.style.display = '';
        fromContainerEl.onclick = ()=>{
          const pid = currentNode.data._parentId;
          const parent = store.data.nodes[pid];
          if(parent && parent.data._children){
            parent.data._children = parent.data._children.filter(cid => String(cid) !== String(nodeId));
            refreshNodeDisplay(pid);
          }
          delete currentNode.data._parentId;
          const nodeEl = nodeCache.get(nodeId) || document.querySelector(`#node-${nodeId}`);
          if(nodeEl) nodeEl.style.zIndex = '';
          markDirty();
          hideCtxMenu();
        };
      } else {
        fromContainerEl.style.display = 'none';
      }
      const containers = Object.keys(store.data.nodes).filter(cid => store.data.nodes[cid].type === 'container');
      if(containers.length > 0){
        const sepEl = document.createElement('div');
        sepEl.className = 'ctx-menu-sep';
        ctxMenu.insertBefore(sepEl, $('#ctx-delete', ctxMenu));
        const headerEl = document.createElement('div');
        headerEl.className = 'ctx-menu-item';
        headerEl.style.cssText = 'color:var(--muted);cursor:default;font-size:11px';
        headerEl.textContent = '📁 放入容器';
        ctxMenu.insertBefore(headerEl, $('#ctx-delete', ctxMenu));
        containers.forEach(cid => {
          const cNode = store.data.nodes[cid];
          const cTitle = (cNode.data.title || '未命名容器').substring(0, 15);
          const itemEl = document.createElement('div');
          itemEl.className = 'ctx-menu-item';
          itemEl.textContent = '  ↳ ' + cTitle;
          itemEl.style.paddingLeft = '24px';
          itemEl.onclick = ()=>{ assignNodeToContainer(nodeId, cid); hideCtxMenu(); };
          ctxMenu.insertBefore(itemEl, $('#ctx-delete', ctxMenu));
        });
      }
      ctxMenu.style.left = e.clientX + 'px';
      ctxMenu.style.top = e.clientY + 'px';
      ctxMenu.classList.add('show');
      $('#ctx-copy', ctxMenu).onclick = ()=>{ copyNodeToClipboard(ctxTargetId); hideCtxMenu(); };
      $('#ctx-duplicate', ctxMenu).onclick = ()=>{ duplicateNode(ctxTargetId); hideCtxMenu(); };
      $('#ctx-delete', ctxMenu).onclick = ()=>{ store.editor.removeNodeId('node-'+ctxTargetId); hideCtxMenu(); };
    }
  });

  // 画布空白处右键
  const canvasWrap = $('.canvas-wrap');
  if(canvasWrap){
    canvasWrap.addEventListener('contextmenu', e=>{
      if(e.target === $('#drawflow') || e.target.classList.contains('parent-drawflow')){
        e.preventDefault();
        ctxTargetId = null;
        const ctxMenu = $('#ctx-menu');
        ctxMenu.innerHTML = `
          <div class="ctx-menu-item" id="ctx-select-all">🔲 全选<span class="shortcut">Ctrl+A</span></div>
          <div class="ctx-menu-item" id="ctx-paste">📌 粘贴<span class="shortcut">Ctrl+V</span></div>
          <div class="ctx-menu-sep"></div>
          <div class="ctx-menu-item" id="ctx-export-json">📤 导出 JSON</div>
        `;
        ctxMenu.style.left = e.clientX + 'px';
        ctxMenu.style.top = e.clientY + 'px';
        ctxMenu.classList.add('show');
        $('#ctx-select-all', ctxMenu).onclick = ()=>{
          Object.keys(store.data.nodes).forEach(id=>{
            const el = document.querySelector(`#node-${id}`);
            if(el) el.classList.add('selected');
          });
          hideCtxMenu();
        };
        $('#ctx-paste', ctxMenu).onclick = ()=>{ pasteFromClipboard(); hideCtxMenu(); };
        $('#ctx-export-json', ctxMenu).onclick = ()=>{ doExport(); hideCtxMenu(); };
      }
    });
  }

  document.addEventListener('click', hideCtxMenu);

  // 小地图拖拽
  const minimapSvg = $('#minimap-svg');
  const minimapVp = $('#minimap-vp');
  if(minimapSvg && minimapVp){
    let mmDragging = false, mmDragOffX = 0, mmDragOffY = 0;
    minimapVp.addEventListener('mousedown', e=>{
      mmDragging = true;
      const vpRect = minimapVp.getBoundingClientRect();
      mmDragOffX = e.clientX - vpRect.left;
      mmDragOffY = e.clientY - vpRect.top;
      e.stopPropagation();
    });
    document.addEventListener('mousemove', e=>{
      if(!mmDragging) return;
      const mmRect = document.getElementById('minimap').getBoundingClientRect();
      const newX = e.clientX - mmRect.left - mmDragOffX;
      const newY = e.clientY - mmRect.top - mmDragOffY;
      const nodeIds = Object.keys(store.editor.export().drawflow.Home.data);
      if(nodeIds.length === 0) return;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodeIds.forEach(id=>{
        const n = store.editor.export().drawflow.Home.data[id];
        const el = document.querySelector('#node-'+id);
        const w = el ? el.offsetWidth : 200;
        const h = el ? el.offsetHeight : 60;
        if(n.pos_x < minX) minX = n.pos_x;
        if(n.pos_y < minY) minY = n.pos_y;
        if(n.pos_x + w > maxX) maxX = n.pos_x + w;
        if(n.pos_y + h > maxY) maxY = n.pos_y + h;
      });
      const pad = 40; minX -= pad; minY -= pad; maxX += pad; maxY += pad;
      const worldW = maxX - minX, worldH = maxY - minY;
      const s = Math.min(180 / worldW, 135 / worldH);
      const ox = (180 - worldW * s) / 2, oy = (135 - worldH * s) / 2;
      const worldX = (newX - ox) / s + minX, worldY = (newY - oy) / s + minY;
      store.editor.canvas_x = -worldX * store.editor.zoom;
      store.editor.canvas_y = -worldY * store.editor.zoom;
      store.editor.precanvas.style.transform = 'translate('+store.editor.canvas_x+'px, '+store.editor.canvas_y+'px) scale('+store.editor.zoom+')';
      updateMinimapViewport(minX, minY, worldW, worldH, s, ox, oy);
    });
    document.addEventListener('mouseup', ()=>{ mmDragging = false; });
  }

  // 监听画布变化重绘小地图
  store.editor && store.editor.on('nodeCreated', ()=>{
    nodeCache.invalidate();
    setTimeout(()=>renderMinimap(), 50);
  });
  store.editor && store.editor.on('nodeRemoved', ()=>{
    nodeCache.invalidate();
    rAF.schedule('minimap-update', renderMinimap);
  });
  store.editor && store.editor.on('translate', ()=>{
    rAF.schedule('minimap-viewport', () => {
      const nodeIds = Object.keys(store.editor.export().drawflow.Home.data);
      if(nodeIds.length > 0){
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        nodeIds.forEach(id=>{
          const n = store.editor.export().drawflow.Home.data[id];
          const el = document.querySelector('#node-'+id);
          const w = el ? el.offsetWidth : 200;
          const h = el ? el.offsetHeight : 60;
          if(n.pos_x < minX) minX = n.pos_x;
          if(n.pos_y < minY) minY = n.pos_y;
          if(n.pos_x + w > maxX) maxX = n.pos_x + w;
          if(n.pos_y + h > maxY) maxY = n.pos_y + h;
        });
        const pad = 40; minX -= pad; minY -= pad; maxX += pad; maxY += pad;
        const worldW = maxX - minX, worldH = maxY - minY;
        const s = Math.min(180 / worldW, 135 / worldH);
        const ox = (180 - worldW * s) / 2, oy = (135 - worldH * s) / 2;
        updateMinimapViewport(minX, minY, worldW, worldH, s, ox, oy);
      }
    });
  });
  store.editor && store.editor.on('zoom', ()=>{ rAF.schedule('minimap-update', renderMinimap); });

  // 初始渲染
  setTimeout(renderMinimap, 200);
}

/* ============================================================
   双向端口连线
============================================================ */
export function initBidirectionalPorts(){
  const df = store.editor && store.editor.precanvas;
  if(!df) return;

  document.addEventListener('mousedown', function onPortDown(e){
    const portEl = e.target.closest('.input');
    if(!portEl) return;
    const nodeEl = portEl.closest('.drawflow-node');
    if(!nodeEl) return;
    e.stopPropagation();
    e.preventDefault();
    const sourceNodeId = nodeEl.id.slice(5);
    const sourcePortName = proxyInputPortAsOutput(portEl);
    if(!sourcePortName) return;
    const preRect = df.getBoundingClientRect();
    const zoom = store.editor.zoom;
    const scaleX = df.clientWidth / (df.clientWidth * zoom);
    const scaleY = df.clientHeight / (df.clientHeight * zoom);
    const portRect = portEl.getBoundingClientRect();
    const startCX = (portRect.left + portRect.width / 2 - preRect.left) * scaleX;
    const startCY = (portRect.top + portRect.height / 2 - preRect.top) * scaleY;
    let svg = df.querySelector('svg');
    if(!svg){
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.cssText = 'position:absolute;overflow:visible;z-index:0;pointer-events:none;width:100%;height:100%';
      df.insertBefore(svg, df.firstChild);
    }
    const previewPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    previewPath.classList.add('port-preview-line');
    svg.appendChild(previewPath);
    let snapTarget = null;
    function onMove(me){
      const mx = (me.clientX - preRect.left) * scaleX;
      const my = (me.clientY - preRect.top) * scaleY;
      const dx = (mx - startCX) * 0.4;
      previewPath.setAttribute('d', 'M '+startCX+' '+startCY+' C '+(startCX+dx)+' '+startCY+', '+(mx-dx)+' '+my+', '+mx+' '+my);
      clearSnapHighlight();
      snapTarget = findSnapTarget(me.clientX, me.clientY, sourceNodeId);
      if(snapTarget){
        const el = document.getElementById('node-' + snapTarget.nodeId);
        if(el) el.classList.add('snap-target');
      }
    }
    function onUp(){
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mouseup', onUp, true);
      previewPath.remove();
      clearSnapHighlight();
      if(snapTarget && snapTarget.nodeId !== sourceNodeId){
        var targetNodeId = snapTarget.nodeId;
        var targetPortName = snapTarget.portEl.className.split(' ').find(function(c){ return c.startsWith('input_') || c.startsWith('output_'); });
        if(!targetPortName) return;
        var actualOut = targetPortName.replace('input_', 'output_proxy_');
        var actualIn = resolveDirectInputPort(targetPortName);
        if(!actualIn) return;
        if(!findEdgeByPorts(targetNodeId, sourceNodeId, actualOut, actualIn)){
          try{
            store.editor.addConnection(targetNodeId, sourceNodeId, actualOut, actualIn);
            haptic('light');
          }catch(err){ console.warn('[BidirPorts] addConnection error:', err); }
        }
      }
      snapTarget = null;
    }
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mouseup', onUp, true);
  }, true);
}

function findSnapTarget(mouseX, mouseY, excludeNodeId){
  const el = document.elementFromPoint(mouseX, mouseY);
  if(!el) return null;
  const portEl = el.closest('.input, .output');
  if(!portEl) return null;
  if(portEl.classList.contains('output_proxy_1') || portEl.classList.contains('output_proxy_2')) return null;
  const nodeEl = portEl.closest('.drawflow-node');
  if(!nodeEl) return null;
  const nodeId = nodeEl.id.slice(5);
  const exId = excludeNodeId;
  if(nodeId === exId) return null;
  if(nodeEl.classList.contains('locked')) return null;
  const rect = portEl.getBoundingClientRect();
  return { nodeId, inputX: rect.left + rect.width / 2, inputY: rect.top + rect.height / 2, dist: 0, portEl };
}

function clearSnapHighlight(){
  document.querySelectorAll('.drawflow-node.snap-target, .input.snap-target, .output.snap-target').forEach(n=>{
    n.classList.remove('snap-target');
  });
}

/* ============================================================
   连线吸附
============================================================ */
const snapState = {
  active: false,
  sourceNodeId: null,
  sourceOutput: null,
  targetNodeId: null,
  targetPortName: null,
  snapThresholdX: 100,
  snapThresholdY: 50,
  lastX: null,
  lastY: null,
};

export function initConnectionSnap(){
  const df = $('#drawflow');
  if(!df) return;
  df.addEventListener('mousedown', e=>{
    const outputEl = e.target.closest('.output');
    if(!outputEl) return;
    const nodeEl = outputEl.closest('.drawflow-node');
    if(!nodeEl) return;
    snapState.active = true;
    snapState.sourceNodeId = nodeEl.id.slice(5);
    snapState.sourceOutput = outputEl.className.split(' ').find(c => c.startsWith('output_'));
    snapState.targetNodeId = null;
    snapState.targetPortName = null;
  }, true);

  document.addEventListener('mousemove', e=>{
    if(!snapState.active) return;
    const mouseX = e.clientX, mouseY = e.clientY;
    snapState.lastX = mouseX; snapState.lastY = mouseY;
    clearSnapHighlight();
    const target = findSnapTarget(mouseX, mouseY);
    if(target){
      snapState.targetNodeId = target.nodeId;
      snapState.targetPortName = target.portEl.className.split(' ').find(c => c.startsWith('input_') || c.startsWith('output_'));
      const targetEl = document.getElementById('node-' + target.nodeId);
      if(targetEl) targetEl.classList.add('snap-target');
    } else {
      snapState.targetNodeId = null;
      snapState.targetPortName = null;
    }
  }, true);

  document.addEventListener('mouseup', me=>{
    if(!snapState.active) return;
    if(me && me.stopImmediatePropagation){ me.stopImmediatePropagation(); me.stopPropagation(); }
    const releaseX = me && typeof me.clientX === 'number' ? me.clientX : snapState.lastX;
    const releaseY = me && typeof me.clientY === 'number' ? me.clientY : snapState.lastY;
    const releasedTarget = findSnapTarget(releaseX, releaseY, snapState.sourceNodeId) || (snapState.targetNodeId ? {
      nodeId: snapState.targetNodeId,
      portEl: document.querySelector('#node-' + snapState.targetNodeId + ' .input.snap-target, #node-' + snapState.targetNodeId + ' .output.snap-target')
    } : null);
    const targetNodeId = releasedTarget && releasedTarget.nodeId;
    const sourceNodeId = snapState.sourceNodeId;
    const sourceOutput = snapState.sourceOutput;
    const targetPortName = releasedTarget && releasedTarget.portEl
      ? releasedTarget.portEl.className.split(' ').find(c => c.startsWith('input_') || c.startsWith('output_'))
      : snapState.targetPortName;
    clearSnapHighlight();
    snapState.active = false;
    snapState.sourceNodeId = null; snapState.sourceOutput = null;
    snapState.targetNodeId = null; snapState.targetPortName = null;
    snapState.lastX = null; snapState.lastY = null;
    if(targetNodeId && sourceNodeId && sourceOutput){
      const targetPort = resolveDirectInputPort(targetPortName);
      const exists = targetPort ? findEdgeByPorts(sourceNodeId, targetNodeId, sourceOutput, targetPort) : null;
      if(!targetPort) return;
      if(!exists){
        try{
          store.editor.addConnection(sourceNodeId, targetNodeId, sourceOutput, targetPort);
          haptic('light');
        }catch(err){ console.warn('[BidirectionalPorts] addConnection error:', err); }
      }
    }
  }, true);

  df.addEventListener('touchstart', e=>{
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const outputEl = target ? target.closest('.output') : null;
    if(!outputEl) return;
    const nodeEl = outputEl.closest('.drawflow-node');
    if(!nodeEl) return;
    snapState.active = true;
    snapState.sourceNodeId = nodeEl.id.slice(5);
    snapState.sourceOutput = outputEl.className.split(' ').find(c => c.startsWith('output_'));
    snapState.targetNodeId = null;
    snapState.targetPortName = null;
  }, { passive: true, capture: true });

  document.addEventListener('touchmove', e=>{
    if(!snapState.active) return;
    const touch = e.touches[0];
    snapState.lastX = touch.clientX; snapState.lastY = touch.clientY;
    clearSnapHighlight();
    const target = findSnapTarget(touch.clientX, touch.clientY);
    if(target){
      snapState.targetNodeId = target.nodeId;
      snapState.targetPortName = target.portEl.className.split(' ').find(c => c.startsWith('input_') || c.startsWith('output_'));
      const targetEl = document.getElementById('node-' + target.nodeId);
      if(targetEl) targetEl.classList.add('snap-target');
    } else {
      snapState.targetNodeId = null;
      snapState.targetPortName = null;
    }
  }, { passive: true, capture: true });

  document.addEventListener('touchend', me=>{
    if(!snapState.active) return;
    if(me && me.stopImmediatePropagation){ me.stopImmediatePropagation(); me.stopPropagation(); }
    const changed = me && me.changedTouches && me.changedTouches[0] ? me.changedTouches[0] : null;
    const releaseX = changed ? changed.clientX : snapState.lastX;
    const releaseY = changed ? changed.clientY : snapState.lastY;
    const releasedTarget = findSnapTarget(releaseX, releaseY, snapState.sourceNodeId) || (snapState.targetNodeId ? {
      nodeId: snapState.targetNodeId,
      portEl: document.querySelector('#node-' + snapState.targetNodeId + ' .input.snap-target, #node-' + snapState.targetNodeId + ' .output.snap-target')
    } : null);
    const targetNodeId = releasedTarget && releasedTarget.nodeId;
    const sourceNodeId = snapState.sourceNodeId;
    const sourceOutput = snapState.sourceOutput;
    const targetPortName = releasedTarget && releasedTarget.portEl
      ? releasedTarget.portEl.className.split(' ').find(c => c.startsWith('input_') || c.startsWith('output_'))
      : snapState.targetPortName;
    clearSnapHighlight();
    snapState.active = false;
    snapState.sourceNodeId = null; snapState.sourceOutput = null;
    snapState.targetNodeId = null; snapState.targetPortName = null;
    snapState.lastX = null; snapState.lastY = null;
    if(targetNodeId && sourceNodeId && sourceOutput){
      const targetPort = resolveDirectInputPort(targetPortName);
      const exists = targetPort ? findEdgeByPorts(sourceNodeId, targetNodeId, sourceOutput, targetPort) : null;
      if(!targetPort) return;
      if(!exists){
        try{
          store.editor.addConnection(sourceNodeId, targetNodeId, sourceOutput, targetPort);
          haptic('light');
        }catch(err){ console.warn('[BidirectionalPorts] addConnection error:', err); }
      }
    }
  }, true);
}

/* ============================================================
   键盘快捷键
============================================================ */
export function initKeys(){
  document.addEventListener('keydown', e=>{
    if(e.key === 'Shift') store._shiftDown = true;
  });
  document.addEventListener('keyup', e=>{
    if(e.key === 'Shift') store._shiftDown = false;
  });

  document.addEventListener('keydown', e=>{
    const tag = (e.target.tagName||'').toLowerCase();
    const editing = tag==='input'||tag==='textarea'||tag==='select';
    if(e.ctrlKey && e.key === 'z' && !editing){ e.preventDefault(); histUndo(); }
    else if(e.ctrlKey && e.key === 'y' && !editing){ e.preventDefault(); histRedo(); }
    else if(e.ctrlKey && e.key === 'a' && !editing){
      e.preventDefault();
      Object.keys(store.data.nodes).forEach(id=>{
        const el = document.querySelector(`#node-${id}`);
        if(el) el.classList.add('selected');
      });
    }
    else if(e.key==='Delete'){
      if(editing) return;
      const sel = store.selectedId;
      if(store.selectedIds.length > 1){ removeSelectedNodes(); e.preventDefault(); return; }
      if(!sel) return;
      if(typeof sel==='object' && sel.kind==='edge'){
        store.editor.removeSingleConnection(sel.out, sel.in, sel.oc, sel.ic);
      } else {
        store.editor.removeNodeId('node-'+sel);
      }
      store.selectedId = null; store.selectedIds = [];
      renderInspector();
      e.preventDefault();
    } else if(e.key==='Escape'){
      if(editing){ e.target.blur(); return; }
      store.selectedId = null; store.selectedIds = [];
      document.querySelectorAll('#drawflow .drawflow-node.selected').forEach(n=>n.classList.remove('selected'));
      document.querySelectorAll('#drawflow .connection .main-path.selected').forEach(p=>p.classList.remove('selected'));
      renderInspector();
    }
  });
}

/* ============================================================
   移动端底部工具栏
============================================================ */
export function initBottomBar(){
  const qc = $('#quick-create');
  const bbAdd = $('#bb-add');
  if(!bbAdd) return;
  bbAdd.addEventListener('click', e=>{
    e.stopPropagation();
    qc.classList.toggle('show');
    haptic('light');
  });
  qc.querySelectorAll('.qc-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      const type = item.dataset.type;
      if(!type || !TYPE_META[type]) return;
      const ed = store.editor;
      const rect = $('#drawflow').getBoundingClientRect();
      const cx = (-ed.canvas_x + rect.width/2) / ed.zoom - 100;
      const cy = (-ed.canvas_y + rect.height/2) / ed.zoom - 30;
      createNode(type, cx, cy);
      qc.classList.remove('show');
      haptic('success');
    });
  });
  document.addEventListener('click', e=>{
    if(!e.target.closest('#quick-create') && !e.target.closest('#bb-add')){
      qc.classList.remove('show');
    }
  });
  $('#bb-undo')?.addEventListener('click', ()=>{ histUndo(); haptic('light'); });
  $('#bb-redo')?.addEventListener('click', ()=>{ histRedo(); haptic('light'); });
  $('#bb-zoomout')?.addEventListener('click', ()=>{ store.editor.zoom_out(); updateZoomPct(); haptic('light'); });
  $('#bb-zoomin')?.addEventListener('click', ()=>{ store.editor.zoom_in(); updateZoomPct(); haptic('light'); });
  $('#bb-grid')?.addEventListener('click', ()=>{
    store.showGrid = !store.showGrid;
    const df = $('#drawflow');
    df.style.backgroundImage = store.showGrid ? '' : 'none';
    $('#bb-grid').classList.toggle('active', store.showGrid);
    haptic('light');
  });
}

/* ============================================================
   导航条更新
============================================================ */
export function updateNavBar(){
  const navPos = $('#nav-pos');
  if(!navPos || !store.editor) return;
  const ed = store.editor;
  const x = Math.round(-ed.canvas_x / ed.zoom);
  const y = Math.round(-ed.canvas_y / ed.zoom);
  const z = Math.round(ed.zoom * 100);
  navPos.textContent = `${x}, ${y} · ${z}%`;
}

/* ============================================================
   触控手势
============================================================ */
let touchState = {
  active: false, startDist: 0, startZoom: 1,
  lastTap: 0, tapCount: 0, longPressTimer: null,
  longPressFired: false, touchStartX: 0, touchStartY: 0,
};

export function initTouchGestures(){
  const canvas = $('#drawflow');
  const wrap = $('.canvas-wrap');
  if(!wrap) return;

  wrap.addEventListener('touchstart', e=>{
    if(e.touches.length === 2){
      touchState.active = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchState.startDist = Math.sqrt(dx*dx + dy*dy);
      touchState.startZoom = store.editor.zoom;
      e.preventDefault();
    }
  }, { passive: false });

  wrap.addEventListener('touchmove', e=>{
    if(touchState.active && e.touches.length === 2){
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const ratio = dist / touchState.startDist;
      let newZoom = touchState.startZoom * ratio;
      newZoom = Math.max(0.1, Math.min(10, newZoom));
      store.editor.zoom = newZoom;
      store.editor.zoom_refresh();
      updateZoomPct();
      updateNavBar();
      e.preventDefault();
    }
  }, { passive: false });

  wrap.addEventListener('touchend', e=>{
    if(e.touches.length < 2) touchState.active = false;
    const now = Date.now();
    const touchCount = e.changedTouches.length;
    if(touchCount === 2 && now - touchState.lastTap < 300){
      histUndo(); haptic('light'); touchState.tapCount = 0;
    } else if(touchCount === 3){
      histRedo(); haptic('medium');
    }
    touchState.lastTap = now;
  });

  wrap.addEventListener('touchstart', e=>{
    if(e.touches.length !== 1) return;
    const t = e.touches[0];
    if(t.target.closest('.drawflow-node')) return;
    if(t.target.closest('.minimap')) return;
    touchState.touchStartX = t.clientX;
    touchState.touchStartY = t.clientY;
    touchState.longPressFired = false;
    clearTimeout(touchState.longPressTimer);
    touchState.longPressTimer = setTimeout(()=>{
      touchState.longPressFired = true;
      const qc = $('#quick-create');
      qc.classList.add('show');
      haptic('medium');
    }, 500);
  }, { passive: true });

  wrap.addEventListener('touchmove', e=>{
    const t = e.touches[0];
    if(!t) return;
    const dx = Math.abs(t.clientX - touchState.touchStartX);
    const dy = Math.abs(t.clientY - touchState.touchStartY);
    if(dx > 10 || dy > 10) clearTimeout(touchState.longPressTimer);
  }, { passive: true });

  wrap.addEventListener('touchend', ()=>{ clearTimeout(touchState.longPressTimer); });

  let lastShake = 0, shakeX = 0, shakeY = 0, shakeZ = 0;
  if(window.DeviceMotionEvent){
    window.addEventListener('devicemotion', e=>{
      const acc = e.accelerationIncludingGravity;
      if(!acc) return;
      const dx = Math.abs(acc.x - shakeX);
      const dy = Math.abs(acc.y - shakeY);
      const dz = Math.abs(acc.z - shakeZ);
      if(dx + dy + dz > 25){
        const now = Date.now();
        if(now - lastShake > 1000){
          histUndo(); haptic('heavy'); lastShake = now;
        }
      }
      shakeX = acc.x; shakeY = acc.y; shakeZ = acc.z;
    });
  }
}

/* ============================================================
   inspector 增强 —— 添加颜色、锁定、缩略图等字段
============================================================ */
const _origRenderInspector = renderInspector;
renderInspector = function(){
  _origRenderInspector.call(this);
  const sel = store.selectedId;
  if(!sel || typeof sel !== 'string') return;
  const node = store.data.nodes[sel];
  if(!node) return;
  const insp = $('#inspector');
  const actionsEl = insp.querySelector('.insp-actions');
  if(!actionsEl) return;

  const colorSection = document.createElement('div');
  colorSection.style.cssText = 'margin-top:12px; padding-top:12px; border-top:1px solid var(--border)';
  const curColor = node.data._color || '';
  let colorHtml = '<div class="field"><label>颜色标签</label><div class="color-picker">';
  NODE_COLORS.forEach(c=>{
    colorHtml += `<div class="color-dot ${curColor===c?'active':''}" style="background:${c}" data-color="${c}"></div>`;
  });
  colorHtml += `<div class="color-dot" style="background:transparent;border:2px dashed var(--border-2)" data-color="" title="清除"></div>`;
  colorHtml += '</div></div>';
  colorSection.innerHTML = colorHtml;

  const locked = !!node.data._locked;
  const lockSection = document.createElement('div');
  lockSection.style.cssText = 'margin-top:8px';
  lockSection.innerHTML = `<button class="tbtn" id="btn-lock-node" style="width:100%;justify-content:center">${locked ? '🔓 解锁节点' : '🔒 锁定节点'}</button>`;

  actionsEl.parentNode.insertBefore(colorSection, actionsEl);
  actionsEl.parentNode.insertBefore(lockSection, actionsEl);

  if(node.type === 'line') return;

  const attachSection = document.createElement('div');
  attachSection.innerHTML = renderAttachHtml(sel);
  actionsEl.parentNode.insertBefore(attachSection, actionsEl);

  colorSection.querySelectorAll('.color-dot').forEach(dot=>{
    dot.addEventListener('click', ()=>{
      const c = dot.dataset.color;
      if(c) setNodeColor(sel, c);
      else removeNodeColor(sel);
      haptic('light');
      renderInspector();
    });
  });

  const btnLock = $('#btn-lock-node');
  if(btnLock) btnLock.addEventListener('click', ()=>{
    toggleNodeLock(sel);
    renderInspector();
  });

  const attachZone = $('#attach-upload-zone');
  const attachInput = $('#attach-file-input');
  if(attachZone && attachInput){
    attachZone.addEventListener('click', ()=> attachInput.click());
    attachInput.addEventListener('change', ()=>{
      const files = Array.from(attachInput.files || []);
      files.forEach(f=> addNodeAttachment(sel, f));
      attachInput.value = '';
    });
    ['dragenter','dragover'].forEach(ev=>{
      attachZone.addEventListener(ev, e=>{ e.preventDefault(); e.stopPropagation(); attachZone.classList.add('dragover'); });
    });
    ['dragleave','drop'].forEach(ev=>{
      attachZone.addEventListener(ev, e=>{ e.preventDefault(); e.stopPropagation(); attachZone.classList.remove('dragover'); });
    });
    attachZone.addEventListener('drop', e=>{
      const files = Array.from(e.dataTransfer?.files || []);
      files.forEach(f=> addNodeAttachment(sel, f));
    });
  }
  const attachSec = $('#attach-section');
  if(attachSec){
    attachSec.addEventListener('click', e=>{
      const delBtn = e.target.closest('[data-del]');
      if(delBtn){ removeNodeAttachment(sel, delBtn.dataset.del); return; }
      const bgBtn = e.target.closest('[data-bgremove]');
      if(bgBtn){ removeImageBackground(sel, bgBtn.dataset.bgremove); return; }
      const prev = e.target.closest('[data-preview]');
      if(prev){ previewAttachment(sel, prev.dataset.preview); }
    });
  }
};

/* ============================================================
   refreshNodeDisplay 增强 —— 恢复颜色/锁定/缩略图
============================================================ */
const _origRefreshNodeDisplay = refreshNodeDisplay;
refreshNodeDisplay = function(id){
  _origRefreshNodeDisplay.call(this, id);
  const node = store.data.nodes[id];
  if(!node) return;
  if(node.data._color) setNodeColor(id, node.data._color);
  if(node.data._locked){
    const el = document.querySelector(`#node-${id}`);
    if(el){
      el.classList.add('locked');
      if(!el.querySelector('.lock-badge')){
        const badge = document.createElement('div');
        badge.className = 'lock-badge';
        badge.textContent = '🔒';
        el.appendChild(badge);
      }
    }
  }
  if(node.data._thumb) setNodeThumb(id, node.data._thumb);
};

/* ============================================================
   启动
============================================================ */
export function boot(){
  console.log('[boot] starting...');
  console.log('[boot] Drawflow global=', typeof window.Drawflow);
  console.log('[boot] #drawflow element=', document.getElementById('drawflow'));
  initTheme();

  const themeBtn = document.getElementById('btn-theme');
  if(themeBtn){ themeBtn.addEventListener('click', toggleTheme); }
  const themeBtnMobile = document.getElementById('btn-theme-mobile');
  if(themeBtnMobile){ themeBtnMobile.addEventListener('click', toggleTheme); }

  initDrawflow();
  initPalette();
  initToolbar();
  initKeys();
  initClipboardKeys();
  initBottomBar();
  initTouchGestures();
  initLockInterceptor();
  initEnhancedContextMenu();
  initConnectionSnap();
  initBidirectionalPorts();
  initPalette3DSpheres();

  const origZoom = store.editor ? store.editor.zoom_refresh : null;
  if(store.editor){
    store.editor.on('translate', ()=>{
      rAF.schedule('navbar-update', updateNavBar);
      rAF.schedule('groups-update', renderGroups);
    });
    store.editor.on('zoom', ()=>{
      rAF.schedule('navbar-update', updateNavBar);
      rAF.schedule('groups-update', renderGroups);
    });
    store.editor.on('nodeCreated', ()=>{ rAF.schedule('groups-update', renderGroups); });
    store.editor.on('nodeRemoved', ()=>{ rAF.schedule('groups-update', renderGroups); });
  }

  let loaded = false;
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){
      const obj = JSON.parse(raw);
      if(obj && obj.nodes && Object.keys(obj.nodes).length){
        loadFrom(obj);
        loaded = true;
      }
    }
  }catch(err){ console.warn('加载本地存档失败', err); }

  updateZoomPct();
  updateNavBar();
  updateEmpty();
  renderInspector();
  renderGroups();
  if(store.history.length === 0){ resetHistoryToCurrent(); }
  if(loaded){
    const t = new Date();
    const _st4 = $('#save-text'); if(_st4) _st4.textContent = '已从本地恢复 ' + String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
  }
  window.__store = store;
  window.__editor = store.editor;
}
