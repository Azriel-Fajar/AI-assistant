import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, ev, pop } from './timing';
import { ACCOUNT, MONO, SANS, T } from './theme';

// Seconds after the start of the `cta` line. sound.py reads the same two numbers for its tap and ding.
export const TAP_AT = 0.95;
export const DONE_AT = 1.05;

// A pointing hand, fingertip at (76, 4).
const Hand: React.FC = () => (
  <svg width={170} height={220} viewBox="0 0 170 220" style={{ overflow: 'visible' }}>
    <g fill="#FFFFFF" stroke={T.ink} strokeWidth={7} strokeLinejoin="round">
      <rect x={14} y={112} width={42} height={74} rx={21} transform="rotate(-28 35 150)" />
      <rect x={32} y={88} width={122} height={118} rx={38} />
      <rect x={124} y={92} width={32} height={50} rx={16} />
      <rect x={96} y={80} width={34} height={56} rx={17} />
      <rect x={55} y={4} width={42} height={126} rx={21} />
    </g>
  </svg>
);

// The follow end card: a motion graphic of its own, laid over the film from the `cta` line.
// A paper panel with the brand's peeled corner slides up, the profile fills in, a hand taps "Ikuti".
export const FollowCard: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps - t0;
  if (t < -0.15) return null;
  const slide = ev(t, -0.15, 0.4);
  const done = t >= DONE_AT;
  const press = t >= TAP_AT && t < DONE_AT + 0.12 ? 0.9 : 1;
  const bounce = done ? 1 + 0.08 * Math.sin(Math.PI * clamp((t - DONE_AT) / 0.3)) : 1;
  const btn = pop(t, 0.3, 0.35);
  // Hand: in from the lower right, taps, then leaves.
  const BX = 540, BY = 1030;
  const TX = BX + 170; // the hand taps the right end, so the label stays readable
  const inP = ev(t, 0.35, 0.5);
  const outP = ev(t, DONE_AT + 0.45, 0.4);
  const hx = TX + (1 - inP) * 300 + outP * 300;
  const hy = BY + (1 - inP) * 700 + outP * 600;
  const hs = t >= TAP_AT - 0.05 && t < DONE_AT + 0.1 ? 0.9 : 1;
  const ring = clamp((t - TAP_AT) / 0.55);
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - slide) * 1920}px)` }}>
      <div style={{ position: 'absolute', inset: 0, background: T.bg }} />
      {/* The brand's peeled corner, bottom right */}
      <svg width={320} height={320} viewBox="0 0 320 320" style={{ position: 'absolute', right: 0, bottom: 0 }}>
        <path d="M320 0 L320 320 L0 320 Z" fill={T.orange} />
        <path d="M320 0 L0 320 L40 70 Q46 20 96 16 Z" fill="#BFB6A3" />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 300, height: 300, borderRadius: 150, overflow: 'hidden', border: `8px solid ${T.ink}`, transform: `scale(${pop(t, 0.1, 0.45)})`, boxShadow: '0 16px 40px rgba(30,25,10,0.18)' }}>
          <Img src={staticFile('brand/profil.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ opacity: ev(t, 0.2, 0.25), transform: `translateY(${(1 - ev(t, 0.2, 0.25)) * 20}px)`, textAlign: 'center', marginTop: 34 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, color: T.ink, letterSpacing: '-0.015em' }}>{ACCOUNT.name}</div>
          {ACCOUNT.handles.map((a, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, marginTop: i ? 4 : 8, opacity: ev(t, 0.25 + 0.1 * i, 0.25) }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A766C' }}>{a.where}</span>
              <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 34, color: '#3A3A36' }}>{a.handle}</span>
            </div>
          ))}
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: '#3A3A36', marginTop: 18 }}>{ACCOUNT.bio}</div>
        </div>
      </div>
      {/* Tap ripple */}
      {ring > 0 && ring < 1 && (
        <div style={{ position: 'absolute', left: TX - 40 - 220 * ring, top: BY - 40 - 220 * ring, width: 80 + 440 * ring, height: 80 + 440 * ring, borderRadius: '50%', border: `6px solid ${T.orange}`, opacity: 1 - ring }} />
      )}
      {done && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = clamp((t - DONE_AT) / 0.45);
        const th = (i / 8) * Math.PI * 2;
        const r = 320 + 90 * a;
        return a < 1 && (
          <div key={i} style={{ position: 'absolute', left: BX + Math.cos(th) * r - 9, top: BY + Math.sin(th) * r * 0.42 - 9, width: 18, height: 18, borderRadius: 9, background: i % 2 ? T.yellow : T.orange, border: `3px solid ${T.ink}`, opacity: 1 - a, transform: `scale(${1 - 0.5 * a})` }} />
        );
      })}
      <div style={{ position: 'absolute', left: BX - 290, top: BY - 66, width: 580, height: 132, borderRadius: 66, background: done ? T.white : T.orange, border: `6px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, transform: `scale(${btn * press * bounce})`, boxShadow: '0 10px 0 rgba(20,20,20,0.85)' }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 58, color: done ? T.ink : '#FFFFFF' }}>{done ? '✓ Mengikuti' : '+ Ikuti'}</span>
      </div>
      {inP > 0 && outP < 1 && (
        <div style={{ position: 'absolute', left: hx - 76, top: hy - 4, transform: `scale(${hs})`, transformOrigin: '76px 4px' }}>
          <Hand />
        </div>
      )}
    </div>
  );
};
