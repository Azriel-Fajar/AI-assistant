import React from "react";
import { Composition } from "remotion";
import { AdBase, AdProps } from "./RielcodeAd/AdBase";
import { angles } from "./RielcodeAd/angles";
import { PromoAd } from "./RielcodeAd/PromoAd";

const ids = [
  "Angle1-NoOnlinePresence",
  "Angle2-OutdatedSite",
  "Angle3-Outcome",
  "Angle4-Affordable",
  "Angle5-SocialProof",
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      <Composition
        id="RielcodePromo"
        component={PromoAd}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
