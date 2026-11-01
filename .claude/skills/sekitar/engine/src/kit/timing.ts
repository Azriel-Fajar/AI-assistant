// timing.json comes from tools/voice.py: the voice is the clock, every cue hangs on a spoken word.
export type Tok = { w: string; s: number; e: number };
export type Line = { id: string; say: string; show: string; s: number; e: number; words: Tok[]; tokens: Tok[] };
export type Timing = { duration: number; lines: Line[] };

export const makeTimeline = (timing: Timing) => {
  const byId = new Map(timing.lines.map((l) => [l.id, l]));
  const line = (id: string) => {
    const l = byId.get(id);
    if (!l) throw new Error(`No line "${id}" in timing.json`);
    return l;
  };
  // Start of the n-th spoken word equal to `word` inside line `id`.
  const word = (id: string, w: string, n = 1) => {
    const l = line(id);
    const hits = l.words.filter((x) => x.w.toLowerCase() === w.toLowerCase());
    if (!hits[n - 1]) throw new Error(`No word "${w}" #${n} in line "${id}"`);
    return hits[n - 1].s;
  };
  return { line, word, start: (id: string) => line(id).s, end: (id: string) => line(id).e };
};

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
// 0 before t0, 1 after t0+d, eased between.
export const ev = (t: number, t0: number, d = 0.5) => ease(clamp((t - t0) / d));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
// An overshoot pop for things that appear, closed-form so every frame is deterministic.
export const pop = (t: number, t0: number, d = 0.45) => {
  const x = clamp((t - t0) / d);
  if (x <= 0) return 0;
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
