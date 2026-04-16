import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- CONFIGURACIÓN ---
const container = document.getElementById('container-3d');
const scene = new THREE.Scene();

// IMPORTANTE: Quitamos scene.background para ver el fondo CSS
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 12);

// Renderizador con ALPHA para transparencia
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Iluminación
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

 Stats
const stats = new Stats();
document.body.appendChild(stats.domElement);

// --- CARGA DE MODELO ---
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // Decoder online más confiable
loader.setDRACOLoader(dracoLoader);

async function loadScene() {
    try {
        // Ajusta la ruta a tu archivo scene.glb
        const gltf = await loader.loadAsync('../src/models/glb/scene.glb');
        gltf.scene.position.set(0, -2, 0);
        scene.add(gltf.scene);
    } catch (error) {
        console.error("Error cargando GLB:", error);
    }
}
loadScene();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});