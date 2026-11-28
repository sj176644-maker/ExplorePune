/**
 * generate-mockup-templates.ts
 * Generates photorealistic studio mockup overlays (desktop monitor, phone, studio background)
 * using sharp and high-precision SVG vector geometry.
 */

import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');

async function generateMockups() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  console.log('🎨 Generating studio background (1920x1080)...');
  const studioBgSvg = `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Atmospheric Top Spotlight -->
        <radialGradient id="topSpotlight" cx="50%" cy="15%" r="75%">
          <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9" />
          <stop offset="45%" stop-color="#0f172a" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#06090e" stop-opacity="1" />
        </radialGradient>
        <!-- Floor Reflection Shadow -->
        <radialGradient id="floorShadow" cx="50%" cy="92%" rx="55%" ry="18%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#000000" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <!-- Subtle studio grid -->
        <pattern id="studioGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.02" />
        </pattern>
      </defs>

      <!-- Main Studio Fill -->
      <rect width="1920" height="1080" fill="url(#topSpotlight)" />
      <rect width="1920" height="1080" fill="url(#studioGrid)" />
      <rect width="1920" height="1080" fill="url(#floorShadow)" />
    </svg>
  `;

  await sharp(Buffer.from(studioBgSvg))
    .png()
    .toFile(path.join(ASSETS_DIR, 'studio-background.png'));

  console.log('🖥️ Generating Desktop Monitor Mockup Overlay (1920x1080, screen 1600x900)...');
  // Monitor outer: x=142, y=42, w=1636, h=936 (border 18px around 1600x900 screen)
  // Screen area: x=160, y=60, w=1600, h=900 (left transparent)
  const monitorSvg = `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Dark Titanium Frame Gradient -->
        <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="50%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <!-- Subtle Glass Reflection -->
        <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08" />
          <stop offset="35%" stop-color="#ffffff" stop-opacity="0.02" />
          <stop offset="65%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <!-- Deep Ambient Drop Shadow -->
        <filter id="monitorShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000000" flood-opacity="0.85" />
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6" />
        </filter>
        <!-- Mask for the Screen Hole -->
        <mask id="screenHoleMask">
          <!-- White reveals all -->
          <rect width="1920" height="1080" fill="#ffffff" />
          <!-- Black cuts out the screen window (1600x900 at 160, 60) -->
          <rect x="160" y="60" width="1600" height="900" rx="6" ry="6" fill="#000000" />
        </mask>
      </defs>

      <!-- Aluminum Stand Base & Stem -->
      <g opacity="0.95">
        <!-- Stand Stem -->
        <rect x="920" y="978" width="80" height="65" fill="#1e293b" stroke="#334155" stroke-width="1.5" rx="3" />
        <!-- Stand Base -->
        <ellipse cx="960" cy="1046" rx="140" ry="16" fill="#1e293b" stroke="#475569" stroke-width="2" />
        <!-- Stand Top Highlight -->
        <ellipse cx="960" cy="1044" rx="136" ry="12" fill="#334155" opacity="0.4" />
      </g>

      <!-- Monitor Bezel Chassis with Mask Cutout -->
      <g mask="url(#screenHoleMask)" filter="url(#monitorShadow)">
        <!-- Outer Chassis -->
        <rect x="142" y="42" width="1636" height="936" rx="20" ry="20" fill="url(#bezelGrad)" stroke="#475569" stroke-width="2" />
        <!-- Camera Lens Notch -->
        <circle cx="960" cy="51" r="3.5" fill="#090d14" stroke="#334155" stroke-width="1" />
        <circle cx="960" cy="51" r="1.5" fill="#0284c7" opacity="0.6" />
        <!-- Chin Accent -->
        <rect x="142" y="960" width="1636" height="18" fill="#111827" />
      </g>

      <!-- Inner Screen Bezel Border (1px crisp edge) -->
      <rect x="159" y="59" width="1602" height="902" rx="7" ry="7" fill="none" stroke="#334155" stroke-width="1.5" opacity="0.8" />

      <!-- Corner Glass Glare Highlight -->
      <path d="M 160 60 L 650 60 L 160 550 Z" fill="url(#glassReflection)" pointer-events="none" />
    </svg>
  `;

  await sharp(Buffer.from(monitorSvg))
    .png()
    .toFile(path.join(ASSETS_DIR, 'monitor-mockup.png'));

  console.log('📱 Generating Mobile Smartphone Mockup Overlay (1920x1080, screen 390x844)...');
  // Phone centered at (745, 88), width 430, height 904. Screen: x=765, y=118, width=390, height=844
  const phoneSvg = `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="titaniumFrame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#475569" />
          <stop offset="50%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <filter id="phoneShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="30" stdDeviation="35" flood-color="#000000" flood-opacity="0.9" />
          <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.7" />
        </filter>
        <mask id="phoneScreenMask">
          <rect width="1920" height="1080" fill="#ffffff" />
          <!-- Screen Cutout: 390x844 at (765, 118) with rounded corners -->
          <rect x="765" y="118" width="390" height="844" rx="44" ry="44" fill="#000000" />
        </mask>
      </defs>

      <!-- Smartphone Chassis with Cutout -->
      <g mask="url(#phoneScreenMask)" filter="url(#phoneShadow)">
        <!-- Outer Body -->
        <rect x="745" y="98" width="430" height="884" rx="58" ry="58" fill="url(#titaniumFrame)" stroke="#64748b" stroke-width="2.5" />
        <!-- Antenna Bands -->
        <rect x="743" y="240" width="3" height="10" fill="#334155" />
        <rect x="1174" y="240" width="3" height="10" fill="#334155" />
        <!-- Volume / Power Buttons -->
        <rect x="742" y="320" width="3" height="48" rx="1.5" fill="#475569" />
        <rect x="742" y="380" width="3" height="48" rx="1.5" fill="#475569" />
        <rect x="1175" y="350" width="3" height="70" rx="1.5" fill="#475569" />
      </g>

      <!-- Dynamic Island Pill at Top of Screen -->
      <rect x="910" y="132" width="100" height="28" rx="14" ry="14" fill="#000000" stroke="#1e293b" stroke-width="0.8" />
      <!-- Front Camera Lens Reflection -->
      <circle cx="994" cy="146" r="5" fill="#0f172a" />
      <circle cx="994" cy="146" r="2.5" fill="#0284c7" opacity="0.6" />

      <!-- Inner Display Bezel Border -->
      <rect x="764" y="117" width="392" height="846" rx="45" ry="45" fill="none" stroke="#334155" stroke-width="2" opacity="0.8" />

      <!-- Bottom Home Indicator Bar -->
      <rect x="895" y="946" width="130" height="4.5" rx="2.5" fill="#ffffff" opacity="0.65" />
    </svg>
  `;

  await sharp(Buffer.from(phoneSvg))
    .png()
    .toFile(path.join(ASSETS_DIR, 'phone-mockup.png'));

  console.log('✅ Mockup templates generated successfully in video-production/assets!');
}

generateMockups().catch((err) => {
  console.error('❌ Error generating mockups:', err);
  process.exit(1);
});
