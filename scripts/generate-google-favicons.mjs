import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceLogoPath = path.join(rootDir, 'public', 'assets', 'explore-pune-logo.png');

if (!fs.existsSync(sourceLogoPath)) {
  console.error('Source logo not found at:', sourceLogoPath);
  process.exit(1);
}

/**
 * Builds the high-contrast circular brand medallion.
 * Eliminates the harsh white-and-black square corners by applying a circular
 * alpha mask, a royal emerald & golden saffron heritage border, and centering
 * the iconic Hiker & Mountain emblem.
 */
async function buildMasterMedallion(size = 512) {
  const circleMaskSvg = Buffer.from(
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg">' +
    '  <circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + (size / 2 - 4) + '" fill="#ffffff"/>' +
    '</svg>'
  );

  const ringSvg = Buffer.from(
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg">' +
    '  <!-- Royal Emerald Perimeter Ring -->' +
    '  <circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + (size / 2 - 12) + '" fill="none" stroke="#059669" stroke-width="16"/>' +
    '  <!-- Golden Saffron Accent Ring -->' +
    '  <circle cx="' + (size / 2) + '" cy="' + (size / 2) + '" r="' + (size / 2 - 24) + '" fill="none" stroke="#f59e0b" stroke-width="6"/>' +
    '</svg>'
  );

  // Extract the Hiker & Mountain emblem from the master logo
  // Bounding box: left: 194, top: 147, width: 635, height: 600
  const emblemCrop = await sharp(sourceLogoPath)
    .extract({ left: 194, top: 147, width: 635, height: 600 })
    .resize(390, 368, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  const base = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      { input: emblemCrop, top: Math.round((size - 368) / 2) - 8, left: Math.round((size - 390) / 2) },
      { input: ringSvg, top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  // Apply circular mask so outside corners are 100% transparent
  const medallionBuffer = await sharp(base)
    .composite([{ input: circleMaskSvg, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return medallionBuffer;
}

async function buildIco(masterBuffer, sizes, outputPath) {
  const pngBuffers = [];
  for (const s of sizes) {
    const buf = await sharp(masterBuffer)
      .resize(s, s, { kernel: 'lanczos3' })
      .png()
      .toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }

  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let currentOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size, 0); // width
    entry.writeUInt8(item.size, 1); // height
    entry.writeUInt8(0, 2); // color count (0 for >=8bpp)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(currentOffset, 12); // offset of image data
    dirEntries.push(entry);
    currentOffset += item.buffer.length;
  }

  const icoBuf = Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
  fs.writeFileSync(outputPath, icoBuf);
  console.log(`Generated ICO at ${outputPath} (${icoBuf.length} bytes, ${count} resolutions: ${sizes.join(', ')})`);
}

async function generateAll() {
  console.log('Generating Google Search compliant circular logo and favicon assets...');

  const masterMedallion = await buildMasterMedallion(512);

  // 1. Google Search & Browser Favicon Guidelines: Multi-resolution crisp PNGs
  const pngTargets = [
    { size: 16, dest: path.join(rootDir, 'public', 'favicon-16x16.png') },
    { size: 32, dest: path.join(rootDir, 'public', 'favicon-32x32.png') },
    { size: 48, dest: path.join(rootDir, 'public', 'favicon-48x48.png') },
    { size: 96, dest: path.join(rootDir, 'public', 'favicon-96x96.png') },
    { size: 144, dest: path.join(rootDir, 'public', 'favicon-144x144.png') },
    { size: 192, dest: path.join(rootDir, 'public', 'favicon-192x192.png') },
    { size: 512, dest: path.join(rootDir, 'public', 'favicon-512x512.png') },
    { size: 180, dest: path.join(rootDir, 'public', 'apple-touch-icon.png') },
    { size: 180, dest: path.join(rootDir, 'public', 'apple-icon.png') },
    { size: 180, dest: path.join(rootDir, 'app', 'apple-icon.png') },
    { size: 512, dest: path.join(rootDir, 'public', 'icon.png') },
    { size: 512, dest: path.join(rootDir, 'app', 'icon.png') },
  ];

  for (const target of pngTargets) {
    await sharp(masterMedallion)
      .resize(target.size, target.size, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9 })
      .toFile(target.dest);
    const sz = fs.statSync(target.dest).size;
    console.log(`Generated ${path.relative(rootDir, target.dest)} (${target.size}x${target.size}, ${sz} bytes)`);
  }

  // 2. Multi-resolution ICOs (48x48, 32x32, 16x16) with transparent circular badge
  await buildIco(masterMedallion, [48, 32, 16], path.join(rootDir, 'public', 'favicon.ico'));
  await buildIco(masterMedallion, [48, 32, 16], path.join(rootDir, 'app', 'favicon.ico'));

  // 3. SVG vector favicon for modern Chrome & Firefox (subpixel-sharp at any zoom)
  const base64Medallion = masterMedallion.toString('base64');
  const svgFavicon =
    '<svg width="64" height="64" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">\n' +
    '  <image href="data:image/png;base64,' + base64Medallion + '" width="512" height="512"/>\n' +
    '</svg>\n';
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), svgFavicon);
  console.log('Generated public/favicon.svg');

  console.log('All Google Search & Chrome browser tab favicons successfully generated!');
}

generateAll().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
