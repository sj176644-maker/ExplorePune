# Milestone 1 Plan: Vertical Slice (Terrain Tile, Pune Darwaza & First-Person Walking)

**Document:** `/reports/M1_PLAN.md`  
**Phase:** Milestone 1 Architecture & Execution Plan  
**Project:** Sinhagad Fort Independent 3D Digital Heritage Reconstruction  
**Date:** 21 November 2026  
**Author:** Senior Multidisciplinary Engineering & Heritage Reconstruction Team  
**Status:** Complete — Ready for Review & Approval (No Code Written Yet)  

---

## 1. Executive Summary & Objective

Milestone 1 implements the foundational **vertical slice** required by Rule 5 of `docs/MASTER_PLAN.md` and `prompts/04a_milestone1_plan.md`. 

The objective is to prove the end-to-end heritage reconstruction pipeline on a complete, self-contained, and interactive playable slice:
1. One metric-accurate digital elevation model (DEM) terrain tile derived from authoritative satellite radar data.
2. A modular, historically researched 3D reconstruction of **Pune Darwaza** (representing all three successive gates, flanking bastions, and the connecting staircase).
3. First-person walking navigation along the actual historical approach path inside the existing Next.js website at route `/sinhagad`.
4. An interactive Landmark Information HUD displaying verified historical metadata, photographic evidence citations, and transparent accuracy tier badges (**Tier T3**).

In accordance with project rules, no production code has been written yet. This document establishes the technical blueprint, coordinate mappings, collision rules, acceptance criteria, and risk mitigations for Milestone 1.

---

## 2. Geodetic & Spatial Reference System Specifications

All geospatial calculations and scene origins conform strictly to the parameters validated during Phase 0 and Phase 1:

| Parameter | Specification | Value / Authority |
| :--- | :--- | :--- |
| **Projected Coordinate Reference System (CRS)** | `EPSG:32643` | WGS 84 / UTM Zone 43N (meters). |
| **Vertical Reference Datum** | `EGM2008` Geoid | Orthometric elevation in meters above Mean Sea Level (MSL). |
| **DEM Source** | Copernicus DEM GLO-30 | Tile `Copernicus_DSM_COG_10_N18_00_E073_00_DEM.tif` (30m resolution, ESA Open Access). |
| **Clipped Bounding Box (`EPSG:32643`)** | $6,000\text{ m} \times 6,000\text{ m}$ ($3\text{ km}$ radius) | Easting: $[365,495.5\text{ m}, 371,495.5\text{ m}]$<br>Northing: $[2,028,092.1\text{ m}, 2,034,092.1\text{ m}]$ |
| **DEM Elevation Span** | Sampled orthometric | Min: $604.5\text{ m}$ MSL (valley base) to Max: $1,314.3\text{ m}$ MSL (summit peak). |
| **Local Scene Origin (`(0, 0, 0)`)** | Stored in `geo/transform.json` | $X_0 = 368,495.5\text{ m}$ Easting<br>$Y_0 = 2,031,092.1\text{ m}$ Northing<br>$Z_0 = 1,307.3\text{ m}$ MSL Elevation |
| **Metric Scale Factor** | $1.0\text{ WebGL unit} = 1.0\text{ meter}$ | Preserves physical human scale and accurate architectural clearances. |
| **Three.js Axis Alignment** | East-North-Up to WebGL | $\text{scene.x} = \text{easting} - X_0$ ($+X = \text{East}$)<br>$\text{scene.y} = \text{elevation} - Z_0$ ($+Y = \text{Up}$)<br>$\text{scene.z} = -(\text{northing} - Y_0)$ ($-Z = \text{North}$) |
| **Pune Darwaza Local Anchor** | Relative scene offset | Easting $\approx 368,850.0\text{ m}$, Northing $\approx 2,031,510.0\text{ m}$, Elev $\approx 1,260.0\text{ m}$<br>$\implies \mathbf{X} \approx +354.5\text{ m},\; \mathbf{Y} \approx -47.3\text{ m},\; \mathbf{Z} \approx -417.9\text{ m}$. |

---

## 3. Terrain Processing & Asset Pipeline

```
[Raw Copernicus GLO-30 GeoTIFF (30m)]
                  │
                  ▼
[Python Script (prepare_terrain.py) -> UTM 43N Clip (201x201)]
                  │
                  ▼
[Heightmap Grid -> Indexed BufferGeometry (Metric Scale)]
                  │
                  ▼
[LOD Splitting: Center Plateau Tile (1km x 1km) + Surrounding Relief]
                  │
                  ▼
[Procedural Basalt & Soil Slope Shading (Slope-Blended Normal Maps)]
                  │
                  ▼
[Draco/Meshopt Compression -> public/assets/terrain/terrain_tile_M1.glb]
```

### Pipeline Steps:
1. **Raw GeoTIFF Ingestion:** The 1-degree tile `Copernicus_DSM_COG_10_N18_00_E073_00_DEM.tif` has been downloaded and verified in `data_src/dem/`.
2. **Reprojection & Clipping:** `scripts/prepare_terrain.py` performs rigorous bilinear resampling to a $201 \times 201$ regular UTM grid at 30m spacing (`sinhagad_dem_utm43n.tif`).
3. **Geometry Generation:** A scriptable generator extracts the central $1,000\text{m} \times 1,000\text{m}$ tile ($33 \times 33$ vertices, $\sim 2,100$ triangles) covering the fort plateau and the Pune Darwaza approach slope.
4. **Collision Representation:** A heightfield collider is instantiated directly from the elevation matrix, guaranteeing zero visual-to-collision mismatch for terrain walking.
5. **Shading & Textures:** Procedural slope-blended shader distinguishes:
   - Sheer basalt rock cliffs (slope $> 35^\circ$): dark, weathered vesicular basalt normals.
   - Gentle plateau terrain (slope $\le 20^\circ$): dry weathered Sahyadri grass and soil textures.
   - Textures compressed to WebP/KTX2 format ($1024 \times 1024$, power-of-two).

---

## 4. Pune Darwaza Architectural Reconstruction Strategy

Pune Darwaza is **not** a single gate. As documented in source `S02`, `S10`, and verified in photographs `PH01`, `PH10`, and `PH15`, it is a strategic defensive sequence of **three ascending gateways** built into the steep northeastern cliff spur:

```
[Trek Approach from Road]
           │
           ▼
[Gate 1: Outer Gate flanked by 2 Bastions + 2 Carved Sharabha Reliefs]
           │
   (22 Stone Steps + Rock-Cut Cistern on Left Flank)
           │
           ▼
[Gate 2: Middle Gate flanked by 2 Repaired Ashlar Bastions + Gun Ramp]
           │
     (Ascending Paved Rampart Walk)
           │
           ▼
[Gate 3: Inner Gate flanked by 2 Bastions + Lotus Lintel + Guard Rooms]
           │
           ▼
[Fort Plateau Entrance -> Pathway to Daru Kothar & Temples]
```

### Architectural Specifications:
- **Gate 1 (Outer Gate `SIN_PD_G1`):**
  - Pointed arch opening (estimated clear width $3.2\text{ m}$, apex height $4.8\text{ m}$, depth $2.8\text{ m}$).
  - Flanked by two rounded bastions (diameter $\approx 6.0\text{ m}$, outer height $\approx 7.5\text{ m}$ descending down the cliff face).
  - Parapet with crenellated merlons and musketry loopholes.
  - Two weathered Sharabha (mythical winged predator) low-relief carvings on the upper outer spandrels.
- **Ascending Staircase & Rock Cistern (`SIN_PD_STAIR` & `SIN_PD_CISTERN`):**
  - 22 stone steps (riser $0.18\text{ m}$, tread $0.32\text{ m}$, width $3.0\text{ m}$).
  - Water tank recessed into the living basalt cliff on the left flank just before Gate 2.
- **Gate 2 (Middle Gate `SIN_PD_G2`):**
  - Plain stone ashlar masonry gateway between two bastions reflecting historical repairs.
  - Stair access leading to the upper bastion battery platform.
- **Gate 3 (Inner Gate `SIN_PD_G3` & `SIN_PD_GUARDROOMS`):**
  - Main historic entrance with decorative carved lotus motif and festoon on the doorway surround.
  - Two recessed guard rooms ($3.5\text{m} \times 2.5\text{m}$) flanking the inner passage.

### Provenance & Uncertainty Management:
- **Tier Target:** **Tier T3 (Reference-based blockout)**.
- **Known Facts:** Sequential 3-gate layout, step count (20–25), bastion locations, arch styles, decorative motifs.
- **Missing Data (To be Refined Post-Survey):** Millimeter-accurate passage widths, exact bastion diameters, laser-scanned stone courses.
- **UI Presentation:** The Landmark Info Panel will prominently feature a **`Tier T3: Reference-Based Blockout`** badge with source citations (`S02, S04, S10, PH01, PH10, PH15`) and explicit uncertainty disclosures.

---

## 5. Locomotion & Collision Architecture

### Character Controller Parameters:
- **Controller Type:** Kinematic capsule controller with ground-snapping and continuous collision detection (CCD).
- **Player Dimensions:** Capsule radius $0.35\text{ m}$, total height $1.80\text{ m}$, camera eye-level $1.65\text{ m}$.
- **Locomotion Speeds:**
  - Base Walk Speed: $1.4\text{ m/s}$ ($5.0\text{ km/h}$).
  - Sprint Speed (Hold Shift): $2.2\text{ m/s}$ ($7.9\text{ km/h}$).
  - Max Step Climb: $0.30\text{ m}$ (enables seamless walking up the $0.18\text{ m}$ stone stairs without jumping).
  - Max Walkable Slope: $45^\circ$ (prevents scaling unnatural sheer cliff faces while allowing rampart ramps).
  - Gravity: $-9.81\text{ m/s}^2$ with grounded snap to eliminate step vibration.

### Collision Hull Hierarchy:
1. **Terrain:** Fast heightfield collider derived from DEM elevation vertices.
2. **Bastions & Curtain Walls:** Convex decomposed hulls and oriented bounding boxes (OBBs) blocking movement through masonry.
3. **Gateway Passages:** Compound box colliders forming the left wall, right wall, and ceiling, leaving the central $3\text{m}$ passage completely unobstructed for exploration.
4. **Staircase:** Angled ramp collision wedge underlying the visual step geometry to ensure silky-smooth camera ascent without stair jitter.

---

## 6. Website Integration Plan (`explore-pune`)

The integration strictly preserves all existing functionality and routes in `explore-pune`:

1. **Target Route:** `app/sinhagad/page.tsx` (brand new independent route).
2. **Client-Side Lazy Loading:**
   ```tsx
   // app/sinhagad/page.tsx
   import dynamic from 'next/dynamic';
   
   const SinhagadHeritageViewer = dynamic(
     () => import('@/components/sinhagad/SinhagadHeritageViewer'),
     { ssr: false, loading: () => <SinhagadLoadingScreen /> }
   );
   
   export default function SinhagadPage() {
     return <SinhagadHeritageViewer />;
   }
   ```
3. **No Collision with Existing 2D Game:** The route `/experience/sinhagad` continues running `Sinhagad2DGame` without interference.
4. **Lifecycle Hygiene:**
   - On component unmount, all Three.js renderers, scene graphs, geometries, materials, textures, and physics worlds are explicitly disposed.
   - Pointer Lock and keyboard event listeners are cleanly detached to prevent memory leaks.

---

## 7. Acceptance Criteria & Quality Gates

Milestone 1 will be considered verified only when all of the following numeric criteria are met:

- [ ] **Frame Rate:** Sustained $\ge 60\text{ FPS}$ on desktop browsers and $\ge 30\text{ FPS}$ on mobile devices.
- [ ] **Asset Budget:** Initial 3D assets loaded under $5\text{ MB}$ total download.
- [ ] **Walk Test Verification (`tests/milestone1_walk.test.ts`):**
  - Simulated character starts at the trek approach.
  - Walks through Gate 1 without clipping into bastions.
  - Ascends the 22 stone steps with smooth vertical displacement ($\Delta Y \approx +4.0\text{ m}$).
  - Passes the rock cistern and traverses Gate 2 and Gate 3 onto the plateau.
  - Zero fall-through under the terrain or getting stuck in walls.
- [ ] **UI Landmark Info Panel:**
  - Proximity trigger ($\le 15\text{ m}$) or direct click on Pune Darwaza opens the slide-in info card.
  - Displays structure title, Tier T3 badge, historical overview, and photographic citations.
- [ ] **Build Integrity:**
  - `npm run typecheck` exits with code 0 (zero TypeScript errors).
  - `npm run build` succeeds cleanly with Turbopack.

---

## 8. Risk Management & Fieldwork Register

| Identified Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Inaccurate gate proportions due to unmeasured dimensions** | Medium | Scale proportions strictly against human figures in photos PH01, PH10, PH15; label Tier T3 prominently in UI. |
| **Player falling through terrain during tab switch or low FPS** | High | Implement delta time clamping (`Math.min(dt, 0.05)`) and continuous collision detection (CCD) on player capsule. |
| **High draw calls from repetitive masonry** | Low | Merge static gate geometry into a single draw call per gate assembly (`SIN_PD_G1`, `SIN_PD_G2`, `SIN_PD_G3`). |
| **Mobile WebGL context loss** | Medium | Handle `webglcontextlost` and `webglcontextrestored` events with graceful asset re-instantiation. |

---

## 9. Next Step Gate

Milestone 1 planning is complete. In accordance with `prompts/04a_milestone1_plan.md`:
**STOPPING HERE. Awaiting user review and approval before proceeding to Step 5 (`prompts/04b_milestone1_build.md`).**
