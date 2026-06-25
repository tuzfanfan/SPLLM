# region-select.ps1
# 全屏透明覆盖层，用于用户框选屏幕区域
# 输出: JSON {"left":X,"top":Y,"width":W,"height":H} 或 "CANCELLED"

param([int]$TimeoutSeconds = 60)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$exeFile = Join-Path $scriptDir "region-selector.exe"
$csFile = Join-Path $scriptDir "SelectorForm.cs"

# 如果 exe 不存在，先编译
if (-not (Test-Path $exeFile)) {
    $csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
    if (-not (Test-Path $csc)) {
        $csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
    }
    $ref1 = "/reference:System.Windows.Forms.dll"
    $ref2 = "/reference:System.Drawing.dll"
    $outArg = "/out:$exeFile"
    $cscArgs = @('/target:exe', $outArg, $ref1, $ref2, $csFile)
    & $csc $cscArgs 2>&1 | Out-Null
    if (-not (Test-Path $exeFile)) {
        Write-Output '"COMPILATION_FAILED"'
        exit
    }
}

# 运行 exe 获取结果
$tmpFile = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "region_select_" + [guid]::NewGuid().ToString('N') + ".txt")

$proc = Start-Process -FilePath $exeFile -ArgumentList $TimeoutSeconds -NoNewWindow -Wait -PassThru -ErrorAction Stop

if ($proc.ExitCode -ne 0) {
    Write-Output '"RUN_FAILED"'
    exit
}

# 读取结果
if (Test-Path $tmpFile) {
    $result = Get-Content $tmpFile -ErrorAction SilentlyContinue
    Remove-Item $tmpFile -Force -ErrorAction SilentlyContinue
    if ($result) {
        Write-Output $result
    } else {
        Write-Output '"NO_RESULT"'
    }
} else {
    Write-Output '"NO_RESULT"'
}
