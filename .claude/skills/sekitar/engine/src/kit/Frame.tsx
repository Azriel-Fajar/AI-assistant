import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Cam, camAt, CamKey } from './camera';
import { Stage } from './prims';
import { Captions, TopFade, Watermark } from './overlay';
import { FollowCard } from './endcard';
import { Timing } from './timing';
import { T } from './theme';
import './fonts';

// What every piece shares: page colour, 3D stage, top fade, watermark, caption, final mix.
// keywords: words the caption always paints orange (the film's key terms).
// The line with id `cta` hands the screen to the follow end card, a motion graphic of its own.
// scene gets the time and the live camera; overlay sits above the fade and the caption sits on top.
export const Frame: React.FC<{
  slug: string;
  timing: Timing;
  keys: CamKey[];
  scene: (t: number, cam: Cam) => React.ReactNode;
  overlay: (t: number, cam: Cam) => React.ReactNode;
  bg?: string;
  mark?: string;
  audio?: boolean;
  keywords?: string[];
}> = ({ slug, timing, keys, scene, overlay, bg = T.bg, mark, audio = true, keywords }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cam = camAt(keys, t);
  const cta = timing.lines.find((l) => l.id === 'cta');
  return (
    <AbsoluteFill style={{ background: bg }}>
      <Stage cam={cam}>
        {scene(t, cam)}
      </Stage>
      <TopFade color={bg} />
      {overlay(t, cam)}
      <Watermark color={mark} />
      {cta && <FollowCard t0={cta.s} />}
      <Captions timing={timing} keywords={keywords} />
      {audio && <Audio src={staticFile(`pieces/${slug}/mix.wav`)} />}
    </AbsoluteFill>
  );
};
