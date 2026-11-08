// Colours sampled from the reference frames; brand values are the only part meant to change per account.
export const T = {
  bg: '#FFFFFF',
  floor: '#EEEBE3', // default ground under every film (Frame); the page takes this colour too
  floorLine: '#BDB6A8',
  bgWarm: '#E5DFC7',
  ink: '#141414',
  yellow: '#FDE25A',
  card: '#FFFEF5',
  captionBg: 'rgba(24,24,24,0.92)',
  future: 'rgba(255,255,255,0.42)',
  red: '#C73117',
  orange: '#EF6A2D',
  blue: '#2971BB',
  water: '#6FB4DC',
  green: '#1F8A5B',
  copper: '#AA653B',
  brass: '#C69A3C',
  steel: '#B7BCBF',
  dark: '#3F454A',
  rubber: '#26282A',
  white: '#F7F6F1',
  line: '#22262A',
};

// The account the follow end card shows. Its picture is public/brand/profil.png, copied there by setup.py.
// One handle on every platform since the rename (Azriel, 9 Nov 2026).
export const ACCOUNT = {
  name: 'Intip Baliknya',
  handles: [
    { where: 'Instagram · TikTok · YouTube', handle: '@intipbaliknya' },
  ],
  bio: 'Cara kerja hal sehari-hari, dalam 3D.',
};

export const SANS = 'InterKit';
export const MONO = 'JetMonoKit';

// Layout measured on a 608x1080 reference frame, scaled to 1080x1920.
export const L = {
  W: 1080,
  H: 1920,
  marginX: 57,
  headerY: 188,
  captionY: 1300,
  badgeY: 372,
};
