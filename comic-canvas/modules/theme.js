/* ============================================================
   theme —— 深色/浅色主题管理
============================================================ */

import { store } from './store.js';

export const THEME_LS_KEY = 'comic-canvas:theme';

export function initTheme(){
  // 1. 优先读 localStorage
  let t = null;
  try { t = localStorage.getItem(THEME_LS_KEY); } catch(_) {}
  // 2. 没有存储则跟随系统偏好
  if(!t){
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
      t = 'light';
    } else {
      t = 'dark';
    }
  }
  applyTheme(t);
}

export function applyTheme(theme){
  store.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_LS_KEY, theme); } catch(_) {}
  // 更新按钮图标
  const btn = document.getElementById('btn-theme');
  if(btn){
    btn.setAttribute('title', theme === 'dark' ? '切换到浅色主题' : '切换到深色主题');
    btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色主题' : '切换到深色主题');
  }
}

export function toggleTheme(){
  applyTheme(store.theme === 'dark' ? 'light' : 'dark');
}

// 监听系统主题变化（仅在用户未手动设置时生效）
if(window.matchMedia){
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    // 如果用户已经手动切换过，不自动跟随
    try {
      const saved = localStorage.getItem(THEME_LS_KEY);
      if(!saved){
        applyTheme(e.matches ? 'light' : 'dark');
      }
    } catch(_) {}
  });
}
