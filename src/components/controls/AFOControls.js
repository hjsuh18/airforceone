/**
 * Adapted from https://github.com/mrdoob/three.js/blob/master/examples/jsm/
 * controls/FlyControls.js
 * The original FlyControls.js provides basic controls that emulate the movement
 * of a plane, but lack a more advanced physical interpretation of flight.
 * The adaptations implement movements that take into account forces acting on
 * a large airplane (Air Force One) due to changes in thrust, pitch, roll and
 * yaw.
 * @author James Baicoianu / http://www.baicoianu.com/
 * @author Hyeong Joon Suh
 */

import {
    Quaternion,
    Vector3
} from "three";

class AFOControls {
    constructor(object, domElement) {
        this.object = object;
        if (domElement === undefined) {
            console.warn(
                `THREE.FlyControls: The second parameter "domElement" is now 
                mandatory.`
            );
            this.domElement = document;
        }
        else {
            this.domElement = domElement;
            this.domElement.setAttribute('tabindex', - 1);
        }

        // API
        this.movementSpeed = 0.0;
        this.movementSpeedMultiplier = 1.0;
        this.rollSpeed = 0.005;
        this.autoForward = true;

        // internals
        this.tmpQuaternion = new Quaternion();
        this.mouseStatus = 0;
        this.moveState = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            forward: 0,
            back: 0,
            pitchUp: 0,
            pitchDown: 0,
            yawLeft: 0,
            yawRight: 0,
            rollLeft: 0,
            rollRight: 0
        };
        this.moveVector = new Vector3(0, 0, 0);
        this.rotationVector = new Vector3(0, 0, 0);

        // event listeners
        const keydown = bind(this, this.keydown);
        const keyup = bind(this, this.keyup);
        window.addEventListener('keydown', keydown, false);
        window.addEventListener('keyup', keyup, false);

        this.domElement.addEventListener('contextmenu', contextmenu, false);

        this.updateMovementVector();
        this.updateRotationVector();
    }

    move() {
        this.movementSpeed = 150.0;
    }

    keydown(event) {
        if (event.altKey) {
            return;
        }
        //event.preventDefault();

        switch (event.keyCode) {
            case 16: /* shift */ this.movementSpeedMultiplier = 1.5; break;

            // case 87: /*W*/ this.moveState.forward = 1; break;
            // case 83: /*S*/ this.moveState.back = 1; break;

            // case 65: /*A*/ this.moveState.left = 1; break;
            // case 68: /*D*/ this.moveState.right = 1; break;

            // case 82: /*R*/ this.moveState.up = 1; break;
            // case 70: /*F*/ this.moveState.down = 1; break;

            case 38: /*up*/ this.moveState.pitchUp = 1; break;
            case 40: /*down*/ this.moveState.pitchDown = 1; break;

            case 37: /*left*/ this.moveState.yawLeft = 1; break;
            case 39: /*right*/ this.moveState.yawRight = 1; break;

            case 81: /*Q*/ this.moveState.rollLeft = 1; break;
            case 69: /*E*/ this.moveState.rollRight = 1; break;
        }
        this.updateMovementVector();
        this.updateRotationVector();
    }

    keyup(event) {
        switch (event.keyCode) {
            case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

            // case 87: /*W*/ this.moveState.forward = 0; break;
            // case 83: /*S*/ this.moveState.back = 0; break;

            // case 65: /*A*/ this.moveState.left = 0; break;
            // case 68: /*D*/ this.moveState.right = 0; break;

            // case 82: /*R*/ this.moveState.up = 0; break;
            // case 70: /*F*/ this.moveState.down = 0; break;

            case 38: /*up*/ this.moveState.pitchUp = 0; break;
            case 40: /*down*/ this.moveState.pitchDown = 0; break;

            case 37: /*left*/ this.moveState.yawLeft = 0; break;
            case 39: /*right*/ this.moveState.yawRight = 0; break;

            case 81: /*Q*/ this.moveState.rollLeft = 0; break;
            case 69: /*E*/ this.moveState.rollRight = 0; break;
        }
        this.updateMovementVector();
        this.updateRotationVector();
    }

    update(delta) {
        const moveMult = delta * this.movementSpeed *
            this.movementSpeedMultiplier;
        const rotMult = delta * this.rollSpeed;

        this.object.translateX(this.moveVector.x * moveMult);
        this.object.translateY(this.moveVector.y * moveMult);
        this.object.translateZ(this.moveVector.z * moveMult);

        this.tmpQuaternion.set(
            this.rotationVector.x * rotMult,
            this.rotationVector.y * rotMult,
            this.rotationVector.z * rotMult,
            1
        ).normalize();
        this.object.quaternion.multiply(this.tmpQuaternion);

        // expose the rotation vector for convenience
        this.object.rotation.setFromQuaternion(
            this.object.quaternion,
            this.object.rotation.order
        );
    }

    updateMovementVector() {
        const forward = (
            this.moveState.forward
            || (this.autoForward && !this.moveState.back)
        ) ? 1 : 0;

        this.moveVector.x = (- this.moveState.left + this.moveState.right);
        this.moveVector.y = (- this.moveState.down + this.moveState.up);
        this.moveVector.z = (- forward + this.moveState.back);

        // console.log(
        //     'move:',
        //     [this.moveVector.x, this.moveVector.y, this.moveVector.z]
        // );
    }

    updateRotationVector() {
        this.rotationVector.x = - this.moveState.pitchDown +
            this.moveState.pitchUp;
        this.rotationVector.y = - this.moveState.yawRight +
            this.moveState.yawLeft;
        this.rotationVector.z = - this.moveState.rollRight +
            this.moveState.rollLeft;

        // console.log(
        //     'rotate:',
        //     [this.rotationVector.x, this.rotationVector.y, this.rotationVector.z]
        // );
    }

    getContainerDimensions() {
        if (this.domElement !== document) {
            return {
                size: [
                    this.domElement.offsetWidth,
                    this.domElement.offsetHeight
                ],
                offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
            };
        } else {
            return {
                size: [window.innerWidth, window.innerHeight],
                offset: [0, 0]
            };
        }
    }

    dispose(_keydown, _keyup) {
        this.domElement.removeEventListener('contextmenu', contextmenu, false);
        window.removeEventListener('keydown', _keydown, false);
        window.removeEventListener('keyup', _keyup, false);
    }
}

function bind(scope, fn) {
    return function() {
        fn.apply(scope, arguments);
    };
}

function contextmenu(event) {
    event.preventDefault();
}

export default AFOControls;
