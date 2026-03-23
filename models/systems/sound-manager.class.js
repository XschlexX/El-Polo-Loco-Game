class SoundManager {
    sounds = {}; // Hier werden alle Sounds gespeichert: { 'jump': Audio-Objekt, 'hurt': Audio-Objekt }
    loopSounds = ['menuTheme', 'gameTheme', 'characterRun', 'characterSleep', 'endbossAngry']; // Liste der Loop-Sounds
    muted = true; // Sound-Status: true = stumm (Standard), false = an

    // Volume-Einstellungen (0.0 - 1.0)
    masterVolume = 1.0;
    musicVolume = 0.5;
    sfxVolume = 0.5;

    // Musik-Sounds (werden mit musicVolume multipliziert)
    musicSounds = ['menuTheme', 'gameTheme'];

    // Globaler Sound-Cache für alle SoundManager Instanzen
    static globalSoundCache = {};

    constructor() {
        this.initializeSounds();
        this.applyVolumeSettings();
        this.initializeVolumeSettings();
    }

    /**
     * Initialisiert die Volume-Einstellungen im localStorage
     * Speichert die Default-Werte nur wenn noch keine Einstellungen existieren
     */
    initializeVolumeSettings() {
        // Prüfe ob bereits Einstellungen im localStorage existieren
        const existing = localStorage.getItem('elPoloLoco_volumeSettings');
        if (!existing) {
            // Speichere aktuelle Default-Werte
            const settings = {
                master: this.masterVolume,
                music: this.musicVolume,
                sfx: this.sfxVolume
            };
            localStorage.setItem('elPoloLoco_volumeSettings', JSON.stringify(settings));
        }
    }

    /**
     * Lädt alle Sounds des Spiels
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
        this.addSound('endbossDead', 'sounds/effects/enemies/endboss-dead.mp3', 0.6);
        this.addSound('youWon', 'sounds/win-lose/win-sound.mov', 1.0);
        this.addSound('youLost', 'sounds/win-lose/lose-sound.wav', 1.0);
        this.addSound('buttonHover', 'sounds/effects/button/button-hover.mp3', 1.0);
    }

    /**
     * Fügt einen Sound hinzu
     * @param {string} name - Name des Sounds
     * @param {string} path - Pfad zur Sound-Datei
     * @param {number} volume - Lautstärke (0.0 - 1.0), Standard: 1.0
     */
    addSound(name, path, volume = 1.0) {
        // Prüfe ob der Sound bereits im globalen Cache ist
        if (SoundManager.globalSoundCache[path]) {
            this.sounds[name] = SoundManager.globalSoundCache[path];
        } else {
            const audio = new Audio(path);
            audio.preload = 'auto'; // Lädt Sound im Voraus
            audio.volume = volume;  // Setze Lautstärke
            this.sounds[name] = audio;
            SoundManager.globalSoundCache[path] = audio;
        }
    }

    /**
     * Spielt einen Sound ab
     * @param {string} name - Name des Sounds
     * @param {boolean} restart - Sound von vorne starten?
     */
    play(name, restart = true) {
        if (this.muted) return; // Wenn stumm, nicht abspielen

        if (!this.sounds[name]) {
            console.warn(`Sound "${name}" nicht gefunden`);
            return;
        }

        const sound = this.sounds[name];
        if (restart) {
            sound.currentTime = 0; // Startet von vorne
        }
        sound.play().catch(err => {
            console.warn(`Fehler beim Abspielen von "${name}":`, err);
        });
    }

    /**
     * Spielt Musik in einer Endlosschleife
     * @param {string} name - Name der Musik
     */
    playMusic(name) {
        // if (!this.sounds[name]) {
        //     console.warn(`Sound "${name}" nicht gefunden`);
        //     return;
        // }

        const sound = this.sounds[name];
        sound.loop = true;
        this.play(name, false);  // Nutzt play() ohne restart!
    }

    /**
     * Stoppt Musik (zurück zum Anfang)
     * @param {string} name - Name der Musik
     */
    stopMusic(name) {
        // if (!this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * Pausiert Musik (Position bleibt erhalten)
     * @param {string} name - Name der Musik
     */
    pauseMusic(name) {
        // if (!this.sounds[name]) return;
        this.sounds[name].pause();
    }

    /**
     * Setzt pausierte Musik fort
     * @param {string} name - Name der Musik
     */
    resumeMusic(name) {
        // if (!this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.loop = true;
        this.play(name, false);  // Nutzt play() ohne restart!
    }

    /**
     * Deaktiviert alle Sounds und setzt muted-Status
     */
    muteAll() {
        this.muted = true;
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            // sound.currentTime = 0;
        });
    }

    /**
     * Stoppt alle Sounds ohne muted-Status zu ändern (für Spielende)
     */
    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Aktiviert alle Sounds wieder
     */
    unmuteAll() {
        this.muted = false;
        this.applyVolumeSettings();
    }

    /**
     * Pausiert alle Sounds (für Settings-Overlay)
     */
    pauseAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
        });
    }

    /**
     * Setzt alle Sounds fort die vorher liefen
     * Nur Loop-Sounds (gameTheme, characterRun, endbossAngry) werden fortgesetzt
     * Kurze Effekt-Sounds (bottleCollect, bottleThrow, etc.) werden NICHT fortgesetzt
     */
    resumeAllSounds() {
        if (this.muted) return; // Wenn stumm, nicht fortsetzen

        Object.keys(this.sounds).forEach(soundName => {
            // Nur Loop-Sounds fortsetzen!
            if (this.loopSounds.includes(soundName)) {
                const sound = this.sounds[soundName];
                // Nur fortsetzen wenn Sound vorher gespielt wurde (currentTime > 0)
                // UND wenn er pausiert ist
                if (sound.currentTime > 0 && sound.paused) {
                    sound.play().catch(err => {
                        console.warn(`Fehler beim Fortsetzen:`, err);
                    });
                }
            }
        });
    }

    /**
     * Berechnet die finale Lautstärke für einen Sound
     * @param {string} soundName - Name des Sounds
     * @param {number} baseVolume - Basis-Lautstärke des Sounds
     * @returns {number} - Finale Lautstärke
     */
    getFinalVolume(soundName, baseVolume) {
        const isMusic = this.musicSounds.includes(soundName);
        const categoryVolume = isMusic ? this.musicVolume : this.sfxVolume;
        return baseVolume * this.masterVolume * categoryVolume;
    }

    /**
     * Setzt die Master-Lautstärke
     * @param {number} volume - Lautstärke (0.0 - 1.0)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Setzt die Musik-Lautstärke
     * @param {number} volume - Lautstärke (0.0 - 1.0)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Setzt die SFX-Lautstärke
     * @param {number} volume - Lautstärke (0.0 - 1.0)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.applyVolumeSettings();
    }

    /**
     * Wendet die Volume-Einstellungen auf alle Sounds an
     */
    applyVolumeSettings() {
        // Speichere die Basis-Lautstärken beim ersten Aufruf
        if (!this.baseVolumes) {
            this.baseVolumes = {};
            Object.keys(this.sounds).forEach(name => {
                this.baseVolumes[name] = this.sounds[name].volume;
            });
        }

        // Aktualisiere alle Sounds
        Object.keys(this.sounds).forEach(name => {
            const baseVolume = this.baseVolumes[name] || 1.0;
            const finalVolume = this.getFinalVolume(name, baseVolume);
            this.sounds[name].volume = finalVolume;
        });
    }
}
