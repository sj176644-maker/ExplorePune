import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Milestone 5 - Fortification Walls (FW) Verification', () => {
  const glbPath = path.resolve(__dirname, '../public/assets/FW/fortification_walls_M1.glb');
  const colPath = path.resolve(__dirname, '../public/assets/FW/fortification_walls_collision.json');
  const provenancePath = path.resolve(__dirname, '../src/data/provenance.json');
  const landmarksPath = path.resolve(__dirname, '../data/landmarks.json');

  it('verifies Fortification Walls GLB asset exists within size budget', () => {
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
      'SIN_FW_SEG_01',
      'SIN_FW_SEG_02',
      'SIN_FW_SEG_03',
      'SIN_FW_SEG_04',
      'SIN_FW_SEG_05',
      'SIN_FW_KHADAKADA',
      'SIN_FW_POSTERN',
      'SIN_FW_WATERCHANNEL'
    ];

    for (const node of expectedNodes) {
      expect(glbString).toContain(node);
    }
  });

  it('verifies Fortification Walls collision primitives structure', () => {
    expect(fs.existsSync(colPath)).toBe(true);
    const raw = fs.readFileSync(colPath, 'utf-8');
    const data = JSON.parse(raw);

    expect(data.landmark_id).toBe('FW');
    expect(data.wall_boxes).toBeDefined();
    expect(Array.isArray(data.wall_boxes)).toBe(true);
    expect(data.wall_boxes.length).toBeGreaterThanOrEqual(10);
    expect(data.walkable_ramparts).toBeDefined();
    expect(data.walkable_ramparts.length).toBeGreaterThanOrEqual(1);

    // Verify postern gate opening
    const posternBox = data.wall_boxes.find((b: any) => b.passableOpening);
    expect(posternBox).toBeDefined();
    expect(posternBox.passableOpening.w).toBe(1.2);
    expect(posternBox.passableOpening.h).toBe(2.1);

    // Verify miniature water channel aperture
    const wcBox = data.wall_boxes.find((b: any) => b.aperture);
    expect(wcBox).toBeDefined();
    expect(wcBox.aperture.w).toBe(0.6);
    expect(wcBox.aperture.h).toBe(0.9);
  });

  it('verifies provenance tracking in src/data/provenance.json', () => {
    expect(fs.existsSync(provenancePath)).toBe(true);
    const prov = JSON.parse(fs.readFileSync(provenancePath, 'utf-8'));
    const fwEntry = Array.isArray(prov) ? prov.find((l: any) => l.id === 'FW') : (prov.landmarks ? prov.landmarks.FW : prov.FW);
    expect(fwEntry).toBeDefined();
    expect(fwEntry.tier_current).toBe('T3');
    expect(fwEntry.status).toBe('milestone5_blockout');
    expect(fwEntry.model_path).toBe('/assets/FW/fortification_walls_M1.glb');
  });

  it('verifies landmarks registry in data/landmarks.json', () => {
    expect(fs.existsSync(landmarksPath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(landmarksPath, 'utf-8'));
    const fw = data.landmarks.find((l: any) => l.id === 'FW');
    expect(fw).toBeDefined();
    expect(fw.status).toBe('milestone5_blockout');
    expect(fw.model_path).toBe('/assets/FW/fortification_walls_M1.glb');
  });
});
