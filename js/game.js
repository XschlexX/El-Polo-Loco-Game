'use strict';

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);

    console.log('My Character is', world.character);
}

document.addEventListener('keydown', (e) => {
    console.log(e);
});