import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
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

export type Orientation = "portrait" | "portrait45" | "square" | "landscape";
// `code` overrides the headline code (e.g. a referrer's RIEL-ANDI). Defaults to LAUNCH10.
export type LaunchProps = { orientation: Orientation; code?: string };
export type StaticProps = { code?: string };

// Launch facts — single source of truth. `code` is overridable per referrer.
export const CODE = "LAUNCH10";
export const OFFER = "10% off any package";
export const VALID = "Valid through 30 June 2026";
const SITE_IMG = "site-redesign.png";
const SITE_W = 1920;
const SITE_H = 5524;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

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

const Rule: React.FC<{ frame: number; delay: number; width: number; color?: string }> = ({
  frame,
  delay,
  width,
  color = theme.green,
}) => {
  const w = interpolate(frame, [delay, delay + 26], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return <div style={{ width: w, height: 3, background: color, marginBottom: 28 }} />;
};

const Label: React.FC<{ children: React.ReactNode; frame: number; delay?: number; color?: string }> = ({
  children,
  frame,
  delay = 6,
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

const layout = (o: Orientation) => {
  switch (o) {
    case "portrait":
      return { pad: 96, h1: 96, body: 38, cta: 44 };
    case "portrait45":
      return { pad: 88, h1: 86, body: 36, cta: 42 };
    case "square":
      return { pad: 88, h1: 92, body: 36, cta: 42 };
    case "landscape":
      return { pad: 110, h1: 84, body: 34, cta: 40 };
  }
};

// Reusable code badge — the asset everything advertises.
export const CodeBadge: React.FC<{ frame: number; fps: number; scale?: number; delay?: number; code?: string }> = ({
  frame,
  fps,
  scale = 1,
  delay = 0,
  code = CODE,
}) => {
  const s = sp(frame, fps, delay);
  // Shrink font for longer referral codes so they never overflow the badge.
  const codeFont = code.length <= 9 ? 88 : code.length <= 12 ? 68 : 54;
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "26px 48px",
        borderRadius: 14,
        background: theme.bg,
        border: `2px dashed ${theme.green}`,
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1]) * scale})`,
      }}
    >
      <span style={{ fontFamily: sans, color: theme.muted, fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>
        USE CODE
      </span>
      <span style={{ fontFamily: serif, color: theme.green, fontSize: codeFont, fontWeight: 700, lineHeight: 1, letterSpacing: 2 }}>
        {code}
      </span>
      <span style={{ fontFamily: sans, color: theme.ink, fontSize: 26, fontWeight: 600 }}>{OFFER}</span>
    </div>
  );
};

// Shared VO for static assets: hook clip, then code clip.
// Brand code (CODE) speaks "LAUNCH10"; referral codes use code-agnostic VO.
const StaticVO: React.FC<{ code?: string }> = ({ code = CODE }) => (
  <>
    <Audio src={staticFile("vo-launch-hook.mp3")} />
    <Sequence from={46}>
      <Audio src={staticFile(code === CODE ? "vo-launch-code.mp3" : "vo-launch-code-ref.mp3")} />
    </Sequence>
  </>
);

// SCENE 1 — Hook
const Hook: React.FC<LaunchProps> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const L = layout(orientation);
  const logo = reveal(frame, 4, 10);
  const h1 = reveal(frame, 14);
  const h2 = reveal(frame, 26);

  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", padding: L.pad }}>
      <Audio src={staticFile("vo-launch-hook.mp3")} />
      <div style={{ opacity: logo.opacity, transform: `translateY(${logo.y}px)`, marginBottom: 44 }}>
        <LogoMark width={240} />
      </div>
      <Label frame={frame}>Just Launched</Label>
      <Rule frame={frame} delay={10} width={120} />
      <div style={{ fontFamily: serif, color: theme.ink, fontSize: L.h1, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
        <div style={{ opacity: h1.opacity, transform: `translateY(${h1.y}px)` }}>The new</div>
        <div
          style={{
            opacity: h2.opacity,
            transform: `translateY(${h2.y}px)`,
            fontFamily: serifItalic,
            fontStyle: "italic",
            color: theme.green,
          }}
        >
          rielcode.com
        </div>
        <div style={{ opacity: h2.opacity, transform: `translateY(${h2.y}px)` }}>is live.</div>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 2 — Site reveal: browser chrome panning down the long screenshot (fake scroll)
const SiteReveal: React.FC<LaunchProps & { durationInFrames: number }> = ({ orientation, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = layout(orientation);
  const s = sp(frame, fps, 4);

  // Window geometry inside the safe area.
  const winW = orientation === "landscape" ? 1100 : 1080 - L.pad * 2 + 40;
  const winH = orientation === "landscape" ? 760 : orientation === "portrait45" ? 940 : 1240;
  const innerH = winH - 44; // minus chrome bar
  const imgRenderW = winW;
  const imgRenderH = (SITE_H / SITE_W) * imgRenderW;
  // Pan from top to bottom across the scene.
  const maxScroll = imgRenderH - innerH;
  const t = interpolate(frame, [10, durationInFrames - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const scroll = -maxScroll * t;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.green} 0%, ${theme.greenDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: L.pad / 2,
      }}
    >
      <Audio src={staticFile("vo-launch-site.mp3")} />
      <Label frame={frame} color={theme.bg} delay={4}>
        See it for yourself
      </Label>
      <div
        style={{
          width: winW,
          height: winH,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid rgba(255,255,255,0.25)`,
          background: theme.white,
          boxShadow: "0 40px 90px rgba(0,0,0,0.35)",
          transform: `scale(${interpolate(s, [0, 1], [0.92, 1])})`,
          opacity: s,
        }}
      >
        <div style={{ height: 44, background: "#e3ddcf", display: "flex", alignItems: "center", gap: 8, paddingLeft: 18 }}>
          {["#d98c7a", "#d9c47a", "#8fb98a"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
          ))}
          <div
            style={{
              marginLeft: 20,
              height: 24,
              flex: 1,
              marginRight: 18,
              background: theme.white,
              borderRadius: 12,
              fontFamily: sans,
              fontSize: 16,
              color: theme.muted,
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
            }}
          >
            rielcode.com
          </div>
        </div>
        <div style={{ height: innerH, overflow: "hidden", position: "relative" }}>
          <Img
            src={staticFile(SITE_IMG)}
            style={{ width: imgRenderW, display: "block", transform: `translateY(${scroll}px)` }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 3 — Code
const CodeScene: React.FC<LaunchProps> = ({ orientation, code = CODE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = layout(orientation);
  const head = reveal(frame, 8);
  const valid = reveal(frame, 50);
  // Brand uses the LAUNCH10 VO (speaks the code); referral uses a code-agnostic VO.
  const codeVo = code === CODE ? "vo-launch-code.mp3" : "vo-launch-code-ref.mp3";

  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", alignItems: "center", padding: L.pad }}>
      <Audio src={staticFile(codeVo)} />
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: L.h1 * 0.66,
          fontWeight: 700,
          lineHeight: 1.1,
          textAlign: "center",
          marginBottom: 48,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        Celebrate with <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: theme.green }}>10% off.</span>
      </div>
      <CodeBadge frame={frame} fps={fps} delay={20} code={code} />
      <div
        style={{
          fontFamily: sans,
          color: theme.muted,
          fontSize: L.body - 2,
          fontWeight: 600,
          marginTop: 36,
          opacity: valid.opacity,
          transform: `translateY(${valid.y}px)`,
        }}
      >
        {VALID}
      </div>
    </AbsoluteFill>
  );
};

// SCENE 4 — CTA
const Cta: React.FC<LaunchProps> = ({ orientation, code = CODE }) => {
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
      <Audio src={staticFile("vo-launch-cta.mp3")} />
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
          marginBottom: 40,
        }}
      >
        Let&apos;s build yours <span style={{ fontFamily: serifItalic, fontStyle: "italic" }}>well.</span>
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
          Code {code} at checkout
        </span>
      </div>
      <div
        style={{
          fontFamily: sans,
          color: theme.white,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 1,
          marginTop: 36,
          opacity: interpolate(frame, [30, 50], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        rielcode.com · wa.me/6285669522225
      </div>
    </AbsoluteFill>
  );
};

// ---- REEL (18s) ----
export const LAUNCH_DURATION = 560;
const D_HOOK = 90;
const D_SITE = 180;
const D_CODE = 140; // fits the longer referral code VO (130f)
const D_CTA = 150;

export const LaunchReel: React.FC<LaunchProps> = ({ orientation, code = CODE }) => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Series>
        <Series.Sequence durationInFrames={D_HOOK} premountFor={30}>
          <Hook orientation={orientation} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={D_SITE} premountFor={30}>
          <SiteReveal orientation={orientation} durationInFrames={D_SITE} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={D_CODE} premountFor={30}>
          <CodeScene orientation={orientation} code={code} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={D_CTA} premountFor={30}>
          <Cta orientation={orientation} code={code} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

// ---- STATIC: IG FEED (4:5) ----
export const LaunchFeed: React.FC<StaticProps> = ({ code = CODE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = reveal(frame, 8);
  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", padding: 96 }}>
      <StaticVO code={code} />
      <div style={{ opacity: reveal(frame, 2, 10).opacity, marginBottom: 36 }}>
        <LogoMark width={220} />
      </div>
      <Label frame={frame}>Just Launched</Label>
      <Rule frame={frame} delay={10} width={120} />
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: 90,
          fontWeight: 700,
          lineHeight: 1.04,
          letterSpacing: -1,
          marginBottom: 48,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        The new site is <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: theme.green }}>live.</span>
      </div>
      <CodeBadge frame={frame} fps={fps} delay={16} code={code} />
      <div style={{ fontFamily: sans, color: theme.muted, fontSize: 28, fontWeight: 600, marginTop: 32 }}>{VALID}</div>
    </AbsoluteFill>
  );
};

// ---- STATIC: IG/FB STORY (9:16) ----
export const LaunchStory: React.FC<StaticProps> = ({ code = CODE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = reveal(frame, 8);
  return (
    <AbsoluteFill style={{ background: theme.bg, justifyContent: "center", alignItems: "center", padding: 90 }}>
      <StaticVO code={code} />
      <div style={{ opacity: reveal(frame, 2, 10).opacity, marginBottom: 48 }}>
        <LogoMark width={240} />
      </div>
      <div
        style={{
          fontFamily: serif,
          color: theme.ink,
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1.05,
          textAlign: "center",
          marginBottom: 56,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        New site is <span style={{ fontFamily: serifItalic, fontStyle: "italic", color: theme.green }}>live.</span>
      </div>
      <CodeBadge frame={frame} fps={fps} delay={16} scale={1.1} code={code} />
      <div style={{ fontFamily: sans, color: theme.muted, fontSize: 28, fontWeight: 600, marginTop: 40 }}>{VALID}</div>
      <div
        style={{
          fontFamily: sans,
          color: theme.white,
          background: theme.green,
          fontSize: 34,
          fontWeight: 700,
          padding: "20px 52px",
          borderRadius: 999,
          marginTop: 64,
          opacity: reveal(frame, 50, 20).opacity,
        }}
      >
        Link in bio
      </div>
    </AbsoluteFill>
  );
};

// ---- STATIC: WHATSAPP STATUS (9:16) ----
export const LaunchWA: React.FC<StaticProps> = ({ code = CODE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = reveal(frame, 8);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.green} 0%, ${theme.greenDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 96,
      }}
    >
      <StaticVO code={code} />
      <div style={{ opacity: reveal(frame, 2, 10).opacity, marginBottom: 48 }}>
        <LogoMark width={260} bare />
      </div>
      <div
        style={{
          fontFamily: serif,
          color: theme.white,
          fontSize: 88,
          fontWeight: 700,
          lineHeight: 1.06,
          textAlign: "center",
          marginBottom: 56,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        Our site got a <span style={{ fontFamily: serifItalic, fontStyle: "italic" }}>redesign.</span>
      </div>
      <CodeBadge frame={frame} fps={fps} delay={16} scale={1.05} code={code} />
      <div style={{ fontFamily: sans, color: theme.white, fontSize: 30, fontWeight: 600, marginTop: 44, textAlign: "center" }}>
        {VALID}
        <br />
        Reply to get yours.
      </div>
    </AbsoluteFill>
  );
};
