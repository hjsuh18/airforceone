/**
 * Game.js
 *
 * Creating a Game instance starts a new game and a rendering of the game.
 * At most one instance of Game can be created at one time.
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { AFOControls } from 'controls';
import { SeedScene } from 'scenes';
import $ from 'jQuery';
export { Game };

class Game {
    constructor() {
        // initialized and resolved in Airplane.js when airplane is fully loaded
        this.promise = null;

        this.points = 1000; // TODO: placeholder

        // Initialize core ThreeJS components
        this.camera = new PerspectiveCamera();
        this.initCamera();
        this.scene = new SeedScene(this.camera, this);
        this.renderer = new WebGLRenderer({ antialias: true });

        // Set up renderer, canvas, and minor CSS adjustments
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.canvas = this.renderer.domElement;
        this.canvas.setAttribute('class', 'canvas');
        this.canvas.style.display = 'none';

        // Set up controls
        this.controls = new AFOControls(this.camera, this.canvas);
        this.delta = 1; // TODO: MAGIC NUMBER TO BE FIXED

        this.promise && this.promise.then(() => {
            document.body.style.margin = 0; // Removes margin around page
            document.body.style.overflow = 'hidden'; // Fix scrolling
            document.body.appendChild(this.canvas);

            const onAnimationFrameHandler = (timeStamp) => {
                this.controls.update(this.delta);
                this.scene.handleCollision(this.camera.position);
                this.scene.update && this.scene.update(timeStamp);
                this.renderer.render(this.scene, this.camera);
                window.requestAnimationFrame(onAnimationFrameHandler);
            };
            window.requestAnimationFrame(onAnimationFrameHandler);

            // Resize Handler
            this.windowResizeHandler = () => {
                const { innerHeight, innerWidth } = window;
                this.renderer.setSize(innerWidth, innerHeight);
                this.camera.aspect = innerWidth / innerHeight;
                this.camera.updateProjectionMatrix();
            };
            this.windowResizeHandler();
            window.addEventListener('resize', this.windowResizeHandler, false);
        });
    }

    initCamera() {
        // Set up camera
        const CAMERA_HEIGHT = 5000;
        const CAMERA_FAR = 30000;
        this.camera.position.set(0, 0, CAMERA_HEIGHT);
        this.camera.far = CAMERA_FAR;
        this.camera.lookAt(new Vector3(1, 0, CAMERA_HEIGHT));
        this.camera.rotateOnAxis(new Vector3(0, 0, -1), Math.PI / 2);
    }

    bindSpace() {
        $(document).on('keypress', (e) => {
            if (e.which === 32) { // SPACE
                this.start();
            }
        });
    }

    start() {
        this.controls.move();
        this.canvas.style.display = 'block'; // Removes padding below canvas
        $('.container-start').css('opacity', 0.0);
        $('.container-end').css('opacity', 0.0);
    }

    collisionHandler() {
        this.canvas.style.display = 'none';
        $('.container-end').css('opacity', 1.0);
        $('.game-over-message').text('You crashed!');
        $('.game-over-points').text('Points: ' + this.points);
        this.reset();
    }

    reset() {
        this.scene.reset();
        this.initCamera();
        this.controls = new AFOControls(this.camera, this.canvas);
    }
}
