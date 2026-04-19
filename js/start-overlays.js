/**
 * Overlay management functions for settings, victory and defeat screens
 * @file start-overlays.js
 */

/** Toggles settings menu visibility */
function toggleSettingsMenu() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) {
        if (overlay.classList.contains('active')) {
            hideHtmlSettingsOverlay();
        } else {
            showHtmlSettingsOverlay();
        }
    }
}

/** Shows HTML settings overlay and pauses game */
function showHtmlSettingsOverlay() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay && window.world) {
        overlay.classList.add('active');
        window.world.pauseGame();
    }
}

/** Hides HTML settings overlay and resumes game */
function hideHtmlSettingsOverlay() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay && window.world) {
        overlay.classList.remove('active');
        window.world.resumeGame();
    }
}

/** Shows audio settings overlay */
function showAudioSettingsOverlay() {
    const audioOverlay = document.getElementById('audio-settings-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    if (audioOverlay && settingsOverlay) {
        settingsOverlay.classList.remove('active');
        audioOverlay.classList.add('active');
        initializeOverlayVolumeSliders();
    }
}

/** Closes audio settings and returns to main settings */
function closeAudioSettingsOverlay() {
    const audioOverlay = document.getElementById('audio-settings-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    if (audioOverlay && settingsOverlay) {
        audioOverlay.classList.remove('active');
        settingsOverlay.classList.add('active');
    }
}

/** Restarts game from overlay */
function restartGameFromOverlay() {
    hideHtmlSettingsOverlay();
    startGame();
}

/** Exits to main menu */
function exitToMainMenu() {
    if (window.world) {
        window.world.stopGame();
        window.world = null;
    }
    hideHtmlSettingsOverlay();
    hideHtmlVictoryOverlay();
    hideHtmlDefeatOverlay();
    mainScreen();
    if (window.soundManager) window.soundManager.playMusic('menuTheme');
}

/** Resumes game from overlay */
function resumeGameFromOverlay() {
    hideHtmlSettingsOverlay();
}

/** Shows HTML victory overlay */
function showHtmlVictoryOverlay() {
    const overlay = document.getElementById('victory-overlay');
    if (overlay) overlay.classList.add('active');
}

/** Hides HTML victory overlay */
function hideHtmlVictoryOverlay() {
    const overlay = document.getElementById('victory-overlay');
    if (overlay) overlay.classList.remove('active');
}

/** Starts next level from overlay */
function nextLevelFromOverlay() {
    hideHtmlVictoryOverlay();
    currentLevelNumber++;
    startGame(currentLevelNumber);
}

/** Shows HTML defeat overlay */
function showHtmlDefeatOverlay() {
    const overlay = document.getElementById('defeat-overlay');
    if (overlay) overlay.classList.add('active');
}

/** Hides HTML defeat overlay */
function hideHtmlDefeatOverlay() {
    const overlay = document.getElementById('defeat-overlay');
    if (overlay) overlay.classList.remove('active');
}

/** Retries current level from overlay */
function tryAgainFromOverlay() {
    hideHtmlDefeatOverlay();
    startGame();
}
