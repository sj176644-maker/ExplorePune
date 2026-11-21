import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Milestone 4: Kalyan Darwaza (KD) Architectural Verification', () => {
  const root = path.resolve(__dirname, '..');
  const glbPath = path.join(root, 'public/assets/KD/kalyan_darwaza_M1.glb');
  const collisionPath = path.join(root, 'public/assets/KD/kalyan_darwaza_collision.json');
  const provenancePath = path.join(root, 'src/data/provenance.json');
  const landmarksPath = path.join(root, 'data/landmarks.json');

  it('1. Kalyan Darwaza GLB file exists and is within budget (< 5 MB)', () => {
    expect(fs.existsSync(glbPath)).toBe(true);
    const stats = fs.statSync(glbPath);
    expect(stats.size).toBeGreaterThan(5000); // At least 5 KB
    expect(stats.size).toBeLessThan(5 * 1024 * 1024); // Strictly under 5 MB budget
  });

  it('2. Kalyan Darwaza GLB contains all 7 mandatory architectural spec nodes', () => {
    const glbBuffer = fs.readFileSync(glbPath);
    // Scan GLB binary for JSON chunk node names
    const glbText = glbBuffer.toString('utf-8', 0, Math.min(glbBuffer.length, 16384));

    const requiredNodes = [
      'SIN_KD_G1',
      'SIN_KD_G2',
      'SIN_KD_STAIR',
      'SIN_KD_GUARDROOM',
      'SIN_KD_RELIEF_BOAR',
      'SIN_KD_RELIEF_MAHOUT',
      'SIN_KD_QUARTERS',
    ];

    for (const node of requiredNodes) {
      expect(glbText.includes(node)).toBe(true);
    }
  });

  it('3. Kalyan Darwaza collision primitives data integrity', () => {
    expect(fs.existsSync(collisionPath)).toBe(true);
    const raw = fs.readFileSync(collisionPath, 'utf-8');
    const col = JSON.parse(raw);

    expect(col.landmark_id).toBe('KD');
    expect(col.bastion_colliders.length).toBe(4); // 2 at Gate 1, 2 at Gate 2
    expect(col.wall_colliders.length).toBeGreaterThanOrEqual(4);
    expect(col.walkable_stair.step_count).toBe(22);
    expect(col.walkable_stair.riser).toBeLessThanOrEqual(0.35); // Max climbable step height
  });

  it('4. Local-to-World Coordinate Transform for Kalyan Darwaza', () => {
    const transformPath = path.join(root, 'geo/transform.json');
    const transform = JSON.parse(fs.readFileSync(transformPath, 'utf-8'));

    const X0 = transform.localOrigin.x; // 368495.5
    const Y0 = transform.localOrigin.y; // 2031092.1
    const Z0 = transform.localOrigin.z; // 1307.3

    // Kalyan Darwaza local anchor
    const localX = -243.4;
    const localZ = 514.5;
    const localY = -62.3;

    const easting = X0 + localX;
    const northing = Y0 - localZ;
    const elevation = Z0 + localY;

    // Verify coordinates match UTM 43N expectations
    expect(Math.round(easting)).toBe(368252);
    expect(Math.round(northing)).toBe(2030578);
    expect(Math.round(elevation)).toBe(1245);
  });

  it('5. Provenance certification register verifies KD at Tier T3', () => {
    expect(fs.existsSync(provenancePath)).toBe(true);
    const prov = JSON.parse(fs.readFileSync(provenancePath, 'utf-8'));
    const kd = prov.find((item: any) => item.id === 'KD');

    expect(kd).toBeDefined();
    expect(kd.tier_current).toBe('T3');
    expect(kd.model_path).toBe('/assets/KD/kalyan_darwaza_M1.glb');
    expect(kd.sources.length).toBeGreaterThanOrEqual(4);
    expect(kd.photos).toContain('PH02');
    expect(kd.validation.score).toBeGreaterThanOrEqual(7);
  });

  it('6. Landmarks.json synchronization for KD', () => {
    expect(fs.existsSync(landmarksPath)).toBe(true);
    const landmarks = JSON.parse(fs.readFileSync(landmarksPath, 'utf-8'));
    const kd = landmarks.landmarks.find((item: any) => item.id === 'KD');

    expect(kd).toBeDefined();
    expect(kd.status).toBe('milestone4_blockout');
    expect(kd.model_path).toBe('/assets/KD/kalyan_darwaza_M1.glb');
  });
});
