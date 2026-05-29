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
} from "remotion";

const FONT = "Segoe UI, system-ui, sans-serif";
const bg = "#0a0a0a";
const blue = "#4f8ef7";
const blueDark = "#1a5fd4";
const white = "#ffffff";

const sp = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });

// Animated gradient mesh + drifting blobs. Code-only, sits behind content.
const BgMotion: React.FC<{ tint?: string }> = ({ tint = blue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const blob = (x: number, y: number, ph: number, size: number, color: string) => ({
    position: "absolute" as const,
    width: size,
    height: size,
    borderRadius: "50%",
    left: `${x + 6 * Math.sin(t * 0.7 + ph)}%`,
    top: `${y + 6 * Math.cos(t * 0.5 + ph)}%`,
    background: color,
    filter: "blur(90px)",
    opacity: 0.5,
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={blob(10, 15, 0, 520, tint)} />
      <div style={blob(60, 55, 2, 620, blueDark)} />
      <div style={blob(35, 70, 4, 460, tint)} />
    </AbsoluteFill>
  );
};

// CSS laptop mockup with auto-scrolling page inside the screen.
const LaptopMockup: React.FC<{ src: string; scroll: number }> = ({ src, scroll }) => (
  <div style={{ width: 560 }}>
    <div
      style={{
        background: "#202028",
        borderRadius: "18px 18px 6px 6px",
        padding: 14,
        boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
        border: "1px solid #33333d",
      }}
    >
      <div
        style={{
          height: 330,
          borderRadius: 8,
          overflow: "hidden",
          background: "#000",
          position: "relative",
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            display: "block",
            position: "absolute",
            top: 0,
            transform: `translateY(${scroll}px)`,
          }}
        />
      </div>
    </div>
    {/* laptop base */}
    <div
      style={{
        width: 660,
        height: 18,
        marginLeft: -50,
        background: "linear-gradient(#3a3a44,#1c1c22)",
        borderRadius: "0 0 14px 14px",
        boxShadow: "0 14px 24px rgba(0,0,0,0.5)",
      }}
    />
  </div>
);

// CSS phone mockup with auto-scrolling page inside the screen.
const PhoneMockup: React.FC<{ src: string; scroll: number }> = ({ src, scroll }) => (
  <div
    style={{
      width: 200,
      background: "#202028",
      borderRadius: 34,
      padding: 12,
      boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
      border: "1px solid #33333d",
    }}
  >
    <div
      style={{
        height: 400,
        borderRadius: 24,
        overflow: "hidden",
        background: "#000",
        position: "relative",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          display: "block",
          position: "absolute",
          top: 0,
          transform: `translateY(${scroll}px)`,
        }}
      />
      {/* notch */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 70,
          height: 16,
          borderRadius: 10,
          background: "#000",
        }}
      />
    </div>
  </div>
);

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoS = sp(frame, fps);
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const tagS = sp(frame, fps, 25);
  const tagY = interpolate(tagS, [0, 1], [40, 0]);
  const barH = interpolate(sp(frame, fps, 10), [0, 1], [0, 1080]);

  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center" }}>
      <BgMotion />
      <div style={{ position: "absolute", left: 0, top: 0, width: 12, height: barH, background: blue }} />
      <Img
        src={staticFile("rielcode-logo.png")}
        style={{
          width: 360,
          transform: `scale(${logoS})`,
          opacity: logoOpacity,
          marginBottom: 36,
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          color: white,
          fontSize: 46,
          fontWeight: 700,
          opacity: tagS,
          transform: `translateY(${tagY}px)`,
          textAlign: "center",
        }}
      >
        Professional Websites.
        <br />
        Built in 7 Days.
      </div>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = sp(frame, fps);
  const right = sp(frame, fps, 8);
  const textOpacity = interpolate(sp(frame, fps, 70), [0, 1], [0, 1]);

  // Auto-scroll: ease through the page over the scene. CA tall ~ -560, ID tall ~ -700.
  const prog = interpolate(frame, [20, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Cap scroll so image always covers the screen (no empty/black tail).
  // CA img in 532px screen ≈ 532/1920*4655 ≈ 1290px tall → max scroll ≈ -758.
  // ID img in 176px screen ≈ 176/1920*5826 ≈ 534px tall → max scroll ≈ -134.
  const caScroll = interpolate(prog, [0, 1], [0, -420]);
  const idScroll = interpolate(prog, [0, 1], [0, -120]);

  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center", perspective: 1400 }}>
      <BgMotion />
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <div
          style={{
            transform: `translateX(${interpolate(left, [0, 1], [-600, 0])}px) rotateY(${interpolate(left, [0, 1], [25, 6])}deg)`,
            opacity: left,
          }}
        >
          <LaptopMockup src={staticFile("parallaxnet-ca-20260529-210724.png")} scroll={caScroll} />
        </div>
        <div
          style={{
            transform: `translateX(${interpolate(right, [0, 1], [600, 0])}px) rotateY(${interpolate(right, [0, 1], [-25, -6])}deg)`,
            opacity: right,
          }}
        >
          <PhoneMockup src={staticFile("parallaxnet-id-20260529-210732.png")} scroll={idScroll} />
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT,
          color: white,
          fontSize: 44,
          fontWeight: 700,
          marginTop: 56,
          opacity: textOpacity,
        }}
      >
        Real clients. Real results.
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["Website in 7 days", "Mobile-ready & fast", "Free consultation"];

  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center" }}>
      <BgMotion />
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {items.map((t, i) => {
          const s = sp(frame, fps, i * 18);
          return (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                opacity: s,
                transform: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: blue,
                  color: white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 700,
                  fontFamily: FONT,
                }}
              >
                ✓
              </div>
              <div style={{ fontFamily: FONT, color: white, fontSize: 40, fontWeight: 600 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(frame, fps);
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 2 * 1.2);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${blueDark} 0%, ${blue} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          color: white,
          fontSize: 80,
          fontWeight: 800,
          textAlign: "center",
          opacity: s,
          transform: `scale(${interpolate(s, [0, 1], [0.6, 1]) * pulse})`,
          maxWidth: 880,
          lineHeight: 1.1,
        }}
      >
        Get Your Free Consultation
      </div>
      <Img
        src={staticFile("rielcode-logo.png")}
        style={{ position: "absolute", right: 48, bottom: 48, width: 180, opacity: s }}
      />
    </AbsoluteFill>
  );
};

export const PromoAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: bg }}>
      <Audio src={staticFile("vo-promo.mp3")} />
      <Audio src={staticFile("music.mp3")} volume={0.18} />
      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>
      <Sequence from={90} durationInFrames={120}>
        <Scene2 />
      </Sequence>
      <Sequence from={210} durationInFrames={130}>
        <Scene3 />
      </Sequence>
      <Sequence from={340} durationInFrames={110}>
        <Scene4 />
      </Sequence>
    </AbsoluteFill>
  );
};
