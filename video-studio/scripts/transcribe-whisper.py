"""Local word-level transcription with faster-whisper, in the kit's transcript format.

Free, offline replacement for transcribe-elevenlabs.mjs. Handles Indonesian/English mix.

Usage:
  python3.13 scripts/transcribe-whisper.py <video-or-audio> [--model medium] [--language id] [--output path.json]
                                           [--prompt-file script.md]

Output (default <input-without-ext>.json next to the source):
  { "text", "language", "audio_duration_secs", "words": [{ "text", "start", "end", "type": "word" }] }
Times are seconds on the source timeline, as cut-silences / cut-mistakes expect.
"""
import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

# expose NVIDIA pip-wheel DLLs (cublas/cudnn) to ctranslate2 on Windows
if os.name == "nt":
    try:
        import nvidia
        for root in nvidia.__path__:
            for pkg in Path(root).iterdir():
                bin_dir = pkg / "bin"
                if bin_dir.is_dir():
                    os.add_dll_directory(str(bin_dir))
    except ImportError:
        pass

from faster_whisper import WhisperModel


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="video or audio file (mp4, mov, mp3, wav, m4a...)")
    ap.add_argument("--model", default="medium", help="tiny/base/small/medium/large-v3")
    ap.add_argument("--language", default=None, help="e.g. id, en; omit for autodetect")
    ap.add_argument("--output", default=None, help="output .json path")
    ap.add_argument("--prompt-file", default=None, help="text file (e.g. the script) to bias vocabulary like 'AI'")
    args = ap.parse_args()
    prompt = None
    if args.prompt_file:  # drop "# scene" headings and [keyword] brackets from explainer scripts
        lines = Path(args.prompt_file).read_text(encoding="utf-8").splitlines()
        prompt = " ".join(l.strip() for l in lines if l.strip() and not l.startswith("#"))
        prompt = prompt.replace("[", "").replace("]", "")

    source = Path(args.source)
    if not source.exists():
        sys.exit(f"File not found: {source}")
    out = Path(args.output) if args.output else source.with_suffix(".json")

    def run(device: str, compute_type: str):
        model = WhisperModel(args.model, device=device, compute_type=compute_type)
        segments, info = model.transcribe(
            str(source),
            language=args.language,
            word_timestamps=True,
            vad_filter=True,
            beam_size=5,
            initial_prompt=prompt,
        )
        words = []
        for seg in segments:  # transcription happens lazily here; CUDA errors surface now
            for w in seg.words or []:
                text = w.word.strip()
                if text:
                    words.append({"text": text, "start": round(w.start, 3), "end": round(w.end, 3), "type": "word"})
        return words, info

    t0 = time.time()
    try:
        device = "cuda"
        words, info = run("cuda", "float16")
    except Exception as e:
        print(f"GPU unavailable ({type(e).__name__}), falling back to CPU...")
        device = "cpu"
        words, info = run("cpu", "int8")

    if not words:
        sys.exit("No speech detected; transcript not written.")

    # full source duration comes from ffprobe, per docs/TOOLS-AND-API-KEYS.md
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(source)],
        capture_output=True, text=True,
    )
    duration = float(probe.stdout.strip()) if probe.returncode == 0 else info.duration

    result = {
        "text": " ".join(w["text"] for w in words),
        "language": info.language,
        "audio_duration_secs": round(duration, 3),
        "words": words,
    }
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"ok {time.time() - t0:.0f}s | {len(words)} words | {duration:.1f}s source | "
          f"{args.model} ({device}) lang={info.language} | {out}")


if __name__ == "__main__":
    main()
