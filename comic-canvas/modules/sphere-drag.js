/* ============================================================
   sphere drag manager —— 球体拖拽管理器
============================================================ */

import { store } from './store.js';

export const sphereDragManager = {
  isDragging: false,
  currentSphere: null,
  prevX: 0,
  prevY: 0,

  init() {
    // 监听 Alt 键状态
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Alt' && !e.repeat) {
        store.altPressed = true;
        document.body.style.cursor = 'grab';
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Alt') {
        store.altPressed = false;
        document.body.style.cursor = '';
      }
    });

    // 在 document 上监听，捕获阶段
    document.addEventListener('mousedown', (e) => {
      // Alt 键按下时才启用球体拖拽
      if (!store.altPressed) return;

      const sphere = this.findSphereAtPoint(e.clientX, e.clientY);
      if (!sphere) return;

      this.isDragging = true;
      this.currentSphere = sphere;
      this.prevX = e.clientX;
      this.prevY = e.clientY;

      // 阻止 Drawflow 的节点拖拽
      e.stopPropagation();
      e.preventDefault();

      // 阻止 Drawflow 的后续事件
      const stopDrawflowEvents = (evt) => {
        evt.stopPropagation();
      };
      document.addEventListener('mousemove', stopDrawflowEvents, true);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', stopDrawflowEvents, true);
      }, true);
    }, true);

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.currentSphere) return;

      const dx = e.clientX - this.prevX;
      const dy = e.clientY - this.prevY;
      this.currentSphere.rotationY += dx * this.currentSphere.options.dragSpeed;
      this.currentSphere.rotationX += dy * this.currentSphere.options.dragSpeed;
      this.currentSphere.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.currentSphere.rotationX));
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    }, true);

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.currentSphere = null;
    }, true);
  },

  findSphereAtPoint(x, y) {
    for (const id in store.nodeSpheres) {
      const sphere = store.nodeSpheres[id];
      if (!sphere || !sphere.container) continue;

      const rect = sphere.container.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return sphere;
      }
    }
    return null;
  }
};
