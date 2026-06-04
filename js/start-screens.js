/**
 * Screen management functions for game navigation and lifecycle.
 * @file start-screens.js
 */

/**
 * Renders the main menu screen and initializes audio UI.
 */
function mainScreen() {
    document.getElementById('game_container').innerHTML = mainScreenTemplate();
    updateSoundButtonState();
    initButtonHoverSounds();
}

/**
 * Starts a new game session for the specified level.
 * @param {number} [level=1] - Level number to start
 */
function startGame(level = 1) {
    currentLevelNumber = level;
    stopExistingGame();
    showLoadingScreen();
    initializeSoundManager();
    loadGameAssets();
}

/**
 * Stops any running game instance and cleans up the world reference.
 */
function stopExistingGame() {
    if (world) {
        world.stopGame();
        world = null;
    }
}

/**
 * Displays the loading screen and hides the settings button.
 */
function showLoadingScreen() {
    document.getElementById('game_container').innerHTML = showCanvasTemplate() + loadingScreenTemplate();
    canvas = document.getElementById('canvas');
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.style.display = 'none';
}

/**
 * Creates the SoundManager instance if it does not already exist.
 */
function initializeSoundManager() {
    if (!window.soundManager) {
        window.soundManager = new SoundManager();
    }
}

/**
 * Begins loading all game assets and registers progress and completion callbacks.
 */
function loadGameAssets() {
    const assetLoader = new AssetLoader();
    assetLoader.loadAll(updateLoadingProgress, onAssetsLoaded);
}

/**
 * Updates the loading progress text on screen.
 * @param {number} loaded - Number of assets loaded so far
 * @param {number} total - Total number of assets to load
 * @param {number} percentage - Current loading percentage (0–100)
 */
function updateLoadingProgress(loaded, total, percentage) {
    const progressElement = document.getElementById('loading-progress');
    if (progressElement) progressElement.textContent = `${percentage}%`;
}

/**
 * Called when all assets have finished loading; transitions to gameplay.
 */
function onAssetsLoaded() {
    document.getElementById('loading-screen').style.display = 'none';
    showSettingsButton();
    startGameMusic();
    initializeGameWorld();
}

/**
 * Makes the in-game settings button visible.
 */
function showSettingsButton() {
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.style.display = 'flex';
}

/**
 * Stops menu music, starts game music and creates the current level.
 */
function startGameMusic() {
    window.soundManager.stopMusic('menuTheme');
    window.soundManager.playMusic('gameTheme');
    createLevel(currentLevelNumber);
}

/**
 * Creates the game World, sets up the debug overlay and initializes touch controls.
 */
function initializeGameWorld() {
    world = new World(canvas, keyboard);
    if (typeof debugOverlay !== 'undefined') debugOverlay.destroy();
    window.debugOverlay = new DebugOverlay();
    window.debugOverlay.setWorld(world);
    keyboardActive = true;
    initTouchControls();
    initButtonHoverSounds();
}

/**
 * Renders the info / instructions screen.
 */
function showInfoScreen() {
    document.getElementById('game_container').innerHTML = infoScreenTemplate();
    updateSoundButtonState();
    initButtonHoverSounds();
}

/**
 * Renders the audio settings screen.
 */
function showSettingsScreen() {
    document.getElementById('game_container').innerHTML = settingsScreenTemplate();
    updateSoundButtonState();
    initializeVolumeSliders();
    initButtonHoverSounds();
}

/**
 * Renders the legal notice (Impressum) screen.
 */
function showImpressumScreen() {
    document.getElementById('game_container').innerHTML = impressumScreenTemplate();
    initButtonHoverSounds();
}

/**
 * Shows the victory overlay and plays the win sound after a delay.
 * @param {number} [delay=0] - Delay in milliseconds before showing the screen
 */
function showYouWonScreen(delay = 0) {
    setTimeout(() => {
        if (window.world) window.world.stopGame();
        showHtmlVictoryOverlay();
        if (window.soundManager && !window.soundManager.muted) {
            window.soundManager.play('youWon');
        }
    }, delay);
}

/**
 * Shows the defeat overlay and plays the loss sound after a delay.
 * @param {number} [delay=0] - Delay in milliseconds before showing the screen
 */
function showYouLostScreen(delay = 0) {
    setTimeout(() => {
        if (window.world) window.world.stopGame();
        showHtmlDefeatOverlay();
        if (window.soundManager && !window.soundManager.muted) {
            window.soundManager.play('youLost');
        }
    }, delay);
}
