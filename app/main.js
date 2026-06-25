/**
 * main.js - Electron 主进程入口
 *
 * 组装所有模块：托盘、监控、防抖、TTS、设置面板。
 */

const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const { WindowMonitor } = require('./monitor');
const { DebounceEngine } = require('./debounce');
const { createTray, destroyTray } = require('./tray');
const { initStore, getAll, setAll, resetToDefaults } = require('./settings');
const { getRegionWindowText } = require('./monitor');
const { speak, stop, pause, resume } = require('./tts');

// ==================== 初始化 ====================

initStore();

let settingsWindow = null;
let trayInstance = null;
let monitor = null;
let debounceEngine = null;
let isMonitoring = true;

// ==================== 窗口管理 ====================

/**
 * 创建设置面板窗口
 */
function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 560,
    height: 680,
    minWidth: 400,
    minHeight: 500,
    frame: true,
    title: '窗口文本朗读器 - 设置',
    icon: path.join(__dirname, 'assets', 'tray-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'index.html'));

  // 开发模式下打开 DevTools 以便调试
  if (process.argv.includes('--dev')) {
    settingsWindow.webContents.openDevTools();
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// ==================== 监控 + TTS 流水线 ====================

function setupMonitorAndTTS() {
  const currentSettings = getAll();

  // 创建监控器
  monitor = new WindowMonitor({
    intervalMs: currentSettings.pollingIntervalMs,
    ignorePatterns: currentSettings.ignorePatterns
  });

  // 创建防抖引擎
  debounceEngine = new DebounceEngine({
    delayMs: currentSettings.debounceMs,
    minLength: currentSettings.minTextLength,
    onFlush: (text, title, isSwitch) => {
      if (isMonitoring) {
        sendToTTS(text, title);
      }
    }
  });

  // 开始监控
  monitor.start((text, title, isSwitch) => {
    debounceEngine.reset(text, title, isSwitch);
  });

  isMonitoring = currentSettings.enabled;
}

/**
 * 发送文本到 TTS
 */
function sendToTTS(text, title) {
  speak(text, (state) => {
    // 通知设置面板更新状态显示
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.webContents.send('status:update', { state });
    }
  });
}

// ==================== IPC 处理 ====================

function setupIPCHandlers() {
  // 设置读取
  ipcMain.handle('settings:get-all', () => getAll());

  // 设置写入
  ipcMain.handle('settings:set-all', (event, settings) => {
    setAll(settings);
    restartMonitorWithSettings(settings);
    return true;
  });

  // 恢复默认
  ipcMain.handle('settings:reset', () => {
    resetToDefaults();
    const settings = getAll();
    restartMonitorWithSettings(settings);
    return true;
  });

  // 获取监控信息
  ipcMain.handle('monitor:get-info', () => {
    if (monitor) return monitor.getInfo();
    return { title: '', text: '', running: false };
  });

  // 立即朗读（flush）
  ipcMain.on('monitor:flush', () => {
    if (debounceEngine && debounceEngine.hasPending()) {
      debounceEngine.flush();
    }
  });

  // 切换监控开关
  ipcMain.on('monitor:toggle', () => {
    toggleMonitoring();
  });

  // TTS 控制
  ipcMain.on('tts:speak', (event, { text, title }) => {
    sendToTTS(text, title);
  });

  ipcMain.on('tts:pause', () => {
    pause(() => {
      if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.webContents.send('status:update', { state: 'paused' });
      }
    });
  });

  ipcMain.on('tts:resume', () => {
    resume(() => {
      if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.webContents.send('status:update', { state: 'speaking' });
      }
    });
  });

  ipcMain.on('tts:stop', () => {
    stop(() => {
      if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.webContents.send('status:update', { state: 'idle' });
      }
    });
  });
}

/**
 * 切换监控开关
 */
function toggleMonitoring() {
  isMonitoring = !isMonitoring;
  if (isMonitoring) {
    if (monitor) {
      monitor.start((text, title, isSwitch) => {
        debounceEngine.reset(text, title, isSwitch);
      });
    }
  } else {
    if (monitor) monitor.stop();
    if (debounceEngine) debounceEngine.cancel();
    stop();
  }
  updateTrayTooltip();
  // 通知 renderer 更新状态
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.webContents.send('status:update', {
      state: isMonitoring ? 'active' : 'paused'
    });
  }
}

/**
 * 用新设置重启监控
 */
function restartMonitorWithSettings(newSettings) {
  if (monitor) {
    monitor.stop();
  }

  monitor = new WindowMonitor({
    intervalMs: newSettings.pollingIntervalMs,
    ignorePatterns: newSettings.ignorePatterns
  });

  debounceEngine = new DebounceEngine({
    delayMs: newSettings.debounceMs,
    minLength: newSettings.minTextLength,
    onFlush: (text, title, isSwitch) => {
      if (isMonitoring) {
        sendToTTS(text, title);
      }
    }
  });

  monitor.start((text, title, isSwitch) => {
    debounceEngine.reset(text, title, isSwitch);
  });

  isMonitoring = newSettings.enabled;
  updateTrayTooltip();
}

// ==================== 托盘 ====================

function setupTray() {
  const currentSettings = getAll();
  console.log('[Main] setupTray called, currentSettings:', JSON.stringify(currentSettings));

  trayInstance = createTray({
    onToggle: () => {
      toggleMonitoring();
    },
    onFlush: () => {
      if (debounceEngine && debounceEngine.hasPending()) {
        debounceEngine.flush();
      }
    },
    onOpenSettings: () => {
      createSettingsWindow();
    },
    onQuit: () => {
      quitApp();
    },
    onRegionRead: () => {
      console.log('[Main] onRegionRead triggered');
      // 框选区域朗读
      trayInstance.setToolTip('🔍 正在框选...');
      const { text, title } = getRegionWindowText();
      if (text && text !== 'EMPTY') {
        trayInstance.setToolTip(`📖 正在朗读: ${title}`);
        sendToTTS(text, title || '区域朗读');
      } else {
        trayInstance.setToolTip('⚠️ 未检测到文本（可能窗口不支持 UI Automation）');
        setTimeout(() => updateTrayTooltip(), 5000);
      }
    }
  }, currentSettings);
}

function updateTrayTooltip() {
  if (!trayInstance) return;
  const info = monitor ? monitor.getInfo() : { title: '', text: '' };
  const status = isMonitoring ? '● 监控中' : '○ 已暂停';
  const tip = info.title ? `${status}\n当前: ${info.title}` : status;
  trayInstance.setToolTip(tip);
}

// ==================== 生命周期 ====================

app.disableBackgroundThrottling = app.disableBackgroundThrottling || (() => {});

app.whenReady().then(() => {
  app.disableBackgroundThrottling();

  // 设置 IPC 处理器
  setupIPCHandlers();

  // 初始化监控和 TTS
  setupMonitorAndTTS();

  // 创建托盘
  setupTray();

  // 注册全局快捷键 (Ctrl+Shift+R 立即朗读)
  try {
    globalShortcut.register('Control+Shift+R', () => {
      if (debounceEngine && debounceEngine.hasPending()) {
        debounceEngine.flush();
      }
    });
  } catch (err) {
    console.warn('[Main] Failed to register global shortcut:', err.message);
  }

  // 启动时显示设置面板
  createSettingsWindow();
});

// 窗口全部关闭时不退出（保持托盘）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    quitApp();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSettingsWindow();
  }
});

// 优雅退出
function quitApp() {
  if (monitor) monitor.stop();
  if (debounceEngine) debounceEngine.destroy();
  stop();
  if (settingsWindow) settingsWindow.close();
  destroyTray();
  globalShortcut.unregisterAll();
  app.quit();
}

app.on('before-quit', () => {
  quitApp();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
