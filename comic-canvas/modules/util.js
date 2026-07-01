/* ============================================================
   util —— 工具函数（含 perf/history 混合）
   由于 history 和 perf 模块与 store 紧密耦合，
   这里将它们与 util 合并以避免循环依赖。
============================================================ */

import { store } from './store.js';
import { TYPE_META, TITLE_FIELD, DESC_FIELD, SCHEMA } from './config.js';

export const $ = sel => document.querySelector(sel);
export const escapeHtml = s => (s==null?'':String(s)).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// rAF throttle
export const rAF = {
  _pending: {},
  schedule(key, fn){
    if(this._pending[key]) return;
    this._pending[key] = true;
    requestAnimationFrame(()=>{
      this._pending[key] = false;
      fn();
    });
  },
  cancel(key){ delete this._pending[key]; }
};

// 缓存节点 DOM 引用
export const nodeCache = {
  _els: {},
  get(id){
    if(!this._els[id]) this._els[id] = document.querySelector(`#node-${id}`);
    return this._els[id];
  },
  invalidate(id){ if(id) delete this._els[id]; else this._els = {}; }
};

// 缓存连线 DOM 引用
export const connCache = {
  _els: {},
  get(from, to, outPort, inPort){
    const key = `${from}-${to}-${outPort}-${inPort}`;
    if(!this._els[key]) this._els[key] = document.querySelector(`.connection.node_in_node-${to}.node_out_node-${from}.${outPort}.${inPort}`);
    return this._els[key];
  },
  invalidate(from, to, outPort, inPort){
    if(from){ const key = `${from}-${to}-${outPort}-${inPort}`; delete this._els[key]; }
    else this._els = {};
  }
};

// 节点摘要显示
export function nodeTitle(type, data){
  if(type === 'line'){
    const speaker = deriveLineSpeakerName(null, data);
    const content = (data.content || '').trim();
    if(speaker && content) return speaker + ' · ' + content.slice(0, 16);
    if(content) return content.slice(0, 20);
    return '新台词';
  }
  const f = TITLE_FIELD[type];
  return data[f] ? String(data[f]) : (TYPE_META[type].label + ' 节点');
}

export function nodeDesc(type, data){
  const f = DESC_FIELD[type];
  let s = data[f] ? String(data[f]) : '';
  if(type==='shot'){ const bits=[data.size,data.camera_angle,data.move,data.dur?data.dur+'s':''].filter(Boolean); if(bits.length) s = (s?s+' · ':'')+bits.join(' / '); }
  if(type==='container'){ const bits=[data.content_type, data.mood].filter(Boolean); if(bits.length) s = (s?s+' · ':'')+bits.join(' / '); }
  if(type==='line'){ const bits = [data.mood].filter(Boolean); if(bits.length) s = (s?s+' · ':'') + bits.join(' / '); }
  return s;
}

export function normalizeNodeType(type){
  if(type === 'branch') return 'page';
  if(type === 'scene' || type === 'asset') return 'container';
  if(type === 'visual') return 'shot';
  if(type === 'end') return 'page';
  return TYPE_META[type] ? type : 'shot';
}

export function nodeInputCount(type){ return type === 'line' ? 1 : 2; }
export function nodeOutputCount(type){ return type === 'line' ? 1 : 2; }

export function getPortLayout(type){
  if(type === 'line'){
    return [{ input: { left:-7, top:'50%', transform:'translateY(-50%)' }, output: { right:-7, top:'50%', transform:'translateY(-50%)' } }];
  }
  return [
    { input: { left:-7, top:'50%', transform:'translateY(-50%)' }, output: { right:-7, top:'50%', transform:'translateY(-50%)' } },
    { input: { left:'50%', top:-7, transform:'translateX(-50%)' }, output: { left:'50%', bottom:-7, transform:'translateX(-50%)' } }
  ];
}

export function migrateLegacyNodeData(type, source, id){
  const data = JSON.parse(JSON.stringify(source || {}));
  if(type === 'branch'){
    if(!data.page_type) data.page_type = 'storyboard-frame';
    if(!data.page_id) data.page_id = data.label || ('PAGE-' + id);
    if(!data.purpose) data.purpose = data.note || '由旧分支节点迁移';
    return data;
  }
  if(type === 'scene'){
    return { ...data, title: data.name || data.title || ('场景容器-'+id), content_type: data.sub==='道具'?'prop':'scene', note: data.note || data.desc || '' };
  }
  if(type === 'asset'){
    return { ...data, title: data.name || data.title || data.asset_id || ('资产容器-'+id), content_type: data.asset_type==='location'?'location':'asset', desc: data.description || data.desc || '', note: data.note || data.function || '', location_id: data.location_id || data.asset_id || '' };
  }
  if(type === 'visual'){
    return { ...data, no: data.no || ('LOOK-'+id), desc: data.desc || data.art_direction || data.title || '由视觉圣经迁移的镜头设定', purpose: data.purpose || '视觉奇观', visual_title: data.visual_title || data.title || '' };
  }
  if(type === 'end'){
    return { ...data, page_id: data.page_id || ('END-'+id), page_type: data.page_type || 'end-frame', purpose: data.purpose || data.title || '终章收束', peak_moment: data.peak_moment || data.content || '', approval_status: data.approval_status || 'review' };
  }
  return data;
}

export function getConnectedCharacterNames(lineId){
  if(!lineId) return [];
  const names = [];
  Object.values(store.data.edges).forEach(edge => {
    if(String(edge.from)!==String(lineId) && String(edge.to)!==String(lineId)) return;
    const otherId = String(edge.from)===String(lineId) ? edge.to : edge.from;
    const otherNode = store.data.nodes[otherId];
    if(otherNode && otherNode.type==='char'){
      const name = (otherNode.data && otherNode.data.name ? String(otherNode.data.name) : '').trim();
      if(name && !names.includes(name)) names.push(name);
    }
  });
  return names;
}

export function deriveLineSpeakerName(lineId, fallbackData){
  const names = getConnectedCharacterNames(lineId);
  if(names.length) return names.join(' / ');
  const fallback = fallbackData && fallbackData.speaker ? String(fallbackData.speaker).trim() : '';
  return fallback || '未指派';
}

export function refreshConnectionsForNode(nodeId){
  if(!store.editor || !nodeId) return;
  try{ store.editor.updateConnectionNodes('node-'+nodeId); }catch(_){}
}

export function refreshLinePresentation(nodeId){
  const node = store.data.nodes[nodeId];
  if(!node || node.type !== 'line') return;
  refreshNodeDisplay(nodeId);
  if(String(store.selectedId)===String(nodeId)) renderInspector();
}

export function refreshLineNodesForCharNode(nodeId){
  Object.values(store.data.edges).forEach(edge => {
    let lineId = null;
    if(String(edge.from)===String(nodeId) && store.data.nodes[edge.to]?.type==='line') lineId = edge.to;
    if(String(edge.to)===String(nodeId) && store.data.nodes[edge.from]?.type==='line') lineId = edge.from;
    if(lineId) refreshLinePresentation(lineId);
  });
}

export function positionPorts(id){
  const el = document.getElementById('node-'+id);
  if(!el) return;
  const node = store.data.nodes[id];
  if(!node) return;
  const layout = getPortLayout(node.type);
  function applyPort(port, pos){
    if(!port || !pos) return;
    port.style.left = pos.left==null?'auto':(typeof pos.left==='number'?pos.left+'px':pos.left);
    port.style.right = pos.right==null?'auto':(typeof pos.right==='number'?pos.right+'px':pos.right);
    port.style.top = pos.top==null?'auto':(typeof pos.top==='number'?pos.top+'px':pos.top);
    port.style.bottom = pos.bottom==null?'auto':(typeof pos.bottom==='number'?pos.bottom+'px':pos.bottom);
    port.style.transform = pos.transform || '';
  }
  layout.forEach((pair, idx) => {
    const n = idx + 1;
    applyPort(el.querySelector('.input.input_'+n), pair.input);
    applyPort(el.querySelector('.input.input_proxy_'+n), pair.output);
    applyPort(el.querySelector('.output.output_'+n), pair.output);
    applyPort(el.querySelector('.output.output_proxy_'+n), pair.input);
  });
}

export function schemaDefaultValue(field){
  if(!field || field.type !== 'select') return '';
  const opts = field.options || [];
  if(opts.includes('AUTO')) return 'AUTO';
  if(opts.includes('INHERIT')) return 'INHERIT';
  if(opts.includes('OPEN')) return 'OPEN';
  if(opts.includes('draft')) return 'draft';
  return opts[0] || '';
}

export function findEdgeByPorts(outId, inId, outClass, inClass){
  for(const eid of Object.keys(store.data.edges)){
    const e = store.data.edges[eid];
    if(e.from==outId && e.to==inId && e.out_port==outClass && e.in_port==inClass){
      return { id: eid, meta: e };
    }
  }
  return null;
}

export function resolveDirectInputPort(portName){
  const m = /^((?:input)|(?:output)|(?:output_proxy)|(?:input_proxy))_(\d+)$/.exec(portName||'');
  if(!m) return null;
  if(m[1]==='input'||m[1]==='input_proxy') return portName;
  return 'input_proxy_'+m[2];
}

export function proxyInputPortAsOutput(portEl){
  if(!portEl) return null;
  const inputPortName = portEl.className.split(' ').find(c=>c.startsWith('input_'));
  if(!inputPortName) return null;
  return inputPortName.replace('input_','output_proxy_');
}

export function ensureInputProxyOutputs(id){
  const el = document.getElementById('node-'+id);
  const node = store.data.nodes[id];
  const drawNode = store.editor && store.editor.drawflow ? store.editor.drawflow.drawflow[store.editor.module].data[id] : null;
  if(!el||!node||!node.data||!drawNode||!drawNode.outputs||!drawNode.inputs) return;
  const pairCount = Math.max(nodeInputCount(node.type), nodeOutputCount(node.type));
  for(let i=1;i<=pairCount;i++){
    const outputCls = 'output_proxy_'+i, inputProxyCls = 'input_proxy_'+i;
    if(!drawNode.outputs[outputCls]) drawNode.outputs[outputCls] = { connections:[] };
    if(!drawNode.inputs[inputProxyCls]) drawNode.inputs[inputProxyCls] = { connections:[] };
    const outputsWrap = el.querySelector('.outputs');
    if(outputsWrap && !el.querySelector('.'+outputCls)){
      const pp = document.createElement('div'); pp.className = 'output '+outputCls; outputsWrap.appendChild(pp);
    }
    const inputsWrap = el.querySelector('.inputs');
    if(inputsWrap && !el.querySelector('.'+inputProxyCls)){
      const pp = document.createElement('div'); pp.className = 'input '+inputProxyCls; inputsWrap.appendChild(pp);
    }
  }
}

export function updateConnLabel(edgeId){
  const em = store.data.edges[edgeId];
  if(!em) return;
  const connEl = connCache.get(em.from, em.to, em.out_port, em.in_port);
  if(!connEl) return;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  let labelWrap = connEl.querySelector('.conn-label-wrap');
  if(!em.label){ if(labelWrap) labelWrap.remove(); return; }
  const path = connEl.querySelector('.main-path');
  if(!path) return;
  const bbox = path.getBBox();
  const labelText = em.label;
  if(!labelWrap){
    labelWrap = document.createElementNS(SVG_NS,'foreignObject');
    labelWrap.setAttribute('class','conn-label-wrap');
    labelWrap.style.overflow = 'visible';
    const labelDiv = document.createElement('div');
    labelDiv.className = 'conn-label';
    labelWrap.appendChild(labelDiv);
    connEl.appendChild(labelWrap);
  }
  const labelDiv = labelWrap.querySelector('.conn-label');
  labelDiv.textContent = labelText;
  if(!labelWrap._lastText || labelWrap._lastText!==labelText){
    labelWrap.setAttribute('x','-9999'); labelWrap.setAttribute('y','-9999');
    labelWrap.setAttribute('width','500'); labelWrap.setAttribute('height','100');
    const labelRect = labelDiv.getBoundingClientRect();
    labelWrap._cachedWidth = labelRect.width||100;
    labelWrap._cachedHeight = labelRect.height||24;
    labelWrap._lastText = labelText;
  }
  const w = labelWrap._cachedWidth||100, h = labelWrap._cachedHeight||24;
  const cx = bbox.x+bbox.width/2, cy = bbox.y+bbox.height/2;
  labelWrap.setAttribute('x',cx-w/2); labelWrap.setAttribute('y',cy-h/2);
  labelWrap.setAttribute('width',w); labelWrap.setAttribute('height',h);
}

function getEdgesForNode(nodeId){
  const result = [];
  Object.keys(store.data.edges).forEach(eid=>{
    const e = store.data.edges[eid];
    if(e.from==nodeId||e.to==nodeId) result.push(eid);
  });
  return result;
}

export function updateConnLabelsForNode(nodeId){
  getEdgesForNode(nodeId).forEach(eid => updateConnLabel(eid));
}

export function updateAllConnLabels(){
  Object.keys(store.data.edges).forEach(eid => updateConnLabel(eid));
}

export function updateAllConnStyles(){
  Object.keys(store.data.edges).forEach(eid=>{
    const em = store.data.edges[eid];
    const connEl = document.querySelector(`.connection.node_in_node-${em.to}.node_out_node-${em.from}.${em.out_port}.${em.in_port}`);
    if(!connEl) return;
    const path = connEl.querySelector('.main-path');
    if(path){
      if(em.color) path.style.stroke = em.color;
      if(em.width) path.style.strokeWidth = em.width+'px';
    }
    if(em.type){
      connEl.classList.remove('type-solid','type-dash','type-dot','type-arrow');
      connEl.classList.add('type-'+em.type);
    }
  });
}

// 吸附到网格
export function snapToGrid(pos){
  if(!store.snapToGrid) return pos;
  const g = store.gridSize;
  return { x: Math.round(pos.x/g)*g, y: Math.round(pos.y/g)*g };
}

// 触觉反馈
export function haptic(pattern){
  if(!navigator.vibrate) return;
  try{
    if(pattern==='light') navigator.vibrate(5);
    else if(pattern==='medium') navigator.vibrate(15);
    else if(pattern==='heavy') navigator.vibrate([20,50,20]);
    else if(pattern==='success') navigator.vibrate([10,30,10]);
    else if(pattern==='error') navigator.vibrate([30,50,30,50,30]);
    else navigator.vibrate(10);
  }catch(_){}
}

// 文件大小格式化
export function formatSize(bytes){
  if(bytes<1024) return bytes+' B';
  if(bytes<1024*1024) return (bytes/1024).toFixed(1)+' KB';
  return (bytes/1024/1024).toFixed(2)+' MB';
}

// 文件图标
export function fileIcon(name){
  const ext = (name.split('.').pop()||'').toLowerCase();
  if(['pdf'].includes(ext)) return '📄';
  if(['doc','docx'].includes(ext)) return '📝';
  if(['xls','xlsx','csv'].includes(ext)) return '📊';
  if(['mp3','wav','ogg'].includes(ext)) return '🎵';
  if(['mp4','mov','avi','webm'].includes(ext)) return '🎬';
  if(['zip','rar','7z','tar','gz'].includes(ext)) return '🗜️';
  if(['txt','md'].includes(ext)) return '📃';
  return '📎';
}

// 图片压缩
export function compressImage(file, maxDim=800, quality=0.85){
  return new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = ()=>{
      const img = new Image();
      img.onload = ()=>{
        let { width, height } = img;
        if(width>maxDim||height>maxDim){
          const scale = maxDim/Math.max(width,height);
          width = Math.round(width*scale); height = Math.round(height*scale);
        }
        const cv = document.createElement('canvas');
        cv.width = width; cv.height = height;
        cv.getContext('2d').drawImage(img,0,0,width,height);
        resolve(cv.toDataURL('image/jpeg',quality));
      };
      img.onerror = reject;
      img.src = r.result;
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// 文件转 dataURL
export function fileToDataUrl(file){
  return new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = ()=>resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// 判断图片文件
export function isImageFile(file){
  return file.type && file.type.startsWith('image/');
}

// 标记脏状态
export function markDirty(){
  if(store.mutingDirty) return;
  store.dirty = true;
  histPush();
  saveSoon();
}

let saveTimer = null;
function saveSoon(){
  if(saveTimer) clearTimeout(saveTimer);
  const _st = $('#save-text'); if(_st) _st.textContent = '保存中…';
  saveTimer = setTimeout(()=>{ doSave(); }, 500);
}

export function doSave(){
  try{
    const data = serialize();
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    const pid = getProjectId();
    if(pid){
      try{
        const reg = JSON.parse(localStorage.getItem(PROJECT_REG_KEY)||'[]');
        let item = reg.find(p=>p.id===pid);
        if(!item){
          item = { id:pid, name:'项目 '+pid.slice(0,8), createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(), nodeCount:0, typeCounts:{} };
          reg.push(item);
        }
        item.updatedAt = new Date().toISOString();
        item.nodeCount = Object.keys(data.nodes||{}).length;
        const tc = {};
        Object.values(data.nodes||{}).forEach(n => { const nt = normalizeNodeType(n.type); tc[nt]=(tc[nt]||0)+1; });
        item.typeCounts = tc;
        localStorage.setItem(PROJECT_REG_KEY, JSON.stringify(reg));
      }catch(_){}
    }
    store.dirty = false;
    const t = new Date();
    const ts = String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0')+':'+String(t.getSeconds()).padStart(2,'0');
    const _st2 = $('#save-text'); if(_st2) _st2.textContent = '已保存 '+ts;
  }catch(err){
    const _st3 = $('#save-text'); if(_st3) _st3.textContent = '保存失败';
    console.error(err);
  }
}

// 导出为 JSON 文件
export function doExport(){
  const data = serialize();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  const stamp = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0')
    + '-' + String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0');
  a.href = url; a.download = '漫剧画布-' + stamp + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// 导入 JSON 文件
export function doImport(file){
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const obj = JSON.parse(e.target.result);
      loadFrom(obj);
    }catch(err){
      alert('导入失败：文件格式不正确\n' + err.message);
    }
  };
  reader.readAsText(file);
}

export function serialize(){
  const exp = store.editor.export().drawflow.Home.data;
  const nodes = {}, positions = {};
  Object.keys(store.data.nodes).forEach(id=>{
    nodes[id] = store.data.nodes[id];
    const e = exp[id];
    if(e) positions[id] = { x:e.pos_x, y:e.pos_y };
  });
  const edges = JSON.parse(JSON.stringify(store.data.edges));
  return { version:1, app:'comic-canvas', exportedAt:new Date().toISOString(), nodes, positions, edges };
}

export function loadFrom(obj){
  if(!obj || obj.app!=='comic-canvas'){ throw new Error('文件格式不正确'); }
  store.mutingDirty = true;
  clearCanvas(false);
  idMap = {};
  edgeIdCounter = 0;
  Object.keys(obj.nodes).forEach(oldId=>{
    const n = obj.nodes[oldId];
    const nodeType = normalizeNodeType(n.type);
    const pos = obj.positions && obj.positions[oldId] ? obj.positions[oldId] : { x:80+Math.random()*200, y:80+Math.random()*200 };
    const data = migrateLegacyNodeData(n.type, n.data, oldId);
    const html = buildNodeHtml(nodeType, data);
    store.pendingNodes.push({ type:nodeType, data, select:false, remap:oldId });
    const inputs = nodeInputCount(nodeType);
    const outputs = nodeOutputCount(nodeType);
    store.editor.addNode(nodeType, inputs, outputs, pos.x, pos.y, TYPE_META[nodeType].cls, data, html, false);
  });
  if(obj.edges){
    if(Array.isArray(obj.edges)){
      obj.edges.forEach(e=>{
        const outN = idMap[e.out], inN = idMap[e.in];
        if(outN==null||inN==null) return;
        try{ store.editor.addConnection(outN, inN, e.out_name||'output_1', e.in_name||'input_1'); }catch(_){}
      });
    } else {
      Object.keys(obj.edges).forEach(eid=>{
        const e = obj.edges[eid];
        const outN = idMap[e.from], inN = idMap[e.to];
        if(outN==null||inN==null) return;
        const outPort = e.out_port||'output_1', inPort = e.in_port||'input_1';
        try{
          store.data.edges[eid] = { from:outN, to:inN, out_port:outPort, in_port:inPort, type:e.type||'solid', label:e.label||'', color:e.color||'', width:e.width||2.5 };
          const num = parseInt(eid.slice(1))||0;
          if(num > edgeIdCounter) edgeIdCounter = num;
          store.editor.addConnection(outN, inN, outPort, inPort);
        }catch(_){ delete store.data.edges[eid]; }
      });
    }
  }
  store.editor.canvas_x=0; store.editor.canvas_y=0;
  store.editor.zoom_reset();
  updateZoomPct();
  updateEmpty();
  nodeCache.invalidate();
  connCache.invalidate();
  setTimeout(()=>{ updateAllConnStyles(); updateAllConnLabels(); }, 100);
  store.mutingDirty = false;
  resetHistoryToCurrent();
  doSave();
}

// 清空画布
export function clearCanvas(saveBackup){
  const prevMuting = store.mutingDirty;
  store.mutingDirty = true;
  if(saveBackup && Object.keys(store.data.nodes).length){
    localStorage.setItem(LS_KEY+':backup', JSON.stringify(serialize()));
  }
  const exp = store.editor.export().drawflow.Home.data;
  Object.keys(exp).forEach(id=>{ try{ store.editor.removeNodeId('node-'+id); }catch(_){} });
  store.data.nodes = {};
  store.data.edges = {};
  store.selectedId = null;
  nodeCache.invalidate();
  connCache.invalidate();
  store.history = [];
  store.histIdx = -1;
  renderInspector();
  updateEmpty();
  store.mutingDirty = prevMuting;
  if(!store.mutingDirty) resetHistoryToCurrent();
}

// 历史
export function histPush(){
  if(store.mutingDirty) return;
  store.history = store.history.slice(0, store.histIdx + 1);
  const snap = { nodes: JSON.parse(JSON.stringify(store.data.nodes)), edges: JSON.parse(JSON.stringify(store.data.edges)) };
  store.history.push(snap);
  if(store.history.length > store.histMax){ store.history.shift(); }
  else { store.histIdx++; }
}

export function resetHistoryToCurrent(){
  store.history = [{ nodes: JSON.parse(JSON.stringify(store.data.nodes)), edges: JSON.parse(JSON.stringify(store.data.edges)) }];
  store.histIdx = 0;
}

export function histUndo(){
  if(store.histIdx <= 0) return;
  store.histIdx--;
  restoreSnapshot(store.history[store.histIdx]);
}

export function histRedo(){
  if(store.histIdx >= store.history.length - 1) return;
  store.histIdx++;
  restoreSnapshot(store.history[store.histIdx]);
}

function rebuildCanvasFromSnapshot(snap){
  const exp = store.editor.export().drawflow.Home.data;
  Object.keys(exp).forEach(id=>{ try{ store.editor.removeNodeId('node-'+id); }catch(_){} });
  store.pendingNodes = [];
  idMap = {};
  edgeIdCounter = 0;
  Object.keys(snap.nodes).forEach(id=>{
    const n = snap.nodes[id];
    const nodeType = normalizeNodeType(n.type);
    const pos = { x: n.data._posX||80, y: n.data._posY||80 };
    const data = migrateLegacyNodeData(n.type, n.data, id);
    delete data._posX; delete data._posY;
    const html = buildNodeHtml(nodeType, data);
    store.pendingNodes.push({ type:nodeType, data, select:false, remap:id });
    const inputs = nodeInputCount(nodeType);
    const outputs = nodeOutputCount(nodeType);
    store.editor.addNode(nodeType, inputs, outputs, pos.x, pos.y, TYPE_META[nodeType].cls, data, html, false);
  });
  Object.keys(snap.edges).forEach(eid=>{
    const e = snap.edges[eid];
    const outN = idMap[e.from], inN = idMap[e.to];
    if(outN==null||inN==null) return;
    const outPort = e.out_port||'output_1', inPort = e.in_port||'input_1';
    try{
      store.data.edges[eid] = { from:outN, to:inN, out_port:outPort, in_port:inPort, type:e.type||'solid', label:e.label||'', color:e.color||'', width:e.width||2.5 };
      store.editor.addConnection(outN, inN, outPort, inPort);
    }catch(_){ delete store.data.edges[eid]; }
  });
  store.editor.canvas_x=0; store.editor.canvas_y=0;
  store.editor.zoom_reset();
  updateZoomPct();
}

function restoreSnapshot(snap){
  store.mutingDirty = true;
  store.data.nodes = {};
  store.data.edges = {};
  store.selectedIds = [];
  Object.keys(snap.nodes).forEach(id=>{ store.data.nodes[id] = snap.nodes[id]; });
  Object.keys(snap.edges).forEach(eid=>{ store.data.edges[eid] = snap.edges[eid]; });
  rebuildCanvasFromSnapshot(snap);
  store.mutingDirty = false;
  store.selectedId = null;
  renderInspector();
  updateEmpty();
  saveSoon();
}

// 多选管理
export function toggleSelected(id, shift){
  const idx = store.selectedIds.indexOf(id);
  if(idx>=0){
    if(!shift) store.selectedIds.splice(idx, 1);
  } else {
    if(!shift) store.selectedIds = [];
    store.selectedIds.push(id);
  }
  document.querySelectorAll('#drawflow .drawflow-node.selected').forEach(n=>n.classList.remove('selected'));
  if(store.selectedIds.length===1){
    store.selectedId = id;
    const el = document.querySelector(`#node-${id}`);
    if(el) el.classList.add('selected');
  } else if(store.selectedIds.length>1){
    store.selectedId = null;
    store.selectedIds.forEach(sid=>{
      const el = document.querySelector(`#node-${sid}`);
      if(el) el.classList.add('selected');
    });
  }
  renderInspector();
}

export function removeSelectedNodes(){
  const ids = [...store.selectedIds].reverse();
  ids.forEach(id=>{ try{ store.editor.removeNodeId('node-'+id); }catch(_){} });
  store.selectedIds = [];
  store.selectedId = null;
  renderInspector();
  markDirty();
}

// 连线 ID 生成
let idMap = {};
let edgeIdCounter = 0;
export function makeEdgeId(){ return 'e' + (++edgeIdCounter); }
