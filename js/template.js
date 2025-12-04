function startScreenTemplate() {
    return /*html*/`
        <div id="startscreen" class="startscreen">
            <div class="startscreen-controls">
                <button class="button" onclick="showInfoScreen()">INFO</button>
                <button class="button" onclick="showControlScreen()">CONTROLS</button>
            </div>
            <button class="button fz32" onclick="startGame()">START GAME</button>
        </div>
    `;
}

function showCanvasTemplate() {
    return /*html*/`
    <canvas id="canvas" class="canvas" width="720" height="480"></canvas>
    `;
}

function infoScreenTemplate() {
    return /*html*/`
        <div id="infoscreen" class="all-screens">
            <img src="../assets/img/5_background/first_half_background.png" alt="Info">
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
                <button class="button" onclick="startScreen()">BACK</button>
            </div>
        </div>
    `;
}

function controlsScreenTemplate() {
    return /*html*/`
        <div id="controls" class="all-screens">
            <img class="background-image" src="../assets/img/5_background/first_half_background.png" alt="Controls">
            <div class="screen-container">
                <button id="unmute-btn" onclick="toggleSoundButton()" class="unmute-button">
                    <img src="../assets/icon/unmute.png" alt="unmute">
                </button>
                <button id="mute-btn" onclick="toggleSoundButton()" class="unmute-button" style="display: none;">
                    <img src="../assets/icon/mute.png" alt="mute">
                </button>
            </div>
            <button class="button" onclick="startScreen()">BACK</button>
        </div>
    `;
}

