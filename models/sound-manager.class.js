class SoundManager {
    sounds = {}; // Hier werden alle Sounds gespeichert: { 'jump': Audio-Objekt, 'hurt': Audio-Objekt }

    constructor() {
        this.initializeSounds();
    }

    /**
     * Lädt alle Sounds des Spiels
     */
    initializeSounds() {
        // TODO: Hier fügst du die Sounds hinzu
        // Beispiel: this.addSound('jump', 'sounds/effects/jump.mp3');
        this.addSound('menuTheme', 'sounds/music/menu-theme.mp3', 0.5);
        this.addSound('gameTheme', 'sounds/music/game-theme1.mp3', 0.5);
        this.addSound('endbossTheme', 'sounds/music/endboss-theme.mp3', 0.5);
        this.addSound('characterJump', 'sounds/effects/character-jump.mp3', 0.2);
        this.addSound('characterLand', 'sounds/effects/character-land.mp3', 0.3);  // Leiser!
        this.addSound('characterRun', 'sounds/effects/character-run.mp3', 0.3);
        this.addSound('characterHurt', 'sounds/effects/character-hurt.mp3', 0.6);
        this.addSound('characterSleep', 'sounds/effects/character-sleep.mp3', 0.3);
        this.addSound('chickenDead', 'sounds/effects/enemies/chicken-dead.mp3', 1.0);  // Volle Lautstärke!
        this.addSound('chickenSmallDead', 'sounds/effects/enemies/chicken-small-dead.mp3', 1.0);
        this.addSound('bottleCollect', 'sounds/effects/bottle-collect.mp3', 0.2);
        this.addSound('bottleThrow', 'sounds/effects/bottle-throw.mp3', 0.4);
        this.addSound('bottleSplash', 'sounds/effects/bottle-splash.mp3', 0.6);
        this.addSound('coinCollect', 'sounds/effects/coin-collect.mp3', 0.4);
    }

    /**
     * Fügt einen Sound hinzu
     * @param {string} name - Name des Sounds
     * @param {string} path - Pfad zur Sound-Datei
     * @param {number} volume - Lautstärke (0.0 - 1.0), Standard: 1.0
     */
    addSound(name, path, volume = 1.0) {
        const audio = new Audio(path);
        audio.preload = 'auto'; // Lädt Sound im Voraus
        audio.volume = volume;  // Setze Lautstärke
        this.sounds[name] = audio;
    }

    /**
     * Spielt einen Sound ab
     */
    /**
     * Spielt einen Sound ab
     * @param {string} name - Name des Sounds
     * @param {boolean} restart - Sound von vorne starten?
     */
    play(name, restart = true) {
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
        if (!this.sounds[name]) {
            console.warn(`Sound "${name}" nicht gefunden`);
            return;
        }

        const sound = this.sounds[name];
        sound.loop = true;
        this.play(name, false);  // Nutzt play() ohne restart!
    }

    /**
     * Stoppt Musik (zurück zum Anfang)
     * @param {string} name - Name der Musik
     */
    stopMusic(name) {
        if (!this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * Pausiert Musik (Position bleibt erhalten)
     * @param {string} name - Name der Musik
     */
    pauseMusic(name) {
        if (!this.sounds[name]) return;
        this.sounds[name].pause();
    }

    /**
     * Setzt pausierte Musik fort
     * @param {string} name - Name der Musik
     */
    resumeMusic(name) {
        if (!this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.loop = true;
        this.play(name, false);  // Nutzt play() ohne restart!
    }
}