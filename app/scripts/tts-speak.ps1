# tts-speak.ps1
# 使用 Windows SAPI 朗读文本
# 参数: -Text "要朗读的文本"
# 支持中英混合

param(
    [string]$Text = ""
)

Add-Type -AssemblyName System.Speech

$sp = New-Object System.Speech.Synthesis.SpeechSynthesizer

# 获取已安装的语音
$voices = $sp.GetInstalledVoices()

# 选择中文语音
$zhVoice = $null
$enVoice = $null
foreach ($v in $voices) {
    $name = $v.VoiceInfo.Name.ToLower()
    if ($name -like "*huihui*" -or $name -like "*xiaoxiao*" -or $name -like "*yunxi*") {
        $zhVoice = $v
    }
    if ($name -like "*zira*" -or $name -like "*aria*" -or $name -like "*en-us*") {
        $enVoice = $v
    }
}

# 检测文本是否包含中文
$hasChinese = $Text -match '[一-鿿]'

# 设置语音
if ($hasChinese -and $zhVoice) {
    $sp.SelectVoice($zhVoice.VoiceInfo.Name)
} elseif ($enVoice) {
    $sp.SelectVoice($enVoice.VoiceInfo.Name)
}

# 设置语速和音量
$sp.Rate = 0
$sp.Volume = 100

# 朗读
$sp.Speak($Text)

# 清理
$sp.Dispose()
