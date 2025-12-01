function startScreen() {
    document.getElementById('game_container').innerHTML = startScreenTemplate();
}

function startGame() {
    document.getElementById('game_container').innerHTML = showCanvasTemplate();
    canvas = document.getElementById('canvas');
    createLevel1();
    world = new World(canvas, keyboard);
}

function showInfoScreen() {
    document.getElementById('game_container').innerHTML = infoScreenTemplate();
}

function showControlScreen() {
    document.getElementById('game_container').innerHTML = controlsScreenTemplate();
}
