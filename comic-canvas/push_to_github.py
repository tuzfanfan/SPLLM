import shutil
import os
import subprocess

src_dir = r"e:\apps\comic-canvas"
spllm_dir = r"e:\apps\SPLLM"
dst_dir = os.path.join(spllm_dir, "comic-canvas")

os.chdir(spllm_dir)

# 1. Abort rebase
result = subprocess.run(["git", "rebase", "--abort"], capture_output=True, text=True)
print("git rebase --abort:")
print(result.stdout)
if result.stderr:
    print(result.stderr)

# 2. 同步最新文件
files_to_copy = [
    "index.html",
    "index-entry.html",
    "index.html.artifact.json",
    "index-entry.html.artifact.json",
    "sphere3d.js",
]

for f in files_to_copy:
    src = os.path.join(src_dir, f)
    dst = os.path.join(dst_dir, f)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied: {f}")

pics_src = os.path.join(src_dir, "pics")
pics_dst = os.path.join(dst_dir, "pics")
if os.path.exists(pics_src):
    if os.path.exists(pics_dst):
        shutil.rmtree(pics_dst)
    shutil.copytree(pics_src, pics_dst)
    print("Copied: pics/")

# 3. 提交并推送
result = subprocess.run(["git", "add", "-A", "comic-canvas/"], capture_output=True, text=True)
print("git add:")
print(result.stdout)
if result.stderr:
    print(result.stderr)

result = subprocess.run(["git", "commit", "-m", "feat(comic-canvas): 优化3D球体节点和Alt键视角旋转交互"], capture_output=True, text=True)
print("git commit:")
print(result.stdout)
if result.stderr:
    print(result.stderr)

result = subprocess.run(["git", "pull", "--rebase", "-X", "theirs"], capture_output=True, text=True)
print("git pull --rebase -X theirs:")
print(result.stdout)
if result.stderr:
    print(result.stderr)

result = subprocess.run(["git", "push"], capture_output=True, text=True)
print("git push:")
print(result.stdout)
if result.stderr:
    print(result.stderr)

print("Done!")
