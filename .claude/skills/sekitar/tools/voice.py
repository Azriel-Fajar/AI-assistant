"""Narrate script.json in one session, several takes, score them, keep the best, write timing.json.

  python voice.py <project>/src/pieces/<slug> [--engine gemini|elevenlabs|edge] [--takes 3] [--until 0.9]
  python voice.py <project>/src/pieces/<slug> --sample Charon,Sadaltager,Achird   (a short clip per voice, to choose)

gemini needs GEMINI_API_KEY in the environment (never in a file). elevenlabs needs ELEVENLABS_API_KEY and
"eleven_voice" (a voice id) in the script; --sample takes voice ids. edge is free and needs no key, but it
is Microsoft's unofficial read-aloud service: fine for a draft, not for a monetised upload.
"""
import argparse, asyncio, base64, difflib, json, os, re, subprocess, time, urllib.error, urllib.request, wave
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel

SR = 24000
VOWELS = "aiueoAIUEO"
PACE = (4.9, 6.4)  # syllables/s measured on 7 reference shorts
MAX_GAP, KEEP_GAP = 0.55, 0.40  # a silence longer than MAX_GAP is shortened to KEEP_GAP
SIGN_OFF, SIGN_PAUSE = "intipbaliknya", 0.6  # the sign-off always gets this much extra silence after it (Azriel, 1 Nov 2026)
HOP = 0.01  # seconds per loudness frame
FADE = 0.03  # crossfade at every cut, so a join can't click

for name in ("GEMINI_API_KEY", "ELEVENLABS_API_KEY"):
    if os.name == "nt" and not os.environ.get(name):
        # setx only reaches new processes, so a session opened before the key was set wouldn't see it.
        import winreg
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as k:
                os.environ[name] = winreg.QueryValueEx(k, name)[0]
        except OSError:
            pass

ap = argparse.ArgumentParser()
ap.add_argument("piece")
ap.add_argument("--engine", choices=["gemini", "elevenlabs", "edge"], default="gemini" if os.environ.get("GEMINI_API_KEY") else "edge")
ap.add_argument("--takes", type=int, default=3)
ap.add_argument("--until", type=float, help="stop at the first take whose match reaches this, to save API quota")
ap.add_argument("--sample")
ap.add_argument("--reuse", action="store_true", help="re-time the takes already on disk without generating new ones")
a = ap.parse_args()

piece = Path(a.piece)
slug = piece.name
project = piece.parent.parent.parent
out = project / "public" / "pieces" / slug
takes_dir = out / "takes"
takes_dir.mkdir(parents=True, exist_ok=True)
script = json.loads((piece / "script.json").read_text(encoding="utf-8"))
lines = script["lines"]
text = " ".join(l["say"] for l in lines)
style = script.get("style", "Pembawa cerita pria Indonesia, santai seperti ngobrol sama teman, jelas, agak cepat, tidak seperti iklan.")


def run(*args, **kw):
    return subprocess.run(args, capture_output=True, check=True, **kw)


def gemini_take(path, say=text, voice=None):
    body = {
        "model": script.get("gemini_model", "gemini-3.8-flash-tts"),
        "input": [{"type": "user_input", "content": [{"type": "text", "text": say, "annotations": [{"type": "speech_metadata", "style": style}]}]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": voice or script.get("gemini_voice", "Achird")}]},  # Azriel's pick, 1 Nov 2026 (was Sadaltager)
    }
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                data = json.load(r)
            break
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:600]
            if e.code in (429, 500, 503) and attempt < 3:
                wait = 30 * (attempt + 1)
                print(f"Gemini {e.code}, retrying in {wait}s", flush=True)
                time.sleep(wait)
                continue
            raise SystemExit(f"Gemini refused the request ({e.code}): {detail}")
    audio = [c for s in data["steps"] if s.get("type") == "model_output" for c in s.get("content", []) if c.get("type") == "audio"]
    src = path.with_suffix(".src.wav")
    src.write_bytes(base64.b64decode(audio[-1]["data"]))
    return src


def eleven_take(path, say=text, voice=None):
    voice = voice or script["eleven_voice"]
    body = {"text": say, "model_id": script.get("eleven_model", "eleven_v4"), "language_code": "id"}
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=wav_24000",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                data = r.read()
                print(f"credits charged: {r.headers.get('character-cost')}", flush=True)
            break
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:600]
            if e.code in (429, 500, 503) and attempt < 3:
                wait = 30 * (attempt + 1)
                print(f"ElevenLabs {e.code}, retrying in {wait}s", flush=True)
                time.sleep(wait)
                continue
            raise SystemExit(f"ElevenLabs refused the request ({e.code}): {detail}")
    src = path.with_suffix(".src.wav")
    src.write_bytes(data)
    return src


def edge_take(path, i):
    import edge_tts
    rate = script.get("edge_rates", ["+6%", "+12%", "+18%"])[i % 3]
    src = path.with_suffix(".src.mp3")
    asyncio.run(edge_tts.Communicate(text, script.get("edge_voice", "id-ID-ArdiNeural"), rate=rate).save(str(src)))
    return src


if a.sample:
    d = out / "samples"
    d.mkdir(parents=True, exist_ok=True)
    say = " ".join(l["say"] for l in lines[:6])
    for v in a.sample.split(","):
        v = v.strip()
        print((eleven_take if a.engine == "elevenlabs" else gemini_take)(d / v, say, v), flush=True)
    raise SystemExit(0)


def decode(src):
    raw = run("ffmpeg", "-v", "error", "-i", str(src), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-").stdout
    return np.frombuffer(raw, np.float32).copy()


def norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


def syllables(w):
    return sum(c in VOWELS for c in w) or 1


SATUAN = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]
UNITS = {"l": "liter", "ml": "mililiter", "km": "kilometer", "kg": "kilogram", "a": "ampere", "v": "volt", "w": "watt"}


def terbilang(n):
    if n < 12:
        return SATUAN[n]
    if n < 20:
        return SATUAN[n - 10] + " belas"
    if n < 100:
        return SATUAN[n // 10] + " puluh " + SATUAN[n % 10]
    if n < 200:
        return "seratus " + terbilang(n - 100)
    if n < 1000:
        return SATUAN[n // 100] + " ratus " + terbilang(n % 100)
    if n < 2000:
        return "seribu " + terbilang(n - 1000)
    if n < 1000000:
        return terbilang(n // 1000) + " ribu " + terbilang(n % 1000)
    return str(n)


def spoken(tok):
    # The recogniser writes "21 l" for "dua puluh satu liter"; spell it back so it can line up with the script.
    w = norm(tok["w"])
    if w.isdigit() and len(w) < 7:
        parts = terbilang(int(w)).split()
    elif w in UNITS:
        parts = [UNITS[w]]
    else:
        return [tok]
    d = (tok["e"] - tok["s"]) / max(1, len(parts))
    return [{"w": p, "s": tok["s"] + i * d, "e": tok["s"] + (i + 1) * d} for i, p in enumerate(parts)]


def voiced_frames(audio):
    """True for each HOP frame with speech in it, judged from the audio itself rather than from the recogniser."""
    h = int(HOP * SR)
    n = len(audio) // h
    rms = np.sqrt(np.mean(audio[: n * h].reshape(n, h) ** 2, axis=1))
    mask = rms > max(np.percentile(rms, 95) * 10 ** (-34 / 20), 1e-4)
    # A stop consonant inside a word is not silence: close holes shorter than 60 ms.
    i = 0
    while i < n:
        if not mask[i]:
            j = i
            while j < n and not mask[j]:
                j += 1
            if j - i < 6 and i > 0 and j < n:
                mask[i:j] = True
            i = j
        else:
            i += 1
    # A blip under 40 ms is a click or a breath, not a word.
    i = 0
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            if j - i < 4:
                mask[i:j] = False
            i = j
        else:
            i += 1
    return mask


model = WhisperModel("small", device="cpu", compute_type="int8")


def to16k(audio):
    n = int(len(audio) * 16000 / SR)
    return np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)


def align(audio, mask):
    # No initial_prompt: on this model it made the recogniser skip the opening lines.
    segs, _ = model.transcribe(to16k(audio), language="id", beam_size=1, vad_filter=False, word_timestamps=True)
    heard = [{"w": w.word.strip(), "s": float(w.start), "e": float(w.end)} for s in segs for w in (s.words or [])]
    heard = [x for tok in heard for x in spoken(tok)]
    say = [{"w": w, "line": li, "s": None, "e": None} for li, l in enumerate(lines) for w in l["say"].split()]
    sm = difflib.SequenceMatcher(a=[norm(x["w"]) for x in say], b=[norm(h["w"]) for h in heard], autojunk=False)
    matched = 0
    for b in sm.get_matching_blocks():
        for k in range(b.size):
            say[b.a + k]["s"], say[b.a + k]["e"] = heard[b.b + k]["s"], heard[b.b + k]["e"]
            matched += 1

    n = len(mask)
    idx = lambda t: min(n - 1, max(0, int(t / HOP)))

    # A word the recogniser timed into a silence is pulled back onto the actual speech next to it.
    for w in say:
        if w["s"] is None:
            continue
        i = idx(w["s"])
        if not mask[i]:
            j = i
            while j < n - 1 and not mask[j] and (j - i) * HOP < 0.5:
                j += 1
            if mask[j]:
                w["s"] = j * HOP
        i = idx(w["e"] - HOP)
        if not mask[i]:
            j = i
            while j > 0 and not mask[j] and (i - j) * HOP < 0.5:
                j -= 1
            if mask[j]:
                w["e"] = (j + 1) * HOP
        if w["e"] <= w["s"]:
            w["e"] = w["s"] + 0.05

    # Words it missed share only the voiced time between their neighbours, so pauses stay pauses.
    # This is what puts "Tik. Tik. Tik." on the three sounds.
    i = 0
    total = len(say)
    while i < total:
        if say[i]["s"] is not None:
            i += 1
            continue
        j = i
        while j < total and say[j]["s"] is None:
            j += 1
        t0 = say[i - 1]["e"] if i else 0.0
        t1 = say[j]["s"] if j < total else n * HOP
        frames = [k for k in range(idx(t0), idx(t1)) if mask[k]] or list(range(idx(t0), max(idx(t0) + 1, idx(t1))))
        weights = [syllables(say[k]["w"]) for k in range(i, j)]
        tot, cum = sum(weights), 0
        for k, wt in zip(range(i, j), weights):
            a0 = frames[min(len(frames) - 1, int(cum / tot * len(frames)))]
            cum += wt
            a1 = frames[min(len(frames) - 1, int(cum / tot * len(frames)) - 1)]
            say[k]["s"], say[k]["e"] = a0 * HOP, (a1 + 1) * HOP
        i = j

    # The recogniser often runs a word's start back to the end of the phrase before it, across a pause.
    # A sliver of sound followed by a real pause belongs to the previous word: start after the pause.
    for w in say:
        i = idx(w["s"])
        j = i
        while j < n and mask[j]:
            j += 1
        k = j
        while k < n and not mask[k]:
            k += 1
        if j - i <= 20 and k - j >= 15 and k * HOP < w["e"]:
            w["s"] = k * HOP

    # Words stay in order, and a word before a pause lasts as long as its sound does.
    for p, q in zip(say, say[1:]):
        if q["s"] < p["e"]:
            p["e"] = max(p["s"] + 0.03, q["s"])
    for p, q in zip(say, say[1:]):
        i = idx(p["e"] - HOP)
        if mask[i] and q["s"] - p["e"] > 0.05:
            while i < n - 1 and mask[i + 1] and (i + 1) * HOP < q["s"]:
                i += 1
            p["e"] = (i + 1) * HOP
    return say, matched / max(1, total)


def tighten(audio, mask, say):
    """Shorten long silences. Cuts only ever fall inside silence, found in the audio, and every join is crossfaded.
    Never cut from the recogniser's word times: a bad join is heard immediately."""
    n = len(mask)
    voiced = np.flatnonzero(mask)
    first, last = voiced[0], voiced[-1]
    cuts = []  # (from_s, to_s) removed
    i = first
    while i <= last:
        if not mask[i]:
            j = i
            while j <= last and not mask[j]:
                j += 1
            gap = (j - i) * HOP
            if gap > MAX_GAP:
                keep = KEEP_GAP / 2
                cuts.append((i * HOP + keep, j * HOP - keep))
            i = j
        else:
            i += 1

    start = max(0.0, first * HOP - 0.02)
    end = min(len(audio) / SR, (last + 1) * HOP + 0.25)
    F = int(FADE * SR)
    ramp = np.sqrt(np.linspace(0, 1, F))  # equal power
    pieces = []
    pos = start
    for c0, c1 in cuts:
        pieces.append(audio[int(pos * SR):int(c0 * SR) + F].copy())
        pos = c1
    pieces.append(audio[int(pos * SR):int(end * SR)].copy())
    result = pieces[0]
    for p in pieces[1:]:
        result[-F:] = result[-F:] * ramp[::-1] + p[:F] * ramp
        result = np.concatenate([result, p[F:]])
    head = int(0.01 * SR)
    result[:head] *= np.linspace(0, 1, head)
    tail = int(0.1 * SR)
    result[-tail:] *= np.linspace(1, 0, tail)

    def remap(t):
        shift = start
        for c0, c1 in cuts:
            if t >= c1:
                shift += c1 - c0
            elif t > c0:
                return c0 - shift
        return max(0.0, t - shift)

    for w in say:
        w["s"], w["e"] = remap(w["s"]), remap(w["e"])
    return result, say, len(cuts)


def hold(audio, say):
    """Extra silence after a line: `"pause": <seconds>` in script.json, and always after the sign-off.
    Inserted at the middle of the gap to the next line, which tighten() has already left silent."""
    for li in reversed(range(len(lines) - 1)):
        l = lines[li]
        p = l.get("pause", SIGN_PAUSE if re.sub(r"[^a-z]", "", l["say"].lower()) == SIGN_OFF else 0)
        if p <= 0:
            continue
        at = (max(w["e"] for w in say if w["line"] == li) + min(w["s"] for w in say if w["line"] == li + 1)) / 2
        k = int(at * SR)
        audio = np.concatenate([audio[:k], np.zeros(int(p * SR), audio.dtype), audio[k:]])
        for w in say:
            if w["s"] >= at:
                w["s"] += p
                w["e"] += p
    return audio, say


def score(say, match):
    span = say[-1]["e"] - say[0]["s"]
    sps = sum(syllables(w["w"]) for w in say) / span
    pace_pen = max(0, PACE[0] - sps, sps - PACE[1]) * 0.08
    return match - pace_pen, sps, span


def show_tokens(show, words):
    """On-screen tokens take the real time of the spoken word they equal. Only a token that differs
    ("21" for "dua puluh satu") is spread, and only across the words it stands for."""
    a_ = [norm(w) for w in show]
    b_ = [w["w"] for w in words]
    toks = [None] * len(show)
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(a=a_, b=b_, autojunk=False).get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                toks[i1 + k] = {"w": show[i1 + k], "s": words[j1 + k]["s"], "e": words[j1 + k]["e"]}
        elif op in ("replace", "insert"):
            if j2 > j1:
                t0, t1 = words[j1]["s"], words[j2 - 1]["e"]
            else:
                t0 = words[j1 - 1]["e"] if j1 else words[0]["s"]
                t1 = words[j1]["s"] if j1 < len(words) else t0 + 0.12
            t1 = max(t1, t0 + 0.05)
            tot = sum(syllables(show[k]) for k in range(i1, i2))
            cur = t0
            for k in range(i1, i2):
                d = (t1 - t0) * syllables(show[k]) / tot
                toks[k] = {"w": show[k], "s": round(cur, 3), "e": round(cur + d, 3)}
                cur += d
    return toks


best = None
for i in range(a.takes):
    path = takes_dir / f"take{i + 1}"
    if a.reuse:
        src = max(takes_dir.glob(f"take{i + 1}.src.*"), key=lambda f: f.stat().st_mtime)  # newest engine's take
    else:
        src = {"gemini": gemini_take, "elevenlabs": eleven_take}[a.engine](path) if a.engine != "edge" else edge_take(path, i)
    raw_audio = decode(src)
    mask = voiced_frames(raw_audio)
    say, match = align(raw_audio, mask)
    audio, say, ncuts = tighten(raw_audio, mask, say)
    s, sps, span = score(say, match)
    print(f"take {i + 1}: match={match:.3f} syl/s={sps:.2f} length={span:.1f}s cuts={ncuts} score={s:.3f}", flush=True)
    if best is None or s > best[0]:
        best = (s, i + 1, audio, say)
    if a.until and match >= a.until:
        break

s, n, audio, say = best
audio, say = hold(audio, say)
pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
with wave.open(str(out / "voice.wav"), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

result = []
for li, l in enumerate(lines):
    words = [{"w": norm(x["w"]), "s": round(x["s"], 3), "e": round(x["e"], 3)} for x in say if x["line"] == li]
    show = l.get("show", l["say"]).split()
    result.append({"id": l["id"], "say": l["say"], "show": l.get("show", l["say"]), "s": words[0]["s"], "e": words[-1]["e"], "words": words, "tokens": show_tokens(show, words)})

timing = {"duration": round(say[-1]["e"] + script.get("tail", 1.3), 3), "lines": result}
(piece / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"kept take {n}: {timing['duration']}s, engine={a.engine}")
