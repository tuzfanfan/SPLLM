import * as THREE from 'three';
import './style.css';
import './ink-wash.js'; // 水墨晕染背景效果

/* ============================================================
 * 配置参数
 * ============================================================ */
const PARTICLE_COUNT = 20000;   // 粒子总数
const R = 2.2;                  // 太极图半径（世界坐标单位）
const EYE_COUNT = 1200;         // 鱼眼粒子数（两只眼各 600）
const GATHER_DUR = 3.2;         // 汇聚时长（秒）
const DISPERSE_DUR = 2.6;       // 消散时长（秒）
const REFORM_DELAY = 1.4;       // 消散后停留多久再重新汇聚

/* ============================================================
 * 场景 / 相机 / 渲染器
 * ============================================================ */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 0, 6.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.getElementById('app').appendChild(renderer.domElement);

// 双层 Group：外层控制倾斜/偏航（拖拽），内层做平面自转
const tiltGroup = new THREE.Group();
tiltGroup.rotation.x = -0.28;
scene.add(tiltGroup);
const spinGroup = new THREE.Group();
tiltGroup.add(spinGroup);

/* ============================================================
 * 圆形光点贴图（让方形点变成柔和发光圆点）
 * ============================================================ */
function makeCircleTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}
const dotTex = makeCircleTexture();

/* ============================================================
 * 太极区域判定
 * 阳鱼（金）头在上，阴鱼（蓝）头在下
 * S 形分界线由两个半径 R/2 的小半圆构成
 * ============================================================ */
function inYang(x, y) {
  if (y >= 0) {
    // 上半：分界为以 (0, R/2) 为圆心、R/2 为半径的左半圆
    const xc = -Math.sqrt(Math.max(0, (R / 2) * (R / 2) - (y - R / 2) * (y - R / 2)));
    return x > xc;
  } else {
    // 下半：分界为以 (0, -R/2) 为圆心、R/2 为半径的右半圆
    const xc = Math.sqrt(Math.max(0, (R / 2) * (R / 2) - (y + R / 2) * (y + R / 2)));
    return x > xc;
  }
}

/* ============================================================
 * 生成目标位置与颜色
 * ============================================================ */
const target = new Float32Array(PARTICLE_COUNT * 3); // 目标坐标（太极形态）
const vcolor = new Float32Array(PARTICLE_COUNT * 3); // 每粒子颜色
// 白底需用深色才能形成对比（亮色在白底上不可见）
const COL_YANG = new THREE.Color(55/255, 7/255, 8/255);     // 阳：R55 G7 B8 深暗红
const COL_YIN = new THREE.Color(142/255, 141/255, 92/255);  // 阴：R142 G141 B92 橄榄绿灰

let idx = 0;
function put(x, y, z, col) {
  target[idx * 3] = x;
  target[idx * 3 + 1] = y;
  target[idx * 3 + 2] = z;
  vcolor[idx * 3] = col.r;
  vcolor[idx * 3 + 1] = col.g;
  vcolor[idx * 3 + 2] = col.b;
  idx++;
}

// 主体：在大圆内均匀采样，按区域上色
const mainCount = PARTICLE_COUNT - EYE_COUNT;
let placed = 0;
while (placed < mainCount) {
  const rr = R * Math.sqrt(Math.random()); // sqrt 保证均匀面密度
  const th = Math.random() * Math.PI * 2;
  const x = rr * Math.cos(th);
  const y = rr * Math.sin(th);
  const z = (Math.random() - 0.5) * 0.06; // 极小 z 抖动，增加体积感
  put(x, y, z, inYang(x, y) ? COL_YANG : COL_YIN);
  placed++;
}

// 鱼眼：阳鱼头(上)内放阴色点，阴鱼头(下)内放阳色点
const eyePer = EYE_COUNT / 2;
const eyeR = 0.14 * R;
for (let i = 0; i < eyePer; i++) {
  const rr = eyeR * Math.sqrt(Math.random());
  const th = Math.random() * Math.PI * 2;
  put(rr * Math.cos(th), R / 2 + rr * Math.sin(th), 0.02, COL_YIN);
}
for (let i = 0; i < eyePer; i++) {
  const rr = eyeR * Math.sqrt(Math.random());
  const th = Math.random() * Math.PI * 2;
  put(rr * Math.cos(th), -R / 2 + rr * Math.sin(th), 0.02, COL_YANG);
}

/* ============================================================
 * 起始（散落）位置：大球壳随机分布
 * ============================================================ */
const start = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const r = 6 + Math.random() * 9;
  const th = Math.random() * Math.PI * 2;
  const ph = Math.acos(2 * Math.random() - 1);
  start[i * 3] = r * Math.sin(ph) * Math.cos(th);
  start[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
  start[i * 3 + 2] = r * Math.cos(ph);
}

/* ============================================================
 * 粒子几何与材质
 * ============================================================ */
const posAttr = new THREE.BufferAttribute(new Float32Array(start), 3); // 当前位置，初始=散落
const colAttr = new THREE.BufferAttribute(vcolor, 3);
const geom = new THREE.BufferGeometry();
geom.setAttribute('position', posAttr);
geom.setAttribute('color', colAttr);

const mat = new THREE.PointsMaterial({
  size: 0.045,
  map: dotTex,
  vertexColors: true,
  transparent: true,
  blending: THREE.NormalBlending, // 白底用普通混合（Additive 会让粒子在白底上消失）
  depthWrite: false,
  sizeAttenuation: true,
});
const points = new THREE.Points(geom, mat);
spinGroup.add(points);

/* ============================================================
 * 背景星点（不随太极运动，营造景深视差）
 * ============================================================ */
const starN = 1400;
const starPos = new Float32Array(starN * 3);
for (let i = 0; i < starN; i++) {
  const r = 22 + Math.random() * 26;
  const th = Math.random() * Math.PI * 2;
  const ph = Math.acos(2 * Math.random() - 1);
  starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
  starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
  starPos[i * 3 + 2] = r * Math.cos(ph);
}
const starGeom = new THREE.BufferGeometry();
starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
  size: 0.09,
  map: dotTex,
  color: 0xc8d2e0, // 浅灰星点（白底上用普通混合显示为淡灰点）
  transparent: true,
  opacity: 0.32,
  blending: THREE.NormalBlending,
  depthWrite: false,
  sizeAttenuation: true,
});
const stars = new THREE.Points(starGeom, starMat);
scene.add(stars);

/* ============================================================
 * 太极辉光（浮空空灵感）
 * 辉光加入 tiltGroup（跟随倾斜）但不加入 spinGroup（不随自转）
 * ============================================================ */

// 辉光贴图：暖色微光（增强空灵感）
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0,   'rgba(255, 230, 200, 0.14)');
  grd.addColorStop(0.35, 'rgba(255, 215, 175, 0.06)');
  grd.addColorStop(0.7, 'rgba(255, 210, 170, 0.015)');
  grd.addColorStop(1,   'rgba(255, 210, 170, 0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

// 辉光：太极正后方，圆形柔光
const glowTex = makeGlowTexture();
const glowMat = new THREE.MeshBasicMaterial({
  map: glowTex,
  transparent: true,
  opacity: 0,
  depthWrite: false,
  blending: THREE.NormalBlending,
});
const glowMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(R * 2.6, R * 2.6),
  glowMat
);
glowMesh.position.z = -0.5;                  // 大幅后移，彻底脱离粒子层
glowMesh.renderOrder = -1;                   // 先于粒子绘制（但在阴影之后）
tiltGroup.add(glowMesh);

// 辉光目标透明度（由 update() 中状态机驱动）
let glowTargetOpacity = 0;

/* ============================================================
 * 动画状态机：gather -> formed -> disperse -> reform -> gather
 * ============================================================ */
const vel = new Float32Array(PARTICLE_COUNT * 3); // 消散阶段的速度
const delay = new Float32Array(PARTICLE_COUNT);   // 每粒子汇聚延迟（制造波浪）
for (let i = 0; i < PARTICLE_COUNT; i++) delay[i] = Math.random();

let state = 'gather';
let stateTime = 0;

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// 触发消散：给每个粒子一个由中心向外的速度 + 随机扰动
function startDisperse() {
  if (state === 'disperse' || state === 'reform') return;
  state = 'disperse';
  stateTime = 0;
  const p = posAttr.array;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const px = p[i * 3], py = p[i * 3 + 1], pz = p[i * 3 + 2];
    const len = Math.hypot(px, py, pz) || 1;
    const sp = 1.8 + Math.random() * 3.6;
    vel[i * 3] = (px / len) * sp + (Math.random() - 0.5) * 1.2;
    vel[i * 3 + 1] = (py / len) * sp + (Math.random() - 0.5) * 1.2;
    vel[i * 3 + 2] = (pz / len) * sp + (Math.random() - 0.5) * 1.2;
  }
}

function update(dt, t) {
  stateTime += dt;
  const p = posAttr.array;

  if (state === 'gather') {
    // 螺旋汇聚：每粒子带延迟，从散落点旋转逼近目标
    let allDone = true;
    const span = GATHER_DUR;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const local = (stateTime - delay[i] * 0.7 * span) / (span * 0.7);
      const pp = Math.min(1, Math.max(0, local));
      if (pp < 0.999) allDone = false;
      const e = easeInOut(pp);
      const sx = start[i * 3], sy = start[i * 3 + 1], sz = start[i * 3 + 2];
      const tx = target[i * 3], ty = target[i * 3 + 1], tz = target[i * 3 + 2];
      const vx = sx - tx, vy = sy - ty, vz = sz - tz;
      const ang = (1 - e) * Math.PI * 2.2; // 越靠近目标旋转越小 -> 螺旋收敛
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const rx = vx * ca - vy * sa;
      const ry = vx * sa + vy * ca;
      p[i * 3] = tx + rx * (1 - e);
      p[i * 3 + 1] = ty + ry * (1 - e);
      p[i * 3 + 2] = tz + vz * (1 - e);
    }
    if (allDone) {
      state = 'formed';
      stateTime = 0;
    }
  } else if (state === 'formed') {
    // 成型后轻微呼吸抖动
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ph = i * 0.37;
      p[i * 3] = target[i * 3] + Math.sin(t * 1.5 + ph) * 0.008;
      p[i * 3 + 1] = target[i * 3 + 1] + Math.cos(t * 1.3 + ph) * 0.008;
      p[i * 3 + 2] = target[i * 3 + 2] + Math.sin(t * 1.1) * 0.01;
    }
  } else if (state === 'disperse') {
    // 向外飞行 + 阻尼
    const drag = 0.55;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      vel[i * 3] *= 1 - drag * dt;
      vel[i * 3 + 1] *= 1 - drag * dt;
      vel[i * 3 + 2] *= 1 - drag * dt;
      p[i * 3] += vel[i * 3] * dt;
      p[i * 3 + 1] += vel[i * 3 + 1] * dt;
      p[i * 3 + 2] += vel[i * 3 + 2] * dt;
    }
    if (stateTime > DISPERSE_DUR) {
      state = 'reform';
      stateTime = 0;
    }
  } else if (state === 'reform') {
    // 短暂停留并慢慢减速，随后以当前位置为新起点重新汇聚
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      p[i * 3] += vel[i * 3] * dt * 0.25;
      p[i * 3 + 1] += vel[i * 3 + 1] * dt * 0.25;
      p[i * 3 + 2] += vel[i * 3 + 2] * dt * 0.25;
      vel[i * 3] *= 0.97;
      vel[i * 3 + 1] *= 0.97;
      vel[i * 3 + 2] *= 0.97;
    }
    if (stateTime > REFORM_DELAY) {
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) start[i] = p[i];
      for (let i = 0; i < PARTICLE_COUNT; i++) delay[i] = Math.random();
      state = 'gather';
      stateTime = 0;
    }
  }
  posAttr.needsUpdate = true;
}

/* ============================================================
 * 交互：拖拽旋转 + 点击消散
 * ============================================================ */
let rotX = -0.28, rotY = 0;
let dragging = false, lastX = 0, lastY = 0, downX = 0, downY = 0, downT = 0;

renderer.domElement.addEventListener('pointerdown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  downX = e.clientX;
  downY = e.clientY;
  downT = performance.now();
});

window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  rotY += dx * 0.005;
  rotX += dy * 0.005;
  rotX = Math.max(-1.2, Math.min(1.2, rotX));
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener('pointerup', (e) => {
  if (!dragging) return;
  dragging = false;
  // 区分点击与拖拽：位移小且时间短视为点击
  const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
  if (dist < 6 && performance.now() - downT < 400) {
    startDisperse();
    fadeHint();
  }
});

const hint = document.getElementById('hint');
let hintFaded = false;
function fadeHint() {
  if (!hintFaded) {
    hintFaded = true;
    hint.style.opacity = '0';
  }
}

/* ============================================================
 * 主循环
 * ============================================================ */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  update(dt, t);
  spinGroup.rotation.z += 0.003; // 太极平面自转
  tiltGroup.rotation.x += (rotX - tiltGroup.rotation.x) * 0.1;
  tiltGroup.rotation.y += (rotY - tiltGroup.rotation.y) * 0.1;
  stars.rotation.y += 0.0004; // 星空缓慢漂移

  // —— 辉光透明度跟随太极状态 ——
  // gather: 随汇聚进度渐入；formed: 全显；disperse: 渐出；reform: 不可见
  if (state === 'gather') {
    const p = Math.min(1, stateTime / GATHER_DUR);
    glowTargetOpacity = p * 0.35;
  } else if (state === 'formed') {
    glowTargetOpacity = 0.35;
  } else if (state === 'disperse') {
    const p = Math.max(0, 1 - stateTime / DISPERSE_DUR);
    glowTargetOpacity = p * 0.35;
  } else {
    glowTargetOpacity = 0;
  }
  glowMat.opacity += (glowTargetOpacity - glowMat.opacity) * 0.06;

  // —— 辉光呼吸微动（与太极成型后的呼吸同步）——
  const breath = 1 + Math.sin(t * 1.2) * 0.018;
  glowMesh.scale.setScalar(breath * 1.015);

  renderer.render(scene, camera);
}
animate();

/* ============================================================
 * 自适应
 * ============================================================ */
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
