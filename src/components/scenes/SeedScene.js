import { Vector3, Scene, Color, DirectionalLight, AmbientLight } from 'three';
import { Terrain, Airplane } from 'objects';

class SeedScene extends Scene {
    /**
     * Scene with infinite terrain and airplane
     * @param {Camera} camera
     * @param {Game} game: optional parameter to allow functionality to make
     * game wait until scene is fully loaded
     */
    constructor(camera, game) {
        // Call parent Scene() constructor
        super();
        this.camera = camera;

        // Init state
        this.updateList = [];
        this.collidableList = [];

        // Set background to a sky blue
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const light = new DirectionalLight(0xffffff, 0.6);
        light.position.set(0, 0, 1);
        this.add(light);
        const ambientLight = new AmbientLight(0xffffff, 0.4);
        this.add(ambientLight);

        // offset location of object we are following with camera
        this.cameraPositionOffset = new Vector3(0, -3, -15);
        this.terrain = new Terrain(camera, game);
        this.airplane = new Airplane(camera, this.cameraPositionOffset, game);
        this.add(this.terrain);
        this.add(this.airplane);
        this.addToUpdateList(this.terrain);
        this.addToUpdateList(this.airplane);
        this.addToCollidableList(this.terrain);
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

    reset() {
        this.terrain.reset();
    }

    /**
     * Appropriately handle collisions with every object in this scene
     * @param {Vector3} position
     */
    handleCollision(position) {
        const airplanePos = position.clone().add(this.cameraPositionOffset);
        airplanePos.add(new Vector3(0, 0, -10)); // collision buffer
        for (const obj of this.collidableList) {
            obj.handleCollision && obj.handleCollision(airplanePos);
        }
    }
}

export default SeedScene;
