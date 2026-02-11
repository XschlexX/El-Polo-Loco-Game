class Character extends MovableObjects {
    height = 280;
    width = this.height * 0.5;
    groundLevel = 445 - this.height;
    x = 50;
    y = this.groundLevel;
    speed = 5;
    energy = 500;
    bottles = 0;
    coins = 0;
    sleep = false;
    isRunSoundPlaying = false;  // Track ob Run-Sound läuft
    isSleepSoundPlaying = false;  // Track ob Sleep-Sound läuft
    wasAboveGround = false;  // Track ob Character in der Luft war
    defeatScreenShown = false; // Track ob Defeat-Screen bereits angezeigt wurde

    hitBoxLeft = 30;
    hitBoxTop = 130;
    hitBoxRight = 45 + this.hitBoxLeft;
    hitBoxBottom = 15 + this.hitBoxTop;

    world;
    cameraEasingSpeed = 0.05; // Geschwindigkeit der Kamera-Anpassung (0.05-0.15 ist gut)

    imagesIdle = [
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
    ];

    imagesLongIdle = [
        '../assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    imagesWalk = [
        '../assets/img/2_character_pepe/2_walk/W-21.png',
        '../assets/img/2_character_pepe/2_walk/W-22.png',
        '../assets/img/2_character_pepe/2_walk/W-23.png',
        '../assets/img/2_character_pepe/2_walk/W-24.png',
        '../assets/img/2_character_pepe/2_walk/W-25.png',
        '../assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    imagesJump = [
        '../assets/img/2_character_pepe/3_jump/J-31.png',
        '../assets/img/2_character_pepe/3_jump/J-32.png',
        '../assets/img/2_character_pepe/3_jump/J-33.png',
        '../assets/img/2_character_pepe/3_jump/J-34.png',
        '../assets/img/2_character_pepe/3_jump/J-35.png',
        '../assets/img/2_character_pepe/3_jump/J-36.png',
        '../assets/img/2_character_pepe/3_jump/J-37.png',
        '../assets/img/2_character_pepe/3_jump/J-38.png',
        '../assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    imagesThrow = [
        '../assets/img/2_character_pepe/6_throw/th_1.png',
        '../assets/img/2_character_pepe/6_throw/th_2.png',
        '../assets/img/2_character_pepe/6_throw/th_3.png',
        '../assets/img/2_character_pepe/6_throw/th_4.png',
        '../assets/img/2_character_pepe/6_throw/th_5.png'
    ];

    imagesHurt = [
        '../assets/img/2_character_pepe/4_hurt/H-41.png',
        '../assets/img/2_character_pepe/4_hurt/H-42.png',
        '../assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    imagesDead = [
        '../assets/img/2_character_pepe/5_dead/D-51.png',
        '../assets/img/2_character_pepe/5_dead/D-52.png',
        '../assets/img/2_character_pepe/5_dead/D-53.png',
        '../assets/img/2_character_pepe/5_dead/D-54.png',
        '../assets/img/2_character_pepe/5_dead/D-55.png',
        '../assets/img/2_character_pepe/5_dead/D-56.png',
        '../assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    constructor(initialEnergy, initialBottles) {
        super();
        this.energy = initialEnergy;
        this.bottles = initialBottles;
        this.deathSoundPlayed = false;
        this.loadImage(this.imagesIdle[0]);
        this.loadImages(this.imagesIdle);
        this.loadImages(this.imagesLongIdle);
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesJump);
        this.loadImages(this.imagesThrow);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.applyGravity(this.groundLevel);
        this.animate();
    }

    animate() {
        this.sleepTimer = null;
        this.resetSleepTimer();

        const interval1Callback = () => {
            if (this.world && this.world.keyboard && this.world.keyboard.ANY) {
                this.resetSleepTimer();
            }
        };
        const interval1 = setInterval(interval1Callback, 100); // Häufigere Überprüfung, aber nicht zu oft
        GlobalIntervalManager.register(interval1, 'Character sleep reset check', this, 100, interval1Callback);

        // Sound-Kontrolle für Run-Sound und Landing
        const interval2Callback = () => {
            if (!this.world || !this.world.soundManager) return;

            const isRunning = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround(this.groundLevel) && !this.isDead();
            const isNowAboveGround = this.isAboveGround(this.groundLevel);

            // Landing Detection: War in der Luft und ist jetzt am Boden
            if (this.wasAboveGround && !isNowAboveGround && !this.isDead()) {
                this.world.soundManager.play('characterLand');
            }

            // Update wasAboveGround für nächsten Frame
            this.wasAboveGround = isNowAboveGround;

            if (isRunning) {
                // Spiele Run-Sound im Loop ab (falls noch nicht läuft)
                if (!this.isRunSoundPlaying) {
                    this.world.soundManager.playMusic('characterRun');
                    this.isRunSoundPlaying = true;
                }
            } else {
                // Stoppe Run-Sound
                if (this.isRunSoundPlaying) {
                    this.world.soundManager.stopMusic('characterRun');
                    this.isRunSoundPlaying = false;
                }
            }
        };
        const interval2 = setInterval(interval2Callback, 100);
        GlobalIntervalManager.register(interval2, 'Character sound control', this, 100, interval2Callback);

        const interval3Callback = () => {
            // Warte bis world gesetzt ist
            if (!this.world) return;

            // Maximale Character-Position rechts: Level-Ende - Character-Breite
            const maxCharacterX = this.world.level.levelEndX - this.width;
            // Minimale Character-Position links: Level-Start
            const minCharacterX = this.world.level.levelStartX;

            if (this.world.keyboard.RIGHT && this.x < maxCharacterX) {
                this.moveRight();
            }
            if (this.world.keyboard.LEFT && this.x > minCharacterX) {
                this.moveLeft(true);
            }
            if (this.world.keyboard.UP && !this.isAboveGround(this.groundLevel)) {
                this.jump(8);
                this.currentImage = 0;
            }
            this.updateCamera();
        };
        const interval3 = setInterval(interval3Callback, 1000 / 60);
        GlobalIntervalManager.register(interval3, 'Character movement control', this, 1000 / 60, interval3Callback);

        const interval4Callback = () => {
            // Warte bis world gesetzt ist
            if (!this.world) return;

            if (this.isDead()) {
                this.characterDeadHandler();
            } else if (this.isHurt()) {
                this.playAnimation(this.imagesHurt);
            } else {
                if (this.world.keyboard.RIGHT && !this.isAboveGround(this.groundLevel) || this.world.keyboard.LEFT && !this.isAboveGround(this.groundLevel)) {
                    this.playAnimation(this.imagesWalk);
                } else if (this.isAboveGround(this.groundLevel)) {
                    this.playAnimation(this.imagesJump);
                } else if (this.world.keyboard.SPACE && this.bottles > 0) {
                    this.playAnimation(this.imagesThrow);
                } else if (this.sleep) {
                    this.playAnimation(this.imagesLongIdle);
                } else {
                    this.playAnimation(this.imagesIdle);
                }
            }
        };
        const interval4 = setInterval(interval4Callback, 150);
        GlobalIntervalManager.register(interval4, 'Character animation control', this, 150, interval4Callback);

    }

    /**
     * Setzt den Sleep-Timer zurück
     * Wird aufgerufen bei Tastendruck oder wenn der Character getroffen wird
     */
    resetSleepTimer() {
        // Clear old timeout if exists
        if (this.sleepTimer) {
            GlobalIntervalManager.clearTimeout(this.sleepTimer, 'Character sleep timer');
        }
        this.sleep = false;

        // Stoppe Sleep-Sound wenn Character aufwacht
        if (this.isSleepSoundPlaying && this.world && this.world.soundManager) {
            this.world.soundManager.stopMusic('characterSleep');
            this.isSleepSoundPlaying = false;
        }

        const sleepCallback = () => {
            this.sleep = true;
            // Spiele Sleep-Sound im Loop ab
            if (this.world && this.world.soundManager) {
                this.world.soundManager.playMusic('characterSleep');
                this.isSleepSoundPlaying = true;
            }
        };
        this.sleepTimer = setTimeout(sleepCallback, 3000);
        GlobalIntervalManager.registerTimeout(this.sleepTimer, 'Character sleep timer', this, 3000, sleepCallback);
    }

    characterDeadHandler() {
        // Play death sound if not already played
        if (this.world && this.world.soundManager && !this.deathSoundPlayed) {
            this.world.soundManager.play('characterDead');
            this.deathSoundPlayed = true; // Prevent replaying the sound
        }
        // Disable keyboard inputs when character dies
        if (this.world && this.world.keyboard) {
            keyboardActive = false;
            if (this.world.keyboard) {
                Object.keys(this.world.keyboard).forEach(key => {
                    this.world.keyboard[key] = false;
                });
            }
            console.log(keyboardActive);
        }

        this.playAnimation(this.imagesDead);
        if (!this.defeatScreenShown) {
            showYouLostScreen(1000);
            this.defeatScreenShown = true;
        }
    }

    /**
     * Aktualisiert die Kamera-Position basierend auf der Character-Position und Bewegungsrichtung
     * Die Kamera folgt dem Character asymmetrisch mit sanfter Transition (Easing)
     */
    updateCamera() {
        const canvasWidth = 720; // Standard Canvas-Breite
        const offsetFromEdge = 50; // Abstand vom Rand

        // Berechne die minimale Kamera-Position (am Level-Start)
        const minCameraX = -this.world.level.levelStartX;

        // Berechne die maximale Kamera-Position (am Level-Ende)
        const maxCameraX = -(this.world.level.levelEndX - canvasWidth);

        let targetCameraX;

        // Asymmetrische Kamera basierend auf Bewegungsrichtung
        if (this.otherDirection) {
            // Character läuft nach links: Character bleibt rechts (100px + Character-Breite vom rechten Rand)
            targetCameraX = -this.x + (canvasWidth - offsetFromEdge - this.width);
        } else {
            // Character läuft nach rechts: Character bleibt links (100px vom linken Rand)
            targetCameraX = -this.x + offsetFromEdge;
        }

        // Begrenze die Ziel-Kamera-Position an beiden Level-Enden
        targetCameraX = Math.min(Math.max(targetCameraX, maxCameraX), minCameraX);

        // Sanfte Kamera-Transition (Easing): Kamera gleitet zur Zielposition
        // Je näher die Kamera am Ziel ist, desto langsamer bewegt sie sich
        const currentCameraX = this.world.camera_x;
        const cameraDiff = targetCameraX - currentCameraX;

        // Easing: Bewege die Kamera einen Teil der Distanz (z.B. 8% pro Frame)
        const newCameraX = currentCameraX + (cameraDiff * this.cameraEasingSpeed);

        // Runde auf ganze Pixel, um schwarze Striche zwischen Hintergrundbildern zu vermeiden
        this.world.camera_x = Math.round(newCameraX);
    }
}

