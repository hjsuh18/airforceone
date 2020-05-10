import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Fuel.gltf';
import { ResourceTracker } from 'helpers';

/**
 * Imports and loads mesh of airplane, using downloaded .obj and .mtl files.
 * Acknowledgements: Airplane.{gltf, bin}, Airplane Texture.jpg
 *  Name: Airplane
 *  Author: Poly By Google
 *  Source: https://poly.google.com/view/8ciDd9k8wha
 *  License: CC-BY
 */
class Fuel extends Group {
    constructor(position) {
        super();
        const scale = 1000;

        // ResourceTracker code taken from
        // https://github.com/gfxfundamentals/threejsfundamentals/blob/master/
        // threejs/threejs-cleanup-loaded-files.html
        this.resMgr = new ResourceTracker();
        const track = this.resMgr.track.bind(this.resMgr);
        const loader = new GLTFLoader();
        loader.setResourcePath('assets/');
        /* eslint-disable no-unused-vars */
        loader.load(MODEL, (gltf) => {
            const root = track(gltf.scene);
            this.add(root);
            this.position.copy(position);
            this.scale.multiplyScalar(scale);
        });
        /* eslint-enable no-unused-vars */
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {
        this.rotateOnAxis(new Vector3(0, 0, 1), 0.1);
    }
    /* eslint-enable no-unused-vars */

    dispose() {
        this.resMgr.dispose();
    }
}

export default Fuel;
