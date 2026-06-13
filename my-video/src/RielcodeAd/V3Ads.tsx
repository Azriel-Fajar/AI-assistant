import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { theme } from "./theme";

const FONT = "Segoe UI, Arial, sans-serif";
const WORDMARK = "rielcode-wordmark-cream-cropped.png";

// ---- shared bits -------------------------------------------------

// quiet backing track under the VO; fades in at start, out at end
const BackingMusic: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <Audio
      src={staticFile("music.mp3")}
      volume={(f) =>
        interpolate(
          f,
          [0, fps, durationInFrames - fps, durationInFrames],
          [0, 0.12, 0.12, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      }
    />
  );
};

// brand background with subtle moving gradient sheen
const BrandBG: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, 120], [0, 30], {
    extrapolateRight: "extend",
  });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + shift}deg, ${theme.green} 0%, ${theme.greenDark} 100%)`,
      }}
    />
  );
};

// logo pinned top-left
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 70, left: 72, opacity: o, zIndex: 20 }}>
      <Img src={staticFile(WORDMARK)} style={{ width: 290, height: "auto" }} />
    </div>
  );
};

// caption that fades + slides up, scoped to its Sequence (local frame)
const Caption: React.FC<{ text: string; color?: string; size?: number; bottom?: number }> = ({
  text,
  color = theme.white,
  size = 86,
  bottom = 360,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 16], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom,
        opacity: enter * exit,
        transform: `translateY(${y}px)`,
        zIndex: 20,
      }}
    >
      <span
        style={{
          color,
          fontFamily: FONT,
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: -1.5,
          textShadow: "0 4px 30px rgba(0,0,0,0.55)",
          display: "block",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// phone frame showing a tall screenshot that scrolls up
const PhoneScroll: React.FC<{ src: string; scrollFrames: number }> = ({ src, scrollFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // device dimensions
  const W = 620;
  const H = 1240;
  // screenshots are ~2560 wide; scale to phone width
  const imgScale = W / 2560;
  // scroll from top to bottom across the scene
  const scrollY = interpolate(frame, [0, scrollFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const pop = spring({ fps, frame, config: { damping: 16, stiffness: 110 }, durationInFrames: 22 });
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: "50%",
        transform: `translateX(-50%) scale(${0.92 + pop * 0.08})`,
        width: W,
        height: H,
        borderRadius: 48,
        overflow: "hidden",
        border: `10px solid #11140f`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        background: "#000",
        zIndex: 10,
      }}
    >
      <ScrollImg src={src} W={W} imgScale={imgScale} H={H} scrollY={scrollY} />
    </div>
  );
};

const ScrollImg: React.FC<{ src: string; W: number; imgScale: number; H: number; scrollY: number }> = ({
  src,
  imgScale,
  scrollY,
  H,
}) => {
  // scaled image height; full-page screenshots are tall (~10-11k px)
  const scaledH = 10000 * imgScale; // approx; overflow hidden clips it
  const maxOffset = Math.max(0, scaledH - H);
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        position: "absolute",
        top: -scrollY * maxOffset,
        left: 0,
      }}
    />
  );
};

// animated vibe layer for CTA scenes: floating glow blobs + rising particles
const VibeBG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // authored on the fixed design canvas, not the output canvas
  const width = 1080;
  const height = 1920;
  const t = frame / fps;
  const blob = (cx: number, cy: number, r: number, color: string, phase: number) => {
    const dx = Math.sin(t * 0.6 + phase) * 40;
    const dy = Math.cos(t * 0.5 + phase) * 50;
    return (
      <div
        style={{
          position: "absolute",
          left: cx + dx - r,
          top: cy + dy - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          background: color,
          filter: "blur(90px)",
          opacity: 0.55,
        }}
      />
    );
  };
  const particles = Array.from({ length: 14 }).map((_, i) => {
    const seed = (i * 97) % 100;
    const x = (seed / 100) * width;
    const speed = 0.4 + (seed % 5) * 0.12;
    const y = height - ((t * speed * 120 + seed * 30) % (height + 60));
    const size = 4 + (seed % 4) * 2;
    const op = 0.15 + 0.25 * Math.abs(Math.sin(t + i));
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: theme.bg,
          opacity: op,
        }}
      />
    );
  });
  return (
    <AbsoluteFill style={{ zIndex: 5, overflow: "hidden" }}>
      {blob(width * 0.25, height * 0.3, 260, "#3f6b4f", 0)}
      {blob(width * 0.8, height * 0.55, 300, "#25D366", 2)}
      {blob(width * 0.5, height * 0.85, 240, "#3f6b4f", 4)}
      {particles}
    </AbsoluteFill>
  );
};

// CTA bar with WhatsApp button
const CTABar: React.FC<{ price: string; sub?: string }> = ({ price, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ fps, frame: frame - 6, config: { damping: 14, stiffness: 120 }, durationInFrames: 24 });
  const pulse = 1 + 0.02 * Math.sin((frame / fps) * Math.PI * 2);
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 280,
        transform: `scale(${pop})`,
        transformOrigin: "center",
        zIndex: 20,
        textAlign: "center",
      }}
    >
      <div style={{ color: theme.bg, fontFamily: FONT, fontSize: 52, fontWeight: 800, marginBottom: 14, letterSpacing: -1 }}>
        {price}
      </div>
      {sub ? (
        <div style={{ color: theme.bg2, fontFamily: FONT, fontSize: 32, fontWeight: 500, marginBottom: 36, opacity: 0.85 }}>
          {sub}
        </div>
      ) : null}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 18,
          background: "#25D366",
          color: "#0b3d1f",
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 800,
          padding: "28px 56px",
          borderRadius: 18,
          transform: `scale(${pulse})`,
          boxShadow: "0 16px 50px rgba(37,211,102,0.45)",
        }}
      >
        <WAIcon />
        Chat WhatsApp
      </div>
    </div>
  );
};

const WAIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="#0b3d1f">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.18c-.25.69-1.43 1.32-1.97 1.4-.5.07-1.14.1-1.84-.12-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.83-4.2-4.97-4.4-.15-.2-1.19-1.58-1.19-3.01 0-1.43.75-2.14 1.02-2.43.27-.29.59-.37.79-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.25.59.84 2.04.91 2.19.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.2.68-.79.86-1.07.18-.27.36-.22.61-.14.25.09 1.6.76 1.87.9.27.14.46.2.53.32.07.12.07.69-.18 1.38z" />
  </svg>
);

// Design canvas — all layout authored at this size, then scaled to fit any ratio.
const BASE_W = 1080;
const BASE_H = 1920;

// Scales the fixed 1080x1920 design to fill the target canvas height (no letterbox
// top/bottom), centered, with brand-green behind to fill side gaps on wider ratios.
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  // fit by height so the full vertical story is always visible
  const scale = height / BASE_H;
  return (
    <AbsoluteFill style={{ background: theme.greenDark, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: BASE_W,
          height: BASE_H,
          left: width / 2,
          top: height / 2,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ---- ANGLE A: proof-first (18.31s = 550 frames) ------------------
// VO timings: hook 0-3.5 / google 3.5-7 / mobile 7-10.5 / offer 10.5-13.8 / cta 13.8-16.5 (audio 18.3)
const AngleABody: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.green, overflow: "hidden", width: BASE_W, height: BASE_H }}>
      <Audio src={staticFile("vo-angleA.mp3")} volume={3} />
      <BackingMusic />
      <BrandBG />
      <Logo />

      {/* Hook + demo scroll: cafe (0 - 210f) */}
      <Sequence from={0} durationInFrames={210} premountFor={30}>
        <PhoneScroll src="demo-cafe.png" scrollFrames={210} />
        <DarkScrim />
        <Sequence from={0} durationInFrames={105} layout="none">
          <Caption text="Mau lihat website usaha kamu jadi kayak gimana?" size={78} />
        </Sequence>
      </Sequence>

      {/* Montage: salon (210 - 330f) */}
      <Sequence from={210} durationInFrames={120} premountFor={30}>
        <PhoneScroll src="demo-salon.png" scrollFrames={120} />
        <DarkScrim />
        <Caption text="Pelanggan cari, ketemu, langsung chat." size={72} />
      </Sequence>

      {/* Montage: gym (330 - 414f) */}
      <Sequence from={330} durationInFrames={84} premountFor={30}>
        <PhoneScroll src="demo-gym.png" scrollFrames={84} />
        <DarkScrim />
        <Caption text="Buka cepat di HP, jauh lebih profesional." size={70} />
      </Sequence>

      {/* CTA (414 - 550f) */}
      <Sequence from={414} durationInFrames={136} premountFor={30}>
        <BrandBG />
        <VibeBG />
        <Logo />
        <Caption text="Contohnya gratis." size={96} color={theme.bg} bottom={1180} />
        <CTABar price="Mulai Rp500rb" sub="Aku kirim contoh gratis dulu" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const V3AngleA: React.FC = () => (
  <Stage>
    <AngleABody />
  </Stage>
);

// ---- ANGLE B: speed/result (15.99s = 480 frames) -----------------
// VO: hook 0-3.2 / IG 3.2-6.7 / found 6.7-9.5 / bundle 9.5-12.7 / price 12.7-15.2
const AngleBBody: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.green, overflow: "hidden", width: BASE_W, height: BASE_H }}>
      <Audio src={staticFile("vo-angleB.mp3")} volume={3} />
      <BackingMusic />
      <BrandBG />
      <Logo />

      {/* Hook (0 - 96f) big text */}
      <Sequence from={0} durationInFrames={96} premountFor={30}>
        <BigStat top="Website usaha" mid="jadi" accent="3 hari" />
      </Sequence>

      {/* Body: messy IG vs clean site (96 - 285f) */}
      <Sequence from={96} durationInFrames={189} premountFor={30}>
        <BeforeAfter />
        <Caption text="Nggak cuma andelin Instagram. Punya tempat yang lebih dipercaya." size={62} bottom={320} />
      </Sequence>

      {/* CTA (285 - 480f) */}
      <Sequence from={285} durationInFrames={195} premountFor={30}>
        <BrandBG />
        <VibeBG />
        <Logo />
        <Caption text="Udah include hosting + domain." size={70} color={theme.bg} bottom={1180} />
        <CTABar price="Mulai Rp500rb" sub="Bundle hosting + domain mulai Rp1jt" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const V3AngleB: React.FC = () => (
  <Stage>
    <AngleBBody />
  </Stage>
);

// big stat headline for Angle B hook
const BigStat: React.FC<{ top: string; mid: string; accent: string }> = ({ top, mid, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const pop = spring({ fps, frame: frame - 8, config: { damping: 12, stiffness: 130 }, durationInFrames: 26 });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ textAlign: "center", fontFamily: FONT }}>
        <div style={{ color: theme.white, fontSize: 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{top}</div>
        <div style={{ color: theme.white, fontSize: 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>{mid}</div>
        <div
          style={{
            color: theme.bg,
            fontSize: 200,
            fontWeight: 900,
            letterSpacing: -6,
            lineHeight: 1,
            marginTop: 12,
            transform: `scale(${pop})`,
          }}
        >
          {accent}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// before/after split: messy IG mock vs clean live site (gym screenshot as "after")
const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 30], [0.5, 0.5], { extrapolateRight: "clamp" });
  const slide = interpolate(frame, [0, 24], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill style={{ flexDirection: "row", top: 150, height: 1240 }}>
      {/* before: dim, messy */}
      <div style={{ flex: 1, opacity: 0.55, filter: "grayscale(0.6)", transform: `translateX(${-slide}px)`, padding: 24 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 32, overflow: "hidden", border: "8px solid #11140f", background: "#1b1b1b" }}>
          <Img src={staticFile("demo-salon.png")} style={{ width: "100%", position: "absolute", top: 0, filter: "blur(2px) brightness(0.5)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontFamily: FONT, fontSize: 40, fontWeight: 700, opacity: 0.8 }}>
            Cuma IG
          </div>
        </div>
      </div>
      {/* after: bright clean site */}
      <div style={{ flex: 1, transform: `translateX(${slide}px)`, padding: 24, opacity: reveal + 0.5 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 32, overflow: "hidden", border: "8px solid #11140f", boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}>
          <Img src={staticFile("demo-gym.png")} style={{ width: "100%", position: "absolute", top: 0 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// scrim to keep captions readable over screenshots
const DarkScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to bottom, rgba(15,28,20,0) 45%, rgba(15,28,20,0.35) 72%, rgba(15,28,20,0.78) 100%)",
      zIndex: 15,
    }}
  />
);
