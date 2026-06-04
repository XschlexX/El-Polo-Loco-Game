/**
 * Represents a collectable salsa bottle that can be picked up by the player.
 * Extends {@link CollectableObject} with bottle-specific dimensions, hitbox offsets, and animation.
 */
class CollectableBottle extends CollectableObject {
    height = 60;
    width = this.height * 0.6;
    groundLevel = 430 - this.height;
    y = this.groundLevel;

    /** @type {number} Left collision offset in pixels */
    hitBoxLeft = 10;
    /** @type {number} Top collision offset in pixels */
    hitBoxTop = 10;
    hitBoxRight = 10 + this.hitBoxLeft;
    hitBoxBottom = 10 + this.hitBoxTop;

    /** @type {string[]} Image paths for the bottle animation frames */
    images = [
        'assets/img/6_salsa_bottle/1-1_salsa_bottle_on_ground.png',
        'assets/img/6_salsa_bottle/2-1_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new CollectableBottle at the given x position with a slightly randomized y offset.
     * Randomly reverses the animation frame order for visual variety, then loads images and starts the animation loop.
     * @param {number} x - The horizontal position of the bottle
     */
    constructor(x) {
        super();
        this.x = x;
        this.y = this.y + Math.random() * 40;

        if (Math.random() > 0.5) {
            this.images = [...this.images].reverse();
        }

        this.loadImage(this.images[0]);
        this.loadImages(this.images);

        this.animate(500, 1000);
    }
}
