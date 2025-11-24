function startScreenTemplate() {
    return /*html*/`
        <div id="startscreen" class="startscreen">
            <div class="startscreen-controls">
                <button class="button" onclick="startGame()">START GAME</button>
                <button class="button" onclick="startGame()">INFO</button>
                <button class="button" onclick="showControlScreen()">CONTROLS</button>
            </div>
        </div>
    `;
}

function showCanvasTemplate() {
    return /*html*/`
    <canvas id="canvas" class="canvas" width="720" height="480"></canvas>
    `;
}

function controlsScreenTemplate() {
    return /*html*/`
        <div id="controls" class="controls">
            <div class="controls-text">
                <h2>Controls</h2>
                <p>Use the arrow keys to move and jump.</p>
            </div>
            <button class="button" onclick="startScreen()">BACK</button>
        </div>
    `;
}

