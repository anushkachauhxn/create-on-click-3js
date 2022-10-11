import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 6, 6);
orbit.update();

// Helpers
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

// Lights
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);

// Main [https://stackoverflow.com/a/47695749/12302691]
const mouse = new THREE.Vector2(); // normalised position of cursor
const intersectionPoint = new THREE.Vector3(); // co-ordinates of point where plane intersects with the ray
const planeNormal = new THREE.Vector3(); // unit normal vector that indicates the direction of the plane
const plane = new THREE.Plane(); // plane to be created whenever cursor changes position
const raycaster = new THREE.Raycaster(); // emits the ray between camera and cursor

window.addEventListener("mousemove", (e) => {
  // update 'mouse' to normalised co-ordinates of cursor
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // update planeNormal with co-ordinates of unit normal vector
  planeNormal.copy(camera.position).normalize();

  // create the plane
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position); // scene.position is same as 'new THREE.Vector3(0, 0, 0)'

  // create the ray
  raycaster.setFromCamera(mouse, camera);

  // call intersect method and store it in 'intersectionPoint'
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

window.addEventListener("click", () => {
  // create the sphere and position it at intersection
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    metalness: 0,
    roughness: 0,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  sphereMesh.position.copy(intersectionPoint);
});

// Animations
function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Responsive Window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix;
  renderer.setSize(window.innerWidth, window.innerHeight);
});
