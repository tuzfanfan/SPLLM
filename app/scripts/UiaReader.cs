using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Runtime.InteropServices;
using System.Windows.Automation;

public class Program {
    [DllImport("user32.dll")]
    static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")]
    static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    public static void Main(string[] args) {
        int left = 0, top = 0, width = 0, height = 0;
        string outputFile = null;
        if (args.Length >= 4) {
            int.TryParse(args[0], out left);
            int.TryParse(args[1], out top);
            int.TryParse(args[2], out width);
            int.TryParse(args[3], out height);
        }
        if (args.Length >= 5) {
            outputFile = args[4];
        }
        string result = ReadRegion(left, top, width, height);
        if (outputFile != null) {
            File.WriteAllText(outputFile, result);
        } else {
            Console.WriteLine(result);
        }
    }

    public static string ReadRegion(int selLeft, int selTop, int selWidth, int selHeight) {
        IntPtr hWnd = GetForegroundWindow();
        if (hWnd == IntPtr.Zero) return "EMPTY";

        StringBuilder sb = new StringBuilder(256);
        GetWindowText(hWnd, sb, sb.Capacity);

        AutomationElement root;
        try {
            root = AutomationElement.FromHandle(hWnd);
        } catch {
            return "EMPTY";
        }
        if (root == null) return "EMPTY";

        var matched = new List<TextItem>();
        var queue = new Queue<AutomationElement>();
        queue.Enqueue(root);
        var visited = new HashSet<string>();
        int iterations = 0;
        const int MaxIter = 5000;

        double rSelLeft = selLeft, rSelTop = selTop, rSelWidth = selWidth, rSelHeight = selHeight;

        while (queue.Count > 0 && iterations++ < MaxIter) {
            var elem = queue.Dequeue();
            string id = elem.Current.AutomationId;
            if (visited.Contains(id)) continue;
            visited.Add(id);

            // Get bounding rect as object, extract doubles via reflection
            double elLeft = 0, elTop = 0, elWidth = 0, elHeight = 0;
            try {
                var boundsObj = elem.GetCurrentPropertyValue(AutomationElementIdentifiers.BoundingRectangleProperty);
                if (boundsObj != null) {
                    var boundsType = boundsObj.GetType();
                    elLeft = (double)boundsType.GetProperty("Left").GetValue(boundsObj, null);
                    elTop = (double)boundsType.GetProperty("Top").GetValue(boundsObj, null);
                    elWidth = (double)boundsType.GetProperty("Width").GetValue(boundsObj, null);
                    elHeight = (double)boundsType.GetProperty("Height").GetValue(boundsObj, null);
                }
            } catch {
                continue;
            }

            if (elWidth <= 0 || elHeight <= 0) continue;

            // Check intersection
            bool intersects = rSelLeft < elLeft + elWidth && rSelLeft + rSelWidth > elLeft &&
                              rSelTop < elTop + elHeight && rSelTop + rSelHeight > elTop;
            if (!intersects) continue;

            // Check offscreen
            bool isOffscreen;
            try {
                isOffscreen = (bool)elem.GetCurrentPropertyValue(AutomationElementIdentifiers.IsOffscreenProperty, true);
            } catch {
                isOffscreen = false;
            }
            if (isOffscreen) continue;

            // Get text
            string text = null;

            // Try Name
            try {
                var name = elem.GetCurrentPropertyValue(AutomationElementIdentifiers.NameProperty, true);
                if (name != null && !string.IsNullOrWhiteSpace(name.ToString())) {
                    text = name.ToString().Trim();
                }
            } catch { }

            // Try Value pattern
            if (string.IsNullOrEmpty(text)) {
                try {
                    object vp;
                    if (elem.TryGetCurrentPattern(ValuePattern.Pattern, out vp)) {
                        var val = ((ValuePattern)vp).Current.Value;
                        if (!string.IsNullOrWhiteSpace(val)) text = val.Trim();
                    }
                } catch { }
            }

            // Try Text pattern
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

            // Fallback: check control type
            if (string.IsNullOrEmpty(text)) {
                try {
                    string ct = elem.Current.ControlType.ProgrammaticName;
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

            // Add children
            try {
                var children = elem.FindAll(TreeScope.Children, Condition.TrueCondition);
                foreach (AutomationElement child in children) {
                    queue.Enqueue(child);
                }
            } catch { }
        }

        if (matched.Count == 0) return "EMPTY";

        // Sort by visual order: top-to-bottom, then left-to-right
        matched.Sort((a, b) => {
            int cmp = a.Top.CompareTo(b.Top);
            if (cmp != 0) return cmp;
            return a.Left.CompareTo(b.Left);
        });

        var result = new StringBuilder();
        foreach (var item in matched) {
            if (result.Length > 0) result.Append("\n");
            result.Append(item.Text);
        }
        return result.ToString();
    }

    private struct TextItem {
        public string Text;
        public double Top, Left;
    }
}
