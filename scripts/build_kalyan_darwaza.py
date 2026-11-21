#!/usr/bin/env python3
"""Build historically verified 3D assembly of Kalyan Darwaza (KD).
Conforms to data/landmarks.json and docs/Sinhagad_3D_Architecture_Spec.pdf:
- Two sequential gates (KD_G1 and KD_G2) enclosed by fortified ramparts
- 22 steep stone steps between Gate 1 and Gate 2
- Gate 1 arch: pointed portal, two lotus medallions, damaged festoon, Shaka 1672 (1750 CE) inscription panel
- Flanking bastions with boar relief (east) and mahout on elephant relief (west)
- Small guardroom inside the wall near Gate 1
- Soldiers' quarters inside interior ramparts
- Straight inner staircase into fort interior

Outputs:
  public/assets/KD/kalyan_darwaza_M1.glb
  public/assets/KD/kalyan_darwaza_collision.json
"""
import os
import json
import trimesh
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def build_kalyan_darwaza():
    out_dir = ROOT / "public/assets/KD"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Orientation: Gate faces South-Southwest (azimuth ~205 degrees)
    # Approach climbs from SW to NE into the citadel plateau
    angle = np.radians(25.0)  # rotation off south axis
    cos_a, sin_a = np.cos(angle), np.sin(angle)

    def rotate_point(pt, center, rad):
        c, s = np.cos(rad), np.sin(rad)
        dx = pt[0] - center[0]
        dz = pt[2] - center[2]
        return [
            center[0] + dx * c - dz * s,
            pt[1],
            center[2] + dx * s + dz * c
        ]

    def make_bastion(center, radius, height, num_slices=24):
        cyl = trimesh.creation.cylinder(radius=radius, height=height, sections=num_slices)
        cyl.apply_translation([center[0], center[1] + height / 2.0, center[2]])
        return cyl

    def make_gatehouse(center, width, height, depth, passage_w=2.8, passage_h=4.0):
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

    # --- 1. GATE 1 (Outer Kalyan Gate) ---
    # Centered at local X: -243.4, Y: -64.6, Z: +514.5
    g1_center = [-243.4, -64.6, 514.5]
    b1_offset = 4.4

    b1_west = make_bastion([g1_center[0] - b1_offset * cos_a, g1_center[1], g1_center[2] - b1_offset * sin_a], radius=3.2, height=8.2)
    b1_east = make_bastion([g1_center[0] + b1_offset * cos_a, g1_center[1], g1_center[2] + b1_offset * sin_a], radius=3.2, height=8.2)
    g1_walls = make_gatehouse(g1_center, width=6.2, height=5.8, depth=2.8, passage_w=2.8, passage_h=4.0)

    # Lotus medallions on spandrels
    lotus_l = trimesh.creation.box(extents=[0.5, 0.5, 0.08])
    lotus_l.apply_translation([g1_center[0] - 1.8, g1_center[1] + 3.8, g1_center[2] + 1.45])
    lotus_r = trimesh.creation.box(extents=[0.5, 0.5, 0.08])
    lotus_r.apply_translation([g1_center[0] + 1.8, g1_center[1] + 3.8, g1_center[2] + 1.45])

    # Damaged festoon lintel
    festoon = trimesh.creation.box(extents=[2.4, 0.35, 0.12])
    festoon.apply_translation([g1_center[0], g1_center[1] + 4.15, g1_center[2] + 1.45])

    # Inscription plaque (Balaji Bajirao Peshwa, Shaka 1672 / 1750 CE)
    inscr_plaque = trimesh.creation.box(extents=[1.2, 0.6, 0.08])
    inscr_plaque.apply_translation([g1_center[0], g1_center[1] + 4.8, g1_center[2] + 1.45])

    g1_parts = [b1_west, b1_east, *g1_walls, lotus_l, lotus_r, festoon, inscr_plaque]
    mesh_g1 = trimesh.util.concatenate(g1_parts)
    mesh_g1.fix_normals()
    mesh_g1.visual.vertex_colors = np.full((len(mesh_g1.vertices), 4), [115, 108, 98, 255], dtype=np.uint8)

    # --- 2. BASTION RELIEFS ---
    # Boar carving on eastern bastion outer face
    relief_boar = trimesh.creation.box(extents=[0.75, 0.55, 0.12])
    relief_boar.apply_translation([g1_center[0] + b1_offset * cos_a + 1.2, g1_center[1] + 3.2, g1_center[2] + b1_offset * sin_a + 2.8])
    relief_boar.visual.vertex_colors = np.full((len(relief_boar.vertices), 4), [145, 135, 120, 255], dtype=np.uint8)

    # Mahout riding elephant on western bastion outer face
    relief_mahout = trimesh.creation.box(extents=[0.85, 0.75, 0.12])
    relief_mahout.apply_translation([g1_center[0] - b1_offset * cos_a - 1.2, g1_center[1] + 3.2, g1_center[2] - b1_offset * sin_a + 2.8])
    relief_mahout.visual.vertex_colors = np.full((len(relief_mahout.vertices), 4), [145, 135, 120, 255], dtype=np.uint8)

    # --- 3. STAIRCASE BETWEEN GATES (22 steps) ---
    stair_start = np.array([-243.0, -64.3, 513.0])
    stair_end = np.array([-235.5, -60.2, 496.0])
    n_steps = 22
    step_parts = []
    for i in range(n_steps):
        t = (i + 0.5) / n_steps
        pos = (1 - t) * stair_start + t * stair_end
        st = trimesh.creation.box(extents=[3.0, 0.22, 1.0])
        st.apply_translation(pos)
        step_parts.append(st)

    # Flanking passage rampart walls
    pw_left = trimesh.creation.box(extents=[1.0, 3.8, 18.0])
    pw_left.apply_translation([-242.0, -60.5, 504.0])
    pw_right = trimesh.creation.box(extents=[1.0, 3.8, 18.0])
    pw_right.apply_translation([-236.5, -60.5, 504.0])

    mesh_stair = trimesh.util.concatenate([*step_parts, pw_left, pw_right])
    mesh_stair.fix_normals()
    mesh_stair.visual.vertex_colors = np.full((len(mesh_stair.vertices), 4), [110, 102, 92, 255], dtype=np.uint8)

    # --- 4. GUARDROOM ---
    guard_pos = [-246.5, -63.5, 506.0]
    guard_outer = trimesh.creation.box(extents=[3.2, 3.0, 2.6])
    guard_outer.apply_translation([guard_pos[0], guard_pos[1] + 1.5, guard_pos[2]])
    guard_door = trimesh.creation.box(extents=[1.0, 2.1, 0.3])
    guard_door.apply_translation([guard_pos[0] + 1.6, guard_pos[1] + 1.05, guard_pos[2]])

    mesh_guard = trimesh.util.concatenate([guard_outer, guard_door])
    mesh_guard.fix_normals()
    mesh_guard.visual.vertex_colors = np.full((len(mesh_guard.vertices), 4), [118, 110, 100, 255], dtype=np.uint8)

    # --- 5. GATE 2 (Inner Kalyan Gate) ---
    # Centered at local X: -235.0, Y: -60.0, Z: 494.5
    g2_center = [-235.0, -60.0, 494.5]
    b2_offset = 4.2
    b2_west = make_bastion([g2_center[0] - b2_offset * cos_a, g2_center[1], g2_center[2] - b2_offset * sin_a], radius=3.0, height=7.8)
    b2_east = make_bastion([g2_center[0] + b2_offset * cos_a, g2_center[1], g2_center[2] + b2_offset * sin_a], radius=3.0, height=7.8)
    g2_walls = make_gatehouse(g2_center, width=6.0, height=5.5, depth=2.8, passage_w=2.6, passage_h=3.8)

    g2_parts = [b2_west, b2_east, *g2_walls]
    mesh_g2 = trimesh.util.concatenate(g2_parts)
    mesh_g2.fix_normals()
    mesh_g2.visual.vertex_colors = np.full((len(mesh_g2.vertices), 4), [120, 112, 102, 255], dtype=np.uint8)

    # --- 6. SOLDIERS' QUARTERS & INNER STAIR INTO FORT ---
    # Soldiers' quarters in interior ramparts
    sq_pos = [-227.0, -58.5, 486.0]
    sq_box = trimesh.creation.box(extents=[7.5, 3.4, 3.8])
    sq_box.apply_translation([sq_pos[0], sq_pos[1] + 1.7, sq_pos[2]])

    # Straight inner staircase leading into fort interior
    inner_stair_start = np.array([-234.0, -59.5, 492.5])
    inner_stair_end = np.array([-228.0, -55.5, 480.0])
    n_inner = 12
    inner_steps = []
    for i in range(n_inner):
        t = (i + 0.5) / n_inner
        pos = (1 - t) * inner_stair_start + t * inner_stair_end
        st = trimesh.creation.box(extents=[2.6, 0.22, 1.1])
        st.apply_translation(pos)
        inner_steps.append(st)

    # Rampart walkway connecting towards Tehalni Buruj
    rampart_walk = trimesh.creation.box(extents=[1.4, 3.5, 16.0])
    rampart_walk.apply_translation([-222.0, -56.5, 485.0])

    mesh_quarters = trimesh.util.concatenate([sq_box, *inner_steps, rampart_walk])
    mesh_quarters.fix_normals()
    mesh_quarters.visual.vertex_colors = np.full((len(mesh_quarters.vertices), 4), [116, 108, 98, 255], dtype=np.uint8)

    # --- 7. ASSEMBLE TRIMEH SCENE WITH SPECIFIED NODES ---
    scene = trimesh.Scene()
    scene.add_geometry(mesh_g1, node_name="SIN_KD_G1", geom_name="SIN_KD_G1")
    scene.add_geometry(mesh_g2, node_name="SIN_KD_G2", geom_name="SIN_KD_G2")
    scene.add_geometry(mesh_stair, node_name="SIN_KD_STAIR", geom_name="SIN_KD_STAIR")
    scene.add_geometry(mesh_guard, node_name="SIN_KD_GUARDROOM", geom_name="SIN_KD_GUARDROOM")
    scene.add_geometry(relief_boar, node_name="SIN_KD_RELIEF_BOAR", geom_name="SIN_KD_RELIEF_BOAR")
    scene.add_geometry(relief_mahout, node_name="SIN_KD_RELIEF_MAHOUT", geom_name="SIN_KD_RELIEF_MAHOUT")
    scene.add_geometry(mesh_quarters, node_name="SIN_KD_QUARTERS", geom_name="SIN_KD_QUARTERS")

    glb_path = out_dir / "kalyan_darwaza_M1.glb"
    glb_data = scene.export(file_type="glb")
    with open(glb_path, "wb") as f:
        f.write(glb_data)

    total_verts = sum(len(g.vertices) for g in [mesh_g1, mesh_g2, mesh_stair, mesh_guard, relief_boar, relief_mahout, mesh_quarters])
    total_faces = sum(len(g.faces) for g in [mesh_g1, mesh_g2, mesh_stair, mesh_guard, relief_boar, relief_mahout, mesh_quarters])

    print(f"Exported {glb_path}:")
    print(f"  Nodes: {list(scene.geometry.keys())}")
    print(f"  Total Vertices: {total_verts}, Total Faces: {total_faces}")
    print(f"  File Size: {len(glb_data)} bytes ({len(glb_data)/1024:.1f} KB)")

    # --- 8. COLLISION PRIMITIVES ---
    collision_data = {
        "landmark_id": "KD",
        "name": "Kalyan Darwaza",
        "position": { "x": g1_center[0], "y": g1_center[1], "z": g1_center[2] },
        "bastion_colliders": [
            { "name": "KD_B1_West", "cx": g1_center[0] - b1_offset * cos_a, "cz": g1_center[2] - b1_offset * sin_a, "radius": 3.4 },
            { "name": "KD_B1_East", "cx": g1_center[0] + b1_offset * cos_a, "cz": g1_center[2] + b1_offset * sin_a, "radius": 3.4 },
            { "name": "KD_B2_West", "cx": g2_center[0] - b2_offset * cos_a, "cz": g2_center[2] - b2_offset * sin_a, "radius": 3.2 },
            { "name": "KD_B2_East", "cx": g2_center[0] + b2_offset * cos_a, "cz": g2_center[2] + b2_offset * sin_a, "radius": 3.2 }
        ],
        "wall_colliders": [
            { "name": "KD_Passage_Left", "minX": -243.0, "maxX": -241.0, "minZ": 495.0, "maxZ": 513.0 },
            { "name": "KD_Passage_Right", "minX": -237.5, "maxX": -235.5, "minZ": 495.0, "maxZ": 513.0 },
            { "name": "KD_Guardroom", "minX": -248.5, "maxX": -244.5, "minZ": 504.0, "maxZ": 508.0 },
            { "name": "KD_Quarters", "minX": -231.0, "maxX": -223.0, "minZ": 484.0, "maxZ": 488.0 }
        ],
        "walkable_stair": {
            "start": stair_start.tolist(),
            "end": stair_end.tolist(),
            "step_count": n_steps,
            "riser": 0.19,
            "tread": 0.36
        }
    }

    col_path = out_dir / "kalyan_darwaza_collision.json"
    with open(col_path, "w", encoding="utf-8") as f:
        json.dump(collision_data, f, indent=2)
    print(f"Exported collision primitives to {col_path}")

if __name__ == "__main__":
    build_kalyan_darwaza()
