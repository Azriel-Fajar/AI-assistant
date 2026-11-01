import { loadFont } from '@remotion/fonts';
import { SANS, MONO } from './theme';
import i500 from '@fontsource/inter/files/inter-latin-500-normal.woff2';
import i700 from '@fontsource/inter/files/inter-latin-700-normal.woff2';
import i800 from '@fontsource/inter/files/inter-latin-800-normal.woff2';
import i900i from '@fontsource/inter/files/inter-latin-900-italic.woff2';
import m500 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2';
import m700 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2';

// Bundled, so a laggy connection can't stall a render.
loadFont({ family: SANS, url: i500, weight: '500' });
loadFont({ family: SANS, url: i700, weight: '700' });
loadFont({ family: SANS, url: i800, weight: '800' });
loadFont({ family: SANS, url: i900i, weight: '900', style: 'italic' });
loadFont({ family: MONO, url: m500, weight: '500' });
loadFont({ family: MONO, url: m700, weight: '700' });
