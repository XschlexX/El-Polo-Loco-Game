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

    imagesRotate = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/1_2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/1_3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_3_bottle_rotation.png'
    ];

    imagesSplash = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];


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
     * Plays rotation animation while airborne, then splash sequence on impact.
     */
    animate() {
        const animationCallback = () => {
            if (!this.hasSplashed && this.isAboveGround(this.groundLevel)) {
                this.playAnimation(this.imagesRotate);
            } else if (!this.hasSplashed && !this.isAboveGround(this.groundLevel)) {
                this.splash();
            }

            if (this.hasSplashed && !this.splashAnimationComplete) {
                let i = this.currentImage % this.imagesSplash.length;
                let path = this.imagesSplash[i];
                this.img = this.imageCache[path];
                this.currentImage++;

                if (this.currentImage >= this.imagesSplash.length) {
                    this.splashAnimationComplete = true;
                    this.markedForDeletion = true;
                    const timeoutId = setTimeout(() => { }, 100);
                    GlobalIntervalManager.registerTimeout(timeoutId, 'ThrowableObject removal', this, 100, () => this.removeFromWorld());
                }
            }
            this.height = this.img.naturalHeight * 0.2;
            this.width = this.img.naturalWidth * 0.2;
        };
        const intervalId = setInterval(animationCallback, 50);
        GlobalIntervalManager.register(intervalId, 'ThrowableObject animation', this, 50, animationCallback);
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
        let throwDirection = this.character.otherDirection ? -this.throwSpeed : this.throwSpeed;
        if (!this.character.otherDirection) {
            this.x = x + this.character.width - this.character.hitBoxLeft;
        } else {
            this.x = x + this.character.hitBoxLeft - this.width;
        }
        this.y = y + this.character.hitBoxTop;
        this.speedY = 9;
        this.applyGravity(this.groundLevel);
        const throwCallback = () => {
            this.x += throwDirection;
        };
        this.throwInterval = setInterval(throwCallback, 1000 / 60);
        GlobalIntervalManager.register(this.throwInterval, 'ThrowableObject throw', this, 1000 / 60, throwCallback);
    }

    /**
     * Checks whether the bottle is still above ground level.
     * @returns {boolean} True if the bottle is above ground
     */
    isBroken() {
        return this.isAboveGround(this.groundLevel);
    }
}
