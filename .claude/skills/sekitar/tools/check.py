"""Measure a render against the reference numbers and write contact sheets to look at.

  python check.py <video.mp4> <project>/src/pieces/<slug>
"""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np

mp4 = Path(sys.argv[1])
piece = Path(sys.argv[2])
sheets = mp4.parent / "review"
sheets.mkdir(exist_ok=True)
VOWELS = "aiueoAIUEO"
fails = []


def row(name, val, ok, target):
    print(f"{'PASS' if ok else 'FAIL'}  {name:<22} {val:<14} target {target}")
    if not ok:
        fails.append(name)


def run(*a):
    return subprocess.run(a, capture_output=True, text=True, encoding="utf-8", errors="replace")


w, h, fps = run("ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "csv=p=0", str(mp4)).stdout.strip().split(",")[:3]
dur = float(run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)).stdout.strip())
row("size", f"{w}x{h}", (w, h) == ("1080", "1920"), "1080x1920")
row("fps", fps, fps == "30/1", "30")

r = run("ffmpeg", "-hide_banner", "-i", str(mp4), "-af", "ebur128=peak=true", "-f", "null", "-").stderr[-700:]
lufs = float(re.search(r"I:\s+(-?[0-9.]+) LUFS", r).group(1))
lra = float(re.search(r"LRA:\s+([0-9.]+) LU", r).group(1))
peak = float(re.search(r"Peak:\s+(-?[0-9.]+) dBFS", r).group(1))
row("loudness", f"{lufs} LUFS", -15 <= lufs <= -13, "-15..-13 (reference -14.1..-14.6)")
row("loudness range", f"{lra} LU", lra <= 4, "<=4 (reference 1.6-2.0)")
row("true peak", f"{peak} dBFS", peak <= -1, "<=-1 (reference -1.2..-1.5)")

timing = json.loads((piece / "timing.json").read_text(encoding="utf-8"))
# A render that failed to overwrite (the old file open in a player) leaves a stale video that passes everything else.
row("matches timing.json", f"{dur:.2f}s", abs(dur - timing["duration"]) < 0.2, f"{timing['duration']:.2f}s, else this is a stale file")
words = [x for l in timing["lines"] for x in l["words"]]
span = words[-1]["e"] - words[0]["s"]
syl = sum(sum(c in VOWELS for c in x["w"]) or 1 for x in words) / span
row("voice pace", f"{syl:.2f} syl/s", 4.9 <= syl <= 6.4, "4.9-6.4")
row("first word", f"{words[0]['s']:.2f}s", words[0]["s"] <= 0.3, "<=0.3s")
row("word count", str(len(words)), 95 <= len(words) <= 200, "95-200")

# Picture: must move from the first half second and never sit still for long.
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", "fps=10,scale=108:192", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, 192, 108).astype(np.int16)
diff = np.abs(fr[1:] - fr[:-1]).mean(axis=(1, 2))
row("moves by 0.5s", f"{diff[:5].max():.2f}", diff[:5].max() > 0.05, ">0.05 mean change")
still, best = 0, 0
for d in diff:
    still = still + 1 if d < 0.02 else 0
    best = max(best, still)
row("longest still", f"{best / 10:.1f}s", best / 10 <= 2.5, "<=2.5s")
# Flash check: luminance jumps of more than 10% of full range, at most 3 a second (WCAG 2.3.1 approximation).
lum = fr.mean(axis=(1, 2))
jumps = np.where(np.abs(np.diff(lum)) > 25.5)[0] / 10
flash = max((np.sum((jumps >= t) & (jumps < t + 1)) for t in jumps), default=0)
row("flashes per second", str(int(flash)), flash <= 3, "<=3")

step = 3
run("ffmpeg", "-y", "-v", "error", "-i", str(mp4), "-vf", f"fps=1/{step},scale=270:-1,tile=8x3", "-q:v", "3", str(sheets / "sheet_%02d.jpg"))
print(f"duration {dur:.1f}s; sheets every {step}s in {sheets}")
print("RESULT:", "all pass" if not fails else "FAILED: " + ", ".join(fails))
sys.exit(1 if fails else 0)
