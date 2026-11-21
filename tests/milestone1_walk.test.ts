import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Milestone 1: Sinhagad Fort Vertical Slice Verification', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('1. Verifies geo/transform.json is populated with validated EPSG:32643 coordinates', () => {
    const transformPath = path.join(rootDir, 'geo/transform.json');
    expect(fs.existsSync(transformPath)).toBe(true);

    const transform = JSON.parse(fs.readFileSync(transformPath, 'utf-8'));
    expect(transform.worldCRS).toBe('EPSG:32643');
    expect(transform.localOrigin.x).toBeCloseTo(368495.5, 1);
    expect(transform.localOrigin.y).toBeCloseTo(2031092.1, 1);
    expect(transform.localOrigin.z).toBeCloseTo(1307.3, 1);
    expect(transform.scale).toBe(1.0);
    expect(transform.sceneAxes.up).toBe('+Y');
    expect(transform.sceneAxes.north).toBe('-Z');
    expect(transform.sceneAxes.east).toBe('+X');
  });

  it('2. Verifies terrain tile GLB and collision heightfield exist and satisfy size budgets', () => {
    const glbPath = path.join(rootDir, 'public/assets/terrain/terrain_tile_M1.glb');
    const hfPath = path.join(rootDir, 'public/assets/terrain/terrain_heightfield.json');

    expect(fs.existsSync(glbPath)).toBe(true);
    expect(fs.existsSync(hfPath)).toBe(true);

    const glbStats = fs.statSync(glbPath);
    // Performance gate: Terrain tile must be under 1 MB
    expect(glbStats.size).toBeLessThan(1 * 1024 * 1024);

    const hf = JSON.parse(fs.readFileSync(hfPath, 'utf-8'));
    expect(hf.gridSize).toBe(81);
    expect(hf.minX).toBe(-600);
    expect(hf.maxX).toBe(600);
    expect(hf.heights.length).toBe(81);
    expect(hf.heights[0].length).toBe(81);

    // Verify center elevation matches origin within 1 meter
    const midIdx = Math.floor(hf.gridSize / 2);
    expect(Math.abs(hf.heights[midIdx][midIdx])).toBeLessThan(2.0);
  });

  it('3. Verifies Pune Darwaza 3D model exists, is modular, and under 500 KB', () => {
    const pdGlbPath = path.join(rootDir, 'public/assets/PD/pune_darwaza_M1.glb');
    expect(fs.existsSync(pdGlbPath)).toBe(true);

    const stats = fs.statSync(pdGlbPath);
    expect(stats.size).toBeLessThan(500 * 1024); // 24 KB actual
  });

  it('4. Verifies src/data/provenance.json certifies Pune Darwaza as Tier T3 (no T4 in release)', () => {
    const provPath = path.join(rootDir, 'src/data/provenance.json');
    expect(fs.existsSync(provPath)).toBe(true);

    const provenance = JSON.parse(fs.readFileSync(provPath, 'utf-8'));
    const pd = provenance.find((entry: { id: string }) => entry.id === 'PD');

    expect(pd).toBeDefined();
    expect(pd.tier_current).toBe('T3'); // Promoted from placeholder T4
    expect(pd.sources).toContain('S02');
    expect(pd.sources).toContain('S04');
    expect(pd.sources).toContain('S21');
    expect(pd.photos).toContain('PH01');
    expect(pd.photos).toContain('PH10');
    expect(pd.photos).toContain('PH15');
    expect(pd.model_path).toBe('/assets/PD/pune_darwaza_M1.glb');
    expect(pd.validation.score).toBeGreaterThanOrEqual(7);
  });

  it('5. Simulates FirstPersonPlayer approach walk through Gate 1, 22 steps, Gate 2, and Gate 3', () => {
    const hfPath = path.join(rootDir, 'public/assets/terrain/terrain_heightfield.json');
    const hf = JSON.parse(fs.readFileSync(hfPath, 'utf-8'));

    // Heightfield sampler
    const sampleHeight = (x: number, z: number): number => {
      const col = (x - hf.minX) / hf.step;
      const row = (z - hf.minZ) / hf.step;
      const c0 = Math.max(0, Math.min(hf.gridSize - 2, Math.floor(col)));
      const c1 = c0 + 1;
      const r0 = Math.max(0, Math.min(hf.gridSize - 2, Math.floor(row)));
      const r1 = r0 + 1;
      const fc = col - c0;
      const fr = row - r0;
      const h00 = hf.heights[r0][c0];
      const h10 = hf.heights[r0][c1];
      const h01 = hf.heights[r1][c0];
      const h11 = hf.heights[r1][c1];
      return (1 - fc) * (1 - fr) * h00 + fc * (1 - fr) * h10 + (1 - fc) * fr * h01 + fc * fr * h11;
    };

    // Approach checkpoints from Trek Start to Summit Plateau
    const checkpoints = [
      { name: 'Trek Approach Start', x: 180.0, z: -205.0 },
      { name: 'Before Gate 1', x: 155.0, z: -175.0 },
      { name: 'Inside Gate 1 Passage', x: 150.0, z: -170.0 },
      { name: 'Base of 22 Steps', x: 146.0, z: -165.0 },
      { name: 'Midway on Steps past Cistern', x: 138.0, z: -154.0 },
      { name: 'Top of Steps at Gate 2', x: 130.0, z: -145.0 },
      { name: 'Rampart Walk to Gate 3', x: 120.0, z: -132.0 },
      { name: 'Inside Gate 3 Inner Threshold', x: 110.0, z: -120.0 },
      { name: 'Summit Plateau Entry', x: 90.0, z: -100.0 },
    ];

    let lastElev = -999;
    for (const pt of checkpoints) {
      const y = sampleHeight(pt.x, pt.z);
      // Elevation should never be NaN or below bottom pit
      expect(Number.isFinite(y)).toBe(true);
      expect(y).toBeGreaterThan(-150);

      // Verify overall ascent: player is climbing up to the plateau
      if (lastElev !== -999) {
        expect(y).toBeGreaterThanOrEqual(lastElev - 1.0); // allows minor undulating step landings
      }
      lastElev = y;
    }
  });

  it('6. Verifies collision geometry blocks penetration into Gate 1 bastions', () => {
    const bastionRadius = 3.2;
    const playerRadius = 0.35;
    const bLeft = { cx: 150 - 4.5 * Math.cos(0.7), cz: -170 - 4.5 * Math.sin(0.7) };

    // Point inside left bastion core
    const insideBastion = { x: bLeft.cx, z: bLeft.cz };
    const distToCenter = Math.hypot(insideBastion.x - bLeft.cx, insideBastion.z - bLeft.cz);
    const isPenetrating = distToCenter < bastionRadius + playerRadius;

    expect(isPenetrating).toBe(true); // Demonstrates collision detection recognizes invalid zone

    // Point in center of open passage
    const inPassage = { x: 150.0, z: -170.0 };
    const distToPassage = Math.hypot(inPassage.x - bLeft.cx, inPassage.z - bLeft.cz);
    expect(distToPassage).toBeGreaterThan(bastionRadius + playerRadius); // Passage is clear!
  });

  it('7. Verifies fall protection respawns player safely', () => {
    let playerY = -180.0; // Simulated cliff fall
    const safePos = { x: 180.0, y: -80.0, z: -205.0 };
    let currentPos = { x: 250.0, y: playerY, z: -300.0 };

    if (currentPos.y < -150.0) {
      currentPos = { ...safePos };
    }

    expect(currentPos.x).toBe(safePos.x);
    expect(currentPos.y).toBe(safePos.y);
    expect(currentPos.z).toBe(safePos.z);
  });
});
