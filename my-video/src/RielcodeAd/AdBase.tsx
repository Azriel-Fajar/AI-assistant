import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  Audio,
} from "remotion";
import { theme, LOGO_PATH } from "./theme";

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
          [0, 0.2, 0.2, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      }
    />
  );
};

export type AdProps = {
  tag: string;
  headline1: string;
  headline2: string;
  headlineAccent: string;
  body: string;
  cta: string;
  voiceover: string;
  durationInFrames?: number;
};

export const AdBase: React.FC<AdProps> = ({
  tag,
  headline1,
  headline2,
  headlineAccent,
  body,
  cta,
  voiceover,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Exit begins ~50f before the comp ends, regardless of total length.
  const EXIT_START = durationInFrames - 50;
  // CTA pulse runs from when CTA settles until exit.
  const PULSE_START = Math.min(300, EXIT_START - 60);

  // Spring enter
  const spr = (delay: number, damping = 18, stiffness = 120) =>
    spring({ fps, frame: frame - delay, config: { damping, stiffness }, durationInFrames: 35 });

  // Fade in + optional exit fade
  const fade = (delay: number, exitDelay = EXIT_START) =>
    interpolate(
      frame,
      [delay, delay + 20, exitDelay, exitDelay + 20],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  // Slide up on enter, slide up on exit
  const slide = (delay: number, exitDelay = EXIT_START) =>
    interpolate(
      frame,
      [delay, delay + 25, exitDelay, exitDelay + 20],
      [40, 0, 0, -20],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  // Scale with spring enter + exit shrink
  const scaleEnterExit = (delay: number) => {
    const enter = spr(delay);
    const exit = interpolate(frame, [EXIT_START, EXIT_START + 25], [1, 0.92], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return frame < EXIT_START ? enter : exit;
  };

  // Accent bar grows in, shrinks on exit
  const barHeight = interpolate(
    frame,
    [0, 25, EXIT_START, EXIT_START + 25],
    [0, 1080, 1080, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // BG panels: fade + 3D tilt slide in from sides
  const bgOpacity = interpolate(frame, [0, 40, EXIT_START, EXIT_START + 20], [0, 0.5, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelTiltLeft = interpolate(frame, [0, 50], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelTiltRight = interpolate(frame, [0, 50], [-25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelSlideLeft = interpolate(frame, [0, 50], [-120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelSlideRight = interpolate(frame, [0, 50], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA pulse after settled
  const ctaPulse =
    frame > PULSE_START && frame < EXIT_START
      ? 1 + 0.025 * Math.sin(((frame - PULSE_START) / fps) * Math.PI * 2)
      : 1;

  const ctaScale = frame < EXIT_START ? spr(140) * ctaPulse : interpolate(frame, [EXIT_START, EXIT_START + 25], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Logo fade
  const logoOpacity = interpolate(
    frame,
    [5, 25, EXIT_START, EXIT_START + 20],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: theme.green, overflow: "hidden", perspective: 800 }}>
      <Audio src={staticFile(voiceover)} volume={2} />
      <BackingMusic />

      {/* Background portfolio panels — 3D slide in from sides */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity,
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        {/* Left panel — slides + tilts from left */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            transform: `translateX(${panelSlideLeft}px) rotateY(${panelTiltLeft}deg)`,
            transformOrigin: "left center",
          }}
        >
          <Img
            src={staticFile("demo-cafe.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "blur(1px)" }}
          />
        </div>

        {/* Right panel — slides + tilts from right */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            transform: `translateX(${panelSlideRight}px) rotateY(${panelTiltRight}deg)`,
            transformOrigin: "right center",
          }}
        >
          <Img
            src={staticFile("demo-salon.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "blur(1px)" }}
          />
        </div>
      </AbsoluteFill>

      {/* Gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.99) 100%)",
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 8,
          height: barHeight,
          background: `linear-gradient(to bottom, ${theme.bg}, ${theme.bg2})`,
        }}
      />

      {/* Logo top right */}
      <div style={{ position: "absolute", top: 48, right: 64, opacity: logoOpacity }}>
        <Img src={LOGO_PATH} style={{ height: 48 }} />
      </div>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "72px 80px 72px 88px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tag — enters first */}
        <div
          style={{
            opacity: fade(15),
            transform: `translateY(${slide(15)}px) scale(${spr(15, 20, 150)})`,
            marginBottom: 32,
            transformOrigin: "left center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: theme.bg,
              color: theme.green,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              padding: "8px 20px",
              borderRadius: 4,
              fontFamily: "Segoe UI, Arial, sans-serif",
            }}
          >
            {tag}
          </span>
        </div>

        {/* Headline line 1 */}
        <div
          style={{
            opacity: fade(35),
            transform: `translateY(${slide(35)}px)`,
            fontFamily: "Segoe UI, Arial, sans-serif",
          }}
        >
          <span style={{ color: "#fff", fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
            {headline1}
          </span>
        </div>

        {/* Headline line 2 */}
        <div
          style={{
            opacity: fade(50),
            transform: `translateY(${slide(50)}px)`,
            fontFamily: "Segoe UI, Arial, sans-serif",
          }}
        >
          <span style={{ color: "#fff", fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
            {headline2}
          </span>
        </div>

        {/* Headline accent */}
        <div
          style={{
            opacity: fade(65),
            transform: `translateY(${slide(65)}px) scale(${scaleEnterExit(65)})`,
            transformOrigin: "left center",
            marginBottom: 28,
            fontFamily: "Segoe UI, Arial, sans-serif",
          }}
        >
          <span style={{ color: theme.bg, fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
            {headlineAccent}
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            opacity: fade(90),
            transform: `translateY(${slide(90)}px)`,
            marginBottom: 52,
            color: theme.muted,
            fontSize: 30,
            lineHeight: 1.55,
            maxWidth: 820,
            fontFamily: "Segoe UI, Arial, sans-serif",
            whiteSpace: "pre-line" as const,
          }}
        >
          {body}
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: fade(120),
            transform: `scale(${ctaScale})`,
            transformOrigin: "left center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: theme.bg,
              color: theme.green,
              fontSize: 28,
              fontWeight: 700,
              padding: "22px 52px",
              borderRadius: 6,
              letterSpacing: 0.5,
              fontFamily: "Segoe UI, Arial, sans-serif",
            }}
          >
            {cta}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
