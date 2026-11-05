import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Cam, camAt, CamKey } from './camera';
import { GridFloor, Stage } from './prims';
import { Captions, Watermark } from './overlay';
import { FollowCard } from './endcard';
import { Timing } from './timing';
import { T } from './theme';
import './fonts';

// Every film stands on a floor (Azriel, 5 Nov 2026: objects on bare white had no depth). The page takes the
// floor's colour so the far floor melts into it like a horizon. floor={false} only for a shot that must float.
// What every piece shares: page colour, 3D stage (no top fade, Azriel 3 Nov 2026: top stays fully clear), watermark, caption, final mix.
// keywords: the film's key terms, coloured in the caption (a list paints green; a map sets each colour).
// The line with id `cta` hands the screen to the follow end card, a motion graphic of its own.
// scene gets the time and the live camera; overlay sits above the fade and the caption sits on top.
export const Frame: React.FC<{
  slug: string;
  timing: Timing;
  keys: CamKey[];
  scene: (t: number, cam: Cam) => React.ReactNode;
  overlay: (t: number, cam: Cam) => React.ReactNode;
  bg?: string;
  floor?: false | React.ComponentProps<typeof GridFloor>;
  mark?: string;
  audio?: boolean;
  keywords?: string[] | Record<string, string>;
}> = ({ slug, timing, keys, scene, overlay, floor = {}, bg, mark, audio = true, keywords }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cam = camAt(keys, t);
  const cta = timing.lines.find((l) => l.id === 'cta');
  return (
    <AbsoluteFill style={{ background: bg ?? (floor ? floor.color ?? T.floor : T.bg) }}>
      <Stage cam={cam}>
        {floor && <GridFloor color={T.floor} lineColor={T.floorLine} {...floor} />}
        {scene(t, cam)}
      </Stage>
      {overlay(t, cam)}
      <Watermark color={mark} />
      {cta && <FollowCard t0={cta.s} />}
      <Captions timing={timing} keywords={keywords} />
      {audio && <Audio src={staticFile(`pieces/${slug}/mix.wav`)} />}
    </AbsoluteFill>
  );
};
