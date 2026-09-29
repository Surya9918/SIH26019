import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { geoMercator } from 'd3-geo';
import indiaGeoJson from '../assets/india_states.json';

// Project coordinates using d3-geo with a 3D-appropriate scale
const projection = geoMercator().center([82.8, 22.5]).scale(25).translate([0, 0]);

function createShape(polygon: number[][]) {
  const shape = new THREE.Shape();
  polygon.forEach((coord, i) => {
    const [x, y] = projection(coord as [number, number]) || [0, 0];
    if (i === 0) {
      shape.moveTo(x, -y);
    } else {
      shape.lineTo(x, -y);
    }
  });
  return shape;
}

const PALETTE = ['#059669', '#10B981', '#047857', '#0EA5E9', '#0369A1', '#008B72', '#0284C7', '#F59E0B'];

function StateMesh({ feature, index, isHovered, onHover }: any) {
  const [localHover, setLocalHover] = useState(false);
  
  const shapes = useMemo(() => {
    const geom = feature.geometry;
    if (!geom) return [];
    const polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
    const allShapes: THREE.Shape[] = [];
    polys.forEach((poly: any) => {
      const outer = createShape(poly[0]);
      for (let i = 1; i < poly.length; i++) {
        outer.holes.push(createShape(poly[i]));
      }
      allShapes.push(outer);
    });
    return allShapes;
  }, [feature]);

  // Pseudo-random but stable variations based on index
  const baseColor = PALETTE[index % PALETTE.length];
  const baseDepth = 0.4 + (index % 5) * 0.15; // Varying terrain height
  
  const activeHover = isHovered || localHover;

  const extrudeSettings = {
    depth: activeHover ? baseDepth + 1.2 : baseDepth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSteps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  };
  
  return (
    <group 
      onPointerOver={(e) => { e.stopPropagation(); setLocalHover(true); onHover(feature); }}
      onPointerOut={(e) => { e.stopPropagation(); setLocalHover(false); onHover(null); }}
      position-z={activeHover ? 0.3 : 0}
    >
      {shapes.map((shape, i) => (
        <mesh key={i}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial 
            color={activeHover ? '#00FFC4' : baseColor}
            roughness={0.7}
            metalness={0.2}
            emissive={activeHover ? '#00FFC4' : baseColor}
            emissiveIntensity={activeHover ? 0.5 : 0.1}
          />
          {/* Base Layer for depth effect */}
          <mesh position-z={-0.1}>
            <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.2, bevelEnabled: false }]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

// Helper to place floating HTML callouts at geo coordinates


export function India3DMap() {
  const [hoveredState, setHoveredState] = useState<any>(null);
  const geoData = indiaGeoJson;

  return (
    <div className="w-full h-full relative cursor-pointer overflow-hidden">
      <Canvas camera={{ position: [0, 18, 28], fov: 40 }}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 25, 45]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 10, 5]} intensity={0.8} color="#0EA5E9" />
        <spotLight position={[0, 20, 0]} angle={0.6} penumbra={1} intensity={1} color="#00FFC4" />
        
        <Stars radius={50} depth={20} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          {geoData && geoData.features.map((feature: any, i: number) => (
            <StateMesh 
              key={i} 
              index={i}
              feature={feature} 
              isHovered={hoveredState === feature}
              onHover={setHoveredState}
            />
          ))}
          
          <ContactShadows position={[0, 0, -0.5]} opacity={0.6} scale={40} blur={2.5} far={15} color="#000000" />
        </group>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      </Canvas>
      
      {/* Dynamic Hover Tooltip Overlay */}
      {hoveredState && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none transition-all duration-300">
          <div className="bg-[#0F172A]/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-teal-500/30 w-72 transform -translate-y-16 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">State Region</div>
                <h3 className="text-lg font-black text-white leading-tight">
                  {hoveredState.properties.NAME_1 || hoveredState.properties.name}
                </h3>
              </div>
            </div>
            
            <div className="space-y-3 bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Land Intelligence</span>
                <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Climate Risk</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
