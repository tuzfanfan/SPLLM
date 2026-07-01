/* ============================================================
   index.js —— 模块入口
   导入所有模块并启动应用
============================================================ */

// Import foundational modules (side-effects: ink ripple animation, sphere drag)
import { initInkRippleAnimation } from './ink-ripple.js';
import { sphereDragManager } from './sphere-drag.js';

// Import main application module and start
import { boot } from './canvas.js';

// Initialize independent sub-systems before boot
initInkRippleAnimation();
sphereDragManager.init();

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', boot);

// Export everything for external access
export {
  sphereDragManager,
  boot,
};
