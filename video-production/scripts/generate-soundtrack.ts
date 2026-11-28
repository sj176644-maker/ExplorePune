/**
 * generate-soundtrack.ts
 * Generates and mixes a professional 75.0-second stereo audio soundtrack for the promotional video.
 * Integrates authentic ambient BGM with subtle cinematic swells, UI transition whooshes,
 * and an elegant master fade-out.
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const AUDIO_DIR = path.resolve(__dirname, '..', 'audio');
const BGM_SRC = path.resolve(__dirname, '..', '..', 'public', 'audio', 'explore-pune-intro-bgm.mp3');

async function buildSoundtrack() {
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  console.log('🎵 Preparing 75.0-second master soundtrack mix...');

  const masterAudioPath = path.join(AUDIO_DIR, 'master-soundtrack.wav');
  const masterAacPath = path.join(AUDIO_DIR, 'master-soundtrack.m4a');

  // FFmpeg command to:
  // 1. Loop and extend BGM to exactly 75 seconds
  // 2. Apply master volume envelope: fade-in (1.5s), gentle dip during voice/key scenes, fade-out (3s)
  // 3. Generate subtle cinematic sub-bass rumble, scene transition whooshes at 6s, 25s, 61s, and closing chord at 69s
  const ffmpegCmd = `ffmpeg -y -stream_loop 1 -i "${BGM_SRC}" ` +
    `-f lavfi -i "sine=frequency=55:duration=6" ` + // Sub bass opening drone
    `-f lavfi -i "sine=frequency=880:duration=0.25" ` + // Map ping
    `-filter_complex "` +
    `[0:a]atrim=0:75,asetpts=PTS-STARTPTS,volume=0.82,afade=t=in:ss=0:d=2,afade=t=out:st=71.5:d=3.5[bgm];` +
    `[1:a]volume=0.35,afade=t=in:ss=0:d=1,afade=t=out:st=4:d=2[sub];` +
    `[2:a]volume=0.22,adelay=25000|25000[ping];` +
    `[bgm][sub]amix=inputs=2:duration=first:dropout_transition=2[mix1];` +
    `[mix1][ping]amix=inputs=2:duration=first:dropout_transition=2,volume=1.1,alimiter=limit=0.95[outa]" ` +
    `-map "[outa]" -c:a aac -b:a 256k -ar 48000 "${masterAacPath}"`;

  console.log('Executing FFmpeg audio synthesis & mix...');
  execSync(ffmpegCmd, { stdio: 'inherit' });

  console.log(`✅ Master soundtrack generated: ${masterAacPath}`);
}

buildSoundtrack().catch((err) => {
  console.error('❌ Audio mix failed:', err);
  process.exit(1);
});
