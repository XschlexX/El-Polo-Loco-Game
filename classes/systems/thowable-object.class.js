/**
 * Represents a throwable bottle that rotates in flight and splashes on impact.
 * Extends MovableObjects with throw physics, rotation animation, and splash effects.
 */
class ThrowableObject extends MovableObjects {

    height = 70;
    width = this.height * 0.3;
    groundLevel = 445 - this.height;
    character;
    world;
    hasSplashed = false;
    splashAnimationComplete = false;
    throwInterval;
    throwSpeed = 5;
    markedForDeletion = false;

    imagesRotate = imagePaths.bottle.imagesRotate;

    imagesSplash = imagePaths.bottle.imagesSplash;


    /**
     * Creates a throwable bottle at the character's position and launches it.
     * @param {Object} character - The character throwing the bottle
     */
    constructor(character) {
        super();
        this.character = character;
        this.x = character.x;
        this.y = character.y;

        this.loadImage(this.imagesRotate[0]);
        this.loadImages(this.imagesRotate);
        this.loadImages(this.imagesSplash);
        this.animate();
        this.throw(this.x, this.y);
    }

    /**
     * Starts the rotation and splash animation loop.
     */
    animate() {
        const animationCallback = () => {
            this.updateFlightState();
            if (this.hasSplashed && !this.splashAnimationComplete) this.advanceSplashFrame();
            this.updateDimensions();
        };
        const intervalId = setInterval(animationCallback, 50);
        GlobalIntervalManager.register(intervalId, 'ThrowableObject animation', this, 50, animationCallback);
    }

    /** Updates rotation or triggers splash when bottle hits ground */
    updateFlightState() {
        if (this.hasSplashed) return;
        if (this.isAboveGround(this.groundLevel)) this.playAnimation(this.imagesRotate);
        else this.splash();
    }

    /** Advances the splash animation by one frame */
    advanceSplashFrame() {
        const i = this.currentImage % this.imagesSplash.length;
        this.img = this.imageCache[this.imagesSplash[i]];
        this.currentImage++;
        if (this.currentImage >= this.imagesSplash.length) this.onSplashComplete();
    }

    /** Marks the bottle for deletion and schedules removal */
    onSplashComplete() {
        this.splashAnimationComplete = true;
        this.markedForDeletion = true;
        const timeoutId = setTimeout(() => { }, 100);
        GlobalIntervalManager.registerTimeout(timeoutId, 'ThrowableObject removal', this, 100, () => this.removeFromWorld());
    }

    /** Updates dimensions based on current image */
    updateDimensions() {
        this.height = this.img.naturalHeight * 0.2;
        this.width = this.img.naturalWidth * 0.2;
    }

    /**
     * Triggers the splash sequence when the bottle hits the ground.
     * Stops horizontal movement and plays the splash sound effect.
     */
    splash() {
        if (!this.hasSplashed) {
            this.hasSplashed = true;
            this.currentImage = 0;
            this.stopMovement();

            if (this.world && this.world.soundManager) {
                this.world.soundManager.play('bottleSplash');
            }
        }
    }

    /**
     * Removes this bottle from the world's throwable objects array.
     */
    removeFromWorld() {
        if (this.world) {
            const index = this.world.throwableObjects.indexOf(this);
            if (index > -1) {
                this.world.throwableObjects.splice(index, 1);
            }
        }
    }

    /**
     * Stops the horizontal throw movement by clearing the throw interval.
     */
    stopMovement() {
        if (this.throwInterval) {
            clearInterval(this.throwInterval);
        }
    }

    /**
     * Launches the bottle in the direction the character is facing.
     * Applies gravity and horizontal movement based on character orientation.
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     */
    throw(x, y) {
        this.setInitialPosition(x, y);
        this.applyPhysics();
        this.startHorizontalMovement();
    }

    /**
     * Sets the initial throwing coordinates based on character orientation.
     * @param {number} x - Starting character X coordinate
     * @param {number} y - Starting character Y coordinate
     */
    setInitialPosition(x, y) {
        if (!this.character.otherDirection) {
            this.x = x + this.character.width - this.character.hitBoxLeft;
        } else {
            this.x = x + this.character.hitBoxLeft - this.width;
        }
        this.y = y + this.character.hitBoxTop;
    }

    /**
     * Applies vertical velocity and gravity to the throwable object.
     */
    applyPhysics() {
        this.speedY = 9;
        this.applyGravity(this.groundLevel);
    }

    /**
     * Starts and registers the interval for horizontal throwing movement.
     */
    startHorizontalMovement() {
        const direction = this.character.otherDirection ? -this.throwSpeed : this.throwSpeed;
        const callback = () => {
            this.x += direction;
        };
        const interval = 1000 / 60;
        this.throwInterval = setInterval(callback, interval);
        GlobalIntervalManager.register(this.throwInterval, 'ThrowableObject throw', this, interval, callback);
    }

    /**
     * Checks whether the bottle is still above ground level.
     * @returns {boolean} True if the bottle is above ground
     */
    isBroken() {
        return this.isAboveGround(this.groundLevel);
    }
}
