'use strict';

let canvas;
let world;
let keyboardActive = true;
let keyboard = new Keyboard();
let soundManager;


function init() {
    window.soundManager = new SoundManager();
    mainScreen();
    initOrientationCheck();
}

window.addEventListener('keydown', (e) => {
    if (!keyboardActive) return;

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
});

window.addEventListener('keyup', (e) => {
    if (!keyboardActive) {
        return;
    };

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

    const anyKeyStillPressed =
        keyboard.LEFT ||
        keyboard.RIGHT ||
        keyboard.SPACE ||
        keyboard.UP ||
        keyboard.DOWN;

    if (!anyKeyStillPressed) {
        keyboard.ANY = false;
    }
});

/**
 * Überwacht die Bildschirmausrichtung und zeigt/versteckt den Rotate-Screen
 */
function initOrientationCheck() {
    const rotateScreen = document.getElementById('rotate-screen');

    if (!rotateScreen) return;

    function checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = window.innerWidth <= 768;

        if (isMobile && isPortrait) {
            rotateScreen.style.display = 'flex';
            if (world) {
                world.pauseGame();
            }
        } else {
            rotateScreen.style.display = 'none';
            if (world) {
                world.resumeGame();
            }
        }
    }

    // Initial prüfen
    checkOrientation();

    // Bei Größenänderung prüfen
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}
