---
name: Faster-Whisper Local Setup
description: how to run local Whisper transcription on this PC; python3.13 quirk + NVIDIA DLL fix
metadata:
  type: reference
---

Local speech-to-text works on this PC via faster-whisper (installed 2026-06-11).

- Interpreter quirk: `python` is 3.14 WITHOUT packages; pip installs land in Microsoft Store Python 3.13. Always run with `python3.13`.
- GPU: GTX 1660 Super works after `pip install nvidia-cublas-cu12 nvidia-cudnn-cu12`; ctranslate2 needs `os.add_dll_directory()` on each `nvidia.__path__` subpackage `bin/` dir (namespace package, `nvidia.__file__` is None).
- CUDA errors surface lazily at segment iteration, not at WhisperModel(); wrap the iteration in try/except for CPU fallback.
- Handles Indonesian/English mixed audio well with `--language id`. No ffmpeg needed (bundled PyAV).
- Working reference script: `C:\Users\afw14\OneDrive\Documents\Parallaxnet AI\tools\transcribe.py` ([[Parallaxnet AIOS Project]]).
