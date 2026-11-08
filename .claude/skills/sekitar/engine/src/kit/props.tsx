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
