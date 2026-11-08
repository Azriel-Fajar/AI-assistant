import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, ev, pop, Timing } from './timing';
import { L, MONO, SANS, T } from './theme';

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

// The band that dissolves the scene into the page behind the header.
export const TopFade: React.FC<{ color?: string }> = ({ color = T.bg }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 620, background: `linear-gradient(${color} 0%, ${color} 48%, ${color}00 100%)` }} />
);

// Retired (Azriel, 3 Nov 2026): the top stays clear, the caption carries the words. Kept so older pieces still compile.
export const Header: React.FC<{ items: { t: number; kicker: string; title: string }[]; color?: string }> = () => null;

// The account's mark, faint and one-colour, top right: logo (shorts/brand/logo-1warna.svg) + handle, so a re-upload still names the channel (Azriel, 4 Nov 2026).
export const Watermark: React.FC<{ color?: string }> = ({ color = T.ink }) => (
  <div style={{ position: 'absolute', right: 50, top: 172, display: 'flex', alignItems: 'center', gap: 14, opacity: 0.4, color }}>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 0.5 }}>@intipbaliknya</span>
    <svg viewBox="0 0 100 100" width={56} height={56} fill={color}>
      <path d="M24 12 H76 Q88 12 88 24 V60 L60 88 H24 Q12 88 12 76 V24 Q12 12 24 12 Z" />
      <path d="M84 66 L66 84 L67.5 70 Q68 67.5 70.5 67 Z" />
    </svg>
  </div>
);

// Chunks of 1-2 words, cut at punctuation, at long pauses and between lines, so each fits one glance.
const MAX_WORDS = 2;
const MAX_CHARS = 14;
type Chunk = { w: string; s: number; e: number }[];

const chunksOf = (timing: Timing) => {
  const out: Chunk[] = [];
  for (const line of timing.lines) {
    let cur: Chunk = [];
    let n = 0;
    line.tokens.forEach((tok, i) => {
      const prev = line.tokens[i - 1];
      const brk = cur.length >= MAX_WORDS || (cur.length && n + tok.w.length > MAX_CHARS) || (prev && /[.,?!:;]$/.test(prev.w)) || (prev && tok.s - prev.e > 0.35);
      if (brk && cur.length) {
        out.push(cur);
        cur = [];
        n = 0;
      }
      cur.push(tok);
      n += tok.w.length + 1;
    });
    if (cur.length) out.push(cur);
  }
  return out;
};

// Caption mid-low (y=1300, Azriel 3 Nov 2026): 1-2 words, wide heavy caps in ink with a white outline so it reads over the scene,
// key terms coloured by meaning. keywords: a list (painted the account's orange) or { word: colour } from theme.ts, e.g. { tekanan: T.red, air: T.blue }.
// Lower-case words without punctuation. Orange = key term, red = the problem, blue = water; never another channel's palette (Azriel, 3 Nov 2026).
export const Captions: React.FC<{ timing: Timing; keywords?: string[] | Record<string, string> }> = ({ timing, keywords = [] }) => {
  const t = useT();
  const chunks = React.useMemo(() => chunksOf(timing), [timing]);
  const i = chunks.findIndex((c, k) => t >= c[0].s - 0.06 && t < (chunks[k + 1]?.[0].s ?? Infinity) - 0.06);
  if (i < 0) return null;
  const c = chunks[i];
  const last = c[c.length - 1];
  if (t > last.e + 0.6) return null;
  // The opening frame is also the thumbnail, so the first caption is already there.
  const a = c[0].s < 0.1 ? 1 : pop(t, c[0].s - 0.06, 0.2);
  const keys: Record<string, string> = Array.isArray(keywords) ? Object.fromEntries(keywords.map((k) => [k.toLowerCase(), T.orange])) : keywords;
  return (
    // The whole row is widened, not each word: a per-word scaleX overran its fixed margin and glued long words together (4 Nov 2026).
    <div style={{ position: 'absolute', left: 110, right: 110, top: L.captionY, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 28, transform: `translateY(${(1 - a) * 18}px) scaleX(1.18)`, opacity: clamp(a * 2) }}>
      {c.map((w, j) => {
        const clean = w.w.replace(/[.,;:?!]+$/, '');
        const key = keys[clean.toLowerCase().replace(/[^a-z0-9-]/g, '')];
        return (
          <span key={j} style={{ display: 'inline-block', fontFamily: SANS, fontWeight: 900, fontSize: 78, lineHeight: 1.08, letterSpacing: '0.02em', textTransform: 'uppercase', color: key ?? T.ink, WebkitTextStroke: '10px #FFFFFF', paintOrder: 'stroke fill', whiteSpace: 'nowrap' }}>
            {clean}
          </span>
        );
      })}
    </div>
  );
};

export const Card: React.FC<{ t0: number; t1?: number; x: number; y: number; w: number; kicker?: string; outline?: boolean; children: React.ReactNode }> = ({ t0, t1, x, y, w, kicker, outline = true, children }) => {
  const t = useT();
  const a = pop(t, t0);
  const out = t1 === undefined ? 1 : 1 - ev(t, t1, 0.22);
  if (a <= 0 || out <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, background: T.card, borderRadius: 30, padding: '26px 30px', border: outline ? `4px solid ${T.ink}` : 'none', boxShadow: '0 14px 34px rgba(30,25,10,0.14)', opacity: clamp(a) * out, transform: `scale(${0.92 + 0.08 * a})`, transformOrigin: 'top center' }}>
      {kicker && <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3A3A36', marginBottom: 12 }}>{kicker}</div>}
      <div style={{ fontFamily: SANS, color: T.ink }}>{children}</div>
    </div>
  );
};

// A yellow tag with a leader line to the part it names. `to` is usually project(cam, worldPoint).
export const Tag: React.FC<{ t0: number; t1?: number; x: number; y: number; to?: [number, number]; text: string; color?: string; ink?: string }> = ({ t0, t1, x, y, to, text, color = T.yellow, ink = T.ink }) => {
  const t = useT();
  const a = pop(t, t0, 0.35);
  const out = t1 === undefined ? 1 : 1 - ev(t, t1, 0.2);
  if (a <= 0 || out <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: clamp(a) * out }}>
      {to && (
        <svg width={L.W} height={L.H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <line x1={x} y1={y} x2={to[0]} y2={to[1]} stroke={T.ink} strokeWidth={3} />
          <circle cx={to[0]} cy={to[1]} r={7} fill={color} stroke={T.ink} strokeWidth={3} />
        </svg>
      )}
      <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${a})`, background: color, color: ink, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: 40, whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(30,25,10,0.18)' }}>
        {text}
      </div>
    </div>
  );
};

// Honesty pills are gone (Azriel, 3 Nov 2026: not wanted on screen); kept so older pieces still compile. The upload text says what was simplified.
export const Badge: React.FC<{ t0: number; t1?: number; text: string; color?: string }> = () => null;

// Big tilted sound word.
export const Pop: React.FC<{ t0: number; t1: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t0, t1, x, y, text, size = 118, rot = -6, color = T.yellow }) => {
  const t = useT();
  const a = pop(t, t0, 0.3);
  const out = 1 - ev(t, t1, 0.18);
  if (a <= 0 || out <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${a})`, opacity: out, fontFamily: SANS, fontWeight: 900, fontStyle: 'italic', fontSize: size, color, letterSpacing: '-0.01em', WebkitTextStroke: `5px ${T.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
};

// A numbered list whose rows light up one by one; rows ahead stay faint so nobody reads ahead of the voice.
export const Steps: React.FC<{ steps: { t: number; text: string }[] }> = ({ steps }) => {
  const t = useT();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {steps.map((s, i) => {
        const on = ev(t, s.t, 0.2);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: 0.25 + 0.75 * on, fontSize: 35, fontWeight: 700, lineHeight: 1.15 }}>
            <div style={{ flex: '0 0 48px', height: 48, borderRadius: 24, background: on > 0.5 ? T.yellow : 'transparent', border: `3px solid ${T.ink}`, textAlign: 'center', lineHeight: '42px', fontFamily: MONO, fontSize: 27, fontWeight: 700 }}>{i + 1}</div>
            <div>{s.text}</div>
          </div>
        );
      })}
    </div>
  );
};
