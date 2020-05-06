import { Scene, Color, DirectionalLight } from 'three';
import { Terrain } from 'objects';

class SeedScene extends Scene {
    constructor(camera) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.updateList = [];
        this.collidableList = [];

        // Set background to a sky blue
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const light = new DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 1);
        const terrain = new Terrain(camera);
        this.add(light);
        this.add(terrain);
        this.addToUpdateList(terrain);
        this.addToCollidableList(terrain);
    }

    addToUpdateList(object) {
        this.updateList.push(object);
    }

    addToCollidableList(object) {
        this.collidableList.push(object);
    }

    update(timeStamp) {
        // Call update for each object in the updateList
        for (const obj of this.updateList) {
            obj.update(timeStamp);
        }
    }

    /**
     * Appropriately handle collisions with every object in this scene
     * @param {Vector3} position
     */
    handleCollision(position) {
        for (const obj of this.collidableList) {
            obj.handleCollision && obj.handleCollision(position);
        }
    }
}

export default SeedScene;
