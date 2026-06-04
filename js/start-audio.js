/**
 * Audio and volume control functions for menu and in-game overlays.
 * @file start-audio.js
 */

/**
 * Enables sound output and starts the menu music.
 */
function enableSound() {
    window.soundManager.unmuteAll();
    window.soundManager.playMusic('menuTheme');
}

/**
 * Mutes all sound output.
 */
function disableSound() {
    window.soundManager.muteAll();
}

/**
 * Toggles the sound mute state and updates all audio UI elements.
 */
function toggleSoundButton() {
    const unmuteBtn = document.getElementById('unmute-btn');
    const muteBtn = document.getElementById('mute-btn');
    if (window.soundManager && window.soundManager.muted) {
        if (unmuteBtn) unmuteBtn.style.display = 'none';
        if (muteBtn) muteBtn.style.display = 'block';
        enableSound();
    } else {
        if (unmuteBtn) unmuteBtn.style.display = 'block';
        if (muteBtn) muteBtn.style.display = 'none';
        disableSound();
    }
    updateOverlayAudioToggleButton();
}

/**
 * Synchronizes the sound button visibility with the current mute state.
 */
function updateSoundButtonState() {
    const unmuteBtn = document.getElementById('unmute-btn');
    const muteBtn = document.getElementById('mute-btn');
    if (unmuteBtn && muteBtn && window.soundManager) {
        if (window.soundManager.muted) {
            unmuteBtn.style.display = 'block';
            muteBtn.style.display = 'none';
        } else {
            unmuteBtn.style.display = 'none';
            muteBtn.style.display = 'block';
        }
    }
}

/**
 * Updates the master volume from the settings screen slider.
 * @param {number} value - Volume percentage (0–100)
 */
function updateMasterVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMasterVolume(value / 100);
        document.getElementById('master-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates the music volume from the settings screen slider.
 * @param {number} value - Volume percentage (0–100)
 */
function updateMusicVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMusicVolume(value / 100);
        document.getElementById('music-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates the SFX volume from the settings screen slider.
 * @param {number} value - Volume percentage (0–100)
 */
function updateSfxVolume(value) {
    if (window.soundManager) {
        window.soundManager.setSfxVolume(value / 100);
        document.getElementById('sfx-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates the master volume from the in-game overlay slider.
 * @param {number} value - Volume percentage (0–100)
 */
function updateOverlayMasterVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMasterVolume(value / 100);
        document.getElementById('overlay-master-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates the music volume from the in-game overlay slider.
 * @param {number} value - Volume percentage (0–100)
 */
function updateOverlayMusicVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMusicVolume(value / 100);
        document.getElementById('overlay-music-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates the SFX volume from the in-game overlay slider.
 * @param {number} value - Volume percentage (0–100)
 */
function updateOverlaySfxVolume(value) {
    if (window.soundManager) {
        window.soundManager.setSfxVolume(value / 100);
        document.getElementById('overlay-sfx-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Persists the current volume settings to localStorage.
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
 * Restores volume settings from localStorage and applies them.
 */
function loadVolumeSettings() {
    const saved = localStorage.getItem('elPoloLoco_volumeSettings');
    if (saved && window.soundManager) {
        const settings = JSON.parse(saved);
        const masterVol = (typeof settings.master === 'number') ? settings.master : window.soundManager.masterVolume;
        const musicVol = (typeof settings.music === 'number') ? settings.music : window.soundManager.musicVolume;
        const sfxVol = (typeof settings.sfx === 'number') ? settings.sfx : window.soundManager.sfxVolume;
        window.soundManager.setMasterVolume(masterVol);
        window.soundManager.setMusicVolume(musicVol);
        window.soundManager.setSfxVolume(sfxVol);
    } else if (window.soundManager) {
        saveVolumeSettings();
    }
}

/**
 * Initializes all volume sliders on the settings screen with saved values.
 */
function initializeVolumeSliders() {
    if (!window.soundManager) return;
    initMasterSlider();
    initMusicSlider();
    initSfxSlider();
}

/**
 * Sets the master volume slider to the current volume value.
 */
function initMasterSlider() {
    const slider = document.getElementById('master-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.masterVolume * 100);
        document.getElementById('master-volume-value').textContent = slider.value + '%';
    }
}

/**
 * Sets the music volume slider to the current volume value.
 */
function initMusicSlider() {
    const slider = document.getElementById('music-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.musicVolume * 100);
        document.getElementById('music-volume-value').textContent = slider.value + '%';
    }
}

/**
 * Sets the SFX volume slider to the current volume value.
 */
function initSfxSlider() {
    const slider = document.getElementById('sfx-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.sfxVolume * 100);
        document.getElementById('sfx-volume-value').textContent = slider.value + '%';
    }
}

/**
 * Initializes all volume sliders on the in-game audio overlay with saved values.
 */
function initializeOverlayVolumeSliders() {
    if (!window.soundManager) return;
    initOverlayMasterSlider();
    initOverlayMusicSlider();
    initOverlaySfxSlider();
    updateOverlayAudioToggleButton();
}

/**
 * Sets the overlay master volume slider to the current volume value.
 */
function initOverlayMasterSlider() {
    const slider = document.getElementById('overlay-master-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.masterVolume * 100);
        document.getElementById('overlay-master-volume-value').textContent = slider.value + '%';
    }
}

/**
 * Sets the overlay music volume slider to the current volume value.
 */
function initOverlayMusicSlider() {
    const slider = document.getElementById('overlay-music-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.musicVolume * 100);
        document.getElementById('overlay-music-volume-value').textContent = slider.value + '%';
    }
}

/**
 * Sets the overlay SFX volume slider to the current volume value.
 */
function initOverlaySfxSlider() {
    const slider = document.getElementById('overlay-sfx-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.sfxVolume * 100);
        document.getElementById('overlay-sfx-volume-value').textContent = slider.value + '%';
    }
}

/**
 * Updates the overlay audio toggle button text to reflect the current mute state.
 */
function updateOverlayAudioToggleButton() {
    const toggleBtn = document.getElementById('overlay-audio-toggle-btn');
    if (toggleBtn && window.soundManager) {
        toggleBtn.textContent = window.soundManager.muted ? 'Sound: OFF' : 'Sound: ON';
    }
}
