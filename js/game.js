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

/**
 * Initialisiert die Touch-Controls für mobile Geräte
 * Wird aufgerufen, nachdem das Canvas geladen wurde
 */
function initTouchControls() {
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnThrow = document.getElementById('btn-throw');

    if (!btnLeft || !btnRight || !btnJump || !btnThrow) return;

    // Verhindere Context-Menu und Long-Press auf allen Touch-Buttons
    [btnLeft, btnRight, btnJump, btnThrow].forEach(btn => {
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
        btn.addEventListener('touchstart', handleTouchStart, { passive: false });
        btn.addEventListener('touchend', handleTouchEnd, { passive: false });
        btn.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        // Verhindere Mouse-Events nach Touch (Ghost Clicks)
        btn.addEventListener('mousedown', (e) => e.preventDefault());
    });

    function handleTouchStart(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        btn.classList.add('pressed');

        switch (btn.id) {
            case 'btn-left':
                keyboard.LEFT = true;
                break;
            case 'btn-right':
                keyboard.RIGHT = true;
                break;
            case 'btn-jump':
                keyboard.UP = true;
                break;
            case 'btn-throw':
                // Trigger einmaligen Wurf - SPACE wird sofort wieder zurückgesetzt
                triggerSpaceKey();
                break;
        }
        keyboard.ANY = true;
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        btn.classList.remove('pressed');

        switch (btn.id) {
            case 'btn-left':
                keyboard.LEFT = false;
                break;
            case 'btn-right':
                keyboard.RIGHT = false;
                break;
            case 'btn-jump':
                keyboard.UP = false;
                break;
            case 'btn-throw':
                // Nichts zu tun - Wurf wurde bereits bei touchstart ausgelöst
                break;
        }

        // Prüfe, ob noch eine Taste gedrückt ist
        const anyKeyStillPressed =
            keyboard.LEFT ||
            keyboard.RIGHT ||
            keyboard.SPACE ||
            keyboard.UP ||
            keyboard.DOWN;

        if (!anyKeyStillPressed) {
            keyboard.ANY = false;
        }
    }
}

window.addEventListener('keydown', (e) => {
    if (!keyboardActive) return;

    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = true;
    } else if (e.code === 'ArrowRight') {
        keyboard.RIGHT = true;
    } else if (e.code === 'Space') {
        // Space wird für 800ms auf true gehalten, auch wenn nur kurz gedrückt
        triggerSpaceKey();
    } else if (e.code === 'ArrowUp') {
        keyboard.UP = true;
    } else if (e.code === 'ArrowDown') {
        keyboard.DOWN = true;
    }
    keyboard.ANY = true;
});

/**
 * Setzt die SPACE-Taste für 800ms auf true
 * Sorgt für konsistente Werfe-Animation
 */
function triggerSpaceKey() {
    keyboard.SPACE = true;

    // Setze SPACE nach 800ms zurück
    setTimeout(() => {
        keyboard.SPACE = false;
    }, 800);
}

window.addEventListener('keyup', (e) => {
    if (!keyboardActive) {
        return;
    };

    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = false;
    } else if (e.code === 'ArrowRight') {
        keyboard.RIGHT = false;
    } else if (e.code === 'Space') {
        // Space wird nicht sofort zurückgesetzt, sondern bleibt 800ms true
        // (wird in triggerSpaceKey() zurückgesetzt)
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
