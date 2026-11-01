import React from 'react';
import { Composition } from 'remotion';

// Every src/pieces/<slug>/piece.tsx registers itself; the voice decides how long it runs.
const ctx = (require as any).context('./pieces', true, /piece\.tsx$/);

export const Root: React.FC = () => (
  <>
    {ctx.keys().map((k: string) => {
      const m = ctx(k);
      const slug = k.split('/')[1];
      return (
        <Composition
          key={slug}
          id={slug}
          component={m.default}
          fps={30}
          width={1080}
          height={1920}
          durationInFrames={Math.ceil(m.timing.duration * 30)}
        />
      );
    })}
  </>
);
