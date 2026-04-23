import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'lil-gui';

/* CONTROLS */
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

// --- PERSISTENCIA Y AUDIO ---
const savedVolume = localStorage.getItem('cg_volume') ?? '80';
const savedSong = localStorage.getItem('cg_song') ?? '../src/sounds/intro.mp3';

const audio = document.getElementById('myAudio2');
if (audio) {
    audio.src = savedSong;
    audio.volume = Number(savedVolume) / 100;
    const playAudio = () => {
        audio.play().catch(() => console.log("Esperando interacción..."));
        document.removeEventListener('click', playAudio);
    };
    document.addEventListener('click', playAudio);
}

const timer = new THREE.Timer();
timer.connect(document);

// --- ESCENA Y CÁMARA ---
const scene = new THREE.Scene();
// No ponemos scene.background para permitir la transparencia del CSS
scene.fog = new THREE.Fog(0x111111, 1, 15);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -1, 8);

// --- RENDERER (Configurado para transparencia) ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // Opacidad 0
renderer.setAnimationLoop(animate);

// Inyectar en el div de tu HTML
const container = document.getElementById('container-3d');
if (container) {
    container.appendChild(renderer.domElement);
} else {
    document.body.appendChild(renderer.domElement);
}

// --- STATS ---
const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px'; 
stats.domElement.style.top = 'auto'; 
document.body.appendChild(stats.domElement);

// --- CONTROLES ---
const description = {
    Orbit: 'Rotación alrededor de un objetivo. Ideal para modelos.',
    Fly: 'Simulación de vuelo.',
    FirstPerson: 'Movimiento de personaje.',
    PointerLock: 'Control total con mouse bloqueado.',
    Trackball: 'Exploración orgánica.',
    Transform: 'Manipulación de objetos (mover/rotar).'
};

const controlMap = {
    Orbit: new OrbitControls(camera, renderer.domElement),
    Fly: new FlyControls(camera, renderer.domElement),
    FirstPerson: new FirstPersonControls(camera, renderer.domElement),
    PointerLock: new PointerLockControls(camera, document.body),
    Trackball: new TrackballControls(camera, renderer.domElement),
    Transform: new TransformControls(camera, renderer.domElement)
};

// Configuración inicial
controlMap.Fly.movementSpeed = 5;
controlMap.FirstPerson.movementSpeed = 5;

let activeControl = controlMap.Orbit;

function setControls(key) {
    const titleElement = document.getElementById('control-title');
    const descElement = document.getElementById('control-desc');
    
    if(titleElement) titleElement.textContent = `${key} Controls`;
    if(descElement) descElement.textContent = description[key] || '...';
    
    // Aquí podrías añadir lógica para desactivar los otros controles si fuera necesario
    activeControl = controlMap[key];
}

// --- GUI E ILUMINACIÓN ---
const gui = new GUI();

// AÑADE ESTO PARA BAJAR EL FOLDER:
gui.domElement.style.top = '100px'; 
gui.domElement.style.right = '20px';

let currentLight = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
scene.add(currentLight);

const params = {
    lightType: 'Hemisphere',
    enabled: true,
    intensity: 1.5,
    color: '#8dc1de',
    positionX: 2,
    toggleLight: function() { currentLight.visible = !currentLight.visible; }
};

const lightFolder = gui.addFolder('Light');
lightFolder.add(params, 'lightType', ['Hemisphere', 'Directional', 'Ambient']).name('Tipo').onChange(value => {
    scene.remove(currentLight);
    if (value === 'Directional') currentLight = new THREE.DirectionalLight(params.color, params.intensity);
    else if (value === 'Ambient') currentLight = new THREE.AmbientLight(params.color, params.intensity);
    else currentLight = new THREE.HemisphereLight(params.color, 0x00668d, params.intensity);
    scene.add(currentLight);
});

lightFolder.add(params, 'intensity', 0, 5).onChange(v => currentLight.intensity = v);
lightFolder.addColor(params, 'color').name('Color Luz').onChange(v => {
    if (currentLight.color) currentLight.color.set(v);
});
lightFolder.add(params, 'toggleLight').name('OnOff');

const cameraFolder = gui.addFolder('Camera Translation');
cameraFolder.add(camera.position, 'x', -10, 10);
cameraFolder.add(camera.position, 'y', -10, 10);
cameraFolder.add(camera.position, 'z', -10, 20);

const cameraFolder3 = gui.addFolder('Camera Controls');
cameraFolder3.add({ Script: 'Orbit' }, 'Script', Object.keys(controlMap)).onChange(setControls);

// --- CARGA DEL MODELO ---
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// USA EL CDN PARA EVITAR ERRORES DE RUTA LOCAL
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

async function loadModel() {
    try {
        const gltf = await loader.loadAsync('../src/models/glb/scene.glb');
        gltf.scene.position.set(0, -2.5, 3.5);
        gltf.scene.rotation.y = Math.PI * 1.5;
        scene.add(gltf.scene);
        console.log("Modelo cargado");
    } catch (error) {
        console.error("Error al cargar modelo:", error);
    }
}
loadModel();

// --- LOOP Y RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    stats.update();
    if (activeControl && activeControl.update) activeControl.update(timer.getDelta());
    renderer.render(scene, camera);
}