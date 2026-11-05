import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { applyCam, Cam, V3 } from './camera';
import { T } from './theme';

const Rig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera & { manual?: boolean };
  const { width, height } = useVideoConfig();
  camera.manual = true;
  applyCam(camera, cam, width, height);
  return null;
};

// The 3D layer. Flat diffuse shading plus outlines gives the clean technical-drawing look.
export const Stage: React.FC<{ cam: Cam; blur?: number; children: React.ReactNode }> = ({ cam, blur = 0, children }) => {
  const { width, height } = useVideoConfig();
  // The shadow box follows the camera so one map stays sharp however far the film travels.
  const aim = useMemo(() => new THREE.Object3D(), []);
  const R = Math.max(10, cam.width * 1.1);
  const [x, y, z] = cam.target;
  return (
    <div style={{ position: 'absolute', inset: 0, filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
      <ThreeCanvas width={width} height={height} orthographic flat shadows="soft" dpr={1} gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}>
        <Rig cam={cam} />
        <hemisphereLight args={['#ffffff', '#b9b2a2', 2.1]} />
        <primitive object={aim} position={[x, y, z]} />
        <directionalLight
          position={[x + 9, y + 18, z + 11]}
          target={aim}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-R}
          shadow-camera-right={R}
          shadow-camera-top={R}
          shadow-camera-bottom={-R}
          shadow-camera-near={1}
          shadow-camera-far={90}
          shadow-bias={-0.0006}
          shadow-radius={5}
        />
        {children}
      </ThreeCanvas>
    </div>
  );
};

// Reflections for anything using `metal`/`rough`, generated here so no HDRI file is needed. Put one in the scene.
export const Env: React.FC = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    pm.dispose();
  }, [gl, scene]);
  return null;
};

export type Common = {
  pos?: V3;
  rot?: V3;
  scale?: number;
  color?: string;
  opacity?: number;
  edge?: boolean;
  edgeAngle?: number;
  metal?: number;
  rough?: number;
  // false keeps a small part from throwing a shadow (e.g. swimming things whose shadows read as ghosts)
  shadow?: boolean;
};

// Comic shading (Azriel, 3 Nov 2026, after the fig. Why retaining-wall short): faces in shade get a screen-space
// halftone of ink dots that grow as the light drops; lit faces stay clean. Dots are 9 px on a 45° grid.
// Off since 4 Nov 2026: films are flat minimal cartoons now (Azriel). Kept for a piece that asks for it.
export const HALFTONE = false;
const halftone = (sh: { fragmentShader: string }) => {
  if (!HALFTONE) return;
  sh.fragmentShader = sh.fragmentShader.replace(
    '#include <opaque_fragment>',
    `{
      float lum = dot(outgoingLight / max(diffuseColor.rgb, vec3(0.05)), vec3(0.3333));
      float shade = clamp((1.05 - lum) / 0.55, 0.0, 1.0);
      vec2 q = mat2(0.7071, -0.7071, 0.7071, 0.7071) * gl_FragCoord.xy / 9.0;
      float d = length(fract(q) - 0.5);
      outgoingLight *= mix(1.0, 0.68, (1.0 - smoothstep(0.42 * sqrt(shade) - 0.06, 0.42 * sqrt(shade), d)) * step(0.04, shade));
    }
    #include <opaque_fragment>`,
  );
};

// Setting metal or rough switches a part from flat shading to reflective, for chrome, brass and water.
const Mat: React.FC<{ color: string; opacity: number; side?: THREE.Side; metal?: number; rough?: number }> = ({ color, opacity, side, metal, rough }) =>
  metal === undefined && rough === undefined ? (
    <meshLambertMaterial onBeforeCompile={halftone} color={color} transparent={opacity < 1} opacity={opacity} side={side ?? THREE.FrontSide} depthWrite={opacity > 0.6} />
  ) : (
    <meshStandardMaterial onBeforeCompile={halftone} color={color} metalness={metal ?? 0} roughness={rough ?? 0.5} transparent={opacity < 1} opacity={opacity} side={side ?? THREE.FrontSide} depthWrite={opacity > 0.6} />
  );

const Edges: React.FC<{ geo: THREE.BufferGeometry; angle: number; opacity: number }> = ({ geo, angle, opacity }) => {
  const e = useMemo(() => new THREE.EdgesGeometry(geo, angle), [geo, angle]);
  return (
    <lineSegments geometry={e}>
      <lineBasicMaterial color={T.ink} transparent opacity={opacity} />
    </lineSegments>
  );
};

const Solid: React.FC<Common & { geo: THREE.BufferGeometry; side?: THREE.Side }> = ({
  geo, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1, color = T.white, opacity = 1, edge = true, edgeAngle = 30, side, metal, rough, shadow = true,
}) => {
  if (opacity <= 0.003) return null;
  return (
    <group position={pos} rotation={rot} scale={scale}>
      <mesh geometry={geo} castShadow={shadow && opacity > 0.6} receiveShadow>
        <Mat color={color} opacity={opacity} side={side} metal={metal} rough={rough} />
      </mesh>
      {edge && <Edges geo={geo} angle={edgeAngle} opacity={opacity} />}
    </group>
  );
};

export const Box: React.FC<Common & { size: V3 }> = ({ size, ...p }) => {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size[0], size[1], size[2]]);
  return <Solid geo={geo} {...p} />;
};

export const Cyl: React.FC<Common & { r: number; h: number; r2?: number; seg?: number }> = ({ r, h, r2, seg = 48, ...p }) => {
  const geo = useMemo(() => new THREE.CylinderGeometry(r2 ?? r, r, h, seg), [r, r2, h, seg]);
  return <Solid geo={geo} {...p} />;
};

export const Ball: React.FC<Common & { r: number }> = ({ r, ...p }) => {
  const geo = useMemo(() => new THREE.SphereGeometry(r, 24, 18), [r]);
  return <Solid geo={geo} edge={false} {...p} />;
};

// A pipe along points; `corner` rounds the bends only slightly so it reads as plumbing, not a noodle.
export const Tube: React.FC<Common & { pts: V3[]; r: number }> = ({ pts, r, ...p }) => {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)), false, 'catmullrom', 0.12);
    return new THREE.TubeGeometry(curve, 80, r, 20, false);
  }, [JSON.stringify(pts), r]);
  return <Solid geo={geo} edge={false} {...p} />;
};

// Revolved part from a closed [radius, y] profile. `cut` removes that many degrees centred on `open`
// and caps both faces, which is the whole cutaway trick: inner parts show, and the wall's section reads.
// `smooth` keeps round shading for chrome, ceramic and water; without it each band shades flat.
export const Lathe: React.FC<Common & { profile: [number, number][]; cut?: number; open?: number; capColor?: string; seg?: number; smooth?: boolean }> = ({
  profile, cut = 0, open = 90, capColor, seg = 64, color = T.steel, opacity = 1, edge = true, edgeAngle = 30, pos, rot, scale, metal, rough, smooth = false,
}) => {
  const key = JSON.stringify(profile);
  const start = THREE.MathUtils.degToRad(open + cut / 2);
  const len = THREE.MathUtils.degToRad(360 - cut);
  const geo = useMemo(() => {
    const pts = [...profile, profile[0]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, seg, start, len).toNonIndexed();
  }, [key, seg, start, len]);
  useMemo(() => { if (!smooth) geo.computeVertexNormals(); }, [geo, smooth]);
  const cap = useMemo(() => {
    if (!cut) return null;
    const s = new THREE.Shape(profile.map(([x, y]) => new THREE.Vector2(x, y)));
    return new THREE.ShapeGeometry(s);
  }, [key, cut]);
  if (opacity <= 0.003) return null;
  return (
    <group position={pos} rotation={rot} scale={scale}>
      <mesh geometry={geo} castShadow={opacity > 0.6} receiveShadow>
        <Mat color={color} opacity={opacity} side={THREE.DoubleSide} metal={metal} rough={rough} />
      </mesh>
      {edge && <Edges geo={geo} angle={edgeAngle} opacity={opacity} />}
      {cap &&
        [start, start + len].map((phi, i) => (
          <group key={i} rotation={[0, phi - Math.PI / 2, 0]}>
            <mesh geometry={cap} receiveShadow>
              <Mat color={capColor ?? color} opacity={opacity} side={THREE.DoubleSide} />
            </mesh>
            {edge && <Edges geo={cap} angle={1} opacity={opacity} />}
          </group>
        ))}
    </group>
  );
};

// Flat tiled surface, drawn in the XZ plane. Rotate it upright for a wall.
export const Tiles: React.FC<{ w: number; d: number; tile: number; color?: string; lineColor?: string; pos?: V3; rot?: V3; shadow?: number }> = ({
  w, d, tile, color = T.bg, lineColor = '#BDB8AA', pos, rot, shadow = 0.22,
}) => {
  const lines = useMemo(() => {
    const v: number[] = [];
    for (let x = -w / 2; x <= w / 2 + 1e-6; x += tile) v.push(x, 0.005, -d / 2, x, 0.005, d / 2);
    for (let z = -d / 2; z <= d / 2 + 1e-6; z += tile) v.push(-w / 2, 0.005, z, w / 2, 0.005, z);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    return g;
  }, [w, d, tile]);
  return (
    <group position={pos} rotation={rot}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Basic material ignores light, so the surface keeps its exact colour and only the shadow is added. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <shadowMaterial transparent opacity={shadow} />
      </mesh>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={lineColor} />
      </lineSegments>
    </group>
  );
};

// A pale floor with a thin grid that fades out with distance, so flat cartoon objects stand somewhere (Azriel,
// 4 Nov 2026, from a laundry short he liked). Put objects on y = 0; `cell` is the grid spacing in world units.
export const GridFloor: React.FC<{ size?: number; cell?: number; color?: string; lineColor?: string; pos?: V3 }> = ({
  size = 240, cell = 1, color = '#EEEBE3', lineColor = '#BDB6A8', pos = [0, 0, 0],
}) => {
  const geo = useMemo(() => {
    const p: number[] = [], c: number[] = [];
    const a = new THREE.Color(lineColor), b = new THREE.Color(color), h = size / 2;
    const push = (x: number, z: number) => {
      const k = Math.min(1, Math.hypot(x, z) / 30);
      const m = a.clone().lerp(b, k);
      p.push(x, 0.002, z);
      c.push(m.r, m.g, m.b);
    };
    for (let v = -h; v <= h; v += cell) for (let u = -h; u < h; u += cell) {
      if (Math.hypot(u, v) > 32) continue; // past 30 the lines have faded into the floor
      push(u, v); push(u + cell, v);
      push(v, u); push(v, u + cell);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
    return g;
  }, [size, cell, color, lineColor]);
  return (
    <group position={pos}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <lineSegments geometry={geo}>
        <lineBasicMaterial vertexColors />
      </lineSegments>
    </group>
  );
};

// The world as a cut-out block of ground (fig. Why grammar): a top surface on stacked layers whose front and side
// faces show the strata, sitting on the page. layers run top to bottom; the top surface (grass, paving) is `top`.
// Put buildings and props on y = 0. Cut a trench or a wall into it by leaving parts out and adding your own boxes.
export const Diorama: React.FC<{ w: number; d: number; top?: string; topH?: number; layers: { h: number; color: string }[]; pos?: V3 }> = ({
  w, d, top = '#5E8C3A', topH = 0.12, layers, pos = [0, 0, 0],
}) => {
  let y = -topH;
  return (
    <group position={pos}>
      <Box size={[w, topH, d]} pos={[0, -topH / 2, 0]} color={top} />
      {layers.map((l, i) => {
        const c = y - l.h / 2;
        y -= l.h;
        return <Box key={i} size={[w, l.h, d]} pos={[0, c, 0]} color={l.color} />;
      })}
    </group>
  );
};
