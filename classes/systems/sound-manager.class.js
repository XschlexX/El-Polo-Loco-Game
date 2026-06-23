/**
 * Manages all game audio including music, sound effects, and volume control.
 * Supports per-category volume, mute/unmute, and a shared global sound cache.
 */
class SoundManager {
    sounds = {};
    loopSounds = ['menuTheme', 'gameTheme', 'characterRun', 'characterSleep', 'endbossAngry'];
    muted = true;

    masterVolume = 1.0;
    musicVolume = 0.5;
    sfxVolume = 0.5;

    musicSounds = ['menuTheme', 'gameTheme'];

    /** @type {Object.<string, HTMLAudioElement>} Shared audio cache across all SoundManager instances */
    static globalSoundCache = {};

    constructor() {
        this.initializeSounds();
        this.applyVolumeSettings();
        this.initializeVolumeSettings();
    }

    /**
     * Initializes volume settings in localStorage.
     * Saves default values only if no settings exist yet.
     */
    initializeVolumeSettings() {
        const existing = localStorage.getItem('elPoloLoco_volumeSettings');
        if (!existing) {
            const settings = {
                master: this.masterVolume,
                music: this.musicVolume,
                sfx: this.sfxVolume
            };
            localStorage.setItem('elPoloLoco_volumeSettings', JSON.stringify(settings));
        }
    }

    /**
     * Loads all game sounds.
     */
    initializeSounds() {
        this.addSound('menuTheme', 'sounds/music/menu-theme.mp3', 1.0);
        this.addSound('gameTheme', 'sounds/music/game-theme.mp3', 1.0);
        this.addSound('characterSleep', 'sounds/effects/character/character-sleep.mp3', 1.0);
        this.addSound('characterJump', 'sounds/effects/character/character-jump.mp3', 0.3);
        this.addSound('characterLand', 'sounds/effects/character/character-land.mp3', 1.0);
        this.addSound('characterRun', 'sounds/effects/character/character-run.mp3', 1.0);
        this.addSound('characterHurt', 'sounds/effects/character/character-hurt.mp3', 1.0);
        this.addSound('characterDead', 'sounds/effects/character/character-dead.mp3', 1.0);
        this.addSound('chickenDead', 'sounds/effects/enemies/chicken-dead.mp3', 1.0);
        this.addSound('chickenSmallDead', 'sounds/effects/enemies/chicken-small-dead.mp3', 1.0);
        this.addSound('bottleCollect', 'sounds/effects/bottle-collect.mp3', 1.0);
        this.addSound('bottleThrow', 'sounds/effects/bottle-throw.mp3', 1.0);
        this.addSound('bottleSplash', 'sounds/effects/bottle-splash.mp3', 1.0);
        this.addSound('coinCollect', 'sounds/effects/coin-collect.mp3', 1.0);
        this.addSound('endbossHurt', 'sounds/effects/enemies/endboss-hurt.mp3', 1.0);
        this.addSound('endbossAngry', 'sounds/effects/enemies/endboss-angry.mp3', 1.0);
        this.addSound('endbossDead', 'sounds/effects/enemies/endboss-dead.mp3', 0.5);
        this.addSound('youWon', 'sounds/win-lose/win-sound.mov', 1.0);
        this.addSound('youLost', 'sounds/win-lose/lose-sound.wav', 1.0);
        this.addSound('buttonHover', 'sounds/effects/button/button-hover.mp3', 1.0);
    }

    /**
     * Adds a sound to the manager, using the global cache if available.
     * @param {string} name - Identifier for the sound
     * @param {string} path - Path to the audio file
     * @param {number} [volume=1.0] - Playback volume (0.0 - 1.0)
     */
    addSound(name, path, volume = 1.0) {
        if (SoundManager.globalSoundCache[path]) {
            this.sounds[name] = SoundManager.globalSoundCache[path];
        } else {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = volume;
            this.sounds[name] = audio;
            SoundManager.globalSoundCache[path] = audio;
        }
    }

    /**
     * Plays a sound by name.
     * @param {string} name - Identifier of the sound to play
     * @param {boolean} [restart=true] - Whether to restart the sound from the beginning
     */
    play(name, restart = true) {
        if (this.muted) return;
        if (!this.sounds[name]) {
            console.warn(`Sound "${name}" nicht gefunden`);
            return;
        }
        this.executePlay(name, restart);
    }

    /**
     * Executes the actual playback and handles playback errors.
     * @param {string} name - Identifier of the sound to play
     * @param {boolean} restart - Whether to restart the sound from the beginning
     */
    executePlay(name, restart) {
        const sound = this.sounds[name];
        if (restart) {
            sound.currentTime = 0;
        }
        sound.play().catch(err => {
            if (err.name !== 'NotAllowedError') {
                console.warn(`Fehler beim Abspielen von "${name}":`, err);
            }
        });
    }

    /**
     * Plays music in a continuous loop.
     * @param {string} name - Identifier of the music track
     */
    playMusic(name) {
        const sound = this.sounds[name];
        sound.loop = true;
        this.play(name, false);
    }

    /**
     * Stops music and resets playback position to the beginning.
     * @param {string} name - Identifier of the music track
     */
    stopMusic(name) {
        const sound = this.sounds[name];
        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * Pauses music while preserving the current playback position.
     * @param {string} name - Identifier of the music track
     */
    pauseMusic(name) {
        this.sounds[name].pause();
    }

    /**
     * Resumes previously paused music.
     * @param {string} name - Identifier of the music track
     */
    resumeMusic(name) {
        const sound = this.sounds[name];
        sound.loop = true;
        this.play(name, false);
    }

    /**
     * Mutes all sounds and sets the muted flag to true.
     */
    muteAll() {
        this.muted = true;
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
        });
    }

    /**
     * Stops all sounds without changing the muted flag.
     * Used when the game ends.
     */
    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Unmutes all sounds and reapplies volume settings.
     */
    unmuteAll() {
        this.muted = false;
        this.applyVolumeSettings();
    }

    /**
     * Pauses all currently playing sounds.
     * Used for the settings overlay.
     */
    pauseAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
        });
    }

    /**
     * Resumes loop sounds that were previously playing.
     * Only loop sounds (gameTheme, characterRun, endbossAngry) are resumed;
     * short effect sounds are not restored.
     */
    resumeAllSounds() {
        if (this.muted) return;

        Object.keys(this.sounds).forEach(soundName => {
            if (this.loopSounds.includes(soundName)) {
                const sound = this.sounds[soundName];
                if (sound.currentTime > 0 && sound.paused) {
                    sound.play().catch(err => {
                        console.warn(`Fehler beim Fortsetzen:`, err);
                    });
                }
            }
        });
    }

    /**
     * Calculates the final volume for a sound based on category and master volume.
     * @param {string} soundName - Identifier of the sound
     * @param {number} baseVolume - Base volume of the sound
     * @returns {number} Final computed volume
     */
    getFinalVolume(soundName, baseVolume) {
        const isMusic = this.musicSounds.includes(soundName);
        const categoryVolume = isMusic ? this.musicVolume : this.sfxVolume;
        return baseVolume * this.masterVolume * categoryVolume;
    }

    /**
     * Sets the master volume level.
     * @param {number} volume - Volume level (0.0 - 1.0)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Sets the music category volume level.
     * @param {number} volume - Volume level (0.0 - 1.0)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Sets the sound effects category volume level.
     * @param {number} volume - Volume level (0.0 - 1.0)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Applies current volume settings to all loaded sounds.
     * Caches base volumes on the first call.
     */
    applyVolumeSettings() {
        if (!this.baseVolumes) {
            this.baseVolumes = {};
            Object.keys(this.sounds).forEach(name => {
                this.baseVolumes[name] = this.sounds[name].volume;
            });
        }

        Object.keys(this.sounds).forEach(name => {
            const baseVolume = this.baseVolumes[name] || 1.0;
            const finalVolume = this.getFinalVolume(name, baseVolume);
            this.sounds[name].volume = finalVolume;
        });
    }
}
