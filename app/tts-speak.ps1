# tts-speak.ps1
# 使用 Windows SAPI 朗读文本
# 参数: -Text "要朗读的文本" [-Voice "voice-name"]
# 支持中英混合：中文用 Microsoft Huihui，英文用 Microsoft Zira

param(
    [string]$Text = "",
    [string]$Voice = ""
)

Add-Type -AssemblyName System.Speech

$sp = New-Object System.Speech.Synthesis.SpeechSynthesizer

# 选择语音
if ($Voice -and $Voice.Trim()) {
    $availableVoices = $sp.GetInstalledVoices()
    $selectedVoice = $availableVoices | Where-Object { $_.VoiceInfo.Name -like "*$Voice*" } | Select-Object -First 1
    if ($selectedVoice) {
        $sp.Voice = $selectedVoice.VoiceInfo
    }
} else {
    # 自动检测：中文用 Huihui，英文用 Zira
    $textLower = $Text.ToLower()
    $hasChinese = $Text -match '[一-鿿]'
    if ($hasChinese) {
        $zhVoice = $sp.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -like "*Huihui*" } | Select-Object -First 1
        if ($zhVoice) { $sp.Voice = $zhVoice.VoiceInfo }
    } else {
        $enVoice = $sp.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -like "*Zira*" } | Select-Object -First 1
        if ($enVoice) { $sp.Voice = $enVoice.VoiceInfo }
    }
}

$sp.Speak($Text)
$sp.Dispose()
