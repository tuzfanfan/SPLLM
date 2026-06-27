/* ==========================================================
   漫剧画布 · 开发服务器
   - 静态文件服务
   - CORS 代理（供音源插件调用外部 API）
   - 插件列表 API
   ========================================================== */
const http = require('http');
const https = require('https');
const httpLib = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const ROOT = __dirname;
const MUSIC_DIR = path.join(ROOT, 'music');

/* ---- MIME 类型 ---- */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.ogg':  'audio/ogg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

/* ---- 递归扫描 music/ 下的 .js 文件 ---- */
function scanPlugins(dir, base) {
  let results = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        results = results.concat(scanPlugins(full, base));
      } else if (item.name.endsWith('.js')) {
        results.push({
          name: item.name,
          path: path.relative(base, full).replace(/\\/g, '/')
        });
      }
    }
  } catch (e) { /* ignore */ }
  return results;
}

/* ---- CORS 代理 ---- */
function handleProxy(req, res, targetUrl) {
  const parsed = new URL(targetUrl);
  const lib = parsed.protocol === 'https:' ? https : httpLib;

  // 转发请求头（排除 host，使用目标域名）
  const fwdHeaders = { ...req.headers };
  delete fwdHeaders['host'];
  delete fwdHeaders['origin'];
  delete fwdHeaders['referer'];
  // 确保 host 指向目标
  fwdHeaders['host'] = parsed.host;

  const opts = {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port:     parsed.port,
    path:     parsed.pathname + parsed.search,
    method:   req.method || 'GET',
    headers:  fwdHeaders,
    rejectUnauthorized: false,   // 容忍自签名证书
  };

  const proxy = lib.request(opts, (upstream) => {
    // 设置 CORS 响应头
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', '*');

    // 转发上游响应头（跳过可能冲突的 CORS 头）
    const skip = new Set(['access-control-allow-origin','access-control-allow-methods','access-control-allow-headers']);
    for (const [k, v] of Object.entries(upstream.headers)) {
      if (!skip.has(k.toLowerCase())) res.setHeader(k, v);
    }
    res.writeHead(upstream.statusCode);
    upstream.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error('[proxy]', err.message);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error: ' + err.message);
  });

  // 转发请求体（POST / PUT 等）
  req.pipe(proxy, { end: true });
}

/* ---- 服务器 ---- */
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);

  /* 1. CORS 预检 */
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age':       '86400',
    });
    return res.end();
  }

  /* 2. 插件列表 API */
  if (pathname === '/api/plugins') {
    const plugins = scanPlugins(MUSIC_DIR, ROOT);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return res.end(JSON.stringify(plugins));
  }

  /* 3. CORS 代理 */
  if (pathname === '/api/proxy') {
    const target = parsed.query.url;
    if (!target) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Missing ?url= parameter');
    }
    return handleProxy(req, res, target);
  }

  /* 4. 静态文件 */
  let filePath = path.join(ROOT, pathname);
  // 安全检查：防止路径穿越
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    res.writeHead(404); return res.end('Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  } catch {
    res.writeHead(500); res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\n  漫剧画布服务器已启动`);
  console.log(`  → http://localhost:${PORT}/index.html`);
  console.log(`  → CORS 代理: http://localhost:${PORT}/api/proxy?url=<encoded>`);
  const plugins = scanPlugins(MUSIC_DIR, ROOT);
  console.log(`  → 发现 ${plugins.length} 个音源插件:`);
  plugins.forEach(p => console.log(`      ${p.name}`));
  console.log();
});
