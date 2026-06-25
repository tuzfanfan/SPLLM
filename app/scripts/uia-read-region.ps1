# uia-read-region.ps1
# 使用 UI Automation 读取指定窗口中指定矩形区域内的文本
# 参数: -Left -Top -Width -Height
# 输出: 文本或 "EMPTY"

param(
    [int]$Left = 0,
    [int]$Top = 0,
    [int]$Width = 0,
    [int]$Height = 0
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$exeFile = Join-Path $scriptDir "uia-reader.exe"

if (-not (Test-Path $exeFile)) {
    Write-Output "EMPTY"
    exit
}

# 调用 C# exe 获取结果
$tmpFile = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "uia_result_$([guid]::NewGuid().ToString('N')).txt")

try {
    $argList = "$Left $Top $Width $Height $tmpFile"
    & $exeFile $argList 2>$null | Out-Null
} catch {
    Write-Output "EMPTY"
    exit
}

if (Test-Path $tmpFile) {
    $result = Get-Content $tmpFile -ErrorAction SilentlyContinue
    Remove-Item $tmpFile -Force -ErrorAction SilentlyContinue
    if ($result) {
        Write-Output $result
    } else {
        Write-Output "EMPTY"
    }
} else {
    Write-Output "EMPTY"
}
