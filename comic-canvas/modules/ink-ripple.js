/* ============================================================
   水墨流体动画 — 响应音频律动的流动阴影系统
   结合 FlowController + AudioReactor，
   让背景水波纹随音乐低频能量产生水墨绽放效果。
============================================================ */

export function initInkRippleAnimation(){
  const filter = document.getElementById('shadowFilter');
  if (!filter) return;

  const turbulences = filter.querySelectorAll('feTurbulence');
  const displacementMaps = filter.querySelectorAll('feDisplacementMap');
  const matrices = filter.querySelectorAll('feColorMatrix');
  const hueEl = matrices[1] || matrices[matrices.length - 1] || null;

  if (turbulences.length < 3) return;

  const t1 = turbulences[0]; // 主流层（深水波）
  const t2 = turbulences[1]; // 逆流层（中层涡流）
  const t3 = turbulences[2]; // 细纹层（水面微涟漪）

  const d1 = displacementMaps[0]; // 大波位移
  const d2 = displacementMaps[1]; // 中波位移
  const d3 = displacementMaps[2]; // 微涟漪位移

  let startTime = performance.now();
  let animFrameId = null;
  let audioBass = 0, audioMid = 0, audioTreble = 0;
  let bassPeak = 0;
  let lastBassForSplash = 0;
  let lastSplashTime = -10;

  // 水墨绽放粒子
  const inkSplashes = [];
  const inkParticles = [];
  const MAX_SPLASHES = 18;
  const MAX_PARTICLES = 120;

  function seededRandom(seed){
    const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  const PHI = (1 + Math.sqrt(5)) / 2;
  const SQ2 = Math.sqrt(2), SQ3 = Math.sqrt(3);
  const SQ5 = Math.sqrt(5), SQ7 = Math.sqrt(7);

  // ── 中央发射器 ──
  let emitterTimer = 0;
  const BEAM_INTERVAL = 0.25;       // 每隔多久发射一束（更频繁）
  const BEAM_COUNT = 5;             // 每束粒子数
  const BEAM_SPEED_BASE = 1.0;      // 基础速度（提升）
  const BEAM_LIFETIME = 10;         // 粒子存活秒数（延长）

  function createBeam(){
    // 随机角度发射
    const angle = Math.random() * Math.PI * 2;
    const speed = BEAM_SPEED_BASE + Math.random() * 0.8;
    const spread = 0.3 + Math.random() * 0.4; // 扇形扩散弧度
    const numPoints = BEAM_COUNT + Math.floor(seededRandom(performance.now() / 50) * 6);

    for (let i = 0; i < numPoints; i++){
      // 扇形扩散：中心角度 ± 一半扇形
      const spreadAngle = angle + (i / numPoints - 0.5) * spread;
      const spd = speed * (0.7 + seededRandom(i + 500) * 0.6);
      inkParticles.push({
        x: 0, y: 0,                        // 从中心发射
        vx: Math.cos(spreadAngle) * spd,
        vy: Math.sin(spreadAngle) * spd,
        life: 1,
        decay: 1 / BEAM_LIFETIME * (0.6 + seededRandom(i + 600) * 0.8),
        size: 3 + seededRandom(i + 700) * 5,
        alpha: 0.4 + seededRandom(i + 800) * 0.4,
        angle: spreadAngle,                // 记录初始角度
      });
      if (inkParticles.length > MAX_PARTICLES) inkParticles.shift();
    }

    inkSplashes.push({ t0: performance.now() / 1000, angle, numPoints });
    if (inkSplashes.length > MAX_SPLASHES) inkSplashes.shift();
  }

  function animateRipples(now){
    if (!animFrameId) return;
    const t = (now - startTime) / 1000;
    const φ = PHI;

    // ── 基础漂移（三层完全不同的频率基底，永不重合） ──
    // 主流层：低频大尺度 — 用质数频率 17, 23, 31, 41, 47
    const a1 = Math.sin(t * 0.017), a2 = Math.cos(t * 0.023);
    const a3 = Math.sin(t * 0.031 * 1.414), a4 = Math.cos(t * 0.041 * 1.732);
    const a5 = Math.sin(t * 0.047), a6 = Math.cos(t * 0.013);
    let drift1X = a1*0.40+a2*0.25+a3*0.18+a5*0.10+a6*0.07;
    let drift1Y = a4*0.42+a6*0.22+a1*0.20+a3*0.10+a2*0.06;

    // 逆流层：中频不规则 — 用非对称频率 37, 43, 53, 59, 67
    const b1 = Math.sin(t*0.037*1.618), b2 = Math.cos(t*0.043*2.236);
    const b3 = Math.sin(t*0.053*1.414), b4 = Math.cos(t*0.059*2.646);
    const b5 = Math.sin(t*0.067), b6 = Math.cos(t*0.029*1.732);
    let drift2X = b1*0.35+b2*0.28+b3*0.15+b5*0.12+b6*0.10;
    let drift2Y = b4*0.38+b6*0.25+b2*0.20+b3*0.10+b1*0.07;

    // 细纹层：高频随机游走 — 用质数频率 71, 73, 79, 83, 89
    const c1 = Math.sin(t*0.071*2.828), c2 = Math.cos(t*0.073*3.162);
    const c3 = Math.sin(t*0.079*1.732), c4 = Math.cos(t*0.083*2.449);
    const c5 = Math.sin(t*0.087), c6 = Math.cos(t*0.061*2.646);
    let drift3X = c1*0.30+c2*0.32+c3*0.18+c5*0.10+c6*0.06+c4*0.04;
    let drift3Y = c4*0.35+c6*0.28+c2*0.20+c3*0.12+c1*0.05;

    // ── 低频脉冲检测（保留音乐联动） ──
    const bassDelta = audioBass - lastBassForSplash;
    lastBassForSplash = audioBass;
    if (audioBass > 0.35 && bassDelta > 0.05 && t - lastSplashTime > 0.4){
      // 低音突增时额外发射一束
      createBeam();
      lastSplashTime = t;
      bassPeak = audioBass;
    }

    // ── 水墨绽放涟漪叠加 ──
    let rippleX = 0, rippleY = 0, splashScale = 0;
    for (let i = inkSplashes.length - 1; i >= 0; i--){
      const s = inkSplashes[i];
      const age = (now/1000) - s.t0;
      if (age > 8) { inkSplashes.splice(i, 1); continue; }
      const env = Math.exp(-age * 0.3);
      rippleX += Math.cos(s.angle + age * 2) * env * 0.1;
      rippleY += Math.sin(s.angle + age * 1.7) * env * 0.1;
      splashScale += env * 0.15;
    }

    // ── 音频能量调制（三层各自独立的响应曲线） ──
    const bassBoost = 1 + audioBass * 2.5;
    const midDensity = 1 + audioMid * 1.5;
    const trebleSparkle = audioTreble * 0.8;

    // 主流层：受低音驱动，响应较慢
    drift1X *= bassBoost; drift1Y *= bassBoost;
    drift1X += rippleX * (1 + splashScale * 2);
    drift1Y += rippleY * (1 + splashScale * 2);

    // 逆流层：受中频驱动，与主流错位
    drift2X *= midDensity; drift2Y *= midDensity;
    drift2X += rippleX*1.2 + Math.sin(t*3.7)*rippleY*0.3;
    drift2Y += rippleY*1.2 + Math.cos(t*2.9)*rippleX*0.3;

    // 细纹层：独立高频游走，不受低音直接驱动
    drift3X *= (1 + audioTreble * 0.6);
    drift3Y *= (1 + audioTreble * 0.6);

    // ── 写入 SVG 滤镜 ──
    t1.setAttribute('baseFrequency',
      (0.001+drift1X*0.0015+trebleSparkle*0.0005).toFixed(5)+','+
      (0.004+drift1Y*0.0035+trebleSparkle*0.0003).toFixed(5));
    t2.setAttribute('baseFrequency',
      (0.002+drift2X*0.0025*midDensity).toFixed(5)+','+
      (0.005+drift2Y*0.0045*midDensity).toFixed(5));
    t3.setAttribute('baseFrequency',
      (0.020+drift3X*0.008).toFixed(4)+' '+
      (0.025+drift3Y*0.009).toFixed(4));

    // 位移 scale 大幅提升 — 让粒子扩散到整个画布区域
    if (d1) d1.setAttribute('scale', Math.min(120+bassPeak*120+splashScale*180, 400).toFixed(1));
    if (d2) d2.setAttribute('scale', Math.min(80+audioMid*80+splashScale*100, 300).toFixed(1));
    // 细纹层：独立位移，加入 drift3 的错乱贡献
    if (d3) d3.setAttribute('scale', Math.min(40+audioTreble*50+Math.abs(drift3X)*15, 150).toFixed(1));

    const hueDrift = Math.sin(t*0.04)*80 + Math.sin(t*0.04/φ)*60 + Math.sin(t*0.025*SQ2)*40 + 220;
    if (hueEl) hueEl.setAttribute('values', (hueDrift * (1+audioMid*4)).toFixed(1));

    // ── 更新墨点粒子：curl-noise 自由流动 ──
    for (let i = inkParticles.length - 1; i >= 0; i--){
      const p = inkParticles[i];
      // Curl-noise：用 sin/cos 叠加产生无散度场，让粒子像墨水一样自然扭曲
      const nx = Math.sin(p.y * 0.8 + t * 0.3) * 0.25
               + Math.sin(p.x * 0.5 + p.y * 0.4 + t * 0.5) * 0.12
               + Math.cos(p.y * 1.5 + t * 0.15) * 0.06;
      const ny = Math.cos(p.x * 0.7 + t * 0.25) * 0.25
               + Math.cos(p.x * 0.5 + p.y * 0.3 + t * 0.4) * 0.12
               + Math.sin(p.x * 1.3 + t * 0.12) * 0.06;
      // 将 curl-noise 偏转叠加到速度上（软耦合，不覆盖原始速度）
      p.vx += nx * 0.5;
      p.vy += ny * 0.5;
      // 原始速度保持惯性漂移
      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;
      // 轻微阻力（降低摩擦，让粒子飞得更远）
      p.vx *= 0.998;
      p.vy *= 0.998;
      // 生命周期衰减
      p.life -= p.decay * 0.016;
      if (p.life <= 0) inkParticles.splice(i, 1);
    }
    bassPeak *= 0.92;

    // ── 中央发射器：持续向四周发射粒子束 ──
    emitterTimer += 0.016;
    if (emitterTimer >= BEAM_INTERVAL){
      emitterTimer = 0;
      createBeam();
    }

    animFrameId = requestAnimationFrame(animateRipples);
  }

  // 暴露给 MusicPlayer 的能量接口
  window.__inkRipple = {
    setEnergy(bass, mid, treble, energy){
      audioBass += (bass - audioBass) * 0.2;
      audioMid += (mid - audioMid) * 0.2;
      audioTreble += (treble - audioTreble) * 0.2;
    },
    triggerSplash(intensity){
      // 兼容外部调用：手动触发一束粒子
      createBeam();
    },
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden){
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = null;
    } else {
      startTime = performance.now();
      animFrameId = requestAnimationFrame(animateRipples);
    }
  });

  animFrameId = requestAnimationFrame(animateRipples);
}
