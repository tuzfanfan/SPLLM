using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Speech.Synthesis;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Automation;

namespace WindowTextReader {
    class Program {
        [STAThread]
        static void Main(string[] args) {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainWindow());
        }
    }

    class MainWindow : Form {
        private NotifyIcon trayIcon;
        private ContextMenuStrip trayMenu;
        private ToolStripMenuItem toggleItem, flushItem, regionItem, settingsItem;
        private ToolStripLabel statusLbl, windowLbl;
        private WindowMonitor monitor;
        private DebounceEngine debounce;
        private TtsEngine tts;
        private bool isMonitoring = true;
        private int debounceMs = 3000, minTextLength = 10, pollingIntervalMs = 500;
        private List<string> ignorePatterns = new List<string> {
            "^Calculator$", "^Task Switching$", "^Lock Screen$",
            "^Notification$", "^Windows Security$"
        };
        private System.Windows.Forms.Timer trayTimer;

        public MainWindow() {
            Text = "窗口文本朗读器";
            WindowState = FormWindowState.Minimized;
            Visible = false;
            ShowInTaskbar = false;

            monitor = new WindowMonitor(pollingIntervalMs, ignorePatterns);
            debounce = new DebounceEngine(debounceMs, minTextLength, OnFlushed);
            tts = new TtsEngine();

            trayIcon = new NotifyIcon {
                Icon = SystemIcons.Application,
                Text = "窗口文本朗读器",
                Visible = true
            };
            trayIcon.DoubleClick += (s, e) => ShowSettings();

            trayMenu = new ContextMenuStrip();
            toggleItem = new ToolStripMenuItem("暂停监控");
            toggleItem.Click += (s, e) => ToggleMonitoring();
            trayMenu.Items.Add(toggleItem);

            flushItem = new ToolStripMenuItem("立即朗读当前文本");
            flushItem.Click += (s, e) => FlushMonitor();
            trayMenu.Items.Add(flushItem);

            trayMenu.Items.Add(new ToolStripSeparator());

            regionItem = new ToolStripMenuItem("框选区域朗读");
            regionItem.Click += (s, e) => RegionRead();
            trayMenu.Items.Add(regionItem);

            trayMenu.Items.Add(new ToolStripSeparator());

            settingsItem = new ToolStripMenuItem("设置");
            settingsItem.Click += (s, e) => ShowSettings();
            trayMenu.Items.Add(settingsItem);

            trayMenu.Items.Add(new ToolStripSeparator());

            statusLbl = new ToolStripLabel("状态: 监控中");
            trayMenu.Items.Add(statusLbl);
            windowLbl = new ToolStripLabel("当前窗口: 无");
            trayMenu.Items.Add(windowLbl);

            trayMenu.Items.Add(new ToolStripSeparator());

            var quitItem = new ToolStripMenuItem("退出");
            quitItem.Click += (s, e) => {
                monitor.Stop();
                tts.Dispose();
                trayIcon.Dispose();
                Application.Exit();
            };
            trayMenu.Items.Add(quitItem);

            trayIcon.ContextMenuStrip = trayMenu;
            monitor.Start(OnTextChanged);

            trayTimer = new System.Windows.Forms.Timer();
            trayTimer.Interval = 1000;
            trayTimer.Tick += (s, e) => {
                try {
                    var info = monitor.GetInfo();
                    windowLbl.Text = "当前窗口: " + info.Title;
                    statusLbl.Text = "状态: " + (isMonitoring ? "监控中" : "已暂停");
                    if (isMonitoring) {
                        trayIcon.Text = "窗口文本朗读器\r\n当前: " + info.Title;
                    } else {
                        trayIcon.Text = "窗口文本朗读器 (已暂停)";
                    }
                } catch { }
            };
            trayTimer.Start();

            Console.WriteLine("[MainWindow] Started successfully");
        }

        void OnTextChanged(string text, string title, bool isSwitch) {
            if (!isMonitoring) return;
            debounce.Reset(text, title, isSwitch);
        }

        void OnFlushed(string text, string title) {
            Console.WriteLine("[TTS] Speaking: " + title + " - " + text.Substring(0, Math.Min(50, text.Length)) + "...");
            tts.SpeakAsync(text);
        }

        void ToggleMonitoring() {
            isMonitoring = !isMonitoring;
            if (isMonitoring) {
                monitor.Start(OnTextChanged);
                toggleItem.Text = "暂停监控";
                Console.WriteLine("[Main] Monitoring STARTED");
            } else {
                monitor.Stop();
                debounce.Cancel();
                tts.Stop();
                toggleItem.Text = "开始监控";
                Console.WriteLine("[Main] Monitoring PAUSED");
            }
        }

        void FlushMonitor() {
            if (debounce.HasPending()) {
                Console.WriteLine("[Main] Flushing...");
                debounce.Flush();
            }
        }

        void RegionRead() {
            Console.WriteLine("[Main] Region read triggered");
            trayIcon.Text = "正在框选...";
            statusLbl.Text = "状态: 框选中...";

            var result = SelectorForm.Run(60);
            Console.WriteLine("[Main] Region result: " + result);

            if (string.IsNullOrEmpty(result) || result == "CANCELLED" || result == "EMPTY" || result.Contains("selection_too_small")) {
                trayIcon.Text = "窗口文本朗读器";
                statusLbl.Text = "状态: 监控中";
                return;
            }

            var rect = ParseRect(result);
            if (rect == null) {
                trayIcon.Text = "窗口文本朗读器";
                statusLbl.Text = "状态: 监控中";
                return;
            }

            Console.WriteLine("[Main] Selected rect: " + rect.left + "," + rect.top + "," + rect.width + "x" + rect.height);

            // 获取框选时的前台窗口句柄
            var hWnd = User32.GetForegroundWindow();
            Console.WriteLine("[Main] Foreground window: " + hWnd);
            Console.WriteLine("[Main] Foreground window title: " + User32.GetForegroundWindowText().Item1);

            var uiaText = UiReader.ReadRegion(rect.left, rect.top, rect.width, rect.height, hWnd);
            Console.WriteLine("[Main] UIA result length: " + (uiaText != null ? uiaText.Length : 0) + " chars");
            Console.WriteLine("[Main] UIA result preview: " + (uiaText != null ? uiaText.Substring(0, Math.Min(100, uiaText.Length)) : "null"));
            Console.WriteLine("[Main] UIA result FULL: " + uiaText);

            if (string.IsNullOrEmpty(uiaText) || uiaText == "EMPTY") {
                trayIcon.Text = "未检测到文本";
                statusLbl.Text = "状态: 未检测到文本";
                MessageBox.Show("未检测到文本。\n\n可能原因：\n1. 所选窗口不支持 UI Automation\n2. 浏览器网页内容无法读取（GPU 加速）\n3. 选区太小", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                trayIcon.Text = "窗口文本朗读器";
                statusLbl.Text = "状态: 监控中";
                return;
            }

            var winInfo = User32.GetForegroundWindowText();
            Console.WriteLine("[Main] Window title: " + winInfo.Item1);

            trayIcon.Text = "朗读中: " + winInfo.Item1;
            statusLbl.Text = "状态: 朗读中...";
            Console.WriteLine("[TTS] About to speak: " + uiaText);
            tts.SpeakAsync(uiaText);
        }

        RectData ParseRect(string json) {
            try {
                var clean = json.Replace("{", "").Replace("}", "").Replace("\"", "");
                var dict = new Dictionary<string, int>();
                foreach (var pair in clean.Split(',')) {
                    var kv = pair.Split(':');
                    int val;
                    if (kv.Length == 2 && int.TryParse(kv[1].Trim(), out val)) {
                        dict[kv[0].Trim()] = val;
                    }
                }
                if (dict.ContainsKey("left") && dict.ContainsKey("top") &&
                    dict.ContainsKey("width") && dict.ContainsKey("height")) {
                    return new RectData {
                        left = dict["left"], top = dict["top"],
                        width = dict["width"], height = dict["height"]
                    };
                }
            } catch { }
            return null;
        }

        void ShowSettings() {
            var dlg = new SettingsForm(debounceMs, minTextLength, pollingIntervalMs, ignorePatterns);
            dlg.ShowDialog();

            if (dlg.ResultAction == "READ_NOW") {
                FlushMonitor();
                return;
            }
            if (dlg.ResultAction == "REGION_READ") {
                RegionRead();
                return;
            }
            if (dlg.ResultAction == "TOGGLE_MONITOR") {
                ToggleMonitoring();
                return;
            }

            if (dlg.DialogResult == DialogResult.OK) {
                debounceMs = dlg.DebounceMs;
                minTextLength = dlg.MinTextLength;
                pollingIntervalMs = dlg.PollingIntervalMs;
                ignorePatterns = dlg.IgnorePatterns;

                monitor.Stop();
                monitor = new WindowMonitor(pollingIntervalMs, ignorePatterns);
                if (isMonitoring) monitor.Start(OnTextChanged);

                debounce = new DebounceEngine(debounceMs, minTextLength, OnFlushed);
            }
        }
    }

    class RectData {
        public int left, top, width, height;
    }

    class WindowMonitor {
        private int intervalMs;
        private List<RegexWrapper> regexes;
        private Thread pollThread;
        private volatile bool running = false;
        private Action<string, string, bool> onChange;
        private string lastText = "", lastTitle = "";

        public WindowMonitor(int intervalMs, List<string> ignorePatterns) {
            this.intervalMs = intervalMs;
            this.regexes = new List<RegexWrapper>();
            foreach (var p in ignorePatterns) {
                try { regexes.Add(new RegexWrapper(p)); } catch { }
            }
        }

        public void Start(Action<string, string, bool> onChange) {
            this.onChange = onChange;
            running = true;
            pollThread = new Thread(PollLoop) { IsBackground = true, Name = "MonitorPoll" };
            pollThread.Start();
        }

        public void Stop() {
            running = false;
            pollThread.Join(2000);
        }

        void PollLoop() {
            while (running) {
                try {
                    var info = User32.GetForegroundWindowText();
                    Console.WriteLine("[Monitor] Title=" + info.Item1 + " Text=" + info.Item2);
                    if (!string.IsNullOrEmpty(info.Item1) && !ShouldIgnore(info.Item1)) {
                        if (info.Item2 != lastText) {
                            var prevTitle = lastTitle;
                            lastText = info.Item2;
                            lastTitle = info.Item1;
                            Console.WriteLine("[Monitor] Changed! Calling onChange");
                            onChange(info.Item2, info.Item1, !string.IsNullOrEmpty(prevTitle) && prevTitle != info.Item1);
                        }
                    } else {
                        lastText = "";
                        lastTitle = "";
                    }
                } catch { }
                Thread.Sleep(intervalMs);
            }
        }

        bool ShouldIgnore(string title) {
            foreach (var r in regexes) {
                if (r.IsMatch(title)) return true;
            }
            return false;
        }

        public MonitorInfo GetInfo() {
            return new MonitorInfo { Title = lastTitle, Text = lastText, Running = running };
        }
    }

    class RegexWrapper {
        private System.Text.RegularExpressions.Regex regex;
        public RegexWrapper(string pattern) { regex = new System.Text.RegularExpressions.Regex(pattern); }
        public bool IsMatch(string input) { return regex.IsMatch(input); }
    }

    class MonitorInfo {
        public string Title { get; set; }
        public string Text { get; set; }
        public bool Running { get; set; }
    }

    class DebounceEngine {
        private int delayMs, minChars;
        private Action<string, string> onFlush;
        private System.Windows.Forms.Timer timer;
        private string pendingText, pendingTitle;

        public DebounceEngine(int delayMs, int minChars, Action<string, string> onFlush) {
            this.delayMs = delayMs;
            this.minChars = minChars;
            this.onFlush = onFlush;
            timer = new System.Windows.Forms.Timer();
            timer.Tick += (s, e) => {
                timer.Stop();
                if (!string.IsNullOrEmpty(pendingText)) {
                    onFlush(pendingText, pendingTitle);
                    pendingText = null;
                    pendingTitle = null;
                }
            };
        }

        public void Reset(string text, string title, bool isSwitch) {
            if (string.IsNullOrEmpty(text) || text.Length < minChars) return;
            timer.Stop();
            pendingText = text;
            pendingTitle = title;
            timer.Interval = delayMs;
            timer.Start();
        }

        public void Flush() {
            timer.Stop();
            if (!string.IsNullOrEmpty(pendingText)) {
                onFlush(pendingText, pendingTitle);
                pendingText = null;
                pendingTitle = null;
            }
        }

        public void Cancel() {
            timer.Stop();
            pendingText = null;
            pendingTitle = null;
        }

        public bool HasPending() { return !string.IsNullOrEmpty(pendingText); }
    }

    class TtsEngine : IDisposable {
        private SpeechSynthesizer sp;
        private CancellationTokenSource cts;

        public TtsEngine() {
            sp = new SpeechSynthesizer();
            sp.Rate = 0;
            sp.Volume = 100;
            var voices = sp.GetInstalledVoices();
            foreach (var v in voices) {
                var name = v.VoiceInfo.Name.ToLower();
                if (name.Contains("huihui") || name.Contains("xiaoxiao") || name.Contains("yunxi")) {
                    sp.SelectVoice(v.VoiceInfo.Name);
                    break;
                }
            }
            Console.WriteLine("[TTS] Initialized: " + sp.Voice.Name);
        }

        public void SpeakAsync(string text) {
            cts = new CancellationTokenSource();
            Task.Factory.StartNew(() => {
                try { sp.Speak(text); } catch { }
            }, cts.Token);
        }

        public void Stop() {
            if (cts != null) cts.Cancel();
        }

        public void Dispose() {
            if (cts != null) cts.Cancel();
            if (sp != null) sp.Dispose();
        }
    }

    class SelectorForm : Form {
        private Point startPoint, endPoint;
        private bool isDragging;
        private string result;
        private Screen screen;

        public SelectorForm() {
            screen = Screen.PrimaryScreen;
            StartPosition = FormStartPosition.Manual;
            Location = screen.Bounds.Location;
            Size = screen.Bounds.Size;
            FormBorderStyle = FormBorderStyle.None;
            TopMost = true;
            KeyPreview = true;
            BackColor = Color.Black;
            Opacity = 0.6;
            ShowInTaskbar = false;
            Cursor = Cursors.Cross;
        }

        protected override void OnMouseDown(MouseEventArgs e) {
            if (e.Button == MouseButtons.Left) {
                startPoint = e.Location;
                endPoint = e.Location;
                isDragging = true;
            }
            base.OnMouseDown(e);
        }

        protected override void OnMouseMove(MouseEventArgs e) {
            if (isDragging) { endPoint = e.Location; Invalidate(); }
            base.OnMouseMove(e);
        }

        protected override void OnMouseUp(MouseEventArgs e) {
            if (isDragging && e.Button == MouseButtons.Left) {
                isDragging = false;
                var x = Math.Min(startPoint.X, endPoint.X);
                var y = Math.Min(startPoint.Y, endPoint.Y);
                var w = Math.Abs(endPoint.X - startPoint.X);
                var h = Math.Abs(endPoint.Y - startPoint.Y);
                if (w > 10 && h > 10) {
                    result = "{\"left\":" + x + ",\"top\":" + y + ",\"width\":" + w + ",\"height\":" + h + "}";
                } else {
                    result = "{\"error\":\"selection_too_small\"}";
                }
                Close();
            }
            base.OnMouseUp(e);
        }

        protected override void OnKeyDown(KeyEventArgs e) {
            if (e.KeyCode == Keys.Escape) { result = "CANCELLED"; Close(); }
            base.OnKeyDown(e);
        }

        protected override void OnPaint(PaintEventArgs e) {
            base.OnPaint(e);
            if (isDragging && startPoint != Point.Empty) {
                var x = Math.Min(startPoint.X, endPoint.X);
                var y = Math.Min(startPoint.Y, endPoint.Y);
                var w = Math.Abs(endPoint.X - startPoint.X);
                var h = Math.Abs(endPoint.Y - startPoint.Y);
                using (var brush = new SolidBrush(Color.FromArgb(80, 0, 128, 255)))
                    e.Graphics.FillRectangle(brush, x, y, w, h);
                using (var pen = new Pen(Color.White, 2))
                    e.Graphics.DrawRectangle(pen, x, y, w, h);
            }
        }

        public static string Run(int timeoutSeconds) {
            var form = new SelectorForm();
            var timer = new System.Windows.Forms.Timer();
            timer.Interval = timeoutSeconds * 1000;
            timer.Tick += (s, e) => {
                if (form.result == null) {
                    form.result = "TIMEOUT";
                    if (form.IsHandleCreated) {
                        form.Invoke(new Action(form.Close));
                    } else {
                        form.Close();
                    }
                }
            };
            timer.Start();
            form.ShowDialog();
            timer.Stop();
            return form.result ?? "CANCELLED";
        }
    }

    class UiReader {
        public static string ReadRegion(int left, int top, int width, int height, IntPtr hWnd) {
            try {
                if (hWnd == IntPtr.Zero) return "EMPTY";

                var root = AutomationElement.FromHandle(hWnd);
                if (root == null) return "EMPTY";

                var matched = new List<TextItem>();
                var queue = new Queue<AutomationElement>();
                queue.Enqueue(root);
                var visited = new HashSet<string>();
                int iterations = 0;
                const int MaxIter = 5000;

                while (queue.Count > 0 && iterations++ < MaxIter) {
                    var elem = queue.Dequeue();
                    var id = elem.Current.AutomationId;
                    if (visited.Contains(id)) continue;
                    visited.Add(id);

                    double elLeft, elTop, elWidth, elHeight;
                    try {
                        var boundsObj = elem.GetCurrentPropertyValue(AutomationElement.BoundingRectangleProperty);
                        // Use reflection to avoid System.Windows.Rect dependency
                        var boundsType = boundsObj.GetType();
                        elLeft = (double)boundsType.GetProperty("Left").GetValue(boundsObj, null);
                        elTop = (double)boundsType.GetProperty("Top").GetValue(boundsObj, null);
                        elWidth = (double)boundsType.GetProperty("Width").GetValue(boundsObj, null);
                        elHeight = (double)boundsType.GetProperty("Height").GetValue(boundsObj, null);
                    } catch { continue; }

                    if (elWidth <= 0 || elHeight <= 0) continue;

                    if (!(left < elLeft + elWidth && left + width > elLeft &&
                          top < elTop + elHeight && top + height > elTop)) continue;

                    bool isOffscreen;
                    try {
                        isOffscreen = (bool)elem.GetCurrentPropertyValue(AutomationElement.IsOffscreenProperty, true);
                    } catch { isOffscreen = false; }
                    if (isOffscreen) continue;

                    string text = null;

                    try {
                        var name = elem.GetCurrentPropertyValue(AutomationElement.NameProperty, true);
                        if (name != null && !string.IsNullOrWhiteSpace(name.ToString())) {
                            text = name.ToString().Trim();
                        }
                    } catch { }

                    if (string.IsNullOrEmpty(text)) {
                        try {
                            object vp;
                            if (elem.TryGetCurrentPattern(ValuePattern.Pattern, out vp)) {
                                var val = ((ValuePattern)vp).Current.Value;
                                if (!string.IsNullOrWhiteSpace(val)) text = val.Trim();
                            }
                        } catch { }
                    }

                    if (string.IsNullOrEmpty(text)) {
                        try {
                            object tp;
                            if (elem.TryGetCurrentPattern(TextPattern.Pattern, out tp)) {
                                var textRange = ((TextPattern)tp).DocumentRange;
                                var allText = textRange.GetText(-1);
                                if (!string.IsNullOrWhiteSpace(allText)) text = allText.Trim();
                            }
                        } catch { }
                    }

                    if (string.IsNullOrEmpty(text)) {
                        try {
                            var ct = elem.Current.ControlType.ProgrammaticName;
                            if (ct.Contains("Text") || ct.Contains("Edit") || ct.Contains("Document") ||
                                ct.Contains("ListItem") || ct.Contains("DataItem") || ct.Contains("RichEdit")) {
                                var name = elem.Current.Name;
                                if (!string.IsNullOrWhiteSpace(name)) text = name.Trim();
                            }
                        } catch { }
                    }

                    if (!string.IsNullOrEmpty(text)) {
                        matched.Add(new TextItem { Text = text, Top = elTop, Left = elLeft });
                    }

                    try {
                        var children = elem.FindAll(TreeScope.Children, Condition.TrueCondition);
                        foreach (AutomationElement child in children) {
                            queue.Enqueue(child);
                        }
                    } catch { }
                }

                if (matched.Count == 0) return "EMPTY";

                Console.WriteLine("[UiReader] Matched " + matched.Count + " elements:");
                foreach (var item in matched) {
                    Console.WriteLine("[UiReader]   Text='" + item.Text + "' Top=" + item.Top + " Left=" + item.Left);
                }

                matched.Sort((a, b) => {
                    var cmp = a.Top.CompareTo(b.Top);
                    return cmp != 0 ? cmp : a.Left.CompareTo(b.Left);
                });

                var sb = new System.Text.StringBuilder();
                foreach (var item in matched) {
                    if (sb.Length > 0) sb.Append("\n");
                    sb.Append(item.Text);
                }
                return sb.ToString();
            } catch (Exception ex) {
                Console.WriteLine("[UiReader] Error: " + ex.Message);
                return "EMPTY";
            }
        }

        private struct TextItem {
            public string Text;
            public double Top, Left;
        }
    }

    class SettingsForm : Form {
        private NumericUpDown debounceNud, minLenNud, pollNud;
        private TextBox ignoreBox;
        private int debounceMs, minTextLength, pollingIntervalMs;
        private List<string> ignorePatterns;
        public string ResultAction { get; private set; }

        public int DebounceMs { get { return (int)debounceNud.Value; } }
        public int MinTextLength { get { return (int)minLenNud.Value; } }
        public int PollingIntervalMs { get { return (int)pollNud.Value; } }
        public List<string> IgnorePatterns {
            get {
                var list = new List<string>();
                foreach (var line in ignoreBox.Lines) {
                    if (!string.IsNullOrWhiteSpace(line)) list.Add(line);
                }
                return list;
            }
        }

        public SettingsForm(int debounceMs, int minTextLength, int pollingIntervalMs, List<string> ignorePatterns) {
            this.debounceMs = debounceMs;
            this.minTextLength = minTextLength;
            this.pollingIntervalMs = pollingIntervalMs;
            this.ignorePatterns = ignorePatterns;

            Text = "设置";
            Size = new Size(500, 420);
            StartPosition = FormStartPosition.CenterScreen;
            Font = new Font("Microsoft YaHei", 9f);

            int y = 20;
            Controls.Add(new Label { Text = "防抖延迟 (ms):", Location = new Point(20, y), AutoSize = true });
            debounceNud = new NumericUpDown { Minimum = 1000, Maximum = 10000, Value = debounceMs, Increment = 500, Location = new Point(160, y - 3), Width = 100 };
            Controls.Add(debounceNud);
            y += 35;

            Controls.Add(new Label { Text = "最短文本长度 (字符):", Location = new Point(20, y), AutoSize = true });
            minLenNud = new NumericUpDown { Minimum = 1, Maximum = 50, Value = minTextLength, Location = new Point(160, y - 3), Width = 100 };
            Controls.Add(minLenNud);
            y += 35;

            Controls.Add(new Label { Text = "轮询间隔 (ms):", Location = new Point(20, y), AutoSize = true });
            pollNud = new NumericUpDown { Minimum = 200, Maximum = 2000, Value = pollingIntervalMs, Increment = 100, Location = new Point(160, y - 3), Width = 100 };
            Controls.Add(pollNud);
            y += 35;

            Controls.Add(new Label { Text = "忽略窗口标题 (正则, 每行一个):", Location = new Point(20, y), AutoSize = true });
            y += 25;
            ignoreBox = new TextBox { Multiline = true, Text = string.Join("\n", ignorePatterns), Location = new Point(20, y), Size = new Size(440, 150), Font = new Font("Consolas", 9f) };
            Controls.Add(ignoreBox);

            // 朗读控制按钮
            y += 170;
            Controls.Add(new Label { Text = "朗读控制:", Location = new Point(20, y), AutoSize = true });
            y += 25;
            var readNowBtn = new Button { Text = "📖 立即朗读当前窗口", Location = new Point(20, y), Width = 180 };
            readNowBtn.Tag = "READ_NOW";
            Controls.Add(readNowBtn);
            var regionBtn = new Button { Text = "🎯 框选区域朗读", Location = new Point(210, y), Width = 180 };
            regionBtn.Tag = "REGION_READ";
            Controls.Add(regionBtn);
            var pauseBtn = new Button { Text = "⏸ 暂停监控", Location = new Point(400, y), Width = 90 };
            pauseBtn.Tag = "TOGGLE_MONITOR";
            Controls.Add(pauseBtn);
            readNowBtn.Click += (s, e) => { ResultAction = "READ_NOW"; Close(); };
            regionBtn.Click += (s, e) => { ResultAction = "REGION_READ"; Close(); };
            pauseBtn.Click += (s, e) => { ResultAction = "TOGGLE_MONITOR"; Close(); };

            y += 35;
            var okBtn = new Button { Text = "确定", DialogResult = DialogResult.OK, Location = new Point(130, y), Width = 80 };
            var cancelBtn = new Button { Text = "取消", DialogResult = DialogResult.Cancel, Location = new Point(240, y), Width = 80 };
            Controls.AddRange(new Control[] { okBtn, cancelBtn, readNowBtn, regionBtn, pauseBtn });
        }
    }

    static class User32 {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);

        [DllImport("user32.dll")]
        public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, System.Text.StringBuilder lParam);

        const uint WM_GETTEXT = 0x000D;

        public static Tuple<string, string> GetForegroundWindowText() {
            try {
                var handle = GetForegroundWindow();
                if (handle == IntPtr.Zero) return Tuple.Create("", "");
                var sb = new System.Text.StringBuilder(256);
                GetWindowText(handle, sb, sb.Capacity);
                var title = sb.ToString();
                // 尝试用 WM_GETTEXT 获取编辑控件内容
                try {
                    var editSb = new System.Text.StringBuilder(4096);
                    SendMessage(handle, WM_GETTEXT, IntPtr.Zero, editSb);
                    var editText = editSb.ToString().Trim();
                    if (!string.IsNullOrEmpty(editText)) {
                        return Tuple.Create(title, editText);
                    }
                } catch { }
                return Tuple.Create(title, title);
            } catch { return Tuple.Create("", ""); }
        }
    }
}
