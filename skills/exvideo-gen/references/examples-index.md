# Example Archive Index

Use this file as the top-level index for reusable prompt archives in `exvideo-gen`.

## Structure Rule

Keep the reference layer split into:

- module files: reusable workflow logic and generalized templates
- example archive files: preserved originals, role-specific prompts, and raw working cases

When adding a new case:

1. Decide which workflow family it belongs to.
2. Add one entry to the relevant archive file.
3. If no archive exists yet, create a new `examples-*.md` file.
4. Add that archive file to the table below.
5. Only move generalized lessons back into the module file.

## Current Archive Files

| Archive File | Scope | Use For | Seed Status |
|---|---|---|---|
| `references/examples-identity-boards.md` | 瑙掕壊韬唤鏉裤€佺櫧搴曡瀹氭澘銆佽壓鏈功寮忚鑹茬爺绌堕〉 | 淇濆瓨鍘熷瑙掕壊鏉?prompt銆佽鑹查攣瀹氭渚嬨€佸竷灞€鍙傝€?| active |
| `references/examples-game-demos.md` | 娓告垙 Demo銆乁I 椤甸潰銆丠UD銆佹垬鏂楀叧閿抚銆佺帺娉曞睍绀?| 淇濆瓨鍘熷娓告垙 Demo prompt銆佺晫闈㈤〉妗堜緥銆佹垬鏂楃敾闈㈡渚?| active |
| `references/examples-cinematic-shot-prompts.md` | 鐢靛奖闀滃ご鍏紡銆佸弻璇暅澶存湳璇€侀暅澶存彁绀鸿瘝瀹炴垬 | 淇濆瓨鍘熷瀛︿範妯℃澘銆侀暅澶村叕寮忎笌缂栬瘧妗堜緥 | active |
| `references/examples-scene-consistency-control.md` | 鍦烘櫙涓€鑷存€с€侀攣绌洪棿銆佸瑙掑害鍚屽満鏅€佽ˉ闀滃ご銆佸叏鏅笌鐜粫鍙栨櫙 | 淇濆瓨鏂规硶鏂囩珷銆佹帶鍦烘渚嬨€佽繛缁暅澶存媶鍒嗚娉曘€佽ˉ闀滃ご涓庢敼鏈轰綅宸ヤ綔鏍蜂緥 | active |
| `references/examples-sports-action-prompts.md` | 浣撹偛鍔ㄤ綔銆佺垎鍙戣繍鍔ㄣ€佹參鍔ㄤ綔鍒囨崲銆佷竴闀滃埌搴曡窡鎷嶃€侀珮鍐插嚮杩愬姩闀滃ご | 淇濆瓨楂樺己搴﹀姩浣滄彁绀鸿瘝銆佸姩浣滅浉浣嶆媶鍒嗐€侀€熷害鐘舵€佽璁°€佸啿鍑荤粏鑺備笌闊虫晥鍐欐硶 | active |
| `references/examples-asset-pack-development.md` | 瑙掕壊涓庡満鏅祫浜у寘銆佹湇瑁呭彉浣撱€侀亾鍏烽攣瀹氥€佽壊鍗＄郴缁? | 淇濆瓨璧勪骇鍖呮瀯寤哄伐浣滄祦銆佽瑙夌害鏉熷拰鍙鐢ㄨ祫浜у眰绾? | active |
| `references/examples-dialogue-coverage.md` | 瀵硅瘽鎴忋€佹鍙嶆墦銆佽繃鑲┿€佸崟浜恒€佸叧绯诲瀷鍙嶆墦 | 淇濆瓨瀵硅瘽瑕嗙洊璇硶銆佹潈鍔涘叧绯绘瀯鍥俱€佸唴蹇冧笌鍏崇郴瀵艰 | active |
| `references/examples-social-short-drama.md` | 濂抽鐭墽銆佸己閽╁瓙銆佹儏缁洰鏍囥€佷粯璐圭偣 | 淇濆瓨鐭墽鑺傛媿鍚嶇О銆佹儏缁帹杩涘拰鍙浛鎹㈠墽鎯呭鏋? | active |
| `references/examples-lighting-setups.md` | 涓夌偣甯冨厜銆佷鸡鍕冩湕鍏夈€佽疆寤撳厜銆佽緟鍔╁厜姣? | 淇濆瓨鍙墽琛岀殑鎵撳厜閫昏緫銆佷汉鐗╂皵璐ㄦ槧灏勫拰鐜板疄鍏夋簮浼瑙勫垯 | active |

## Routing Guide

- If the case is about face lock, silhouette, costume readability, expressions, or white-background layouts, store it in `examples-identity-boards.md`.
- If the case is about menus, loadouts, HUD, gameplay framing, boss fights, or combat key art, store it in `examples-game-demos.md`.
- If the case is about shot size, composition, angle, movement, lighting, lens, focus, or cinematic prompt formulas, store it in `examples-cinematic-shot-prompts.md`.
- If the case is about scene locking, angle extraction, panorama or orbit background capture, re-angle repair shots, or continuity-first multi-shot generation, store it in `examples-scene-consistency-control.md`.
- If the case is about sports action, force transfer, airborne motion, impact deformation, one-take follow shots, or explicit slow-motion phase design, store it in `examples-sports-action-prompts.md`.
- If the case is about prebuilding reusable character, costume, prop, scene, or palette assets before shot generation, store it in `examples-asset-pack-development.md`.
- If the case is about two-person dialogue, reverse-shot logic, over-shoulder choices, power framing, or emotional coverage design, store it in `examples-dialogue-coverage.md`.
- If the case is about short drama retention beats, first-five-second hooks, episode-end cliffhangers, or emotional progression by beat name, store it in `examples-social-short-drama.md`.
- If the case is mainly about lighting setups, light ratios, key/fill/rim behavior, or practical-light motivation, store it in `examples-lighting-setups.md`.
- If a case spans several families, store the raw prompt in the primary archive and cross-reference the related archive in a note.

## Naming Pattern

Use this section pattern inside each archive:

```text
## Example NN: Title
### Status
### Original Prompt
### What To Preserve
### What To Replace Before Reuse
### Reuse Note
```

Keep the original wording when archival fidelity matters. Add concise notes around it rather than rewriting the source.

## Core Production Templates

| Template | Purpose |
|---|---|
| `references/script-writing-stage.md` | 鑴氭湰鏂囨鐢熸垚銆佹晠浜嬪唴鏍搁噸鏋勩€佺粨鏋勬敼鍐欍€佽剼鏈鎵逛笌鍒嗛暅浜ゆ帴 |
| `references/cinematic-shot-language.md` | 鑴氭湰銆佽瑙夊湥缁忋€佸垎闀溿€侀〉闈笌鎻愮ず璇嶇紪璇戝叡鐢ㄧ殑鏍囧噯闀滃ご璇█ |
