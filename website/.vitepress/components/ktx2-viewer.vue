<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { NUpload, NUploadDragger, NIcon, NP, NText } from "naive-ui";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const uploaderOpacity = ref(1.0);
const currentTexture = ref<THREE.CompressedTexture | null>(null);
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let mesh: THREE.Mesh | null = null;

// Initialize Three.js scene
function init() {
  if (!canvasRef.value) return;

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 2;

  window.addEventListener("resize", handleResize);
  handleResize();
}

async function handleFileUpload(options: { file: any }) {
  const file = options.file;
  if (!file) return;

  const url = URL.createObjectURL(file.file);
  await loadTexture(url);
  URL.revokeObjectURL(url);
  uploaderOpacity.value = 0.0;
}

function loadTexture(src: string) {
  if (!renderer) return;
  // Clear previous texture
  if (mesh) {
    scene?.remove(mesh);
    (mesh.material as THREE.MeshBasicMaterial).dispose();
    mesh.geometry.dispose();
    mesh = null;
  }
  if (currentTexture.value) {
    currentTexture.value.dispose();
  }

  const loader = new KTX2Loader()
    .setTranscoderPath("https://unpkg.com/three@0.172.0/examples/jsm/libs/basis/")
    .detectSupport(renderer);

  return loader.loadAsync(src).then((texture) => {
    currentTexture.value = texture;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(geometry, material);
    const baseScale = 1.6;
    const ratioX = texture.image.width > texture.image.height ? 1.0 : texture.image.width / texture.image.height;
    const ratioY = texture.image.height > texture.image.width ? 1.0 : texture.image.height / texture.image.width;
    mesh.scale.y = -1;
    mesh.scale.x = baseScale * ratioX;
    mesh.scale.y *= baseScale * ratioY;
    scene!.add(mesh);
    uploaderOpacity.value = 0.0;
    console.log(texture.image);
  });
}

function handleResize() {
  if (!canvasRef.value || !renderer || !camera) return;

  const parent = canvasRef.value.parentElement;
  if (!parent) return;

  const width = parent.clientWidth;
  const height = Math.min(width, window.innerHeight * 0.6);

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate() {
  if (!renderer || !scene || !camera) return;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
});
</script>

<template>
  <div class="viewer-container">
    <n-upload accept=".ktx2" @change="handleFileUpload" :show-file-list="false" :style="{ opacity: uploaderOpacity }">
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
              <path
                d="M11 18l1.41 1.41L15 16.83V29h2V16.83l2.59 2.58L21 18l-5-5l-5 5z"
                fill="rgb(118, 124, 130)"
              ></path>
              <path
                d="M23.5 22H23v-2h.5a4.5 4.5 0 0 0 .36-9H23l-.1-.82a7 7 0 0 0-13.88 0L9 11h-.86a4.5 4.5 0 0 0 .36 9H9v2h-.5A6.5 6.5 0 0 1 7.2 9.14a9 9 0 0 1 17.6 0A6.5 6.5 0 0 1 23.5 22z"
                fill="rgb(118, 124, 130)"
              ></path>
            </svg>
          </n-icon>
        </div>
        <n-p style="font-size: 16px"> Click or drag a KTX2 file to upload </n-p>
        <n-p depth="3" style="margin: 8px 0 0 0"> Only .ktx2 files are supported </n-p>
      </n-upload-dragger>
    </n-upload>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.n-upload-dragger {
  position: absolute;
  width: 60%;
  padding: 24px;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 40%;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px dashed var(--n-dragger-border-color);
  color: rgb(118, 124, 130);
}

.n-upload-dragger:hover {
  background: rgba(255, 255, 255, 0.12) !important;
}
</style>
