/* ==========================================================
   LX Music 浏览器兼容层 (Shim)
   模拟 globalThis.lx 运行时，让洛雪音源插件可在浏览器中运行
   ========================================================== */
(function () {
  'use strict';

  const PROXY = '/api/proxy?url=';

  /* ==================== 事件系统 ==================== */
  const _listeners = {};
  const _pluginInits = [];      // 各插件的 init 数据
  const _requestHandlers = [];   // 各插件的 request handler

  function on(event, handler) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(handler);
  }

  function emit(event, data) {
    const handlers = _listeners[event];
    if (!handlers) return;
    for (const fn of handlers) {
      try { fn(data); } catch (e) { console.error('[LX shim] emit error:', e); }
    }
  }

  function send(eventName, data) {
    if (eventName === EVENT_NAMES.inited) {
      _pluginInits.push(data || {});
      console.log('[LX shim] 插件初始化:', data?.sources ? Object.keys(data.sources).join(', ') : '未知');
    } else if (eventName === EVENT_NAMES.updateAlert) {
      console.log('[LX shim] 插件更新提示:', data);
    }
    emit(eventName, data);
  }

  /* ==================== EVENT_NAMES ==================== */
  const EVENT_NAMES = {
    request: 'request',
    inited: 'inited',
    updateAlert: 'updateAlert',
  };

  /* ==================== HTTP 请求（通过 CORS 代理） ==================== */
  function request(targetUrl, options, callback) {
    const opts = options || {};
    const method = (opts.method || 'GET').toUpperCase();
    const headers = opts.headers || {};
    const body = opts.body;
    const timeout = opts.timeout || 15000;

    const proxyUrl = PROXY + encodeURIComponent(targetUrl);

    const fetchOpts = {
      method,
      headers: { ...headers },
      signal: AbortSignal.timeout(timeout),
    };

    // POST/PUT 时传 body
    if (body && (method === 'POST' || method === 'PUT')) {
      fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
      if (!fetchOpts.headers['Content-Type'] && !fetchOpts.headers['content-type']) {
        fetchOpts.headers['Content-Type'] = 'application/json';
      }
    }

    fetch(proxyUrl, fetchOpts)
      .then(async resp => {
        let respBody = await resp.text();
        // 尝试解析 JSON
        const trimmed = respBody.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try { respBody = JSON.parse(trimmed); } catch (e) { /* keep raw text */ }
        }
        callback(null, {
          statusCode: resp.status,
          headers: Object.fromEntries(resp.headers.entries()),
          body: respBody,
        });
      })
      .catch(err => {
        callback(err, null);
      });
  }

  /* ==================== 加密工具 ==================== */

  // MD5 实现（纯 JS，无外部依赖）
  // 基于 SparkMD5 算法的轻量实现
  const MD5 = (function () {
    function md5cycle(x, k) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);  d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);   b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);   d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);  b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);   d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);  d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);   d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);   b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);   d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);  b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);    d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);   b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);  d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);    b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);   b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);  d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);    b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);   d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);    b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);   d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);    b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);   d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);  b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);  d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);     b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);   d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);   b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);   d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);     b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]); x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    function md5blk(s) { const bl = []; for (let i = 0; i < 64; i += 4) { bl[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); } return bl; }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    function hex(x) { const hc = '0123456789abcdef'; let o = ''; for (let i = 0; i < 4; i++) { o += hc.charAt((x >> (i * 8 + 4)) & 0x0F) + hc.charAt((x >> (i * 8)) & 0x0F); } return o; }

    return function md5(str) {
      const n = str.length;
      if (n === 0) return 'd41d8cd98f00b204e9800998ecf8427e';
      const blocks = [];
      for (let i = 0; i < n; i++) {
        blocks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
      }
      blocks[n >> 2] |= 0x80 << ((n % 4) * 8);
      const bitLen = n * 8;
      const blocksLen = Math.ceil((n + 9) / 64) * 16;
      while (blocks.length < blocksLen) blocks.push(0);
      blocks[blocksLen - 2] = bitLen & 0xFFFFFFFF;
      blocks[blocksLen - 1] = (bitLen / 0x100000000) & 0xFFFFFFFF;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      for (let i = 0; i < blocks.length; i += 16) {
        md5cycle(state, blocks.slice(i, i + 16));
      }
      return hex(state[0]) + hex(state[1]) + hex(state[2]) + hex(state[3]);
    };
  })();

  /* ---- Buffer 工具 ---- */
  const bufferUtils = {
    from(str, encoding) {
      if (encoding === 'hex') {
        const cleaned = String(str).replace(/[^0-9a-fA-F]/g, '');
        const arr = new Uint8Array(cleaned.length / 2);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = parseInt(cleaned.substr(i * 2, 2), 16);
        }
        return arr;
      }
      // utf8 (default)
      return new TextEncoder().encode(String(str));
    }
  };

  // Uint8Array → hex string（用于 MD5 输入为 buffer 时）
  function bufferToHex(buf) {
    const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let hex = '';
    for (let i = 0; i < arr.length; i++) hex += String.fromCharCode(arr[i]);
    return hex;
  }

  /* ==================== 组装 globalThis.lx ==================== */
  const env = 'desktop';
  const version = '1.0.0';
  const currentScriptInfo = {
    tag: 'v1',
    rawScript: '',
    info: { name: 'browser-shim', author: 'comic-canvas' }
  };

  const utils = {
    crypto: {
      md5(data) {
        if (data instanceof Uint8Array || ArrayBuffer.isView(data)) {
          // 将 buffer 转为二进制字符串再算 MD5
          return MD5(bufferToHex(data));
        }
        return MD5(String(data));
      },
      md5hex(data) { return this.md5(data); }
    },
    buffer: bufferUtils,
  };

  // 注入全局运行时
  globalThis.lx = {
    EVENT_NAMES,
    request,
    on,
    send,
    utils,
    env,
    version,
    currentScriptInfo,
  };

  console.log('[LX shim] 运行时环境已就绪，等待加载插件...');

  /* ==================== 插件加载器 ==================== */
  const _pluginsLoaded = [];

  async function loadPlugins() {
    try {
      const resp = await fetch('/api/plugins');
      const plugins = await resp.json();
      if (!plugins.length) {
        console.log('[LX shim] 未发现音源插件');
        return;
      }

      console.log(`[LX shim] 发现 ${plugins.length} 个插件，开始加载...`);

      for (const plugin of plugins) {
        try {
          // 获取插件源码（用于 currentScriptInfo.rawScript）
          const srcResp = await fetch('/' + plugin.path);
          const srcText = await srcResp.text();

          // 设置当前脚本信息（野花/野草插件需要）
          currentScriptInfo.tag = 'v1';
          currentScriptInfo.rawScript = srcText;
          currentScriptInfo.info = { name: plugin.name };

          // 动态执行插件
          const scriptEl = document.createElement('script');
          scriptEl.textContent = srcText;
          document.head.appendChild(scriptEl);

          _pluginsLoaded.push(plugin.name);
          console.log(`[LX shim] ✓ 已加载: ${plugin.name}`);
        } catch (err) {
          console.warn(`[LX shim] ✗ 加载失败: ${plugin.name}`, err.message);
        }
      }

      // 注册请求处理器
      const reqHandlers = _listeners[EVENT_NAMES.request] || [];
      console.log(`[LX shim] 共注册 ${reqHandlers.length} 个请求处理器`);

    } catch (err) {
      console.error('[LX shim] 加载插件列表失败:', err);
    }
  }

  /* ==================== 统一对外接口 ==================== */
  window.LXPlugins = {
    /** 获取已加载的插件名称列表 */
    get loaded() { return [..._pluginsLoaded]; },

    /** 获取各插件的 init 数据（包含支持的音源信息） */
    get inits() { return [..._pluginInits]; },

    /**
     * 请求播放链接
     * @param {string} source - 音源平台 (wy/tx/kw/kg/mg)
     * @param {object} musicInfo - 歌曲信息 { id, songmid, hash, name, singer }
     * @param {string} quality - 音质 (128k/320k/flac...)
     * @returns {Promise<string>} 播放 URL
     */
    async requestUrl(source, musicInfo, quality = '128k') {
      const handlers = _listeners[EVENT_NAMES.request] || [];
      if (!handlers.length) throw new Error('无可用插件处理器');

      const info = { musicInfo, type: quality };

      for (const handler of handlers) {
        try {
          const result = await handler({ action: 'musicUrl', source, info });
          if (result && typeof result === 'string' && result.startsWith('http')) {
            return result;
          }
          if (result && typeof result === 'object' && result.url) {
            return result.url;
          }
        } catch (e) {
          // 此 handler 不支持或失败，尝试下一个
        }
      }
      throw new Error('所有插件均无法解析此歌曲');
    },

    /**
     * 搜索音乐
     * @param {string} keyword - 搜索关键词
     * @param {string} source - 搜索源 (默认 qsvip)
     * @param {number} page - 页码
     * @returns {Promise<{list: Array, total: number, isEnd: boolean}>}
     */
    async search(keyword, source = 'qsvip', page = 1) {
      const handlers = _listeners[EVENT_NAMES.request] || [];
      if (!handlers.length) throw new Error('无可用插件处理器');

      const info = { keyword, page, pagesize: 30 };

      for (const handler of handlers) {
        try {
          const result = await handler({ action: 'musicSearch', source, info });
          if (result && (result.list || result.data)) {
            return {
              list: (result.list || result.data || []).map(normalizeSong),
              total: result.total || 0,
              isEnd: result.isEnd !== false,
            };
          }
        } catch (e) {
          // 此 handler 不支持搜索，尝试下一个
        }
      }
      throw new Error('无插件支持搜索功能');
    },
  };

  /**
   * 将插件搜索结果标准化为播放器格式
   */
  function normalizeSong(s) {
    if (!s) return null;
    return {
      id: String(s.id ?? s.songmid ?? s.hash ?? s.songId ?? ''),
      name: s.name ?? s.title ?? '',
      artist: s.singer ?? s.artist ?? s.authors?.map(a => a.name).join(', ') ?? '',
      album: s.album ?? s.albumName ?? '',
      pic: s.pic ?? s.picUrl ?? s.coverUrl ?? '',
      source: s.source ?? '',
      songmid: s.songmid ?? s.mid ?? '',
      hash: s.hash ?? '',
      // 保留原始数据供插件使用
      _raw: s,
    };
  }

  /* ==================== 启动 ==================== */
  // DOM 就绪后加载插件
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadPlugins());
  } else {
    loadPlugins();
  }

})();
