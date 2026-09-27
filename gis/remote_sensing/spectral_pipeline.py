import math
from typing import Dict, Any, List, Optional
import numpy as np

class RemoteSensingPipeline:
    """
    Satellite remote-sensing processing pipeline supporting spectral indices:
    - NDVI = (NIR - RED) / (NIR + RED)
    - NDBI = (SWIR - NIR) / (SWIR + NIR)
    - MNDWI = (GREEN - SWIR) / (GREEN + SWIR)
    """

    def compute_spectral_indices(
        self,
        red_band: np.ndarray,
        nir_band: np.ndarray,
        swir_band: Optional[np.ndarray] = None,
        green_band: Optional[np.ndarray] = None
    ) -> Dict[str, Any]:
        # Normalize between 0 and 1
        red = red_band.astype(float)
        nir = nir_band.astype(float)
        
        # NDVI computation with zero-division avoidance
        ndvi_denom = nir + red
        ndvi = np.where(ndvi_denom != 0, (nir - red) / ndvi_denom, 0.0)
        
        results = {
            "ndvi_mean": float(np.mean(ndvi)),
            "ndvi_max": float(np.max(ndvi)),
            "ndvi_min": float(np.min(ndvi)),
            "ndvi_std": float(np.std(ndvi))
        }

        if swir_band is not None:
            swir = swir_band.astype(float)
            ndbi_denom = swir + nir
            ndbi = np.where(ndbi_denom != 0, (swir - nir) / ndbi_denom, 0.0)
            results["ndbi_mean"] = float(np.mean(ndbi))

        if green_band is not None and swir_band is not None:
            green = green_band.astype(float)
            mndwi_denom = green + swir
            mndwi = np.where(mndwi_denom != 0, (green - swir) / mndwi_denom, 0.0)
            results["mndwi_mean"] = float(np.mean(mndwi))

        return results

    def simulate_satellite_acquisition(
        self,
        region: str,
        cloud_cover_pct: float = 3.5,
        resolution_m: int = 10
    ) -> Dict[str, Any]:
        """
        Simulates remote sensing tile acquisition and processing for Sentinel-2 / Landsat-9
        calibrated for agricultural & urban monitoring.
        """
        try:
            from pystac_client import Client
            
            # Using Earth Search by Element 84, a public STAC API for Sentinel-2
            client = Client.open("https://earth-search.aws.element84.com/v1")
            
            # Approximate bounding box for the given region, typically we would geocode this
            bbox = [78.1, 17.1, 78.6, 17.6] if "Telangana" in region else [-180, -90, 180, 90]
            
            search = client.search(
                collections=["sentinel-2-l2a"],
                bbox=bbox,
                query={"eo:cloud_cover": {"lt": cloud_cover_pct}},
                max_items=1
            )
            
            items = list(search.items())
            if not items:
                return {
                    "status": "unavailable",
                    "reason": "no_data_found",
                    "message": f"No satellite imagery found for {region} matching cloud cover criteria."
                }
                
            item = items[0]
            
            return {
                "status": "success",
                "provider": "Earth Search (Sentinel-2 L2A)",
                "item_id": item.id,
                "datetime": item.datetime.isoformat(),
                "cloud_cover": item.properties.get("eo:cloud_cover"),
                "assets": {
                    "visual": item.assets["visual"].href if "visual" in item.assets else None,
                    "metadata": item.assets["metadata"].href if "metadata" in item.assets else None
                },
                "bbox": item.bbox
            }
        except ImportError:
            return {
                "status": "unavailable",
                "reason": "not_implemented",
                "message": "pystac-client is not installed. Please install it to use real satellite API ingestion."
            }
        except Exception as e:
            return {
                "status": "error",
                "reason": "api_error",
                "message": f"Failed to fetch satellite data: {str(e)}"
            }

remote_sensing_pipeline = RemoteSensingPipeline()
