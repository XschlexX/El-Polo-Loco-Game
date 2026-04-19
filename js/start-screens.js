/**
 * Screen management functions for game navigation
 * @file start-screens.js
 */

/** Shows main menu screen */
function mainScreen() {
    document.getElementById('game_container').innerHTML = mainScreenTemplate();
    updateSoundButtonState();
    initButtonHoverSounds();
}

/**
 * Starts the game with specified level
 * @param {number} level - Level number to start
 */
function startGame(level = 1) {
    currentLevelNumber = level;
    stopExistingGame();
    showLoadingScreen();
    initializeSoundManager();
    loadGameAssets();
}

/** Stops existing game if running */
function stopExistingGame() {
    if (world) {
        world.stopGame();
        world = null;
    }
}

/** Shows loading screen and hides settings button */
function showLoadingScreen() {
    document.getElementById('game_container').innerHTML = showCanvasTemplate() + loadingScreenTemplate();
    canvas = document.getElementById('canvas');
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.style.display = 'none';
}

/** Creates SoundManager if not exists */
function initializeSoundManager() {
    if (!window.soundManager) {
        window.soundManager = new SoundManager();
    }
}

/** Loads game assets and starts game when complete */
function loadGameAssets() {
    const assetLoader = new AssetLoader();
    assetLoader.loadAll(updateLoadingProgress, onAssetsLoaded);
}

/**
 * Updates loading progress display
 * @param {number} loaded - Assets loaded
 * @param {number} total - Total assets
 * @param {number} percentage - Loading percentage
 */
function updateLoadingProgress(loaded, total, percentage) {
    const progressElement = document.getElementById('loading-progress');
    if (progressElement) progressElement.textContent = `${percentage}%`;
}

/** Called when all assets are loaded */
function onAssetsLoaded() {
    document.getElementById('loading-screen').style.display = 'none';
    showSettingsButton();
    startGameMusic();
    initializeGameWorld();
}

/** Shows settings button */
function showSettingsButton() {
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.style.display = 'flex';
}

/** Starts game music and creates level */
function startGameMusic() {
    window.soundManager.stopMusic('menuTheme');
    window.soundManager.playMusic('gameTheme');
    createLevel(currentLevelNumber);
}

/** Initializes game world and debug overlay */
function initializeGameWorld() {
    world = new World(canvas, keyboard);
    if (typeof debugOverlay !== 'undefined') debugOverlay.destroy();
    window.debugOverlay = new DebugOverlay();
    window.debugOverlay.setWorld(world);
    keyboardActive = true;
    initTouchControls();
    initButtonHoverSounds();
}

/** Shows info screen */
function showInfoScreen() {
    document.getElementById('game_container').innerHTML = infoScreenTemplate();
    updateSoundButtonState();
    initButtonHoverSounds();
}

/** Shows settings screen */
function showSettingsScreen() {
    document.getElementById('game_container').innerHTML = settingsScreenTemplate();
    updateSoundButtonState();
    initializeVolumeSliders();
    initButtonHoverSounds();
}

/**
 * Shows victory screen after delay
 * @param {number} delay - Delay in milliseconds
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
 * Shows defeat screen after delay
 * @param {number} delay - Delay in milliseconds
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
