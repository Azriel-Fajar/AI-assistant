import React from 'react';
import { useVideoConfig } from 'remotion';
import { Frame } from '../../kit/Frame';
import { Cam, CamKey, project, V3 } from '../../kit/camera';
import { Badge, Card, Header, Pop, Steps, Tag } from '../../kit/overlay';
import { Ball, Box, Cyl, Lathe, Tiles, Tube } from '../../kit/prims';
import { clamp, ev, makeTimeline, mix, pop, Timing } from '../../kit/timing';
import { L, MONO, SANS, T } from '../../kit/theme';
import timingJson from './timing.json';

export const timing = timingJson as Timing;
const TL = makeTimeline(timing);
const { start: S, end: E, word: W } = TL;

const SIDE = { az: 58, el: 18 };
const WIDE: Cam = { target: [0, -1.6, 0.4], width: 15, ...SIDE };
const CLOSE: Cam = { target: [0, 0.2, 0.5], width: 7.2, az: 74, el: 13 };
const WASHER: Cam = { target: [0, -0.3, 0.1], width: 2.5, az: 82, el: 9 };
const GALON_AT: V3 = [60, -5.5, 0];
const VALVE: V3 = [-8, -1, -1.9];

const keys: CamKey[] = [
  { t: 0, target: [0, -1.2, 1.6], width: 9, az: 58, el: 16 },
  { t: S('hook2'), ...WIDE, dur: 2 },
  { t: S('hook4') + 0.2, ...CLOSE, dur: 1.1 },
  { t: S('num1'), target: [0, -3.8, 2.74], width: 3.4, az: 62, el: 10, dur: 0.8 },
  { t: S('num2'), target: [GALON_AT[0], GALON_AT[1] + 3.1, GALON_AT[2]], width: 9, az: 45, el: 24, dur: 0.9 },
  { t: S('num3') + 0.2, target: [GALON_AT[0], GALON_AT[1] + 6.8, GALON_AT[2]], width: 25, az: 45, el: 28, dur: 2.2 },
  { t: S('why1'), ...WIDE, dur: 1 },
  { t: S('why2'), ...CLOSE, dur: 0.9 },
  { t: S('why3') + 0.3, target: [0, 0.6, 0.2], width: 6, az: 78, el: 10, dur: 0.9 },
  { t: S('why4'), target: [0, -0.1, 0.2], width: 4.2, az: 80, el: 10, dur: 0.8 },
  { t: S('wear1'), ...WASHER, dur: 1 },
  { t: S('wear3') + 1.2, target: [0, -0.1, 0.9], width: 4.3, az: 80, el: 11, dur: 0.9 },
  { t: S('fix0'), target: [0, 0.7, 0.2], width: 8.8, az: 72, el: 14, dur: 0.9 },
  { t: S('fix1'), target: [-8, -0.2, -1.9], width: 6.5, az: 32, el: 16, dur: 0.8 },
  { t: S('fix2'), target: [0, 1.2, 0.3], width: 8.4, az: 70, el: 14, dur: 0.8 },
  { t: S('nuance'), ...WIDE, dur: 1 },
  { t: S('close2') - 0.35, ...WASHER, dur: 0.6 },
  { t: S('cta') - 0.1, ...WIDE, dur: 0.9 },
];

// The drip clock: one drop per second until the new washer goes in.
// Each spoken "tik" is the moment a drop lets go; after those it keeps one drop a second.
const GROW = 0.5;
const drips = (t: number, stopAt: number) => {
  const tiks = [1, 2, 3].map((n) => W('hook1', 'tik', n));
  const out = [];
  const release = [...tiks];
  for (let r = tiks[2] + 1; r <= stopAt; r += 1) release.push(r);
  release.forEach((r, k) => {
    const x = t - (r - GROW);
    if (x < 0 || x > 0.95) return;
    const fall = Math.max(0, x - GROW);
    out.push({ key: k, y: -2.9 - 16 * fall * fall, s: 0.35 + 0.65 * clamp(x / GROW) });
  });
  return out;
};

const GALON_PROFILE: [number, number][] = [[0, 0], [1.1, 0], [1.15, 0.1], [1.15, 2.1], [0.95, 2.45], [0.42, 2.7], [0.42, 3.05], [0, 3.05]];

// Grid cells ordered from the centre out, so the first galon sits in the middle of the shot.
const GRID: [number, number][] = Array.from({ length: 35 }, (_, i) => [(i % 7) - 3, Math.floor(i / 7) - 2] as [number, number])
  .sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));

const Galons: React.FC<{ t: number }> = ({ t }) => {
  const items = [];
  for (let i = 0; i < 34; i++) {
    const delay = i === 0 ? S('num2') + 0.75 : S('num3') + 0.25 + (i - 1) * ((E('num4') - S('num3') - 1.2) / 33);
    const a = pop(t, delay, 0.35);
    if (a <= 0) continue;
    const [c, r] = GRID[i];
    items.push(
      <Lathe key={i} profile={GALON_PROFILE} color={T.water} opacity={0.88} seg={28} edgeAngle={40}
        pos={[GALON_AT[0] + c * 2.8, GALON_AT[1], GALON_AT[2] + r * 2.8]} scale={Math.max(0.01, a)} />,
    );
  }
  return (
    <>
      <Tiles w={70} d={70} tile={2.8} pos={[GALON_AT[0], GALON_AT[1] - 0.01, GALON_AT[2]]} />
      {items}
    </>
  );
};

const Room: React.FC = () => (
  <>
    <Tiles w={70} d={40} tile={1.5} color="#E6E3D8" pos={[0, 0, -2.25]} rot={[Math.PI / 2, 0, 0]} />
    {/* Counter and basin */}
    <Box size={[9, 1.2, 6]} pos={[0, -7, 1.2]} color={T.white} />
    <Box size={[7, 0.25, 4.4]} pos={[0, -6.32, 1.4]} color="#D9D7CE" />
    <Box size={[9, 0.5, 0.6]} pos={[0, -6.2, -1.5]} color={T.white} />
    <Box size={[9, 0.5, 0.6]} pos={[0, -6.2, 3.95]} color={T.white} />
    <Box size={[0.8, 0.5, 5]} pos={[-4.1, -6.2, 1.2]} color={T.white} />
    <Box size={[0.8, 0.5, 5]} pos={[4.1, -6.2, 1.2]} color={T.white} />
    <Cyl r={0.34} h={0.06} pos={[0, -6.17, 2.4]} color="#8C8F90" />
  </>
);

const Tap: React.FC<{ t: number }> = ({ t }) => {
  const cutOn = ev(t, W('hook4', 'lihat'), 0.6);
  const closeIn = ev(t, W('why3', 'batangnya'), 0.5);
  const open = 1 - ev(t, W('why3', 'muter') - 0.5, 0.2) * 0.0;
  // Stem: starts screwed down, lifts to demonstrate during the opening of "why", then goes down on "turun".
  const lift = ev(t, S('why2'), 0.5) * (1 - closeIn);
  const fixUp = ev(t, S('fix2') + 0.2, 0.7) * (1 - ev(t, W('fix3', 'pasang') + 0.5, 0.6));
  const sy = lift * 0.75 + fixUp * 2.4;
  const handleRot = sy * 5;
  const worn = ev(t, S('wear2'), 1.2);
  const replaced = ev(t, W('fix3', 'pasang') - 0.1, 0.9);
  const wearNow = worn * (1 - replaced);
  const oldOut = ev(t, W('fix2', 'lepas'), 0.7);
  const newIn = replaced;
  const pressed = 1 - lift;
  const leak = ev(t, W('wear3', 'celah'), 0.5) * (1 - replaced);
  const flow = lift * 0.95 + leak * 0.25;
  const stopAt = W('fix3', 'pasang');
  const solid = 1 - cutOn;
  const bodyProfile: [number, number][] = [[0.68, -1.5], [1.05, -1.5], [1.05, 1.2], [0.72, 1.2], [0.72, 1.42], [0.36, 1.42], [0.36, 1.2], [0.68, 1.0]];
  return (
    <group>
      {/* Water supply on the wall, with the main valve */}
      <Tube pts={[[0, -1, -1.9], [-14, -1, -1.9]]} r={0.3} color={T.steel} />
      <Tube pts={[[0, -1, -0.75], [0, -1, -1.9]]} r={0.5} color={T.steel} opacity={0.35} />
      <Tube pts={[[0, -1, -0.5], [0, -1, -1.9]]} r={0.3} color={T.water} />
      <Box size={[1.1, 0.85, 0.85]} pos={[VALVE[0], VALVE[1], VALVE[2]]} color={T.brass} />
      <Cyl r={0.16} h={0.5} pos={[VALVE[0], VALVE[1] + 0.6, VALVE[2]]} color={T.steel} />
      {/* The lever lies along the pipe when open and turns across it to close */}
      <Box size={[2.1, 0.2, 0.32]} pos={[VALVE[0], VALVE[1] + 0.86, VALVE[2]]} color={T.red}
        rot={[0, (Math.PI / 2) * ev(t, W('fix1', 'tutup'), 0.5), 0]} />
      {/* Chamber below the seat, full of water under pressure */}
      <Cyl r={0.66} h={0.95} pos={[0, -1, 0]} color={T.water} edge={false} />
      <Cyl r={0.26} h={0.25} pos={[0, -0.42, 0]} color={T.water} edge={false} />
      {/* Seat */}
      <Lathe profile={[[0.28, -0.55], [0.68, -0.55], [0.68, -0.3], [0.28, -0.3]]} color={T.brass} />
      {/* Body: a solid shell that gives way to the cutaway */}
      <Lathe profile={bodyProfile} color={T.steel} opacity={solid} />
      <Lathe profile={bodyProfile} color="#C5CACC" cut={150} open={90} capColor={T.orange} opacity={cutOn} />
      {/* Spout */}
      <Tube pts={[[0, 0.2, 0.9], [0, 0.2, 2], [0, 0.02, 2.5], [0, -1.05, 2.72], [0, -2.6, 2.74]]} r={0.42} color={T.steel} opacity={0.32 + 0.68 * solid} />
      <Tube pts={[[0, 0.2, 0.68], [0, 0.2, 2], [0, 0.02, 2.5], [0, -1.05, 2.72], [0, -2.5, 2.74]]} r={0.25 * Math.max(0.02, flow)} color={T.water} opacity={flow > 0.01 ? 1 : 0} />
      {/* Upper chamber fills as water gets past the washer */}
      <Cyl r={0.62} h={0.8} pos={[0, 0.1, 0]} color={T.water} opacity={clamp(flow) * 0.55} edge={false} />
      {/* Stem, washer and handle move as one */}
      <Cyl r={0.2} h={2.35} pos={[0, 0.95 + sy, 0]} color={T.brass} />
      <Cyl r={0.34} h={0.14} pos={[0, -0.18 + sy, 0]} color={T.brass} />
      <group rotation={[0, handleRot, 0]}>
        <Box size={[2.4, 0.3, 0.42]} pos={[0, 2.25 + sy, 0]} color={T.dark} />
        <Box size={[0.42, 0.3, 2.4]} pos={[0, 2.25 + sy, 0]} color={T.dark} />
        <Cyl r={0.34} h={0.34} pos={[0, 2.38 + sy, 0]} color={T.red} />
      </group>
      {/* The washer: the star of the film */}
      <group position={[oldOut * 3.4, sy * (1 - oldOut) + oldOut * 1.5 + wearNow * 0.03, oldOut * -0.4]} rotation={[-wearNow * 0.13, 0, 0]}>
        <Cyl r={0.5} h={0.18} pos={[0, -0.21, 0]} color={wearNow > 0.5 ? '#7B5E4C' : T.rubber} opacity={1 - ev(t, W('fix3', 'pasang'), 0.3)} />
        {/* Hairline cracks on the side facing the camera */}
        {wearNow > 0.3 && oldOut < 0.99 && [-0.22, 0.03, 0.26].map((z, i) => (
          <Box key={i} size={[0.03, 0.17, 0.05]} pos={[Math.sqrt(0.25 - z * z) + 0.005, -0.21, z]} color="#120d0a" edge={false} opacity={wearNow} />
        ))}
      </group>
      {replaced > 0 && (
        <Cyl r={0.5} h={0.18} pos={[(1 - newIn) * 3.4, -0.21 + sy + (1 - newIn) * 1.5, 0]} color={T.green} opacity={clamp(newIn * 3)} />
      )}
      {/* The leak: a thread past the worn washer */}
      {leak > 0.02 && (
        <Tube pts={[[0, -0.34, 0.37], [0, -0.1, 0.53], [0.05, 0.1, 0.68]]} r={0.075 * leak} color={T.blue} />
      )}
      {/* Drops, with a clear stretch on the way down */}
      {drips(t, stopAt).map((d) => (
        d.y > -6.1 && <group key={d.key} position={[0, d.y, 2.74]} scale={[1, 1.35, 1]}><Ball r={0.22 * d.s} color={T.blue} /></group>
      ))}
      {/* The one drop the numbers are about, held big for the count */}
      {t > S('num1') - 0.1 && t < S('num2') && (
        <group position={[0, -3.8, 2.74]} scale={[1, 1.3, 1]}>
          <Ball r={0.62 * pop(t, S('num1') + 0.1, 0.45)} color={T.blue} />
        </group>
      )}
    </group>
  );
};

const Stat: React.FC<{ big: string; small: string; on: number }> = ({ big, small, on }) => (
  <div style={{ opacity: 0.22 + 0.78 * on, marginBottom: 10 }}>
    <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, color: T.blue }}>{big}</span>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 31, marginLeft: 14 }}>{small}</span>
  </div>
);

const Piece: React.FC = () => {
  const headers = [
    { t: -1, kicker: 'Jam 2 pagi', title: 'tik... tik... tik...' },
    { t: S('hook3'), kicker: 'Kata kita semua', title: '"cuma setetes"' },
    { t: S('hook4') + 1.1, kicker: 'Keran netes', title: 'dalemnya gimana?' },
    { t: S('num1'), kicker: 'Satu tetes', title: '± ¼ mililiter' },
    { t: S('num2'), kicker: 'Sedetik sekali', title: 'sehari lebih dari 1 galon' },
    { t: S('num3'), kicker: 'Dikali 30 hari', title: '± 650 liter' },
    { t: S('why1'), kicker: 'Kok bisa?', title: 'kita lihat isinya' },
    { t: S('why3'), kicker: 'Keran model putar', title: 'batang neken karet' },
    { t: S('wear1'), kicker: 'Tersangkanya', title: 'karet kecil' },
    { t: S('wear3'), kicker: 'Karet aus', title: 'ada celah kecil' },
    { t: S('fix0'), kicker: 'Benerinnya', title: '3 langkah' },
    { t: S('nuance'), kicker: 'Catatan', title: 'keran tuas beda isi' },
    { t: S('close1'), kicker: 'Jadi', title: 'bukan kerannya' },
    { t: S('close2'), kicker: 'Biang keroknya', title: 'satu karet kecil' },
  ];
  return (
    <Frame
      slug="keran"
      timing={timing}
      keys={keys}
      scene={(t) => (
        <>
          <Room />
          <Tap t={t} />
          {t > S('num2') - 0.5 && t < S('why1') + 1.2 && <Galons t={t} />}
        </>
      )}
      overlay={(t, cam) => {
        const at = (p: V3) => project(cam, p);
        return (
          <>
            <Header items={headers} />
            <Pop t0={W('hook1', 'tik', 1)} t1={W('hook1', 'tik', 2)} x={300} y={900} text="TIK" rot={-8} />
            <Pop t0={W('hook1', 'tik', 2)} t1={W('hook1', 'tik', 3)} x={760} y={1040} text="TIK" rot={6} />
            <Pop t0={W('hook1', 'tik', 3)} t1={S('hook2')} x={380} y={1150} text="TIK" rot={-4} />
            <Badge t0={S('num1') + 0.2} t1={S('why1')} text="Angka asumsi USGS" />
            <Badge t0={S('why2')} t1={S('fix0')} text="Ilustrasi disederhanakan" color={T.dark} />
            <Tag t0={S('num1') + 0.3} t1={S('num2')} x={810} y={620} to={at([0, -3.4, 2.74])} text="± ¼ ml" />
            <Card t0={S('num2') + 1} t1={S('why1')} x={L.marginX} y={400} w={660} kicker="Hitungan USGS · 1 tetes = ¼ ml" outline>
              <Stat big="21,6 L" small="sehari" on={ev(t, S('num2') + 1.2, 0.3)} />
              <Stat big="± 650 L" small="sebulan" on={ev(t, S('num3'), 0.3)} />
              <Stat big="± 34" small="galon 19 L" on={ev(t, S('num4'), 0.3)} />
            </Card>
            <Tag t0={W('why3', 'tuasnya')} t1={S('why4')} x={210} y={660} to={at([0, 2.3, -0.8])} text="tuas" />
            <Tag t0={W('why3', 'batangnya')} t1={S('why4')} x={880} y={800} to={at([0, 1.1, -0.1])} text="batang" />
            <Tag t0={W('why3', 'karet')} t1={E('wear4')} x={250} y={930} to={at([0, -0.21, 0.42])} text="karet" />
            <Tag t0={W('why3', 'dudukannya')} t1={S('wear1')} x={850} y={1120} to={at([0, -0.42, 0.55])} text="dudukan" />
            <Pop t0={W('why4', 'nahan')} t1={E('why4') + 0.1} x={740} y={520} text="NAHAN!" size={92} rot={5} />
            <Pop t0={W('wear1', 'kejepit')} t1={E('wear1') + 0.05} x={680} y={560} text="JEPIT!" size={92} rot={-5} />
            <Pop t0={W('wear3', 'celah')} t1={W('wear3', 'lolos')} x={740} y={560} text="CELAH" size={92} rot={4} />
            <Tag t0={W('wear3', 'lolos')} t1={E('wear4')} x={840} y={1080} to={at([0, -0.05, 0.5])} text="air lolos" color={T.blue} ink="#fff" />
            <Card t0={S('fix1')} t1={S('nuance')} x={L.marginX} y={385} w={830} outline>
              <Steps steps={[
                { t: S('fix1'), text: 'Tutup kran utama' },
                { t: S('fix2'), text: 'Buka kepala, lepas karet lama' },
                { t: S('fix3'), text: 'Pasang karet baru, ukuran sama' },
              ]} />
            </Card>
            <Tag t0={W('fix1', 'utama')} t1={S('fix2')} x={270} y={1130} to={at([VALVE[0], VALVE[1] + 0.1, VALVE[2] + 0.4])} text="kran utama" />
            <Tag t0={W('fix2', 'karet')} t1={S('fix3') + 0.4} x={840} y={1130} to={at([3.4, 1.3, -0.4])} text="karet lama" color={T.red} ink="#fff" />
            <Tag t0={W('fix3', 'karet')} t1={S('nuance')} x={250} y={1130} to={at([0, 2.2, 0.4])} text="karet baru" color={T.green} ink="#fff" />
            <Card t0={S('nuance') + 0.2} t1={S('close1')} x={L.marginX + 30} y={420} w={880} outline>
              <div style={{ display: 'flex', gap: 28 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700 }}>KERAN PUTAR</div>
                  <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8 }}>karet neken dudukan</div>
                </div>
                <div style={{ width: 3, background: T.ink }} />
                <div style={{ flex: 1, opacity: ev(t, W('nuance', 'tuas'), 0.25) }}>
                  <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700 }}>KERAN TUAS</div>
                  <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8 }}>cakram atau cartridge</div>
                </div>
              </div>
            </Card>
            <Tag t0={W('close2', 'karet')} t1={S('cta') - 0.05} x={760} y={1090} to={at([0, -0.21, 0.42])} text="ini doang" />
            <Tag t0={S('cta') + 0.5} x={540} y={1130} text="✓ netes berhenti" color={T.green} ink="#fff" />
          </>
        );
      }}
    />
  );
};

export default Piece;
