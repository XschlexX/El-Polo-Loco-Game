function startScreen() {
    document.getElementById('game_container').innerHTML = startScreenTemplate();
}

function startGame() {
    document.getElementById('game_container').innerHTML = showCanvasTemplate();
    canvas = document.getElementById('canvas');
    // Erstelle SoundManager falls nicht vorhanden
    if (!window.soundManager) {
        window.soundManager = new SoundManager();
    }
    window.soundManager.stopMusic('menuTheme');
    window.soundManager.playMusic('gameTheme');
    createLevel1();
    world = new World(canvas, keyboard);
}

function showInfoScreen() {
    document.getElementById('game_container').innerHTML = infoScreenTemplate();
}

function showControlScreen() {
    document.getElementById('game_container').innerHTML = controlsScreenTemplate();
}

function enableSound() {
    window.soundManager.playMusic('menuTheme');

    // Button ausblenden nach dem Klick
    const button = document.querySelector('.unmute-button');
    if (button) {
        button.style.display = 'none';
    }
}
