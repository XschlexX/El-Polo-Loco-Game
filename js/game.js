'use strict';

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    startScreen();

}

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = true;
    } else if (e.code === 'ArrowRight') {
        keyboard.RIGHT = true;
    } else if (e.code === 'Space') {
        keyboard.SPACE = true;
    } else if (e.code === 'ArrowUp') {
        keyboard.UP = true;
    } else if (e.code === 'ArrowDown') {
        keyboard.DOWN = true;
    }
    keyboard.ANY = true;
    // console.log(e);
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = false;
    } else if (e.code === 'ArrowRight') {
        keyboard.RIGHT = false;
    } else if (e.code === 'Space') {
        keyboard.SPACE = false;
    } else if (e.code === 'ArrowUp') {
        keyboard.UP = false;
    } else if (e.code === 'ArrowDown') {
        keyboard.DOWN = false;
    }

    // Prüfe, ob noch eine Taste gedrückt ist  
    const anyKeyStillPressed =
        keyboard.LEFT ||
        keyboard.RIGHT ||
        keyboard.SPACE ||
        keyboard.UP ||
        keyboard.DOWN;

    // Setze ANY nur auf false, wenn keine andere Taste mehr gedrückt ist  
    if (!anyKeyStillPressed) {
        keyboard.ANY = false;
    }
    // console.log(e);
});