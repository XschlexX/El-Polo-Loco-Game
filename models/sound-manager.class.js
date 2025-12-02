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
        this.addSound('menuTheme', 'sounds/music/menu-theme.mp3');
        this.addSound('gameTheme', 'sounds/music/game-theme1.mp3');
        this.addSound('endbossTheme', 'sounds/music/endboss-theme.mp3');
        this.addSound('characterJump', 'sounds/effects/character-jump.mp3');
        this.addSound('characterLand', 'sounds/effects/character-land.mp3');
        this.addSound('characterRun', 'sounds/effects/character-run.mp3');
        this.addSound('characterHurt', 'sounds/effects/character-hurt.wav');
    }

    /**
     * Fügt einen Sound hinzu
     */
    addSound(name, path) {
        const audio = new Audio(path);
        audio.preload = 'auto'; // Lädt Sound im Voraus
        this.sounds[name] = audio;
    }

    /**
     * Spielt einen Sound ab
     */
    play(name) {
        if (!this.sounds[name]) {
            console.warn(`Sound "${name}" nicht gefunden`);
            return;
        }

        const sound = this.sounds[name];
        sound.currentTime = 0; // Startet von vorne
        sound.play().catch(err => {
            // Browser blockiert manchmal Autoplay
            console.warn(`Fehler beim Abspielen von "${name}":`, err);
        });
    }

    /**
 * Spielt Musik in einer Endlosschleife
 */
    playMusic(name) {
        if (!this.sounds[name]) {
            console.warn(`Sound "${name}" nicht gefunden`);
            return;
        }

        const sound = this.sounds[name];
        sound.loop = true;  // ← Wichtig: Endlosschleife!
        sound.play().catch(err => {
            console.warn(`Fehler beim Abspielen von "${name}":`, err);
        });
    }

    /**
     * Stoppt Musik
     */
    stopMusic(name) {
        if (!this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.pause();
        sound.currentTime = 0;  // Zurück zum Anfang
    }
}