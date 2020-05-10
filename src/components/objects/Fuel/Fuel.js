import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Fuel.gltf';
import { ResourceTracker } from 'helpers';

/**
 * Imports and loads mesh of airplane, using downloaded .gltf files.
 * Acknowledgements: Fuel.{gltf, bin}
 *  Name: Gas Can
 *  Author: Justin Randall
 *  Source: https://poly.google.com/view/fmGMxckMykj
 *  License: CC-BY
 */
class Fuel extends Group {
    constructor(position) {
        super();
        const SCALE = 2000;
        this.COLLISION_RANGE = 4000;
        this.name = 'fuel';

        // ResourceTracker code taken from
        // https://github.com/gfxfundamentals/threejsfundamentals/blob/master/
        // threejs/threejs-cleanup-loaded-files.html
        this.resMgr = new ResourceTracker();
        const track = this.resMgr.track.bind(this.resMgr);
        const loader = new GLTFLoader();
        loader.setResourcePath('assets/');
        loader.load(MODEL, (gltf) => {
            const root = track(gltf.scene);
            this.add(root);
            this.position.copy(position);
            this.scale.multiplyScalar(SCALE);
        });
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {
        this.rotateOnAxis(new Vector3(0, 0, 1), 0.1);
    }
    /* eslint-enable no-unused-vars */

    dispose() {
        this.resMgr.dispose();
    }

    /**
     * Returns true if position is within collision range of this
     * @param {Vector3} position
     */
    handleCollision(position) {
        const distance = position.distanceTo(this.position);
        if (distance < this.COLLISION_RANGE) {
            this.dispose();
            return true;
        }
        return false;
    }
}

export default Fuel;
