import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import indiaGeoJson from '../assets/india_states.json';
import { Layers, ChevronDown } from 'lucide-react';



// Thematic Palettes
const PALETTES = {
  'Land Use': [
    { type: 'Agriculture', color: '#10B981', fill: 'fill-emerald-500' }, // Green
    { type: 'Forest', color: '#047857', fill: 'fill-emerald-700' },      // Deep Green
    { type: 'Urban', color: '#F59E0B', fill: 'fill-amber-500' },         // Orange
    { type: 'Water', color: '#3B82F6', fill: 'fill-blue-500' },          // Blue
    { type: 'Barren', color: '#94A3B8', fill: 'fill-slate-400' },        // Gray
  ],
  'Climate Risk': [
    { type: 'Low', color: '#34D399', fill: 'fill-emerald-400' },
    { type: 'Moderate', color: '#FBBF24', fill: 'fill-amber-400' },
    { type: 'High', color: '#F87171', fill: 'fill-red-400' },
    { type: 'Extreme', color: '#B91C1C', fill: 'fill-red-700' },
  ]
};

// Deterministic state assignment based on string hash to keep it stable
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Component to fit map to bounds on load
function MapBoundsFit({ data }: { data: any }) {
  const map = useMap();
  React.useEffect(() => {
    if (data) {
      const geoJsonLayer = L.geoJSON(data);
      const fit = () => {
        map.fitBounds(geoJsonLayer.getBounds(), { 
          paddingTopLeft: [10, 10],
          paddingBottomRight: [10, 30] // slightly more padding on bottom to lift India up
        });
      };
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
  }, [data, map]);
  return null;
}

export function India2DMap() {
  const [activeLayer, setActiveLayer] = useState<'Land Use' | 'Climate Risk'>('Land Use');
  const [hoveredState, setHoveredState] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [layersOpen, setLayersOpen] = useState(false);

  // Click outside and escape key to close layers
  const layersRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (layersRef.current && !layersRef.current.contains(event.target as Node)) {
        setLayersOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLayersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent flex items-center justify-center font-sans">
      
      {/* Background GIS Grid & Styling */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Subtle radial glow behind India */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* React Leaflet Map */}
      <div className="absolute inset-0 z-10 w-full h-full" onMouseLeave={() => setHoveredState(null)}>
        <MapContainer 
          center={[22.5, 80]} 
          zoom={4.5}
          zoomSnap={0.1}
          zoomDelta={0.1}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          attributionControl={false}
          className="w-full h-full bg-transparent outline-none drop-shadow-[0_0_15px_rgba(0,139,114,0.15)]"
        >
          {/* ArcGIS World Imagery Basemap */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          
          <MapBoundsFit data={indiaGeoJson} />

          <GeoJSON 
            key={activeLayer}
            data={indiaGeoJson as any} 
            style={(feature: any) => {
               const stateName = feature?.properties.NAME_1 || feature?.properties.name || 'Unknown';
               const hash = hashString(stateName);
               const landUseIndex = hash % PALETTES['Land Use'].length;
               const climateRiskIndex = hash % PALETTES['Climate Risk'].length;
               
               const currentData = activeLayer === 'Land Use' ? PALETTES['Land Use'][landUseIndex] : PALETTES['Climate Risk'][climateRiskIndex];
               
               return {
                  color: 'rgba(255,255,255,0.5)',
                  weight: 1,
                  fillColor: currentData.color,
                  fillOpacity: 0.2
               }
            }}
            onEachFeature={(feature, layer) => {
               layer.on({
                 mouseover: (e) => {
                   const tLayer = e.target;
                   tLayer.setStyle({
                     weight: 2,
                     color: '#00FFC4',
                     fillOpacity: 0.35
                   });
                   tLayer.bringToFront();
                   
                   const stateName = feature.properties.NAME_1 || feature.properties.name || 'Unknown';
                   const hash = hashString(stateName);
                   setHoveredState({
                      name: stateName,
                      data: {
                        'Land Use': PALETTES['Land Use'][hash % PALETTES['Land Use'].length],
                        'Climate Risk': PALETTES['Climate Risk'][hash % PALETTES['Climate Risk'].length],
                      }
                   });
                 },
                 mouseout: (e) => {
                   const tLayer = e.target;
                   const stateName = feature.properties.NAME_1 || feature.properties.name || 'Unknown';
                   const hash = hashString(stateName);
                   const currentData = activeLayer === 'Land Use' ? PALETTES['Land Use'][hash % PALETTES['Land Use'].length] : PALETTES['Climate Risk'][hash % PALETTES['Climate Risk'].length];
                   
                   tLayer.setStyle({
                     weight: 1,
                     color: 'rgba(255,255,255,0.5)',
                     fillColor: currentData.color,
                     fillOpacity: 0.2
                   });
                 },
                 mousemove: (e: any) => {
                   setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
                 }
               });
            }}
          />
        </MapContainer>
      </div>

      {/* MAP CONTROLS (Top Left) */}
      <div ref={layersRef} className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => setLayersOpen(!layersOpen)}
          aria-expanded={layersOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 bg-[#0F172A] border border-white/10 rounded-xl px-4 py-2.5 shadow-xl hover:bg-[#1E293B] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <Layers className="w-4 h-4 text-teal-400" />
          <span className="text-[#F8FAFC] text-xs font-black uppercase tracking-widest">Map Layers</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${layersOpen ? 'rotate-180' : ''}`} />
        </button>

        <div 
          className={`absolute top-full left-0 mt-2 w-56 bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-[12px] p-3 shadow-2xl transition-all duration-200 origin-top ${
            layersOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="space-y-1">
            {[
              { id: 'Land Use', label: 'Land Use' },
              { id: 'Climate Risk', label: 'Climate Risk' }
            ].map(layer => (
              <button 
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                  activeLayer === layer.id 
                    ? 'bg-teal-500/10 text-[#14B8A6]' 
                    : 'text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  activeLayer === layer.id ? 'bg-teal-500 border-teal-500' : 'border-[#94A3B8] bg-transparent'
                }`}>
                  {activeLayer === layer.id && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {layer.label}
              </button>
            ))}
            
            <div className="h-px bg-white/10 my-2"></div>
            
            {[
              { label: 'Land Disputes', checked: false },
              { label: 'Infrastructure', checked: false },
              { label: 'Administrative Boundaries', checked: false }
            ].map((layer, i) => (
              <div 
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-[#94A3B8] cursor-not-allowed opacity-60"
              >
                <div className="w-3.5 h-3.5 rounded border border-[#94A3B8] bg-transparent shrink-0 flex items-center justify-center">
                  {layer.checked && (
                    <svg className="w-2.5 h-2.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {layer.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAP LEGEND (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 bg-[#1E293B]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl pointer-events-none">
        <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-3">{activeLayer}</h4>
        <div className="space-y-2">
          {PALETTES[activeLayer].map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-[11px] font-bold text-slate-300">{item.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING CALLOUTS (Static Absolute positioned) */}
      <div className="absolute top-[12%] right-[4%] lg:right-[6%] z-20 pointer-events-none hidden md:block">
        <div className="bg-[#1E293B]/90 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2.5 shadow-lg relative">
          <div className="absolute -left-14 top-1/2 w-14 h-px bg-slate-500/50 -z-10"></div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Forest Cover</div>
          <div className="text-base font-black text-emerald-400 leading-none">21.3%</div>
        </div>
      </div>

      <div className="absolute top-[30%] left-[4%] lg:left-[6%] z-20 pointer-events-none hidden md:block">
        <div className="bg-[#1E293B]/90 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2.5 shadow-lg relative">
          <div className="absolute -right-20 top-1/2 w-20 h-px bg-slate-500/50 -z-10"></div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Climate Risk</div>
          <div className="text-base font-black text-amber-400 leading-none">High</div>
        </div>
      </div>
      
      <div className="absolute bottom-[22%] right-[4%] lg:right-[6%] z-20 pointer-events-none hidden md:block">
        <div className="bg-[#1E293B]/90 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2.5 shadow-lg relative">
          <div className="absolute -left-20 top-1/2 w-20 h-px bg-slate-500/50 -z-10"></div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Urban Expansion</div>
          <div className="text-base font-black text-blue-400 leading-none">+2.8%</div>
        </div>
      </div>

      {/* HOVER TOOLTIP */}
      {hoveredState && (
        <div 
          className="fixed z-[9999] pointer-events-none bg-[#0F172A]/95 backdrop-blur-xl border border-teal-500/30 rounded-xl p-4 shadow-2xl w-56 transform -translate-x-1/2 -translate-y-[120%] transition-opacity duration-200"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-0.5">State Region</div>
          <h3 className="text-sm font-black text-white leading-tight mb-3">
            {hoveredState.name}
          </h3>
          
          <div className="space-y-2 bg-white/5 rounded-lg p-2.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Land Use</span>
              <span className="text-[10px] font-black" style={{ color: hoveredState.data['Land Use'].color }}>
                {hoveredState.data['Land Use'].type}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Climate Risk</span>
              <span className="text-[10px] font-black" style={{ color: hoveredState.data['Climate Risk'].color }}>
                {hoveredState.data['Climate Risk'].type}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
