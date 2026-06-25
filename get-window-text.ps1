Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")] public static extern bool GetWindowTextLength(IntPtr hWnd);
}
"@
$hWnd = [Win32]::GetForegroundWindow()
$len = [Win32]::GetWindowTextLength($hWnd)
if ($len -eq 0) {
    Write-Output "EMPTY"
    exit
}
$sb = New-Object System.Text.StringBuilder($len + 1)
[Win32]::GetWindowText($hWnd, $sb, $sb.Capacity) | Out-Null
Write-Output $sb.ToString()
