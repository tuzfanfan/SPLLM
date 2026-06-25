Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class User32 {
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
}
"@

$hWnd = [User32]::GetForegroundWindow()
Write-Output "HWND: $hWnd"

$root = [System.Windows.Automation.AutomationElement]::FromHandle($hWnd)
if ($null -eq $root) { Write-Output "Root is null"; exit }
Write-Output "Name: $($root.Current.Name)"
Write-Output "Type: $($root.Current.ControlType.ProgrammaticName)"

$children = $root.FindAll([System.Windows.Automation.TreeScope]::Children, [System.Windows.Automation.Condition]::TrueCondition)
Write-Output "Children: $($children.Count)"
foreach ($c in $children) {
    Write-Output "  Child: '$($c.Current.Name)' [$($c.Current.ControlType.ProgrammaticName)]"
}
