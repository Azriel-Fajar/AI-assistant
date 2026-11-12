import React, { useMemo } from 'react';
import * as THREE from 'three';
import { V3 } from './camera';
import { Ball, Box, Cyl, Lathe, Tiles, Tube } from './prims';
import { T } from './theme';

// Ready-made setting parts (Azriel, 5 Nov 2026: films had no place and looked cheap). A film builds its world
// from these instead of modelling people, rooms and streets again, so detail costs nothing per film.
// Scale: 1 unit = 1 metre; everything stands on y = 0 at `pos`. Pass `t` where a part moves.

const h = (k: number, s: number) => {
  const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// A person, 1.75 m. walk > 0 swings legs and arms (slow, so it doesn't alias); armR/armL raise an arm forward
// (0 hangs, 1 points straight ahead), for holding, pointing or reaching. sit = 1 swings both legs straight ahead
// (sitting up in bed or on the floor): stand it at y = surface - 0.78 so the legs rest on the surface.
// head = false leaves neck and head out so a piece can draw its own (e.g. a cutaway) at [0, 1.66, 0].
// reach = 0..1 swings both arms in toward the middle so raised hands meet (washing hands, holding one small thing).
export const Person: React.FC<{
  pos?: V3; rot?: number; t?: number; walk?: number; armR?: number; armL?: number; sit?: number; reach?: number;
  shirt?: string; pants?: string; skin?: string; hair?: string; scale?: number; head?: boolean;
}> = ({ pos = [0, 0, 0], rot = 0, t = 0, walk = 0, armR = 0, armL = 0, sit = 0, reach = 0, shirt = T.white, pants = '#2E3238', skin = '#C08A62', hair = '#2E2622', scale = 1, head = true }) => {
  const sw = walk * 0.45 * Math.sin(2 * Math.PI * 1.1 * t);
  const breathe = 0.006 * Math.sin(1.6 * t);
  const Leg = ({ x, a }: { x: number; a: number }) => (
    <group position={[x, 0.86, 0]} rotation={[a, 0, 0]}>
      <Cyl r={0.085} h={0.8} pos={[0, -0.4, 0]} color={pants} />
      <Box size={[0.14, 0.07, 0.27]} pos={[0, -0.83, 0.05]} color={T.rubber} />
    </group>
  );
  const Arm = ({ x, a }: { x: number; a: number }) => (
    <group position={[x, 1.42, 0]} rotation={[a, 0, -Math.sign(x) * reach * 0.42]}>
      <Cyl r={0.06} h={0.22} pos={[0, -0.08, 0]} color={shirt} />
      <Cyl r={0.045} h={0.5} pos={[0, -0.36, 0]} color={skin} />
      <Ball r={0.055} pos={[0, -0.63, 0]} color={skin} />
    </group>
  );
  return (
    <group position={pos} rotation={[0, rot, 0]} scale={scale}>
      <Leg x={-0.1} a={sw * (1 - sit) - (sit * Math.PI) / 2} />
      <Leg x={0.1} a={-sw * (1 - sit) - (sit * Math.PI) / 2} />
      <Box size={[0.4, 0.2, 0.24]} pos={[0, 0.9, 0]} color={pants} />
      <Box size={[0.44, 0.5 + breathe, 0.25]} pos={[0, 1.24, 0]} color={shirt} />
      <Arm x={-0.27} a={-sw - armL * 1.5} />
      <Arm x={0.27} a={sw - armR * 1.5} />
      {head && (
        <>
          <Cyl r={0.05} h={0.1} pos={[0, 1.53, 0]} color={skin} />
          <Ball r={0.125} pos={[0, 1.66, 0]} color={skin} />
          <Ball r={0.13} pos={[0, 1.7, -0.025]} color={hair} />
        </>
      )}
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
  window?: number | false; lit?: number; sky?: string;
}> = ({ pos = [0, 0, 0], w = 6, d = 5, hgt = 3, floor = '#D9CDB8', wall = '#E9E4D8', side = '#DCD6C8', tile = 0.6, window = 0.6, lit = 0, sky }) => (
  <group position={pos}>
    <Tiles w={w} d={d} tile={tile} color={floor} lineColor="#BBAE98" pos={[0, 0.004, 0]} />
    <Box size={[w, hgt, 0.12]} pos={[0, hgt / 2, -d / 2 - 0.06]} color={wall} />
    <Box size={[0.12, hgt, d]} pos={[-w / 2 - 0.06, hgt / 2, 0]} color={side} />
    <Box size={[w, 0.1, 0.03]} pos={[0, 0.05, -d / 2 + 0.015]} color="#BFB5A3" edge={false} />
    <Box size={[0.03, 0.1, d]} pos={[-w / 2 + 0.015, 0.05, 0]} color="#BFB5A3" edge={false} />
    {window !== false && <Window pos={[(window - 0.5) * w, 1.6, -d / 2 + 0.06]} w={1.2} hgt={1.1} lit={lit} sky={sky} />}
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

// A flat-bottomed cloud of puffs, about 5 m wide at scale 1, drifting along x (drift in m/s). color grey for
// overcast, white for fair weather; opacity < 1 for thin cloud. No shadow, so the street below stays readable.
export const Cloud: React.FC<{ pos?: V3; t?: number; drift?: number; scale?: number; color?: string; opacity?: number; seed?: number }> = ({
  pos = [0, 10, 0], t = 0, drift = 0.15, scale = 1, color = '#D5D8DA', opacity = 1, seed = 1,
}) => (
  <group position={[pos[0] + drift * t, pos[1] + 0.08 * Math.sin(0.5 * t + seed), pos[2]]} scale={scale}>
    {[[0, 0.35, 0, 1.15], [1.25, 0.1, 0.2, 0.85], [-1.3, 0.05, -0.1, 0.9], [0.5, 0.85, -0.2, 0.75], [-0.6, 0.7, 0.3, 0.7], [2.2, -0.05, 0, 0.55], [-2.2, -0.05, 0.1, 0.5]].map(([x, y, z, r], k) => (
      <Ball key={k} r={r * (0.9 + 0.2 * h(k, seed))} pos={[x, y, z]} color={color} opacity={opacity} shadow={false} />
    ))}
    <Box size={[4.6, 0.3, 1.6]} pos={[0, -0.15, 0]} color={color} opacity={opacity} edge={false} shadow={false} />
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
// clear lists [x0, x1, z0, z1] areas that stay dry (under a roof, inside a cut-open car).
export const Rain: React.FC<{ t: number; at?: V3; span?: number; top?: number; n?: number; amount?: number; color?: string; rings?: boolean; clear?: number[][] }> = ({
  t, at = [0, 0, 0], span = 10, top = 8, n = 90, amount = 1, color = '#9FB6C8', rings = true, clear = [],
}) => {
  const k = Math.round(n * amount);
  const dry = (x: number, z: number) => clear.some(([x0, x1, z0, z1]) => x > x0 && x < x1 && z > z0 && z < z1);
  return (
    <>
      {Array.from({ length: k }, (_, i) => {
        const f = (t * 1.3 + h(i, 1)) % 1;
        if (dry(at[0] + (h(i, 2) - 0.5) * span, at[2] + (h(i, 3) - 0.5) * span)) return null;
        return <Box key={i} size={[0.02, top * 0.06, 0.02]} pos={[at[0] + (h(i, 2) - 0.5) * span, top * (1 - f), at[2] + (h(i, 3) - 0.5) * span]} color={color} opacity={0.75} edge={false} shadow={false} />;
      })}
      {rings && Array.from({ length: Math.round(k / 6) }, (_, i) => {
        const f = (t * 0.9 + h(i, 4)) % 1;
        if (dry(at[0] + (h(i, 5) - 0.5) * span, at[2] + (h(i, 6) - 0.5) * span)) return null;
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

// A kitchen counter: cabinet body with door seams and a top slab, against a wall. Its top is at hgt; put things
// on it at y = hgt. w along x, d deep (z), front faces +z.
export const Counter: React.FC<{ pos?: V3; w?: number; d?: number; hgt?: number; top?: string; body?: string; doors?: number }> = ({
  pos = [0, 0, 0], w = 2.4, d = 0.65, hgt = 0.9, top = '#CFC6B6', body = '#E6E0D3', doors = 4,
}) => (
  <group position={pos}>
    <Box size={[w - 0.04, hgt - 0.13, d - 0.06]} pos={[0, (hgt - 0.13) / 2 + 0.08, -0.03]} color={body} />
    <Box size={[w - 0.1, 0.08, d - 0.12]} pos={[0, 0.04, -0.07]} color="#A79F90" edge={false} />
    <Box size={[w, 0.05, d]} pos={[0, hgt - 0.025, 0]} color={top} />
    {Array.from({ length: doors }, (_, i) => {
      const x = -w / 2 + (w / doors) * (i + 0.5);
      return (
        <group key={i}>
          <Box size={[w / doors - 0.04, hgt - 0.24, 0.02]} pos={[x, (hgt - 0.13) / 2 + 0.08, d / 2 - 0.05]} color={body} />
          <Box size={[0.12, 0.02, 0.03]} pos={[x, hgt - 0.22, d / 2 - 0.03]} color={T.steel} edge={false} />
        </group>
      );
    })}
  </group>
);

// A plain wooden table on four legs (desk, dining or work table). Its top surface is at y = hgt.
export const Table: React.FC<{ pos?: V3; w?: number; d?: number; hgt?: number; top?: string; leg?: string }> = ({
  pos = [0, 0, 0], w = 1.6, d = 0.8, hgt = 0.76, top = '#B98A5E', leg = '#8E6542',
}) => (
  <group position={pos}>
    <Box size={[w, 0.04, d]} pos={[0, hgt - 0.02, 0]} color={top} />
    <Box size={[w - 0.12, 0.08, d - 0.12]} pos={[0, hgt - 0.08, 0]} color={leg} edge={false} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
      <Box key={i} size={[0.05, hgt - 0.04, 0.05]} pos={[sx * (w / 2 - 0.06), (hgt - 0.04) / 2, sz * (d / 2 - 0.06)]} color={leg} />
    ))}
  </group>
);

// A fridge with a freezer on top. open = 0..1 swings the freezer door (hinged on the left, so keep the camera on
// the right, az > 0, to look in). The freezer's inner floor is at y = hgt - fh + 0.03; place its contents there.
export const Fridge: React.FC<{ pos?: V3; w?: number; d?: number; hgt?: number; fh?: number; open?: number; color?: string; inside?: string }> = ({
  pos = [0, 0, 0], w = 0.72, d = 0.7, hgt = 1.75, fh = 0.5, open = 0, color = T.white, inside = '#DCE3E6',
}) => {
  const k = 0.03, y0 = hgt - fh;
  return (
    <group position={pos}>
      <Box size={[w, y0 - 0.02, d]} pos={[0, (y0 - 0.02) / 2, 0]} color={color} />
      <Box size={[0.03, 0.5, 0.04]} pos={[w / 2 - 0.08, y0 - 0.4, d / 2 + 0.02]} color={T.steel} />
      <Box size={[w, k, d]} pos={[0, y0 + k / 2, 0]} color={inside} />
      <Box size={[w, k, d]} pos={[0, hgt - k / 2, 0]} color={color} />
      <Box size={[k, fh, d]} pos={[-w / 2 + k / 2, y0 + fh / 2, 0]} color={color} />
      <Box size={[k, fh, d]} pos={[w / 2 - k / 2, y0 + fh / 2, 0]} color={color} />
      <Box size={[w, fh, k]} pos={[0, y0 + fh / 2, -d / 2 + k / 2]} color={inside} />
      <Box size={[w - 2 * k - 0.004, fh - 2 * k - 0.004, 0.004]} pos={[0, y0 + fh / 2, -d / 2 + k + 0.003]} color={inside} edge={false} />
      <group position={[-w / 2, y0 + fh / 2, d / 2]} rotation={[0, -1.9 * open, 0]}>
        <Box size={[w, fh - 0.01, 0.05]} pos={[w / 2, 0, 0.025]} color={color} />
        <Box size={[0.03, 0.22, 0.04]} pos={[w - 0.08, -0.08, 0.07]} color={T.steel} />
      </group>
    </group>
  );
};

// A drinking glass with a drink in it. fill = 0..1 of the height; the glass is see-through, the drink solid.
export const Glass: React.FC<{ pos?: V3; r?: number; hgt?: number; fill?: number; drink?: string }> = ({
  pos = [0, 0, 0], r = 0.04, hgt = 0.12, fill = 0.8, drink = '#B5672A',
}) => (
  <group position={pos}>
    {fill > 0 && <Cyl r={r * 0.84} r2={r * 0.93} h={hgt * fill} pos={[0, hgt * fill / 2 + 0.006, 0]} color={drink} />}
    <Lathe profile={[[0, 0], [r * 0.88, 0], [r, hgt], [r * 0.95, hgt], [r * 0.85, 0.006], [0, 0.006]]} color={T.white} opacity={0.3} smooth />
  </group>
);

// A small car, 4.2 m long, front toward +x, driver on the right (+z, as in Indonesia). cut opens the near side
// of the cabin (sill and roof edge in capColor, near pillars gone) so the camera on +z sees the people inside. fog = 0..1 mists
// every window from the inside; people = 0..2 seated (driver, then passenger); lights = 0..1 head and tail lamps.
// windshieldAt(u, z, off) gives a point on the windshield in the car's own frame: u 0 at the bottom edge,
// 1 at the top, z across, off along the outward normal (negative is inside). carMouths are the people's mouths.
const WS_BOT = [1.15, 0.99], WS_TOP = [0.45, 1.5];
const WS_LEN = Math.hypot(WS_TOP[0] - WS_BOT[0], WS_TOP[1] - WS_BOT[1]);
const WS_A = Math.atan2(WS_TOP[1] - WS_BOT[1], WS_TOP[0] - WS_BOT[0]);
const WS_N = [(WS_TOP[1] - WS_BOT[1]) / WS_LEN, -(WS_TOP[0] - WS_BOT[0]) / WS_LEN]; // outward: forward and up
export const windshieldAt = (u: number, z: number, off = 0): V3 => [
  WS_BOT[0] + (WS_TOP[0] - WS_BOT[0]) * u + WS_N[0] * off,
  WS_BOT[1] + (WS_TOP[1] - WS_BOT[1]) * u + WS_N[1] * off,
  z,
];
export const carMouths: V3[] = [[0.1, 1.26, 0.42], [0.1, 1.26, -0.42]];
const RW_BOT = [-1.4, 0.99], RW_TOP = [-0.95, 1.5];
const RW_A = Math.atan2(RW_TOP[1] - RW_BOT[1], RW_TOP[0] - RW_BOT[0]);
const RW_LEN = Math.hypot(RW_TOP[0] - RW_BOT[0], RW_TOP[1] - RW_BOT[1]);

const Seated: React.FC<{ z: number; shirt: string; drive?: boolean; t: number }> = ({ z, shirt, drive, t }) => {
  const nod = 0.03 * Math.sin(1.2 * t + z * 5);
  const hand: V3 = drive ? [0.62, 1.1, z + 0.12] : [0.3, 0.86, z + 0.12];
  return (
    <group position={[0, -0.1, 0]}>
      <Box size={[0.42, 0.15, 0.32]} pos={[0.2, 0.74, z]} color="#2E3238" />
      <Box size={[0.13, 0.4, 0.26]} pos={[0.46, 0.52, z]} color="#2E3238" />
      <Box size={[0.24, 0.52, 0.36]} pos={[-0.08, 1.02, z]} rot={[0, 0, 0.12]} color={shirt} />
      <group position={[-0.03, 1.38, z]} rotation={[0, 0, nod]}>
        <Ball r={0.12} color="#C08A62" />
        <Ball r={0.125} pos={[-0.03, 0.04, 0]} color="#2E2622" />
      </group>
      <Tube pts={[[-0.06, 1.2, z + 0.17], [0.2, 1.0, z + 0.2], hand]} r={0.045} color={shirt} />
    </group>
  );
};

export const Car: React.FC<{
  pos?: V3; rot?: number; t?: number; body?: string; cut?: boolean; capColor?: string; fog?: number; people?: number;
  shirts?: [string, string]; lights?: number;
}> = ({ pos = [0, 0, 0], rot = 0, t = 0, body = '#D9DDE0', cut = false, capColor = T.red, fog = 0, people = 0, shirts = [T.white, '#A39B8E'], lights = 0 }) => {
  const side = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(RW_BOT[0] + 0.05, 0.99); s.lineTo(WS_BOT[0] - 0.05, 0.99); s.lineTo(WS_TOP[0] + 0.02, 1.5); s.lineTo(RW_TOP[0] - 0.02, 1.5); s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);
  const glass = '#CFE7F4', mist = '#E6EEF2';
  const Pane: React.FC<{ z: number }> = ({ z }) => (
    <>
      <mesh geometry={side} position={[0, 0, z]}><meshLambertMaterial color={glass} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      {fog > 0.01 && <mesh geometry={side} position={[0, 0, z + (z < 0 ? 0.02 : -0.02)]}><meshLambertMaterial color={mist} transparent opacity={0.85 * fog} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
    </>
  );
  const Slope: React.FC<{ bot: number[]; a: number; len: number; inward: number }> = ({ bot, a, len, inward }) => {
    const c: V3 = [bot[0] + Math.cos(a) * len / 2, bot[1] + Math.sin(a) * len / 2, 0];
    const n = [-Math.sin(a) * inward, Math.cos(a) * inward];
    return (
      <>
        {(cut ? [-0.85] : [-0.85, 0.85]).map((z) => <Box key={z} size={[len + 0.04, 0.07, 0.07]} pos={[c[0], c[1], z]} rot={[0, 0, a]} color={body} />)}
        <Box size={[len, 0.012, 1.64]} pos={c} rot={[0, 0, a]} color={glass} opacity={0.35} edge={false} shadow={false} />
        {fog > 0.01 && <Box size={[len - 0.02, 0.01, 1.6]} pos={[c[0] + n[0] * 0.025, c[1] + n[1] * 0.025, 0]} rot={[0, 0, a]} color={mist} opacity={0.85 * fog} edge={false} shadow={false} />}
      </>
    );
  };
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      {[-1.35, 1.35].flatMap((x) => [-0.78, 0.78].map((z) => (
        <group key={`${x}${z}`}>
          <Cyl r={0.32} h={0.22} pos={[x, 0.32, z]} rot={[Math.PI / 2, 0, 0]} color={T.rubber} />
          <Cyl r={0.15} h={0.02} pos={[x, 0.32, z + Math.sign(z) * 0.115]} rot={[Math.PI / 2, 0, 0]} color={T.steel} edge={false} />
        </group>
      )))}
      <Box size={[3.9, 0.1, 1.7]} pos={[0, 0.47, 0]} color={T.dark} />
      <Box size={[4.2, 0.5, 0.06]} pos={[0, 0.72, -0.85]} color={body} />
      {cut ? <Box size={[2.55, 0.18, 0.06]} pos={[-0.12, 0.56, 0.85]} color={body} /> : <Box size={[4.2, 0.5, 0.06]} pos={[0, 0.72, 0.85]} color={body} />}
      <Box size={[0.95, 0.5, 1.76]} pos={[1.625, 0.72, 0]} color={body} />
      <Box size={[0.7, 0.5, 1.76]} pos={[-1.75, 0.72, 0]} color={body} />
      <Box size={[0.12, 0.18, 1.82]} pos={[2.13, 0.55, 0]} color={T.dark} />
      <Box size={[0.12, 0.18, 1.82]} pos={[-2.13, 0.55, 0]} color={T.dark} />
      {[-0.6, 0.6].map((z) => (
        <group key={z}>
          <Box size={[0.04, 0.1, 0.32]} pos={[2.11, 0.84, z]} color={lights > 0 ? '#FFF2B8' : '#ECEAE0'} edge={false} />
          <Box size={[0.04, 0.1, 0.3]} pos={[-2.11, 0.84, z]} color={lights > 0 ? '#E8432A' : '#B4483A'} edge={false} />
          <Box size={[0.1, 0.1, 0.14]} pos={[0.98, 1.08, z * 1.6]} color={body} />
        </group>
      ))}
      <Box size={[1.42, 0.06, 1.76]} pos={[-0.25, 1.53, 0]} color={body} />
      <Slope bot={WS_BOT} a={WS_A} len={WS_LEN} inward={1} />
      <Slope bot={RW_BOT} a={RW_A} len={RW_LEN} inward={1} />
      <Box size={[0.07, 0.53, 0.06]} pos={[-0.25, 1.24, -0.85]} color={body} />
      <Pane z={-0.85} />
      {!cut && <><Box size={[0.07, 0.53, 0.06]} pos={[-0.25, 1.24, 0.85]} color={body} /><Pane z={0.85} /></>}
      {cut && (
        <>
          <Box size={[2.55, 0.02, 0.07]} pos={[-0.12, 0.66, 0.85]} color={capColor} edge={false} />
          <Box size={[1.42, 0.02, 0.07]} pos={[-0.25, 1.5, 0.86]} color={capColor} edge={false} />
        </>
      )}
      <Box size={[0.4, 0.2, 1.64]} pos={[0.95, 0.9, 0]} color={T.dark} />
      <Box size={[0.5, 0.02, 0.1]} pos={[WS_BOT[0] + 0.05, 1.0, -0.35]} rot={[0, 0.3, 0]} color={T.rubber} edge={false} />
      <Box size={[0.5, 0.02, 0.1]} pos={[WS_BOT[0] + 0.05, 1.0, 0.35]} rot={[0, 0.3, 0]} color={T.rubber} edge={false} />
      <Tube pts={[[0.9, 0.95, 0.42], [0.7, 1.06, 0.42]]} r={0.025} color={T.rubber} />
      <Cyl r={0.17} h={0.035} pos={[0.68, 1.08, 0.42]} rot={[0, 0, 1.12]} color={T.rubber} />
      {[-0.42, 0.42].map((z) => (
        <group key={z} position={[0, -0.1, 0]}>
          <Box size={[0.5, 0.14, 0.5]} pos={[0.05, 0.6, z]} color="#4A4F55" />
          <Box size={[0.12, 0.62, 0.5]} pos={[-0.25, 0.95, z]} rot={[0, 0, 0.18]} color="#4A4F55" />
          <Box size={[0.1, 0.16, 0.28]} pos={[-0.32, 1.34, z]} color="#4A4F55" />
        </group>
      ))}
      <Box size={[0.5, 0.14, 1.5]} pos={[-0.85, 0.5, 0]} color="#4A4F55" />
      <Box size={[0.12, 0.5, 1.5]} pos={[-1.12, 0.8, 0]} rot={[0, 0, 0.2]} color="#4A4F55" />
      {people > 0 && <Seated z={0.42} shirt={shirts[0]} drive t={t} />}
      {people > 1 && <Seated z={-0.42} shirt={shirts[1]} t={t} />}
    </group>
  );
};

// A sink unit to stand in a row of Counters (same height and depth): top slab round a real hole, a steel basin
// inside it, cabinet below, a faucet at the back. flow = 0..1 runs the tap. Its basin floor is at y = hgt - deep;
// put dishes there. w along x, front faces +z.
export const Sink: React.FC<{ pos?: V3; w?: number; d?: number; hgt?: number; deep?: number; flow?: number; t?: number; top?: string; body?: string }> = ({
  pos = [0, 0, 0], w = 1.0, d = 0.65, hgt = 0.9, deep = 0.2, flow = 0, t = 0, top = '#CFC6B6', body = '#E6E0D3',
}) => {
  const bw = w * 0.62, bd = d * 0.6, bz = 0.02, wl = 0.012, y0 = hgt - 0.05;
  return (
    <group position={pos}>
      <Box size={[w - 0.04, y0 - deep - 0.08, d - 0.06]} pos={[0, (y0 - deep - 0.08) / 2 + 0.08, -0.03]} color={body} />
      <Box size={[w - 0.1, 0.08, d - 0.12]} pos={[0, 0.04, -0.07]} color="#A79F90" edge={false} />
      <Box size={[w - 0.04, deep + 0.01, 0.03]} pos={[0, y0 - deep / 2, d / 2 - 0.045]} color={body} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box size={[w / 2 - 0.04, hgt - 0.24, 0.02]} pos={[s * w / 4, (hgt - 0.13) / 2 + 0.08, d / 2 - 0.05]} color={body} />
          <Box size={[0.02, 0.12, 0.03]} pos={[s * 0.06, hgt - 0.3, d / 2 - 0.03]} color={T.steel} edge={false} />
          <Box size={[(w - bw) / 2, 0.05, d]} pos={[s * (bw / 2 + (w - bw) / 4), hgt - 0.025, 0]} color={top} />
        </group>
      ))}
      <Box size={[bw, 0.05, d / 2 - bd / 2 + bz]} pos={[0, hgt - 0.025, d / 2 - (d / 2 - bd / 2 + bz) / 2]} color={top} />
      <Box size={[bw, 0.05, d / 2 - bd / 2 - bz]} pos={[0, hgt - 0.025, -d / 2 + (d / 2 - bd / 2 - bz) / 2]} color={top} />
      <group position={[0, y0 - deep, -bz]}>
        <Box size={[bw, wl, bd]} pos={[0, wl / 2, 0]} color="#9EA4A8" metal={0.6} rough={0.35} />
        <Box size={[bw, deep + 0.05, wl]} pos={[0, (deep + 0.05) / 2, -bd / 2 + wl / 2]} color={T.steel} metal={0.6} rough={0.35} />
        <Box size={[wl, deep + 0.05, bd]} pos={[-bw / 2 + wl / 2, (deep + 0.05) / 2, 0]} color={T.steel} metal={0.6} rough={0.35} />
        <Box size={[wl, deep + 0.05, bd]} pos={[bw / 2 - wl / 2, (deep + 0.05) / 2, 0]} color={T.steel} metal={0.6} rough={0.35} />
        <Box size={[bw, deep + 0.05, wl]} pos={[0, (deep + 0.05) / 2, bd / 2 - wl / 2]} color={T.steel} metal={0.6} rough={0.35} />
        <Cyl r={0.025} h={0.004} pos={[0, wl + 0.002, 0]} color={T.dark} edge={false} />
      </group>
      <group position={[0, hgt, -d / 2 + 0.07]}>
        <Cyl r={0.025} h={0.06} pos={[0, 0.03, 0]} color={T.steel} metal={0.7} rough={0.3} />
        <Tube pts={[[0, 0.05, 0], [0, 0.3, 0], [0, 0.34, 0.06], [0, 0.3, 0.16]]} r={0.014} color={T.steel} metal={0.7} rough={0.3} />
        <Box size={[0.02, 0.02, 0.07]} pos={[0.05, 0.07, 0.02]} rot={[0, 0.5, 0]} color={T.steel} metal={0.7} rough={0.3} />
        {flow > 0.01 && (
          <Cyl r={0.006 * flow + 0.002 * Math.sin(3 * t) * flow} h={0.3 + deep - 0.02} pos={[0, 0.3 - (0.3 + deep - 0.02) / 2, 0.16]} color={T.water} opacity={0.75} edge={false} shadow={false} />
        )}
      </group>
    </group>
  );
};

// A countertop microwave, 0.5 m wide. The door (left, glass in a real gap) swings open with open = 0..1, hinged on
// the left, so look from the right (az > 0). on = 0..1 lights the inside warm and turns the plate. Children sit on
// the plate (y = 0 is the plate top), so a thing can be put in.
export const Microwave: React.FC<{ pos?: V3; rot?: number; open?: number; on?: number; t?: number; color?: string; children?: React.ReactNode }> = ({
  pos = [0, 0, 0], rot = 0, open = 0, on = 0, t = 0, color = T.white, children,
}) => {
  const W = 0.5, D = 0.38, H = 0.3, k = 0.02, cw = 0.12, iw = W - cw - 2 * k;
  const glow = on > 0.01 ? '#F2C96A' : '#5A6066';
  const ix = -W / 2 + k + iw / 2;
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <Box size={[W, k, D]} pos={[0, k / 2, 0]} color={color} />
      <Box size={[W, k, D]} pos={[0, H - k / 2, 0]} color={color} />
      <Box size={[k, H, D]} pos={[-W / 2 + k / 2, H / 2, 0]} color={color} />
      <Box size={[W, H, k]} pos={[0, H / 2, -D / 2 + k / 2]} color={color} />
      <Box size={[cw + k, H, D]} pos={[W / 2 - (cw + k) / 2, H / 2, 0]} color={color} />
      <Box size={[iw, H - 2 * k, 0.004]} pos={[ix, H / 2, -D / 2 + k + 0.003]} color={glow} edge={false} shadow={false} />
      <Box size={[cw * 0.7, 0.05, 0.006]} pos={[W / 2 - cw / 2 - k / 2, H - 0.07, D / 2 + 0.004]} color={T.dark} edge={false} shadow={false} />
      {[0, 1, 2].map((i) => <Cyl key={i} r={0.016} h={0.01} rot={[Math.PI / 2, 0, 0]} pos={[W / 2 - cw / 2 - k / 2, H - 0.14 - i * 0.05, D / 2 + 0.005]} color={T.dark} edge={false} />)}
      <group position={[ix, k, 0]} rotation={[0, on * 1.2 * t, 0]}>
        <Cyl r={0.12} h={0.008} pos={[0, 0.004, 0]} color="#DCE3E6" opacity={0.85} />
        <group position={[0, 0.008, 0]}>{children}</group>
      </group>
      <group position={[-W / 2, H / 2, D / 2]} rotation={[0, -1.8 * open, 0]}>
        <Box size={[iw + k, 0.05, 0.03]} pos={[(iw + k) / 2, H / 2 - 0.025, 0.015]} color={color} />
        <Box size={[iw + k, 0.05, 0.03]} pos={[(iw + k) / 2, -H / 2 + 0.025, 0.015]} color={color} />
        <Box size={[0.05, H - 0.1, 0.03]} pos={[0.025, 0, 0.015]} color={color} />
        <Box size={[0.05, H - 0.1, 0.03]} pos={[iw + k - 0.025, 0, 0.015]} color={color} />
        <Box size={[iw + k - 0.1, H - 0.1, 0.006]} pos={[(iw + k) / 2, 0, 0.012]} color={on > 0.01 ? '#F6DC9A' : '#3F454A'} opacity={0.35} edge={false} shadow={false} />
      </group>
    </group>
  );
};

// A bed against a back wall: frame, mattress, pillow and a blanket. w across (x), len along z, the head end at -z.
// The mattress top is at y = hgt; a lying Person goes at pos [x, hgt + 0.125, headZ + 1.66] with rot={[-PI/2,0,0]} on a group.
// cover = 0..1 pulls the blanket from the foot end up to the chest. open = 0..1 cuts the mattress across at `at`
// (0..1 of len from the head end) and slides the foot piece 0.5 m toward +z, showing the section in `core` with
// foam pores (a cut-away); a blanket short enough to lie on the foot piece goes with it.
const PORES = Array.from({ length: 22 }, (_, i) => [h(i, 7) * 2 - 1, h(i, 8) * 2 - 1, 0.04 + 0.07 * h(i, 9)]);
export const Bed: React.FC<{ pos?: V3; w?: number; len?: number; hgt?: number; frame?: string; sheet?: string; pillow?: string; blanket?: string; cover?: number; open?: number; at?: number; core?: string }> = ({
  pos = [0, 0, 0], w = 1.0, len = 2.0, hgt = 0.5, frame = '#8E6542', sheet = '#F1EEE6', pillow = T.white, blanket = '#6C8FB8', cover = 0.5, open = 0, at = 0.8, core = '#EDE0BC',
}) => {
  const bl = 0.35 + 1.15 * cover;
  const zc = -len / 2 + at * len, fl = len / 2 - zc, sl = 0.5 * open, mh = hgt - 0.3, my = 0.3 + mh / 2;
  const cut = open > 0.001;
  const rides = cut && bl <= fl;
  const Sec = ({ s }: { s: number }) => (
    <group position={[0, my - 0.015, zc + s * 0.004]}>
      <Box size={[w - 0.02, mh - 0.03, 0.004]} color={core} edge={false} />
      {PORES.map(([u, v, r], i) => (
        <Cyl key={i} r={r * mh} h={0.003} pos={[(u * (w - 0.1)) / 2, (v * (mh - 0.08)) / 2, s * 0.003]} rot={[Math.PI / 2, 0, 0]} color="#D3C08F" edge={false} shadow={false} />
      ))}
    </group>
  );
  const Blanket = () => (
    <>
      <Box size={[w + 0.04, 0.06, bl]} pos={[0, hgt + 0.08, len / 2 - bl / 2 + 0.02]} color={blanket} />
      <Box size={[0.03, hgt - 0.22, bl]} pos={[-w / 2 - 0.015, 0.3 + (hgt - 0.22) / 2 - 0.02, len / 2 - bl / 2 + 0.02]} color={blanket} edge={false} />
      <Box size={[0.03, hgt - 0.22, bl]} pos={[w / 2 + 0.015, 0.3 + (hgt - 0.22) / 2 - 0.02, len / 2 - bl / 2 + 0.02]} color={blanket} edge={false} />
    </>
  );
  return (
    <group position={pos}>
      <Box size={[w + 0.08, 0.25, len + 0.06]} pos={[0, 0.17, 0]} color={frame} />
      {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.06, 0.06, 0.06]} pos={[sx * (w / 2 - 0.02), 0.03, sz * (len / 2 - 0.02)]} color={frame} />))}
      <Box size={[w + 0.08, 0.95, 0.07]} pos={[0, 0.48, -len / 2 - 0.035]} color={frame} />
      {cut ? (
        <>
          <Box size={[w, mh, len - fl]} pos={[0, my, (-len / 2 + zc) / 2]} color={sheet} />
          <Sec s={1} />
          <group position={[0, 0, sl]}>
            <Box size={[w, mh, fl]} pos={[0, my, zc + fl / 2]} color={sheet} />
            <Sec s={-1} />
            {rides && <Blanket />}
          </group>
        </>
      ) : (
        <Box size={[w, mh, len]} pos={[0, my, 0]} color={sheet} />
      )}
      <Box size={[w * 0.62, 0.1, 0.36]} pos={[0, hgt + 0.05, -len / 2 + 0.25]} color={pillow} />
      {!rides && <Blanket />}
    </group>
  );
};

// A bedside table with one drawer, top at y = hgt.
export const Nightstand: React.FC<{ pos?: V3; w?: number; d?: number; hgt?: number; color?: string }> = ({
  pos = [0, 0, 0], w = 0.45, d = 0.4, hgt = 0.55, color = '#A47A52',
}) => (
  <group position={pos}>
    <Box size={[w, hgt - 0.04, d]} pos={[0, (hgt - 0.04) / 2 + 0.04, 0]} color={color} />
    <Box size={[w - 0.06, 0.16, 0.02]} pos={[0, hgt - 0.14, d / 2 + 0.01]} color={color} />
    <Box size={[0.08, 0.02, 0.02]} pos={[0, hgt - 0.14, d / 2 + 0.03]} color={T.dark} edge={false} />
    {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.04, 0.04, 0.04]} pos={[sx * (w / 2 - 0.03), 0.02, sz * (d / 2 - 0.03)]} color={T.dark} />))}
  </group>
);

// A small table lamp. on = 0..1 lights the shade warm and throws a soft glow disc on the surface under it.
export const DeskLamp: React.FC<{ pos?: V3; on?: number; shade?: string }> = ({ pos = [0, 0, 0], on = 1, shade = '#E9DCC0' }) => (
  <group position={pos}>
    <Cyl r={0.07} h={0.02} pos={[0, 0.01, 0]} color={T.dark} />
    <Cyl r={0.012} h={0.26} pos={[0, 0.15, 0]} color={T.dark} edge={false} />
    <Cyl r={0.06} r2={0.11} h={0.14} pos={[0, 0.32, 0]} color={on > 0.5 ? '#F6D98A' : shade} />
    {on > 0.01 && <Cyl r={0.26} h={0.002} pos={[0, 0.002, 0]} color="#F6D98A" opacity={0.35 * on} edge={false} shadow={false} />}
  </group>
);

// A phone, 7.5 x 15.5 cm, lying in its own x-z plane with the screen up (+y). on = 0..1 lights the screen;
// tint is the screen colour when lit. Rotate it with `rot` to hold it in a hand; shadow={false} when held over a face.
export const Phone: React.FC<{ pos?: V3; rot?: V3; on?: number; tint?: string; scale?: number; shadow?: boolean }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], on = 1, tint = '#9FD3F2', scale = 1, shadow = true }) => (
  <group position={pos} rotation={rot} scale={scale}>
    <Box size={[0.075, 0.009, 0.155]} pos={[0, 0.0045, 0]} color="#2B2F33" shadow={shadow} />
    <Box size={[0.066, 0.002, 0.142]} pos={[0, 0.0095, 0]} color={on > 0.01 ? tint : '#14171A'} edge={false} shadow={false} />
    <Box size={[0.02, 0.002, 0.004]} pos={[0, 0.0098, -0.066]} color="#14171A" edge={false} shadow={false} />
  </group>
);

// A round wall clock facing +z. Hours as a float (1.5 = half past one); the hands follow it.
export const WallClock: React.FC<{ pos: V3; r?: number; hours: number; face?: string; rim?: string }> = ({ pos, r = 0.17, hours, face = T.white, rim = T.dark }) => (
  <group position={pos}>
    <group rotation={[Math.PI / 2, 0, 0]}>
      <Cyl r={r} h={0.03} color={face} />
      <Cyl r={r + 0.012} h={0.02} pos={[0, -0.006, 0]} color={rim} />
    </group>
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <Box key={i} size={[0.008, i % 3 ? 0.012 : 0.024, 0.004]} pos={[0.82 * r * Math.sin(a), 0.82 * r * Math.cos(a), 0.018]} rot={[0, 0, -a]} color={T.ink} edge={false} shadow={false} />;
    })}
    {[{ a: (hours / 12) * Math.PI * 2, l: 0.5 * r, w: 0.022 }, { a: (hours % 1) * Math.PI * 2, l: 0.8 * r, w: 0.013 }].map(({ a, l, w }, i) => (
      <group key={i} position={[0, 0, 0.022 + 0.005 * i]} rotation={[0, 0, -a]}>
        <Box size={[w, l, 0.005]} pos={[0, l / 2, 0]} color={T.ink} edge={false} shadow={false} />
      </group>
    ))}
  </group>
);

// A mug with a handle; fill colour is the drink (coffee by default). steam = 0..1 puts rising puffs over it.
export const Mug: React.FC<{ pos?: V3; color?: string; drink?: string; steam?: number; t?: number }> = ({ pos = [0, 0, 0], color = T.white, drink = '#5A3825', steam = 0, t = 0 }) => (
  <group position={pos}>
    <Lathe profile={[[0, 0], [0.042, 0], [0.045, 0.1], [0.04, 0.1], [0.038, 0.008], [0, 0.008]]} color={color} smooth />
    <Cyl r={0.039} h={0.004} pos={[0, 0.085, 0]} color={drink} edge={false} />
    <Tube pts={[[0.044, 0.08, 0], [0.075, 0.075, 0], [0.078, 0.035, 0], [0.044, 0.025, 0]]} r={0.008} color={color} />
    {steam > 0.01 && Array.from({ length: 4 }, (_, i) => {
      const u = (t * 0.35 + i / 4) % 1;
      return <Ball key={i} r={0.012 + 0.016 * u} pos={[0.015 * Math.sin(5 * u + i), 0.11 + 0.22 * u, 0.01 * Math.cos(4 * u + i)]} color={T.white} opacity={0.6 * (1 - u) * steam} shadow={false} />;
    })}
  </group>
);

// A step-through scooter (motor matic), 1.85 m, front toward +x, standing on y = 0. rider = true seats a rider in
// a helmet with hands on the bar; nod tips the rider's head forward (radians, 0 upright), lean leans the bike into
// a turn. head = false leaves the head out so a piece can draw its own (e.g. a cutaway) at bikeNeck.
// children draw in the rider's frame in place of the head. lights = 0..1 head and tail lamps. Wheels at x = -0.62, 0.63.
// Arms: sleeve = share of the arm (shoulder to wrist) the shirt covers (1 long sleeve, ~0.35 short); skin is the bare
// arm and hand, pale the skin above tanLine (same share), so a rolled-up sleeve shows a tan line. Back of hand faces up.
export const bikeNeck: V3 = [-0.17, 1.5, 0];
export const bikeHand = (s: 1 | -1): V3 => [0.41, 1.15, s * 0.37];
const SH = [-0.2, 1.38, 0.2], EL = [0.05, 1.2, 0.27], WR = [0.36, 1.13, 0.33];
const armAt = (u: number, s: number): V3 => {
  const l1 = 0.31, l2 = 0.32, d = u * (l1 + l2);
  const [a, b, k] = d <= l1 ? [SH, EL, d / l1] : [EL, WR, (d - l1) / l2];
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, s * (a[2] + (b[2] - a[2]) * k)];
};
const RiderArm: React.FC<{ s: number; sleeve: number; tanLine: number; shirt: string; skin: string; pale: string }> = ({ s, sleeve, tanLine, shirt, skin, pale }) => {
  const seg = (u0: number, u1: number, color: string, r: number) => {
    if (u1 - u0 < 0.004) return null;
    const pts: V3[] = [armAt(u0, s)];
    if (u0 < 0.49 && u1 > 0.49) pts.push(armAt(0.49, s));
    pts.push(armAt(u1, s));
    return <Tube key={`${color}${u0}`} pts={pts} r={r} color={color} />;
  };
  const sl = Math.min(1, Math.max(0, sleeve));
  const tl = Math.max(sl, tanLine);
  return (
    <>
      {seg(0, sl, shirt, 0.05)}
      {seg(sl, tl, pale, 0.042)}
      {seg(tl, 1, skin, 0.04)}
      {sl > 0.47 && sl < 1 && <Ball r={0.05} pos={armAt(sl, s)} color={shirt} />}
      <Ball r={0.042} pos={armAt(0.49, s)} color={sl > 0.49 ? shirt : tl > 0.49 ? pale : skin} />
      {/* hand on the grip: back of the hand up, fingers wrapped round the front */}
      <group position={bikeHand(s as 1 | -1)} scale={[1.35, 0.6, 1.1]}>
        <Ball r={0.05} color={skin} />
      </group>
      {[-0.03, 0, 0.03].map((z) => (
        <Tube key={z} pts={[[0.44, 1.15, s * 0.37 + z], [0.465, 1.11, s * 0.37 + z], [0.44, 1.075, s * 0.37 + z]]} r={0.014} color={skin} />
      ))}
    </>
  );
};
export const Motorbike: React.FC<{
  pos?: V3; rot?: number; body?: string; rider?: boolean; head?: boolean; nod?: number; lean?: number; lights?: number;
  shirt?: string; pants?: string; helmet?: string; t?: number; children?: React.ReactNode;
  sleeve?: number; tanLine?: number; skin?: string; pale?: string;
}> = ({ pos = [0, 0, 0], rot = 0, body = T.white, rider = false, head = true, nod = 0, lean = 0, lights = 0, shirt = '#4F6D8A', pants = '#2E3238', helmet = T.dark, t = 0, children,
  sleeve = 1, tanLine = 0, skin = '#C08A62', pale }) => {
  const sway = 0.006 * Math.sin(1.7 * t);
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <group rotation={[lean, 0, 0]}>
        {[-0.62, 0.63].map((x) => (
          <group key={x}>
            <Cyl r={0.27} h={0.1} pos={[x, 0.27, 0]} rot={[Math.PI / 2, 0, 0]} color={T.rubber} />
            <Cyl r={0.15} h={0.11} pos={[x, 0.27, 0]} rot={[Math.PI / 2, 0, 0]} color={T.steel} metal={0.5} rough={0.4} edge={false} />
          </group>
        ))}
        {/* front fork and fender */}
        <Box size={[0.06, 0.78, 0.16]} pos={[0.56, 0.62, 0]} rot={[0, 0, 0.42]} color={T.steel} />
        <Box size={[0.42, 0.05, 0.14]} pos={[0.66, 0.58, 0]} rot={[0, 0, -0.15]} color={body} />
        {/* leg shield, headlamp cowl, handlebar with grips and mirrors */}
        <Box size={[0.1, 0.62, 0.46]} pos={[0.4, 0.7, 0]} rot={[0, 0, 0.3]} color={body} />
        <Box size={[0.26, 0.16, 0.36]} pos={[0.48, 1.04, 0]} rot={[0, 0, 0.2]} color={body} />
        <Box size={[0.03, 0.08, 0.16]} pos={[0.62, 1.03, 0]} rot={[0, 0, 0.2]} color={lights > 0 ? '#FFF2B8' : '#ECEAE0'} edge={false} />
        <Tube pts={[[0.42, 1.1, -0.36], [0.46, 1.13, 0], [0.42, 1.1, 0.36]]} r={0.016} color={T.dark} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Cyl r={0.022} h={0.12} pos={[0.42, 1.1, s * 0.38]} rot={[Math.PI / 2, 0, 0]} color={T.rubber} />
            <Tube pts={[[0.45, 1.12, s * 0.26], [0.44, 1.3, s * 0.3]]} r={0.008} color={T.dark} />
            <Box size={[0.02, 0.06, 0.1]} pos={[0.44, 1.33, s * 0.31]} color={T.dark} />
          </group>
        ))}
        {/* floorboard, rear body over the engine, seat, tail lamp, exhaust */}
        <Box size={[0.48, 0.06, 0.34]} pos={[0.08, 0.36, 0]} color={T.dark} />
        <Box size={[0.86, 0.34, 0.36]} pos={[-0.42, 0.6, 0]} color={body} />
        <Box size={[0.5, 0.22, 0.24]} pos={[-0.5, 0.36, 0.06]} color={T.dark} />
        <Box size={[0.8, 0.1, 0.32]} pos={[-0.36, 0.82, 0]} color={T.rubber} />
        <Box size={[0.04, 0.07, 0.18]} pos={[-0.86, 0.68, 0]} color={lights > 0 ? '#E8432A' : '#B4483A'} edge={false} />
        <Tube pts={[[-0.3, 0.3, 0.2], [-0.7, 0.32, 0.2], [-0.92, 0.42, 0.18]]} r={0.04} color={T.steel} />
        {rider && (
          <group position={[0, sway, 0]}>
            {[-1, 1].map((s) => (
              <group key={s}>
                <Box size={[0.42, 0.15, 0.15]} pos={[-0.08, 0.92, s * 0.11]} rot={[0, 0, 0.12]} color={pants} />
                <Box size={[0.13, 0.48, 0.13]} pos={[0.12, 0.62, s * 0.13]} rot={[0, 0, -0.12]} color={pants} />
                <Box size={[0.26, 0.08, 0.12]} pos={[0.18, 0.41, s * 0.13]} color={T.rubber} />
                <RiderArm s={s} sleeve={sleeve} tanLine={tanLine} shirt={shirt} skin={skin} pale={pale ?? skin} />
              </group>
            ))}
            <Box size={[0.26, 0.56, 0.4]} pos={[-0.26, 1.18, 0]} rot={[0, 0, -0.18]} color={shirt} />
            {!head && children}
            {head && (
              <group position={bikeNeck} rotation={[0, 0, -nod]}>
                <Cyl r={0.05} h={0.1} pos={[0, 0.03, 0]} color={skin} />
                <Ball r={0.12} pos={[0.02, 0.15, 0]} color={skin} />
                {[-1, 1].map((s) => <Ball key={s} r={0.014} pos={[0.13, 0.17, s * 0.045]} color={T.ink} edge={false} />)}
                <Lathe profile={[[0.0005, 0.155], [0.08, 0.14], [0.135, 0.09], [0.155, 0.02], [0.15, -0.04], [0.13, -0.04], [0.135, 0.02], [0.12, 0.08], [0.07, 0.125], [0.0005, 0.135]]} cut={110} open={90} pos={[0.0, 0.15, 0]} color={helmet} smooth />
              </group>
            )}
          </group>
        )}
      </group>
    </group>
  );
};

// A front-loading washing machine or tumble dryer, 0.6 x 0.85 x 0.6 m, door facing +z at WM_DOOR. spin = turns
// per second of the load; water = 0..1 tints the drum blue, heat = 0..1 glows it orange (a dryer). load colours
// the laundry; children turn with it, origin at the drum centre, +z toward the glass (keep them at z <= 0.016).
export const WM_DOOR: V3 = [0, 0.44, 0.33];
export const WashingMachine: React.FC<{ pos?: V3; rot?: number; t?: number; spin?: number; water?: number; heat?: number; load?: string; color?: string; children?: React.ReactNode }> = ({
  pos = [0, 0, 0], rot = 0, t = 0, spin = 0, water = 0, heat = 0, load = '#9DB7CF', color = T.white, children,
}) => {
  const [dx, dy, dz] = WM_DOOR;
  const R: V3 = [Math.PI / 2, 0, 0];
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <Box size={[0.6, 0.83, 0.58]} pos={[0, 0.435, 0]} color={color} />
      {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.06, 0.02, 0.06]} pos={[sx * 0.24, 0.01, sz * 0.22]} color={T.dark} edge={false} />))}
      <Box size={[0.58, 0.1, 0.012]} pos={[0, 0.78, 0.296]} color="#E1E3E0" edge={false} />
      <Box size={[0.14, 0.05, 0.012]} pos={[-0.15, 0.78, 0.302]} color="#2F3A40" edge={false} />
      <Cyl r={0.035} h={0.03} pos={[0.18, 0.78, 0.305]} rot={R} color="#C9CCCB" />
      <Cyl r={0.2} h={0.01} pos={[dx, dy, 0.296]} rot={R} color="#2B3136" edge={false} />
      <group position={[dx, dy, 0.312]} rotation={[0, 0, 2 * Math.PI * spin * t]}>
        {Array.from({ length: 6 }, (_, i) => {
          const b = (i / 6) * 2 * Math.PI;
          return (
            <group key={i} position={[0.1 * Math.cos(b), 0.1 * Math.sin(b), 0]} scale={[1, 1, 0.25]}>
              <Ball r={0.07} color={i % 2 ? load : T.white} shadow={false} />
            </group>
          );
        })}
        {children}
      </group>
      {water > 0.01 && <Cyl r={0.19} h={0.002} pos={[dx, dy, 0.331]} rot={R} color={T.water} opacity={0.6 * water} edge={false} shadow={false} />}
      {heat > 0.01 && <Cyl r={0.19} h={0.002} pos={[dx, dy, 0.332]} rot={R} color={T.orange} opacity={0.45 * heat} edge={false} shadow={false} />}
      <Cyl r={0.19} h={0.004} pos={[dx, dy, dz + 0.006]} rot={R} color="#D6EAF4" opacity={0.22} edge={false} shadow={false} />
      <Lathe profile={[[0.19, -0.025], [0.245, -0.025], [0.245, 0.025], [0.19, 0.025]]} pos={[dx, dy, dz]} rot={R} color="#D0D4D6" />
    </group>
  );
};

// A month calendar on a wall that faces +z: 7 x 4 day cells, 0 = top left. marks light up one by one as lit goes 0..1.
export const WallCalendar: React.FC<{ pos: V3; marks?: number[]; lit?: number; markColor?: string; head?: string }> = ({ pos, marks = [], lit = 1, markColor = T.green, head = T.red }) => (
  <group position={pos}>
    <Box size={[0.42, 0.52, 0.012]} color={T.white} />
    <Box size={[0.42, 0.1, 0.008]} pos={[0, 0.21, 0.01]} color={head} edge={false} />
    {Array.from({ length: 28 }, (_, i) => {
      const k = marks.indexOf(i);
      const on = k >= 0 && lit * marks.length > k + 0.01;
      return <Box key={i} size={[0.044, 0.07, 0.006]} pos={[-0.165 + (i % 7) * 0.055, 0.1 - Math.floor(i / 7) * 0.085, 0.01]} color={on ? markColor : '#E4E1D8'} edge={false} />;
    })}
    <Cyl r={0.012} h={0.03} pos={[0, 0.27, 0.01]} rot={[Math.PI / 2, 0, 0]} color={T.dark} edge={false} />
  </group>
);

// A three-seat sofa facing +z, back against -z, seat cushions on top at y = seat. w across (x), d deep (z).
export const Sofa: React.FC<{ pos?: V3; rot?: number; w?: number; d?: number; seat?: number; color?: string; cushion?: string; leg?: string }> = ({
  pos = [0, 0, 0], rot = 0, w = 2.2, d = 0.85, seat = 0.45, color = '#9C8B73', cushion = '#BCAB90', leg = '#5A4634',
}) => {
  const arm = 0.18, back = 0.2, iw = w - 2 * arm, cw = iw / 3;
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      {[-1, 1].map((sx) => [-1, 1].map((sz) => <Cyl key={`${sx}${sz}`} r={0.025} h={0.1} pos={[sx * (w / 2 - 0.08), 0.05, sz * (d / 2 - 0.08)]} color={leg} />))}
      <Box size={[w, 0.2, d]} pos={[0, 0.2, 0]} color={color} />
      <Box size={[w, 0.6, back]} pos={[0, 0.6, -d / 2 + back / 2]} color={color} />
      {[-1, 1].map((sx) => <Box key={sx} size={[arm, 0.32, d]} pos={[sx * (w / 2 - arm / 2), 0.46, 0]} color={color} />)}
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <Box size={[cw - 0.02, seat - 0.3, d - back - 0.02]} pos={[-iw / 2 + cw * (i + 0.5), 0.3 + (seat - 0.3) / 2, back / 2]} color={cushion} />
          <Box size={[cw - 0.02, 0.4, 0.12]} pos={[-iw / 2 + cw * (i + 0.5), seat + 0.2, -d / 2 + back + 0.07]} rot={[-0.12, 0, 0]} color={cushion} />
        </group>
      ))}
    </group>
  );
};

// A standing fan facing +z. t spins the blades (slow enough not to alias at 30 fps); sweep = 0..1 swings the head.
export const Fan: React.FC<{ pos?: V3; rot?: number; t?: number; on?: number; sweep?: number; hgt?: number; color?: string; blade?: string }> = ({
  pos = [0, 0, 0], rot = 0, t = 0, on = 1, sweep = 1, hgt = 1.1, color = T.white, blade = '#A9CBDD',
}) => {
  const yaw = sweep * 0.5 * Math.sin(0.6 * t), spin = on * 2 * Math.PI * 0.7 * t;
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <Cyl r={0.2} h={0.04} pos={[0, 0.02, 0]} color={color} />
      <Cyl r={0.022} h={hgt - 0.1} pos={[0, (hgt - 0.1) / 2 + 0.04, 0]} color={T.steel} />
      <group position={[0, hgt, 0]} rotation={[0, yaw, 0]}>
        <Box size={[0.12, 0.13, 0.17]} pos={[0, 0, -0.1]} color={color} />
        <group position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <Lathe profile={[[0.25, -0.07], [0.27, -0.07], [0.27, 0.07], [0.25, 0.07]]} color={T.steel} />
          <Cyl r={0.25} h={0.13} color={T.steel} opacity={0.15} edge={false} shadow={false} />
          <Cyl r={0.04} h={0.06} color={color} />
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, spin + (i * 2 * Math.PI) / 3, 0]}>
              <Box size={[0.08, 0.008, 0.19]} pos={[0, 0, 0.13]} rot={[0, 0, 0.25]} color={blade} />
            </group>
          ))}
        </group>
      </group>
    </group>
  );
};

// A long backless wooden bench (bangku teras), seat top at y = hgt, w across (x). For a person sitting on it:
// Person sit = 0.55 at y = hgt - 0.81 puts the hips on the seat and the feet on the floor.
export const Bench: React.FC<{ pos?: V3; rot?: number; w?: number; d?: number; hgt?: number; color?: string; leg?: string }> = ({
  pos = [0, 0, 0], rot = 0, w = 2, d = 0.42, hgt = 0.5, color = '#B98A5E', leg = '#8E6542',
}) => (
  <group position={pos} rotation={[0, rot, 0]}>
    {[-1, 0, 1].map((k) => <Box key={k} size={[w, 0.05, d / 3 - 0.015]} pos={[0, hgt - 0.025, (k * d) / 3]} color={color} />)}
    <Box size={[w - 0.2, 0.08, d - 0.1]} pos={[0, hgt - 0.09, 0]} color={leg} edge={false} />
    {[-1, 1].map((sx) => (
      <group key={sx}>
        <Box size={[0.06, hgt - 0.05, d - 0.06]} pos={[sx * (w / 2 - 0.15), (hgt - 0.05) / 2, 0]} color={leg} />
        <Box size={[0.08, 0.04, d]} pos={[sx * (w / 2 - 0.15), 0.02, 0]} color={leg} />
      </group>
    ))}
  </group>
);

// An Aedes mosquito (black with white bands and white-banded legs), nose toward +z, always drawn enlarged
// (about 0.35 units long at s = 1). t beats the wings slowly (2 Hz, so it doesn't alias at 30 fps).
// The feathery antennae run from ANT_BASE to ANT_TIP (x mirrored); children draw in its frame, e.g. marks on them.
export const ANT_BASE: V3 = [0.012, 0.012, 0.13];
export const ANT_TIP: V3 = [0.07, 0.08, 0.22];
export const Mosquito: React.FC<{ pos: V3; yaw?: number; pitch?: number; s?: number; t?: number; opacity?: number; children?: React.ReactNode }> = ({
  pos, yaw = 0, pitch = 0, s = 1, t = 0, opacity = 1, children,
}) => {
  if (opacity <= 0.01) return null;
  const o = opacity, blk = '#161616', wht = '#F2F2F2';
  const flap = 0.35 * Math.sin(2 * Math.PI * 2 * t);
  const leg = (sx: number, z: number, k: number): V3[] => [[0, -0.01, z], [sx * 0.07, 0.04, z + 0.015 * k], [sx * 0.15, -0.06, z + 0.04 * k], [sx * 0.19, -0.16, z + 0.07 * k]];
  return (
    <group position={pos} rotation={[pitch, yaw, 0]} scale={s}>
      <Ball r={0.045} pos={[0, 0, 0.05]} color={blk} opacity={o} />
      <Box size={[0.012, 0.004, 0.05]} pos={[0, 0.044, 0.055]} color={wht} opacity={o} edge={false} />
      <Ball r={0.028} pos={[0, -0.005, 0.11]} color={blk} opacity={o} />
      <Ball r={0.018} pos={[0.018, 0.004, 0.122]} color="#3A3F44" opacity={o} edge={false} />
      <Ball r={0.018} pos={[-0.018, 0.004, 0.122]} color="#3A3F44" opacity={o} edge={false} />
      <Cyl r={0.005} h={0.11} pos={[0, -0.03, 0.18]} rot={[Math.PI / 2 + 0.35, 0, 0]} color={blk} opacity={o} edge={false} />
      {[1, -1].map((sx) => {
        const a: V3 = [sx * ANT_BASE[0], ANT_BASE[1], ANT_BASE[2]], b: V3 = [sx * ANT_TIP[0], ANT_TIP[1], ANT_TIP[2]];
        return (
          <group key={sx}>
            <Tube pts={[a, b]} r={0.004} color={blk} opacity={o} />
            {[0.25, 0.45, 0.65, 0.85].map((u) => (
              <Tube key={u} pts={[[mixV(a[0], b[0], u) - 0.012, mixV(a[1], b[1], u) + 0.012, mixV(a[2], b[2], u) + 0.006], [mixV(a[0], b[0], u) + 0.012, mixV(a[1], b[1], u) - 0.012, mixV(a[2], b[2], u) - 0.006]]} r={0.0022} color="#4A4F55" opacity={o} />
            ))}
          </group>
        );
      })}
      <group position={[0, 0.005, -0.09]} scale={[0.6, 0.55, 2]}>
        <Ball r={0.05} color={blk} opacity={o} />
      </group>
      {[-0.04, -0.08, -0.12].map((z, i) => <Cyl key={i} r={0.029 - i * 0.004} h={0.009} pos={[0, 0.005, z]} rot={[Math.PI / 2, 0, 0]} color={wht} opacity={o} edge={false} />)}
      {[[1, 0.07, 1], [1, 0.05, 0], [1, 0.03, -1], [-1, 0.07, 1], [-1, 0.05, 0], [-1, 0.03, -1]].map(([sx, z, k], i) => {
        const p = leg(sx, z, k);
        return (
          <group key={i}>
            <Tube pts={p} r={0.0045} color={blk} opacity={o} />
            <Ball r={0.007} pos={p[2]} color={wht} opacity={o} edge={false} />
          </group>
        );
      })}
      {[1, -1].map((sx) => (
        <group key={sx} position={[sx * 0.02, 0.035, 0.03]} rotation={[0, sx * 0.25, sx * (0.3 + flap)]}>
          <Box size={[0.19, 0.003, 0.055]} pos={[sx * 0.095, 0, -0.035]} color="#DDE4E8" opacity={0.55 * o} edge={false} />
        </group>
      ))}
      {children}
    </group>
  );
};
const mixV = (a: number, b: number, u: number) => a + (b - a) * u;
