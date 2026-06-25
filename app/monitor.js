/**
 * monitor.js - 窗口文本监控模块
 *
 * 使用 PowerShell 获取前台窗口文本，轮询检测变化。
 * 避免了 ffi-napi 的原生编译问题。
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');

/**
 * 获取脚本目录（开发环境和打包后都可用）
 */
function getScriptsDir() {
  // 开发环境: app/scripts/
  // 打包后: 资源目录
  const resourcePath = path.join(__dirname, 'scripts');
  if (require('fs').existsSync(resourcePath)) {
    return resourcePath;
  }
  // 回退: 尝试 app.asar 解压路径
  try {
    const app = require('electron').app;
    if (app && app.getAppPath) {
      return path.join(app.getAppPath(), 'scripts');
    }
  } catch {}
  return resourcePath;
}

/**
 * 获取当前前台窗口的文本（仅窗口标题）
 * @returns {{ title: string, text: string }} 窗口标题和文本
 */
function getForegroundWindowText() {
  try {
    const scriptsDir = getScriptsDir();
    const scriptPath = path.join(scriptsDir, 'get-window-text.ps1');
    const result = execSync(
      `powershell -ExecutionPolicy Bypass -NoProfile -STA -File "${scriptPath}"`,
      { timeout: 3000, encoding: 'utf8' }
    ).trim();

    return {
      title: result || '',
      text: result || ''
    };
  } catch (err) {
    return { title: '', text: '' };
  }
}

/**
 * 监控类 - 轮询检测前台窗口文本变化
 */
class WindowMonitor {
  /**
   * @param {Object} options
   * @param {number} options.intervalMs - 轮询间隔（毫秒），默认 500
   * @param {string[]} options.ignorePatterns - 忽略的窗口标题正则列表
   */
  constructor(options = {}) {
    this.intervalMs = options.intervalMs || 500;
    this.ignorePatterns = (options.ignorePatterns || []).map(p => {
      if (p instanceof RegExp) return p;
      try { return new RegExp(p); } catch { return null; }
    }).filter(Boolean);

    this.lastText = '';
    this.lastTitle = '';
    this.running = false;
    this.pollTimer = null;
    this.onChangeCallback = null;
  }

  /**
   * 检查窗口标题是否应该被忽略
   */
  shouldIgnore(title) {
    return this.ignorePatterns.some(re => re.test(title));
  }

  /**
   * 开始监控
   * @param {Function} onChange - 文本变化时的回调 (text, title) => void
   */
  start(onChange) {
    if (this.running) return;
    this.running = true;
    this.onChangeCallback = onChange;

    this.poll();
    this.pollTimer = setInterval(() => this.poll(), this.intervalMs);
  }

  /**
   * 停止监控
   */
  stop() {
    this.running = false;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /**
   * 单次轮询
   */
  poll() {
    if (!this.running) return;

    try {
      const { title, text } = getForegroundWindowText();

      if (!title || !text) return;

      // 检查忽略列表
      if (this.shouldIgnore(title)) {
        this.lastText = '';
        this.lastTitle = '';
        return;
      }

      // 文本变化了
      if (text !== this.lastText) {
        const prevTitle = this.lastTitle;
        this.lastText = text;
        this.lastTitle = title;

        // 窗口切换时也触发回调
        if (prevTitle && prevTitle !== title) {
          if (this.onChangeCallback) {
            this.onChangeCallback(text, title, true); // true = window switch
          }
        } else if (this.onChangeCallback) {
          this.onChangeCallback(text, title, false);
        }
      }
    } catch (err) {
      // 单次轮询失败不影响整体
      console.error('[Monitor] Poll error:', err.message);
    }
  }

  /**
   * 获取当前监控的窗口信息
   */
  getInfo() {
    return {
      title: this.lastTitle,
      text: this.lastText,
      running: this.running
    };
  }
}

/**
 * 框选区域朗读：先弹出选择覆盖层，再用 UI Automation 读取区域内文本
 * @returns {{ text: string, title: string }}
 */
function getRegionWindowText() {
  const scriptsDir = getScriptsDir();
  const selectScript = path.join(scriptsDir, 'region-select.ps1');
  const uiaScript = path.join(scriptsDir, 'uia-read-region.ps1');

  // Step 1: 弹出框选覆盖层
  let selectResult;
  try {
    selectResult = execSync(
      `powershell -ExecutionPolicy Bypass -NoProfile -STA -File "${selectScript}"`,
      { timeout: 70000, encoding: 'utf8' }
    ).trim();
  } catch (err) {
    // 超时或用户取消
    return { text: '', title: '' };
  }

  // 解析结果
  let cleaned = selectResult;
  if (cleaned === '"CANCELLED"' || cleaned === '"TIMEOUT"') {
    return { text: '', title: '' };
  }
  if (cleaned.includes('"error"')) {
    return { text: '', title: '' };
  }

  let rect;
  try {
    rect = JSON.parse(cleaned);
  } catch {
    return { text: '', title: '' };
  }

  if (!rect.left || !rect.top || !rect.width || !rect.height) {
    return { text: '', title: '' };
  }

  // Step 2: 用 UI Automation 读取区域内文本
  console.log(`[Region] Selected rect: left=${rect.left}, top=${rect.top}, width=${rect.width}, height=${rect.height}`);
  let uiaResult;
  try {
    uiaResult = execSync(
      `powershell -ExecutionPolicy Bypass -NoProfile -STA -File "${uiaScript}" -Left ${rect.left} -Top ${rect.top} -Width ${rect.width} -Height ${rect.height}`,
      { timeout: 15000, encoding: 'utf8' }
    ).trim();
    console.log(`[Region] UIA result: ${uiaResult.substring(0, 200)}`);
  } catch (err) {
    console.error('[Region] UIA exec error:', err.message);
    return { text: '', title: '' };
  }

  if (!uiaResult || uiaResult === 'EMPTY') {
    return { text: '', title: '' };
  }

  // 获取窗口标题
  const winInfo = getForegroundWindowText();

  return {
    text: uiaResult,
    title: winInfo.title || '区域朗读'
  };
}

module.exports = { WindowMonitor, getForegroundWindowText, getRegionWindowText };
