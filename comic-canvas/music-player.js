/* ==========================================================
   漫剧画布 · 内嵌音乐播放器
   底部固定播放栏 + 搜索 + 播放列表
   ========================================================== */

/* ==================== 音源 API 服务 ==================== */
const MusicAPI = (() => {
  const PROXY = '/api/proxy?url=';
  const NETEASE = 'https://music.163.com';
  const DIRECT_BACKEND_BASE = 'https://music-api.gdstudio.xyz';
  const SETTINGS_KEY = 'comic-canvas:music-backends';
  const DEFAULT_SETTINGS = {
    usePluginSearch: false,
    usePluginUrl: true,
    searchBackend: {
      enabled: false,
      kind: 'netease',
      baseUrl: '',
      searchTemplate: '/search?keywords={q}&type=1&limit=30&offset=0',
      searchPath: 'result.songs',
    },
    urlBackend: {
      enabled: true,
      kind: 'proxy',
      baseUrl: 'https://music-api.gdstudio.xyz',
      urlTemplate: '/api.php?types=url&source=netease&id={id}',
      urlPath: 'url',
    },
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function canUseSameOriginMusicApis() {
    const host = String(window.location?.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
  }

  function mapBackendSource(source, mode = 'search') {
    const key = String(source || 'wy').trim().toLowerCase();
    const table = {
      wy: 'netease',
      qsvip: 'netease',
      kw: 'kuwo',
      tx: mode === 'search' ? 'netease' : 'netease',
      kg: mode === 'search' ? 'kuwo' : 'kuwo',
      mg: mode === 'search' ? 'netease' : 'netease',
      netease: 'netease',
      kuwo: 'kuwo',
    };
    return table[key] || 'netease';
  }

  function getRuntimeDefaults() {
    const defaults = clone(DEFAULT_SETTINGS);
    if (canUseSameOriginMusicApis()) return defaults;
    defaults.usePluginSearch = false;
    defaults.usePluginUrl = false;
    defaults.searchBackend = {
      ...defaults.searchBackend,
      enabled: true,
      kind: 'template',
      baseUrl: DIRECT_BACKEND_BASE,
      searchTemplate: '/api.php?types=search&source={source}&name={q}&count=30',
      searchPath: '',
    };
    defaults.urlBackend = {
      ...defaults.urlBackend,
      enabled: true,
      kind: 'template',
      baseUrl: DIRECT_BACKEND_BASE,
      urlTemplate: '/api.php?types=url&source={source}&id={id}',
      urlPath: 'url',
    };
    return defaults;
  }

  function mergeSettings(next) {
    const defaults = getRuntimeDefaults();
    return {
      ...defaults,
      ...(next || {}),
      searchBackend: {
        ...defaults.searchBackend,
        ...((next && next.searchBackend) || {}),
      },
      urlBackend: {
        ...defaults.urlBackend,
        ...((next && next.urlBackend) || {}),
      },
    };
  }

  function normalizeBaseUrl(value) {
    return String(value || '').trim().replace(/\/+$/, '');
  }

  function joinUrl(base, path) {
    const cleanBase = normalizeBaseUrl(base);
    const cleanPath = String(path || '').trim();
    if (!cleanBase) return cleanPath;
    if (/^https?:\/\//i.test(cleanPath)) return cleanPath;
    return cleanBase + '/' + cleanPath.replace(/^\/+/, '');
  }

  function fillTemplate(tpl, vars) {
    return String(tpl || '').replace(/\{(\w+)\}/g, (_, key) => {
      const value = vars[key];
      return value == null ? '' : String(value);
    });
  }

  function readPath(obj, path) {
    if (!path) return obj;
    const parts = String(path).split('.').filter(Boolean);
    let cur = obj;
    for (const part of parts) {
      if (cur == null) return undefined;
      if (/^\d+$/.test(part)) cur = cur[Number(part)];
      else cur = cur[part];
    }
    return cur;
  }

  function extractSongList(payload) {
    const candidates = [
      payload?.list,
      payload?.data,
      payload?.data?.list,
      payload?.data?.lists,
      payload?.data?.songs,
      payload?.songs,
      payload?.result?.songs,
      payload?.result?.data,
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length > 0) return candidate;
    }
    return [];
  }

  function normalizeSong(item, meta = {}) {
    if (!item) return null;
    return {
      id: String(item.id ?? item.songmid ?? item.hash ?? item.songId ?? item.rid ?? ''),
      name: item.name ?? item.title ?? '',
      artist: item.artist ?? item.singer ?? (Array.isArray(item.artists) ? item.artists.map(a => a.name).join(' / ') : ''),
      album: item.albumName ?? item.album?.name ?? item.album ?? '',
      pic: item.pic ?? item.picUrl ?? item.coverUrl ?? item.album?.picUrl ?? '',
      source: meta.source ?? item.source ?? 'wy',
      _apiId: meta.apiId ?? item._apiId ?? 'backend',
      _backendKind: meta.backendKind ?? item._backendKind ?? '',
      _backendBaseUrl: meta.backendBaseUrl ?? item._backendBaseUrl ?? '',
      _backendSearchPath: meta.backendSearchPath ?? item._backendSearchPath ?? '',
      _backendUrlPath: meta.backendUrlPath ?? item._backendUrlPath ?? '',
      _raw: item,
      _pluginRaw: item._raw,
      _songmid: item.songmid ?? item.mid ?? '',
      _hash: item.hash ?? '',
    };
  }

  function readSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return getRuntimeDefaults();
      const parsed = JSON.parse(raw);
      return mergeSettings(parsed);
    } catch (e) {
      return getRuntimeDefaults();
    }
  }

  function saveSettings(next) {
    const merged = mergeSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  }

  async function waitForPlugins() {
    if (!canUseSameOriginMusicApis()) return;
    if (!window.LXPlugins || typeof window.LXPlugins.ready !== 'function') return;
    try {
      await window.LXPlugins.ready();
    } catch (e) {
      // fallback continues below
    }
  }

  async function fetchJSON(url, timeout = 15000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function proxyFetch(targetUrl, timeout = 15000) {
    return fetchJSON(PROXY + encodeURIComponent(targetUrl), timeout);
  }

  async function searchWithBackend(query, source, settings) {
    const backend = settings.searchBackend || {};
    if (!backend.enabled || !backend.baseUrl) return [];
    const baseUrl = normalizeBaseUrl(backend.baseUrl);
    const q = encodeURIComponent(query);
    const level = source || 'wy';
    const backendSource = mapBackendSource(level, 'search');

    try {
      const template = backend.searchTemplate || DEFAULT_SETTINGS.searchBackend.searchTemplate;
      const url = joinUrl(baseUrl, fillTemplate(template, {
        base: baseUrl,
        q,
        source: backendSource,
        quality: 'standard',
      }));
      const shouldFetchDirect = backend.kind === 'template' || !canUseSameOriginMusicApis();
      const data = shouldFetchDirect ? await fetchJSON(url) : await proxyFetch(url);
      const searchPath = backend.searchPath != null ? backend.searchPath : DEFAULT_SETTINGS.searchBackend.searchPath;
      const list = extractSongList(readPath(data, searchPath));
      return list.map(item => normalizeSong(item, {
        source: mapBackendSource(item.source || backendSource, 'url'),
        apiId: 'backend',
        backendKind: backend.kind || 'netease',
        backendBaseUrl: baseUrl,
        backendSearchPath: searchPath || '',
        backendUrlPath: backend.urlPath || '',
      }));
    } catch (e) {
      console.warn('[MusicAPI] search backend failed:', e.message);
      return [];
    }
  }

  async function resolveWithBackend(song, quality, settings) {
    const backend = settings.urlBackend || {};
    const baseUrl = normalizeBaseUrl(song._backendBaseUrl || backend.baseUrl || '');
    const kind = song._backendKind || backend.kind || '';
    if (!baseUrl || !kind) return null;

    try {
      const template = backend.urlTemplate || DEFAULT_SETTINGS.urlBackend.urlTemplate;
      const backendSource = mapBackendSource(song.source || 'wy', 'url');
      const url = joinUrl(baseUrl, fillTemplate(template, {
        base: baseUrl,
        id: encodeURIComponent(String(song.id)),
        source: backendSource,
        quality,
      }));
      const shouldFetchDirect = kind === 'template' || !canUseSameOriginMusicApis();
      const data = shouldFetchDirect ? await fetchJSON(url) : await proxyFetch(url);
      const path = backend.urlPath || DEFAULT_SETTINGS.urlBackend.urlPath;
      const value = readPath(data, path);
      if (value) {
        console.log(`[MusicAPI] backend url resolved via ${baseUrl}`);
      }
      return value ? String(value) : null;
    } catch (e) {
      console.warn('[MusicAPI] backend url resolve failed:', e.message);
      return null;
    }
  }

  const _urlCache = new Map();

  async function searchWithPlugins(query, source) {
    if (!window.LXPlugins || typeof window.LXPlugins.search !== 'function') return [];
    const pluginSources = Array.from(new Set([
      String(source || 'wy').trim() || 'wy',
      source === 'wy' ? 'qsvip' : null,
    ].filter(Boolean)));

    for (const pluginSource of pluginSources) {
      try {
        const result = await window.LXPlugins.search(query, pluginSource);
        const pluginSongs = extractSongList(result);
        if (pluginSongs.length > 0) {
          console.log(`[MusicAPI] plugin search hit ${pluginSongs.length} from ${pluginSource}`);
          return pluginSongs.map(s => normalizeSong(s, {
            source: s.source || pluginSource,
            apiId: 'plugin',
            backendKind: 'plugin',
          }));
        }
      } catch (e) {
        console.log(`[MusicAPI] plugin search unavailable for ${pluginSource}, trying next backend:`, e.message);
      }
    }
    return [];
  }

  async function search(query, source = 'wy') {
    const settings = readSettings();
    await waitForPlugins();

    if (settings.usePluginSearch) {
      const pluginSongs = await searchWithPlugins(query, source);
      if (pluginSongs.length > 0) return pluginSongs;
    }

    const backendSongs = await searchWithBackend(query, source, settings);
    if (backendSongs.length > 0) return backendSongs;

    if (canUseSameOriginMusicApis()) {
      try {
        const data = await proxyFetch(
          `${NETEASE}/api/search/get?s=${encodeURIComponent(query)}&type=1&limit=30&offset=0`
        );
        const songs = data?.result?.songs || [];
        if (songs.length > 0) {
          return songs.map(s => normalizeSong(s, {
            source: 'wy',
            apiId: 'netease',
            backendKind: 'netease',
          }));
        }
      } catch (e) {
        console.warn('[MusicAPI] netease search failed:', e.message);
      }
    }

    // Final rescue path: even when plugin search is not explicitly enabled,
    // try it before giving up so roaming/search can survive backend outages.
    const pluginFallbackSongs = await searchWithPlugins(query, source);
    if (pluginFallbackSongs.length > 0) return pluginFallbackSongs;

    return [];
  }

  async function getSongUrl(song) {
    const settings = readSettings();
    await waitForPlugins();
    const cacheKey = `${song.id}_${song.source || ''}_${song._apiId || ''}_${song._backendBaseUrl || ''}`;
    if (_urlCache.has(cacheKey)) return _urlCache.get(cacheKey);

    if (settings.usePluginUrl && window.LXPlugins && typeof window.LXPlugins.requestUrl === 'function') {
      try {
        const musicInfo = song._pluginRaw || {
          songmid: song._songmid || song.id,
          hash: song._hash || song.id,
          id: song.id,
          name: song.name,
          singer: song.artist,
        };
        const url = await window.LXPlugins.requestUrl(song.source || 'wy', musicInfo, '128k');
        if (url) {
          _urlCache.set(cacheKey, url);
          return url;
        }
      } catch (e) {
        console.log('[MusicAPI] plugin url resolve failed, trying backend:', e.message);
      }
    }

    const backendUrl = await resolveWithBackend(song, 'standard', settings);
    if (backendUrl) {
      _urlCache.set(cacheKey, backendUrl);
      return backendUrl;
    }

    if (canUseSameOriginMusicApis()) {
      try {
        const data = await proxyFetch(
          `${NETEASE}/api/song/enhance/player/url?ids=[${song.id}]&br=128000`
        );
        const item = data?.data?.[0];
        if (item && item.url && item.code === 200) {
          _urlCache.set(cacheKey, item.url);
          return item.url;
        }
        if (item && item.code !== 200) {
          console.warn(`[MusicAPI] netease returned code=${item.code}`);
        }
      } catch (e) {
        console.warn('[MusicAPI] netease url resolve failed:', e.message);
      }
    }

    return null;
  }

  function setBackendConfig(next) {
    if (!next) {
      localStorage.removeItem(SETTINGS_KEY);
      return getRuntimeDefaults();
    }
    return saveSettings(next);
  }

  return {
    search,
    getSongUrl,
    canUseSameOriginMusicApis,
    getBackendConfig: readSettings,
    setBackendConfig,
    defaultBackendConfig: getRuntimeDefaults(),
  };
})();


/* ==================== 背景流动控制器 ==================== */
/**
 * 用多层正弦波叠加（频率基于黄金比例）产生准随机、永不重复的流动轨迹。
 * 同时响应音频能量，调节流速和色彩。
 */
class FlowController {
  constructor() {
    // Golden-ratio related constant
    this.PHI  = (1 + Math.sqrt(5)) / 2;
    this.SQ2  = Math.sqrt(2);
    this.SQ3  = Math.sqrt(3);
    this.SQ5  = Math.sqrt(5);
    this.SQ7  = Math.sqrt(7);

    // SVG 滤镜元素引用
    this._turbEls = null;   // [主流层, 逆流层]
    this._hueEl  = null;

    // 音频能量，由 AudioReactor 写入
    this.audioBass   = 0;
    this.audioMid    = 0;
    this.audioEnergy = 0;

    this._running = false;
    this._t0 = performance.now();

    // Ripple state
    this._splashes = [];
    this._lastSplash = -1;
    this._rippleThreshold = 0.25;
  }

  /** 获取 SVG 滤镜元素 */
  _init() {
    if (this._turbEls) return;
    this._turbEls = document.querySelectorAll('#shadowFilter feTurbulence');
    const matrices = document.querySelectorAll('#shadowFilter feColorMatrix');
    this._hueEl = matrices[1] || null;
  }

  /** 启动流动动画（始终运行） */
  start() {
    if (this._running) return;
    this._init();
    this._running = true;
    this._t0 = performance.now();
    this._loop();
  }

  /** 主循环 */
  _loop() {
    if (!this._running) return;
    requestAnimationFrame(() => this._loop());

    const t = (performance.now() - this._t0) / 1000;
    const 蠁 = this.PHI;

    // ════════ 主流层漂移（大尺度，缓慢） ════════
    const a1 = Math.sin(t * 0.063);
    const a2 = Math.sin(t * 0.063 / 蠁);
    const a3 = Math.sin(t * 0.041 * this.SQ2);
    const a4 = Math.cos(t * 0.051 / this.SQ3);
    const a5 = Math.sin(t * 0.029 * this.SQ5);
    const a6 = Math.cos(t * 0.023 * this.SQ7);

    let drift1X = a1 * 0.35 + a2 * 0.25 + a3 * 0.20 + a5 * 0.12 + a6 * 0.08;
    let drift1Y = a4 * 0.35 + a3 * 0.20 + a6 * 0.25 + a2 * 0.12 + a1 * 0.08;

    // ════════ 逆流层漂移（中尺度，更快，不同相位） ════════
    // 使用完全不同的频率组合，让第二层与第一层"脱耦"
    const b1 = Math.cos(t * 0.089);
    const b2 = Math.sin(t * 0.077 * this.SQ3);
    const b3 = Math.cos(t * 0.053 / 蠁);
    const b4 = Math.sin(t * 0.097 * this.SQ7);
    const b5 = Math.cos(t * 0.037 * this.SQ5);
    const b6 = Math.sin(t * 0.067 * 蠁);

    let drift2X = b1 * 0.30 + b2 * 0.25 + b3 * 0.22 + b5 * 0.15 + b6 * 0.08;
    let drift2Y = b4 * 0.30 + b3 * 0.22 + b6 * 0.20 + b2 * 0.15 + b1 * 0.13;

    // ════════ 石子入水：涟漪检测 ════════
    const bass = this.audioBass;
    if (bass > this._rippleThreshold && t - this._lastSplash > 0.3) {
      this._splashes.push({
        t0: t,
        px: Math.sin(t * 7.3) * this.SQ2,
        py: Math.cos(t * 5.1) * this.SQ3,
        amp: Math.min(bass * 1.5, 1.2),
      });
      this._lastSplash = t;
      if (this._splashes.length > 8) this._splashes.shift();
    }

    // ════════ 涟漪叠加 ════════
    let rippleX = 0, rippleY = 0;
    for (let i = this._splashes.length - 1; i >= 0; i--) {
      const s = this._splashes[i];
      const age = t - s.t0;
      if (age > 4) { this._splashes.splice(i, 1); continue; }
      const env = s.amp * Math.exp(-age * 1.2);
      const freq = 5.5 / (1 + age * 0.6);
      rippleX += Math.sin(age * freq + s.px) * env;
      rippleY += Math.cos(age * freq * 0.8 + s.py) * env;
    }

    // 涟漪对两层的影响不同（主流层偏大方向，逆流层偏碎方向）
    drift1X += rippleX * 0.5;
    drift1Y += rippleY * 0.5;
    drift2X += rippleX * 0.8 + Math.sin(t * 3.7) * rippleY * 0.3;
    drift2Y += rippleY * 0.8 + Math.cos(t * 2.9) * rippleX * 0.3;

    // ════════ 色相漂移 ════════
    const hueDrift = Math.sin(t * 0.04) * 120
                   + Math.sin(t * 0.04 / 蠁) * 80
                   + Math.sin(t * 0.025 * this.SQ2) * 60
                   + 180;
    const hueBoost = 1 + this.audioMid * 3;

    // ════════ 写入 SVG ════════
    if (this._turbEls && this._turbEls.length >= 2) {
      // Main layer: low frequency drift
      this._turbEls[0].setAttribute('baseFrequency',
        (0.001 + drift1X * 0.0008).toFixed(5) + ',' +
        (0.004 + drift1Y * 0.0025).toFixed(5)
      );
      // Secondary layer: mid frequency drift
      this._turbEls[1].setAttribute('baseFrequency',
        (0.003 + drift2X * 0.0015).toFixed(5) + ',' +
        (0.006 + drift2Y * 0.003).toFixed(5)
      );
    }
    if (this._hueEl) {
      this._hueEl.setAttribute('values', (hueDrift * hueBoost).toFixed(1));
    }
  }
}


/* ==================== 音频响应器 ==================== */
/**
 * 通过 Web Audio API 实时分析音频频谱，
 * 提取频段能量写入 FlowController，驱动背景随音乐律动。
 */
class AudioReactor {
  constructor(audioEl, flowController) {
    this.audio = audioEl;
    this.flow = flowController;
    this.ctx = null;
    this.analyser = null;
    this.source = null;
    this.dataArray = null;
    this._raf = null;
    this._active = false;

    // 平滑后的频段能量
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.energy = 0;
  }

  /** 初始化 Web Audio API 连接 */
  _init() {
    if (this.ctx) return true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.source = this.ctx.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      console.log('[AudioReactor] Web Audio connected');
      return true;
    } catch (e) {
      console.warn('[AudioReactor] Web Audio 初始化失败:', e.message);
      return false;
    }
  }

  /** 启动音频分析 */
  start() {
    if (!this._init()) return;
    if (this._active) return;
    this._active = true;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this._loop();
  }

  /** 停止分析，平滑衰减 */
  stop() {
    this._active = false;
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
    // 平滑衰减能量
    const decay = () => {
      if (this._active) return;
      this.bass *= 0.93; this.mid *= 0.93; this.treble *= 0.93;
      this.energy = (this.bass + this.mid + this.treble) / 3;
      this._pushToFlow();
      if (this.energy > 0.005) requestAnimationFrame(decay);
    };
    decay();
  }

  /** 分析循环 */
  _loop() {
    if (!this._active) return;
    this._raf = requestAnimationFrame(() => this._loop());

    this.analyser.getByteFrequencyData(this.dataArray);
    const len = this.dataArray.length;

    let bassSum = 0, midSum = 0, trebSum = 0;
    const bassEnd = Math.floor(len * 0.1);
    const midEnd = Math.floor(len * 0.45);
    for (let i = 0; i < len; i++) {
      const v = this.dataArray[i] / 255;
      if (i < bassEnd) bassSum += v;
      else if (i < midEnd) midSum += v;
      else trebSum += v;
    }

    const 伪 = 0.15;
    this.bass   += (bassSum / Math.max(bassEnd, 1) - this.bass) * 伪;
    this.mid    += (midSum / Math.max(midEnd - bassEnd, 1) - this.mid) * 伪;
    this.treble += (trebSum / Math.max(len - midEnd, 1) - this.treble) * 伪;
    this.energy = (this.bass + this.mid + this.treble) / 3;

    this._pushToFlow();
  }

  /** 将能量数据推送给 FlowController */
  _pushToFlow() {
    if (!this.flow) return;
    this.flow.audioBass   = this.bass;
    this.flow.audioMid    = this.mid;
    this.flow.audioEnergy = this.energy;
    // 同时推送到水墨流体系
    if (window.__inkRipple){
      window.__inkRipple.setEnergy(this.bass, this.mid, this.treble, this.energy);
    }
  }
}


/* ==================== 播放器主类 ==================== */
class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.crossOrigin = 'anonymous';  // 允许 Web Audio API 分析跨域音频
    this.playlist = [];
    this.currentIdx = -1;
    this.isPlaying = false;
    this.volume = 0.7;
    this.mode = 0; // 0=顺序 1=单曲循环 2=随机
    this._searchTimer = null;
    this._urlLoading = false;

    // Roaming mode state
    this.roaming = false;
    this._roamingHistory = [];   // 已播放歌曲 ID 集合（漫游期间避免重复）
    this._roamingPool = [];      // 当前漫游关键词池
    this._roamingLoading = false; // 防止并发搜索

    this.audio.volume = this.volume;
    this._prevVolume = this.volume;

    // Background motion controller
    this.flowController = new FlowController();
    this.flowController.start();

    // 音频响应器：分析频谱，将能量推送给 FlowController
    this.reactor = new AudioReactor(this.audio, this.flowController);

    this._buildDOM();
    this._bindEvents();
    this._restorePlaylist();
  }

  /* ---------- DOM 构建 ---------- */
  _buildDOM() {
    const root = document.createElement('div');
    root.id = 'music-player';
    root.innerHTML = `
      <!-- 底部播放栏 -->
      <div class="mp-bar">
        <div class="mp-bar-left">
          <div class="mp-cover">
            <img src="" alt="">
            <div class="mp-cover-ph">&#9835;</div>
          </div>
          <div class="mp-info">
            <div class="mp-title">Not Playing</div>
            <div class="mp-artist">Choose a track to start</div>
          </div>
        </div>
        <div class="mp-bar-center">
          <div class="mp-controls">
            <button class="mp-btn mp-mode-btn" title="播放模式">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
            </button>
            <button class="mp-btn mp-prev-btn" title="Previous">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button class="mp-btn mp-play-btn" title="播放/暂停">
              <svg class="mp-icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <svg class="mp-icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button class="mp-btn mp-next-btn" title="Next">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
          </div>
          <div class="mp-waveform" title="点击跳转">
            <span class="mp-waveform-time mp-cur-time">0:00</span>
            <div class="mp-waveform-track" id="waveform-bars"></div>
            <span class="mp-waveform-time mp-dur-time">0:00</span>
          </div>
        </div>
        <div class="mp-bar-right">
          <button class="mp-btn mp-list-btn" title="播放列表">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            <span class="mp-list-count">0</span>
          </button>
          <button class="mp-btn mp-roam-btn" title="Roaming mode: auto-discovery">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </button>
          <div class="mp-volume">
            <button class="mp-btn mp-vol-btn" title="音量">
              <svg class="mp-vol-on" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
              <svg class="mp-vol-off" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            </button>
            <div class="mp-vol-bar">
              <div class="mp-vol-fill"></div>
            </div>
          </div>
          <button class="mp-btn mp-search-btn" title="搜索音乐">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button class="mp-btn mp-backend-btn" title="Backend settings">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 5 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.44.43.72 1.03.72 1.68V11a2 2 0 1 1 0 4h-.09c-.65 0-1.25.28-1.63 1z"/></svg>
          </button>
        </div>
      </div>

      <!-- 搜索面板 -->
      <div class="mp-search-panel">
        <div class="mp-search-head">
          <div class="mp-search-input-wrap">
            <svg class="mp-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="mp-search-input" placeholder="搜索歌曲名称 / 歌手">
            <button class="mp-search-close">&times;</button>
          </div>
          <div class="mp-search-sources">
            <button class="mp-source-btn active" data-source="wy">网易</button>
            <button class="mp-source-btn" data-source="tx">QQ</button>
            <button class="mp-source-btn" data-source="kw">酷我</button>
            <button class="mp-source-btn" data-source="kg">酷狗</button>
            <button class="mp-source-btn" data-source="mg">咪咕</button>
          </div>
        </div>
        <div class="mp-search-body">
          <div class="mp-search-empty">Enter keywords to search music</div>
          <div class="mp-search-loading" style="display:none">
            <div class="mp-spinner"></div>
            <span>Searching...</span>
          </div>
          <ul class="mp-search-results"></ul>
        </div>
      </div>

      <!-- 播放列表面板 -->
      <div class="mp-playlist-panel">
        <div class="mp-playlist-head">
          <span>播放列表</span>
          <button class="mp-btn mp-clear-btn">清空</button>
        </div>
        <div class="mp-playlist-body">
          <div class="mp-playlist-empty">播放列表为空</div>
          <ul class="mp-playlist-items"></ul>
        </div>
      </div>

      <div class="mp-backend-modal">
        <div class="mp-backend-dialog">
          <div class="mp-backend-head">
            <span>Music backend settings</span>
            <button class="mp-btn mp-backend-close">&times;</button>
          </div>
          <div class="mp-backend-body">
            <p class="mp-backend-tip">Use a Netease API-compatible search backend and any JSON url resolver you trust. Leave the defaults empty to keep the current fallback chain.</p>
            <textarea class="mp-backend-textarea" spellcheck="false"></textarea>
          </div>
          <div class="mp-backend-actions">
            <button class="mp-btn mp-backend-reset">Reset</button>
            <button class="mp-btn mp-backend-save">Save</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    this.el = root;

    // 缓存常用元素
    this.$ = sel => root.querySelector(sel);
    this.coverImg = this.$('.mp-cover img');
    this.coverPh = this.$('.mp-cover-ph');
    this.titleEl = this.$('.mp-title');
    this.artistEl = this.$('.mp-artist');
    this.playBtn = this.$('.mp-play-btn');
    this.prevBtn = this.$('.mp-prev-btn');
    this.nextBtn = this.$('.mp-next-btn');
    this.modeBtn = this.$('.mp-mode-btn');
    this.roamBtn = this.$('.mp-roam-btn');
    this.iconPlay = this.$('.mp-icon-play');
    this.iconPause = this.$('.mp-icon-pause');
    this.curTime = this.$('.mp-waveform-time.mp-cur-time');
    this.durTime = this.$('.mp-waveform-time.mp-dur-time');
    this.progressBar = this.$('.mp-waveform');
    this.waveformTrack = this.$('#waveform-bars');
    this.volBtn = this.$('.mp-vol-btn');
    this.volOn = this.$('.mp-vol-on');
    this.volOff = this.$('.mp-vol-off');
    this.volFill = this.$('.mp-vol-fill');
    this.volBar = this.$('.mp-vol-bar');
    this.searchBtn = this.$('.mp-search-btn');
    this.searchPanel = this.$('.mp-search-panel');
    this.searchInput = this.$('.mp-search-input');
    this.searchClose = this.$('.mp-search-close');
    this.searchEmpty = this.$('.mp-search-empty');
    this.searchLoading = this.$('.mp-search-loading');
    this.searchResults = this.$('.mp-search-results');
    this.listBtn = this.$('.mp-list-btn');
    this.listCount = this.$('.mp-list-count');
    this.playlistPanel = this.$('.mp-playlist-panel');
    this.playlistItems = this.$('.mp-playlist-items');
    this.playlistEmpty = this.$('.mp-playlist-empty');
    this.clearBtn = this.$('.mp-clear-btn');
    this.backendBtn = this.$('.mp-backend-btn');
    this.backendModal = this.$('.mp-backend-modal');
    this.backendDialog = this.$('.mp-backend-dialog');
    this.backendClose = this.$('.mp-backend-close');
    this.backendReset = this.$('.mp-backend-reset');
    this.backendSave = this.$('.mp-backend-save');
    this.backendTextarea = this.$('.mp-backend-textarea');
    this.sourceBtns = root.querySelectorAll('.mp-source-btn');
    this.selectedSource = 'wy';
  }

  /* ---------- 事件绑定 ---------- */
  _bindEvents() {
    // 播放控制
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.playPrev());
    this.nextBtn.addEventListener('click', () => this.playNext());
    this.modeBtn.addEventListener('click', () => this.cycleMode());
    this.roamBtn.addEventListener('click', () => this.toggleRoaming());

    // Progress bar
    this.progressBar.addEventListener('click', e => this._seekTo(e));
    this.progressBar.addEventListener('mousedown', e => this._startDrag(e, 'progress'));

    // 音量
    this.volBtn.addEventListener('click', () => this.toggleMute());
    this.volBar.addEventListener('click', e => this._setVolumeFromEvent(e));
    this.volBar.addEventListener('mousedown', e => this._startDrag(e, 'volume'));

    // 搜索
    this.searchBtn.addEventListener('click', () => this._toggleSearch());
    this.searchClose.addEventListener('click', () => this._closeSearch());
    this.searchInput.addEventListener('input', () => {
      clearTimeout(this._searchTimer);
      const q = this.searchInput.value.trim();
      if (q.length > 0) {
        this._showSearchLoading();
        this._searchTimer = setTimeout(() => this._doSearch(q), 600);
      } else {
        this._showSearchEmpty();
      }
    });
    this.searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        clearTimeout(this._searchTimer);
        const q = this.searchInput.value.trim();
        if (q) this._doSearch(q);
      }
      if (e.key === 'Escape') this._closeSearch();
    });

    // 音源切换
    this.sourceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.sourceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedSource = btn.dataset.source;
        const q = this.searchInput.value.trim();
        if (q) this._doSearch(q);
      });
    });

    // 播放列表
    this.listBtn.addEventListener('click', () => this._togglePlaylist());
    this.clearBtn.addEventListener('click', () => this.clearPlaylist());
    this.backendBtn.addEventListener('click', () => this._openBackendModal());
    this.backendClose.addEventListener('click', () => this._closeBackendModal());
    this.backendReset.addEventListener('click', () => this._resetBackendConfig());
    this.backendSave.addEventListener('click', () => this._saveBackendConfig());
    this.backendModal.addEventListener('click', e => {
      if (e.target === this.backendModal) this._closeBackendModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.backendModal.style.display === 'flex') {
        this._closeBackendModal();
      }
    });

    // Audio 事件
    this.audio.addEventListener('timeupdate', () => this._onTimeUpdate());
    this.audio.addEventListener('loadedmetadata', () => this._onMetaLoaded());
    this.audio.addEventListener('ended', () => this._onEnded());
    this.audio.addEventListener('error', () => this._onError());
    this.audio.addEventListener('playing', () => {
      this.isPlaying = true;
      this._updatePlayBtn();
      this.reactor.start();  // 开始音频分析，驱动背景动画
    });
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this._updatePlayBtn();
      this.reactor.stop();   // stop analysis
    });

    // Global hotkeys
    document.addEventListener('keydown', e => {
      // Ignore inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); this.togglePlay(); }
      if (e.code === 'ArrowRight' && e.ctrlKey) { e.preventDefault(); this.playNext(); }
      if (e.code === 'ArrowLeft' && e.ctrlKey) { e.preventDefault(); this.playPrev(); }
    });

    // Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.playPrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.playNext());
    }
  }

  /* ---------- 播放控制 ---------- */
  togglePlay() {
    if (this.currentIdx < 0 && this.playlist.length > 0) {
      this.playAt(0);
      return;
    }
    if (!this.audio.src) return;
    if (this.audio.paused) {
      this.audio.play().catch(() => {});
    } else {
      this.audio.pause();
    }
  }

  playAt(idx) {
    if (idx < 0 || idx >= this.playlist.length) return;
    this.currentIdx = idx;
    const song = this.playlist[idx];
    this._updateNowPlaying(song);
    this._renderPlaylist();
    this._loadAndPlay(song);
  }

  async _loadAndPlay(song) {
    if (this._urlLoading) return;
    this._urlLoading = true;
    this.titleEl.textContent = '加载中...';

    try {
      let url = song.url;
      if (!url) {
        url = await MusicAPI.getSongUrl(song);
      }
      if (!url) {
        this.titleEl.textContent = song.name;
        this.artistEl.textContent = '无法获取播放链接';
        this._urlLoading = false;
        return;
      }
      song.url = url;
      console.log('[MusicPlayer] resolved audio url');
      // Prefer the local proxy in dev; on deployed static hosts it may not exist.
      this.audio.src = MusicAPI.canUseSameOriginMusicApis()
        ? '/api/proxy?url=' + encodeURIComponent(url)
        : url;
      this.audio.play().catch(() => {});
    } catch (e) {
      console.warn('播放失败:', e);
      this.artistEl.textContent = 'Playback failed, trying next track';
      setTimeout(() => this.playNext(), 2000);
    }
    this._urlLoading = false;
  }

  playNext() {
    if (this.playlist.length === 0) {
      // 漫游模式下空列表自动发现
      if (this.roaming) this._roamingDiscover();
      return;
    }
    if (this.mode === 2) {
      // 随机
      let next = Math.floor(Math.random() * this.playlist.length);
      if (next === this.currentIdx && this.playlist.length > 1) {
        next = (next + 1) % this.playlist.length;
      }
      this.playAt(next);
    } else {
      const nextIdx = (this.currentIdx + 1) % this.playlist.length;
      // Roaming: when looping back to start, trigger discovery
      if (this.roaming && nextIdx === 0 && this.playlist.length > 1) {
        this._roamingDiscover();
      }
      this.playAt(nextIdx);
    }
  }

  playPrev() {
    if (this.playlist.length === 0) return;
    this.playAt((this.currentIdx - 1 + this.playlist.length) % this.playlist.length);
  }

  cycleMode() {
    this.mode = (this.mode + 1) % 3;
    const labels = ['顺序播放', '单曲循环', '随机播放'];
    const icons = [
      // 顺序
      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
      // 单曲循环
      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/><text x="12" y="14" font-size="8" fill="currentColor" stroke="none" text-anchor="middle">1</text></svg>`,
      // 随机
      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`
    ];
    this.modeBtn.innerHTML = icons[this.mode];
    this.modeBtn.title = labels[this.mode];
  }

  /* ---------- 漫游模式 ---------- */

  // 漫游关键词池：覆盖多种风格，适合作为创作背景音乐
  _getRoamingKeywords() {
    return [
      'ambient', 'lofi', 'chill', 'piano', 'guitar', 'strings',
      'electronica', 'folk', 'city pop', 'jazz', 'indie', 'vocal',
      'rain', 'night', 'sunrise', 'ocean', 'forest', 'dream',
      'study', 'work', 'reading', 'focus', 'relax', 'sleep',
      '中国风', '古风', '纯音乐', '轻音乐', '民谣', '治愈',
    ];
  }

  /** 切换漫游模式 */
  toggleRoaming() {
    this.roaming = !this.roaming;
    if (this.roaming) {
      this.roamBtn.classList.add('active');
      this.roamBtn.title = 'Roaming on, click to stop';
      this._roamingHistory = [];
      this._roamingPool = this._getRoamingKeywords();
      this._shuffleArray(this._roamingPool);
      if (this.playlist.length === 0 || this.currentIdx === -1) {
        this._roamingDiscover();
      }
      this._showToast('Roaming enabled');
    } else {
      this.roamBtn.classList.remove('active');
      this.roamBtn.title = 'Roaming mode: auto-discovery';
      this._showToast('Roaming disabled');
    }
  }

  /** 漫游自动发现：随机关键词搜索，添加新歌到列表 */
  async _roamingDiscover() {
    if (this._roamingLoading) return;
    this._roamingLoading = true;

    try {
      let newSongs = [];
      let tries = 0;
      let matchedSource = this.selectedSource || 'wy';
      while (tries < 6 && newSongs.length === 0) {
        if (this._roamingPool.length === 0) {
          this._roamingPool = this._getRoamingKeywords();
          this._shuffleArray(this._roamingPool);
        }
        const keyword = this._roamingPool.pop();
        if (!keyword) break;

        for (const source of this._getRoamingSources()) {
          const results = await MusicAPI.search(keyword, source);
          const songs = Array.isArray(results) ? results : [];
          if (!songs.length) continue;
          newSongs = songs.filter(s => !this._roamingHistory.includes(s.id + '_' + s.source));
          if (newSongs.length > 0) {
            matchedSource = source;
            break;
          }
        }
        tries++;
      }

      if (newSongs.length === 0) {
        if (this.roaming) this._showToast('Current source unavailable, roaming could not find playable songs');
        return;
      }

      if (matchedSource && matchedSource !== this.selectedSource) {
        this._setSelectedSource(matchedSource, false);
      }

      // 随机选 1-3 首添加到播放列表
      const count = Math.min(Math.floor(Math.random() * 3) + 1, newSongs.length);
      this._shuffleArray(newSongs);
      let added = 0;
      for (let i = 0; i < count && added < 3; i++) {
        const song = newSongs[i];
        if (!this.playlist.some(s => s.id === song.id && s.source === song.source)) {
          this.playlist.push(song);
          this._roamingHistory.push(song.id + '_' + song.source);
          added++;
        }
      }

      if (added > 0) {
        this._renderPlaylist();
        // If nothing is playing, start from the newly added songs
        if (this.currentIdx === -1 || !this.isPlaying) {
          const startIdx = this.playlist.length - added;
          this.playAt(startIdx);
        }
      }
    } catch (e) {
      console.warn('[Roaming] discover failed:', e.message);
      if (this.roaming) this._showToast('Roaming discover failed, try again later');
    } finally {
      this._roamingLoading = false;
    }
  }

  /** 漫游 - 跳过当前歌曲（不喜欢） */
  roamingSkip() {
    if (!this.roaming) return;
    // Record dislike and reduce similar keywords
    const current = this.playlist[this.currentIdx];
    if (current) {
      // 简单策略：从池中移除与当前歌曲风格相关的关键词
      this._roamingPool = this._roamingPool.filter(k =>
        !current.name.includes(k) && !current.artist.includes(k)
      );
    }
    this.playNext();
  }

  /** 漫游 - 喜欢当前歌曲 */
  roamingLike() {
    if (!this.roaming) return;
    const current = this.playlist[this.currentIdx];
    if (current) {
      // Add keywords from current song back into the pool
      const words = [current.name, current.artist].join(' ');
      const allKeywords = this._getRoamingKeywords();
      allKeywords.forEach(k => {
        if (words.includes(k) && !this._roamingPool.includes(k)) {
          this._roamingPool.push(k);
        }
      });
      this._showToast('Preference remembered');
    }
  }

  /** Fisher-Yates 洗牌 */
  _shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** 轻量 Toast 提示 */
  _showToast(msg) {
    let toast = document.getElementById('mp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mp-toast';
      toast.style.cssText = 'position:fixed;bottom:52px;left:50%;transform:translateX(-50%);background:rgba(17,17,38,0.92);color:#f8f7ff;padding:6px 16px;border-radius:20px;font-size:12px;z-index:100000;pointer-events:none;opacity:0;transition:opacity 0.3s;backdrop-filter:blur(8px);border:1px solid rgba(192,132,252,0.15);white-space:nowrap;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  }

  /* ---------- 播放列表管理 ---------- */
  addToPlaylist(song) {
    // 去重
    if (this.playlist.some(s => s.id === song.id && s.source === song.source)) {
      return;
    }
    this.playlist.push({ ...song });
    this._renderPlaylist();
    this._savePlaylist();
    this.listCount.textContent = this.playlist.length;

    // Auto play the first song
    if (this.playlist.length === 1) {
      this.playAt(0);
    }
  }

  removeFromPlaylist(idx) {
    this.playlist.splice(idx, 1);
    if (idx === this.currentIdx) {
      this.audio.pause();
      this.audio.src = '';
      if (this.playlist.length > 0) {
        this.currentIdx = Math.min(idx, this.playlist.length - 1);
        this.playAt(this.currentIdx);
      } else {
        this.currentIdx = -1;
        this._resetUI();
      }
    } else if (idx < this.currentIdx) {
      this.currentIdx--;
    }
    this._renderPlaylist();
    this._savePlaylist();
    this.listCount.textContent = this.playlist.length;
  }

  clearPlaylist() {
    this.audio.pause();
    this.audio.src = '';
    this.playlist = [];
    this.currentIdx = -1;
    this._resetUI();
    this._renderPlaylist();
    this._savePlaylist();
    this.listCount.textContent = 0;
  }

  /* ---------- UI 更新 ---------- */
  _updateNowPlaying(song) {
    this.titleEl.textContent = song.name || 'Unknown Track';
    this.artistEl.textContent = song.artist || 'Unknown Artist';
    if (song.pic) {
      this.coverImg.src = song.pic;
      this.coverImg.style.display = 'block';
      this.coverPh.style.display = 'none';
    } else {
      this.coverImg.style.display = 'none';
      this.coverPh.style.display = 'flex';
    }
    // 更新媒体会话
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist,
        album: song.album || '',
        artwork: song.pic ? [{ src: song.pic }] : []
      });
    }
  }

  _resetUI() {
    this.titleEl.textContent = 'Not Playing';
    this.artistEl.textContent = 'Choose a track to start';
    this.coverImg.style.display = 'none';
    this.coverPh.style.display = 'flex';
    this.curTime.textContent = '0:00';
    this.durTime.textContent = '0:00';
    this._updateWaveform(0);
    this._updatePlayBtn();
  }

  _updatePlayBtn() {
    this.iconPlay.style.display = this.isPlaying ? 'none' : 'block';
    this.iconPause.style.display = this.isPlaying ? 'block' : 'none';
  }

  _onTimeUpdate() {
    if (!this.audio.duration) return;
    const pct = (this.audio.currentTime / this.audio.duration) * 100;
    this.curTime.textContent = this._fmtTime(this.audio.currentTime);
    this._updateWaveform(pct);
  }

  _onMetaLoaded() {
    this.durTime.textContent = this._fmtTime(this.audio.duration);
    this._initWaveform();
  }

  _onEnded() {
    if (this.mode === 1) {
      // 单曲循环
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
    } else {
      // 漫游模式：播放列表剩余不足 2 首时提前发现新歌
      if (this.roaming && this.currentIdx >= this.playlist.length - 2) {
        this._roamingDiscover();
      }
      this.playNext();
    }
  }

  _onError() {
    if (this.audio.src && this.currentIdx >= 0) {
      console.warn('Audio playback error, trying next track');
      const song = this.playlist[this.currentIdx];
      if (song) {
        song.url = null; // 清除缓存的错误 URL
      }
      setTimeout(() => this.playNext(), 1500);
    }
  }

  /* ---------- 波形进度条 ---------- */
  _initWaveform() {
    if (!this.waveformTrack) return;
    if (this.waveformTrack.children.length > 0) return; // already init
    const count = 64;
    const rng = () => 0.15 + Math.random() * 0.85;
    for (let i = 0; i < count; i++) {
      const bar = document.createElement('div');
      bar.className = 'mp-waveform-bar';
      bar.style.height = (rng() * 100) + '%';
      this.waveformTrack.appendChild(bar);
    }
  }

  _updateWaveform(pct) {
    if (!this.waveformTrack) return;
    const bars = this.waveformTrack.children;
    const activeCount = Math.floor((pct / 100) * bars.length);
    for (let i = 0; i < bars.length; i++) {
      bars[i].classList.toggle('active', i < activeCount);
    }
  }

  /* ---------- 进度条拖拽 ---------- */
  _seekTo(e) {
    if (!this.audio.duration) return;
    const rect = this.progressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.audio.currentTime = pct * this.audio.duration;
  }

  _startDrag(e, type) {
    e.preventDefault();
    const onMove = ev => {
      if (type === 'progress') {
        this._seekTo(ev);
      } else {
        this._setVolumeFromEvent(ev);
      }
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  /* ---------- 音量控制 ---------- */
  _setVolumeFromEvent(e) {
    const rect = this.volBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.volume = pct;
    this.audio.volume = pct;
    this.volFill.style.width = (pct * 100) + '%';
    this.volOn.style.display = pct > 0 ? 'block' : 'none';
    this.volOff.style.display = pct === 0 ? 'block' : 'none';
  }

  toggleMute() {
    if (this.audio.volume > 0) {
      this._prevVolume = this.audio.volume;
      this.audio.volume = 0;
      this.volFill.style.width = '0%';
      this.volOn.style.display = 'none';
      this.volOff.style.display = 'block';
    } else {
      this.audio.volume = this._prevVolume || 0.7;
      this.volFill.style.width = (this.audio.volume * 100) + '%';
      this.volOn.style.display = 'block';
      this.volOff.style.display = 'none';
    }
  }

  /* ---------- 搜索 ---------- */
  _toggleSearch() {
    const open = this.searchPanel.style.display === 'flex';
    this.searchPanel.style.display = open ? 'none' : 'flex';
    this.playlistPanel.style.display = 'none';
    if (!open) this.searchInput.focus();
  }

  _closeSearch() {
    this.searchPanel.style.display = 'none';
  }

  _showSearchLoading() {
    this.searchEmpty.style.display = 'none';
    this.searchLoading.style.display = 'flex';
    this.searchResults.style.display = 'none';
  }

  _showSearchEmpty() {
    this.searchEmpty.style.display = 'block';
    this.searchEmpty.textContent = 'Enter keywords to search online music';
    this.searchLoading.style.display = 'none';
    this.searchResults.style.display = 'none';
  }

  _setSelectedSource(source, rerunSearch = false) {
    const next = String(source || 'wy').trim() || 'wy';
    this.selectedSource = next;
    this.sourceBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.source === next);
    });
    if (rerunSearch) {
      const q = this.searchInput.value.trim();
      if (q) this._doSearch(q);
    }
  }

  _getRoamingSources() {
    return Array.from(new Set([
      this.selectedSource || 'wy',
      'wy',
      'tx',
      'kw',
      'kg',
      'mg',
      'qsvip',
    ].filter(Boolean)));
  }

  async _doSearch(query) {
    this._showSearchLoading();
    try {
      const results = await MusicAPI.search(query, this.selectedSource);
      this._renderSearchResults(results);
    } catch (e) {
      this.searchEmpty.textContent = 'Search failed, please retry';
      this.searchEmpty.style.display = 'block';
      this.searchLoading.style.display = 'none';
      this.searchResults.style.display = 'none';
    }
  }

  _openBackendModal() {
    const cfg = MusicAPI.getBackendConfig ? MusicAPI.getBackendConfig() : MusicAPI.defaultBackendConfig;
    this.backendTextarea.value = JSON.stringify(cfg, null, 2);
    this.backendModal.style.display = 'flex';
  }

  _closeBackendModal() {
    this.backendModal.style.display = 'none';
  }

  _resetBackendConfig() {
    const cfg = MusicAPI.setBackendConfig ? MusicAPI.setBackendConfig(null) : MusicAPI.defaultBackendConfig;
    this.backendTextarea.value = JSON.stringify(cfg, null, 2);
    this._showToast('Backend config reset');
  }

  _saveBackendConfig() {
    try {
      const parsed = JSON.parse(this.backendTextarea.value || '{}');
      const cfg = MusicAPI.setBackendConfig ? MusicAPI.setBackendConfig(parsed) : parsed;
      this.backendTextarea.value = JSON.stringify(cfg, null, 2);
      this._showToast('Backend config saved');
      this._closeBackendModal();
    } catch (e) {
      this._showToast('Invalid JSON config');
    }
  }

  _renderSearchResults(results) {
    this.searchLoading.style.display = 'none';
    if (!results || results.length === 0) {
      this.searchEmpty.textContent = 'No matching songs found';
      this.searchEmpty.style.display = 'block';
      this.searchResults.style.display = 'none';
      return;
    }
    this.searchEmpty.style.display = 'none';
    this.searchResults.style.display = 'block';
    this.searchResults.innerHTML = results.map((s, i) => `
      <li class="mp-search-item" data-idx="${i}">
        <div class="mp-search-item-info">
          <div class="mp-search-item-name">${this._esc(s.name)}</div>
          <div class="mp-search-item-artist">${this._esc(s.artist)}${s.album ? ' - ' + this._esc(s.album) : ''}</div>
        </div>
        <button class="mp-btn mp-search-add-btn" data-idx="${i}" title="Add to playlist">+</button>
      </li>
    `).join('');

    // 绑定事件
    this.searchResults.querySelectorAll('.mp-search-item').forEach(li => {
      li.addEventListener('click', e => {
        if (e.target.closest('.mp-search-add-btn')) return;
        const idx = parseInt(li.dataset.idx);
        this.addToPlaylist(results[idx]);
      });
    });
    this.searchResults.querySelectorAll('.mp-search-add-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        this.addToPlaylist(results[idx]);
      });
    });
  }

  /* ---------- 播放列表渲染 ---------- */
  _togglePlaylist() {
    const open = this.playlistPanel.style.display === 'flex';
    this.playlistPanel.style.display = open ? 'none' : 'flex';
    this.searchPanel.style.display = 'none';
  }

  _renderPlaylist() {
    this.listCount.textContent = this.playlist.length;
    if (this.playlist.length === 0) {
      this.playlistEmpty.style.display = 'block';
      this.playlistItems.style.display = 'none';
      return;
    }
    this.playlistEmpty.style.display = 'none';
    this.playlistItems.style.display = 'block';
    this.playlistItems.innerHTML = this.playlist.map((s, i) => `
      <li class="mp-pl-item${i === this.currentIdx ? ' active' : ''}" data-idx="${i}">
        <span class="mp-pl-item-idx">${String(i + 1).padStart(2, '0')}</span>
        <div class="mp-pl-item-info">
          <div class="mp-pl-item-name">${this._esc(s.name)}</div>
          <div class="mp-pl-item-artist">${this._esc(s.artist)}</div>
        </div>
        <button class="mp-btn mp-pl-item-del" data-idx="${i}" title="移除">&times;</button>
      </li>
    `).join('');

    this.playlistItems.querySelectorAll('.mp-pl-item').forEach(li => {
      li.addEventListener('click', e => {
        if (e.target.closest('.mp-pl-item-del')) return;
        const idx = parseInt(li.dataset.idx);
        this.playAt(idx);
      });
    });
    this.playlistItems.querySelectorAll('.mp-pl-item-del').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this.removeFromPlaylist(parseInt(btn.dataset.idx));
      });
    });
  }

  /* ---------- 持久化 ---------- */
  _savePlaylist() {
    try {
      const data = this.playlist.map(s => ({
        id: s.id, name: s.name, artist: s.artist,
        album: s.album, pic: s.pic, source: s.source, _apiId: s._apiId,
        _backendKind: s._backendKind,
        _backendBaseUrl: s._backendBaseUrl,
        _backendSearchPath: s._backendSearchPath,
        _backendUrlPath: s._backendUrlPath,
        _pluginRaw: s._pluginRaw,
        _songmid: s._songmid,
        _hash: s._hash
      }));
      localStorage.setItem('comic-canvas:playlist', JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  _restorePlaylist() {
    try {
      const raw = localStorage.getItem('comic-canvas:playlist');
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) {
          this.playlist = data;
          this.listCount.textContent = data.length;
          this._renderPlaylist();
        }
      }
    } catch (e) { /* ignore */ }
    // 初始化音量条
    this.volFill.style.width = (this.volume * 100) + '%';
  }

  /* ---------- 工具方法 ---------- */
  _fmtTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  _esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }
}


/* ==================== 初始化 ==================== */
(function initMusicPlayer() {
  function boot() {
    window.musicPlayer = new MusicPlayer();
    console.log('[MusicPlayer] player ready');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

