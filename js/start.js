function mainScreen() {
    document.getElementById('game_container').innerHTML = mainScreenTemplate();
    // document.getElementById('game_container').innerHTML = youWonScreenTemplate();
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
    keyboardActive = true;
}

function showInfoScreen() {
    document.getElementById('game_container').innerHTML = infoScreenTemplate();
}

function showControlScreen() {
    document.getElementById('game_container').innerHTML = controlsScreenTemplate();
}

function showYouWonScreen(delay = 0) {
    setTimeout(() => {
        // Stoppe das komplette Spiel (Intervals + Keyboard + Sound-Effekte)
        if (window.world) {
            window.world.stopGame();
            // Zeige Victory-Overlay auf dem Canvas
            window.world.victoryOverlay.show();
        }

        // Starte Win-Sound NACH dem Stoppen (nur wenn nicht gemutet)
        if (window.soundManager && !window.soundManager.muted) {
            window.soundManager.play('youWon');
        }
    }, delay);
}

function showYouLostScreen(delay = 0) {
    setTimeout(() => {
        // Stoppe das komplette Spiel (Intervals + Keyboard + Sound-Effekte)
        if (window.world) {
            window.world.stopGame();
            // Zeige Defeat-Overlay auf dem Canvas
            window.world.defeatOverlay.show();
        }

        // Starte Lose-Sound NACH dem Stoppen (nur wenn nicht gemutet)
        if (window.soundManager && !window.soundManager.muted) {
            window.soundManager.play('youLost');
        }
    }, delay);
}

function enableSound() {
    window.soundManager.unmuteAll();
    window.soundManager.playMusic('menuTheme');
}

function disableSound() {
    window.soundManager.muteAll();
}

function toggleSoundButton() {
    const unmuteBtn = document.getElementById('unmute-btn');
    const muteBtn = document.getElementById('mute-btn');

    if (unmuteBtn.style.display === 'none') {
        // Mute-Button ist sichtbar, switch to Unmute
        unmuteBtn.style.display = 'block';
        muteBtn.style.display = 'none';
        disableSound();
    } else {
        // Unmute-Button ist sichtbar, switch to Mute
        unmuteBtn.style.display = 'none';
        muteBtn.style.display = 'block';
        enableSound();
    }
}
