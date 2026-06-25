/**
 * renderer.js - 设置面板逻辑
 */

// DOM 元素
const form = document.getElementById('settingsForm');
const resetBtn = document.getElementById('resetBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const pauseTtsBtn = document.getElementById('pauseTtsBtn');
const resumeTtsBtn = document.getElementById('resumeTtsBtn');
const stopTtsBtn = document.getElementById('stopTtsBtn');
const pollingIntervalSlider = document.getElementById('pollingInterval');
const pollingIntervalVal = document.getElementById('pollingIntervalVal');
const debounceDelaySlider = document.getElementById('debounceDelay');
const debounceDelayVal = document.getElementById('debounceDelayVal');
const minTextLengthInput = document.getElementById('minTextLength');
const ignorePatternsTextarea = document.getElementById('ignorePatterns');
const autoStartCheckbox = document.getElementById('autoStart');
const enabledCheckbox = document.getElementById('enabled');

// TTS 按钮状态
let ttsState = 'idle'; // 'idle' | 'speaking' | 'paused'

// 加载设置
function loadSettings() {
  window.electronAPI.settingsGetAll().then(settings => {
    pollingIntervalSlider.value = settings.pollingIntervalMs;
    pollingIntervalVal.textContent = `${settings.pollingIntervalMs}ms`;
    debounceDelaySlider.value = settings.debounceMs;
    debounceDelayVal.textContent = `${settings.debounceMs}ms`;
    minTextLengthInput.value = settings.minTextLength;
    ignorePatternsTextarea.value = (settings.ignorePatterns || []).join('\n');
    autoStartCheckbox.checked = settings.autoStart;
    enabledCheckbox.checked = settings.enabled;
    showStatus(settings.enabled ? 'active' : 'paused');
  });
}

// 保存设置
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const settings = {
    pollingIntervalMs: parseInt(pollingIntervalSlider.value),
    debounceMs: parseInt(debounceDelaySlider.value),
    minTextLength: parseInt(minTextLengthInput.value),
    ignorePatterns: ignorePatternsTextarea.value.split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0),
    autoStart: autoStartCheckbox.checked,
    enabled: enabledCheckbox.checked
  };

  window.electronAPI.settingsSetAll(settings).then(() => {
    showStatus('saved');
    setTimeout(loadSettings, 500);
  });
});

// 滑块实时更新显示
pollingIntervalSlider.addEventListener('input', () => {
  pollingIntervalVal.textContent = `${pollingIntervalSlider.value}ms`;
});

debounceDelaySlider.addEventListener('input', () => {
  debounceDelayVal.textContent = `${debounceDelaySlider.value}ms`;
});

// 恢复默认
resetBtn.addEventListener('click', () => {
  if (confirm('确定要恢复所有设置为默认值吗？')) {
    window.electronAPI.settingsReset().then(loadSettings);
  }
});

// TTS 控制按钮
pauseTtsBtn.addEventListener('click', () => {
  window.electronAPI.ttsPause();
});

resumeTtsBtn.addEventListener('click', () => {
  window.electronAPI.ttsResume();
});

stopTtsBtn.addEventListener('click', () => {
  window.electronAPI.ttsStop();
});

// 更新 TTS 按钮状态
function updateTtsButtons(state) {
  ttsState = state;
  switch (state) {
    case 'speaking':
      pauseTtsBtn.disabled = false;
      resumeTtsBtn.disabled = true;
      stopTtsBtn.disabled = false;
      break;
    case 'paused':
      pauseTtsBtn.disabled = true;
      resumeTtsBtn.disabled = false;
      stopTtsBtn.disabled = false;
      break;
    case 'idle':
    default:
      pauseTtsBtn.disabled = true;
      resumeTtsBtn.disabled = true;
      stopTtsBtn.disabled = true;
      break;
  }
}

// 状态显示
function showStatus(type) {
  statusDot.className = 'status-dot';
  switch (type) {
    case 'active':
      statusDot.classList.add('active');
      statusText.textContent = '监控中';
      break;
    case 'paused':
      statusDot.classList.add('paused');
      statusText.textContent = '已暂停';
      break;
    case 'speaking':
      statusDot.classList.add('speaking');
      statusText.textContent = '朗读中...';
      updateTtsButtons('speaking');
      break;
    case 'idle':
      statusText.textContent = '未启动';
      updateTtsButtons('idle');
      break;
    case 'saved':
      statusText.textContent = '设置已保存 ✓';
      break;
    default:
      statusText.textContent = '未知状态';
  }
}

// 监听主进程发来的状态更新
window.electronAPI.onStatusUpdate((data) => {
  showStatus(data.state);
});

// 初始化
loadSettings();
updateTtsButtons('idle');
