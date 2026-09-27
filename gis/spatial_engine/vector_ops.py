import json
from typing import Dict, Any, List, Optional
from shapely.geometry import shape, mapping, Polygon, Point

class SpatialEngine:
    """Core geospatial vector operations using Shapely and standard GeoJSON."""

    def __init__(self):
        pass

    def create_bounding_box_polygon(self, min_lon: float, min_lat: float, max_lon: float, max_lat: float) -> Dict[str, Any]:
        poly = Polygon([
            (min_lon, min_lat),
            (max_lon, min_lat),
            (max_lon, max_lat),
            (min_lon, max_lat),
            (min_lon, min_lat)
        ])
        return mapping(poly)

    def calculate_polygon_area_sqkm(self, geojson_geom: Dict[str, Any]) -> float:
        # Approximate area on spherical earth (lat/lon to km2 near India latitudes ~17N)
        geom = shape(geojson_geom)
        # 1 deg lon ~ 106 km at 17 deg N, 1 deg lat ~ 111 km
        area_deg2 = geom.area
        return round(area_deg2 * 106.0 * 111.0, 2)

    def buffer_geometry(self, geojson_geom: Dict[str, Any], distance_km: float) -> Dict[str, Any]:
        geom = shape(geojson_geom)
        # Convert km to approximate degrees (~0.009 deg per km)
        distance_deg = distance_km / 111.0
        buffered = geom.buffer(distance_deg)
        return mapping(buffered)

    def compute_intersection(self, geom1: Dict[str, Any], geom2: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        s1 = shape(geom1)
        s2 = shape(geom2)
        if not s1.intersects(s2):
            return None
        inter = s1.intersection(s2)
        return mapping(inter)

spatial_engine = SpatialEngine()
