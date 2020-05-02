import {
    Group,
    Mesh,
    PlaneGeometry,
    MeshBasicMaterial,
    Vector3,
} from 'three';

class Terrain extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'terrain';
        this.addPlane(0, 0);
    }

    /**
     * Adds PlaneGeometry Mesh with bottom-left coordinate at (x,y)
     * @param {Number} x
     * @param {Number} y
     */
    addPlane(x, y) {
        const translate = new Vector3(x, y, 0);
        const geometry = new PlaneGeometry(5, 20, 5, 5);
        geometry.vertices.forEach((v) => v.add(translate));
        // TODO: use more terrain like material
        const material = new MeshBasicMaterial({wireframe: true});
        const p = new Mesh(geometry, material);
        this.add(p);
    }
}

export default Terrain;
