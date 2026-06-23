/**
 * Player-controlled character with movement, throwing, sleep idle, and camera-follow mechanics.
 * @extends MovableObjects
 */
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

    /**
     * Initializes the character with energy and bottles, loads all sprite sheets, and starts animation.
     * @param {number} initialEnergy - Starting health points
     * @param {number} initialBottles - Starting number of throwable bottles
     */
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

    /**
     * Starts all character intervals for sleep, sound, movement, and animation.
     */
    animate() {
        this.sleepTimer = null;
        this.resetSleepTimer();
        this.startSleepResetInterval();
        this.startSoundControlInterval();
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /** Starts interval to reset sleep timer on keyboard input */
    startSleepResetInterval() {
        const callback = () => {
            if (this.world?.keyboard?.ANY) this.resetSleepTimer();
        };
        const id = setInterval(callback, 100);
        GlobalIntervalManager.register(id, 'Character sleep reset check', this, 100, callback);
    }

    /** Starts interval for sound control (run sound, landing) */
    startSoundControlInterval() {
        const callback = () => this.handleSoundControl();
        const id = setInterval(callback, 100);
        GlobalIntervalManager.register(id, 'Character sound control', this, 100, callback);
    }

    /** Handles sound control logic */
    handleSoundControl() {
        if (!this.world?.soundManager) return;
        const isRunning = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround(this.groundLevel) && !this.isDead();
        const isNowAboveGround = this.isAboveGround(this.groundLevel);

        if (this.wasAboveGround && !isNowAboveGround && !this.isDead()) {
            this.world.soundManager.play('characterLand');
        }
        this.wasAboveGround = isNowAboveGround;
        this.updateRunSound(isRunning);
    }

    /**
     * Updates run sound based on running state.
     * @param {boolean} isRunning - Whether the character is currently running
     */
    updateRunSound(isRunning) {
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
    }

    /** Starts interval for character movement */
    startMovementInterval() {
        const callback = () => this.handleMovement();
        const id = setInterval(callback, 1000 / 60);
        GlobalIntervalManager.register(id, 'Character movement control', this, 1000 / 60, callback);
    }

    /** Handles character movement input */
    handleMovement() {
        if (!this.world) return;
        if (this.world.keyboard.RIGHT) this.moveRight();
        if (this.world.keyboard.LEFT) this.moveLeft(true);
        if (this.world.keyboard.UP && !this.isAboveGround(this.groundLevel)) {
            this.jump();
            this.currentImage = 2;
        }
        this.updateCamera();
    }

    /** Starts interval for animation control */
    startAnimationInterval() {
        const callback = () => this.handleAnimation();
        const id = setInterval(callback, 150);
        GlobalIntervalManager.register(id, 'Character animation control', this, 150, callback);
    }

    /** Handles character animation state */
    handleAnimation() {
        if (!this.world) return;
        if (this.isDead()) {
            this.characterDeadHandler();
        } else if (this.isHurt()) {
            this.playAnimation(this.images.imagesHurt);
        } else {
            this.playActiveAnimation();
        }
    }

    /** Plays the appropriate animation based on current state */
    playActiveAnimation() {
        if (this.isThrowing) {
            this.handleThrowAnimation();
        } else if (this.world.keyboard.SPACE && this.bottles > 0 && this.world.throwInterval()) {
            this.startThrowAnimation();
        } else if (this.isWalkingOnGround()) {
            this.playAnimation(this.images.imagesWalk);
        } else if (this.isAboveGround(this.groundLevel)) {
            this.playAnimation(this.images.imagesJump);
        } else if (this.sleep) {
            this.playAnimation(this.images.imagesLongIdle);
        } else {
            this.playAnimation(this.images.imagesIdle);
        }
    }

    /**
     * Checks if character is walking on ground.
     * @returns {boolean} True if a movement key is pressed and the character is on the ground
     */
    isWalkingOnGround() {
        return (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround(this.groundLevel);
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
        this.clearSleepTimer();
        this.sleep = false;
        this.stopSleepSound();
        this.scheduleSleepTimeout();
    }

    /** Clears existing sleep timer */
    clearSleepTimer() {
        if (this.sleepTimer) {
            GlobalIntervalManager.clearTimeout(this.sleepTimer, 'Character sleep timer');
        }
    }

    /** Stops sleep sound when character wakes up */
    stopSleepSound() {
        if (this.isSleepSoundPlaying && this.world?.soundManager) {
            this.world.soundManager.stopMusic('characterSleep');
            this.isSleepSoundPlaying = false;
        }
    }

    /** Schedules new sleep timeout */
    scheduleSleepTimeout() {
        const sleepCallback = () => this.enterSleepState();
        this.sleepTimer = setTimeout(sleepCallback, 3000);
        GlobalIntervalManager.registerTimeout(this.sleepTimer, 'Character sleep timer', this, 3000, sleepCallback);
    }

    /** Puts character into sleep state */
    enterSleepState() {
        this.sleep = true;
        if (this.world?.soundManager) {
            this.world.soundManager.playMusic('characterSleep');
            this.isSleepSoundPlaying = true;
        }
    }

    /**
     * Handles character death: plays death sound, disables keyboard input, and shows defeat screen.
     */
    characterDeadHandler() {
        this.playDeathSound();
        this.disableKeyboardInput();
        this.playAnimation(this.images.imagesDead);
        this.triggerDefeatScreen();
    }

    /**
     * Plays the death sound if it has not been played yet.
     */
    playDeathSound() {
        if (this.world?.soundManager && !this.deathSoundPlayed) {
            this.world.soundManager.play('characterDead');
            this.deathSoundPlayed = true;
        }
    }

    /**
     * Disables the active keyboard input and resets all key states to false.
     */
    disableKeyboardInput() {
        if (this.world?.keyboard) {
            keyboardActive = false;
            Object.keys(this.world.keyboard).forEach(key => {
                this.world.keyboard[key] = false;
            });
        }
    }

    /**
     * Triggers the defeat screen if it has not been shown yet.
     */
    triggerDefeatScreen() {
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
        const targetX = this.calculateTargetCameraX();
        const clampedTargetX = this.clampCameraX(targetX);
        this.applyCameraEasing(clampedTargetX);
    }

    /**
     * Calculates the target camera position based on character direction and offset.
     * @returns {number} The calculated target camera position.
     */
    calculateTargetCameraX() {
        const offset = 50;
        if (this.otherDirection) {
            return -this.x + (canvasWidth - offset - this.width);
        }
        return -this.x + offset;
    }

    /**
     * Clamps the given camera coordinate within level boundaries.
     * @param {number} x - The camera position to clamp.
     * @returns {number} The clamped camera position.
     */
    clampCameraX(x) {
        const minCameraX = -levelStart;
        const maxCameraX = -(levelEnd - canvasWidth);
        return Math.min(Math.max(x, maxCameraX), minCameraX);
    }

    /**
     * Applies easing interpolation between current camera position and target.
     * @param {number} targetX - The clamped target camera position.
     */
    applyCameraEasing(targetX) {
        const currentX = this.world.camera_x;
        const diff = targetX - currentX;
        const newX = currentX + (diff * this.cameraEasingSpeed);
        this.world.camera_x = Math.round(newX);
    }
}

