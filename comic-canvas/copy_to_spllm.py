import shutil
import os

src_dir = r"e:\apps\comic-canvas"
dst_dir = r"e:\apps\SPLLM\comic-canvas"

os.makedirs(dst_dir, exist_ok=True)

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

print("Done!")
