import { Scene, Color } from 'three';
import { BasicLights } from 'lights';
import { Terrain } from 'objects';

class SeedScene extends Scene {
    constructor(camera) {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
        };

        // Set background to a sky blue
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const lights = new BasicLights();
        const terrain = new Terrain(camera);
        this.add(lights);
        this.add(terrain);
        this.addToUpdateList(terrain);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
