import {
    Group,
    Mesh,
    PlaneGeometry,
    MeshPhongMaterial,
    Vector3,
} from 'three';
import { Sky } from 'objects';
import p5 from 'p5';

/**
 * Terrain is made of many threejs planes joined together and Sky objects that
 * contain objects in the sky. Each plane is made of many mesh primitives.
 * Perlin noise is used to set height of each vertex in mesh to simulate a rough
 * terrain-like surface.
 * As the passed in object moves, more terrain is generated procedurally to
 * simulate the illusion of an infinite terrain.
 */
class Terrain extends Group {
    /**
     * Initialize minimum size terrain around object's position
     * @param {*} object
     * @param {Game} game: optional parameter to allow functionality to handle
     * collision with terrain in context of game
     */
    constructor(object, game) {
        // Call parent Group() constructor
        super();
        this.name = 'terrain';
        this.object = object;
        this.game = game;
        this.planes = {}; // string(planeCoordinates) -> {coords, geometry}
        this.skies = {}; // string(planeCoordinates) -> {coords, Sky}

        // magic numbers
        this.UNIT_WIDTH = 1000; // width of single mesh segment
        this.UNIT_HEIGHT = 1000; // height of single mesh segment
        this.PLANE_WIDTH = 50; // # mesh segments in width of unit plane
        this.PLANE_HEIGHT = 50; // # mesh segments in height of unit plane
        this.TERRAIN_MIN_WIDTH = 1; // # planes left/right of current position
        this.TERRAIN_MIN_HEIGHT = 1; // # planes front/behind current position
        this.TERRAIN_MAX_WIDTH = 2; // # planes beyond which are disposed
        this.TERRAIN_MAX_HEIGHT = 2; // # planes beyond which are disposed
        this.TERRAIN_MAX_Z = 5000;
        this.ROUGHNESS = 0.0005;
        this.MESH_COLOR = 0x228b22; // forest green
        this.init();
    }

    init() {
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
                this.addPlane(currentPlane[0] + i, currentPlane[1] + j);
                this.addSky(currentPlane[0] + i, currentPlane[1] + j);
            }
        }
    }

    reset() {
        Object.entries(this.planes).forEach((v) => v[1].geometry.dispose());
        Object.entries(this.skies).forEach((v) => v[1].sky.dispose());
        this.init();
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
                    this.addSky(currentPlane[0] + i, currentPlane[1] + j);
                }
            }
        }
        Object.entries(this.planes).forEach((v) => {
            const coords = v[1].coords;
            const sky = this.skies[v[0]].sky;
            sky.update(timeStamp);
            if (
                coords[0] < currentPlane[0] - this.TERRAIN_MAX_WIDTH ||
                coords[0] > currentPlane[0] + this.TERRAIN_MAX_WIDTH ||
                coords[1] < currentPlane[1] - this.TERRAIN_MAX_HEIGHT ||
                coords[1] > currentPlane[1] + this.TERRAIN_MAX_HEIGHT
            ) {
                delete this.planes[v[0]];
                v[1].geometry.dispose();
                sky.dispose();
                delete this.skies[v[0]];
            }
        });
    }
    /* eslint-enable no-unused-vars */

    /**
     * Detect collision and call app.js function for handling
     * It is assumed that airplane starts flight above terrain, therefore it is
     * a collision if position is below the terrain.
     * @param {Vector3} position
     */
    handleCollision(position) {
        // find height of plane at (position.x, position.y)
        let verts = [];
        const currentPlane = this.positionToPlaneCoords(position);
        const planeX = position.x -
            currentPlane[0] * this.UNIT_WIDTH * this.PLANE_WIDTH;
        const planeY = position.y -
            currentPlane[1] * this.UNIT_HEIGHT * this.PLANE_HEIGHT;
        const vertexX = Math.floor(planeX / this.UNIT_WIDTH);
        const vertexY = Math.floor(planeY / this.UNIT_HEIGHT);
        const entry = Object.entries(this.planes).find((v) => {
            const coords = v[1].coords;
            if (
                coords[0] === currentPlane[0] &&
                coords[1] === currentPlane[1]
            ) {
                return true;
            }
            return false;
        });
        const geometry = (entry != null) && entry[1].geometry;
        if (geometry == null) {
            console.warn("Camera outside terrain range.");
            return;
        }

        entry && this.skies[entry[0]].sky.handleCollision(position);

        const bottomLeftIndex = (this.PLANE_HEIGHT - vertexY) *
            (this.PLANE_WIDTH + 1) + vertexX;
        const bottomRightIndex = (this.PLANE_HEIGHT - vertexY) *
            (this.PLANE_WIDTH + 1) + vertexX + 1;
        const topLeftIndex = (this.PLANE_HEIGHT - (vertexY + 1)) *
            (this.PLANE_WIDTH + 1) + vertexX;
        const topRightIndex = (this.PLANE_HEIGHT - (vertexY + 1)) *
            (this.PLANE_WIDTH + 1) + vertexX + 1;
        verts.push(bottomLeftIndex);
        verts.push(topRightIndex);
        if (
            planeX - vertexX * this.UNIT_WIDTH >
            planeY - vertexY * this.UNIT_HEIGHT
        ) {
            verts.push(bottomRightIndex);
        } else {
            verts.push(topLeftIndex);
        }
        verts = verts.map((index) => {
            if (index < 0 || index >= geometry.vertices.length) {
                return null;
            }
            return geometry.vertices[index];
        });
        const baryCoords = computeBarycentric(verts, position);
        if (baryCoords == null) {
            console.warn("Error in mesh position calculations.");
            return;
        }
        const planeHeight = verts.reduce(
            (total, v, i) => total + v.z * baryCoords[i]
        , 0);
        if (planeHeight >= position.z) {
            this.game && this.game.collisionHandler(1);
        }
    }

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
     * Adds Sky with coordinate (x,y)
     * @param {Number} x: x-coordinate where unit is number of planes
     * @param {Number} y: y-coordinate where unit is number of planes
     */
    addSky(x, y) {
        const translate = new Vector3(
            x * this.UNIT_WIDTH * this.PLANE_WIDTH,
            y * this.UNIT_HEIGHT * this.PLANE_HEIGHT,
            0
        );
        const sky = new Sky(
            this.game,
            translate,
            this.TERRAIN_MAX_Z,
            this.UNIT_WIDTH * this.PLANE_WIDTH,
            this.UNIT_HEIGHT * this.PLANE_HEIGHT
        );
        this.add(sky);
        this.skies[[x, y]] = {
            coords: [x, y],
            sky: sky
        };
    }

    /**
     * Adds PlaneGeometry Mesh with coordinate (x,y)
     * @param {Number} x: x-coordinate where unit is number of planes
     * @param {Number} y: y-coordinate where unit is number of planes
     */
    addPlane(x, y) {
        const translate = new Vector3(
            x * this.UNIT_WIDTH * this.PLANE_WIDTH + this.UNIT_WIDTH *
            this.PLANE_WIDTH / 2,
            y * this.UNIT_HEIGHT * this.PLANE_HEIGHT + this.UNIT_HEIGHT *
            this.PLANE_HEIGHT / 2,
            0
        );
        const geometry = new PlaneGeometry(
            this.UNIT_WIDTH * this.PLANE_WIDTH,
            this.UNIT_HEIGHT * this.PLANE_HEIGHT,
            this.PLANE_WIDTH,
            this.PLANE_HEIGHT
        );
        geometry.vertices.forEach((v) => {
            v.add(translate);
            v.z = p5.prototype.noise(
                v.x * this.ROUGHNESS, v.y * this.ROUGHNESS
            ) * this.TERRAIN_MAX_Z;
        });
        // TODO: use more terrain like material
        const material = new MeshPhongMaterial({
            color: this.MESH_COLOR,
            flatShading: true
        });
        const p = new Mesh(geometry, material);
        this.add(p);
        this.planes[[x, y]] = {
            coords: [x, y],
            geometry: geometry
        };
    }
}

/**
 * Returns the output of the edge function of edge v0v1 with respect to
 * point p. Description of edge function can be found on
 * https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspiracy/
 * @param {Vector3} p
 * @param {Vector3} v0
 * @param {Vector3} v1
 */
function edgeFunction(p, v0, v1) {
    return (v0.y - v1.y) * p.x +
        (v1.x - v0.x) * p.y +
        (v0.x * v1.y - v0.y * v1.x);
}

/**
 * Returns barycentric coordinates of p where triangle is defined by
 * vertices in verts. Returns null if verts contains null value or if p outside
 * triangle.
 * (see https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspiracy/)
 * @param {array} verts
 * @param {Vector3} p
 * @param {array} barycentricCoords
 */
function computeBarycentric(verts, p) {
    let triCoords = [];
    const v0 = verts[0];
    let v1 = verts[1];
    let v2 = verts[2];
    if (v0 == null || v1 == null || v2 == null) {
        return null;
    }

    // check that 0-1-2 is counter-clockwise. If not swap v1 and v2
    const det = (v1.x - v0.x) * (v2.y - v0.y) - (v2.x - v0.x) * (v1.y - v0.y);
    if (det < 0.0) {
        const t = v1;
        v1 = v2;
        v2 = t;
    }
    const f01 = edgeFunction(p, v0, v1);
    const f12 = edgeFunction(p, v1, v2);
    const f20 = edgeFunction(p, v2, v0);
    if (f01 < 0.0 || f12 < 0.0 || f20 < 0.0) {
        return undefined;
    }
    const sum = f01 + f12 + f20;
    triCoords[0] = f12;
    triCoords[1] = (det < 0.0) ? f01 : f20;
    triCoords[2] = (det < 0.0) ? f20 : f01;
    triCoords = triCoords.map((c) => c / sum);
    return triCoords;
}

export default Terrain;
