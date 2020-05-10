import { Fuel, Burger, Donut, Water } from 'objects';
import { Group, Vector3 } from 'three';

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
        this.items = [];
        this.translate = translate;
        this.minHeight = minHeight;
        this.width = width;
        this.height = height;
        this.createItem(Water, 5, 10, 1000);
        this.createItem(Fuel, 3, 6, 1000);
        this.createItem(Donut, 2, 5, 1000);
        this.createItem(Burger, 1, 3, 1000);
    }

    createItem(constructor, minCount, maxCount, zRange) {
        const fuelCount = minCount + Math.floor(
            Math.random() * (maxCount - maxCount)
        );
        for (let i = 0; i < fuelCount; i++) {
            const pos = this.translate.clone();
            const offset = new Vector3(
                Math.floor(Math.random() * this.width),
                Math.floor(Math.random() * this.height),
                Math.floor(Math.random() * zRange) + this.minHeight
            );
            pos.add(offset);
            const f = new constructor(pos);
            this.items.push(f);
            this.add(f);
        }
    }

    /* eslint-disable no-unused-vars */
    update(timeStamp) {
        this.items.forEach((i) => i.update(timeStamp));
    }
    /* eslint-enable no-unused-vars */

    /**
     * Detect collision and call Game.js function for handling
     * @param {Vector3} position
     */
    handleCollision(position) {
        this.items.forEach((i) => {
            if (i.handleCollision(position)) {
                let id = 0;
                switch (i.name) {
                    case 'fuel':
                        id = 0;
                        break;
                    case 'water':
                        id = 2;
                        break;
                    case 'donut':
                        id = 3;
                        break;
                    case 'burger':
                        id = 4;
                        break;
                }
                this.game && this.game.collisionHandler(id);
            }
        });
        this.items = this.items.filter((i) => !i.handleCollision(position));
    }

    dispose() {
        this.items.forEach((i) => i.dispose());
    }
}

export default Sky;
