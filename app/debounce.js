/**
 * debounce.js - 防抖引擎
 *
 * 文本变化后等待一段时间再触发，避免编辑器/IDE 中频繁按键导致无限朗读。
 */

class DebounceEngine {
  /**
   * @param {Object} options
   * @param {Function} options.onFlush - 防抖触发时的回调 (text, title, isSwitch) => void
   * @param {number} options.delayMs - 防抖延迟（毫秒），默认 3000
   * @param {number} options.minLength - 最短文本长度，低于此值不触发，默认 10
   */
  constructor(options = {}) {
    this.onFlush = options.onFlush || (() => {});
    this.delayMs = options.delayMs || 3000;
    this.minLength = options.minLength || 10;

    this.timer = null;
    this.pendingText = null;
    this.pendingTitle = null;
    this.pendingIsSwitch = false;
  }

  /**
   * 收到文本变化，重置计时器
   */
  reset(text, title, isSwitch = false) {
    // 太短的文本忽略
    if (!text || text.length < this.minLength) return;

    // 清除已有计时器
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // 保存当前文本
    this.pendingText = text;
    this.pendingTitle = title;
    this.pendingIsSwitch = isSwitch;

    // 启动新计时器
    this.timer = setTimeout(() => {
      this.flush();
    }, this.delayMs);
  }

  /**
   * 强制立即触发朗读（跳过防抖）
   */
  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const text = this.pendingText;
    const title = this.pendingTitle;
    const isSwitch = this.pendingIsSwitch;

    if (text && text.length >= this.minLength) {
      this.onFlush(text, title, isSwitch);
    }

    this.pendingText = null;
    this.pendingTitle = null;
    this.pendingIsSwitch = false;
  }

  /**
   * 取消待处理的朗读
   */
  cancel() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pendingText = null;
    this.pendingTitle = null;
    this.pendingIsSwitch = false;
  }

  /**
   * 是否有待处理的文本
   */
  hasPending() {
    return !!this.pendingText;
  }

  /**
   * 获取待处理的文本
   */
  getPendingText() {
    return this.pendingText || '';
  }

  /**
   * 销毁
   */
  destroy() {
    this.cancel();
    this.onFlush = () => {};
  }
}

module.exports = { DebounceEngine };
