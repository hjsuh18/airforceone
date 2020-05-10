import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Burger.gltf';
import { ResourceTracker } from 'helpers';

/**
 * Imports and loads mesh of burger, using downloaded .gltf files.
 * Acknowledgements: Burger.{gltf, bin}
 *  Name: Hamburger
 *  Author: Poly by Google
 *  Source: https://poly.google.com/view/fNdEHvI86Hu
 *  License: CC-BY
 */
class Burger extends Group {
    constructor(position) {
        super();
        const SCALE = 100;
        this.COLLISION_RANGE = 2000;
        this.name = 'burger';

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
            this.rotateX(Math.PI / 2);
        });
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {}
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

export default Burger;
