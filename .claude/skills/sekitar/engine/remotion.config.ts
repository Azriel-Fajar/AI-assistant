import { Config } from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setColorSpace('bt709');
Config.setCrf(18);
// No GPU on his laptop: software WebGL.
Config.setChromiumOpenGlRenderer('swiftshader');
