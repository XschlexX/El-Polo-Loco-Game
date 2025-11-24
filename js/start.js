function startScreen() {
    document.getElementById('canvas_container').innerHTML = startScreenTemplate();
}

function startGame() {
    document.getElementById('canvas_container').innerHTML = showCanvasTemplate();
    canvas = document.getElementById('canvas');
    createLevel1();
    world = new World(canvas, keyboard);
}

function showControlScreen() {
    document.getElementById('canvas_container').innerHTML = controlsScreenTemplate();
}
