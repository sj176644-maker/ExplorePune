#!/usr/bin/env python3
"""Build historically verified 3D assembly of Fortification Walls (FW).
Conforms to data/landmarks.json and docs/Sinhagad_3D_Architecture_Spec.pdf:
- Spec Section 4 [FW]: Fortification walls & ramparts
- Walls and bastions built only at key places; natural cliffs form perimeter (S01, S02)
- Reusable wall segments (FW_SEG_nn) with documented start and end coordinates
- Miniature doorway water channel carrying water through rampart near Kalyan route (SIN_FW_WATERCHANNEL)
- Khadakada detached cliff enclosure ramparts and bastions (SIN_FW_KHADAKADA)
- Small postern sally port in rampart connecting Pune Darwaza stair to Khadakada (SIN_FW_POSTERN)
- Walkable rampart tops with parapets and merlons/crenellations
- Separate collision mesh primitives

Outputs:
  public/assets/FW/fortification_walls_M1.glb
  public/assets/FW/fortification_walls_collision.json
"""
import os
import json
import trimesh
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def build_fortification_walls():
    out_dir = ROOT / "public/assets/FW"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Basalt stone material visual colors
    # Sahyadri basalt: weathered dark grey-brown with mineral patination
    wall_color = [98, 92, 84, 255]       # Dark basalt ashlar
    parapet_color = [115, 108, 98, 255]   # Parapet stone
    merlon_color = [128, 120, 108, 255]   # Battlements / merlons
    walkway_color = [85, 80, 72, 255]     # Flagstone walkway surface
    trim_color = [140, 130, 115, 255]     # Dressed lintel/jamb stones

    def create_curved_wall_segment(start_pt, end_pt, height, thickness=1.8, walkway_inset=0.4, with_merlons=True):
        """Create a fortified curtain wall with base wall, walkable walkway deck, and crenellated parapet."""
        p0 = np.array(start_pt, dtype=np.float64)
        p1 = np.array(end_pt, dtype=np.float64)
        length = np.linalg.norm(p1[[0, 2]] - p0[[0, 2]])
        if length < 0.1:
            length = 1.0
        
        # Midpoint and angle
        mid = (p0 + p1) / 2.0
        angle = np.arctan2(p1[0] - p0[0], p1[2] - p0[2])

        # Main wall base
        wall_box = trimesh.creation.box(extents=[thickness, height, length])
        wall_box.visual.vertex_colors = wall_color
        
        meshes = [wall_box]

        # Parapet on the outer face (negative X in local wall coordinates)
        parapet_h = 1.2
        parapet_t = 0.5
        parapet_box = trimesh.creation.box(extents=[parapet_t, parapet_h, length])
        parapet_box.apply_translation([-thickness / 2.0 + parapet_t / 2.0, height / 2.0 + parapet_h / 2.0, 0])
        parapet_box.visual.vertex_colors = parapet_color
        meshes.append(parapet_box)

        # Walkway deck (inner portion)
        walkway_t = 0.15
        walkway_w = thickness - parapet_t
        walkway = trimesh.creation.box(extents=[walkway_w, walkway_t, length])
        walkway.apply_translation([parapet_t / 2.0, height / 2.0 + walkway_t / 2.0, 0])
        walkway.visual.vertex_colors = walkway_color
        meshes.append(walkway)

        # Merlons / crenellations along the parapet
        if with_merlons and length >= 2.0:
            merlon_len = 0.9
            gap_len = 0.6
            merlon_h = 0.7
            num_merlons = max(1, int(length / (merlon_len + gap_len)))
            spacing = length / num_merlons
            for i in range(num_merlons):
                z_offset = -length / 2.0 + (i + 0.5) * spacing
                merlon = trimesh.creation.box(extents=[parapet_t, merlon_h, merlon_len])
                merlon.apply_translation([
                    -thickness / 2.0 + parapet_t / 2.0,
                    height / 2.0 + parapet_h + merlon_h / 2.0,
                    z_offset
                ])
                merlon.visual.vertex_colors = merlon_color
                meshes.append(merlon)

        combined = trimesh.util.concatenate(meshes)
        
        # Rotate and translate into world position
        rot = trimesh.transformations.rotation_matrix(angle, [0, 1, 0])
        combined.apply_transform(rot)
        combined.apply_translation([mid[0], mid[1] + height / 2.0, mid[2]])
        return combined

    # 1. SIN_FW_SEG_01: Khadakada Cliff-side Rampart near parking / approach
    # Runs along sheer cliff lip overlooking north-east valley road
    fw_seg_01_pts = [
        [145.0, -58.0, -162.0],
        [168.0, -55.5, -145.0],
        [195.0, -52.0, -120.0]
    ]
    seg01_submeshes = []
    for i in range(len(fw_seg_01_pts) - 1):
        seg01_submeshes.append(create_curved_wall_segment(fw_seg_01_pts[i], fw_seg_01_pts[i+1], height=3.8, thickness=2.0))
    seg01_mesh = trimesh.util.concatenate(seg01_submeshes)

    # 2. SIN_FW_SEG_02: Daru Kothar Descending Rampart
    # Descends beside gunpowder storehouse after Gate 3
    fw_seg_02_pts = [
        [108.0, -36.0, -115.0],
        [88.0, -33.5, -104.0],
        [70.0, -30.0, -95.0]
    ]
    seg02_submeshes = []
    for i in range(len(fw_seg_02_pts) - 1):
        seg02_submeshes.append(create_curved_wall_segment(fw_seg_02_pts[i], fw_seg_02_pts[i+1], height=3.5, thickness=1.8))
    seg02_mesh = trimesh.util.concatenate(seg02_submeshes)

    # 3. SIN_FW_SEG_03: Interior Rampart near Kalyan Gate & Walkway
    # Connected to Kalyan inner gatehouse, contains walkable rampart toward Tehalni Buruj
    fw_seg_03_pts = [
        [-232.0, -59.5, 490.0],
        [-205.0, -57.0, 498.0],
        [-180.0, -54.5, 505.0]
    ]
    seg03_submeshes = []
    for i in range(len(fw_seg_03_pts) - 1):
        seg03_submeshes.append(create_curved_wall_segment(fw_seg_03_pts[i], fw_seg_03_pts[i+1], height=3.6, thickness=2.2))
    seg03_mesh = trimesh.util.concatenate(seg03_submeshes)

    # 4. SIN_FW_SEG_04: Dongiri Cliff / Tanaji Kada Rampart
    # Western cliff edge rampart crowning the sheer breach where Tanaji climbed
    fw_seg_04_pts = [
        [-400.0, -13.5, 38.0],
        [-380.0, -12.0, 55.0],
        [-360.0, -10.5, 75.0]
    ]
    seg04_submeshes = []
    for i in range(len(fw_seg_04_pts) - 1):
        seg04_submeshes.append(create_curved_wall_segment(fw_seg_04_pts[i], fw_seg_04_pts[i+1], height=3.2, thickness=1.6))
    seg04_mesh = trimesh.util.concatenate(seg04_submeshes)

    # 5. SIN_FW_SEG_05: Cliff-edge Rampart near Rajaram Samadhi
    # Northern escarpment parapet protecting the rock cistern cluster
    fw_seg_05_pts = [
        [5.0, -11.5, -330.0],
        [24.0, -10.0, -318.0],
        [45.0, -8.5, -305.0]
    ]
    seg05_submeshes = []
    for i in range(len(fw_seg_05_pts) - 1):
        seg05_submeshes.append(create_curved_wall_segment(fw_seg_05_pts[i], fw_seg_05_pts[i+1], height=3.0, thickness=1.6))
    seg05_mesh = trimesh.util.concatenate(seg05_submeshes)

    # 6. SIN_FW_KHADAKADA: Khadakada Enclosure
    # "A slightly detached cliff section enclosed by its own independent ramparts and bastions,
    # with a small gate and a higher small gate to the upper part" (S02)
    khadakada_center = [210.0, -56.0, -105.0]
    kh_pts = [
        [195.0, -56.0, -120.0],
        [220.0, -55.0, -125.0],
        [235.0, -56.0, -105.0],
        [225.0, -57.0, -85.0],
        [205.0, -57.5, -92.0]
    ]
    kh_submeshes = []
    for i in range(len(kh_pts)):
        p_next = kh_pts[(i + 1) % len(kh_pts)]
        kh_submeshes.append(create_curved_wall_segment(kh_pts[i], p_next, height=3.4, thickness=1.8))
    # Two small circular corner bastions for Khadakada enclosure
    for b_pos in [[235.0, -56.0, -105.0], [220.0, -55.0, -125.0]]:
        cyl = trimesh.creation.cylinder(radius=2.6, height=4.2, sections=20)
        cyl.apply_translation([b_pos[0], b_pos[1] + 2.1, b_pos[2]])
        cyl.visual.vertex_colors = wall_color
        kh_submeshes.append(cyl)
    # Small gateway archway into the enclosure
    arch_l = trimesh.creation.box(extents=[0.8, 2.8, 1.8])
    arch_l.apply_translation([203.0, -57.5 + 1.4, -92.0])
    arch_r = trimesh.creation.box(extents=[0.8, 2.8, 1.8])
    arch_r.apply_translation([206.5, -57.5 + 1.4, -92.0])
    arch_beam = trimesh.creation.box(extents=[4.3, 0.7, 1.8])
    arch_beam.apply_translation([204.75, -57.5 + 2.8 + 0.35, -92.0])
    for part in [arch_l, arch_r, arch_beam]:
        part.visual.vertex_colors = trim_color
        kh_submeshes.append(part)
    khadakada_mesh = trimesh.util.concatenate(kh_submeshes)

    # 7. SIN_FW_POSTERN: Small postern gate / sally port in rampart connecting stairway to Khadakada
    # "From the stair, the fort wall runs down the slope towards gate 1, with a small postern
    # gate set in the rampart. It leads into the detached Khadakada cliff section" (S02, Spec p.5)
    postern_center = [142.0, -52.0, -160.0]
    postern_submeshes = []
    # Postern jamb left & right
    pj_l = trimesh.creation.box(extents=[0.8, 2.4, 1.8])
    pj_l.apply_translation([postern_center[0] - 0.9, postern_center[1] + 1.2, postern_center[2]])
    pj_r = trimesh.creation.box(extents=[0.8, 2.4, 1.8])
    pj_r.apply_translation([postern_center[0] + 0.9, postern_center[1] + 1.2, postern_center[2]])
    # Heavy stone lintel header
    pj_header = trimesh.creation.box(extents=[2.6, 0.8, 2.0])
    pj_header.apply_translation([postern_center[0], postern_center[1] + 2.4 + 0.4, postern_center[2]])
    # Defensive parapet above postern
    pj_crest = trimesh.creation.box(extents=[2.6, 1.0, 0.6])
    pj_crest.apply_translation([postern_center[0], postern_center[1] + 3.2 + 0.5, postern_center[2] - 0.7])
    for m in [pj_l, pj_r, pj_header]:
        m.visual.vertex_colors = trim_color
        postern_submeshes.append(m)
    pj_crest.visual.vertex_colors = merlon_color
    postern_submeshes.append(pj_crest)
    postern_mesh = trimesh.util.concatenate(postern_submeshes)

    # 8. SIN_FW_WATERCHANNEL: Miniature doorway water channel carrying water through rampart
    # "A water channel shaped like a miniature doorway carries water through the rampart near the Kalyan route" (S02)
    wc_center = [-238.0, -64.0, 508.0]
    wc_submeshes = []
    # Left jamb
    wc_l = trimesh.creation.box(extents=[0.5, 1.2, 2.2])
    wc_l.apply_translation([wc_center[0] - 0.55, wc_center[1] + 0.6, wc_center[2]])
    # Right jamb
    wc_r = trimesh.creation.box(extents=[0.5, 1.2, 2.2])
    wc_r.apply_translation([wc_center[0] + 0.55, wc_center[1] + 0.6, wc_center[2]])
    # Corbelled miniature arch lintel
    wc_lintel = trimesh.creation.box(extents=[1.6, 0.45, 2.4])
    wc_lintel.apply_translation([wc_center[0], wc_center[1] + 1.2 + 0.225, wc_center[2]])
    # Drainage stone trough base
    wc_trough = trimesh.creation.box(extents=[0.6, 0.2, 2.8])
    wc_trough.apply_translation([wc_center[0], wc_center[1] - 0.1, wc_center[2]])
    # Wall above the miniature doorway
    wc_wall = trimesh.creation.box(extents=[2.8, 2.0, 2.0])
    wc_wall.apply_translation([wc_center[0], wc_center[1] + 1.65 + 1.0, wc_center[2]])
    for part in [wc_l, wc_r, wc_lintel, wc_trough]:
        part.visual.vertex_colors = trim_color
        wc_submeshes.append(part)
    wc_wall.visual.vertex_colors = wall_color
    wc_submeshes.append(wc_wall)
    waterchannel_mesh = trimesh.util.concatenate(wc_submeshes)

    # Build GLB Scene with exact Spec nodes
    scene = trimesh.Scene()
    scene.add_geometry(seg01_mesh, node_name="SIN_FW_SEG_01")
    scene.add_geometry(seg02_mesh, node_name="SIN_FW_SEG_02")
    scene.add_geometry(seg03_mesh, node_name="SIN_FW_SEG_03")
    scene.add_geometry(seg04_mesh, node_name="SIN_FW_SEG_04")
    scene.add_geometry(seg05_mesh, node_name="SIN_FW_SEG_05")
    scene.add_geometry(khadakada_mesh, node_name="SIN_FW_KHADAKADA")
    scene.add_geometry(postern_mesh, node_name="SIN_FW_POSTERN")
    scene.add_geometry(waterchannel_mesh, node_name="SIN_FW_WATERCHANNEL")

    glb_path = out_dir / "fortification_walls_M1.glb"
    glb_data = scene.export(file_type="glb")
    with open(glb_path, "wb") as f:
        f.write(glb_data)
    print(f"Exported Fortification Walls GLB: {glb_path} ({len(glb_data)/1024:.1f} KB)")

    # Collision Mesh Primitives
    # Simple bounding boxes and cylinders for physics engine
    collision_primitives = {
        "landmark_id": "FW",
        "description": "Simplified collision hulls for Sinhagad fortification ramparts, postern, and water conduit",
        "wall_boxes": [
            # Segment 01
            {"cx": 156.5, "cy": -56.75, "cz": -153.5, "size": [2.0, 3.8, 26.5], "yaw": 0.63, "isWalkable": False},
            {"cx": 181.5, "cy": -53.75, "cz": -132.5, "size": [2.0, 3.8, 36.8], "yaw": 0.82, "isWalkable": False},
            # Segment 02 (Daru Kothar descending)
            {"cx": 98.0, "cy": -34.75, "cz": -109.5, "size": [1.8, 3.5, 22.8], "yaw": 1.07, "isWalkable": False},
            {"cx": 79.0, "cy": -31.75, "cz": -99.5, "size": [1.8, 3.5, 20.1], "yaw": 1.11, "isWalkable": False},
            # Segment 03 (Kalyan interior & walkway)
            {"cx": -218.5, "cy": -58.25, "cz": 494.0, "size": [2.2, 3.6, 28.2], "yaw": -1.28, "isWalkable": False},
            {"cx": -192.5, "cy": -55.75, "cz": 501.5, "size": [2.2, 3.6, 26.0], "yaw": -1.30, "isWalkable": False},
            # Segment 04 (Tanaji Kada rampart)
            {"cx": -390.0, "cy": -12.75, "cz": 46.5, "size": [1.6, 3.2, 26.2], "yaw": -0.86, "isWalkable": False},
            {"cx": -370.0, "cy": -11.25, "cz": 65.0, "size": [1.6, 3.2, 28.3], "yaw": -0.79, "isWalkable": False},
            # Segment 05 (Rajaram Samadhi cliff-edge rampart)
            {"cx": 14.5, "cy": -10.75, "cz": -324.0, "size": [1.6, 3.0, 22.5], "yaw": 1.01, "isWalkable": False},
            {"cx": 34.5, "cy": -9.25, "cz": -311.5, "size": [1.6, 3.0, 24.3], "yaw": 1.03, "isWalkable": False},
            # Khadakada Enclosure
            {"cx": 207.5, "cy": -55.5, "cz": -122.5, "size": [1.8, 3.4, 25.5], "yaw": 1.37, "isWalkable": False},
            {"cx": 227.5, "cy": -55.5, "cz": -115.0, "size": [1.8, 3.4, 25.0], "yaw": -0.64, "isWalkable": False},
            {"cx": 230.0, "cy": -56.5, "cz": -95.0, "size": [1.8, 3.4, 22.4], "yaw": 0.46, "isWalkable": False},
            {"cx": 215.0, "cy": -57.25, "cz": -88.5, "size": [1.8, 3.4, 21.2], "yaw": 1.24, "isWalkable": False},
            # Postern Gate
            {"cx": 142.0, "cy": -50.8, "cz": -160.0, "size": [2.6, 2.4, 1.8], "yaw": 0.0, "isWalkable": False, "passableOpening": {"w": 1.2, "h": 2.1}},
            # Water Channel
            {"cx": -238.0, "cy": -63.5, "cz": 508.0, "size": [2.8, 2.5, 2.2], "yaw": 0.0, "isWalkable": False, "aperture": {"w": 0.6, "h": 0.9}}
        ],
        "walkable_ramparts": [
            # Walkway deck on top of Segment 03 (accessible rampart walk)
            {"cx": -205.5, "cy": -57.0 + 3.6 / 2.0 + 0.1, "cz": 497.5, "width": 1.4, "length": 54.0, "yaw": -1.29}
        ]
    }

    col_path = out_dir / "fortification_walls_collision.json"
    with open(col_path, "w", encoding="utf-8") as f:
        json.dump(collision_primitives, f, indent=2)
    print(f"Exported Fortification Walls collision primitives: {col_path}")

    # Summary metrics
    total_verts = sum(len(g.vertices) for g in scene.geometry.values())
    total_faces = sum(len(g.faces) for g in scene.geometry.values())
    print(f"Fortification Walls Summary: {len(scene.geometry)} nodes, {total_verts} vertices, {total_faces} triangles.")

if __name__ == "__main__":
    build_fortification_walls()
