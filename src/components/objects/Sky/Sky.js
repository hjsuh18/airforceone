import { Group, Vector3 } from 'three';
import { Fuel } from 'objects';

/**
 * Wrapper class for any objects in the sky. Currently this includes fuel items.
 */
class Sky extends Group {
    /**
     * Create randomly positioned objects within
     * @param {Game} game optional parameter to allow calling collision handler
     * @param {Vector3} translate 'bottom-left' corner of sky
     * @param {Number} minHeight minimum z-coordinate of all objects
     * @param {Number} width x-coordinate range from translate
     * @param {Number} height y-coordinate range from translate
     */
    constructor(game, translate, minHeight, width, height) {
        super();
        this.game = game;
        this.fuel = [];
        this.translate = translate;

        const MIN_FUEL_COUNT = 10;
        const MAX_FUEL_COUNT = 20; // TODO: lower after testing
        const Z_RANGE = 1000;

        const fuelCount = MIN_FUEL_COUNT + Math.floor(
            Math.random() * (MAX_FUEL_COUNT - MAX_FUEL_COUNT)
        );
        for (let i = 0; i < fuelCount; i++) {
            const pos = translate.clone();
            const offset = new Vector3(
                Math.floor(Math.random() * width),
                Math.floor(Math.random() * height),
                Math.floor(Math.random() * Z_RANGE) + minHeight
            );
            pos.add(offset);
            const f = new Fuel(pos);
            this.fuel.push(f);
            this.add(f);
        }
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {
        this.fuel.forEach((f) => f.update(timeStamp));
    }
    /* eslint-enable no-unused-vars */

    /**
     * Detect collision and call Game.js function for handling
     * @param {Vector3} position
     */
    handleCollision(position) {
        this.fuel.forEach((f) => {
            if (f.handleCollision(position)) {
                this.game && this.game.collisionHandler(0);
            }
        });
        this.fuel = this.fuel.filter((f) => !f.handleCollision(position));
    }

    dispose() {
        this.fuel.forEach((f) => f.dispose());
    }
}

export default Sky;
