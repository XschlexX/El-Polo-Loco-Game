function mainScreenTemplate() {
    return /*html*/`
        <div id="startscreen" class="startscreen">
            <div class="startscreen-controls">
                <button class="button" onclick="showInfoScreen()">INFO</button>
                <button class="button" onclick="showControlScreen()">CONTROLS</button>
            </div>
                <button id="unmute-btn" onclick="toggleSoundButton()" class="unmute-button" title="Enable Sound">
                    <img src="assets/icon/unmute.png" alt="unmute">
                </button>
                <button id="mute-btn" onclick="toggleSoundButton()" class="unmute-button" style="display: none;" title="Disable Sound">
                    <img src="assets/icon/mute.png" alt="mute">
                </button>
                <button class="button" onclick="startGame(0)">START DEBUG MODE</button>
                <button class="button fz32" onclick="startGame(1)">START GAME</button>
            </div>
    `;
}

function infoScreenTemplate() {
    return /*html*/`
        <div id="info_screen" class="all-screens">
            <img class="background-image" src="assets/img/5_background/first_half_background.png" alt="Info">
            <button id="unmute-btn" onclick="toggleSoundButton()" class="unmute-button" title="Enable Sound">
                <img src="assets/icon/unmute.png" alt="unmute">
            </button>
            <button id="mute-btn" onclick="toggleSoundButton()" class="unmute-button" style="display: none;" title="Disable Sound">
                <img src="assets/icon/mute.png" alt="mute">
            </button>
            <div class="info-screen">
                <div class="info-text">
                    <h2>Info</h2>
                    <p>Help Pepe, the brave Mexican, navigate through the desert! Collect coins and bottles, dodge enemies,
                        and defeat the dangerous endboss.</p>
                    <p>Use the arrow keys to move and jump. Throw bottles with the spacebar to fight your opponents. Good
                        luck on your adventure!</p>
                </div>
                <div class="keys-info">
                    <div>
                        <div class="key-display">
                            <span class="key">⬅</span>
                            <span class="key">➡</span>
                        </div>
                        <div>Move Left/Right</div>
                    </div>
                    <div>
                        <div class="key-display">
                            <span class="key">⬆</span>
                        </div>
                        <div>Jump</div>
                    </div>
                    <div>
                        <div class="key-display">
                            <span class="key key-space">SPACE</span>
                        </div>
                        <div>Throw Bottle</div>
                    </div>
                </div>
                <button class="button" onclick="mainScreen()">BACK</button>
            </div>
        </div>
    `;
}

function controlsScreenTemplate() {
    return /*html*/`
        <div id="controls_screen" class="all-screens">
            <img class="background-image" src="assets/img/5_background/first_half_background.png" alt="Controls">
            <button id="unmute-btn" onclick="toggleSoundButton()" class="unmute-button" title="Enable Sound">
                <img src="assets/icon/unmute.png" alt="unmute">
            </button>
            <button id="mute-btn" onclick="toggleSoundButton()" class="unmute-button" style="display: none;" title="Disable Sound">
                <img src="assets/icon/mute.png" alt="mute">
            </button>
            <div class="screen-container">
            </div>
            <button class="button" onclick="mainScreen()">BACK</button>
        </div>
    `;
}

function showCanvasTemplate() {
    return /*html*/`
    <canvas id="canvas" class="canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
    <button id="settings-btn" class="settings-button" title="Settings" onclick="toggleSettingsMenu()">
        <span class="hamburger-icon"></span>
    </button>
    ${touchControlsTemplate()}
    ${settingsOverlayTemplate()}
    ${victoryOverlayTemplate()}
    ${defeatOverlayTemplate()}
    `;
}

/**
 * Touch Controls Template - Mobile Touch Buttons
 */
function touchControlsTemplate() {
    return /*html*/`
        <div id="touch-controls" class="touch-controls">
            <div class="touch-controls-row">
                <button id="btn-left" class="touch-btn touch-btn-left" title="Move Left">
                    <span class="touch-btn-icon">&#9664;</span>
                </button>
                <button id="btn-right" class="touch-btn touch-btn-right" title="Move Right">
                    <span class="touch-btn-icon">&#9654;</span>
                </button>
            </div>
            <div class="touch-controls-row">
                <button id="btn-throw" class="touch-btn touch-btn-throw" title="Throw Bottle">
                    <span class="touch-btn-icon">&#127863;</span>
                </button>
                <button id="btn-jump" class="touch-btn touch-btn-jump" title="Jump">
                    <span class="touch-btn-icon">&#9650;</span>
                </button>
            </div>
        </div>
    `;
}

function loadingScreenTemplate() {
    return /*html*/`
        <div id="loading-screen" class="loading-screen">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading...</div>
            <div id="loading-progress" class="loading-progress">0%</div>
        </div>
    `;
}

function rotateScreenTemplate() {
    return /*html*/`
        <div id="rotate-screen" class="rotate-screen">
            <div class="rotate-content">
                <div class="rotate-icon">📱</div>
                <h2>Please Rotate Your Device</h2>
                <p>This game is best played in landscape mode.</p>
            </div>
        </div>
    `;
}

/**
 * Settings Overlay Template - HTML-Version
 */
function settingsOverlayTemplate() {
    return /*html*/`
        <div id="settings-overlay" class="game-overlay">
            <div class="overlay-container">
                <h2 class="overlay-title">Menu</h2>
                <button id="settings-sound-btn" class="overlay-button" onclick="toggleSettingsSound()">Sound: ON</button>
                <button class="overlay-button" onclick="restartGameFromOverlay()">Restart Game</button>
                <button class="overlay-button" onclick="exitToMainMenu()">Exit Game</button>
                <button class="overlay-button" onclick="resumeGameFromOverlay()">Resume</button>
            </div>
        </div>
    `;
}

/**
 * Victory Overlay Template - HTML-Version mit Canvas-Styling
 * Zeigt "Next Level" Button nur an, wenn es nicht das letzte Level ist
 */
function victoryOverlayTemplate() {
    const maxLevel = 5;
    const isLastLevel = currentLevelNumber >= maxLevel;

    const nextLevelButton = !isLastLevel
        ? `<button class="victory-button" onclick="nextLevelFromOverlay()">Try Level ${currentLevelNumber + 1}</button>`
        : '';

    const completionMessage = isLastLevel
        ? `<div class="victory-completion-message">You have completed all levels!<br>Thank you for playing!</div>`
        : '';

    return /*html*/`
        <div id="victory-overlay" class="game-overlay victory-overlay">
            <div class="victory-container">
                <img class="victory-image" src="assets/img/You won, you lost/You won A.png" alt="You Won">
                ${completionMessage}
                <div class="victory-buttons">
                    ${nextLevelButton}
                    <button class="victory-button" onclick="exitToMainMenu()">Main Menu</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Defeat Overlay Template - HTML-Version mit Canvas-Styling
 */
function defeatOverlayTemplate() {
    return /*html*/`
        <div id="defeat-overlay" class="game-overlay defeat-overlay">
            <div class="defeat-container">
                <img class="defeat-image" src="assets/img/You won, you lost/Game Over.png" alt="You Lost">
                <div class="defeat-buttons">
                    <button class="defeat-button" onclick="tryAgainFromOverlay()">Try Again</button>
                    <button class="defeat-button" onclick="exitToMainMenu()">Main Menu</button>
                </div>
            </div>
        </div>
    `;
}
