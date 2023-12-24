import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { gsap } from "gsap";

/**
 * Debug
 */
const gui = new GUI({
  width: 300,
  title: "Nice debug UI",
  closeFolders: true,
});

// Hiding the GUI
window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
});

// Create an object so we can store variables
const debugObject = {};
debugObject.color = "#3a6ea6";
// Create a folder for lil-gui
const cubeTweaks = gui.addFolder("Awesome cube");
cubeTweaks.close(); // Close by default

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Create a BoxGeometry
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: "#9c7fe3",
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
cubeTweaks.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
cubeTweaks.add(mesh, "visible");
cubeTweaks.add(material, "wireframe");
cubeTweaks.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});
debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
};
cubeTweaks.add(debugObject, "spin");
debugObject.subdivision = 2;
cubeTweaks
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

mesh.position.x = 0;
mesh.position.y = 0;
mesh.position.z = 0;
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;
scene.add(mesh);

// Sizes
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

// Fullscreen
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

camera.position.set(0, 5, 0);
controls.enableDamping = true;
controls.update();

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  controls.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
