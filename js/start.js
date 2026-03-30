function mainScreen() {
    document.getElementById('game_container').innerHTML = mainScreenTemplate();
    // Setze den Sound-Button-Status basierend auf dem aktuellen Mute-Status
    updateSoundButtonState();
    initButtonHoverSounds();
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

    // Verstecke Settings-Button während des Ladens
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.style.display = 'none';
    }

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

            // Zeige Settings-Button wieder an
            const settingsBtn = document.getElementById('settings-btn');
            if (settingsBtn) {
                settingsBtn.style.display = 'flex';
            }

            window.soundManager.stopMusic('menuTheme');
            window.soundManager.playMusic('gameTheme');
            createLevel(level);
            world = new World(canvas, keyboard);

            // Initialisiere HTML-basierten Debug-Overlay
            if (typeof debugOverlay !== 'undefined') {
                debugOverlay.destroy();
            }
            window.debugOverlay = new DebugOverlay();
            window.debugOverlay.setWorld(world);

            keyboardActive = true;
            // Initialisiere Touch-Controls für mobile Geräte
            initTouchControls();
            // Initialisiere Button-Hover-Sounds für Overlay-Buttons
            initButtonHoverSounds();
        }
    );
}

function showInfoScreen() {
    document.getElementById('game_container').innerHTML = infoScreenTemplate();
    updateSoundButtonState();
    initButtonHoverSounds();
}

function showSettingsScreen() {
    document.getElementById('game_container').innerHTML = settingsScreenTemplate();
    updateSoundButtonState();
    initializeVolumeSliders();
    initButtonHoverSounds();
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

    if (window.soundManager && window.soundManager.muted) {
        // Sound ist aus, schalte ein
        if (unmuteBtn) unmuteBtn.style.display = 'none';
        if (muteBtn) muteBtn.style.display = 'block';
        enableSound();
    } else {
        // Sound ist an, schalte aus
        if (unmuteBtn) unmuteBtn.style.display = 'block';
        if (muteBtn) muteBtn.style.display = 'none';
        disableSound();
    }
    updateOverlayAudioToggleButton();
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
 * Zeigt das Audio Settings Overlay an
 */
function showAudioSettingsOverlay() {
    const audioOverlay = document.getElementById('audio-settings-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    if (audioOverlay && settingsOverlay) {
        settingsOverlay.classList.remove('active');
        audioOverlay.classList.add('active');
        initializeOverlayVolumeSliders();
    }
}

/**
 * Schließt das Audio Settings Overlay und zeigt das Menu Overlay wieder an
 */
function closeAudioSettingsOverlay() {
    const audioOverlay = document.getElementById('audio-settings-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    if (audioOverlay && settingsOverlay) {
        audioOverlay.classList.remove('active');
        settingsOverlay.classList.add('active');
    }
}

/**
 * Initialisiert die Volume-Slider im Audio Settings Overlay
 */
function initializeOverlayVolumeSliders() {
    if (window.soundManager) {
        const masterSlider = document.getElementById('overlay-master-volume');
        const musicSlider = document.getElementById('overlay-music-volume');
        const sfxSlider = document.getElementById('overlay-sfx-volume');

        if (masterSlider) {
            masterSlider.value = Math.round(window.soundManager.masterVolume * 100);
            document.getElementById('overlay-master-volume-value').textContent = masterSlider.value + '%';
        }
        if (musicSlider) {
            musicSlider.value = Math.round(window.soundManager.musicVolume * 100);
            document.getElementById('overlay-music-volume-value').textContent = musicSlider.value + '%';
        }
        if (sfxSlider) {
            sfxSlider.value = Math.round(window.soundManager.sfxVolume * 100);
            document.getElementById('overlay-sfx-volume-value').textContent = sfxSlider.value + '%';
        }
        updateOverlayAudioToggleButton();
    }
}

/**
 * Aktualisiert den Audio Toggle Button Text im Overlay
 */
function updateOverlayAudioToggleButton() {
    const toggleBtn = document.getElementById('overlay-audio-toggle-btn');
    if (toggleBtn && window.soundManager) {
        toggleBtn.textContent = window.soundManager.muted ? 'Sound: OFF' : 'Sound: ON';
    }
}

/**
 * Aktualisiert die Master-Lautstärke aus dem Overlay
 */
function updateOverlayMasterVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMasterVolume(value / 100);
        document.getElementById('overlay-master-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Aktualisiert die Musik-Lautstärke aus dem Overlay
 */
function updateOverlayMusicVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMusicVolume(value / 100);
        document.getElementById('overlay-music-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Aktualisiert die SFX-Lautstärke aus dem Overlay
 */
function updateOverlaySfxVolume(value) {
    if (window.soundManager) {
        window.soundManager.setSfxVolume(value / 100);
        document.getElementById('overlay-sfx-volume-value').textContent = value + '%';
        saveVolumeSettings();
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
 * oder initialisiert sie mit den Default-Werten aus dem SoundManager
 */
function loadVolumeSettings() {
    const saved = localStorage.getItem('elPoloLoco_volumeSettings');
    if (saved && window.soundManager) {
        const settings = JSON.parse(saved);
        // Prüfe ob master existiert und eine gültige Zahl ist, sonst verwende Default
        const masterVol = (typeof settings.master === 'number') ? settings.master : window.soundManager.masterVolume;
        const musicVol = (typeof settings.music === 'number') ? settings.music : window.soundManager.musicVolume;
        const sfxVol = (typeof settings.sfx === 'number') ? settings.sfx : window.soundManager.sfxVolume;
        window.soundManager.setMasterVolume(masterVol);
        window.soundManager.setMusicVolume(musicVol);
        window.soundManager.setSfxVolume(sfxVol);
    } else if (window.soundManager) {
        // Keine gespeicherten Einstellungen - speichere die aktuellen Default-Werte
        saveVolumeSettings();
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
