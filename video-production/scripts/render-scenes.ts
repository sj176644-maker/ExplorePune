/**
 * render-scenes.ts
 * Composites and renders all 8 scenes for the Explore Pune Showcase Video
 * using FFmpeg, authentic captures, studio mockups, and typography overlays.
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const PROD_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(PROD_DIR, 'assets');
const CAPTURES_DIR = path.join(PROD_DIR, 'captures');
const SCENES_DIR = path.join(PROD_DIR, 'scenes');
const OUTPUT_DIR = path.join(PROD_DIR, 'output');
const AUDIO_DIR = path.join(PROD_DIR, 'audio');

function runFfmpeg(cmd: string, label: string) {
  console.log(`\n🎬 [FFmpeg] Rendering ${label}...`);
  const start = Date.now();
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`✅ [FFmpeg] ${label} finished in ${elapsed}s`);
  } catch (err) {
    console.error(`❌ [FFmpeg] ${label} failed:`, err);
    throw err;
  }
}

async function main() {
  if (!fs.existsSync(SCENES_DIR)) {
    fs.mkdirSync(SCENES_DIR, { recursive: true });
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🚀 Starting Studio Video Rendering Pipeline for Explore Pune Showcase...');

  // ---------------------------------------------------------------------------
  // SCENE 1: Cinematic Pune Opening (0.0s – 6.0s / 6.0s)
  // ---------------------------------------------------------------------------
  const fullFilm = path.join(ROOT_DIR, 'public', 'videos', 'explore-pune-full-film.mp4').replace(/\\/g, '/');
  const overlay1 = path.join(ASSETS_DIR, 'overlay-scene-1.png').replace(/\\/g, '/');
  const scene1Out = path.join(SCENES_DIR, 'scene-1.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -ss 12 -t 6.0 -i "${fullFilm}" -loop 1 -t 6.0 -i "${overlay1}" ` +
    `-filter_complex "` +
      `[0:v]fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,` +
      `eq=saturation=1.12:contrast=1.04,fade=t=in:st=0:d=0.8[bg];` +
      `[1:v]format=rgba,fade=t=in:st=0.6:d=1.0[ov];` +
      `[bg][ov]overlay=0:0:format=auto[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene1Out}"`,
    'Scene 1: Cinematic Pune Opening (6.0s)'
  );

  // ---------------------------------------------------------------------------
  // SCENE 2: Brand Reveal (Homepage) (6.0s – 14.0s / 8.0s)
  // ---------------------------------------------------------------------------
  const studioBg = path.join(ASSETS_DIR, 'studio-background.png').replace(/\\/g, '/');
  const monitorMockup = path.join(ASSETS_DIR, 'monitor-mockup.png').replace(/\\/g, '/');
  const homeWebm = path.join(CAPTURES_DIR, 'homepage.webm').replace(/\\/g, '/');
  const overlay2 = path.join(ASSETS_DIR, 'overlay-scene-2.png').replace(/\\/g, '/');
  const scene2Out = path.join(SCENES_DIR, 'scene-2.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -loop 1 -t 8.0 -i "${studioBg}" -ss 0 -t 8.0 -i "${homeWebm}" ` +
    `-loop 1 -t 8.0 -i "${monitorMockup}" -loop 1 -t 8.0 -i "${overlay2}" ` +
    `-filter_complex "` +
      `[1:v]fps=30,scale=1600:900[scr];` +
      `[0:v][scr]overlay=160:60[bg1];` +
      `[bg1][2:v]overlay=0:0[bg2];` +
      `[3:v]format=rgba,fade=t=in:st=0.4:d=0.8[ov];` +
      `[bg2][ov]overlay=0:0:format=auto[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene2Out}"`,
    'Scene 2: Brand Reveal & Homepage (8.0s)'
  );

  // ---------------------------------------------------------------------------
  // SCENE 3: Destination Discovery (14.0s – 25.0s / 11.0s)
  // ---------------------------------------------------------------------------
  const destWebm = path.join(CAPTURES_DIR, 'destinations.webm').replace(/\\/g, '/');
  const overlay3 = path.join(ASSETS_DIR, 'overlay-scene-3.png').replace(/\\/g, '/');
  const scene3Out = path.join(SCENES_DIR, 'scene-3.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -loop 1 -t 11.0 -i "${studioBg}" -i "${destWebm}" ` +
    `-loop 1 -t 11.0 -i "${monitorMockup}" -loop 1 -t 11.0 -i "${overlay3}" ` +
    `-filter_complex "` +
      `[1:v]fps=30,tpad=stop_mode=clone:stop_duration=2.5,trim=duration=11.0,scale=1600:900[scr];` +
      `[0:v][scr]overlay=160:60[bg1];` +
      `[bg1][2:v]overlay=0:0[bg2];` +
      `[3:v]format=rgba,fade=t=in:st=0.4:d=0.8[ov];` +
      `[bg2][ov]overlay=0:0:format=auto[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene3Out}"`,
    'Scene 3: Destination Discovery (11.0s)'
  );

  // ---------------------------------------------------------------------------
  // SCENE 4: Interactive Experience Map (Hero) (25.0s – 39.0s / 14.0s)
  // ---------------------------------------------------------------------------
  const mapWebm = path.join(CAPTURES_DIR, 'experience-map.webm').replace(/\\/g, '/');
  const overlay4 = path.join(ASSETS_DIR, 'overlay-scene-4.png').replace(/\\/g, '/');
  const scene4Out = path.join(SCENES_DIR, 'scene-4.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -loop 1 -t 14.0 -i "${studioBg}" -ss 1.0 -t 14.0 -i "${mapWebm}" ` +
    `-loop 1 -t 14.0 -i "${monitorMockup}" -loop 1 -t 14.0 -i "${overlay4}" ` +
    `-filter_complex "` +
      `[1:v]fps=30,scale=1600:900[scr];` +
      `[0:v][scr]overlay=160:60[bg1];` +
      `[bg1][2:v]overlay=0:0[bg2];` +
      `[3:v]format=rgba,fade=t=in:st=0.4:d=0.8[ov];` +
      `[bg2][ov]overlay=0:0:format=auto[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene4Out}"`,
    'Scene 4: Interactive Experience Map (14.0s)'
  );

  // ---------------------------------------------------------------------------
  // SCENE 5: Trip Planner (39.0s – 50.0s / 11.0s)
  // ---------------------------------------------------------------------------
  const planWebm = path.join(CAPTURES_DIR, 'trip-planner.webm').replace(/\\/g, '/');
  const overlay5 = path.join(ASSETS_DIR, 'overlay-scene-5.png').replace(/\\/g, '/');
  const scene5Out = path.join(SCENES_DIR, 'scene-5.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -loop 1 -t 11.0 -i "${studioBg}" -i "${planWebm}" ` +
    `-loop 1 -t 11.0 -i "${monitorMockup}" -loop 1 -t 11.0 -i "${overlay5}" ` +
    `-filter_complex "` +
      `[1:v]fps=30,tpad=stop_mode=clone:stop_duration=3.5,trim=duration=11.0,scale=1600:900[scr];` +
      `[0:v][scr]overlay=160:60[bg1];` +
      `[bg1][2:v]overlay=0:0[bg2];` +
      `[3:v]format=rgba,fade=t=in:st=0.4:d=0.8[ov];` +
      `[bg2][ov]overlay=0:0:format=auto[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene5Out}"`,
    'Scene 5: Trip Planner (11.0s)'
  );

  // ---------------------------------------------------------------------------
  // SCENE 6: My Journey & Milestones (50.0s – 61.0s / 11.0s)
  // ---------------------------------------------------------------------------
  const journeyWebm = path.join(CAPTURES_DIR, 'my-journey.webm').replace(/\\/g, '/');
  const overlay6 = path.join(ASSETS_DIR, 'overlay-scene-6.png').replace(/\\/g, '/');
  const scene6Out = path.join(SCENES_DIR, 'scene-6.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -loop 1 -t 11.0 -i "${studioBg}" -i "${journeyWebm}" ` +
    `-loop 1 -t 11.0 -i "${monitorMockup}" -loop 1 -t 11.0 -i "${overlay6}" ` +
    `-filter_complex "` +
      `[1:v]fps=30,tpad=stop_mode=clone:stop_duration=4.5,trim=duration=11.0,scale=1600:900[scr];` +
      `[0:v][scr]overlay=160:60[bg1];` +
      `[bg1][2:v]overlay=0:0[bg2];` +
      `[3:v]format=rgba,fade=t=in:st=0.4:d=0.8[ov];` +
      `[bg2][ov]overlay=0:0:format=auto[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene6Out}"`,
    'Scene 6: My Journey & Milestones (11.0s)'
  );

  // ---------------------------------------------------------------------------
  // SCENE 7: Responsive Mobile Experience (61.0s – 69.0s / 8.0s)
  // ---------------------------------------------------------------------------
  const mobileWebm = path.join(CAPTURES_DIR, 'mobile-experience.webm').replace(/\\/g, '/');
  const phoneMockup = path.join(ASSETS_DIR, 'phone-mockup.png').replace(/\\/g, '/');
  const overlay7 = path.join(ASSETS_DIR, 'overlay-scene-7.png').replace(/\\/g, '/');
  const scene7Out = path.join(SCENES_DIR, 'scene-7.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -loop 1 -t 8.0 -i "${studioBg}" -ss 0 -t 8.0 -i "${mobileWebm}" ` +
    `-loop 1 -t 8.0 -i "${phoneMockup}" -loop 1 -t 8.0 -i "${overlay7}" ` +
    `-filter_complex "` +
      `[1:v]fps=30,scale=390:844[mob];` +
      `[0:v][mob]overlay=765:118[bg1];` +
      `[bg1][2:v]overlay=0:0[bg2];` +
      `[3:v]format=rgba,fade=t=in:st=0.4:d=0.8[ov];` +
      `[bg2][ov]overlay=0:0:format=auto[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene7Out}"`,
    'Scene 7: Responsive Mobile Experience (8.0s)'
  );

  // ---------------------------------------------------------------------------
  // SCENE 8: Final Brand Outro (69.0s – 75.0s / 6.0s)
  // ---------------------------------------------------------------------------
  const overlay8 = path.join(ASSETS_DIR, 'overlay-scene-8.png').replace(/\\/g, '/');
  const scene8Out = path.join(SCENES_DIR, 'scene-8.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -loop 1 -t 6.0 -i "${studioBg}" -loop 1 -t 6.0 -i "${overlay8}" ` +
    `-filter_complex "` +
      `[0:v]fps=30,trim=duration=6.0[bg];` +
      `[1:v]format=rgba,fade=t=in:st=0.3:d=0.8[ov];` +
      `[bg][ov]overlay=0:0:format=auto,fade=t=out:st=5.0:d=1.0[v]" ` +
    `-map "[v]" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -an "${scene8Out}"`,
    'Scene 8: Final Brand Signature (6.0s)'
  );

  // ---------------------------------------------------------------------------
  // STEP 9: Concatenate All 8 Scenes & Mux Master Soundtrack
  // ---------------------------------------------------------------------------
  console.log('\n🎞️ Concatenating all 8 scenes and muxing master soundtrack...');
  
  const concatListPath = path.join(SCENES_DIR, 'concat-list.txt');
  const concatContent = [
    `file '${path.resolve(scene1Out).replace(/\\/g, '/')}'`,
    `file '${path.resolve(scene2Out).replace(/\\/g, '/')}'`,
    `file '${path.resolve(scene3Out).replace(/\\/g, '/')}'`,
    `file '${path.resolve(scene4Out).replace(/\\/g, '/')}'`,
    `file '${path.resolve(scene5Out).replace(/\\/g, '/')}'`,
    `file '${path.resolve(scene6Out).replace(/\\/g, '/')}'`,
    `file '${path.resolve(scene7Out).replace(/\\/g, '/')}'`,
    `file '${path.resolve(scene8Out).replace(/\\/g, '/')}'`,
  ].join('\n');

  fs.writeFileSync(concatListPath, concatContent, 'utf-8');

  const soundtrack = path.join(AUDIO_DIR, 'master-soundtrack.m4a').replace(/\\/g, '/');
  const finalVideo = path.join(OUTPUT_DIR, 'explore-pune-showcase.mp4').replace(/\\/g, '/');

  runFfmpeg(
    `ffmpeg -y -f concat -safe 0 -i "${concatListPath.replace(/\\/g, '/')}" -i "${soundtrack}" ` +
    `-c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "${finalVideo}"`,
    'Final Master Video Assembly (explore-pune-showcase.mp4)'
  );

  console.log('\n🎉 Explore Pune Feature Showcase Video rendered successfully!');
  console.log(`📁 Master Video File: ${finalVideo}`);
}

main().catch((err) => {
  console.error('Fatal error in rendering pipeline:', err);
  process.exit(1);
});
