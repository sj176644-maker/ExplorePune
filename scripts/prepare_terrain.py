#!/usr/bin/env python3
"""Fetch Copernicus DEM GLO-30, clip + reproject to EPSG:32643, fill geo/transform.json.

Run from the project root:   python scripts/prepare_terrain.py [--radius 3000]
Needs: internet, and GDAL command-line tools (gdalwarp, gdalinfo, gdallocationinfo)
       or scriptable Python alternative (pyproj, numpy, tifffile, imagecodecs).
Outputs:
  data_src/dem/Copernicus_DSM_COG_10_N18_00_E073_00_DEM.tif   (raw 1-degree tile, ~25-30 MB)
  data_src/dem/sinhagad_dem_utm43n.tif                         (clipped, 30 m, EPSG:32643)
  geo/transform.json                                           (origin filled in)
The 30 m DEM is MACRO terrain only (tier T3). It cannot show steps, gate platforms or rock faces.
Vertical reference: EGM2008 geoid heights (orthometric), NOT ellipsoidal.
"""
import json, math, shutil, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TILE = "Copernicus_DSM_COG_10_N18_00_E073_00_DEM"
URL = f"https://copernicus-dem-30m.s3.amazonaws.com/{TILE}/{TILE}.tif"
LAT, LON = 18.3656639, 73.7552694  # fort centre, source S01 (approx, ~70 m uncertainty)
ZONE = 43


def to_utm(lat, lon, zone=ZONE):
    """WGS84 lat/lon -> UTM (Krueger series, mm-level accuracy). Returns (easting, northing) north hemisphere."""
    a, f = 6378137.0, 1 / 298.257223563
    k0, E0 = 0.9996, 500000.0
    n = f / (2 - f)
    A = a / (1 + n) * (1 + n**2 / 4 + n**4 / 64)
    al = [n / 2 - 2 * n**2 / 3 + 5 * n**3 / 16, 13 * n**2 / 48 - 3 * n**3 / 5, 61 * n**3 / 240]
    phi, lam = math.radians(lat), math.radians(lon - (zone * 6 - 183))
    e = math.sqrt(f * (2 - f))
    t = math.sinh(math.atanh(math.sin(phi)) - e * math.atanh(e * math.sin(phi)))
    xi = math.atan2(t, math.cos(lam))
    eta = math.atanh(math.sin(lam) / math.sqrt(1 + t * t))
    x = eta + sum(al[j - 1] * math.cos(2 * j * xi) * math.sinh(2 * j * eta) for j in (1, 2, 3))
    y = xi + sum(al[j - 1] * math.sin(2 * j * xi) * math.cosh(2 * j * eta) for j in (1, 2, 3))
    return E0 + k0 * A * x, k0 * A * y


def python_reproject_dem(raw_path, clipped_path, E, N, radius, tr=30.0):
    """Scriptable fallback when GDAL CLI tools are not installed on PATH."""
    import numpy as np
    import pyproj
    import tifffile

    print("Executing scriptable Python DEM clipping and reprojection (pyproj + numpy + tifffile)...")
    E_vals = np.arange(E - radius, E + radius + tr / 2.0, tr)
    N_vals = np.arange(N + radius, N - radius - tr / 2.0, -tr)
    nx = len(E_vals)
    ny = len(N_vals)

    with tifffile.TiffFile(raw_path) as tif:
        raw_data = tif.pages[0].asarray()

    trans = pyproj.Transformer.from_crs("EPSG:32643", "EPSG:4326", always_xy=True)
    EE, NN = np.meshgrid(E_vals, N_vals)
    lons, lats = trans.transform(EE, NN)

    # Copernicus tile covers lat [18.0, 19.0], lon [73.0, 74.0]
    px = (lons - 73.0) * 3600.0
    py = (19.0 - lats) * 3600.0

    x0 = np.clip(np.floor(px).astype(int), 0, 3598)
    x1 = x0 + 1
    y0 = np.clip(np.floor(py).astype(int), 0, 3598)
    y1 = y0 + 1

    fx = px - x0
    fy = py - y0

    clipped_data = (
        (1 - fx) * (1 - fy) * raw_data[y0, x0]
        + fx * (1 - fy) * raw_data[y0, x1]
        + (1 - fx) * fy * raw_data[y1, x0]
        + fx * fy * raw_data[y1, x1]
    ).astype(np.float32)

    # Save as GeoTIFF with Projected CRS metadata tags (EPSG:32643)
    geokeys = (
        1, 1, 0, 7,
        1024, 0, 1, 1,       # GTModelTypeGeoKey: ModelTypeProjected
        1025, 0, 1, 1,       # GTRasterTypeGeoKey: RasterPixelIsArea
        3072, 0, 1, 32643,   # ProjectedCRSGeoKey: EPSG:32643 (UTM zone 43N)
        3076, 0, 1, 9001     # ProjLinearUnitsGeoKey: Linear_Meter
    )
    tiepoint = (0.0, 0.0, 0.0, float(E_vals[0] - tr / 2.0), float(N_vals[0] + tr / 2.0), 0.0)
    pixel_scale = (float(tr), float(tr), 0.0)

    tifffile.imwrite(
        clipped_path,
        clipped_data,
        extratags=[
            (33550, "d", 3, pixel_scale, False),
            (33922, "d", 6, tiepoint, False),
            (34735, "h", len(geokeys), geokeys, False),
        ],
    )
    print(f"Wrote clipped DEM: {clipped_path} ({ny}x{nx} grid, min={clipped_data.min():.1f}m, max={clipped_data.max():.1f}m)")

    # Sample height at exact fort center
    centre_y = int(np.argmin(np.abs(N_vals - N)))
    centre_x = int(np.argmin(np.abs(E_vals - E)))
    z = float(clipped_data[centre_y, centre_x])
    return z


def main():
    radius = 3000
    if "--radius" in sys.argv:
        radius = int(sys.argv[sys.argv.index("--radius") + 1])

    has_gdal = bool(shutil.which("gdalwarp") and shutil.which("gdallocationinfo"))
    if not has_gdal:
        print("Note: 'gdalwarp' / 'gdallocationinfo' not found on PATH.")
        print("Using validated scriptable Python alternative (pyproj + numpy + tifffile).")

    E, N = to_utm(LAT, LON)
    print(f"Fort centre UTM 43N: E={E:.1f} N={N:.1f}")
    out = ROOT / "data_src/dem"
    out.mkdir(parents=True, exist_ok=True)
    raw = out / f"{TILE}.tif"
    if not raw.exists():
        print("Downloading", URL)
        req = urllib.request.Request(URL, headers={"User-Agent": "SinhagadHeritage3D/0.1"})
        with urllib.request.urlopen(req, timeout=300) as r, open(raw, "wb") as f:
            shutil.copyfileobj(r, f)
        print("Raw DEM downloaded:", raw)
    else:
        print("Using existing raw DEM:", raw)

    clipped = out / "sinhagad_dem_utm43n.tif"
    z = None

    if has_gdal:
        subprocess.run(
            [
                "gdalwarp",
                "-overwrite",
                "-t_srs",
                "EPSG:32643",
                "-r",
                "bilinear",
                "-tr",
                "30",
                "30",
                "-te",
                str(E - radius),
                str(N - radius),
                str(E + radius),
                str(N + radius),
                str(raw),
                str(clipped),
            ],
            check=True,
        )
        try:
            res = subprocess.run(
                ["gdallocationinfo", "-valonly", "-geoloc", str(clipped), f"{E}", f"{N}"],
                capture_output=True,
                text=True,
                check=True,
            ).stdout.strip()
            z = float(res)
        except Exception as e:
            print("Could not sample centre height with gdallocationinfo:", e)
    else:
        z = python_reproject_dem(raw, clipped, E, N, radius, tr=30.0)

    # Update geo/transform.json
    for base_dir in [ROOT, Path(r"C:\Users\Suraj\explore-pune")]:
        tp = base_dir / "geo/transform.json"
        if tp.exists():
            t = json.loads(tp.read_text())
            t["worldCRS"] = "EPSG:32643"
            t["localOrigin"].update({
                "x": round(E, 1),
                "y": round(N, 1),
                "z": round(z, 1) if z is not None else None,
            })
            t["localOrigin"]["note"] = (
                "fort centre from S01 coordinates (approx, ~70 m uncertainty); height sampled from "
                "Copernicus DEM GLO-30 (EGM2008). Subtract from world coords before building scenes."
            )
            t["verticalReference"] = "EGM2008 geoid (Copernicus DEM GLO-30 orthometric heights)"
            t["sceneAxes"].update({"up": "+Y", "north": "-Z", "east": "+X"})
            t["mapping"] = "scene.x = easting - origin.x ; scene.y = height - origin.z ; scene.z = -(northing - origin.y)"
            t["demSource"] = f"{TILE} (Copernicus DEM GLO-30, ESA; Copernicus Open Access Licence)"
            t["scale"] = 1.0
            tp.write_text(json.dumps(t, indent=2))
            print("Wrote", tp, f"| origin: ({round(E,1)}, {round(N,1)}, {round(z,1) if z is not None else None})")

    print(f"Terrain preparation complete! Centre sampled elevation: {z:.1f} m MSL (EGM2008).")


if __name__ == "__main__":
    main()
