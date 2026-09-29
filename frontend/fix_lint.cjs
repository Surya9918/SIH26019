const fs = require('fs');

let p1 = fs.readFileSync('src/components/India3DMap.tsx', 'utf8');
p1 = p1.replace('import { useState, useMemo, useRef } from \'react\';', 'import { useState, useMemo } from \'react\';');
p1 = p1.replace('import { Canvas, useFrame } from \'@react-three/fiber\';', 'import { Canvas } from \'@react-three/fiber\';');
p1 = p1.replace('import { OrbitControls, ContactShadows, Html, Stars } from \'@react-three/drei\';', 'import { OrbitControls, ContactShadows, Stars } from \'@react-three/drei\';');
fs.writeFileSync('src/components/India3DMap.tsx', p1);

let p2 = fs.readFileSync('src/pages/InnovationPortal.tsx', 'utf8');
p2 = p2.replace(/import { fetchApi } from '\.\.\/services\/api';\r?\n/, '');
fs.writeFileSync('src/pages/InnovationPortal.tsx', p2);

let p3 = fs.readFileSync('src/pages/PolicyLab.tsx', 'utf8');
p3 = p3.replace(/import clsx from 'clsx';\r?\n/, '');
fs.writeFileSync('src/pages/PolicyLab.tsx', p3);

let p4 = fs.readFileSync('src/pages/Workspaces.tsx', 'utf8');
p4 = p4.replace(/import { fetchApi } from '\.\.\/services\/api';\r?\n/, '');
fs.writeFileSync('src/pages/Workspaces.tsx', p4);
