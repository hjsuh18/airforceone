import { Group, Quaternion } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Airplane.gltf';

/**
 * Imports and loads mesh of airplane, using downloaded .obj and .mtl files.
 * Acknowledgements: Airplane.{gltf, bin}, Airplane Texture.jpg
 *  Name: Airplane
 *  Author: Poly By Google
 *  Source: https://poly.google.com/view/8ciDd9k8wha
 *  License: CC-BY
 */
class Airplane extends Group {
    /**
     * Airplane mesh that follows the camera position + cameraPositionOffset
     * @param {Camera} camera
     * @param {Vector3} cameraPositionOffset
     * @param {Game} game: optional parameter to allow functionality to make
     * game wait until plane is fully loaded
     */
    constructor(camera, cameraPositionOffset, game) {
        super();
        this.camera = camera;
        this.cameraPositionOffset = cameraPositionOffset;
        this.cameraRotateOffset = new Quaternion(0, Math.PI, 0);
        const scale = 0.01;

        const loader = new GLTFLoader();
        loader.setResourcePath('assets/');
        /* eslint-disable no-unused-vars */
        game.promise = new Promise((resolve) => {
            loader.load(MODEL, (gltf) => {
                this.add(gltf.scene);
                resolve();
            }, (request) => {});
        });
        /* eslint-enable no-unused-vars */
        this.scale.multiplyScalar(scale);
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {
        this.position.copy(this.camera.position);
        this.quaternion.copy(this.camera.quaternion);
        this.translateX(this.cameraPositionOffset.x);
        this.translateY(this.cameraPositionOffset.y);
        this.translateZ(this.cameraPositionOffset.z);
        this.rotateX(this.cameraRotateOffset.x);
        this.rotateY(this.cameraRotateOffset.y);
        this.rotateZ(this.cameraRotateOffset.z);
    }
    /* eslint-enable no-unused-vars */
}

export default Airplane;
