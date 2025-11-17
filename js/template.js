function startScreenTemplate() {
    return /*html*/`
        <div id="startscreen" class="startscreen">
            <img class="startscreen-img" src="../assets/img/9_intro_outro_screens/start/startscreen_2.png">
            <button onclick="startGame()">START GAME</button>
        </div>
    `;
}

function showCanvasTemplate() {
    return /*html*/`
    <canvas id="canvas" class="canvas" width="720" height="480"></canvas>
    `;
}

