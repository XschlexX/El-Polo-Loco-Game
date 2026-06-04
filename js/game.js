'use strict';

let canvas;
let world;
let keyboardActive = true;
let keyboard = new Keyboard();
let soundManager;

const BUTTON_KEY_MAP = {
    'btn-left': 'LEFT',
    'btn-right': 'RIGHT',
    'btn-jump': 'UP',
    'btn-throw': 'SPACE'
};

const KEY_CODE_MAP = {
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    'ArrowUp': 'UP',
    'Space': 'SPACE'
};

/**
 * Initializes the game by setting up audio, UI, orientation check and hover sounds.
 */
function init() {
    window.soundManager = new SoundManager();
    loadVolumeSettings();
    mainScreen();
    initOrientationCheck();
    initButtonHoverSounds();
}

/**
 * Attaches hover sound effect to all buttons on the current screen.
 */
function initButtonHoverSounds() {
    setTimeout(() => {
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            button.removeEventListener('mouseenter', playButtonHoverSound);
            button.addEventListener('mouseenter', playButtonHoverSound);
        });
    }, 50);
}

/**
 * Plays the button hover sound if audio is enabled.
 */
function playButtonHoverSound() {
    if (window.soundManager && !window.soundManager.muted) {
        window.soundManager.play('buttonHover');
    }
}

/**
 * Checks whether any game key is currently pressed.
 * @returns {boolean} True if any key is active
 */
function isAnyKeyPressed() {
    return keyboard.LEFT || keyboard.RIGHT || keyboard.SPACE || keyboard.UP;
}

/**
 * Sets the pressed state for a keyboard key.
 * @param {string} key - Keyboard property name (e.g. 'LEFT', 'SPACE')
 * @param {boolean} pressed - True for key down, false for key up
 */
function setKeyState(key, pressed) {
    keyboard[key] = pressed;
    keyboard.ANY = isAnyKeyPressed();
}

/**
 * Initializes on-screen touch controls for mobile devices.
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
 * Monitors screen orientation and shows/hides the rotate-screen overlay on mobile.
 */
function initOrientationCheck() {
    const rotateScreen = document.getElementById('rotate-screen');

    if (!rotateScreen) return;

    function checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = window.innerWidth <= 600;

        if (isMobile && isPortrait) {
            showRotateScreen();
        } else {
            hideRotateScreen();
        }
    }

    /** Shows rotate screen and pauses game */
    function showRotateScreen() {
        rotateScreen.style.display = 'flex';
        if (shouldPauseGame()) {
            world.pauseGame();
        }
    }

    /** Hides rotate screen and resumes game if appropriate */
    function hideRotateScreen() {
        rotateScreen.style.display = 'none';
        if (shouldResumeGame()) {
            world.resumeGame();
        }
    }

    /** Checks if game should be paused */
    function shouldPauseGame() {
        return world && document.getElementById('canvas') && !isGameEnded();
    }

    /** Checks if game should be resumed */
    function shouldResumeGame() {
        if (!world || !document.getElementById('canvas')) return false;
        if (isGameEnded()) return false;
        return !isOverlayOpen('settings-overlay') && !isOverlayOpen('audio-settings-overlay');
    }

    /** Checks if game has ended */
    function isGameEnded() {
        return isOverlayOpen('victory-overlay') || isOverlayOpen('defeat-overlay');
    }

    /** Checks if overlay is open */
    function isOverlayOpen(id) {
        return document.getElementById(id)?.classList.contains('active');
    }

    checkOrientation();

    window.addEventListener('resize', () => {
        checkOrientation();
    });
    window.addEventListener('orientationchange', checkOrientation);
}
