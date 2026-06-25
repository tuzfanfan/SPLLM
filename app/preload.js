/**
 * preload.js - 预加载脚本
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 设置相关
  settingsGetAll: () => ipcRenderer.invoke('settings:get-all'),
  settingsSetAll: (settings) => ipcRenderer.invoke('settings:set-all', settings),
  settingsReset: () => ipcRenderer.invoke('settings:reset'),

  // TTS 控制
  ttsSpeak: (text, title) => ipcRenderer.send('tts:speak', { text, title }),
  ttsPause: () => ipcRenderer.send('tts:pause'),
  ttsResume: () => ipcRenderer.send('tts:resume'),
  ttsStop: () => ipcRenderer.send('tts:stop'),

  // 状态更新
  onStatusUpdate: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('status:update', handler);
    return () => ipcRenderer.removeListener('status:update', handler);
  },

  // 监控信息
  getMonitorInfo: () => ipcRenderer.invoke('monitor:get-info'),

  // 立即朗读
  flushMonitor: () => ipcRenderer.send('monitor:flush'),

  // 切换监控
  toggleMonitor: () => ipcRenderer.send('monitor:toggle')
});
