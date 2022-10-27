import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { Matrix3 } from "three";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/NormalMap.png");

// Debug
const gui = new dat.GUI({ closed: true });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(0.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial();
material.color = new THREE.Color(0x292929);
material.roughness = 0.258;
material.metalness = 1;
material.normalMap = normalTexture;

gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "metalness").min(0).max(1).step(0.0001);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights

const pointLight1 = new THREE.PointLight("red", 1);
pointLight1.position.set(-1.86, 1, -1.65);
pointLight1.intensity = 10;
gui
  .add(pointLight1.position, "x")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("pointLight1 X");
gui
  .add(pointLight1.position, "y")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("pointLight1 Y");
gui
  .add(pointLight1.position, "z")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("pointLight1 Z");
gui
  .add(pointLight1, "intensity")
  .min(0)
  .max(10)
  .step(0.0001)
  .name("redIntesity");

const pointLight2 = new THREE.PointLight("cyan", 2);
pointLight2.position.set(7.5, -7.6, -10);
pointLight2.intensity = 10;
gui
  .add(pointLight2.position, "x")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("pointLight2 X");
gui
  .add(pointLight2.position, "y")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("pointLight2 Y");
gui
  .add(pointLight2.position, "z")
  .min(-10)
  .max(10)
  .step(0.0001)
  .name("pointLight2 Z");
gui
  .add(pointLight2, "intensity")
  .min(0)
  .max(10)
  .step(0.0001)
  .name("blueIntesity");

scene.add(pointLight1, pointLight2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

/**
 *  Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const Mouse = {
  x: 0,
  y: 0,
};
const Target = {
  x: 0,
  y: 0,
};
const WindowHalf = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

addEventListener("mousemove", (event) => {
  Mouse.x = event.clientX - WindowHalf.x;
  Mouse.y = event.clientY - WindowHalf.y;
});

addEventListener('scroll',(event)=>{
    sphere.position.y=(window.scrollY)*0.001;
})

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  Target.x = Mouse.x * 0.001;
  Target.y = Mouse.y * 0.001;

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;
  sphere.rotation.y=0.5*(Target.x-sphere.rotation.y);
  sphere.rotation.x=0.5*(Target.y-sphere.rotation.x);
  sphere.position.z=-0.8*(Target.y-sphere.rotation.x);

  // Update Orbital Controls
  controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
