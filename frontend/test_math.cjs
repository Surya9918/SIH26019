const THREE = require('three');
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
camera.position.set(0, -12, 28);
camera.lookAt(0, 0, 0);

console.log("Initial camera pos:", camera.position);
// OrbitControls with maxPolarAngle = PI/2 will clamp this.
const polarAngle = Math.acos(camera.position.y / camera.position.length());
console.log("Polar angle (degrees):", polarAngle * 180 / Math.PI);
