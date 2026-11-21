#!/usr/bin/env python3
"""Build georeferenced DEM terrain tile for Sinhagad Fort 3D reconstruction.

Outputs:
  public/assets/terrain/terrain_tile_M1.glb       (visual mesh with vertex slope colors)
  public/assets/terrain/terrain_heightfield.json  (compact grid for fast heightfield collision)
"""
import json, os, numpy as np, tifffile, trimesh
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent

def build_tile(grid_size=1200.0, n_pts=81):
    dem_path = ROOT / "data_src/dem/sinhagad_dem_utm43n.tif"
    transform_path = ROOT / "geo/transform.json"

    with open(transform_path, "r", encoding="utf-8") as f:
        t = json.load(f)
    origin = t["localOrigin"]
    X0, Y0, Z0 = origin["x"], origin["y"], origin["z"]

    with tifffile.TiffFile(str(dem_path)) as tif:
        dem = tif.pages[0].asarray()

    def sample_dem(E, N):
        col = (E - (X0 - 3000)) / 30.0
        row = ((Y0 + 3000) - N) / 30.0
        c0 = int(np.clip(np.floor(col), 0, 200))
        c1 = int(np.clip(c0 + 1, 0, 200))
        r0 = int(np.clip(np.floor(row), 0, 200))
        r1 = int(np.clip(r0 + 1, 0, 200))
        fc = col - c0
        fr = row - r0
        z = (1 - fc) * (1 - fr) * dem[r0, c0] + fc * (1 - fr) * dem[r0, c1] + (1 - fc) * fr * dem[r1, c0] + fc * fr * dem[r1, c1]
        return float(z)

    half = grid_size / 2.0
    coords_x = np.linspace(-half, half, n_pts)
    coords_z = np.linspace(-half, half, n_pts)

    vertices = []
    heights_grid = np.zeros((n_pts, n_pts), dtype=np.float32)

    for j, sz in enumerate(coords_z):
        N = Y0 - sz
        for i, sx in enumerate(coords_x):
            E = X0 + sx
            elev = sample_dem(E, N)
            sy = elev - Z0
            heights_grid[j, i] = sy
            vertices.append([sx, sy, sz])

    vertices = np.array(vertices, dtype=np.float32)

    faces = []
    for j in range(n_pts - 1):
        for i in range(n_pts - 1):
            v0 = j * n_pts + i
            v1 = j * n_pts + (i + 1)
            v2 = (j + 1) * n_pts + i
            v3 = (j + 1) * n_pts + (i + 1)
            faces.append([v0, v2, v1])
            faces.append([v1, v2, v3])

    faces = np.array(faces, dtype=np.int32)
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces)
    mesh.fix_normals()

    normals = mesh.vertex_normals
    slopes_deg = np.degrees(np.arccos(np.clip(normals[:, 1], 0.0, 1.0)))

    colors = np.zeros((len(vertices), 4), dtype=np.uint8)
    grass_color = np.array([135, 125, 90, 255])
    rock_color = np.array([65, 58, 52, 255])

    for idx, slope in enumerate(slopes_deg):
        if slope <= 20.0:
            colors[idx] = grass_color
        elif slope >= 38.0:
            colors[idx] = rock_color
        else:
            alpha = (slope - 20.0) / 18.0
            colors[idx] = ((1 - alpha) * grass_color + alpha * rock_color).astype(np.uint8)

    mesh.visual.vertex_colors = colors

    out_dir = ROOT / "public/assets/terrain"
    out_dir.mkdir(parents=True, exist_ok=True)

    glb_path = out_dir / "terrain_tile_M1.glb"
    mesh.export(str(glb_path))
    print(f"Exported {glb_path}: {len(vertices)} vertices, {len(faces)} faces, {glb_path.stat().st_size} bytes")

    hf_data = {
        "minX": -half,
        "maxX": half,
        "minZ": -half,
        "maxZ": half,
        "gridSize": n_pts,
        "step": grid_size / (n_pts - 1),
        "heights": heights_grid.tolist()
    }
    hf_path = out_dir / "terrain_heightfield.json"
    with open(hf_path, "w", encoding="utf-8") as f:
        json.dump(hf_data, f)
    print(f"Exported collision heightfield: {hf_path}")

if __name__ == "__main__":
    build_tile()
