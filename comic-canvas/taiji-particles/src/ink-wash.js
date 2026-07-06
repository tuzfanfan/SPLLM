/**
 * 水墨晕染系统 v4
 *
 * 模拟宣纸上的墨汁扩散：中心微浓，向外逐层变淡，边缘羽化消散。
 *
 * 核心数学技术：
 *
 * 1. 三层高斯扩散模型（模拟宣纸渗透层次）：
 *    - 内核层（core）：2~3 个小而紧的高斯，略浓
 *    - 中晕层（mid）：4~6 个中等高斯，淡
 *    - 外晕层（halo）：3~5 个大而宽的高斯，极淡
 *    叠加后形成从中心到边缘的渐变层次
 *
 * 2. 幂律压缩：field = field^n（n≈1.6~2.2）
 *    压缩高值、拉伸低值 → 中心不过饱，边缘过渡更长
 *
 * 3. 大范围径向衰减：从 0.10R 到 0.49R 线性 smootherstep 衰减
 *    覆盖近 40% 半径，实现逐层变淡的羽化效果
 *
 * 4. 全局强度因子（0.28~0.42）：控制整体浓度，初始即淡
 *
 * 5. 域扭曲 + 乘性 sin 噪声：有机不规则 + 宣纸纹理
 */

/* ============================================================
 * 画布初始化
 * ============================================================ */
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
const appEl = document.getElementById('app');
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

/* ============================================================
 * 数学工具函数
 * ============================================================ */
// smoothstep：Hermite 插值，C¹ 连续，无棱角
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// 更平滑的 quintic 插值：C² 连续
function smootherstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// 缓动函数（用于墨晕冲向太极边缘的运动）
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
// 带轻微回弹的缓出（撞击太极边缘时的弹跳感）
function easeOutBack(t) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/* ============================================================
 * 预生成墨晕贴图（纯数学逐像素计算）
 * ============================================================ */
const STAMP_SIZE = 256;
const HALF = STAMP_SIZE / 2;
const inkStamps = [];

// 晕染色系：R135 G90 B114 为基准，轻微随机偏移
function pickViolet() {
  // 基准色 R135 G90 B114，在 ±15 范围内随机
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

  // ---- 三层高斯扩散模型（模拟宣纸渗透层次）----
  const cores = [];

  // 第一层：内核（core）—— 2~3 个中等高斯，略浓
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

  // 第二层：中晕（mid）—— 4~6 个中等高斯，淡
  const nMid = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < nMid; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.6) * HALF * 0.40; // 扩大分布范围
    cores.push({
      cx: HALF + Math.cos(angle) * dist,
      cy: HALF + Math.sin(angle) * dist,
      sigmaX: HALF * (0.14 + Math.random() * 0.10), // 扩大 sigma
      sigmaY: HALF * (0.14 + Math.random() * 0.10),
      angle: Math.random() * Math.PI,
      weight: 0.08 + Math.random() * 0.08,
    });
  }

  // 第三层：外晕（halo）—— 3~5 个大而宽的高斯，极淡
  const nHalo = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < nHalo; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.5) * HALF * 0.46; // 扩大到接近边缘
    cores.push({
      cx: HALF + Math.cos(angle) * dist,
      cy: HALF + Math.sin(angle) * dist,
      sigmaX: HALF * (0.22 + Math.random() * 0.14), // 显著扩大 sigma
      sigmaY: HALF * (0.22 + Math.random() * 0.14),
      angle: Math.random() * Math.PI,
      weight: 0.03 + Math.random() * 0.04,
    });
  }

  // 额外 1~2 个细长高斯模拟拉丝飘散
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

  // ---- 域扭曲参数（Domain Warping）----
  const warp1Amp = HALF * (0.03 + Math.random() * 0.04);
  const warp1Freq = (1.5 + Math.random() * 2.0) * Math.PI / STAMP_SIZE;
  const warp1PhaseX = Math.random() * Math.PI * 2;
  const warp1PhaseY = Math.random() * Math.PI * 2;
  const warp2Amp = HALF * (0.015 + Math.random() * 0.025);
  const warp2Freq = (3 + Math.random() * 2) * Math.PI / STAMP_SIZE;
  const warp2PhaseX = Math.random() * Math.PI * 2;
  const warp2PhaseY = Math.random() * Math.PI * 2;

  // ---- 噪声场参数 ----
  const noiseFreq = (4 + Math.random() * 3) * Math.PI / STAMP_SIZE;
  const noisePhase = Math.random() * Math.PI * 2;
  const noiseAmp = 0.06 + Math.random() * 0.04; // 更弱的噪声

  // ---- 幂律压缩指数：适度压缩，保留层次但不至于太淡 ----
  const powerN = 1.2 + Math.random() * 0.3; // 1.2~1.5

  // ---- 全局强度因子 ----
  const intensity = 0.65 + Math.random() * 0.20; // 0.65~0.85

  // ---- 逐像素计算 ----
  const imgData = g.createImageData(STAMP_SIZE, STAMP_SIZE);
  const data = imgData.data;

  for (let py = 0; py < STAMP_SIZE; py++) {
    for (let px = 0; px < STAMP_SIZE; px++) {
      // 1. 域扭曲
      const wx = px + warp1Amp * Math.sin(warp1Freq * py + warp1PhaseX)
                   + warp2Amp * Math.sin(warp2Freq * py + warp2PhaseX);
      const wy = py + warp1Amp * Math.sin(warp1Freq * px + warp1PhaseY)
                   + warp2Amp * Math.sin(warp2Freq * px + warp2PhaseY);

      // 2. 三层高斯混合累加
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

      // 3. 幂律压缩：压高拉低 → 中心不过饱，边缘过渡更长
      field = Math.pow(field, powerN);

      // 4. 乘性噪声
      const noise = 1.0 + noiseAmp * Math.sin(noiseFreq * px + noiseFreq * 1.3 * py + noisePhase)
                                * Math.sin(noiseFreq * 0.7 * py - noisePhase);
      field *= noise;

      // 5. 大范围径向衰减：从 0.05R 到 0.495R 平滑衰减
      //    覆盖近 45% 半径 → 更宽的逐层变淡羽化
      const distFromCenter = Math.hypot(px - HALF, py - HALF);
      const edgeMask = smootherstep(STAMP_SIZE * 0.495, STAMP_SIZE * 0.05, distFromCenter);
      field *= edgeMask;

      // 6. 全局强度
      field *= intensity;

      // 7. 限幅
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

/* ============================================================
 * 墨点溅射贴图（小颗粒）
 * ============================================================ */
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

/* ============================================================
 * 太极屏幕半径计算
 * ============================================================ */
const CAMERA_Z = 6.5;
const CAMERA_FOV = 55;
const TAIJI_R = 2.2;

function getTaijiScreenRadius() {
  const dist = CAMERA_Z;
  const visibleH = 2 * dist * Math.tan((CAMERA_FOV * Math.PI / 180) / 2);
  const ratio = TAIJI_R / visibleH;
  return ratio * H;
}

/* ============================================================
 * 墨晕 Bloom：一次完整的水墨晕染生命周期
 * ============================================================ */
class Bloom {
  constructor() { this.init(); }

  init(forbiddenQuad) {
    const cx = W / 2, cy = H / 2;
    const taijiR = getTaijiScreenRadius();

    this.baseScale = 0.8 + Math.random() * 1.4;
    this.growScale = this.baseScale * (2.0 + Math.random() * 1.0);
    const maxDrawRadius = (STAMP_SIZE * this.growScale) / 2;

    // 安全距离 = 太极半径 + 间隙 + 墨晕可见半径
    const bloomVisibleR = maxDrawRadius * 0.40;
    // 垂直方向墨晕外层极淡，实际可见半径更小，用 0.28 避免过度排斥
    const bloomVisibleR_vert = maxDrawRadius * 0.28;
    // 太极倾斜 0.28rad，垂直投影为 cos(0.28) ≈ 0.961 倍水平半径
    const tiltCos = Math.cos(0.28);
    // 水平：太极半径 + 50px 间隙；垂直：太极投影半径 + 30px 间隙
    const minDistX = taijiR + 50 + bloomVisibleR;
    const minDistY = taijiR * tiltCos + 30 + bloomVisibleR_vert;
    const edgeMargin = maxDrawRadius * 0.35;

    // 椭圆排除判定：(x-cx)/minDistX)^2 + ((y-cy)/minDistY)^2 < 1
    const inExclusion = (x, y) => {
      const nx = (x - cx) / minDistX;
      const ny = (y - cy) / minDistY;
      return nx * nx + ny * ny < 1;
    };

    // 上下部区域范围（minDistY 已含墨晕可见半径，不再重复扣减 edgeMargin）
    const screenEdge = 20;                              // 屏幕边缘小留白
    const topBand    = cy - minDistY;                   // 上部可用 y 上界
    const bottomBand = cy + minDistY;                   // 下部可用 y 下界
    const bottomMax  = H - screenEdge;

    let x, y, tries = 0;
    do {
      // 65% 概率偏向上下部生成，35% 正常全屏随机
      if (Math.random() < 0.65) {
        x = screenEdge + Math.random() * (W - 2 * screenEdge);
        // 随机选上部或下部
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
      // 3秒内的墨晕不能出现在与上一个相同的象限
      (forbiddenQuad >= 0 && getQuadrant(x, y) === forbiddenQuad)
    ) && tries < 60);

    if (inExclusion(x, y) ||
        (forbiddenQuad >= 0 && getQuadrant(x, y) === forbiddenQuad)) {
      this.dead = true;
      return;
    }

    // ---- 生成位置（起始点）----
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;

    // ---- 判定方向：上方/下方（垂直方向）不做冲刺，只做扩散 ----
    const dx0 = x - cx, dy0 = y - cy;
    this.isVertical = Math.abs(dy0) > Math.abs(dx0); // 垂直分量占主导

    this.age = 0;
    this.life = 5 + Math.random() * 6;

    if (this.isVertical) {
      // ---- 上方/下方：原地扩散，无冲刺 ----
      this.targetX = x;
      this.targetY = y;
      this.rushRatio    = 0;     // 无冲刺
      this.diffuseRatio = 0.54;  // 扩散占比加大（吸收冲刺时间）
      this.fadeOutRatio = 0.32;
      this.holdRatio    = 1 - this.rushRatio - this.diffuseRatio - this.fadeOutRatio;
      this.startScale   = this.baseScale;      // 从 baseScale 开始膨胀
      this.diffuseAlphaStart = 0;              // 透明度从 0 开始
      this.rushAngle    = 0;
    } else {
      // ---- 左侧/右侧：冲刺 → 扩散 ----
      // 求射线 (cx+t*dx, cy+t*dy) 与椭圆边界的交点参数 t
      const aTerm = (dx0 / minDistX) * (dx0 / minDistX) + (dy0 / minDistY) * (dy0 / minDistY);
      const tHit = 1 / Math.sqrt(aTerm);
      this.targetX = cx + dx0 * tHit;
      this.targetY = cy + dy0 * tHit;
      this.moveDist = Math.hypot(dx0, dy0) * (1 - tHit);

      this.rushRatio    = 0.18;
      this.diffuseRatio = 0.36;
      this.fadeOutRatio = 0.32;
      this.holdRatio    = 1 - this.rushRatio - this.diffuseRatio - this.fadeOutRatio;
      this.startScale   = this.baseScale * 0.45; // 冲刺小尺寸
      this.diffuseAlphaStart = 0.45;             // 冲刺后透明度起点
      this.rushAngle    = Math.atan2(this.targetY - this.startY, this.targetX - this.startX);
    }

    this.stamp = inkStamps[(Math.random() * inkStamps.length) | 0];
    this.rotation = Math.random() * Math.PI * 2;
    this.opacity = 0.60 + Math.random() * 0.30; // 0.60~0.90

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

    // ---- 冲刺阶段：位置从起点插值到太极边缘目标（无冲刺则原地不动）----
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

    // ---- 透明度：冲刺期快速亮起 → 扩散期补满 → 停留 → 消散 ----
    let alpha;
    if (rushEnd > 0 && t < rushEnd) {
      // 冲刺期：快速提升（0 → 0.75），让冲刺过程清晰可见
      const rt = t / rushEnd;
      alpha = easeOutCubic(rt) * 0.75;
    } else if (t < diffuseEnd) {
      // 扩散期：从起点渐满到 1.0
      const dt = (t - rushEnd) / this.diffuseRatio;
      alpha = this.diffuseAlphaStart + easeOutCubic(dt) * (1 - this.diffuseAlphaStart);
    } else if (t < holdEnd) {
      alpha = 1;
    } else {
      alpha = 1 - (t - holdEnd) / this.fadeOutRatio;
    }
    alpha = Math.max(0, Math.min(1, alpha)) * this.opacity;

    // ---- 尺寸：冲刺期保持小尺寸 → 扩散期膨胀 ----
    let curScale;
    if (rushEnd > 0 && t < rushEnd) {
      curScale = this.startScale;
    } else if (t < diffuseEnd) {
      const dt = (t - rushEnd) / this.diffuseRatio;
      // 垂直方向无回弹（没有撞击），水平方向有回弹
      const e = this.isVertical ? easeOutCubic(dt) : easeOutBack(dt);
      curScale = this.startScale + (this.growScale - this.startScale) * e;
    } else {
      curScale = this.growScale;
    }

    const drawSize = STAMP_SIZE * curScale;

    // ---- 冲刺拖尾：6 个递减残影 + 方向拉伸，形成彗星尾（仅水平方向有冲刺）----
    if (rushEnd > 0 && t < rushEnd && t > 0.02) {
      const trailCount = 6;
      const trailSpacing = 0.035; // 时间间距
      for (let i = 1; i <= trailCount; i++) {
        const trailT = Math.max(0, t - i * trailSpacing);
        if (trailT <= 0) continue;
        const rt = trailT / rushEnd;
        const e = easeInOutCubic(rt);
        const tx = this.startX + (this.targetX - this.startX) * e;
        const ty = this.startY + (this.targetY - this.startY) * e;
        // 拖尾透明度：越远越淡，但整体提高
        const trailAlpha = alpha * Math.pow(1 - i / (trailCount + 1), 1.5) * 0.6;
        // 拖尾尺寸：逐渐缩小
        const trailScale = this.startScale * (1 - i * 0.12);
        const trailSize = STAMP_SIZE * trailScale;
        // 沿冲刺方向拉伸（越靠后越扁，模拟运动模糊）
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

    // ---- 主墨晕：冲刺阶段沿方向拉伸，否则正常绘制 ----
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    if (rushEnd > 0 && t < rushEnd) {
      // 冲刺期：沿运动方向拉伸 1.6×，垂直方向压缩 0.85×
      ctx.rotate(this.rushAngle);
      ctx.scale(1.6, 0.85);
      ctx.rotate(-this.rushAngle);
      ctx.rotate(this.rotation);
    } else {
      ctx.rotate(this.rotation);
    }
    ctx.drawImage(this.stamp, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    ctx.restore();

    // ---- 墨点溅射：仅在扩散阶段后出现 ----
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

/* ============================================================
 * 象限工具：将屏幕分为四象限，用于 3 秒内避免同侧重复生成
 * ============================================================ */
// 0=左上, 1=右上, 2=左下, 3=右下
function getQuadrant(x, y) {
  const cx = W / 2, cy = H / 2;
  if (x < cx && y < cy) return 0;
  if (x >= cx && y < cy) return 1;
  if (x < cx && y >= cy) return 2;
  return 3;
}

/* ============================================================
 * 墨晕管理器
 * ============================================================ */
const blooms = [];
const MAX_BLOOMS = 12;                        // 同屏最多 12 个
let spawnTimer = 0;
let spawnInterval = 0.3 + Math.random() * 0.4; // 0.3~0.7s（平均0.5s）

// 象限互斥：记录上次生成的象限和时间，3秒内不重复
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
    // 判断是否在 3 秒锁定期内：若是则禁用上次象限
    const nowAbs = performance.now() / 1000;
    const inLock = (nowAbs - lastSpawnAbsTime) < QUAD_LOCK_SEC;
    const forbidden = inLock ? lastSpawnQuad : -1;

    spawnTimer = 0;
    spawnInterval = 0.3 + Math.random() * 0.4; // 0.3~0.7s（平均0.5s）
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
