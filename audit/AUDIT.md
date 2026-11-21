# Phase 0 Audit Report: Sinhagad Fort 3D Digital Reconstruction

**Project:** Sinhagad Fort — Independent 3D Digital Heritage Reconstruction  
**Date:** 21 November 2026  
**Auditor:** Senior Multidisciplinary Engineering & GIS Heritage Team  
**Git Branch:** `milestone0-phase0-audit` (in `C:\Users\Suraj\explore-pune`)  
**Status:** Read-Only Audit Complete — Awaiting Approval  

---

## 1. Executive Summary & Verification of Invariants

Phase 0 of the Sinhagad Fort 3D Digital Reconstruction project has been executed as a strictly read-only audit. No source code has been altered, and no original 3D asset has been modified or deleted. 

All three original assets have been duplicated into `original-assets/` for read-only inspection:
1. `original-assets/sinhagad_hill_topography_3d.glb`
2. `original-assets/sinhagad_fort_master_reconstruction (1).glb`
3. `original-assets/sinhagad_fort_master_architecture.obj`

A dedicated visual inspection was performed via WebGL rendering across multiple canonical viewpoints (Isometric, Top-Down, Front/Elevation), with screenshots saved to `/audit/renders/`. Quantitative metrics were extracted via `scripts/audit_glb.py` and saved to `/audit/raw_audit.json`.

---

## 2. Website & Technology Stack Audit

The target website repository is located at `C:\Users\Suraj\explore-pune`.

| Parameter | Current Configuration | Heritage Project Compatibility / Action |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.6 (App Router) | Compatible with client-only 3D canvas modules. |
| **React Version** | React 19.3.0 | Compatible. |
| **Language** | TypeScript 5.x | Enforces strict type validation across geo and provenance schemas. |
| **Styling** | Tailwind CSS v4 | Can be used for responsive HUD, tier badges, and landmark info panels. |
| **Build Tool** | Turbopack (`next dev`, `next build`) | Fast HMR; requires SSR isolation for Three.js. |
| **Existing 3D Stack** | `three: ^0.187.0`, `@types/three: ^0.187.0` | Native Three.js is already installed. R3F can be added or native Three used. |
| **Current Sinhagad Route** | `app/experience/sinhagad` | Currently hosts a 2D canvas exploration game (`Sinhagad2DGame`). Must remain 100% untouched. |
| **Target 3D Route** | `/sinhagad` (`app/sinhagad/page.tsx`) | Will be implemented using Next.js dynamic import (`ssr: false`) to avoid SSR hydration conflicts. |
| **Deployment Targets** | Vercel (`vercel.json`) & Firebase (`firebase.json`) | Requires strict asset streaming; monolithic 20MB files must not be bundled in initial JS. |

---

## 3. Environment & Tooling Audit

| Tool | Required For | Host Status | Resolution / Action Required |
| :--- | :--- | :--- | :--- |
| **Node.js** | Next.js site build & execution | **v24.20.0 (Installed)** | Ready. Passes `>= 20.9` requirement. |
| **npm** | Package management | **v12.2.0 (Installed)** | Ready. |
| **Python** | Data pipelines & scripts | **v3.14.7 & v3.10.21 (Installed)** | Ready (`pypdf` installed for doc parsing). |
| **Git** | Version control & milestone commits | **v2.55.0 (Installed)** | Ready. Working branch: `milestone0-phase0-audit`. |
| **gltf-transform** | GLB optimization & LOD inspection | **v4.5.1 (Installed via npx)** | Ready for Draco/Meshopt and KTX2 texture validation. |
| **GPU Acceleration** | WebGL canvas rendering | **Available** | Verified via headless Chromium Direct3D 11 pass. |
| **GDAL** | DEM reprojection (`gdalwarp`, `gdallocationinfo`) | ❌ **NOT FOUND ON PATH** | **Must Install:** Install OSGeo4W or QGIS, or conda `gdal`. Fallback: pure-Python raster extraction. |
| **QGIS** | Visual GIS alignment, CRS validation | ❌ **NOT FOUND ON PATH** | **Must Install:** QGIS standalone for reviewing `EPSG:32643` layers and vector footprints. |
| **Blender** | Headless 3D modeling & glTF export | ❌ **NOT FOUND ON PATH** | **Must Install:** Blender 4.x for automated scriptable bmesh pipeline and modular exports. |
| **COLMAP** | Dense photogrammetry reconstruction | ❌ **NOT FOUND ON PATH** | **Deferred:** Rule states NO photogrammetry without original overlapping photo sets. |

---

## 4. 3D Asset Inspection, Scoring & Architectural Decisions

Renders are archived in `/audit/renders/`. Quantitative data is drawn directly from `/audit/raw_audit.json`.

```
+----------------------------------------------------------------------------------------------------------+
| Asset Summary Table                                                                                      |
+------------------------------------------------------+----------+-----------+------------+-------+-------+
| File Name                                            | Format   | Triangles | Dimensions | Score | Action|
+------------------------------------------------------+----------+-----------+------------+-------+-------+
| sinhagad_hill_topography_3d.glb                      | glTF/GLB | 526,332   | 100x26x97  | 5/10  | FIX   |
| sinhagad_fort_master_reconstruction (1).glb          | glTF/GLB | 535,988   | 100x20x97  | 4/10  | REBUILD|
| sinhagad_fort_master_architecture.obj                | OBJ      | ~4,982    | 38x14x15   | 3/10  | REBUILD|
+------------------------------------------------------+----------+-----------+------------+-------+-------+
```

### Detailed Evaluation

#### Asset 1: `sinhagad_hill_topography_3d.glb`
- **File Size:** 15,992,972 bytes (~15.25 MB)
- **Generator:** `THREE.GLTFExporter r170`
- **Hierarchy & Geometry:** 3 nodes, 2 meshes, 2 primitives, 526,332 triangles.
- **Bounding Box:** Min `[-50.0, 0.0, -48.41]`, Max `[50.0, 25.68, 48.41]`. Dimensions: `100.0 x 25.68 x 96.81` units.
- **Axis & Normals:** Y-up. Normals present (0 primitives without normals). 2 basic materials, 0 textures.
- **Georeferencing:** Completely absent (`has_georeferencing: false`).
- **Visual Renders:** [terrain_iso.png](file:///C:/Users/Suraj/sinhagad-kit-extracted/sinhagad-starter-kit/audit/renders/terrain_iso.png), [terrain_top.png](file:///C:/Users/Suraj/sinhagad-kit-extracted/sinhagad-starter-kit/audit/renders/terrain_top.png)
- **Morphological Assessment:** The high-polygon mesh captures the macroscopic triangular spur and ridgeline morphology of the Sahyadri plateau. However, the vertical-to-horizontal ratio is 25.68 / 100 = 0.257, representing an artificial ~1.5× to 2.0× vertical exaggeration compared to the real-world relief (~360m elevation drop over ~3,000m span, ratio ~0.12). The single monolithic 15MB file causes massive GPU memory overhead on mobile devices.
- **Score:** **5 / 10**
- **Decision:** **FIX / TILE**
- **Reason:** The geometric ridges are valuable and can be retained as reference, but the model must be calibrated against Copernicus GLO-30 DEM, scaled to metric meters ($1\text{ unit} = 1.0\text{ m}$), transformed to local origin `(0, 0, 0)`, and segmented into manageable, LOD-enabled tiles with low-resolution collision hulls.

---

#### Asset 2: `sinhagad_fort_master_reconstruction (1).glb`
- **File Size:** 20,479,104 bytes (~19.53 MB)
- **Generator:** `Sinhagad Fort Architectural Reconstruction Engine`
- **Hierarchy & Geometry:** 19 nodes, 19 meshes, 21 primitives, 535,988 triangles.
- **Bounding Box:** Min `[-50.0, 0.0, -48.41]`, Max `[50.0, 20.40, 48.41]`. Dimensions: `100.0 x 20.40 x 96.81` units.
- **Materials & Textures:** 6 materials, 2 embedded texture maps (rock/grass ground and tan masonry).
- **Georeferencing:** Completely absent (`has_georeferencing: false`).
- **Visual Renders:** [master_iso.png](file:///C:/Users/Suraj/sinhagad-kit-extracted/sinhagad-starter-kit/audit/renders/master_iso.png), [master_top.png](file:///C:/Users/Suraj/sinhagad-kit-extracted/sinhagad-starter-kit/audit/renders/master_top.png)
- **Architectural Assessment:** Contains 14 fort landmarks (Pune Darwaza, Kalyan Darwaza, Tanaji Samadhi, Rajaram Samadhi, Tilak Wada, Daru Kothar, Dev Taki, Khankonda Tank, bastions, and curtain walls) merged directly into the terrain mesh. The buildings are coarse blockouts / extruded masses with arbitrary dimensions:
  - Pune Darwaza is modeled as a generic single arched gate rather than the historically documented sequence of three ascending gates flanked by bastions.
  - Temple, samadhis, and tanks lack historical Maratha stone joinery, plinths, stepped cistern contours, or accurate roof profiles.
  - Having all buildings baked into a single 20MB file violates the project invariant: every structure must be a standalone, modular GLB (`SIN_<ID>_LOD0/1/2.glb`).
- **Score:** **4 / 10**
- **Decision:** **REBUILD MODULAR**
- **Reason:** Violates core architectural and modularity requirements. The architectural geometry is Tier T4 (unverified speculative placeholders) and cannot be certified for public release. Each structure must be rebuilt independently according to `Sinhagad_3D_Architecture_Spec.pdf` and tracked in `provenance.json`.

---

#### Asset 3: `sinhagad_fort_master_architecture.obj`
- **File Size:** 814,495 bytes (~795 KB)
- **Format:** Wavefront OBJ (5,755 vertices, 5,755 normals, 4,982 triangles, 106 mesh groups)
- **Materials:** No `.mtl` material file provided; untextured clay geometry.
- **Bounding Box:** Min `[-19.0, -7.10, -7.42]`, Max `[19.0, 7.10, 7.42]`. Dimensions: `38.0 x 14.20 x 14.85` local units.
- **Georeferencing & Units:** Completely unreferenced, centered at `(0, 0, 0)`.
- **Visual Renders:** [arch_iso.png](file:///C:/Users/Suraj/sinhagad-kit-extracted/sinhagad-starter-kit/audit/renders/arch_iso.png), [arch_front.png](file:///C:/Users/Suraj/sinhagad-kit-extracted/sinhagad-starter-kit/audit/renders/arch_front.png)
- **Architectural Assessment:** Depicts a stylized bastion with adjoining ramparts. Proportions do not align with any measured drawings or photographic evidence for Pune Darwaza or Kalyan Darwaza.
- **Score:** **3 / 10**
- **Decision:** **REBUILD**
- **Reason:** Incomplete, untextured, unscaled fragment. Kept strictly in `original-assets/` as historical reference.

---

## 5. Georeferencing & Spatial Alignment Gap Report

1. **Required Coordinate Reference System:**
   - **Projected Metric:** `EPSG:32643` (WGS 84 / UTM Zone 43N, meters).
   - **Vertical Datum:** `EGM2008` geoid orthometric heights (Mean Sea Level).
2. **Fort Center Anchor Point (S01 / `landmarks.json`):**
   - **Geographic:** Latitude `18.3656639° N`, Longitude `73.7552694° E` (approximate, ~70m uncertainty).
   - **UTM Zone 43N:** Easting $X \approx 368,540.8\text{ m}$, Northing $Y \approx 2,031,230.2\text{ m}$.
   - **Summit Altitude:** $\sim 1,290 - 1,312\text{ m}$ MSL.
3. **Current State of `geo/transform.json`:**
   - Origin coordinates (`x`, `y`, `z`) are currently `null`.
   - The scene axis mapping convention must be formally set to: `North = -Z`, `East = +X`, `Up = +Y`.
   - Scale factor: $1.0\text{ model unit} = 1.0\text{ meter}$.
4. **Action Required:**
   - Run `scripts/prepare_terrain.py` once GDAL is configured to download the official Copernicus GLO-30 tile (`Copernicus_DSM_COG_10_N18_00_E073_00_DEM.tif`), clip a 3,000m radius in UTM 43N, sample the precise height at the fort centroid, and populate `geo/transform.json`.

---

## 6. Open DEM Comparison & Data Acquisition Protocol

Per item 5 of the Phase 0 audit prompt:
1. **DEM Source Comparison:**
   - The supplied terrain GLB exhibits an estimated vertical exaggeration factor of ~1.5× to 2.0× and lacks real-world metric scaling.
   - Authoritative Copernicus GLO-30 data provides 30m horizontal resolution with validated EGM2008 orthometric elevation.
2. **DEM Data to Download:**
   - **Tile:** `Copernicus_DSM_COG_10_N18_00_E073_00_DEM.tif` (~25–30 MB)
   - **Source URL:** `https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N18_00_E073_00_DEM/Copernicus_DSM_COG_10_N18_00_E073_00_DEM.tif`
   - **Local Destination Path:** `data_src/dem/Copernicus_DSM_COG_10_N18_00_E073_00_DEM.tif`
   - **Clipped Output Path:** `data_src/dem/sinhagad_dem_utm43n.tif` (clipped to 3,000m radius around fort center in `EPSG:32643`).

---

## 7. Research Documentation Audit (`Sinhagad_3D_Research_Reference.pdf`)

### What is Already Covered:
1. **Bibliographic Register (S01 to S22):** Comprehensive coverage of Pune District Gazetteers (1885), Maharashtra State Directorate of Archaeology, ASI protected monument records, Imperial Gazetteer of India, and scholarly trekking documentation.
2. **Visual & Photographic Register (PH01 to PH20):** High-resolution Wikimedia Commons and CC-licensed images of Pune Darwaza (outer, middle, inner gates), Kalyan Darwaza, Tanaji Samadhi, Rajaram Samadhi, Daru Kothar, Devtake, and summit ridges.
3. **14 Landmark Specifications:** Detailed architectural breakdowns including the 3-gate sequence of Pune Darwaza, carvings (Sharabha on Gate 1; lotus and festoon on Gate 3), 20–25 step rock staircase, and cistern.

### Critical Gaps Identified (To be Tracked in `provenance.json`):
1. **Absence of Measured CAD / Elevation Drawings:** No measured architectural surveys exist in online public literature. All building widths, heights, wall thicknesses, and arch radiuses must be estimated from photographic scaling and tagged as **Tier T2 (Estimated from photos)** or **Tier T3 (Plausible blockout)**.
2. **Missing Structure-Specific GPS Points:** Exact geodetic coordinates for individual bastions and interior water tanks are undocumented; positions are known only relative to paths and ridgelines.
3. **Photographic Blind Spots:** Kalavantinicha Buruj and deep cistern interiors have zero clear, close-up photographs in public online archives.
4. **Material Finish Details:** Specific basalt dressing techniques (chiseled vs. rubble masonry) and historic mortar composition vary across repair campaigns and require field verification.

---

## 8. Physical Fieldwork & Measurement Collection Checklist

When a site survey is conducted, the field team must follow `docs/FIELD_CHECKLIST.pdf` and capture:
- [ ] Laser measure / tape dimensions of Pune Darwaza: Gate 1, 2, and 3 clear widths, arch heights, bastion diameters, wall thicknesses.
- [ ] Handheld GPS / RTK coordinates at each gate threshold and major bastion apex.
- [ ] Overlapping 60–80% photogrammetry image sequences for Gate 1 Sharabha carvings and Gate 3 lotus doorway.
- [ ] Step riser and tread measurements for the 20–25 stone steps between Gate 1 and Gate 2.
- [ ] Devtake rock cistern opening dimensions and water surface depth.
- [ ] Tanaji and Rajaram Samadhi plinth heights, column spacing, and canopy dimensions.

---

## 9. Risk Register & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **1. High-Poly Mobile Crash** | High | High | Enforce strict LODs (LOD0: 15k, LOD1: 5k, LOD2: 1k tris). Tile terrain into 500m chunks. Use Draco compression. |
| **2. False Historical Authority** | Critical | Medium | Strictly enforce AGENTS.md: Never invent dimensions; mark unverified attributes as UNKNOWN in `provenance.json`; display Tier badge on UI info panel; never allow Tier T4 assets in public builds. |
| **3. Missing Host Tooling (GDAL/QGIS/Blender)** | Medium | High | Document exact installation paths; implement scriptable Python/Node alternatives for mesh processing and coordinate transforms. |
| **4. Website Regression** | High | Low | Isolate 3D reconstruction under `/sinhagad` via dynamic client loading (`ssr: false`); leave `/experience/sinhagad` completely intact. |

---

## 10. Recommended Milestone 1 (Vertical Slice) & Acceptance Criteria

Per Rule 5 of `docs/MASTER_PLAN.md`, Milestone 1 represents the smallest end-to-end playable slice:

### Milestone 1 Scope
1. **Terrain:** One georeferenced DEM terrain tile (center plateau containing Pune Darwaza) scaled 1:1 in metric meters, centered at local origin `(0, 0, 0)`.
2. **Architecture:** Pune Darwaza Blockout Model (`SIN_PD_blockout.glb`) featuring the verified 3-gate sequence, bastions, and staircase, anchored at its correct local position.
3. **Controls:** First-person walking controller (walk speed 1.4 m/s, sprint 2.2 m/s, mouse-look, gravity, stair climbing $\le 0.3\text{ m}$).
4. **UI:** Interactive Landmark Info Panel displaying structure name, Tier T3 badge, photographic sources, and uncertainty notes.
5. **Integration:** Accessible at `/sinhagad` in `explore-pune`.

### Acceptance Criteria
- [ ] `geo/transform.json` has validated local origin coordinates derived from UTM Zone 43N.
- [ ] Terrain tile renders at metric scale with collision active.
- [ ] User can walk from before Gate 1, through the gateway sequence, and up the steps to the plateau without falling through meshes.
- [ ] Approaching or clicking Pune Darwaza displays the Info Panel showing Tier badge (`T3: Reference-based blockout`) and provenance sources.
- [ ] Frame rate maintains stable 60 FPS on desktop and $>30\text{ FPS}$ on mobile.
- [ ] `npm run typecheck` and `npm run build` pass with zero errors.

---

## 11. Completion & Next Step Gate

Phase 0 Audit is complete. Per the workflow instructions:
**STOPPING HERE. Awaiting user review and approval before proceeding to Step 2 (`prompts/03_research_database.md`).**
