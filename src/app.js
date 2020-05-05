/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { AFOControls } from 'controls';
import { SeedScene } from 'scenes';

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
const scene = new SeedScene(camera);
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
const CAMERA_HEIGHT = 600;
const CAMERA_FAR = 4000;
camera.position.set(0, 0, CAMERA_HEIGHT);
camera.far = CAMERA_FAR;
camera.lookAt(new Vector3(1, 0, CAMERA_HEIGHT));
camera.rotateOnAxis(new Vector3(0, 0, -1), Math.PI / 2);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new AFOControls(camera, canvas);
const delta = 1; // TODO: MAGIC NUMBER TO BE FIXED
controls.update(delta);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update(delta);
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
