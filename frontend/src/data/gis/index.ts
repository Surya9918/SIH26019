export const GIS_LAYERS = [
  {
    id: 'landUse',
    name: 'Land Use / Land Cover',
    type: 'Thematic Polygons',
    description: 'Agricultural, Forest, Urban, Water, Barren classification.',
    categories: [
      { name: 'Agricultural', color: '#84CC16' },
      { name: 'Forest', color: '#22C55E' },
      { name: 'Built-up', color: '#64748B' },
      { name: 'Water', color: '#3B82F6' },
      { name: 'Barren', color: '#D6D3D1' }
    ]
  },
  {
    id: 'climateRisk',
    name: 'Climate Risk',
    type: 'Vulnerability Index',
    description: 'Flood, Drought, and Extreme Heat risk assessment.',
    categories: [
      { name: 'Low', color: '#34D399' },
      { name: 'Moderate', color: '#FBBF24' },
      { name: 'High', color: '#F87171' },
      { name: 'Very High', color: '#B91C1C' }
    ]
  },
  {
    id: 'landDisputes',
    name: 'Land Disputes',
    type: 'Hotspot Density',
    description: 'Active land governance dispute density and cases.',
    categories: [
      { name: 'Low density', color: '#FDE68A' },
      { name: 'Medium density', color: '#F59E0B' },
      { name: 'High density', color: '#DC2626' }
    ]
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    type: 'Lines & Points',
    description: 'Major roads, railways, and critical infrastructure assets.',
    categories: [
      { name: 'Roads', color: '#FACC15' },
      { name: 'Railways', color: '#000000' },
      { name: 'Assets', color: '#6366F1' }
    ]
  },
  {
    id: 'administrativeBoundaries',
    name: 'Administrative Boundaries',
    type: 'Boundaries',
    description: 'State and district administrative divisions.',
    categories: [
      { name: 'States', color: '#334155' },
      { name: 'Districts', color: '#94A3B8' }
    ]
  }
];

export const MOCK_HOTSPOTS = [
  { lat: 17.3850, lng: 78.4867, name: 'Hyderabad Metro Expansion', cases: 42, intensity: 'High density' },
  { lat: 19.0760, lng: 72.8777, name: 'Mumbai Coastal Road', cases: 86, intensity: 'High density' },
  { lat: 28.7041, lng: 77.1025, name: 'Delhi NCR Border', cases: 54, intensity: 'Medium density' },
  { lat: 13.0827, lng: 80.2707, name: 'Chennai Port Trust', cases: 21, intensity: 'Low density' },
  { lat: 22.5726, lng: 88.3639, name: 'Kolkata Wetlands', cases: 67, intensity: 'High density' },
  { lat: 12.9716, lng: 77.5946, name: 'Bengaluru Tech Corridor', cases: 38, intensity: 'Medium density' },
  { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad Riverfront', cases: 14, intensity: 'Low density' },
];

export const MOCK_INFRASTRUCTURE_LINES = [
  // Delhi to Mumbai (NH48 roughly)
  { type: 'Roads', name: 'NH 48 Expressway', coordinates: [[28.7, 77.1], [26.9, 75.8], [23.0, 72.5], [19.1, 72.9]] },
  // Delhi to Kolkata
  { type: 'Roads', name: 'NH 19', coordinates: [[28.7, 77.1], [26.8, 81.0], [25.3, 83.0], [22.6, 88.4]] },
  // Mumbai to Chennai
  { type: 'Railways', name: 'Central Railway Corridor', coordinates: [[19.1, 72.9], [18.5, 73.8], [17.4, 78.5], [13.1, 80.3]] }
];

export const MOCK_INFRASTRUCTURE_POINTS = [
  { lat: 19.0990, lng: 72.8666, name: 'CSMIA Airport', type: 'Assets' },
  { lat: 28.5562, lng: 77.1000, name: 'IGI Airport', type: 'Assets' },
  { lat: 17.2403, lng: 78.4294, name: 'RGIA Airport', type: 'Assets' },
  { lat: 13.0827, lng: 80.2707, name: 'Chennai Port', type: 'Assets' },
];

// Helper to hash string to index
export const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};
