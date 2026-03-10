'use strict';

let canvas;
let world;
let keyboardActive = true;
let keyboard = new Keyboard();
let soundManager;


function init() {
    window.soundManager = new SoundManager();  // ← Füge 'window.' hinzu!
    mainScreen();
    initOrientationCheck();  // Starte die Überwachung der Bildschirmausrichtung
}

window.addEventListener('keydown', (e) => {
    if (!keyboardActive) return; // Add this line to check if keyboard is active

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
    if (!keyboardActive) {
        return;
    }; // Add this line to check if keyboard is active

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
            world.pauseGame();
        } else {
            rotateScreen.style.display = 'none';
            world.resumeGame();
        }
    }

    // Initial prüfen
    checkOrientation();

    // Bei Größenänderung prüfen
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}
