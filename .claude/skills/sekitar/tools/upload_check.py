"""Measure out/<slug>/upload.md against each platform's limits.

  python upload_check.py out/<slug>/upload.md

Each of ## TikTok, ## Instagram and ## YouTube holds its text in ``` fences; YouTube has two, title then description.
"""
import re, sys
from pathlib import Path

text = Path(sys.argv[1]).read_text(encoding="utf-8")
fails = []


def row(name, val, ok, target):
    print(f"{'PASS' if ok else 'FAIL'}  {name:<26} {val:<8} target {target}")
    if not ok:
        fails.append(name)


def blocks(platform):
    m = re.search(rf"^## {platform}\b(.*?)(?=^## |\Z)", text, re.M | re.S)
    return re.findall(r"^```[^\n]*\n(.*?)^```", m.group(1), re.M | re.S) if m else []


def size(s):  # TikTok counts UTF-16 units, so an emoji is 2.
    return len(s.strip().encode("utf-16-le")) // 2


def tags(s):
    return re.findall(r"#\w+", s)


def body(name, s, limit, max_tags, first=None):
    row(f"{name} length", size(s), size(s) <= limit, f"<={limit}")
    n = len(tags(s))
    row(f"{name} hashtags", n, 1 <= n <= max_tags, f"1-{max_tags}")
    if first:
        line = s.strip().split("\n")[0]
        row(f"{name} first line", size(line), size(line) <= first, f"<={first}, the rest hides behind 'more'")
    generic = [t for t in tags(s) if t.lower() in ("#fyp", "#foryou", "#foryoupage", "#viral", "#xyzbca", "#shorts", "#reels")]
    row(f"{name} generic tags", len(generic), not generic, "0")


tk, ig, yt = blocks("TikTok"), blocks("Instagram"), blocks("YouTube")
row("blocks found", f"{len(tk)}/{len(ig)}/{len(yt)}", (len(tk), len(ig), len(yt)) == (1, 1, 2), "1/1/2")
if len(tk) == 1:
    body("TikTok", tk[0], 2200, 5)
if len(ig) == 1:
    body("Instagram", ig[0], 2200, 5, first=125)
if len(yt) == 2:
    title = yt[0].strip()
    row("YouTube title length", size(title), size(title) <= 100, "<=100")
    row("YouTube title one line", title.count("\n") + 1, "\n" not in title, "1")
    body("YouTube desc", yt[1], 5000, 5)
sys.exit(f"FAILED: {', '.join(fails)}" if fails else 0)
