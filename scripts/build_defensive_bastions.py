#!/usr/bin/env python3
"""Build historically verified 3D assembly of Defensive Bastions (BS).
Conforms to data/landmarks.json and docs/Sinhagad_3D_Architecture_Spec.pdf:
- Spec Section 4 [BS]: Defensive bastions (Buruj / Burj, 37 historically documented)
- Named bastions modeled individually:
  1. SIN_BS_TEHALNI: Watch Bastion monitoring Kalyan route with rock-cut cistern above on slope
  2. SIN_BS_ZUNJAR: Southern spur bastion with buried steps, exposed latrine pit, and shallow dry tank
  3. SIN_BS_KHADAKADA: Large spur bastion overlooking Khadakada and approach
  4. SIN_BS_TVSIDE: Ruined bastion beyond Doordarshan tower; preserved in authentic ruined state (no fictional completion)
  5. SIN_BS_CANNON: Bastion opposite Daru Kothar with 6-foot cannon on cart carriage (inscribed 'Gumabh' 248)
  6. SIN_BS_GATE_xx: Gate-flanking bastions connecting to curtain walls
- Separate collision mesh primitives

Outputs:
  public/assets/BS/defensive_bastions_M1.glb
  public/assets/BS/defensive_bastions_collision.json
"""
import os
import json
import trimesh
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def build_defensive_bastions():
    out_dir = ROOT / "public/assets/BS"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Color definitions (physically plausible basalt stone weathering)
    c_ashlar = [95, 90, 82, 255]       # Dressed dark basalt
    c_parapet = [112, 105, 96, 255]    # Weathered parapet stone
    c_merlon = [125, 118, 106, 255]    # Crenellated battlements
    c_rubble = [78, 73, 68, 255]       # Broken/ruined core masonry
    c_cannon_iron = [45, 45, 48, 255]  # Cast-iron 6-foot cannon
    c_cart_wood = [115, 78, 48, 255]   # Heavy timber cart carriage
    c_water = [60, 85, 95, 255]        # Rock-cut cistern water surface
    c_tank_stone = [85, 80, 75, 255]   # Rock-cut tank interior

    # Helper: Create standard circular bastion with platform and crenellated parapet
    def make_bastion_tower(center, radius, height, sections=24, with_deck=True, with_merlons=True):
        cyl = trimesh.creation.cylinder(radius=radius, height=height, sections=sections)
        cyl.apply_translation([center[0], center[1] + height / 2.0, center[2]])
        cyl.visual.vertex_colors = c_ashlar
        meshes = [cyl]

        if with_deck:
            parapet_h = 1.1
            parapet_t = 0.45
            # Outer ring parapet
            ring = trimesh.creation.annulus(r_min=radius - parapet_t, r_max=radius, height=parapet_h, sections=sections)
            ring.apply_translation([center[0], center[1] + height + parapet_h / 2.0, center[2]])
            ring.visual.vertex_colors = c_parapet
            meshes.append(ring)

            # Flat platform top
            deck = trimesh.creation.cylinder(radius=radius - parapet_t, height=0.15, sections=sections)
            deck.apply_translation([center[0], center[1] + height + 0.075, center[2]])
            deck.visual.vertex_colors = c_rubble
            meshes.append(deck)

            if with_merlons:
                num_merlons = 8
                for i in range(num_merlons):
                    angle = (i * 2.0 * np.pi) / num_merlons
                    mx = center[0] + (radius - parapet_t / 2.0) * np.cos(angle)
                    mz = center[2] + (radius - parapet_t / 2.0) * np.sin(angle)
                    merlon = trimesh.creation.box(extents=[0.6, 0.6, 0.45])
                    rot = trimesh.transformations.rotation_matrix(-angle, [0, 1, 0])
                    merlon.apply_transform(rot)
                    merlon.apply_translation([mx, center[1] + height + parapet_h + 0.3, mz])
                    merlon.visual.vertex_colors = c_merlon
                    meshes.append(merlon)

        return trimesh.util.concatenate(meshes)

    # 1. SIN_BS_TEHALNI (Tehalni Buruj / Watch Bastion)
    # Monitors Kalyan Darwaza route; rock-cut cistern above on slope
    tehalni_center = [-185.0, -54.0, 510.0]
    tehalni_submeshes = [make_bastion_tower(tehalni_center, radius=3.4, height=7.5, sections=24)]
    # Rock-cut cistern above on slope (cavity with water surface)
    cistern_center = [-180.0, -48.0, 502.0]
    c_outer = trimesh.creation.box(extents=[4.2, 2.0, 3.2])
    c_outer.apply_translation([cistern_center[0], cistern_center[1] + 1.0, cistern_center[2]])
    c_outer.visual.vertex_colors = c_tank_stone
    c_water_surf = trimesh.creation.box(extents=[3.6, 0.2, 2.6])
    c_water_surf.apply_translation([cistern_center[0], cistern_center[1] + 1.2, cistern_center[2]])
    c_water_surf.visual.vertex_colors = c_water
    tehalni_submeshes.extend([c_outer, c_water_surf])
    tehalni_mesh = trimesh.util.concatenate(tehalni_submeshes)

    # 2. SIN_BS_ZUNJAR (Zunjar Buruj on southern cut-off spur)
    # Tapered bastion, buried steps, exposed latrine pit, shallow dry tank
    zunjar_center = [-120.0, -68.0, 620.0]
    zunjar_submeshes = []
    # Base conical section
    zunjar_base = trimesh.creation.cone(radius=4.2, height=9.0, sections=24)
    # Invert cone to taper slightly upwards: cylinder with slight taper
    zunjar_tower = trimesh.creation.cylinder(radius=3.8, height=9.0, sections=24)
    zunjar_tower.apply_translation([zunjar_center[0], zunjar_center[1] + 4.5, zunjar_center[2]])
    zunjar_tower.visual.vertex_colors = c_ashlar
    zunjar_submeshes.append(zunjar_tower)
    # Parapet
    z_parapet = trimesh.creation.annulus(r_min=3.3, r_max=3.8, height=1.1, sections=24)
    z_parapet.apply_translation([zunjar_center[0], zunjar_center[1] + 9.0 + 0.55, zunjar_center[2]])
    z_parapet.visual.vertex_colors = c_parapet
    zunjar_submeshes.append(z_parapet)
    # Buried steps (mounded stone tiers half covered in slope debris)
    for step_i in range(5):
        s_box = trimesh.creation.box(extents=[2.4, 0.25, 0.6])
        s_box.apply_translation([zunjar_center[0], zunjar_center[1] + step_i * 0.25, zunjar_center[2] - 4.5 - step_i * 0.5])
        s_box.visual.vertex_colors = c_rubble
        zunjar_submeshes.append(s_box)
    # Earth mound covering lower step flight
    mound = trimesh.creation.box(extents=[3.0, 0.8, 2.0])
    mound.apply_translation([zunjar_center[0], zunjar_center[1] + 0.4, zunjar_center[2] - 5.5])
    mound.visual.vertex_colors = [90, 75, 60, 255]
    zunjar_submeshes.append(mound)
    # Exposed latrine pit nearby
    latrine = trimesh.creation.box(extents=[1.5, 1.2, 1.3])
    latrine.apply_translation([zunjar_center[0] + 5.5, zunjar_center[1] + 0.6, zunjar_center[2] - 2.0])
    latrine.visual.vertex_colors = c_tank_stone
    zunjar_submeshes.append(latrine)
    # Shallow dry tank nearby
    dry_tank = trimesh.creation.box(extents=[3.8, 1.4, 3.0])
    dry_tank.apply_translation([zunjar_center[0] - 6.0, zunjar_center[1] + 0.7, zunjar_center[2] - 3.0])
    dry_tank.visual.vertex_colors = c_tank_stone
    zunjar_submeshes.append(dry_tank)
    zunjar_mesh = trimesh.util.concatenate(zunjar_submeshes)

    # 3. SIN_BS_KHADAKADA (Khadakada Spur Bastion)
    # Overlooks Khadakada section and vehicle/trek approach
    khadakada_bs_center = [225.0, -55.0, -110.0]
    khadakada_bs_mesh = make_bastion_tower(khadakada_bs_center, radius=3.6, height=8.5, sections=24)

    # 4. SIN_BS_TVSIDE (Ruined Bastion near Doordarshan TV Tower)
    # Preserved in true ruined state with fallen rubble and breached parapet
    tv_center = [190.0, -35.0, -190.0]
    tv_submeshes = []
    # Main broken cylinder
    tv_cyl = trimesh.creation.cylinder(radius=3.5, height=5.5, sections=20)
    tv_cyl.apply_translation([tv_center[0], tv_center[1] + 2.75, tv_center[2]])
    tv_cyl.visual.vertex_colors = c_rubble
    tv_submeshes.append(tv_cyl)
    # Partial surviving parapet segment (only one quarter intact)
    tv_parapet = trimesh.creation.box(extents=[3.2, 0.9, 0.45])
    tv_parapet.apply_translation([tv_center[0] + 1.2, tv_center[1] + 5.5 + 0.45, tv_center[2] - 2.2])
    tv_parapet.visual.vertex_colors = c_parapet
    tv_submeshes.append(tv_parapet)
    # Fallen rubble blocks tumbled on slope base
    rubble_positions = [
        [tv_center[0] + 3.8, tv_center[1] + 0.5, tv_center[2] + 1.0],
        [tv_center[0] + 4.2, tv_center[1] + 0.3, tv_center[2] - 1.2],
        [tv_center[0] - 3.5, tv_center[1] + 0.4, tv_center[2] + 2.0],
        [tv_center[0] + 2.0, tv_center[1] + 0.6, tv_center[2] + 3.6]
    ]
    for rp in rubble_positions:
        rb = trimesh.creation.box(extents=[1.2, 0.8, 1.0])
        rb.apply_translation(rp)
        rb.visual.vertex_colors = c_rubble
        tv_submeshes.append(rb)
    tvside_mesh = trimesh.util.concatenate(tv_submeshes)

    # 5. SIN_BS_CANNON (Bastion opposite Daru Kothar)
    # Holds 6-foot cannon on cart carriage inscribed 'Gumabh' 248
    cannon_bs_center = [62.0, -28.0, -90.0]
    cannon_submeshes = [make_bastion_tower(cannon_bs_center, radius=3.5, height=6.0, sections=24, with_merlons=False)]
    # Parapet with cannon embrasure opening
    emb_wall_l = trimesh.creation.box(extents=[2.2, 1.1, 0.5])
    emb_wall_l.apply_translation([cannon_bs_center[0] - 1.8, cannon_bs_center[1] + 6.0 + 0.55, cannon_bs_center[2] - 3.2])
    emb_wall_r = trimesh.creation.box(extents=[2.2, 1.1, 0.5])
    emb_wall_r.apply_translation([cannon_bs_center[0] + 1.8, cannon_bs_center[1] + 6.0 + 0.55, cannon_bs_center[2] - 3.2])
    for w in [emb_wall_l, emb_wall_r]:
        w.visual.vertex_colors = c_parapet
        cannon_submeshes.append(w)

    # 6-foot (1.85m) Cannon Assembly
    c_pos = [cannon_bs_center[0], cannon_bs_center[1] + 6.0 + 0.5, cannon_bs_center[2] - 1.8]
    # Cannon Barrel (cast iron cylinder pointing towards -Z north valley)
    barrel = trimesh.creation.cylinder(radius=0.18, height=1.85, sections=16)
    # Rotate barrel to point forward horizontally along Z axis
    rot_barrel = trimesh.transformations.rotation_matrix(np.pi / 2.0, [1, 0, 0])
    barrel.apply_transform(rot_barrel)
    # Slight elevation tilt (-5 degrees down)
    rot_tilt = trimesh.transformations.rotation_matrix(-0.08, [1, 0, 0])
    barrel.apply_transform(rot_tilt)
    barrel.apply_translation([c_pos[0], c_pos[1] + 0.45, c_pos[2]])
    barrel.visual.vertex_colors = c_cannon_iron
    cannon_submeshes.append(barrel)

    # Cascabel knob at breach
    cascabel = trimesh.creation.icosphere(subdivisions=2, radius=0.12)
    cascabel.apply_translation([c_pos[0], c_pos[1] + 0.52, c_pos[2] + 0.95])
    cascabel.visual.vertex_colors = c_cannon_iron
    cannon_submeshes.append(cascabel)

    # Timber Cart Carriage Frame
    carriage = trimesh.creation.box(extents=[0.75, 0.4, 1.6])
    carriage.apply_translation([c_pos[0], c_pos[1] + 0.25, c_pos[2] + 0.2])
    carriage.visual.vertex_colors = c_cart_wood
    cannon_submeshes.append(carriage)

    # Two heavy cart wheels
    for wx_offset in [-0.48, 0.48]:
        wheel = trimesh.creation.cylinder(radius=0.38, height=0.12, sections=16)
        rot_wheel = trimesh.transformations.rotation_matrix(np.pi / 2.0, [0, 0, 1])
        wheel.apply_transform(rot_wheel)
        wheel.apply_translation([c_pos[0] + wx_offset, c_pos[1] + 0.2, c_pos[2] + 0.1])
        wheel.visual.vertex_colors = c_cart_wood
        cannon_submeshes.append(wheel)

    cannon_mesh = trimesh.util.concatenate(cannon_submeshes)

    # 6. SIN_BS_GATE_xx (Flanking Gate Bastions connecting to rampart lines)
    # Gate bastions that anchor the gateways
    gate_bs_submeshes = []
    # Pune Darwaza flanking spur bastions
    g_pd_bs1 = make_bastion_tower([154.0, -58.0, -174.0], radius=3.2, height=7.0, sections=20)
    g_pd_bs2 = make_bastion_tower([146.0, -56.5, -166.0], radius=3.2, height=7.0, sections=20)
    # Kalyan Darwaza flanking spur bastions
    g_kd_bs1 = make_bastion_tower([-247.5, -65.5, 518.5], radius=3.2, height=7.2, sections=20)
    g_kd_bs2 = make_bastion_tower([-239.5, -63.5, 510.5], radius=3.2, height=7.2, sections=20)
    gate_bs_submeshes.extend([g_pd_bs1, g_pd_bs2, g_kd_bs1, g_kd_bs2])
    gate_bs_mesh = trimesh.util.concatenate(gate_bs_submeshes)

    # Build GLB Scene with exact Spec nodes
    scene = trimesh.Scene()
    scene.add_geometry(tehalni_mesh, node_name="SIN_BS_TEHALNI")
    scene.add_geometry(zunjar_mesh, node_name="SIN_BS_ZUNJAR")
    scene.add_geometry(khadakada_bs_mesh, node_name="SIN_BS_KHADAKADA")
    scene.add_geometry(tvside_mesh, node_name="SIN_BS_TVSIDE")
    scene.add_geometry(cannon_mesh, node_name="SIN_BS_CANNON")
    scene.add_geometry(gate_bs_mesh, node_name="SIN_BS_GATE_xx")

    glb_path = out_dir / "defensive_bastions_M1.glb"
    glb_data = scene.export(file_type="glb")
    with open(glb_path, "wb") as f:
        f.write(glb_data)
    print(f"Exported Defensive Bastions GLB: {glb_path} ({len(glb_data)/1024:.1f} KB)")

    # Collision Mesh Primitives
    collision_primitives = {
        "landmark_id": "BS",
        "description": "Collision hulls for Sinhagad defensive bastions (Buruj), observation platforms, and gun battery",
        "bastion_cylinders": [
            {"cx": tehalni_center[0], "cy": tehalni_center[1] + 3.75, "cz": tehalni_center[2], "radius": 3.4, "height": 7.5, "name": "Tehalni Buruj"},
            {"cx": zunjar_center[0], "cy": zunjar_center[1] + 4.5, "cz": zunjar_center[2], "radius": 3.8, "height": 9.0, "name": "Zunjar Buruj"},
            {"cx": khadakada_bs_center[0], "cy": khadakada_bs_center[1] + 4.25, "cz": khadakada_bs_center[2], "radius": 3.6, "height": 8.5, "name": "Khadakada Spur Buruj"},
            {"cx": tv_center[0], "cy": tv_center[1] + 2.75, "cz": tv_center[2], "radius": 3.5, "height": 5.5, "name": "TV-side Ruined Buruj"},
            {"cx": cannon_bs_center[0], "cy": cannon_bs_center[1] + 3.0, "cz": cannon_bs_center[2], "radius": 3.5, "height": 6.0, "name": "Cannon Bastion"},
            {"cx": 154.0, "cy": -54.5, "cz": -174.0, "radius": 3.2, "height": 7.0, "name": "Gate Bastion PD1"},
            {"cx": 146.0, "cy": -53.0, "cz": -166.0, "radius": 3.2, "height": 7.0, "name": "Gate Bastion PD2"},
            {"cx": -247.5, "cy": -61.9, "cz": 518.5, "radius": 3.2, "height": 7.2, "name": "Gate Bastion KD1"},
            {"cx": -239.5, "cy": -59.9, "cz": 510.5, "radius": 3.2, "height": 7.2, "name": "Gate Bastion KD2"}
        ],
        "walkable_platforms": [
            {"cx": tehalni_center[0], "cy": tehalni_center[1] + 7.5, "cz": tehalni_center[2], "radius": 2.9, "name": "Tehalni Observation Deck"},
            {"cx": khadakada_bs_center[0], "cy": khadakada_bs_center[1] + 8.5, "cz": khadakada_bs_center[2], "radius": 3.1, "name": "Khadakada Overlook Deck"},
            {"cx": cannon_bs_center[0], "cy": cannon_bs_center[1] + 6.0, "cz": cannon_bs_center[2], "radius": 3.0, "name": "Gun Platform"}
        ],
        "special_features": [
            {"type": "cistern", "cx": cistern_center[0], "cy": cistern_center[1] + 1.0, "cz": cistern_center[2], "size": [4.2, 2.0, 3.2]},
            {"type": "cannon", "cx": c_pos[0], "cy": c_pos[1] + 0.45, "cz": c_pos[2], "length": 1.85, "caliber": "6-foot iron"}
        ]
    }

    col_path = out_dir / "defensive_bastions_collision.json"
    with open(col_path, "w", encoding="utf-8") as f:
        json.dump(collision_primitives, f, indent=2)
    print(f"Exported Defensive Bastions collision primitives: {col_path}")

    # Metrics
    total_verts = sum(len(g.vertices) for g in scene.geometry.values())
    total_faces = sum(len(g.faces) for g in scene.geometry.values())
    print(f"Defensive Bastions Summary: {len(scene.geometry)} nodes, {total_verts} vertices, {total_faces} triangles.")

if __name__ == "__main__":
    build_defensive_bastions()
