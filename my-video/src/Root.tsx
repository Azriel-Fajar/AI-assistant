import React from "react";
import { Composition, Folder } from "remotion";
import { AdBase, AdProps } from "./RielcodeAd/AdBase";
import { angles } from "./RielcodeAd/angles";
import { PromoAd, PROMO_DURATION, Orientation } from "./RielcodeAd/PromoAd";

const ids = [
  "Angle1-NoOnlinePresence",
  "Angle2-OutdatedSite",
  "Angle3-Outcome",
  "Angle4-Affordable",
  "Angle5-SocialProof",
];

const promoSizes: { id: string; w: number; h: number; orientation: Orientation }[] = [
  { id: "Promo-9x16", w: 1080, h: 1920, orientation: "portrait" },
  { id: "Promo-1x1", w: 1080, h: 1080, orientation: "square" },
  { id: "Promo-16x9", w: 1920, h: 1080, orientation: "landscape" },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
