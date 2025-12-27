import * as THREE from 'three';
import Konva from 'konva';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth / 10,
  height: window.innerHeight / 10,
});

const layer = new Konva.Layer();
stage.add(layer);

const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 10,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
  draggable: true,
});

// add cursor styling
circle.on('mouseover', function () {
  document.body.style.cursor = 'pointer';
});
circle.on('mouseout', function () {
  document.body.style.cursor = 'default';
  console.log(circle.x() / stage.width(), circle.y() / stage.height())
});

layer.add(circle);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const target = new THREE.Vector3(0, 0, 0);
controls.target.copy(target);

controls.enablePan = true;
controls.enableZoom = true;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

camera.position.set(5, 5, 5);
controls.update();

const geometry = new THREE.TorusGeometry();
const material = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

function torusPoint(R, r, u, v) {
  return new THREE.Vector3(
    (R + r * Math.cos(v)) * Math.cos(u),
    (R + r * Math.cos(v)) * Math.sin(u),
    r * Math.sin(v)
  );
}

const R = 0.1;   // torus radius
const r = 1; // tube radius



const pointGeometry = new THREE.SphereGeometry(0.05);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const point = new THREE.Mesh(pointGeometry, pointMaterial);



scene.add(point);

function animate() {
	const u = circle.x() / stage.width();
	const v = circle.y() / stage.height();
  requestAnimationFrame(animate);
  controls.update();
  const position = torusPoint(1, 0.4, u, v);
  point.position.copy(position);
  renderer.render(scene, camera);
}

animate();