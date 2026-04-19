/**
 * Audio and volume control functions
 * @file start-audio.js
 */

/** Enables sound and starts menu music */
function enableSound() {
    window.soundManager.unmuteAll();
    window.soundManager.playMusic('menuTheme');
}

/** Disables sound */
function disableSound() {
    window.soundManager.muteAll();
}

/** Toggles sound button state and updates UI */
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

/** Updates sound button visibility based on mute state */
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
 * Updates master volume
 * @param {number} value - Volume value (0-100)
 */
function updateMasterVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMasterVolume(value / 100);
        document.getElementById('master-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates music volume
 * @param {number} value - Volume value (0-100)
 */
function updateMusicVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMusicVolume(value / 100);
        document.getElementById('music-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates SFX volume
 * @param {number} value - Volume value (0-100)
 */
function updateSfxVolume(value) {
    if (window.soundManager) {
        window.soundManager.setSfxVolume(value / 100);
        document.getElementById('sfx-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates master volume from overlay
 * @param {number} value - Volume value (0-100)
 */
function updateOverlayMasterVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMasterVolume(value / 100);
        document.getElementById('overlay-master-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates music volume from overlay
 * @param {number} value - Volume value (0-100)
 */
function updateOverlayMusicVolume(value) {
    if (window.soundManager) {
        window.soundManager.setMusicVolume(value / 100);
        document.getElementById('overlay-music-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/**
 * Updates SFX volume from overlay
 * @param {number} value - Volume value (0-100)
 */
function updateOverlaySfxVolume(value) {
    if (window.soundManager) {
        window.soundManager.setSfxVolume(value / 100);
        document.getElementById('overlay-sfx-volume-value').textContent = value + '%';
        saveVolumeSettings();
    }
}

/** Saves volume settings to localStorage */
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

/** Loads volume settings from localStorage */
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

/** Initializes volume sliders with saved values */
function initializeVolumeSliders() {
    if (!window.soundManager) return;
    initMasterSlider();
    initMusicSlider();
    initSfxSlider();
}

/** Initializes master volume slider */
function initMasterSlider() {
    const slider = document.getElementById('master-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.masterVolume * 100);
        document.getElementById('master-volume-value').textContent = slider.value + '%';
    }
}

/** Initializes music volume slider */
function initMusicSlider() {
    const slider = document.getElementById('music-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.musicVolume * 100);
        document.getElementById('music-volume-value').textContent = slider.value + '%';
    }
}

/** Initializes SFX volume slider */
function initSfxSlider() {
    const slider = document.getElementById('sfx-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.sfxVolume * 100);
        document.getElementById('sfx-volume-value').textContent = slider.value + '%';
    }
}

/** Initializes overlay volume sliders */
function initializeOverlayVolumeSliders() {
    if (!window.soundManager) return;
    initOverlayMasterSlider();
    initOverlayMusicSlider();
    initOverlaySfxSlider();
    updateOverlayAudioToggleButton();
}

/** Initializes overlay master volume slider */
function initOverlayMasterSlider() {
    const slider = document.getElementById('overlay-master-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.masterVolume * 100);
        document.getElementById('overlay-master-volume-value').textContent = slider.value + '%';
    }
}

/** Initializes overlay music volume slider */
function initOverlayMusicSlider() {
    const slider = document.getElementById('overlay-music-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.musicVolume * 100);
        document.getElementById('overlay-music-volume-value').textContent = slider.value + '%';
    }
}

/** Initializes overlay SFX volume slider */
function initOverlaySfxSlider() {
    const slider = document.getElementById('overlay-sfx-volume');
    if (slider) {
        slider.value = Math.round(window.soundManager.sfxVolume * 100);
        document.getElementById('overlay-sfx-volume-value').textContent = slider.value + '%';
    }
}

/** Updates overlay audio toggle button text */
function updateOverlayAudioToggleButton() {
    const toggleBtn = document.getElementById('overlay-audio-toggle-btn');
    if (toggleBtn && window.soundManager) {
        toggleBtn.textContent = window.soundManager.muted ? 'Sound: OFF' : 'Sound: ON';
    }
}
