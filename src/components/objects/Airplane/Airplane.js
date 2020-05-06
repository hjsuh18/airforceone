import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './airplane-model.obj';
import MAT from './airplane-materials.mtl';
import * as Dat from 'dat.gui';

/**
 * Imports and loads mesh of airplane, using downloaded .obj and .mtl files.
 * Code taken and adapted from Kevin Finch's piazza post note @527 in Princeton
 * COS 426 spring 2020 course.
 * Acknowledgements: airplane-model.obj, airplane-materials.mtl
 *  Name: Boeing 747
 *  Author: Miha Lunar
 *  Source: https://poly.google.com/view/49CLof4tP2V
 *  License: CC-BY
 */
class Airplane extends Group {
    constructor(camera) {
        super();
        this.camera = camera;

        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        this.name = 'airplane';
        mtlLoader.setResourcePath('src/components/objects/Airplane/');
        mtlLoader.load(MAT, (material) => {
          material.preload();
          loader.setMaterials(material).load(MODEL, (obj) => {
            this.add(obj);
          });
        });
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {
        this.position.copy(this.camera.position);
        this.quaternion.copy(this.camera.quaternion);
        this.translateZ(-1);
    }
    /* eslint-enable no-unused-vars */
}

export default Airplane;
