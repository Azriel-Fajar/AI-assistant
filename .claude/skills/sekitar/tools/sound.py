"""Synthesise the bed and effects, mix them under the voice, master to the measured reference numbers.

  python sound.py <project>/src/pieces/<slug>

Reads timing.json and sfx.json ([{"line":"hook1","word":"tik","n":1,"type":"drip","gain":-6}] or {"t":1.2,...}).
script.json may set "bed": false for a film with no music under the voice, only effects.
All sound is generated here, so there is nothing to license.
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np

SR = 44100
# Azriel (3 Nov 2026): the bed was too loud and the same in every film. It now sits further under the voice,
# changes key, tempo and chords per film (seeded by the slug), changes its layers per section of the script,
# and ducks while the narrator speaks.
BED_BELOW_VOICE = 13  # dB under the voice
RNG = np.random.default_rng(7)

piece = Path(sys.argv[1])
slug = piece.name
project = piece.parent.parent.parent
out = project / "public" / "pieces" / slug
timing = json.loads((piece / "timing.json").read_text(encoding="utf-8"))
dur = timing["duration"]
sfx_file = piece / "sfx.json"
cues = json.loads(sfx_file.read_text(encoding="utf-8")) if sfx_file.exists() else []
script_file = piece / "script.json"
use_bed = json.loads(script_file.read_text(encoding="utf-8")).get("bed", True) if script_file.exists() else True
FILM = np.random.default_rng(sum(slug.encode()) * 7919 + len(slug))
PULSE = float(FILM.choice([1.0, 1.12, 1.24, 1.36]))
n = int(dur * SR)
tt = np.arange(n) / SR


def rms(x):
    return np.sqrt(np.mean(x ** 2) + 1e-12)


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    s = 0.0
    for i, v in enumerate(x):
        s = (1 - a) * v + a * s
        y[i] = s
    return y


def env(d, attack=0.002, decay=None):
    m = int(d * SR)
    e = np.ones(m)
    k = int(attack * SR)
    if k:
        e[:k] = np.linspace(0, 1, k)
    if decay:
        e *= np.exp(-np.arange(m) / (decay * SR))
    return e


def smooth(x, sec):
    # Moving average by cumulative sum: np.convolve with a long window takes minutes on a 60 s film.
    k = max(1, int(sec * SR))
    c = np.cumsum(np.concatenate([np.zeros(k // 2 + 1), x, np.full(k - k // 2, x[-1])]))
    return (c[k:k + len(x)] - c[:len(x)]) / k


def sections():
    # A new section at a line start once 7 s have passed, so the music changes where the story does.
    cuts = [0.0]
    for l in timing["lines"]:
        if l["s"] - cuts[-1] >= 7:
            cuts.append(l["s"])
    return cuts + [dur]


# Layer mixes a section can take. "" is a near-silent breath; never first, never twice in a row.
MIXES = ["pad", "pad pluck", "pad kick pluck", "kick hat pluck", "pad hat", "pluck hat", ""]


def bed():
    # Midrange pad and pluck because a phone speaker plays almost nothing below 200 Hz.
    root = float(FILM.choice([49.0, 55.0, 58.27, 61.74, 65.41]))
    mode = [[0, 3, 7, 10], [0, 4, 7, 11], [0, 5, 7, 10], [0, 3, 7, 14]][FILM.integers(4)]
    prog = [[0, 5, 7, 3], [0, 8, 3, 10], [0, 7, 5, 0], [0, 3, 8, 7]][FILM.integers(4)]
    cuts = sections()
    picks = []
    for k in range(len(cuts) - 1):
        opts = [m for m in MIXES if (picks and m != picks[-1]) or (not picks and m)]
        if "" in picks or k == len(cuts) - 2:
            opts = [m for m in opts if m]
        picks.append(opts[FILM.integers(len(opts))])
    layers = {k: np.zeros(n) for k in ["pad", "pluck", "kick", "hat"]}
    gains = {k: np.zeros(n) for k in layers}
    pl = int(0.4 * SR)
    tp = np.arange(pl) / SR
    d = int(0.5 * SR)
    tk = np.arange(d) / SR
    kick = np.sin(2 * np.pi * (46 * tk + 18 * (1 - np.exp(-tk * 28)) / 28)) * np.exp(-tk * 8)
    hat = lowpass(RNG.normal(size=n), 4200) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / PULSE * 2) ** 8)
    for k, (s0, s1) in enumerate(zip(cuts[:-1], cuts[1:])):
        i0, i1 = int(s0 * SR), int(s1 * SR)
        r = root * 2 ** (prog[k % 4] / 12)
        seg = tt[i0:i1]
        for j, iv in enumerate(mode):
            for o, g in [(1, 0.5), (2, 0.45), (4, 0.18)]:
                f = r * 2 ** (iv / 12) * o
                layers["pad"][i0:i1] += g * np.sin(2 * np.pi * f * seg + j) * (0.8 + 0.2 * np.sin(2 * np.pi * seg / (7.4 + j)))
        # The pluck walks the chord tones, one per pulse.
        for q, b in enumerate(np.arange(s0, s1, PULSE)):
            i = int(b * SR)
            f = r * 4 * 2 ** (mode[q % len(mode)] / 12)
            m = min(pl, n - i)
            layers["pluck"][i:i + m] += (np.sin(2 * np.pi * f * tp[:m]) + 0.4 * np.sin(4 * np.pi * f * tp[:m])) * np.exp(-tp[:m] * 14)
            m = min(d, n - i)
            layers["kick"][i:i + m] += kick[:m]
        for name in layers:
            gains[name][i0:i1] = 1.0 if name in picks[k].split() else 0.0
    gains["pad"] = np.maximum(gains["pad"], 0.05)  # the breath keeps a whisper of pad
    level = {"pad": 0.35, "pluck": 0.5, "kick": 1.0, "hat": 0.03}
    print("bed:", f"pulse {PULSE}s", " | ".join(f"{c:.0f}s {p or 'breath'}" for c, p in zip(cuts, picks)))
    return sum(level[k] * layers[k] * smooth(gains[k], 0.6) for k in layers)


def sweep(f0, f1, d, g=1.0, decay=None):
    t = np.arange(int(d * SR)) / SR
    ph = 2 * np.pi * (f0 * t + (f1 - f0) * t * t / (2 * d))
    return g * np.sin(ph) * env(d, decay=decay or d / 3)


def noise(d, fc, decay):
    x = lowpass(RNG.normal(size=int(d * SR)), fc)
    return x / (np.abs(x).max() + 1e-9) * env(d, decay=decay)


def make(kind):
    if kind == "drip":  # rising blip plus a small low body
        return sweep(620, 1350, 0.09, 0.9, 0.05) + 0.35 * sweep(180, 240, 0.09)
    if kind == "pop":
        return sweep(260, 880, 0.08, 0.9, 0.035)
    if kind == "tick":
        return noise(0.03, 7000, 0.006)
    if kind == "thud":
        return sweep(120, 48, 0.28, 1.0, 0.09) + 0.2 * noise(0.28, 900, 0.03)
    if kind == "whoosh":
        d = 0.5
        x = noise(d, 2600, 1.0)
        return x * np.sin(np.linspace(0, np.pi, len(x))) ** 2 * 0.8
    if kind == "ding":
        return 0.5 * sweep(1320, 1320, 0.7, 1.0, 0.2) + 0.25 * sweep(1980, 1980, 0.7, 1.0, 0.14)
    if kind == "crack":
        return noise(0.16, 6500, 0.02) + 0.5 * sweep(300, 90, 0.16, 1.0, 0.04)
    if kind == "squeak":
        return sweep(900, 1500, 0.25, 0.4, 0.12)
    raise SystemExit(f"Unknown sfx type: {kind}")


def time_of(c):
    if "t" in c:
        return float(c["t"])
    line = next(l for l in timing["lines"] if l["id"] == c["line"])
    if "word" in c:
        hits = [w for w in line["words"] if w["w"] == c["word"].lower()]
        return hits[c.get("n", 1) - 1]["s"] + c.get("offset", 0)
    return line["s"] + c.get("offset", 0)


# The follow end card (engine/src/kit/endcard.tsx: TAP_AT, DONE_AT) gets its tap and ding without a cue.
cta = next((l for l in timing["lines"] if l["id"] == "cta"), None)
if cta:
    cues = cues + [{"t": cta["s"] + 0.95 - 0.02, "type": "pop", "gain": -4}, {"t": cta["s"] + 1.05, "type": "ding", "gain": -7}]

fx = np.zeros(n)
for c in cues:
    s = make(c["type"]) * 10 ** (c.get("gain", -6) / 20)
    i = int(time_of(c) * SR)
    m = min(len(s), n - i)
    if m > 0:
        fx[i:i + m] += s[:m]

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(out / "voice.wav"), "-af", "highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=8:release=120", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.float32).copy()
voice = np.zeros(n)
m = min(n, len(v))
voice[:m] = v[:m]
voice /= rms(voice[np.abs(voice) > 0.01]) / 0.2

if use_bed:
    b = bed()
    b *= (0.2 * 10 ** (-BED_BELOW_VOICE / 20)) / rms(b)
    # Duck under the narrator, swell a little in the gaps between lines.
    talk = smooth((np.abs(voice) > 0.02).astype(float), 0.25)
    b *= 1.3 - 0.6 * np.clip(talk * 3, 0, 1)
else:
    b = np.zeros(n)
fade = np.minimum(1, np.minimum(tt / 0.04, (dur - tt) / 0.5))
mix = (voice + 0.5 * b + 0.62 * fx) * fade

tmp = out / "_mix_raw.wav"
pcm = (np.clip(mix / max(1.0, np.abs(mix).max()), -1, 1) * 32767).astype(np.int16)
with wave.open(str(tmp), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

# Heavy, broadcast-steady dynamics: the reference sits at LRA 1.6-2.0.
chain = "acompressor=threshold=-22dB:ratio=3.5:attack=6:release=90:makeup=3,loudnorm=I=-14:TP=-1.3:LRA=3:linear=false"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", chain, "-ar", str(SR), "-ac", "2", str(out / "mix.wav")], check=True)
tmp.unlink()
print("mix.wav:", out / "mix.wav")
