import * as THREE from 'three';
import { clamp, ease, mix } from './timing';

export type V3 = [number, number, number];
// width = world units across the frame; az/el in degrees.
export type Cam = { target: V3; width: number; az: number; el: number };
export type CamKey = Cam & { t: number; dur?: number };

const blend = (a: Cam, b: Cam, p: number): Cam => ({
  target: [mix(a.target[0], b.target[0], p), mix(a.target[1], b.target[1], p), mix(a.target[2], b.target[2], p)],
  width: Math.exp(mix(Math.log(a.width), Math.log(b.width), p)), // zoom evenly, not linearly
  az: mix(a.az, b.az, p),
  el: mix(a.el, b.el, p),
});

// Keys blend one after another; a slow push between moves keeps the picture from ever freezing.
export const camAt = (keys: CamKey[], t: number): Cam => {
  let cur: Cam = keys[0];
  let last = keys[0].t;
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (t < k.t) break;
    cur = blend(cur, k, ease(clamp((t - k.t) / (k.dur ?? 0.9))));
    last = k.t + (k.dur ?? 0.9);
  }
  const drift = Math.max(0, t - last);
  return { ...cur, width: cur.width * (1 - 0.004 * drift), az: cur.az + 0.12 * drift };
};

// Subject sits above centre so it clears the caption band.
const LIFT = 0.075;

export const applyCam = (cam: THREE.OrthographicCamera, c: Cam, W: number, H: number) => {
  const h = (c.width * H) / W;
  const s = h * LIFT;
  cam.left = -c.width / 2;
  cam.right = c.width / 2;
  cam.top = h / 2 - s;
  cam.bottom = -h / 2 - s;
  cam.near = 0.1;
  cam.far = 800;
  const az = THREE.MathUtils.degToRad(c.az);
  const el = THREE.MathUtils.degToRad(c.el);
  const d = 200;
  cam.position.set(
    c.target[0] + d * Math.cos(el) * Math.sin(az),
    c.target[1] + d * Math.sin(el),
    c.target[2] + d * Math.cos(el) * Math.cos(az),
  );
  cam.lookAt(c.target[0], c.target[1], c.target[2]);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
};

const scratch = new THREE.OrthographicCamera();
// World point to frame pixels, so a callout can stay pinned to a moving part.
export const project = (c: Cam, p: V3, W = 1080, H = 1920): [number, number] => {
  applyCam(scratch, c, W, H);
  const v = new THREE.Vector3(p[0], p[1], p[2]).project(scratch);
  return [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H];
};
