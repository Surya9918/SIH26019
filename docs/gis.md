# GIS & REMOTE SENSING SPECIFICATION — SIH26019
## National Digital Platform for Land Governance

---

## 1. Geospatial Architecture
The GIS engine leverages standard GeoJSON representations with Shapely geometric calculations and projected coordinate systems.
- Vector coordinate space: WGS 84 (EPSG:4326)
- Bounding box projections: Telangana State & Hyderabad Metropolitan Region
- Layer stacking: Administrative boundaries, LULC 2018 Baseline, LULC 2026 Observed, NDVI Satellite layers

---

## 2. Multi-Temporal LULC Change Detection
Calculates the physical transition matrix across 5 canonical classes:
1. Agriculture (green)
2. Built-up / Urban (red)
3. Forest / Dense Canopy (dark green)
4. Waterbodies / Wetlands (blue)
5. Barren / Fallow Land (amber)

Computes net change, percentage change, annual rate (sq km/yr), and direct conversion paths (e.g. Agriculture $\rightarrow$ Built-up).

---

## 3. Remote Sensing Pipeline
- Sentinel-2 MultiSpectral Instrument (MSI) Level-2A simulation.
- Spectral Indices:
  - NDVI = (NIR - Red) / (NIR + Red)
  - NDBI = (SWIR - NIR) / (SWIR + NIR)
  - MNDWI = (Green - SWIR) / (Green + SWIR)
- Zonal health breakdown into dense forest, crop cover, sparse grassland, and non-vegetated built-up surfaces.
