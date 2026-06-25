/**
 * tts.js - TTS 模块
 *
 * 通过 PowerShell 调用 Windows SAPI 朗读文本。
 * 支持中英混合自动选择语音。
 */

const { execSync } = require('child_process');
const path = require('path');

let isSpeaking = false;
let isPaused = false;

/**
 * 检测字符是否为中文
 */
function isChineseChar(char) {
  const code = char.charCodeAt(0);
  return code >= 0x4E00 && code <= 0x9FFF;
}

/**
 * 按语言分段
 */
function segmentByLanguage(text) {
  if (!text) return [];
  const segments = [];
  let currentSegment = '';
  let currentLang = null;

  for (const char of text) {
    const charIsChinese = isChineseChar(char);
    const lang = charIsChinese ? 'zh' : 'en';
    if (currentLang === lang) {
      currentSegment += char;
    } else {
      if (currentSegment.length > 0) {
        segments.push({ text: currentSegment, lang: currentLang });
      }
      currentSegment = char;
      currentLang = lang;
    }
  }
  if (currentSegment.length > 0) {
    segments.push({ text: currentSegment, lang: currentLang });
  }
  return segments;
}

/**
 * 获取脚本目录
 */
function getScriptsDir() {
  const resourcePath = path.join(__dirname, 'scripts');
  if (require('fs').existsSync(resourcePath)) {
    return resourcePath;
  }
  try {
    const app = require('electron').app;
    if (app && app.getAppPath) {
      return path.join(app.getAppPath(), 'scripts');
    }
  } catch {}
  return resourcePath;
}

/**
 * 朗读文本
 * @param {string} text - 要朗读的文本
 * @param {Function} onStateChange - 状态回调
 */
async function speak(text, onStateChange) {
  if (!text || isSpeaking) return;

  isSpeaking = true;
  if (onStateChange) onStateChange('speaking');

  const segments = segmentByLanguage(text);
  if (segments.length === 0) {
    isSpeaking = false;
    if (onStateChange) onStateChange('idle');
    return;
  }

  const scriptsDir = getScriptsDir();
  const speakScript = path.join(scriptsDir, 'tts-speak.ps1');

  // 依次朗读每个分段
  for (const seg of segments) {
    if (!isSpeaking) break; // 被停止了

    try {
      const result = execSync(
        `powershell -ExecutionPolicy Bypass -NoProfile -STA -File "${speakScript}" -Text "${seg.text.replace(/"/g, '\\"')}"`,
        { timeout: 30000, encoding: 'utf8' }
      );
    } catch (err) {
      console.error('[TTS] Speak error:', err.message);
    }
  }

  isSpeaking = false;
  if (onStateChange) onStateChange('idle');
}

/**
 * 停止朗读
 */
function stop(onStateChange) {
  isSpeaking = false;
  isPaused = false;
  if (onStateChange) onStateChange('idle');
}

/**
 * 暂停
 */
function pause(onStateChange) {
  isPaused = true;
  if (onStateChange) onStateChange('paused');
}

/**
 * 恢复
 */
function resume(onStateChange) {
  isPaused = false;
  if (onStateChange) onStateChange('speaking');
}

module.exports = { speak, stop, pause, resume, segmentByLanguage, isSpeaking: () => isSpeaking };
