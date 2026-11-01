"""Copy the engine from the skill into the project and start a piece. Safe to re-run: pieces are never touched.

  python setup.py [--project DIR] [--piece slug]
"""
import argparse, json, os, shutil, subprocess
from pathlib import Path

ENGINE = Path(__file__).resolve().parent.parent / "engine"
DEFAULT = Path(__file__).resolve().parents[4] / "shorts"  # <JARVIS>/shorts, same on every machine

ap = argparse.ArgumentParser()
ap.add_argument("--project", default=str(DEFAULT))
ap.add_argument("--piece")
a = ap.parse_args()
p = Path(a.project)
p.mkdir(parents=True, exist_ok=True)

for name in ("package.json", "tsconfig.json", "remotion.config.ts"):
    shutil.copy2(ENGINE / name, p / name)
(p / "src").mkdir(exist_ok=True)
for name in ("index.ts", "Root.tsx"):
    shutil.copy2(ENGINE / "src" / name, p / "src" / name)
shutil.rmtree(p / "src" / "kit", ignore_errors=True)
shutil.copytree(ENGINE / "src" / "kit", p / "src" / "kit")
(p / "src" / "pieces").mkdir(exist_ok=True)

npm = shutil.which("npm") or "npm"
want = json.loads((ENGINE / "package.json").read_text(encoding="utf-8"))["dependencies"]
missing = [k for k in want if not (p / "node_modules" / k).exists()]
if missing:
    print("npm install:", ", ".join(missing), flush=True)
    subprocess.run([npm, "install", "--no-audit", "--no-fund", "--loglevel=error"], cwd=p, check=True, shell=os.name == "nt")

# The follow end card's profile picture.
avatar = p / "brand" / "profil-800.png"
if avatar.exists():
    (p / "public" / "brand").mkdir(parents=True, exist_ok=True)
    shutil.copy2(avatar, p / "public" / "brand" / "profil.png")
else:
    print("warning: brand/profil-800.png missing, the follow end card will have no picture", flush=True)

if a.piece:
    d = p / "src" / "pieces" / a.piece
    d.mkdir(exist_ok=True)
    (p / "public" / "pieces" / a.piece).mkdir(parents=True, exist_ok=True)
    (p / "out" / a.piece).mkdir(parents=True, exist_ok=True)  # stills.mjs fails without it
    print("piece folder:", d)
print("ok:", p)
