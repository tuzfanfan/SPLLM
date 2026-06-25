/**
 * settings.js - 设置持久化模块
 *
 * 使用 electron-store 保存和读取用户配置。
 */

const Store = require('electron-store');

// 默认配置
const DEFAULTS = {
  debounceMs: 3000,
  minTextLength: 10,
  pollingIntervalMs: 500,
  ignorePatterns: [
    '^Calculator$',
    '^Task Switching$',
    '^Lock Screen$',
    '^Notification$',
    '^Windows Security$'
  ],
  autoStart: false,
  enabled: true
};

let store = null;

/**
 * 初始化 store
 */
function initStore() {
  store = new Store({
    name: 'window-text-reader',
    defaults: DEFAULTS
  });
  return store;
}

/**
 * 获取 store 实例
 */
function getStore() {
  if (!store) {
    initStore();
  }
  return store;
}

/**
 * 获取所有设置
 */
function getAll() {
  const s = getStore();
  const result = {};
  for (const key of Object.keys(DEFAULTS)) {
    result[key] = s.get(key, DEFAULTS[key]);
  }
  return result;
}

/**
 * 获取单个设置
 */
function get(key, defaultValue) {
  const s = getStore();
  return s.get(key, defaultValue !== undefined ? defaultValue : DEFAULTS[key]);
}

/**
 * 设置单个值
 */
function set(key, value) {
  const s = getStore();
  s.set(key, value);
}

/**
 * 批量设置
 */
function setAll(newSettings) {
  const s = getStore();
  for (const [key, value] of Object.entries(newSettings)) {
    s.set(key, value);
  }
}

/**
 * 重置为默认值
 */
function resetToDefaults() {
  setAll(DEFAULTS);
}

/**
 * 导出默认配置（用于首次运行时的提示）
 */
function getDefaultConfig() {
  return { ...DEFAULTS };
}

module.exports = { initStore, getStore, getAll, get, set, setAll, resetToDefaults, getDefaultConfig };
