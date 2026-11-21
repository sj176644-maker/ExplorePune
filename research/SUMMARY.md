# Sinhagad Fort 3D Reconstruction: Research Database Summary

**Document:** `/research/SUMMARY.md`  
**Phase:** Phase 1 — Research Database & Provenance Framework  
**Project:** Sinhagad Fort Independent 3D Digital Heritage Reconstruction  
**Date:** 21 November 2026  
**Auditor / Researcher:** Senior Heritage GIS & Architectural Reconstruction Team  
**Status:** Complete — Ready for Review & Approval  

---

## 1. Executive Overview & Methodology

Phase 1 establishes an authoritative, traceable, and transparent evidence foundation for the 3D digital reconstruction of Sinhagad Fort (Kondhana), located in Pune District, Maharashtra.

In strict adherence to the project rules:
1. **Zero Fabrication:** No dimensions, coordinates, dates, or historical features have been fabricated. Any unmeasured architectural element is explicitly designated as `UNKNOWN` and cataloged in the Gap Report.
2. **Strict Provenance Tiers:** Every data point is tagged with an accuracy tier:
   - **Tier T1:** Primary archaeological excavation data, laser survey, or official government geodetic survey.
   - **Tier T2:** High-confidence evidence derived from high-resolution, multi-angle photographs and authoritative literature.
   - **Tier T3:** Documented literature estimates, 30m Copernicus GLO-30 DEM macro terrain, or reference-based polygonal blockouts.
   - **Tier T4:** Speculative or unverified geometry (strictly prohibited from the final public web build).
3. **Licensing & Ethical Invariants:** No proprietary Google Earth meshes or textures have been extracted. All visual references are cataloged with explicit licenses and attribution statements.

---

## 2. Structured Registers Index

The research database comprises six machine-readable CSV registers located in `/research/`:

| Register | Description | Entries |
| :--- | :--- | :--- |
| [**`sources.csv`**](file:///C:/Users/Suraj/explore-pune/research/sources.csv) | Master bibliographic register of 24 sources (S01–S24) with reliability ratings (1–5) and licensing. | 24 sources |
| [**`photos.csv`**](file:///C:/Users/Suraj/explore-pune/research/photos.csv) | Photographic evidence register (PH01–PH20) with photographer attribution, date, license, and dimension utility. | 20 photos |
| [**`landmarks.csv`**](file:///C:/Users/Suraj/explore-pune/research/landmarks.csv) | Verified gazetteer of 18 fort structures with alternate names, functional classification, and source mappings. | 18 structures |
| [**`coordinates.csv`**](file:///C:/Users/Suraj/explore-pune/research/coordinates.csv) | Geospatial coordinate register (`EPSG:4326` & `EPSG:32643`) with extraction methodology and accuracy tiers. | 19 coordinates |
| [**`measurements.csv`**](file:///C:/Users/Suraj/explore-pune/research/measurements.csv) | Architectural measurement register with values, units, extraction methods, and explicit uncertainty flags. | 36 elements |
| [**`licences.csv`**](file:///C:/Users/Suraj/explore-pune/research/licences.csv) | Legal compliance register detailing licensing terms, commercial reuse rights, and required attribution text. | 21 licenses |

---

## 3. Name Verification Table

This table compares how each primary and secondary structure is named across authoritative sources, noting whether sources agree or diverge:

| Canonical Project Name | Sources & Specific Names Cited | Status / Agreement | Architectural Notes |
| :--- | :--- | :--- | :--- |
| **Pune Darwaza** | **S01:** Pune Gate, Pune Darwaja<br>**S02:** Pune Darwaza (3 successive gates: Gate 1 outer, Gate 2 middle, Gate 3 inner)<br>**S04:** Pune Gate (primary entrance from northeast)<br>**S05:** Sinhagad Fort Door<br>**S10:** Pune Darwaja<br>**S15:** Pune Darwaza | **Full Agreement** | Sequence of 3 ascending gates on the northeastern cliff face. Outer gate flanked by 2 bastions with sharabha carvings; middle gate plain/repaired; inner gate with lotus motif. |
| **Kalyan Darwaza** | **S01:** Kalyan Gate, Kalyan Darwaja<br>**S02:** Kalyan Darwaza<br>**S04:** Kalyan Gate<br>**S10:** Kalyan Darwaja<br>**S12:** Kalyan Darvaza<br>**S15:** Kalyan Darwaza | **Full Agreement** | South-southwestern gate facing Kalyan village and the Konkan valley. Distinctive outer triangular bastion protecting inner arched portal. Inscription in Persian/Devanagari. |
| **Daru Kothar** | **S01:** Gunpowder storehouse<br>**S02:** Daru Kothar (दारू कोठार)<br>**S03:** Gunpowder magazine<br>**S10:** Daru Kothar | **Full Agreement** | Heavy bomb-proof masonry building with barrel-vaulted roof, built to withstand mortar bombardment. Located west of Pune Darwaza approach. |
| **Devtake (Dev Taki)** | **S01:** Dev Taki (sacred tank)<br>**S02:** Devtake (देवटाके)<br>**S10:** Dev Taki | **Full Agreement** | Perennial natural rock-cut cisterns carved deep into basalt bedrock. Potable drinking water source historically kept ice-cold year round. |
| **Kondhaneshwar Temple** | **S01:** Kaundinyeshwar Temple<br>**S02:** Kondhaneshwar Mandir (कोंढाणेश्वर मंदिर)<br>**S10:** Kondhaneshwar Temple<br>**S14:** Kaundinyeshwar Temple | **Spelling Variant Only** | Ancient Shiva temple predating the fort fortifications (Yadava period / 11th-13th century). Both "Kondhaneshwar" and "Kaundinyeshwar" refer to the same stone shrine. |
| **Amruteshwar Bhairav Temple** [NEW] | **S02:** Amruteshwar Mandir (अमृतेश्वर मंदिर)<br>**S10:** Amruteshwar Bhairav Temple<br>**S14:** Amruteshwar Temple | **Full Agreement** | Ancient temple dedicated to Bhairav, located near the main central crossroads of the summit plateau. |
| **Tanaji Malusare Samadhi** | **S01:** Tanaji Malusare Samadhi<br>**S02:** Subedar Tanaji Malusare Smarak (तानाजी मालुसरे समाधी)<br>**S06/S07:** Original 17th-century warrior memorial excavated 2019<br>**S08:** Tanaji Malusare Memorial<br>**S10:** Tanaji Samadhi | **Full Agreement** | Commemorates Subedar Tanaji Malusare. Layered site: original 17th-century stone masonry platform uncovered in 2019, modern concrete canopy, 1976 bronze statue. |
| **Chhatrapati Rajaram Samadhi** | **S01:** Rajaram Maharaj Samadhi<br>**S02:** Chhatrapati Rajaram Maharaj Samadhi (राजाराम महाराज समाधी)<br>**S10:** Rajaram Samadhi | **Full Agreement** | Stone funerary chhatri with square plinth, arched openings, and domed roof canopy, commemorating the younger son of Chhatrapati Shivaji Maharaj who died at Sinhagad in 1700. |
| **Lokmanya Tilak Bungalow** | **S01:** Tilak Bungalow<br>**S02:** Lokmanya Tilak Bungalow (लोकमान्य टिळक बंगला)<br>**S03:** Tilak Bungalow<br>**S10:** Tilak Wada<br>**S14:** Tilak Bungalow | **Minor Variant** ("Bungalow" vs "Wada") | Historic stone residence where Lokmanya Bal Gangadhar Tilak spent summers and where Mahatma Gandhi met Tilak. Pitched Mangalore tile roof with stone veranda. |
| **Kalavantinicha Buruj** [NEW] | **S02:** Kalavantinicha Buruj (कलावंतीणीचा बुरूज)<br>**S10:** Kalavanti Burj | **Agreement** (Watch out for Prabalgad mix-up) | Southeastern rampart bastion. Must NOT be confused with Kalavantin Durg at Prabalgad (Raigad). |
| **Zunjar Buruj** [NEW] | **S02:** Zunjar Buruj (झुंजार बुरूज)<br>**S10:** Junjhar Buruj<br>**S21:** Junjhar Bastion (1818 plan) | **Full Agreement** | Formidable bastion perched on the narrow far southern promontory of the fort ridge. |
| **Kandrai Buruj** [NEW] | **S02:** Kandrai Buruj (कंद्राई बुरूज)<br>**S10:** Kandrai Bastion | **Full Agreement** | Prominent western salient bastion commanding the western escarpment. |
| **Khadkadyacha Buruj** [NEW] | **S02:** Khadkadyacha Buruj (खडकड्याचा बुरूज)<br>**S10:** Khadkada Bastion | **Full Agreement** | Bastion safeguarding the sheer Khadakada cliff, near the outer Pune gate postern. |
| **Khankonda Tank** [NEW] | **S02:** Khankonda Taki (खणकोंडा तळे)<br>**S10:** Khankonda Tank | **Full Agreement** | Large central open rectangular water reservoir excavated into rock and lined with masonry. |
| **Horse Stables (Ghodyanchi Paga)** [NEW] | **S02:** Ghodyanchi Paga (घोड्यांची पागा)<br>**S10:** Horse Stables<br>**S17:** Category 'Horse stable (Sinhagad)' | **Full Agreement** | Subterranean pillared cavern cut directly into basalt bedrock cliff; served as cavalry stables / ammunition shelters. |
| **Doordarshan TV Tower** [NEW] | **S01:** TV Relay Tower<br>**S10:** Sinhagad TV Tower | **Full Agreement** | Modern steel lattice telecommunications tower constructed in 1973. Prominent modern visual landmark at summit. |

---

## 4. Contradictions & Discrepancies Table

Where sources differ, the project maintains an explicit handling policy to avoid speculative modelling:

| Topic | Conflict Description | Source Comparison | Resolution / Handling Policy |
| :--- | :--- | :--- | :--- |
| **1. Tanaji Malusare Death Date** | Sources record conflicting years for the Battle of Sinhagad. | **S01 & S02 history:** 4 February 1670 (Magh Vadya Navami).<br>**S02 tour text:** Mentions 1672 in one sentence. | **Use 4 February 1670.** Treat 1672 as an isolated typographical slip in S02's tour chapter, as S02's own chronology chapter states 1670. |
| **2. Chhatrapati Rajaram Death Date** | Day of death differs by 24 hours. | **S01 & S02 history:** 3 March 1700.<br>**S02 tour text:** Saturday 2 March 1700. | **Use 3 March 1700** pending verification against primary Bakhars or state epigraphical records. |
| **3. Tanaji Memorial Sequence** | Conflicting construction dates for modern memorial structures. | **S06 (The Hindu):** States memorial built in 1941 with bronze statue.<br>**S08 (Bridge Chronicle):** Concrete platform 1938, concrete statue 1941, bronze statue 1976. | **Adopt S08 sequence** as it matches historical records of the Sinhagad Smarak Mandal and Dr. Tejas Garge's 2019 archaeological excavation notes. |
| **4. Tilak Monument at Bungalow** | Different descriptions of the memorial marker. | **S02:** Claims a statue of Tilak flanked by two cannons.<br>**S01:** Describes a bust at the entrance.<br>**PH05:** Shows front facade without large statue. | **Verify via field inspection.** In 3D model, represent the verified building envelope; omit freestanding statues until confirmed. |
| **5. Fort Summit Elevation** | Elevation figures span from 1,290 m to 1,328 m. | **S01 / S20:** 1,317 m (Survey of India sheet 47F/15).<br>**S02:** 1,315 m (4,314 ft).<br>**S04:** 1,312 m.<br>**S05:** 1,290 m.<br>**S10:** 1,328 m. | **Standardize on 1,312 m – 1,317 m.** In WebGL scene, reference EGM2008 orthometric elevation sampled from Copernicus GLO-30 DEM. |
| **6. Fort Plateau Surface Area** | Wildly conflicting area numbers. | **S02:** Approximately 70 acres.<br>**S13 (Tripoto):** 700 acres. | **Use 70 acres.** S13 is a low-reliability travel blog with gross errors. Polygon area calculated from GIS bounds is $\approx 0.30 - 0.35\text{ km}^2$ ($\approx 75 - 85\text{ acres}$). |
| **7. Kalavantin Nomenclature** | Risk of conflating Sinhagad with Prabalgad. | **Public internet:** Kalavantin Durg is a famous pinnacle at Prabalgad (Raigad).<br>**S02 & S10:** Kalavantinicha Buruj is a bastion on Sinhagad's southeast rampart. | **Strictly decouple.** Do not use any photos or references from Prabalgad for Sinhagad's Kalavantinicha Buruj. |
| **8. Unnamed 'Bungalow' on Rampart Walk** | Confusion over multiple colonial-era bungalows. | **S02:** Mentions an unnamed bungalow near the southeastern pond, plus Tilak Bungalow.<br>**S03:** Cites 1876 sale notice showing multiple British cottages. | **Mark unnamed bungalow as Tier T4.** Reconstruct only the verified Tilak Bungalow; document others as historical sites pending survey. |

---

## 5. Source Reliability Synthesis

1. **High Reliability (Rank 4–5):**
   - **S20 (Survey of India 47F/15):** Uncontested national standard for macro terrain, ridgelines, and benchmark heights.
   - **S23 (Copernicus DEM GLO-30):** 30m global elevation model providing metric orthometric heights.
   - **S06 / S07 (Directorate of Archaeology & Museums / Rahul Samel):** Primary source for 2019 archaeological excavation data on Tanaji's samadhi.
   - **S21 (Blacker 1821 Siege Plan):** Earliest surveyed military contour and bastion layout of Sinhagad.
2. **Moderate Reliability (Rank 3):**
   - **S01 (Wikipedia):** Useful overview, coordinate baseline, and photographic reference index.
   - **S02 (Durgbharari / Suresh Nimbalkar):** Richest structure-by-structure spatial description; treated as primary walking tour guide, cross-checked for typos.
   - **S03 (Live History India):** Valuable historical archival citations (1818 British siege, 1876 auction notices).
   - **S04 / S15 (Maharashtra & Incredible India Tourism):** Confirms official administrative designations.
3. **Low Reliability / Leads Only (Rank 1–2):**
   - **S10, S14, S16, S18:** Academic slides, tourism aggregators, student notes; used solely as topological leads, never for factual geometry.
   - **S13 (Tripoto):** Marked UNRELIABLE due to factual inaccuracies.

---

## 6. Next Steps Gate

The research database is fully structured, validated, and committed. Phase 1 deliverables are complete.
**Awaiting approval before initiating Step 3 (Terrain Preparation via `prepare_terrain.py`).**
