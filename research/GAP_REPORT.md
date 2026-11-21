# Sinhagad Fort 3D Reconstruction: Research & Fieldwork Gap Report

**Document:** `/research/GAP_REPORT.md`  
**Phase:** Phase 1 — Research Database & Provenance Framework  
**Project:** Sinhagad Fort Independent 3D Digital Heritage Reconstruction  
**Date:** 21 November 2026  
**Auditor / Researcher:** Senior Heritage GIS & Architectural Reconstruction Team  
**Status:** Complete — Ready for Review & Approval  

---

## 1. Purpose & Honesty Invariant

In accordance with `AGENTS.md` and Rule 0 of `docs/MASTER_PLAN.md`, this report establishes an uncompromised register of **data gaps**: architectural dimensions, geodetic coordinates, structural details, and archival records that **do not exist in published online literature** and can only be obtained through:
1. An on-site physical measurement campaign (laser distance meter, tape measure).
2. A geodetic GPS / RTK survey on the mountain.
3. High-resolution on-site overlapping photogrammetry sequences.
4. Formal access to archival drawings and conservation records from the Maharashtra State Directorate of Archaeology & Museums.

Where a value is unknown, it remains flagged as `UNKNOWN` in `provenance.json` and `measurements.csv`. Speculative invention of dimensions or shapes is strictly prohibited.

---

## 2. Gap Priority Ranking for Project Milestones

```
+---------------------------------------------------------------------------------------------------+
| Priority 1: CRITICAL FOR MILESTONE 1 (Pune Darwaza Vertical Slice)                                |
| Priority 2: REQUIRED FOR FORTIFICATIONS (Curtain Walls, Bastions, Kalyan Darwaza, Daru Kothar)    |
| Priority 3: SECONDARY INTERIOR HERITAGE (Temples, Samadhis, Water Tanks, Tilak Bungalow)         |
+---------------------------------------------------------------------------------------------------+
```

---

### Priority 1: Critical Gaps for Milestone 1 (Pune Darwaza Vertical Slice)

These gaps directly affect the geometry, collision bounds, and player walkability of the first vertical slice (Pune Darwaza approach):

| Element / Landmark | Specific Missing Data | Current Handling / Proxy | Required Fieldwork / Action to Close Gap |
| :--- | :--- | :--- | :--- |
| **Pune Darwaza: Gate 1 (Outer Gate)** | - Exact passage clear width & arch apex height.<br>- Wall thickness through the barrel passage.<br>- Bastion diameters and vertical height from bedrock footing.<br>- Depth and relief of the two carved Sharabha mythical beasts. | Modeled as **Tier T3 blockout** scaled from human figures in photos PH01 and PH10.<br>Sharabha represented as low-relief placeholder panel. | **Field Visit:** Laser measure passage width, height, bastion outer curvature, and wall depth.<br>**Capture:** 60-80% overlapping close-up photo sequence of the Sharabha carvings for photogrammetry. |
| **Stone Staircase (Between Gate 1 & 2)** | - Exact riser height (mm) and tread depth (mm).<br>- True curvature / angle of the staircase ascent.<br>- Total surveyed step count (literature gives "20 to 25"). | Step count set to 22 steps; riser 180mm, tread 320mm (**Tier T3 estimate** for player movement). | **Field Visit:** Measure 3 distinct step riser/tread samples and record exact total step count. |
| **Rock-Cut Cistern at Cliff** | - Opening dimensions (length, width).<br>- Depth to water surface and ceiling cut height. | Modeled as recessed rock cavity on left cliffside (**Tier T3 blockout** based on S02). | **Field Visit:** Tape measure opening perimeter and depth from path. |
| **Pune Darwaza: Gate 2 (Middle Gate)** | - Clear width and height of repaired arch.<br>- Height of flanking bastions.<br>- Staircase to upper bastion platform. | Modeled as plain stone masonry arch assembly (**Tier T3 blockout** based on S02). | **Field Visit:** Laser measure portal dimensions and step access to the upper bastion gun platform. |
| **Pune Darwaza: Gate 3 (Inner Gate)** | - Clear passage dimensions.<br>- Profile of lotus motif and festoon carving on lintel.<br>- Inner guard room dimensions ($L \times W \times H$). | Modeled with pointed arch portal and recessed guard rooms (**Tier T3 blockout** based on PH15). | **Field Visit:** Measure doorway, guard room interiors, and take macro photographs of the lotus lintel carving. |
| **Local Ground Control Points (GCP)** | - Survey-grade RTK GPS coordinates for Gate 1 threshold, Gate 2, Gate 3, and outer bastion apex. | Uses approximate geographic coordinates from OpenStreetMap and S01 ($\approx 70\text{ m}$ uncertainty, **Tier T3**). | **Field Visit:** Log dual-frequency GNSS / RTK coordinates at each gate threshold to tie into `EPSG:32643`. |

---

### Priority 2: Fortification Perimeter & Military Architecture (Milestone 2)

These gaps affect the reconstruction of the complete summit perimeter:

| Element / Landmark | Specific Missing Data | Current Handling / Proxy | Required Action to Close Gap |
| :--- | :--- | :--- | :--- |
| **Curtain Wall Profiles** | - Outer wall height (varies from $3\text{ m}$ to $>10\text{ m}$ above sheer cliffs).<br>- Wall thickness at walkway level.<br>- Parapet height, merlon widths, and loophole spacing. | Standardized Maratha curtain wall cross-section applied as **Tier T3 placeholder** along cliff contours. | **Field Survey:** Measure 5 sample wall cross-sections (outer face, inner walkway, parapet, merlons). |
| **37 Bastions (Buruj Register)** | - Complete geometric register classifying each bastion as round, semi-circular, or polygonal.<br>- Diameters and gun embrasure positions for key bastions (Zunjar, Kandrai, Khadkadyacha, Kalavantinicha). | Key bastions blocked out from 1818 British siege plan (S21) and satellite outlines (**Tier T3**). Other 30+ bastions kept generic. | **Archival / Field:** Request bastion inventory from State Archaeology; conduct perimeter GPS mapping walk. |
| **Kalavantinicha Buruj** | - ZERO close-up photographs exist in open online archives.<br>- Exact shape, condition, and surviving wall height are undocumented. | Marked **Tier T4 (Uncertain)** in `landmarks.csv`. Excluded from detailed modeling until photographed. | **Field Visit:** Dedicated photographic documentation of the southeastern spur and bastion remains. |
| **Kalyan Darwaza Gateway Complex** | - Passage width and crown height.<br>- Outer triangular bastion geometry.<br>- Exact epigraph text and script (Persian / Devanagari inscription on bastion).<br>- Interior soldiers' quarters layout. | Modeled from photos PH02 and PH16 as **Tier T2/T3** based on visible masonry courses. | **Field Visit:** Laser measure gateway, photograph soldiers' quarters, and capture high-res macro photos of the historic inscription. |
| **Daru Kothar (Gunpowder Magazine)** | - Internal length, width, and vault apex height.<br>- External wall thickness.<br>- Entrance portal and blast-baffle orientation. | Modeled as barrel-vaulted rectangular stone structure based on S02 and exterior photo PH17 (**Tier T3**). | **Field Visit:** Measure interior room dimensions, vault thickness, and entrance door surround. |

---

### Priority 3: Summit Plateau Heritage & Interior Shrines (Milestone 3+)

These gaps affect interior historic structures and landscape features:

| Element / Landmark | Specific Missing Data | Current Handling / Proxy | Required Action to Close Gap |
| :--- | :--- | :--- | :--- |
| **Tanaji Malusare Memorial & Excavated Samadhi** | - Architectural drawings of the 17th-century original stone plinth excavated in 2019.<br>- 1917 archival photograph (PH19) referenced by conservation architect Rahul Samel.<br>- Canopy column spacing and height. | Modeled from contemporary photos PH07, PH08, PH09 as **Tier T2** (modern memorial structure). | **Archival Request:** Contact Directorate of Archaeology & Museums (Dr. Tejas Garge) or Rahul Samel for 2019 measured drawings and 1917 archival scan. |
| **Chhatrapati Rajaram Samadhi** | - Plinth dimensions ($L \times W \times H$).<br>- Chhatri column height, arch radius, and dome apex height. | Scaled from photo PH06 (**Tier T2/T3**). | **Field Visit:** Measure square plinth and column height with laser meter. |
| **Kondhaneshwar Temple** | - Architectural floor plan of garbhagriha, sabhamandapa, and Nandi mandapa.<br>- Shikhara elevation and spire height.<br>- Epigraphical / sculptural details. | Modeled from photo PH04 and S02 as **Tier T3 blockout**. | **Field Survey:** Measure sabhamandapa column grid and temple perimeter. |
| **Devtake & Rock Cisterns** | - Depth to bedrock floor.<br>- Water volume and structural pillar support layout inside the subterranean rock cuts. | Represented with static water plane at documented rim level (**Tier T3**). | **Field Visit:** Sounding line measurement of water depth; photographic log of interior rock pillars. |
| **Lokmanya Tilak Bungalow** | - Measured floor plan, room layout, veranda post spacing.<br>- Roof truss details. | Envelope modeled from photo PH05 (**Tier T3**). | **Field Visit:** Measure veranda dimensions and external perimeter. |

---

## 3. Recommended Archival Outreach Plan

To resolve historical gaps without waiting for physical site surveys, the project should initiate official archival inquiries:

1. **Maharashtra State Directorate of Archaeology and Museums (St. George's Fort, Mumbai):**
   - *Target:* Conservation drawings, condition reports, and excavation documentation from the 2019 Tanaji memorial restoration project (supervised by Dr. Tejas Garge).
2. **Conservation Architect Rahul Samel:**
   - *Target:* Information regarding the 1917 archival photograph showing the original stone samadhi superstructure.
3. **British Library / National Archives of India:**
   - *Target:* High-resolution digital scan of Lt. Col. Valentine Blacker’s 1818 siege plan and elevation contours from *Memoir of the Operations of the British Army in India* (1821).
4. **Survey of India (Western Zone, Pune):**
   - *Target:* High-resolution extract of 1:50,000 Toposheet 47F/15 for micro-relief verification.

---

## 4. Summary & Verification

All data gaps are now comprehensively cataloged, prioritized, and linked to their mitigation strategies. No speculative geometry will enter the production build, and every asset in Milestone 1 will transparently display its **Tier T3** provenance badge in the user interface.
