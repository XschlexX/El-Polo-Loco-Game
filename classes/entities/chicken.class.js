/**
 * Represents an enemy chicken that patrols horizontally within the level.
 * Extends MovableObjects with walking animation, death animation, and fade-out removal.
 */
class Chicken extends MovableObjects {
    /** @type {number} Height of the chicken sprite in pixels */
    height = 75;
    /** @type {number} Width of the chicken sprite in pixels */
    width = this.height * 0.8;
    /** @type {number} Y-coordinate of the ground level for this entity */
    groundLevel = 435 - this.height;
    /** @type {number} Current vertical position */
    y = this.groundLevel;
    /** @type {number} Left hitbox offset */
    hitBoxLeft = 0;
    /** @type {number} Top hitbox offset */
    hitBoxTop = -5;
    /** @type {number} Right hitbox offset */
    hitBoxRight = 0;
    /** @type {number} Bottom hitbox offset */
    hitBoxBottom = 5 + this.hitBoxTop;
    /** @type {World|undefined} Reference to the game world */
    world;
    /** @type {boolean} Whether this chicken is queued for removal */
    markedForDeletion = false;
    /** @type {boolean} Whether the death animation is currently playing */
    isDying = false;
    /** @type {number} Current opacity for fade-out effects */
    opacity = 1;
    /** @type {boolean} Whether the chicken is currently moving to the left */
    movingLeft = true;

    /** @type {Object} Sprite image path collections for the chicken */
    images = imagePaths.chicken;

    /**
     * Creates a new Chicken with a random position and speed.
     * @param {number} levelEnd - The x-coordinate boundary of the level end
     * @param {number} chickenSpeed - Maximum random speed factor for the chicken
     */
    constructor(levelEnd, chickenSpeed) {
        super();
        this.x = 200 + Math.random() * (levelEnd);
        this.speed = 0.25 + Math.random() * chickenSpeed;
        this.loadImage(this.images.imagesWalk[0]);
        this.loadImages(this.images.imagesWalk);
        this.loadImages(this.images.imagesDead);
        this.animate();
    }

    /**
     * Starts the movement patrol and sprite animation intervals.
     * The chicken walks back and forth between levelStart and levelEnd.
     */
    animate() {
        const moveCallback = () => {
            if (!this.isDead()) {

                if (this.movingLeft) {
                    this.moveLeft(true);
                    if (this.x <= levelStart) {
                        this.movingLeft = false;
                    }
                } else {
                    this.moveRight();
                    if (this.x + this.width >= levelEnd) {
                        this.movingLeft = true;
                    }
                }
            }
        };
        const moveInterval = setInterval(moveCallback, 1000 / 60);
        GlobalIntervalManager.register(moveInterval, 'Chicken movement', this, 1000 / 60, moveCallback);

        const animationCallback = () => {
            if (this.isDead()) {
                this.playDeadAnimation();
            } else {
                this.playAnimation(this.images.imagesWalk);
            }
        };
        const animationInterval = setInterval(animationCallback, 150);
        GlobalIntervalManager.register(animationInterval, 'Chicken animation', this, 150, animationCallback);
    }

    /**
     * Plays the death animation: shows the dead sprite, stops all owned intervals,
     * plays the death sound, and fades out before removing from the world.
     */
    playDeadAnimation() {
        if (!this.isDying) {
            this.isDying = true;
            this.img = this.imageCache[this.images.imagesDead[0]];
            GlobalIntervalManager.clearByOwner(this);

            if (this.world && this.world.soundManager) {
                this.world.soundManager.play('chickenDead');
            }

            const fadeCallback = () => {
                this.opacity -= 0.02;
                if (this.opacity <= 0) {
                    this.opacity = 0;
                    GlobalIntervalManager.clear(fadeInterval, 'Chicken fade');
                    this.markedForDeletion = true;
                    this.removeFromWorld();
                }
            };
            let fadeInterval = setInterval(fadeCallback, 40);
            GlobalIntervalManager.register(fadeInterval, 'Chicken fade-out', this, 40, fadeCallback);
        }
    }

    /**
     * Removes this chicken from the level's enemies array in the world.
     */
    removeFromWorld() {
        if (this.world) {
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }
    }
}
