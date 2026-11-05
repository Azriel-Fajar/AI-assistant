import React, { useMemo } from 'react';
import * as THREE from 'three';
import { V3 } from './camera';
import { Ball, Box, Cyl, Tiles, Tube } from './prims';
import { T } from './theme';

// Ready-made setting parts (Azriel, 5 Nov 2026: films had no place and looked cheap). A film builds its world
// from these instead of modelling people, rooms and streets again, so detail costs nothing per film.
// Scale: 1 unit = 1 metre; everything stands on y = 0 at `pos`. Pass `t` where a part moves.

const h = (k: number, s: number) => {
  const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// A person, 1.75 m. walk > 0 swings legs and arms (slow, so it doesn't alias); armR/armL raise an arm forward
// (0 hangs, 1 points straight ahead), for holding, pointing or reaching.
export const Person: React.FC<{
  pos?: V3; rot?: number; t?: number; walk?: number; armR?: number; armL?: number;
  shirt?: string; pants?: string; skin?: string; hair?: string; scale?: number;
}> = ({ pos = [0, 0, 0], rot = 0, t = 0, walk = 0, armR = 0, armL = 0, shirt = T.white, pants = '#2E3238', skin = '#C08A62', hair = '#2E2622', scale = 1 }) => {
  const sw = walk * 0.45 * Math.sin(2 * Math.PI * 1.1 * t);
  const breathe = 0.006 * Math.sin(1.6 * t);
  const Leg = ({ x, a }: { x: number; a: number }) => (
    <group position={[x, 0.86, 0]} rotation={[a, 0, 0]}>
      <Cyl r={0.085} h={0.8} pos={[0, -0.4, 0]} color={pants} />
      <Box size={[0.14, 0.07, 0.27]} pos={[0, -0.83, 0.05]} color={T.rubber} />
    </group>
  );
  const Arm = ({ x, a }: { x: number; a: number }) => (
    <group position={[x, 1.42, 0]} rotation={[a, 0, 0]}>
      <Cyl r={0.06} h={0.22} pos={[0, -0.08, 0]} color={shirt} />
      <Cyl r={0.045} h={0.5} pos={[0, -0.36, 0]} color={skin} />
      <Ball r={0.055} pos={[0, -0.63, 0]} color={skin} />
    </group>
  );
  return (
    <group position={pos} rotation={[0, rot, 0]} scale={scale}>
      <Leg x={-0.1} a={sw} />
      <Leg x={0.1} a={-sw} />
      <Box size={[0.4, 0.2, 0.24]} pos={[0, 0.9, 0]} color={pants} />
      <Box size={[0.44, 0.5 + breathe, 0.25]} pos={[0, 1.24, 0]} color={shirt} />
      <Arm x={-0.27} a={-sw - armL * 1.5} />
      <Arm x={0.27} a={sw - armR * 1.5} />
      <Cyl r={0.05} h={0.1} pos={[0, 1.53, 0]} color={skin} />
      <Ball r={0.125} pos={[0, 1.66, 0]} color={skin} />
      <Ball r={0.13} pos={[0, 1.7, -0.025]} color={hair} />
    </group>
  );
};

// A window built as a gap (frame round an opening, glass inside, dark behind), per the windows rule.
// It sits in a wall facing +z; `lit` warms the glass (night), `sky` is the view through it by day.
export const Window: React.FC<{ pos: V3; w?: number; hgt?: number; lit?: number; sky?: string; frame?: string }> = ({
  pos, w = 1.0, hgt = 1.1, lit = 0, sky = '#9EB8C8', frame = T.white,
}) => (
  <group position={pos}>
    <Box size={[w + 0.12, 0.08, 0.1]} pos={[0, hgt / 2 + 0.04, 0]} color={frame} />
    <Box size={[w + 0.2, 0.06, 0.18]} pos={[0, -hgt / 2 - 0.03, 0.04]} color={frame} />
    <Box size={[0.06, hgt, 0.1]} pos={[-w / 2 - 0.03, 0, 0]} color={frame} />
    <Box size={[0.06, hgt, 0.1]} pos={[w / 2 + 0.03, 0, 0]} color={frame} />
    <Box size={[0.04, hgt, 0.06]} pos={[0, 0, 0]} color={frame} />
    <Box size={[w, hgt, 0.02]} pos={[0, 0, -0.03]} color={lit > 0 ? '#F2C96A' : sky} edge={false} shadow={false} />
  </group>
);

// A room corner: tiled floor, back wall and left wall, skirting, a window in the back wall. w across (x), d deep (z),
// the open side faces +z, so the camera looks in. Keep the camera inside az -10..60 so the walls don't block it.
export const Room: React.FC<{
  pos?: V3; w?: number; d?: number; hgt?: number; floor?: string; wall?: string; side?: string; tile?: number;
  window?: number | false; lit?: number;
}> = ({ pos = [0, 0, 0], w = 6, d = 5, hgt = 3, floor = '#D9CDB8', wall = '#E9E4D8', side = '#DCD6C8', tile = 0.6, window = 0.6, lit = 0 }) => (
  <group position={pos}>
    <Tiles w={w} d={d} tile={tile} color={floor} lineColor="#BBAE98" pos={[0, 0.004, 0]} />
    <Box size={[w, hgt, 0.12]} pos={[0, hgt / 2, -d / 2 - 0.06]} color={wall} />
    <Box size={[0.12, hgt, d]} pos={[-w / 2 - 0.06, hgt / 2, 0]} color={side} />
    <Box size={[w, 0.1, 0.03]} pos={[0, 0.05, -d / 2 + 0.015]} color="#BFB5A3" edge={false} />
    <Box size={[0.03, 0.1, d]} pos={[-w / 2 + 0.015, 0.05, 0]} color="#BFB5A3" edge={false} />
    {window !== false && <Window pos={[(window - 0.5) * w, 1.6, -d / 2 + 0.06]} w={1.2} hgt={1.1} lit={lit} />}
  </group>
);

// A one-storey house with a gable roof, a door and a window. lit = 0..1 lights the windows (night).
export const House: React.FC<{ pos?: V3; rot?: number; w?: number; wall?: string; roof?: string; lit?: number; scale?: number }> = ({
  pos = [0, 0, 0], rot = 0, w = 4, wall = '#E4DED0', roof = '#A24E32', lit = 0, scale = 1,
}) => {
  const d = 3.4, wh = 2.6, pitch = 0.6, half = d / 2 / Math.cos(pitch) + 0.25;
  const gable = useMemo(() => {
    const g = new THREE.Shape();
    g.moveTo(-d / 2, 0); g.lineTo(d / 2, 0); g.lineTo(0, (d / 2) * Math.tan(pitch)); g.closePath();
    return new THREE.ShapeGeometry(g);
  }, []);
  return (
    <group position={pos} rotation={[0, rot, 0]} scale={scale}>
      <Box size={[w, wh, d]} pos={[0, wh / 2, 0]} color={wall} />
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={gable} position={[s * w / 2, wh, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <meshLambertMaterial color={wall} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <Box size={[w + 0.4, 0.12, half]} pos={[0, wh + (d / 4) * Math.tan(pitch) + 0.05, d / 4]} rot={[pitch, 0, 0]} color={roof} />
      <Box size={[w + 0.4, 0.12, half]} pos={[0, wh + (d / 4) * Math.tan(pitch) + 0.05, -d / 4]} rot={[-pitch, 0, 0]} color={roof} />
      <Box size={[0.9, 2.0, 0.06]} pos={[-w / 4, 1.0, d / 2 + 0.03]} color="#7A5A40" />
      <Window pos={[w / 4, 1.5, d / 2 + 0.05]} w={0.9} hgt={0.8} lit={lit} sky="#3F454A" />
    </group>
  );
};

// A tree that sways a little.
export const Tree: React.FC<{ pos?: V3; t?: number; scale?: number; leaf?: string }> = ({ pos = [0, 0, 0], t = 0, scale = 1, leaf = '#7FA05A' }) => (
  <group position={pos} scale={scale} rotation={[0, 0, 0.03 * Math.sin(0.9 * t + pos[0])]}>
    <Cyl r={0.12} r2={0.16} h={2.2} pos={[0, 1.1, 0]} color="#7A5A40" />
    <Ball r={1.0} pos={[0, 2.8, 0]} color={leaf} />
    <Ball r={0.75} pos={[0.65, 2.4, 0.2]} color="#94B070" />
    <Ball r={0.7} pos={[-0.6, 2.5, -0.15]} color="#94B070" />
  </group>
);

// A two-lane road along x: asphalt, dashed centre line that can scroll (speed in m/s), kerbs and pavement.
export const Road: React.FC<{ pos?: V3; rot?: number; len?: number; w?: number; t?: number; speed?: number; asphalt?: string }> = ({
  pos = [0, 0, 0], rot = 0, len = 40, w = 7, t = 0, speed = 0, asphalt = '#4A4E52',
}) => {
  const dash = 3, n = Math.ceil(len / (dash * 2));
  const off = ((speed * t) % (dash * 2) + dash * 2) % (dash * 2);
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <Box size={[len, 0.06, w]} pos={[0, 0.03, 0]} color={asphalt} edge={false} />
      {Array.from({ length: n }, (_, i) => {
        const x = -len / 2 + ((i * dash * 2 - off + len) % len); // dashes wrap round so the line scrolls forever
        return <Box key={i} size={[dash, 0.005, 0.14]} pos={[x + dash / 2, 0.063, 0]} color={T.white} edge={false} shadow={false} />;
      })}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box size={[len, 0.15, 0.2]} pos={[0, 0.075, s * (w / 2 + 0.1)]} color="#C9C4B8" />
          <Box size={[len, 0.14, 1.6]} pos={[0, 0.07, s * (w / 2 + 1.0)]} color="#D8D2C4" />
        </group>
      ))}
    </group>
  );
};

// Rain: streaks falling over a box of span x span centred at `at`, from `top` down to the ground, plus rings
// where drops land. amount 0..1 fades it in and out. Deterministic, so every render matches.
export const Rain: React.FC<{ t: number; at?: V3; span?: number; top?: number; n?: number; amount?: number; color?: string; rings?: boolean }> = ({
  t, at = [0, 0, 0], span = 10, top = 8, n = 90, amount = 1, color = '#9FB6C8', rings = true,
}) => {
  const k = Math.round(n * amount);
  return (
    <>
      {Array.from({ length: k }, (_, i) => {
        const f = (t * 1.3 + h(i, 1)) % 1;
        return <Box key={i} size={[0.02, top * 0.06, 0.02]} pos={[at[0] + (h(i, 2) - 0.5) * span, top * (1 - f), at[2] + (h(i, 3) - 0.5) * span]} color={color} opacity={0.75} edge={false} shadow={false} />;
      })}
      {rings && Array.from({ length: Math.round(k / 6) }, (_, i) => {
        const f = (t * 0.9 + h(i, 4)) % 1;
        return <Cyl key={`r${i}`} r={0.05 + 0.25 * f} h={0.003} pos={[at[0] + (h(i, 5) - 0.5) * span, 0.07, at[2] + (h(i, 6) - 0.5) * span]} color="#FFFFFF" opacity={0.5 * (1 - f) * amount} edge={false} shadow={false} />;
      })}
    </>
  );
};

// A lattice transmission tower (SUTET-style), height hgt. Its cross-arm tips are where cables hang: use pylonTips.
export const pylonTips = (pos: V3, hgt = 30): V3[] => {
  const out: V3[] = [];
  [0.62, 0.78, 0.94].forEach((y, i) => {
    const reach = [5.5, 4.5, 3.5][i];
    [-1, 1].forEach((s) => out.push([pos[0] + s * reach, pos[1] + hgt * y - 1.4, pos[2]]));
  });
  return out;
};
export const Pylon: React.FC<{ pos?: V3; hgt?: number; color?: string }> = ({ pos = [0, 0, 0], hgt = 30, color = '#8E959B' }) => {
  const base = hgt * 0.14, topW = hgt * 0.035, levels = 8;
  const half = (y: number) => base + (topW - base) * (y / hgt);
  const legs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const r = hgt * 0.004;
  const bars: [V3, V3][] = [];
  for (let l = 0; l < levels; l++) {
    const y0 = (l / levels) * hgt, y1 = ((l + 1) / levels) * hgt, a = half(y0), b = half(y1);
    for (let k = 0; k < 4; k++) {
      const [x0, z0] = legs[k], [x1, z1] = legs[(k + 1) % 4];
      bars.push([[x0 * a, y0, z0 * a], [x1 * b, y1, z1 * b]]);
      bars.push([[x1 * a, y0, z1 * a], [x0 * b, y1, z0 * b]]);
      bars.push([[x0 * b, y1, z0 * b], [x1 * b, y1, z1 * b]]);
    }
  }
  return (
    <group position={pos}>
      {legs.map(([x, z], i) => <Tube key={i} pts={[[x * base, 0, z * base], [x * topW, hgt, z * topW]]} r={r * 1.8} color={color} />)}
      {bars.map((p, i) => <Tube key={`b${i}`} pts={p} r={r} color={color} edge={false} />)}
      {[0.62, 0.78, 0.94].map((y, i) => {
        const reach = [5.5, 4.5, 3.5][i];
        return (
          <group key={`a${i}`}>
            <Box size={[reach * 2 + 0.4, hgt * 0.012, hgt * 0.02]} pos={[0, hgt * y, 0]} color={color} />
            {[-1, 1].map((s) => <Cyl key={s} r={0.13} h={1.4} pos={[s * reach, hgt * y - 0.7, 0]} color="#5E8C7A" />)}
          </group>
        );
      })}
    </group>
  );
};

// A cable hanging between two points with a sag (metres at the middle); sway moves it gently with t.
export const Cable: React.FC<{ a: V3; b: V3; sag?: number; r?: number; t?: number; color?: string }> = ({ a, b, sag = 2, r = 0.06, t = 0, color = '#5A6066' }) => {
  const sw = 0.15 * Math.sin(0.8 * t + a[0]);
  const pts: V3[] = Array.from({ length: 13 }, (_, i) => {
    const u = i / 12, d = 4 * u * (1 - u);
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - sag * d, a[2] + (b[2] - a[2]) * u + sw * d];
  });
  return <Tube pts={pts} r={r} color={color} edge={false} />;
};

// A street lamp, 5 m. on = 0..1 lights the head.
export const StreetLamp: React.FC<{ pos?: V3; rot?: number; on?: number }> = ({ pos = [0, 0, 0], rot = 0, on = 0 }) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <Cyl r={0.08} r2={0.12} h={5} pos={[0, 2.5, 0]} color={T.steel} />
    <Box size={[1.2, 0.08, 0.08]} pos={[0.55, 4.95, 0]} color={T.steel} />
    <Box size={[0.45, 0.12, 0.25]} pos={[1.05, 4.88, 0]} color={T.dark} />
    <Box size={[0.38, 0.02, 0.2]} pos={[1.05, 4.81, 0]} color={on > 0 ? '#FCE7A0' : '#C9CCC8'} edge={false} shadow={false} />
  </group>
);
