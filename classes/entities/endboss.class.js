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

    constructor(endbossHP) {
        super();
        this.energy = endbossHP;
        this.startX = levelEnd - 700;
        this.x = this.startX;
        this.rightBoundary = Math.min(this.startX + this.movement.patrolDistance + this.width, levelEnd);
        this.loadAllImages();
        this.animate();
    }

    loadAllImages() {
        this.loadImage(this.images.imagesWalk[0]);
        ['imagesWalk', 'imagesAlert', 'imagesAttack', 'imagesAttackRun', 'imagesHurt', 'imagesDead'].forEach(img => this.loadImages(this.images[img]));
    }

    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    startMovementInterval() {
        const callback = () => this.updateMovement();
        const interval = setInterval(callback, 1000 / 60);
        GlobalIntervalManager.register(interval, 'Endboss movement', this, 1000 / 60, callback);
    }

    updateMovement() {
        if (this.state.isPlayingAlert || this.state.isPlayingAttack) return;
        if (this.handleRamming()) return;
        if (this.handleChasing()) return;
        this.handlePatrol();
    }

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

    stopRammingMode() {
        this.ramming.isActive = false;
        this.ramming.distanceTraveled = 0;
        this.otherDirection = !this.otherDirection;
        this.state.isChasing = this.canSeeCharacter();
        this.state.hasPlayedAlert = true;
        this.state.hasPlayedAttack = true;
    }

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

    handlePatrol() {
        if (this.movement.movingRight) {
            this.moveRight(false, this.movement.speed, this.rightBoundary);
            if (this.x + this.width >= this.rightBoundary) this.movement.movingRight = false;
        } else {
            this.moveLeft(true, this.movement.speed, this.startX);
            if (this.x <= this.startX) this.movement.movingRight = true;
        }
    }

    startAnimationInterval() {
        const callback = () => this.updateAnimation();
        const interval = setInterval(callback, 150);
        GlobalIntervalManager.register(interval, 'Endboss animation', this, 150, callback);
    }

    updateAnimation() {
        if (this.isDead()) { this.handleDeathAnimation(); return; }
        if (!this.state.hasPlayedAlert && this.canSeeCharacter()) { this.handleAlertAnimation(); return; }
        if (this.shouldResetAlert()) { this.resetAlertState(); return; }
        if (this.isHurt()) { this.playAnimation(this.images.imagesHurt); return; }
        if (this.state.isChasing || this.ramming.isActive) { this.playAnimation(this.images.imagesAttackRun); return; }
        this.playAnimation(this.images.imagesWalk);
        this.world?.soundManager?.stopMusic('endbossAngry');
    }

    shouldResetAlert() {
        return !this.canSeeCharacter() && (this.state.hasPlayedAlert || this.state.hasPlayedAttack) && !this.ramming.isActive && !this.state.isChasing;
    }

    resetAlertState() {
        this.state.hasPlayedAlert = false;
        this.state.hasPlayedAttack = false;
        this.state.isChasing = false;
    }

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

    stopAllIntervals() {
        GlobalIntervalManager.clearByOwner(this);
    }

    playHurtAnimationOnce() {
        this.state.isPlayingHurt = true;
        let frameIndex = 0;
        this.img = this.imageCache[this.images.imagesHurt[frameIndex]];
        const callback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesHurt.length) {
                this.img = this.imageCache[this.images.imagesHurt[frameIndex]];
            } else {
                GlobalIntervalManager.clear(hurtInterval, 'Endboss hurt');
                this.state.isPlayingHurt = false;
                this.playDeathAnimationOnce();
            }
        };
        const hurtInterval = setInterval(callback, 150);
        GlobalIntervalManager.register(hurtInterval, 'Endboss hurt animation', this, 150, callback);
    }

    playDeathAnimationOnce() {
        this.state.isPlayingDeath = true;
        this.world?.soundManager?.play('endbossDead');
        let frameIndex = 0;
        this.img = this.imageCache[this.images.imagesDead[frameIndex]];
        const callback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesDead.length) {
                this.img = this.imageCache[this.images.imagesDead[frameIndex]];
            } else {
                GlobalIntervalManager.clear(deathInterval, 'Endboss death');
                this.state.isPlayingDeath = false;
                showYouWonScreen(500);
            }
        };
        const deathInterval = setInterval(callback, 150);
        GlobalIntervalManager.register(deathInterval, 'Endboss death animation', this, 150, callback);
    }

    canSeeCharacter() {
        const character = this.world?.character;
        const distance = this.otherDirection ? this.x - (character.x + character.width) : character.x - (this.x + this.width);
        return distance > 0 && distance < 400;
    }

    handleAlertAnimation() {
        if (!this.state.hasPlayedAlert) this.playAlertAnimationOnce();
    }

    playAlertAnimationOnce() {
        this.state.hasPlayedAlert = true;
        this.state.isPlayingAlert = true;
        this.world?.soundManager?.playMusic('endbossAngry');
        this.otherDirection = this.world?.character?.x < this.x;
        let frameIndex = 0;
        this.img = this.imageCache[this.images.imagesAlert[frameIndex]];
        const callback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesAlert.length) {
                this.img = this.imageCache[this.images.imagesAlert[frameIndex]];
            } else {
                GlobalIntervalManager.clear(alertInterval, 'Endboss alert');
                this.state.isPlayingAlert = false;
                this.handleAttackAnimation();
            }
        };
        const alertInterval = setInterval(callback, 150);
        GlobalIntervalManager.register(alertInterval, 'Endboss alert animation', this, 150, callback);
    }

    handleAttackAnimation() {
        if (!this.state.hasPlayedAttack) this.playAttackAnimationOnce();
    }

    playAttackAnimationOnce() {
        this.state.hasPlayedAttack = true;
        this.state.isPlayingAttack = true;
        this.world?.soundManager?.playMusic('endbossAngry');
        let frameIndex = 0;
        this.img = this.imageCache[this.images.imagesAttack[frameIndex]];
        const callback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesAttack.length) {
                this.img = this.imageCache[this.images.imagesAttack[frameIndex]];
            } else {
                GlobalIntervalManager.clear(attackInterval, 'Endboss attack');
                this.state.isPlayingAttack = false;
                this.state.isChasing = true;
            }
        };
        const attackInterval = setInterval(callback, 150);
        GlobalIntervalManager.register(attackInterval, 'Endboss attack animation', this, 150, callback);
    }

    onCharacterCollision() {
        if (this.state.isChasing && !this.ramming.isActive) {
            this.ramming.isActive = true;
            this.ramming.distanceTraveled = 0;
        }
    }

    onBottleHit() {
        if (this.state.hasPlayedAlert || this.state.isPlayingAlert || this.state.isPlayingAttack) return;
        this.otherDirection = this.world?.character?.x > this.x;
        this.state.hasPlayedAlert = false;
        this.playAlertAnimationOnce();
    }
}
