const { geoMercator } = require('d3-geo');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/assets/india_states.json'));
const projection = geoMercator().center([82.8, 22.5]).scale(1200).translate([0, 0]);

let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;
let coordCount = 0;

data.features.forEach(f => {
  if (!f.geometry) return;
  const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  polys.forEach(poly => {
    poly[0].forEach(coord => {
      const [x, y] = projection(coord) || [0, 0];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (-y < minY) minY = -y;
      if (-y > maxY) maxY = -y;
      coordCount++;
    });
  });
});

console.log('Valid Coordinates parsed:', coordCount);
console.log(`Bounding Box: X[${minX.toFixed(2)}, ${maxX.toFixed(2)}], Y[${minY.toFixed(2)}, ${maxY.toFixed(2)}]`);
