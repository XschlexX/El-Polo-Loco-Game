/**
 * Base class for all movable game objects with physics, collision detection, and animation support.
 * Extends DrawableObject to add movement, gravity, and health mechanics.
 */
class MovableObjects extends DrawableObject {

    otherDirection = false;
    speedY = 0;
    acceleration = 0.3;
    energy = 10;
    lastHit = 0;
    hitBoxLeft = 0;
    hitBoxTop = 0;
    hitBoxRight = 0;
    hitBoxBottom = 0;


    /**
     * Applies gravity to the object, updating its vertical position each frame.
     * @param {number} groundLevel - The Y-coordinate representing the ground level
     */
    applyGravity(groundLevel) {
        const gravityCallback = () => {
            if (this.isAboveGround(groundLevel)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = groundLevel;
                this.speedY = 0;
            }
        };
        const intervalId = setInterval(gravityCallback, 1000 / 60);
        GlobalIntervalManager.register(intervalId, 'applyGravity', this, 1000 / 60, gravityCallback);
    }

    /**
     * Checks whether the object is above the ground level.
     * @param {number} groundLevel - The Y-coordinate representing the ground level
     * @returns {boolean} True if the object is above ground
     */
    isAboveGround(groundLevel) {
        return (this.y - this.speedY) < groundLevel;
    }

    /**
     * Checks whether this object's hitbox overlaps with another movable object's hitbox.
     * @param {MovableObjects} mo - The other movable object to check collision against
     * @returns {boolean} True if the two objects are colliding
     */
    isColliding(mo) {
        return (this.x + this.hitBoxLeft + this.width - this.hitBoxRight) > (mo.x + mo.hitBoxLeft) &&
            (this.y + this.hitBoxTop + this.height - this.hitBoxBottom) > (mo.y + mo.hitBoxTop) &&
            (this.x + this.hitBoxLeft) < (mo.x + mo.hitBoxLeft + mo.width - mo.hitBoxRight) &&
            (this.y + this.hitBoxTop) < (mo.y + mo.hitBoxTop + mo.height - mo.hitBoxBottom);
    }

    /**
     * Reduces energy by 10 and records the hit timestamp.
     * Plays the hurt sound effect when called on a Character instance.
     */
    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;

        } else {
            this.lastHit = new Date().getTime();
            if (this.world && this.world.soundManager && this instanceof Character) {
                this.world.soundManager.play('characterHurt');
            }
        }
    }

    /**
     * Checks whether the object is currently in a hurt state.
     * @returns {boolean} True if less than 1 second has passed since the last hit
     */
    isHurt() {
        let timeSinceLastHit = new Date().getTime() - this.lastHit;
        timeSinceLastHit = timeSinceLastHit / 1000;
        return timeSinceLastHit < 1;
    }

    /**
     * Checks whether the object has no remaining energy.
     * @returns {boolean} True if energy is zero
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Cycles through an array of image paths to animate the object.
     * @param {string[]} arr - Array of image paths for the animation sequence
     */
    playAnimation(arr) {
        let i = this.currentImage % arr.length;
        let path = arr[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right within the specified boundary.
     * @param {boolean} [directionState=false] - Whether the object is facing the opposite direction
     * @param {number} [speed=this.speed] - Movement speed in pixels per frame
     * @param {number} [boundary=levelEnd] - Right boundary the object cannot cross
     */
    moveRight(directionState = false, speed = this.speed, boundary = levelEnd) {
        if (this.x + this.width < boundary) {
            this.x += speed;
        }
        this.otherDirection = directionState;
    }

    /**
     * Moves the object to the left within the specified boundary.
     * @param {boolean} [directionState=false] - Whether the object is facing the opposite direction
     * @param {number} [speed=this.speed] - Movement speed in pixels per frame
     * @param {number} [boundary=levelStart] - Left boundary the object cannot cross
     */
    moveLeft(directionState = false, speed = this.speed, boundary = levelStart) {
        if (this.x > boundary) {
            this.x -= speed;
        }
        this.otherDirection = directionState;
    }

    /**
     * Initiates a jump by setting the vertical speed and playing the jump sound.
     * @param {number} [speed=8] - Initial upward speed for the jump
     */
    jump(speed = 8) {
        this.speedY = speed;
        this.world.soundManager.play('characterJump');

    }
}
