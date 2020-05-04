import {
    Group,
    Mesh,
    PlaneGeometry,
    MeshBasicMaterial,
    Vector3,
} from 'three';

/**
 * Terrain is made of many threejs planes joined together. Each plane is made of
 * many mesh primitives.
 * Perlin noise is used to set height of each vertex in mesh to simulate a rough
 * terrain-like surface.
 * As the passed in object moves, more terrain is generated procedurally to
 * simulate the illusion of an infinite terrain.
 */
class Terrain extends Group {
    constructor(object) {
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
