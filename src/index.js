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
        fuel items.</b> <br> Collect food supplies. <b>Water</b>: 100 points.
        <b>Donut</b>: 500 points. <b>Burger</b>: 2x points.
    </div>
    <div class='instructions'>
        <b> Flight Controls: </b> <br>
        <i>Q/E</i>: Roll Left/Right <br>
        <i>Left/Right Arrow</i>: Turn Left/Right <br>
        <i>Up/Down Arrow</i>: Pitch Up/Down <br>
        <i>Hold Shift</i>: Move Faster <br>
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

<div class='container-score'>
    <div class='score'>Score:</div>
    <div class='container-fuel'>
        <div class='fuel-text'>Fuel: </div>
        <progress class='fuel-bar' value='100' max='100'></progress>
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
    .container-score {
        opacity: 0.0;
        position: absolute;
        top: 5%;
        right: 5%;
    }
    .score {
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-size: 30px;
        display: inline-block;
        vertical-align: middle;
        width: 100%;
        text-align: right;
        margin-bottom: 5%;
    }
    .container-fuel {
        width: 100%;
        text-align: left;
    }
    .fuel-text {
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-size: 30px;
        display: inline-block;
    }
    .fuel-bar {
        display: inline-block;
        width: 200px;
        padding: 3px;
        background: #444;
        border-radius: 5px;
    }
</style>
`;

new Game();
document.body.innerHTML = html;
