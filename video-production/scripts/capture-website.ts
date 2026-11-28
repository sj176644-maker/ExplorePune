/**
 * capture-website.ts
 * Automated high-resolution Playwright screen recording and frame capture
 * captures authentic interactions across all core Explore Pune features.
 */

import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const CAPTURES_DIR = path.resolve(__dirname, '..', 'captures');

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureAllScenes() {
  if (!fs.existsSync(CAPTURES_DIR)) {
    fs.mkdirSync(CAPTURES_DIR, { recursive: true });
  }

  console.log('🚀 Launching Chrome for automated website capture...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--enable-webgl', '--use-gl=angle', '--enable-accelerated-2d-canvas', '--no-sandbox'],
  });

  // =========================================================================
  // 1. CAPTURE HOMEPAGE (Desktop 1920x1080)
  // =========================================================================
  console.log('📸 [1/6] Capturing Homepage...');
  const homeContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: CAPTURES_DIR, size: { width: 1920, height: 1080 } },
  });
  const homePage = await homeContext.newPage();
  await homePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await sleep(1500);

  // Capture hero screenshot
  await homePage.screenshot({ path: path.join(CAPTURES_DIR, 'homepage-hero.png'), fullPage: false });

  // Smooth scroll through key homepage sections
  await homePage.evaluate(async () => {
    window.scrollTo({ top: 450, behavior: 'smooth' });
  });
  await sleep(1800);
  await homePage.screenshot({ path: path.join(CAPTURES_DIR, 'homepage-curated.png'), fullPage: false });

  await homePage.evaluate(async () => {
    window.scrollTo({ top: 980, behavior: 'smooth' });
  });
  await sleep(1800);
  await homePage.screenshot({ path: path.join(CAPTURES_DIR, 'homepage-categories.png'), fullPage: false });

  await homePage.close();
  const homeVideoPath = await homePage.video()?.path();
  if (homeVideoPath) {
    fs.renameSync(homeVideoPath, path.join(CAPTURES_DIR, 'homepage.webm'));
  }
  await homeContext.close();

  // =========================================================================
  // 2. CAPTURE DESTINATION DISCOVERY (Desktop 1920x1080)
  // =========================================================================
  console.log('📸 [2/6] Capturing Destination Discovery...');
  const discContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: CAPTURES_DIR, size: { width: 1920, height: 1080 } },
  });
  const discPage = await discContext.newPage();
  await discPage.goto(`${BASE_URL}/destinations`, { waitUntil: 'networkidle' });
  await sleep(1200);
  await discPage.screenshot({ path: path.join(CAPTURES_DIR, 'destinations-all.png'), fullPage: false });

  // Click on "Forts" filter if available or type in search
  const searchInput = discPage.locator('input[type="text"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.click();
    await sleep(400);
    await searchInput.fill('Sinhagad');
    await sleep(1200);
    await discPage.screenshot({ path: path.join(CAPTURES_DIR, 'destinations-search.png'), fullPage: false });
  }

  await discPage.close();
  const discVideoPath = await discPage.video()?.path();
  if (discVideoPath) {
    fs.renameSync(discVideoPath, path.join(CAPTURES_DIR, 'destinations.webm'));
  }
  await discContext.close();

  // =========================================================================
  // 3. CAPTURE EXPERIENCE 3D MAP & VECTOR PIN SYSTEM (Desktop 1920x1080)
  // =========================================================================
  console.log('📸 [3/6] Capturing Interactive Experience 3D Map...');
  const mapContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: CAPTURES_DIR, size: { width: 1920, height: 1080 } },
  });
  const mapPage = await mapContext.newPage();
  await mapPage.goto(`${BASE_URL}/experience`, { waitUntil: 'networkidle' });
  await sleep(2500); // Allow MapLibre WebGL tiles and hillshading to load
  await mapPage.screenshot({ path: path.join(CAPTURES_DIR, 'map-overview.png'), fullPage: false });

  // Click on "Forts" category filter pill in top bar
  const fortsPill = mapPage.locator('button:has-text("Forts"), button:has-text("किल्ले")').first();
  if (await fortsPill.isVisible()) {
    await fortsPill.click();
    await sleep(1500);
    await mapPage.screenshot({ path: path.join(CAPTURES_DIR, 'map-forts-filtered.png'), fullPage: false });
  }

  // Type in the top search bar to select Sinhagad Fort
  const mapSearchInput = mapPage.locator('input[placeholder*="Search destinations"], input[placeholder*="किल्ले"]').first();
  if (await mapSearchInput.isVisible()) {
    await mapSearchInput.click();
    await sleep(300);
    await mapSearchInput.fill('Sinhagad');
    await sleep(1000);
    await mapPage.screenshot({ path: path.join(CAPTURES_DIR, 'map-search-suggest.png'), fullPage: false });

    // Click the first autocomplete suggestion
    const firstSuggestion = mapPage.locator('[role="option"]').first();
    if (await firstSuggestion.isVisible()) {
      await firstSuggestion.click();
      await sleep(2500); // Wait for camera fly-to and drawer open
      await mapPage.screenshot({ path: path.join(CAPTURES_DIR, 'map-destination-drawer.png'), fullPage: false });
    }
  }

  await mapPage.close();
  const mapVideoPath = await mapPage.video()?.path();
  if (mapVideoPath) {
    fs.renameSync(mapVideoPath, path.join(CAPTURES_DIR, 'experience-map.webm'));
  }
  await mapContext.close();

  // =========================================================================
  // 4. CAPTURE TRIP PLANNER (Desktop 1920x1080)
  // =========================================================================
  console.log('📸 [4/6] Capturing Trip Planner...');
  const planContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: CAPTURES_DIR, size: { width: 1920, height: 1080 } },
  });
  const planPage = await planContext.newPage();
  await planPage.goto(`${BASE_URL}/planner`, { waitUntil: 'networkidle' });
  await sleep(1500);
  await planPage.screenshot({ path: path.join(CAPTURES_DIR, 'planner-config.png'), fullPage: false });

  // Scroll down to view sample itinerary schedule
  await planPage.evaluate(async () => {
    window.scrollTo({ top: 350, behavior: 'smooth' });
  });
  await sleep(1500);
  await planPage.screenshot({ path: path.join(CAPTURES_DIR, 'planner-schedule.png'), fullPage: false });

  await planPage.close();
  const planVideoPath = await planPage.video()?.path();
  if (planVideoPath) {
    fs.renameSync(planVideoPath, path.join(CAPTURES_DIR, 'trip-planner.webm'));
  }
  await planContext.close();

  // =========================================================================
  // 5. CAPTURE MY JOURNEY (Desktop 1920x1080)
  // =========================================================================
  console.log('📸 [5/6] Capturing My Journey & Milestones...');
  const jourContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: CAPTURES_DIR, size: { width: 1920, height: 1080 } },
  });
  const jourPage = await jourContext.newPage();
  await jourPage.goto(`${BASE_URL}/journey`, { waitUntil: 'networkidle' });
  await sleep(1500);
  await jourPage.screenshot({ path: path.join(CAPTURES_DIR, 'journey-overview.png'), fullPage: false });

  await jourPage.evaluate(async () => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });
  await sleep(1500);
  await jourPage.screenshot({ path: path.join(CAPTURES_DIR, 'journey-milestones.png'), fullPage: false });

  await jourPage.close();
  const jourVideoPath = await jourPage.video()?.path();
  if (jourVideoPath) {
    fs.renameSync(jourVideoPath, path.join(CAPTURES_DIR, 'my-journey.webm'));
  }
  await jourContext.close();

  // =========================================================================
  // 6. CAPTURE MOBILE EXPERIENCE (Smartphone 390x844)
  // =========================================================================
  console.log('📸 [6/6] Capturing Mobile Responsive Experience...');
  const mobContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: CAPTURES_DIR, size: { width: 390, height: 844 } },
  });
  const mobPage = await mobContext.newPage();
  await mobPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await sleep(1500);
  await mobPage.screenshot({ path: path.join(CAPTURES_DIR, 'mobile-home.png'), fullPage: false });

  // Scroll down on mobile
  await mobPage.evaluate(async () => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });
  await sleep(1500);
  await mobPage.screenshot({ path: path.join(CAPTURES_DIR, 'mobile-destinations.png'), fullPage: false });

  // Navigate to experience on mobile
  await mobPage.goto(`${BASE_URL}/experience`, { waitUntil: 'networkidle' });
  await sleep(2500);
  await mobPage.screenshot({ path: path.join(CAPTURES_DIR, 'mobile-map.png'), fullPage: false });

  await mobPage.close();
  const mobVideoPath = await mobPage.video()?.path();
  if (mobVideoPath) {
    fs.renameSync(mobVideoPath, path.join(CAPTURES_DIR, 'mobile-experience.webm'));
  }
  await mobContext.close();

  await browser.close();
  console.log('🎉 All website features captured successfully into video-production/captures!');
}

captureAllScenes().catch((err) => {
  console.error('❌ Capture failed:', err);
  process.exit(1);
});
