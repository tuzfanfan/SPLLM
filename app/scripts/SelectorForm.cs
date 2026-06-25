using System;
using System.Drawing;
using System.Windows.Forms;

public class SelectorForm : Form {
    private Point startPoint;
    private Point endPoint;
    private bool isDragging;
    private string result;
    private Timer timer;
    private Screen primaryScreen;

    public SelectorForm(int timeoutSeconds) {
        primaryScreen = Screen.PrimaryScreen;
        this.StartPosition = FormStartPosition.Manual;
        this.Location = primaryScreen.Bounds.Location;
        this.Size = primaryScreen.Bounds.Size;
        this.FormBorderStyle = FormBorderStyle.None;
        this.TopMost = true;
        this.KeyPreview = true;
        // 完全不透明黑色遮罩
        this.BackColor = Color.Black;
        this.Opacity = 0.6;
        this.ShowInTaskbar = false;
        this.Cursor = Cursors.Cross;

        timer = new Timer();
        timer.Interval = timeoutSeconds * 1000;
        timer.Tick += (s, e) => {
            if (result == null) {
                result = "\"TIMEOUT\"";
                this.Invoke(new Action(this.Close));
            }
        };
        timer.Start();
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
        if (isDragging) {
            endPoint = e.Location;
            this.Invalidate(); // 触发重绘
        }
        base.OnMouseMove(e);
    }

    protected override void OnMouseUp(MouseEventArgs e) {
        if (isDragging && e.Button == MouseButtons.Left) {
            isDragging = false;
            int x = Math.Min(startPoint.X, endPoint.X);
            int y = Math.Min(startPoint.Y, endPoint.Y);
            int w = Math.Abs(endPoint.X - startPoint.X);
            int h = Math.Abs(endPoint.Y - startPoint.Y);
            if (w > 10 && h > 10) {
                result = "{\"left\":" + x + ",\"top\":" + y + ",\"width\":" + w + ",\"height\":" + h + "}";
            } else {
                result = "{\"error\":\"selection_too_small\"}";
            }
            this.Invoke(new Action(this.Close));
        }
        base.OnMouseUp(e);
    }

    protected override void OnKeyDown(KeyEventArgs e) {
        if (e.KeyCode == Keys.Escape) {
            result = "\"CANCELLED\"";
            this.Invoke(new Action(this.Close));
        }
        base.OnKeyDown(e);
    }

    protected override void OnPaint(PaintEventArgs e) {
        base.OnPaint(e);
        if (isDragging && startPoint != Point.Empty) {
            int x = Math.Min(startPoint.X, endPoint.X);
            int y = Math.Min(startPoint.Y, endPoint.Y);
            int w = Math.Abs(endPoint.X - startPoint.X);
            int h = Math.Abs(endPoint.Y - startPoint.Y);

            // 半透明蓝色填充
            using (var brush = new SolidBrush(Color.FromArgb(80, 0, 128, 255))) {
                e.Graphics.FillRectangle(brush, x, y, w, h);
            }
            // 醒目白色边框
            using (var pen = new Pen(Color.White, 2)) {
                e.Graphics.DrawRectangle(pen, x, y, w, h);
            }
        }
    }

    public static string Run(int timeoutSeconds) {
        var form = new SelectorForm(timeoutSeconds);
        Application.Run(form);
        return form.result ?? "\"CANCELLED\"";
    }

    [STAThread]
    public static void Main(string[] args) {
        try {
            int timeout = 60;
            if (args.Length > 0 && int.TryParse(args[0], out timeout)) { }
            string result = Run(timeout);
            string tmpFile = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "region_select_result_" + Guid.NewGuid().ToString("N") + ".txt");
            System.IO.File.WriteAllText(tmpFile, result);
            Console.WriteLine(tmpFile);
        } catch (Exception ex) {
            string tmpFile = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "region_select_error_" + Guid.NewGuid().ToString("N") + ".txt");
            System.IO.File.WriteAllText(tmpFile, "ERROR:" + ex.Message);
            Console.WriteLine(tmpFile);
        }
    }
}
