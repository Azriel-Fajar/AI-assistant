import React from "react";
import { Composition, Folder } from "remotion";
import { AdBase, AdProps } from "./RielcodeAd/AdBase";
import { angles } from "./RielcodeAd/angles";
import { PromoAd, PROMO_DURATION, Orientation } from "./RielcodeAd/PromoAd";
import {
  LaunchReel,
  LaunchFeed,
  LaunchStory,
  LaunchWA,
  LAUNCH_DURATION,
  CODE,
} from "./RielcodeAd/LaunchAd";
import { V3AngleA, V3AngleB } from "./RielcodeAd/V3Ads";

const ids = [
  "Angle1-NoOnlinePresence",
  "Angle2-OutdatedSite",
  "Angle3-Outcome",
  "Angle4-Affordable",
  "Angle5-SocialProof",
];

const promoSizes: { id: string; w: number; h: number; orientation: Orientation }[] = [
  { id: "Promo-9x16", w: 1080, h: 1920, orientation: "portrait" },
  { id: "Promo-4x5", w: 1080, h: 1350, orientation: "portrait45" },
  { id: "Promo-1x1", w: 1080, h: 1080, orientation: "square" },
  { id: "Promo-16x9", w: 1920, h: 1080, orientation: "landscape" },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Launch">
        <Composition
          id="Launch-Reel-9x16"
          component={LaunchReel}
          durationInFrames={LAUNCH_DURATION}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ orientation: "portrait" as Orientation, code: CODE }}
        />
        <Composition
          id="Launch-Feed-4x5"
          component={LaunchFeed}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{ code: CODE }}
        />
        <Composition
          id="Launch-Story-9x16"
          component={LaunchStory}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ code: CODE }}
        />
        <Composition
          id="Launch-WA-9x16"
          component={LaunchWA}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ code: CODE }}
        />
      </Folder>
      <Folder name="V3">
        <Composition
          id="V3-AngleA-9x16"
          component={V3AngleA}
          durationInFrames={550}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="V3-AngleB-9x16"
          component={V3AngleB}
          durationInFrames={480}
          fps={30}
          width={1080}
          height={1920}
        />
        {/* Angle A other ratios */}
        <Composition id="V3-AngleA-1x1" component={V3AngleA} durationInFrames={550} fps={30} width={1080} height={1080} />
        <Composition id="V3-AngleA-4x5" component={V3AngleA} durationInFrames={550} fps={30} width={1080} height={1350} />
        <Composition id="V3-AngleA-16x9" component={V3AngleA} durationInFrames={550} fps={30} width={1920} height={1080} />
        {/* Angle B other ratios */}
        <Composition id="V3-AngleB-1x1" component={V3AngleB} durationInFrames={480} fps={30} width={1080} height={1080} />
        <Composition id="V3-AngleB-4x5" component={V3AngleB} durationInFrames={480} fps={30} width={1080} height={1350} />
        <Composition id="V3-AngleB-16x9" component={V3AngleB} durationInFrames={480} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="Promo">
        {promoSizes.map((s) => (
          <Composition
            key={s.id}
            id={s.id}
            component={PromoAd}
            durationInFrames={PROMO_DURATION}
            fps={30}
            width={s.w}
            height={s.h}
            defaultProps={{ orientation: s.orientation }}
          />
        ))}
      </Folder>
      <Folder name="Angles">
        {angles.map((props, i) => (
          <Composition
            key={ids[i]}
            id={ids[i]}
            component={AdBase}
            durationInFrames={450}
            fps={30}
            width={1080}
            height={1080}
            defaultProps={props as AdProps}
          />
        ))}
      </Folder>
    </>
  );
};
