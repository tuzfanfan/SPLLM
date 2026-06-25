/**
 * tray.js - 系统托盘模块
 *
 * 创建系统托盘图标和右键菜单，控制应用的启停和状态。
 */

const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;

/**
 * 创建系统托盘
 * @param {Object} options - 回调函数和依赖
 * @param {Function} options.onToggle - 切换监控开关
 * @param {Function} options.onFlush - 立即朗读
 * @param {Function} options.onOpenSettings - 打开设置面板
 * @param {Function} options.onQuit - 退出应用
 * @param {Function} options.onRegionRead - 框选区域朗读
 * @param {WindowMonitor} options.monitor - 监控器实例
 * @param {boolean} options.isMonitoring - 是否正在监控
 * @param {Object} settings - 当前设置
 */
function createTray(options, settings) {
  console.log('[Tray] createTray called, options keys:', Object.keys(options));
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');

  // 尝试加载图标
  let icon;
  try {
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      icon = nativeImage.createEmpty();
    }
  } catch (err) {
    console.log('[Tray] Icon load error:', err.message);
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);
  tray.setToolTip('窗口文本朗读器');
  console.log('[Tray] Tray created successfully');

  const buildMenu = () => {
    console.log('[Tray] buildMenu called, onRegionRead:', typeof options.onRegionRead);
    const monitorInfo = options.monitor ? options.monitor.getInfo() : { title: '', text: '', running: false };
    const currentWindow = monitorInfo.title || '无';

    return Menu.buildFromTemplate([
      {
        label: monitorInfo.running ? '⏸ 暂停监控' : '▶ 开始监控',
        click: () => {
          console.log('[Tray] onToggle clicked');
          options.onToggle();
        }
      },
      {
        label: '📖 立即朗读当前文本',
        click: () => {
          console.log('[Tray] onFlush clicked');
          options.onFlush();
        },
        enabled: monitorInfo.running && !!monitorInfo.text
      },
      { type: 'separator' },
      {
        label: '🎯 框选区域朗读',
        click: () => {
          console.log('[Tray] onRegionRead clicked');
          if (options.onRegionRead) {
            options.onRegionRead();
          } else {
            console.log('[Tray] WARNING: onRegionRead is undefined!');
          }
        }
      },
      { type: 'separator' },
      {
        label: '⚙ 设置',
        click: () => options.onOpenSettings()
      },
      { type: 'separator' },
      {
        label: `当前窗口: ${currentWindow.substring(0, 40)}${currentWindow.length > 40 ? '...' : ''}`,
        enabled: false
      },
      {
        label: `状态: ${monitorInfo.running ? (settings.enabled ? '监控中' : '已暂停') : '未启动'}`,
        enabled: false
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => options.onQuit()
      }
    ]);
  };

  tray.setContextMenu(buildMenu());
  console.log('[Tray] Menu set successfully');

  // 双击托盘图标打开设置
  tray.on('double-click', () => {
    if (options.onOpenSettings) options.onOpenSettings();
  });

  return tray;
}

/**
 * 销毁托盘
 */
function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

module.exports = { createTray, destroyTray };
