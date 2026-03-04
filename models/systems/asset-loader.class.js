class AssetLoader {
    constructor() {
        this.imagePaths = new Set();
        this.soundPaths = new Set();
        this.loadedImages = 0;
        this.loadedSounds = 0;
        this.totalAssets = 0;
        this.onProgress = null;
        this.onComplete = null;
    }

    /**
     * Sammelt alle Bildpfade aus den verschiedenen Spiel-Klassen
     * Diese Methode wird aufgerufen, bevor das Laden beginnt
     */
    collectImagePaths() {
        // Character Bilder - Idle
        this.addImagesFromArray([
            '../assets/img/2_character_pepe/1_idle/idle/I-1.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-2.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-3.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-4.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-5.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-6.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-7.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-8.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-9.png',
            '../assets/img/2_character_pepe/1_idle/idle/I-10.png'
        ]);

        // Character Bilder - Long Idle
        this.addImagesFromArray([
            '../assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
            '../assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
        ]);

        // Character Bilder - Walking
        this.addImagesFromArray([
            '../assets/img/2_character_pepe/2_walk/W-21.png',
            '../assets/img/2_character_pepe/2_walk/W-22.png',
            '../assets/img/2_character_pepe/2_walk/W-23.png',
            '../assets/img/2_character_pepe/2_walk/W-24.png',
            '../assets/img/2_character_pepe/2_walk/W-25.png',
            '../assets/img/2_character_pepe/2_walk/W-26.png'
        ]);

        // Character Bilder - Jumping
        this.addImagesFromArray([
            '../assets/img/2_character_pepe/3_jump/J-31.png',
            '../assets/img/2_character_pepe/3_jump/J-32.png',
            '../assets/img/2_character_pepe/3_jump/J-33.png',
            '../assets/img/2_character_pepe/3_jump/J-34.png',
            '../assets/img/2_character_pepe/3_jump/J-35.png',
            '../assets/img/2_character_pepe/3_jump/J-36.png',
            '../assets/img/2_character_pepe/3_jump/J-37.png',
            '../assets/img/2_character_pepe/3_jump/J-38.png',
            '../assets/img/2_character_pepe/3_jump/J-39.png'
        ]);

        // Character Bilder - Hurt
        this.addImagesFromArray([
            '../assets/img/2_character_pepe/4_hurt/H-41.png',
            '../assets/img/2_character_pepe/4_hurt/H-42.png',
            '../assets/img/2_character_pepe/4_hurt/H-43.png'
        ]);

        // Character Bilder - Dead
        this.addImagesFromArray([
            '../assets/img/2_character_pepe/5_dead/D-51.png',
            '../assets/img/2_character_pepe/5_dead/D-52.png',
            '../assets/img/2_character_pepe/5_dead/D-53.png',
            '../assets/img/2_character_pepe/5_dead/D-54.png',
            '../assets/img/2_character_pepe/5_dead/D-55.png',
            '../assets/img/2_character_pepe/5_dead/D-56.png',
            '../assets/img/2_character_pepe/5_dead/D-57.png'
        ]);

        // Character Bilder - Throwing
        this.addImagesFromArray([
            '../assets/img/2_character_pepe/6_throw/th_1.png',
            '../assets/img/2_character_pepe/6_throw/th_2.png',
            '../assets/img/2_character_pepe/6_throw/th_3.png',
            '../assets/img/2_character_pepe/6_throw/th_4.png',
            '../assets/img/2_character_pepe/6_throw/th_5.png'
        ]);

        // Chicken Bilder
        this.addImagesFromArray([
            '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
            '../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
        ]);

        // Small Chicken Bilder
        this.addImagesFromArray([
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            '../assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
            '../assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
        ]);

        // Endboss Bilder - Walking
        this.addImagesFromArray([
            '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
            '../assets/img/4_enemie_boss_chicken/1_walk/G4.png'
        ]);

        // Endboss Bilder - Alert
        this.addImagesFromArray([
            '../assets/img/4_enemie_boss_chicken/2_alert/G5.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G6.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G7.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G8.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G9.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G10.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G11.png',
            '../assets/img/4_enemie_boss_chicken/2_alert/G12.png'
        ]);

        // Endboss Bilder - Attack
        this.addImagesFromArray([
            '../assets/img/4_enemie_boss_chicken/3_attack/G13.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G14.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G15.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G16.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
            '../assets/img/4_enemie_boss_chicken/3_attack/G20.png'
        ]);

        // Endboss Bilder - Hurt
        this.addImagesFromArray([
            '../assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
            '../assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
            '../assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
        ]);

        // Endboss Bilder - Dead
        this.addImagesFromArray([
            '../assets/img/4_enemie_boss_chicken/5_dead/G24.png',
            '../assets/img/4_enemie_boss_chicken/5_dead/G25.png',
            '../assets/img/4_enemie_boss_chicken/5_dead/G26.png'
        ]);

        // Background Bilder
        this.addImagesFromArray([
            '../assets/img/5_background/layers/air.png',
            '../assets/img/5_background/layers/3_third_layer/1.png',
            '../assets/img/5_background/layers/3_third_layer/2.png',
            '../assets/img/5_background/layers/2_second_layer/1.png',
            '../assets/img/5_background/layers/2_second_layer/2.png',
            '../assets/img/5_background/layers/1_first_layer/1.png',
            '../assets/img/5_background/layers/1_first_layer/2.png'
        ]);

        // Clouds
        this.addImagesFromArray(['../assets/img/5_background/layers/4_clouds/1.png']);

        // Collectables - Coins
        this.addImagesFromArray([
            '../assets/img/8_coin/coin_1.png',
            '../assets/img/8_coin/coin_2.png'
        ]);

        // Collectables - Bottles on ground
        this.addImagesFromArray([
            '../assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            '../assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ]);

        // Bottle rotation animation
        this.addImagesFromArray([
            '../assets/img/6_salsa_bottle/bottle_rotation/1_1_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/1_2_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/1_3_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/2_1_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/2_2_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/2_3_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/3_1_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/3_2_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/3_3_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/4_1_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/4_2_bottle_rotation.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/4_3_bottle_rotation.png'
        ]);

        // Bottle splash animation
        this.addImagesFromArray([
            '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
            '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
        ]);

        // Status Bar - Health
        this.addImagesFromArray([
            '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
        ]);

        // Status Bar - Coins
        this.addImagesFromArray([
            '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
            '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
            '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
            '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
            '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
            '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
        ]);

        // Status Bar - Bottles
        this.addImagesFromArray([
            '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
            '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
            '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
            '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
            '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
        ]);

        // Status Bar - Endboss (using blue folder)
        this.addImagesFromArray([
            '../assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
            '../assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
            '../assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
            '../assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
            '../assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
            '../assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
        ]);

        // UI Icons
        this.addImagesFromArray([
            '../assets/img/7_statusbars/3_icons/icon_health.png',
            '../assets/img/7_statusbars/3_icons/icon_coin.png',
            '../assets/img/7_statusbars/3_icons/icon_salsa_bottle.png',
            '../assets/img/7_statusbars/3_icons/icon_health_endboss.png'
        ]);
    }

    /**
     * Hilfsmethode zum Hinzufügen von Bildpfaden aus einem Array
     */
    addImagesFromArray(paths) {
        if (paths && Array.isArray(paths)) {
            paths.forEach(path => {
                if (path) this.imagePaths.add(path);
            });
        }
    }

    /**
     * Sammelt alle Soundpfade aus dem SoundManager
     */
    collectSoundPaths() {
        // Sounds werden im SoundManager initialisiert
        // Wir prüfen, ob der SoundManager existiert und sammeln die Pfade
        if (window.soundManager && window.soundManager.sounds) {
            Object.values(window.soundManager.sounds).forEach(audio => {
                if (audio && audio.src) {
                    this.soundPaths.add(audio.src);
                }
            });
        }
    }

    /**
     * Startet das Laden aller Assets
     * @param {Function} onProgress - Callback für Fortschritt (loaded, total)
     * @param {Function} onComplete - Callback wenn alles geladen ist
     */
    loadAll(onProgress, onComplete) {
        this.onProgress = onProgress;
        this.onComplete = onComplete;

        // Sammle alle Pfade
        this.collectImagePaths();
        this.collectSoundPaths();

        this.totalAssets = this.imagePaths.size + this.soundPaths.size;
        this.loadedImages = 0;
        this.loadedSounds = 0;

        // Wenn keine Assets zu laden sind, sofort fertig
        if (this.totalAssets === 0) {
            if (this.onComplete) this.onComplete();
            return;
        }

        // Lade Bilder
        this.loadImages();

        // Lade Sounds
        this.loadSounds();
    }

    /**
     * Lädt alle gesammelten Bilder
     */
    loadImages() {
        this.imagePaths.forEach(path => {
            const img = new Image();
            img.onload = () => {
                this.loadedImages++;
                this.updateProgress();
            };
            img.onerror = () => {
                console.warn(`Bild konnte nicht geladen werden: ${path}`);
                this.loadedImages++;
                this.updateProgress();
            };
            img.src = path;
        });
    }

    /**
     * Lädt alle gesammelten Sounds
     */
    loadSounds() {
        this.soundPaths.forEach(path => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.loadedSounds++;
                this.updateProgress();
            };
            audio.onerror = () => {
                console.warn(`Sound konnte nicht geladen werden: ${path}`);
                this.loadedSounds++;
                this.updateProgress();
            };
            audio.src = path;
            audio.load();
        });
    }

    /**
     * Aktualisiert den Fortschritt und ruft Callbacks auf
     */
    updateProgress() {
        const loaded = this.loadedImages + this.loadedSounds;
        const total = this.totalAssets;

        if (this.onProgress) {
            this.onProgress(loaded, total);
        }

        if (loaded >= total && this.onComplete) {
            this.onComplete();
        }
    }

    /**
     * Erstellt das Loading Screen HTML
     */
    static getLoadingScreenHTML() {
        return /*html*/`
            <div id="loading-screen" class="loading-screen">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
                <div id="loading-progress" class="loading-progress">0 / 0</div>
            </div>
        `;
    }
}
