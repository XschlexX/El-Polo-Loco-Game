/**
 * Represents a small chicken enemy that patrols back and forth within the level.
 * Extends MovableObjects to inherit movement, animation, and collision capabilities.
 */
class ChickenSmall extends MovableObjects {
    height = 45;
    width = this.height * 0.8;
    groundLevel = 435 - this.height;
    y = this.groundLevel;
    hitBoxLeft = 0;
    hitBoxTop = -5;
    hitBoxRight = 0;
    hitBoxBottom = 0;
    world;
    markedForDeletion = false;
    isDying = false;
    opacity = 1;
    movingLeft = true;

    images = imagePaths.smallChicken;

    /**
     * Creates a new small chicken at a random position within the level.
     * @param {number} levelEnd - The x-coordinate marking the end of the level
     * @param {number} chickenSpeed - The maximum random speed multiplier for the chicken
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
     * Starts the movement and sprite animation intervals for the chicken.
     */
    animate() {
        const moveCallback = () => this.updateMovement();
        const moveInterval = setInterval(moveCallback, 1000 / 60);
        GlobalIntervalManager.register(moveInterval, 'ChickenSmall movement', this, 1000 / 60, moveCallback);
        const animationCallback = () => {
            if (this.isDead()) this.playDeadAnimation();
            else this.playAnimation(this.images.imagesWalk);
        };
        const animationInterval = setInterval(animationCallback, 150);
        GlobalIntervalManager.register(animationInterval, 'ChickenSmall animation', this, 150, animationCallback);
    }

    /**
     * Updates the chicken's position, reversing direction at level boundaries.
     */
    updateMovement() {
        if (this.isDead()) return;
        if (this.movingLeft) {
            this.moveLeft(true);
            if (this.x <= levelStart) this.movingLeft = false;
        } else {
            this.moveRight();
            if (this.x + this.width >= levelEnd) this.movingLeft = true;
        }
    }

    /**
     * Plays the death animation sequence including the dead sprite and sound effect.
     */
    playDeadAnimation() {
        if (!this.isDying) {
            this.isDying = true;
            this.img = this.imageCache[this.images.imagesDead[0]];
            GlobalIntervalManager.clearByOwner(this);
            if (this.world && this.world.soundManager) {
                this.world.soundManager.play('chickenSmallDead');
            }
            this.startFadeOut();
        }
    }

    /**
     * Fades the chicken out and removes it from the world when complete.
     */
    startFadeOut() {
        const fadeCallback = () => {
            this.opacity -= 0.02;
            if (this.opacity <= 0) {
                this.opacity = 0;
                GlobalIntervalManager.clear(fadeInterval, 'ChickenSmall fade');
                this.markedForDeletion = true;
                this.removeFromWorld();
            }
        };
        let fadeInterval = setInterval(fadeCallback, 40);
        GlobalIntervalManager.register(fadeInterval, 'ChickenSmall fade-out', this, 40, fadeCallback);
    }

    /**
     * Removes this chicken from the world's enemy list.
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
