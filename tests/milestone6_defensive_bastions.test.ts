import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Milestone 6 - Defensive Bastions (BS) Verification', () => {
  const glbPath = path.resolve(__dirname, '../public/assets/BS/defensive_bastions_M1.glb');
  const colPath = path.resolve(__dirname, '../public/assets/BS/defensive_bastions_collision.json');
  const provenancePath = path.resolve(__dirname, '../src/data/provenance.json');
  const landmarksPath = path.resolve(__dirname, '../data/landmarks.json');

  it('verifies Defensive Bastions GLB asset exists within size budget', () => {
    expect(fs.existsSync(glbPath)).toBe(true);
    const stats = fs.statSync(glbPath);
    // Size budget <= 500 KB for mobile/web heritage delivery
    expect(stats.size).toBeGreaterThan(10 * 1024);
    expect(stats.size).toBeLessThan(500 * 1024);
  });

  it('verifies mandatory GLB nodes per Sinhagad 3D Architecture Spec', () => {
    const buffer = fs.readFileSync(glbPath);
    const glbString = buffer.toString('utf-8');

    const expectedNodes = [
      'SIN_BS_TEHALNI',
      'SIN_BS_ZUNJAR',
      'SIN_BS_KHADAKADA',
      'SIN_BS_TVSIDE',
      'SIN_BS_CANNON',
      'SIN_BS_GATE_xx'
    ];

    for (const node of expectedNodes) {
      expect(glbString).toContain(node);
    }
  });

  it('verifies Defensive Bastions collision primitives structure', () => {
    expect(fs.existsSync(colPath)).toBe(true);
    const raw = fs.readFileSync(colPath, 'utf-8');
    const data = JSON.parse(raw);

    expect(data.landmark_id).toBe('BS');
    expect(data.bastion_cylinders).toBeDefined();
    expect(Array.isArray(data.bastion_cylinders)).toBe(true);
    expect(data.bastion_cylinders.length).toBeGreaterThanOrEqual(5);

    // Verify walkable platforms
    expect(data.walkable_platforms).toBeDefined();
    expect(data.walkable_platforms.length).toBeGreaterThanOrEqual(3);

    // Verify special features (cannon and rock-cut cistern)
    expect(data.special_features).toBeDefined();
    const cannonFeature = data.special_features.find((f: any) => f.type === 'cannon');
    expect(cannonFeature).toBeDefined();
    expect(cannonFeature.length).toBe(1.85);

    const cisternFeature = data.special_features.find((f: any) => f.type === 'cistern');
    expect(cisternFeature).toBeDefined();
  });

  it('verifies provenance tracking in src/data/provenance.json', () => {
    expect(fs.existsSync(provenancePath)).toBe(true);
    const prov = JSON.parse(fs.readFileSync(provenancePath, 'utf-8'));
    const bsEntry = Array.isArray(prov) ? prov.find((l: any) => l.id === 'BS') : (prov.landmarks ? prov.landmarks.BS : prov.BS);
    expect(bsEntry).toBeDefined();
    expect(bsEntry.tier_current).toBe('T3');
    expect(bsEntry.status).toBe('milestone6_blockout');
    expect(bsEntry.model_path).toBe('/assets/BS/defensive_bastions_M1.glb');
    expect(bsEntry.validation.score).toBe(8.0);
  });

  it('verifies landmarks registry in data/landmarks.json', () => {
    expect(fs.existsSync(landmarksPath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(landmarksPath, 'utf-8'));
    const bs = data.landmarks.find((l: any) => l.id === 'BS');
    expect(bs).toBeDefined();
    expect(bs.status).toBe('milestone6_blockout');
    expect(bs.model_path).toBe('/assets/BS/defensive_bastions_M1.glb');
  });
});
