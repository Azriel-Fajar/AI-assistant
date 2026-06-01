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

// Orientation drives layout. Same scenes, responsive sizing.
export type Orientation = "portrait" | "square" | "landscape";
export type PromoProps = { orientation: Orientation };

const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Premium reveal: fade + small rise, slow ease. No bouncy spring spam.
const reveal = (frame: number, delay: number, dist = 28) => {
  const t = interpolate(frame, [delay, delay + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { opacity: t, y: interpolate(t, [0, 1], [dist, 0]) };
};

const sp = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 90 }, durationInFrames: 30 });

// Cream wordmark (transparent, lots of padding). Crop tight by scaling to width.
// On cream scenes, sit it on a green pill so the cream mark stays visible.
// On green scenes, render it bare.
const LogoMark: React.FC<{ width?: number; bare?: boolean; opacity?: number }> = ({
  width = 300,
  bare = false,
  opacity = 1,
}) => {
  const img = (
    <Img src={LOGO_PATH} style={{ width, marginTop: -width * 0.18, marginBottom: -width * 0.18, display: "block" }} />
  );
  if (bare) return <div style={{ opacity }}>{img}</div>;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: theme.green,
        borderRadius: 8,
        padding: "10px 22px",
        opacity,
      }}
    >
      {img}
    </div>
  );
};

// Thin growing rule — editorial accent.
const Rule: React.FC<{ frame: number; delay: number; width: number }> = ({ frame, delay, width }) => {
  const w = interpolate(frame, [delay, delay + 26], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return <div style={{ width: w, height: 3, background: theme.green, marginBottom: 28 }} />;
};

const layout = (o: Orientation) => {
  switch (o) {
    case "portrait":
      return { pad: 96, h1: 96, body: 38, cta: 44, label: 28, stat: 96, statLabel: 24, dir: "column" as const, mockGap: 40 };
    case "square":
      return { pad: 88, h1: 92, body: 36, cta: 42, label: 26, stat: 88, statLabel: 24, dir: "column" as const, mockGap: 48 };
    case "landscape":
      return { pad: 110, h1: 84, body: 34, cta: 40, label: 24, stat: 80, statLabel: 22, dir: "row" as const, mockGap: 64 };
  }
};

const Label: React.FC<{ children: React.ReactNode; frame: number; delay?: number }> = ({ children, frame, delay = 6 }) => {
  const r = reveal(frame, delay, 14);
  return (
    <span
      style={{
        fontFamily: sans,
        color: theme.green,
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

// SCENE 1 — Hook
const Hook: React.FC<PromoProps> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const L = layout(orientation);
  const h1 = reveal(frame, 12);
  const h2 = reveal(frame, 24);
  const accent = reveal(frame, 40);
  const logo = reveal(frame, 4, 10);

  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", padding: L.pad }}>
      <div style={{ opacity: logo.opacity, transform: `translateY(${logo.y}px)`, marginBottom: 44 }}>
        <LogoMark width={240} />
      </div>
      <Label frame={frame}>Rielcode</Label>
      <Rule frame={frame} delay={10} width={120} />
      <div style={{ fontFamily: serif, color: theme.ink, fontSize: L.h1, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
        <div style={{ opacity: h1.opacity, transform: `translateY(${h1.y}px)` }}>Your competitors</div>
        <div style={{ opacity: h2.opacity, transform: `translateY(${h2.y}px)` }}>are online.</div>
        <div
          style={{
            opacity: accent.opacity,
            transform: `translateY(${accent.y}px)`,
            fontFamily: serifItalic,
            fontStyle: "italic",
            color: theme.green,
          }}
        >
          Are you?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 2 — Proof (portfolio + stats)
const StatBlock: React.FC<{ value: string; label: string; frame: number; delay: number; L: ReturnType<typeof layout> }> = ({
  value,
  label,
  frame,
  delay,
  L,
}) => {
  const r = reveal(frame, delay, 20);
  return (
    <div style={{ opacity: r.opacity, transform: `translateY(${r.y}px)` }}>
      <div style={{ fontFamily: serif, color: theme.green, fontSize: L.stat, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: sans, color: theme.muted, fontSize: L.statLabel, fontWeight: 600, letterSpacing: 1, marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
};

const Proof: React.FC<PromoProps> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = layout(orientation);
  const card = (delay: number) => {
    const s = sp(frame, fps, delay);
    return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` };
  };
  // Browser-style preview cards: cap height, crop to top of the page.
  const cardH = orientation === "portrait" ? 300 : orientation === "square" ? 240 : 300;
  const Chrome: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) => (
    <div style={{ ...style, borderRadius: 14, overflow: "hidden", border: `1px solid ${theme.border}`, background: theme.white }}>
      <div style={{ height: 26, background: "#e3ddcf", display: "flex", alignItems: "center", gap: 6, paddingLeft: 14 }}>
        {["#d98c7a", "#d9c47a", "#8fb98a"].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div style={{ height: cardH, overflow: "hidden" }}>
        <Img src={src} style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: theme.bg2, justifyContent: "center", padding: L.pad }}>
      <Label frame={frame}>Real Results</Label>
      <Rule frame={frame} delay={8} width={120} />
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: L.h1 * 0.62,
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 40,
          maxWidth: 900,
        }}
      >
        Built for clients in <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: theme.green }}>Canada</span> and{" "}
        <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: theme.green }}>Indonesia</span>.
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 48 }}>
        <Chrome src={staticFile("parallaxnet-ca-20260529-210724.png")} style={{ ...card(10), flex: 1 }} />
        <Chrome src={staticFile("parallaxnet-id-20260529-210732.png")} style={{ ...card(20), flex: 1 }} />
      </div>

      <div style={{ display: "flex", gap: 64 }}>
        <StatBlock value="5+" label="PROJECTS" frame={frame} delay={40} L={L} />
        <StatBlock value="100%" label="DELIVERED" frame={frame} delay={50} L={L} />
        <StatBlock value="<24h" label="REPLY TIME" frame={frame} delay={60} L={L} />
      </div>
    </AbsoluteFill>
  );
};

// SCENE 3 — Offer (checklist)
const Offer: React.FC<PromoProps> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const L = layout(orientation);
  const items = ["Website in 7 days", "Mobile-ready and fast", "Honest, affordable pricing"];
  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", padding: L.pad }}>
      <Label frame={frame}>Why Rielcode</Label>
      <Rule frame={frame} delay={8} width={120} />
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: L.h1 * 0.62,
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 52,
        }}
      >
        Websites with <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: theme.green }}>uncommon polish.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {items.map((t, i) => {
          const r = reveal(frame, 24 + i * 14, 30);
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 26, opacity: r.opacity, transform: `translateX(${r.y}px)` }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: theme.green,
                  color: theme.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontFamily: sans,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div style={{ fontFamily: sans, color: theme.ink, fontSize: L.body + 6, fontWeight: 600 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// SCENE 4 — CTA (green block, like site hero)
const Cta: React.FC<PromoProps> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = layout(orientation);
  const s = sp(frame, fps);
  const head = reveal(frame, 6);
  const pulse = frame > 40 ? 1 + 0.02 * Math.sin((frame / fps) * Math.PI * 2) : 1;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.green} 0%, ${theme.greenDark} 100%)`,
        justifyContent: "center",
        padding: L.pad,
      }}
    >
      <div style={{ opacity: head.opacity, transform: `translateY(${head.y}px)`, marginBottom: 40 }}>
        <LogoMark width={300} bare />
      </div>
      <div
        style={{
          fontFamily: serif,
          color: theme.white,
          fontSize: L.h1,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: -1,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
          marginBottom: 44,
        }}
      >
        Let&apos;s build it <span style={{ fontFamily: serifItalic, fontStyle: "italic" }}>well.</span>
      </div>
      <div style={{ transform: `scale(${interpolate(s, [0, 1], [0.85, 1]) * pulse})`, transformOrigin: "left center" }}>
        <span
          style={{
            display: "inline-block",
            background: theme.bg,
            color: theme.green,
            fontFamily: sans,
            fontSize: L.cta,
            fontWeight: 700,
            padding: "22px 56px",
            borderRadius: 8,
          }}
        >
          Get your free consultation
        </span>
      </div>
      <div
        style={{
          fontFamily: sans,
          color: theme.white,
          fontSize: L.label + 4,
          fontWeight: 600,
          letterSpacing: 1,
          marginTop: 36,
          opacity: interpolate(frame, [30, 50], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        rielcode.com
      </div>
    </AbsoluteFill>
  );
};

export const PROMO_DURATION = 420;

export const PromoAd: React.FC<PromoProps> = ({ orientation }) => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Audio src={staticFile("vo-promo.mp3")} />
      <Audio src={staticFile("music.mp3")} volume={0.14} />
      <Series>
        <Series.Sequence durationInFrames={90} premountFor={30}>
          <Hook orientation={orientation} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={130} premountFor={30}>
          <Proof orientation={orientation} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={110} premountFor={30}>
          <Offer orientation={orientation} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90} premountFor={30}>
          <Cta orientation={orientation} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
