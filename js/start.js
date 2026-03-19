function mainScreen() {
    document.getElementById('game_container').innerHTML = mainScreenTemplate();
    // Setze den Sound-Button-Status basierend auf dem aktuellen Mute-Status
    updateSoundButtonState();
}

function updateSoundButtonState() {
    const unmuteBtn = document.getElementById('unmute-btn');
    const muteBtn = document.getElementById('mute-btn');

    if (unmuteBtn && muteBtn && window.soundManager) {
        if (window.soundManager.muted) {
            // Sound ist gemutet -> zeige Unmute-Button (zum Einschalten)
            unmuteBtn.style.display = 'block';
            muteBtn.style.display = 'none';
        } else {
            // Sound ist an -> zeige Mute-Button (zum Ausschalten)
            unmuteBtn.style.display = 'none';
            muteBtn.style.display = 'block';
        }
    }
}

function startGame(level = 1) {
    // Aktualisiere globale Level-Variablen
    currentLevelNumber = level;

    // 1. Stoppe altes Spiel komplett (falls vorhanden)
    // Dies verhindert, dass Intervalle der alten World weiterlaufen
    if (world) {
        world.stopGame();
        world = null;  // Referenz löschen für Garbage Collection
    }

    // Zeige Loading Screen
    document.getElementById('game_container').innerHTML = showCanvasTemplate() + loadingScreenTemplate();
    canvas = document.getElementById('canvas');

    // Erstelle SoundManager falls nicht vorhanden
    if (!window.soundManager) {
        window.soundManager = new SoundManager();
    }

    // Starte Asset Loading
    const assetLoader = new AssetLoader();
    assetLoader.loadAll(
        // onProgress Callback
        (loaded, total, percentage) => {
            const progressElement = document.getElementById('loading-progress');
            if (progressElement) {
                progressElement.textContent = `${percentage}%`;
            }
        },
        // onComplete Callback
        () => {
            // Alle Assets geladen - starte das Spiel
            document.getElementById('loading-screen').style.display = 'none';
            window.soundManager.stopMusic('menuTheme');
            window.soundManager.playMusic('gameTheme');
            createLevel(level);
            world = new World(canvas, keyboard);
            keyboardActive = true;
            // Initialisiere Touch-Controls für mobile Geräte
            initTouchControls();
        }
    );
}

function showInfoScreen() {
    document.getElementById('game_container').innerHTML = infoScreenTemplate();
    updateSoundButtonState();
}

function showSettingsScreen() {
    document.getElementById('game_container').innerHTML = settingsScreenTemplate();
    updateSoundButtonState();
    initializeVolumeSliders();
}

function showYouWonScreen(delay = 0) {
    setTimeout(() => {
        // Stoppe das komplette Spiel (Intervals + Keyboard + Sound-Effekte)
        if (window.world) {
            window.world.stopGame();
        }

        // Zeige HTML Victory-Overlay
        showHtmlVictoryOverlay();

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
        }

        // Zeige HTML Defeat-Overlay
        showHtmlDefeatOverlay();

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

/**
 * Toggle das Settings-Menü (wird vom HTML Settings Button aufgerufen)
 */
function toggleSettingsMenu() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) {
        if (overlay.classList.contains('active')) {
            hideHtmlSettingsOverlay();
        } else {
            showHtmlSettingsOverlay();
        }
    }
}

/**
 * Zeigt das HTML Settings Overlay an
 */
function showHtmlSettingsOverlay() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay && window.world) {
        overlay.classList.add('active');
        updateSettingsSoundButtonText();
        window.world.pauseGame();
    }
}

/**
 * Versteckt das HTML Settings Overlay
 */
function hideHtmlSettingsOverlay() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay && window.world) {
        overlay.classList.remove('active');
        window.world.resumeGame();
    }
}

/**
 * Aktualisiert den Sound-Button Text im Settings Overlay
 */
function updateSettingsSoundButtonText() {
    const soundBtn = document.getElementById('settings-sound-btn');
    if (soundBtn && window.soundManager) {
        soundBtn.textContent = window.soundManager.muted ? 'Sound: OFF' : 'Sound: ON';
    }
}

/**
 * Toggle Sound aus dem Settings Overlay
 */
function toggleSettingsSound() {
    if (window.soundManager) {
        if (window.soundManager.muted) {
            window.soundManager.unmuteAll();
            window.soundManager.playMusic('menuTheme');
        } else {
            window.soundManager.muteAll();
        }
        updateSettingsSoundButtonText();
    }
}

/**
 * Startet das Spiel neu aus dem Overlay
 */
function restartGameFromOverlay() {
    hideHtmlSettingsOverlay();
    startGame();
}

/**
 * Beendet das Spiel und geht zum Hauptmenü
 */
function exitToMainMenu() {
    // Stoppe das Spiel komplett bevor zum Hauptmenü gewechselt wird
    if (window.world) {
        window.world.stopGame();
        window.world = null;
    }
    hideHtmlSettingsOverlay();
    hideHtmlVictoryOverlay();
    hideHtmlDefeatOverlay();
    mainScreen();
    if (window.soundManager) {
        window.soundManager.playMusic('menuTheme');
    }
}

/**
 * Setzt das Spiel fort aus dem Overlay
 */
function resumeGameFromOverlay() {
    hideHtmlSettingsOverlay();
}

/**
 * Zeigt das HTML Victory Overlay an
 */
function showHtmlVictoryOverlay() {
    const overlay = document.getElementById('victory-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

/**
 * Versteckt das HTML Victory Overlay
 */
function hideHtmlVictoryOverlay() {
    const overlay = document.getElementById('victory-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * Startet das nächste Level aus dem Overlay
 */
function nextLevelFromOverlay() {
    hideHtmlVictoryOverlay();
    currentLevelNumber++;
    startGame(currentLevelNumber);
}

/**
 * Zeigt das HTML Defeat Overlay an
 */
function showHtmlDefeatOverlay() {
    const overlay = document.getElementById('defeat-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

/**
 * Versteckt das HTML Defeat Overlay
 */
function hideHtmlDefeatOverlay() {
    const overlay = document.getElementById('defeat-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * Versucht das Level erneut aus dem Overlay
 */
function tryAgainFromOverlay() {
    hideHtmlDefeatOverlay();
    startGame();
}

/**
 * Aktualisiert die Master-Lautstärke
 * @param {number} value - Lautstärke-Wert (0-100)
 */
function updateMasterVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMasterVolume(value / 100);
        document.getElementById('master-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Aktualisiert die Musik-Lautstärke
 * @param {number} value - Lautstärke-Wert (0-100)
 */
function updateMusicVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMusicVolume(value / 100);
        document.getElementById('music-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Aktualisiert die SFX-Lautstärke
 * @param {number} value - Lautstärke-Wert (0-100)
 */
function updateSfxVolume(value) {
    if (window.soundManager) {
        window.soundManager.setSfxVolume(value / 100);
        document.getElementById('sfx-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Speichert die Volume-Einstellungen im localStorage
 */
function saveVolumeSettings() {
    if (window.soundManager) {
        const settings = {
            master: window.soundManager.masterVolume,
            music: window.soundManager.musicVolume,
            sfx: window.soundManager.sfxVolume
        };
        localStorage.setItem('elPoloLoco_volumeSettings', JSON.stringify(settings));
    }
}

/**
 * Lädt die Volume-Einstellungen aus dem localStorage
 */
function loadVolumeSettings() {
    const saved = localStorage.getItem('elPoloLoco_volumeSettings');
    if (saved && window.soundManager) {
        const settings = JSON.parse(saved);
        window.soundManager.setMasterVolume(settings.master || 1.0);
        window.soundManager.setMusicVolume(settings.music || 1.0);
        window.soundManager.setSfxVolume(settings.sfx || 1.0);
    }
}

/**
 * Initialisiert die Volume-Slider mit den gespeicherten Werten
 */
function initializeVolumeSliders() {
    if (window.soundManager) {
        const masterSlider = document.getElementById('master-volume');
        const musicSlider = document.getElementById('music-volume');
        const sfxSlider = document.getElementById('sfx-volume');

        if (masterSlider) {
            masterSlider.value = Math.round(window.soundManager.masterVolume * 100);
            document.getElementById('master-volume-value').textContent = masterSlider.value + '%';
        }
        if (musicSlider) {
            musicSlider.value = Math.round(window.soundManager.musicVolume * 100);
            document.getElementById('music-volume-value').textContent = musicSlider.value + '%';
        }
        if (sfxSlider) {
            sfxSlider.value = Math.round(window.soundManager.sfxVolume * 100);
            document.getElementById('sfx-volume-value').textContent = sfxSlider.value + '%';
        }
    }
}
