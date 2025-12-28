import * as THREE from "three";
import Konva from "konva";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth / 10,
  height: window.innerHeight / 10,
});

const layer = new Konva.Layer();
stage.add(layer);

const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 10,
  fill: "red",
  stroke: "black",
  strokeWidth: 4,
  draggable: true,
});

circle.on("mouseover", function () {
  document.body.style.cursor = "pointer";
});

circle.on("mouseout", function () {
  document.body.style.cursor = "default";
});

// Add dragmove event to handle wrapping during dragging
circle.on("dragmove", function () {
  let x = circle.x();
  let y = circle.y();
  const width = stage.width();
  const height = stage.height();
  
  // Wrap horizontally
  if (x < 0) {
	// For some reason x % width doesn't work so we need to do width + x
    x = (width + x) % width;
    circle.x(x);
  } else if (x > width) {
    x %= width;
    circle.x(x);
  }
  
  // Wrap vertically
  if (y < 0) {
    y = height + y % height;
    circle.y(y);
  } else if (y > height) {
    y = (height + y) % height;
    circle.y(y);
  }
});

layer.add(circle);

// Three.JS logic

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
  u = u * 2 * Math.PI;
  v = v * 2 * Math.PI;
  return new THREE.Vector3(
    (R + r * Math.cos(v)) * Math.cos(u),
    (R + r * Math.cos(v)) * Math.sin(u),
    r * Math.sin(v)
  );
}

const pointGeometry = new THREE.SphereGeometry(0.05);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const point = new THREE.Mesh(pointGeometry, pointMaterial);

scene.add(point);

const torusRadius = 1;
const torusTubeRadius = 0.4;

function animate() {
  const u = circle.x() / stage.width();
  const v = circle.y() / stage.height();
  requestAnimationFrame(animate);
  controls.update();
  const position = torusPoint(torusRadius, torusTubeRadius, u, v);
  point.position.copy(position);
  renderer.render(scene, camera);
}

animate();