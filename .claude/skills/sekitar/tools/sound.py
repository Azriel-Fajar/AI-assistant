"""Synthesise the bed and effects, mix them under the voice, master to the measured reference numbers.

  python sound.py <project>/src/pieces/<slug>

Reads timing.json and sfx.json ([{"line":"hook1","word":"tik","n":1,"type":"drip","gain":-6}] or {"t":1.2,...}).
All sound is generated here, so there is nothing to license.
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np

SR = 44100
PULSE = 1.24  # the low pulse period found in 5 of 7 reference shorts
BED_BELOW_VOICE = 6.5  # dB; measured gap between voice and the floor under it
RNG = np.random.default_rng(7)

piece = Path(sys.argv[1])
slug = piece.name
project = piece.parent.parent.parent
out = project / "public" / "pieces" / slug
timing = json.loads((piece / "timing.json").read_text(encoding="utf-8"))
dur = timing["duration"]
sfx_file = piece / "sfx.json"
cues = json.loads(sfx_file.read_text(encoding="utf-8")) if sfx_file.exists() else []
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


def bed():
    # A pad with real midrange, because a phone speaker plays almost nothing below 200 Hz,
    # plus a soft kick on the measured pulse. Sub alone measured 12 dB under the reference's mids.
    p = np.zeros(n)
    for f, g in [(55, 0.45), (82.41, 0.25), (110, 0.6), (164.81, 0.55), (220, 0.6), (277.18, 0.3), (329.63, 0.38), (440, 0.3), (554.37, 0.14), (659.25, 0.16), (880, 0.07)]:
        p += g * np.sin(2 * np.pi * f * tt + RNG.random() * 6) * (0.8 + 0.2 * np.sin(2 * np.pi * tt / (7.44 + f / 40)))
    d = int(0.5 * SR)
    t = np.arange(d) / SR
    kick = np.sin(2 * np.pi * (46 * t + 18 * (1 - np.exp(-t * 28)) / 28)) * np.exp(-t * 8)
    # A muted pluck on every pulse gives the mids some movement too.
    pl = int(0.4 * SR)
    tp = np.arange(pl) / SR
    pluck = (np.sin(2 * np.pi * 440 * tp) + 0.5 * np.sin(2 * np.pi * 880 * tp)) * np.exp(-tp * 14)
    for b in np.arange(0, dur, PULSE):
        i = int(b * SR)
        m = min(d, n - i)
        p[i:i + m] += 1.1 * kick[:m]
        m = min(pl, n - i)
        p[i:i + m] += 0.45 * pluck[:m]
    hat = lowpass(RNG.normal(size=n), 4200) * 0.02 * (0.5 + 0.5 * np.sin(2 * np.pi * tt / PULSE * 2) ** 8)
    return p + hat


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

b = bed()
b *= (0.2 * 10 ** (-BED_BELOW_VOICE / 20)) / rms(b)
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
