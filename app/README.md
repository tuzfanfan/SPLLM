# 窗口文本朗读器

后台自动监控当前活动窗口的文本变化，并通过系统 TTS（语音合成）朗读出来。

## 功能特性

- **自动监控**：后台轮询检测前台窗口文本变化
- **智能防抖**：编辑器/IDE 中频繁按键不会导致无限朗读
- **中英混合朗读**：自动识别中英文段落，分别用对应语音朗读
- **系统托盘常驻**：最小化到托盘，不占用桌面空间
- **快捷键支持**：`Ctrl+Shift+R` 强制立即朗读当前文本
- **忽略列表**：可配置正则表达式，跳过指定窗口（如计算器、锁屏等）
- **可配置参数**：防抖延迟、轮询间隔、最短文本长度均可调节

## 快速开始

```bash
cd E:\SPLLM\app
npm start
```

开发模式：

```bash
npm run dev
```

## 项目结构

```
app/
├── main.js              # Electron 主进程入口
├── monitor.js           # 窗口文本监控（Win32 API）
├── debounce.js          # 防抖引擎
├── tts.js               # TTS 路由模块
├── tts-renderer.js      # TTS 实际执行（speechSynthesis）
├── tts-window.html      # TTS 专用窗口（不可见）
├── tts-window-init.js   # TTS 窗口初始化脚本
├── tray.js              # 系统托盘模块
├── settings.js          # 设置持久化（electron-store）
├── preload.js           # 预加载脚本
├── index.html           # 设置面板
├── styles.css           # 设置面板样式
├── renderer.js          # 设置面板逻辑
├── assets/
│   └── tray-icon.png    # 托盘图标
├── package.json
└── README.md
```

## 配置项

| 项 | 默认值 | 说明 |
|---|---|---|
| 轮询间隔 | 500ms | 检测窗口文本变化的频率 |
| 防抖延迟 | 3000ms | 文本变化后等待多久才开始朗读 |
| 最短文本长度 | 10 字符 | 低于此长度的文本不朗读 |
| 忽略列表 | Calculator, Task Switching 等 | 匹配的窗口标题将被跳过 |

设置保存在 `%APPDATA%\window-text-reader\config.json`。

## 打包

```bash
npm run build
```

生成的安装包在 `dist/` 目录下。

## 依赖

- Electron 33
- electron-store（设置持久化）
- electron-builder（打包）

其他依赖（ffi-napi 等）已移除，使用纯 Win32 API 调用。
