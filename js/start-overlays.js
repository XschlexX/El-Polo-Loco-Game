/**
 * Overlay management functions for settings, audio, victory and defeat screens.
 * @file start-overlays.js
 */

/**
 * Toggles the in-game settings menu open or closed.
 */
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

/**
 * Displays the settings overlay and pauses the game.
 */
function showHtmlSettingsOverlay() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay && window.world) {
        overlay.classList.add('active');
        window.world.pauseGame();
    }
}

/**
 * Hides the settings overlay and resumes the game.
 */
function hideHtmlSettingsOverlay() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay && window.world) {
        overlay.classList.remove('active');
        window.world.resumeGame();
    }
}

/**
 * Opens the audio settings overlay and hides the main settings panel.
 */
function showAudioSettingsOverlay() {
    const audioOverlay = document.getElementById('audio-settings-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    if (audioOverlay && settingsOverlay) {
        settingsOverlay.classList.remove('active');
        audioOverlay.classList.add('active');
        initializeOverlayVolumeSliders();
    }
}

/**
 * Closes the audio settings overlay and returns to the main settings panel.
 */
function closeAudioSettingsOverlay() {
    const audioOverlay = document.getElementById('audio-settings-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    if (audioOverlay && settingsOverlay) {
        audioOverlay.classList.remove('active');
        settingsOverlay.classList.add('active');
    }
}

/**
 * Restarts the current game from an overlay menu.
 */
function restartGameFromOverlay() {
    hideHtmlSettingsOverlay();
    startGame();
}

/**
 * Stops the game and returns to the main menu screen.
 */
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

/**
 * Resumes the game by closing the settings overlay.
 */
function resumeGameFromOverlay() {
    hideHtmlSettingsOverlay();
}

/**
 * Displays the victory overlay screen.
 */
function showHtmlVictoryOverlay() {
    const overlay = document.getElementById('victory-overlay');
    if (overlay) overlay.classList.add('active');
}

/**
 * Hides the victory overlay screen.
 */
function hideHtmlVictoryOverlay() {
    const overlay = document.getElementById('victory-overlay');
    if (overlay) overlay.classList.remove('active');
}

/**
 * Advances to the next level from the victory overlay.
 */
function nextLevelFromOverlay() {
    hideHtmlVictoryOverlay();
    currentLevelNumber++;
    startGame(currentLevelNumber);
}

/**
 * Displays the defeat / game-over overlay screen.
 */
function showHtmlDefeatOverlay() {
    const overlay = document.getElementById('defeat-overlay');
    if (overlay) overlay.classList.add('active');
}

/**
 * Hides the defeat / game-over overlay screen.
 */
function hideHtmlDefeatOverlay() {
    const overlay = document.getElementById('defeat-overlay');
    if (overlay) overlay.classList.remove('active');
}

/**
 * Retries the current level from the defeat overlay.
 */
function tryAgainFromOverlay() {
    hideHtmlDefeatOverlay();
    startGame();
}
