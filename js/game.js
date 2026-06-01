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
    initButtonHoverSounds();
}

/**
 * Adds hover sound effect to all buttons
 * Called after each screen change
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
 * Plays button hover sound
 */
function playButtonHoverSound() {
    if (window.soundManager && !window.soundManager.muted) {
        window.soundManager.play('buttonHover');
    }
}

/**
 * Checks if any key is pressed
 * @returns {boolean}
 */
function isAnyKeyPressed() {
    return keyboard.LEFT || keyboard.RIGHT || keyboard.SPACE || keyboard.UP;
}

/**
 * Sets keyboard state for a key
 * @param {string} key - Keyboard property (e.g. 'LEFT', 'SPACE')
 * @param {boolean} pressed - true for pressed, false for released
 */
function setKeyState(key, pressed) {
    keyboard[key] = pressed;
    keyboard.ANY = isAnyKeyPressed();
}

/**
 * Initializes touch controls for mobile devices
 * Called after canvas is loaded
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
 * Monitors screen orientation and shows/hides rotate screen
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

/**
 * Logs current window size to console
 */
// function logWindowSize() {
//     const gameContainer = document.getElementById('game_container');
//     const containerInfo = gameContainer ? {
//         width: gameContainer.offsetWidth,
//         height: gameContainer.offsetHeight,
//         aspectRatio: (gameContainer.offsetWidth / gameContainer.offsetHeight).toFixed(2)
//     } : 'not found';

//     console.log('Window Size:', {
//         width: window.innerWidth,
//         height: window.innerHeight,
//         aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2)
//     });
//     console.log('Game Container:', containerInfo);
// }
