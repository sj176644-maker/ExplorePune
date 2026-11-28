/**
 * generate-scene-overlays.ts
 * Generates studio-grade typography and glassmorphism UI overlays for all 8 video scenes
 * using sharp and scalable SVG graphic composition.
 */

import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
const LOGO_SRC = path.resolve(__dirname, '..', '..', 'public', 'assets', 'explore-pune-logo.png');

async function generateOverlays() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  console.log('🎨 Generating typography overlays for Scenes 1 through 8...');

  // =========================================================================
  // SCENE 1: Cinematic Pune Opening
  // =========================================================================
  const s1Svg = `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="s1BottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0" />
          <stop offset="50%" stop-color="#000000" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.85" />
        </linearGradient>
      </defs>
      <!-- Bottom Vignette -->
      <rect y="680" width="1920" height="400" fill="url(#s1BottomFade)" />

      <!-- Top Watermark -->
      <text x="100" y="90" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="800" letter-spacing="4" fill="#10b981">
        EXPLORE PUNE PRESENTS
      </text>

      <!-- Center Title -->
      <g text-anchor="middle">
        <text x="960" y="870" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="46" font-weight="900" letter-spacing="6" fill="#f8fafc">
          PUNE, MAHARASHTRA
        </text>
        <text x="960" y="915" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="18" font-weight="500" letter-spacing="2.5" fill="#cbd5e1" opacity="0.9">
          A Land of Historic Forts, Sacred Sanctuaries &amp; Living Heritage
        </text>
      </g>
    </svg>
  `;
  await sharp(Buffer.from(s1Svg)).png().toFile(path.join(ASSETS_DIR, 'overlay-scene-1.png'));

  // Helper for escaping XML entities
  const escapeXml = (str: string) =>
    str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  // Helper for bottom-left glassmorphism banner
  const makeBottomLeftBanner = (badge: string, badgeBg: string, badgeColor: string, title: string, subtitle: string) => `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.75" />
        </filter>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111827" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#090d16" stop-opacity="0.96" />
        </linearGradient>
      </defs>

      <!-- Floating Glassmorphism Info Card -->
      <g transform="translate(100, 915)" filter="url(#cardShadow)">
        <rect width="660" height="96" rx="20" ry="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5" />
        
        <!-- Category Pill Badge -->
        <g transform="translate(24, 20)">
          <rect width="180" height="22" rx="11" ry="11" fill="${badgeBg}" />
          <text x="90" y="15" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="800" letter-spacing="1.5" fill="${badgeColor}">
            ${escapeXml(badge)}
          </text>
        </g>

        <!-- Title -->
        <text x="24" y="65" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="22" font-weight="900" fill="#f8fafc" letter-spacing="0.2">
          ${escapeXml(title)}
        </text>

        <!-- Subtitle -->
        <text x="24" y="83" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="500" fill="#94a3b8">
          ${escapeXml(subtitle)}
        </text>
      </g>
    </svg>
  `;

  // SCENE 2: Brand Reveal
  await sharp(Buffer.from(makeBottomLeftBanner(
    'EXPLORE PUNE PLATFORM',
    'rgba(16, 185, 129, 0.2)',
    '#34d399',
    'Explore Pune — Official Heritage Guide',
    '106+ Verified Historic Destinations • Real-Time Information Engine'
  ))).png().toFile(path.join(ASSETS_DIR, 'overlay-scene-2.png'));

  // SCENE 3: Destination Discovery
  await sharp(Buffer.from(makeBottomLeftBanner(
    'DESTINATION DISCOVERY',
    'rgba(245, 158, 11, 0.2)',
    '#fbbf24',
    'Curated Attractions & Verified Timings',
    'Instant Search • Live Hours • Entry Fees • Authentic Photography'
  ))).png().toFile(path.join(ASSETS_DIR, 'overlay-scene-3.png'));

  // SCENE 4: Experience 3D Map
  await sharp(Buffer.from(makeBottomLeftBanner(
    'INTERACTIVE 3D GIS MAP',
    'rgba(6, 182, 212, 0.2)',
    '#22d3ee',
    'Precision Vector Category Pins & 3D Terrain',
    'Terracotta Forts • Saffron Temples • Bronze Heritage • Exact GPS (DD/DMS)'
  ))).png().toFile(path.join(ASSETS_DIR, 'overlay-scene-4.png'));

  // SCENE 5: Trip Planner
  await sharp(Buffer.from(makeBottomLeftBanner(
    'INTELLIGENT TRIP PLANNER',
    'rgba(16, 185, 129, 0.2)',
    '#34d399',
    'Customized Day Itineraries & Route Flow',
    'Pace Optimization • Multimodal Transit • Exportable PDF Schedule'
  ))).png().toFile(path.join(ASSETS_DIR, 'overlay-scene-5.png'));

  // SCENE 6: My Journey & Memories
  await sharp(Buffer.from(makeBottomLeftBanner(
    'MY JOURNEY & MILESTONES',
    'rgba(219, 39, 119, 0.2)',
    '#f472b6',
    'Preserve Your Sahyadri Travel Memories',
    'Explored Talukas • Verified Discovery Stamps • Personal Travel Journal'
  ))).png().toFile(path.join(ASSETS_DIR, 'overlay-scene-6.png'));

  // SCENE 7: Mobile Experience (Left side of screen)
  const s7Svg = `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="s7CardShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#000000" flood-opacity="0.8" />
        </filter>
        <linearGradient id="s7CardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111827" stop-opacity="0.94" />
          <stop offset="100%" stop-color="#090d16" stop-opacity="0.98" />
        </linearGradient>
      </defs>

      <!-- Left Floating Glass Card next to phone -->
      <g transform="translate(130, 410)" filter="url(#s7CardShadow)">
        <rect width="550" height="220" rx="28" ry="28" fill="url(#s7CardGrad)" stroke="#334155" stroke-width="2" />
        
        <!-- Category Badge -->
        <g transform="translate(36, 32)">
          <rect width="180" height="24" rx="12" ry="12" fill="rgba(2, 132, 199, 0.2)" />
          <text x="90" y="16" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" fill="#38bdf8">
            100% RESPONSIVE
          </text>
        </g>

        <!-- Big Headline -->
        <text x="36" y="105" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="34" font-weight="900" fill="#f8fafc" letter-spacing="-0.5">
          Anytime. Anywhere.
        </text>

        <!-- Descriptions -->
        <text x="36" y="145" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="15" font-weight="600" fill="#cbd5e1">
          Touch-Optimized Map Navigation &amp; GPS
        </text>
        <text x="36" y="172" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="400" fill="#94a3b8">
          Explore all 106 destinations with authentic on-site guidance on your phone.
        </text>
      </g>
    </svg>
  `;
  await sharp(Buffer.from(s7Svg)).png().toFile(path.join(ASSETS_DIR, 'overlay-scene-7.png'));

  // SCENE 8: Final Brand Reveal
  // Center logo + bold typography
  const s8Svg = `
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.18" />
          <stop offset="50%" stop-color="#0f172a" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Center Glow Background -->
      <rect width="1920" height="1080" fill="url(#centerGlow)" />

      <!-- Center Brand Block -->
      <g text-anchor="middle">
        <!-- Main Title -->
        <text x="960" y="630" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="52" font-weight="900" letter-spacing="8" fill="#f8fafc">
          EXPLORE PUNE
        </text>

        <!-- Tagline -->
        <text x="960" y="685" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="24" font-weight="700" letter-spacing="2" fill="#10b981">
          Discover More. Experience Pune.
        </text>

        <!-- Website URL -->
        <g transform="translate(760, 720)">
          <rect width="400" height="42" rx="21" ry="21" fill="rgba(255, 255, 255, 0.06)" stroke="#334155" stroke-width="1.2" />
          <text x="200" y="27" text-anchor="middle" font-family="'Plus Jakarta Sans', monospace, sans-serif" font-size="16" font-weight="700" letter-spacing="1" fill="#f59e0b">
            explorepune-guide.vercel.app
          </text>
        </g>

        <!-- Footer Credits -->
        <text x="960" y="820" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="3" fill="#64748b">
          CRAFTED FOR MAHARASHTRA HERITAGE &amp; TOURISM
        </text>
      </g>
    </svg>
  `;

  // Composite the logo image into scene 8
  const s8Base = await sharp(Buffer.from(s8Svg)).png().toBuffer();
  let logoBuffer: Buffer | null = null;
  if (fs.existsSync(LOGO_SRC)) {
    logoBuffer = await sharp(LOGO_SRC)
      .resize(160, 160, { fit: 'contain' })
      .toBuffer();
  }

  if (logoBuffer) {
    await sharp(s8Base)
      .composite([{ input: logoBuffer, top: 410, left: 880 }])
      .toFile(path.join(ASSETS_DIR, 'overlay-scene-8.png'));
  } else {
    await sharp(s8Base).toFile(path.join(ASSETS_DIR, 'overlay-scene-8.png'));
  }

  console.log('✅ All 8 Scene overlays generated in video-production/assets!');
}

generateOverlays().catch((err) => {
  console.error('❌ Failed to generate overlays:', err);
  process.exit(1);
});
