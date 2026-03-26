'use strict';

let canvas;
let world;
let keyboardActive = true;
let keyboard = new Keyboard();
let soundManager;

// Mapping: Button ID -> Keyboard Property
const BUTTON_KEY_MAP = {
    'btn-left': 'LEFT',
    'btn-right': 'RIGHT',
    'btn-jump': 'UP',
    'btn-throw': 'SPACE'
};

// Mapping: Keyboard Event Code -> Keyboard Property
const KEY_CODE_MAP = {
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    'ArrowUp': 'UP',
    'Space': 'SPACE'
};

function init() {
    window.soundManager = new SoundManager();
    loadVolumeSettings();
    mainScreen();
    initOrientationCheck();
}

/**
 * Prüft, ob eine beliebige Taste gedrückt ist
 * @returns {boolean}
 */
function isAnyKeyPressed() {
    return keyboard.LEFT || keyboard.RIGHT || keyboard.SPACE || keyboard.UP;
}

/**
 * Setzt den Keyboard-Status für eine Taste
 * @param {string} key - Die Keyboard-Property (z.B. 'LEFT', 'SPACE')
 * @param {boolean} pressed - true für gedrückt, false für losgelassen
 */
function setKeyState(key, pressed) {
    keyboard[key] = pressed;
    keyboard.ANY = isAnyKeyPressed();
}

/**
 * Initialisiert die Touch-Controls für mobile Geräte
 * Wird aufgerufen, nachdem das Canvas geladen wurde
 */
function initTouchControls() {
    const buttons = {
        'btn-left': document.getElementById('btn-left'),
        'btn-right': document.getElementById('btn-right'),
        'btn-jump': document.getElementById('btn-jump'),
        'btn-throw': document.getElementById('btn-throw')
    };

    const allButtons = Object.values(buttons).filter(btn => btn !== null);
    if (allButtons.length < 4) return;

    allButtons.forEach(btn => {
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
        btn.addEventListener('touchstart', handleTouchStart, { passive: false });
        btn.addEventListener('touchend', handleTouchEnd, { passive: false });
        btn.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        btn.addEventListener('mousedown', (e) => e.preventDefault());
    });

    function handleTouchStart(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const key = BUTTON_KEY_MAP[btn.id];
        if (key) {
            btn.classList.add('pressed');
            setKeyState(key, true);
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const key = BUTTON_KEY_MAP[btn.id];
        if (key) {
            btn.classList.remove('pressed');
            setKeyState(key, false);
        }
    }
}

window.addEventListener('keydown', (e) => {
    if (!keyboardActive) return;

    const key = KEY_CODE_MAP[e.code];
    if (key) {
        setKeyState(key, true);
    }
});

window.addEventListener('keyup', (e) => {
    if (!keyboardActive) return;

    const key = KEY_CODE_MAP[e.code];
    if (key) {
        setKeyState(key, false);
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
        const isMobile = window.innerWidth <= 600;
        const isSettingsOverlayOpen = document.getElementById('settings-overlay')?.classList.contains('active');
        const isAudioSettingsOverlayOpen = document.getElementById('audio-settings-overlay')?.classList.contains('active');

        if (isMobile && isPortrait) {
            rotateScreen.style.display = 'flex';
            if (world) {
                world.pauseGame();
            }
        } else {
            rotateScreen.style.display = 'none';
            // Nur resume wenn kein Settings-Overlay geöffnet ist
            if (world && !isSettingsOverlayOpen && !isAudioSettingsOverlayOpen) {
                world.resumeGame();
            }
        }
    }

    // Initial prüfen
    checkOrientation();

    // Bei Größenänderung prüfen
    window.addEventListener('resize', () => {
        checkOrientation();
        logWindowSize(); // Window-Größe loggen
    });
    window.addEventListener('orientationchange', checkOrientation);
}

/**
 * Loggt die aktuelle Window-Größe in die Konsole
 */
function logWindowSize() {
    console.log('Window Size:', {
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2)
    });
}
