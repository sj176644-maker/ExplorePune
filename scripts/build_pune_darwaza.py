#!/usr/bin/env python3
"""Build historically verified 3D assembly of Pune Darwaza (Three sequential gates,
22 stone steps, rock-cut cistern, guard rooms, bastions, and relief carvings).

Outputs:
  public/assets/PD/pune_darwaza_M1.glb
"""
import trimesh, numpy as np, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def build_pune_darwaza():
    out_dir = ROOT / "public/assets/PD"
    out_dir.mkdir(parents=True, exist_ok=True)

    def make_bastion(center, radius, height, num_slices=24):
        cylinder = trimesh.creation.cylinder(radius=radius, height=height, sections=num_slices)
        cylinder.apply_translation([center[0], center[1] + height / 2.0, center[2]])
        return cylinder

    def make_gatehouse(center, width, height, depth, passage_w=3.2, passage_h=4.5):
        pillar_w = (width - passage_w) / 2.0
        left_x = center[0] - width / 2.0 + pillar_w / 2.0
        right_x = center[0] + width / 2.0 - pillar_w / 2.0
        
        left_pillar = trimesh.creation.box(extents=[pillar_w, height, depth])
        left_pillar.apply_translation([left_x, center[1] + height / 2.0, center[2]])
        
        right_pillar = trimesh.creation.box(extents=[pillar_w, height, depth])
        right_pillar.apply_translation([right_x, center[1] + height / 2.0, center[2]])
        
        header_h = height - passage_h
        header_y = center[1] + passage_h + header_h / 2.0
        header = trimesh.creation.box(extents=[passage_w, header_h, depth])
        header.apply_translation([center[0], header_y, center[2]])
        
        parapet = trimesh.creation.box(extents=[width, 0.8, depth * 0.9])
        parapet.apply_translation([center[0], center[1] + height + 0.4, center[2]])
        
        return [left_pillar, right_pillar, header, parapet]

    # Gate 1 (Outer Gate)
    g1_center = [150.0, -57.3, -170.0]
    g1_angle = np.radians(40.0)
    cos_a, sin_a = np.cos(g1_angle), np.sin(g1_angle)

    b1_left = make_bastion([g1_center[0] - 4.5 * cos_a, g1_center[1], g1_center[2] - 4.5 * sin_a], radius=3.2, height=8.0)
    b1_right = make_bastion([g1_center[0] + 4.5 * cos_a, g1_center[1], g1_center[2] + 4.5 * sin_a], radius=3.2, height=8.0)
    g1_walls = make_gatehouse(g1_center, width=6.5, height=6.0, depth=3.0, passage_w=3.2, passage_h=4.5)

    sharabha_left = trimesh.creation.box(extents=[0.8, 0.8, 0.1])
    sharabha_left.apply_translation([g1_center[0] - 2.0, g1_center[1] + 3.8, g1_center[2] - 1.55])
    sharabha_right = trimesh.creation.box(extents=[0.8, 0.8, 0.1])
    sharabha_right.apply_translation([g1_center[0] + 2.0, g1_center[1] + 3.8, g1_center[2] - 1.55])

    # 22 stone steps between Gate 1 and Gate 2
    stair_start = np.array([148.0, -57.0, -168.0])
    stair_end = np.array([132.0, -40.5, -147.0])
    steps = []
    n_steps = 22
    for i in range(n_steps):
        t = (i + 0.5) / n_steps
        pos = (1 - t) * stair_start + t * stair_end
        step = trimesh.creation.box(extents=[3.2, 0.22, 1.1])
        step.apply_translation(pos)
        steps.append(step)

    # Rock-cut cistern on cliffside
    cistern_pos = [139.0, -48.0, -156.0]
    cistern_outer = trimesh.creation.box(extents=[4.5, 2.5, 3.5])
    cistern_outer.apply_translation([cistern_pos[0], cistern_pos[1] + 1.25, cistern_pos[2]])
    cistern_water = trimesh.creation.box(extents=[3.8, 0.2, 2.8])
    cistern_water.apply_translation([cistern_pos[0], cistern_pos[1] + 1.8, cistern_pos[2]])

    # Gate 2 (Middle Gate)
    g2_center = [130.0, -39.3, -145.0]
    b2_left = make_bastion([g2_center[0] - 4.5 * cos_a, g2_center[1], g2_center[2] - 4.5 * sin_a], radius=3.0, height=7.5)
    b2_right = make_bastion([g2_center[0] + 4.5 * cos_a, g2_center[1], g2_center[2] + 4.5 * sin_a], radius=3.0, height=7.5)
    g2_walls = make_gatehouse(g2_center, width=6.2, height=5.8, depth=2.8, passage_w=3.0, passage_h=4.2)

    # Rampart wall
    ramp_wall = trimesh.creation.box(extents=[1.2, 4.5, 28.0])
    ramp_wall.apply_translation([118.0, -29.0, -132.0])

    # Gate 3 (Inner Gate)
    g3_center = [110.0, -19.3, -120.0]
    b3_left = make_bastion([g3_center[0] - 4.8 * cos_a, g3_center[1], g3_center[2] - 4.8 * sin_a], radius=3.5, height=8.0)
    b3_right = make_bastion([g3_center[0] + 4.8 * cos_a, g3_center[1], g3_center[2] + 4.8 * sin_a], radius=3.5, height=8.0)
    g3_walls = make_gatehouse(g3_center, width=7.0, height=6.2, depth=3.2, passage_w=3.2, passage_h=4.6)

    guard_l = trimesh.creation.box(extents=[3.0, 3.5, 3.2])
    guard_l.apply_translation([g3_center[0] - 7.5, g3_center[1] + 1.75, g3_center[2]])
    guard_r = trimesh.creation.box(extents=[3.0, 3.5, 3.2])
    guard_r.apply_translation([g3_center[0] + 7.5, g3_center[1] + 1.75, g3_center[2]])

    lotus_panel = trimesh.creation.box(extents=[1.4, 0.5, 0.1])
    lotus_panel.apply_translation([g3_center[0], g3_center[1] + 4.8, g3_center[2] - 1.65])

    all_parts = [
        b1_left, b1_right, *g1_walls, sharabha_left, sharabha_right,
        *steps, cistern_outer, cistern_water,
        b2_left, b2_right, *g2_walls, ramp_wall,
        b3_left, b3_right, *g3_walls, guard_l, guard_r, lotus_panel
    ]

    merged = trimesh.util.concatenate(all_parts)
    merged.fix_normals()
    colors = np.full((len(merged.vertices), 4), [118, 110, 100, 255], dtype=np.uint8)
    merged.visual.vertex_colors = colors

    glb_path = out_dir / "pune_darwaza_M1.glb"
    merged.export(str(glb_path))
    print(f"Exported {glb_path}: {len(merged.vertices)} vertices, {len(merged.faces)} faces, {glb_path.stat().st_size} bytes")

if __name__ == "__main__":
    build_pune_darwaza()
