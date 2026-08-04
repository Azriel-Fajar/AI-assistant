import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { theme, LOGO_PATH } from "./theme";

const { fontFamily: serif } = loadSerif("normal", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: serifItalic } = loadSerif("italic", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: sans } = loadSans("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

// Merdeka promo facts. `code` is overridable per referrer (BRY10, YEZ10, ...).
// VO NEVER speaks the code — it says "pakai kodenya" and the code shows on screen only.
// Same rule render-referrals.mjs relies on, so one VO set covers Azriel + all 8 friends.
export const MERDEKA_CODE = "MERDEKA10";
export const MERDEKA_VALID = "Sampai 31 Agustus 2026";
export const MERDEKA_PRICE = "Mulai 1 juta";

// Indonesian identity layer. Rielcode green stays the spine; red-white is the
// seasonal accent, present in every scene instead of just the hook.
const FLAG_RED = "#c8102e";
const GOLD = "#c9a227"; // dirgahayu / kemerdekaan ornament tone

export type MerdekaProps = { code?: string };
export type SceneProps = MerdekaProps & { vo?: string };

// Scene lengths are VO-driven. The 3s target still governs pacing, but a scene
// can never be shorter than its clip or the audio cuts mid-word. Values are the
// measured mp3 length at 30fps plus ~4 frames of tail so the cut lands on silence.
const M1_SCENES = [75, 96, 89, 120] as const; // 2.22 / 3.00 / 2.77 / 3.79s
const M1_CTA = 140; // 4.41s
const M2_SCENES = [118, 114, 104, 98] as const; // 3.71 / 3.58 / 3.24 / 3.06s
const M2_CTA = 105; // 3.16s

const total = (s: readonly number[], cta: number) => s.reduce((a, b) => a + b, 0) + cta;
export const MERDEKA_M1_DURATION = total(M1_SCENES, M1_CTA); // 520f
export const MERDEKA_M2_DURATION = total(M2_SCENES, M2_CTA); // 539f
export const MERDEKA_DURATION = MERDEKA_M1_DURATION;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Landscape is a different canvas, not a wider portrait one. Left-aligned scenes
// built for 1080-wide leave the right half of a 1920 frame empty, and portrait
// type sizes read small there. Scale up and center when the frame is wide.
const useLayout = () => {
  const { width, height } = useVideoConfig();
  const wide = width > height;
  return {
    wide,
    pad: wide ? 120 : 96,
    // Bump type on landscape so it fills the extra width.
    t: wide ? 1.22 : 1,
    // Left-aligned scenes center themselves on landscape.
    align: wide ? ("center" as const) : ("flex-start" as const),
    textAlign: wide ? ("center" as const) : ("left" as const),
  };
};

const reveal = (frame: number, delay: number, dist = 28) => {
  const t = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { opacity: t, y: interpolate(t, [0, 1], [dist, 0]) };
};

const sp = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 90 }, durationInFrames: 26 });

// VO is optional so the ad renders silent before Azriel supplies the mp3s.
const Vo: React.FC<{ src?: string }> = ({ src }) => (src ? <Audio src={staticFile(src)} volume={2} /> : null);

const LogoMark: React.FC<{ width?: number; bare?: boolean }> = ({ width = 240, bare = false }) => {
  const img = (
    <Img src={LOGO_PATH} style={{ width, marginTop: -width * 0.18, marginBottom: -width * 0.18, display: "block" }} />
  );
  if (bare) return <div>{img}</div>;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: theme.green,
        borderRadius: 8,
        padding: "10px 22px",
      }}
    >
      {img}
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; frame: number; delay?: number; color?: string }> = ({
  children,
  frame,
  delay = 4,
  color = theme.green,
}) => {
  const r = reveal(frame, delay, 14);
  return (
    <span
      style={{
        fontFamily: sans,
        color,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: 4,
        textTransform: "uppercase",
        opacity: r.opacity,
        transform: `translateY(${r.y}px)`,
        marginBottom: 24,
      }}
    >
      {children}
    </span>
  );
};

// Sang Saka Merah Putih stripe. Waves like cloth rather than sitting flat.
const FlagStripe: React.FC<{ frame: number; delay?: number; width?: number; onDark?: boolean }> = ({
  frame,
  delay = 6,
  width = 300,
  onDark = false,
}) => {
  const w = interpolate(frame, [delay, delay + 20], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const wave = Math.sin((frame / 30) * 2.2) * 1.6;
  return (
    <div
      style={{
        width: w,
        overflow: "hidden",
        marginBottom: 30,
        borderRadius: 3,
        transform: `skewY(${wave}deg)`,
        boxShadow: onDark ? "none" : "0 6px 18px rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ width, height: 14, background: FLAG_RED }} />
      <div style={{ width, height: 14, background: theme.white }} />
    </div>
  );
};

// --- Indonesian motif layer ---

// Kawung-inspired batik field. Subtle, sits behind content as texture.
const BatikField: React.FC<{ color?: string; opacity?: number }> = ({ color = theme.green, opacity = 0.06 }) => (
  <AbsoluteFill style={{ opacity }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="kawung" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="26" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="90" cy="30" r="26" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="30" cy="90" r="26" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="90" cy="90" r="26" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="60" cy="60" r="8" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kawung)" />
    </svg>
  </AbsoluteFill>
);

// Umbul-umbul bunting across the top — the visual signature of 17 Agustus in Indonesia.
const Bunting: React.FC<{ frame: number; delay?: number }> = ({ frame, delay = 0 }) => {
  const count = 11;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between" }}>
      {new Array(count).fill(0).map((_, i) => {
        const t = interpolate(frame, [delay + i * 2, delay + i * 2 + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });
        const sway = Math.sin((frame / 30) * 1.6 + i * 0.5) * 3;
        return (
          <div
            key={i}
            style={{
              width: 0,
              height: 0,
              borderLeft: "49px solid transparent",
              borderRight: "49px solid transparent",
              borderTop: `${86 * t}px solid ${i % 2 === 0 ? FLAG_RED : theme.white}`,
              transform: `rotate(${sway}deg)`,
              transformOrigin: "top center",
            }}
          />
        );
      })}
    </div>
  );
};

// 81st anniversary mark — 2026 marks 81 years since 1945.
const DirgahayuMark: React.FC<{ frame: number; fps: number; delay?: number }> = ({ frame, fps, delay = 0 }) => {
  const s = sp(frame, fps, delay);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [12, 0])}px)`,
      }}
    >
      <span style={{ fontFamily: serif, color: FLAG_RED, fontSize: 58, fontWeight: 700, lineHeight: 1 }}>81</span>
      <span
        style={{
          fontFamily: sans,
          color: theme.muted,
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: 2.5,
          lineHeight: 1.25,
          textTransform: "uppercase",
        }}
      >
        Tahun
        <br />
        Indonesia
      </span>
    </div>
  );
};

// Code badge — the swappable asset. Mirrors LaunchAd's CodeBadge sizing logic.
export const MerdekaBadge: React.FC<{ frame: number; fps: number; delay?: number; scale?: number; code?: string }> = ({
  frame,
  fps,
  delay = 0,
  scale = 1,
  code = MERDEKA_CODE,
}) => {
  const s = sp(frame, fps, delay);
  // Sans, not serif: Playfair renders old-style numerals so "MERDEKA10" read as
  // "MERDEKAio". Codes must be unambiguous to type.
  const codeFont = code.length <= 9 ? 76 : code.length <= 12 ? 60 : 48;
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        borderRadius: 14,
        background: theme.bg,
        overflow: "hidden",
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1]) * scale})`,
        boxShadow: "0 18px 44px rgba(0,0,0,0.22)",
      }}
    >
      {/* red-white cap ties the badge to the flag */}
      <div style={{ alignSelf: "stretch", height: 10, background: FLAG_RED }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 46px 26px" }}>
        <span style={{ fontFamily: sans, color: theme.muted, fontSize: 21, fontWeight: 700, letterSpacing: 3 }}>
          PAKAI KODE
        </span>
        <span
          style={{
            fontFamily: sans,
            color: theme.green,
            fontSize: codeFont,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: 1,
            fontVariantNumeric: "lining-nums tabular-nums",
          }}
        >
          {code}
        </span>
      </div>
    </div>
  );
};

// ---------------- ANGLE M1: "Bisnis Merdeka" ----------------

// S1 Hook — "Tahun ini, bisnismu bisa merdeka juga."
const M1Hook: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const logo = reveal(frame, 2, 10);
  const h1 = reveal(frame, 14);
  const h2 = reveal(frame, 24);
  return (
    <AbsoluteFill
      style={{ background: theme.bg, justifyContent: "center", alignItems: L.align, padding: L.pad }}
    >
      <Vo src={vo} />
      <BatikField color={theme.green} opacity={0.05} />
      <Bunting frame={frame} delay={2} />
      <div style={{ opacity: logo.opacity, transform: `translateY(${logo.y}px)`, marginBottom: 34 }}>
        <LogoMark width={210 * L.t} />
      </div>
      <FlagStripe frame={frame} delay={8} width={300 * L.t} />
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: 96 * L.t,
          fontWeight: 700,
          lineHeight: 1.04,
          letterSpacing: -1,
          textAlign: L.textAlign,
        }}
      >
        <div style={{ opacity: h1.opacity, transform: `translateY(${h1.y}px)` }}>Bisnis</div>
        <div
          style={{
            opacity: h2.opacity,
            transform: `translateY(${h2.y}px)`,
            fontFamily: serifItalic,
            fontStyle: "italic",
            color: FLAG_RED,
          }}
        >
          Merdeka.
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <DirgahayuMark frame={frame} fps={fps} delay={38} />
      </div>
    </AbsoluteFill>
  );
};

// S2 Problem — "Selama ini jualanmu numpang di marketplace dan algoritma."
const M1Problem: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const head = reveal(frame, 6);
  const lines = ["Numpang lapak orang?", "Kena potongan tiap transaksi?", "Tenggelam kalau algoritma berubah?"];
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.green} 0%, ${theme.greenDark} 100%)`,
        justifyContent: "center",
        alignItems: L.align,
        padding: L.pad,
      }}
    >
      <Vo src={vo} />
      <BatikField color={theme.white} opacity={0.05} />
      <Label frame={frame} color={theme.bg}>
        Selama ini
      </Label>
      <div
        style={{
          fontFamily: serif,
          color: theme.white,
          fontSize: 62 * L.t,
          fontWeight: 700,
          lineHeight: 1.25,
          textAlign: L.textAlign,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        {lines.map((l, i) => {
          const r = reveal(frame, 14 + i * 12, 20);
          return (
            <div key={l} style={{ opacity: r.opacity, transform: `translateY(${r.y}px)`, marginBottom: 18 }}>
              {l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// S3 Solution — "Punya website sendiri. Domain sendiri."
const M1Solution: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(frame, fps, 8);
  const head = reveal(frame, 4);
  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", alignItems: "center", padding: 96 }}>
      <Vo src={vo} />
      <BatikField color={theme.green} opacity={0.05} />
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: 64,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.15,
          marginBottom: 44,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        Alamat bisnismu
        <br />
        <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: FLAG_RED }}>sendiri.</span>
      </div>
      {/* Domain bar as flagpole: the customer's own address flying its own flag */}
      <div style={{ transform: `scale(${interpolate(s, [0, 1], [0.86, 1])})`, opacity: s, alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: theme.white,
            border: `1px solid ${theme.border}`,
            borderRadius: 999,
            padding: "20px 40px",
            boxShadow: "0 18px 44px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#8fb98a" }} />
          <span style={{ fontFamily: sans, color: theme.ink, fontSize: 44, fontWeight: 700, letterSpacing: -0.5 }}>
            namausahamu.com
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// S4 Proof — "Lengkap dengan admin panel, bisa update sendiri."
const M1Proof: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const head = reveal(frame, 4);
  // Starter (1jt) inclusions, per references/rielcode-pricing.md. The ad says
  // "mulai 1 juta", so this list must be what 1jt actually buys.
  const items = [
    "Domain gratis 1 tahun",
    "Hosting gratis 1 tahun",
    "Admin panel sendiri",
    "Desain custom, bukan template",
    "Tampil rapi di HP",
    "SSL & keamanan",
    "Demo tampilan gratis",
  ];
  return (
    <AbsoluteFill
      style={{ background: theme.bg2, justifyContent: "center", alignItems: L.align, padding: L.pad }}
    >
      <Vo src={vo} />
      <BatikField color={theme.green} opacity={0.06} />
      <Label frame={frame}>Sudah termasuk</Label>
      <div style={{ opacity: head.opacity }}>
        {items.map((it, i) => {
          // Tight stagger: 7 items must all land inside the 90-frame scene.
          const r = reveal(frame, 6 + i * 7, 18);
          return (
            <div
              key={it}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 18,
                opacity: r.opacity,
                transform: `translateY(${r.y}px)`,
              }}
            >
              <div
                style={{
                  width: 42 * L.t,
                  height: 42 * L.t,
                  borderRadius: "50%",
                  background: FLAG_RED,
                  color: theme.white,
                  fontFamily: sans,
                  fontSize: 24 * L.t,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <span
                style={{ fontFamily: serif, color: theme.ink, fontSize: 44 * L.t, fontWeight: 700, lineHeight: 1.15 }}
              >
                {it}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// S5 CTA — "Mulai 1 juta. Pakai kodenya, diskon 10% sampai 31 Agustus."
const MerdekaCta: React.FC<SceneProps> = ({ code = MERDEKA_CODE, vo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = reveal(frame, 2);
  const discount = reveal(frame, 6, 22);
  const price = reveal(frame, 18, 16);
  const valid = reveal(frame, 52, 16);
  // Spring pop on the number, then a slow breathing pulse so it holds the eye.
  const pop = sp(frame, fps, 6);
  const breathe = frame > 34 ? 1 + 0.012 * Math.sin((frame - 34) / 9) : 1;
  const discountPop = interpolate(pop, [0, 1], [0.72, 1]) * breathe;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.green} 0%, ${theme.greenDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
      }}
    >
      <Vo src={vo} />
      <BatikField color={theme.white} opacity={0.05} />
      <Bunting frame={frame} delay={0} />
      <div style={{ opacity: head.opacity, transform: `translateY(${head.y}px)`, marginBottom: 18 }}>
        <LogoMark width={220} bare />
      </div>
      <div
        style={{
          fontFamily: sans,
          color: GOLD,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 10,
          opacity: head.opacity,
        }}
      >
        Dirgahayu RI ke-81
      </div>

      {/* The discount is the offer — make it the biggest thing on screen. */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 6,
          opacity: discount.opacity,
          transform: `scale(${discountPop}) translateY(${discount.y}px)`,
        }}
      >
        <span
          style={{
            fontFamily: sans,
            color: theme.white,
            fontSize: 210,
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: -6,
            fontVariantNumeric: "lining-nums tabular-nums",
            textShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          10
        </span>
        <span
          style={{
            fontFamily: sans,
            color: FLAG_RED,
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -2,
            WebkitTextStroke: `2px ${theme.white}`,
          }}
        >
          %
        </span>
      </div>
      <div
        style={{
          fontFamily: serif,
          color: theme.white,
          fontSize: 58,
          fontWeight: 700,
          letterSpacing: 1,
          marginTop: -4,
          marginBottom: 26,
          opacity: discount.opacity,
        }}
      >
        DISKON
      </div>

      <div
        style={{
          fontFamily: sans,
          color: theme.bg,
          fontSize: 30,
          fontWeight: 600,
          marginBottom: 22,
          opacity: price.opacity,
          transform: `translateY(${price.y}px)`,
        }}
      >
        {MERDEKA_PRICE}
      </div>
      <MerdekaBadge frame={frame} fps={fps} delay={22} code={code} />
      <div
        style={{
          fontFamily: sans,
          color: theme.white,
          fontSize: 32,
          fontWeight: 600,
          marginTop: 34,
          textAlign: "center",
          opacity: valid.opacity,
          transform: `translateY(${valid.y}px)`,
        }}
      >
        {MERDEKA_VALID}
        <br />
        wa.me/6285669522225
      </div>
    </AbsoluteFill>
  );
};

// ---------------- ANGLE M2: "Investasi, Bukan Gratisan" ----------------
// Shares MerdekaCta with M1. Only scenes 1-4 differ.

// S1 Hook — "Website gratisan itu ada. Tapi yang menghasilkan, tidak gratis."
const M2Hook: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const logo = reveal(frame, 2, 10);
  const a = reveal(frame, 12);
  const b = reveal(frame, 26);
  return (
    <AbsoluteFill
      style={{ background: theme.bg, justifyContent: "center", alignItems: L.align, padding: L.pad }}
    >
      <Vo src={vo} />
      <BatikField color={theme.green} opacity={0.05} />
      <Bunting frame={frame} delay={2} />
      <div style={{ opacity: logo.opacity, transform: `translateY(${logo.y}px)`, marginBottom: 34 }}>
        <LogoMark width={210 * L.t} />
      </div>
      <FlagStripe frame={frame} delay={8} width={300 * L.t} />
      <div
        style={{
          fontFamily: serif,
          fontSize: 82 * L.t,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: -1,
          textAlign: L.textAlign,
        }}
      >
        <div style={{ opacity: a.opacity, transform: `translateY(${a.y}px)`, color: theme.muted }}>Website gratisan</div>
        <div style={{ opacity: a.opacity, transform: `translateY(${a.y}px)`, color: theme.muted }}>itu ada.</div>
        <div
          style={{
            opacity: b.opacity,
            transform: `translateY(${b.y}px)`,
            color: theme.ink,
            marginTop: 14,
          }}
        >
          Tapi yang{" "}
          <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: FLAG_RED }}>menghasilkan,</span>
        </div>
        <div style={{ opacity: b.opacity, transform: `translateY(${b.y}px)`, color: theme.ink }}>tidak gratis.</div>
      </div>
      <div style={{ marginTop: 36 }}>
        <DirgahayuMark frame={frame} fps={fps} delay={40} />
      </div>
    </AbsoluteFill>
  );
};

// S2 Reframe — "Website itu investasi, alat supaya bisnismu ditemukan pembeli."
const M2Reframe: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const head = reveal(frame, 6);
  const rows: [string, string][] = [
    ["Biaya", "keluar, habis, selesai"],
    ["Investasi", "kerja terus, 24 jam"],
  ];
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.green} 0%, ${theme.greenDark} 100%)`,
        justifyContent: "center",
        alignItems: L.align,
        padding: L.pad,
      }}
    >
      <Vo src={vo} />
      <BatikField color={theme.white} opacity={0.05} />
      <Label frame={frame} color={theme.bg}>
        Cara lihatnya
      </Label>
      <div style={{ opacity: head.opacity }}>
        {rows.map(([k, v], i) => {
          const r = reveal(frame, 12 + i * 16, 22);
          const isInvest = i === 1;
          return (
            <div
              key={k}
              style={{
                opacity: r.opacity,
                transform: `translateY(${r.y}px)`,
                marginBottom: 26,
                paddingLeft: 24,
                borderLeft: `5px solid ${isInvest ? FLAG_RED : "rgba(255,255,255,0.25)"}`,
              }}
            >
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 60 * L.t,
                  fontWeight: 700,
                  color: isInvest ? theme.white : "rgba(255,255,255,0.55)",
                  lineHeight: 1.1,
                }}
              >
                {k}
              </div>
              <div style={{ fontFamily: sans, fontSize: 30 * L.t, fontWeight: 600, color: theme.bg, opacity: 0.8 }}>
                {v}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: serif,
          fontSize: 44 * L.t,
          fontWeight: 700,
          color: theme.white,
          marginTop: 10,
          textAlign: L.textAlign,
          opacity: reveal(frame, 52, 16).opacity,
        }}
      >
        Website itu <span style={{ fontFamily: serifItalic, fontStyle: "italic" }}>investasi.</span>
      </div>
    </AbsoluteFill>
  );
};

// S3 Offer — "Lihat demo tampilan websitemu dulu, gratis. Lanjut kalau cocok."
const M2Offer: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(frame, fps, 10);
  const head = reveal(frame, 4);
  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", alignItems: "center", padding: 96 }}>
      <Vo src={vo} />
      <BatikField color={theme.green} opacity={0.05} />
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: 62,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.15,
          marginBottom: 38,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        Lihat{" "}
        <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: FLAG_RED }}>demo tampilannya</span>
        <br />
        dulu, gratis.
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          background: theme.green,
          color: theme.white,
          borderRadius: 999,
          padding: "22px 46px",
          fontFamily: sans,
          fontSize: 34,
          fontWeight: 700,
          transform: `scale(${interpolate(s, [0, 1], [0.86, 1])})`,
          opacity: s,
          boxShadow: "0 18px 44px rgba(0,0,0,0.16)",
        }}
      >
        Lanjut kalau cocok
      </div>
      <div
        style={{
          fontFamily: sans,
          color: theme.muted,
          fontSize: 28,
          fontWeight: 600,
          marginTop: 26,
          opacity: reveal(frame, 52, 14).opacity,
        }}
      >
        Tidak cocok, tidak apa apa.
      </div>
    </AbsoluteFill>
  );
};

// S4 Terms — "Mulai 1 juta, DP 30% baru mulai dikerjakan."
// DP is stated on purpose: it screens out non-buyers.
const M2Terms: React.FC<SceneProps> = ({ vo }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const head = reveal(frame, 4);
  const a = reveal(frame, 12, 20);
  const b = reveal(frame, 28, 20);
  return (
    <AbsoluteFill
      style={{ background: theme.bg2, justifyContent: "center", alignItems: L.align, padding: L.pad }}
    >
      <Vo src={vo} />
      <BatikField color={theme.green} opacity={0.06} />
      <Label frame={frame}>Terus terang soal biaya</Label>
      <div style={{ opacity: head.opacity, textAlign: L.textAlign }}>
        <div style={{ opacity: a.opacity, transform: `translateY(${a.y}px)`, marginBottom: 34 }}>
          <div style={{ fontFamily: sans, color: theme.muted, fontSize: 28 * L.t, fontWeight: 600, marginBottom: 4 }}>
            Harga
          </div>
          <div style={{ fontFamily: serif, color: theme.ink, fontSize: 76 * L.t, fontWeight: 700, lineHeight: 1 }}>
            Mulai 1 juta
          </div>
        </div>
        <div style={{ opacity: b.opacity, transform: `translateY(${b.y}px)` }}>
          <div style={{ fontFamily: sans, color: theme.muted, fontSize: 28 * L.t, fontWeight: 600, marginBottom: 4 }}>
            Cara bayar
          </div>
          <div style={{ fontFamily: serif, color: FLAG_RED, fontSize: 76 * L.t, fontWeight: 700, lineHeight: 1 }}>
            DP 30%
          </div>
          <div style={{ fontFamily: sans, color: theme.ink, fontSize: 32 * L.t, fontWeight: 600, marginTop: 8 }}>
            baru mulai dikerjakan
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Background bed under the whole ad. Ducked well below the VO, with a fade-out
// on the tail so the video does not end on a hard audio cut.
const MusicBed: React.FC<{ duration: number }> = ({ duration }) => (
  <Audio
    src={staticFile("music.mp3")}
    volume={(f) =>
      interpolate(f, [0, 20, duration - 30, duration], [0, 0.2, 0.2, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    }
  />
);

export const MerdekaM2: React.FC<MerdekaProps> = ({ code = MERDEKA_CODE }) => (
  <AbsoluteFill style={{ background: theme.bg }}>
    <MusicBed duration={MERDEKA_M2_DURATION} />
    <Series>
      <Series.Sequence durationInFrames={M2_SCENES[0]} premountFor={30}>
        <M2Hook vo="vo-merdeka-m2-1.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M2_SCENES[1]} premountFor={30}>
        <M2Reframe vo="vo-merdeka-m2-2.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M2_SCENES[2]} premountFor={30}>
        <M2Offer vo="vo-merdeka-m2-3.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M2_SCENES[3]} premountFor={30}>
        <M2Terms vo="vo-merdeka-m2-4.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M2_CTA} premountFor={30}>
        <MerdekaCta code={code} vo="vo-merdeka-m2-5.mp3" />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export const MerdekaM1: React.FC<MerdekaProps> = ({ code = MERDEKA_CODE }) => (
  <AbsoluteFill style={{ background: theme.bg }}>
    <MusicBed duration={MERDEKA_M1_DURATION} />
    <Series>
      <Series.Sequence durationInFrames={M1_SCENES[0]} premountFor={30}>
        <M1Hook vo="vo-merdeka-m1-1.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M1_SCENES[1]} premountFor={30}>
        <M1Problem vo="vo-merdeka-m1-2.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M1_SCENES[2]} premountFor={30}>
        <M1Solution vo="vo-merdeka-m1-3.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M1_SCENES[3]} premountFor={30}>
        <M1Proof vo="vo-merdeka-m1-4.mp3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={M1_CTA} premountFor={30}>
        <MerdekaCta code={code} vo="vo-merdeka-m1-5.mp3" />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
