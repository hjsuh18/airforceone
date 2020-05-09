/**
 * Creates two pages - game start page, game end page - and handles transitions
 * between pages.
 */
import { Game } from './Game.js';

const html = `
<div class='container-start'>
    <div class='title'>
        Air Force One
    </div>
    <div class='description'>
        The whole world is infected by COVID-19 and the only survivors are on
        board Air Force One. <br> President Trump has told you to <b>keep flying
        </b> until further orders. <br> Don't run out of fuel by <b> collecting 
        fuel items.</b> <br> <b>Avoid any black clouds </b> that are dangerous storms 
        that can crash the plane. 
    </div>
    <div class='instructions'>
        <b> Flight Controls: </b> <br>
        <i>W/S</i>: Accelerate/Decelerate <br>
        <i>Q/E</i>: Roll Left/Right <br>
        <i>Left/Right Arrow</i>: Turn Left/Right <br>
        <i>Up/Down Arrow</i>: Pitch Up/Down <br>
    </div>
    <div class='start-instructions'>
        <b>Press SPACE to start.</b>
    </div>
</div>

<div class='container-end'>
    <div class='game-over'>
        Game Over
    </div>
    <div class='game-over-message'></div>
    <div class='game-over-points'></div>
    <div class='start-instructions'>
        <b>Press SPACE to restart.</b>
    </div>
</div>
<style>
    body, html {
        height: 100%;
        background-color: #7ec0ee;
    }
    .container-start {
        opacity: 1.0;
        position: absolute;
        height: 100%;
        width: 100%;
    }
    .container-end {
        opacity: 0.0;
        position: absolute;
        height: 100%;
        width: 100%;
    }
    * {
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        text-align: center;
    }
    .title {
        font-size: 90px;
        display: inline-block;
        vertical-align: middle;
        margin-top: 5%;
        margin-bottom: 3%;
        width: 100%;
    }
    .description {
        display: inline-block;
        vertical-align: middle;
        font-size: 25px;
        width: 100%;
    }
    .instructions {
        margin-top: 3%;
        display: inline-block;
        vertical-align: middle;
        font-size: 25px;
        width: 100%;
    }
    .start-instructions {
        margin-top: 2%;
        display: inline-block;
        vertical-align: middle;
        font-size: 30px;
        width: 100%;
    }
    .game-over {
        font-size: 120px;
        display: inline-block;
        vertical-align: middle;
        margin-top: 10%;
        margin-bottom: 2%;
        width: 100%;
    }
    .game-over-message {
        display: inline-block;
        vertical-align: middle;
        font-size: 50px;
        margin-top: 2%;
        margin-bottom: 2%;
        width: 100%;
    }
    .game-over-points {
        display: inline-block;
        vertical-align: middle;
        font-size: 50px;
        margin-top: 2%;
        margin-bottom: 2%;
        width: 100%;
    }
</style>
`;

new Game();
document.body.innerHTML = html;
