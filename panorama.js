import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";

const canvas = document.getElementById("panorama-canvas");
const loadState = document.getElementById("load-state");
const zoomInButton = document.getElementById("zoom-in-btn");
const zoomOutButton = document.getElementById("zoom-out-btn");
const resetViewButton = document.getElementById("reset-view-btn");
const autoRotateButton = document.getElementById("auto-rotate-btn");
const fullscreenButton = document.getElementById("fullscreen-btn");

const INITIAL_VIEW = {
  lon: -18,
  lat: -2,
  fov: 72,
};

const view = {
  lon: INITIAL_VIEW.lon,
  lat: INITIAL_VIEW.lat,
  fov: INITIAL_VIEW.fov,
  targetLon: INITIAL_VIEW.lon,
  targetLat: INITIAL_VIEW.lat,
  autoRotate: true,
  dragging: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  startLon: 0,
  startLat: 0,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(view.fov, 1, 0.1, 1100);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const sphereGeometry = new THREE.SphereGeometry(500, 160, 80);
sphereGeometry.scale(-1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x202225 });
const panoramaSphere = new THREE.Mesh(sphereGeometry, material);
scene.add(panoramaSphere);

const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  "./assets/olab-360-panorama-ultra.png",
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    material.map = texture;
    material.color.set(0xffffff);
    material.needsUpdate = true;
    loadState.classList.add("is-hidden");
  },
  undefined,
  () => {
    loadState.classList.add("is-hidden");
    document.body.classList.add("texture-error");
  },
);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function setFov(nextFov) {
  view.fov = clamp(nextFov, 34, 96);
  camera.fov = view.fov;
  camera.updateProjectionMatrix();
}

function setAutoRotate(enabled) {
  view.autoRotate = enabled;
  autoRotateButton.classList.toggle("is-active", enabled);
  autoRotateButton.setAttribute("aria-pressed", enabled ? "true" : "false");
}

function resetView() {
  view.targetLon = INITIAL_VIEW.lon;
  view.targetLat = INITIAL_VIEW.lat;
  view.lon = INITIAL_VIEW.lon;
  view.lat = INITIAL_VIEW.lat;
  setFov(INITIAL_VIEW.fov);
}

function updateCamera(delta) {
  if (view.autoRotate && !view.dragging) {
    view.targetLon += delta * 1.85;
  }

  view.lon += (view.targetLon - view.lon) * 0.18;
  view.lat += (view.targetLat - view.lat) * 0.18;
  view.lat = clamp(view.lat, -84, 84);

  const phi = THREE.MathUtils.degToRad(90 - view.lat);
  const theta = THREE.MathUtils.degToRad(view.lon);
  const lookAt = new THREE.Vector3(
    500 * Math.sin(phi) * Math.cos(theta),
    500 * Math.cos(phi),
    500 * Math.sin(phi) * Math.sin(theta),
  );

  camera.lookAt(lookAt);
}

function onPointerDown(event) {
  view.dragging = true;
  view.pointerId = event.pointerId;
  view.startX = event.clientX;
  view.startY = event.clientY;
  view.startLon = view.targetLon;
  view.startLat = view.targetLat;
  canvas.classList.add("is-dragging");
  canvas.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (!view.dragging || event.pointerId !== view.pointerId) return;
  const dx = event.clientX - view.startX;
  const dy = event.clientY - view.startY;
  view.targetLon = view.startLon - dx * 0.12;
  view.targetLat = clamp(view.startLat + dy * 0.095, -84, 84);
}

function endPointer(event) {
  if (event.pointerId !== view.pointerId) return;
  view.dragging = false;
  view.pointerId = null;
  canvas.classList.remove("is-dragging");
}

function onWheel(event) {
  event.preventDefault();
  setFov(view.fov + Math.sign(event.deltaY) * 4);
}

let lastTime = performance.now();
function render(time) {
  const delta = Math.min(0.06, (time - lastTime) / 1000);
  lastTime = time;
  updateCamera(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", endPointer);
canvas.addEventListener("wheel", onWheel, { passive: false });

zoomInButton.addEventListener("click", () => setFov(view.fov - 7));
zoomOutButton.addEventListener("click", () => setFov(view.fov + 7));
resetViewButton.addEventListener("click", resetView);
autoRotateButton.addEventListener("click", () => setAutoRotate(!view.autoRotate));
fullscreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") view.targetLon -= 7;
  if (event.key === "ArrowRight") view.targetLon += 7;
  if (event.key === "ArrowUp") view.targetLat = clamp(view.targetLat + 5, -84, 84);
  if (event.key === "ArrowDown") view.targetLat = clamp(view.targetLat - 5, -84, 84);
  if (event.key === "+" || event.key === "=") setFov(view.fov - 5);
  if (event.key === "-" || event.key === "_") setFov(view.fov + 5);
  if (event.key.toLowerCase() === "r") resetView();
});

resize();
requestAnimationFrame(render);
