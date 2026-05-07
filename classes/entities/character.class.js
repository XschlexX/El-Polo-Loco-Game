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
    isRunSoundPlaying = false;
    isSleepSoundPlaying = false;
    wasAboveGround = false;
    isThrowing = false;
    throwAnimationFrame = 0;

    hitBoxLeft = 30;
    hitBoxTop = 130;
    hitBoxRight = 45 + this.hitBoxLeft;
    hitBoxBottom = 15 + this.hitBoxTop;

    world;
    cameraEasingSpeed = 0.05;

    images = imagePaths.character;

    constructor(initialEnergy, initialBottles) {
        super();
        this.energy = initialEnergy;
        this.bottles = initialBottles;
        this.deathSoundPlayed = false;
        this.loadImage(this.images.imagesIdle[0]);
        this.loadImages(this.images.imagesIdle);
        this.loadImages(this.images.imagesLongIdle);
        this.loadImages(this.images.imagesWalk);
        this.loadImages(this.images.imagesJump);
        this.loadImages(this.images.imagesThrow);
        this.loadImages(this.images.imagesHurt);
        this.loadImages(this.images.imagesDead);
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
        const interval1 = setInterval(interval1Callback, 100);
        GlobalIntervalManager.register(interval1, 'Character sleep reset check', this, 100, interval1Callback);

        const interval2Callback = () => {
            if (!this.world || !this.world.soundManager) return;

            const isRunning = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround(this.groundLevel) && !this.isDead();
            const isNowAboveGround = this.isAboveGround(this.groundLevel);

            if (this.wasAboveGround && !isNowAboveGround && !this.isDead()) {
                this.world.soundManager.play('characterLand');
            }

            this.wasAboveGround = isNowAboveGround;

            if (isRunning) {
                if (!this.isRunSoundPlaying) {
                    this.world.soundManager.playMusic('characterRun');
                    this.isRunSoundPlaying = true;
                }
            } else {
                if (this.isRunSoundPlaying) {
                    this.world.soundManager.stopMusic('characterRun');
                    this.isRunSoundPlaying = false;
                }
            }
        };
        const interval2 = setInterval(interval2Callback, 100);
        GlobalIntervalManager.register(interval2, 'Character sound control', this, 100, interval2Callback);

        const interval3Callback = () => {
            if (!this.world) return;

            if (this.world.keyboard.RIGHT) {
                this.moveRight();
            }
            if (this.world.keyboard.LEFT) {
                this.moveLeft(true);
            }
            if (this.world.keyboard.UP && !this.isAboveGround(this.groundLevel)) {
                this.jump();
                this.currentImage = 2;
            }
            this.updateCamera();
        };
        const interval3 = setInterval(interval3Callback, 1000 / 60);
        GlobalIntervalManager.register(interval3, 'Character movement control', this, 1000 / 60, interval3Callback);

        const interval4Callback = () => {
            if (!this.world) return;

            if (this.isDead()) {
                this.characterDeadHandler();
            } else if (this.isHurt()) {
                this.playAnimation(this.images.imagesHurt);
            } else {
                if (this.isThrowing) {
                    this.handleThrowAnimation();
                } else if (this.world.keyboard.SPACE && this.bottles > 0 && this.world.throwInterval()) {
                    this.startThrowAnimation();
                } else if (this.world.keyboard.RIGHT && !this.isAboveGround(this.groundLevel) || this.world.keyboard.LEFT && !this.isAboveGround(this.groundLevel)) {
                    this.playAnimation(this.images.imagesWalk);
                } else if (this.isAboveGround(this.groundLevel)) {
                    this.playAnimation(this.images.imagesJump);
                } else if (this.sleep) {
                    this.playAnimation(this.images.imagesLongIdle);
                } else {
                    this.playAnimation(this.images.imagesIdle);
                }
            }
        };
        const interval4 = setInterval(interval4Callback, 150);
        GlobalIntervalManager.register(interval4, 'Character animation control', this, 150, interval4Callback);
    }

    /**
     * Starts throw animation and throws bottle after 200ms
     */
    startThrowAnimation() {
        this.isThrowing = true;
        this.throwAnimationFrame = 1;
        this.currentImage = 1;

        setTimeout(() => this.throwBottle(), 200);
    }

    /**
     * Creates and throws a bottle
     */
    throwBottle() {
        if (!this.world || this.bottles <= 0) return;

        let bottle = new ThrowableObject(this);
        bottle.world = this.world;
        this.world.throwableObjects.push(bottle);
        this.bottles--;
        this.world.lastThrow = new Date().getTime();

        if (this.world.soundManager) {
            this.world.soundManager.play('bottleThrow');
        }
    }

    /**
     * Handles throw animation frame by frame
     */
    handleThrowAnimation() {
        this.playAnimation(this.images.imagesThrow);
        this.throwAnimationFrame++;

        if (this.throwAnimationFrame >= this.images.imagesThrow.length) {
            this.isThrowing = false;
            this.throwAnimationFrame = 0;
        }
    }

    /**
     * Resets sleep timer
     * Called on key press or when character gets hit
     */
    resetSleepTimer() {
        if (this.sleepTimer) {
            GlobalIntervalManager.clearTimeout(this.sleepTimer, 'Character sleep timer');
        }
        this.sleep = false;

        if (this.isSleepSoundPlaying && this.world?.soundManager) {
            this.world.soundManager.stopMusic('characterSleep');
            this.isSleepSoundPlaying = false;
        }

        const sleepCallback = () => {
            this.sleep = true;
            if (this.world?.soundManager) {
                this.world.soundManager.playMusic('characterSleep');
                this.isSleepSoundPlaying = true;
            }
        };
        this.sleepTimer = setTimeout(sleepCallback, 3000);
        GlobalIntervalManager.registerTimeout(this.sleepTimer, 'Character sleep timer', this, 3000, sleepCallback);
    }

    characterDeadHandler() {
        if (this.world?.soundManager && !this.deathSoundPlayed) {
            this.world.soundManager.play('characterDead');
            this.deathSoundPlayed = true;
        }

        if (this.world?.keyboard) {
            keyboardActive = false;
            Object.keys(this.world.keyboard).forEach(key => {
                this.world.keyboard[key] = false;
            });
        }

        this.playAnimation(this.images.imagesDead);
        if (!this.defeatScreenShown) {
            showYouLostScreen(1000);
            this.defeatScreenShown = true;
        }
    }

    /**
     * Updates camera position based on character position and direction
     * Camera follows character asymmetrically with smooth easing transition
     */
    updateCamera() {
        const offsetFromEdge = 50;
        const minCameraX = -levelStart;
        const maxCameraX = -(levelEnd - canvasWidth);

        let targetCameraX;

        if (this.otherDirection) {
            targetCameraX = -this.x + (canvasWidth - offsetFromEdge - this.width);
        } else {
            targetCameraX = -this.x + offsetFromEdge;
        }

        targetCameraX = Math.min(Math.max(targetCameraX, maxCameraX), minCameraX);

        const currentCameraX = this.world.camera_x;
        const cameraDiff = targetCameraX - currentCameraX;
        const newCameraX = currentCameraX + (cameraDiff * this.cameraEasingSpeed);

        this.world.camera_x = Math.round(newCameraX);
    }
}

