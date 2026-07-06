/**
 * TaijiCanvas 背景效果 — 太极粒子 + 水墨晕染
 *
 * 此文件是 taiji-particles/src/main.js + ink-wash.js 的 1:1 忠实移植。
 * 仅做以下最小改动：
 * 1. 挂载点从 #app 改为自建 div（避免与 Excalidraw #root 冲突）
 * 2. 移除用户交互（pointerdown/move/up），改为自动循环消散
 * 3. 所有 canvas 设为 pointer-events:none
 * 4. 移除 tiltGroup 的拖拽旋转（保留固定倾斜）
 *
 * 所有粒子颜色、墨晕参数、动画曲线、材质设置与原始项目完全一致。
 */

import * as THREE from 'three';

/* ============================================================
 * 背景容器：模拟原始 #app 的作用
 * ============================================================ */
const appEl = document.createElement('div');
appEl.id = 'taiji-app';
appEl.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
document.body.insertBefore(appEl, document.body.firstChild);

/* ============================================================
 * 水墨晕染系统 v4（原始 ink-wash.js 完整复制）
 * ============================================================ */

/* ---- 画布初始化 ---- */
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
appEl.parentNode.insertBefore(canvas, appEl);

const ctx = canvas.getContext('2d');
let W = 0, H = 0, DPR = 1;

function resize() {
  DPR = Math.min(devicePixelRatio, 2);
  W = innerWidth;
  H = innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resize();
window.addEventListener('resize', resize);

/* ---- 数学工具函数 ---- */
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function smootherstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutBack(t) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/* ---- 预生成墨晕贴图 ---- */
const STAMP_SIZE = 256;
const HALF = STAMP_SIZE / 2;
const inkStamps = [];

function pickViolet() {
  return {
    r: (120 + Math.random() * 30) | 0,
    g: (78 + Math.random() * 24)  | 0,
    b: (100 + Math.random() * 28) | 0,
  };
}

function makeInkStamp() {
  const c = document.createElement('canvas');
  c.width = c.height = STAMP_SIZE;
  const g = c.getContext('2d');
  const col = pickViolet();

  const cores = [];

  const nCore = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < nCore; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.8) * HALF * 0.15;
    cores.push({
      cx: HALF + Math.cos(angle) * dist,
      cy: HALF + Math.sin(angle) * dist,
      sigmaX: HALF * (0.07 + Math.random() * 0.06),
      sigmaY: HALF * (0.07 + Math.random() * 0.06),
      angle: Math.random() * Math.PI,
      weight: 0.20 + Math.random() * 0.15,
    });
  }

  const nMid = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < nMid; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.6) * HALF * 0.40;
    cores.push({
      cx: HALF + Math.cos(angle) * dist,
      cy: HALF + Math.sin(angle) * dist,
      sigmaX: HALF * (0.14 + Math.random() * 0.10),
      sigmaY: HALF * (0.14 + Math.random() * 0.10),
      angle: Math.random() * Math.PI,
      weight: 0.08 + Math.random() * 0.08,
    });
  }

  const nHalo = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < nHalo; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.5) * HALF * 0.46;
    cores.push({
      cx: HALF + Math.cos(angle) * dist,
      cy: HALF + Math.sin(angle) * dist,
      sigmaX: HALF * (0.22 + Math.random() * 0.14),
      sigmaY: HALF * (0.22 + Math.random() * 0.14),
      angle: Math.random() * Math.PI,
      weight: 0.03 + Math.random() * 0.04,
    });
  }

  const nWisps = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < nWisps; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = HALF * (0.12 + Math.random() * 0.18);
    cores.push({
      cx: HALF + Math.cos(angle) * dist,
      cy: HALF + Math.sin(angle) * dist,
      sigmaX: HALF * (0.025 + Math.random() * 0.025),
      sigmaY: HALF * (0.14 + Math.random() * 0.12),
      angle: angle + (Math.random() - 0.5) * 0.5,
      weight: 0.04 + Math.random() * 0.06,
    });
  }

  const warp1Amp = HALF * (0.03 + Math.random() * 0.04);
  const warp1Freq = (1.5 + Math.random() * 2.0) * Math.PI / STAMP_SIZE;
  const warp1PhaseX = Math.random() * Math.PI * 2;
  const warp1PhaseY = Math.random() * Math.PI * 2;
  const warp2Amp = HALF * (0.015 + Math.random() * 0.025);
  const warp2Freq = (3 + Math.random() * 2) * Math.PI / STAMP_SIZE;
  const warp2PhaseX = Math.random() * Math.PI * 2;
  const warp2PhaseY = Math.random() * Math.PI * 2;

  const noiseFreq = (4 + Math.random() * 3) * Math.PI / STAMP_SIZE;
  const noisePhase = Math.random() * Math.PI * 2;
  const noiseAmp = 0.06 + Math.random() * 0.04;

  const powerN = 1.2 + Math.random() * 0.3;
  const intensity = 0.65 + Math.random() * 0.20;

  const imgData = g.createImageData(STAMP_SIZE, STAMP_SIZE);
  const data = imgData.data;

  for (let py = 0; py < STAMP_SIZE; py++) {
    for (let px = 0; px < STAMP_SIZE; px++) {
      const wx = px + warp1Amp * Math.sin(warp1Freq * py + warp1PhaseX)
                   + warp2Amp * Math.sin(warp2Freq * py + warp2PhaseX);
      const wy = py + warp1Amp * Math.sin(warp1Freq * px + warp1PhaseY)
                   + warp2Amp * Math.sin(warp2Freq * px + warp2PhaseY);

      let field = 0;
      for (let i = 0; i < cores.length; i++) {
        const co = cores[i];
        const dx = wx - co.cx;
        const dy = wy - co.cy;
        const ca = Math.cos(co.angle);
        const sa = Math.sin(co.angle);
        const lx = dx * ca + dy * sa;
        const ly = -dx * sa + dy * ca;
        const sx2 = co.sigmaX * co.sigmaX;
        const sy2 = co.sigmaY * co.sigmaY;
        field += co.weight * Math.exp(-0.5 * (lx * lx / sx2 + ly * ly / sy2));
      }

      field = Math.pow(field, powerN);

      const noise = 1.0 + noiseAmp * Math.sin(noiseFreq * px + noiseFreq * 1.3 * py + noisePhase)
                                * Math.sin(noiseFreq * 0.7 * py - noisePhase);
      field *= noise;

      const distFromCenter = Math.hypot(px - HALF, py - HALF);
      const edgeMask = smootherstep(STAMP_SIZE * 0.495, STAMP_SIZE * 0.05, distFromCenter);
      field *= edgeMask;

      field *= intensity;

      const alpha = Math.max(0, Math.min(1, field));

      if (alpha > 0.001) {
        const idx = (py * STAMP_SIZE + px) * 4;
        data[idx] = col.r;
        data[idx + 1] = col.g;
        data[idx + 2] = col.b;
        data[idx + 3] = (alpha * 255) | 0;
      }
    }
  }

  g.putImageData(imgData, 0, 0);
  return c;
}

for (let i = 0; i < 10; i++) inkStamps.push(makeInkStamp());

/* ---- 墨点溅射贴图 ---- */
function makeSpeckStamp() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const dots = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < dots; i++) {
    const dx = 32 + (Math.random() - 0.5) * 40;
    const dy = 32 + (Math.random() - 0.5) * 40;
    const dr = 1 + Math.random() * 3;
    const a = 0.15 + Math.random() * 0.25;
    g.fillStyle = `rgba(135,90,114,${a})`;
    g.beginPath();
    g.arc(dx, dy, dr, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}
const speckStamps = [];
for (let i = 0; i < 5; i++) speckStamps.push(makeSpeckStamp());

/* ---- 太极屏幕半径计算 ---- */
const CAMERA_Z = 6.5;
const CAMERA_FOV = 55;
const TAIJI_R = 2.2;

function getTaijiScreenRadius() {
  const dist = CAMERA_Z;
  const visibleH = 2 * dist * Math.tan((CAMERA_FOV * Math.PI / 180) / 2);
  const ratio = TAIJI_R / visibleH;
  return ratio * H;
}

/* ---- 墨晕 Bloom 类 ---- */
class Bloom {
  constructor() { this.init(); }

  init(forbiddenQuad) {
    const cx = W / 2, cy = H / 2;
    const taijiR = getTaijiScreenRadius();

    this.baseScale = 0.8 + Math.random() * 1.4;
    this.growScale = this.baseScale * (2.0 + Math.random() * 1.0);
    const maxDrawRadius = (STAMP_SIZE * this.growScale) / 2;

    const bloomVisibleR = maxDrawRadius * 0.40;
    const bloomVisibleR_vert = maxDrawRadius * 0.28;
    const tiltCos = Math.cos(0.28);
    const minDistX = taijiR + 50 + bloomVisibleR;
    const minDistY = taijiR * tiltCos + 30 + bloomVisibleR_vert;
    const edgeMargin = maxDrawRadius * 0.35;

    const inExclusion = (x, y) => {
      const nx = (x - cx) / minDistX;
      const ny = (y - cy) / minDistY;
      return nx * nx + ny * ny < 1;
    };

    const screenEdge = 20;
    const topBand    = cy - minDistY;
    const bottomBand = cy + minDistY;
    const bottomMax  = H - screenEdge;

    let x, y, tries = 0;
    do {
      if (Math.random() < 0.65) {
        x = screenEdge + Math.random() * (W - 2 * screenEdge);
        if (Math.random() < 0.5 && topBand > screenEdge) {
          y = screenEdge + Math.random() * (topBand - screenEdge);
        } else if (bottomMax > bottomBand) {
          y = bottomBand + Math.random() * (bottomMax - bottomBand);
        } else {
          y = screenEdge + Math.random() * (H - 2 * screenEdge);
        }
      } else {
        x = edgeMargin + Math.random() * (W - 2 * edgeMargin);
        y = edgeMargin + Math.random() * (H - 2 * edgeMargin);
      }
      tries++;
    } while ((
      inExclusion(x, y) ||
      (forbiddenQuad >= 0 && getQuadrant(x, y) === forbiddenQuad)
    ) && tries < 60);

    if (inExclusion(x, y) ||
        (forbiddenQuad >= 0 && getQuadrant(x, y) === forbiddenQuad)) {
      this.dead = true;
      return;
    }

    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    const dx0 = x - cx, dy0 = y - cy;
    this.isVertical = Math.abs(dy0) > Math.abs(dx0);

    this.age = 0;
    this.life = 5 + Math.random() * 6;

    if (this.isVertical) {
      this.targetX = x;
      this.targetY = y;
      this.rushRatio    = 0;
      this.diffuseRatio = 0.54;
      this.fadeOutRatio = 0.32;
      this.holdRatio    = 1 - this.rushRatio - this.diffuseRatio - this.fadeOutRatio;
      this.startScale   = this.baseScale;
      this.diffuseAlphaStart = 0;
      this.rushAngle    = 0;
    } else {
      const aTerm = (dx0 / minDistX) * (dx0 / minDistX) + (dy0 / minDistY) * (dy0 / minDistY);
      const tHit = 1 / Math.sqrt(aTerm);
      this.targetX = cx + dx0 * tHit;
      this.targetY = cy + dy0 * tHit;
      this.moveDist = Math.hypot(dx0, dy0) * (1 - tHit);

      this.rushRatio    = 0.18;
      this.diffuseRatio = 0.36;
      this.fadeOutRatio = 0.32;
      this.holdRatio    = 1 - this.rushRatio - this.diffuseRatio - this.fadeOutRatio;
      this.startScale   = this.baseScale * 0.45;
      this.diffuseAlphaStart = 0.45;
      this.rushAngle    = Math.atan2(this.targetY - this.startY, this.targetX - this.startX);
    }

    this.stamp = inkStamps[(Math.random() * inkStamps.length) | 0];
    this.rotation = Math.random() * Math.PI * 2;
    this.opacity = 0.60 + Math.random() * 0.30;

    this.specks = [];
    if (Math.random() < 0.6) {
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        this.specks.push({
          dx: (Math.random() - 0.5) * 180 * this.baseScale,
          dy: (Math.random() - 0.5) * 180 * this.baseScale,
          stamp: speckStamps[(Math.random() * speckStamps.length) | 0],
          scale: 0.4 + Math.random() * 0.6,
          rotation: Math.random() * Math.PI * 2,
          delay: Math.random() * 0.3,
        });
      }
    }
  }

  update(dt) {
    if (this.dead) return false;
    this.age += dt;

    const t = this.age / this.life;

    if (this.rushRatio > 0 && t < this.rushRatio) {
      const rt = t / this.rushRatio;
      const e = easeInOutCubic(rt);
      this.x = this.startX + (this.targetX - this.startX) * e;
      this.y = this.startY + (this.targetY - this.startY) * e;
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }

    return this.age < this.life;
  }

  draw(ctx) {
    if (this.dead) return;
    const t = this.age / this.life;

    const rushEnd    = this.rushRatio;
    const diffuseEnd = this.rushRatio + this.diffuseRatio;
    const holdEnd    = diffuseEnd + this.holdRatio;

    let alpha;
    if (rushEnd > 0 && t < rushEnd) {
      const rt = t / rushEnd;
      alpha = easeOutCubic(rt) * 0.75;
    } else if (t < diffuseEnd) {
      const dt = (t - rushEnd) / this.diffuseRatio;
      alpha = this.diffuseAlphaStart + easeOutCubic(dt) * (1 - this.diffuseAlphaStart);
    } else if (t < holdEnd) {
      alpha = 1;
    } else {
      alpha = 1 - (t - holdEnd) / this.fadeOutRatio;
    }
    alpha = Math.max(0, Math.min(1, alpha)) * this.opacity;

    let curScale;
    if (rushEnd > 0 && t < rushEnd) {
      curScale = this.startScale;
    } else if (t < diffuseEnd) {
      const dt = (t - rushEnd) / this.diffuseRatio;
      const e = this.isVertical ? easeOutCubic(dt) : easeOutBack(dt);
      curScale = this.startScale + (this.growScale - this.startScale) * e;
    } else {
      curScale = this.growScale;
    }

    const drawSize = STAMP_SIZE * curScale;

    if (rushEnd > 0 && t < rushEnd && t > 0.02) {
      const trailCount = 6;
      const trailSpacing = 0.035;
      for (let i = 1; i <= trailCount; i++) {
        const trailT = Math.max(0, t - i * trailSpacing);
        if (trailT <= 0) continue;
        const rt = trailT / rushEnd;
        const e = easeInOutCubic(rt);
        const tx = this.startX + (this.targetX - this.startX) * e;
        const ty = this.startY + (this.targetY - this.startY) * e;
        const trailAlpha = alpha * Math.pow(1 - i / (trailCount + 1), 1.5) * 0.6;
        const trailScale = this.startScale * (1 - i * 0.12);
        const trailSize = STAMP_SIZE * trailScale;
        const stretchX = 1 + i * 0.15;
        const stretchY = 1 - i * 0.06;
        ctx.save();
        ctx.globalAlpha = trailAlpha;
        ctx.translate(tx, ty);
        ctx.rotate(this.rushAngle);
        ctx.scale(stretchX, stretchY);
        ctx.drawImage(this.stamp, -trailSize / 2, -trailSize / 2, trailSize, trailSize);
        ctx.restore();
      }
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    if (rushEnd > 0 && t < rushEnd) {
      ctx.rotate(this.rushAngle);
      ctx.scale(1.6, 0.85);
      ctx.rotate(-this.rushAngle);
      ctx.rotate(this.rotation);
    } else {
      ctx.rotate(this.rotation);
    }
    ctx.drawImage(this.stamp, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    ctx.restore();

    if (t > rushEnd) {
      for (const s of this.specks) {
        const st = Math.max(0, (t - rushEnd - s.delay * this.diffuseRatio) / (1 - rushEnd - s.delay * this.diffuseRatio));
        if (st <= 0) continue;
        let sa;
        if (st < 0.2) sa = st / 0.2;
        else if (st < 0.7) sa = 1;
        else sa = 1 - (st - 0.7) / 0.3;
        sa = Math.max(0, Math.min(1, sa)) * this.opacity * 0.7;

        const ss = s.scale * curScale * 0.5;
        const sd = 64 * ss;
        ctx.save();
        ctx.globalAlpha = sa;
        ctx.translate(this.x + s.dx, this.y + s.dy);
        ctx.rotate(s.rotation);
        ctx.drawImage(s.stamp, -sd / 2, -sd / 2, sd, sd);
        ctx.restore();
      }
    }
  }
}

/* ---- 象限工具 ---- */
function getQuadrant(x, y) {
  const cx = W / 2, cy = H / 2;
  if (x < cx && y < cy) return 0;
  if (x >= cx && y < cy) return 1;
  if (x < cx && y >= cy) return 2;
  return 3;
}

/* ---- 墨晕管理器 ---- */
const blooms = [];
const MAX_BLOOMS = 12;
let spawnTimer = 0;
let spawnInterval = 0.3 + Math.random() * 0.4;

let lastSpawnQuad = -1;
let lastSpawnAbsTime = 0;
const QUAD_LOCK_SEC = 3.0;

let lastTime = performance.now();

function tick() {
  requestAnimationFrame(tick);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  spawnTimer += dt;
  if (spawnTimer > spawnInterval && blooms.length < MAX_BLOOMS) {
    const nowAbs = performance.now() / 1000;
    const inLock = (nowAbs - lastSpawnAbsTime) < QUAD_LOCK_SEC;
    const forbidden = inLock ? lastSpawnQuad : -1;

    spawnTimer = 0;
    spawnInterval = 0.3 + Math.random() * 0.4;
    const bloom = new Bloom(forbidden);
    if (!bloom.dead) {
      lastSpawnQuad = getQuadrant(bloom.x, bloom.y);
      lastSpawnAbsTime = nowAbs;
      blooms.push(bloom);
    }
  }

  ctx.clearRect(0, 0, W, H);
  for (let i = blooms.length - 1; i >= 0; i--) {
    if (!blooms[i].update(dt)) {
      blooms.splice(i, 1);
    } else {
      blooms[i].draw(ctx);
    }
  }
}
tick();

/* ============================================================
 * Three.js 太极粒子系统（原始 main.js 完整复制）
 * ============================================================ */

/* ---- 配置参数 ---- */
const PARTICLE_COUNT = 20000;
const R = 2.2;
const EYE_COUNT = 1200;
const GATHER_DUR = 3.2;
const DISPERSE_DUR = 2.6;
const REFORM_DELAY = 1.4;
const FORMED_HOLD = 7.0;  // 改动：成型后自动消散（原始项目由点击触发）

/* ---- 场景 / 相机 / 渲染器 ---- */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 0, 6.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
// 改动：pointer-events:none，让 Excalidraw 接收所有交互
renderer.domElement.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;';
appEl.appendChild(renderer.domElement);

// 双层 Group：外层控制倾斜，内层做平面自转
const tiltGroup = new THREE.Group();
tiltGroup.rotation.x = -0.28;
scene.add(tiltGroup);
const spinGroup = new THREE.Group();
tiltGroup.add(spinGroup);

/* ---- 圆形光点贴图 ---- */
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

/* ---- 太极区域判定 ---- */
function inYang(x, y) {
  if (y >= 0) {
    const xc = -Math.sqrt(Math.max(0, (R / 2) * (R / 2) - (y - R / 2) * (y - R / 2)));
    return x > xc;
  } else {
    const xc = Math.sqrt(Math.max(0, (R / 2) * (R / 2) - (y + R / 2) * (y + R / 2)));
    return x > xc;
  }
}

/* ---- 生成目标位置与颜色 ---- */
const target = new Float32Array(PARTICLE_COUNT * 3);
const vcolor = new Float32Array(PARTICLE_COUNT * 3);
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
  const rr = R * Math.sqrt(Math.random());
  const th = Math.random() * Math.PI * 2;
  const x = rr * Math.cos(th);
  const y = rr * Math.sin(th);
  const z = (Math.random() - 0.5) * 0.06;
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

/* ---- 起始散落位置 ---- */
const start = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const r = 6 + Math.random() * 9;
  const th = Math.random() * Math.PI * 2;
  const ph = Math.acos(2 * Math.random() - 1);
  start[i * 3] = r * Math.sin(ph) * Math.cos(th);
  start[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
  start[i * 3 + 2] = r * Math.cos(ph);
}

/* ---- 粒子几何与材质 ---- */
const posAttr = new THREE.BufferAttribute(new Float32Array(start), 3);
const colAttr = new THREE.BufferAttribute(vcolor, 3);
const geom = new THREE.BufferGeometry();
geom.setAttribute('position', posAttr);
geom.setAttribute('color', colAttr);

const mat = new THREE.PointsMaterial({
  size: 0.045,
  map: dotTex,
  vertexColors: true,
  transparent: true,
  blending: THREE.NormalBlending,
  depthWrite: false,
  sizeAttenuation: true,
});
const points = new THREE.Points(geom, mat);
spinGroup.add(points);

/* ---- 背景星点 ---- */
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
  color: 0xc8d2e0,
  transparent: true,
  opacity: 0.32,
  blending: THREE.NormalBlending,
  depthWrite: false,
  sizeAttenuation: true,
});
const stars = new THREE.Points(starGeom, starMat);
scene.add(stars);

/* ---- 太极辉光 ---- */
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
glowMesh.position.z = -0.5;
glowMesh.renderOrder = -1;
tiltGroup.add(glowMesh);

let glowTargetOpacity = 0;

/* ---- 动画状态机：gather -> formed -> disperse -> reform -> gather ---- */
const vel = new Float32Array(PARTICLE_COUNT * 3);
const delay = new Float32Array(PARTICLE_COUNT);
for (let i = 0; i < PARTICLE_COUNT; i++) delay[i] = Math.random();

let state = 'gather';
let stateTime = 0;

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

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
      const ang = (1 - e) * Math.PI * 2.2;
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
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ph = i * 0.37;
      p[i * 3] = target[i * 3] + Math.sin(t * 1.5 + ph) * 0.008;
      p[i * 3 + 1] = target[i * 3 + 1] + Math.cos(t * 1.3 + ph) * 0.008;
      p[i * 3 + 2] = target[i * 3 + 2] + Math.sin(t * 1.1) * 0.01;
    }
    // 改动：成型后自动消散（原始项目由点击触发）
    if (stateTime > FORMED_HOLD) {
      startDisperse();
    }
  } else if (state === 'disperse') {
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

/* ---- 主循环 ---- */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  update(dt, t);
  spinGroup.rotation.z += 0.003; // 太极平面自转
  // 改动：移除拖拽旋转，保持固定倾斜
  stars.rotation.y += 0.0004; // 星空缓慢漂移

  // 辉光透明度跟随太极状态
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

  const breath = 1 + Math.sin(t * 1.2) * 0.018;
  glowMesh.scale.setScalar(breath * 1.015);

  renderer.render(scene, camera);
}
animate();

/* ---- 自适应 ---- */
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
