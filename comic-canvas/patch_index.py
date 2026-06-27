import re

index_path = r"e:\apps\SPLLM\index.html"

with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

old = '''        <div class="hero-actions">
          <a class="button primary" href="#system">查看系统如何运转</a>
          <a class="button" href="https://github.com/tuzfanfan/SPLLM">浏览 GitHub 仓库</a>
        </div>'''

new = '''        <div class="hero-actions">
          <a class="button primary" href="#system">查看系统如何运转</a>
          <a class="button" href="comic-canvas/index.html">🎬 漫剧画布</a>
          <a class="button" href="https://github.com/tuzfanfan/SPLLM">浏览 GitHub 仓库</a>
        </div>'''

if old in content:
    content = content.replace(old, new)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Success: Added comic-canvas button to hero-actions")
else:
    print("Error: Could not find the target pattern")
    # 尝试查找看看前后文
    idx = content.find('hero-actions')
    if idx > 0:
        print(f"Found 'hero-actions' at position {idx}")
        print(content[idx:idx+300])
