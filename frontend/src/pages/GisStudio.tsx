import { useState, useEffect } from 'react';
import { Layers, Map as MapIcon, Maximize2, MousePointer2 } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchApi } from '../services/api';

// Helper component to recenter map when bounds change (omitted for brevity, basic setup below)

export function GisStudio() {
  const [layers, setLayers] = useState<any[]>([]);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState<'map' | 'satellite' | 'terrain'>('satellite');

  useEffect(() => {
    const applySettings = () => {
      const settingsStr = localStorage.getItem('bhu_settings');
      if (settingsStr) {
        const p = JSON.parse(settingsStr);
        if (p.mapView) setMapView(p.mapView.toLowerCase() as 'map'|'satellite'|'terrain');
      }
    };
    applySettings();
    window.addEventListener('bhu_settings_changed', applySettings);
    return () => window.removeEventListener('bhu_settings_changed', applySettings);
  }, []);

  useEffect(() => {
    // Fetch available layers
    fetchApi<{layers: any[]}>('/gis/layers')
      .then(res => setLayers(res.layers || []))
      .catch(err => console.error(err));
  }, []);

  const handleLayerToggle = async (layerId: string) => {
    if (activeLayer === layerId) {
      setActiveLayer(null);
      setGeoData(null);
      return;
    }
    
    setActiveLayer(layerId);
    setLoading(true);
    try {
      const res = await fetchApi<{features: any}>(`/gis/layers/${layerId}/features`);
      setGeoData(res.features);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Geospatial Intelligence Studio</h1>
        <p className="text-slate-500 max-w-3xl leading-relaxed">
          Vector rendering of cadastral bounds, LULC matrix analysis, and multi-spectral indices.
        </p>
      </div>

      <div className="flex-1 flex gap-6">
        
        {/* Sidebar Controls */}
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gov-blue" /> Available Layers
            </h3>
            
            <div className="space-y-2">
              {layers.map(layer => (
                <label key={layer.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-gov-blue rounded border-slate-300 focus:ring-gov-blue"
                      checked={activeLayer === layer.id}
                      onChange={() => handleLayerToggle(layer.id)}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{layer.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{layer.type}</div>
                  </div>
                </label>
              ))}
              
              {layers.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-4">No layers available</div>
              )}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 z-[1000] bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-200 text-sm font-bold text-gov-blue animate-pulse">
                Rendering Vector Data...
              </div>
            </div>
          )}
          
          <MapContainer 
            center={[20.5937, 78.9629]} // India center
            zoom={5} 
            zoomControl={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={
                mapView === 'satellite' ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" :
                mapView === 'terrain' ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" :
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
            />
            <ZoomControl position="bottomright" />
            
            {geoData && (
              <GeoJSON 
                key={activeLayer} // Re-render when layer changes
                data={geoData} 
                style={{
                  color: '#1e3a8a',
                  weight: 2,
                  opacity: 0.8,
                  fillColor: '#1e40af',
                  fillOpacity: 0.2
                }}
              />
            )}
          </MapContainer>
          
          {/* Map Toolbars */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-lg shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-gov-blue transition-colors hover:bg-slate-50">
              <MousePointer2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white rounded-lg shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-gov-blue transition-colors hover:bg-slate-50">
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="absolute top-4 right-4 z-[400]">
            <button className="w-10 h-10 bg-white rounded-lg shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-gov-blue transition-colors hover:bg-slate-50">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
