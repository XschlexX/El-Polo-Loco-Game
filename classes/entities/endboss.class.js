/**
 * Final boss enemy encountered at the end of the level.
 * Features patrol, chase, ramming attack, alert animation, and death sequence.
 * @extends MovableObjects
 */
class Endboss extends MovableObjects {
    height = 400;
    width = this.height * 0.8;
    groundLevel = 450;
    y = this.groundLevel - this.height;
    startX;
    energy;
    hitBoxLeft = 40;
    hitBoxTop = 70;
    hitBoxRight = 40 + this.hitBoxLeft;
    hitBoxBottom = 15 + this.hitBoxTop;
    rightBoundary;
    maxX = levelEnd - this.width;

    movement = { speed: 0.5, chasingSpeed: 3, patrolDistance: 300, movingRight: false };
    ramming = { isActive: false, direction: 1, distance: 300, distanceTraveled: 0 };
    state = { isChasing: false, hasPlayedAlert: false, hasPlayedAttack: false, hasPlayedDeath: false, isPlayingAlert: false, isPlayingAttack: false, isPlayingHurt: false, isPlayingDeath: false };
    images = imagePaths.endboss;

    /**
     * Creates an Endboss instance
     * @param {number} endbossHP - Starting health points
     */
    constructor(endbossHP) {
        super();
        this.energy = endbossHP;
        this.startX = levelEnd - 700;
        this.x = this.startX;
        this.rightBoundary = Math.min(this.startX + this.movement.patrolDistance + this.width, levelEnd);
        this.loadAllImages();
        this.animate();
    }

    /** Loads all required images */
    loadAllImages() {
        this.loadImage(this.images.imagesWalk[0]);
        ['imagesWalk', 'imagesAlert', 'imagesAttack', 'imagesAttackRun', 'imagesHurt', 'imagesDead']
            .forEach(img => this.loadImages(this.images[img]));
    }

    /** Starts animation loops */
    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /** Starts movement update loop */
    startMovementInterval() {
        const callback = () => this.updateMovement();
        const interval = setInterval(callback, 1000 / 60);
        GlobalIntervalManager.register(interval, 'Endboss movement', this, 1000 / 60, callback);
    }

    /** Updates position based on current state */
    updateMovement() {
        if (this.state.isPlayingAlert || this.state.isPlayingAttack) return;
        if (this.handleRamming()) return;
        if (this.handleChasing()) return;
        this.handlePatrol();
    }

    /**
     * Handles ramming attack movement
     * @returns {boolean} True if ramming was handled
     */
    handleRamming() {
        if (!this.ramming.isActive) return false;
        const newX = this.x + (this.movement.chasingSpeed * this.ramming.direction);
        if (newX >= levelStart && newX <= this.maxX) {
            this.x = newX;
            this.ramming.distanceTraveled += this.movement.chasingSpeed;
        } else {
            this.stopRammingMode();
            return true;
        }
        if (this.ramming.distanceTraveled >= this.ramming.distance) this.stopRammingMode();
        return true;
    }

    /** Stops ramming and resets state */
    stopRammingMode() {
        this.ramming.isActive = false;
        this.ramming.distanceTraveled = 0;
        this.otherDirection = !this.otherDirection;
        this.state.isChasing = this.canSeeCharacter();
        this.state.hasPlayedAlert = true;
        this.state.hasPlayedAttack = true;
    }

    /**
     * Handles chasing movement towards character
     * @returns {boolean} True if chasing was handled
     */
    handleChasing() {
        if (!this.state.isChasing) return false;
        const character = this.world?.character;
        if (character.x > this.x) {
            const newX = this.x + this.movement.chasingSpeed;
            if (newX <= this.maxX) this.x = newX;
            this.otherDirection = false;
            this.ramming.direction = 1;
        } else {
            const newX = this.x - this.movement.chasingSpeed;
            if (newX >= levelStart) this.x = newX;
            this.otherDirection = true;
            this.ramming.direction = -1;
        }
        return true;
    }

    /** Handles patrol movement between boundaries */
    handlePatrol() {
        if (this.movement.movingRight) {
            this.moveRight(false, this.movement.speed, this.rightBoundary);
            if (this.x + this.width >= this.rightBoundary) this.movement.movingRight = false;
        } else {
            this.moveLeft(true, this.movement.speed, this.startX);
            if (this.x <= this.startX) this.movement.movingRight = true;
        }
    }

    /** Starts animation update loop */
    startAnimationInterval() {
        const callback = () => this.updateAnimation();
        const interval = setInterval(callback, 150);
        GlobalIntervalManager.register(interval, 'Endboss animation', this, 150, callback);
    }

    /** Updates current animation based on state */
    updateAnimation() {
        if (this.isDead()) { this.handleDeathAnimation(); return; }
        if (this.state.isPlayingAlert || this.state.isPlayingAttack) return;
        if (!this.state.hasPlayedAlert && this.canSeeCharacter()) { this.handleAlertAnimation(); return; }
        if (this.shouldResetAlert()) { this.resetAlertState(); return; }
        if (this.isHurt()) { this.playAnimation(this.images.imagesHurt); return; }
        if (this.state.isChasing || this.ramming.isActive) { this.playAnimation(this.images.imagesAttackRun); return; }
        this.playAnimation(this.images.imagesWalk);
        this.world?.soundManager?.stopMusic('endbossAngry');
    }

    /** @returns {boolean} True if alert state should be reset */
    shouldResetAlert() {
        return !this.canSeeCharacter() && (this.state.hasPlayedAlert || this.state.hasPlayedAttack)
            && !this.ramming.isActive && !this.state.isChasing;
    }

    /** Resets alert and attack states */
    resetAlertState() {
        this.state.hasPlayedAlert = false;
        this.state.hasPlayedAttack = false;
        this.state.isChasing = false;
    }

    /** Handles death sequence initiation */
    handleDeathAnimation() {
        if (this.state.hasPlayedDeath || this.state.isPlayingHurt || this.state.isPlayingDeath) return;
        this.state.hasPlayedDeath = true;
        this.stopAllIntervals();
        this.world?.soundManager?.stopMusic('endbossAngry');
        this.state.isPlayingAlert = false;
        this.state.isPlayingAttack = false;
        this.state.isChasing = false;
        this.ramming.isActive = false;
        this.playHurtAnimationOnce();
    }

    /** Stops all active intervals */
    stopAllIntervals() {
        GlobalIntervalManager.clearByOwner(this);
    }

    /**
     * Plays a one-shot frame animation and calls onComplete when done.
     * @param {string[]} frames - Array of image paths
     * @param {string} intervalName - Name for interval registration
     * @param {Function} onComplete - Callback after last frame
     */
    playOneShotAnimation(frames, intervalName, onComplete) {
        let frameIndex = 0;
        this.img = this.imageCache[frames[frameIndex]];
        const advance = () => {
            frameIndex++;
            if (frameIndex < frames.length) {
                this.img = this.imageCache[frames[frameIndex]];
            } else {
                GlobalIntervalManager.clear(interval, intervalName);
                onComplete();
            }
        };
        const interval = setInterval(advance, 150);
        GlobalIntervalManager.register(interval, intervalName, this, 150, advance);
    }

    /** Plays hurt animation once, then triggers death animation */
    playHurtAnimationOnce() {
        this.state.isPlayingHurt = true;
        this.playOneShotAnimation(this.images.imagesHurt, 'Endboss hurt', () => this.onHurtComplete());
    }

    /** Called when hurt animation finishes */
    onHurtComplete() {
        this.state.isPlayingHurt = false;
        this.playDeathAnimationOnce();
    }

    /** Plays death animation and shows win screen */
    playDeathAnimationOnce() {
        this.state.isPlayingDeath = true;
        this.world?.soundManager?.play('endbossDead');
        this.playOneShotAnimation(this.images.imagesDead, 'Endboss death', () => this.onDeathComplete());
    }

    /** Called when death animation finishes */
    onDeathComplete() {
        this.state.isPlayingDeath = false;
        showYouWonScreen(500);
    }

    /**
     * Checks if character is visible to endboss
     * @returns {boolean} True if character can be seen
     */
    canSeeCharacter() {
        const character = this.world?.character;
        const distance = this.otherDirection
            ? this.x - (character.x + character.width)
            : character.x - (this.x + this.width);
        return distance > 0 && distance < 400;
    }

    /** Triggers alert animation if not played yet */
    handleAlertAnimation() {
        if (!this.state.hasPlayedAlert) this.playAlertAnimationOnce();
    }

    /** Plays alert animation once */
    playAlertAnimationOnce() {
        this.state.hasPlayedAlert = true;
        this.state.isPlayingAlert = true;
        this.world?.soundManager?.playMusic('endbossAngry');
        this.otherDirection = this.world?.character?.x < this.x;
        this.playOneShotAnimation(this.images.imagesAlert, 'Endboss alert', () => this.onAlertComplete());
    }

    /** Called when alert animation finishes */
    onAlertComplete() {
        this.state.isPlayingAlert = false;
        this.handleAttackAnimation();
    }

    /** Triggers attack animation if not played yet */
    handleAttackAnimation() {
        if (!this.state.hasPlayedAttack) this.playAttackAnimationOnce();
    }

    /** Plays attack animation once */
    playAttackAnimationOnce() {
        this.state.hasPlayedAttack = true;
        this.state.isPlayingAttack = true;
        this.world?.soundManager?.playMusic('endbossAngry');
        this.playOneShotAnimation(this.images.imagesAttack, 'Endboss attack', () => this.onAttackComplete());
    }

    /** Called when attack animation finishes */
    onAttackComplete() {
        this.state.isPlayingAttack = false;
        this.state.isChasing = true;
    }

    /** Called when colliding with character */
    onCharacterCollision() {
        if (this.state.isChasing && !this.ramming.isActive) {
            this.ramming.isActive = true;
            this.ramming.distanceTraveled = 0;
        }
    }

    /** Called when hit by bottle */
    onBottleHit() {
        if (this.state.hasPlayedAlert || this.state.isPlayingAlert || this.state.isPlayingAttack) return;
        this.otherDirection = this.world?.character?.x > this.x;
        this.state.hasPlayedAlert = false;
        this.playAlertAnimationOnce();
    }
}
