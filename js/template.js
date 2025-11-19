function startScreenTemplate() {
    return /*html*/`
        <div id="startscreen" class="startscreen">
            <div class="startscreen-controls">
                <button class="button" onclick="startGame()">START GAME</button>
                <button class="button" onclick="startGame()">CONTROLS</button>
                <button class="button" onclick="startGame()">INFO</button>
            </div>
        </div>
    `;
}

function showCanvasTemplate() {
    return /*html*/`
    <canvas id="canvas" class="canvas" width="720" height="480"></canvas>
    `;
}

