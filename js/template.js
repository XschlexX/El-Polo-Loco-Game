function mainScreenTemplate() {
    return /*html*/`
        <div id="startscreen" class="all-screens main-screen">
            <img class="background-image" src="assets/img/9_intro_outro_screens/start/startscreen_2.png" alt="Info">
            <div class="startscreen-controls">
                <button class="button" onclick="showInfoScreen()">INFO</button>
                <button class="button" onclick="showSettingsScreen()">SETTINGS</button>
            </div>
                <button id="unmute-btn" onclick="toggleSoundButton()" class="unmute-button" title="Enable Sound">
                    <img src="assets/icon/unmute.png" alt="unmute">
                </button>
                <button id="mute-btn" onclick="toggleSoundButton()" class="unmute-button" style="display: none;" title="Disable Sound">
                    <img src="assets/icon/mute.png" alt="mute">
                </button>
                <!-- <div id="you_lost_screen"></div> -->
                <!-- <button class="button" onclick="startGame(0)">START DEBUG MODE</button> -->
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
            <div class="screen-content">
                <div class="info-text">
                    <h2>Info</h2>
                    <p>Help Pepe, the brave Mexican, navigate through the desert! Collect coins and bottles, dodge enemies,
                        and defeat the dangerous endboss.</p>
                    <p>Use the arrow keys to move and jump. Throw bottles with the spacebar to fight your opponents. Good
                        luck on your adventure!</p>
                </div>
                <div class="keys-info">
                    <div class="key">
                        <img src="assets/icon/arrow_left.png" alt="Left">
                        <div>Move Left</div>
                    </div>
                    <div class="key">
                        <img src="assets/icon/arrow_right.png" alt="Right">
                        <div>Move Right</div>
                    </div>
                    <div class="key">
                        <img src="assets/icon/arrow_up.png" alt="Up">
                        <div>Jump</div>
                    </div>
                    <div class="key">
                        <img src="assets/icon/spacebar.png" alt="Space">
                        <div>Throw Bottle</div>
                    </div>
                </div>
                <button class="button" onclick="mainScreen()">BACK</button>
            </div>
        </div>
    `;
}

function settingsScreenTemplate() {
    return /*html*/ `
        <div id="settings_screen" class="all-screens">
            <img class="background-image" src="assets/img/5_background/first_half_background.png" alt="Settings">
            <button id="unmute-btn" onclick="toggleSoundButton()" class="unmute-button" title="Enable Sound">
                <img src="assets/icon/unmute.png" alt="unmute">
            </button>
            <button id="mute-btn" onclick="toggleSoundButton()" class="unmute-button" style="display: none;" title="Disable Sound">
                <img src="assets/icon/mute.png" alt="mute">
            </button>
            <div class="screen-content">
                <h2>Settings</h2>
                <div class="settings-container">
                    <h2 class="settings-title">Audio Settings</h2>
                    
                    <div class="volume-control">
                        <label for="master-volume">Master Volume</label>
                        <div class="slider-container">
                            <input type="range" id="master-volume" class="volume-slider" min="0" max="100" value="100" oninput="updateMasterVolume(this.value)">
                            <span id="master-volume-value" class="volume-value">100%</span>
                        </div>
                    </div>
                    
                    <div class="volume-control">
                        <label for="music-volume">Music Volume</label>
                        <div class="slider-container">
                            <input type="range" id="music-volume" class="volume-slider" min="0" max="100" value="100" oninput="updateMusicVolume(this.value)">
                            <span id="music-volume-value" class="volume-value">100%</span>
                        </div>
                    </div>
                    
                    <div class="volume-control">
                        <label for="sfx-volume">SFX Volume</label>
                        <div class="slider-container">
                            <input type="range" id="sfx-volume" class="volume-slider" min="0" max="100" value="100" oninput="updateSfxVolume(this.value)">
                            <span id="sfx-volume-value" class="volume-value">100%</span>
                        </div>
                    </div>
                </div>
                <button class="button" onclick="mainScreen()">BACK</button>
            </div>
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
    ${audioSettingsOverlayTemplate()}
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
                    <img class="touch-btn-icon" src="assets/img/6_salsa_bottle/bottle_rotation/1_3_bottle_rotation.png" alt="Throw">
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
                <button class="overlay-button" onclick="showAudioSettingsOverlay()">Audio Settings</button>
                <button class="overlay-button" onclick="restartGameFromOverlay()">Restart Game</button>
                <button class="overlay-button" onclick="exitToMainMenu()">Exit Game</button>
                <button class="overlay-button" onclick="resumeGameFromOverlay()">Resume</button>
            </div>
        </div>
    `;
}

function audioSettingsOverlayTemplate() {
    return /*html*/`
        <div id="audio-settings-overlay" class="game-overlay">
            <div class="overlay-container">
                <h2 class="overlay-title">Audio Settings</h2>
                
                <button id="overlay-audio-toggle-btn" class="overlay-button" onclick="toggleSoundButton()">Sound: OFF</button>
                
                <div class="volume-control">
                    <label for="overlay-master-volume">Master Volume</label>
                    <div class="slider-container">
                        <input type="range" id="overlay-master-volume" class="volume-slider" min="0" max="100" value="100" oninput="updateOverlayMasterVolume(this.value)">
                        <span id="overlay-master-volume-value" class="volume-value">100%</span>
                    </div>
                </div>
                
                <div class="volume-control">
                    <label for="overlay-music-volume">Music Volume</label>
                    <div class="slider-container">
                        <input type="range" id="overlay-music-volume" class="volume-slider" min="0" max="100" value="100" oninput="updateOverlayMusicVolume(this.value)">
                        <span id="overlay-music-volume-value" class="volume-value">100%</span>
                    </div>
                </div>
                
                <div class="volume-control">
                    <label for="overlay-sfx-volume">SFX Volume</label>
                    <div class="slider-container">
                        <input type="range" id="overlay-sfx-volume" class="volume-slider" min="0" max="100" value="100" oninput="updateOverlaySfxVolume(this.value)">
                        <span id="overlay-sfx-volume-value" class="volume-value">100%</span>
                    </div>
                </div>
                
                <button class="overlay-button" onclick="closeAudioSettingsOverlay()">Back</button>
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
