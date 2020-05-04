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
        this.object = object;
        this.planes = {}; // string(planeCoordinates) -> {coords, geometry}

        // magic numbers
        this.UNIT_WIDTH = 300; // width of single mesh segment
        this.UNIT_HEIGHT = 300; // height of single mesh segment
        this.PLANE_WIDTH = 10; // # mesh segments in width of unit plane
        this.PLANE_HEIGHT = 10; // # mesh segments in height of unit plane
        this.TERRAIN_MIN_WIDTH = 2; // # planes left/right of current position
        this.TERRAIN_MIN_HEIGHT = 2; // # planes front/behind current position
        this.TERRAIN_MAX_WIDTH = 4; // # planes beyond which are disposed
        this.TERRAIN_MAX_HEIGHT = 4; // # planes beyond which are disposed

        const currentPlane = this.positionToPlaneCoords(object.position);
        for (
            let i = - this.TERRAIN_MIN_WIDTH;
            i <= this.TERRAIN_MIN_WIDTH;
            i++
        ) {
            for (
                let j = - this.TERRAIN_MIN_HEIGHT;
                j <= this.TERRAIN_MIN_HEIGHT;
                j++
            ) {
                this.addPlane(currentPlane[0] + i, currentPlane[1] + j);
            }
        }
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {
        const currentPlane = this.positionToPlaneCoords(this.object.position);
        for (
            let i = - this.TERRAIN_MIN_WIDTH;
            i <= this.TERRAIN_MIN_WIDTH;
            i++
        ) {
            for (
                let j = - this.TERRAIN_MIN_HEIGHT;
                j <= this.TERRAIN_MIN_HEIGHT;
                j++
            ) {
                if (
                    !([currentPlane[0] + i, currentPlane[1] + j] in this.planes)
                ) {
                    this.addPlane(currentPlane[0] + i, currentPlane[1] + j);
                }
            }
        }
        Object.entries(this.planes).forEach((v) => {
            const coords = v[1].coords;
            if (
                coords[0] < currentPlane[0] - this.TERRAIN_MAX_WIDTH ||
                coords[0] > currentPlane[0] + this.TERRAIN_MAX_WIDTH ||
                coords[1] < currentPlane[1] - this.TERRAIN_MAX_HEIGHT ||
                coords[1] > currentPlane[1] + this.TERRAIN_MAX_HEIGHT
            ) {
                delete this.planes[v[0]];
                v[1].geometry.dispose();
            }
        });
    }
    /* eslint-enable no-unused-vars */

    /**
     * Converts real world coordinates to "plane-coordinates", where unit is a
     * unit plane.
     * @param {Vector3} position
     * @returns {array} array
     */
    positionToPlaneCoords(position) {
        const x = Math.floor(position.x / (this.UNIT_WIDTH * this.PLANE_WIDTH));
        const y = Math.floor(
            position.y / (this.UNIT_HEIGHT * this.PLANE_HEIGHT)
        );
        return [x, y];
    }

    /**
     * Adds PlaneGeometry Mesh with coordinate (x,y)
     * @param {Number} x: x-coordinate where unit is number of planes
     * @param {Number} y: y-coordinate where unit is number of planes
     */
    addPlane(x, y) {
        const translate = new Vector3(
            x * this.UNIT_WIDTH * this.PLANE_WIDTH,
            y * this.UNIT_HEIGHT * this.PLANE_HEIGHT,
            0
        );
        const geometry = new PlaneGeometry(
            this.UNIT_WIDTH * this.PLANE_WIDTH,
            this.UNIT_HEIGHT * this.PLANE_HEIGHT,
            this.PLANE_WIDTH,
            this.PLANE_HEIGHT
        );
        geometry.vertices.forEach((v) => v.add(translate));
        // TODO: use more terrain like material
        const material = new MeshBasicMaterial({wireframe: true});
        const p = new Mesh(geometry, material);
        this.add(p);
        this.planes[[x, y]] = {
            coords: [x, y],
            geometry: geometry
        };
    }
}

export default Terrain;
