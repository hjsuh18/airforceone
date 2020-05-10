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

        this.points = 0;
        this.fuel = 100;
        this.decrement = 2;
        this.fuelIntervalId = null; // set when game starts

        setInterval(() => {
            $('.score').text('Score: ' + this.points);
        }, 100);

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

            this.bindSpace();
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
        $('.container-score').css('opacity', 1.0);

        let threshold = 1000;
        this.fuelIntervalId = setInterval(() => {
            if (this.fuel <= 0) {
                this.endGame("You ran out of fuel!");
            }
            $('.fuel-bar').val(this.fuel);
            this.fuel -= this.decrement;
            if (this.score >= threshold) {
                this.decrement++;
                threshold *= 10;
            }
        }, 1000);
    }

    collisionHandler(id) {
        let message = 'You crashed';
        switch (id) {
            case 0: // fuel
                this.fuel = Math.min(100, this.fuel + 10);
                return;
            case 1: // terrain
                message = message + ' into the ground!';
                break;
            case 2: // water
                this.points += 100;
                return;
            case 3: // donut
                this.points += 500;
                return;
            case 4: // burger
                this.points *= 2;
                return;
        }
        this.endGame(message);
    }

    endGame(message) {
        this.canvas.style.display = 'none';
        $('.container-end').css('opacity', 1.0);
        $('.container-score').css('opacity', 0.0);
        $('.game-over-message').text(message);
        $('.game-over-points').text('Points: ' + this.points);
        this.reset();
    }

    reset() {
        this.points = 0;
        this.fuel = 100;
        clearInterval(this.fuelIntervalId);
        this.decrement = 2;
        this.scene.reset();
        this.initCamera();
        this.controls = new AFOControls(this.camera, this.canvas);
    }
}
